// package com.example.prog.service;

// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.File;
// import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.util.UUID;

// @Service
// public class FileStorageService {

//     private static final String UPLOAD_DIR = "uploads/";

//     public String uploadFile(MultipartFile file) {
//         try {
//             // Create directory if it does not exist
//             Path uploadPath = Paths.get(UPLOAD_DIR);
//             if (!Files.exists(uploadPath)) {
//                 Files.createDirectories(uploadPath);
//             }

//             // Generate a unique filename
//             String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
//             Path filePath = uploadPath.resolve(fileName);

//             // Save file to local storage
//             Files.write(filePath, file.getBytes());

//             // Return file URL (Modify this for cloud storage like AWS S3)
//             return "https://cmda.aycanalytics.com/api/uploads/" + fileName;

//         } catch (IOException e) {
//             throw new RuntimeException("Failed to store file: " + e.getMessage());
//         }
//     }
// }

// package com.example.prog.service;

// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.util.UUID;

// @Service
// public class FileStorageService {

//     private static final String UPLOAD_DIR = "/app/uploads/";

//     public String uploadFile(MultipartFile file) {
//         try {
//             Path uploadPath = Paths.get(UPLOAD_DIR);
//             if (!Files.exists(uploadPath)) {
//                 Files.createDirectories(uploadPath);
//             }

//             String originalFilename = file.getOriginalFilename();
//             String sanitizedFilename = originalFilename != null ? originalFilename.replaceAll("\\s+", "_") : "file";
            
//             String fileName = UUID.randomUUID() + "_" + sanitizedFilename;
//             Path filePath = uploadPath.resolve(fileName);

//             Files.copy(file.getInputStream(), filePath); // Use InputStream to avoid memory issues

//             return "https://cmdahub.com/api/corporate/uploads/" + fileName;
//         } catch (IOException e) {
//             throw new RuntimeException("Failed to store file: " + e.getMessage());
//         }
//     }
// }

package com.example.prog.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.prog.config.CorsConfig; // Import CorsConfig

@Service
public class FileStorageService {

    private static final String UPLOAD_DIR = "/app/uploads/";

    @Autowired
    private CorsConfig corsConfig; // Inject CorsConfig to access frontend URLs

    public Map<String, String> uploadFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String sanitizedFilename = originalFilename != null ? originalFilename.replaceAll("\\s+", "_") : "file";
            
            String fileName = UUID.randomUUID() + "_" + sanitizedFilename;
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath); // Use InputStream to avoid memory issues

            // Get the frontend URLs from CorsConfig
            String primaryUrl = corsConfig.getFrontendUrl() + "api/corporate/uploads/" + fileName;
            String alternateUrl = corsConfig.getAlternateFrontendUrl() + "api/corporate/uploads/" + fileName;
            System.out.println("Generated file URL (primary): " + primaryUrl);
            System.out.println("Generated file URL (alternate): " + alternateUrl);

            // Return both URLs in a map
            Map<String, String> response = new HashMap<>();
            response.put("primaryUrl", primaryUrl);
            response.put("alternateUrl", alternateUrl);
            return response;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }
}