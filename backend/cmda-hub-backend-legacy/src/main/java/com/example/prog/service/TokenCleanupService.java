// package com.example.prog.service;

// import java.time.Duration;
// import java.time.Instant;
// import java.util.Set;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.redis.core.RedisTemplate;
// import org.springframework.scheduling.annotation.Scheduled;
// import org.springframework.stereotype.Service;

// import com.example.prog.token.JwtUtil;

// @Service
// public class TokenCleanupService {
//     private static final Logger logger = LoggerFactory.getLogger(TokenCleanupService.class);

//     @Autowired
//     private RedisTemplate<String, String> redisTemplate;

//     @Autowired
//     private JwtUtil jwtUtil;

//     @Autowired
//     private UserActivityService userActivityService; // Add this

//     private static final String TOKEN_PREFIX = "token:";

//     @Scheduled(fixedRate = 60000)
//     public void cleanupInactiveTokens() {
//         logger.info("Starting token cleanup task at {}", Instant.now());
//         try {
//             Set<String> keys = redisTemplate.keys(TOKEN_PREFIX + "*");
//             if (keys == null || keys.isEmpty()) {
//                 logger.debug("No tokens found for cleanup.");
//                 return;
//             }

//             for (String key : keys) {
//                 String token = redisTemplate.opsForValue().get(key);
//                 if (token != null) {
//                     Instant tokenCreationTime = jwtUtil.getTokenCreationTime(token);
//                     if (tokenCreationTime != null) {
//                         Instant now = Instant.now();
//                         Duration inactivityDuration = Duration.between(tokenCreationTime, now);
//                         if (inactivityDuration.getSeconds() > 7200) {
//                             String email = key.replace(TOKEN_PREFIX, "").split(":")[1];
//                             String userType = key.replace(TOKEN_PREFIX, "").split(":")[0];
//                             redisTemplate.delete(key);
//                             userActivityService.logUserActivity(email, userType, userType + "_AUTO_LOGOUT");
//                             logger.info("Auto-removed inactive token for user: {}, userType: {}", email, userType);
//                         }
//                     } else {
//                         logger.warn("Invalid token creation time for key: {}", key);
//                     }
//                 }
//             }
//             logger.info("Completed token cleanup task at {}", Instant.now());
//         } catch (Exception e) {
//             logger.error("Error during token cleanup: {}", e.getMessage(), e);
//         }
//     }
// }

package com.example.prog.service;

import java.time.Duration;
import java.time.Instant;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.prog.token.JwtUtil;

@Service
public class TokenCleanupService {
    private static final Logger logger = LoggerFactory.getLogger(TokenCleanupService.class);

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserActivityService userActivityService;

    private static final String TOKEN_PREFIX = "cmda_log_user:token:"; // Updated to match TokenStoreService

    @Scheduled(fixedRate = 60000)
    public void cleanupInactiveTokens() {
        logger.info("Starting token cleanup task at {}", Instant.now());
        try {
            Set<String> keys = redisTemplate.keys(TOKEN_PREFIX + "*");
            if (keys == null || keys.isEmpty()) {
                logger.debug("No tokens found for cleanup.");
                return;
            }

            for (String key : keys) {
                String token = redisTemplate.opsForValue().get(key);
                if (token != null) {
                    Instant tokenCreationTime = jwtUtil.getTokenCreationTime(token);
                    if (tokenCreationTime != null) {
                        Instant now = Instant.now();
                        Duration inactivityDuration = Duration.between(tokenCreationTime, now);
                        if (inactivityDuration.getSeconds() > 3600*2) {
                            String email = key.replace(TOKEN_PREFIX, "").split(":")[1];
                            String userType = key.replace(TOKEN_PREFIX, "").split(":")[0];
                            redisTemplate.delete(key);
                            userActivityService.logUserActivity(email, userType, userType + "_AUTO_LOGOUT");
                            logger.info("Auto-removed inactive token for user: {}, userType: {}", email, userType);
                        }
                    } else {
                        logger.warn("Invalid token creation time for key: {}", key);
                    }
                }
            }
            logger.info("Completed token cleanup task at {}", Instant.now());
        } catch (Exception e) {
            logger.error("Error during token cleanup: {}", e.getMessage(), e);
        }
    }
}