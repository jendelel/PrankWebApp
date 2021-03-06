package cz.siret.prank.webapp.utils;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileNotFoundException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.stream.Collectors;

import cz.siret.prank.domain.loaders.LoaderParams;
import cz.siret.prank.domain.Protein;
import cz.siret.prank.geom.Atoms;
import cz.siret.prank.lib.ResidueNumberWrapper;
import cz.siret.prank.lib.utils.Utils;

public enum PrankUtils {
    INSTANCE;

    private final transient Logger logger = LoggerFactory.getLogger(getClass());

    public Set<ResidueNumberWrapper> getBindingSites(File pdbFile) {
        LoaderParams loaderParams = new LoaderParams();
        loaderParams.setIgnoreLigands(false);

        Protein p = Protein.load(pdbFile.getAbsolutePath(), loaderParams);
        Atoms bindingAtoms = p.getProteinAtoms().cutoutShell(p.getAllLigandAtoms(), 4.0);
        Set<ResidueNumberWrapper> res = bindingAtoms.getDistinctGroups().stream()
                .map(g -> new ResidueNumberWrapper(g.getResidueNumber()))
                .collect(Collectors.toSet());
        return res;
    }

    public void updateStatus(File fileToAnalyze, Path predictionDir, String status) {
        File statusFile = predictionDir.resolve(fileToAnalyze.getName().concat(".status")).toFile();
        try {
            String time = java.time.LocalDateTime.now().toString();
            Utils.INSTANCE.stringToFile(time.concat(": ").concat(status), statusFile, true, true);
        } catch (FileNotFoundException e) {
            logger.error("Could not write into status file.", e);
        }
    }
}
