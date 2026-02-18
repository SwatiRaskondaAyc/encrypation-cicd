


// --- prmo code changes by shreya -------------


// package com.example.prog.controller;

// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.promocode.PromoCode;
// import com.example.prog.entity.promocode.PromoCodeUsage;
// import com.example.prog.entity.promocode.PromoterSeriesConfig;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.promocode.PromoCodeRepository;
// import com.example.prog.repository.promocode.PromoCodeUsageRepository;
// import com.example.prog.repository.promocode.PromoterSeriesConfigRepository;
// import com.example.prog.service.TokenStoreService;
// import com.example.prog.token.JwtUtil;
// import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
// import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
// import com.google.api.client.http.javanet.NetHttpTransport;
// import com.google.api.client.json.gson.GsonFactory;
// import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
// import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.util.Collections;

// @RestController
// @RequestMapping("/api/auth/google")
// public class GoogleAuthController {

//     private final JwtUtil jwtUtil;
//     private final UserRepository userRepository;
//     private final TokenStoreService tokenStoreService;
//     private final PromoCodeRepository promoterRepository;
//     private final PromoCodeUsageRepository promoTransactionRepository;
//     private final PromoterSeriesConfigRepository promoterSeriesConfigRepository;

//     @Value("${google.client.id}")
//     private String clientId;

//     @Value("${google.www.client.id}")
//     private String wwwClientId;

//     @Value("${google.client.secret}")
//     private String clientSecret;

//     @Autowired
//     public GoogleAuthController(
//             JwtUtil jwtUtil,
//             UserRepository userRepository,
//             TokenStoreService tokenStoreService,
//             PromoCodeRepository promoterRepository,
//             PromoCodeUsageRepository promoTransactionRepository,
//             PromoterSeriesConfigRepository promoterSeriesConfigRepository) {
//         this.jwtUtil = jwtUtil;
//         this.userRepository = userRepository;
//         this.tokenStoreService = tokenStoreService;
//         this.promoterRepository = promoterRepository;
//         this.promoTransactionRepository = promoTransactionRepository;
//         this.promoterSeriesConfigRepository = promoterSeriesConfigRepository;
//     }

//     @PostMapping
//     public ResponseEntity<?> verifyGoogleToken(@RequestBody GoogleTokenRequest request) {
//         return handleGoogleVerification(request.getCredential(), clientId);
//     }

//     @PostMapping("/google-www")
//     public ResponseEntity<?> verifyGoogleTokenWWW(@RequestBody GoogleTokenRequest request) {
//         return handleGoogleVerification(request.getCredential(), wwwClientId);
//     }

//     @PostMapping("/callback")
//     public ResponseEntity<?> handleGoogleCallback(@RequestBody GoogleCallbackRequest request) {
//         try {
//             // Exchange authorization code for tokens
//             GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
//                     new NetHttpTransport(),
//                     new GsonFactory(),
//                     "https://oauth2.googleapis.com/token",
//                     clientId,
//                     clientSecret,
//                     request.getCode(),
//                     "https://cmdahub.com/auth/google/callback" // Adjust for www if needed
//             ).execute();

//             String idTokenString = tokenResponse.getIdToken();
//             if (idTokenString == null) {
//                 return ResponseEntity.badRequest().body("Failed to retrieve ID token");
//             }

//             // Verify ID token
//             GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
//                     .setAudience(Collections.singletonList(clientId))
//                     .build();
//             GoogleIdToken idToken = verifier.verify(idTokenString);
//             if (idToken != null) {
//                 GoogleIdToken.Payload payload = idToken.getPayload();
//                 String userId = payload.getSubject();
//                 String email = payload.getEmail();
//                 String name = (String) payload.get("name");
//                 String picture = (String) payload.get("picture");

//                 System.out.println("Google callback: email=" + email + ", name=" + name + ", picture=" + picture);

//                 UserDtls user = userRepository.findByEmail(email).orElse(null);
//                 if (user != null) {
//                     if (user.getStatus() == 0) {
//                         return ResponseEntity.status(403).body("Your account has been deactivated.");
//                     }
//                     String userType = user.getRole().equals("ROLE_CORPORATE") ? "corporate" : "individual";
//                     String token = jwtUtil.generateToken(email);
//                     tokenStoreService.storeToken(userType.toUpperCase(), email, token);
//                     return ResponseEntity.ok(new AuthResponse(token, email, name, userType, picture));
//                 } else {
//                     String pendingToken = jwtUtil.generatePendingGoogleToken(userId, email, name, picture);
//                     return ResponseEntity.ok(new PendingAuthResponse(pendingToken, email, name, picture));
//                 }
//             } else {
//                 return ResponseEntity.badRequest().body("Invalid Google ID token");
//             }
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body("Callback failed: " + e.getMessage());
//         }
//     }

//     @PostMapping("/complete")
//     public ResponseEntity<?> completeGoogleRegistration(@RequestBody CompleteGoogleRequest request) {
//         String pendingToken = request.getPendingToken();
//         String promoCode = request.getPromoCode();
//         System.out.println("Completing registration with promoCode: " + promoCode);

//         if (!jwtUtil.validatePendingToken(pendingToken)) {
//             return ResponseEntity.badRequest().body("Invalid or expired pending token");
//         }

//         try {
//             String userId = jwtUtil.extractPendingSubject(pendingToken);
//             String email = jwtUtil.extractPendingClaim(pendingToken, "email");
//             String name = jwtUtil.extractPendingClaim(pendingToken, "name");
//             String picture = jwtUtil.extractPendingClaim(pendingToken, "picture");

//             UserDtls existingUser = userRepository.findByEmail(email).orElse(null);
//             if (existingUser != null) {
//                 return ResponseEntity.badRequest().body("User already exists. Please log in.");
//             }

//             if (promoCode != null && !promoCode.isEmpty()) {
//                 PromoCode promoter = promoterRepository.findByPromotionCode(promoCode);
//                 if (promoter == null) {
//                     return ResponseEntity.badRequest().body("Invalid promo code.");
//                 }
//                 LocalDate today = LocalDate.now();
//                 if (today.isBefore(promoter.getValidFrom()) || today.isAfter(promoter.getValidTo())) {
//                     return ResponseEntity.badRequest().body("Promo code is not valid or has expired.");
//                 }
//                 PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                         .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
//                 if (seriesConfig == null) {
//                     return ResponseEntity.badRequest().body("Promoter series configuration not found.");
//                 }
//             }

//             UserDtls user = new UserDtls();
//             user.setGoogleUserID(userId);
//             user.setEmail(email);
//             user.setFullname(name);
//             user.setProfilePicture(picture);
//             user.setRole("ROLE_USER");
//             user.setCreatedAt(LocalDateTime.now());
//             user.setUpdatedAt(LocalDateTime.now());
//             user.setStatus(1);
//             if (promoCode != null && !promoCode.isEmpty()) {
//                 user.setPromoCode(promoCode);
//             }
//             userRepository.save(user);

//             if (promoCode != null && !promoCode.isEmpty()) {
//                 PromoCode promoter = promoterRepository.findByPromotionCode(promoCode);
//                 PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                         .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
//                 PromoCodeUsage promoUsage = new PromoCodeUsage();
//                 promoUsage.setUserId(user.getUserID());
//                 promoUsage.setPromoCode(promoCode);
//                 promoUsage.setRegDate(LocalDate.now());
//                 promoUsage.setToDate(LocalDate.now().plusDays(seriesConfig.getUserSubDays()));
//                 promoUsage.setEmail(email);
//                 promoTransactionRepository.save(promoUsage);
//             }

//             String userType = "individual";
//             String token = jwtUtil.generateToken(email);
//             tokenStoreService.storeToken(userType.toUpperCase(), email, token);
//             return ResponseEntity.ok(new AuthResponse(token, email, name, userType, picture));
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
//         }
//     }

//     private ResponseEntity<?> handleGoogleVerification(String credential, String audience) {
//         try {
//             GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
//                     .setAudience(Collections.singletonList(audience))
//                     .build();
//             GoogleIdToken idToken = verifier.verify(credential);
//             if (idToken != null) {
//                 GoogleIdToken.Payload payload = idToken.getPayload();
//                 String userId = payload.getSubject();
//                 String email = payload.getEmail();
//                 String name = (String) payload.get("name");
//                 String picture = (String) payload.get("picture");
//                 System.out.println("Google user: email=" + email + ", name=" + name + ", picture=" + picture);

//                 UserDtls user = userRepository.findByEmail(email).orElse(null);
//                 if (user != null) {
//                     if (user.getStatus() == 0) {
//                         return ResponseEntity.status(403).body("Your account has been deactivated.");
//                     }
//                     String userType = user.getRole().equals("ROLE_CORPORATE") ? "corporate" : "individual";
//                     String token = jwtUtil.generateToken(email);
//                     tokenStoreService.storeToken(userType.toUpperCase(), email, token);
//                     return ResponseEntity.ok(new AuthResponse(token, email, name, userType, picture));
//                 } else {
//                     String pendingToken = jwtUtil.generatePendingGoogleToken(userId, email, name, picture);
//                     return ResponseEntity.ok(new PendingAuthResponse(pendingToken, email, name, picture));
//                 }
//             } else {
//                 return ResponseEntity.badRequest().body("Invalid Google token");
//             }
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body("Token verification failed: " + e.getMessage());
//         }
//     }
// }

// class GoogleTokenRequest {
//     private String credential;
//     public String getCredential() { return credential; }
//     public void setCredential(String credential) { this.credential = credential; }
// }

// class GoogleCallbackRequest {
//     private String code;
//     public String getCode() { return code; }
//     public void setCode(String code) { this.code = code; }
// }

// class PendingAuthResponse {
//     private String pendingToken;
//     private String email;
//     private String name;
//     private String picture;

//     public PendingAuthResponse(String pendingToken, String email, String name, String picture) {
//         this.pendingToken = pendingToken;
//         this.email = email;
//         this.name = name;
//         this.picture = picture;
//     }

//     public String getPendingToken() { return pendingToken; }
//     public String getEmail() { return email; }
//     public String getName() { return name; }
//     public String getPicture() { return picture; }
// }

// class CompleteGoogleRequest {
//     private String pendingToken;
//     private String promoCode;

//     public String getPendingToken() { return pendingToken; }
//     public void setPendingToken(String pendingToken) { this.pendingToken = pendingToken; }
//     public String getPromoCode() { return promoCode; }
//     public void setPromoCode(String promoCode) { this.promoCode = promoCode; }
// }

// class AuthResponse {
//     private String token;
//     private String email;
//     private String name;
//     private String userType;
//     private String picture;

//     public AuthResponse(String token, String email, String name, String userType, String picture) {
//         this.token = token;
//         this.email = email;
//         this.name = name;
//         this.userType = userType;
//         this.picture = picture;
//     }

//     public String getToken() { return token; }
//     public String getEmail() { return email; }
//     public String getName() { return name; }
//     public String getUserType() { return userType; }
//     public String getPicture() { return picture; }
// }

//main code//

// package com.example.prog.controller;

// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.promocode.PromoCode;
// import com.example.prog.entity.promocode.PromoCodeUsage;
// import com.example.prog.entity.promocode.PromoterSeriesConfig;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.promocode.PromoCodeRepository;
// import com.example.prog.repository.promocode.PromoCodeUsageRepository;
// import com.example.prog.repository.promocode.PromoterSeriesConfigRepository;
// import com.example.prog.service.TokenStoreService;
// import com.example.prog.token.JwtUtil;
// import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
// import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
// import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
// import com.google.api.client.http.javanet.NetHttpTransport;
// import com.google.api.client.json.gson.GsonFactory;
// import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.util.*;

// @RestController
// @RequestMapping("/api/auth/google")
// public class GoogleAuthController {

//     private final JwtUtil jwtUtil;
//     private final UserRepository userRepository;
//     private final TokenStoreService tokenStoreService;
//     private final PromoCodeRepository promoterRepository;
//     private final PromoCodeUsageRepository promoTransactionRepository;
//     private final PromoterSeriesConfigRepository promoterSeriesConfigRepository;

//     @Value("${google.client.id}")
//     private String clientId;

//     @Value("${google.www.client.id}")
//     private String wwwClientId;

//     @Value("${google.client.secret}")
//     private String clientSecret;

//     @Autowired
//     public GoogleAuthController(
//             JwtUtil jwtUtil,
//             UserRepository userRepository,
//             TokenStoreService tokenStoreService,
//             PromoCodeRepository promoterRepository,
//             PromoCodeUsageRepository promoTransactionRepository,
//             PromoterSeriesConfigRepository promoterSeriesConfigRepository) {
//         this.jwtUtil = jwtUtil;
//         this.userRepository = userRepository;
//         this.tokenStoreService = tokenStoreService;
//         this.promoterRepository = promoterRepository;
//         this.promoTransactionRepository = promoTransactionRepository;
//         this.promoterSeriesConfigRepository = promoterSeriesConfigRepository;
//     }

//     @PostMapping
//     public ResponseEntity<?> verifyGoogleToken(@RequestBody GoogleTokenRequest request) {
//         return handleGoogleVerification(request.getCredential(), clientId);
//     }

//     @PostMapping("/google-www")
//     public ResponseEntity<?> verifyGoogleTokenWWW(@RequestBody GoogleTokenRequest request) {
//         return handleGoogleVerification(request.getCredential(), wwwClientId);
//     }

//     @PostMapping("/callback")
//     public ResponseEntity<?> handleGoogleCallback(@RequestBody GoogleCallbackRequest request) {
//         try {
//             GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
//                     new NetHttpTransport(),
//                     new GsonFactory(),
//                     "https://oauth2.googleapis.com/token",
//                     clientId,
//                     clientSecret,
//                     request.getCode(),
//                     "https://cmdahub.com/auth/google/callback"
//             ).execute();

//             String idTokenString = tokenResponse.getIdToken();
//             if (idTokenString == null) {
//                 return ResponseEntity.badRequest().body("Failed to retrieve ID token");
//             }

//             GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
//                     .setAudience(Arrays.asList(clientId, wwwClientId))
//                     .build();
//             GoogleIdToken idToken = verifier.verify(idTokenString);

//             if (idToken != null) {
//                 GoogleIdToken.Payload payload = idToken.getPayload();
//                 String userId = payload.getSubject();
//                 String email = payload.getEmail();
//                 String name = (String) payload.get("name");
//                 String picture = (String) payload.get("picture");

//                 System.out.println("Google callback: email=" + email + ", name=" + name + ", picture=" + picture);

//                 UserDtls user = userRepository.findByEmail(email).orElse(null);
//                 if (user != null) {
//                     if (user.getStatus() == 0) {
//                         return ResponseEntity.status(403).body("Your account has been deactivated.");
//                     }
//                     String userType = user.getRole().equals("ROLE_CORPORATE") ? "corporate" : "individual";
//                     String token = jwtUtil.generateToken(email);
//                     tokenStoreService.storeToken(userType.toUpperCase(), email, token);
//                     return ResponseEntity.ok(new AuthResponse(token, email, name, userType, picture));
//                 } else {
//                     String pendingToken = jwtUtil.generatePendingGoogleToken(userId, email, name, picture);
//                     return ResponseEntity.ok(new PendingAuthResponse(pendingToken, email, name, picture));
//                 }
//             } else {
//                 return ResponseEntity.badRequest().body("Invalid Google ID token");
//             }
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body("Callback failed: " + e.getMessage());
//         }
//     }

//     @PostMapping("/complete")
//     public ResponseEntity<?> completeGoogleRegistration(@RequestBody CompleteGoogleRequest request) {
//         String pendingToken = request.getPendingToken();
//         String promoCode = request.getPromoCode();
//         System.out.println("Completing registration with promoCode: " + promoCode);

//         if (!jwtUtil.validatePendingToken(pendingToken)) {
//             return ResponseEntity.badRequest().body("Invalid or expired pending token");
//         }

//         try {
//             String userId = jwtUtil.extractPendingSubject(pendingToken);
//             String email = jwtUtil.extractPendingClaim(pendingToken, "email");
//             String name = jwtUtil.extractPendingClaim(pendingToken, "name");
//             String picture = jwtUtil.extractPendingClaim(pendingToken, "picture");

//             UserDtls existingUser = userRepository.findByEmail(email).orElse(null);
//             if (existingUser != null) {
//                 return ResponseEntity.badRequest().body("User already exists. Please log in.");
//             }

//             if (promoCode != null && !promoCode.isEmpty()) {
//                 PromoCode promoter = promoterRepository.findByPromotionCode(promoCode);
//                 if (promoter == null) {
//                     return ResponseEntity.badRequest().body("Invalid promo code.");
//                 }
//                 LocalDate today = LocalDate.now();
//                 if (today.isBefore(promoter.getValidFrom()) || today.isAfter(promoter.getValidTo())) {
//                     return ResponseEntity.badRequest().body("Promo code is not valid or has expired.");
//                 }
//                 PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                         .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
//                 if (seriesConfig == null) {
//                     return ResponseEntity.badRequest().body("Promoter series configuration not found.");
//                 }
//             }

//             UserDtls user = new UserDtls();
//             user.setGoogleUserID(userId);
//             user.setEmail(email);
//             user.setFullname(name);
//             user.setProfilePicture(picture);
//             user.setRole("ROLE_USER");
//             user.setCreatedAt(LocalDateTime.now());
//             user.setUpdatedAt(LocalDateTime.now());
//             user.setStatus(1);
//             user.setCountryCode(request.getCountryCode());
//             user.setMobileNum(request.getMobileNum() != null ? request.getMobileNum() : "");

//             if (promoCode != null && !promoCode.isEmpty()) {
//                 user.setPromoCode(promoCode);
//             }
//             System.out.println("Saving user: " + user);
//             userRepository.save(user);

//             if (promoCode != null && !promoCode.isEmpty()) {
//                 PromoCode promoter = promoterRepository.findByPromotionCode(promoCode);
//                 PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                         .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
//                 PromoCodeUsage promoUsage = new PromoCodeUsage();
//                 promoUsage.setUserId(user.getUserID());
//                 promoUsage.setPromoCode(promoCode);
//                 promoUsage.setRegDate(LocalDate.now());
//                 promoUsage.setToDate(LocalDate.now().plusDays(seriesConfig.getUserSubDays()));
//                 promoUsage.setEmail(email);
//                 promoTransactionRepository.save(promoUsage);
//             }

//             String userType = "individual";
//             String token = jwtUtil.generateToken(email);
//             tokenStoreService.storeToken(userType.toUpperCase(), email, token);
//             return ResponseEntity.ok(new AuthResponse(token, email, name, userType, picture));
//         } catch (Exception e) {
//             System.err.println("Registration failed with exception: " + e.getMessage());
//             e.printStackTrace();
//             return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
//         }
//     }

//     private ResponseEntity<?> handleGoogleVerification(String credential, String audience) {
//         try {
//             GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
//                     .setAudience(Collections.singletonList(audience))
//                     .build();
//             GoogleIdToken idToken = verifier.verify(credential);
//             if (idToken != null) {
//                 GoogleIdToken.Payload payload = idToken.getPayload();
//                 String userId = payload.getSubject();
//                 String email = payload.getEmail();
//                 String name = (String) payload.get("name");
//                 String picture = (String) payload.get("picture");
//                 System.out.println("Google user: email=" + email + ", name=" + name + ", picture=" + picture);

//                 UserDtls user = userRepository.findByEmail(email).orElse(null);
//                 if (user != null) {
//                     if (user.getStatus() == 0) {
//                         return ResponseEntity.status(403).body("Your account has been deactivated.");
//                     }
//                     String userType = user.getRole().equals("ROLE_CORPORATE") ? "corporate" : "individual";
//                     String token = jwtUtil.generateToken(email);
//                     tokenStoreService.storeToken(userType.toUpperCase(), email, token);
//                     return ResponseEntity.ok(new AuthResponse(token, email, name, userType, picture));
//                 } else {
//                     String pendingToken = jwtUtil.generatePendingGoogleToken(userId, email, name, picture);
//                     return ResponseEntity.ok(new PendingAuthResponse(pendingToken, email, name, picture));
//                 }
//             } else {
//                 return ResponseEntity.badRequest().body("Invalid Google token");
//             }
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body("Token verification failed: " + e.getMessage());
//         }
//     }

//     private boolean validateMobileNumber(String countryCode, String mobileNum) {
//         // Validation removed, always return true
//         System.out.println("Validating mobile: " + mobileNum + " for country code: " + countryCode);
//         return true;
//     }

//     // Inner classes defined within GoogleAuthController
//     static class GoogleTokenRequest {
//         private String credential;
//         public String getCredential() { return credential; }
//         public void setCredential(String credential) { this.credential = credential; }
//     }

//     static class GoogleCallbackRequest {
//         private String code;
//         public String getCode() { return code; }
//         public void setCode(String code) { this.code = code; }
//     }

//     static class PendingAuthResponse {
//         private String pendingToken;
//         private String email;
//         private String name;
//         private String picture;

//         public PendingAuthResponse(String pendingToken, String email, String name, String picture) {
//             this.pendingToken = pendingToken;
//             this.email = email;
//             this.name = name;
//             this.picture = picture;
//         }

//         public String getPendingToken() { return pendingToken; }
//         public String getEmail() { return email; }
//         public String getName() { return name; }
//         public String getPicture() { return picture; }
//     }

//     static class CompleteGoogleRequest {
//         private String pendingToken;
//         private String promoCode;
//         private String countryCode;
//         private String mobileNum;

//         public String getPendingToken() { return pendingToken; }
//         public void setPendingToken(String pendingToken) { this.pendingToken = pendingToken; }

//         public String getPromoCode() { return promoCode; }
//         public void setPromoCode(String promoCode) { this.promoCode = promoCode; }

//         public String getCountryCode() { return countryCode; }
//         public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

//         public String getMobileNum() { return mobileNum; }
//         public void setMobileNum(String mobileNum) { this.mobileNum = mobileNum; }
//     }

//     static class AuthResponse {
//         private String token;
//         private String email;
//         private String name;
//         private String userType;
//         private String picture;

//         public AuthResponse(String token, String email, String name, String userType, String picture) {
//             this.token = token;
//             this.email = email;
//             this.name = name;
//             this.userType = userType;
//             this.picture = picture;
//         }

//         public String getToken() { return token; }
//         public String getEmail() { return email; }
//         public String getName() { return name; }
//         public String getUserType() { return userType; }
//         public String getPicture() { return picture; }
//     }
// }

// //code by gayatri for contact number//








//code with promocode distribution logic

// package com.example.prog.controller;

// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.promocode.PromoCode;
// import com.example.prog.entity.promocode.PromoCodeUsage;
// import com.example.prog.entity.promocode.PromoterSeriesConfig;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.promocode.PromoCodeRepository;
// import com.example.prog.repository.promocode.PromoCodeUsageRepository;
// import com.example.prog.repository.promocode.PromoterSeriesConfigRepository;
// import com.example.prog.service.TokenStoreService;
// import com.example.prog.token.JwtUtil;
// import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
// import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
// import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
// import com.google.api.client.http.javanet.NetHttpTransport;
// import com.google.api.client.json.gson.GsonFactory;
// import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.util.*;

// @RestController
// @RequestMapping("/api/auth/google")
// public class GoogleAuthController {

//     private final JwtUtil jwtUtil;
//     private final UserRepository userRepository;
//     private final TokenStoreService tokenStoreService;
//     private final PromoCodeRepository promoterRepository;
//     private final PromoCodeUsageRepository promoTransactionRepository;
//     private final PromoterSeriesConfigRepository promoterSeriesConfigRepository;

//     @Value("${google.client.id}")
//     private String clientId;

//     @Value("${google.www.client.id}")
//     private String wwwClientId;

//     @Value("${google.client.secret}")
//     private String clientSecret;

//     @Autowired
//     public GoogleAuthController(
//             JwtUtil jwtUtil,
//             UserRepository userRepository,
//             TokenStoreService tokenStoreService,
//             PromoCodeRepository promoterRepository,
//             PromoCodeUsageRepository promoTransactionRepository,
//             PromoterSeriesConfigRepository promoterSeriesConfigRepository) {
//         this.jwtUtil = jwtUtil;
//         this.userRepository = userRepository;
//         this.tokenStoreService = tokenStoreService;
//         this.promoterRepository = promoterRepository;
//         this.promoTransactionRepository = promoTransactionRepository;
//         this.promoterSeriesConfigRepository = promoterSeriesConfigRepository;
//     }

//     @PostMapping
//     public ResponseEntity<?> verifyGoogleToken(@RequestBody GoogleTokenRequest request) {
//         return handleGoogleVerification(request.getCredential(), clientId);
//     }

//     @PostMapping("/google-www")
//     public ResponseEntity<?> verifyGoogleTokenWWW(@RequestBody GoogleTokenRequest request) {
//         return handleGoogleVerification(request.getCredential(), wwwClientId);
//     }

//     @PostMapping("/callback")
//     public ResponseEntity<?> handleGoogleCallback(@RequestBody GoogleCallbackRequest request) {
//         try {
//             GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
//                     new NetHttpTransport(),
//                     new GsonFactory(),
//                     "https://oauth2.googleapis.com/token",
//                     clientId,
//                     clientSecret,
//                     request.getCode(),
//                     "https://cmdahub.com/auth/google/callback"
//             ).execute();

//             String idTokenString = tokenResponse.getIdToken();
//             if (idTokenString == null) {
//                 return ResponseEntity.badRequest().body("Failed to retrieve ID token");
//             }

//             GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
//                     .setAudience(Arrays.asList(clientId, wwwClientId))
//                     .build();
//             GoogleIdToken idToken = verifier.verify(idTokenString);

//             if (idToken != null) {
//                 GoogleIdToken.Payload payload = idToken.getPayload();
//                 String userId = payload.getSubject();
//                 String email = payload.getEmail();
//                 String name = (String) payload.get("name");
//                 String picture = (String) payload.get("picture");

//                 System.out.println("Google callback: email=" + email + ", name=" + name + ", picture=" + picture);

//                 UserDtls user = userRepository.findByEmail(email).orElse(null);
//                 if (user != null) {
//                     if (user.getStatus() == 0) {
//                         return ResponseEntity.status(403).body("Your account has been deactivated.");
//                     }
//                     String userType = user.getRole().equals("ROLE_CORPORATE") ? "corporate" : "individual";
//                     String token = jwtUtil.generateToken(email);
//                     tokenStoreService.storeToken(userType.toUpperCase(), email, token);
//                     return ResponseEntity.ok(new AuthResponse(token, email, name, userType, picture));
//                 } else {
//                     String pendingToken = jwtUtil.generatePendingGoogleToken(userId, email, name, picture);
//                     return ResponseEntity.ok(new PendingAuthResponse(pendingToken, email, name, picture));
//                 }
//             } else {
//                 return ResponseEntity.badRequest().body("Invalid Google ID token");
//             }
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body("Callback failed: " + e.getMessage());
//         }
//     }

//     @PostMapping("/complete")
//     public ResponseEntity<?> completeGoogleRegistration(@RequestBody CompleteGoogleRequest request) {
//         String pendingToken = request.getPendingToken();
//         String promoCode = request.getPromoCode();
//         System.out.println("Completing registration with promoCode: " + promoCode);

//         if (!jwtUtil.validatePendingToken(pendingToken)) {
//             return ResponseEntity.badRequest().body("Invalid or expired pending token");
//         }

//         try {
//             String userId = jwtUtil.extractPendingSubject(pendingToken);
//             String email = jwtUtil.extractPendingClaim(pendingToken, "email");
//             String name = jwtUtil.extractPendingClaim(pendingToken, "name");
//             String picture = jwtUtil.extractPendingClaim(pendingToken, "picture");

//             UserDtls existingUser = userRepository.findByEmail(email).orElse(null);
//             if (existingUser != null) {
//                 return ResponseEntity.badRequest().body("User already exists. Please log in.");
//             }

//             if (promoCode != null && !promoCode.isEmpty()) {
//                 PromoCode promoter = promoterRepository.findByPromotionCode(promoCode);
//                 if (promoter == null) {
//                     return ResponseEntity.badRequest().body("Invalid promo code.");
//                 }
//                 LocalDate today = LocalDate.now();
//                 if (today.isBefore(promoter.getValidFrom()) || today.isAfter(promoter.getValidTo())) {
//                     return ResponseEntity.badRequest().body("Promo code is not valid or has expired.");
//                 }
//                 PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                         .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
//                 if (seriesConfig == null) {
//                     return ResponseEntity.badRequest().body("Promoter series configuration not found.");
//                 }
//                 // Check distribution limit
//                 long usageCount = promoTransactionRepository.countByPromoCode(promoCode);
//                 if (usageCount >= seriesConfig.getDistributionLimit()) {
//                     return ResponseEntity.badRequest().body("Promo code limit has been reached.");
//                 }
//             }

//             UserDtls user = new UserDtls();
//             user.setGoogleUserID(userId);
//             user.setEmail(email);
//             user.setFullname(name);
//             user.setProfilePicture(picture);
//             user.setRole("ROLE_USER");
//             user.setCreatedAt(LocalDateTime.now());
//             user.setUpdatedAt(LocalDateTime.now());
//             user.setStatus(1);
//             user.setCountryCode(request.getCountryCode());
//             user.setMobileNum(request.getMobileNum() != null ? request.getMobileNum() : "");

//             if (promoCode != null && !promoCode.isEmpty()) {
//                 user.setPromoCode(promoCode);
//             }
//             System.out.println("Saving user: " + user);
//             userRepository.save(user);

//             if (promoCode != null && !promoCode.isEmpty()) {
//                 PromoCode promoter = promoterRepository.findByPromotionCode(promoCode);
//                 PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
//                         .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
//                 PromoCodeUsage promoUsage = new PromoCodeUsage();
//                 promoUsage.setUserId(user.getUserID());
//                 promoUsage.setPromoCode(promoCode);
//                 promoUsage.setRegDate(LocalDate.now());
//                 promoUsage.setToDate(LocalDate.now().plusDays(seriesConfig.getUserSubDays()));
//                 promoUsage.setEmail(email);
//                 promoTransactionRepository.save(promoUsage);
//             }

//             String userType = "individual";
//             String token = jwtUtil.generateToken(email);
//             tokenStoreService.storeToken(userType.toUpperCase(), email, token);
//             return ResponseEntity.ok(new AuthResponse(token, email, name, userType, picture));
//         } catch (Exception e) {
//             System.err.println("Registration failed with exception: " + e.getMessage());
//             e.printStackTrace();
//             return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
//         }
//     }

//     private ResponseEntity<?> handleGoogleVerification(String credential, String audience) {
//         try {
//             GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
//                     .setAudience(Collections.singletonList(audience))
//                     .build();
//             GoogleIdToken idToken = verifier.verify(credential);
//             if (idToken != null) {
//                 GoogleIdToken.Payload payload = idToken.getPayload();
//                 String userId = payload.getSubject();
//                 String email = payload.getEmail();
//                 String name = (String) payload.get("name");
//                 String picture = (String) payload.get("picture");
//                 System.out.println("Google user: email=" + email + ", name=" + name + ", picture=" + picture);

//                 UserDtls user = userRepository.findByEmail(email).orElse(null);
//                 if (user != null) {
//                     if (user.getStatus() == 0) {
//                         return ResponseEntity.status(403).body("Your account has been deactivated.");
//                     }
//                     String userType = user.getRole().equals("ROLE_CORPORATE") ? "corporate" : "individual";
//                     String token = jwtUtil.generateToken(email);
//                     tokenStoreService.storeToken(userType.toUpperCase(), email, token);
//                     return ResponseEntity.ok(new AuthResponse(token, email, name, userType, picture));
//                 } else {
//                     String pendingToken = jwtUtil.generatePendingGoogleToken(userId, email, name, picture);
//                     return ResponseEntity.ok(new PendingAuthResponse(pendingToken, email, name, picture));
//                 }
//             } else {
//                 return ResponseEntity.badRequest().body("Invalid Google token");
//             }
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body("Token verification failed: " + e.getMessage());
//         }
//     }

//     private boolean validateMobileNumber(String countryCode, String mobileNum) {
//         // Validation removed, always return true
//         System.out.println("Validating mobile: " + mobileNum + " for country code: " + countryCode);
//         return true;
//     }

//     // Inner classes defined within GoogleAuthController
//     static class GoogleTokenRequest {
//         private String credential;
//         public String getCredential() { return credential; }
//         public void setCredential(String credential) { this.credential = credential; }
//     }

//     static class GoogleCallbackRequest {
//         private String code;
//         public String getCode() { return code; }
//         public void setCode(String code) { this.code = code; }
//     }

//     static class PendingAuthResponse {
//         private String pendingToken;
//         private String email;
//         private String name;
//         private String picture;

//         public PendingAuthResponse(String pendingToken, String email, String name, String picture) {
//             this.pendingToken = pendingToken;
//             this.email = email;
//             this.name = name;
//             this.picture = picture;
//         }

//         public String getPendingToken() { return pendingToken; }
//         public String getEmail() { return email; }
//         public String getName() { return name; }
//         public String getPicture() { return picture; }
//     }

//     static class CompleteGoogleRequest {
//         private String pendingToken;
//         private String promoCode;
//         private String countryCode;
//         private String mobileNum;

//         public String getPendingToken() { return pendingToken; }
//         public void setPendingToken(String pendingToken) { this.pendingToken = pendingToken; }

//         public String getPromoCode() { return promoCode; }
//         public void setPromoCode(String promoCode) { this.promoCode = promoCode; }

//         public String getCountryCode() { return countryCode; }
//         public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

//         public String getMobileNum() { return mobileNum; }
//         public void setMobileNum(String mobileNum) { this.mobileNum = mobileNum; }
//     }

//     static class AuthResponse {
//         private String token;
//         private String email;
//         private String name;
//         private String userType;
//         private String picture;

//         public AuthResponse(String token, String email, String name, String userType, String picture) {
//             this.token = token;
//             this.email = email;
//             this.name = name;
//             this.userType = userType;
//             this.picture = picture;
//         }

//         public String getToken() { return token; }
//         public String getEmail() { return email; }
//         public String getName() { return name; }
//         public String getUserType() { return userType; }
//         public String getPicture() { return picture; }
//     }
// }

//code by gayatri for contact number//




package com.example.prog.controller;

import com.example.prog.entity.UserDtls;
import com.example.prog.entity.promocode.PromoCode;
import com.example.prog.entity.promocode.PromoCodeUsage;
import com.example.prog.entity.promocode.PromoterSeriesConfig;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.promocode.PromoCodeRepository;
import com.example.prog.repository.promocode.PromoCodeUsageRepository;
import com.example.prog.repository.promocode.PromoterSeriesConfigRepository;
import com.example.prog.service.TokenStoreService;
import com.example.prog.service.UserActivityService;
import com.example.prog.service.UserLoginActivityService; // NEW: Import login activity service
import com.example.prog.token.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest; // NEW: Import for HttpServletRequest

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth/google")
public class GoogleAuthController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final TokenStoreService tokenStoreService;
    private final PromoCodeRepository promoterRepository;
    private final PromoCodeUsageRepository promoTransactionRepository;
    private final PromoterSeriesConfigRepository promoterSeriesConfigRepository;
    
    // NEW: Add activity services
    private final UserActivityService userActivityService;
    private final UserLoginActivityService loginActivityService;

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.www.client.id}")
    private String wwwClientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    @Autowired
    public GoogleAuthController(
            JwtUtil jwtUtil,
            UserRepository userRepository,
            TokenStoreService tokenStoreService,
            PromoCodeRepository promoterRepository,
            PromoCodeUsageRepository promoTransactionRepository,
            PromoterSeriesConfigRepository promoterSeriesConfigRepository,
            UserActivityService userActivityService, // NEW: Add activity service
            UserLoginActivityService loginActivityService) { // NEW: Add login activity service
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.tokenStoreService = tokenStoreService;
        this.promoterRepository = promoterRepository;
        this.promoTransactionRepository = promoTransactionRepository;
        this.promoterSeriesConfigRepository = promoterSeriesConfigRepository;
        this.userActivityService = userActivityService; // NEW: Initialize
        this.loginActivityService = loginActivityService; // NEW: Initialize
    }

    // NEW: Helper method to log user activity
    private void logUserActivity(String email, String userType, String activityType) {
        if (email == null) {
            email = "UNKNOWN";
        }
        userActivityService.logUserActivity(email, userType, activityType);
    }

    // NEW: Helper method to get client IP address (same as in AuthController)
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    @PostMapping
    public ResponseEntity<?> verifyGoogleToken(@RequestBody GoogleTokenRequest request, HttpServletRequest httpRequest) { // CHANGED: Added HttpServletRequest
        return handleGoogleVerification(request.getCredential(), clientId, httpRequest); // CHANGED: Pass HttpServletRequest
    }

    @PostMapping("/google-www")
    public ResponseEntity<?> verifyGoogleTokenWWW(@RequestBody GoogleTokenRequest request, HttpServletRequest httpRequest) { // CHANGED: Added HttpServletRequest
        return handleGoogleVerification(request.getCredential(), wwwClientId, httpRequest); // CHANGED: Pass HttpServletRequest
    }

    @PostMapping("/callback")
    public ResponseEntity<?> handleGoogleCallback(@RequestBody GoogleCallbackRequest request, HttpServletRequest httpRequest) { // CHANGED: Added HttpServletRequest
        try {
            GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
                    new NetHttpTransport(),
                    new GsonFactory(),
                    "https://oauth2.googleapis.com/token",
                    clientId,
                    clientSecret,
                    request.getCode(),
                    "https://cmdahub.com/auth/google/callback"
            ).execute();

            String idTokenString = tokenResponse.getIdToken();
            if (idTokenString == null) {
                return ResponseEntity.badRequest().body("Failed to retrieve ID token");
            }

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Arrays.asList(clientId, wwwClientId))
                    .build();
            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String userId = payload.getSubject();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String picture = (String) payload.get("picture");

                System.out.println("Google callback: email=" + email + ", name=" + name + ", picture=" + picture);

                UserDtls user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    if (user.getStatus() == 0) {
                        logUserActivity(email, "INDIVIDUAL", "GOOGLE_LOGIN_FAILED_DEACTIVATED");
                        return ResponseEntity.status(403).body("Your account has been deactivated.");
                    }
                    String userType = user.getRole().equals("ROLE_CORPORATE") ? "corporate" : "individual";
                    String token = jwtUtil.generateToken(email);
                    tokenStoreService.storeToken(userType.toUpperCase(), email, token);
                    
                    // NEW: Record login activity for Google login
                    try {
                        String ipAddress = getClientIP(httpRequest);
                        String userAgent = httpRequest.getHeader("User-Agent");
                        loginActivityService.recordLogin(user, ipAddress, userAgent);
                        System.out.println("Google login activity recorded for user: " + email);
                    } catch (Exception e) {
                        System.err.println("Failed to record Google login activity for user: " + e.getMessage());
                        // Don't fail the login if activity recording fails
                    }
                    
                    logUserActivity(email, "INDIVIDUAL", "GOOGLE_LOGIN_SUCCESS");
                    return ResponseEntity.ok(new AuthResponse(token, email, name, userType, picture));
                } else {
                    String pendingToken = jwtUtil.generatePendingGoogleToken(userId, email, name, picture);
                    logUserActivity(email, "INDIVIDUAL", "GOOGLE_PENDING_REGISTRATION");
                    return ResponseEntity.ok(new PendingAuthResponse(pendingToken, email, name, picture));
                }
            } else {
                return ResponseEntity.badRequest().body("Invalid Google ID token");
            }
        } catch (Exception e) {
            logUserActivity("UNKNOWN", "INDIVIDUAL", "GOOGLE_CALLBACK_ERROR");
            return ResponseEntity.badRequest().body("Callback failed: " + e.getMessage());
        }
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completeGoogleRegistration(@RequestBody CompleteGoogleRequest request, HttpServletRequest httpRequest) { // CHANGED: Added HttpServletRequest
        String pendingToken = request.getPendingToken();
        String promoCode = request.getPromoCode();
        System.out.println("Completing registration with promoCode: " + promoCode);

        if (!jwtUtil.validatePendingToken(pendingToken)) {
            logUserActivity("UNKNOWN", "INDIVIDUAL", "GOOGLE_REGISTRATION_FAILED_INVALID_TOKEN");
            return ResponseEntity.badRequest().body("Invalid or expired pending token");
        }

        try {
            String userId = jwtUtil.extractPendingSubject(pendingToken);
            String email = jwtUtil.extractPendingClaim(pendingToken, "email");
            String name = jwtUtil.extractPendingClaim(pendingToken, "name");
            String picture = jwtUtil.extractPendingClaim(pendingToken, "picture");

            UserDtls existingUser = userRepository.findByEmail(email).orElse(null);
            if (existingUser != null) {
                logUserActivity(email, "INDIVIDUAL", "GOOGLE_REGISTRATION_FAILED_ALREADY_EXISTS");
                return ResponseEntity.badRequest().body("User already exists. Please log in.");
            }

            if (promoCode != null && !promoCode.isEmpty()) {
                PromoCode promoter = promoterRepository.findByPromotionCode(promoCode);
                if (promoter == null) {
                    logUserActivity(email, "INDIVIDUAL", "GOOGLE_REGISTRATION_FAILED_INVALID_PROMO");
                    return ResponseEntity.badRequest().body("Invalid promo code.");
                }
                LocalDate today = LocalDate.now();
                if (today.isBefore(promoter.getValidFrom()) || today.isAfter(promoter.getValidTo())) {
                    logUserActivity(email, "INDIVIDUAL", "GOOGLE_REGISTRATION_FAILED_EXPIRED_PROMO");
                    return ResponseEntity.badRequest().body("Promo code is not valid or has expired.");
                }
                PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
                        .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
                if (seriesConfig == null) {
                    logUserActivity(email, "INDIVIDUAL", "GOOGLE_REGISTRATION_FAILED_PROMO_CONFIG");
                    return ResponseEntity.badRequest().body("Promoter series configuration not found.");
                }
                // Check distribution limit
                long usageCount = promoTransactionRepository.countByPromoCode(promoCode);
                if (usageCount >= seriesConfig.getDistributionLimit()) {
                    logUserActivity(email, "INDIVIDUAL", "GOOGLE_REGISTRATION_FAILED_PROMO_LIMIT");
                    return ResponseEntity.badRequest().body("Promo code limit has been reached.");
                }
            }

            UserDtls user = new UserDtls();
            user.setGoogleUserID(userId);
            user.setEmail(email);
            user.setFullname(name);
            user.setProfilePicture(picture);
            user.setRole("ROLE_USER");
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            user.setStatus(1);
            user.setCountryCode(request.getCountryCode());
            user.setMobileNum(request.getMobileNum() != null ? request.getMobileNum() : "");

            if (promoCode != null && !promoCode.isEmpty()) {
                user.setPromoCode(promoCode);
            }
            System.out.println("Saving user: " + user);
            userRepository.save(user);

            if (promoCode != null && !promoCode.isEmpty()) {
                PromoCode promoter = promoterRepository.findByPromotionCode(promoCode);
                PromoterSeriesConfig seriesConfig = promoterSeriesConfigRepository
                        .findByPromoterTypeAndSeries(promoter.getPromoterType(), promoter.getSeries());
                PromoCodeUsage promoUsage = new PromoCodeUsage();
                promoUsage.setUserId(user.getUserID());
                promoUsage.setPromoCode(promoCode);
                promoUsage.setRegDate(LocalDate.now());
                promoUsage.setToDate(LocalDate.now().plusDays(seriesConfig.getUserSubDays()));
                promoUsage.setEmail(email);
                promoTransactionRepository.save(promoUsage);
            }

            String userType = "individual";
            String token = jwtUtil.generateToken(email);
            tokenStoreService.storeToken(userType.toUpperCase(), email, token);
            
            // NEW: Record login activity for newly registered Google user
            try {
                String ipAddress = getClientIP(httpRequest);
                String userAgent = httpRequest.getHeader("User-Agent");
                loginActivityService.recordLogin(user, ipAddress, userAgent);
                System.out.println("Google registration login activity recorded for user: " + email);
            } catch (Exception e) {
                System.err.println("Failed to record Google registration login activity for user: " + e.getMessage());
                // Don't fail the registration if activity recording fails
            }
            
            logUserActivity(email, "INDIVIDUAL", "GOOGLE_REGISTRATION_SUCCESS");
            return ResponseEntity.ok(new AuthResponse(token, email, name, userType, picture));
        } catch (Exception e) {
            System.err.println("Registration failed with exception: " + e.getMessage());
            e.printStackTrace();
            logUserActivity("UNKNOWN", "INDIVIDUAL", "GOOGLE_REGISTRATION_ERROR");
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    private ResponseEntity<?> handleGoogleVerification(String credential, String audience, HttpServletRequest httpRequest) { // CHANGED: Added HttpServletRequest parameter
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(audience))
                    .build();
            GoogleIdToken idToken = verifier.verify(credential);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String userId = payload.getSubject();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String picture = (String) payload.get("picture");
                System.out.println("Google user: email=" + email + ", name=" + name + ", picture=" + picture);

                UserDtls user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    if (user.getStatus() == 0) {
                        logUserActivity(email, "INDIVIDUAL", "GOOGLE_LOGIN_FAILED_DEACTIVATED");
                        return ResponseEntity.status(403).body("Your account has been deactivated.");
                    }
                    String userType = user.getRole().equals("ROLE_CORPORATE") ? "corporate" : "individual";
                    String token = jwtUtil.generateToken(email);
                    tokenStoreService.storeToken(userType.toUpperCase(), email, token);
                    
                    // NEW: Record login activity for Google login
                    try {
                        String ipAddress = getClientIP(httpRequest);
                        String userAgent = httpRequest.getHeader("User-Agent");
                        loginActivityService.recordLogin(user, ipAddress, userAgent);
                        System.out.println("Google login activity recorded for user: " + email);
                    } catch (Exception e) {
                        System.err.println("Failed to record Google login activity for user: " + e.getMessage());
                        // Don't fail the login if activity recording fails
                    }
                    
                    logUserActivity(email, "INDIVIDUAL", "GOOGLE_LOGIN_SUCCESS");
                    return ResponseEntity.ok(new AuthResponse(token, email, name, userType, picture));
                } else {
                    String pendingToken = jwtUtil.generatePendingGoogleToken(userId, email, name, picture);
                    logUserActivity(email, "INDIVIDUAL", "GOOGLE_PENDING_REGISTRATION");
                    return ResponseEntity.ok(new PendingAuthResponse(pendingToken, email, name, picture));
                }
            } else {
                logUserActivity("UNKNOWN", "INDIVIDUAL", "GOOGLE_VERIFICATION_FAILED");
                return ResponseEntity.badRequest().body("Invalid Google token");
            }
        } catch (Exception e) {
            logUserActivity("UNKNOWN", "INDIVIDUAL", "GOOGLE_VERIFICATION_ERROR");
            return ResponseEntity.badRequest().body("Token verification failed: " + e.getMessage());
        }
    }

    private boolean validateMobileNumber(String countryCode, String mobileNum) {
        // Validation removed, always return true
        System.out.println("Validating mobile: " + mobileNum + " for country code: " + countryCode);
        return true;
    }

    // Inner classes remain the same...
    static class GoogleTokenRequest {
        private String credential;
        public String getCredential() { return credential; }
        public void setCredential(String credential) { this.credential = credential; }
    }

    static class GoogleCallbackRequest {
        private String code;
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    static class PendingAuthResponse {
        private String pendingToken;
        private String email;
        private String name;
        private String picture;

        public PendingAuthResponse(String pendingToken, String email, String name, String picture) {
            this.pendingToken = pendingToken;
            this.email = email;
            this.name = name;
            this.picture = picture;
        }

        public String getPendingToken() { return pendingToken; }
        public String getEmail() { return email; }
        public String getName() { return name; }
        public String getPicture() { return picture; }
    }

    static class CompleteGoogleRequest {
        private String pendingToken;
        private String promoCode;
        private String countryCode;
        private String mobileNum;

        public String getPendingToken() { return pendingToken; }
        public void setPendingToken(String pendingToken) { this.pendingToken = pendingToken; }

        public String getPromoCode() { return promoCode; }
        public void setPromoCode(String promoCode) { this.promoCode = promoCode; }

        public String getCountryCode() { return countryCode; }
        public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

        public String getMobileNum() { return mobileNum; }
        public void setMobileNum(String mobileNum) { this.mobileNum = mobileNum; }
    }

    static class AuthResponse {
        private String token;
        private String email;
        private String name;
        private String userType;
        private String picture;

        public AuthResponse(String token, String email, String name, String userType, String picture) {
            this.token = token;
            this.email = email;
            this.name = name;
            this.userType = userType;
            this.picture = picture;
        }

        public String getToken() { return token; }
        public String getEmail() { return email; }
        public String getName() { return name; }
        public String getUserType() { return userType; }
        public String getPicture() { return picture; }
    }
}