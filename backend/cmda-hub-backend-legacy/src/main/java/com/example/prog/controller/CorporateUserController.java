// package com.example.prog.controller;

// import com.example.prog.eamilservice.CorporateUserEmailSenderService;

// import com.example.prog.entity.CorporateUser;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.service.CorporateService;
// import com.example.prog.token.JwtUtil;


// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.web.bind.MissingServletRequestParameterException;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.validation.ValidationException;

// import java.time.LocalDateTime;
// import java.util.Map;
// import java.util.UUID;
// import java.util.regex.Pattern;

// import org.springframework.core.io.Resource;
// import org.springframework.core.io.UrlResource;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import java.net.MalformedURLException;
// import java.nio.file.Path;
// import java.nio.file.Paths;

// @RestController
// @RequestMapping("/api/corporate")

// public class CorporateUserController {
	
// 	 @Value("${frontend.url}") // Inject frontend URL
// 	 private String frontendUrl;


//     @Autowired
//     private CorporateUserRepository corporateUserRepository;
//     @Autowired
//     private CorporateService corpService;
    
//     @Autowired
//     private CorporateUserEmailSenderService corpemailService;

//     @Autowired
//     private BCryptPasswordEncoder passwordEncoder;
    
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @GetMapping("/{email}")
//     public ResponseEntity<CorporateUser> getProfile(@PathVariable("email") String email, HttpServletRequest request) {
//     	String authorizationHeader = request.getHeader("Authorization");
    	
//     	   if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//            }
    	   

//            String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
//            String tokenEmail;
           
//            try {
//                tokenEmail = JwtUtil.extractEmail(token);
          

//            } catch (Exception e) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//            }
//            if (!email.equals(tokenEmail)) {
//                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//            }

           
//     	CorporateUser userProfile = corpService.getCorporateUser(email);
//         if (userProfile == null) {
        	
//         	System.out.println("User not found: " + email);
//             return ResponseEntity.notFound().build();
//         }
//         System.out.println("Extracted email from token: " + tokenEmail);
        
//         return ResponseEntity.ok(userProfile);
//     }
    
//     @PreAuthorize("hasRole('CORPORATE')")
    
//     @PutMapping("/complete-profile")

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    
//         public ResponseEntity<CorporateUser> completeUserProfile(@RequestBody CorporateUser additionalDetails, HttpServletRequest request) {
//         System.out.println("Received details: " + additionalDetails);
//         String authorizationHeader = request.getHeader("Authorization");

//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         String token = authorizationHeader.substring(7);
//         String tokenEmail;

//         try {
//             tokenEmail = JwtUtil.extractEmail(token);
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         if (additionalDetails.getEmail() == null || !additionalDetails.getEmail().equals(tokenEmail)) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//         }

//         System.out.println("Extracted email from token: " + tokenEmail);

//         CorporateUser existingUserProfile = corpService.getUserByEmail(tokenEmail);

//         if (existingUserProfile == null) {
//             return ResponseEntity.notFound().build();
//         }

//         existingUserProfile.setGender(additionalDetails.getGender() != null ? additionalDetails.getGender() : existingUserProfile.getGender());
//         existingUserProfile.setAdharcard(additionalDetails.getAdharcard() != null ? additionalDetails.getAdharcard() : existingUserProfile.getAdharcard());
//         existingUserProfile.setPancard(additionalDetails.getPancard() != null ? additionalDetails.getPancard() : existingUserProfile.getPancard());
//         existingUserProfile.setAddress(additionalDetails.getAddress() != null ? additionalDetails.getAddress() : existingUserProfile.getAddress());
//         existingUserProfile.setDateofbirth(additionalDetails.getDateofbirth() != null ? additionalDetails.getDateofbirth() : existingUserProfile.getDateofbirth());
//         existingUserProfile.setUserType(additionalDetails.getUserType() != null ? additionalDetails.getUserType() : existingUserProfile.getUserType()); // Added userType

//         CorporateUser updatedProfile = corpService.completeUserProfile(existingUserProfile);

//         if (updatedProfile == null) {
//             return ResponseEntity.notFound().build();
//         }

//         return ResponseEntity.ok(updatedProfile);
//     }

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//         @PostMapping("/register")
//         public String registerCorporateUser(@RequestBody CorporateUser user) {
//             try {
//                 validateEmails(user.getEmail());
//                 validatePassword(user.getPassword(), user.getConfirmpassword());

//                 user.setPassword(passwordEncoder.encode(user.getPassword()));
//                 corpService.save(user);

//                 return "Corporate user registered successfully";
//             } catch (ValidationException e) {
//                 return "Validation Error: " + e.getMessage();
//             } catch (Exception e) {
//                 return "Error: " + e.getMessage();
//             }
//         }

//         private void validateEmails( String corporateEmail) {
//             if 
//                 (corporateEmail == null || corporateEmail.isEmpty()) {
//                 throw new ValidationException(" Corporate Email must be provided.");
//             }
            

//         }

//         private void validatePassword(String password, String confirmPassword) {
//             if (password == null || confirmPassword == null) {
//                 throw new ValidationException("Password and Confirm Password cannot be null");
//             }

//             if (!password.equals(confirmPassword)) {
//                 throw new ValidationException("Password and Confirm Password do not match");
//             }

//             String PASSWORD_PATTERN = "^[A-Z][a-zA-Z0-9@#$%^&+=]{7}$";

//             // Validate password against pattern
//             if (!Pattern.matches(PASSWORD_PATTERN, password)) {
//                 throw new ValidationException("Password must start with an uppercase letter, be 8 characters long, and include letters, numbers, and special characters.");
//             }
//         }

//          private void validateUserType(String userType) {
//       if (userType == null || (!userType.equals("Salaried") && !userType.equals("Housewife"))) {
//           throw new ValidationException("User type must be either 'Salaried' or 'Housewife'.");
//       }
//   }
    


//         @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @PostMapping("/login")
//     public String loginCorporateUser(@RequestBody CorporateUser loginRequest) {
//         CorporateUser user = corpService.findByEmail(loginRequest.getEmail());
//         if (user == null) {
//             return "Corporate user not found";
//         }
//         if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
//             return "Invalid credentials";
//         }
//         return "Corporate login successful for company: " + user.getCompanyName();
//     }
        
        
        
//         @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @GetMapping("/forgetpass")
//     public String forgotPassword() {
//         return "forgetpass";
//     }
        
//         @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")

//     @PostMapping("corpemailforgetpass")
//     public String processForgotPassword(@RequestParam("email") String email) {
//         System.out.println("Received email: " + email);
       
//         return corpemailService.processForgotPassword(email);
        
//     }
  
    
    
//     @ExceptionHandler(MissingServletRequestParameterException.class)
//     public ResponseEntity<String> handleMissingParams(MissingServletRequestParameterException ex) {
//         return ResponseEntity
//             .status(HttpStatus.BAD_REQUEST)
//             .body("Missing required parameter: " + ex.getParameterName());
//     }
    
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @PutMapping("/update")
//     public ResponseEntity<CorporateUser> updateProfile(@RequestBody CorporateUser corpuserProfile, HttpServletRequest request) {
//         String authorizationHeader = request.getHeader("Authorization");
        
//         if (corpuserProfile.getEmail() == null || corpuserProfile.getEmail().isEmpty()) {
//             return ResponseEntity.badRequest().build();
//         }
        
//         String token = authorizationHeader.substring(7);
//         String tokenEmail;
        
//         try {
//             tokenEmail = JwtUtil.extractEmail(token);
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }
        
//         if (corpuserProfile.getEmail() == null || !corpuserProfile.getEmail().equals(tokenEmail)) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//         }
        
//         System.out.println("Received update request for: " + corpuserProfile);
        
//         // Validate userType
//         if (corpuserProfile.getUserType() != null) {
//             validateUserType(corpuserProfile.getUserType());
//         }
        
//         CorporateUser updatedcorpProfile = corpService.updateCorpUserProfile(corpuserProfile);

//         if (updatedcorpProfile == null) {
//             return ResponseEntity.notFound().build();
//         }
        
//         System.out.println("Extracted email from token: " + tokenEmail);
//         return ResponseEntity.ok(updatedcorpProfile);
//     }
    
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @GetMapping("/profilename/{corporateEmail}")
//     public ResponseEntity<String> getFullName(@PathVariable("corporateEmail") String email) {
//         try {
//             String fullName = corpService.getEmployeeName(email);
//             return ResponseEntity.ok("Hi " + fullName);
//         } catch (RuntimeException ex) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
//         }
//     }
    

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//   @PostMapping("/forgetpass")
//   public ResponseEntity<String> processCorporateForgotPassword(@RequestBody Map<String, String> requestBody) {
//       System.out.println("Received corporate forgot password request"); // Log API call
//       String email = requestBody.get("email");
//       System.out.println("Corporate Email received: " + email);

//       CorporateUser corpUser = corpService.getUserByEmail(email);
//       if (corpUser == null) {
//           System.out.println("No corporate user found with the email: " + email);
//           return ResponseEntity.badRequest().body("No corporate account found with the provided email.");
//       }

//       String resetToken = UUID.randomUUID().toString();
//       corpUser.setResetToken(resetToken);
//       corpUser.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
//       corpService.save(corpUser);

//       String resetLink = "https://cmda.aycanalytics.com/CorporateResetPassword?token=" + resetToken;
//       System.out.println("Generated corporate reset link: " + resetLink);

//       corpemailService.sendEmail(corpUser.getEmail(), "Corporate Password Reset Request",
//               "Click the link to reset your password: " + resetLink);

//       return ResponseEntity.ok("Corporate password reset link has been sent to your email.");
//   }

//   @PostMapping("/corp/resetpassword")
//   @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//   public ResponseEntity<?> resetCorporatePassword(@RequestBody Map<String, String> requestBody) {
//       String token = requestBody.get("token");
//       String newPassword = requestBody.get("newPassword");
//       String confirmPassword = requestBody.get("confirmPassword");

//       // Log received token
//       System.out.println("Received Token: " + token);

//       // Fetch corporate user by token
//       CorporateUser corpUser = corpService.findCorporateUserByResetToken(token);
      
//       if (corpUser == null) {
//           System.out.println("No corporate user found with the provided token.");
//           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid or expired token.");
//       }

//       // Log token expiry for debugging
//       System.out.println("Token Expiry Time: " + corpUser.getTokenExpiry());
//       System.out.println("Current Time: " + LocalDateTime.now());

//       if (corpUser.getTokenExpiry().isBefore(LocalDateTime.now())) {
//           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token has expired.");
//       }

//       if (!newPassword.equals(confirmPassword)) {
//           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match.");
//       }

//       try {
//           validatePassword(newPassword);

//           // Encrypt and update password
//           corpUser.setPassword(passwordEncoder.encode(newPassword));
          
//           // Clear reset token fields
//           corpUser.setResetToken(null);
//           corpUser.setTokenExpiry(null);
//           corpService.save(corpUser);

//           return ResponseEntity.ok("Corporate password reset successfully. Please log in.");
//       } catch (IllegalArgumentException e) {
//           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//       }
//   }


//   private void validatePassword(String password) {
//       String PASSWORD_PATTERN = "^[A-Z][a-zA-Z0-9@#$%^&+=]{7,}$"; // Min 8 chars, starts with uppercase

//       if (!Pattern.matches(PASSWORD_PATTERN, password)) {
//           throw new IllegalArgumentException(
//               "Password must start with an uppercase letter, be at least 8 characters long, and include letters, numbers, and special characters."
//           );
//       }
//   }
    
//     @PutMapping("/upload-profile-picture")
//     public ResponseEntity<String> uploadProfilePicture(
//             @RequestParam("file") MultipartFile file, 
//             HttpServletRequest request) {

//         // Log Authorization Header
//         String authorizationHeader = request.getHeader("Authorization");
//         System.out.println("Authorization Header: " + authorizationHeader);

//         // Check if Authorization Header is missing or invalid
//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             System.out.println("Authorization header is missing or invalid");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
//         }

//         // Extract JWT Token
//         String token = authorizationHeader.substring(7);
//         String tokenEmail;

//         try {
//             tokenEmail = JwtUtil.extractEmail(token);
//             System.out.println("Extracted Email from Token: " + tokenEmail);
//         } catch (Exception e) {
//             System.out.println("Error Extracting Email: " + e.getMessage());
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
//         }

//         try {
//             // Save profile picture and update user profile
//             String imageUrl = corpService.saveProfilePicture(tokenEmail, file);
//             corpService.updateUserProfilePicture(tokenEmail, imageUrl);
//             System.out.println("Profile picture uploaded successfully: " + imageUrl);
//             return ResponseEntity.ok("Profile picture updated successfully: " + imageUrl);
//         } catch (Exception e) {
//             System.out.println("Error saving profile picture: " + e.getMessage());
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
//         }
//     }

    
//     @GetMapping("/profile-picture")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     public ResponseEntity<String> getProfilePicture(HttpServletRequest request) {
//         String authorizationHeader = request.getHeader("Authorization");

//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
//         }

//         String token = authorizationHeader.substring(7);
//         String tokenEmail;
        
//         try {
//             tokenEmail = JwtUtil.extractEmail(token);
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
//         }

//         String imageUrl = corpService.getProfilePicture(tokenEmail); // Fetch from DB

//         if (imageUrl == null) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile picture not found");
//         }

//         return ResponseEntity.ok(imageUrl);
//     }

// @GetMapping("/uploads/{filename:.+}")
//     public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
//         try {
//             Path filePath = Paths.get("/app/uploads").resolve(filename).normalize();
//             Resource resource = new UrlResource(filePath.toUri());

//             if (resource.exists() && resource.isReadable()) {
//                 String contentType = determineContentType(filename);
//                 return ResponseEntity.ok()
//                         .contentType(MediaType.parseMediaType(contentType))
//                         .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
//                         .body(resource);
//             } else {
//                 return ResponseEntity.notFound().build();
//             }
//         } catch (MalformedURLException e) {
//             return ResponseEntity.badRequest().build();
//         }
//     }

//     private String determineContentType(String filename) {
//         String lowercaseFilename = filename.toLowerCase();
//         if (lowercaseFilename.endsWith(".png")) {
//             return "image/png";
//         } else if (lowercaseFilename.endsWith(".jpg") || lowercaseFilename.endsWith(".jpeg")) {
//             return "image/jpeg";
//         } else if (lowercaseFilename.endsWith(".gif")) {
//             return "image/gif";
//         }
//         return MediaType.APPLICATION_OCTET_STREAM_VALUE;
//     }
    
//      @DeleteMapping("/delete-account")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     public ResponseEntity<String> deleteAccount(HttpServletRequest request) {
//         String authorizationHeader = request.getHeader("Authorization");

//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
//         }

//         String token = authorizationHeader.substring(7);
//         String tokenEmail;

//         try {
//             tokenEmail = JwtUtil.extractEmail(token);
//             System.out.println("Extracted email from token: " + tokenEmail);
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
//         }

//         CorporateUser user = corpService.getUserByEmail(tokenEmail);
//         if (user == null) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Corporate user not found");
//         }

//         boolean isDeleted = corpService.deactivateCorporateUserAccount(tokenEmail);
//         if (!isDeleted) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to deactivate account");
//         }

//         return ResponseEntity.ok("Corporate account deactivated successfully");
//     }

// }
//----------------main code -----------------//



////////////----------working code without log----------//
// package com.example.prog.controller;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.core.io.UrlResource;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.MediaType;
// import com.example.prog.entity.CorporateUser;
// import com.example.prog.service.CorporateService;
// import com.example.prog.token.JwtUtil;
// import com.example.prog.repository.CorporateUserRepository;
// import org.springframework.core.io.Resource;
// import jakarta.servlet.http.HttpServletRequest;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.time.LocalDateTime;
// import java.util.Map;
// import java.util.UUID;
// import java.util.regex.Pattern;
// import org.springframework.beans.factory.annotation.Autowired;
// import com.example.prog.eamilservice.CorporateUserEmailSenderService;
// import jakarta.validation.ValidationException;
// import java.net.MalformedURLException;

// import org.springframework.web.bind.MissingServletRequestParameterException;
// import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

// @RestController
// @RequestMapping("/api/corporate")
// public class CorporateUserController {

//     @Value("${frontend.url}")
//     private String frontendUrl;

//     @Autowired
//     private CorporateUserRepository corporateUserRepository;
//     @Autowired
//     private CorporateService corpService;
//     @Autowired
//     private CorporateUserEmailSenderService corpemailService;
//     @Autowired
//     private BCryptPasswordEncoder passwordEncoder;
//     @Autowired
//     private JwtUtil jwtUtil; // Inject JwtUtil

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @GetMapping("/{email}")
//     public ResponseEntity<CorporateUser> getProfile(@PathVariable("email") String email, HttpServletRequest request) {
//         String authorizationHeader = request.getHeader("Authorization");

//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         String token = authorizationHeader.substring(7);
//         String tokenEmail;

//         try {
//             tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         if (!email.equals(tokenEmail)) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//         }

//         CorporateUser userProfile = corpService.getCorporateUser(email);
//         if (userProfile == null) {
//             System.out.println("User not found: " + email);
//             return ResponseEntity.notFound().build();
//         }
//         System.out.println("Extracted email from token: " + tokenEmail);

//         return ResponseEntity.ok(userProfile);
//     }

//     @PreAuthorize("hasRole('CORPORATE')")
//     @PutMapping("/complete-profile")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     public ResponseEntity<CorporateUser> completeUserProfile(@RequestBody CorporateUser additionalDetails, HttpServletRequest request) {
//         System.out.println("Received details: " + additionalDetails);
//         String authorizationHeader = request.getHeader("Authorization");

//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         String token = authorizationHeader.substring(7);
//         String tokenEmail;

//         try {
//             tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         if (additionalDetails.getEmail() == null || !additionalDetails.getEmail().equals(tokenEmail)) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//         }

//         System.out.println("Extracted email from token: " + tokenEmail);

//         CorporateUser existingUserProfile = corpService.getUserByEmail(tokenEmail);

//         if (existingUserProfile == null) {
//             return ResponseEntity.notFound().build();
//         }

//         existingUserProfile.setGender(additionalDetails.getGender() != null ? additionalDetails.getGender() : existingUserProfile.getGender());
//         existingUserProfile.setAdharcard(additionalDetails.getAdharcard() != null ? additionalDetails.getAdharcard() : existingUserProfile.getAdharcard());
//         existingUserProfile.setPancard(additionalDetails.getPancard() != null ? additionalDetails.getPancard() : existingUserProfile.getPancard());
//         existingUserProfile.setAddress(additionalDetails.getAddress() != null ? additionalDetails.getAddress() : existingUserProfile.getAddress());
//         existingUserProfile.setDateofbirth(additionalDetails.getDateofbirth() != null ? additionalDetails.getDateofbirth() : existingUserProfile.getDateofbirth());
//         existingUserProfile.setUserType(additionalDetails.getUserType() != null ? additionalDetails.getUserType() : existingUserProfile.getUserType());

//         CorporateUser updatedProfile = corpService.completeUserProfile(existingUserProfile);

//         if (updatedProfile == null) {
//             return ResponseEntity.notFound().build();
//         }

//         return ResponseEntity.ok(updatedProfile);
//     }

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @PostMapping("/register")
//     public String registerCorporateUser(@RequestBody CorporateUser user) {
//         try {
//             validateEmails(user.getEmail());
//             validatePassword(user.getPassword(), user.getConfirmpassword());

//             user.setPassword(passwordEncoder.encode(user.getPassword()));
//             corpService.save(user);

//             return "Corporate user registered successfully";
//         } catch (ValidationException e) {
//             return "Validation Error: " + e.getMessage();
//         } catch (Exception e) {
//             return "Error: " + e.getMessage();
//         }
//     }

//     private void validateEmails(String corporateEmail) {
//         if (corporateEmail == null || corporateEmail.isEmpty()) {
//             throw new ValidationException("Corporate Email must be provided.");
//         }
//     }

//     private void validatePassword(String password, String confirmPassword) {
//         if (password == null || confirmPassword == null) {
//             throw new ValidationException("Password and Confirm Password cannot be null");
//         }

//         if (!password.equals(confirmPassword)) {
//             throw new ValidationException("Password and Confirm Password do not match");
//         }

//         String PASSWORD_PATTERN = "^[A-Z][a-zA-Z0-9@#$%^&+=]{7}$";

//         if (!Pattern.matches(PASSWORD_PATTERN, password)) {
//             throw new ValidationException("Password must start with an uppercase letter, be 8 characters long, and include letters, numbers, and special characters.");
//         }
//     }

//     private void validateUserType(String userType) {
//         if (userType == null || (!userType.equals("Salaried") && !userType.equals("Housewife"))) {
//             throw new ValidationException("User type must be either 'Salaried' or 'Housewife'.");
//         }
//     }

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @PostMapping("/login")
//     public String loginCorporateUser(@RequestBody CorporateUser loginRequest) {
//         CorporateUser user = corpService.findByEmail(loginRequest.getEmail());
//         if (user == null) {
//             return "Corporate user not found";
//         }
//         if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
//             return "Invalid credentials";
//         }
//         return "Corporate login successful for company: " + user.getCompanyName();
//     }

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @GetMapping("/forgetpass")
//     public String forgotPassword() {
//         return "forgetpass";
//     }

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @PostMapping("corpemailforgetpass")
//     public String processForgotPassword(@RequestParam("email") String email) {
//         System.out.println("Received email: " + email);
//         return corpemailService.processForgotPassword(email);
//     }

//     @ExceptionHandler(MissingServletRequestParameterException.class)
//     public ResponseEntity<String> handleMissingParams(MissingServletRequestParameterException ex) {
//         return ResponseEntity
//             .status(HttpStatus.BAD_REQUEST)
//             .body("Missing required parameter: " + ex.getParameterName());
//     }

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @PutMapping("/update")
//     public ResponseEntity<CorporateUser> updateProfile(@RequestBody CorporateUser corpuserProfile, HttpServletRequest request) {
//         String authorizationHeader = request.getHeader("Authorization");

//         if (corpuserProfile.getEmail() == null || corpuserProfile.getEmail().isEmpty()) {
//             return ResponseEntity.badRequest().build();
//         }

//         String token = authorizationHeader.substring(7);
//         String tokenEmail;

//         try {
//             tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         if (corpuserProfile.getEmail() == null || !corpuserProfile.getEmail().equals(tokenEmail)) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//         }

//         System.out.println("Received update request for: " + corpuserProfile);

//         if (corpuserProfile.getUserType() != null) {
//             validateUserType(corpuserProfile.getUserType());
//         }

//         CorporateUser updatedcorpProfile = corpService.updateCorpUserProfile(corpuserProfile);

//         if (updatedcorpProfile == null) {
//             return ResponseEntity.notFound().build();
//         }

//         System.out.println("Extracted email from token: " + tokenEmail);
//         return ResponseEntity.ok(updatedcorpProfile);
//     }

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @GetMapping("/profilename/{corporateEmail}")
//     public ResponseEntity<String> getFullName(@PathVariable("corporateEmail") String email) {
//         try {
//             String fullName = corpService.getEmployeeName(email);
//             return ResponseEntity.ok("Hi " + fullName);
//         } catch (RuntimeException ex) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
//         }
//     }

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @PostMapping("/forgetpass")
//     public ResponseEntity<String> processCorporateForgotPassword(@RequestBody Map<String, String> requestBody) {
//         System.out.println("Received corporate forgot password request");
//         String email = requestBody.get("email");
//         System.out.println("Corporate Email received: " + email);

//         CorporateUser corpUser = corpService.getUserByEmail(email);
//         if (corpUser == null) {
//             System.out.println("No corporate user found with the email: " + email);
//             return ResponseEntity.badRequest().body("No corporate account found with the provided email.");
//         }

//         String resetToken = UUID.randomUUID().toString();
//         corpUser.setResetToken(resetToken);
//         corpUser.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
//         corpService.save(corpUser);

//         String resetLink = "https://cmda.aycanalytics.com/CorporateResetPassword?token=" + resetToken;
//         System.out.println("Generated corporate reset link: " + resetLink);

//         corpemailService.sendEmail(corpUser.getEmail(), "Corporate Password Reset Request",
//                 "Click the link to reset your password: " + resetLink);

//         return ResponseEntity.ok("Corporate password reset link has been sent to your email.");
//     }

//     @PostMapping("/corp/resetpassword")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     public ResponseEntity<?> resetCorporatePassword(@RequestBody Map<String, String> requestBody) {
//         String token = requestBody.get("token");
//         String newPassword = requestBody.get("newPassword");
//         String confirmPassword = requestBody.get("confirmPassword");

//         System.out.println("Received Token: " + token);

//         CorporateUser corpUser = corpService.findCorporateUserByResetToken(token);
//         if (corpUser == null) {
//             System.out.println("No corporate user found with the provided token.");
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid or expired token.");
//         }

//         System.out.println("Token Expiry Time: " + corpUser.getTokenExpiry());
//         System.out.println("Current Time: " + LocalDateTime.now());

//         if (corpUser.getTokenExpiry().isBefore(LocalDateTime.now())) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token has expired.");
//         }

//         if (!newPassword.equals(confirmPassword)) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match.");
//         }

//         try {
//             validatePassword(newPassword);
//             corpUser.setPassword(passwordEncoder.encode(newPassword));
//             corpUser.setResetToken(null);
//             corpUser.setTokenExpiry(null);
//             corpService.save(corpUser);

//             return ResponseEntity.ok("Corporate password reset successfully. Please log in.");
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//         }
//     }

//     private void validatePassword(String password) {
//         String PASSWORD_PATTERN = "^[A-Z][a-zA-Z0-9@#$%^&+=]{7,}$";
//         if (!Pattern.matches(PASSWORD_PATTERN, password)) {
//             throw new IllegalArgumentException(
//                 "Password must start with an uppercase letter, be at least 8 characters long, and include letters, numbers, and special characters."
//             );
//         }
//     }

//     @PutMapping("/upload-profile-picture")
//     public ResponseEntity<String> uploadProfilePicture(
//             @RequestParam("file") MultipartFile file, 
//             HttpServletRequest request) {

//         String authorizationHeader = request.getHeader("Authorization");
//         System.out.println("Authorization Header: " + authorizationHeader);

//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             System.out.println("Authorization header is missing or invalid");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
//         }

//         String token = authorizationHeader.substring(7);
//         String tokenEmail;

//         try {
//             tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
//             System.out.println("Extracted Email from Token: " + tokenEmail);
//         } catch (Exception e) {
//             System.out.println("Error Extracting Email: " + e.getMessage());
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
//         }

//         try {
//             String imageUrl = corpService.saveProfilePicture(tokenEmail, file);
//             corpService.updateUserProfilePicture(tokenEmail, imageUrl);
//             System.out.println("Profile picture uploaded successfully: " + imageUrl);
//             return ResponseEntity.ok("Profile picture updated successfully: " + imageUrl);
//         } catch (Exception e) {
//             System.out.println("Error saving profile picture: " + e.getMessage());
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
//         }
//     }

//     @GetMapping("/profile-picture")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     public ResponseEntity<String> getProfilePicture(HttpServletRequest request) {
//         String authorizationHeader = request.getHeader("Authorization");

//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
//         }

//         String token = authorizationHeader.substring(7);
//         String tokenEmail;

//         try {
//             tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
//         }

//         String imageUrl = corpService.getProfilePicture(tokenEmail);
//         if (imageUrl == null) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile picture not found");
//         }

//         return ResponseEntity.ok(imageUrl);
//     }

//     @GetMapping("/uploads/{filename:.+}")
//     public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
//         try {
//             Path filePath = Paths.get("/app/uploads").resolve(filename).normalize();
//             Resource resource = new UrlResource(filePath.toUri());

//             if (resource.exists() && resource.isReadable()) {
//                 String contentType = determineContentType(filename);
//                 return ResponseEntity.ok()
//                         .contentType(MediaType.parseMediaType(contentType))
//                         .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
//                         .body(resource);
//             } else {
//                 return ResponseEntity.notFound().build();
//             }
//         } catch (MalformedURLException e) {
//             return ResponseEntity.badRequest().build();
//         }
//     }

//     private String determineContentType(String filename) {
//         String lowercaseFilename = filename.toLowerCase();
//         if (lowercaseFilename.endsWith(".png")) {
//             return "image/png";
//         } else if (lowercaseFilename.endsWith(".jpg") || lowercaseFilename.endsWith(".jpeg")) {
//             return "image/jpeg";
//         } else if (lowercaseFilename.endsWith(".gif")) {
//             return "image/gif";
//         }
//         return MediaType.APPLICATION_OCTET_STREAM_VALUE;
//     }

//     @DeleteMapping("/delete-account")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     public ResponseEntity<String> deleteAccount(HttpServletRequest request) {
//         String authorizationHeader = request.getHeader("Authorization");

//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
//         }

//         String token = authorizationHeader.substring(7);
//         String tokenEmail;

//         try {
//             tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
//             System.out.println("Extracted email from token: " + tokenEmail);
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
//         }

//         CorporateUser user = corpService.getUserByEmail(tokenEmail);
//         if (user == null) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Corporate user not found");
//         }

//         boolean isDeleted = corpService.deactivateCorporateUserAccount(tokenEmail);
//         if (!isDeleted) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to deactivate account");
//         }

//         return ResponseEntity.ok("Corporate account deactivated successfully");
//     }
// }

////////////----------working code without log----------//

package com.example.prog.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.example.prog.entity.CorporateUser;
import com.example.prog.service.CorporateService;
import com.example.prog.token.JwtUtil;
import com.example.prog.repository.CorporateUserRepository;
import org.springframework.core.io.Resource;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.prog.eamilservice.CorporateUserEmailSenderService;
import jakarta.validation.ValidationException;
import java.net.MalformedURLException;
import com.example.prog.config.CorsConfig;

import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import com.example.prog.service.UserActivityService;

@RestController
@RequestMapping("/api/corporate")
public class CorporateUserController {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Autowired
    private CorporateUserRepository corporateUserRepository;
    @Autowired
    private CorporateService corpService;
    @Autowired
    private CorporateUserEmailSenderService corpemailService;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil; // Inject JwtUtil
    @Autowired
    private UserActivityService userActivityService; // Add UserActivityService

    @Autowired
    private CorsConfig corsConfig;

    // Method to log user activity
    private void logUserActivity(String email, String userType, String activityType) {
        if (email == null) {
            email = "UNKNOWN";
        }
        userActivityService.logUserActivity(email, userType, activityType);
    }

    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    @GetMapping("/{email}")
    public ResponseEntity<CorporateUser> getProfile(@PathVariable("email") String email, HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            // logUserActivity(email, "CORPORATE", "GET_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authorizationHeader.substring(7);
        String tokenEmail;

        try {
            tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
        } catch (Exception e) {
            // logUserActivity(email, "CORPORATE", "GET_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!email.equals(tokenEmail)) {
            // logUserActivity(email, "CORPORATE", "GET_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        CorporateUser userProfile = corpService.getCorporateUser(email);
        if (userProfile == null) {
            System.out.println("User not found: " + email);
            // logUserActivity(email, "CORPORATE", "GET_PROFILE_FAILED");
            return ResponseEntity.notFound().build();
        }
        System.out.println("Extracted email from token: " + tokenEmail);
        // logUserActivity(email, "CORPORATE", "GET_PROFILE_SUCCESS");

        return ResponseEntity.ok(userProfile);
    }

    @PreAuthorize("hasRole('CORPORATE')")
    @PutMapping("/complete-profile")
    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    public ResponseEntity<CorporateUser> completeUserProfile(@RequestBody CorporateUser additionalDetails, HttpServletRequest request) {
        System.out.println("Received details: " + additionalDetails);
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logUserActivity(additionalDetails.getEmail(), "CORPORATE", "COMPLETE_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authorizationHeader.substring(7);
        String tokenEmail;

        try {
            tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
        } catch (Exception e) {
            logUserActivity(additionalDetails.getEmail(), "CORPORATE", "COMPLETE_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (additionalDetails.getEmail() == null || !additionalDetails.getEmail().equals(tokenEmail)) {
            logUserActivity(additionalDetails.getEmail(), "CORPORATE", "COMPLETE_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        System.out.println("Extracted email from token: " + tokenEmail);

        CorporateUser existingUserProfile = corpService.getUserByEmail(tokenEmail);

        if (existingUserProfile == null) {
            logUserActivity(additionalDetails.getEmail(), "CORPORATE", "COMPLETE_PROFILE_FAILED");
            return ResponseEntity.notFound().build();
        }

        existingUserProfile.setGender(additionalDetails.getGender() != null ? additionalDetails.getGender() : existingUserProfile.getGender());
        existingUserProfile.setAdharcard(additionalDetails.getAdharcard() != null ? additionalDetails.getAdharcard() : existingUserProfile.getAdharcard());
        existingUserProfile.setPancard(additionalDetails.getPancard() != null ? additionalDetails.getPancard() : existingUserProfile.getPancard());
        existingUserProfile.setAddress(additionalDetails.getAddress() != null ? additionalDetails.getAddress() : existingUserProfile.getAddress());
        existingUserProfile.setDateofbirth(additionalDetails.getDateofbirth() != null ? additionalDetails.getDateofbirth() : existingUserProfile.getDateofbirth());
        existingUserProfile.setUserType(additionalDetails.getUserType() != null ? additionalDetails.getUserType() : existingUserProfile.getUserType());

        CorporateUser updatedProfile = corpService.completeUserProfile(existingUserProfile);

        if (updatedProfile == null) {
            logUserActivity(additionalDetails.getEmail(), "CORPORATE", "COMPLETE_PROFILE_FAILED");
            return ResponseEntity.notFound().build();
        }

        logUserActivity(additionalDetails.getEmail(), "CORPORATE", "COMPLETE_PROFILE_SUCCESS");
        return ResponseEntity.ok(updatedProfile);
    }

    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    @PostMapping("/register")
    public String registerCorporateUser(@RequestBody CorporateUser user) {
        try {
            validateEmails(user.getEmail());
            validatePassword(user.getPassword(), user.getConfirmpassword());

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            corpService.save(user);
            logUserActivity(user.getEmail(), "CORPORATE", "CORPORATE_REGISTRATION_SUCCESS");
            return "Corporate user registered successfully";
        } catch (ValidationException e) {
            logUserActivity(user.getEmail(), "CORPORATE", "CORPORATE_REGISTRATION_FAILED");
            return "Validation Error: " + e.getMessage();
        } catch (Exception e) {
            logUserActivity(user.getEmail(), "CORPORATE", "CORPORATE_REGISTRATION_ERROR");
            return "Error: " + e.getMessage();
        }
    }

    private void validateEmails(String corporateEmail) {
        if (corporateEmail == null || corporateEmail.isEmpty()) {
            throw new ValidationException("Corporate Email must be provided.");
        }
    }

    private void validatePassword(String password, String confirmPassword) {
        if (password == null || confirmPassword == null) {
            throw new ValidationException("Password and Confirm Password cannot be null");
        }

        if (!password.equals(confirmPassword)) {
            throw new ValidationException("Password and Confirm Password do not match");
        }

        String PASSWORD_PATTERN = "^[A-Z][a-zA-Z0-9@#$%^&+=]{7}$";

        if (!Pattern.matches(PASSWORD_PATTERN, password)) {
            throw new ValidationException("Password must start with an uppercase letter, be 8 characters long, and include letters, numbers, and special characters.");
        }
    }

    private void validateUserType(String userType) {
        if (userType == null || (!userType.equals("Salaried") && !userType.equals("Housewife"))) {
            throw new ValidationException("User type must be either 'Salaried' or 'Housewife'.");
        }
    }

    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    @PostMapping("/login")
    public String loginCorporateUser(@RequestBody CorporateUser loginRequest) {
        CorporateUser user = corpService.findByEmail(loginRequest.getEmail());
        if (user == null) {
            logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN_FAILED");
            return "Corporate user not found";
        }
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN_FAILED");
            return "Invalid credentials";
        }
        logUserActivity(loginRequest.getEmail(), "CORPORATE", "CORPORATE_LOGIN_SUCCESS");
        return "Corporate login successful for company: " + user.getCompanyName();
    }

    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    @GetMapping("/forgetpass")
    public String forgotPassword() {
        return "forgetpass";
    }

    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    @PostMapping("corpemailforgetpass")
    public String processForgotPassword(@RequestParam("email") String email) {
        System.out.println("Received email: " + email);
        logUserActivity(email, "CORPORATE", "FORGOT_PASSWORD_REQUEST");
        return corpemailService.processForgotPassword(email);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<String> handleMissingParams(MissingServletRequestParameterException ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body("Missing required parameter: " + ex.getParameterName());
    }

    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    @PutMapping("/update")
    public ResponseEntity<CorporateUser> updateProfile(@RequestBody CorporateUser corpuserProfile, HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (corpuserProfile.getEmail() == null || corpuserProfile.getEmail().isEmpty()) {
            logUserActivity(corpuserProfile.getEmail(), "CORPORATE", "UPDATE_PROFILE_FAILED");
            return ResponseEntity.badRequest().build();
        }

        String token = authorizationHeader.substring(7);
        String tokenEmail;

        try {
            tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
        } catch (Exception e) {
            logUserActivity(corpuserProfile.getEmail(), "CORPORATE", "UPDATE_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (corpuserProfile.getEmail() == null || !corpuserProfile.getEmail().equals(tokenEmail)) {
            logUserActivity(corpuserProfile.getEmail(), "CORPORATE", "UPDATE_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        System.out.println("Received update request for: " + corpuserProfile);

        if (corpuserProfile.getUserType() != null) {
            validateUserType(corpuserProfile.getUserType());
        }

        CorporateUser updatedcorpProfile = corpService.updateCorpUserProfile(corpuserProfile);

        if (updatedcorpProfile == null) {
            logUserActivity(corpuserProfile.getEmail(), "CORPORATE", "UPDATE_PROFILE_FAILED");
            return ResponseEntity.notFound().build();
        }

        System.out.println("Extracted email from token: " + tokenEmail);
        logUserActivity(corpuserProfile.getEmail(), "CORPORATE", "UPDATE_PROFILE_SUCCESS");
        return ResponseEntity.ok(updatedcorpProfile);
    }

    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    @GetMapping("/profilename/{corporateEmail}")
    public ResponseEntity<String> getFullName(@PathVariable("corporateEmail") String email) {
        try {
            String fullName = corpService.getEmployeeName(email);
            logUserActivity(email, "CORPORATE", "GET_FULLNAME_SUCCESS");
            return ResponseEntity.ok("Hi " + fullName);
        } catch (RuntimeException ex) {
            logUserActivity(email, "CORPORATE", "GET_FULLNAME_FAILED");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    // @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    // @PostMapping("/forgetpass")
    // public ResponseEntity<String> processCorporateForgotPassword(@RequestBody Map<String, String> requestBody) {
    //     System.out.println("Received corporate forgot password request");
    //     String email = requestBody.get("email");
    //     System.out.println("Corporate Email received: " + email);

    //     CorporateUser corpUser = corpService.getUserByEmail(email);
    //     if (corpUser == null) {
    //         System.out.println("No corporate user found with the email: " + email);
    //         logUserActivity(email, "CORPORATE", "FORGOT_PASSWORD_FAILED");
    //         return ResponseEntity.badRequest().body("No corporate account found with the provided email.");
    //     }

    //     String resetToken = UUID.randomUUID().toString();
    //     corpUser.setResetToken(resetToken);
    //     corpUser.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
    //     corpService.save(corpUser);

    //     String resetLink = "https://cmdahub.com/CorporateResetPassword?token=" + resetToken;
    //     System.out.println("Generated corporate reset link: " + resetLink);

    //     corpemailService.sendEmail(corpUser.getEmail(), "Corporate Password Reset Request",
    //             "Click the link to reset your password: " + resetLink);

    //     logUserActivity(email, "CORPORATE", "FORGOT_PASSWORD_SUCCESS");
    //     return ResponseEntity.ok("Corporate password reset link has been sent to your email.");
    // }

    @PostMapping("/forgetpass")
    public ResponseEntity<String> processCorporateForgotPassword(@RequestBody Map<String, String> requestBody) {
        System.out.println("Received corporate forgot password request");
        String email = requestBody.get("email");
        System.out.println("Corporate Email received: " + email);

        CorporateUser corpUser = corpService.getUserByEmail(email);
        if (corpUser == null) {
            System.out.println("No corporate user found with the email: " + email);
            logUserActivity(email, "CORPORATE", "FORGOT_PASSWORD_FAILED");
            return ResponseEntity.badRequest().body("No corporate account found with the provided email.");
        }

        String resetToken = UUID.randomUUID().toString();
        corpUser.setResetToken(resetToken);
        corpUser.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
        corpService.save(corpUser);

        // Get the frontend URLs from CorsConfig
        // String primaryResetLink = corsConfig.getFrontendUrl() + "CorporateResetPassword?token=" + resetToken;
        String alternateResetLink = corsConfig.getAlternateFrontendUrl() + "/CorporateResetPassword?token=" + resetToken;
        // System.out.println("Generated corporate reset link (primary): " + primaryResetLink);
        System.out.println("Generated corporate reset link (alternate): " + alternateResetLink);

        // Send email with both reset links
        String emailBody = "Click the following links to reset your password:\n" +
                        //   "Primary Link: " + primaryResetLink + "\n" +
                          "Reset Link: " + alternateResetLink;
        corpemailService.sendEmail(corpUser.getEmail(), "Corporate Password Reset Request", emailBody);

        logUserActivity(email, "CORPORATE", "FORGOT_PASSWORD_SUCCESS");
        return ResponseEntity.ok("Corporate password reset link has been sent to your email.");
    }

    @PostMapping("/corp/resetpassword")
    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    public ResponseEntity<?> resetCorporatePassword(@RequestBody Map<String, String> requestBody) {
        String token = requestBody.get("token");
        String newPassword = requestBody.get("newPassword");
        String confirmPassword = requestBody.get("confirmPassword");

        System.out.println("Received Token: " + token);

        CorporateUser corpUser = corpService.findCorporateUserByResetToken(token);
        if (corpUser == null) {
            System.out.println("No corporate user found with the provided token.");
            logUserActivity(corpUser != null ? corpUser.getEmail() : null, "CORPORATE", "RESET_PASSWORD_FAILED");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid or expired token.");
        }

        System.out.println("Token Expiry Time: " + corpUser.getTokenExpiry());
        System.out.println("Current Time: " + LocalDateTime.now());

        if (corpUser.getTokenExpiry().isBefore(LocalDateTime.now())) {
            logUserActivity(corpUser.getEmail(), "CORPORATE", "RESET_PASSWORD_FAILED");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token has expired.");
        }

        if (!newPassword.equals(confirmPassword)) {
            logUserActivity(corpUser.getEmail(), "CORPORATE", "RESET_PASSWORD_FAILED");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match.");
        }

        try {
            validatePassword(newPassword);
            corpUser.setPassword(passwordEncoder.encode(newPassword));
            corpUser.setResetToken(null);
            corpUser.setTokenExpiry(null);
            corpService.save(corpUser);
            logUserActivity(corpUser.getEmail(), "CORPORATE", "RESET_PASSWORD_SUCCESS");
            return ResponseEntity.ok("Corporate password reset successfully. Please log in.");
        } catch (IllegalArgumentException e) {
            logUserActivity(corpUser.getEmail(), "CORPORATE", "RESET_PASSWORD_FAILED");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    private void validatePassword(String password) {
        String PASSWORD_PATTERN = "^[A-Z][a-zA-Z0-9@#$%^&+=]{7,}$";
        if (!Pattern.matches(PASSWORD_PATTERN, password)) {
            throw new IllegalArgumentException(
                "Password must start with an uppercase letter, be at least 8 characters long, and include letters, numbers, and special characters."
            );
        }
    }

    @PutMapping("/upload-profile-picture")
    public ResponseEntity<String> uploadProfilePicture(
            @RequestParam("file") MultipartFile file, 
            HttpServletRequest request) {

        String authorizationHeader = request.getHeader("Authorization");
        System.out.println("Authorization Header: " + authorizationHeader);

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            System.out.println("Authorization header is missing or invalid");
            logUserActivity(null, "CORPORATE", "UPLOAD_PROFILE_PICTURE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
        }

        String token = authorizationHeader.substring(7);
        String tokenEmail = null; // Initialize tokenEmail

        try {
            tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
            System.out.println("Extracted Email from Token: " + tokenEmail);
        } catch (Exception e) {
            System.out.println("Error Extracting Email: " + e.getMessage());
            logUserActivity(tokenEmail, "CORPORATE", "UPLOAD_PROFILE_PICTURE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        try {
            String imageUrl = corpService.saveProfilePicture(tokenEmail, file);
            corpService.updateUserProfilePicture(tokenEmail, imageUrl);
            System.out.println("Profile picture uploaded successfully: " + imageUrl);
            logUserActivity(tokenEmail, "CORPORATE", "UPLOAD_PROFILE_PICTURE_SUCCESS");
            return ResponseEntity.ok("Profile picture updated successfully: " + imageUrl);
        } catch (Exception e) {
            System.out.println("Error saving profile picture: " + e.getMessage());
            logUserActivity(tokenEmail, "CORPORATE", "UPLOAD_PROFILE_PICTURE_FAILED");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }
    }

   @GetMapping("/profile-picture")
    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    public ResponseEntity<String> getProfilePicture(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
        }

        String token = authorizationHeader.substring(7);
        String tokenEmail = null; // Initialize tokenEmail

        try {
            tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
        } catch (Exception e) {
            // logUserActivity(tokenEmail, "CORPORATE", "GET_PROFILE_PICTURE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        String imageUrl = corpService.getProfilePicture(tokenEmail);
        if (imageUrl == null) {
            // logUserActivity(tokenEmail, "CORPORATE", "GET_PROFILE_PICTURE_FAILED");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile picture not found");
        }

        // logUserActivity(tokenEmail, "CORPORATE", "GET_PROFILE_PICTURE_SUCCESS");
        return ResponseEntity.ok(imageUrl);
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("/app/uploads").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(filename);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String determineContentType(String filename) {
        String lowercaseFilename = filename.toLowerCase();
        if (lowercaseFilename.endsWith(".png")) {
            return "image/png";
        } else if (lowercaseFilename.endsWith(".jpg") || lowercaseFilename.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lowercaseFilename.endsWith(".gif")) {
            return "image/gif";
        }
        return MediaType.APPLICATION_OCTET_STREAM_VALUE;
    }

    // @DeleteMapping("/delete-account")
    // @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    // public ResponseEntity<String> deleteAccount(HttpServletRequest request) {
    //     String authorizationHeader = request.getHeader("Authorization");

    //     if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
    //         logUserActivity(null, "CORPORATE", "DELETE_ACCOUNT_FAILED");
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
    //     }

    //     String token = authorizationHeader.substring(7);
    //     String tokenEmail = null; // Initialize tokenEmail

    //     try {
    //         tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
    //         System.out.println("Extracted email from token: " + tokenEmail);
    //     } catch (Exception e) {
    //         logUserActivity(tokenEmail, "CORPORATE", "DELETE_ACCOUNT_FAILED");
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
    //     }

    //     CorporateUser user = corpService.getUserByEmail(tokenEmail);
    //     if (user == null) {
    //         logUserActivity(tokenEmail, "CORPORATE", "DELETE_ACCOUNT_FAILED");
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Corporate user not found");
    //     }

    //     boolean isDeleted = corpService.deactivateCorporateUserAccount(tokenEmail);
    //     if (!isDeleted) {
    //         logUserActivity(tokenEmail, "CORPORATE", "DELETE_ACCOUNT_FAILED");
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to deactivate account");
    //     }

    //     logUserActivity(tokenEmail, "CORPORATE", "DELETE_ACCOUNT_SUCCESS");
    //     return ResponseEntity.ok("Corporate account deactivated successfully");
    // }

@DeleteMapping("/delete-account")
    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    public ResponseEntity<String> deleteAccount(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logUserActivity(null, "CORPORATE", "DELETE_ACCOUNT_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
        }

        String token = authorizationHeader.substring(7);
        String tokenEmail = null;

        try {
            tokenEmail = jwtUtil.extractEmail(token);
            System.out.println("Extracted email from token: " + tokenEmail);
        } catch (Exception e) {
            logUserActivity(tokenEmail, "CORPORATE", "DELETE_ACCOUNT_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        CorporateUser user = corpService.getUserByEmail(tokenEmail);
        if (user == null) {
            logUserActivity(tokenEmail, "CORPORATE", "DELETE_ACCOUNT_FAILED");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Corporate user not found");
        }

        // Check if adminId is null
        if (user.getAdminId() == null) {
            logUserActivity(tokenEmail, "CORPORATE", "DELETE_ACCOUNT_FAILED");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User has no admin ID assigned");
        }

        // Delete admin and associated users
        boolean isDeleted = corpService.deleteCorporateUserAndAssociatedUsers(tokenEmail);
        if (!isDeleted) {
            logUserActivity(tokenEmail, "CORPORATE", "DELETE_ACCOUNT_FAILED");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete account and associated users");
        }

        logUserActivity(tokenEmail, "CORPORATE", "DELETE_ACCOUNT_SUCCESS");
        return ResponseEntity.ok("Corporate account and associated users deleted successfully");
    }

}