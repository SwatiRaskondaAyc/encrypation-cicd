package com.example.prog.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;
import com.example.prog.zoho.repository.EmojiSafeConverter;

@Entity
@Table(name = "poster_jobs")
public class PosterJobEntity {

    @Id
    private String id;

     @Convert(converter = EmojiSafeConverter.class)
    @Column(name = "job_name", nullable = false, columnDefinition = "NVARCHAR(500) COLLATE Latin1_General_100_CI_AS_SC_UTF8")
    private String jobName;

    // @Column(name = "subject", nullable = false)
    // private String subject;
    @Convert(converter = EmojiSafeConverter.class)
    @Column(name = "subject", nullable = false, columnDefinition = "NVARCHAR(500) COLLATE Latin1_General_100_CI_AS_SC_UTF8")
    private String subject;

    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;

    @Column(name = "caption", length = 500)
    private String caption;

    @Column(name = "cta_text")
    private String ctaText;

    @Column(name = "cta_link", length = 1000)
    private String ctaLink;

    @Column(name = "status", nullable = false)
    private String status; // CREATED, PROCESSING, WAITING_FOR_RESET, COMPLETED, FAILED

    @Column(name = "total_emails")
    private int totalEmails;

    @Column(name = "sent_count")
    private Integer sentCount = 0;

    @Column(name = "failed_count")
    private Integer failedCount = 0;

    @Column(name = "progress")
    private Integer progress = 0;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "started_at")
    private Timestamp startedAt;

    @Column(name = "completed_at")
    private Timestamp completedAt;

    @Column(name = "last_processed_at")
    private Timestamp lastProcessedAt;

    // Constructor
    public PosterJobEntity() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.status = "CREATED";
        this.sentCount = 0;
        this.failedCount = 0;
        this.progress = 0;
    }

    public PosterJobEntity(String jobName, String subject, String imageUrl, String caption, 
                         String ctaText, String ctaLink, int totalEmails) {
        this();
        this.jobName = jobName;
        this.subject = subject;
        this.imageUrl = imageUrl;
        this.caption = caption;
        this.ctaText = ctaText;
        this.ctaLink = ctaLink;
        this.totalEmails = totalEmails;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getJobName() { return jobName; }
    public void setJobName(String jobName) { this.jobName = jobName; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }

    public String getCtaText() { return ctaText; }
    public void setCtaText(String ctaText) { this.ctaText = ctaText; }

    public String getCtaLink() { return ctaLink; }
    public void setCtaLink(String ctaLink) { this.ctaLink = ctaLink; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getTotalEmails() { return totalEmails; }
    public void setTotalEmails(int totalEmails) { this.totalEmails = totalEmails; }

    public Integer getSentCount() { return sentCount == null ? 0 : sentCount; }
    public void setSentCount(Integer sentCount) { this.sentCount = sentCount; }

    public Integer getFailedCount() { return failedCount == null ? 0 : failedCount; }
    public void setFailedCount(Integer failedCount) { this.failedCount = failedCount; }

    public Integer getProgress() { return progress == null ? 0 : progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getStartedAt() { return startedAt; }
    public void setStartedAt(Timestamp startedAt) { this.startedAt = startedAt; }

    public Timestamp getCompletedAt() { return completedAt; }
    public void setCompletedAt(Timestamp completedAt) { this.completedAt = completedAt; }

    public Timestamp getLastProcessedAt() { return lastProcessedAt; }
    public void setLastProcessedAt(Timestamp lastProcessedAt) { this.lastProcessedAt = lastProcessedAt; }
}