package cz.siret.prank.webapp.utils;

import org.biojava.nbio.structure.Chain;
import org.biojava.nbio.structure.Structure;
import org.biojava.nbio.structure.io.PDBFileReader;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.zip.GZIPInputStream;

public class BioUtils {

    public static String pdbToFasta(File pdbFile) throws IOException {
        PDBFileReader pdbReader = new PDBFileReader();
        Structure structure;
        InputStream inputStream;
        if (pdbFile.getName().endsWith(".gz")) {
            inputStream = new GZIPInputStream(new FileInputStream(pdbFile));
        } else {
            inputStream = new FileInputStream(pdbFile);
        }
        structure = pdbReader.getStructure(inputStream);
        StringBuilder output = new StringBuilder();
        String header = ">" + structure.getPDBHeader().getIdCode() + ":";
        for (Chain chain : structure.getChains()) {
            // Print the header like this: >4X09:A
            output.append(header).append(chain.getChainID()).append('\n');
            // Print the chain sequence and wrap lines at 80 characters
            String seq = chain.getAtomSequence();
            for (int i = 0; i < seq.length(); i++) {
                if (i != 0 && i % 80 == 0) output.append('\n');
                output.append(seq.charAt(i));
            }
        }
        return  output.toString();
    }

}
