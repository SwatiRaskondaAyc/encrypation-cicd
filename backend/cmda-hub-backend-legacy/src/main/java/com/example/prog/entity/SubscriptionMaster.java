package com.example.prog.entity;

import java.math.BigDecimal;

import org.springframework.context.annotation.Primary;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Primary
@Entity
@Table(name = "SubscriptionMaster")
public class SubscriptionMaster {

    @Id
    @Column(name = "PlanID", nullable = false, unique = true)
    private String planId;

    @Column(name = "PlanType", nullable = false)
    private String planType;
    
    @Column(name = "Amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "ValidityDays", nullable = false)
    private int validityDays;

    // Getters and Setters
    public String getPlanId() {
        return planId;
    }

    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public int getValidityDays() {
        return validityDays;
    }

    public void setValidityDays(int validityDays) {
        this.validityDays = validityDays;
    }
}
