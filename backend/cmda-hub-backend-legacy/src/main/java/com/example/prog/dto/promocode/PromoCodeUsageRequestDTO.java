package com.example.prog.dto.promocode;

import java.util.Date;

public class PromoCodeUsageRequestDTO {
    private Long userId; // From user_dtls or corporateUser
    private String promoCode;

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }
}
