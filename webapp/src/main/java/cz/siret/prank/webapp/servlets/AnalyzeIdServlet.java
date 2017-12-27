package cz.siret.prank.webapp.servlets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cz.siret.prank.lib.utils.BioUtils;
import cz.siret.prank.lib.utils.Utils;
import cz.siret.prank.webapp.utils.AppSettings;
import cz.siret.prank.webapp.utils.DataGetter;
import cz.siret.prank.webapp.utils.JobRunner;
import cz.siret.prank.webapp.utils.PrankUtils;

@WebServlet(name="AnalyzeIdServlet", urlPatterns = {"/analyze/id/*", "/analyze/id_noconser/*"})
public class AnalyzeIdServlet extends HttpServlet {

    private final transient Logger logger = LoggerFactory.getLogger(getClass());

    public static File downloadFileFromPDB(String pdbId, Path targetFile, Path csvDir) {
        PrankUtils.INSTANCE.updateStatus(targetFile.toFile(),
                csvDir, "Downloading file from PDB.");
        String middleChars = pdbId.substring(1, 3);
        try {
            URL url = new URL(String.format("ftp://ftp.wwpdb" +
                            ".org/pub/pdb/data/structures/divided/pdb/%s/pdb%s.ent.gz",
                    middleChars, pdbId));
            try (InputStream in = url.openStream()) {
                Files.copy(in, targetFile, StandardCopyOption.REPLACE_EXISTING);
                PrankUtils.INSTANCE.updateStatus(targetFile.toFile(),
                        csvDir, "File downloaded.");

                return targetFile.toFile();
            }
        } catch (Exception e) {
            PrankUtils.INSTANCE.updateStatus(targetFile.toFile(),
                    csvDir, "ERROR: Failed to download or analyze PDB file. ".concat(e.toString()));
        }
        return null;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String urlSuffix = req.getPathInfo();
        logger.info(req.getServletPath());
        if (urlSuffix != null && urlSuffix.length() == 5 && urlSuffix.charAt(0) == '/' ) {
            String pdbId = urlSuffix.substring(1).toLowerCase();
            String inputType = "id"; boolean runConservation = true;
            if (req.getServletPath().equals("/analyze/id_noconser")) {
                inputType = "id_noconser";
                runConservation = false;
            }
            DataGetter data = new DataGetter(inputType, pdbId);

            if (data.csvFile().toFile().exists()) {
                req.setAttribute("inputType", inputType);
                req.setAttribute("inputId", pdbId);
                RequestDispatcher rd = getServletContext().getRequestDispatcher("/views/visualize.jsp");
                rd.forward(req, resp);
                return;
            }
            if (data.statusFile().toFile().exists()) {
                String progress = Utils.INSTANCE.convertStreamToString(
                        Utils.INSTANCE.readFile(data.statusFile().toFile()), true);
                if (progress.toLowerCase().contains("error")) {
                    req.setAttribute("msg", progress.replace("\n", "<br/>"));
                    long elapsed = System.currentTimeMillis() - data.statusFile().toFile().lastModified();
                    if (elapsed > 1000 * 30 * 60 * 60) {
                        // If the error file is older than 30 minutes, delete it.
                        data.statusFile().toFile().delete();
                    }
                    RequestDispatcher rd = getServletContext()
                            .getRequestDispatcher("/error/error.jsp");
                    rd.forward(req, resp);
                    return;
                } else {
                    req.setAttribute("progress", progress.replace("\n", "<br/>"));
                    RequestDispatcher rd = getServletContext()
                            .getRequestDispatcher("/views/in_progress.jsp");
                    rd.forward(req, resp);
                    return;
                }
            } else {
                // Download and analyze the file.
                File downloadedFile = downloadFileFromPDB(pdbId,
                        data.pdbFile(),
                        data.csvFile().getParent());
                if (downloadedFile != null) {
                    String errors = BioUtils.INSTANCE.checkForPdbFileErrors(data.pdbFile().toFile());
                    if (errors != null) {
                        logger.info("Found errors. File: {}, Errors: {}",
                                data.pdbFile().toFile().getName(), errors);
                        PrankUtils.INSTANCE.updateStatus(data.pdbFile().toFile(),
                                data.csvFile().getParent(), "ERROR: ".concat(errors));
                    } else {
                        JobRunner.INSTANCE.runPrediction(data.pdbFile().toFile(),
                                Paths.get(AppSettings.INSTANCE.getCsvDataPath()), pdbId, runConservation);
                    }
                }

                req.setAttribute("progress", "");
                RequestDispatcher rd = getServletContext()
                        .getRequestDispatcher("/views/in_progress.jsp");
                rd.forward(req, resp);
                return;

            }

        } else {
            RequestDispatcher rd = getServletContext().getRequestDispatcher("/error/404.jsp");
            rd.forward(req, resp);
        }

    }
}
