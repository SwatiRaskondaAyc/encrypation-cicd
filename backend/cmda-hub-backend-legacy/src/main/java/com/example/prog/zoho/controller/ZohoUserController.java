package com.example.prog.zoho.controller;

import com.example.prog.entity.ZohoUser;
import com.example.prog.service.TokenStoreService;
import com.example.prog.service.UserActivityService;
import com.example.prog.token.JwtUtil;
import com.example.prog.zoho.repository.ZohoUserRepo;
import com.example.prog.zoho.service.ZohoUserService;
import com.example.prog.zoho.serviceImpl.ZohoUserDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/oauth/zoho")
public class ZohoUserController {

    private static final Logger logger = LoggerFactory.getLogger(ZohoUserController.class);

    @Autowired
    private ZohoUserService zohoUserService;

    @Autowired
    private ZohoUserRepo zohoUserRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenStoreService tokenStoreService;

    @Autowired
    private UserActivityService userActivityService;

    @Value("${frontend.urll}")
    private String frontendUrl;

    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    @GetMapping("/zoho-callback")
    public ResponseEntity<?> handleZohoCallback(@RequestParam("code") String code) {
        try {
            ZohoUser user = zohoUserService.getAccessToken(code);
            String employeeData = zohoUserService.getEmployeeData(user.getZohoAccessToken());
            String email = zohoUserService.extractEmailFromZohoResponse(employeeData);
            String accountId = zohoUserService.extractAccountIdFromZohoResponse(employeeData);

            if (email == null) {
                logger.error("Failed to extract email from Zoho response");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Failed to extract email from Zoho response"));
            }

            ZohoUser existingUser = zohoUserService.findByMailId(email);
            String role = email.equalsIgnoreCase("admin@aycanalytics.com")
                    ? "ADMIN" : "EMPLOYEE";
            String permission;

            if (existingUser == null) {
                user.setMailId(email);
                user.setAccountId(accountId);
                user.setRole(role);
                user.setAuthProvider("ZOHO");
                user.setStatus("ACTIVE");
                user.setUpdatedAt(LocalDateTime.now());
                user.setPermission("REVOKED"); // Default permission
                zohoUserRepository.save(user);
                logger.info("Created new user with email: {}", email);
                permission = "REVOKED";
            } else {
                existingUser.setZohoAccessToken(user.getZohoAccessToken());
                existingUser.setRefreshToken(user.getRefreshToken());
                existingUser.setAccountId(accountId);
                existingUser.setTokenExpiry(user.getTokenExpiry());
                existingUser.setUpdatedAt(LocalDateTime.now());
                zohoUserRepository.save(existingUser);
                logger.info("Updated existing user with email: {}", email);
                role = existingUser.getRole();
                permission = existingUser.getPermission(); // Preserve existing permission                
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(email, role, Collections.singletonList(role));

            // Store token and log activity
            tokenStoreService.storeToken(role, email, token);
            userActivityService.logUserActivity(email, role, "ZOHO_LOGIN");

            // Redirect based on permission
            String redirectPath = "GRANTED".equals(permission)
                    ? "/home?token=" + token + "&role=" + role
                    : "/no-permission";

            URI redirectUri = URI.create(frontendUrl + redirectPath);
            logger.info("Redirecting {} to: {}", email, redirectUri);
            return ResponseEntity.status(HttpStatus.FOUND).location(redirectUri).build();

        } catch (Exception e) {
            logger.error("Error during Zoho authentication: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error during Zoho authentication", "error", e.getMessage()));
        }
    }
    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    @GetMapping("/employees")
    public ResponseEntity<?> getAllEmployees(@RequestHeader("Authorization") String token) {
        try {
            // Optionally validate token here
            return ResponseEntity.ok(zohoUserService.getAllEmployees());
        } catch (Exception e) {
            logger.error("Failed to retrieve employees: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve employees: " + e.getMessage());
        }
    }
    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    @PutMapping("/employee/{empId}/permission")
    public ResponseEntity<?> updateEmployeePermission(
            @RequestHeader("Authorization") String token,
            @PathVariable String empId,
            @RequestBody Map<String, String> body) {
        try {
            String permission = body.get("permission");
            ZohoUserDTO updatedUser = zohoUserService.updatePermission(empId, permission);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating permission: " + e.getMessage());
        }
    }
}
