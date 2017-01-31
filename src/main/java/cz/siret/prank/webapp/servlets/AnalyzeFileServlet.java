package cz.siret.prank.webapp.servlets;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import cz.siret.prank.program.api.PrankFacade;
import cz.siret.prank.program.api.PrankPredictor;
import cz.siret.prank.webapp.utils.AppSettings;

@WebServlet(
        name = "AnalyzeFileServlet",
        urlPatterns = "/analyze/file_upload",
        asyncSupported = true
)
@MultipartConfig
public class AnalyzeFileServlet extends HttpServlet {

    private DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Part filePart = request.getPart("pdbFile"); // Retrieves <input type="file" name="pdbFile">
        InputStream fileContent = filePart.getInputStream(); // Store the content in a temp file
        File tempFile = null;
        try {
            File tempFolder = new File(AppSettings.INSTANCE.getUploadsDir());
            tempFile =
                    File.createTempFile(
                            String.format(
                                    "upload_%s_", dateTimeFormatter.format(LocalDateTime.now())),
                            ".pdb",
                            tempFolder);

            Files.copy(fileContent, tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            fileContent.close();
        } catch (Exception e) {
            e.printStackTrace(response.getWriter());
        }

        System.out.println(tempFile.toPath().toAbsolutePath().toString());
        PrankPredictor prankPredictor = PrankFacade.createPredictor(
                Paths.get(AppSettings.INSTANCE.getPrankPath()));
        prankPredictor.predict(tempFile.toPath());
//        prankPredictor.runPrediction(tempFile.toPath(), Paths.get(Utils.getPredictionDir()));
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }
}
