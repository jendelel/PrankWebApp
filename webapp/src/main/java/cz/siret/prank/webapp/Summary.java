package cz.siret.prank.webapp;

import com.google.gson.Gson;

import org.biojava.nbio.structure.Structure;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.Map;
import java.util.OptionalDouble;

import cz.siret.prank.geom.Atoms;
import cz.siret.prank.lib.ConservationScore;
import cz.siret.prank.lib.Pocket;
import cz.siret.prank.lib.utils.Utils;

public class Summary {
    private final transient Logger logger = LoggerFactory.getLogger(getClass());

    private String conservationOrigin = "unkonwn";
    private String pdbId = "unknown";
    private int numPockets = -1;
    private int numAtoms = -1;
    private double avgConservation = 0.0;

    public String getConservationOrigin() {
        return conservationOrigin;
    }

    public void setConservationOrigin(String conservationOrigin) {
        this.conservationOrigin = conservationOrigin;
    }

    public String getPdbId() {
        return pdbId;
    }

    public int getNumPockets() {
        return numPockets;
    }

    public void setNumPockets(Path csvFile) {
        try {
            try (InputStream in = Utils.INSTANCE.readFile(csvFile.toFile())) {
                this.numPockets = Pocket.parseCSVPrediction(in).size();
            }
        } catch (IOException e) {
            logger.error("Cannot load csv prediction file.", e);
        }
    }

    public int getNumAtoms() {
        return numAtoms;
    }

    public void setNumAtomsAndId(Structure protein) {
        this.numAtoms = Atoms.onlyProteinAtoms(protein).withoutHydrogens().getCount();
        try {
            this.pdbId = protein.getPDBCode();
        } catch (Exception ignored) {
        }
    }

    public double getAvgConservation() {
        return avgConservation;
    }

    public void setAvgConservation(Structure structure, Map<String, File> conservationFiles) throws IOException {
        ConservationScore scores = ConservationScore.fromFiles(structure, conservationFiles::get);
        OptionalDouble avgScore = scores.getScoreMap().entrySet().stream().mapToDouble
                (Map.Entry::getValue).average();
        if (!avgScore.isPresent()) {
            logger.error("Can't calculate average conservation score.");
            return;
        }
        this.avgConservation = avgScore.getAsDouble();
    }

    public String toJson() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }

    public static Summary fromJson(String json){
        return (new Gson()).fromJson(json, Summary.class);
    }
}
