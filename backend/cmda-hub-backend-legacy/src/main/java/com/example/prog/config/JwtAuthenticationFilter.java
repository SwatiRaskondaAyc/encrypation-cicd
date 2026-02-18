//main code//

// package com.example.prog.config;

// import com.example.prog.token.JwtUtil;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.CorporateUser;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.service.TokenStoreService;
// import com.example.prog.service.BlockIpService;
// import com.example.prog.service.ApiRequestLogService;
// import com.example.prog.service.ApiResponseLogService;
// import com.example.prog.dto.MonitoredEndpoint;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;
// import org.springframework.web.util.ContentCachingResponseWrapper;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.fasterxml.jackson.databind.JsonNode;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import java.io.IOException;
// import java.util.List;
// import java.util.stream.Collectors;

// import com.example.prog.repository.AdminUserRepository;

// @Component
// public class JwtAuthenticationFilter extends OncePerRequestFilter {

//     private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
//     private static final String[] EXCLUDED_PATHS = {"/api/management/admin/login", "/api/auth/login", "/login"};
//     private static final String[] NO_CACHE_PATHS = {"/api/file/upload"}; // Paths to skip response caching

//     @Autowired
//     private JwtUtil jwtUtil;

//     @Autowired
//     private UserRepository individualUserRepository;

//     @Autowired
//     private CorporateUserRepository corporateUserRepository;

//     @Autowired
//     private TokenStoreService tokenStoreService;

//     @Autowired
//     private BlockIpService blockIpService;

//     @Autowired
//     private ApiRequestLogService requestLogService;

//     @Autowired
//     private ApiResponseLogService responseLogService;

//     @Autowired
//     private ObjectMapper objectMapper;

//     @Autowired
//     private AdminUserRepository adminUserRepository;

//     @Override
//     protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//             throws ServletException, IOException {
//         logger.debug("Entering JwtAuthenticationFilter for request: {}", request.getRequestURI());

//         String path = request.getRequestURI();
//         String ip = request.getRemoteAddr();
//         boolean monitored = MonitoredEndpoint.shouldMonitor(path);
//         boolean cacheResponse = !isNoCachePath(path); // Determine if response caching should be skipped

//         // Wrap response only if caching is needed
//         HttpServletResponse responseToUse = response;
//         ContentCachingResponseWrapper wrappedResponse = null;
//         String originalContentType = response.getContentType();

//         if (cacheResponse) {
//             wrappedResponse = new ContentCachingResponseWrapper(response);
//             responseToUse = wrappedResponse;
//         }

//         // 1. IP Block Check
//         if (monitored && blockIpService.isBlocked(ip)) {
//             respondWithError(responseToUse, HttpServletResponse.SC_FORBIDDEN, "Access denied: IP temporarily blocked due to suspicious activity.", ip, path);
//             return;
//         }

//         // 2. Suspicious Request Detection
//         if (monitored && requestLogService.isSuspicious(request)) {
//             blockIpService.block(ip);
//             respondWithError(responseToUse, HttpServletResponse.SC_FORBIDDEN, "Request blocked due to suspicious activity.", ip, path);
//             return;
//         }

//         // 3. Check excluded paths
//         if (isExcludedPath(path)) {
//             logger.debug("Skipping JWT validation for excluded path: {}", path);
//             filterChain.doFilter(request, responseToUse);
//             if (cacheResponse && wrappedResponse != null) {
//                 logResponse(wrappedResponse, ip, path, monitored, originalContentType);
//                 wrappedResponse.copyBodyToResponse();
//             } else {
//                 logMinimalResponse(ip, path, response.getStatus(), monitored);
//             }
//             return;
//         }

//         // 4. Authentication Handling
//         String authHeader = request.getHeader("Authorization");
//         if (authHeader != null && authHeader.startsWith("Bearer ")) {
//             String jwt = authHeader.substring(7);
//             logger.debug("Found Bearer token for path: {}, token length: {}", path, jwt.length());
//             try {

//                     String email = jwtUtil.extractEmail(jwt);
//                     logger.debug("Extracted email from JWT: {}", email);

//                     if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

//                         // 1) Read roles first, decide ADMIN early
//                         List<String> roles = jwtUtil.extractRoles(jwt);
//                         boolean isAdmin = roles != null && roles.stream().anyMatch(r -> "ADMIN".equalsIgnoreCase(r));

//                         String userType = null;
//                         CorporateUser corporateUser = null;

//                         if (isAdmin) {
//                             userType = "ADMIN";
//                         } else {
//                             // Existing lookups for non-admins
//                             corporateUser = corporateUserRepository.findByemail(email);
//                             if (corporateUser != null) {
//                                 userType = "CORPORATE";
//                             } else {
//                                 UserDtls individualUser = individualUserRepository.findByEmail(email).orElse(null);
//                                 if (individualUser != null) {
//                                     userType = "INDIVIDUAL";
//                                 }
//                             }
//                         }

//                         if (userType == null) {
//                             logger.warn("User not found or type could not be determined for email: {}", email);
//                             respondWithError(responseToUse, HttpServletResponse.SC_UNAUTHORIZED, "User session invalid. Please log in again.", ip, path);
//                             return;
//                         }

//                         // 2) Validate token against Redis under the correct type (ADMIN/INDIVIDUAL/CORPORATE)
//                         String storedToken = tokenStoreService.getToken(userType.toUpperCase(), email);
//                         if (storedToken == null || !storedToken.equals(jwt)) {
//                             logger.warn("Attempt to use an invalid or logged-out token for email: {}. Stored token: {}, Provided token: {}",
//                                     email, storedToken != null ? "exists" : "null", jwt != null ? "exists" : "null");
//                             respondWithError(responseToUse, HttpServletResponse.SC_UNAUTHORIZED, "Session expired. Please log in again.", ip, path);
//                             return;
//                         }

//                         // 3) Check active status
//                         boolean userActive = false;
//                         if ("ADMIN".equals(userType)) {
//                             // If you keep admins in DB:
//                             var adminOpt = adminUserRepository.findByEmail(email);
//                             userActive = adminOpt.isPresent() && adminOpt.get().isActive();
//                             // If you don't persist admins, just do: userActive = true;
//                         } else if ("INDIVIDUAL".equals(userType)) {
//                             UserDtls user = individualUserRepository.findByEmail(email).orElse(null);
//                             userActive = (user != null && user.getStatus() == 1);
//                         } else if ("CORPORATE".equals(userType)) {
//                             userActive = (corporateUser != null); // add status check if you have one
//                         }

//                         if (!userActive) {
//                             logger.warn("User ({} type) not found or deactivated for email: {}", userType, email);
//                             respondWithError(responseToUse, HttpServletResponse.SC_UNAUTHORIZED, "User account inactive. Please contact support or log in again.", ip, path);
//                             return;
//                         }

//                         // 4) Build authorities and set security context
//                         if (roles == null || roles.isEmpty()) {
//                             logger.warn("No roles found in token for email: {}, defaulting to ADMIN", email);
//                             roles = List.of("ADMIN");
//                         }
//                         var authorities = roles.stream()
//                                 .map(r -> new SimpleGrantedAuthority("ROLE_" + r.toUpperCase()))
//                                 .collect(Collectors.toList());

//                         if (jwtUtil.validateToken(jwt, email)) {
//                             UsernamePasswordAuthenticationToken authToken =
//                                     new UsernamePasswordAuthenticationToken(email, null, authorities);
//                             authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                             SecurityContextHolder.getContext().setAuthentication(authToken);
//                             logger.debug("Security context set with principal: {}, authorities: {}", email, authorities);
//                         } else {
//                             logger.warn("JWT inherent validation failed for email: {}, token: {}", email, jwt);
//                             respondWithError(responseToUse, HttpServletResponse.SC_UNAUTHORIZED, "Invalid or inherently expired token. Please log in again.", ip, path);
//                             return;
//                         }
//                     }

//             } catch (Exception e) {
//                 logger.error("Token validation failed for path {}: {}", path, e.getMessage(), e);
//                 respondWithError(responseToUse, HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed: " + e.getMessage(), ip, path);
//                 return;
//             }
//         } else {
//             logger.warn("No Bearer token found in Authorization header for path: {}", path);
//         }

//         // 5. Continue filter chain
//         try {
//             filterChain.doFilter(request, responseToUse);
//         } catch (Exception e) {
//             logger.error("Error in filter chain for path {}: {}", path, e.getMessage(), e);
//             respondWithError(responseToUse, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error: " + e.getMessage(), ip, path);
//             return;
//         }

//         // 6. Log response
//         if (cacheResponse && wrappedResponse != null) {
//             logResponse(wrappedResponse, ip, path, monitored, originalContentType);
//             wrappedResponse.copyBodyToResponse();
//         } else {
//             logMinimalResponse(ip, path, response.getStatus(), monitored);
//         }
//     }

//     private boolean isExcludedPath(String path) {
//         for (String excludedPath : EXCLUDED_PATHS) {
//             if (path.equals(excludedPath)) {
//                 return true;
//             }
//         }
//         return false;
//     }

//     private boolean isNoCachePath(String path) {
//         for (String noCachePath : NO_CACHE_PATHS) {
//             if (path.startsWith(noCachePath)) {
//                 return true;
//             }
//         }
//         return false;
//     }

//     private void respondWithError(HttpServletResponse response, int status, String message, String ip, String path) throws IOException {
//         response.setStatus(status);
//         response.setContentType("application/json");
//         response.getWriter().write("{\"error\": \"" + message + "\"}");
//         responseLogService.log(ip, path, status, message);
//     }

//     private void logResponse(ContentCachingResponseWrapper wrappedResponse, String ip, String path, boolean monitored, String originalContentType) {
//         if (!monitored) {
//             return;
//         }
//         try {
//             int status = wrappedResponse.getStatus();
//             String responseBody = wrappedResponse.getContentAsByteArray().length > 0
//                     ? new String(wrappedResponse.getContentAsByteArray(), wrappedResponse.getCharacterEncoding())
//                     : "";
//             String message = extractMessage(responseBody, originalContentType);

//             responseLogService.log(ip, path, status, message);

//             // Restore original content type if changed
//             if (originalContentType != null && !originalContentType.equals(wrappedResponse.getContentType())) {
//                 wrappedResponse.setContentType(originalContentType);
//             }
//         } catch (Exception e) {
//             logger.warn("Failed to log response for path {}: {}", path, e.getMessage());
//         }
//     }

//     private void logMinimalResponse(String ip, String path, int status, boolean monitored) {
//         if (!monitored) {
//             return;
//         }
//         try {
//             responseLogService.log(ip, path, status, "Response not cached due to large size or endpoint configuration");
//         } catch (Exception e) {
//             logger.warn("Failed to log minimal response for path {}: {}", path, e.getMessage());
//         }
//     }

//     private String extractMessage(String body, String contentType) {
//         if (body.isEmpty()) {
//             return "Empty response";
//         }
//         // Limit JSON parsing to small responses to avoid memory issues
//         if (contentType != null && contentType.contains("application/json") && body.length() < 10000) { // 10KB limit
//             try {
//                 JsonNode root = objectMapper.readTree(body);
//                 if (root.hasNonNull("error")) {
//                     return root.get("error").asText().trim();
//                 }
//                 if (root.hasNonNull("message")) {
//                     return root.get("message").asText().trim();
//                 }
//                 if (root.has("data")) {
//                     JsonNode data = root.get("data");
//                     if (data.hasNonNull("error")) {
//                         return data.get("error").asText().trim();
//                     }
//                     if (data.hasNonNull("message")) {
//                         return data.get("message").asText().trim();
//                     }
//                 }
//             } catch (Exception e) {
//                 logger.warn("Failed to parse JSON response body: {}", e.getMessage());
//             }
//         }
//         // Fallback for non-JSON or large responses
//         return body.length() > 200 ? body.substring(0, 200) + "..." : body;
//     }
// }

//main code//

package com.example.prog.config;

import com.example.prog.token.JwtUtil;
import com.example.prog.entity.UserDtls;
import com.example.prog.entity.CorporateUser;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.service.TokenStoreService;
import com.example.prog.service.BlockIpService;
// import com.example.prog.service.ApiRequestLogService;
// import com.example.prog.service.ApiResponseLogService;
import com.example.prog.dto.MonitoredEndpoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.util.AntPathMatcher; // Added import for AntPathMatcher

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import com.example.prog.repository.AdminUserRepository;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String[] EXCLUDED_PATHS = {
            "/api/management/admin/login",
            "/api/auth/login",
            "/api/auth/send-otp",
            "/api/auth/verify-otp",
            "/api/auth/individual/register",
            "/api/auth/corporate/register",
            "/login",
            "/api/auth/google/**"
    };
    private static final String[] NO_CACHE_PATHS = { "/api/file/upload" }; // Paths to skip response caching

    private final AntPathMatcher matcher = new AntPathMatcher(); // Added for accurate ant-style path matching

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository individualUserRepository;

    @Autowired
    private CorporateUserRepository corporateUserRepository;

    @Autowired
    private TokenStoreService tokenStoreService;

    @Autowired
    private BlockIpService blockIpService;

    // @Autowired
    // private ApiRequestLogService requestLogService;

    // @Autowired
    // private ApiResponseLogService responseLogService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        
        // Handle OPTIONS preflight requests immediately for CORS
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        logger.debug("Entering JwtAuthenticationFilter for request: {}", path);

        String ip = request.getRemoteAddr();
        boolean monitored = MonitoredEndpoint.shouldMonitor(path);
        boolean cacheResponse = !isNoCachePath(path);

        HttpServletResponse responseToUse = response;
        ContentCachingResponseWrapper wrappedResponse = null;
        String originalContentType = response.getContentType();

        if (cacheResponse) {
            wrappedResponse = new ContentCachingResponseWrapper(response);
            responseToUse = wrappedResponse;
        }

        // 1. IP Block Check
        if (monitored && blockIpService.isBlocked(ip)) {
            respondWithError(responseToUse, HttpServletResponse.SC_FORBIDDEN,
                    "Access denied: IP temporarily blocked due to suspicious activity.", ip, path);
            return;
        }

        // 2. Suspicious Request Detection
        // if (monitored && requestLogService.isSuspicious(request)) {
        // blockIpService.block(ip);
        // respondWithError(responseToUse, HttpServletResponse.SC_FORBIDDEN, "Request
        // blocked due to suspicious activity.", ip, path);
        // return;
        // }

        // 3. Check excluded paths
        if (isExcludedPath(path)) {
            logger.debug("Skipping JWT validation for excluded path: {}", path);
            filterChain.doFilter(request, responseToUse);
            if (cacheResponse && wrappedResponse != null) {
                logResponse(wrappedResponse, ip, path, monitored, originalContentType);
                wrappedResponse.copyBodyToResponse();
            } else {
                logMinimalResponse(ip, path, response.getStatus(), monitored);
            }
            return;
        }

        // 4. Authentication Handling
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            logger.debug("Found Bearer token for path: {}, token length: {}", path, jwt.length());
            try {
                String email = jwtUtil.extractEmail(jwt);
                logger.debug("Extracted email from JWT: {}", email);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                    List<String> roles = jwtUtil.extractRoles(jwt);
                    boolean isAdmin = roles != null && roles.stream().anyMatch(r -> "ADMIN".equalsIgnoreCase(r));

                    String userType = null;
                    CorporateUser corporateUser = null;

                    if (isAdmin) {
                        userType = "ADMIN";
                    } else {
                        corporateUser = corporateUserRepository.findByemail(email);
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
                        logger.warn("User not found or type could not be determined for email: {}", email);
                        respondWithError(responseToUse, HttpServletResponse.SC_UNAUTHORIZED,
                                "User session invalid. Please log in again.", ip, path);
                        return;
                    }

                    String storedToken = tokenStoreService.getToken(userType.toUpperCase(), email);
                    if (storedToken == null || !storedToken.equals(jwt)) {
                        logger.warn(
                                "Attempt to use an invalid or logged-out token for email: {}. Stored token: {}, Provided token: {}",
                                email, storedToken != null ? "exists" : "null", jwt != null ? "exists" : "null");
                        respondWithError(responseToUse, HttpServletResponse.SC_UNAUTHORIZED,
                                "Session expired. Please log in again.", ip, path);
                        return;
                    }

                    boolean userActive = false;
                    if ("ADMIN".equals(userType)) {
                        var adminOpt = adminUserRepository.findByEmail(email);
                        userActive = adminOpt.isPresent() && adminOpt.get().isActive();
                    } else if ("INDIVIDUAL".equals(userType)) {
                        UserDtls user = individualUserRepository.findByEmail(email).orElse(null);
                        userActive = (user != null && user.getStatus() == 1);
                    } else if ("CORPORATE".equals(userType)) {
                        userActive = (corporateUser != null); // add status check if you have one
                    }

                    if (!userActive) {
                        logger.warn("User ({} type) not found or deactivated for email: {}", userType, email);
                        respondWithError(responseToUse, HttpServletResponse.SC_UNAUTHORIZED,
                                "User account inactive. Please contact support or log in again.", ip, path);
                        return;
                    }

                    if (roles == null || roles.isEmpty()) {
                        logger.warn("No roles found in token for email: {}, defaulting to ADMIN", email);
                        roles = List.of("ADMIN");
                    }
                    var authorities = roles.stream()
                            .map(r -> new SimpleGrantedAuthority("ROLE_" + r.toUpperCase()))
                            .collect(Collectors.toList());

                    if (jwtUtil.validateToken(jwt, email)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email,
                                null, authorities);
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        logger.debug("Security context set with principal: {}, authorities: {}", email, authorities);
                    } else {
                        logger.warn("JWT inherent validation failed for email: {}, token: {}", email, jwt);
                        respondWithError(responseToUse, HttpServletResponse.SC_UNAUTHORIZED,
                                "Invalid or inherently expired token. Please log in again.", ip, path);
                        return;
                    }
                }
            } catch (Exception e) {
                logger.error("Token validation failed for path {}: {}", path, e.getMessage(), e);
                respondWithError(responseToUse, HttpServletResponse.SC_UNAUTHORIZED,
                        "Authentication failed: " + e.getMessage(), ip, path);
                return;
            }
        } else {
            logger.warn("No Bearer token found in Authorization header for path: {}", path);
        }

        // 5. Continue filter chain
        try {
            filterChain.doFilter(request, responseToUse);
        } catch (Exception e) {
            logger.error("Error in filter chain for path {}: {}", path, e.getMessage(), e);
            respondWithError(responseToUse, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Server error: " + e.getMessage(), ip, path);
            return;
        }

        // 6. Log response
        if (cacheResponse && wrappedResponse != null) {
            logResponse(wrappedResponse, ip, path, monitored, originalContentType);
            wrappedResponse.copyBodyToResponse();
        } else {
            logMinimalResponse(ip, path, response.getStatus(), monitored);
        }
    }

    private boolean isExcludedPath(String path) {
        for (String excludedPath : EXCLUDED_PATHS) {
            if (matcher.match(excludedPath, path)) { // Updated to use AntPathMatcher
                return true;
            }
        }
        return false;
    }

    private boolean isNoCachePath(String path) {
        for (String noCachePath : NO_CACHE_PATHS) {
            if (path.startsWith(noCachePath)) {
                return true;
            }
        }
        return false;
    }

    private void respondWithError(HttpServletResponse response, int status, String message, String ip, String path)
            throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
        // responseLogService.log(ip, path, status, message);
    }

    private void logResponse(ContentCachingResponseWrapper wrappedResponse, String ip, String path, boolean monitored,
            String originalContentType) {
        if (!monitored) {
            return;
        }
        try {
            int status = wrappedResponse.getStatus();
            String responseBody = wrappedResponse.getContentAsByteArray().length > 0
                    ? new String(wrappedResponse.getContentAsByteArray(), wrappedResponse.getCharacterEncoding())
                    : "";
            String message = extractMessage(responseBody, originalContentType);

            // responseLogService.log(ip, path, status, message);

            // Restore original content type if changed
            if (originalContentType != null && !originalContentType.equals(wrappedResponse.getContentType())) {
                wrappedResponse.setContentType(originalContentType);
            }
        } catch (Exception e) {
            logger.warn("Failed to log response for path {}: {}", path, e.getMessage());
        }
    }

    private void logMinimalResponse(String ip, String path, int status, boolean monitored) {
        if (!monitored) {
            return;
        }
        try {
            // responseLogService.log(ip, path, status, "Response not cached due to large
            // size or endpoint configuration");
        } catch (Exception e) {
            logger.warn("Failed to log minimal response for path {}: {}", path, e.getMessage());
        }
    }

    private String extractMessage(String body, String contentType) {
        if (body.isEmpty()) {
            return "Empty response";
        }
        // Limit JSON parsing to small responses to avoid memory issues
        if (contentType != null && contentType.contains("application/json") && body.length() < 10000) { // 10KB limit
            try {
                JsonNode root = objectMapper.readTree(body);
                if (root.hasNonNull("error")) {
                    return root.get("error").asText().trim();
                }
                if (root.hasNonNull("message")) {
                    return root.get("message").asText().trim();
                }
                if (root.has("data")) {
                    JsonNode data = root.get("data");
                    if (data.hasNonNull("error")) {
                        return data.get("error").asText().trim();
                    }
                    if (data.hasNonNull("message")) {
                        return data.get("message").asText().trim();
                    }
                }
            } catch (Exception e) {
                logger.warn("Failed to parse JSON response body: {}", e.getMessage());
            }
        }
        // Fallback for non-JSON or large responses
        return body.length() > 200 ? body.substring(0, 200) + "..." : body;
    }
}