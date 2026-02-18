package com.example.prog.dto.promocode;

import java.util.Date;

//Updated DTO with subcategory
public class PromoCodeRequestDTO {
 private String promoCodeType;
 private Integer subcategorySequence;
 private String manualPromoCode; // Optional
 private String name;
 private Long promoUserId;
 private Date validFrom;
 private Date validTo;

 // Getters and Setters
 public String getPromoCodeType() {
     return promoCodeType;
 }

 public void setPromoCodeType(String promoCodeType) {
     this.promoCodeType = promoCodeType;
 }

 public Integer getSubcategorySequence() {
     return subcategorySequence;
 }

 public void setSubcategorySequence(Integer subcategorySequence) {
     this.subcategorySequence = subcategorySequence;
 }

 public String getManualPromoCode() {
     return manualPromoCode;
 }

 public void setManualPromoCode(String manualPromoCode) {
     this.manualPromoCode = manualPromoCode;
 }

 public String getName() {
     return name;
 }

 public void setName(String name) {
     this.name = name;
 }

 public Long getPromoUserId() {
     return promoUserId;
 }

 public void setPromoUserId(Long promoUserId) {
     this.promoUserId = promoUserId;
 }

 public Date getValidFrom() {
     return validFrom;
 }

 public void setValidFrom(Date validFrom) {
     this.validFrom = validFrom;
 }

 public Date getValidTo() {
     return validTo;
 }

 public void setValidTo(Date validTo) {
     this.validTo = validTo;
 }
}