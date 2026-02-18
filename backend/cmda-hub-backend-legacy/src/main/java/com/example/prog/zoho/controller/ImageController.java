package com.example.prog.zoho.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.prog.zoho.service.ImageStorageService;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImageStorageService imageStorageService;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            System.out.println("🖼️ Serving image: " + filename);
            
            byte[] imageBytes = imageStorageService.getImage(filename);
            String contentType = imageStorageService.getImageContentType(filename);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setCacheControl("public, max-age=86400"); // Cache for 24 hours
            
            System.out.println("✅ Image served successfully: " + filename);
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            System.err.println("❌ Error serving image " + filename + ": " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
