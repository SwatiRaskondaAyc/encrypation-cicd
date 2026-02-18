// EmailLogEntity.java
package com.example.prog.entity;

import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "email_logs")
public class EmailLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "batch_job_id", nullable = false)
    private String batchJobId;
    
    @Column(name = "recipient_email", nullable = false)
    private String recipientEmail;
    
    @Column(name = "recipient_name", nullable = false)
    private String recipientName;
    
    @Column(nullable = false, length = 500)
    private String subject;
    
    @Column(nullable = false)
    private String status; // SENT, FAILED, SKIPPED
    
    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;
    
    @CreationTimestamp
    @Column(name = "sent_at", updatable = false)
    private Timestamp sentAt;
    
    // Default constructor
    public EmailLogEntity() {}
    
    // Constructor with parameters
    public EmailLogEntity(String batchJobId, String recipientEmail, String recipientName, 
                         String subject, String status, String failureReason) {
        this.batchJobId = batchJobId;
        this.recipientEmail = recipientEmail;
        this.recipientName = recipientName;
        this.subject = subject;
        this.status = status;
        this.failureReason = failureReason;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getBatchJobId() { return batchJobId; }
    public void setBatchJobId(String batchJobId) { this.batchJobId = batchJobId; }
    
    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }
    
    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }
    
    public Timestamp getSentAt() { return sentAt; }
    public void setSentAt(Timestamp sentAt) { this.sentAt = sentAt; }
}