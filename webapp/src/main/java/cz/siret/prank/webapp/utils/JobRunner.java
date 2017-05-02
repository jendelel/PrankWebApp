package cz.siret.prank.webapp.utils;

import org.biojava.nbio.structure.StructureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import cz.siret.prank.lib.utils.BioUtils;
import cz.siret.prank.lib.utils.Utils;
import cz.siret.prank.program.api.PrankFacade;
import cz.siret.prank.program.api.PrankPredictor;

public enum JobRunner {
    INSTANCE;

    private final transient Logger logger = LoggerFactory.getLogger(getClass());

    private ThreadPoolExecutor workQueue;
    private PrankPredictor prankPredictor;

    JobRunner() {
        int corePoolSize = AppSettings.INSTANCE.getCorePoolSize();
        int maxPoolSize = AppSettings.INSTANCE.getMaxPoolSize();
        int queueSize = AppSettings.INSTANCE.getQueueSize();
        workQueue = new ThreadPoolExecutor(corePoolSize, maxPoolSize, 10,
                TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(queueSize));
        prankPredictor = PrankFacade.createPredictor(
                Paths.get(AppSettings.INSTANCE.getPrankPath()));
    }


    private void scoreConservation(File fileToAnalyze) throws IOException, InterruptedException, StructureException {
        // Check if the script even exists
        String script = AppSettings.INSTANCE.getConservationScriptPath();
        if (script != null) {
            File scriptFile = new File(script);
            if (scriptFile.exists()) {
                // Create a FASTA file
                File tempFile = File.createTempFile("conservation", ".fasta");
                //Utils.stringToFile(BioUtils.pdbToFasta(fileToAnalyze), tempFile);

                ProcessBuilder processBuilder = new ProcessBuilder(script,
                        tempFile.getAbsolutePath());
                processBuilder.directory(scriptFile.getParentFile());
                Path resultFile = Paths.get(AppSettings.INSTANCE.getPredictionDir(),
                        fileToAnalyze.getName() + ".hom.gz");
                processBuilder.redirectOutput(resultFile.toFile());
                Process process = processBuilder.start();

                int result = process.waitFor();
                tempFile.delete();
            }
        }
    }

    public void runPrediction(File fileToAnalyze, boolean runConservation) {
        workQueue.execute(() -> {
            if (runConservation) {
                try {
                    scoreConservation(fileToAnalyze);
                } catch (IOException e) {
                    logger.error("Failed to run conservation script.", e);
                } catch (InterruptedException e) {
                    logger.error("Failed to run conservation script.", e);
                } catch (StructureException e) {
                    logger.error("Failed to run conservation script.", e);
                }
            }

            prankPredictor.runPrediction(fileToAnalyze.toPath(),
                    Paths.get(AppSettings.INSTANCE.getPredictionDir()));
        });
    }
}
