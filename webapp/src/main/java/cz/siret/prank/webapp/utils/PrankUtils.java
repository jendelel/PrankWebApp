package cz.siret.prank.webapp.utils;


import java.io.File;
import java.util.Set;
import java.util.stream.Collectors;

import cz.siret.prank.domain.Protein;
import cz.siret.prank.geom.Atoms;
import cz.siret.prank.lib.ResidueNumberWrapper;

public class PrankUtils {

    public static Set<ResidueNumberWrapper> getBindingSites(File pdbFile) {
        Protein p = Protein.load(pdbFile.getAbsolutePath());
        Atoms bindingAtoms = p.getProteinAtoms().cutoffAtoms(p.getAllLigandAtoms(), 4);
        return bindingAtoms.getDistinctGroups().stream()
                .map(g -> new ResidueNumberWrapper(g.getResidueNumber()))
                .collect(Collectors.toSet());
    }
}
