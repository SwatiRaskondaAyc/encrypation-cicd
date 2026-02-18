// package com.example.prog.service.promocode;

// import java.util.List;

// import com.example.prog.dto.promocode.PromoCodeUsageRequestDTO;
// import com.example.prog.dto.promocode.PromoCodeStatusDTO;
// import com.example.prog.dto.promocode.UserDetailsDTO;
// import com.example.prog.entity.promocode.PromoCodeUsage;

// public interface PromoCodeUsageService {
//     PromoCodeUsage recordUsage(PromoCodeUsage usage);
//     List<UserDetailsDTO> getUsersByPromoCode(String promoCode);
//     PromoCodeStatusDTO getPromoCodeStatus(String promoCode);
//     List<PromoCodeUsage> getAllPromoCodeUsages();
// 	List<String> getAllCreatedPromoCodes(); // New method
// }

package com.example.prog.service.promocode;

import java.util.List;
import java.util.Map;

import com.example.prog.dto.promocode.PromoCodeUsageRequestDTO;
import com.example.prog.dto.promocode.PromoCodeStatusDTO;
import com.example.prog.dto.promocode.UserDetailsDTO;
import com.example.prog.entity.promocode.PromoCodeUsage;

import com.example.prog.dto.promocode.PromoCodeDetailedStatusDTO;

import com.example.prog.dto.promocode.PaymentRequest;

public interface PromoCodeUsageService {
    PromoCodeUsage recordUsage(PromoCodeUsage usage);
    List<UserDetailsDTO> getUsersByPromoCode(String promoCode);
    PromoCodeDetailedStatusDTO getPromoCodeStatus(String promoCode);
    List<PromoCodeUsage> getAllPromoCodeUsages();
    List<String> getAllCreatedPromoCodes(); // New method
    Map<String, Object> markPromoCodeAsPaid(String promoCode, PaymentRequest paymentRequest);
}