package cz.siret.prank.webapp.rest;

import org.biojava.nbio.structure.Chain;
import org.biojava.nbio.structure.Structure;
import org.biojava.nbio.structure.io.PDBFileReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.GET;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import cz.siret.prank.lib.Pocket;
import cz.siret.prank.lib.Sequence;
import cz.siret.prank.lib.utils.Utils;
import cz.siret.prank.webapp.utils.AppSettings;
import cz.siret.prank.webapp.utils.DataGetter;

@ApplicationPath("/api")
@javax.ws.rs.Path("/{type}/")
public class RestAPI extends Application {

    private final transient Logger logger = LoggerFactory.getLogger(getClass());

    @GET
    @javax.ws.rs.Path("pdb/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    public StreamingOutput streamPdbFile(@PathParam("type") String inputType,
                                         @PathParam("id") String id) {
        return outputStream -> {
            Path path = (new DataGetter(inputType, id)).pdbFile();
            try (InputStream in = Utils.readFile(path.toFile())) {
                Utils.copyStream(in, outputStream);
            }
            outputStream.close();
        };
    }


    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @javax.ws.rs.Path("/seq/{id}")
    public Sequence streamSequence(@PathParam("type") String inputType,
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
        Path path = (new DataGetter(inputType, id)).pdbFile();
        try (InputStream fis = Utils.readFile(path.toFile())) {
            try {
                structure = pdbReader.getStructure(fis);
                Chain chain = structure.getChains().get(0);
                Sequence res = Sequence.fromChain(chain);

                File conservationFile = new File(conservPath.toAbsolutePath().toString());
                if (conservationFile.exists()) {
                    try (InputStream inputStream = Utils.readFile(conservationFile)) {
                        String conservation = Utils.convertStreamToString(inputStream);
                        String[] scores = conservation.split(",");
                        res.setScores(Arrays.stream(scores)
                                .mapToDouble((String s) -> Double.parseDouble(s))
                                .toArray());
                    }
                }
                return res;

            } catch (IOException e) {
                logger.error("Cannot load pdb file.", e);
            }
        }
        return null;
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @javax.ws.rs.Path("/csv/{id}")
    public List<Pocket> streamCsvFile(@PathParam("type") String inputType,
                                      @PathParam("id") String id) {
        Path path = (new DataGetter(inputType, id)).csvFile();
        try {
            try (InputStream in = Utils.readFile(path.toFile())) {
                return Pocket.parseCSVPrediction(in);
            }
        } catch (IOException e) {
            logger.error("Cannot load prediction file.", e);
        }
        return null;
    }

    private void addFile(ZipOutputStream zipStream, File f, String fileName) throws IOException {
        if (f.exists()) {
            zipStream.putNextEntry(new ZipEntry(fileName));
            try (InputStream inputStream = Utils.readFile(f)) {
                Utils.copyStream(inputStream, zipStream);
            }
            zipStream.closeEntry();
        }
    }

    private String removeGzipExt(String fileName) {
        if (fileName.endsWith(".gz"))
            return fileName.substring(0, fileName.length()-3);
        return fileName;
    }

    @GET
    @Produces({MediaType.APPLICATION_OCTET_STREAM})
    @javax.ws.rs.Path("/all/{id}")
    public Response downloadAll(@PathParam("type") String inputType,
                                @PathParam("id") String id) {
        return Response.ok((StreamingOutput) outputStream -> {
            ZipOutputStream zip = new ZipOutputStream(outputStream);
            DataGetter data = new DataGetter(inputType, id);
            // Original pdb file.
            addFile(zip, data.pdbFile().toFile(), "protein_"+id+".pdb");
            // P2Rank prediction file.
            addFile(zip, data.csvFile().toFile(), "predictions_" + id + ".csv");
            // Conservation files
            for (final Path f : data.conservationFiles()) {
                addFile(zip, f.toFile(), "cs_" + removeGzipExt(f.toString()));
            }
            // TODO: MSA file

            // TODO: PyMol visualization

        }).header("Content-Disposition", "attachment; filename=\"prankweb_" + id + ".zip\"")
                .build();
    }
}

