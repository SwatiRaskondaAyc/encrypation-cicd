package com.example.prog.zoho.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.base.url:https://cmdahub.com/api}")
    private String baseUrl;

    public String storeImage(MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Check if it's an image
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("File is not an image. Received: " + contentType);
        }

        // Check file size (5MB limit)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds 5MB limit");
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            System.out.println("📁 Created upload directory: " + uploadPath.toAbsolutePath());
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("💾 Image saved to: " + filePath.toAbsolutePath());

        // Return accessible URL
        String imageUrl = baseUrl + "/images/" + uniqueFilename;
        return imageUrl;
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }
        return filename.substring(filename.lastIndexOf("."));
    }

    // Method to serve images
    public byte[] getImage(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        
        // Security check: ensure the file is within the upload directory
        Path uploadPath = Paths.get(uploadDir).normalize();
        if (!filePath.startsWith(uploadPath)) {
            throw new RuntimeException("Invalid file path");
        }
        
        if (!Files.exists(filePath)) {
            throw new RuntimeException("Image not found: " + filename);
        }
        
        return Files.readAllBytes(filePath);
    }

    // Method to get image content type
    public String getImageContentType(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        switch (extension) {
            case ".png":
                return "image/png";
            case ".gif":
                return "image/gif";
            case ".webp":
                return "image/webp";
            case ".jpeg":
            case ".jpg":
            default:
                return "image/jpeg";
        }
    }
}