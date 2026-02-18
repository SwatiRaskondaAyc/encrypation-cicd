
// //code with promocode distribution logic
// package com.example.prog.controller;

// import com.example.prog.config.CorsConfig;
// import com.example.prog.dto.LoginDTO;
// import com.example.prog.eamilservice.EmailService;
// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.otp.OtpStorageService;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.service.UserActivityService;
// import com.example.prog.token.JwtUtil;
// import com.example.prog.service.TokenStoreService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.web.bind.annotation.*;
// import java.time.Duration;
// import java.time.Instant;
// import java.util.Collections;
// import java.util.Map;
// import java.util.Optional;
// import jakarta.servlet.http.HttpServletRequest;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory; 

// import com.example.prog.repository.promocode.PromoCodeRepository;
// import com.example.prog.repository.promocode.PromoCodeUsageRepository;
// import com.example.prog.repository.promocode.PromoterSeriesConfigRepository;
// import com.example.prog.entity.promocode.PromoCode;
// import com.example.prog.entity.promocode.PromoCodeUsage;
// import com.example.prog.entity.promocode.PromoterSeriesConfig;
// import java.time.LocalDate;

// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {

//     @Autowired
//     private CorsConfig corsConfig;

//     @Autowired
//     private CorporateUserRepository corporateUserRepository;

//     @Autowired
//     private UserRepository individualUserRepository;

//     @Autowired
//     private BCryptPasswordEncoder passwordEncoder;

//     @Autowired
//     private EmailService emailService;

//     @Autowired
//     private OtpStorageService otpStorageService;

//     @Autowired
//     private JwtUtil jwtUtil;

//     @Autowired
//     private TokenStoreService tokenStoreService;

//     @Autowired
//     private UserActivityService userActivityService;

//     @Autowired
//     private PromoCodeRepository promoterRepository; // For Promoters table
//     @Autowired
//     private PromoCodeUsageRepository promoTransactionRepository; // For PromoTransactions table
//     @Autowired
//     private PromoterSeriesConfigRepository promoterSeriesConfigRepository; // For userSubDays

//     private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

//     private void logUserActivity(String email, String userType, String activityType) {
//         if (email == null) {
//             email = "UNKNOWN";
//         }
//         userActivityService.logUserActivity(email, userType, activityType);
//     }

//      @PostMapping("/send-otp")
//     public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> requestBody) {
//         String email = requestBody.get("email");
//         if (email == null || email.isEmpty()) {
//             logUserActivity(email, "INDIVIDUAL", "SEND_OTP_FAILED");
//             return ResponseEntity.badRequest().body("Email is required");
//         }

//         try {
//             // Check CorporateUser with status = 1
//             CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//             if (corporateUser != null && corporateUser.getStatus() == 1) {
//                 logUserActivity(email, "INDIVIDUAL", "SEND_OTP_FAILED");
//                 return ResponseEntity.badRequest().body("Email already registered in corporate_user with active status.");
//             }

//             // Check UserDtls with status = 1
//             Optional<UserDtls> individualUser = individualUserRepository.findByEmail(email);
//             if (individualUser.isPresent() && individualUser.get().getStatus() == 1) {
//                 logUserActivity(email, "INDIVIDUAL", "SEND_OTP_FAILED");
//                 return ResponseEntity.badRequest().body("Email already registered in user_dtls with active status.");
//             }

//             // If no active user is found (either no user or status = 0), proceed with OTP
//             String otp = emailService.generateOTP();
//             otpStorageService.storeOtp(email, otp);
//             emailService.sendOtpEmail(email, otp);
//             logUserActivity(email, "INDIVIDUAL", "SEND_OTP");
//             return ResponseEntity.ok("OTP sent successfully to " + email);
//         } catch (Exception e) {
//             e.printStackTrace();
//             logUserActivity(email, "INDIVIDUAL", "SEND_OTP_ERROR");
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while sending OTP.");
//         }
//     }

//     @PostMapping("/verify-otp")
//     public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> requestBody) {
//         String email = requestBody.get("email");
//         String otp = requestBody.get("otp");

//         if (email == null || otp == null) {
//             logUserActivity(email, "INDIVIDUAL", "VERIFY_OTP_FAILED");
//             return ResponseEntity.badRequest().body("Email and OTP are required.");
//         }

//         boolean isValid = otpStorageService.validateOtp(email, otp);
//         if (isValid) {
//             logUserActivity(email, "INDIVIDUAL", "VERIFY_OTP_SUCCESS");
//             return ResponseEntity.ok("OTP verified successfully. You can now proceed with registration.");
//         } else {
//             logUserActivity(email, "INDIVIDUAL", "VERIFY_OTP_FAILED");
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or Expired OTP!");
//         }
//     }

//     @PostMapping("/corporate/register")
// public String registerCorporateUser(@RequestBody CorporateUser user) {
//     String email = user.getEmail();
//     if (email == null || !otpStorageService.isOtpVerified(email)) {
//         logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//         return "Email is not verified. Please verify the email first.";
//     }

//     CorporateUser existingUser = corporateUserRepository.findByEmail(email); // Corrected method name
//     if (existingUser != null) {
//         if (existingUser.getStatus() == 1) {
//             logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//             return "Email is already registered with active status.";
//         } else {
//             existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
//             if (user.getCompanyName() != null) existingUser.setCompanyName(user.getCompanyName());
//             if (user.getEmployeeName() != null) existingUser.setEmployeeName(user.getEmployeeName());
//             if (user.getJobTitle() != null) existingUser.setJobTitle(user.getJobTitle());
//             if (user.getMobileNum() != null) existingUser.setMobileNum(user.getMobileNum());
//             if (user.getUserType() != null) existingUser.setUserType(user.getUserType());
//             // Ensure adminId is set if null (for legacy data)
//             if (existingUser.getAdminId() == null) {
//                 String companyName = user.getCompanyName();
//                 if (companyName == null || companyName.trim().isEmpty()) {
//                     logUserActivity(email, "CORPORATE", "CORPORATE_REACTIVATION_FAILED");
//                     return "Company name is required for reactivation.";
//                 }
//                 String adminIdPrefix = companyName.length() >= 3 ? companyName.substring(0, 3).toLowerCase() : companyName.toLowerCase();
//                 String pattern = adminIdPrefix + "%";
//                 int maxIncrement = corporateUserRepository.findMaxAdminIdIncrement(adminIdPrefix, pattern);
//                 int newIncrement = maxIncrement + 1;
//                 String adminId = String.format("%s%02d", adminIdPrefix, newIncrement);
//                 existingUser.setAdminId(adminId);
//             }
//             existingUser.setStatus(1);
//             corporateUserRepository.save(existingUser);
//             logUserActivity(email, "CORPORATE", "CORPORATE_REACTIVATION_SUCCESS");
//             otpStorageService.removeOtp(email);
//             return "Corporate user reactivated successfully with Admin ID: " + existingUser.getAdminId();
//         }
//     }

//     String companyName = user.getCompanyName();
//     if (companyName == null || companyName.trim().isEmpty()) {
//         logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//         return "Company name is required.";
//     }

//     String adminIdPrefix = companyName.length() >= 3 ? companyName.substring(0, 3).toLowerCase() : companyName.toLowerCase();
//     String pattern = adminIdPrefix + "%";
//     int maxIncrement = corporateUserRepository.findMaxAdminIdIncrement(adminIdPrefix, pattern);
//     int newIncrement = maxIncrement + 1;
//     String adminId = String.format("%s%02d", adminIdPrefix, newIncrement);
//     user.setAdminId(adminId);

//     // Validate promo code (optional) before new registration
//     if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
//         PromoCode promoter = promoterRepository.findByPromotionCode(user.getPromoCode());
//         if (promoter == null) {
//             logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//             return "Invalid promo code.";
//         }
//         LocalDate today = LocalDate.now();
//         if (today.isBefore(promoter.getValidFrom()) || today.isAfter(promoter.getValidTo())) {
//             logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//             return "Promo code is not valid or has expired.";
//         }
//         PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                 .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
//         if (seriesConfig == null) {
//             logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//             return "Promoter series configuration not found.";
//         }
//         // Check distribution limit
//         long usageCount = promoTransactionRepository.countByPromoCode(user.getPromoCode());
//         if (usageCount >= seriesConfig.getDistributionLimit()) {
//             logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//             return "Promo code limit has been reached.";
//         }
//     }

//     user.setPassword(passwordEncoder.encode(user.getPassword()));
//     user.setStatus(1);
//     corporateUserRepository.save(user);

//     // Record promo code usage if provided
//     if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
//         PromoCodeUsage promoTransaction = new PromoCodeUsage();
//         promoTransaction.setUserId(user.getId()); // Assuming id is the primary key
//         promoTransaction.setPromoCode(user.getPromoCode());
//         promoTransaction.setRegDate(LocalDate.now());
//         PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                 .findByPromoterTypeAndSeries(promoterRepository.findByPromotionCode(user.getPromoCode()).getPromoterType(), promoterRepository.findByPromotionCode(user.getPromoCode()).getSeries());
//         promoTransaction.setToDate(LocalDate.now().plusDays(seriesConfig.getUserSubDays()));
//         promoTransaction.setEmail(email);
//         promoTransactionRepository.save(promoTransaction);
//     }

//     logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_SUCCESS");
//     otpStorageService.removeOtp(email);
//     return "Corporate user registered successfully with Admin ID: " + adminId;
// }

// @PostMapping("/individual/register")
// public String registerIndividualUser(@RequestBody UserDtls user) {
//     String email = user.getEmail();
//     if (email == null || !otpStorageService.isOtpVerified(email)) {
//         logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
//         return "Email is not verified. Please verify the email first.";
//     }

//     // Check if user exists
//     Optional<UserDtls> existingUserOptional = individualUserRepository.findByEmail(email);
//     if (existingUserOptional.isPresent()) {
//         UserDtls existingUser = existingUserOptional.get();
//         if (existingUser.getStatus() == 1) {
//             logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
//             return "Email is already registered with active status.";
//         } else {
//             // Reactivate inactive user (status = 0)
//             existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
//             // Update other fields if provided
//             if (user.getFullname() != null) existingUser.setFullname(user.getFullname());
//             if (user.getMobileNum() != null) existingUser.setMobileNum(user.getMobileNum());
//             if (user.getUserType() != null) existingUser.setUserType(user.getUserType());
//             existingUser.setStatus(1);
//             individualUserRepository.save(existingUser);
//             logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REACTIVATION_SUCCESS");
//             otpStorageService.removeOtp(email);
//             return "Individual user reactivated successfully.";
//         }
//     }

//     // Validate promo code (optional) before new registration
//     if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
//         PromoCode promoter = promoterRepository.findByPromotionCode(user.getPromoCode());
//         if (promoter == null) {
//             logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
//             return "Invalid promo code.";
//         }
//         LocalDate today = LocalDate.now();
//         if (today.isBefore(promoter.getValidFrom()) || today.isAfter(promoter.getValidTo())) {
//             logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
//             return "Promo code is not valid or has expired.";
//         }
//         PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                 .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
//         if (seriesConfig == null) {
//             logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
//             return "Promoter series configuration not found.";
//         }
//         // Check distribution limit
//         long usageCount = promoTransactionRepository.countByPromoCode(user.getPromoCode());
//         if (usageCount >= seriesConfig.getDistributionLimit()) {
//             logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
//             return "Promo code limit has been reached.";
//         }
//     }

//     // New user registration
//     user.setPassword(passwordEncoder.encode(user.getPassword()));
//     user.setStatus(1);
//     individualUserRepository.save(user);

//     // Record promo code usage if provided
//     if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
//         PromoCodeUsage promoTransaction = new PromoCodeUsage();
//         promoTransaction.setUserId(user.getUserID()); // Assuming userID is the primary key
//         promoTransaction.setPromoCode(user.getPromoCode());
//         promoTransaction.setRegDate(LocalDate.now());
//         PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                 .findByPromoterTypeAndSeries(promoterRepository.findByPromotionCode(user.getPromoCode()).getPromoterType(), promoterRepository.findByPromotionCode(user.getPromoCode()).getSeries());
//         promoTransaction.setToDate(LocalDate.now().plusDays(seriesConfig.getUserSubDays()));
//         promoTransaction.setEmail(email);
//         promoTransactionRepository.save(promoTransaction);
//     }

//     logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_SUCCESS");
//     otpStorageService.removeOtp(email);
//     return "Individual user registered successfully";
// }

// //    @PostMapping("/login")
// // public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginDTO loginRequest) {
// //     System.out.println("Login attempt for email: " + loginRequest.getEmail());

// //     CorporateUser corporateUser = corporateUserRepository.findByemail(loginRequest.getEmail());
// //     if (corporateUser != null) {
// //         System.out.println("Corporate user found: " + corporateUser.getEmail());

// //         if (corporateUser.getStatus() == 0) {
// //             System.out.println("Corporate user is inactive: " + corporateUser.getEmail());
// //             logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN");
// //             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Your account has been deactivated. Contact admin."));
// //         }

// //         if (passwordEncoder.matches(loginRequest.getPassword(), corporateUser.getPassword())) {
// //             String token = jwtUtil.generateToken(corporateUser.getEmail()); // Use injected instance
// //             String userType = "CORPORATE";
// //             tokenStoreService.storeToken(userType, corporateUser.getEmail(), token); // Store token in Redis
// //             System.out.println("Token stored successfully for user: " + corporateUser.getEmail() + " with key: cmda_log_user:token:" + userType + ":" + corporateUser.getEmail());
// //             logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN");
// //             return ResponseEntity.ok(Map.of(
// //                 "message", "Corporate login successful for company: " + corporateUser.getCompanyName(),
// //                 "token", token,
// //                 "userType", "corporate"
// //             ));
// //         } else {
// //             System.out.println("Corporate user password mismatch.");
// //             System.out.println("Stored hash: " + corporateUser.getPassword());
// //             System.out.println("Input password encoded: " + passwordEncoder.encode(loginRequest.getPassword()));
// //             logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN");
// //             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
// //         }
// //     }

// //     UserDtls individualUser = individualUserRepository.findByEmail(loginRequest.getEmail()).orElse(null);
// //     if (individualUser != null) {
// //         System.out.println("Individual user found: " + individualUser.getEmail());

// //         if (individualUser.getStatus() == 0) {
// //             System.out.println("Individual user is inactive: " + individualUser.getEmail());
// //             logUserActivity(loginRequest.getEmail(), "INDIVIDUAL", "INDIVIDUAL_LOGIN");
// //             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Your account has been deactivated. Contact admin."));
// //         }

// //         if (passwordEncoder.matches(loginRequest.getPassword(), individualUser.getPassword())) {
// //             String token = jwtUtil.generateToken(individualUser.getEmail()); // Use injected instance
// //             String userType = "INDIVIDUAL";
// //             tokenStoreService.storeToken(userType, individualUser.getEmail(), token); // Store token in Redis
// //             System.out.println("Token stored successfully for user: " + individualUser.getEmail() + " with key: cmda_log_user:token:" + userType + ":" + individualUser.getEmail());
// //             logUserActivity(loginRequest.getEmail(), "INDIVIDUAL", "INDIVIDUAL_LOGIN");
// //             return ResponseEntity.ok(Map.of(
// //                 "message", "Individual login successful for user: " + individualUser.getFullname(),
// //                 "token", token,
// //                 "userType", "individual"
// //             ));
// //         } else {
// //             System.out.println("Individual user password mismatch.");
// //             System.out.println("Stored hash: " + individualUser.getPassword());
// //             System.out.println("Input password encoded: " + passwordEncoder.encode(loginRequest.getPassword()));
// //             logUserActivity(loginRequest.getEmail(), "INDIVIDUAL", "INDIVIDUAL_LOGIN");
// //             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
// //         }
// //     }

// //     System.out.println("User not found.");
// //     logUserActivity(loginRequest.getEmail(), "UNKNOWN", "LOGIN");
// //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
// // }

//  @PostMapping("/login")
//     public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginDTO loginRequest) {
//         System.out.println("Login attempt for email: " + loginRequest.getEmail());

//         CorporateUser corporateUser = corporateUserRepository.findByemail(loginRequest.getEmail());
//         if (corporateUser != null) {
//             System.out.println("Corporate user found: " + corporateUser.getEmail());

//             // Check subscription status
//             if (corporateUser.getSubscription() == null) {
//                 // User hasn't been prompted for subscription yet
//                 corporateUser.setSubscription(loginRequest.getSubscribeToCMDA() ? 1 : 0);
//                 corporateUserRepository.save(corporateUser);
//                 System.out.println("Subscription status updated for corporate user: " + corporateUser.getEmail() + 
//                                    ", Subscribed: " + loginRequest.getSubscribeToCMDA());
//             }

//             if (corporateUser.getStatus() == 0) {
//                 System.out.println("Corporate user is inactive: " + corporateUser.getEmail());
//                 logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN");
//                 return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Your account has been deactivated. Contact admin."));
//             }

//             if (passwordEncoder.matches(loginRequest.getPassword(), corporateUser.getPassword())) {
//                 String token = jwtUtil.generateToken(corporateUser.getEmail());
//                 String userType = "CORPORATE";
//                 tokenStoreService.storeToken(userType, corporateUser.getEmail(), token);
//                 System.out.println("Token stored successfully for user: " + corporateUser.getEmail() + 
//                                    " with key: cmda_log_user:token:" + userType + ":" + corporateUser.getEmail());
//                 logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN");
//                 return ResponseEntity.ok(Map.of(
//                     "message", "Corporate login successful for company: " + corporateUser.getCompanyName(),
//                     "token", token,
//                     "userType", "corporate",
//                     "subscribed", corporateUser.getSubscription() == 1 ? "true" : "false"
//                 ));
//             } else {
//                 System.out.println("Corporate user password mismatch.");
//                 System.out.println("Stored hash: " + corporateUser.getPassword());
//                 System.out.println("Input password encoded: " + passwordEncoder.encode(loginRequest.getPassword()));
//                 logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN");
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
//             }
//         }

//         UserDtls individualUser = individualUserRepository.findByEmail(loginRequest.getEmail()).orElse(null);
//         if (individualUser != null) {
//             System.out.println("Individual user found: " + individualUser.getEmail());

//             // Check subscription status
//             if (individualUser.getSubscription() == null) {
//                 // User hasn't been prompted for subscription yet
//                 individualUser.setSubscription(loginRequest.getSubscribeToCMDA() ? 1 : 0);
//                 individualUserRepository.save(individualUser);
//                 System.out.println("Subscription status updated for individual user: " + individualUser.getEmail() + 
//                                    ", Subscribed: " + loginRequest.getSubscribeToCMDA());
//             }

//             if (individualUser.getStatus() == 0) {
//                 System.out.println("Individual user is inactive: " + individualUser.getEmail());
//                 logUserActivity(loginRequest.getEmail(), "INDIVIDUAL", "INDIVIDUAL_LOGIN");
//                 return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Your account has been deactivated. Contact admin."));
//             }

//             if (passwordEncoder.matches(loginRequest.getPassword(), individualUser.getPassword())) {
//                 String token = jwtUtil.generateToken(individualUser.getEmail());
//                 String userType = "INDIVIDUAL";
//                 tokenStoreService.storeToken(userType, individualUser.getEmail(), token);
//                 System.out.println("Token stored successfully for user: " + individualUser.getEmail() + 
//                                    " with key: cmda_log_user:token:" + userType + ":" + individualUser.getEmail());
//                 logUserActivity(loginRequest.getEmail(), "INDIVIDUAL", "INDIVIDUAL_LOGIN");
//                 return ResponseEntity.ok(Map.of(
//                     "message", "Individual login successful for user: " + individualUser.getFullname(),
//                     "token", token,
//                     "userType", "individual",
//                     "subscribed", individualUser.getSubscription() == 1 ? "true" : "false"
//                 ));
//             } else {
//                 System.out.println("Individual user password mismatch.");
//                 System.out.println("Stored hash: " + individualUser.getPassword());
//                 System.out.println("Input password encoded: " + passwordEncoder.encode(loginRequest.getPassword()));
//                 logUserActivity(loginRequest.getEmail(), "INDIVIDUAL", "INDIVIDUAL_LOGIN");
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
//             }
//         }

//         System.out.println("User not found.");
//         logUserActivity(loginRequest.getEmail(), "UNKNOWN", "LOGIN");
//         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
//     }

//   @PostMapping("/logout")
// public ResponseEntity<String> logout(@RequestBody Map<String, String> body, HttpServletRequest request) {
//     String email = body.get("email");
//     if (email == null || email.isEmpty()) {
//         userActivityService.logUserActivity(email, "UNKNOWN", "LOGOUT_FAILED");
//         return ResponseEntity.badRequest().body("Email is required.");
//     }

//     String userType = null;
//     CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//     if (corporateUser != null) {
//         userType = "CORPORATE";
//     } else {
//         UserDtls individualUser = individualUserRepository.findByEmail(email).orElse(null);
//         if (individualUser != null) {
//             userType = "INDIVIDUAL";
//         }
//     }

//     if (userType == null) {
//         userActivityService.logUserActivity(email, "UNKNOWN", "LOGOUT_FAILED");
//         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
//     }

//     String authHeader = request.getHeader("Authorization");
//     if (authHeader != null && authHeader.startsWith("Bearer ")) {
//         String token = authHeader.substring(7);
//         Instant tokenCreationTime = jwtUtil.getTokenCreationTime(token);
//         logger.debug("Checking token creation time for email: {}, token: {}", email, token);
//         if (tokenCreationTime != null) {
//             Instant now = Instant.now();
//             logger.debug("Current time: {}, Token creation time: {}", now, tokenCreationTime);
//             Duration inactivityDuration = Duration.between(tokenCreationTime, now);
//             logger.debug("Inactivity duration: {} seconds", inactivityDuration.getSeconds());
//             if (inactivityDuration.getSeconds() > 900) {
//                 logger.debug("Token expired due to inactivity (> 2 hours) for email: {}", email);
//                 tokenStoreService.removeToken(userType.toUpperCase(), email);
//                 userActivityService.logUserActivity(email, userType.toUpperCase(), userType.toUpperCase() + "_AUTO_LOGOUT");
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                         .body("Session expired due to inactivity. Please log in again.");
//             }
//         } else {
//             logger.warn("Token creation time is null for email: {}", email);
//         }
//     } else {
//         logger.warn("No Authorization header or invalid format for email: {}", email);
//     }

//     try {
//         tokenStoreService.removeToken(userType.toUpperCase(), email);
//         userActivityService.logUserActivity(email, userType.toUpperCase(), userType.toUpperCase() + "_LOGOUT_SUCCESS");
//         logger.debug("Manual logout successful for email: {}", email);
//         return ResponseEntity.ok("Logged out successfully.");
//     } catch (Exception e) {
//         userActivityService.logUserActivity(email, userType.toUpperCase(), "LOGOUT_FAILED");
//         logger.error("Logout failed for email: {}, error: {}", email, e.getMessage(), e);
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Logout failed: " + e.getMessage());
//     }
// }

//      @PostMapping("/validate-token")
//      public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String authHeader) {
//     if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token.");
//     }

//     String token = authHeader.substring(7);
//     try {
//         Instant tokenCreationTime = jwtUtil.getTokenCreationTime(token);
//         if (tokenCreationTime == null) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token.");
//         }

//         Instant now = Instant.now();
//         Duration inactivityDuration = Duration.between(tokenCreationTime, now);
//         String email = jwtUtil.extractEmail(token);
//         String userType = jwtUtil.extractUserType(token);

//         // Determine userType from database if not in token
//         if (userType == null) {
//             CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//             if (corporateUser != null) {
//                 userType = "CORPORATE";
//             } else {
//                 UserDtls individualUser = individualUserRepository.findByEmail(email).orElse(null);
//                 if (individualUser != null) {
//                     userType = "INDIVIDUAL";
//                 }
//             }
//         }

//         if (userType == null) {
//             userActivityService.logUserActivity(email, "UNKNOWN", "VALIDATE_TOKEN_FAILED");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
//         }

//         if (inactivityDuration.getSeconds() > 900) {
//             tokenStoreService.removeToken(userType.toUpperCase(), email);
//             userActivityService.logUserActivity(email, userType.toUpperCase(), userType.toUpperCase() + "_AUTO_LOGOUT");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired due to inactivation.");
//         }

//         return ResponseEntity.ok("Token is valid.");
//     } catch (Exception e) {
//         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token: " + e.getMessage());
//     }
// }

//     @PostMapping("/check-user-type")
//     public ResponseEntity<?> checkUserType(@RequestBody Map<String, String> request) {
//         String email = request.get("email");

//         CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//         if (corporateUser != null) {
//             logUserActivity(email, "CORPORATE", "CHECK_USER_TYPE");
//             return ResponseEntity.ok(Collections.singletonMap("userType", "corporate"));
//         }

//         UserDtls individualUser = individualUserRepository.findByEmail(email).orElse(null);
//         if (individualUser != null) {
//             logUserActivity(email, "INDIVIDUAL", "CHECK_USER_TYPE");
//             return ResponseEntity.ok(Collections.singletonMap("userType", "individual"));
//         }

//         logUserActivity(email, "UNKNOWN", "CHECK_USER_TYPE_FAILED");
//         return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                 .body(Collections.singletonMap("message", "User not found"));
//     }

//     // Getters and setters (optional, use constructor injection instead if preferred)
//     public CorporateUserRepository getCorporateUserRepository() {
//         return corporateUserRepository;
//     }

//     public void setCorporateUserRepository(CorporateUserRepository corporateUserRepository) {
//         this.corporateUserRepository = corporateUserRepository;
//     }

//     public UserRepository getIndividualUserRepository() {
//         return individualUserRepository;
//     }

//     public void setIndividualUserRepository(UserRepository individualUserRepository) {
//         this.individualUserRepository = individualUserRepository;
//     }

//     public BCryptPasswordEncoder getPasswordEncoder() {
//         return passwordEncoder;
//     }

//     public void setPasswordEncoder(BCryptPasswordEncoder passwordEncoder) {
//         this.passwordEncoder = passwordEncoder;
//     }
// }

// package com.example.prog.controller;

// import java.time.Duration;
// import java.time.Instant;
// import java.time.LocalDate;
// import java.util.Collections;
// import java.util.Map;
// import java.util.Optional;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestHeader;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.example.prog.config.CorsConfig;
// import com.example.prog.dto.LoginDTO;
// import com.example.prog.eamilservice.EmailService;
// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.promocode.PromoCode;
// import com.example.prog.entity.promocode.PromoCodeUsage;
// import com.example.prog.entity.promocode.PromoterSeriesConfig;
// import com.example.prog.otp.OtpStorageService;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.promocode.PromoCodeRepository;
// import com.example.prog.repository.promocode.PromoCodeUsageRepository;
// import com.example.prog.repository.promocode.PromoterSeriesConfigRepository;
// import com.example.prog.service.TokenStoreService;
// import com.example.prog.service.UserActivityService;
// import com.example.prog.service.UserLoginActivityService;
// import com.example.prog.token.JwtUtil;

// import jakarta.servlet.http.HttpServletRequest;
// import org.springframework.transaction.annotation.Transactional;

// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {

//     @Autowired
//     private CorsConfig corsConfig;

//     @Autowired
//     private CorporateUserRepository corporateUserRepository;

//     @Autowired
//     private UserRepository individualUserRepository;

//     @Autowired
//     private BCryptPasswordEncoder passwordEncoder;

//     @Autowired
//     private EmailService emailService;

//     @Autowired
//     private OtpStorageService otpStorageService;

//     @Autowired
//     private JwtUtil jwtUtil;

//     @Autowired
//     private TokenStoreService tokenStoreService;

//     @Autowired
//     private UserActivityService userActivityService;

//     @Autowired
//     private UserLoginActivityService loginActivityService; // NEW: Added login activity service

//     @Autowired
//     private PromoCodeRepository promoterRepository; // For Promoters table
//     @Autowired
//     private PromoCodeUsageRepository promoTransactionRepository; // For PromoTransactions table
//     @Autowired
//     private PromoterSeriesConfigRepository promoterSeriesConfigRepository; // For userSubDays

//     private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

//     private void logUserActivity(String email, String userType, String activityType) {
//         if (email == null) {
//             email = "UNKNOWN";
//         }
//         userActivityService.logUserActivity(email, userType, activityType);
//     }

//     // NEW: Helper method to get client IP address
//     private String getClientIP(HttpServletRequest request) {
//         String xfHeader = request.getHeader("X-Forwarded-For");
//         if (xfHeader == null) {
//             return request.getRemoteAddr();
//         }
//         return xfHeader.split(",")[0];
//     }

//      @PostMapping("/send-otp")
//     public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> requestBody) {
//         String email = requestBody.get("email");
//         if (email == null || email.isEmpty()) {
//             logUserActivity(email, "INDIVIDUAL", "SEND_OTP_FAILED");
//             return ResponseEntity.badRequest().body("Email is required");
//         }

//         try {
//             // Check CorporateUser with status = 1
//             CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//             if (corporateUser != null && corporateUser.getStatus() == 1) {
//                 logUserActivity(email, "INDIVIDUAL", "SEND_OTP_FAILED");
//                 return ResponseEntity.badRequest().body("Email already registered in corporate_user with active status.");
//             }

//             // Check UserDtls with status = 1
//             Optional<UserDtls> individualUser = individualUserRepository.findByEmail(email);
//             if (individualUser.isPresent() && individualUser.get().getStatus() == 1) {
//                 logUserActivity(email, "INDIVIDUAL", "SEND_OTP_FAILED");
//                 return ResponseEntity.badRequest().body("Email already registered in user_dtls with active status.");
//             }

//             // If no active user is found (either no user or status = 0), proceed with OTP
//             String otp = emailService.generateOTP();
//             otpStorageService.storeOtp(email, otp);
//             emailService.sendOtpEmail(email, otp);
//             logUserActivity(email, "INDIVIDUAL", "SEND_OTP");
//             return ResponseEntity.ok("OTP sent successfully to " + email);
//         } catch (Exception e) {
//             e.printStackTrace();
//             logUserActivity(email, "INDIVIDUAL", "SEND_OTP_ERROR");
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while sending OTP.");
//         }
//     }

//     @PostMapping("/verify-otp")
//     public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> requestBody) {
//         String email = requestBody.get("email");
//         String otp = requestBody.get("otp");

//         if (email == null || otp == null) {
//             logUserActivity(email, "INDIVIDUAL", "VERIFY_OTP_FAILED");
//             return ResponseEntity.badRequest().body("Email and OTP are required.");
//         }

//         boolean isValid = otpStorageService.validateOtp(email, otp);
//         if (isValid) {
//             logUserActivity(email, "INDIVIDUAL", "VERIFY_OTP_SUCCESS");
//             return ResponseEntity.ok("OTP verified successfully. You can now proceed with registration.");
//         } else {
//             logUserActivity(email, "INDIVIDUAL", "VERIFY_OTP_FAILED");
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or Expired OTP!");
//         }
//     }

//     @PostMapping("/corporate/register")
// public String registerCorporateUser(@RequestBody CorporateUser user) {
//     String email = user.getEmail();
//     if (email == null || !otpStorageService.isOtpVerified(email)) {
//         logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//         return "Email is not verified. Please verify the email first.";
//     }

//     CorporateUser existingUser = corporateUserRepository.findByEmail(email); // Corrected method name
//     if (existingUser != null) {
//         if (existingUser.getStatus() == 1) {
//             logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//             return "Email is already registered with active status.";
//         } else {
//             existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
//             if (user.getCompanyName() != null) existingUser.setCompanyName(user.getCompanyName());
//             if (user.getEmployeeName() != null) existingUser.setEmployeeName(user.getEmployeeName());
//             if (user.getJobTitle() != null) existingUser.setJobTitle(user.getJobTitle());
//             if (user.getMobileNum() != null) existingUser.setMobileNum(user.getMobileNum());
//             if (user.getUserType() != null) existingUser.setUserType(user.getUserType());
//             // Ensure adminId is set if null (for legacy data)
//             if (existingUser.getAdminId() == null) {
//                 String companyName = user.getCompanyName();
//                 if (companyName == null || companyName.trim().isEmpty()) {
//                     logUserActivity(email, "CORPORATE", "CORPORATE_REACTIVATION_FAILED");
//                     return "Company name is required for reactivation.";
//                 }
//                 String adminIdPrefix = companyName.length() >= 3 ? companyName.substring(0, 3).toLowerCase() : companyName.toLowerCase();
//                 String pattern = adminIdPrefix + "%";
//                 int maxIncrement = corporateUserRepository.findMaxAdminIdIncrement(adminIdPrefix, pattern);
//                 int newIncrement = maxIncrement + 1;
//                 String adminId = String.format("%s%02d", adminIdPrefix, newIncrement);
//                 existingUser.setAdminId(adminId);
//             }
//             existingUser.setStatus(1);
//             corporateUserRepository.save(existingUser);
//             logUserActivity(email, "CORPORATE", "CORPORATE_REACTIVATION_SUCCESS");
//             otpStorageService.removeOtp(email);
//             return "Corporate user reactivated successfully with Admin ID: " + existingUser.getAdminId();
//         }
//     }

//     String companyName = user.getCompanyName();
//     if (companyName == null || companyName.trim().isEmpty()) {
//         logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//         return "Company name is required.";
//     }

//     String adminIdPrefix = companyName.length() >= 3 ? companyName.substring(0, 3).toLowerCase() : companyName.toLowerCase();
//     String pattern = adminIdPrefix + "%";
//     int maxIncrement = corporateUserRepository.findMaxAdminIdIncrement(adminIdPrefix, pattern);
//     int newIncrement = maxIncrement + 1;
//     String adminId = String.format("%s%02d", adminIdPrefix, newIncrement);
//     user.setAdminId(adminId);

//     // Validate promo code (optional) before new registration
//     if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
//         PromoCode promoter = promoterRepository.findByPromotionCode(user.getPromoCode());
//         if (promoter == null) {
//             logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//             return "Invalid promo code.";
//         }
//         LocalDate today = LocalDate.now();
//         if (today.isBefore(promoter.getValidFrom()) || today.isAfter(promoter.getValidTo())) {
//             logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//             return "Promo code is not valid or has expired.";
//         }
//         PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                 .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
//         if (seriesConfig == null) {
//             logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//             return "Promoter series configuration not found.";
//         }
//         // Check distribution limit
//         long usageCount = promoTransactionRepository.countByPromoCode(user.getPromoCode());
//         if (usageCount >= seriesConfig.getDistributionLimit()) {
//             logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
//             return "Promo code limit has been reached.";
//         }
//     }

//     user.setPassword(passwordEncoder.encode(user.getPassword()));
//     user.setStatus(1);
//     corporateUserRepository.save(user);

//     // Record promo code usage if provided
//     if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
//         PromoCodeUsage promoTransaction = new PromoCodeUsage();
//         promoTransaction.setUserId(user.getId()); // Assuming id is the primary key
//         promoTransaction.setPromoCode(user.getPromoCode());
//         promoTransaction.setRegDate(LocalDate.now());
//         PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                 .findByPromoterTypeAndSeries(promoterRepository.findByPromotionCode(user.getPromoCode()).getPromoterType(), promoterRepository.findByPromotionCode(user.getPromoCode()).getSeries());
//         promoTransaction.setToDate(LocalDate.now().plusDays(seriesConfig.getUserSubDays()));
//         promoTransaction.setEmail(email);
//         promoTransactionRepository.save(promoTransaction);
//     }

//     logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_SUCCESS");
//     otpStorageService.removeOtp(email);
//     return "Corporate user registered successfully with Admin ID: " + adminId;
// }

// @PostMapping("/individual/register")
// public String registerIndividualUser(@RequestBody UserDtls user) {
//     String email = user.getEmail();
//     if (email == null || !otpStorageService.isOtpVerified(email)) {
//         logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
//         return "Email is not verified. Please verify the email first.";
//     }

//     // Check if user exists
//     Optional<UserDtls> existingUserOptional = individualUserRepository.findByEmail(email);
//     if (existingUserOptional.isPresent()) {
//         UserDtls existingUser = existingUserOptional.get();
//         if (existingUser.getStatus() == 1) {
//             logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
//             return "Email is already registered with active status.";
//         } else {
//             // Reactivate inactive user (status = 0)
//             existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
//             // Update other fields if provided
//             if (user.getFullname() != null) existingUser.setFullname(user.getFullname());
//             if (user.getMobileNum() != null) existingUser.setMobileNum(user.getMobileNum());
//             if (user.getUserType() != null) existingUser.setUserType(user.getUserType());
//             existingUser.setStatus(1);
//             individualUserRepository.save(existingUser);
//             logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REACTIVATION_SUCCESS");
//             otpStorageService.removeOtp(email);
//             return "Individual user reactivated successfully.";
//         }
//     }

//     // Validate promo code (optional) before new registration
//     if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
//         PromoCode promoter = promoterRepository.findByPromotionCode(user.getPromoCode());
//         if (promoter == null) {
//             logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
//             return "Invalid promo code.";
//         }
//         LocalDate today = LocalDate.now();
//         if (today.isBefore(promoter.getValidFrom()) || today.isAfter(promoter.getValidTo())) {
//             logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
//             return "Promo code is not valid or has expired.";
//         }
//         PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                 .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
//         if (seriesConfig == null) {
//             logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
//             return "Promoter series configuration not found.";
//         }
//         // Check distribution limit
//         long usageCount = promoTransactionRepository.countByPromoCode(user.getPromoCode());
//         if (usageCount >= seriesConfig.getDistributionLimit()) {
//             logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
//             return "Promo code limit has been reached.";
//         }
//     }

//     // New user registration
//     user.setPassword(passwordEncoder.encode(user.getPassword()));
//     user.setStatus(1);
//     individualUserRepository.save(user);

//     // Record promo code usage if provided
//     if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
//         PromoCodeUsage promoTransaction = new PromoCodeUsage();
//         promoTransaction.setUserId(user.getUserID()); // Assuming userID is the primary key
//         promoTransaction.setPromoCode(user.getPromoCode());
//         promoTransaction.setRegDate(LocalDate.now());
//         PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                 .findByPromoterTypeAndSeries(promoterRepository.findByPromotionCode(user.getPromoCode()).getPromoterType(), promoterRepository.findByPromotionCode(user.getPromoCode()).getSeries());
//         promoTransaction.setToDate(LocalDate.now().plusDays(seriesConfig.getUserSubDays()));
//         promoTransaction.setEmail(email);
//         promoTransactionRepository.save(promoTransaction);
//     }

//     logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_SUCCESS");
//     otpStorageService.removeOtp(email);
//     return "Individual user registered successfully";
// }

//    @PostMapping("/login")
// public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginDTO loginRequest, HttpServletRequest httpRequest) { // CHANGED: Added HttpServletRequest
//     System.out.println("Login attempt for email: " + loginRequest.getEmail());

//     CorporateUser corporateUser = corporateUserRepository.findByemail(loginRequest.getEmail());
//     if (corporateUser != null) {
//         System.out.println("Corporate user found: " + corporateUser.getEmail());

//         if (corporateUser.getStatus() == 0) {
//             System.out.println("Corporate user is inactive: " + corporateUser.getEmail());
//             logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN");
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Your account has been deactivated. Contact admin."));
//         }

//         if (passwordEncoder.matches(loginRequest.getPassword(), corporateUser.getPassword())) {
//             String token = jwtUtil.generateToken(corporateUser.getEmail()); // Use injected instance
//             String userType = "CORPORATE";
//             tokenStoreService.storeToken(userType, corporateUser.getEmail(), token); // Store token in Redis
//             System.out.println("Token stored successfully for user: " + corporateUser.getEmail() + " with key: cmda_log_user:token:" + userType + ":" + corporateUser.getEmail());

//             // NEW: Record login activity for corporate user
//             try {
//                 String ipAddress = getClientIP(httpRequest);
//                 String userAgent = httpRequest.getHeader("User-Agent");
//                 loginActivityService.recordLogin(corporateUser, ipAddress, userAgent);
//                 System.out.println("Login activity recorded for corporate user: " + corporateUser.getEmail());
//             } catch (Exception e) {
//                 System.err.println("Failed to record login activity for corporate user: " + e.getMessage());
//                 // Don't fail the login if activity recording fails
//             }

//             logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN");
//             return ResponseEntity.ok(Map.of(
//                 "message", "Corporate login successful for company: " + corporateUser.getCompanyName(),
//                 "token", token,
//                 "userType", "corporate"
//             ));
//         } else {
//             System.out.println("Corporate user password mismatch.");
//             System.out.println("Stored hash: " + corporateUser.getPassword());
//             System.out.println("Input password encoded: " + passwordEncoder.encode(loginRequest.getPassword()));
//             logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
//         }
//     }

//     UserDtls individualUser = individualUserRepository.findByEmail(loginRequest.getEmail()).orElse(null);
//     if (individualUser != null) {
//         System.out.println("Individual user found: " + individualUser.getEmail());

//         if (individualUser.getStatus() == 0) {
//             System.out.println("Individual user is inactive: " + individualUser.getEmail());
//             logUserActivity(loginRequest.getEmail(), "INDIVIDUAL", "INDIVIDUAL_LOGIN");
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Your account has been deactivated. Contact admin."));
//         }

//         if (passwordEncoder.matches(loginRequest.getPassword(), individualUser.getPassword())) {
//             String token = jwtUtil.generateToken(individualUser.getEmail()); // Use injected instance
//             String userType = "INDIVIDUAL";
//             tokenStoreService.storeToken(userType, individualUser.getEmail(), token); // Store token in Redis
//             System.out.println("Token stored successfully for user: " + individualUser.getEmail() + " with key: cmda_log_user:token:" + userType + ":" + individualUser.getEmail());

//             // NEW: Record login activity for individual user
//             try {
//                 String ipAddress = getClientIP(httpRequest);
//                 String userAgent = httpRequest.getHeader("User-Agent");
//                 loginActivityService.recordLogin(individualUser, ipAddress, userAgent);
//                 System.out.println("Login activity recorded for individual user: " + individualUser.getEmail());
//             } catch (Exception e) {
//                 System.err.println("Failed to record login activity for individual user: " + e.getMessage());
//                 // Don't fail the login if activity recording fails
//             }

//             logUserActivity(loginRequest.getEmail(), "INDIVIDUAL", "INDIVIDUAL_LOGIN");
//             return ResponseEntity.ok(Map.of(
//                 "message", "Individual login successful for user: " + individualUser.getFullname(),
//                 "token", token,
//                 "userType", "individual"
//             ));
//         } else {
//             System.out.println("Individual user password mismatch.");
//             System.out.println("Stored hash: " + individualUser.getPassword());
//             System.out.println("Input password encoded: " + passwordEncoder.encode(loginRequest.getPassword()));
//             logUserActivity(loginRequest.getEmail(), "INDIVIDUAL", "INDIVIDUAL_LOGIN");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
//         }
//     }

//     System.out.println("User not found.");
//     logUserActivity(loginRequest.getEmail(), "UNKNOWN", "LOGIN");
//     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
// }

//   @PostMapping("/logout")
// public ResponseEntity<String> logout(@RequestBody Map<String, String> body, HttpServletRequest request) {
//     String email = body.get("email");
//     if (email == null || email.isEmpty()) {
//         userActivityService.logUserActivity(email, "UNKNOWN", "LOGOUT_FAILED");
//         return ResponseEntity.badRequest().body("Email is required.");
//     }

//     String userType = null;
//     CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//     if (corporateUser != null) {
//         userType = "CORPORATE";
//     } else {
//         UserDtls individualUser = individualUserRepository.findByEmail(email).orElse(null);
//         if (individualUser != null) {
//             userType = "INDIVIDUAL";
//         }
//     }

//     if (userType == null) {
//         userActivityService.logUserActivity(email, "UNKNOWN", "LOGOUT_FAILED");
//         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
//     }

//     String authHeader = request.getHeader("Authorization");
//     if (authHeader != null && authHeader.startsWith("Bearer ")) {
//         String token = authHeader.substring(7);
//         Instant tokenCreationTime = jwtUtil.getTokenCreationTime(token);
//         logger.debug("Checking token creation time for email: {}, token: {}", email, token);
//         if (tokenCreationTime != null) {
//             Instant now = Instant.now();
//             logger.debug("Current time: {}, Token creation time: {}", now, tokenCreationTime);
//             Duration inactivityDuration = Duration.between(tokenCreationTime, now);
//             logger.debug("Inactivity duration: {} seconds", inactivityDuration.getSeconds());
//             if (inactivityDuration.getSeconds() > 900) {
//                 logger.debug("Token expired due to inactivity (> 2 hours) for email: {}", email);
//                 tokenStoreService.removeToken(userType.toUpperCase(), email);

//                 // NEW: Record logout activity for auto-logout due to inactivity
//                 try {
//                     loginActivityService.recordLogout(getUserIdByEmailAndType(email, userType));
//                     System.out.println("Auto-logout activity recorded for user: " + email);
//                 } catch (Exception e) {
//                     System.err.println("Failed to record auto-logout activity for user: " + e.getMessage());
//                 }

//                 userActivityService.logUserActivity(email, userType.toUpperCase(), userType.toUpperCase() + "_AUTO_LOGOUT");
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                         .body("Session expired due to inactivity. Please log in again.");
//             }
//         } else {
//             logger.warn("Token creation time is null for email: {}", email);
//         }
//     } else {
//         logger.warn("No Authorization header or invalid format for email: {}", email);
//     }

//     try {
//         tokenStoreService.removeToken(userType.toUpperCase(), email);

//         // NEW: Record logout activity for manual logout
//         try {
//             loginActivityService.recordLogout(getUserIdByEmailAndType(email, userType));
//             System.out.println("Manual logout activity recorded for user: " + email);
//         } catch (Exception e) {
//             System.err.println("Failed to record logout activity for user: " + e.getMessage());
//         }

//         userActivityService.logUserActivity(email, userType.toUpperCase(), userType.toUpperCase() + "_LOGOUT_SUCCESS");
//         logger.debug("Manual logout successful for email: {}", email);
//         return ResponseEntity.ok("Logged out successfully.");
//     } catch (Exception e) {
//         userActivityService.logUserActivity(email, userType.toUpperCase(), "LOGOUT_FAILED");
//         logger.error("Logout failed for email: {}, error: {}", email, e.getMessage(), e);
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Logout failed: " + e.getMessage());
//     }
// }

//     // NEW: Helper method to get user ID by email and type
//     private int getUserIdByEmailAndType(String email, String userType) {
//         if ("CORPORATE".equals(userType)) {
//             CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//             return corporateUser != null ? corporateUser.getId() : 0;
//         } else {
//             UserDtls individualUser = individualUserRepository.findByEmail(email).orElse(null);
//             return individualUser != null ? individualUser.getUserID() : 0;
//         }
//     }

//      @PostMapping("/validate-token")
//      public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String authHeader) {
//     if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token.");
//     }

//     String token = authHeader.substring(7);
//     try {
//         Instant tokenCreationTime = jwtUtil.getTokenCreationTime(token);
//         if (tokenCreationTime == null) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token.");
//         }

//         Instant now = Instant.now();
//         Duration inactivityDuration = Duration.between(tokenCreationTime, now);
//         String email = jwtUtil.extractEmail(token);
//         String userType = jwtUtil.extractUserType(token);

//         // Determine userType from database if not in token
//         if (userType == null) {
//             CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//             if (corporateUser != null) {
//                 userType = "CORPORATE";
//             } else {
//                 UserDtls individualUser = individualUserRepository.findByEmail(email).orElse(null);
//                 if (individualUser != null) {
//                     userType = "INDIVIDUAL";
//                 }
//             }
//         }

//         if (userType == null) {
//             userActivityService.logUserActivity(email, "UNKNOWN", "VALIDATE_TOKEN_FAILED");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
//         }

//         if (inactivityDuration.getSeconds() > 900) {
//             tokenStoreService.removeToken(userType.toUpperCase(), email);

//             // NEW: Record logout activity for token validation failure due to inactivity
//             try {
//                 loginActivityService.recordLogout(getUserIdByEmailAndType(email, userType));
//                 System.out.println("Token validation logout activity recorded for user: " + email);
//             } catch (Exception e) {
//                 System.err.println("Failed to record token validation logout activity for user: " + e.getMessage());
//             }

//             userActivityService.logUserActivity(email, userType.toUpperCase(), userType.toUpperCase() + "_AUTO_LOGOUT");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired due to inactivation.");
//         }

//         return ResponseEntity.ok("Token is valid.");
//     } catch (Exception e) {
//         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token: " + e.getMessage());
//     }
// }

//     @PostMapping("/check-user-type")
//     public ResponseEntity<?> checkUserType(@RequestBody Map<String, String> request) {
//         String email = request.get("email");

//         CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//         if (corporateUser != null) {
//             logUserActivity(email, "CORPORATE", "CHECK_USER_TYPE");
//             return ResponseEntity.ok(Collections.singletonMap("userType", "corporate"));
//         }

//         UserDtls individualUser = individualUserRepository.findByEmail(email).orElse(null);
//         if (individualUser != null) {
//             logUserActivity(email, "INDIVIDUAL", "CHECK_USER_TYPE");
//             return ResponseEntity.ok(Collections.singletonMap("userType", "individual"));
//         }

//         logUserActivity(email, "UNKNOWN", "CHECK_USER_TYPE_FAILED");
//         return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                 .body(Collections.singletonMap("message", "User not found"));
//     }

//     @PutMapping("/update-subscription")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @Transactional
//     public ResponseEntity<Map<String, String>> updateSubscription(@RequestBody Map<String, Object> requestBody, HttpServletRequest request) {
//         String authorizationHeader = request.getHeader("Authorization");

//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             logUserActivity(null, "UNKNOWN", "UPDATE_SUBSCRIPTION_FAILED");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Missing or invalid authorization token"));
//         }

//         String token = authorizationHeader.substring(7);
//         String tokenEmail;

//         try {
//             tokenEmail = jwtUtil.extractEmail(token);
//         } catch (Exception e) {
//             logUserActivity(null, "UNKNOWN", "UPDATE_SUBSCRIPTION_FAILED");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired token"));
//         }

//         Boolean subscribeToCMDA = (Boolean) requestBody.get("subscribeToCMDA");
//         if (subscribeToCMDA == null) {
//             logUserActivity(tokenEmail, "UNKNOWN", "UPDATE_SUBSCRIPTION_FAILED");
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "subscribeToCMDA parameter is required"));
//         }

//         System.out.println("Subscription update attempt for email: " + tokenEmail);
//         System.out.println("SubscribeToCMDA in request: " + subscribeToCMDA);

//         CorporateUser corporateUser = corporateUserRepository.findByemail(tokenEmail);
//         if (corporateUser != null) {
//             System.out.println("Corporate user found: " + corporateUser.getEmail());
//             System.out.println("Current subscription before update: " + corporateUser.getSubscription());

//             corporateUser.setSubscription(subscribeToCMDA ? 1 : 0);
//             corporateUserRepository.save(corporateUser);
//             System.out.println("Subscription status updated for corporate user: " + corporateUser.getEmail() +
//                                ", New value: " + corporateUser.getSubscription());
//             logUserActivity(tokenEmail, "CORPORATE", "UPDATE_SUBSCRIPTION_SUCCESS");
//             return ResponseEntity.ok(Map.of(
//                 "message", "Subscription updated successfully for corporate user",
//                 "subscribed", corporateUser.getSubscription() == 1 ? "true" : "false"
//             ));
//         }

//         UserDtls individualUser = individualUserRepository.findByEmail(tokenEmail).orElse(null);
//         if (individualUser != null) {
//             System.out.println("Individual user found: " + individualUser.getEmail());
//             System.out.println("Current subscription before update: " + individualUser.getSubscription());

//             individualUser.setSubscription(subscribeToCMDA ? 1 : 0);
//             individualUserRepository.save(individualUser);
//             System.out.println("Subscription status updated for individual user: " + individualUser.getEmail() +
//                                ", New value: " + individualUser.getSubscription());
//             logUserActivity(tokenEmail, "INDIVIDUAL", "UPDATE_SUBSCRIPTION_SUCCESS");
//             return ResponseEntity.ok(Map.of(
//                 "message", "Subscription updated successfully for individual user",
//                 "subscribed", individualUser.getSubscription() == 1 ? "true" : "false"
//             ));
//         }

//         logUserActivity(tokenEmail, "UNKNOWN", "UPDATE_SUBSCRIPTION_FAILED");
//         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
//     }

//     @GetMapping("/get-subscription-status")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     public ResponseEntity<Map<String, Object>> getSubscriptionStatus(HttpServletRequest request) {
//         String authorizationHeader = request.getHeader("Authorization");

//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             logUserActivity(null, "UNKNOWN", "FETCH_SUBSCRIPTION_FAILED");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                     .body(Map.of("message", "Missing or invalid authorization token"));
//         }

//         String token = authorizationHeader.substring(7);
//         String tokenEmail;

//         try {
//             tokenEmail = jwtUtil.extractEmail(token);
//         } catch (Exception e) {
//             logUserActivity(null, "UNKNOWN", "FETCH_SUBSCRIPTION_FAILED");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                     .body(Map.of("message", "Invalid or expired token"));
//         }

//         // First check if the user is corporate
//         CorporateUser corporateUser = corporateUserRepository.findByemail(tokenEmail);
//         if (corporateUser != null) {
//             logUserActivity(tokenEmail, "CORPORATE", "FETCH_SUBSCRIPTION_SUCCESS");
//             return ResponseEntity.ok(Map.of(
//                     "userType", "corporate",
//                     "email", corporateUser.getEmail(),
//                     "subscribed", corporateUser.getSubscription() == 1
//             ));
//         }

//         // If not corporate, check individual user
//         UserDtls individualUser = individualUserRepository.findByEmail(tokenEmail).orElse(null);
//         if (individualUser != null) {
//             logUserActivity(tokenEmail, "INDIVIDUAL", "FETCH_SUBSCRIPTION_SUCCESS");
//             return ResponseEntity.ok(Map.of(
//                     "userType", "individual",
//                     "email", individualUser.getEmail(),
//                     "subscribed", individualUser.getSubscription() == 1
//             ));
//         }

//         logUserActivity(tokenEmail, "UNKNOWN", "FETCH_SUBSCRIPTION_FAILED");
//         return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                 .body(Map.of("message", "User not found"));
//     }

//     // Getters and setters (optional, use constructor injection instead if preferred)
//     public CorporateUserRepository getCorporateUserRepository() {
//         return corporateUserRepository;
//     }

//     public void setCorporateUserRepository(CorporateUserRepository corporateUserRepository) {
//         this.corporateUserRepository = corporateUserRepository;
//     }

//     public UserRepository getIndividualUserRepository() {
//         return individualUserRepository;
//     }

//     public void setIndividualUserRepository(UserRepository individualUserRepository) {
//         this.individualUserRepository = individualUserRepository;
//     }

//     public BCryptPasswordEncoder getPasswordEncoder() {
//         return passwordEncoder;
//     }

//     public void setPasswordEncoder(BCryptPasswordEncoder passwordEncoder) {
//         this.passwordEncoder = passwordEncoder;
//     }
// }

package com.example.prog.controller;

import com.example.prog.config.CorsConfig;
import com.example.prog.dto.LoginDTO;
import com.example.prog.eamilservice.EmailService;
import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.UserDtls;
import com.example.prog.otp.OtpStorageService;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.repository.UserRepository;
import com.example.prog.service.UserActivityService;
import com.example.prog.service.UserLoginActivityService;
import com.example.prog.token.JwtUtil;
import com.example.prog.service.TokenStoreService;
import com.example.prog.repository.promocode.PromoCodeRepository;
import com.example.prog.repository.promocode.PromoCodeUsageRepository;
import com.example.prog.repository.promocode.PromoterSeriesConfigRepository;
import com.example.prog.entity.promocode.PromoCode;
import com.example.prog.entity.promocode.PromoCodeUsage;
import com.example.prog.entity.promocode.PromoterSeriesConfig;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CorsConfig corsConfig;

    @Autowired
    private CorporateUserRepository corporateUserRepository;

    @Autowired
    private UserRepository individualUserRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpStorageService otpStorageService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenStoreService tokenStoreService;

    @Autowired
    private UserActivityService userActivityService;

    @Autowired
    private UserLoginActivityService loginActivityService;

    @Autowired
    private PromoCodeRepository promoterRepository;

    @Autowired
    private PromoCodeUsageRepository promoTransactionRepository;

    @Autowired
    private PromoterSeriesConfigRepository promoterSeriesConfigRepository;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private void logUserActivity(String email, String userType, String activityType) {
        if (email == null) {
            email = "UNKNOWN";
        }
        userActivityService.logUserActivity(email, userType, activityType);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        if (email == null || email.isEmpty()) {
            logUserActivity(email, "INDIVIDUAL", "SEND_OTP_FAILED");
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {
            CorporateUser corporateUser = corporateUserRepository.findByemail(email);
            if (corporateUser != null && corporateUser.getStatus() == 1) {
                logUserActivity(email, "INDIVIDUAL", "SEND_OTP_FAILED");
                return ResponseEntity.badRequest()
                        .body("Email already registered in corporate_user with active status.");
            }

            Optional<UserDtls> individualUser = individualUserRepository.findByEmail(email);
            if (individualUser.isPresent() && individualUser.get().getStatus() == 1) {
                logUserActivity(email, "INDIVIDUAL", "SEND_OTP_FAILED");
                return ResponseEntity.badRequest().body("Email already registered in user_dtls with active status.");
            }

            String otp = emailService.generateOTP();
            otpStorageService.storeOtp(email, otp);
            emailService.sendOtpEmail(email, otp);
            logUserActivity(email, "INDIVIDUAL", "SEND_OTP");
            return ResponseEntity.ok("OTP sent successfully to " + email);
        } catch (Exception e) {
            e.printStackTrace();
            logUserActivity(email, "INDIVIDUAL", "SEND_OTP_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while sending OTP.");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String otp = requestBody.get("otp");

        if (email == null || otp == null) {
            logUserActivity(email, "INDIVIDUAL", "VERIFY_OTP_FAILED");
            return ResponseEntity.badRequest().body("Email and OTP are required.");
        }

        boolean isValid = otpStorageService.validateOtp(email, otp);
        if (isValid) {
            logUserActivity(email, "INDIVIDUAL", "VERIFY_OTP_SUCCESS");
            return ResponseEntity.ok("OTP verified successfully. You can now proceed with registration.");
        } else {
            logUserActivity(email, "INDIVIDUAL", "VERIFY_OTP_FAILED");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or Expired OTP!");
        }
    }

    @PostMapping("/corporate/register")
    public String registerCorporateUser(@RequestBody CorporateUser user) {
        String email = user.getEmail();

        if (email == null || !otpStorageService.isOtpVerified(email)) {
            logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
            return "Email is not verified. Please verify the email first.";
        }

        CorporateUser existingUser = corporateUserRepository.findByemail(email);
        if (existingUser != null) {
            if (existingUser.getStatus() == 1) {
                logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
                return "Email is already registered with active status.";
            } else {
                existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
                if (user.getCompanyName() != null)
                    existingUser.setCompanyName(user.getCompanyName());
                if (user.getEmployeeName() != null)
                    existingUser.setEmployeeName(user.getEmployeeName());
                if (user.getJobTitle() != null)
                    existingUser.setJobTitle(user.getJobTitle());
                if (user.getMobileNum() != null)
                    existingUser.setMobileNum(user.getMobileNum());
                // if (user.getUserType() != null) existingUser.setUserType(user.getUserType());
                if (existingUser.getAdminId() == null) {
                    String companyName = user.getCompanyName();
                    if (companyName == null || companyName.trim().isEmpty()) {
                        logUserActivity(email, "CORPORATE", "CORPORATE_REACTIVATION_FAILED");
                        return "Company name is required for reactivation.";
                    }
                    String adminIdPrefix = companyName.length() >= 3 ? companyName.substring(0, 3).toLowerCase()
                            : companyName.toLowerCase();
                    String pattern = adminIdPrefix + "%";
                    int maxIncrement = corporateUserRepository.findMaxAdminIdIncrement(adminIdPrefix, pattern);
                    int newIncrement = maxIncrement + 1;
                    String adminId = String.format("%s%02d", adminIdPrefix, newIncrement);
                    existingUser.setAdminId(adminId);
                }
                existingUser.setStatus(1);
                corporateUserRepository.save(existingUser);
                logUserActivity(email, "CORPORATE", "CORPORATE_REACTIVATION_SUCCESS");
                otpStorageService.removeOtp(email);
                return "Corporate user reactivated successfully with Admin ID: " + existingUser.getAdminId();
            }
        }

        String companyName = user.getCompanyName();
        if (companyName == null || companyName.trim().isEmpty()) {
            logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
            return "Company name is required.";
        }

        String adminIdPrefix = companyName.length() >= 3 ? companyName.substring(0, 3).toLowerCase()
                : companyName.toLowerCase();
        String pattern = adminIdPrefix + "%";
        int maxIncrement = corporateUserRepository.findMaxAdminIdIncrement(adminIdPrefix, pattern);
        int newIncrement = maxIncrement + 1;
        String adminId = String.format("%s%02d", adminIdPrefix, newIncrement);
        user.setAdminId(adminId);

        if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
            PromoCode promoter = promoterRepository.findByPromotionCode(user.getPromoCode());
            if (promoter == null) {
                logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
                return "Invalid promo code.";
            }
            LocalDate today = LocalDate.now();
            if (today.isBefore(promoter.getValidFrom()) || today.isAfter(promoter.getValidTo())) {
                logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
                return "Promo code is not valid or has expired.";
            }
            PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
                    .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
            if (seriesConfig == null) {
                logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
                return "Promoter series configuration not found.";
            }
            long usageCount = promoTransactionRepository.countByPromoCode(user.getPromoCode());
            if (usageCount >= seriesConfig.getDistributionLimit()) {
                logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
                return "Promo code limit has been reached.";
            }
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(1);
        corporateUserRepository.save(user);

        if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
            PromoCodeUsage promoTransaction = new PromoCodeUsage();
            promoTransaction.setUserId(user.getId());
            promoTransaction.setPromoCode(user.getPromoCode());
            promoTransaction.setRegDate(LocalDate.now());
            PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
                    .findByPromoterTypeAndSeries(
                            promoterRepository.findByPromotionCode(user.getPromoCode()).getPromoterType(),
                            promoterRepository.findByPromotionCode(user.getPromoCode()).getSeries());
            promoTransaction.setToDate(LocalDate.now().plusDays(seriesConfig.getUserSubDays()));
            promoTransaction.setEmail(email);
            promoTransactionRepository.save(promoTransaction);
        }

        logUserActivity(email, "CORPORATE", "CORPORATE_REGISTRATION_SUCCESS");
        otpStorageService.removeOtp(email);

        return "Corporate user registered successfully with Admin ID: " + adminId;
    }

    // @PostMapping("/individual/register")
    // public String registerIndividualUser(@RequestBody UserDtls user) {
    // String email = user.getEmail();

    // if (email == null || !otpStorageService.isOtpVerified(email)) {
    // logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
    // return "Email is not verified. Please verify the email first.";
    // }

    // Optional<UserDtls> existingUserOptional =
    // individualUserRepository.findByEmail(email);
    // if (existingUserOptional.isPresent()) {
    // UserDtls existingUser = existingUserOptional.get();
    // if (existingUser.getStatus() == 1) {
    // logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
    // return "Email is already registered with active status.";
    // } else {
    // existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
    // if (user.getFullname() != null) existingUser.setFullname(user.getFullname());
    // if (user.getMobileNum() != null)
    // existingUser.setMobileNum(user.getMobileNum());
    // // if (user.getUserType() != null)
    // existingUser.setUserType(user.getUserType());
    // existingUser.setStatus(1);
    // individualUserRepository.save(existingUser);
    // logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REACTIVATION_SUCCESS");
    // otpStorageService.removeOtp(email);
    // return "Individual user reactivated successfully.";
    // }
    // }

    // if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
    // PromoCode promoter =
    // promoterRepository.findByPromotionCode(user.getPromoCode());
    // if (promoter == null) {
    // logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
    // return "Invalid promo code.";
    // }
    // LocalDate today = LocalDate.now();
    // if (today.isBefore(promoter.getValidFrom()) ||
    // today.isAfter(promoter.getValidTo())) {
    // logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
    // return "Promo code is not valid or has expired.";
    // }
    // PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
    // .findByPromoterTypeAndSeries(promoter.getPromoterType(),
    // promoter.getSeries());
    // if (seriesConfig == null) {
    // logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
    // return "Promoter series configuration not found.";
    // }
    // long usageCount =
    // promoTransactionRepository.countByPromoCode(user.getPromoCode());
    // if (usageCount >= seriesConfig.getDistributionLimit()) {
    // logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
    // return "Promo code limit has been reached.";
    // }
    // }

    // user.setPassword(passwordEncoder.encode(user.getPassword()));
    // user.setStatus(1);
    // individualUserRepository.save(user);

    // if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
    // PromoCodeUsage promoTransaction = new PromoCodeUsage();
    // promoTransaction.setUserId(user.getUserID());
    // promoTransaction.setPromoCode(user.getPromoCode());
    // promoTransaction.setRegDate(LocalDate.now());
    // PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
    // .findByPromoterTypeAndSeries(promoterRepository.findByPromotionCode(user.getPromoCode()).getPromoterType(),
    // promoterRepository.findByPromotionCode(user.getPromoCode()).getSeries());
    // promoTransaction.setToDate(LocalDate.now().plusDays(seriesConfig.getUserSubDays()));
    // promoTransaction.setEmail(email);
    // promoTransactionRepository.save(promoTransaction);
    // }

    // logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_SUCCESS");
    // otpStorageService.removeOtp(email);

    // return "Individual user registered successfully";
    // }

    @PostMapping("/individual/register")
    public ResponseEntity<Map<String, Object>> registerIndividualUser(@RequestBody UserDtls user) {
        String email = user.getEmail();

        if (email == null || !otpStorageService.isOtpVerified(email)) {
            logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is not verified. Please verify the email first."));
        }

        Optional<UserDtls> existingUserOptional = individualUserRepository.findByEmail(email);
        if (existingUserOptional.isPresent()) {
            UserDtls existingUser = existingUserOptional.get();
            if (existingUser.getStatus() == 1) {
                logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email is already registered with active status."));
            } else {
                existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
                if (user.getFullname() != null)
                    existingUser.setFullname(user.getFullname());
                if (user.getMobileNum() != null)
                    existingUser.setMobileNum(user.getMobileNum());
                existingUser.setStatus(1);
                individualUserRepository.save(existingUser);
                logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REACTIVATION_SUCCESS");
                otpStorageService.removeOtp(email);

                String token = jwtUtil.generateToken(email);
                tokenStoreService.storeToken("INDIVIDUAL", email, token);

                return ResponseEntity.ok(Map.of(
                        "message", "Individual user reactivated successfully",
                        "token", token,
                        "userType", "individual",
                        "showInvestmentQuiz", true,
                        "quizCompleted", false));
            }
        }

        // Promo code validation
        if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
            PromoCode promoter = promoterRepository.findByPromotionCode(user.getPromoCode());
            if (promoter == null) {
                logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid promo code."));
            }
            LocalDate today = LocalDate.now();
            if (today.isBefore(promoter.getValidFrom()) || today.isAfter(promoter.getValidTo())) {
                logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Promo code is not valid or has expired."));
            }
            PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
                    .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
            if (seriesConfig == null) {
                logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Promoter series configuration not found."));
            }
            long usageCount = promoTransactionRepository.countByPromoCode(user.getPromoCode());
            if (usageCount >= seriesConfig.getDistributionLimit()) {
                logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_FAILED");
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Promo code limit has been reached."));
            }
        }

        // Save new user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(1);
        individualUserRepository.save(user);

        // Save promo usage
        if (user.getPromoCode() != null && !user.getPromoCode().isEmpty()) {
            PromoCodeUsage promoTransaction = new PromoCodeUsage();
            promoTransaction.setUserId(user.getUserID());
            promoTransaction.setPromoCode(user.getPromoCode());
            promoTransaction.setRegDate(LocalDate.now());
            PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
                    .findByPromoterTypeAndSeries(
                            promoterRepository.findByPromotionCode(user.getPromoCode()).getPromoterType(),
                            promoterRepository.findByPromotionCode(user.getPromoCode()).getSeries());
            promoTransaction.setToDate(LocalDate.now().plusDays(seriesConfig.getUserSubDays()));
            promoTransaction.setEmail(email);
            promoTransactionRepository.save(promoTransaction);
        }

        logUserActivity(email, "INDIVIDUAL", "INDIVIDUAL_REGISTRATION_SUCCESS");
        otpStorageService.removeOtp(email);

        // Generate token
        String token = jwtUtil.generateToken(email);
        tokenStoreService.storeToken("INDIVIDUAL", email, token);

        // Success response
        return ResponseEntity.ok(Map.of(
                "message", "Individual user registered successfully",
                "token", token,
                "userType", "individual",
                "showInvestmentQuiz", true,
                "quizCompleted", false));
    }

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginDTO loginRequest,
            HttpServletRequest httpRequest) {
        System.out.println("Login attempt for email: " + loginRequest.getEmail());

        CorporateUser corporateUser = corporateUserRepository.findByemail(loginRequest.getEmail());
        if (corporateUser != null) {
            System.out.println("Corporate user found: " + corporateUser.getEmail());

            if (corporateUser.getStatus() == 0) {
                System.out.println("Corporate user is inactive: " + corporateUser.getEmail());
                logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN");
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Your account has been deactivated. Contact admin."));
            }

            if (passwordEncoder.matches(loginRequest.getPassword(), corporateUser.getPassword())) {
                String token = jwtUtil.generateToken(corporateUser.getEmail());
                String userType = "CORPORATE";
                tokenStoreService.storeToken(userType, corporateUser.getEmail(), token);
                System.out.println("Token stored successfully for user: " + corporateUser.getEmail() +
                        " with key: cmda_log_user:token:" + userType + ":" + corporateUser.getEmail());

                // Record login activity
                try {
                    String ipAddress = getClientIP(httpRequest);
                    String userAgent = httpRequest.getHeader("User-Agent");
                    loginActivityService.recordLogin(corporateUser, ipAddress, userAgent);
                    System.out.println("Login activity recorded for corporate user: " + corporateUser.getEmail());
                } catch (Exception e) {
                    System.err.println("Failed to record login activity: " + e.getMessage());
                }

                logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN");
                return ResponseEntity.ok(Map.of(
                        "message", "Corporate login successful for company: " + corporateUser.getCompanyName(),
                        "token", token,
                        "userType", "corporate",
                        "subscribed", corporateUser.getSubscription() == 1 ? "true" : "false"));
            } else {
                System.out.println("Corporate user password mismatch.");
                System.out.println("Stored hash: " + corporateUser.getPassword());
                System.out.println("Input password encoded: " + passwordEncoder.encode(loginRequest.getPassword()));
                logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
            }
        }

        UserDtls individualUser = individualUserRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        if (individualUser != null) {
            System.out.println("Individual user found: " + individualUser.getEmail());

            if (individualUser.getStatus() == 0) {
                System.out.println("Individual user is inactive: " + individualUser.getEmail());
                logUserActivity(loginRequest.getEmail(), "INDIVIDUAL", "INDIVIDUAL_LOGIN");
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Your account has been deactivated. Contact admin."));
            }

            if (passwordEncoder.matches(loginRequest.getPassword(), individualUser.getPassword())) {
                String token = jwtUtil.generateToken(individualUser.getEmail());
                String userType = "INDIVIDUAL";
                tokenStoreService.storeToken(userType, individualUser.getEmail(), token);
                System.out.println("Token stored successfully for user: " + individualUser.getEmail() +
                        " with key: cmda_log_user:token:" + userType + ":" + individualUser.getEmail());

                // Record login activity
                try {
                    String ipAddress = getClientIP(httpRequest);
                    String userAgent = httpRequest.getHeader("User-Agent");
                    loginActivityService.recordLogin(individualUser, ipAddress, userAgent);
                    System.out.println("Login activity recorded for individual user: " + individualUser.getEmail());
                } catch (Exception e) {
                    System.err.println("Failed to record login activity: " + e.getMessage());
                }

                logUserActivity(loginRequest.getEmail(), "INDIVIDUAL", "INDIVIDUAL_LOGIN");
                return ResponseEntity.ok(Map.of(
                        "message", "Individual login successful for user: " + individualUser.getFullname(),
                        "token", token,
                        "userType", "individual",
                        "subscribed", individualUser.getSubscription() == 1 ? "true" : "false"));
            } else {
                System.out.println("Individual user password mismatch.");
                System.out.println("Stored hash: " + individualUser.getPassword());
                System.out.println("Input password encoded: " + passwordEncoder.encode(loginRequest.getPassword()));
                logUserActivity(loginRequest.getEmail(), "INDIVIDUAL", "INDIVIDUAL_LOGIN");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
            }
        }

        System.out.println("User not found.");
        logUserActivity(loginRequest.getEmail(), "UNKNOWN", "LOGIN");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
    }

    @PostMapping("/logout")
    @Transactional
    public ResponseEntity<String> logout(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String rawEmail = body.get("email");
        String resolvedEmail = rawEmail;

        // Robust identity resolution Phase 2: Use email from token if body is
        // missing/empty
        if (resolvedEmail == null || resolvedEmail.trim().isEmpty()) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                try {
                    String token = authHeader.substring(7);
                    resolvedEmail = jwtUtil.extractEmail(token);
                    System.out.println("DEBUG: Email resolved from token for logout: " + resolvedEmail);
                } catch (Exception e) {
                    System.err.println("DEBUG: Failed to extract email from token for fallback: " + e.getMessage());
                }
            }
        }

        if (resolvedEmail == null || resolvedEmail.trim().isEmpty()) {
            System.err.println("LOGOUT_FAILED: No email provided in body or token.");
            userActivityService.logUserActivity(null, "UNKNOWN", "LOGOUT_FAILED");
            return ResponseEntity.badRequest().body("Email is required.");
        }

        String userType = null;
        Integer userIdAtLog = null;
        String finalEmail = resolvedEmail.trim();

        // Phase 2 Harmonization: try exact match first (mirroring loginUser)
        System.out.println("DEBUG: Attempting logout identity lookup for: " + finalEmail);

        CorporateUser corporateUser = corporateUserRepository.findByemail(finalEmail);
        if (corporateUser != null) {
            userType = "CORPORATE";
            userIdAtLog = corporateUser.getId();
        } else {
            UserDtls individualUser = individualUserRepository.findByEmail(finalEmail).orElse(null);
            if (individualUser != null) {
                userType = "INDIVIDUAL";
                userIdAtLog = individualUser.getUserID();
            }
        }

        if (userType == null) {
            String normalizedEmail = finalEmail.toLowerCase();
            if (!normalizedEmail.equals(finalEmail)) {
                System.out.println("DEBUG: Exact match failed, trying normalized: " + normalizedEmail);
                corporateUser = corporateUserRepository.findByemail(normalizedEmail);
                if (corporateUser != null) {
                    userType = "CORPORATE";
                    userIdAtLog = corporateUser.getId();
                    finalEmail = normalizedEmail;
                } else {
                    UserDtls individualUser = individualUserRepository.findByEmail(normalizedEmail).orElse(null);
                    if (individualUser != null) {
                        userType = "INDIVIDUAL";
                        userIdAtLog = individualUser.getUserID();
                        finalEmail = normalizedEmail;
                    }
                }
            }
        }

        if (userType == null) {
            System.err.println("LOGOUT_FAILED: User not found in either repository for email: " + resolvedEmail);
            userActivityService.logUserActivity(resolvedEmail, "UNKNOWN", "LOGOUT_FAILED");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        System.out.println("DEBUG: Identity identified for logout: userId=" + userIdAtLog + ", userType=" + userType
                + " (from " + finalEmail + ")");

        // Record logout activity
        if (userIdAtLog != null) {
            try {
                loginActivityService.recordLogout(userIdAtLog, userType);
                System.out.println("SUCCESS: recordLogout service called for user: " + finalEmail);
            } catch (Exception e) {
                System.err.println(
                        "CRITICAL: Failed to record logout activity for " + finalEmail + ": " + e.getMessage());
            }
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Instant tokenCreationTime = jwtUtil.getTokenCreationTime(token);
            logger.debug("Checking token creation time for email: {}, token: {}", finalEmail, token);
            if (tokenCreationTime != null) {
                Instant now = Instant.now();
                logger.debug("Current time: {}, Token creation time: {}", now, tokenCreationTime);
                Duration inactivityDuration = Duration.between(tokenCreationTime, now);
                logger.debug("Inactivity duration: {} seconds", inactivityDuration.getSeconds());
                if (inactivityDuration.getSeconds() > 10800) {
                    logger.debug("Token expired due to inactivity (> 2 hours) for email: {}", finalEmail);
                    tokenStoreService.removeToken(userType.toUpperCase(), finalEmail);
                    userActivityService.logUserActivity(finalEmail, userType.toUpperCase(),
                            userType.toUpperCase() + "_AUTO_LOGOUT");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Session expired due to inactivity. Please log in again.");
                }
            } else {
                logger.warn("Token creation time is null for email: {}", finalEmail);
            }
        } else {
            logger.warn("No Authorization header or invalid format for email: {}", finalEmail);
        }

        try {
            tokenStoreService.removeToken(userType.toUpperCase(), finalEmail);
            userActivityService.logUserActivity(finalEmail, userType.toUpperCase(),
                    userType.toUpperCase() + "_LOGOUT_SUCCESS");
            logger.debug("Manual logout successful for email: {}", finalEmail);
            return ResponseEntity.ok("Logged out successfully.");
        } catch (Exception e) {
            userActivityService.logUserActivity(finalEmail, userType.toUpperCase(), "LOGOUT_FAILED");
            logger.error("Logout failed for email: {}, error: {}", finalEmail, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Logout failed: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logUserActivity("UNKNOWN", "UNKNOWN", "FETCH_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        try {
            String email = jwtUtil.extractEmail(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            CorporateUser corporateUser = corporateUserRepository.findByemail(email); // Corrected method name
            if (corporateUser != null) {
                logUserActivity(email, "CORPORATE", "FETCH_PROFILE_SUCCESS");
                return ResponseEntity.ok(Map.of(
                        "email", corporateUser.getEmail(),
                        "name", corporateUser.getEmployeeName() != null ? corporateUser.getEmployeeName() : "",
                        "userType", "corporate",
                        "subscribed", corporateUser.getSubscription() != null && corporateUser.getSubscription() == 1,
                        "picture", corporateUser.getProfilePicture() != null ? corporateUser.getProfilePicture() : ""));
            }

            Optional<UserDtls> individualUserOpt = individualUserRepository.findByEmail(email);
            if (individualUserOpt.isPresent()) {
                UserDtls user = individualUserOpt.get();
                logUserActivity(email, "INDIVIDUAL", "FETCH_PROFILE_SUCCESS");
                return ResponseEntity.ok(Map.of(
                        "email", user.getEmail(),
                        "name", user.getFullname() != null ? user.getFullname() : "",
                        "userType", "individual",
                        "subscribed", user.getSubscription() != null && user.getSubscription() == 1,
                        "picture", user.getProfilePicture() != null ? user.getProfilePicture() : ""));
            }

            logUserActivity(email, "UNKNOWN", "FETCH_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Error fetching profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/validate-token")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token.");
        }

        String token = authHeader.substring(7);
        try {
            Instant tokenCreationTime = jwtUtil.getTokenCreationTime(token);
            if (tokenCreationTime == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token.");
            }

            Instant now = Instant.now();
            Duration inactivityDuration = Duration.between(tokenCreationTime, now);
            String email = jwtUtil.extractEmail(token);
            String userType = jwtUtil.extractUserType(token);

            if (userType == null) {
                CorporateUser corporateUser = corporateUserRepository.findByemail(email);
                if (corporateUser != null) {
                    userType = "CORPORATE";
                } else {
                    UserDtls individualUser = individualUserRepository.findByEmail(email).orElse(null);
                    if (individualUser != null) {
                        userType = "INDIVIDUAL";
                    }
                }
            }

            if (userType == null) {
                userActivityService.logUserActivity(email, "UNKNOWN", "VALIDATE_TOKEN_FAILED");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
            }

            if (inactivityDuration.getSeconds() > 3600 * 2) {
                tokenStoreService.removeToken(userType.toUpperCase(), email);
                userActivityService.logUserActivity(email, userType.toUpperCase(),
                        userType.toUpperCase() + "_AUTO_LOGOUT");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired due to inactivation.");
            }

            return ResponseEntity.ok("Token is valid.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token: " + e.getMessage());
        }
    }

    @PostMapping("/check-user-type")
    public ResponseEntity<?> checkUserType(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        CorporateUser corporateUser = corporateUserRepository.findByemail(email);
        if (corporateUser != null) {
            logUserActivity(email, "CORPORATE", "CHECK_USER_TYPE");
            return ResponseEntity.ok(Collections.singletonMap("userType", "corporate"));
        }

        UserDtls individualUser = individualUserRepository.findByEmail(email).orElse(null);
        if (individualUser != null) {
            logUserActivity(email, "INDIVIDUAL", "CHECK_USER_TYPE");
            return ResponseEntity.ok(Collections.singletonMap("userType", "individual"));
        }

        logUserActivity(email, "UNKNOWN", "CHECK_USER_TYPE_FAILED");
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("message", "User not found"));
    }

    @PutMapping("/update-subscription")
    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    @Transactional
    public ResponseEntity<Map<String, String>> updateSubscription(@RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logUserActivity(null, "UNKNOWN", "UPDATE_SUBSCRIPTION_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Missing or invalid authorization token"));
        }

        String token = authorizationHeader.substring(7);
        String tokenEmail;

        try {
            tokenEmail = jwtUtil.extractEmail(token);
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "UPDATE_SUBSCRIPTION_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired token"));
        }

        Boolean subscribeToCMDA = (Boolean) requestBody.get("subscribeToCMDA");
        if (subscribeToCMDA == null) {
            logUserActivity(tokenEmail, "UNKNOWN", "UPDATE_SUBSCRIPTION_FAILED");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "subscribeToCMDA parameter is required"));
        }

        System.out.println("Subscription update attempt for email: " + tokenEmail);
        System.out.println("SubscribeToCMDA in request: " + subscribeToCMDA);

        CorporateUser corporateUser = corporateUserRepository.findByemail(tokenEmail);
        if (corporateUser != null) {
            System.out.println("Corporate user found: " + corporateUser.getEmail());
            System.out.println("Current subscription before update: " + corporateUser.getSubscription());

            corporateUser.setSubscription(subscribeToCMDA ? 1 : 0);
            corporateUserRepository.save(corporateUser);
            System.out.println("Subscription status updated for corporate user: " + corporateUser.getEmail() +
                    ", New value: " + corporateUser.getSubscription());
            logUserActivity(tokenEmail, "CORPORATE", "UPDATE_SUBSCRIPTION_SUCCESS");
            return ResponseEntity.ok(Map.of(
                    "message", "Subscription updated successfully for corporate user",
                    "subscribed", corporateUser.getSubscription() == 1 ? "true" : "false"));
        }

        UserDtls individualUser = individualUserRepository.findByEmail(tokenEmail).orElse(null);
        if (individualUser != null) {
            System.out.println("Individual user found: " + individualUser.getEmail());
            System.out.println("Current subscription before update: " + individualUser.getSubscription());

            individualUser.setSubscription(subscribeToCMDA ? 1 : 0);
            individualUserRepository.save(individualUser);
            System.out.println("Subscription status updated for individual user: " + individualUser.getEmail() +
                    ", New value: " + individualUser.getSubscription());
            logUserActivity(tokenEmail, "INDIVIDUAL", "UPDATE_SUBSCRIPTION_SUCCESS");
            return ResponseEntity.ok(Map.of(
                    "message", "Subscription updated successfully for individual user",
                    "subscribed", individualUser.getSubscription() == 1 ? "true" : "false"));
        }

        logUserActivity(tokenEmail, "UNKNOWN", "UPDATE_SUBSCRIPTION_FAILED");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
    }

    @GetMapping("/get-subscription-status")
    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    public ResponseEntity<Map<String, Object>> getSubscriptionStatus(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logUserActivity(null, "UNKNOWN", "FETCH_SUBSCRIPTION_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Missing or invalid authorization token"));
        }

        String token = authorizationHeader.substring(7);
        String tokenEmail;

        try {
            tokenEmail = jwtUtil.extractEmail(token);
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "FETCH_SUBSCRIPTION_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired token"));
        }

        // First check if the user is corporate
        CorporateUser corporateUser = corporateUserRepository.findByemail(tokenEmail);
        if (corporateUser != null) {
            logUserActivity(tokenEmail, "CORPORATE", "FETCH_SUBSCRIPTION_SUCCESS");
            return ResponseEntity.ok(Map.of(
                    "userType", "corporate",
                    "email", corporateUser.getEmail(),
                    "subscribed", corporateUser.getSubscription() == 1));
        }

        // If not corporate, check individual user
        UserDtls individualUser = individualUserRepository.findByEmail(tokenEmail).orElse(null);
        if (individualUser != null) {
            logUserActivity(tokenEmail, "INDIVIDUAL", "FETCH_SUBSCRIPTION_SUCCESS");
            return ResponseEntity.ok(Map.of(
                    "userType", "individual",
                    "email", individualUser.getEmail(),
                    "subscribed", individualUser.getSubscription() == 1));
        }

        logUserActivity(tokenEmail, "UNKNOWN", "FETCH_SUBSCRIPTION_FAILED");
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found"));
    }

    public CorporateUserRepository getCorporateUserRepository() {
        return corporateUserRepository;
    }

    public void setCorporateUserRepository(CorporateUserRepository corporateUserRepository) {
        this.corporateUserRepository = corporateUserRepository;
    }

    public UserRepository getIndividualUserRepository() {
        return individualUserRepository;
    }

    public void setIndividualUserRepository(UserRepository individualUserRepository) {
        this.individualUserRepository = individualUserRepository;
    }

    public BCryptPasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }

    public void setPasswordEncoder(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
}