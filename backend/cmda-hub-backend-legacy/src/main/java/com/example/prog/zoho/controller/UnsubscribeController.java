// package com.example.prog.zoho.controller;

// import com.example.prog.zoho.service.UnsubscribeService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @RequestMapping("/api")
// public class UnsubscribeController {
    
//     @Autowired
//     private UnsubscribeService unsubscribeService;
    
//     @GetMapping("/unsubscribe")
//     public ResponseEntity<?> unsubscribeUser(
//             @RequestParam String token,
//             @RequestParam String email) {
        
//         try {
//             boolean success = unsubscribeService.validateAndUnsubscribe(token, email);
            
//             if (success) {
//                 Map<String, Object> response = new HashMap<>();
//                 response.put("success", true);
//                 response.put("message", "You have been successfully unsubscribed from CMDA emails.");
//                 response.put("email", email);
                
//                 // Return HTML page for better user experience
//                 String htmlResponse = buildUnsubscribeSuccessPage(email);
//                 return ResponseEntity.ok().body(htmlResponse);
//             } else {
//                 Map<String, Object> response = new HashMap<>();
//                 response.put("success", false);
//                 response.put("message", "Invalid unsubscribe link. Please contact support.");
//                 return ResponseEntity.badRequest().body(response);
//             }
//         } catch (Exception e) {
//             Map<String, Object> response = new HashMap<>();
//             response.put("success", false);
//             response.put("message", "An error occurred while processing your request.");
//             return ResponseEntity.internalServerError().body(response);
//         }
//     }
    
//     @PostMapping("/unsubscribe/direct")
//     public ResponseEntity<?> unsubscribeDirect(@RequestBody Map<String, String> request) {
//         try {
//             String email = request.get("email");
//             if (email == null || email.trim().isEmpty()) {
//                 return ResponseEntity.badRequest().body("Email is required");
//             }
            
//             unsubscribeService.unsubscribe(email);
            
//             Map<String, Object> response = new HashMap<>();
//             response.put("success", true);
//             response.put("message", "Successfully unsubscribed " + email);
//             return ResponseEntity.ok(response);
            
//         } catch (Exception e) {
//             return ResponseEntity.internalServerError().body("Error processing unsubscribe request");
//         }
//     }
    
//     private String buildUnsubscribeSuccessPage(String email) {
//         return "<!DOCTYPE html>" +
//                "<html>" +
//                "<head>" +
//                "<meta charset='utf-8'>" +
//                "<meta name='viewport' content='width=device-width,initial-scale=1'>" +
//                "<title>Unsubscribe Successful - CMDA</title>" +
//                "<style>" +
//                "body { margin:0; padding:0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; }" +
//                ".container { background:white; padding:40px; border-radius:20px; box-shadow:0 20px 40px rgba(0,0,0,0.1); text-align:center; max-width:500px; }" +
//                ".success-icon { font-size:60px; margin-bottom:20px; }" +
//                "h1 { color:#1e293b; margin-bottom:15px; }" +
//                "p { color:#64748b; line-height:1.6; margin-bottom:20px; }" +
//                ".email { color:#667eea; font-weight:600; }" +
//                ".back-link { color:#667eea; text-decoration:none; font-weight:600; }" +
//                ".back-link:hover { text-decoration:underline; }" +
//                "</style>" +
//                "</head>" +
//                "<body>" +
//                "<div class='container'>" +
//                "<div class='success-icon'>✅</div>" +
//                "<h1>Unsubscribe Successful</h1>" +
//                "<p>You have been successfully unsubscribed from CMDA marketing emails.</p>" +
//                "<p>The email <span class='email'>" + email + "</span> will no longer receive promotional communications from us.</p>" +
//                "<p>You can still receive important account-related emails.</p>" +
//                "<p><a href='https://cmdahub.com' class='back-link'>← Back to CMDA</a></p>" +
//                "</div>" +
//                "</body>" +
//                "</html>";
//     }
// }

package com.example.prog.zoho.controller;

import com.example.prog.zoho.service.UnsubscribeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UnsubscribeController {
    
    @Autowired
    private UnsubscribeService unsubscribeService;
    
    @GetMapping("/unsubscribe")
    public ResponseEntity<?> unsubscribeUser(
            @RequestParam String token,
            @RequestParam String email) {
        
        try {
            boolean success = unsubscribeService.validateAndUnsubscribe(token, email);
            
            if (success) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "You have been successfully unsubscribed from CMDA emails.");
                response.put("email", email);
                
                // Return HTML page for better user experience
                String htmlResponse = buildUnsubscribeSuccessPage(email);
                return ResponseEntity.ok().body(htmlResponse);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Invalid unsubscribe link. Please contact support.");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "An error occurred while processing your request.");
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PostMapping("/unsubscribe/direct")
    public ResponseEntity<?> unsubscribeDirect(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            
            if (!unsubscribeService.userExists(email)) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            unsubscribeService.unsubscribe(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully unsubscribed " + email);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing unsubscribe request");
        }
    }
    
    @PostMapping("/subscribe/direct")
    public ResponseEntity<?> subscribeDirect(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            
            if (!unsubscribeService.userExists(email)) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            unsubscribeService.subscribe(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully subscribed " + email);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing subscribe request");
        }
    }
    
    @GetMapping("/subscribers/count")
    public ResponseEntity<?> getSubscriberCount() {
        try {
            long count = unsubscribeService.getActiveSubscriberCount();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error getting subscriber count");
        }
    }
    
    private String buildUnsubscribeSuccessPage(String email) {
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head>" +
               "<meta charset='utf-8'>" +
               "<meta name='viewport' content='width=device-width,initial-scale=1'>" +
               "<title>Unsubscribe Successful - CMDA</title>" +
               "<style>" +
               "body { margin:0; padding:0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; }" +
               ".container { background:white; padding:40px; border-radius:20px; box-shadow:0 20px 40px rgba(0,0,0,0.1); text-align:center; max-width:500px; }" +
               ".success-icon { font-size:60px; margin-bottom:20px; }" +
               "h1 { color:#1e293b; margin-bottom:15px; }" +
               "p { color:#64748b; line-height:1.6; margin-bottom:20px; }" +
               ".email { color:#667eea; font-weight:600; }" +
               ".back-link { color:#667eea; text-decoration:none; font-weight:600; }" +
               ".back-link:hover { text-decoration:underline; }" +
               ".resubscribe { margin-top:20px; padding-top:20px; border-top:1px solid #e2e8f0; }" +
               "</style>" +
               "</head>" +
               "<body>" +
               "<div class='container'>" +
               "<div class='success-icon'>✅</div>" +
               "<h1>Unsubscribe Successful</h1>" +
               "<p>You have been successfully unsubscribed from CMDA marketing emails.</p>" +
               "<p>The email <span class='email'>" + email + "</span> will no longer receive promotional communications from us.</p>" +
               "<p>You can still receive important account-related emails.</p>" +
               "<div class='resubscribe'>" +
               "<p style='font-size:14px; color:#64748b;'>Changed your mind?</p>" +
               "<p><a href='mailto:support@cmdahub.com?subject=Resubscribe to emails' class='back-link'>Contact support to resubscribe</a></p>" +
               "</div>" +
               "<p><a href='https://cmdahub.com' class='back-link'>← Back to CMDA</a></p>" +
               "</div>" +
               "</body>" +
               "</html>";
    }
}