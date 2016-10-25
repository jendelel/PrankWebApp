package org.wildfly.swarm.examples.gradle;

import org.biojava.nbio.structure.Structure;
import org.biojava.nbio.structure.io.PDBFileReader;

import javax.ws.rs.GET;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.StreamingOutput;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.zip.GZIPInputStream;

@javax.ws.rs.Path("/")
public class RestAPI {

    @GET
    @javax.ws.rs.Path("pdb/{pdbid}")
    @Produces(MediaType.TEXT_PLAIN)
    public StreamingOutput streamPdbFile(@PathParam("pdbid") String pdbId) {
        return outputStream -> {
            Path path = Paths.get(Utils.GetPdbDataPath(), String.format("pdb%s.ent.gz", pdbId));
            InputStream in = new GZIPInputStream(new FileInputStream(path.toString()));
            Utils.copyStream(in, outputStream);
            outputStream.close();
        };
    }


    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @javax.ws.rs.Path("/mmcif/{pdbid}")
    public String streamMMCIFile(@PathParam("pdbid") String pdbId) throws IOException {
        PDBFileReader pdbReader = new PDBFileReader();
        Structure structure = null;
        Path path = Paths.get(Utils.GetPdbDataPath(), String.format("pdb%s.ent.gz", pdbId));
        GZIPInputStream fis = new GZIPInputStream(new FileInputStream(path.toString()));
        try {
            structure = pdbReader.getStructure(fis);
            System.out.println(structure.toMMCIF());
            return structure.toMMCIF();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "Error occurred";
    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @javax.ws.rs.Path("/csv/{pdbid}")
    public StreamingOutput streamCsvFile(@PathParam("pdbid") String pdbId) {
        return outputStream -> {
            Path path = Paths.get(Utils.GetCsvDataPath(), String.format("pdb%s.ent.gz_predictions.csv", pdbId));
            InputStream in = new FileInputStream(path.toString());
            Utils.copyStream(in, outputStream);
            outputStream.close();
        };
    }
}

