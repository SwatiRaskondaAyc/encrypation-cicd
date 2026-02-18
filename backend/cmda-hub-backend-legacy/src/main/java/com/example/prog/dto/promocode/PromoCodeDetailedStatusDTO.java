// Create a new DTO for the combined response
package com.example.prog.dto.promocode;

import java.time.LocalDateTime;

public class PromoCodeDetailedStatusDTO {
    private PromoCodeStatusDTO status;
    private Boolean paid;
    private String transactionId;
    private LocalDateTime paidAt;

    // Constructors
    public PromoCodeDetailedStatusDTO() {}

    public PromoCodeDetailedStatusDTO(PromoCodeStatusDTO status, Boolean paid, String transactionId, LocalDateTime paidAt) {
        this.status = status;
        this.paid = paid;
        this.transactionId = transactionId;
        this.paidAt = paidAt;
    }

    // Getters and setters
    public PromoCodeStatusDTO getStatus() { return status; }
    public void setStatus(PromoCodeStatusDTO status) { this.status = status; }
    
    public Boolean getPaid() { return paid; }
    public void setPaid(Boolean paid) { this.paid = paid; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
}