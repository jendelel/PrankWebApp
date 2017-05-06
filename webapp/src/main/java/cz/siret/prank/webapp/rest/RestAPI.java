package cz.siret.prank.webapp.rest;

import org.biojava.nbio.structure.Structure;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
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

import cz.siret.prank.lib.ConservationScore;
import cz.siret.prank.lib.Pocket;
import cz.siret.prank.lib.Sequence;
import cz.siret.prank.lib.utils.BioUtils;
import cz.siret.prank.lib.utils.Utils;
import cz.siret.prank.webapp.utils.DataGetter;
import cz.siret.prank.webapp.utils.PrankUtils;

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
            try (InputStream in = Utils.INSTANCE.readFile(path.toFile())) {
                Utils.INSTANCE.copyStream(in, outputStream);
            }
            outputStream.close();
        };
    }


    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @javax.ws.rs.Path("/seq/{id}")
    public Sequence streamSequence(@PathParam("type") String inputType,
                                   @PathParam("id") String id) throws IOException {
        DataGetter data = new DataGetter(inputType, id);
        Path path = data.pdbFile();
        Structure structure = BioUtils.INSTANCE.loadPdbFile(path.toFile());
        Map<String, File> scoresFiles = data.conservationFiles();
        ConservationScore scores = ConservationScore.fromFiles(structure, scoresFiles::get);
        return Sequence.fromStructure(structure, scores, PrankUtils.getBindingSites(path.toFile()));
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @javax.ws.rs.Path("/csv/{id}")
    public List<Pocket> streamCsvFile(@PathParam("type") String inputType,
                                      @PathParam("id") String id) {
        Path path = (new DataGetter(inputType, id)).csvFile();
        try {
            try (InputStream in = Utils.INSTANCE.readFile(path.toFile())) {
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
            try (InputStream inputStream = Utils.INSTANCE.readFile(f)) {
                Utils.INSTANCE.copyStream(inputStream, zipStream);
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
            for (final Map.Entry<String,File> e  : data.conservationFiles().entrySet()) {
                addFile(zip, e.getValue(), "cs_".concat(e.getKey()).concat(".hom"));
            }
            // MSA files
            for (final Map.Entry<String, File> e : data.msaFiles().entrySet()) {
                addFile(zip, e.getValue(), "cs_".concat(e.getKey()).concat(".fasta"));
            }
            // PyMol visualization
            Utils.INSTANCE.packZipArchive(zip, data.visualizationZip().toFile(), "visualization");

            zip.close();
        }).header("Content-Disposition", "attachment; filename=\"prankweb_" + id + ".zip\"")
                .build();
    }
}

