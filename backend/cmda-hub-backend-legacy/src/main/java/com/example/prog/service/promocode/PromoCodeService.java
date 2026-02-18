// package com.example.prog.service.promocode;
// import java.util.List;
// import com.example.prog.dto.promocode.PromoCodeRequestDTO;
// import com.example.prog.entity.promocode.PromoCode;


// public interface PromoCodeService {

	
// 	PromoCode createPromoCode(PromoCode promoCode);
//     PromoCode getByCode(String code);
    
// }

// package com.example.prog.service.promocode;

// import java.util.List;

// import com.example.prog.entity.promocode.PromoCode;
// import com.example.prog.entity.promocode.PromoterSeriesConfig;

// public interface PromoCodeService {
//     PromoCode createPromoCode(PromoCode promoCode);
//     PromoCode getByCode(String code);
//     List<String> getPromoterTypeSuggestions(String prefix);
//     PromoterSeriesConfig getSeriesDetails(String promoterType, int series);
//     List<PromoCode> getAllPromoCodes(); // New method
// }

package com.example.prog.service.promocode;

import java.util.List;

import com.example.prog.entity.promocode.PromoCode;
import com.example.prog.entity.promocode.PromoterSeriesConfig;
import java.time.LocalDate;

public interface PromoCodeService {
    PromoCode createPromoCode(PromoCode promoCode);
    PromoCode getByCode(String code);
    List<String> getPromoterTypeSuggestions(String prefix);
    PromoterSeriesConfig getSeriesDetails(String promoterType, int series);
    List<PromoCode> getAllPromoCodes(); // New method
    PromoCode updatePromoCodeDates(String code, LocalDate validFrom, LocalDate validTo);
    
    PromoCode updatePaymentStatus(String promotionCode, Boolean paid, String transactionId);
}