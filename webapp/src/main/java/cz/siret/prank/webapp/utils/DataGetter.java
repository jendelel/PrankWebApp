package cz.siret.prank.webapp.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FilenameFilter;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class DataGetter {
    private String inputType;
    private String inputId;

    private final transient Logger logger = LoggerFactory.getLogger(getClass());

    public DataGetter(String inputType, String inputId) {
        this.inputId = inputId;
        this.inputType = inputType;
    }

    public Path pdbFile() {
        if (inputType.equals("id")) {
            return Paths.get(AppSettings.INSTANCE.getPdbDataPath(),
                    String.format("pdb%s.ent.gz", inputId));
        } else {
            return Paths.get(AppSettings.INSTANCE.getUploadsDir(), inputId.concat(".pdb.gz"));
        }
    }

    public Path csvFile() {
        return inputType.equals("id") ?
                Paths.get(AppSettings.INSTANCE.getCsvDataPath(),
                        String.format("pdb%s.ent.gz_predictions.csv", inputId)) :
                Paths.get(AppSettings.INSTANCE.getPredictionDir(),
                        String.format("%s.pdb.gz_predictions.csv", inputId));
    }

    public Map<String, File> conservationOrMsaFiles(String extension) {
        File conservationDir;
        FilenameFilter filter;
        if (inputType.equals("id")) {
            conservationDir = Paths.get(AppSettings.INSTANCE.getCsvDataPath()).toFile();
            filter = (dir, name) ->
                    (name.startsWith("pdb" + inputId) && name.endsWith(extension));
        } else {
            conservationDir = Paths.get(AppSettings.INSTANCE.getPredictionDir()).toFile();
            logger.info("dir: {}, inputId: {}, extension: {}", conservationDir.getAbsolutePath(),
                    inputId, extension);
            filter = (dir, name) -> (name.startsWith(inputId) && name.endsWith(extension));
        }
        File[] files = conservationDir.listFiles(filter);
        Arrays.stream(files).forEach(f->logger.info(f.getAbsolutePath()));
        if (files != null) {
            try {
                return Arrays.stream(files).collect(Collectors.toMap((File file) -> {
                    String fileName = file.getName();
                    String baseName = fileName.replaceFirst("(\\.fasta\\.gz|\\.hom\\.gz)$", "");
                    return baseName.substring(baseName.length() - 1, baseName.length());
                }, Function.identity()));
            } catch (Exception e) {
                e.printStackTrace();
                return  new HashMap<>();
            }
        } else {
            return new HashMap<>();
        }
    }

    public Map<String, File> msaFiles() {
        return conservationOrMsaFiles(".fasta.gz");
    }

    public Map<String, File> conservationFiles() {
        return conservationOrMsaFiles(".hom.gz");
    }

    public Path statusFile() {
        assert inputType.equals("id");
        String fileName = pdbFile().toFile().getName().concat(".status");
        return csvFile().getParent().resolve(fileName);
    }

    public Path visualizationZip() {
        Path predictionDir;
        if (inputType.equals("id")) {
            predictionDir = Paths.get(AppSettings.INSTANCE.getCsvDataPath(), "visualizations");
        } else {
            predictionDir = Paths.get(AppSettings.INSTANCE.getPredictionDir(), "visualizations");
        }
        String pdbFileName = pdbFile().getFileName().toString();
        return predictionDir.resolve(pdbFileName.concat("_visualization.zip"));
    }

}
