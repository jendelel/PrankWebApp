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
        logger.info("Creaing new DataGetter with params: {}, {}", inputId, inputType);
    }

    public Path pdbFile() {
        if (inputType.equals("id") || inputType.equals("id_noconser")) {
            logger.info("Outputing path to pdb file: {}", Paths.get(AppSettings.INSTANCE
                            .getPdbDataPath(),
                    String.format("pdb%s_%s.ent.gz", inputType, inputId)).toString());

            return Paths.get(AppSettings.INSTANCE.getPdbDataPath(),
                    String.format("pdb%s_%s.ent.gz", inputType, inputId));
        } else {
            return Paths.get(AppSettings.INSTANCE.getUploadsDir(), inputId.concat(".pdb.gz"));
        }
    }

    public Path csvFile() {
        String csvDir = inputType.startsWith("id") ?
                AppSettings.INSTANCE.getCsvDataPath() :
                AppSettings.INSTANCE.getPredictionDir();
        String pdbFile = pdbFile().getFileName().toString();
        logger.info("Outputting path to csv file: {}", Paths.get(csvDir, String.format
                ("%s_predictions.csv", pdbFile)).toString());
        return Paths.get(csvDir, String.format("%s_predictions.csv", pdbFile));
    }

    public Map<String, File> conservationOrMsaFiles(String extension) {
        File conservationDir;
        FilenameFilter filter;
        if (inputType.equals("id")) {
            conservationDir = Paths.get(AppSettings.INSTANCE.getCsvDataPath()).toFile();
            filter = (dir, name) ->
                    (name.startsWith("pdb" + inputType + "_" + inputId) &&
                            name.endsWith(extension));
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
        assert inputType.startsWith("id");
        String fileName = pdbFile().toFile().getName().concat(".status");
        logger.info("Outputting path to csv file: {}", pdbFile().getParent().resolve(fileName)
                .toString());
        return csvFile().getParent().resolve(fileName);
    }

    public Path visualizationZip() {
        Path predictionDir;
        if (inputType.startsWith("id")) {
            predictionDir = Paths.get(AppSettings.INSTANCE.getCsvDataPath(), "visualizations");
        } else {
            predictionDir = Paths.get(AppSettings.INSTANCE.getPredictionDir(), "visualizations");
        }
        String pdbFileName = pdbFile().getFileName().toString();
        return predictionDir.resolve(pdbFileName.concat("_visualization.zip"));
    }

}
