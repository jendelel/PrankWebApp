package cz.siret.prank.webapp.utils;

import org.biojava.nbio.structure.Structure;
import org.biojava.nbio.structure.StructureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

import cz.siret.prank.lib.ConservationScore;
import cz.siret.prank.lib.ExternalTools;
import cz.siret.prank.lib.utils.BioUtils;
import cz.siret.prank.lib.utils.Tuple;
import cz.siret.prank.lib.utils.Tuple2;
import cz.siret.prank.lib.utils.Utils;
import cz.siret.prank.program.api.PrankFacade;
import cz.siret.prank.program.api.PrankPredictor;

public enum JobRunner {
    INSTANCE;

    private final transient Logger logger = LoggerFactory.getLogger(getClass());

    private ThreadPoolExecutor workQueue;
    private PrankPredictor prankPredictor;
    private ExternalTools externalTools;

    JobRunner() {
        int corePoolSize = AppSettings.INSTANCE.getCorePoolSize();
        int maxPoolSize = AppSettings.INSTANCE.getMaxPoolSize();
        int queueSize = AppSettings.INSTANCE.getQueueSize();
        workQueue = new ThreadPoolExecutor(corePoolSize, maxPoolSize, 10,
                TimeUnit.SECONDS, new ArrayBlockingQueue<>(queueSize));
        prankPredictor = PrankFacade.createPredictor(
                Paths.get(AppSettings.INSTANCE.getPrankPath()));
        prankPredictor.getParams().setZip_visualizations(true);
        externalTools = new ExternalTools(AppSettings.INSTANCE.getHsspToFastaScriptPath(),
                AppSettings.INSTANCE.getMsaToConservationScriptPath(),
                AppSettings.INSTANCE.getHsspDir());
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
                    Utils.INSTANCE.stringToFile(chain.getValue(), tempFastaFile);
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


    public void runPrediction(File fileToAnalyze, String pdbId, boolean runConservation) {
        workQueue.execute(() -> {
            Map<String, Tuple2<File, File>> msaAndConservationForChain = null;
            if (runConservation) {
                try {
                    String baseName = BioUtils.INSTANCE.removePdbExtension(fileToAnalyze.getName()).getItem1();
                    msaAndConservationForChain = BioUtils.INSTANCE.copyAndGzipConservationAndMSAsToDir(
                            getConservationAndMSAs(BioUtils.INSTANCE.loadPdbFile(fileToAnalyze), pdbId),
                            baseName, Paths.get(AppSettings.INSTANCE.getPredictionDir()));
                } catch (IOException | InterruptedException | StructureException e) {
                    logger.error("Failed to run conservation script.", e);
                }
            }

            Function<String, File> conservationPathForChain = null;
            if (msaAndConservationForChain != null)  {
                Map<String, Tuple2<File, File>> finalMsaAndConservationForChain =
                        msaAndConservationForChain;
                conservationPathForChain = (chainId) ->
                        finalMsaAndConservationForChain.getOrDefault(chainId,
                        Tuple.create(null, null)).getItem2();
            }
            prankPredictor.runPrediction(fileToAnalyze.toPath(), conservationPathForChain,
                    Paths.get(AppSettings.INSTANCE.getPredictionDir()));
        });
    }

    public void runPrediction(File tempFile, Map<String, File> MSAs) throws IOException,
            InterruptedException {
        Map<String, Tuple2<File, File>> msaAndConservationForChain = new HashMap<>();
        Map<String, File> scores = externalTools.getConservationFromMSAs(MSAs);
        Map<String, String> chainMatching = ConservationScore.pickScores(BioUtils.INSTANCE
                        .loadPdbFile(tempFile), scores);
        for (Map.Entry<String, String> chainMatch : chainMatching.entrySet()) {
            logger.info("Chains matched. {}->{}", chainMatch.getKey(), chainMatch.getValue());
            msaAndConservationForChain.put(chainMatch.getKey(), Tuple.create(
                    MSAs.get(chainMatch.getValue()), scores.get(chainMatch.getValue())));
        }
        logger.info(msaAndConservationForChain.toString());

        Function<String, File> conservationPathForChain = null;
        if (msaAndConservationForChain.size() > 0)  {
            conservationPathForChain = (chainId) ->
                    msaAndConservationForChain.getOrDefault(chainId,
                            Tuple.create(null, null)).getItem2();
        }
        prankPredictor.runPrediction(tempFile.toPath(), conservationPathForChain,
                Paths.get(AppSettings.INSTANCE.getPredictionDir()));
    }
}
