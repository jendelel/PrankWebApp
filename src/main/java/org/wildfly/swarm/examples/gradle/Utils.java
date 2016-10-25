package org.wildfly.swarm.examples.gradle;

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

    public static String GetCsvDataPath() {
        return "e:\\School\\MFF\\Projects\\Prank2Web\\pdbAnalyzed\\";
    }

    public static String GetPdbDataPath() {
        return "e:\\School\\MFF\\Projects\\Prank2Web\\pdbDataAll\\";
    }
}
