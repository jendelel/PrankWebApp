package cz.siret.prank.webapp.servlets;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name="AnalyzeIdServlet", urlPatterns = "/analyze/id/*")
public class AnalyzeIdServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String urlSuffix = req.getPathInfo();
        if (urlSuffix != null && urlSuffix.length() == 5 && urlSuffix.charAt(0) == '/' ) {
            String pdbId = urlSuffix.substring(1);
            req.setAttribute("pdbId", pdbId);
            RequestDispatcher rd = getServletContext().getRequestDispatcher("/views/visualize.jsp");
            rd.forward(req, resp);
        } else {
            RequestDispatcher rd = getServletContext().getRequestDispatcher("/error/404.jsp");
            rd.forward(req, resp);
        }

    }
}
