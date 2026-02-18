package com.example.prog.entity.promocode;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "PromoSeries")
public class PromoterSeriesConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "promoter_type", nullable = false)
    private String promoterType; // Enum for promoter types

    @Column(name = "series", nullable = false)
    private Integer series;

    @Column(name = "promo_code_commission", nullable = false)
    private Double promoCodeCommission;

    @Column(name = "distribution_limit", nullable = false)
    private Integer distributionLimit;

    @Column(name = "user_sub_days", nullable = false)
    private Integer userSubDays;

    @Column(name = "expiry", nullable = false)
    private LocalDate expiry;

   

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

    public Integer getSeries() {
        return series;
    }

    public void setSeries(Integer series) {
        this.series = series;
    }

    public Double getPromoCodeCommission() {
        return promoCodeCommission;
    }

    public void setPromoCodeCommission(Double promoCodeCommission) {
        this.promoCodeCommission = promoCodeCommission;
    }

    public Integer getDistributionLimit() {
        return distributionLimit;
    }

    public void setDistributionLimit(Integer distributionLimit) {
        this.distributionLimit = distributionLimit;
    }

    public Integer getUserSubDays() {
        return userSubDays;
    }

    public void setUserSubDays(Integer userSubDays) {
        this.userSubDays = userSubDays;
    }

    public LocalDate getExpiry() {
        return expiry;
    }

    public void setExpiry(LocalDate expiry) {
        this.expiry = expiry;
    }
}