package cz.siret.prank.webapp.servlets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.RejectedExecutionException;
import java.util.zip.GZIPOutputStream;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import cz.siret.prank.lib.utils.Utils;
import cz.siret.prank.webapp.utils.AppSettings;
import cz.siret.prank.webapp.utils.JobRunner;

@WebServlet(
        name = "UploadFileServlet",
        urlPatterns = "/analyze/file_upload",
        asyncSupported = true
)
@MultipartConfig(maxFileSize = 1024 * 1024 * 10, maxRequestSize = 1024*1024*10)
public class UploadFileServlet extends HttpServlet {

    private final transient Logger logger = LoggerFactory.getLogger(getClass());

    private DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private static String removeExtension(String fileName) {
       return fileName.replaceFirst("\\.pdb\\.gz$", "");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        boolean doConservation = Boolean.parseBoolean(request.getParameter("conservation"));
        String chain = request.getParameter("chain");

        // Store file into a temp file
        Part filePart = request.getPart("pdbFile"); // Retrieves <input type="file" name="pdbFile">
        File tempFile;
        try (InputStream fileContent = filePart.getInputStream()) {
            tempFile = null;
            try {
                File uploadsFolder = new File(AppSettings.INSTANCE.getUploadsDir());
                tempFile = File.createTempFile(String.format("upload_%s_",
                        dateTimeFormatter.format(LocalDateTime.now())), ".pdb.gz", uploadsFolder);
                try (GZIPOutputStream outputStream = new GZIPOutputStream(
                        new FileOutputStream(tempFile, false))) {
                    Utils.copyStream(fileContent, outputStream);
                    fileContent.close();
                    outputStream.close();
                }
            } catch (Exception e) {
                e.printStackTrace(response.getWriter());
                return;
            }
        }

        try {
            JobRunner.INSTANCE.runPrediction(tempFile, doConservation);
            request.setAttribute("upload", tempFile.getName());
            response.getWriter().write("/analyze/upload/" + removeExtension(tempFile.getName()));
            response.getWriter().close();
        } catch (RejectedExecutionException e) {
            tempFile.delete();
            response.getWriter().write("/views/busy.jsp");
            response.getWriter().close();
            return;
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }
}
