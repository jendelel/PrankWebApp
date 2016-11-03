package cz.siret.prank.webapp.utils;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class Utils {
    public static void copyStream(InputStream in, OutputStream out) throws IOException {
        byte[] buffer = new byte[1024];
        int len = in.read(buffer);
        while (len != -1) {
            out.write(buffer, 0, len);
            len = in.read(buffer);
        }
    }

    public static String getPrankPath() {
        //TODO: Return sh for Linux platforms
        return "e:\\School\\MFF\\Projects\\Prank2Web\\prank\\prank.bat";
    }
    public static String GetCsvDataPath() {
        return "e:\\School\\MFF\\Projects\\Prank2Web\\pdbAnalyzed\\";
    }

    public static String GetPdbDataPath() {
        return "e:\\School\\MFF\\Projects\\Prank2Web\\pdbDataAll\\";
    }

    public static String getUploadsDir() {
        return "e:\\School\\MFF\\Projects\\Prank2Web\\uploads\\";
    }
    public static String getPredictionDir() {
        return "e:/School/MFF/Projects/Prank2Web/uploads/predictions";
    }
}
