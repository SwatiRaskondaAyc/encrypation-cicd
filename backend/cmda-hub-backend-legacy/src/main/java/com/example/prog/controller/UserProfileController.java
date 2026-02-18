

// package com.example.prog.controller;

// import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;


// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.Userprofile;
// import com.example.prog.service.UserProfileService;
// import com.example.prog.token.JwtUtil;
// import com.example.prog.token.TokenValidator;
// import com.example.prog.token.UnauthorizedException;

// import jakarta.annotation.Resource;
// import jakarta.servlet.http.HttpServletRequest;

// @RestController
// @RequestMapping("/api/Userprofile")

// public class UserProfileController {
	

	

// 	 @Value("${frontend.url}") // Inject frontend URL
// 	 private String frontendUrl;



//     @Autowired
//     private UserProfileService userProfileService;
 
//     @GetMapping("/{email}")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     public ResponseEntity<Userprofile> getProfile(@PathVariable String email, HttpServletRequest request) {
//         String authorizationHeader = request.getHeader("Authorization");

//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
//         String tokenEmail;

//         try {
//             tokenEmail = JwtUtil.extractEmail(token);
       

//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         // Verify if the email in the token matches the requested email
//         if (!email.equals(tokenEmail)) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//         }

//         // Fetch the user profile
//         Userprofile userProfile = userProfileService.getUserProfile(email);
//         if (userProfile == null) {
//             return ResponseEntity.notFound().build();
//         }
        
//         System.out.println("Extracted email from token: " + tokenEmail);


//         return ResponseEntity.ok(userProfile);
//     }

    
  
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @GetMapping("/getallusers")
//     public List<Userprofile> getAllUserProfiles() {
//         return userProfileService.getAllUserProfiles(); // Updated method for fetching all users
//     }
 
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @PutMapping("/update")
//     public ResponseEntity<UserDtls> updateProfile(@RequestBody UserDtls userProfile, HttpServletRequest request) {
       
//     	  String authorizationHeader = request.getHeader("Authorization");
// //    	    String tokenEmail;
    	  
//     	  if (userProfile.getEmail() == null || userProfile.getEmail().isEmpty()) {
//               return ResponseEntity.badRequest().build();
//               }
    	  
//     	  String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
//           String tokenEmail;
          

//     	    try {
//     	        tokenEmail = JwtUtil.extractEmail(token); 
//     	    } 
    	    
//     	    catch (Exception e) {
//     	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//     	    }

//     	    // Verify if the email in the token matches the email in the request
//     	    if (userProfile.getEmail() == null || !userProfile.getEmail().equals(tokenEmail)) {
//     	        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//     	    }

//     	    // Log the received data
//     	    System.out.println("Received update request for: " + userProfile);
// //    	
// //    	if (userProfile.getEmail() == null || userProfile.getEmail().isEmpty()) {
// //            return ResponseEntity.badRequest().build();
// //            
// //            
// //        }
        
    

//         UserDtls updatedProfile = userProfileService.updateUserProfile(userProfile);
//         if (updatedProfile == null)  {
//             return ResponseEntity.notFound().build();
//         }
        
//         System.out.println("Extracted email from token: " + tokenEmail);
//         return ResponseEntity.ok(updatedProfile);
//     }
 

//     @PutMapping("/complete-profile")
// //    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     public ResponseEntity<UserDtls> completeUserProfile(@RequestBody UserDtls additionalDetails, HttpServletRequest request) {
//         System.out.println("Received details: " + additionalDetails);
//         String authorizationHeader = request.getHeader("Authorization");

//         // Check if the Authorization header is present
//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         // Extract token from the Authorization header
//         String token = authorizationHeader.substring(7);
//         String tokenEmail;

//         try {
//             // Extract email from the token
//             tokenEmail = JwtUtil.extractEmail(token);
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         // Check if the email from the token matches the email in the request body
//         if (additionalDetails.getEmail() == null || !additionalDetails.getEmail().equals(tokenEmail)) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//         }

//         // Log the extracted email from the token
//         System.out.println("Extracted email from token: " + tokenEmail);

//         // Fetch the existing user profile based on email
//         UserDtls existingUserProfile = userProfileService.getUserByEmail(tokenEmail);

//         if (existingUserProfile == null) {
//             // If the user profile is not found, return NOT FOUND
//             return ResponseEntity.notFound().build();
//         }

//         // Update the existing profile with the additional details
//         existingUserProfile.setGender(additionalDetails.getGender() != null ? additionalDetails.getGender() : existingUserProfile.getGender());
//         existingUserProfile.setAdharcard(additionalDetails.getAdharcard() != null ? additionalDetails.getAdharcard() : existingUserProfile.getAdharcard());
//         existingUserProfile.setPancard(additionalDetails.getPancard() != null ? additionalDetails.getPancard() : existingUserProfile.getPancard());

//         existingUserProfile.setAddress(additionalDetails.getAddress() != null ? additionalDetails.getAddress() : existingUserProfile.getAddress());
//         existingUserProfile.setDateofbirth(additionalDetails.getDateofbirth() != null ? additionalDetails.getDateofbirth() : existingUserProfile.getDateofbirth());
//         // Add other fields as required

//         // Save the updated profile
//         UserDtls updatedProfile = userProfileService.completeUserProfile(existingUserProfile);

//         if (updatedProfile == null) {
//             // If the update fails, return NOT FOUND
//             return ResponseEntity.notFound().build();
//         }

//         return ResponseEntity.ok(updatedProfile);
//     }

    

// //    @CrossOrigin(origins = "http://localhost:5173")
//       @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    
//     @GetMapping("/profile/{email}")
//     public ResponseEntity<String> getFullName(@PathVariable String email) {
//         try {
//             String fullName = userProfileService.getFullName(email);
//             return ResponseEntity.ok("Hi " + fullName);
//         } catch (RuntimeException ex) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
//         }
        
//     }
    
//       @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
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
//             String imageUrl = userProfileService.saveProfilePicture(tokenEmail, file);
//             userProfileService.updateUserProfilePicture(tokenEmail, imageUrl);
//             System.out.println("Profile picture uploaded successfully: " + imageUrl);
//             return ResponseEntity.ok("Profile picture updated successfully: " + imageUrl);
//         } catch (Exception e) {
//             System.out.println("Error saving profile picture: " + e.getMessage());
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
//         }
//     }

//       @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @GetMapping("/profile-picture")
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

//         String imageUrl = userProfileService.getProfilePicture(tokenEmail); // Fetch from DB

//         if (imageUrl == null) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile picture not found");
//         }

//         return ResponseEntity.ok(imageUrl);
//     }


//     @DeleteMapping("/delete-account")
//      @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
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

//         UserDtls user = userProfileService.getUserByEmail(tokenEmail);
//         if (user == null) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
//         }

//         boolean isDeleted = userProfileService.deactivateUserAccount(tokenEmail);
//         if (!isDeleted) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to deactivate account");
//         }

//         return ResponseEntity.ok("Account deactivated successfully");
//     }
    


// }


////////----main code-----------------//

// package com.example.prog.controller;

// import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.util.List;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.Userprofile;
// import com.example.prog.service.UserProfileService;
// import com.example.prog.token.JwtUtil;
// import com.example.prog.token.TokenValidator;
// import com.example.prog.token.UnauthorizedException;
// import jakarta.annotation.Resource;
// import jakarta.servlet.http.HttpServletRequest;

// @RestController
// @RequestMapping("/api/Userprofile")
// public class UserProfileController {

//     @Value("${frontend.url}") // Inject frontend URL
//     private String frontendUrl;

//     @Autowired
//     private UserProfileService userProfileService;

//     @Autowired
//     private JwtUtil jwtUtil; // Inject JwtUtil

//     @GetMapping("/{email}")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     public ResponseEntity<Userprofile> getProfile(@PathVariable String email, HttpServletRequest request) {
//         String authorizationHeader = request.getHeader("Authorization");

//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
//         String tokenEmail;

//         try {
//             tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         // Verify if the email in the token matches the requested email
//         if (!email.equals(tokenEmail)) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//         }

//         // Fetch the user profile
//         Userprofile userProfile = userProfileService.getUserProfile(email);
//         if (userProfile == null) {
//             return ResponseEntity.notFound().build();
//         }

//         System.out.println("Extracted email from token: " + tokenEmail);

//         return ResponseEntity.ok(userProfile);
//     }

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @GetMapping("/getallusers")
//     public List<Userprofile> getAllUserProfiles() {
//         return userProfileService.getAllUserProfiles(); // Updated method for fetching all users
//     }

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @PutMapping("/update")
//     public ResponseEntity<UserDtls> updateProfile(@RequestBody UserDtls userProfile, HttpServletRequest request) {
//         String authorizationHeader = request.getHeader("Authorization");

//         if (userProfile.getEmail() == null || userProfile.getEmail().isEmpty()) {
//             return ResponseEntity.badRequest().build();
//         }

//         String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
//         String tokenEmail;

//         try {
//             tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         // Verify if the email in the token matches the email in the request
//         if (userProfile.getEmail() == null || !userProfile.getEmail().equals(tokenEmail)) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//         }

//         // Log the received data
//         System.out.println("Received update request for: " + userProfile);

//         UserDtls updatedProfile = userProfileService.updateUserProfile(userProfile);
//         if (updatedProfile == null) {
//             return ResponseEntity.notFound().build();
//         }

//         System.out.println("Extracted email from token: " + tokenEmail);
//         return ResponseEntity.ok(updatedProfile);
//     }

//     @PutMapping("/complete-profile")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     public ResponseEntity<UserDtls> completeUserProfile(@RequestBody UserDtls additionalDetails, HttpServletRequest request) {
//         System.out.println("Received details: " + additionalDetails);
//         String authorizationHeader = request.getHeader("Authorization");

//         // Check if the Authorization header is present
//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         // Extract token from the Authorization header
//         String token = authorizationHeader.substring(7);
//         String tokenEmail;

//         try {
//             // Extract email from the token
//             tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         // Check if the email from the token matches the email in the request body
//         if (additionalDetails.getEmail() == null || !additionalDetails.getEmail().equals(tokenEmail)) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//         }

//         // Log the extracted email from the token
//         System.out.println("Extracted email from token: " + tokenEmail);

//         // Fetch the existing user profile based on email
//         UserDtls existingUserProfile = userProfileService.getUserByEmail(tokenEmail);

//         if (existingUserProfile == null) {
//             // If the user profile is not found, return NOT FOUND
//             return ResponseEntity.notFound().build();
//         }

//         // Update the existing profile with the additional details
//         existingUserProfile.setGender(additionalDetails.getGender() != null ? additionalDetails.getGender() : existingUserProfile.getGender());
//         existingUserProfile.setAdharcard(additionalDetails.getAdharcard() != null ? additionalDetails.getAdharcard() : existingUserProfile.getAdharcard());
//         existingUserProfile.setPancard(additionalDetails.getPancard() != null ? additionalDetails.getPancard() : existingUserProfile.getPancard());
//         existingUserProfile.setAddress(additionalDetails.getAddress() != null ? additionalDetails.getAddress() : existingUserProfile.getAddress());
//         existingUserProfile.setDateofbirth(additionalDetails.getDateofbirth() != null ? additionalDetails.getDateofbirth() : existingUserProfile.getDateofbirth());

//         // Save the updated profile
//         UserDtls updatedProfile = userProfileService.completeUserProfile(existingUserProfile);

//         if (updatedProfile == null) {
//             // If the update fails, return NOT FOUND
//             return ResponseEntity.notFound().build();
//         }

//         return ResponseEntity.ok(updatedProfile);
//     }

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @GetMapping("/profile/{email}")
//     public ResponseEntity<String> getFullName(@PathVariable String email) {
//         try {
//             String fullName = userProfileService.getFullName(email);
//             return ResponseEntity.ok("Hi " + fullName);
//         } catch (RuntimeException ex) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
//         }
//     }

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
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
//             tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
//             System.out.println("Extracted Email from Token: " + tokenEmail);
//         } catch (Exception e) {
//             System.out.println("Error Extracting Email: " + e.getMessage());
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
//         }

//         try {
//             // Save profile picture and update user profile
//             String imageUrl = userProfileService.saveProfilePicture(tokenEmail, file);
//             userProfileService.updateUserProfilePicture(tokenEmail, imageUrl);
//             System.out.println("Profile picture uploaded successfully: " + imageUrl);
//             return ResponseEntity.ok("Profile picture updated successfully: " + imageUrl);
//         } catch (Exception e) {
//             System.out.println("Error saving profile picture: " + e.getMessage());
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
//         }
//     }

//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @GetMapping("/profile-picture")
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

//         String imageUrl = userProfileService.getProfilePicture(tokenEmail); // Fetch from DB

//         if (imageUrl == null) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile picture not found");
//         }

//         return ResponseEntity.ok(imageUrl);
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

//         UserDtls user = userProfileService.getUserByEmail(tokenEmail);
//         if (user == null) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
//         }

//         boolean isDeleted = userProfileService.deactivateUserAccount(tokenEmail);
//         if (!isDeleted) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to deactivate account");
//         }

//         return ResponseEntity.ok("Account deactivated successfully");
//     }
// }

package com.example.prog.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.prog.entity.UserDtls;
import com.example.prog.entity.Userprofile;
import com.example.prog.service.UserProfileService;
import com.example.prog.token.JwtUtil;
import com.example.prog.token.TokenValidator;
import com.example.prog.token.UnauthorizedException;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import com.example.prog.service.UserActivityService;

@RestController
@RequestMapping("/api/Userprofile")
public class UserProfileController {

    @Value("${frontend.url}") // Inject frontend URL
    private String frontendUrl;

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private JwtUtil jwtUtil; // Inject JwtUtil

    @Autowired
    private UserActivityService userActivityService; // Add UserActivityService

    // Method to log user activity
    private void logUserActivity(String email, String userType, String activityType) {
        if (email == null) {
            email = "UNKNOWN";
        }
        userActivityService.logUserActivity(email, userType, activityType);
    }

    @GetMapping("/{email}")
    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    public ResponseEntity<Userprofile> getProfile(@PathVariable String email, HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            // logUserActivity(email, "UNKNOWN", "GET_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
        String tokenEmail;

        try {
            tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
        } catch (Exception e) {
            // logUserActivity(email, "UNKNOWN", "GET_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Verify if the email in the token matches the requested email
        if (!email.equals(tokenEmail)) {
            // logUserActivity(email, "UNKNOWN", "GET_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Fetch the user profile
        Userprofile userProfile = userProfileService.getUserProfile(email);
        if (userProfile == null) {
            // logUserActivity(email, "UNKNOWN", "GET_PROFILE_FAILED");
            return ResponseEntity.notFound().build();
        }

        // logUserActivity(email, "INDIVIDUAL", "GET_PROFILE_SUCCESS");
        System.out.println("Extracted email from token: " + tokenEmail);

        return ResponseEntity.ok(userProfile);
    }

    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    @GetMapping("/getallusers")
    public List<Userprofile> getAllUserProfiles() {
        return userProfileService.getAllUserProfiles(); // Updated method for fetching all users
    }

    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    @PutMapping("/update")
    public ResponseEntity<UserDtls> updateProfile(@RequestBody UserDtls userProfile, HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (userProfile.getEmail() == null || userProfile.getEmail().isEmpty()) {
            logUserActivity(userProfile.getEmail(), "INDIVIDUAL", "UPDATE_PROFILE_FAILED");
            return ResponseEntity.badRequest().build();
        }

        String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
        String tokenEmail;

        try {
            tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
        } catch (Exception e) {
            logUserActivity(userProfile.getEmail(), "INDIVIDUAL", "UPDATE_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Verify if the email in the token matches the email in the request
        if (userProfile.getEmail() == null || !userProfile.getEmail().equals(tokenEmail)) {
            logUserActivity(userProfile.getEmail(), "INDIVIDUAL", "UPDATE_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Log the received data
        System.out.println("Received update request for: " + userProfile);

        UserDtls updatedProfile = userProfileService.updateUserProfile(userProfile);
        if (updatedProfile == null) {
            logUserActivity(userProfile.getEmail(), "INDIVIDUAL", "UPDATE_PROFILE_FAILED");
            return ResponseEntity.notFound().build();
        }

        logUserActivity(userProfile.getEmail(), "INDIVIDUAL", "UPDATE_PROFILE_SUCCESS");
        System.out.println("Extracted email from token: " + tokenEmail);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/complete-profile")
    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    public ResponseEntity<UserDtls> completeUserProfile(@RequestBody UserDtls additionalDetails, HttpServletRequest request) {
        System.out.println("Received details: " + additionalDetails);
        String authorizationHeader = request.getHeader("Authorization");

        // Check if the Authorization header is present
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logUserActivity(additionalDetails.getEmail(), "INDIVIDUAL", "COMPLETE_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Extract token from the Authorization header
        String token = authorizationHeader.substring(7);
        String tokenEmail;

        try {
            // Extract email from the token
            tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
        } catch (Exception e) {
            logUserActivity(additionalDetails.getEmail(), "INDIVIDUAL", "COMPLETE_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Check if the email from the token matches the email in the request body
        if (additionalDetails.getEmail() == null || !additionalDetails.getEmail().equals(tokenEmail)) {
            logUserActivity(additionalDetails.getEmail(), "INDIVIDUAL", "COMPLETE_PROFILE_FAILED");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Log the extracted email from the token
        System.out.println("Extracted email from token: " + tokenEmail);

        // Fetch the existing user profile based on email
        UserDtls existingUserProfile = userProfileService.getUserByEmail(tokenEmail);

        if (existingUserProfile == null) {
            // If the user profile is not found, return NOT FOUND
            logUserActivity(additionalDetails.getEmail(), "INDIVIDUAL", "COMPLETE_PROFILE_FAILED");
            return ResponseEntity.notFound().build();
        }

        // Update the existing profile with the additional details
        existingUserProfile.setGender(additionalDetails.getGender() != null ? additionalDetails.getGender() : existingUserProfile.getGender());
        existingUserProfile.setAdharcard(additionalDetails.getAdharcard() != null ? additionalDetails.getAdharcard() : existingUserProfile.getAdharcard());
        existingUserProfile.setPancard(additionalDetails.getPancard() != null ? additionalDetails.getPancard() : existingUserProfile.getPancard());
        existingUserProfile.setAddress(additionalDetails.getAddress() != null ? additionalDetails.getAddress() : existingUserProfile.getAddress());
        existingUserProfile.setDateofbirth(additionalDetails.getDateofbirth() != null ? additionalDetails.getDateofbirth() : existingUserProfile.getDateofbirth());

        // Save the updated profile
        UserDtls updatedProfile = userProfileService.completeUserProfile(existingUserProfile);

        if (updatedProfile == null) {
            // If the update fails, return NOT FOUND
            logUserActivity(additionalDetails.getEmail(), "INDIVIDUAL", "COMPLETE_PROFILE_FAILED");
            return ResponseEntity.notFound().build();
        }

        logUserActivity(additionalDetails.getEmail(), "INDIVIDUAL", "COMPLETE_PROFILE_SUCCESS");
        return ResponseEntity.ok(updatedProfile);
    }

    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    @GetMapping("/profile/{email}")
    public ResponseEntity<String> getFullName(@PathVariable String email) {
        try {
            String fullName = userProfileService.getFullName(email);
            logUserActivity(email, "INDIVIDUAL", "GET_FULLNAME_SUCCESS");
            return ResponseEntity.ok("Hi " + fullName);
        } catch (RuntimeException ex) {
            logUserActivity(email, "INDIVIDUAL", "GET_FULLNAME_FAILED");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    @PutMapping("/upload-profile-picture")
    public ResponseEntity<String> uploadProfilePicture(
            @RequestParam("file") MultipartFile file, 
            HttpServletRequest request) {

        // Log Authorization Header
        String authorizationHeader = request.getHeader("Authorization");
        System.out.println("Authorization Header: " + authorizationHeader);

        // Check if Authorization Header is missing or invalid
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logUserActivity(null, "UNKNOWN", "UPLOAD_PROFILE_PICTURE_FAILED");
            System.out.println("Authorization header is missing or invalid");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
        }

        // Extract JWT Token
        String token = authorizationHeader.substring(7);
        String tokenEmail = null; // Initialize to null

        try {
            tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
            System.out.println("Extracted Email from Token: " + tokenEmail);
        } catch (Exception e) {
            logUserActivity(tokenEmail != null ? tokenEmail : null, "UNKNOWN", "UPLOAD_PROFILE_PICTURE_FAILED");
            System.out.println("Error Extracting Email: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        try {
            // Save profile picture and update user profile
            String imageUrl = userProfileService.saveProfilePicture(tokenEmail, file);
            userProfileService.updateUserProfilePicture(tokenEmail, imageUrl);
            logUserActivity(tokenEmail, "INDIVIDUAL", "UPLOAD_PROFILE_PICTURE_SUCCESS");
            System.out.println("Profile picture uploaded successfully: " + imageUrl);
            return ResponseEntity.ok("Profile picture updated successfully: " + imageUrl);
        } catch (Exception e) {
            logUserActivity(tokenEmail, "INDIVIDUAL", "UPLOAD_PROFILE_PICTURE_FAILED");
            System.out.println("Error saving profile picture: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }
    }

  @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    @GetMapping("/profile-picture")
    public ResponseEntity<String> getProfilePicture(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
        }

        String token = authorizationHeader.substring(7);
        String tokenEmail = null; // Initialize to null

        try {
            tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
        } catch (Exception e) {
            // logUserActivity(tokenEmail, "UNKNOWN", "GET_PROFILE_PICTURE_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        String imageUrl = userProfileService.getProfilePicture(tokenEmail); // Fetch from DB

        if (imageUrl == null) {
            // logUserActivity(tokenEmail, "INDIVIDUAL", "GET_PROFILE_PICTURE_FAILED");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile picture not found");
        }

        // logUserActivity(tokenEmail, "INDIVIDUAL", "GET_PROFILE_PICTURE_SUCCESS");
        return ResponseEntity.ok(imageUrl);
    }
    
    @DeleteMapping("/delete-account")
    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
    public ResponseEntity<String> deleteAccount(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logUserActivity(null, "UNKNOWN", "DELETE_ACCOUNT_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
        }

        String token = authorizationHeader.substring(7);
        String tokenEmail = null; // Initialize to null

        try {
            tokenEmail = jwtUtil.extractEmail(token); // Use injected instance
            System.out.println("Extracted email from token: " + tokenEmail);
        } catch (Exception e) {
            logUserActivity(tokenEmail != null ? tokenEmail : null, "UNKNOWN", "DELETE_ACCOUNT_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        UserDtls user = userProfileService.getUserByEmail(tokenEmail);
        if (user == null) {
            logUserActivity(tokenEmail, "INDIVIDUAL", "DELETE_ACCOUNT_FAILED");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        boolean isDeleted = userProfileService.deactivateUserAccount(tokenEmail);
        if (!isDeleted) {
            logUserActivity(tokenEmail, "INDIVIDUAL", "DELETE_ACCOUNT_FAILED");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to deactivate account");
        }

        logUserActivity(tokenEmail, "INDIVIDUAL", "DELETE_ACCOUNT_SUCCESS");
        return ResponseEntity.ok("Account deactivated successfully");
    }
}