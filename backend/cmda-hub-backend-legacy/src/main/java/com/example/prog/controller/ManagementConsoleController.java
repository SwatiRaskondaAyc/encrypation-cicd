
// package com.example.prog.controller;

// import com.example.prog.entity.AdminUser;
// import com.example.prog.entity.UserActivity;
// import com.example.prog.repository.AdminUserRepository;
// import com.example.prog.repository.mconsole.UserActivityRepository;
// import com.example.prog.service.ManagementConsoleService;
// import com.example.prog.service.TokenStoreService;
// import com.example.prog.service.UserActivityService;
// import com.example.prog.token.JwtUtil;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// // import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.web.bind.annotation.*;
// import com.example.prog.entity.ApiRequestLog;
// import com.example.prog.entity.ApiResponseLog;
// import com.example.prog.entity.BlockedIp;
// import com.example.prog.repository.ApiRequestLogRepository;
// import com.example.prog.repository.BlockedIpRepository;
// import com.example.prog.repository.ApiResponseLogRepository;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.CorporateUser;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.CorporateUserRepository;

// import java.time.LocalDateTime;
// import java.util.*;
// import java.util.stream.Collectors;

// @RestController
// @RequestMapping("/api/management")
// public class ManagementConsoleController {

//     @Value("${frontend.urll}")
//     private String frontendUrll;

//     @Autowired
//     private ManagementConsoleService managementConsoleService;

//     @Autowired
//     private AdminUserRepository adminUserRepository;

//     @Autowired
//     private BCryptPasswordEncoder passwordEncoder;

//     @Autowired
//     private UserActivityService userActivityService;

//     @Autowired
//     private JwtUtil jwtUtil;

//     @Autowired
//     private TokenStoreService tokenStoreService;

//     @Autowired
//     private UserActivityRepository userActivityRepository;

//     @Autowired
//     private ApiRequestLogRepository apiRequestLogRepository;

//     @Autowired
//     private BlockedIpRepository blockedIpRepository;

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private CorporateUserRepository corporateUserRepository;

//     private final ApiResponseLogRepository apiResponseLogRepository;

//     public ManagementConsoleController(ApiResponseLogRepository apiResponseLogRepository) {
//         this.apiResponseLogRepository = apiResponseLogRepository;
//     }

//     @GetMapping("/user-stats")
//     // @PreAuthorize("hasRole('ADMIN')")
//     @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
//     public ResponseEntity<Map<String, Object>> getUserStatistics() {
//         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//         String email = authentication != null && authentication.getPrincipal() instanceof String
//                 ? (String) authentication.getPrincipal()
//                 : "anonymousUser";
//         if ("anonymousUser".equals(email)) {
//             email = "admin@aycanalytics.com";
//         }
//         System.out.println("Authentication principal: " + (authentication != null ? authentication.getPrincipal() : "null"));
//         return ResponseEntity.ok(managementConsoleService.getUserStatistics());
//     }

//     @GetMapping("/store-token")
//     public ResponseEntity<String> storeTestToken(@RequestParam String userType, @RequestParam String email) {
//         tokenStoreService.storeToken(userType, email, "test-token-" + System.currentTimeMillis());
//         return ResponseEntity.ok("Token stored for " + email);
//     }

//     @GetMapping("/daily-visits")
//     // @PreAuthorize("hasRole('ADMIN')")
//     @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
//     public ResponseEntity<Map<String, Object>> getDailyUserVisits() {
//         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//         String email = authentication != null && authentication.getPrincipal() instanceof String
//                 ? (String) authentication.getPrincipal()
//                 : "anonymousUser";
//         if ("anonymousUser".equals(email)) {
//             email = "admin@aycanalytics.com";
//         }
//         System.out.println("Authentication principal: " + (authentication != null ? authentication.getPrincipal() : "null"));
//         return ResponseEntity.ok(managementConsoleService.getDailyUserVisits());
//     }

//     @PostMapping("/admin/login")
//     @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
//     public ResponseEntity<Map<String, String>> adminLogin(@RequestBody Map<String, String> loginRequest) {
//         System.out.println("Login attempt for email: " + loginRequest.get("email"));

//         String email = loginRequest.get("email");
//         String password = loginRequest.get("password");

//         if (email == null || password == null) {
//             return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
//         }

//         Optional<AdminUser> adminOpt = adminUserRepository.findByEmail(email);
//         if (adminOpt.isPresent()) {
//             AdminUser admin = adminOpt.get();
//             System.out.println("Admin user found: " + admin.getEmail());
//             if (!admin.isActive()) {
//                 userActivityService.logUserActivity(email, "ADMIN", "ADMIN_LOGIN");
//                 return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Account deactivated. Contact admin."));
//             }
//             if (passwordEncoder.matches(password, admin.getPasswordHash())) {
//                 String role = "ADMIN";
//                 String token = jwtUtil.generateToken(email, "ADMIN", Collections.singletonList(role));
//                 tokenStoreService.storeToken("ADMIN", email, token);
//                 userActivityService.logUserActivity(email, "ADMIN", "ADMIN_LOGIN");
//                 return ResponseEntity.ok(Map.of(
//                     "message", "Admin login successful",
//                     "token", token,
//                     "userType", "admin"
//                 ));
//             }
//             userActivityService.logUserActivity(email, "ADMIN", "ADMIN_LOGIN");
//             System.out.println("Admin user password mismatch.");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
//         }

//         userActivityService.logUserActivity(email, "ADMIN", "ADMIN_LOGIN");
//         System.out.println("Admin user not found.");
//         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
//     }

//     @PostMapping("/admin/setup")
//     @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
//     public ResponseEntity<Map<String, String>> setupAdmin(@RequestBody Map<String, String> setupRequest) {
//         String email = setupRequest.get("email");
//         String password = setupRequest.get("password");

//         if (email == null || password == null) {
//             return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
//         }

//         if (adminUserRepository.findByEmail(email).isPresent()) {
//             return ResponseEntity.badRequest().body(Map.of("message", "Admin already exists"));
//         }

//         AdminUser admin = new AdminUser();
//         admin.setEmail(email);
//         admin.setPasswordHash(passwordEncoder.encode(password));
//         adminUserRepository.save(admin);
//         return ResponseEntity.ok(Map.of("message", "Admin user created successfully"));
//     }

//     @GetMapping("/activity-logs")
//     // @PreAuthorize("hasRole('ADMIN')")
//     @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
//     public ResponseEntity<List<Map<String, Object>>> getActivityLogs() {
//         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//         String email = authentication != null && authentication.getPrincipal() instanceof String
//                 ? (String) authentication.getPrincipal()
//                 : "anonymousUser";
//         if ("anonymousUser".equals(email)) {
//             email = "admin@aycanalytics.com";
//         }
//         System.out.println("Authentication principal: " + (authentication != null ? authentication.getPrincipal() : "null"));

//         List<UserActivity> activities = userActivityRepository.findAll();
//         List<Map<String, Object>> activityLogs = activities.stream().map(activity -> {
//             Map<String, Object> log = new HashMap<>();
//             log.put("email", activity.getEmail());
//             log.put("activityType", activity.getActivityType());
//             log.put("activityTimestamp", activity.getActivityTimestamp());
//             log.put("userType", activity.getUserType());
//             return log;
//         }).toList();

//         return ResponseEntity.ok(activityLogs);
//     }

//     @GetMapping("/system-metrics")
//     // @PreAuthorize("hasRole('ADMIN')")
//     @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
//     public ResponseEntity<Map<String, Object>> getSystemMetrics() {
//         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//         String email = authentication != null && authentication.getPrincipal() instanceof String
//                 ? (String) authentication.getPrincipal()
//                 : "anonymousUser";
//         if ("anonymousUser".equals(email)) {
//             email = "admin@aycanalytics.com";
//         }
//         System.out.println("Authentication principal: " + (authentication != null ? authentication.getPrincipal() : "null"));

//         Map<String, Object> metrics = managementConsoleService.getSystemMetrics();
//         return ResponseEntity.ok(metrics);
//     }

//     @GetMapping("/api-request-logs")
//     public ResponseEntity<List<ApiRequestLog>> getAllApiRequestLogs() {
//         List<ApiRequestLog> logs = apiRequestLogRepository.findAll();
//         return ResponseEntity.ok(logs);
//     }

//     @GetMapping("/blocked-ips")
//     public ResponseEntity<List<BlockedIp>> getAllBlockedIps() {
//         List<BlockedIp> blockedIps = blockedIpRepository.findAll();
//         return ResponseEntity.ok(blockedIps);
//     }

//     @GetMapping("/response-logs")
//     public ResponseEntity<List<ApiResponseLog>> getAllResponseLogs() {
//         List<ApiResponseLog> responseLogs = apiResponseLogRepository.findAll();
//         return ResponseEntity.ok(responseLogs);
//     }

//     @GetMapping("/users")
//     // @PreAuthorize("hasRole('ADMIN')")
//     @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
//     public ResponseEntity<Map<String, List<Map<String, Object>>>> getAllUsers() {
//         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//         String email = authentication != null && authentication.getPrincipal() instanceof String
//                 ? (String) authentication.getPrincipal()
//                 : "anonymousUser";
//         if ("anonymousUser".equals(email)) {
//             email = "admin@aycanalytics.com";
//         }
//         System.out.println("Authentication principal: " + (authentication != null ? authentication.getPrincipal() : "null"));
//         userActivityService.logUserActivity(email, "ADMIN", "GET_ALL_USERS");

//         // Fetch corporate users
//         List<CorporateUser> corporateUsers = corporateUserRepository.findAll();
//         List<Map<String, Object>> corporateUsersList = corporateUsers.stream().map(user -> {
//             Map<String, Object> userMap = new HashMap<>();
//             userMap.put("id", user.getId());
//             userMap.put("email", user.getEmail());
//             userMap.put("companyName", user.getCompanyName());
//             userMap.put("createdAt", user.getCreatedAt());
//             userMap.put("updatedAt", user.getUpdatedAt());
//             userMap.put("status", user.getStatus());
//             userMap.put("userType", "corporate");
//             return userMap;
//         }).collect(Collectors.toList());

//         // Fetch individual users
//         List<UserDtls> individualUsers = userRepository.findAll();
//         List<Map<String, Object>> individualRegularUsersList = individualUsers.stream()
//                 .filter(user -> user.getGoogleUserID() == null || user.getGoogleUserID().isEmpty())
//                 .map(user -> {
//                     Map<String, Object> userMap = new HashMap<>();
//                     userMap.put("id", user.getUserID());
//                     userMap.put("email", user.getEmail());
//                     userMap.put("fullname", user.getFullname());
//                     userMap.put("profilePicture", user.getProfilePicture());
//                     userMap.put("createdAt", user.getCreatedAt());
//                     userMap.put("updatedAt", user.getUpdatedAt());
//                     userMap.put("status", user.getStatus());
//                     userMap.put("userType", "individual");
//                     return userMap;
//                 }).collect(Collectors.toList());

//         List<Map<String, Object>> individualGoogleUsersList = individualUsers.stream()
//                 .filter(user -> user.getGoogleUserID() != null && !user.getGoogleUserID().isEmpty())
//                 .map(user -> {
//                     Map<String, Object> userMap = new HashMap<>();
//                     userMap.put("id", user.getUserID());
//                     userMap.put("email", user.getEmail());
//                     userMap.put("fullname", user.getFullname());
//                     userMap.put("googleUserId", user.getGoogleUserID());
//                     userMap.put("profilePicture", user.getProfilePicture());
//                     userMap.put("createdAt", user.getCreatedAt());
//                     userMap.put("updatedAt", user.getUpdatedAt());
//                     userMap.put("status", user.getStatus());
//                     userMap.put("userType", "individual");
//                     return userMap;
//                 }).collect(Collectors.toList());

//         // Combine into response
//         Map<String, List<Map<String, Object>>> response = new HashMap<>();
//         response.put("corporateUsers", corporateUsersList);
//         response.put("individualRegularUsers", individualRegularUsersList);
//         response.put("individualGoogleUsers", individualGoogleUsersList);

//         return ResponseEntity.ok(response);
//     }
// }


package com.example.prog.controller;

import com.example.prog.entity.AdminUser;
import com.example.prog.entity.UserActivity;
import com.example.prog.entity.UserDtls;
import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.UserLoginActivity;
import com.example.prog.entity.ApiRequestLog;
import com.example.prog.entity.ApiResponseLog;
import com.example.prog.entity.BlockedIp;
import com.example.prog.repository.AdminUserRepository;
import com.example.prog.repository.mconsole.UserActivityRepository;
import com.example.prog.repository.ApiRequestLogRepository;
import com.example.prog.repository.BlockedIpRepository;
import com.example.prog.repository.ApiResponseLogRepository;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.service.ManagementConsoleService;
import com.example.prog.service.TokenStoreService;
import com.example.prog.service.UserActivityService;
// import com.example.prog.service.UserService;
import com.example.prog.service.UserLoginActivityService;
import com.example.prog.token.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/management")
public class ManagementConsoleController {

    @Value("${frontend.urll}")
    private String frontendUrll;

    @Autowired
    private ManagementConsoleService managementConsoleService;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UserActivityService userActivityService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenStoreService tokenStoreService;

    @Autowired
    private UserActivityRepository userActivityRepository;

    @Autowired
    private ApiRequestLogRepository apiRequestLogRepository;

    @Autowired
    private BlockedIpRepository blockedIpRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CorporateUserRepository corporateUserRepository;

    // @Autowired
    // private UserService userService;

    @Autowired
    private UserLoginActivityService loginActivityService;

    private final ApiResponseLogRepository apiResponseLogRepository;

    public ManagementConsoleController(ApiResponseLogRepository apiResponseLogRepository) {
        this.apiResponseLogRepository = apiResponseLogRepository;
    }

    @GetMapping("/user-stats")
    // @PreAuthorize("hasRole('ADMIN')")
    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    public ResponseEntity<Map<String, Object>> getUserStatistics() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication != null && authentication.getPrincipal() instanceof String
                ? (String) authentication.getPrincipal()
                : "anonymousUser";
        if ("anonymousUser".equals(email)) {
            email = "admin@aycanalytics.com";
        }
        System.out.println("Authentication principal: " + (authentication != null ? authentication.getPrincipal() : "null"));
        return ResponseEntity.ok(managementConsoleService.getUserStatistics());
    }

    @GetMapping("/store-token")
    public ResponseEntity<String> storeTestToken(@RequestParam String userType, @RequestParam String email) {
        tokenStoreService.storeToken(userType, email, "test-token-" + System.currentTimeMillis());
        return ResponseEntity.ok("Token stored for " + email);
    }

    @GetMapping("/daily-visits")
    // @PreAuthorize("hasRole('ADMIN')")
    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    public ResponseEntity<Map<String, Object>> getDailyUserVisits() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication != null && authentication.getPrincipal() instanceof String
                ? (String) authentication.getPrincipal()
                : "anonymousUser";
        if ("anonymousUser".equals(email)) {
            email = "admin@aycanalytics.com";
        }
        System.out.println("Authentication principal: " + (authentication != null ? authentication.getPrincipal() : "null"));
        return ResponseEntity.ok(managementConsoleService.getDailyUserVisits());
    }

    @PostMapping("/admin/login")
    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    public ResponseEntity<Map<String, String>> adminLogin(@RequestBody Map<String, String> loginRequest) {
        System.out.println("Login attempt for email: " + loginRequest.get("email"));

        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        Optional<AdminUser> adminOpt = adminUserRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            AdminUser admin = adminOpt.get();
            System.out.println("Admin user found: " + admin.getEmail());
            if (!admin.isActive()) {
                userActivityService.logUserActivity(email, "ADMIN", "ADMIN_LOGIN");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Account deactivated. Contact admin."));
            }
            if (passwordEncoder.matches(password, admin.getPasswordHash())) {
                String role = "ADMIN";
                String token = jwtUtil.generateToken(email, "ADMIN", Collections.singletonList(role));
                tokenStoreService.storeToken("ADMIN", email, token);
                userActivityService.logUserActivity(email, "ADMIN", "ADMIN_LOGIN");
                return ResponseEntity.ok(Map.of(
                    "message", "Admin login successful",
                    "token", token,
                    "userType", "admin"
                ));
            }
            userActivityService.logUserActivity(email, "ADMIN", "ADMIN_LOGIN");
            System.out.println("Admin user password mismatch.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }

        userActivityService.logUserActivity(email, "ADMIN", "ADMIN_LOGIN");
        System.out.println("Admin user not found.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
    }

    @PostMapping("/admin/setup")
    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    public ResponseEntity<Map<String, String>> setupAdmin(@RequestBody Map<String, String> setupRequest) {
        String email = setupRequest.get("email");
        String password = setupRequest.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        if (adminUserRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Admin already exists"));
        }

        AdminUser admin = new AdminUser();
        admin.setEmail(email);
        admin.setPasswordHash(passwordEncoder.encode(password));
        adminUserRepository.save(admin);
        return ResponseEntity.ok(Map.of("message", "Admin user created successfully"));
    }

    @GetMapping("/activity-logs")
    // @PreAuthorize("hasRole('ADMIN')")
    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    public ResponseEntity<List<Map<String, Object>>> getActivityLogs() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication != null && authentication.getPrincipal() instanceof String
                ? (String) authentication.getPrincipal()
                : "anonymousUser";
        if ("anonymousUser".equals(email)) {
            email = "admin@aycanalytics.com";
        }
        System.out.println("Authentication principal: " + (authentication != null ? authentication.getPrincipal() : "null"));

        List<UserActivity> activities = userActivityRepository.findAll();
        List<Map<String, Object>> activityLogs = activities.stream().map(activity -> {
            Map<String, Object> log = new HashMap<>();
            log.put("email", activity.getEmail());
            log.put("activityType", activity.getActivityType());
            log.put("activityTimestamp", activity.getActivityTimestamp());
            log.put("userType", activity.getUserType());
            return log;
        }).toList();

        return ResponseEntity.ok(activityLogs);
    }

    @GetMapping("/system-metrics")
    // @PreAuthorize("hasRole('ADMIN')")
    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    public ResponseEntity<Map<String, Object>> getSystemMetrics() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication != null && authentication.getPrincipal() instanceof String
                ? (String) authentication.getPrincipal()
                : "anonymousUser";
        if ("anonymousUser".equals(email)) {
            email = "admin@aycanalytics.com";
        }
        System.out.println("Authentication principal: " + (authentication != null ? authentication.getPrincipal() : "null"));

        Map<String, Object> metrics = managementConsoleService.getSystemMetrics();
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/api-request-logs")
    public ResponseEntity<List<ApiRequestLog>> getAllApiRequestLogs() {
        List<ApiRequestLog> logs = apiRequestLogRepository.findAll();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/blocked-ips")
    public ResponseEntity<List<BlockedIp>> getAllBlockedIps() {
        List<BlockedIp> blockedIps = blockedIpRepository.findAll();
        return ResponseEntity.ok(blockedIps);
    }

    @GetMapping("/response-logs")
    public ResponseEntity<List<ApiResponseLog>> getAllResponseLogs() {
        List<ApiResponseLog> responseLogs = apiResponseLogRepository.findAll();
        return ResponseEntity.ok(responseLogs);
    }

    @GetMapping("/users")
    // @PreAuthorize("hasRole('ADMIN')")
    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> getAllUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication != null && authentication.getPrincipal() instanceof String
                ? (String) authentication.getPrincipal()
                : "anonymousUser";
        if ("anonymousUser".equals(email)) {
            email = "admin@aycanalytics.com";
        }
        System.out.println("Authentication principal: " + (authentication != null ? authentication.getPrincipal() : "null"));
        userActivityService.logUserActivity(email, "ADMIN", "GET_ALL_USERS");

        // Fetch corporate users
        List<CorporateUser> corporateUsers = corporateUserRepository.findAll();
        List<Map<String, Object>> corporateUsersList = corporateUsers.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("email", user.getEmail());
            userMap.put("companyName", user.getCompanyName());
            userMap.put("createdAt", user.getCreatedAt());
            userMap.put("updatedAt", user.getUpdatedAt());
            userMap.put("status", user.getStatus());
            userMap.put("userType", "corporate");
            return userMap;
        }).collect(Collectors.toList());

        // Fetch individual users
        List<UserDtls> individualUsers = userRepository.findAll();
        List<Map<String, Object>> individualRegularUsersList = individualUsers.stream()
                .filter(user -> user.getGoogleUserID() == null || user.getGoogleUserID().isEmpty())
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getUserID());
                    userMap.put("email", user.getEmail());
                    userMap.put("fullname", user.getFullname());
                    userMap.put("profilePicture", user.getProfilePicture());
                    userMap.put("createdAt", user.getCreatedAt());
                    userMap.put("updatedAt", user.getUpdatedAt());
                    userMap.put("status", user.getStatus());
                    userMap.put("userType", "individual");
                    return userMap;
                }).collect(Collectors.toList());

        List<Map<String, Object>> individualGoogleUsersList = individualUsers.stream()
                .filter(user -> user.getGoogleUserID() != null && !user.getGoogleUserID().isEmpty())
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getUserID());
                    userMap.put("email", user.getEmail());
                    userMap.put("fullname", user.getFullname());
                    userMap.put("googleUserId", user.getGoogleUserID());
                    userMap.put("profilePicture", user.getProfilePicture());
                    userMap.put("createdAt", user.getCreatedAt());
                    userMap.put("updatedAt", user.getUpdatedAt());
                    userMap.put("status", user.getStatus());
                    userMap.put("userType", "individual");
                    return userMap;
                }).collect(Collectors.toList());

        // Combine into response
        Map<String, List<Map<String, Object>>> response = new HashMap<>();
        response.put("corporateUsers", corporateUsersList);
        response.put("individualRegularUsers", individualRegularUsersList);
        response.put("individualGoogleUsers", individualGoogleUsersList);

        return ResponseEntity.ok(response);
    }

    // NEW ENDPOINTS FOR USER LOGIN ACTIVITY

    @GetMapping("/users/{userId}/activities")
    // @PreAuthorize("hasRole('ADMIN')")
    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    public ResponseEntity<?> getUserActivities(@PathVariable int userId, @RequestParam String userType) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication != null && authentication.getPrincipal() instanceof String
                    ? (String) authentication.getPrincipal()
                    : "anonymousUser";
            if ("anonymousUser".equals(email)) {
                email = "admin@aycanalytics.com";
            }
            
            userActivityService.logUserActivity(email, "ADMIN", "GET_USER_ACTIVITIES");

            List<UserLoginActivity> activities = loginActivityService.getUserLoginHistory(userId, userType);
            
            List<Map<String, Object>> activityDTOs = activities.stream().map(activity -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", activity.getId());
                dto.put("loginAt", convertToDateArray(activity.getLoginAt()));
                dto.put("logoutAt", activity.getLogoutAt() != null ? convertToDateArray(activity.getLogoutAt()) : null);
                dto.put("sessionDurationSeconds", activity.getSessionDurationSeconds());
                dto.put("ipAddress", activity.getIpAddress());
                dto.put("userAgent", activity.getUserAgent());
                dto.put("loginStatus", activity.getLoginStatus());
                dto.put("deviceInfo", activity.getDeviceInfo());
                return dto;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(activityDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to fetch user activities: " + e.getMessage())
            );
        }
    }

    @GetMapping("/users/active-sessions")
    // @PreAuthorize("hasRole('ADMIN')")
    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    public ResponseEntity<?> getActiveSessions() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication != null && authentication.getPrincipal() instanceof String
                    ? (String) authentication.getPrincipal()
                    : "anonymousUser";
            if ("anonymousUser".equals(email)) {
                email = "admin@aycanalytics.com";
            }
            
            userActivityService.logUserActivity(email, "ADMIN", "GET_ACTIVE_SESSIONS");

            List<UserLoginActivity> activeSessions = loginActivityService.getActiveSessions();
            
            List<Map<String, Object>> sessionDTOs = activeSessions.stream().map(session -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", session.getId());
                 dto.put("userId", session.getUserId()); // Use getUserId() instead of getUser().getUserID()
                dto.put("userEmail", session.getUserEmail()); // Use getUserEmail() instead of getUser().getEmail()
                dto.put("userName", session.getUserName()); // Use getUserName() instead of getUser().getFullname()
                dto.put("userType", session.getUserType()); // Add userType from your entity
                dto.put("loginAt", convertToDateArray(session.getLoginAt()));
                dto.put("ipAddress", session.getIpAddress());
                dto.put("userAgent", session.getUserAgent());
                dto.put("deviceInfo", session.getDeviceInfo());
                return dto;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(sessionDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to fetch active sessions: " + e.getMessage())
            );
        }
    }

    @GetMapping("/users/{userId}/last-activity")
    // @PreAuthorize("hasRole('ADMIN')")
    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    public ResponseEntity<?> getLastUserActivity(@PathVariable int userId, @RequestParam String userType) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication != null && authentication.getPrincipal() instanceof String
                    ? (String) authentication.getPrincipal()
                    : "anonymousUser";
            if ("anonymousUser".equals(email)) {
                email = "admin@aycanalytics.com";
            }
            
            userActivityService.logUserActivity(email, "ADMIN", "GET_LAST_USER_ACTIVITY");

            Optional<UserLoginActivity> lastActivity = loginActivityService.getLastLoginActivity(userId,userType);
            
            if (lastActivity.isPresent()) {
                UserLoginActivity activity = lastActivity.get();
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", activity.getId());
                dto.put("loginAt", convertToDateArray(activity.getLoginAt()));
                dto.put("logoutAt", activity.getLogoutAt() != null ? convertToDateArray(activity.getLogoutAt()) : null);
                dto.put("sessionDurationSeconds", activity.getSessionDurationSeconds());
                dto.put("ipAddress", activity.getIpAddress());
                dto.put("userAgent", activity.getUserAgent());
                dto.put("loginStatus", activity.getLoginStatus());
                dto.put("deviceInfo", activity.getDeviceInfo());
                dto.put("isOnline", activity.getLogoutAt() == null);
                
                return ResponseEntity.ok(dto);
            } else {
                return ResponseEntity.ok(Map.of("message", "No activity found for user"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to fetch last user activity: " + e.getMessage())
            );
        }
    }

    // Helper method to convert LocalDateTime to array format for frontend
    private Integer[] convertToDateArray(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return new Integer[]{
            dateTime.getYear(),
            dateTime.getMonthValue(),
            dateTime.getDayOfMonth(),
            dateTime.getHour(),
            dateTime.getMinute(),
            dateTime.getSecond(),
            0
        };
    }

  @PostMapping("/users/batch-last-activities")
// @PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
public ResponseEntity<?> getBatchLastActivities(@RequestBody BatchActivityRequest request) {
    try {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication != null && authentication.getPrincipal() instanceof String
                ? (String) authentication.getPrincipal()
                : "anonymousUser";
        if ("anonymousUser".equals(email)) {
            email = "admin@aycanalytics.com";
        }
        
        userActivityService.logUserActivity(email, "ADMIN", "GET_BATCH_LAST_ACTIVITIES");

        List<Map<String, Object>> batchResults = new ArrayList<>();
        
        // Use parallel stream for better performance with many users
        List<BatchUserRequest> users = request.getUsers();
        
        users.parallelStream().forEach(userRequest -> {
            try {
                Optional<UserLoginActivity> lastActivity = loginActivityService.getLastLoginActivity(
                    userRequest.getUserId(), userRequest.getUserType());
                
                Map<String, Object> userActivity = new HashMap<>();
                userActivity.put("userId", userRequest.getUserId());
                
                if (lastActivity.isPresent()) {
                    UserLoginActivity activity = lastActivity.get();
                    userActivity.put("id", activity.getId());
                    userActivity.put("loginAt", convertToDateArray(activity.getLoginAt()));
                    userActivity.put("logoutAt", activity.getLogoutAt() != null ? convertToDateArray(activity.getLogoutAt()) : null);
                    userActivity.put("sessionDurationSeconds", activity.getSessionDurationSeconds());
                    userActivity.put("ipAddress", activity.getIpAddress());
                    userActivity.put("userAgent", activity.getUserAgent());
                    userActivity.put("loginStatus", activity.getLoginStatus());
                    userActivity.put("deviceInfo", activity.getDeviceInfo());
                    userActivity.put("isOnline", activity.getLogoutAt() == null);
                } else {
                    userActivity.put("message", "No activity found for user");
                }
                
                synchronized (batchResults) {
                    batchResults.add(userActivity);
                }
            } catch (Exception e) {
                // Log individual user failure but continue with others
                Map<String, Object> errorResult = new HashMap<>();
                errorResult.put("userId", userRequest.getUserId());
                errorResult.put("error", "Failed to fetch activity for user: " + e.getMessage());
                synchronized (batchResults) {
                    batchResults.add(errorResult);
                }
            }
        });

        return ResponseEntity.ok(batchResults);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(
            Map.of("message", "Failed to fetch batch activities: " + e.getMessage())
        );
    }
}

    @GetMapping("/users/login-report")
    // @PreAuthorize("hasRole('ADMIN')")
    @CrossOrigin(origins = "${frontend.urll}", allowCredentials = "true")
    public ResponseEntity<?> getLoginReport() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication != null && authentication.getPrincipal() instanceof String
                    ? (String) authentication.getPrincipal()
                    : "anonymousUser";
            if ("anonymousUser".equals(email)) {
                email = "admin@aycanalytics.com";
            }
            
            userActivityService.logUserActivity(email, "ADMIN", "GET_LOGIN_REPORT");

            List<UserLoginActivity> activities = loginActivityService.getAllLoginActivities();
            
            // Filter out console admins (only include CORPORATE and INDIVIDUAL)
            List<Map<String, Object>> reportDTOs = activities.stream()
                .filter(activity -> "CORPORATE".equals(activity.getUserType()) || "INDIVIDUAL".equals(activity.getUserType()))
                .map(activity -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", activity.getId());
                dto.put("userId", activity.getUserId());
                dto.put("userEmail", activity.getUserEmail());
                dto.put("userName", activity.getUserName());
                dto.put("userType", activity.getUserType());
                dto.put("loginAt", convertToDateArray(activity.getLoginAt()));
                dto.put("logoutAt", activity.getLogoutAt() != null ? convertToDateArray(activity.getLogoutAt()) : null);
                dto.put("sessionDurationSeconds", activity.getSessionDurationSeconds());
                dto.put("ipAddress", activity.getIpAddress());
                dto.put("userAgent", activity.getUserAgent());
                dto.put("loginStatus", activity.getLoginStatus());
                dto.put("deviceInfo", activity.getDeviceInfo());
                return dto;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(reportDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to fetch login report: " + e.getMessage())
            );
        }
    }

// Add these DTO classes
public static class BatchActivityRequest {
    private List<BatchUserRequest> users;
    
    public List<BatchUserRequest> getUsers() { return users; }
    public void setUsers(List<BatchUserRequest> users) { this.users = users; }
}

public static class BatchUserRequest {
    private int userId;
    private String userType;
    
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
}
}