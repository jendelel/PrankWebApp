package cz.siret.prank.webapp.utils;

import java.io.File;
import java.io.FilenameFilter;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class DataGetter {
    private String inputType;
    private String inputId;

    public DataGetter(String inputType, String inputId) {
        this.inputId = inputId;
        this.inputType = inputType;
    }

    public Path pdbFile() {
        if (inputType.equals("id")) {
            return Paths.get(AppSettings.INSTANCE.getPdbDataPath(),
                    String.format("pdb%s.ent.gz", inputId));
        } else {
            return Paths.get(AppSettings.INSTANCE.getUploadsDir(), inputId);
        }
    }

    public Path csvFile() {
        return inputType.equals("id") ?
                Paths.get(AppSettings.INSTANCE.getCsvDataPath(),
                        String.format("pdb%s.ent.gz_predictions.csv", inputId)) :
                Paths.get(AppSettings.INSTANCE.getPredictionDir(),
                        String.format("%s_predictions.csv", inputId));
    }

    public List<Path> conservationFiles() {
        File conservationDir;
        FilenameFilter filter;
        if (inputType.equals("id")) {
            conservationDir = Paths.get(AppSettings.INSTANCE.getCsvDataPath()).toFile();
            filter = (dir, name) ->
                    (name.startsWith("pdb" + inputId) && name.endsWith(".ent.gz.hom.gz"));
        } else {
            conservationDir = Paths.get(AppSettings.INSTANCE.getPredictionDir()).toFile();
            filter = (dir, name) -> (name.startsWith(inputId) && name.endsWith(".hom.gz"));
        }
        File[] files = conservationDir.listFiles(filter);
        if (files != null) {
            return Arrays.stream(files).map(file -> Paths.get(file.getAbsolutePath()))
                    .collect(Collectors.toList());
        } else {
            return new ArrayList<>();
        }
    }


}
