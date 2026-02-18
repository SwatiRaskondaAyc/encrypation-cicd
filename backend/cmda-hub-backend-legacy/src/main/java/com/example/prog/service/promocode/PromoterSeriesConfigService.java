

// package com.example.prog.service.promocode;

// import java.time.LocalDate;
// import java.util.List;
// import com.example.prog.entity.promocode.PromoterSeriesConfig;

// public interface PromoterSeriesConfigService {
//     PromoterSeriesConfig createPromoterSeriesConfig(PromoterSeriesConfig config);

//     PromoterSeriesConfig getLatestSeriesForType(String promoterType);

//     List<PromoterSeriesConfig> getAllPromoterSeriesConfigs();

//     PromoterSeriesConfig updateExpiry(Long id, LocalDate expiry);
// }

package com.example.prog.service.promocode;

import java.time.LocalDate;
import java.util.List;
import com.example.prog.entity.promocode.PromoterSeriesConfig;

public interface PromoterSeriesConfigService {
    PromoterSeriesConfig createPromoterSeriesConfig(PromoterSeriesConfig config);

    PromoterSeriesConfig getLatestSeriesForType(String promoterType);

    List<PromoterSeriesConfig> getAllPromoterSeriesConfigs();

    PromoterSeriesConfig updateExpiry(Long id, LocalDate expiry);

    // New method: Get config by promoterType and series (for specific promo code status)
    PromoterSeriesConfig getConfigByTypeAndSeries(String promoterType, Integer series);
}