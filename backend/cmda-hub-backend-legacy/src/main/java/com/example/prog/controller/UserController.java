//package com.example.prog.controller;
//
//import com.example.prog.eamilservice.EmailsenderService;
//import com.example.prog.entity.UserDtls;
//import com.example.prog.repository.UserRepository;
//import com.example.prog.service.HomeService;
//import com.example.prog.token.JwtUtil;
//
//import jakarta.servlet.http.HttpSession;
//
//import java.time.LocalDateTime;
//import java.time.ZoneId;
//import java.util.Date;
//import java.util.Map;
//import java.util.UUID;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.MissingServletRequestParameterException;
//import org.springframework.web.bind.annotation.*;
//
//import jakarta.validation.ValidationException;
//import java.util.regex.Pattern;
//
//@CrossOrigin(origins = "http://localhost:5173")
////@CrossOrigin(origins = "${frontend.url}")
//@RestController
//@RequestMapping("/api/users")
//public class UserController {
//
////	
////	 @Value("${frontend.url}") // Inject frontend URL
////	 private String frontendUrl;
//	 
//    @Autowired
//    private UserRepository repo;
//    
//    @Autowired
//    private EmailsenderService emailService;
//
//    @Autowired
//    private BCryptPasswordEncoder bp;
//    
//    @Autowired
//    private HomeService homeService;
//    
////    @GetMapping("/")
////    public String home() {
////        return "index"; // Redirects to home page
////    }
////    
////    @GetMapping("/StockMarketBasics")
////    public String home1() {
////        return "StockMarketBasics"; // Redirects StockMarketBasics page
////    }
////    
////    @GetMapping("/investmentStrat")
////    public String home2() {
////        return "investmentStrat"; // Redirects investmentStrat page
////    }
////    
////    @GetMapping("/TechnicalAnalysis")
////    public String home3() {
////        return "TechnicalAnalysis"; // Redirects TechnicalAnalysis page
////    }
////
////    @GetMapping("/login")
////    public String login() {
////        return "login"; // Returns login view
////    }
//
//    @PostMapping("/login")
//    public String processLogin(@ModelAttribute UserDtls user, HttpSession session, Model model) {
//        UserDtls existingUser = homeService.findUserByEmail(user.getEmail());
//
//        if (existingUser == null) {
//            model.addAttribute("popupMessage", "User not found. Please register first.");
//            return "redirect:/registration";
//        }
//
//        if (bp.matches(user.getPassword(), existingUser.getPassword())) {
//            session.setAttribute("currentUser", existingUser);
//            return "redirect:/home";
//        }
//
//        model.addAttribute("error", "Invalid email or password");
//        return "login";
//    }
//
//    @GetMapping("/home")
//    public String showHomePage() {
//        return "home";
//    }
//
////    @GetMapping("/forgetpasss")
////    public String forgotPassword() {
////        return "forgetpasss";
////    }
////
////    @PostMapping("forgetpass")
////    public String processForgotPassword(@RequestParam("email") String email) {
////        System.out.println("Received email: " + email);
////        return emailService.processForgotPassword(email);
////    }
//
////    
////    @PostMapping("/forgetpass")
////    public String processForgotPassword(@RequestParam("email") String email) {
////        UserDtls user = homeService.findUserByEmail(email);
////
////        if (user == null) {
////            return "No account found with the provided email.";
////        }
////
////        // Generate reset token and expiry
////        String resetToken = UUID.randomUUID().toString();
////        user.setResetToken(resetToken);
////        user.setTokenExpiry(LocalDateTime.now().plusMinutes(30)); // Token valid for 30 minutes
////
////        // Log debug information
////        System.out.println("Generated Reset Token: " + resetToken);
////        System.out.println("Token Expiry: " + user.getTokenExpiry());
////
////        // Save the user
////        homeService.saveUser(user);
////
////        // Send reset link via email
////        String resetLink = "http://localhost:8080/api/users/resetpassword?token=" + resetToken;
////        emailService.sendEmail(user.getEmail(), "Password Reset Request",
////                "Click the link to reset your password: " + resetLink + "\nThis link will expire in 30 minutes.");
////
////        return "Password reset link has been sent to your email.";
////    }
//
////    @CrossOrigin(origins = "http://localhost:5173")
////    @PostMapping("/forgetpass")
////    public ResponseEntity<String> processForgotPassword(@RequestParam("email") String email) {
////        System.out.println("Processing forgot password for email: " + email);
////        
////        UserDtls user = homeService.findUserByEmail(email);
////
////        if (user == null) {
////            System.out.println("No user found with the email: " + email);
////            return ResponseEntity.badRequest().body("No account found with the provided email.");
////        }
////
////        String resetToken = UUID.randomUUID().toString();
////        user.setResetToken(resetToken);
////        user.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
////
////        homeService.saveUser(user);
////
////        String resetLink = "http://localhost:8080/api/users/resetpassword?token=" + resetToken;
////        System.out.println("Reset link generated: " + resetLink);
////
////        emailService.sendEmail(user.getEmail(), "Password Reset Request",
////                "Click the link to reset your password: " + resetLink);
////
////        return ResponseEntity.ok("Password reset link has been sent to your email.");
////    }
//////   
////    @CrossOrigin(origins = "http://localhost:5173")
////    @PostMapping("/forgetpass")
////    public ResponseEntity<String> processForgotPassword(@RequestBody Map<String, String> requestBody) {
////        String email = requestBody.get("email");
////        System.out.println("Processing forgot password for email: " + email);
////
////        UserDtls user = homeService.findUserByEmail(email);
////
////        if (user == null) {
////            System.out.println("No user found with the email: " + email);
////            return ResponseEntity.badRequest().body("No account found with the provided email.");
////        }
////
////        String resetToken = UUID.randomUUID().toString();
////        user.setResetToken(resetToken);
////        user.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
////        
////
////        homeService.saveUser(user);
////
////        String resetLink = "http://localhost:8080/api/users/resetpassword?token=" + resetToken;
////        System.out.println("Reset link generated: " + resetLink);
////
////        emailService.sendEmail(user.getEmail(), "Password Reset Request",
////                "Click the link to reset your password: " + resetLink);
////
////        return ResponseEntity.ok("Password reset link has been sent to your email.");
////    }
////
//
//  @CrossOrigin(origins = "http://localhost:5173")
////    @CrossOrigin(origins = "${frontend.url}")
//    @PostMapping("/forgetpass")
//    public ResponseEntity<String> processForgotPassword(@RequestBody Map<String, String> requestBody) {
//        System.out.println("Received forgot password request"); // Log API call
//        String email = requestBody.get("email");
//        System.out.println("Email received: " + email);
//
//        UserDtls user = homeService.findUserByEmail(email);
//        if (user == null) {
//            System.out.println("No user found with the email: " + email);
//            return ResponseEntity.badRequest().body("No account found with the provided email.");
//        }
//
//        String resetToken = UUID.randomUUID().toString();
//        user.setResetToken(resetToken);
//        user.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
//        homeService.saveUser(user);
//
////        String resetLink = "http://localhost:8080/api/users/resetpassword?token=" + resetToken;
//        String resetLink = "http://localhost:5173/api/users/resetpassword?token=" + resetToken;
//        System.out.println("Generated reset link: " + resetLink);
//
//        emailService.sendEmail(user.getEmail(), "Password Reset Request",
//                "Click the link to reset your password: " + resetLink);
//
//        return ResponseEntity.ok("Password reset link has been sent to your email.");
//    }
//
//   
//
//    @GetMapping("/resetpassword")
//    public String showResetPasswordForm(@RequestParam(name = "token", required = false) String token, Model model) {
//        if (token == null || token.isEmpty()) {
//        	
//            return "Missing token. Please request a new password reset link.";
//
////            model.addAttribute("error", "Missing token. Please request a new password reset link.");
////            return "forgetpass"; // Redirects to forgot password page
//        }
//
//        UserDtls user = homeService.findUserByResetToken(token);
//        if (user == null || user.getTokenExpiry().isBefore(LocalDateTime.now())) {
//        	 return "Invalid or expired token.";
//        }
//
//        model.addAttribute("token", token);
//        return "Please provide your new password.";
//
//    }
//
//    @PostMapping("/resetpassword")
//    public String resetPassword(@RequestParam("token") String token,
//                                @RequestParam("newPassword") String newPassword,
//                                @RequestParam("confirmPassword") String confirmPassword,
//                                Model model) {
//        if (token == null || token.isEmpty()) {
//            model.addAttribute("error", "Missing token. Please request a new password reset link.");
//            return "forgetpass";
//        }
//
//        if (!newPassword.equals(confirmPassword)) {
//        	return "Passwords do not match.";
//        }
//        
//        validatePassword(newPassword);
//
//        UserDtls user = homeService.findUserByResetToken(token);
//        if (user == null || user.getTokenExpiry().isBefore(LocalDateTime.now()))
//        {
//        	return "Invalid or expired token.";
//        }
//
//        user.setPassword(bp.encode(newPassword));
//        user.setResetToken(null);
//        user.setTokenExpiry(null);
//        homeService.saveUser(user);
//
//        return "Password reset successfully. Please log in.";
//    }
//    
//    private void validatePassword(String password) {
//        String PASSWORD_PATTERN = "^[A-Z][a-zA-Z0-9@#$%^&+=]{7}$";
//
//        if (!Pattern.matches(PASSWORD_PATTERN, password)) {
//            throw new IllegalArgumentException(
//                "Password must start with an uppercase letter, be 8 characters long, and include letters, numbers, and special characters.");
//        }
//    }
//    
//    @ExceptionHandler(MissingServletRequestParameterException.class)
//    public ResponseEntity<String> handleMissingParams(MissingServletRequestParameterException ex) {
//        return ResponseEntity
//                .status(HttpStatus.BAD_REQUEST)
//                .body("Missing required parameter: " + ex.getParameterName());
//    }
//
//
//
//    @GetMapping("/registration")
//    public String showRegistrationForm(Model model) {
//        model.addAttribute("user", new UserDtls());
//        return "registration";
//    }
//
//    @PostMapping("/register")
//    public String registerUser(@RequestBody UserDtls user) {
//        try {
//            // Validate password
//            validatePassword(user.getPassword(), user.getConfirmpassword());
//            
//            // Encrypt password
//            user.setPassword(bp.encode(user.getPassword()));
//            
//            // Set default role
//            if (user.getRole() == null || user.getRole().isEmpty()) {
//                user.setRole("ROLE_USER");
//            }
//
//            repo.save(user);
//            return "User registered successfully";
//        } catch (ValidationException e) {
//            return "Validation Error: " + e.getMessage();
//        } catch (Exception e) {
//            return "Error: " + e.getMessage();
//        }
//    }
//
//    private void validatePassword(String password, String confirmPassword) {
//        // Check for null values
//        if (password == null || confirmPassword == null) {
//            throw new ValidationException("Password and Confirm Password cannot be null");
//        }
//
//        // Check if passwords match
//        if (!password.equals(confirmPassword)) {
//            throw new ValidationException("Password and Confirm Password do not match");
//        }
//
//        // Define password pattern
//        String PASSWORD_PATTERN = "^[A-Z][a-zA-Z0-9@#$%^&+=]{7}$";
//
//        // Validate password against pattern
//        if (!Pattern.matches(PASSWORD_PATTERN, password)) {
//            throw new ValidationException("Password must start with an uppercase letter, be 8 characters long, and include letters, numbers, and special characters.");
//        }
//    }
//    
//    @PostMapping("/activity")
//	public ResponseEntity<String> logActivity(@RequestBody String activity) {
//	    // Get the currently authenticated user
//	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//	    // Retrieve the email of the logged-in user
//	    String email = null;
//	    if (authentication != null && authentication.getPrincipal() instanceof UserDtls) {
//	        UserDtls userDetails = (UserDtls) authentication.getPrincipal();
//	        email = userDetails.getFullname(); // Assuming email is stored as username
//	    }
//
//	    if (email == null) {
//	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not logged in.");
//	    }
//
//	    // Log the activity with the user's email
//	    System.out.println("Activity for email: " + email);
//
//	    // Save to the database (Example: logging to console here)
//	    // Return a success response
//	    return ResponseEntity.ok("Activity logged successfully for email: " + email);
//	}
//
//}
//
//
///**
//
//    @GetMapping("/")
//    public String home() {
//        return "index";
//    }
//
//    @GetMapping("/login")
//    public String login() {
//        return "login";
//    }
//
//    @PostMapping("/register")
//    public String register(@ModelAttribute UserDtls u, HttpSession session, Model model) {
//        System.out.print(u);
//        
//        // Encrypt password before saving
//        u.setPassword(bp.encode(u.getPassword()));
//        
//        // Set a default role if not already set
//        if (u.getRole() == null || u.getRole().isEmpty()) {
//            u.setRole("ROLE_USER");
//        }
//
//        repo.save(u);
//        session.setAttribute("message", "User Registered Successfully");
//
//        model.addAttribute("message", session.getAttribute("message"));
//        session.removeAttribute("message"); // Optionally clear it
//
//        return "redirect:/";
//    }
//   
//}
//**/

// package com.example.prog.controller;

// import com.example.prog.config.CorsConfig;
// import com.example.prog.eamilservice.EmailsenderService;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.service.HomeService;
// import com.example.prog.token.JwtUtil;

// import jakarta.servlet.http.HttpSession;

// import java.time.LocalDateTime;
// import java.time.ZoneId;
// import java.util.Date;
// import java.util.Map;
// import java.util.UUID;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.ui.Model;
// import org.springframework.web.bind.MissingServletRequestParameterException;
// import org.springframework.web.bind.annotation.*;

// import jakarta.validation.ValidationException;
// import java.util.regex.Pattern;

// //@CrossOrigin(origins = "http://localhost:5173")
// //@CrossOrigin(origins = "#{corsConfig.frontendUrl}")
// @RestController
// @RequestMapping("/api/users")
// public class UserController {
	
// 	 @Value("${frontend.url}") // Inject frontend URL
// 	 private String frontendUrl;

	
// 	  @Autowired
// 	    private CorsConfig corsConfig;

//     @Autowired
//     private UserRepository repo;
    
//     @Autowired
//     private EmailsenderService emailService;

//     @Autowired
//     private BCryptPasswordEncoder bp;
    
//     @Autowired
//     private HomeService homeService;
    
//     @GetMapping("/")
//     public String home() {
//         return "index"; // Redirects to home page
//     }
    
//     @GetMapping("/StockMarketBasics")
//     public String home1() {
//         return "StockMarketBasics"; // Redirects StockMarketBasics page
//     }
    
//     @GetMapping("/investmentStrat")
//     public String home2() {
//         return "investmentStrat"; // Redirects investmentStrat page
//     }
    
//     @GetMapping("/TechnicalAnalysis")
//     public String home3() {
//         return "TechnicalAnalysis"; // Redirects TechnicalAnalysis page
//     }

//     @GetMapping("/login")
//     public String login() {
//         return "login"; // Returns login view
//     }

//     @PostMapping("/login")
//     public String processLogin(@ModelAttribute UserDtls user, HttpSession session, Model model) {
//         UserDtls existingUser = homeService.findUserByEmail(user.getEmail());

//         if (existingUser == null) {
//             model.addAttribute("popupMessage", "User not found. Please register first.");
//             return "redirect:/registration";
//         }

//         if (bp.matches(user.getPassword(), existingUser.getPassword())) {
//             session.setAttribute("currentUser", existingUser);
//             return "redirect:/home";
//         }

//         model.addAttribute("error", "Invalid email or password");
//         return "login";
//     }

//     @GetMapping("/home")
//     public String showHomePage() {
//         return "home";
//     }

// //  @CrossOrigin(origins = "http://localhost:5173")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     @PostMapping("/forgetpass")
//     public ResponseEntity<String> processForgotPassword(@RequestBody Map<String, String> requestBody) {
//         System.out.println("Received forgot password request"); // Log API call
//         String email = requestBody.get("email");
//         System.out.println("Email received: " + email);

//         UserDtls user = homeService.findUserByEmail(email);
//         if (user == null) {
//             System.out.println("No user found with the email: " + email);
//             return ResponseEntity.badRequest().body("No account found with the provided email.");
//         }

//         String resetToken = UUID.randomUUID().toString();
//         user.setResetToken(resetToken);
//         user.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
//         homeService.saveUser(user);

//         // String resetLink = "https://cmda.aycanalytics.com/IndividualResetPassword?token=" + resetToken;
//         String resetLink = "http://147.93.107.167:5177/IndividualResetPassword?token=" + resetToken;

//         System.out.println("Generated reset link: " + resetLink);

//         emailService.sendEmail(user.getEmail(), "Password Reset Request",
//                 "Click the link to reset your password: " + resetLink);

//         return ResponseEntity.ok("Password reset link has been sent to your email.");
//     }

   

    
//     @GetMapping("/resetpassword")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     public String showResetPasswordForm(@RequestParam(name = "token", required = false) String token, Model model) {
//         if (token == null || token.isEmpty()) {
        	
//             return "Missing token. Please request a new password reset link.";

// //            model.addAttribute("error", "Missing token. Please request a new password reset link.");
// //            return "forgetpass"; // Redirects to forgot password page
//         }

//         UserDtls user = homeService.findUserByResetToken(token);
//         if (user == null || user.getTokenExpiry().isBefore(LocalDateTime.now())) {
//         	 return "Invalid or expired token.";
//         }

//         model.addAttribute("token", token);
//         return "Please provide your new password.";

//     }

    
//     @PostMapping("/resetpassword")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
//     public String resetPassword(@RequestParam("token") String token,
//                                 @RequestParam("newPassword") String newPassword,
//                                 @RequestParam("confirmPassword") String confirmPassword) {
        
//         // Fetch user by token
//         UserDtls user = homeService.findUserByResetToken(token);
        
//         if (user == null || user.getTokenExpiry().isBefore(LocalDateTime.now())) {
//             return "Invalid or expired token.";
//         }

//         if (!newPassword.equals(confirmPassword)) {
//             return "Passwords do not match.";
//         }

//         validatePassword(newPassword);

//         // Encrypt and update password
//         user.setPassword(bp.encode(newPassword));
        
//         // Clear reset token fields
//         user.setResetToken(null);
//         user.setTokenExpiry(null);
//         homeService.saveUser(user);

//         return "Password reset successfully. Please log in.";
//     }

    
//     private void validatePassword(String password) {
//         String PASSWORD_PATTERN = "^[A-Z][a-zA-Z0-9@#$%^&+=]{7}$";

//         if (!Pattern.matches(PASSWORD_PATTERN, password)) {
//             throw new IllegalArgumentException(
//                 "Password must start with an uppercase letter, be 8 characters long, and include letters, numbers, and special characters.");
//         }
//     }
    
//     @ExceptionHandler(MissingServletRequestParameterException.class)
//     public ResponseEntity<String> handleMissingParams(MissingServletRequestParameterException ex) {
//         return ResponseEntity
//                 .status(HttpStatus.BAD_REQUEST)
//                 .body("Missing required parameter: " + ex.getParameterName());
//     }



//     @GetMapping("/registration")
//     public String showRegistrationForm(Model model) {
//         model.addAttribute("user", new UserDtls());
//         return "registration";
//     }

//     @PostMapping("/register")
//     public String registerUser(@RequestBody UserDtls user) {
//         try {
//             // Validate password
//             validatePassword(user.getPassword(), user.getConfirmpassword());
            
//             // Encrypt password
//             user.setPassword(bp.encode(user.getPassword()));
            
//             // Set default role
//             if (user.getRole() == null || user.getRole().isEmpty()) {
//                 user.setRole("ROLE_USER");
//             }

//             repo.save(user);
//             return "User registered successfully";
//         } catch (ValidationException e) {
//             return "Validation Error: " + e.getMessage();
//         } catch (Exception e) {
//             return "Error: " + e.getMessage();
//         }
//     }

//     private void validatePassword(String password, String confirmPassword) {
//         // Check for null values
//         if (password == null || confirmPassword == null) {
//             throw new ValidationException("Password and Confirm Password cannot be null");
//         }

//         // Check if passwords match
//         if (!password.equals(confirmPassword)) {
//             throw new ValidationException("Password and Confirm Password do not match");
//         }

//         // Define password pattern
//         String PASSWORD_PATTERN = "^[A-Z][a-zA-Z0-9@#$%^&+=]{7}$";

//         // Validate password against pattern
//         if (!Pattern.matches(PASSWORD_PATTERN, password)) {
//             throw new ValidationException("Password must start with an uppercase letter, be 8 characters long, and include letters, numbers, and special characters.");
//         }
//     }
    
//     @PostMapping("/activity")
//     @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
// 	public ResponseEntity<String> logActivity(@RequestBody String activity) {
// 	    // Get the currently authenticated user
// 	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

// 	    // Retrieve the email of the logged-in user
// 	    String email = null;
// 	    if (authentication != null && authentication.getPrincipal() instanceof UserDtls) {
// 	        UserDtls userDetails = (UserDtls) authentication.getPrincipal();
// 	        email = userDetails.getFullname(); // Assuming email is stored as username
// 	    }

// 	    if (email == null) {
// 	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not logged in.");
// 	    }

// 	    // Log the activity with the user's email
// 	    System.out.println("Activity for email: " + email);

// 	    // Save to the database (Example: logging to console here)
// 	    // Return a success response
// 	    return ResponseEntity.ok("Activity logged successfully for email: " + email);
// 	}

// }
//-------------------code without log no forget worrking-------//


package com.example.prog.controller;

import com.example.prog.config.CorsConfig;
import com.example.prog.eamilservice.EmailsenderService;
import com.example.prog.entity.UserDtls;
import com.example.prog.repository.UserRepository;
import com.example.prog.service.HomeService;
import com.example.prog.service.UserActivityService;
import com.example.prog.token.JwtUtil;

import jakarta.servlet.http.HttpSession;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.ValidationException;
import java.util.regex.Pattern;

//@CrossOrigin(origins = "http://localhost:5173")
//@CrossOrigin(origins = "#{corsConfig.frontendUrl}")
@RestController
@RequestMapping("/api/users")
public class UserController {
	
	@Value("${frontend.url}") // Inject frontend URL
	private String frontendUrl;

	@Autowired
	private CorsConfig corsConfig;

	@Autowired
	private UserRepository repo;

	@Autowired
	private EmailsenderService emailService;

	@Autowired
	private BCryptPasswordEncoder bp;

	@Autowired
	private HomeService homeService;

	@Autowired
	private UserActivityService userActivityService; // Add UserActivityService

	// Method to log user activity
	private void logUserActivity(String email, String userType, String activityType) {
		if (email == null) {
			email = "UNKNOWN";
		}
		userActivityService.logUserActivity(email, userType, activityType);
	}



	// @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
	// @PostMapping("/forgetpass")
	// public ResponseEntity<String> processForgotPassword(@RequestBody Map<String, String> requestBody) {
	// 	System.out.println("Received forgot password request"); // Log API call
	// 	String email = requestBody.get("email");
	// 	System.out.println("Email received: " + email);

	// 	UserDtls user = homeService.findUserByEmail(email);
	// 	if (user == null) {
	// 		System.out.println("No user found with the email: " + email);
	// 		logUserActivity(email, "INDIVIDUAL", "FORGOT_PASSWORD_FAILED");
	// 		return ResponseEntity.badRequest().body("No account found with the provided email.");
	// 	}

	// 	String resetToken = UUID.randomUUID().toString();
	// 	user.setResetToken(resetToken);
	// 	user.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
	// 	homeService.saveUser(user);

	// 	String resetLink = "https://cmdahub.com/IndividualResetPassword?token=" + resetToken;

	// 	System.out.println("Generated reset link: " + resetLink);

	// 	emailService.sendEmail(user.getEmail(), "Password Reset Request",
	// 			"Click the link to reset your password: " + resetLink);

	// 	logUserActivity(email, "INDIVIDUAL", "FORGOT_PASSWORD_SUCCESS");
	// 	return ResponseEntity.ok("Password reset link has been sent to your email.");
	// }

	@PostMapping("/forgetpass")
    public ResponseEntity<String> processForgotPassword(@RequestBody Map<String, String> requestBody) {
        System.out.println("Received forgot password request"); // Log API call
        String email = requestBody.get("email");
        System.out.println("Email received: " + email);

        UserDtls user = homeService.findUserByEmail(email);
        if (user == null) {
            System.out.println("No user found with the email: " + email);
            logUserActivity(email, "INDIVIDUAL", "FORGOT_PASSWORD_FAILED");
            return ResponseEntity.badRequest().body("No account found with the provided email.");
        }

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
        homeService.saveUser(user);

        // Get the frontend URLs from CorsConfig
        // String primaryResetLink = corsConfig.getFrontendUrl() + "IndividualResetPassword?token=" + resetToken;
        String alternateResetLink = corsConfig.getFrontendUrl() + "/IndividualResetPassword?token=" + resetToken;
        // System.out.println("Generated reset link (primary): " + primaryResetLink);
        System.out.println("Generated reset link (alternate): " + alternateResetLink);

        // Send email with both reset links
        String emailBody = "Click the following links to reset your password:\n" +
                        //   "Primary Link: " + primaryResetLink + "\n" +
                          "Reset Link: " + alternateResetLink;
        emailService.sendEmail(user.getEmail(), "Password Reset Request", emailBody);

        logUserActivity(email, "INDIVIDUAL", "FORGOT_PASSWORD_SUCCESS");
        return ResponseEntity.ok("Password reset link has been sent to your email.");
    }

	@GetMapping("/resetpassword")
	@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
	public String showResetPasswordForm(@RequestParam(name = "token", required = false) String token, Model model) {
		if (token == null || token.isEmpty()) {
			return "Missing token. Please request a new password reset link.";
		}

		UserDtls user = homeService.findUserByResetToken(token);
		if (user == null || user.getTokenExpiry().isBefore(LocalDateTime.now())) {
			return "Invalid or expired token.";
		}

		model.addAttribute("token", token);
		return "Please provide your new password.";
	}

@PostMapping("/resetpassword")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> requestBody) {
    logUserActivity(null, "INDIVIDUAL", "RESET_PASSWORD_ATTEMPT");

    String token = requestBody.get("token");
    String newPassword = requestBody.get("newPassword");
    String confirmPassword = requestBody.get("confirmPassword");

    if (token == null || newPassword == null || confirmPassword == null) {
        logUserActivity(null, "INDIVIDUAL", "RESET_PASSWORD_FAILED");
        return ResponseEntity.badRequest().body("Missing required parameters.");
    }

    UserDtls user = homeService.findUserByResetToken(token);

    if (user == null || user.getTokenExpiry().isBefore(LocalDateTime.now())) {
        logUserActivity(user != null ? user.getEmail() : null, "INDIVIDUAL", "RESET_PASSWORD_FAILED");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token.");
    }

    if (!newPassword.equals(confirmPassword)) {
        logUserActivity(user.getEmail(), "INDIVIDUAL", "RESET_PASSWORD_FAILED");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match.");
    }

    try {
        validatePassword(newPassword);

        String encodedPassword = bp.encode(newPassword);
        System.out.println("New encoded password before save: " + encodedPassword);
        user.setPassword(encodedPassword);

        user.setResetToken(null);
        user.setTokenExpiry(null);
        UserDtls savedUser = homeService.saveUser(user);
        System.out.println("Password saved for email: " + savedUser.getEmail() + ", hash: " + savedUser.getPassword());

        logUserActivity(savedUser.getEmail(), "INDIVIDUAL", "RESET_PASSWORD_SUCCESS");
        return ResponseEntity.ok("Password reset successfully. Please log in.");
    } catch (IllegalArgumentException e) {
        logUserActivity(user.getEmail(), "INDIVIDUAL", "RESET_PASSWORD_FAILED");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}

	private void validatePassword(String password) {
		String PASSWORD_PATTERN = "^[A-Z](?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

		if (!Pattern.matches(PASSWORD_PATTERN, password)) {
			throw new IllegalArgumentException(
					"Password must start with an uppercase letter, be at least 9 characters long, and include at least one lowercase letter, one number, and one special character (!@#$%&*?).");
		}
	}

	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<String> handleMissingParams(MissingServletRequestParameterException ex) {
		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body("Missing required parameter: " + ex.getParameterName());
	}

	
	private void validatePassword(String password, String confirmPassword) {
		// Check for null values
		if (password == null || confirmPassword == null) {
			throw new ValidationException("Password and Confirm Password cannot be null");
		}

		// Check if passwords match
		if (!password.equals(confirmPassword)) {
			throw new ValidationException("Password and Confirm Password do not match");
		}

		// Define password pattern
		String PASSWORD_PATTERN = "^[A-Z](?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

		// Validate password against pattern
		if (!Pattern.matches(PASSWORD_PATTERN, password)) {
			throw new ValidationException(
					"Password must start with an uppercase letter, be at least 9 characters long, and include at least one lowercase letter, one number, and one special character (!@#$%&*?).");
		}
	}

	@PostMapping("/activity")
	@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
	public ResponseEntity<String> logActivity(@RequestBody String activity) {
		// Get the currently authenticated user
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// Retrieve the email of the logged-in user
		String email = null;
		if (authentication != null && authentication.getPrincipal() instanceof UserDtls) {
			UserDtls userDetails = (UserDtls) authentication.getPrincipal();
			email = userDetails.getFullname(); // Assuming email is stored as username
		}

		if (email == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not logged in.");
		}

		// Log the activity with the user's email
		System.out.println("Activity for email: " + email);

		// Save to the database (Example: logging to console here)
		// Return a success response
		return ResponseEntity.ok("Activity logged successfully for email: " + email);
	}
}


