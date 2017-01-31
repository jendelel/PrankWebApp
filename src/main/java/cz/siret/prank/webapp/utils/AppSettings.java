package cz.siret.prank.webapp.utils;

import org.apache.commons.configuration2.Configuration;
import org.apache.commons.configuration2.builder.fluent.Configurations;
import org.apache.commons.configuration2.ex.ConfigurationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

public enum AppSettings {
   INSTANCE;

    private Configuration config;
    private Path dataDir;
    private final transient Logger logger = LoggerFactory.getLogger(getClass());

    AppSettings() {
        Configurations configs = new Configurations();
        try {
            dataDir = Paths.get(System.getProperty("jboss.server.data.dir"), "PrankWeb");
            String confPath = dataDir.resolve("prankweb.properties").toString();
            logger.info("Loading configuration from {}", confPath);
            config = configs.properties(new File(confPath));
        } catch (ConfigurationException exp) {
            System.err.println("Loading settings properties failed");
            throw new IllegalStateException("Failed to load configuration", exp);
        }
    }

    public String getPrankPath() {
        String value = config.getString("prank.installdir");
        Path path = dataDir.resolve(value);
        return path.toAbsolutePath().toString();
    }

    public String getCsvDataPath() {
        String value = config.getString("database.csv");
        Path path = dataDir.resolve(value);
        return path.toAbsolutePath().toString();
    }

    public String getPdbDataPath() {
        String value = config.getString("database.pdb");
        Path path = dataDir.resolve(value);
        return path.toAbsolutePath().toString();
    }

    public String getUploadsDir() {
        String value = config.getString("uploads.pdb");
        Path path = dataDir.resolve(value);
        return path.toAbsolutePath().toString();
    }

    public String getPredictionDir() {
        String value = config.getString("uploads.csv");
        Path path = dataDir.resolve(value);
        return path.toAbsolutePath().toString();
    }
}
