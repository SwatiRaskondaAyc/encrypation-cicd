package com.example.prog.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "poster_email_logs")
public class PosterEmailLogEntity {

    @Id
    private String id;

    @Column(name = "poster_job_id", nullable = false)
    private String posterJobId;

    @Column(name = "recipient_email", nullable = false)
    private String recipientEmail;

    @Column(name = "recipient_name")
    private String recipientName;

    @Column(name = "subject")
    private String subject;

    @Column(name = "status", nullable = false)
    private String status; // SENT, FAILED

    @Column(name = "failure_reason", length = 1000)
    private String failureReason;

    @Column(name = "sent_at")
    private Timestamp sentAt;

    // Constructor
    public PosterEmailLogEntity() {
        this.id = UUID.randomUUID().toString();
        this.sentAt = new Timestamp(System.currentTimeMillis());
    }

    public PosterEmailLogEntity(String posterJobId, String recipientEmail, String recipientName, 
                              String subject, String status, String failureReason) {
        this();
        this.posterJobId = posterJobId;
        this.recipientEmail = recipientEmail;
        this.recipientName = recipientName;
        this.subject = subject;
        this.status = status;
        this.failureReason = failureReason;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPosterJobId() { return posterJobId; }
    public void setPosterJobId(String posterJobId) { this.posterJobId = posterJobId; }

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