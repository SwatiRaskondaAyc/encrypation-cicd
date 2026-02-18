package com.example.prog.zoho.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.prog.zoho.service.SMTPMailService;
import com.example.prog.zoho.service.UnsubscribeService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelUploadService {
    
    @Autowired
    private SMTPMailService mailService;

    @Autowired
    private PosterMailService posterMailService;
    
    @Autowired
    private UnsubscribeService unsubscribeService;
    
    public ExcelUploadResponse processExcelUpload(MultipartFile file, String subject, 
                                                 String message, String featuresJson) {
        try {
            System.out.println("📊 Processing Excel file: " + file.getOriginalFilename());
            
            // Step 1: Parse all users from Excel
            List<SubscriberFromExcel> allUsersFromExcel = parseExcelFile(file);
            System.out.println("🔍 Found " + allUsersFromExcel.size() + " users in Excel");
            
            // Step 2: Filter only subscribed users by checking database
            List<SubscriberFromExcel> subscribedUsers = filterSubscribedUsers(allUsersFromExcel);
            System.out.println("🎯 " + subscribedUsers.size() + " users are subscribed in database");
            
            // Step 3: Send emails only to subscribed users
            return sendToSubscribersFromExcel(subscribedUsers, subject, message, featuresJson);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to process Excel file: " + e.getMessage(), e);
        }
    }

    public ExcelUploadResponse processPosterExcelUpload(MultipartFile file, String jobName, String subject, 
                                                   String imageUrl, String caption, String ctaText, String ctaLink) {
    try {
        System.out.println("📊 Processing Excel file for Poster Email: " + file.getOriginalFilename());
        System.out.println("📝 Job Name: " + jobName);
        System.out.println("📝 Subject: " + subject);
        System.out.println("🖼️ Image URL: " + imageUrl);
        System.out.println("📷 Caption: " + caption);
        System.out.println("🔘 CTA Text: " + ctaText);
        System.out.println("🔗 CTA Link: " + ctaLink);
        
        // Step 1: Parse all users from Excel
        List<SubscriberFromExcel> allUsersFromExcel = parseExcelFile(file);
        System.out.println("🔍 Found " + allUsersFromExcel.size() + " users in Excel");
        
        // Step 2: Filter only subscribed users by checking database
        List<SubscriberFromExcel> subscribedUsers = filterSubscribedUsers(allUsersFromExcel);
        System.out.println("🎯 " + subscribedUsers.size() + " users are subscribed in database");
        
        // Step 3: Send poster emails only to subscribed users
        return sendPosterToSubscribersFromExcel(subscribedUsers, jobName, subject, imageUrl, caption, ctaText, ctaLink);
        
    } catch (Exception e) {
        throw new RuntimeException("Failed to process Excel file for poster email: " + e.getMessage(), e);
    }
}
    
    private List<SubscriberFromExcel> parseExcelFile(MultipartFile file) throws IOException {
        List<SubscriberFromExcel> subscribers = new ArrayList<>();
        
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0); // First sheet
        
        for (Row row : sheet) {
            if (row.getRowNum() == 0) continue; // Skip header row
            
            String email = getCellValue(row.getCell(0)); // Email column (first column)
            String name = getCellValue(row.getCell(1));  // Name column (second column)
            
            if (isValidEmail(email)) {
                subscribers.add(new SubscriberFromExcel(email, name));
                System.out.println("📝 Found user in Excel: " + email + " (" + name + ")");
            } else {
                System.out.println("❌ Invalid email format in Excel: " + email);
            }
        }
        
        workbook.close();
        return subscribers;
    }
    
    private List<SubscriberFromExcel> filterSubscribedUsers(List<SubscriberFromExcel> allUsers) {
        List<SubscriberFromExcel> subscribedUsers = new ArrayList<>();
        
        System.out.println("🔍 Checking subscription status from database...");
        
        for (SubscriberFromExcel user : allUsers) {
            try {
                // Check if user is subscribed in database (subscription = 1)
                boolean isSubscribed = unsubscribeService.isSubscribed(user.getEmail());
                
                if (isSubscribed) {
                    subscribedUsers.add(user);
                    System.out.println("✅ Subscribed (will send): " + user.getEmail());
                } else {
                    System.out.println("⏭️ Not subscribed (skipping): " + user.getEmail());
                }
            } catch (Exception e) {
                System.err.println("❌ Error checking subscription for " + user.getEmail() + ": " + e.getMessage());
            }
        }
        
        System.out.println("🎯 Filtering complete: " + subscribedUsers.size() + " subscribed users found");
        return subscribedUsers;
    }
    
    private ExcelUploadResponse sendToSubscribersFromExcel(List<SubscriberFromExcel> subscribers, 
                                                         String subject, String message, 
                                                         String featuresJson) {
        int successCount = 0;
        int failCount = 0;
        List<String> failedEmails = new ArrayList<>();
        
        System.out.println("🎯 Starting to send to " + subscribers.size() + " subscribed users");
        
        if (subscribers.isEmpty()) {
            System.out.println("⚠️ No subscribed users found to send emails");
            return new ExcelUploadResponse(0, 0, failedEmails, 0, "No subscribed users found");
        }
        
        // Apply Titan Free Plan limits
        int remainingHourly = 50 - getEmailsSentThisHour(); // Your hourly limit
        int remainingDaily = 100 - getEmailsSentToday();   // Your daily limit
        
        int canSendNow = Math.min(remainingHourly, remainingDaily);
        canSendNow = Math.min(canSendNow, subscribers.size());
        
        System.out.println("📦 Can send " + canSendNow + " emails now (limits: " + 
                         remainingHourly + "/hour, " + remainingDaily + "/day)");
        
        if (canSendNow <= 0) {
            System.out.println("❌ Cannot send any emails - limits reached");
            return new ExcelUploadResponse(0, 0, failedEmails, subscribers.size(), 
                                         "Daily limit reached. Try again later.");
        }
        
        // Send immediate batch
        for (int i = 0; i < canSendNow; i++) {
            SubscriberFromExcel subscriber = subscribers.get(i);
            try {
                mailService.sendMail(subscriber.getEmail(), subscriber.getName(), 
                                   subject, message, featuresJson);
                successCount++;
                
                // Update email counters
                incrementEmailCounters();
                
                System.out.println("✅ [" + successCount + "/" + canSendNow + "] Sent to: " + subscriber.getEmail());
                
                // Delay between emails
                Thread.sleep(3000); // 5-second delay
                
            } catch (Exception e) {
                failCount++;
                failedEmails.add(subscriber.getEmail());
                System.err.println("❌ Failed: " + subscriber.getEmail() + " - " + e.getMessage());
            }
        }
        
        int remainingForLater = subscribers.size() - canSendNow;
        String messageText = remainingForLater > 0 ? 
            remainingForLater + " emails will be sent after limit reset" : 
            "All emails sent successfully";
            
        System.out.println("📊 Send Summary:");
        System.out.println("✅ Successful: " + successCount);
        System.out.println("❌ Failed: " + failCount);
        System.out.println("⏳ Remaining: " + remainingForLater);
            
        return new ExcelUploadResponse(successCount, failCount, failedEmails, 
                                     remainingForLater, messageText);
    }

 private ExcelUploadResponse sendPosterToSubscribersFromExcel(
        List<SubscriberFromExcel> subscribers,
        String jobName,
        String subject,
        String imageUrl,
        String caption,
        String ctaText,
        String ctaLink
) {
    int successCount = 0;
    int failCount = 0;
    List<String> failedEmails = new ArrayList<>();

    System.out.println("🎯 Starting to send to " + subscribers.size() + " subscribed users");

    if (subscribers.isEmpty()) {
        System.out.println("⚠️ No subscribed users found to send emails");
        return new ExcelUploadResponse(0, 0, failedEmails, 0, "No subscribed users found");
    }

    int remainingHourly = 50 - getEmailsSentThisHour();
    int remainingDaily = 100 - getEmailsSentToday();

    int canSendNow = Math.min(remainingHourly, remainingDaily);
    canSendNow = Math.min(canSendNow, subscribers.size());

    System.out.println("📦 Can send " + canSendNow + " emails now (limits: " +
            remainingHourly + "/hour, " + remainingDaily + "/day)");

    if (canSendNow <= 0) {
        System.out.println("❌ Cannot send any emails - limits reached");
        return new ExcelUploadResponse(0, 0, failedEmails, subscribers.size(),
                "Daily limit reached. Try again later.");
    }

    for (int i = 0; i < canSendNow; i++) {
        SubscriberFromExcel subscriber = subscribers.get(i);
        try {
            // ✅ FIXED LINE
            posterMailService.sendSinglePosterMail(
                    subscriber.getEmail(),
                    subscriber.getName(),
                    subject,
                    imageUrl,
                    caption,
                    ctaText,
                    ctaLink
            );

            successCount++;
            incrementEmailCounters();
            System.out.println("✅ [" + successCount + "/" + canSendNow + "] Sent to: " + subscriber.getEmail());
            Thread.sleep(5000);

        } catch (Exception e) {
            failCount++;
            failedEmails.add(subscriber.getEmail());
            System.err.println("❌ Failed: " + subscriber.getEmail() + " - " + e.getMessage());
        }
    }

    int remainingForLater = subscribers.size() - canSendNow;
    String messageText = remainingForLater > 0 ?
            remainingForLater + " emails will be sent after limit reset" :
            "All emails sent successfully";

    System.out.println("📊 Send Summary:");
    System.out.println("✅ Successful: " + successCount);
    System.out.println("❌ Failed: " + failCount);
    System.out.println("⏳ Remaining: " + remainingForLater);

    return new ExcelUploadResponse(successCount, failCount, failedEmails,
            remainingForLater, messageText);
}

    
    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING: 
                return cell.getStringCellValue().trim();
            case NUMERIC: 
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default: 
                return "";
        }
    }
    
    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
    
    // These methods should track email counts (simplified version)
    private int getEmailsSentThisHour() {
        // In production, track this in database or Redis
        return 0; // Start from 0 for demo
    }
    
    private int getEmailsSentToday() {
        // In production, track this in database
        return 0; // Start from 0 for demo
    }
    
    private void incrementEmailCounters() {
        // In production, update counters in database
    }
    
    // DTO Classes
    public static class SubscriberFromExcel {
        private String email;
        private String name;
        
        public SubscriberFromExcel(String email, String name) {
            this.email = email;
            this.name = name;
        }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
    
    public static class ExcelUploadResponse {
        private int successCount;
        private int failCount;
        private List<String> failedEmails;
        private int remainingEmails;
        private String message;
        
        public ExcelUploadResponse(int successCount, int failCount, 
                                 List<String> failedEmails, int remainingEmails,
                                 String message) {
            this.successCount = successCount;
            this.failCount = failCount;
            this.failedEmails = failedEmails;
            this.remainingEmails = remainingEmails;
            this.message = message;
        }
        
        public int getSuccessCount() { return successCount; }
        public int getFailCount() { return failCount; }
        public List<String> getFailedEmails() { return failedEmails; }
        public int getRemainingEmails() { return remainingEmails; }
        public String getMessage() { return message; }
    }
}