package com.example.prog.dto.promocode;

public record PromoCodeStatusDTO(
    boolean isExpired,
    boolean limitReached,
    double totalAmountGenerated,
  double promoCodeCommission, // Replaced assignmentRate with promoCodeCommission
    int usageCount,
    int distributionLimit
) {}