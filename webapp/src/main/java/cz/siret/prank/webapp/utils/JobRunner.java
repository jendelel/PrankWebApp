package cz.siret.prank.webapp.utils;

import org.biojava.nbio.structure.Structure;
import org.biojava.nbio.structure.StructureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

import cz.siret.prank.domain.Dataset;
import cz.siret.prank.features.api.ProcessedItemContext;
import cz.siret.prank.lib.ConservationScore;
import cz.siret.prank.lib.ExternalTools;
import cz.siret.prank.lib.utils.BioUtils;
import cz.siret.prank.lib.utils.Tuple;
import cz.siret.prank.lib.utils.Tuple2;
import cz.siret.prank.lib.utils.Utils;
import cz.siret.prank.program.api.PrankFacade;
import cz.siret.prank.program.api.PrankPredictor;
import cz.siret.prank.program.params.Params;
import cz.siret.prank.webapp.Summary;

public enum JobRunner {
    INSTANCE;

    private final transient Logger logger = LoggerFactory.getLogger(getClass());

    private ThreadPoolExecutor workQueue;
    private PrankPredictor prankPredictor;
    private ExternalTools externalTools;

    /* P2Rank params*/
    private String model;
    private List<String> extra_features;
    private List<String> atom_table_features;
    private List<String> residue_table_features;

    JobRunner() {
        int corePoolSize = AppSettings.INSTANCE.getCorePoolSize();
        int maxPoolSize = AppSettings.INSTANCE.getMaxPoolSize();
        int queueSize = AppSettings.INSTANCE.getQueueSize();
        workQueue = new ThreadPoolExecutor(corePoolSize, maxPoolSize, 10,
                TimeUnit.SECONDS, new ArrayBlockingQueue<>(queueSize));
        prankPredictor = PrankFacade.createPredictor(
                Paths.get(AppSettings.INSTANCE.getPrankPath()));
        prankPredictor.getParams().setZip_visualizations(true);
        copyP2RankParams();


        externalTools = new ExternalTools(AppSettings.INSTANCE.getHsspToFastaScriptPath(),
                AppSettings.INSTANCE.getMsaToConservationScriptPath(),
                AppSettings.INSTANCE.getHsspDir());
    }

    private void copyP2RankParams() {
        Params p = prankPredictor.getParams();
        model = p.getModel();
        atom_table_features = new ArrayList<>(p.getAtom_table_features());
        residue_table_features = new ArrayList<>(p.getResidue_table_features());
        extra_features = new ArrayList<>(p.getExtra_features());
    }

    private void setupP2Rank(boolean conservation) {
        if (conservation) {
            prankPredictor.getParams().setModel("conservation.model");
            prankPredictor.getParams().setResidue_table_features(new ArrayList<>());
            prankPredictor.getParams().setAtom_table_features(Arrays.asList
                    ("apRawValids", "apRawInvalids", "atomicHydrophobicity"));
            prankPredictor.getParams().setExtra_features(Arrays.asList
                    ("chem", "volsite", "protrusion", "bfactor", "conservation"));
        } else {
            prankPredictor.getParams().setModel(model);
            prankPredictor.getParams().setResidue_table_features(residue_table_features);
            prankPredictor.getParams().setAtom_table_features(atom_table_features);
            prankPredictor.getParams().setExtra_features(extra_features);
        }
    }

    public Map<String, Tuple2<File, File>> getConservationAndMSAs(Structure protein, String pdbId) throws IOException, InterruptedException, StructureException {
        Map<String, Tuple2<File, File>> result = new HashMap<>();
        if (pdbId == null || pdbId.isEmpty()) {
            pdbId = protein.getPDBCode();
        }
        if (pdbId != null && !pdbId.trim().isEmpty()) {
            logger.info("PDB known: {}, trying to get conservation from HSSP.", pdbId);
            result = externalTools.getConsevationAndMSAsFromHSSP(pdbId, protein);
        }
        if (result.size() == 0) {
            result = runPipeline(protein);
        }
        return result;
    }

    private Map<String, Tuple2<File,File>> runPipeline(Structure protein)
            throws IOException, InterruptedException, StructureException {
        // Check if the script even exists
        String script = AppSettings.INSTANCE.getConservationScriptPath();
        Map<String, Tuple2<File, File>> result = new HashMap<>();
        if (script != null) {
            File scriptFile = new File(script);
            if (scriptFile.exists()) {
                Map<String, String> chainToFasta = BioUtils.INSTANCE.pdbToFasta(protein, null);
                for (Map.Entry<String, String> chain : chainToFasta.entrySet()) {
                    // Create a FASTA file
                    File tempFastaFile = File.createTempFile("conservation", ".fasta");
                    File tempMsaFile = File.createTempFile("msa", ".fasta");
                    File tempConservationFile = File.createTempFile("conservation", ".hom");
                    Utils.INSTANCE.stringToFile(chain.getValue(), tempFastaFile, false, false);
                    logger.info("Running pipeline script {} {} {}", scriptFile.getAbsolutePath(), tempFastaFile.getAbsolutePath(), tempMsaFile.getAbsolutePath());
                    ProcessBuilder processBuilder = new ProcessBuilder(scriptFile.getAbsolutePath(),
                            tempFastaFile.getAbsolutePath()/*, tempMsaFile.getAbsolutePath()*/);
                    processBuilder.directory(scriptFile.getParentFile());
                    processBuilder.redirectOutput(tempConservationFile);
                    Process process = processBuilder.start();
                    int exitCode = process.waitFor();
                    logger.info("Conservation pipeline finished with exit code: {}", exitCode);
                    logger.info("Conservation and MSA calculates: {}, {}",
                            tempMsaFile.getAbsolutePath(),
                            tempConservationFile.getAbsolutePath());
                    result.put(chain.getKey(), Tuple.create(tempMsaFile, tempConservationFile));
                    //tempFastaFile.delete();
                }
            }
        }
        return result;
    }

    public void runPrediction(File fileToAnalyze, Path outDir,
                              String pdbId, boolean runConservation) {
        workQueue.execute(() -> {
            Summary summary = new Summary();
            try {
                Map<String, Tuple2<File, File>> msaAndConservationForChain = null;
                PrankUtils.INSTANCE.updateStatus(fileToAnalyze, outDir, "Job started.");
                String conservationPattern = "";
                if (runConservation) {
                    try {
                        PrankUtils.INSTANCE.updateStatus(fileToAnalyze, outDir,
                                "Getting conservation.");
                        String baseName = BioUtils.INSTANCE.removePdbExtension(fileToAnalyze.getName()).getItem1();
                        conservationPattern = BioUtils.CONSERVATION_FILENAME_PATTERN.replaceFirst
                                ("%baseDir", baseName).replaceFirst("%ext", "hom.gz");

                        msaAndConservationForChain = BioUtils.INSTANCE.copyAndGzipConservationAndMSAsToDir(
                                getConservationAndMSAs(BioUtils.INSTANCE.loadPdbFile
                                        (fileToAnalyze), pdbId),
                                baseName, outDir);
                    } catch (IOException | InterruptedException | StructureException e) {
                        logger.error("Failed to run conservation script.", e);
                    }
                }

                ProcessedItemContext itemContext = null;
                if (msaAndConservationForChain != null && msaAndConservationForChain.size() > 0) {
                    logger.info(msaAndConservationForChain.toString());
                    Map<String, String> colValues = new HashMap<>();
                    colValues.put(Dataset.getCOLUMN_CONSERVATION_FILES_PATTERN(),
                            conservationPattern);
                    itemContext = new ProcessedItemContext(colValues);
                    setupP2Rank(true);
                } else {
                    setupP2Rank(false);
                }

                PrankUtils.INSTANCE.updateStatus(fileToAnalyze, outDir, "Running P2Rank for pocket " +
                        "detection.");
                prankPredictor.runPrediction(fileToAnalyze.toPath(),
                        outDir, itemContext);
                PrankUtils.INSTANCE.updateStatus(fileToAnalyze, outDir, "Finished.");
            } catch (Exception e) {
                logger.error("Failed to run P2Rrank", e);
                PrankUtils.INSTANCE.updateStatus(fileToAnalyze, outDir,
                        "ERROR: Failed to run prediction.".concat(e.toString()));
            }
        });
    }

    public void runPrediction(File fileToAnalyze, Path outDir, Map<String, File> MSAs) throws
            IOException,
            InterruptedException {
        try {
            Summary summary = new Summary();
            summary.setConservationOrigin("userMSA");
            PrankUtils.INSTANCE.updateStatus(fileToAnalyze, outDir, "Job started.");
            String baseName = BioUtils.INSTANCE.removePdbExtension(fileToAnalyze.getName()).getItem1();

            Map<String, Tuple2<File, File>> msaAndConservationForChain = new HashMap<>();
            Map<String, File> scores = externalTools.getConservationFromMSAs(MSAs);
            PrankUtils.INSTANCE.updateStatus(fileToAnalyze, outDir, "Matching MSAs.");
            Map<String, String> chainMatching = ConservationScore.pickScores(
                    BioUtils.INSTANCE.loadPdbFile(fileToAnalyze), scores);
            for (Map.Entry<String, String> chainMatch : chainMatching.entrySet()) {
                logger.info("Chains matched. {}->{}", chainMatch.getKey(), chainMatch.getValue());
                msaAndConservationForChain.put(chainMatch.getKey(), Tuple.create(
                        MSAs.get(chainMatch.getValue()), scores.get(chainMatch.getValue())));
            }
            logger.info(msaAndConservationForChain.toString());
            Map<String, Tuple2<File, File>> conservationAndMsas =
                    BioUtils.INSTANCE.copyAndGzipConservationAndMSAsToDir(
                            msaAndConservationForChain, baseName,
                            outDir);
            String conservationPattern = BioUtils.CONSERVATION_FILENAME_PATTERN.replaceFirst
                    ("%baseDir", baseName).replaceFirst("%ext", "hom.gz");

            ProcessedItemContext itemContext = null;
            if (conservationAndMsas != null && conservationAndMsas.size() > 0) {
                Map<String, String> colValues = new HashMap<>();
                colValues.put(Dataset.getCOLUMN_CONSERVATION_FILES_PATTERN(), conservationPattern);
                itemContext = new ProcessedItemContext(colValues);
                setupP2Rank(true);
            } else {
                setupP2Rank(false);
            }

            PrankUtils.INSTANCE.updateStatus(fileToAnalyze, outDir,
                    "Running P2Rank for pocket detection.");
            prankPredictor.runPrediction(fileToAnalyze.toPath(), outDir, itemContext);
            PrankUtils.INSTANCE.saveSummary(summary, fileToAnalyze, outDir);
            PrankUtils.INSTANCE.updateStatus(fileToAnalyze, outDir, "Finished.");
        } catch (Exception e) {
            logger.error("Failed to run P2Rrank", e);
            PrankUtils.INSTANCE.updateStatus(fileToAnalyze, outDir,
                    "ERROR: Failed to run prediction.".concat(e.toString()));
        }
    }
}
