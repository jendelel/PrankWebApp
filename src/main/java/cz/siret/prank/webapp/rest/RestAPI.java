package cz.siret.prank.webapp.rest;

import org.biojava.nbio.structure.Chain;
import org.biojava.nbio.structure.Group;
import org.biojava.nbio.structure.GroupType;
import org.biojava.nbio.structure.Structure;
import org.biojava.nbio.structure.io.PDBFileReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.zip.GZIPInputStream;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.GET;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.StreamingOutput;

import cz.siret.prank.webapp.utils.AppSettings;
import cz.siret.prank.webapp.utils.PrankUtils;
import cz.siret.prank.webapp.utils.Utils;

@ApplicationPath("/api")
@javax.ws.rs.Path("/{type}/")
public class RestAPI extends Application {

    private final transient Logger logger = LoggerFactory.getLogger(getClass());

    public static class RestSequenceResponse implements Serializable {
        Integer[] indices;
        String[] seq;
        Float[] scores;

        public String[] getSeq() {
            return seq;
        }

        public void setSeq(String[] seq) {
            this.seq = seq;
        }

        public Float[] getScores() {
            return scores;
        }

        public void setScores(Float[] scores) {
            this.scores = scores;
        }

        public Integer[] getIndices() {
            return indices;
        }

        public void setIndices(Integer[] indices) {
            this.indices = indices;
        }
    }

    private RestSequenceResponse chainToSeqResponse(Chain chain) {
        List<Integer> indices = new ArrayList<>();
        List<String> seq = new ArrayList<>();

        for (Group group : chain.getAtomGroups(GroupType.AMINOACID)) {
            String c = group.getChemComp().getOne_letter_code();
            if (!c.equals("?")) {
                seq.add(c);
                indices.add(group.getResidueNumber().getSeqNum());
            }
        }
        RestSequenceResponse res = new RestSequenceResponse();
        res.indices = indices.stream().toArray(Integer[]::new);
        res.seq = seq.stream().toArray(String[]::new);
        return res;
    }

    private Path getPdbFilePath(String inputType, String id) {
        if (inputType.equals("id")) {
            return Paths.get(AppSettings.INSTANCE.getPdbDataPath(),
                    String.format("pdb%s.ent.gz", id));
        } else {
            return Paths.get(AppSettings.INSTANCE.getUploadsDir(), id);
        }
    }


    @GET
    @javax.ws.rs.Path("pdb/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    public StreamingOutput streamPdbFile(@PathParam("type") String inputType,
                                         @PathParam("id") String id) {
        return outputStream -> {
            Path path = getPdbFilePath(inputType, id);
            try (InputStream in = new GZIPInputStream(new FileInputStream(path.toString()))) {
                Utils.copyStream(in, outputStream);
            }
            outputStream.close();
        };
    }


    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @javax.ws.rs.Path("/seq/{id}")
    public RestSequenceResponse streamSequence(@PathParam("type") String inputType,
                                               @PathParam("id") String id) throws IOException {
        Path conservPath;
        if (inputType.equals("id")) {
            conservPath = Paths.get(AppSettings.INSTANCE.getCsvDataPath(),
                    String.format("pdb%s.ent.gz.hom.gz", id));
        } else {
            conservPath = Paths.get(AppSettings.INSTANCE.getPredictionDir(),
                    String.format("%s.hom.gz", id));
        }

        PDBFileReader pdbReader = new PDBFileReader();
        Structure structure;
        Path path = getPdbFilePath(inputType, id);
        try (GZIPInputStream fis = new GZIPInputStream(new FileInputStream(path.toString()))) {
            try {
                structure = pdbReader.getStructure(fis);
                Chain chain = structure.getChains().get(0);
                RestSequenceResponse res = chainToSeqResponse(chain);

                File conservationFile = new File(conservPath.toAbsolutePath().toString());
                if (conservationFile.exists()) {
                    try (InputStream inputStream = new GZIPInputStream(
                            new FileInputStream(conservationFile))) {
                        String conservation = Utils.convertStreamToString(inputStream);
                        String[] scores = conservation.split(",");
                        res.scores = Arrays.stream(scores)
                                .map((String s) -> Float.parseFloat(s))
                                .toArray(Float[]::new);
                    }
                }
                return res;

            } catch (IOException e) {
                logger.error("Cannot load pdb file.", e);
            }
        }
        return null;
    }


    @Deprecated
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @javax.ws.rs.Path("/mmcif/{id}")
    public String streamMMCIFile(@PathParam("type") String inputType,
                                 @PathParam("id") String id) throws IOException {
        PDBFileReader pdbReader = new PDBFileReader();
        Structure structure;
        Path path = getPdbFilePath(inputType, id);
        try (GZIPInputStream fis = new GZIPInputStream(new FileInputStream(path.toString()))) {
            try {
                structure = pdbReader.getStructure(fis);
                String header = "data_" + structure.getPDBHeader().getIdCode();
                String mmcif = structure.toMMCIF();
                return header + mmcif.substring(mmcif.indexOf('\n'));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return "Error occurred";
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @javax.ws.rs.Path("/csv/{id}")
    public List<PrankUtils.Pocket> streamCsvFile(@PathParam("type") String inputType,
                                                 @PathParam("id") String id) {
        Path path = inputType.equals("id") ?
                Paths.get(AppSettings.INSTANCE.getCsvDataPath(),
                        String.format("pdb%s.ent.gz_predictions.csv", id)) :
                Paths.get(AppSettings.INSTANCE.getPredictionDir(),
                        String.format("%s_predictions.csv", id));

        try {
            try (InputStream in = new FileInputStream(path.toString())) {
                return PrankUtils.parseCSVPrediction(in);
            }
        } catch (IOException e) {
            logger.error("Cannot load prediction file.", e);
        }
        return null;
    }
}

