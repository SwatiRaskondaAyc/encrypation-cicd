package com.example.prog.entity.promocode;
//
//
//import jakarta.persistence.*;
//import java.util.Date;
//
//@Entity
//@Table(name = "promo_code")
//public class PromoCode {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "promo_code_type", nullable = false)
//    private String promoCodeType;
//
//    @Column(name = "sequence", nullable = false)
//    private Integer sequence; // The generated sequence number for this code
//
//    @Column(name = "promo_code", unique = true, nullable = false)
//    private String promoCode; // Full promo code, e.g., "FA0001"
//
//    @Column(name = "name")
//    private String name; // Name of the promoter or description
//
//    @Column(name = "promo_user_id", nullable = false)
//    private Long promoUserId; // ID of the user who owns this promo code (promoter)
//
//    @Column(name = "valid_from")
//    @Temporal(TemporalType.DATE)
//    private Date validFrom;
//
//    @Column(name = "valid_to")
//    @Temporal(TemporalType.DATE)
//    private Date validTo;
//
//    // Getters and Setters
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getPromoCodeType() {
//        return promoCodeType;
//    }
//
//    public void setPromoCodeType(String promoCodeType) {
//        this.promoCodeType = promoCodeType;
//    }
//
//    public Integer getSequence() {
//        return sequence;
//    }
//
//    public void setSequence(Integer sequence) {
//        this.sequence = sequence;
//    }
//
//    public String getPromoCode() {
//        return promoCode;
//    }
//
//    public void setPromoCode(String promoCode) {
//        this.promoCode = promoCode;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public Long getPromoUserId() {
//        return promoUserId;
//    }
//
//    public void setPromoUserId(Long promoUserId) {
//        this.promoUserId = promoUserId;
//    }
//
//    public Date getValidFrom() {
//        return validFrom;
//    }
//
//    public void setValidFrom(Date validFrom) {
//        this.validFrom = validFrom;
//    }
//
//    public Date getValidTo() {
//        return validTo;
//    }
//
//    public void setValidTo(Date validTo) {
//        this.validTo = validTo;
//    }
//}


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Promoters")
public class PromoCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

 
    @Column(name = "promoter_type", nullable = false)
    private String promoterType;


    @Column(name = "series", nullable = false)
    private int series;




    @Column(name = "promotion_code", nullable = false, unique = true)
    private String promotionCode;


    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "promo_user_id", nullable = false)
    private int promoUserId;

    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

 
    @Column(name = "valid_to", nullable = false)
    private LocalDate validTo;

    @Column(name = "paid")
    private Boolean paid = false;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPromoterType() {
        return promoterType;
    }

    public void setPromoterType(String promoterType) {
        this.promoterType = promoterType;
    }

    public int getSeries() {
        return series;
    }

    public void setSeries(int series) {
        this.series = series;
    }

    public String getPromotionCode() {
        return promotionCode;
    }

    public void setPromotionCode(String promotionCode) {
        this.promotionCode = promotionCode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getPromoUserId() {
        return promoUserId;
    }

    public void setPromoUserId(int promoUserId) {
        this.promoUserId = promoUserId;
    }

    public LocalDate getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(LocalDate validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDate getValidTo() {
        return validTo;
    }

    public void setValidTo(LocalDate validTo) {
        this.validTo = validTo;
    }

    public Boolean getPaid() {
    return paid;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }
}