//package com.example.prog.utils;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.util.Base64;
//import java.util.Map;
//
//public class DashboardUtils {
//
//    private static final Logger logger = LoggerFactory.getLogger(DashboardUtils.class);
//    private static final ObjectMapper objectMapper = new ObjectMapper();
//
//    public static String saveScreenshot(int dashId, String base64Image, String storagePath) throws IOException {
//        logger.info("Saving screenshot for dashId: {}", dashId);
//        String cleanBase64 = base64Image.replaceFirst("^data:image/[^;]+;base64,", "");
//        byte[] imageBytes;
//        try {
//            imageBytes = Base64.getDecoder().decode(cleanBase64);
//        } catch (IllegalArgumentException e) {
//            logger.error("Invalid base64 string for dashId {}: {}", dashId, e.getMessage());
//            throw new IOException("Failed to decode base64 screenshot: " + e.getMessage(), e);
//        }
//
//        String fileName = "dashboard_" + dashId + "_screenshot.png";
//        Path filePath = Paths.get(storagePath, fileName);
//        Files.createDirectories(filePath.getParent());
//        Files.write(filePath, imageBytes);
//        logger.info("Screenshot saved at: {}", filePath);
//        return fileName;
//    }
//
//    public static void saveDashboardFile(int dashId, Map<String, Object> dashboardData, String storagePath) throws IOException {
//        String fileName = "dashboard_" + dashId + ".json";
//        Path filePath = Paths.get(storagePath, fileName);
//        Files.createDirectories(filePath.getParent());
//        objectMapper.writeValue(filePath.toFile(), dashboardData);
//        logger.info("Dashboard JSON file saved at: {}", filePath);
//    }
//
//    public static Map<String, Object> readDashboardFile(int dashId, String storagePath) throws IOException {
//        String fileName = "dashboard_" + dashId + ".json";
//        Path filePath = Paths.get(storagePath, fileName);
//        if (!Files.exists(filePath)) {
//            logger.warn("Dashboard file not found at: {}", filePath);
//            throw new IOException("Dashboard file not found");
//        }
//        return objectMapper.readValue(filePath.toFile(), Map.class);
//    }
//
//    public static byte[] readScreenshot(int dashId, String storagePath) throws IOException {
//        String fileName = "dashboard_" + dashId + "_screenshot.png";
//        Path filePath = Paths.get(storagePath, fileName);
//        if (!Files.exists(filePath)) {
//            logger.warn("Screenshot file not found at: {}", filePath);
//            throw new IOException("Screenshot file not found");
//        }
//        return Files.readAllBytes(filePath);
//    }
//
//    public static void deleteDashboardFiles(int dashId, String storagePath) throws IOException {
//        String jsonFileName = "dashboard_" + dashId + ".json";
//        String screenshotFileName = "dashboard_" + dashId + "_screenshot.png";
//        Path jsonPath = Paths.get(storagePath, jsonFileName);
//        Path screenshotPath = Paths.get(storagePath, screenshotFileName);
//
//        if (Files.exists(jsonPath)) {
//            Files.delete(jsonPath);
//            logger.info("Deleted dashboard JSON file: {}", jsonPath);
//        }
//        if (Files.exists(screenshotPath)) {
//            Files.delete(screenshotPath);
//            logger.info("Deleted screenshot file: {}", screenshotPath);
//        }
//    }
//
//    public static String generateQRCode(String url) throws IOException {
//        logger.info("Generating QR code for URL: {}", url);
//        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
//    }
//}


//--------------swati------------------------



//package com.example.prog.utils;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.google.zxing.BarcodeFormat;
//import com.google.zxing.WriterException;
//import com.google.zxing.client.j2se.MatrixToImageWriter;
//import com.google.zxing.common.BitMatrix;
//import com.google.zxing.qrcode.QRCodeWriter;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.io.ByteArrayOutputStream;
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.util.Base64;
//import java.util.Map;
//
//public class DashboardUtils {
//
//    private static final Logger logger = LoggerFactory.getLogger(DashboardUtils.class);
//    private static final ObjectMapper objectMapper = new ObjectMapper();
//
//    public static String saveScreenshot(int dashId, String base64Image, String storagePath) throws IOException {
//        logger.info("Saving screenshot for dashId: {}", dashId);
//        String cleanBase64 = base64Image.replaceFirst("^data:image/[^;]+;base64,", "");
//        byte[] imageBytes;
//        try {
//            imageBytes = Base64.getDecoder().decode(cleanBase64);
//        } catch (IllegalArgumentException e) {
//            logger.error("Invalid base64 string for dashId {}: {}", dashId, e.getMessage());
//            throw new IOException("Failed to decode base64 screenshot: " + e.getMessage(), e);
//        }
//
//        String fileName = "dashboard_" + dashId + "_screenshot.png";
//        Path filePath = Paths.get(storagePath, fileName);
//        Files.createDirectories(filePath.getParent());
//        Files.write(filePath, imageBytes);
//        logger.info("Screenshot saved at: {}", filePath);
//        return fileName;
//    }
//
//    public static void saveDashboardFile(int dashId, Map<String, Object> dashboardData, String storagePath) throws IOException {
//        String fileName = "dashboard_" + dashId + ".json";
//        Path filePath = Paths.get(storagePath, fileName);
//        Files.createDirectories(filePath.getParent());
//        objectMapper.writeValue(filePath.toFile(), dashboardData);
//        logger.info("Dashboard JSON file saved at: {}", filePath);
//    }
//
//    public static Map<String, Object> readDashboardFile(int dashId, String storagePath) throws IOException {
//        String fileName = "dashboard_" + dashId + ".json";
//        Path filePath = Paths.get(storagePath, fileName);
//        if (!Files.exists(filePath)) {
//            logger.warn("Dashboard file not found at: {}", filePath);
//            throw new IOException("Dashboard file not found");
//        }
//        return objectMapper.readValue(filePath.toFile(), Map.class);
//    }
//
//    public static byte[] readScreenshot(int dashId, String storagePath) throws IOException {
//        String fileName = "dashboard_" + dashId + "_screenshot.png";
//        Path filePath = Paths.get(storagePath, fileName);
//        if (!Files.exists(filePath)) {
//            logger.warn("Screenshot file not found at: {}", filePath);
//            throw new IOException("Screenshot file not found");
//        }
//        return Files.readAllBytes(filePath);
//    }
//
//    public static void deleteDashboardFiles(int dashId, String storagePath) throws IOException {
//        String jsonFileName = "dashboard_" + dashId + ".json";
//        String screenshotFileName = "dashboard_" + dashId + "_screenshot.png";
//        Path jsonPath = Paths.get(storagePath, jsonFileName);
//        Path screenshotPath = Paths.get(storagePath, screenshotFileName);
//
//        if (Files.exists(jsonPath)) {
//            Files.delete(jsonPath);
//            logger.info("Deleted dashboard JSON file: {}", jsonPath);
//        }
//        if (Files.exists(screenshotPath)) {
//            Files.delete(screenshotPath);
//            logger.info("Deleted screenshot file: {}", screenshotPath);
//        }
//    }
//
//    public static String generateQRCode(String url) throws IOException {
//        logger.info("Generating QR code for URL: {}", url);
//        try {
//            QRCodeWriter qrCodeWriter = new QRCodeWriter();
//            BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, 200, 200);
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", baos);
//            byte[] qrCodeBytes = baos.toByteArray();
//            return "data:image/png;base64," + Base64.getEncoder().encodeToString(qrCodeBytes);
//        } catch (WriterException e) {
//            logger.error("Failed to generate QR code: {}", e.getMessage());
//            throw new IOException("Failed to generate QR code: " + e.getMessage(), e);
//        }
//    }
//}


//---------------------------------------------------------



// package com.example.prog.utils;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.google.zxing.BarcodeFormat;
// import com.google.zxing.WriterException;
// import com.google.zxing.client.j2se.MatrixToImageWriter;
// import com.google.zxing.common.BitMatrix;
// import com.google.zxing.qrcode.QRCodeWriter;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Component;

// import java.io.ByteArrayOutputStream;
// import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.util.Base64;
// import java.util.HashMap;
// import java.util.Map;

// @Component
// public class DashboardUtils {

//     private static final Logger logger = LoggerFactory.getLogger(DashboardUtils.class);
//     private final ObjectMapper objectMapper;

//     @Autowired
//     public DashboardUtils(ObjectMapper objectMapper) {
//         this.objectMapper = objectMapper;
//     }

//     public String saveScreenshot(int dashId, String base64Image, String storagePath) throws IOException {
//         logger.info("Saving screenshot for dashId: {}", dashId);

//         if (base64Image == null || base64Image.trim().isEmpty()) {
//             throw new IllegalArgumentException("Base64 image data is null or empty");
//         }
//         String cleanBase64 = base64Image.replaceFirst("^data:image/[^;]+;base64,", "").trim();
//         if (cleanBase64.isEmpty()) {
//             throw new IllegalArgumentException("Invalid base64 format after cleaning");
//         }

//         byte[] imageBytes = Base64.getDecoder().decode(cleanBase64);
//         if (imageBytes.length == 0) {
//             throw new IOException("Decoded image bytes are empty");
//         }

//         String fileName = "dashboard_" + dashId + "_screenshot.png";
//         Path filePath = Paths.get(storagePath, fileName);
//         Files.createDirectories(filePath.getParent());
//         Files.write(filePath, imageBytes);
//         logger.info("Screenshot saved at: {}", filePath);
//         return fileName;
//     }

//     public String generateQRCode(String url) throws IOException {
//         try {
//             QRCodeWriter qrCodeWriter = new QRCodeWriter();
//             BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, 250, 250);
//             ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
//             MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
//             return Base64.getEncoder().encodeToString(pngOutputStream.toByteArray());
//         } catch (WriterException e) {
//             throw new IOException("Failed to generate QR code: " + e.getMessage(), e);
//         }
//     }

//     public void saveDashboardFile(int dashId, Map<String, Object> dashboardData, String storagePath) throws IOException {
//         String fileName = "dashboard_" + dashId + ".json";
//         Path filePath = Paths.get(storagePath, fileName);
//         Files.createDirectories(filePath.getParent());
//         objectMapper.writeValue(filePath.toFile(), dashboardData);
//         logger.info("Dashboard JSON saved at: {}", filePath);
//     }

//     // Add missing method
//     public Map<String, Object> readDashboardFile(int dashId, String storagePath) throws IOException {
//         String fileName = "dashboard_" + dashId + ".json";
//         Path filePath = Paths.get(storagePath, fileName);
//         if (Files.exists(filePath)) {
//             return objectMapper.readValue(filePath.toFile(), Map.class);
//         }
//         logger.warn("Dashboard file not found for dashId: {}", dashId);
//         return new HashMap<>();
//     }

//     // Add delete method if referenced elsewhere
//     public void deleteDashboardFiles(int dashId, String storagePath) throws IOException {
//         Path screenshotPath = Paths.get(storagePath, "dashboard_" + dashId + "_screenshot.png");
//         Path jsonPath = Paths.get(storagePath, "dashboard_" + dashId + ".json");
//         Files.deleteIfExists(screenshotPath);
//         Files.deleteIfExists(jsonPath);
//         logger.info("Deleted files for dashId: {}", dashId);
//     }

// 	public static byte[] readScreenshot(int dashId, String dashboardStoragePath) {
// 		// TODO Auto-generated method stub
// 		return null;
// 	}
// }



package com.example.prog.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class DashboardUtils {

    private static final Logger logger = LoggerFactory.getLogger(DashboardUtils.class);
    private final ObjectMapper objectMapper;
    @Value("${dashboard.base.url:https://cmdahub.com}")
    private String dashboardBaseUrl;

    @Autowired
    public DashboardUtils(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String saveScreenshot(int dashId, String base64Image, String storagePath) throws IOException {
        logger.info("Saving screenshot for dashId: {}", dashId);

        if (base64Image == null || base64Image.trim().isEmpty()) {
            throw new IllegalArgumentException("Base64 image data is null or empty");
        }
        String cleanBase64 = base64Image.replaceFirst("^data:image/[^;]+;base64,", "").trim();
        if (cleanBase64.isEmpty()) {
            throw new IllegalArgumentException("Invalid base64 format after cleaning");
        }

        byte[] imageBytes = Base64.getDecoder().decode(cleanBase64);
        if (imageBytes.length == 0) {
            throw new IOException("Decoded image bytes are empty");
        }

        String fileName = "dashboard_" + dashId + "_screenshot.png";
        Path filePath = Paths.get(storagePath, fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, imageBytes);
        logger.info("Screenshot saved at: {}", filePath);
        return fileName;
    }

   public String generateQRCode(String dashId) throws IOException {
        String url = dashboardBaseUrl + "/api/dashboard/" + dashId;
        logger.info("Generating QR code for URL: {}", url);
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, 250, 250);
            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
             return "data:image/png;base64," + Base64.getEncoder().encodeToString(pngOutputStream.toByteArray());
        } catch (WriterException e) {
            logger.error("Failed to generate QR code: {}", e.getMessage());
            throw new IOException("Failed to generate QR code: " + e.getMessage(), e);
        }
    }

    public void saveDashboardFile(int dashId, Map<String, Object> dashboardData, String storagePath) throws IOException {
        String fileName = "dashboard_" + dashId + ".json";
        Path filePath = Paths.get(storagePath, fileName);
        Files.createDirectories(filePath.getParent());
        objectMapper.writeValue(filePath.toFile(), dashboardData);
        logger.info("Dashboard JSON saved at: {}", filePath);
    }

    // Add missing method
    public Map<String, Object> readDashboardFile(int dashId, String storagePath) throws IOException {
        String fileName = "dashboard_" + dashId + ".json";
        Path filePath = Paths.get(storagePath, fileName);
        if (Files.exists(filePath)) {
            return objectMapper.readValue(filePath.toFile(), Map.class);
        }
        logger.warn("Dashboard file not found for dashId: {}", dashId);
        return new HashMap<>();
    }

    // Add delete method if referenced elsewhere
    public void deleteDashboardFiles(int dashId, String storagePath) throws IOException {
        Path screenshotPath = Paths.get(storagePath, "dashboard_" + dashId + "_screenshot.png");
        Path jsonPath = Paths.get(storagePath, "dashboard_" + dashId + ".json");
        Files.deleteIfExists(screenshotPath);
        Files.deleteIfExists(jsonPath);
        logger.info("Deleted files for dashId: {}", dashId);
    }

    //  public boolean deleteSnapshotFile(int dashId, String storagePath) throws IOException {
    //     Path screenshotPath = Paths.get(storagePath, "dashboard_" + dashId + ".png");
    //     return Files.deleteIfExists(screenshotPath);
    // }

   public boolean deleteSnapshotFile(int dashId, String storagePath) throws IOException {
        Path screenshotPath = Paths.get(storagePath, "dashboard_" + dashId + "_screenshot.png");
        boolean deleted = Files.deleteIfExists(screenshotPath);
        if (deleted) {
            logger.info("Snapshot file deleted for dashId: {}", dashId);
        } else {
            logger.warn("Snapshot file not found for dashId: {}", dashId);
        }
        return deleted;
    }
	public byte[] readScreenshot(int dashId, String storagePath) throws IOException {
        String fileName = "dashboard_" + dashId + "_screenshot.png";
        Path filePath = Paths.get(storagePath, fileName);
        if (!Files.exists(filePath)) {
            logger.warn("Screenshot file not found at: {}", filePath);
            throw new IOException("Screenshot file not found");
        }
        return Files.readAllBytes(filePath);
    }
}