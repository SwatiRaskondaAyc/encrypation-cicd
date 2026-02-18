package com.example.prog.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.context.annotation.Primary;

@Primary
@Entity
@Table(name = "SubscriptionDetails")
public class SubscriptionDetails {

    @Id
    @Column(name = "OrderID", nullable = false, unique = true)
    private String orderId; // Razorpay's order ID

    @ManyToOne
    @JoinColumn(name = "UserID", nullable = false)
    private UserDtls user;

    @ManyToOne
    @JoinColumn(name = "PlanID", nullable = false)
    private SubscriptionMaster plan;

    @Column(name = "PaymentAmount", nullable = false)
    private BigDecimal paymentAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", columnDefinition = "ENUM('Active', 'Inactive') DEFAULT 'Inactive'")
    private Status status = Status.INACTIVE;

    @Column(name = "StartDate", nullable = false)
    private LocalDateTime startDate = LocalDateTime.now();

    @Column(name = "EndDate")
    private LocalDateTime endDate;

    public enum Status {
        ACTIVE, INACTIVE
    }

    // Getters and Setters
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public UserDtls getUser() {
        return user;
    }

    public void setUser(UserDtls user) {
        this.user = user;
    }

    public SubscriptionMaster getPlan() {
        return plan;
    }

    public void setPlan(SubscriptionMaster plan) {
        this.plan = plan;
    }

    public BigDecimal getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(BigDecimal paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
}
