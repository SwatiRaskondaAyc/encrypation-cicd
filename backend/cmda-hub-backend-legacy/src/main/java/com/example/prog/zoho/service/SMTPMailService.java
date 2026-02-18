
// SMTPMailService.java (Complete with Database + All Template Methods)
package com.example.prog.zoho.service;

import com.example.prog.entity.BatchJobEntity;
import com.example.prog.entity.EmailLogEntity;
import com.example.prog.zoho.repository.BatchJobRepository;
import com.example.prog.zoho.repository.EmailLogRepository;
import com.example.prog.zoho.service.SMTPMailService.BatchJobStatus;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.UnsupportedEncodingException;
import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.jdbc.core.JdbcTemplate;

import com.example.prog.entity.PosterJobEntity;
import com.example.prog.zoho.repository.PosterEmailLogRepository;
import com.example.prog.zoho.repository.PosterJobRepository;

@Service
public class SMTPMailService {

    @Autowired
    @Qualifier("zohoSender")
    private JavaMailSender mailSender;

    @Autowired
    @Qualifier("bigrockSupportSender")
    private JavaMailSender bigrockSupportSender;

    @Autowired
    @Qualifier("userJdbcTemplate")  // For CMDA_Users_Hub database
    private JdbcTemplate userJdbcTemplate;

    @Autowired
    private UnsubscribeService unsubscribeService;

    @Autowired
    private BatchJobRepository batchJobRepository;

    @Autowired
    private PosterJobRepository posterJobRepository;

    @Autowired
    private EmailLogRepository emailLogRepository;

    @Autowired
    private PosterEmailLogRepository posterEmailLogRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Keep some in-memory counters for performance (optional)
    private final AtomicInteger emailsSentThisHour = new AtomicInteger(0);
    private long lastHourReset = System.currentTimeMillis();
    
    // Titan Free Plan Limits
    private static final int HOURLY_LIMIT = 25;
    private static final int DAILY_LIMIT = 100;

    // NEW: Create batch job for large lists with database storage
    @Transactional
    public String createBatchJob(String jobName, String subject, String message, String featuresJson) {
        List<UnsubscribeService.SubscriberInfo> subscribers = unsubscribeService.getActiveSubscribers();
        
        if (subscribers.isEmpty()) {
            throw new RuntimeException("No active subscribers found");
        }
        
        // Save to database
        BatchJobEntity batchJob = new BatchJobEntity(
            jobName, 
            subject, 
            message, 
            featuresJson, 
            "CREATED", 
            subscribers.size()
        );
        
        batchJobRepository.save(batchJob);
        
       
        processBatchJob(batchJob.getId());
        
        return batchJob.getId();
    }

@Async
@Transactional
public void processBatchJob(String jobId) {
    Optional<BatchJobEntity> batchJobOpt = batchJobRepository.findById(jobId);
    if (batchJobOpt.isEmpty()) {
        System.out.println("❌ Batch job not found: " + jobId);
        return;
    }
    
    BatchJobEntity batchJob = batchJobOpt.get();
    List<UnsubscribeService.SubscriberInfo> allSubscribers = unsubscribeService.getActiveSubscribers();

    // Get already processed emails from EmailLogRepository
    Set<String> alreadyProcessedEmails = getAlreadyProcessedEmails(batchJob.getId());
    
    System.out.println("🚀 Processing batch job: " + batchJob.getJobName());
    System.out.println("📧 Total subscribers: " + allSubscribers.size());
    System.out.println("📋 Already processed: " + alreadyProcessedEmails.size() + " emails");

    // Filter out already processed subscribers
    List<UnsubscribeService.SubscriberInfo> remainingSubscribers = allSubscribers.stream()
        .filter(sub -> !alreadyProcessedEmails.contains(sub.getEmail()))
        .collect(Collectors.toList());
    
    if (remainingSubscribers.isEmpty()) {
        System.out.println("✅ All emails already processed for job: " + batchJob.getJobName());
        batchJob.setStatus("COMPLETED");
        batchJob.setProgress(100);
        batchJob.setCompletedAt(new Timestamp(System.currentTimeMillis()));
        batchJobRepository.save(batchJob);
        return;
    }
    
    // Update status to PROCESSING
    batchJob.setStatus("PROCESSING");
    batchJobRepository.save(batchJob);
    
    // Check limits
    resetCountersIfNeeded();
    int canSendNow = calculateSendCapacity();
    canSendNow = Math.min(canSendNow, remainingSubscribers.size());
    
    System.out.println("📊 Capacity Check - Can send: " + canSendNow + " emails now");
    
    if (canSendNow <= 0) {
        System.out.println("⏳ Batch job paused - limits reached. Will resume after reset.");
        batchJob.setStatus("WAITING_FOR_RESET");
        batchJobRepository.save(batchJob);
        scheduleBatchResume(jobId);
        return;
    }
    
    System.out.println("📦 Sending " + canSendNow + " emails in this batch");
    System.out.println("🎯 Remaining after this batch: " + (remainingSubscribers.size() - canSendNow));
    
    int sentInThisBatch = 0;
    int failedInThisBatch = 0;
    
    // ✅ FIXED: Use the filtered remainingSubscribers list
    for (int i = 0; i < canSendNow; i++) {
        UnsubscribeService.SubscriberInfo subscriber = remainingSubscribers.get(i);
        try {
            sendMail(subscriber.getEmail(), subscriber.getName(), 
                    batchJob.getSubject(), batchJob.getMessage(), batchJob.getFeaturesJson());
            
            // Log successful email
            logEmailSent(batchJob.getId(), subscriber, batchJob.getSubject(), "SENT", null);
            sentInThisBatch++;
            emailsSentThisHour.incrementAndGet();
            
            System.out.println("✅ [" + (i + 1) + "/" + canSendNow + "] Sent to: " + subscriber.getEmail());
            
            // Delay between emails
            Thread.sleep(2000); // 2 seconds
            
        } catch (Exception e) {
            // Log failed email
            logEmailSent(batchJob.getId(), subscriber, batchJob.getSubject(), "FAILED", e.getMessage());
            failedInThisBatch++;
            System.err.println("❌ Failed to send to " + subscriber.getEmail() + ": " + e.getMessage());
        }
    }
    
    // Update batch job progress based on ACTUAL processed count from logs
    int totalProcessedFromLogs = getAlreadyProcessedEmails(batchJob.getId()).size();
    batchJob.setProgress((int) ((totalProcessedFromLogs * 100.0) / batchJob.getTotalEmails()));
    
    // Check if job is completed
    if (totalProcessedFromLogs >= batchJob.getTotalEmails()) {
        batchJob.setStatus("COMPLETED");
        batchJob.setCompletedAt(new Timestamp(System.currentTimeMillis()));
        System.out.println("✅ Batch job completed: " + batchJob.getJobName());
    } else {
        batchJob.setStatus("WAITING_FOR_RESET");
        int remaining = batchJob.getTotalEmails() - totalProcessedFromLogs;
        System.out.println("⏳ Batch job paused. Remaining: " + remaining);
        scheduleBatchResume(jobId);
    }
    
    batchJob.setSentCount(batchJob.getSentCount() + sentInThisBatch);
    batchJob.setFailedCount(batchJob.getFailedCount() + failedInThisBatch);
    batchJobRepository.save(batchJob);
    
    System.out.println("📊 Batch progress: " + batchJob.getProgress() + "%");
    System.out.println("📋 Total processed: " + totalProcessedFromLogs + "/" + batchJob.getTotalEmails());
}
    
    @Transactional
    protected void logEmailSent(String batchJobId, UnsubscribeService.SubscriberInfo subscriber, 
                               String subject, String status, String failureReason) {
        EmailLogEntity log = new EmailLogEntity(
            batchJobId,
            subscriber.getEmail(),
            subscriber.getName(),
            subject,
            status,
            failureReason
        );
        
        emailLogRepository.save(log);
    }
    
    private int calculateSendCapacity() {
        // Get today's email count from database
        Timestamp startOfDay = getStartOfDay();
        Timestamp now = new Timestamp(System.currentTimeMillis());
        
        int sentToday = emailLogRepository.countBySentAtBetween(startOfDay, now);
        int remainingDaily = DAILY_LIMIT - sentToday;
        
        // Get hourly count (from memory or database)
        int remainingHourly = HOURLY_LIMIT - emailsSentThisHour.get();
        
        System.out.println("📊 Capacity Check - Daily: " + sentToday + "/" + DAILY_LIMIT + 
                          ", Hourly: " + emailsSentThisHour.get() + "/" + HOURLY_LIMIT);
        
        return Math.min(remainingHourly, remainingDaily);
    }
    
    private Timestamp getStartOfDay() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return new Timestamp(calendar.getTimeInMillis());
    }
    
    private Timestamp getOneHourAgo() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR_OF_DAY, -1);
        return new Timestamp(calendar.getTimeInMillis());
    }
    
    private void scheduleBatchResume(String jobId) {
    Optional<BatchJobEntity> batchJobOpt = batchJobRepository.findById(jobId);
    if (batchJobOpt.isEmpty()) return;
    
    BatchJobEntity batchJob = batchJobOpt.get();
    
    // Update status to WAITING_FOR_RESET - scheduler will pick this up
    batchJob.setStatus("WAITING_FOR_RESET");
    batchJobRepository.save(batchJob);
    
    long resumeDelay = calculateResumeDelay();
    long minutes = resumeDelay / (60 * 1000);
    
    System.out.println("⏳ Job scheduled for resume:");
    System.out.println("   📝 Job: " + batchJob.getJobName());
    System.out.println("   🕐 Expected resume in: " + minutes + " minutes");
    System.out.println("   🔄 Scheduler will pick it up automatically within 5 minutes");
    
    // Optional: Keep immediate scheduling for short delays (< 10 minutes)
    if (resumeDelay <= (10 * 60 * 1000)) {
        System.out.println("   ⚡ Immediate timer set for " + minutes + " minutes");
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                System.out.println("🔄 Immediate resume for: " + batchJob.getJobName());
                processBatchJob(jobId);
            }
        }, resumeDelay);
    }
}

 private long calculateResumeDelay() {
    Timestamp startOfDay = getStartOfDay();
    Timestamp now = new Timestamp(System.currentTimeMillis());
    int sentToday = emailLogRepository.countBySentAtBetween(startOfDay, now);
    
    // Check which limit is blocking us
    boolean dailyLimitReached = sentToday >= DAILY_LIMIT;
    boolean hourlyLimitReached = emailsSentThisHour.get() >= HOURLY_LIMIT;
    
    System.out.println("🔍 Resume Debug - Daily: " + sentToday + "/" + DAILY_LIMIT + 
                      ", Hourly: " + emailsSentThisHour.get() + "/" + HOURLY_LIMIT);
    
    if (dailyLimitReached) {
        // Resume at next day (midnight + 5 minutes)
        Calendar nextDay = Calendar.getInstance();
        nextDay.add(Calendar.DAY_OF_YEAR, 1);
        nextDay.set(Calendar.HOUR_OF_DAY, 1);
        nextDay.set(Calendar.MINUTE, 0);
        nextDay.set(Calendar.SECOND, 0);
        nextDay.set(Calendar.MILLISECOND, 0);
        
        long delay = nextDay.getTimeInMillis() - System.currentTimeMillis();
        System.out.println("📅 Daily limit reached. Resuming at: " + nextDay.getTime());
        return delay;
    } else if (hourlyLimitReached) {
        // Resume after 65 minutes (current behavior)
        System.out.println("⏰ Hourly limit reached. Resuming in 65 minutes");
        return 65 * 60 * 1000;
    } else {
        // If no limits are reached, resume after a short delay (5 minutes)
        System.out.println("⚡ No limits reached. Resuming in 5 minutes");
        return 5 * 60 * 1000; // 5 minutes
    }
    }

    

    public BatchJobStatus getBatchJobStatus(String jobId) {
    // 1️⃣ Try finding a Batch Job
    Optional<BatchJobEntity> batchJobOpt = batchJobRepository.findById(jobId);
    if (batchJobOpt.isPresent()) {
        BatchJobEntity batchJob = batchJobOpt.get();
        Map<String, String> failureReasons = getFailureReasons(batchJob.getId());
        
        return new BatchJobStatus(
            batchJob.getId(),
            batchJob.getJobName(),
            batchJob.getStatus(),
            batchJob.getProgress() == null ? 0 : batchJob.getProgress(),
            batchJob.getTotalEmails(),
            batchJob.getSentCount() == null ? 0 : batchJob.getSentCount(),
            batchJob.getFailedCount() == null ? 0 : batchJob.getFailedCount(),
            batchJob.getTotalEmails() -
                ((batchJob.getSentCount() == null ? 0 : batchJob.getSentCount()) +
                 (batchJob.getFailedCount() == null ? 0 : batchJob.getFailedCount())),
            failureReasons
        );
    }

    // 2️⃣ Try finding a Poster Job if Batch Job not found
    Optional<PosterJobEntity> posterJobOpt = posterJobRepository.findById(jobId);
    if (posterJobOpt.isPresent()) {
        PosterJobEntity posterJob = posterJobOpt.get();

        return new BatchJobStatus(
            posterJob.getId(),
            posterJob.getJobName(),
            posterJob.getStatus(),
            posterJob.getProgress() == null ? 0 : posterJob.getProgress(),
            posterJob.getTotalEmails(),
            posterJob.getSentCount() == null ? 0 : posterJob.getSentCount(),
            posterJob.getFailedCount() == null ? 0 : posterJob.getFailedCount(),
            posterJob.getTotalEmails() -
                ((posterJob.getSentCount() == null ? 0 : posterJob.getSentCount()) +
                 (posterJob.getFailedCount() == null ? 0 : posterJob.getFailedCount())),
            null // Poster jobs don't have failureReasons tracking
        );
    }

    // 3️⃣ Neither found
    return null;
}
    
    private Map<String, String> getFailureReasons(String jobId) {
        List<EmailLogEntity> failedEmails = emailLogRepository.findByBatchJobIdAndStatus(jobId, "FAILED");
        
        Map<String, String> failureReasons = new HashMap<>();
        for (EmailLogEntity log : failedEmails) {
            failureReasons.put(log.getRecipientEmail(), log.getFailureReason());
        }
        return failureReasons;
    }
    
    public List<BatchJobStatus> getAllBatchJobs() {
    List<BatchJobEntity> batchJobs = batchJobRepository.findAllByOrderByCreatedAtDesc();
    List<PosterJobEntity> posterBatchJobs = posterJobRepository.findAllByOrderByCreatedAtDesc();

    List<BatchJobStatus> allJobs = new ArrayList<>();

    // 📨 Add all regular batch email jobs
    allJobs.addAll(batchJobs.stream()
        .map(batchJob -> new BatchJobStatus(
            batchJob.getId(),
            batchJob.getJobName(),
            batchJob.getStatus(),
            batchJob.getProgress() == null ? 0 : batchJob.getProgress(),
            batchJob.getTotalEmails(),
            batchJob.getSentCount() == null ? 0 : batchJob.getSentCount(),
            batchJob.getFailedCount() == null ? 0 : batchJob.getFailedCount(),
            batchJob.getTotalEmails() -
                ((batchJob.getSentCount() == null ? 0 : batchJob.getSentCount()) +
                 (batchJob.getFailedCount() == null ? 0 : batchJob.getFailedCount())),
            getFailureReasons(batchJob.getId())
        ))
        .collect(Collectors.toList())
    );

    // 🖼️ Add all poster jobs (mapped into the same BatchJobStatus structure)
    allJobs.addAll(posterBatchJobs.stream()
        .map(posterJob -> new BatchJobStatus(
            posterJob.getId(),
            posterJob.getJobName(),
            posterJob.getStatus(),
            posterJob.getProgress() == null ? 0 : posterJob.getProgress(),
            posterJob.getTotalEmails(),
            posterJob.getSentCount() == null ? 0 : posterJob.getSentCount(),
            posterJob.getFailedCount() == null ? 0 : posterJob.getFailedCount(),
            posterJob.getTotalEmails() -
                ((posterJob.getSentCount() == null ? 0 : posterJob.getSentCount()) +
                 (posterJob.getFailedCount() == null ? 0 : posterJob.getFailedCount())),
            null // no failure reason tracking for posters
        ))
        .collect(Collectors.toList())
    );

    // ✅ Sort by latest created time (if both entities have createdAt field)
    return allJobs;
    }


    private void resetCountersIfNeeded() {
    long currentTime = System.currentTimeMillis();
    
    // For testing, use 2 minutes; for production use 1 hour
    long resetInterval = 60 * 60 * 1000; // 2 minutes for testing
    
    if (currentTime - lastHourReset > resetInterval) {
        int previousCount = emailsSentThisHour.get();
        emailsSentThisHour.set(0);
        lastHourReset = currentTime;
        System.out.println("🔄 TEST MODE: Hourly email counter reset (was " + previousCount + " emails)");
    }
}

    // NEW: Send with limit enforcement (updated with database logging)
    @Async
    public BulkSendResult sendMailToAllUsersWithLimits(String subject, String message, String featuresJson) {
        List<UnsubscribeService.SubscriberInfo> subscribers = unsubscribeService.getActiveSubscribers();
        
        if (subscribers.isEmpty()) {
            System.out.println("⚠️ No active subscribers found.");
            return new BulkSendResult(0, 0, 0, "No subscribers found");
        }

        System.out.println("🚀 ========== STARTING LIMITED BULK EMAIL SEND ==========");
        System.out.println("📧 Subject: " + subject);

        resetCountersIfNeeded();
        int canSendNow = calculateSendCapacity();
        canSendNow = Math.min(canSendNow, subscribers.size());
        
        System.out.println("📦 Can send " + canSendNow + " emails now");
        
        if (canSendNow <= 0) {
            System.out.println("❌ Cannot send any emails - limits reached");
            return new BulkSendResult(0, 0, subscribers.size(), "Daily limit reached");
        }

        int successCount = 0;
        int failCount = 0;

        for (int i = 0; i < canSendNow; i++) {
            UnsubscribeService.SubscriberInfo subscriber = subscribers.get(i);
            try {
                sendMail(subscriber.getEmail(), subscriber.getName(), subject, message, featuresJson);
                successCount++;
                emailsSentThisHour.incrementAndGet();
                
                System.out.println("✅ [" + successCount + "/" + canSendNow + "] Sent to: " + subscriber.getEmail());
                
                // Delay between emails
                Thread.sleep(3000);
                
            } catch (Exception e) {
                failCount++;
                System.err.println("❌ Failed to send to " + subscriber.getEmail() + ": " + e.getMessage());
            }
        }
        
        int remaining = subscribers.size() - canSendNow;
        String messageText = remaining > 0 ? 
            remaining + " emails will be sent after limit reset" : "All emails sent successfully";
            
        System.out.println("📊 Limited Send Summary:");
        System.out.println("✅ Successful: " + successCount);
        System.out.println("❌ Failed: " + failCount);
        System.out.println("⏳ Remaining: " + remaining);
        System.out.println("🚀 ========== LIMITED BULK EMAIL COMPLETED ==========");
        
        return new BulkSendResult(successCount, failCount, remaining, messageText);
    }

    // Existing methods remain the same
    @Async
    public void sendMailToAllUsers(String subject, String message, String featuresJson) {
        List<UnsubscribeService.SubscriberInfo> subscribers = unsubscribeService.getActiveSubscribers();
        
        if (subscribers.isEmpty()) {
            System.out.println("⚠️ No active subscribers found. Skipping email send.");
            return;
        }

        System.out.println("🚀 ========== STARTING BULK EMAIL SEND ==========");
        System.out.println("📧 Subject: " + subject);
        System.out.println("📝 Message: " + message);
        
        if (featuresJson != null && !featuresJson.isEmpty()) {
            System.out.println("📋 Features JSON received");
            try {
                List<Feature> features = objectMapper.readValue(featuresJson, new TypeReference<List<Feature>>() {});
                System.out.println("🔍 Parsed " + features.size() + " features:");
                for (Feature feature : features) {
                    System.out.println("   📝 " + feature.getName());
                }
            } catch (Exception e) {
                System.err.println("❌ Error parsing features JSON: " + e.getMessage());
            }
        } else {
            System.out.println("ℹ️ No features provided");
        }

        int successCount = 0;
        int failCount = 0;

        for (UnsubscribeService.SubscriberInfo subscriber : subscribers) {
            try {
                sendMail(subscriber.getEmail(), subscriber.getName(), subject, message, featuresJson);
                successCount++;
                System.out.println("✅ Successfully sent to: " + subscriber.getEmail() + " (" + subscriber.getName() + ")");
                
                // Add delay to respect limits
                Thread.sleep(3000);
                
            } catch (Exception e) {
                failCount++;
                System.err.println("❌ Failed to send to " + subscriber.getEmail() + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
        System.out.println("📊 Email Send Summary:");
        System.out.println("✅ Successful: " + successCount);
        System.out.println("❌ Failed: " + failCount);
        System.out.println("🎯 Total Active Subscribers: " + subscribers.size());
        System.out.println("🚀 ========== BULK EMAIL COMPLETED ==========");
    }

    @Async
    public void sendMail(String to, String receiverName, String subject, String message, String featuresJson) {
        if (!unsubscribeService.isSubscribed(to)) {
            System.out.println("⏭️ Skipping email to unsubscribed user: " + to);
            return;
        }

        System.out.println("📨 Attempting to send email to: " + to);
        
        try {
            MimeMessage mimeMessage = bigrockSupportSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            System.out.println("🛠️ Building email content...");
            String unsubscribeToken = unsubscribeService.generateUnsubscribeToken(to);
            String htmlContent = buildEnhancedEmail(receiverName, subject, message, featuresJson, to, unsubscribeToken);
            System.out.println("📄 Email content built successfully");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("support@cmdahub.com", "CMDA Support");
            helper.setText(htmlContent, true);

            System.out.println("📤 Sending email via JavaMailSender...");
            bigrockSupportSender.send(mimeMessage);
            System.out.println("✅ Email sent successfully to: " + to);

        } catch (Exception e) {
            // ❌ DO NOT THROW
            System.err.println("❌ Email failed for " + to);
            e.printStackTrace();

            // ✅ Optionally log to DB / monitoring
        }
//        } catch (MessagingException | UnsupportedEncodingException e) {
//            System.err.println("❌ Messaging error for " + to + ": " + e.getMessage());
//            e.printStackTrace();
//            throw new RuntimeException("Failed to send email to " + to, e);
//        } catch (Exception e) {
//            System.err.println("❌ Unexpected error for " + to + ": " + e.getMessage());
//            e.printStackTrace();
//            throw new RuntimeException("Unexpected error sending email to " + to, e);
//        }
    }


    // Support email template
    private String buildSupportEmail(String receiverName, String subject, String message, String email, String unsubscribeToken) {
        return buildCompleteEmailTemplateForWithoutFeature(receiverName, subject, message, "", email, unsubscribeToken);
    }

    // Enhanced main email template
    private String buildEnhancedEmail(String receiverName, String subject, String message, 
                                   String featuresJson, String email, String unsubscribeToken) {
        StringBuilder featuresHtml = new StringBuilder();
        int featureCount = 0;

        try {
            if (featuresJson != null && !featuresJson.isEmpty()) {
                List<Feature> features = objectMapper.readValue(featuresJson, new TypeReference<List<Feature>>() {});
                featureCount = features.size();
                
                for (int i = 0; i < features.size(); i++) {
                    Feature feature = features.get(i);
                    featuresHtml.append(buildImprovedFeatureHtml(feature, i));
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Error building email template: " + e.getMessage());
            featuresHtml.append(getDefaultFeatureHtml());
        }

        if (featureCount == 0) {
            return buildCompleteEmailTemplateForWithoutFeature(receiverName, subject, message, featuresHtml.toString(), email, unsubscribeToken);
        }
        
        return buildCompleteEmailTemplateForFeature(receiverName, subject, message, featuresHtml.toString(), email, unsubscribeToken);
    }

    
public int getEmailsSentToday() {
    try {
        Timestamp startOfDay = getStartOfDay();
        Timestamp now = new Timestamp(System.currentTimeMillis());
        
        // Count emails from both normal and poster email logs
        int normalSent = emailLogRepository.countBySentAtBetween(startOfDay, now);
        int posterSent = posterEmailLogRepository.countBySentAtBetween(startOfDay, now);
        
        return normalSent + posterSent;
    } catch (Exception e) {
        System.err.println("❌ Error getting emails sent today: " + e.getMessage());
        return 0;
    }
}

// Get email success rate (Batch + Poster combined)
public int getEmailSuccessRate() {
    try {
        Timestamp startOfDay = getStartOfDay();
        Timestamp now = new Timestamp(System.currentTimeMillis());
        
        // Normal batch jobs
        int totalBatch = emailLogRepository.countBySentAtBetween(startOfDay, now);
        int successfulBatch = emailLogRepository.countByStatusAndSentAtBetween("SENT", startOfDay, now);
        
        // Poster email jobs
        int totalPoster = posterEmailLogRepository.countBySentAtBetween(startOfDay, now);
        int successfulPoster = posterEmailLogRepository.countByStatusAndSentAtBetween("SENT", startOfDay, now);
        
        int totalSent = totalBatch + totalPoster;
        int successful = successfulBatch + successfulPoster;
        
        if (totalSent == 0) return 100; // No emails sent, assume perfect success
        return (int) ((successful * 100.0) / totalSent);
    } catch (Exception e) {
        System.err.println("❌ Error calculating success rate: " + e.getMessage());
        return 95; // Default fallback
    }
}

// Get active batch + poster jobs count
public int getActiveBatchJobsCount() {
    try {
        List<String> activeStatuses = Arrays.asList("CREATED", "PROCESSING", "WAITING_FOR_RESET");
        
        int activeBatchJobs = batchJobRepository.findByStatusIn(activeStatuses).size();
        int activePosterJobs = posterJobRepository.findByStatusIn(activeStatuses).size();
        
        return activeBatchJobs + activePosterJobs;
    } catch (Exception e) {
        System.err.println("❌ Error getting active jobs count: " + e.getMessage());
        return 0;
    }
}


        private Set<String> getAlreadyProcessedEmails(String batchJobId) {
            try {
                // Use the optimized query if available, otherwise fall back
                List<String> processedEmails = emailLogRepository.findRecipientEmailsByBatchJobId(batchJobId);
                return new HashSet<>(processedEmails);
            } catch (Exception e) {
                System.err.println("❌ Error fetching processed emails, using fallback: " + e.getMessage());
                // Fallback: query all logs and extract emails
                List<EmailLogEntity> processedLogs = emailLogRepository.findByBatchJobId(batchJobId);
                return processedLogs.stream()
                    .map(EmailLogEntity::getRecipientEmail)
                    .collect(Collectors.toSet());
            }
        }

        // Get total subscribers
        public int getTotalSubscribers() {
            try {
                List<UnsubscribeService.SubscriberInfo> subscribers = unsubscribeService.getActiveSubscribers();
                return subscribers.size();
            } catch (Exception e) {
                System.err.println("❌ Error getting total subscribers: " + e.getMessage());
                return 0;
            }
        }

        public boolean deleteJobById(String jobId) {
    try {
        // 1️⃣ Try deleting from BatchJob table
        if (batchJobRepository.existsById(jobId)) {
            batchJobRepository.deleteById(jobId);
            System.out.println("🗑️ Deleted BatchJob with ID: " + jobId);
            return true;
        }

        // 2️⃣ Try deleting from PosterJob table
        if (posterJobRepository.existsById(jobId)) {
            posterJobRepository.deleteById(jobId);
            System.out.println("🗑️ Deleted PosterJob with ID: " + jobId);
            return true;
        }

        // 3️⃣ Not found in either
        System.out.println("⚠️ No job found with ID: " + jobId);
        return false;

    } catch (Exception e) {
        System.err.println("❌ Error deleting job with ID " + jobId + ": " + e.getMessage());
        throw new RuntimeException("Failed to delete job: " + e.getMessage(), e);
    }
}

    // Unified email template builder
    private String buildCompleteEmailTemplateForFeature(String receiverName, String subject, String message, 
                                           String featuresHtml, String email, String unsubscribeToken) {
        
        String unsubscribeLink = "https://cmdahub.com/api/unsubscribe?token=" + unsubscribeToken + "&email=" + email;
        
        return "<!DOCTYPE html>" +
               "<html lang=\"en\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">" +
               "<head>" +
               "<meta charset=\"UTF-8\">" +
               "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
               "<meta name=\"x-apple-disable-message-reformatting\">" +
               "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">" +
               "<title>" + escapeHtml(subject) + "</title>" +
               "<style type=\"text/css\">" +
               "/* RESET STYLES */" +
               "body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #F9FAFB; }" +
               "table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }" +
               "img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }" +
               "p { display: block; margin: 13px 0; }" +
               "/* DARK MODE SUPPORT */" +
               "@media (prefers-color-scheme: dark) {" +
               "  .dark-mode-bg { background-color: #111827 !important; }" +
               "  .dark-mode-card { background-color: #1F2937 !important; }" +
               "  .dark-mode-text { color: #F9FAFB !important; }" +
               "  .dark-mode-secondary { color: #D1D5DB !important; }" +
               "  .dark-mode-border { border-color: #374151 !important; }" +
               "}" +
               "/* MOBILE STYLES */" +
               "@media only screen and (max-width: 480px) {" +
               "  body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: none !important; }" +
               "  body { width: 100% !important; min-width: 100% !important; }" +
               "  .mobile-full { width: 100% !important; }" +
               "  .mobile-padding { padding: 20px !important; }" +
               "  .mobile-center { text-align: center !important; }" +
               "  .mobile-block { display: block !important; width: 100% !important; }" +
               "  .mobile-hide { display: none !important; }" +
               "  .mobile-feature { display: block !important; width: 100% !important; padding: 15px 0 !important; }" +
               "  .social-icon { margin: 0 4px !important; }" +
               "}" +
               "/* OUTLOOK FIXES */" +
               ".outer-table { width: 100% !important; max-width: 600px !important; }" +
               "</style>" +
               "</head>" +
               "<body style=\"margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\">" +
               
               "<!--[if mso]>" +
               "<style type=\"text/css\">" +
               "body, table, td {font-family: Arial, Helvetica, sans-serif !important;}" +
               ".outer-table { width: 100% !important; max-width: 600px !important; }" +
               "</style>" +
               "<![endif]-->" +
               
               "<!-- MAIN CONTAINER -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" bgcolor=\"#F9FAFB\" class=\"dark-mode-bg\">" +
               "<tr>" +
               "<td align=\"center\" valign=\"top\" style=\"padding: 40px 20px;\">" +
               
               "<!-- CONTENT WRAPPER -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" class=\"outer-table\">" +
               "<tr>" +
               "<td align=\"center\" valign=\"top\">" +
               
               buildImprovedHeaderSection(subject) +
               buildBodySectionForFeature(receiverName, subject, message, featuresHtml) +
               buildImprovedFooterSection(email, unsubscribeLink) +
               
               "</td>" +
               "</tr>" +
               "</table>" +
               "</td>" +
               "</tr>" +
               "</table>" +
               "</body>" +
               "</html>";
    }

    // Unified email template builder
    private String buildCompleteEmailTemplateForWithoutFeature(String receiverName, String subject, String message, 
                                           String featuresHtml, String email, String unsubscribeToken) {
        
        String unsubscribeLink = "https://cmdahub.com/api/unsubscribe?token=" + unsubscribeToken + "&email=" + email;
        
        return "<!DOCTYPE html>" +
               "<html lang=\"en\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">" +
               "<head>" +
               "<meta charset=\"UTF-8\">" +
               "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
               "<meta name=\"x-apple-disable-message-reformatting\">" +
               "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">" +
               "<title>" + escapeHtml(subject) + "</title>" +
               "<style type=\"text/css\">" +
               "/* RESET STYLES */" +
               "body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #F9FAFB; }" +
               "table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }" +
               "img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }" +
               "p { display: block; margin: 13px 0; }" +
               "/* DARK MODE SUPPORT */" +
               "@media (prefers-color-scheme: dark) {" +
               "  .dark-mode-bg { background-color: #111827 !important; }" +
               "  .dark-mode-card { background-color: #1F2937 !important; }" +
               "  .dark-mode-text { color: #F9FAFB !important; }" +
               "  .dark-mode-secondary { color: #D1D5DB !important; }" +
               "  .dark-mode-border { border-color: #374151 !important; }" +
               "}" +
               "/* MOBILE STYLES */" +
               "@media only screen and (max-width: 480px) {" +
               "  body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: none !important; }" +
               "  body { width: 100% !important; min-width: 100% !important; }" +
               "  .mobile-full { width: 100% !important; }" +
               "  .mobile-padding { padding: 20px !important; }" +
               "  .mobile-center { text-align: center !important; }" +
               "  .mobile-block { display: block !important; width: 100% !important; }" +
               "  .mobile-hide { display: none !important; }" +
               "  .mobile-feature { display: block !important; width: 100% !important; padding: 15px 0 !important; }" +
               "  .social-icon { margin: 0 4px !important; }" +
               "}" +
               "/* OUTLOOK FIXES */" +
               ".outer-table { width: 100% !important; max-width: 600px !important; }" +
               "</style>" +
               "</head>" +
               "<body style=\"margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\">" +
               
               "<!--[if mso]>" +
               "<style type=\"text/css\">" +
               "body, table, td {font-family: Arial, Helvetica, sans-serif !important;}" +
               ".outer-table { width: 100% !important; max-width: 600px !important; }" +
               "</style>" +
               "<![endif]-->" +
               
               "<!-- MAIN CONTAINER -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" bgcolor=\"#F9FAFB\" class=\"dark-mode-bg\">" +
               "<tr>" +
               "<td align=\"center\" valign=\"top\" style=\"padding: 40px 20px;\">" +
               
               "<!-- CONTENT WRAPPER -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" class=\"outer-table\">" +
               "<tr>" +
               "<td align=\"center\" valign=\"top\">" +
               
               buildImprovedHeaderSection(subject) +
               buildBodySectionForWithoutFeature(receiverName, subject, message) +
               buildImprovedFooterSection(email, unsubscribeLink) +
               
               "</td>" +
               "</tr>" +
               "</table>" +
               "</td>" +
               "</tr>" +
               "</table>" +
               "</body>" +
               "</html>";
    }

    private String buildImprovedHeaderSection(String subject) {
        return "<!-- HEADER SECTION -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" bgcolor=\"#E0F2FE\" style=\"background-color: #E0F2FE; border-radius: 16px 16px 0 0; border: 1px solid #BAE6FD;\">" +
               "<!--[if gte mso 9]>" +
               "<v:rect xmlns:v=\"urn:schemas-microsoft-com:vml\" fill=\"true\" stroke=\"false\" style=\"width:600px;height:150px;\">" +
               "<v:fill type=\"gradient\" color=\"#F0F9FF\" color2=\"#E0F2FE\" angle=\"135\" />" +
               "<v:textbox inset=\"0,0,0,0\">" +
               "<![endif]-->" +
               "<tr>" +
               "<td align=\"center\" valign=\"middle\" style=\"padding: 50px 20px;\">" +
               
               "<!-- Logo Section -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" role=\"presentation\" style=\"margin-bottom: 20px;\">" +
               "<tr>" +
               "<td bgcolor=\"#5ce4f6ff\" style=\"background-color: #3562eb; border-radius: 14px; padding: 16px 20px; vertical-align: middle;\">" +
               "<span style=\"font-size: 28px; font-weight: bold; color: #FFFFFF; font-family: Arial, Helvetica, sans-serif;\">CMDA</span>" +
               "</td>" +
               "<td style=\"padding-left: 8px; vertical-align: middle;\">" +
               "<span style=\"font-size: 28px; font-weight: bold; color: #3562eb; font-family: Arial, Helvetica, sans-serif;\">Hub</span>" +
               "</td>" +
               "</tr>" +
               "</table>" +
               
               "<!-- Tagline -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\">" +
               "<tr>" +
               "<td align=\"center\" style=\"font-size: 18px; color: #64748b; font-weight: 600; font-family: Arial, Helvetica, sans-serif;\">" +
               "Excellence in Every Investment Decision" +
               "</td>" +
               "</tr>" +
               "</table>" +
               
               "</td>" +
               "</tr>" +
               "<!--[if gte mso 9]>" +
               "</v:textbox>" +
               "</v:rect>" +
               "<![endif]-->" +
               "</table>";
    }

    
    private String buildBodySectionForFeature(String receiverName, String subject, String message, String featuresHtml) {
    return "<!-- MAIN CONTENT CARD -->" +
           "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" bgcolor=\"#FFFFFF\" class=\"dark-mode-card\" style=\"border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 16px 16px;\">" +
           
           "<!-- GREETING SECTION -->" +
           "<tr>" +
           "<td align=\"left\" valign=\"top\" style=\"padding: 40px 40px 20px 40px;\">" +
           "<h2 style=\"font-size: 28px; font-weight: 800; margin: 0 0 20px 0; color: #111827; line-height: 1.2; letter-spacing: -0.5px;\">" + escapeHtml(subject) + "</h2>" +
           "<p style=\"font-size: 16px; margin: 0 0 12px 0; color: #6B7280; line-height: 1.6;\">Hello <strong style=\"color: #111827;\">" + escapeHtml(receiverName) + "</strong>,</p>" +
           
           "<!-- MESSAGE CONTAINER - PRESERVES FORMATTING -->" +
           "<pre style=\"font-size: 15px; margin: 0 0 30px 0; color: #2D3748; line-height: 1.7; font-family: Arial, Helvetica, sans-serif; background: #fafafa; padding: 22px; border: 1px solid #E2E8F0; border-radius: 8px; white-space: pre-wrap; word-wrap: break-word; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; display: block;\">" + 
           escapeHtml(message) + 
           "</pre>" +
           
           "<!-- PRIMARY CTA BUTTON -->" +
           "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin: 30px 0;\">" +
           "<tr>" +
           "<td align=\"center\" valign=\"middle\">" +
           "<a href=\"https://cmdahub.com\" style=\"background: linear-gradient(135deg, #7C3AED, #6D28D9); border: none; border-radius: 12px; color: #FFFFFF; display: inline-block; font-size: 16px; font-weight: 700; padding: 16px 32px; text-decoration: none; -webkit-text-size-adjust: none; transition: all 0.3s ease;\">🚀 Explore New Features</a>" +
           "</td>" +
           "</tr>" +
           "</table>" +
           "</td>" +
           "</tr>" +
           
           "<!-- FEATURES SECTION -->" +
           "<tr>" +
           "<td align=\"left\" valign=\"top\" style=\"padding: 0 40px 40px 40px;\">" +
           "<h3 style=\"font-size: 24px; font-weight: 700; text-align: center; margin: 0 0 30px 0; color: #111827; letter-spacing: -0.5px;\">What's New in CMDA</h3>" +
           
           "<!-- FEATURES CONTAINER -->" +
           "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">" +
           featuresHtml +

           
           "<!-- SIGNATURE SECTION -->" +
           "<tr>" +
           "<td align=\"left\" valign=\"top\" style=\"padding: 0 40px 40px 40px;\">" +
           "<p style=\"font-size: 16px; margin: 0; color: #111827; line-height: 1.6; font-weight: 700;\">CMDAHub Team</p>" +
           "</td>" +
           "</tr>" +
           "</table>" +
           "</td>" +
           "</tr>" +
           
       
           
           "<!-- SECONDARY CTA -->" +
           "<tr>" +
           "<td align=\"center\" valign=\"top\" style=\"padding: 40px; background: linear-gradient(135deg, #F8FAFC, #F0FDF4); border-radius: 0 0 16px 16px;\">" +
           "<h3 style=\"font-size: 22px; font-weight: 700; margin: 0 0 16px 0; color: #111827;\">Ready to Get Started?</h3>" +
           "<p style=\"font-size: 16px; margin: 0 0 24px 0; color: #6B7280; line-height: 1.5;\">Join thousands of smart investors already using CMDA</p>" +
           "<!-- SECONDARY CTA BUTTON -->" +
           "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">" +
           "<tr>" +
           "<td align=\"center\" valign=\"middle\">" +
           "<a href=\"https://cmdahub.com\" style=\"background: #FFFFFF; border: 2px solid #7C3AED; border-radius: 12px; color: #7C3AED; display: inline-block; font-size: 16px; font-weight: 700; padding: 14px 28px; text-decoration: none; -webkit-text-size-adjust: none; transition: all 0.3s ease;\"> Click To Know More </a>" +
           "</td>" +
           "</tr>" +
           "</table>" +
           "</td>" +
           "</tr>" +
           "</table>";
}

    private String buildBodySectionForWithoutFeature(String receiverName, String subject, String message) {
        return "<!-- MAIN CONTENT CARD -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" bgcolor=\"#FFFFFF\" class=\"dark-mode-card\" style=\"border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 16px 16px;\">" +
               
               "<!-- GREETING SECTION -->" +
               "<tr>" +
               "<td align=\"left\" valign=\"top\" style=\"padding: 40px 40px 20px 40px;\">" +
               "<h2 style=\"font-size: 28px; font-weight: 800; margin: 0 0 20px 0; color: #111827; line-height: 1.2; letter-spacing: -0.5px;\">" + escapeHtml(subject) + "</h2>" +
               "<p style=\"font-size: 16px; margin: 0 0 12px 0; color: #6B7280; line-height: 1.6;\">Hello <strong style=\"color: #111827;\">" + escapeHtml(receiverName) + "</strong>,</p>" +
            //    "<div style=\"font-size: 15px; margin: 0 0 30px 0; color: #2D3748; line-height: 1.7; white-space: pre-wrap; font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; background: #fafafa; padding: 22px; border: 1px solid #E2E8F0; border-radius: 8px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.04); min-height: 100px; font-weight: 400;\">" + message + "</div>" +
             "<!-- MESSAGE CONTAINER - PRESERVES FORMATTING -->" +
           "<pre style=\"font-size: 15px; margin: 0 0 30px 0; color: #2D3748; line-height: 1.7; font-family: Arial, Helvetica, sans-serif; background: #fafafa; padding: 22px; border: 1px solid #E2E8F0; border-radius: 8px; white-space: pre-wrap; word-wrap: break-word; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; display: block;\">" + 
           escapeHtml(message) + 
           "</pre>" +
               "</td>" +
               "</tr>" +   
               "<!-- SIGNATURE -->" +
                "<tr>" +
                "<td align=\"left\" valign=\"top\" style=\"padding: 0 40px 30px 40px;\">" +
                "<p style=\"font-size: 16px; margin: 0; color: #111827; line-height: 1.6; font-weight: 700;\">CMDAHub Team</p>" +
                "</td>" +
                "</tr>" +
               "<!-- SECONDARY CTA -->" +
               "<tr>" +
               "<td align=\"center\" valign=\"top\" style=\"padding: 40px; background: linear-gradient(135deg, #F8FAFC, #F0FDF4); border-radius: 0 0 16px 16px;\">" +
               "<h3 style=\"font-size: 22px; font-weight: 700; margin: 0 0 16px 0; color: #111827;\">Ready to Get Started?</h3>" +
               "<p style=\"font-size: 16px; margin: 0 0 24px 0; color: #6B7280; line-height: 1.5;\">Join thousands of smart investors already using CMDA</p>" +
               "<!-- SECONDARY CTA BUTTON -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">" +
               "<tr>" +
               "<td align=\"center\" valign=\"middle\">" +
               "<a href=\"https://cmdahub.com\" style=\"background: #FFFFFF; border: 2px solid #7C3AED; border-radius: 12px; color: #7C3AED; display: inline-block; font-size: 16px; font-weight: 700; padding: 14px 28px; text-decoration: none; -webkit-text-size-adjust: none; transition: all 0.3s ease;\"> Click To Know More </a>" +
               "</td>" +
               "</tr>" +
               "</table>" +
               "</td>" +
               "</tr>" +
               "</table>";
    }

    
    private String buildImprovedFeatureHtml(Feature feature, int index) {
        String[] colors = {"#7C3AED", "#059669", "#DC2626", "#EA580C", "#0891B2", "#9333EA"};
        String color = colors[index % colors.length];
        
        return "<!-- FEATURE ROW -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"margin-bottom: 12px;\">" +
               "<tr>" +
               "<td bgcolor=\"#FFFFFF\" style=\"background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px;\" class=\"mobile-padding\">" +
               
               "<!-- Feature Content Table -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\">" +
               "<tr>" +
               "<!-- Icon Cell -->" +
               "<td width=\"60\" align=\"left\" valign=\"top\" style=\"padding-right: 16px;\" class=\"mobile-block\">" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\">" +
               "<tr>" +
               "<td width=\"48\" height=\"48\" bgcolor=\"" + color + "\" style=\"background-color: " + color + "; border-radius: 10px; text-align: center; vertical-align: middle; font-size: 18px; font-weight: bold; color: #FFFFFF; font-family: Arial, Helvetica, sans-serif;\">" +
               (index + 1) +
               "</td>" +
               "</tr>" +
               "</table>" +
               "</td>" +
               
               "<!-- Text Cell -->" +
               "<td align=\"left\" valign=\"top\" class=\"mobile-block\">" +
               "<h4 style=\"font-size: 18px; font-weight: bold; margin: 0 0 8px 0; padding: 0; color: #111827; font-family: Arial, Helvetica, sans-serif;\">" +
               escapeHtml(feature.getName()) +
               "</h4>" +
               "<p style=\"font-size: 15px; line-height: 1.5; margin: 0; padding: 0; color: #6B7280; font-family: Arial, Helvetica, sans-serif;\">" +
               escapeHtml(feature.getDescription()) +
               "</p>" +
               "</td>" +
               "</tr>" +
               "</table>" +
               
               "</td>" +
               "</tr>" +
               "</table>";
    }

    private String getDefaultFeatureHtml() {
        return "<!-- DEFAULT FEATURE ROW -->" +
               "<tr>" +
               "<td align=\"left\" valign=\"top\" class=\"mobile-feature\" style=\"padding: 20px; border: 1px solid #E5E7EB; border-radius: 12px; background-color: #FFFFFF; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);\">" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">" +
               "<tr>" +
               "<td align=\"left\" valign=\"top\" width=\"48\" style=\"padding-right: 16px;\">" +
               "<div style=\"width: 48px; height: 48px; background-color: #7C3AED; border-radius: 10px; text-align: center; line-height: 48px; color: #FFFFFF; font-weight: bold; font-size: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);\">1</div>" +
               "</td>" +
               "<td align=\"left\" valign=\"top\">" +
               "<h4 style=\"font-size: 18px; font-weight: 700; margin: 0 0 8px 0; color: #111827; line-height: 1.3;\">New Features Available</h4>" +
               "<p style=\"font-size: 15px; margin: 0; color: #6B7280; line-height: 1.5;\">We're constantly improving our platform with new features and enhancements to serve you better.</p>" +
               "</td>" +
               "</tr>" +
               "</table>" +
               "</td>" +
               "</tr>";
    }

    private String buildImprovedFooterSection(String email, String unsubscribeLink) {
        return "<!-- FOOTER -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" bgcolor=\"#e0f7fe\" style=\"border-radius: 16px; margin-top: 24px; border: 1px solid #b3e5fc;\">" +
               "<tr>" +
               "<td align=\"center\" valign=\"top\" style=\"padding: 40px 20px;\">" +
               
               "<!-- SOCIAL LINKS -->" +
               "<h4 style=\"font-size: 18px; font-weight: 700; margin: 0 0 24px 0; color: #01579b; letter-spacing: -0.5px;\">Join Our Community</h4>" +
               
               "<!-- SOCIAL ICONS -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin: 0 auto 30px auto;\">" +
               "<tr>" +
               "<td align=\"center\" valign=\"middle\" style=\"padding: 0 8px;\">" +
               "<a href=\"https://www.facebook.com/people/Ayc-Analytics/61577860989803/\" style=\"text-decoration: none; display: inline-block;\">" +
               "<img src=\"https://cdn-icons-png.flaticon.com/512/124/124010.png\" width=\"30\" height=\"30\" alt=\"Facebook\" style=\"display: block; border-radius: 20%; border: none;\">" +
               "</a>" +
               "</td>" +
               "<td align=\"center\" valign=\"middle\" style=\"padding: 0 8px;\">" +
               "<a href=\"https://www.linkedin.com/company/ayc-analytics-business-intelligence\" style=\"text-decoration: none; display: inline-block;\">" +
               "<img src=\"https://cdn-icons-png.flaticon.com/512/174/174857.png\" width=\"30\" height=\"30\" alt=\"LinkedIn\" style=\"display: block; border-radius: 20%; border: none;\">" +
               "</a>" +
               "</td>" +
               "<td align=\"center\" valign=\"middle\" style=\"padding: 0 8px;\">" +
               "<a href=\"https://www.instagram.com/aycanalytics_/\" style=\"text-decoration: none; display: inline-block;\">" +
               "<img src=\"https://cdn-icons-png.flaticon.com/512/174/174855.png\" width=\"30\" height=\"30\" alt=\"Instagram\" style=\"display: block; border-radius: 20%; border: none;\">" +
               "</a>" +
               "</td>" +
               "<td align=\"center\" valign=\"middle\" style=\"padding: 0 8px;\">" +
               "<a href=\"https://www.youtube.com/@aYc_Analytics_Pvt_Ltd\" style=\"text-decoration: none; display: inline-block;\">" +
               "<img src=\"https://cdn-icons-png.flaticon.com/512/174/174883.png\" width=\"30\" height=\"30\" alt=\"YouTube\" style=\"display: block; border-radius: 20%; border: none;\">" +
               "</a>" +
               "</td>" +
               "</tr>" +
               "</table>" +
               
               "<!-- COMPANY ADDRESS -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin: 20px auto 24px auto; color: #01579b;\">" +
               "<tr>" +
               "<td align=\"center\" valign=\"top\">" +
               "<p style=\"font-size: 16px; margin: 0 0 10px 0; line-height: 1.6; font-weight: 600; color: #01579b;\">" +
               "AYC Analytics Pvt. Ltd." +
               "</p>" +
               "<p style=\"font-size: 14px; margin: 0; line-height: 1.5; color: #0277bd;\">" +
               "aYc Analytics 3rd floor, Incube co-working space, next to Medipoint Hospital, opposite to Bank of Baroda ATM<br>" +
               "<span style=\"color: #0288d1;\">Tejaswini Housing Society, Aundh, Pune</span><br>" +
               "<span style=\"color: #0288d1;\">Maharashtra 411045</span>" +
               "</p>" +
               "</td>" +
               "</tr>" +
               "</table>" +
               
               "<!-- LEGAL LINKS -->" +
               "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin: 24px auto; border-top: 1px solid #81d4fa; padding-top: 20px; min-width: 300px;\">" +
               "<tr>" +
               "<td align=\"center\" valign=\"middle\" style=\"padding: 0 8px; white-space: nowrap;\">" +
               "<a href=\"https://cmdahub.com/terms\" style=\"color: #0277bd; font-size: 10px; text-decoration: none; font-weight: 500; white-space: nowrap;\">Privacy Policy</a>" +
               "</td>" +
               "<td align=\"center\" valign=\"middle\" style=\"padding: 0 8px; white-space: nowrap;\">" +
               "<a href=\"https://cmdahub.com/terms\" style=\"color: #0277bd; font-size: 10px; text-decoration: none; font-weight: 500; white-space: nowrap;\">Terms of Service</a>" +
               "</td>" +
               "<td align=\"center\" valign=\"middle\" style=\"padding: 0 8px; white-space: nowrap;\">" +
               "<a href=\"https://cmdahub.com/about\" style=\"color: #0277bd; font-size: 10px; text-decoration: none; font-weight: 500; white-space: nowrap;\">Contact Us</a>" +
               "</td>" +
               "<td align=\"center\" valign=\"middle\" style=\"padding: 0 8px; white-space: nowrap;\">" +
               "<a href=\"https://cmdahub.com/about\" style=\"color: #0277bd; font-size: 10px; text-decoration: none; font-weight: 500; white-space: nowrap;\">About Us</a>" +
               "</td>" +
               "</tr>" +
               "</table>" +
               
               "<!-- LEGAL TEXT -->" +
               "<p style=\"color: #0288d1; font-size: 13px; margin: 20px 0 20px 0; line-height: 1.5; font-weight: 500;\">" +
               "You're receiving this email because you signed up for cmdahub.com" +
               "</p>" +
               
               "<!-- COPYRIGHT -->" +
               "<p style=\"color: #01579b; font-size: 12px; margin: 20px 0 0 0; line-height: 1.5; font-weight: 500;\">" +
               "© 2025 AYC Analytics Pvt. Ltd. All rights reserved. | " +
               "<a href=\"" + unsubscribeLink + "\" style=\"color: #0277bd; font-size: 12px; text-decoration: underline; font-weight: 500;\">Unsubscribe</a>" +
               "</p>" +
               "</td>" +
               "</tr>" +
               "</table>";
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                  .replace("<", "&lt;")
                  .replace(">", "&gt;")
                  .replace("\"", "&quot;")
                  .replace("'", "&#39;");
    }

    // DTO Classes for batch processing
    public class BatchJobStatus {
        private String jobId;
        private String jobName;
        private String status;
        private int progress;
        private int totalEmails;
        private int sentCount;
        private int failedCount;
        private int remainingCount;
        private Map<String, String> failureReasons;
        
        public BatchJobStatus(String jobId, String jobName, String status, int progress, 
                            int totalEmails, int sentCount, int failedCount, 
                            int remainingCount, Map<String, String> failureReasons) {
            this.jobId = jobId;
            this.jobName = jobName;
            this.status = status;
            this.progress = progress;
            this.totalEmails = totalEmails;
            this.sentCount = sentCount;
            this.failedCount = failedCount;
            this.remainingCount = remainingCount;
            this.failureReasons = failureReasons;
        }
        
        // Getters
        public String getJobId() { return jobId; }
        public String getJobName() { return jobName; }
        public String getStatus() { return status; }
        public int getProgress() { return progress; }
        public int getTotalEmails() { return totalEmails; }
        public int getSentCount() { return sentCount; }
        public int getFailedCount() { return failedCount; }
        public int getRemainingCount() { return remainingCount; }
        public Map<String, String> getFailureReasons() { return failureReasons; }
    }
    
    public class BulkSendResult {
        private int successCount;
        private int failCount;
        private int remainingEmails;
        private String message;
        
        public BulkSendResult(int successCount, int failCount, int remainingEmails, String message) {
            this.successCount = successCount;
            this.failCount = failCount;
            this.remainingEmails = remainingEmails;
            this.message = message;
        }
        
        // Getters
        public int getSuccessCount() { return successCount; }
        public int getFailCount() { return failCount; }
        public int getRemainingEmails() { return remainingEmails; }
        public String getMessage() { return message; }
    }
}

// Feature class
@JsonIgnoreProperties(ignoreUnknown = true)
class Feature {
    private String id;
    private String name;
    private String description;
    private int orderIndex;

    public Feature() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
}