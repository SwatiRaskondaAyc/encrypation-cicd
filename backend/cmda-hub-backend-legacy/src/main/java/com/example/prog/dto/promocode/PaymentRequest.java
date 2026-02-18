// PaymentRequest.java
package com.example.prog.dto.promocode;

public class PaymentRequest {
    private String transactionId;
    private Boolean paid = true;

    // Constructors
    public PaymentRequest() {}

    public PaymentRequest(String transactionId) {
        this.transactionId = transactionId;
    }

    // Getters and Setters
    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Boolean getPaid() {
        return paid;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }
}