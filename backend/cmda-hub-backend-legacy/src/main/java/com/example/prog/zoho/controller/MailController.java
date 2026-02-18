

package com.example.prog.zoho.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.prog.zoho.service.SMTPMailService;
import com.example.prog.zoho.service.ImageStorageService;
import com.example.prog.zoho.service.UnsubscribeService;

import com.example.prog.zoho.service.ExcelUploadService.ExcelUploadResponse;

import com.example.prog.zoho.service.PosterMailService;

import com.example.prog.zoho.service.ExcelUploadService;

import java.util.Map;
import java.util.List;

import com.example.prog.zoho.service.PosterMailService;

@RestController
@RequestMapping("/api")
public class MailController {

    @Autowired
    private SMTPMailService emailService;

    @Autowired
    private ImageStorageService imageStorageService;

    @Autowired
    private UnsubscribeService unsubscribeService;

    @Autowired
    private ExcelUploadService excelUploadService;

     @Autowired
    private PosterMailService posterMailService;

    // 🔹 Upload image to server
    @PostMapping("/upload-image")
    public String uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            System.out.println("📸 Received image upload request");
            System.out.println("📁 File name: " + file.getOriginalFilename());
            System.out.println("📊 File size: " + file.getSize() + " bytes");
            System.out.println("🎯 Content type: " + file.getContentType());
            
            String imageUrl = imageStorageService.storeImage(file);
            System.out.println("✅ Image uploaded successfully: " + imageUrl);
            
            return imageUrl;
        } catch (Exception e) {
            System.err.println("❌ Image upload failed: " + e.getMessage());
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    @PostMapping("/upload-excel-send")
    public ResponseEntity<?> uploadExcelAndSend(
            @RequestParam("file") MultipartFile file,
            @RequestParam String subject,
            @RequestParam String message,
            @RequestParam(required = false) String features) {
        
        try {
            System.out.println("📊 Received Excel upload request");
            System.out.println("📁 File: " + file.getOriginalFilename());
            System.out.println("📝 Subject: " + subject);
            
            ExcelUploadService.ExcelUploadResponse response = 
                excelUploadService.processExcelUpload(file, subject, message, features);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", response,
                "message", "Excel processed successfully. " + 
                          response.getRemainingEmails() + " emails will be sent after limit reset."
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Excel upload failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

 

    // 🔹 NEW: Create batch job for large email lists
    @PostMapping("/create-batch-job")
    public ResponseEntity<?> createBatchJob(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam String jobName,
            @RequestParam String subject,
            @RequestParam String message,
            @RequestParam(required = false) String featuresJson) {
        
        try {
            System.out.println("🚀 Creating batch job: " + jobName);

            if (file == null || file.isEmpty()) {
                
                // --- Path 1: No File ---
                // You create the job and return just the Job ID
                String jobId = emailService.createBatchJob(jobName, subject, message, featuresJson);
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "jobId", jobId, // <-- Return the Job ID
                    "message", "Batch job created and started."
                ));

            } else {

                // --- Path 2: With Excel File ---
                // You process the file and return the ENTIRE upload response
                ExcelUploadService.ExcelUploadResponse response = 
                    excelUploadService.processExcelUpload(file, subject, message, featuresJson);
                
                // Spring will automatically turn your 'response' object into JSON
               return ResponseEntity.ok(Map.of(
                    "success", true,
                    "response", response, // <-- Return the Job ID
                    "message", "Batch job created and started."
                ));
            }
            
        } catch (Exception e) {
            System.err.println("❌ Batch job creation failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }


@PostMapping("/send-poster-mail")
public ResponseEntity<?> sendPosterMail(
        @RequestParam(value = "file", required = false) MultipartFile file,
        @RequestParam String jobName,
        @RequestParam String subject,
        @RequestParam String imageUrl,
        @RequestParam(required = false) String caption,
        @RequestParam(required = false) String ctaText,
        @RequestParam(required = false) String ctaLink) {
    
    try {
        System.out.println("🖼️ Received poster mail request");
        System.out.println("📝 Job Name: " + jobName);
        System.out.println("📝 Subject: " + subject);
        System.out.println("🖼️ Image URL: " + imageUrl);
        System.out.println("📷 Caption: " + caption);
        System.out.println("🔘 CTA Text: " + ctaText);
        System.out.println("🔗 CTA Link: " + ctaLink);
        
        if (file == null || file.isEmpty()) {
            // --- Path 1: No File - Send to all subscribers ---
            String jobId = posterMailService.createPosterBatchJob(jobName, subject, imageUrl, caption, ctaText, ctaLink);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "jobId", jobId,
                "message", "Poster email batch job created and started. It will automatically respect email limits."
            ));
            
        } else {
            // --- Path 2: With Excel File - Send to specific users ---
            ExcelUploadService.ExcelUploadResponse response = excelUploadService.processPosterExcelUpload(
                file, jobName, subject, imageUrl, caption, ctaText, ctaLink
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "response", response,
                "message", "Poster email campaign processed with Excel file"
            ));
        }
        
    } catch (Exception e) {
        System.err.println("❌ Poster mail creation failed: " + e.getMessage());
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "error", e.getMessage()
        ));
    }
}

    // 🔹 NEW: Check batch job status
    @GetMapping("/batch-status/{jobId}")
    public ResponseEntity<?> getBatchStatus(@PathVariable String jobId) {
        try {
            SMTPMailService.BatchJobStatus status = emailService.getBatchJobStatus(jobId);
            
            if (status == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "status", status
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    // 🔹 NEW: Get all batch jobs for dashboard
    @GetMapping("/batch-jobs")
    public ResponseEntity<?> getAllBatchJobs() {
        try {
            List<SMTPMailService.BatchJobStatus> allJobs = emailService.getAllBatchJobs();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "batchJobs", allJobs,
                "totalJobs", allJobs.size()
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Failed to get batch jobs: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    // 🔹 NEW: Get email analytics
    @GetMapping("/email-analytics")
    public ResponseEntity<?> getEmailAnalytics() {
        try {
            // Get today's stats
            int sentToday = emailService.getEmailsSentToday();
            int successRate = emailService.getEmailSuccessRate();
            int activeJobs = emailService.getActiveBatchJobsCount();
            int totalSubscribers = emailService.getTotalSubscribers();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "analytics", Map.of(
                    "sentToday", sentToday,
                    "successRate", successRate + "%",
                    "activeJobs", activeJobs,
                    "totalSubscribers", totalSubscribers,
                    "hourlyLimit", 50,
                    "dailyLimit", 100,
                    "remainingToday", Math.max(0, 100 - sentToday)
                )
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Failed to get email analytics: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    // 🔹 NEW: Send bulk mail with limits (respects Titan Free Plan)
    @PostMapping("/sendBulkMailWithLimits")
    public ResponseEntity<?> sendBulkMailWithLimits(
            @RequestParam String subject, 
            @RequestParam String message,
            @RequestParam(required = false) String features) {
        
        try {
            System.out.println("📧 Starting LIMITED bulk mail send...");
            SMTPMailService.BulkSendResult result = 
                emailService.sendMailToAllUsersWithLimits(subject, message, features);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", result,
                "message", "Bulk mail sent with limit enforcement"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    

    @DeleteMapping("/batch-jobs/{jobId}")
    public ResponseEntity<?> deleteBatchJob(@PathVariable String jobId) {
    try {
        boolean deleted = emailService.deleteJobById(jobId);

        if (deleted) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Job deleted successfully"
            ));
        } else {
            return ResponseEntity.status(404).body(Map.of(
                "success", false,
                "message", "No job found with the given ID"
            ));
        }

    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of(
            "success", false,
            "error", e.getMessage()
        ));
    }
}
}