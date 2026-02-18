// BatchJobEntity.java
package com.example.prog.entity;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;
import com.example.prog.zoho.repository.EmojiSafeConverter;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "batch_jobs")
public class BatchJobEntity {
    @Id
    private String id;
    
    @Convert(converter = EmojiSafeConverter.class)
    @Column(name = "job_name", nullable = false, columnDefinition = "NVARCHAR(500) COLLATE Latin1_General_100_CI_AS_SC_UTF8")
    private String jobName;

    @Convert(converter = EmojiSafeConverter.class)
    @Column(name = "subject", nullable = false, columnDefinition = "NVARCHAR(500) COLLATE Latin1_General_100_CI_AS_SC_UTF8")
    private String subject;
    
    @Lob
    @Convert(converter = EmojiSafeConverter.class)
    @Column(name = "message", nullable = false, columnDefinition = "NVARCHAR(MAX) COLLATE Latin1_General_100_CI_AS_SC_UTF8")
    private String message;
    
    @Lob
    @Convert(converter = EmojiSafeConverter.class)
    @Column(name = "features_json", columnDefinition = "NVARCHAR(MAX) COLLATE Latin1_General_100_CI_AS_SC_UTF8")
    private String featuresJson;
    
    @Column(nullable = false)
    private String status;
    
    @Column(name = "total_emails", nullable = false)
    private int totalEmails;
    
    @Column(name = "sent_count")
    private Integer sentCount = 0;

    @Column(name = "failed_count")
    private Integer failedCount = 0;

    @Column
    private Integer progress = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;
    
    @Column(name = "completed_at")
    private Timestamp completedAt;
    
    // Default constructor
    public BatchJobEntity() {
        this.id = UUID.randomUUID().toString();
    }
    
    // Constructor with parameters
    public BatchJobEntity(String jobName, String subject, String message, String featuresJson, 
                         String status, int totalEmails) {
        this();
        this.jobName = jobName;
        this.subject = subject;
        this.message = message;
        this.featuresJson = featuresJson;
        this.status = status;
        this.totalEmails = totalEmails;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getJobName() { return jobName; }
    public void setJobName(String jobName) { this.jobName = jobName; }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getFeaturesJson() { return featuresJson; }
    public void setFeaturesJson(String featuresJson) { this.featuresJson = featuresJson; }
    
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
    
    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
    
    public Timestamp getCompletedAt() { return completedAt; }
    public void setCompletedAt(Timestamp completedAt) { this.completedAt = completedAt; }
}