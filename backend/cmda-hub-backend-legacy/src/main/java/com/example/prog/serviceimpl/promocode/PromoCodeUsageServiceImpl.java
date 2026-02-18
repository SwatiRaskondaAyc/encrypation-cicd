


// package com.example.prog.serviceimpl.promocode;

// import com.example.prog.dto.promocode.UserDetailsDTO;
// import com.example.prog.dto.promocode.PromoCodeStatusDTO;
// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.promocode.PromoCode;
// import com.example.prog.entity.promocode.PromoCodeUsage;
// import com.example.prog.entity.promocode.PromoterSeriesConfig;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.repository.promocode.PromoCodeUsageRepository;
// import com.example.prog.service.promocode.PromoCodeService;
// import com.example.prog.service.promocode.PromoCodeUsageService;
// import com.example.prog.service.promocode.PromoterSeriesConfigService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.time.LocalDate;
// import java.util.ArrayList;
// import java.util.List;
// import java.util.Optional;
// import java.util.stream.Collectors;

// @Service
// public class PromoCodeUsageServiceImpl implements PromoCodeUsageService {

//     @Autowired
//     private PromoCodeUsageRepository repository;

//     @Autowired
//     private PromoCodeService promoCodeService;

//     @Autowired
//     private PromoterSeriesConfigService configService;

//     @Autowired
//     private UserRepository userDtlsRepository;

//     @Autowired
//     private CorporateUserRepository corporateUserRepository;

//     @Override
//     public PromoCodeUsage recordUsage(PromoCodeUsage usage) {
//         if (usage.getUserId() <= 0 || usage.getPromoCode() == null || usage.getPromoCode().isEmpty()) {
//             throw new IllegalArgumentException("User ID and Promo Code are required");
//         }

//         PromoCode promo = promoCodeService.getByCode(usage.getPromoCode());
//         if (promo == null) {
//             throw new IllegalArgumentException("Invalid promo code: " + usage.getPromoCode());
//         }
//         if (LocalDate.now().isBefore(promo.getValidFrom()) || LocalDate.now().isAfter(promo.getValidTo())) {
//             throw new IllegalArgumentException("Promo code is not valid at this time: " + usage.getPromoCode());
//         }

//         Optional<UserDtls> userDtls = userDtlsRepository.findById(usage.getUserId());
//         CorporateUser corporateUser = corporateUserRepository.findById(usage.getUserId()).orElse(null);
//         if (!userDtls.isPresent() && corporateUser == null) {
//             throw new IllegalArgumentException("User not found for ID: " + usage.getUserId());
//         }

//         String email = userDtls.isPresent() ? userDtls.get().getEmail() : corporateUser.getEmail();
//         usage.setEmail(email);

//         usage.setUserId(promo.getPromoUserId());

//         if (usage.getUserId() == promo.getPromoUserId()) {
//             throw new IllegalArgumentException("User ID cannot be the same as the promoter's ID: " + promo.getPromoUserId());
//         }

//         usage.setRegDate(LocalDate.now());
//         PromoterSeriesConfig config = configService.getLatestSeriesForType(promo.getPromoterType());
//         if (config == null) {
//             throw new IllegalArgumentException("Promoter series configuration not found for type: " + promo.getPromoterType());
//         }
//         usage.setToDate(usage.getRegDate().plusDays(config.getUserSubDays()));

//         System.out.println("Recording usage: userId=" + usage.getUserId() + ", promoCode=" + usage.getPromoCode() +
//                 ", email=" + usage.getEmail());

//         return repository.save(usage);
//     }

//     @Override
//     public List<UserDetailsDTO> getUsersByPromoCode(String promoCode) {
//         if (promoCode == null || promoCode.isEmpty()) {
//             throw new IllegalArgumentException("Promo code is required");
//         }

//         PromoCode promo = promoCodeService.getByCode(promoCode);
//         if (promo == null) {
//             throw new IllegalArgumentException("Invalid promo code: " + promoCode);
//         }

//         List<PromoCodeUsage> usages = repository.findByPromoCode(promoCode);
//         List<UserDetailsDTO> users = new ArrayList<>();

//         for (PromoCodeUsage usage : usages) {
//             int userId = usage.getUserId();
//             String email = usage.getEmail();
//             String userType = null;

//             Optional<UserDtls> userDtls = userDtlsRepository.findById(userId);
//             if (userDtls.isPresent()) {
//                 userType = userDtls.get().getUserType();
//                 users.add(new UserDetailsDTO(userId, email, userType, usage.getPromoCode(), usage.getRegDate(), usage.getToDate()));
//                 System.out.println("Found user in user_dtls: userId=" + userId + ", email=" + email + ", userType=" + userType +
//                         ", promoCode=" + usage.getPromoCode() + ", regDate=" + usage.getRegDate() + ", toDate=" + usage.getToDate());
//                 continue;
//             }

//             CorporateUser corporateUser = corporateUserRepository.findById(userId).orElse(null);
//             if (corporateUser != null) {
//                 userType = "CORPORATE";
//                 users.add(new UserDetailsDTO(userId, email, userType, usage.getPromoCode(), usage.getRegDate(), usage.getToDate()));
//                 System.out.println("Found user in corporateUser: userId=" + userId + ", email=" + email + ", userType=" + userType +
//                         ", promoCode=" + usage.getPromoCode() + ", regDate=" + usage.getRegDate() + ", toDate=" + usage.getToDate());
//             } else {
//                 System.out.println("No user found for userId=" + userId + " in PromoCodeUsage");
//             }
//         }

//         if (users.isEmpty()) {
//             System.out.println("No users found for promoCode=" + promoCode);
//         }

//         return users;
//     }

//     @Override
//     public PromoCodeStatusDTO getPromoCodeStatus(String promoCode) {
//         if (promoCode == null || promoCode.isEmpty()) {
//             throw new IllegalArgumentException("Promo code is required");
//         }

//         PromoCode promo = promoCodeService.getByCode(promoCode);
//         if (promo == null) {
//             throw new IllegalArgumentException("Invalid promo code: " + promoCode);
//         }

//         boolean isExpired = LocalDate.now().isAfter(promo.getValidTo());

//         List<PromoCodeUsage> usages = repository.findByPromoCode(promoCode);
//         int usageCount = 0;

//         // Count only usages where the user still exists
//         for (PromoCodeUsage usage : usages) {
//             int userId = usage.getUserId();
//             Optional<UserDtls> userDtls = userDtlsRepository.findById(userId);
//             CorporateUser corporateUser = corporateUserRepository.findById(userId).orElse(null);
//             if (userDtls.isPresent() || corporateUser != null) {
//                 usageCount++;
//             } else {
//                 System.out.println("Excluding usage for deleted userId=" + userId + " for promoCode=" + promoCode);
//             }
//         }

//         PromoterSeriesConfig config = configService.getLatestSeriesForType(promo.getPromoterType());
//         if (config == null) {
//             throw new IllegalArgumentException("Promoter series configuration not found for type: " + promo.getPromoterType());
//         }
//         int distributionLimit = config.getDistributionLimit();

//         boolean limitReached = usageCount >= distributionLimit;

//         double promoCodeCommission = config.getPromoCodeCommission();
//         double totalAmountGenerated = usageCount * promoCodeCommission;

//         return new PromoCodeStatusDTO(isExpired, limitReached, totalAmountGenerated, promoCodeCommission, usageCount, distributionLimit);
//     }

//     @Override
//     public List<PromoCodeUsage> getAllPromoCodeUsages() {
//         return repository.findAll();
//     }

//     @Override
//     public List<String> getAllCreatedPromoCodes() {
//         List<PromoCode> promoCodes = promoCodeService.getAllPromoCodes();
//         return promoCodes.stream()
//                 .map(PromoCode::getPromotionCode)
//                 .distinct()
//                 .collect(Collectors.toList());
//     }
// }

package com.example.prog.serviceimpl.promocode;

import com.example.prog.dto.promocode.UserDetailsDTO;
import com.example.prog.dto.promocode.PromoCodeStatusDTO;
import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.UserDtls;
import com.example.prog.entity.promocode.PromoCode;
import com.example.prog.entity.promocode.PromoCodeUsage;
import com.example.prog.entity.promocode.PromoterSeriesConfig;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.repository.promocode.PromoCodeUsageRepository;
import com.example.prog.service.promocode.PromoCodeService;
import com.example.prog.service.promocode.PromoCodeUsageService;
import com.example.prog.service.promocode.PromoterSeriesConfigService;

import com.example.prog.dto.promocode.PromoCodeDetailedStatusDTO;

import com.example.prog.dto.promocode.PaymentRequest;
import com.example.prog.entity.promocode.Payment;
import com.example.prog.repository.promocode.PaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

import com.example.prog.dto.promocode.PromoCodeDetailedStatusDTO;

@Service
public class PromoCodeUsageServiceImpl implements PromoCodeUsageService {

    @Autowired
    private PromoCodeUsageRepository repository;

    @Autowired
    private PromoCodeService promoCodeService;

    @Autowired
    private PromoterSeriesConfigService configService;

    @Autowired
    private UserRepository userDtlsRepository;

    @Autowired
    private CorporateUserRepository corporateUserRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public PromoCodeUsage recordUsage(PromoCodeUsage usage) {
        if (usage.getUserId() <= 0 || usage.getPromoCode() == null || usage.getPromoCode().isEmpty()) {
            throw new IllegalArgumentException("User ID and Promo Code are required");
        }

        PromoCode promo = promoCodeService.getByCode(usage.getPromoCode());
        if (promo == null) {
            throw new IllegalArgumentException("Invalid promo code: " + usage.getPromoCode());
        }
        if (LocalDate.now().isBefore(promo.getValidFrom()) || LocalDate.now().isAfter(promo.getValidTo())) {
            throw new IllegalArgumentException("Promo code is not valid at this time: " + usage.getPromoCode());
        }

        Optional<UserDtls> userDtls = userDtlsRepository.findById(usage.getUserId());
        CorporateUser corporateUser = corporateUserRepository.findById(usage.getUserId()).orElse(null);
        if (!userDtls.isPresent() && corporateUser == null) {
            throw new IllegalArgumentException("User not found for ID: " + usage.getUserId());
        }

        String email = userDtls.isPresent() ? userDtls.get().getEmail() : corporateUser.getEmail();
        usage.setEmail(email);

        usage.setUserId(promo.getPromoUserId());

        if (usage.getUserId() == promo.getPromoUserId()) {
            throw new IllegalArgumentException("User ID cannot be the same as the promoter's ID: " + promo.getPromoUserId());
        }

        usage.setRegDate(LocalDate.now());
        PromoterSeriesConfig config = configService.getConfigByTypeAndSeries(promo.getPromoterType(), promo.getSeries());
        if (config == null) {
            throw new IllegalArgumentException("Promoter series configuration not found for type: " + promo.getPromoterType() + ", series: " + promo.getSeries());
        }
        usage.setToDate(usage.getRegDate().plusDays(config.getUserSubDays()));

        System.out.println("Recording usage: userId=" + usage.getUserId() + ", promoCode=" + usage.getPromoCode() +
                ", email=" + usage.getEmail());

        return repository.save(usage);
    }

    @Override
    public List<UserDetailsDTO> getUsersByPromoCode(String promoCode) {
        if (promoCode == null || promoCode.isEmpty()) {
            throw new IllegalArgumentException("Promo code is required");
        }

        PromoCode promo = promoCodeService.getByCode(promoCode);
        if (promo == null) {
            throw new IllegalArgumentException("Invalid promo code: " + promoCode);
        }

        List<PromoCodeUsage> usages = repository.findByPromoCode(promoCode);
        List<UserDetailsDTO> users = new ArrayList<>();

        for (PromoCodeUsage usage : usages) {
            int userId = usage.getUserId();
            String email = usage.getEmail();
            String userType = null;

            Optional<UserDtls> userDtls = userDtlsRepository.findById(userId);
            if (userDtls.isPresent()) {
                // userType = userDtls.get().getUserType();
                users.add(new UserDetailsDTO(userId, email, userType, usage.getPromoCode(), usage.getRegDate(), usage.getToDate()));
                System.out.println("Found user in user_dtls: userId=" + userId + ", email=" + email + ", userType=" + userType +
                        ", promoCode=" + usage.getPromoCode() + ", regDate=" + usage.getRegDate() + ", toDate=" + usage.getToDate());
                continue;
            }

            CorporateUser corporateUser = corporateUserRepository.findById(userId).orElse(null);
            if (corporateUser != null) {
                userType = "CORPORATE";
                users.add(new UserDetailsDTO(userId, email, userType, usage.getPromoCode(), usage.getRegDate(), usage.getToDate()));
                System.out.println("Found user in corporateUser: userId=" + userId + ", email=" + email + ", userType=" + userType +
                        ", promoCode=" + usage.getPromoCode() + ", regDate=" + usage.getRegDate() + ", toDate=" + usage.getToDate());
            } else {
                System.out.println("No user found for userId=" + userId + " in PromoCodeUsage");
            }
        }

        if (users.isEmpty()) {
            System.out.println("No users found for promoCode=" + promoCode);
        }

        return users;
    }

    @Override
    public PromoCodeDetailedStatusDTO getPromoCodeStatus(String promoCode) {
    if (promoCode == null || promoCode.isEmpty()) {
        throw new IllegalArgumentException("Promo code is required");
    }

    PromoCode promo = promoCodeService.getByCode(promoCode);
    if (promo == null) {
        throw new IllegalArgumentException("Invalid promo code: " + promoCode);
    }

    boolean isExpired = LocalDate.now().isAfter(promo.getValidTo());

    List<PromoCodeUsage> usages = repository.findByPromoCode(promoCode);
    int usageCount = 0;

    // Count only usages where the user still exists
    for (PromoCodeUsage usage : usages) {
        int userId = usage.getUserId();
        Optional<UserDtls> userDtls = userDtlsRepository.findById(userId);
        CorporateUser corporateUser = corporateUserRepository.findById(userId).orElse(null);
        if (userDtls.isPresent() || corporateUser != null) {
            usageCount++;
        } else {
            System.out.println("Excluding usage for deleted userId=" + userId + " for promoCode=" + promoCode);
        }
    }

    PromoterSeriesConfig config = configService.getConfigByTypeAndSeries(promo.getPromoterType(), promo.getSeries());
    if (config == null) {
        throw new IllegalArgumentException("Promoter series configuration not found for type: " + promo.getPromoterType() + ", series: " + promo.getSeries());
    }
    int distributionLimit = config.getDistributionLimit();

    boolean limitReached = usageCount >= distributionLimit;

    double promoCodeCommission = config.getPromoCodeCommission();
    double totalAmountGenerated = usageCount * promoCodeCommission;

    // Create the basic status DTO
    PromoCodeStatusDTO statusDTO = new PromoCodeStatusDTO(
        isExpired, 
        limitReached, 
        totalAmountGenerated, 
        promoCodeCommission, 
        usageCount, 
        distributionLimit
    );

    // NEW: Fetch payment information from promo_payments table
    Boolean paid = false;
    String transactionId = null;
    LocalDateTime paidAt = null;
    
    Optional<Payment> payment = paymentRepository.findByPromoCode(promoCode);
    if (payment.isPresent()) {
        paid = true;
        transactionId = payment.get().getTransactionId();
        paidAt = payment.get().getPaidAt();
    }

    // Return the complete detailed DTO with payment information
    return new PromoCodeDetailedStatusDTO(
        statusDTO,  // The basic status info
        paid,       // Payment status
        transactionId, // Transaction ID
        paidAt      // Payment date
    );
}

    @Override
    public List<PromoCodeUsage> getAllPromoCodeUsages() {
        return repository.findAll();
    }

    @Override
    public List<String> getAllCreatedPromoCodes() {
        List<PromoCode> promoCodes = promoCodeService.getAllPromoCodes();
        return promoCodes.stream()
                .map(PromoCode::getPromotionCode)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Map<String, Object> markPromoCodeAsPaid(String promoCode, PaymentRequest paymentRequest) {
        if (promoCode == null || promoCode.isEmpty()) {
            throw new IllegalArgumentException("Promo code is required");
        }

        if (paymentRequest.getTransactionId() == null || paymentRequest.getTransactionId().trim().isEmpty()) {
            throw new IllegalArgumentException("Transaction ID is required");
        }

        // Get promo code
        PromoCode promo = promoCodeService.getByCode(promoCode);
        if (promo == null) {
            throw new IllegalArgumentException("Invalid promo code: " + promoCode);
        }

        // Check if already paid
        if (promo.getPaid() != null && promo.getPaid()) {
            throw new IllegalArgumentException("Promo code is already paid");
        }

        // Check if transaction ID already exists
        if (paymentRepository.existsByTransactionId(paymentRequest.getTransactionId())) {
            throw new IllegalArgumentException("Transaction ID already exists: " + paymentRequest.getTransactionId());
        }

        // Get promoter config to calculate commission
        PromoterSeriesConfig config = configService.getConfigByTypeAndSeries(promo.getPromoterType(), promo.getSeries());
        if (config == null) {
            throw new IllegalArgumentException("Promoter series configuration not found for type: " + promo.getPromoterType() + ", series: " + promo.getSeries());
        }

        // Calculate total commission based on valid usages
        List<PromoCodeUsage> usages = repository.findByPromoCode(promoCode);
        int validUsageCount = 0;
        
        // Count only valid usages (users that still exist)
        for (PromoCodeUsage usage : usages) {
            int userId = usage.getUserId();
            Optional<UserDtls> userDtls = userDtlsRepository.findById(userId);
            CorporateUser corporateUser = corporateUserRepository.findById(userId).orElse(null);
            if (userDtls.isPresent() || corporateUser != null) {
                validUsageCount++;
            }
        }

        double totalCommission = validUsageCount * config.getPromoCodeCommission();

        // Update promo code payment status
        PromoCode updatedPromo = promoCodeService.updatePaymentStatus(
            promoCode, 
            true, 
            paymentRequest.getTransactionId()
        );

        // Create payment record
        Payment payment = new Payment();
        payment.setPromoCode(promoCode);
        payment.setTransactionId(paymentRequest.getTransactionId());
        payment.setAmount(totalCommission);
        payment.setStatus("completed");
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Prepare response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Promo code marked as paid successfully");
        response.put("transactionId", paymentRequest.getTransactionId());
        response.put("paidAt", LocalDateTime.now());
        response.put("totalCommission", totalCommission);
        response.put("usageCount", validUsageCount);
        response.put("promoCode", promoCode);
        response.put("promoterType", promo.getPromoterType());
        response.put("series", promo.getSeries());

        return response;
    }
}