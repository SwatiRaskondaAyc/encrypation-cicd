package com.example.prog.webinar.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;   // uuid (PK)

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    // Stores webinar_id OR course_id
    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    // WEB | CRS
    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt = LocalDateTime.now();

    @Column(name = "status")
    private String status; // PENDING_PAYMENT | ENROLLED | COMPLETED | REFUND

    @Column(name = "payment_reference_id")
    private String paymentReferenceId;

    @Column(name = "amount_paid")
    private BigDecimal amountPaid;

    // -------- GETTERS & SETTERS --------

    public Long getUuid() {
        return id;
    }

    public void setUuid(Long id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentReferenceId() {
        return paymentReferenceId;
    }

    public void setPaymentReferenceId(String paymentReferenceId) {
        this.paymentReferenceId = paymentReferenceId;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(BigDecimal amountPaid) {
        this.amountPaid = amountPaid;
    }
}

