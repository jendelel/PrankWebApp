package cz.siret.prank.webapp.utils;

import java.io.File;
import java.nio.file.Paths;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import cz.siret.prank.program.api.PrankFacade;
import cz.siret.prank.program.api.PrankPredictor;

public enum JobRunner {
    INSTANCE;

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

    public void runPrediction(File fileToAnalyze) {
        workQueue.execute(() -> {
            prankPredictor.runPrediction(fileToAnalyze.toPath(),
                    Paths.get(AppSettings.INSTANCE.getPredictionDir()));
        });
    }
}
