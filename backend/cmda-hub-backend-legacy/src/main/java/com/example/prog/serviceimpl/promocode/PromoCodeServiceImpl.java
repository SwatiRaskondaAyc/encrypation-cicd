
// package com.example.prog.serviceimpl.promocode;

// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.promocode.PromoCode;
// import com.example.prog.entity.promocode.PromoterSeriesConfig;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.promocode.PromoCodeRepository;
// import com.example.prog.repository.promocode.PromoterSeriesConfigRepository;
// import com.example.prog.service.promocode.PromoCodeService;
// import com.example.prog.service.promocode.PromoterSeriesConfigService;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.time.LocalDate;
// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// public class PromoCodeServiceImpl implements PromoCodeService {

//     private static final Logger logger = LoggerFactory.getLogger(PromoCodeServiceImpl.class);

//     @Autowired
//     private PromoCodeRepository promoCodeRepository;

//     @Autowired
//     private UserRepository userDtlsRepository;

//     @Autowired
//     private CorporateUserRepository corporateUserRepository;

//     @Autowired
//     private PromoterSeriesConfigService configService;

//     @Autowired
//     private PromoterSeriesConfigRepository configRepository;

//     @Override
//     public PromoCode createPromoCode(PromoCode promoCode) {
//         Integer promoUserId = findUserIdByEmail(promoCode.getEmail());
//         promoCode.setPromoUserId(promoUserId);

//         if (promoCode.getSeries() <= 0) {
//             throw new IllegalArgumentException("Series must be a positive integer");
//         }

//         PromoterSeriesConfig config = configService.getLatestSeriesForType(promoCode.getPromoterType());
//         if (config == null) {
//             throw new IllegalArgumentException("No series configuration found for promoter type: " + promoCode.getPromoterType());
//         }
//         if (!config.getSeries().equals(promoCode.getSeries())) {
//             throw new IllegalArgumentException(
//                 "Provided series " + promoCode.getSeries() + " does not match the latest series " + config.getSeries() +
//                 " for promoter type: " + promoCode.getPromoterType()
//             );
//         }

//         if (promoCode.getValidFrom().isAfter(config.getExpiry())) {
//             throw new IllegalArgumentException(
//                 "Valid From date " + promoCode.getValidFrom() + " exceeds series expiry " + config.getExpiry()
//             );
//         }

//         long count = promoCodeRepository.countByPromoterTypeAndSeries(
//             promoCode.getPromoterType(), promoCode.getSeries()
//         );
//         if (count >= config.getDistributionLimit()) {
//             throw new IllegalArgumentException("Distribution limit reached for this series");
//         }

//         if (promoCode.getPromotionCode() == null || promoCode.getPromotionCode().isEmpty()) {
//             throw new IllegalArgumentException("Promotion code cannot be empty");
//         }

//         PromoCode existing = promoCodeRepository.findByPromotionCode(promoCode.getPromotionCode());
//         if (existing != null) {
//             throw new IllegalArgumentException(
//                 "Promotion code " + promoCode.getPromotionCode() + " already exists"
//             );
//         }

//         return promoCodeRepository.save(promoCode);
//     }

//     @Override
//     public PromoCode getByCode(String code) {
//         PromoCode promoCode = promoCodeRepository.findByPromotionCode(code);
//         if (promoCode == null) {
//             throw new IllegalArgumentException("Promo code not found: " + code);
//         }
//         return promoCode;
//     }

//     @Override
//     public List<String> getPromoterTypeSuggestions(String prefix) {
//         LocalDate today = LocalDate.now();
//         logger.info("Fetching promoter type suggestions with prefix: {}", prefix);
//         logger.info("Today's date: {}", today);

//         List<String> suggestions = configRepository.findAll().stream()
//             .peek(config -> logger.info("Processing config: promoterType={}, expiry={}", config.getPromoterType(), config.getExpiry()))
//             .filter(c -> c.getExpiry() != null && c.getExpiry().isAfter(today))
//             .map(PromoterSeriesConfig::getPromoterType)
//             .filter(pt -> prefix == null || pt.toLowerCase().startsWith(prefix.toLowerCase()))
//             .distinct()
//             .collect(Collectors.toList());

//         logger.info("Final suggestions: {}", suggestions);
//         return suggestions;
//     }

//     @Override
//     public List<PromoCode> getAllPromoCodes() {
//         return promoCodeRepository.findAll();
//     }

//     @Override
//     public PromoterSeriesConfig getSeriesDetails(String promoterType, int series) {
//         PromoterSeriesConfig config = configRepository.findByPromoterTypeAndSeries(promoterType, series);
//         if (config == null) {
//             throw new IllegalArgumentException("No series details found for promoter type: " + promoterType + " and series: " + series);
//         }
//         return config;
//     }

//     private Integer findUserIdByEmail(String email) {
//         UserDtls userDtls = userDtlsRepository.findByEmail(email).orElse(null);
//         if (userDtls != null) {
//             return userDtls.getUserID();
//         }

//         CorporateUser corporateUser = corporateUserRepository.findByEmail(email);
//         if (corporateUser != null) {
//             return corporateUser.getId();
//         }

//         throw new IllegalArgumentException("User with email " + email + " not found in user_dtls or corporateUser");
//     }
// }

package com.example.prog.serviceimpl.promocode;

import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.UserDtls;
import com.example.prog.entity.promocode.PromoCode;
import com.example.prog.entity.promocode.PromoterSeriesConfig;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.promocode.PromoCodeRepository;
import com.example.prog.repository.promocode.PromoterSeriesConfigRepository;
import com.example.prog.service.promocode.PromoCodeService;
import com.example.prog.service.promocode.PromoterSeriesConfigService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
public class PromoCodeServiceImpl implements PromoCodeService {

    private static final Logger logger = LoggerFactory.getLogger(PromoCodeServiceImpl.class);

    @Autowired
    private PromoCodeRepository promoCodeRepository;

    @Autowired
    private UserRepository userDtlsRepository;

    @Autowired
    private CorporateUserRepository corporateUserRepository;

    @Autowired
    private PromoterSeriesConfigService configService;

    @Autowired
    private PromoterSeriesConfigRepository configRepository;

    @Override
    public PromoCode createPromoCode(PromoCode promoCode) {
        Integer promoUserId = findUserIdByEmail(promoCode.getEmail());
        promoCode.setPromoUserId(promoUserId);

        if (promoCode.getSeries() <= 0) {
            throw new IllegalArgumentException("Series must be a positive integer");
        }

        PromoterSeriesConfig config = configService.getLatestSeriesForType(promoCode.getPromoterType());
        if (config == null) {
            throw new IllegalArgumentException(
                    "No series configuration found for promoter type: " + promoCode.getPromoterType());
        }
        if (!config.getSeries().equals(promoCode.getSeries())) {
            throw new IllegalArgumentException(
                    "Provided series " + promoCode.getSeries() + " does not match the latest series "
                            + config.getSeries() +
                            " for promoter type: " + promoCode.getPromoterType());
        }

        if (promoCode.getValidFrom().isAfter(config.getExpiry())) {
            throw new IllegalArgumentException(
                    "Valid From date " + promoCode.getValidFrom() + " exceeds series expiry " + config.getExpiry());
        }

        long count = promoCodeRepository.countByPromoterTypeAndSeries(
                promoCode.getPromoterType(), promoCode.getSeries());
        if (count >= config.getDistributionLimit()) {
            throw new IllegalArgumentException("Distribution limit reached for this series");
        }

        if (promoCode.getPromotionCode() == null || promoCode.getPromotionCode().isEmpty()) {
            throw new IllegalArgumentException("Promotion code cannot be empty");
        }

        PromoCode existing = promoCodeRepository.findByPromotionCode(promoCode.getPromotionCode());
        if (existing != null) {
            throw new IllegalArgumentException(
                    "Promotion code " + promoCode.getPromotionCode() + " already exists");
        }

        return promoCodeRepository.save(promoCode);
    }

    @Override
    public PromoCode getByCode(String code) {
        PromoCode promoCode = promoCodeRepository.findByPromotionCode(code);
        if (promoCode == null) {
            throw new IllegalArgumentException("Promo code not found: " + code);
        }
        return promoCode;
    }

    @Override
    public List<String> getPromoterTypeSuggestions(String prefix) {
        LocalDate today = LocalDate.now();
        logger.info("Fetching promoter type suggestions with prefix: {}", prefix);
        logger.info("Today's date: {}", today);

        List<String> suggestions = configRepository.findAll().stream()
                .peek(config -> logger.info("Processing config: promoterType={}, expiry={}", config.getPromoterType(),
                        config.getExpiry()))
                .filter(c -> c.getExpiry() != null && c.getExpiry().isAfter(today))
                .map(PromoterSeriesConfig::getPromoterType)
                .filter(pt -> prefix == null || pt.toLowerCase().startsWith(prefix.toLowerCase()))
                .distinct()
                .collect(Collectors.toList());

        logger.info("Final suggestions: {}", suggestions);
        return suggestions;
    }

    @Override
    public List<PromoCode> getAllPromoCodes() {
        return promoCodeRepository.findAll();
    }

    @Override
    public PromoterSeriesConfig getSeriesDetails(String promoterType, int series) {
        PromoterSeriesConfig config = configRepository.findByPromoterTypeAndSeries(promoterType, series);
        if (config == null) {
            throw new IllegalArgumentException(
                    "No series details found for promoter type: " + promoterType + " and series: " + series);
        }
        return config;
    }

    @Override
    public PromoCode updatePromoCodeDates(String code, LocalDate validFrom, LocalDate validTo) {
        PromoCode promoCode = promoCodeRepository.findByPromotionCode(code);
        if (promoCode == null) {
            throw new IllegalArgumentException("Promo code not found: " + code);
        }

        // Validate new dates
        LocalDate today = LocalDate.now();
        if (validFrom.isBefore(today)) {
            throw new IllegalArgumentException("Valid From date must be today or in the future");
        }
        if (validTo.isBefore(validFrom)) {
            throw new IllegalArgumentException("Valid To date must be after Valid From date");
        }

        // Fetch the series config to check expiry
        PromoterSeriesConfig config = configService.getLatestSeriesForType(promoCode.getPromoterType());
        if (validFrom.isAfter(config.getExpiry())) {
            throw new IllegalArgumentException("Valid From date exceeds series expiry: " + config.getExpiry());
        }

        promoCode.setValidFrom(validFrom);
        promoCode.setValidTo(validTo);
        return promoCodeRepository.save(promoCode);
    }

    private Integer findUserIdByEmail(String email) {
        UserDtls userDtls = userDtlsRepository.findByEmail(email).orElse(null);
        if (userDtls != null) {
            return userDtls.getUserID();
        }

        CorporateUser corporateUser = corporateUserRepository.findByemail(email);
        if (corporateUser != null) {
            return corporateUser.getId();
        }

        throw new IllegalArgumentException("User with email " + email + " not found in user_dtls or corporateUser");
    }

    @Override
    @Transactional
    public PromoCode updatePaymentStatus(String promotionCode, Boolean paid, String transactionId) {
        PromoCode promoCode = getByCode(promotionCode);
        if (promoCode == null) {
            throw new IllegalArgumentException("Promo code not found: " + promotionCode);
        }

        promoCode.setPaid(paid);
        promoCode.setTransactionId(transactionId);
        promoCode.setPaidAt(LocalDateTime.now());

        return promoCodeRepository.save(promoCode);
    }
}