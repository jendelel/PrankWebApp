package cz.siret.prank.webapp.rest;

import org.biojava.nbio.structure.Chain;
import org.biojava.nbio.structure.Structure;
import org.biojava.nbio.structure.io.PDBFileReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.zip.GZIPInputStream;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.GET;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.StreamingOutput;

import cz.siret.prank.webapp.utils.AppSettings;
import cz.siret.prank.webapp.utils.Utils;

@ApplicationPath("/api")
@javax.ws.rs.Path("/{type}/")
public class RestAPI extends Application {

    private final transient Logger logger = LoggerFactory.getLogger(getClass());

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
            InputStream in = new GZIPInputStream(new FileInputStream(path.toString()));
            Utils.copyStream(in, outputStream);
            outputStream.close();
        };
    }


    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @javax.ws.rs.Path("/seq/{id}")
    public String streamSequence(@PathParam("type") String inputType,
                                 @PathParam("id") String id) throws IOException {
        PDBFileReader pdbReader = new PDBFileReader();
        Structure structure;
        Path path = getPdbFilePath(inputType, id);
        GZIPInputStream fis = new GZIPInputStream(new FileInputStream(path.toString()));
        StringBuilder res = new StringBuilder();
        try {
            structure = pdbReader.getStructure(fis);
            for (Chain chain : structure.getChains()) {
                res.append(chain.getAtomSequence() + "\n");
            }
            return res.toString();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "Error occurred";
    }


    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @javax.ws.rs.Path("/mmcif/{id}")
    public String streamMMCIFile(@PathParam("type") String inputType,
                                 @PathParam("id") String id) throws IOException {
        PDBFileReader pdbReader = new PDBFileReader();
        Structure structure;
        Path path = getPdbFilePath(inputType, id);
        GZIPInputStream fis = new GZIPInputStream(new FileInputStream(path.toString()));
        try {
            structure = pdbReader.getStructure(fis);
            String header = "data_" + structure.getPDBHeader().getIdCode();
            String mmcif = structure.toMMCIF();
            return header + mmcif.substring(mmcif.indexOf('\n'));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "Error occurred";
    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @javax.ws.rs.Path("/csv/{id}")
    public StreamingOutput streamCsvFile(@PathParam("type") String inputType,
                                         @PathParam("id") String id) {
        return outputStream -> {
            Path path;
            if (inputType.equals("id")) {
                path = Paths.get(AppSettings.INSTANCE.getCsvDataPath(),
                        String.format("pdb%s.ent.gz_predictions.csv", id));
            } else {
                path = Paths.get(AppSettings.INSTANCE.getPredictionDir(),
                        String.format("%s_predictions.csv", id));
            }

            InputStream in = new FileInputStream(path.toString());
            Utils.copyStream(in, outputStream);
            outputStream.close();
        };
    }
}

