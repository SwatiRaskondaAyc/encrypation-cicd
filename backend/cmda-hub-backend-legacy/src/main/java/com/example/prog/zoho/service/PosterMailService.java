package com.example.prog.zoho.service;

import com.example.prog.entity.PosterEmailLogEntity;
import com.example.prog.entity.PosterJobEntity;
import com.example.prog.zoho.repository.PosterEmailLogRepository;
import com.example.prog.zoho.repository.PosterJobRepository;
import com.example.prog.zoho.service.UnsubscribeService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import com.example.prog.zoho.service.PosterMailService.PosterJobStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class PosterMailService {

    @Autowired
    @Qualifier("bigrockSupportSender")
    private JavaMailSender bigrockSupportSender;

    @Autowired
    private UnsubscribeService unsubscribeService;

    @Autowired
    private PosterJobRepository posterJobRepository;

    @Autowired
    private PosterEmailLogRepository posterEmailLogRepository;

    // Email limits (same as your existing service)
    private static final int HOURLY_LIMIT = 25;
    private static final int DAILY_LIMIT = 100;
    
    private final AtomicInteger emailsSentThisHour = new AtomicInteger(0);
    private long lastHourReset = System.currentTimeMillis();

    // DTO Classes
    public static class PosterJobStatus {
        private String jobId;
        private String jobName;
        private String subject;
        private String imageUrl;
        private String status;
        private int progress;
        private int totalEmails;
        private int sentCount;
        private int failedCount;
        private int remainingCount;
        private Map<String, String> failureReasons;
        private Timestamp createdAt;
        private Timestamp lastProcessedAt;
        
        public PosterJobStatus(String jobId, String jobName, String subject, String imageUrl, 
                             String status, int progress, int totalEmails, int sentCount, 
                             int failedCount, int remainingCount, Map<String, String> failureReasons,
                             Timestamp createdAt, Timestamp lastProcessedAt) {
            this.jobId = jobId;
            this.jobName = jobName;
            this.subject = subject;
            this.imageUrl = imageUrl;
            this.status = status;
            this.progress = progress;
            this.totalEmails = totalEmails;
            this.sentCount = sentCount;
            this.failedCount = failedCount;
            this.remainingCount = remainingCount;
            this.failureReasons = failureReasons;
            this.createdAt = createdAt;
            this.lastProcessedAt = lastProcessedAt;
        }
        
        // Getters
        public String getJobId() { return jobId; }
        public String getJobName() { return jobName; }
        public String getSubject() { return subject; }
        public String getImageUrl() { return imageUrl; }
        public String getStatus() { return status; }
        public int getProgress() { return progress; }
        public int getTotalEmails() { return totalEmails; }
        public int getSentCount() { return sentCount; }
        public int getFailedCount() { return failedCount; }
        public int getRemainingCount() { return remainingCount; }
        public Map<String, String> getFailureReasons() { return failureReasons; }
        public Timestamp getCreatedAt() { return createdAt; }
        public Timestamp getLastProcessedAt() { return lastProcessedAt; }
    }
    
    public static class PosterBulkSendResult {
        private int successCount;
        private int failCount;
        private int remainingEmails;
        private String message;
        private String jobId;
        
        public PosterBulkSendResult(int successCount, int failCount, int remainingEmails, String message, String jobId) {
            this.successCount = successCount;
            this.failCount = failCount;
            this.remainingEmails = remainingEmails;
            this.message = message;
            this.jobId = jobId;
        }
        
        // Getters
        public int getSuccessCount() { return successCount; }
        public int getFailCount() { return failCount; }
        public int getRemainingEmails() { return remainingEmails; }
        public String getMessage() { return message; }
        public String getJobId() { return jobId; }
    }

    // 🔹 MAIN METHOD: Create poster batch job
    @Transactional
    public String createPosterBatchJob(String jobName, String subject, String imageUrl, 
                                     String caption, String ctaText, String ctaLink) {
        List<UnsubscribeService.SubscriberInfo> subscribers = unsubscribeService.getActiveSubscribers();
        
        if (subscribers.isEmpty()) {
            throw new RuntimeException("No active subscribers found for poster email");
        }
        
        // Create and save poster job
        PosterJobEntity posterJob = new PosterJobEntity(
            jobName, subject, imageUrl, caption, ctaText, ctaLink, subscribers.size()
        );
        
        posterJobRepository.save(posterJob);
        
        System.out.println("🖼️ Created poster batch job: " + posterJob.getId());
        System.out.println("📧 Total subscribers: " + subscribers.size());
        System.out.println("🖼️ Image URL: " + imageUrl);
        
        // Start processing asynchronously
        processPosterBatchJob(posterJob.getId());
        
        return posterJob.getId();
    }

    // 🔹 ASYNC: Process poster batch job with resume capability
    @Async
    @Transactional
    public void processPosterBatchJob(String jobId) {
        Optional<PosterJobEntity> posterJobOpt = posterJobRepository.findById(jobId);
        if (posterJobOpt.isEmpty()) {
            System.out.println("❌ Poster job not found: " + jobId);
            return;
        }
        
        PosterJobEntity posterJob = posterJobOpt.get();
        List<UnsubscribeService.SubscriberInfo> allSubscribers = unsubscribeService.getActiveSubscribers();

        // Get already processed emails from database
        Set<String> alreadyProcessedEmails = getAlreadyProcessedEmailsForPoster(posterJob.getId());
        
        System.out.println("🚀 Processing poster batch job: " + posterJob.getJobName());
        System.out.println("📧 Total subscribers: " + allSubscribers.size());
        System.out.println("📋 Already processed: " + alreadyProcessedEmails.size() + " emails");

        // Filter out already processed subscribers
        List<UnsubscribeService.SubscriberInfo> remainingSubscribers = allSubscribers.stream()
            .filter(sub -> !alreadyProcessedEmails.contains(sub.getEmail()))
            .collect(Collectors.toList());
        
        if (remainingSubscribers.isEmpty()) {
            System.out.println("✅ All poster emails already processed for job: " + posterJob.getJobName());
            posterJob.setStatus("COMPLETED");
            posterJob.setProgress(100);
            posterJob.setCompletedAt(new Timestamp(System.currentTimeMillis()));
            posterJobRepository.save(posterJob);
            return;
        }
        
        // Update status to PROCESSING
        posterJob.setStatus("PROCESSING");
        posterJob.setStartedAt(new Timestamp(System.currentTimeMillis()));
        posterJobRepository.save(posterJob);
        
        // Check limits
        resetCountersIfNeeded();
        int canSendNow = calculatePosterSendCapacity();
        canSendNow = Math.min(canSendNow, remainingSubscribers.size());
        
        System.out.println("📊 Poster Capacity Check - Can send: " + canSendNow + " emails now");
        
        if (canSendNow <= 0) {
            System.out.println("⏳ Poster job paused - limits reached. Will resume after reset.");
            posterJob.setStatus("WAITING_FOR_RESET");
            posterJob.setLastProcessedAt(new Timestamp(System.currentTimeMillis()));
            posterJobRepository.save(posterJob);
            schedulePosterResume(jobId);
            return;
        }
        
        System.out.println("📦 Sending " + canSendNow + " poster emails in this batch");
        System.out.println("🎯 Remaining after this batch: " + (remainingSubscribers.size() - canSendNow));
        
        int sentInThisBatch = 0;
        int failedInThisBatch = 0;
        
        // Process the batch
        for (int i = 0; i < canSendNow; i++) {
            UnsubscribeService.SubscriberInfo subscriber = remainingSubscribers.get(i);
            try {
                sendSinglePosterMail(subscriber.getEmail(), subscriber.getName(), 
                                   posterJob.getSubject(), posterJob.getImageUrl(), 
                                   posterJob.getCaption(), posterJob.getCtaText(), 
                                   posterJob.getCtaLink());
                
                // Log successful email
                logPosterEmailSent(posterJob.getId(), subscriber, posterJob.getSubject(), "SENT", null);
                sentInThisBatch++;
                emailsSentThisHour.incrementAndGet();
                
                System.out.println("✅ [" + (i + 1) + "/" + canSendNow + "] Poster sent to: " + subscriber.getEmail());
                
                // Delay between emails
                Thread.sleep(2000); // 2 seconds
                
            } catch (Exception e) {
                // Log failed email
                logPosterEmailSent(posterJob.getId(), subscriber, posterJob.getSubject(), "FAILED", e.getMessage());
                failedInThisBatch++;
                System.err.println("❌ Failed to send poster to " + subscriber.getEmail() + ": " + e.getMessage());
            }
        }
        
        // Update poster job progress based on ACTUAL processed count from logs
        int totalProcessedFromLogs = getAlreadyProcessedEmailsForPoster(posterJob.getId()).size();
        posterJob.setProgress((int) ((totalProcessedFromLogs * 100.0) / posterJob.getTotalEmails()));
        posterJob.setLastProcessedAt(new Timestamp(System.currentTimeMillis()));
        
        // Check if job is completed
        if (totalProcessedFromLogs >= posterJob.getTotalEmails()) {
            posterJob.setStatus("COMPLETED");
            posterJob.setCompletedAt(new Timestamp(System.currentTimeMillis()));
            System.out.println("✅ Poster job completed: " + posterJob.getJobName());
        } else {
            posterJob.setStatus("WAITING_FOR_RESET");
            int remaining = posterJob.getTotalEmails() - totalProcessedFromLogs;
            System.out.println("⏳ Poster job paused. Remaining: " + remaining);
            schedulePosterResume(jobId);
        }
        
        posterJob.setSentCount(posterJob.getSentCount() + sentInThisBatch);
        posterJob.setFailedCount(posterJob.getFailedCount() + failedInThisBatch);
        posterJobRepository.save(posterJob);
        
        System.out.println("📊 Poster job progress: " + posterJob.getProgress() + "%");
        System.out.println("📋 Total processed: " + totalProcessedFromLogs + "/" + posterJob.getTotalEmails());
    }

    // 🔹 SCHEDULED: Resume waiting poster jobs (runs every 5 minutes)
    @Scheduled(fixedRate = 300000) // 5 minutes
    @Transactional
    public void resumeWaitingPosterJobs() {
        System.out.println("🔄 Checking for waiting poster jobs to resume...");
        
        List<PosterJobEntity> waitingJobs = posterJobRepository.findByStatus("WAITING_FOR_RESET");
        
        if (waitingJobs.isEmpty()) {
            System.out.println("ℹ️ No waiting poster jobs found");
            return;
        }
        
        System.out.println("📋 Found " + waitingJobs.size() + " waiting poster jobs");
        
        for (PosterJobEntity job : waitingJobs) {
            try {
                // Check if we can send now
                resetCountersIfNeeded();
                int canSendNow = calculatePosterSendCapacity();
                
                if (canSendNow > 0) {
                    System.out.println("🚀 Resuming poster job: " + job.getJobName());
                    processPosterBatchJob(job.getId());
                } else {
                    System.out.println("⏳ Poster job " + job.getJobName() + " still waiting for capacity");
                }
            } catch (Exception e) {
                System.err.println("❌ Error resuming poster job " + job.getJobName() + ": " + e.getMessage());
            }
        }
    }

    // 🔹 Send immediate poster email (with limits)
    @Async
    public PosterBulkSendResult sendPosterToAllUsersWithLimits(String subject, String imageUrl, 
                                                             String caption, String ctaText, String ctaLink) {
        List<UnsubscribeService.SubscriberInfo> subscribers = unsubscribeService.getActiveSubscribers();
        
        if (subscribers.isEmpty()) {
            System.out.println("⚠️ No active subscribers found for poster email.");
            return new PosterBulkSendResult(0, 0, 0, "No subscribers found", null);
        }

        System.out.println("🚀 ========== STARTING IMMEDIATE POSTER EMAIL SEND ==========");
        System.out.println("📧 Subject: " + subject);
        System.out.println("🖼️ Image URL: " + imageUrl);

        resetCountersIfNeeded();
        int canSendNow = calculatePosterSendCapacity();
        canSendNow = Math.min(canSendNow, subscribers.size());
        
        System.out.println("📦 Can send " + canSendNow + " poster emails now");
        
        if (canSendNow <= 0) {
            System.out.println("❌ Cannot send any poster emails - limits reached");
            // Create a job for later processing
            String jobId = createPosterBatchJob("Immediate: " + subject, subject, imageUrl, caption, ctaText, ctaLink);
            return new PosterBulkSendResult(0, 0, subscribers.size(), "Daily limit reached. Job queued for later.", jobId);
        }

        int successCount = 0;
        int failCount = 0;

        for (int i = 0; i < canSendNow; i++) {
            UnsubscribeService.SubscriberInfo subscriber = subscribers.get(i);
            try {
                sendSinglePosterMail(subscriber.getEmail(), subscriber.getName(), subject, 
                                   imageUrl, caption, ctaText, ctaLink);
                successCount++;
                emailsSentThisHour.incrementAndGet();
                
                System.out.println("✅ [" + successCount + "/" + canSendNow + "] Poster sent to: " + subscriber.getEmail());
                
                // Delay between emails
                Thread.sleep(3000);
                
            } catch (Exception e) {
                failCount++;
                System.err.println("❌ Failed to send poster to " + subscriber.getEmail() + ": " + e.getMessage());
            }
        }
        
        int remaining = subscribers.size() - canSendNow;
        String messageText;
        String jobId = null;
        
        if (remaining > 0) {
            // Create batch job for remaining emails
            jobId = createPosterBatchJob("Remaining: " + subject, subject, imageUrl, caption, ctaText, ctaLink);
            messageText = successCount + " emails sent. " + remaining + " emails queued for later sending.";
        } else {
            messageText = "All poster emails sent successfully";
        }
            
        System.out.println("📊 Immediate Poster Send Summary:");
        System.out.println("✅ Successful: " + successCount);
        System.out.println("❌ Failed: " + failCount);
        System.out.println("⏳ Remaining: " + remaining);
        System.out.println("🚀 ========== IMMEDIATE POSTER EMAIL COMPLETED ==========");
        
        return new PosterBulkSendResult(successCount, failCount, remaining, messageText, jobId);
    }

    // 🔹 Send single poster email
    @Async
    public void sendSinglePosterMail(String to, String receiverName, String subject, 
                                   String imageUrl, String caption, String ctaText, String ctaLink) {
        if (!unsubscribeService.isSubscribed(to)) {
            System.out.println("⏭️ Skipping poster email to unsubscribed user: " + to);
            return;
        }

        System.out.println("📨 Attempting to send poster email to: " + to);
        
        try {
            MimeMessage mimeMessage = bigrockSupportSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            System.out.println("🛠️ Building poster email content...");
            String unsubscribeToken = unsubscribeService.generateUnsubscribeToken(to);
            String htmlContent = buildPosterEmail(receiverName, subject, imageUrl, caption, ctaText, ctaLink, to, unsubscribeToken);
            System.out.println("📄 Poster email content built successfully");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("support@cmdahub.com", "CMDA Support");
            helper.setText(htmlContent, true);

            System.out.println("📤 Sending poster email via JavaMailSender...");
            bigrockSupportSender.send(mimeMessage);
            System.out.println("✅ Poster email sent successfully to: " + to);

        } catch (MessagingException | UnsupportedEncodingException e) {
            System.err.println("❌ Poster email error for " + to + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send poster email to " + to, e);
        } catch (Exception e) {
            System.err.println("❌ Unexpected error in poster email for " + to + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Unexpected error sending poster email to " + to, e);
        }
    }

    // 🔹 Get poster job status
    @Transactional(readOnly = true)
    public PosterJobStatus getPosterJobStatus(String jobId) {
        Optional<PosterJobEntity> posterJobOpt = posterJobRepository.findById(jobId);
        if (posterJobOpt.isEmpty()) return null;
        
        PosterJobEntity posterJob = posterJobOpt.get();
        Map<String, String> failureReasons = getPosterFailureReasons(posterJob.getId());
        
        return new PosterJobStatus(
            posterJob.getId(),
            posterJob.getJobName(),
            posterJob.getSubject(),
            posterJob.getImageUrl(),
            posterJob.getStatus(),
            posterJob.getProgress(),
            posterJob.getTotalEmails(),
            posterJob.getSentCount(),
            posterJob.getFailedCount(),
            posterJob.getTotalEmails() - (posterJob.getSentCount() + posterJob.getFailedCount()),
            failureReasons,
            posterJob.getCreatedAt(),
            posterJob.getLastProcessedAt()
        );
    }

    // 🔹 Get all poster jobs for dashboard
    @Transactional(readOnly = true)
    public List<PosterJobStatus> getAllPosterJobs() {
        List<PosterJobEntity> posterJobs = posterJobRepository.findAllByOrderByCreatedAtDesc();
        
        return posterJobs.stream()
            .map(posterJob -> new PosterJobStatus(
                posterJob.getId(),
                posterJob.getJobName(),
                posterJob.getSubject(),
                posterJob.getImageUrl(),
                posterJob.getStatus(),
                posterJob.getProgress(),
                posterJob.getTotalEmails(),
                posterJob.getSentCount(),
                posterJob.getFailedCount(),
                posterJob.getTotalEmails() - (posterJob.getSentCount() + posterJob.getFailedCount()),
                getPosterFailureReasons(posterJob.getId()),
                posterJob.getCreatedAt(),
                posterJob.getLastProcessedAt()
            ))
            .collect(Collectors.toList());
    }

    // 🔹 Get poster analytics
    @Transactional(readOnly = true)
    public Map<String, Object> getPosterAnalytics() {
        try {
            // Get today's stats
            Timestamp startOfDay = getStartOfDay();
            Timestamp now = new Timestamp(System.currentTimeMillis());
            
            int sentToday = posterEmailLogRepository.countBySentAtBetween(startOfDay, now);
            int successfulToday = posterEmailLogRepository.countByStatusAndSentAtBetween("SENT", startOfDay, now);
            int successRate = sentToday > 0 ? (int) ((successfulToday * 100.0) / sentToday) : 100;
            
            int activeJobs = posterJobRepository.countActiveJobs();
            int totalSubscribers = unsubscribeService.getActiveSubscribers().size();
            
            return Map.of(
                "sentToday", sentToday,
                "successRate", successRate + "%",
                "activePosterJobs", activeJobs,
                "totalSubscribers", totalSubscribers,
                "hourlyLimit", HOURLY_LIMIT,
                "dailyLimit", DAILY_LIMIT,
                "remainingToday", Math.max(0, DAILY_LIMIT - sentToday)
            );
            
        } catch (Exception e) {
            System.err.println("❌ Error getting poster analytics: " + e.getMessage());
            return Map.of(
                "sentToday", 0,
                "successRate", "0%",
                "activePosterJobs", 0,
                "totalSubscribers", 0,
                "hourlyLimit", HOURLY_LIMIT,
                "dailyLimit", DAILY_LIMIT,
                "remainingToday", DAILY_LIMIT
            );
        }
    }

    // ========== PRIVATE HELPER METHODS ==========

    private void logPosterEmailSent(String posterJobId, UnsubscribeService.SubscriberInfo subscriber, 
                                  String subject, String status, String failureReason) {
        PosterEmailLogEntity log = new PosterEmailLogEntity(
            posterJobId,
            subscriber.getEmail(),
            subscriber.getName(),
            subject,
            status,
            failureReason
        );
        
        posterEmailLogRepository.save(log);
    }

    private Set<String> getAlreadyProcessedEmailsForPoster(String posterJobId) {
        try {
            List<String> processedEmails = posterEmailLogRepository.findRecipientEmailsByPosterJobId(posterJobId);
            return new HashSet<>(processedEmails);
        } catch (Exception e) {
            System.err.println("❌ Error fetching processed poster emails: " + e.getMessage());
            List<PosterEmailLogEntity> processedLogs = posterEmailLogRepository.findByPosterJobId(posterJobId);
            return processedLogs.stream()
                .map(PosterEmailLogEntity::getRecipientEmail)
                .collect(Collectors.toSet());
        }
    }

    private Map<String, String> getPosterFailureReasons(String posterJobId) {
        List<PosterEmailLogEntity> failedEmails = posterEmailLogRepository.findByPosterJobIdAndStatus(posterJobId, "FAILED");
        
        Map<String, String> failureReasons = new HashMap<>();
        for (PosterEmailLogEntity log : failedEmails) {
            failureReasons.put(log.getRecipientEmail(), log.getFailureReason());
        }
        return failureReasons;
    }

    private int calculatePosterSendCapacity() {
        // Get today's email count from database
        Timestamp startOfDay = getStartOfDay();
        Timestamp now = new Timestamp(System.currentTimeMillis());
        
        int sentToday = posterEmailLogRepository.countBySentAtBetween(startOfDay, now);
        int remainingDaily = DAILY_LIMIT - sentToday;
        
        // Get hourly count (from memory or database)
        int remainingHourly = HOURLY_LIMIT - emailsSentThisHour.get();
        
        System.out.println("📊 Poster Capacity Check - Daily: " + sentToday + "/" + DAILY_LIMIT + 
                          ", Hourly: " + emailsSentThisHour.get() + "/" + HOURLY_LIMIT);
        
        return Math.min(remainingHourly, remainingDaily);
    }

    private void resetCountersIfNeeded() {
        long currentTime = System.currentTimeMillis();
        long resetInterval = 65 * 60 * 1000; // 2 minutes for testing
        
        if (currentTime - lastHourReset > resetInterval) {
            int previousCount = emailsSentThisHour.get();
            emailsSentThisHour.set(0);
            lastHourReset = currentTime;
            System.out.println("🔄 TEST MODE: Hourly poster email counter reset (was " + previousCount + " emails)");
        }
    }

    private Timestamp getStartOfDay() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 1);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return new Timestamp(calendar.getTimeInMillis());
    }

    private void schedulePosterResume(String jobId) {
        Optional<PosterJobEntity> posterJobOpt = posterJobRepository.findById(jobId);
        if (posterJobOpt.isEmpty()) return;
        
        PosterJobEntity posterJob = posterJobOpt.get();
        posterJob.setStatus("WAITING_FOR_RESET");
        posterJob.setLastProcessedAt(new Timestamp(System.currentTimeMillis()));
        posterJobRepository.save(posterJob);
        
        System.out.println("⏳ Poster job scheduled for resume:");
        System.out.println("   📝 Job: " + posterJob.getJobName());
        System.out.println("   🖼️ Image: " + posterJob.getImageUrl());
        System.out.println("   🔄 Scheduler will pick it up automatically within 5 minutes");
    }

    private String buildPosterEmail(String receiverName, String subject, String imageUrl, 
                              String caption, String ctaText, String ctaLink, 
                              String email, String unsubscribeToken) {
    
    String unsubscribeLink = "https://cmdahub.com/api/unsubscribe?token=" + unsubscribeToken + "&email=" + email;
    
    // Default values
    if (ctaText == null || ctaText.isEmpty()) {
        ctaText = "Learn More";
    }
    if (ctaLink == null || ctaLink.isEmpty()) {
        ctaLink = "https://cmdahub.com";
    }
    
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
           "/* SMART IMAGE CONTAINER */" +
           ".poster-container { max-width: 540px; margin: 0 auto; }" +
           ".poster-image { display: block; border-radius: 12px; border: 1px solid #E5E7EB; }" +
           "/* Horizontal images (landscape) */" +
           ".image-horizontal { width: 100%; height: auto; max-height: 400px; object-fit: contain; }" +
           "/* Vertical images (portrait) */" +
           ".image-vertical { width: 80%; height: auto; max-height: 600px; object-fit: contain; margin: 0 auto; display: block; }" +
           "/* Square images */" +
           ".image-square { width: 70%; height: auto; max-height: 500px; object-fit: contain; margin: 0 auto; display: block; }" +
           "/* DARK MODE SUPPORT */" +
           "@media (prefers-color-scheme: dark) {" +
           "  .dark-mode-bg { background-color: #111827 !important; }" +
           "  .dark-mode-card { background-color: #1F2937 !important; }" +
           "  .dark-mode-text { color: #F9FAFB !important; }" +
           "  .dark-mode-secondary { color: #D1D5DB !important; }" +
           "}" +
           "/* MOBILE STYLES */" +
           "@media only screen and (max-width: 480px) {" +
           "  body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: none !important; }" +
           "  body { width: 100% !important; min-width: 100% !important; }" +
           "  .mobile-full { width: 100% !important; }" +
           "  .mobile-padding { padding: 20px !important; }" +
           "  .mobile-center { text-align: center !important; }" +
           "  .image-vertical { width: 95% !important; max-height: 500px !important; }" +
           "  .image-square { width: 90% !important; max-height: 400px !important; }" +
           "  .poster-container { max-width: 100% !important; }" +
           "}" +
           ".outer-table { width: 100% !important; max-width: 600px !important; }" +
           "</style>" +
           "</head>" +
           "<body style=\"margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\">" +
           
           "<!--[if mso]>" +
           "<style type=\"text/css\">" +
           "body, table, td {font-family: Arial, Helvetica, sans-serif !important;}" +
           ".outer-table { width: 100% !important; max-width: 600px !important; }" +
           ".image-horizontal { width: 540px !important; height: 300px !important; }" +
           ".image-vertical { width: 324px !important; height: 432px !important; }" +
           ".image-square { width: 378px !important; height: 378px !important; }" +
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
           buildPosterBodySectionWithSmartImage(receiverName, subject, imageUrl, caption, ctaText, ctaLink) +
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

     // 🔹 NEW: Poster body section
    // / NEW: Smart poster body section with image detection
private String buildPosterBodySectionWithSmartImage(String receiverName, String subject, String imageUrl, 
                                                  String caption, String ctaText, String ctaLink) {
    
    // Determine image class based on URL or use default
    String imageClass = determineImageOrientationClass(imageUrl);
    
    return "<!-- POSTER CONTENT CARD -->" +
           "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" bgcolor=\"#FFFFFF\" class=\"dark-mode-card\" style=\"border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 16px 16px;\">" +
           
           "<!-- GREETING SECTION -->" +
           "<tr>" +
           "<td align=\"left\" valign=\"top\" style=\"padding: 30px 30px 10px 30px;\">" +
           "<p style=\"font-size: 16px; margin: 0 0 12px 0; color: #6B7280; line-height: 1.6;\">Hello <strong style=\"color: #111827;\">" + escapeHtml(receiverName) + "</strong>,</p>" +
           "</td>" +
           "</tr>" +
           
           "<!-- SMART POSTER IMAGE SECTION -->" +
           "<tr>" +
           "<td align=\"center\" valign=\"top\" style=\"padding: 0 30px 20px 30px;\">" +
           "<!-- Smart Poster Image Container -->" +
           "<div class=\"poster-container\">" +
           "<img src=\"" + imageUrl + "\" alt=\"" + escapeHtml(subject) + "\" class=\"poster-image " + imageClass + "\" style=\"display: block;\">" +
           "</div>" +
           "</td>" +
           "</tr>" +
           
           "<!-- CAPTION SECTION -->" +
           (caption != null && !caption.isEmpty() ? 
           "<tr>" +
           "<td align=\"center\" valign=\"top\" style=\"padding: 0 30px 20px 30px;\">" +
           "<p style=\"font-size: 16px; margin: 0; color: #6B7280; line-height: 1.6; text-align: center; font-style: italic;\">" + escapeHtml(caption) + "</p>" +
           "</td>" +
           "</tr>" : "") +
           
           "<!-- CTA BUTTON SECTION -->" +
           "<tr>" +
           "<td align=\"center\" valign=\"top\" style=\"padding: 0 30px 30px 30px;\">" +
           "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">" +
           "<tr>" +
           "<td align=\"center\" valign=\"middle\">" +
           "<a href=\"" + ctaLink + "\" style=\"background: linear-gradient(135deg, #7C3AED, #6D28D9); border: none; border-radius: 12px; color: #FFFFFF; display: inline-block; font-size: 16px; font-weight: 700; padding: 16px 32px; text-decoration: none; -webkit-text-size-adjust: none; transition: all 0.3s ease;\">" + escapeHtml(ctaText) + "</a>" +
           "</td>" +
           "</tr>" +
           "</table>" +
           "</td>" +
           "</tr>" +
           "</table>";
}

// NEW: Smart image orientation detection
private String determineImageOrientationClass(String imageUrl) {
    if (imageUrl == null) {
        return "image-horizontal"; // Default to horizontal
    }
    
    // Extract filename to guess orientation (you can enhance this with actual image dimensions)
    String filename = imageUrl.toLowerCase();
    
    // Check for common patterns in filenames
    if (filename.contains("vertical") || filename.contains("portrait") || 
        filename.contains("tall") || filename.contains("_v") || filename.contains("-v")) {
        return "image-vertical";
    }
    
    if (filename.contains("square") || filename.contains("_sq") || 
        filename.contains("-sq") || filename.contains("instagram")) {
        return "image-square";
    }
    
    if (filename.contains("horizontal") || filename.contains("landscape") || 
        filename.contains("wide") || filename.contains("_h") || filename.contains("-h") ||
        filename.contains("banner")) {
        return "image-horizontal";
    }
    
    // Default to horizontal for most cases
    return "image-horizontal";
}

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                  .replace("<", "&lt;")
                  .replace(">", "&gt;")
                  .replace("\"", "&quot;")
                  .replace("'", "&#39;");
    }
}