//package com.example.prog.service;
//
//import com.example.prog.serviceimpl.CustomUserDetails;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.stereotype.Service;
//
//import java.util.concurrent.TimeUnit;
//
//@Service
//public class TokenStoreService {
//
//    private static final Logger logger = LoggerFactory.getLogger(TokenStoreService.class);
//
//    @Autowired
//    private RedisTemplate<String, Object> redisTemplate;
//
//    private static final String TOKEN_PREFIX = "jwt_token:";
//    private static final long TOKEN_TTL = 24; // Hours
//
//    public void storeToken(String token, CustomUserDetails userDetails) {
//        try {
//            redisTemplate.opsForValue().set(TOKEN_PREFIX + token, userDetails, TOKEN_TTL, TimeUnit.HOURS);
//            logger.debug("Stored token for user: {}", userDetails.getUsername());
//        } catch (Exception e) {
//            logger.error("Failed to store token in Redis for user: {}. Error: {}", userDetails.getUsername(), e.getMessage());
//            // Continue without throwing to allow login
//        }
//    }
//
//    public void removeToken(String token) {
//        try {
//            redisTemplate.delete(TOKEN_PREFIX + token);
//            logger.debug("Removed token: {}", token);
//        } catch (Exception e) {
//            logger.error("Failed to remove token from Redis: {}. Error: {}", token, e.getMessage());
//        }
//    }
//
//    public long countActiveUsersByType(String userType) {
//        try {
//            return redisTemplate.keys(TOKEN_PREFIX + "*").stream()
//                    .map(key -> (CustomUserDetails) redisTemplate.opsForValue().get(key))
//                    .filter(userDetails -> userDetails != null && userType.equals(userDetails.getUserType()))
//                    .count();
//        } catch (Exception e) {
//            logger.error("Failed to count active users for type: {}. Error: {}", userType, e.getMessage());
//            return 0;
//        }
//    }
//}

// package com.example.prog.service;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.redis.core.RedisTemplate;
// import org.springframework.stereotype.Service;

// import java.util.Set;
// import java.util.concurrent.TimeUnit;

// @Service
// public class TokenStoreService {

//     private static final Logger logger = LoggerFactory.getLogger(TokenStoreService.class);

//     @Autowired
//     private RedisTemplate<String, String> redisTemplate;


//      // Added a safe namespace prefix to avoid conflicts with other Redis users
//     private static final String REDIS_KEY_PREFIX = "cmda_log_user:";
//     private static final String TOKEN_PREFIX = REDIS_KEY_PREFIX + "token:";
//     // private static final String TOKEN_PREFIX = "token:";
//     private static final long TOKEN_TTL = 24; // Hours

//     public void storeToken(String userType, String email, String token) {
//         try {
//             String key = TOKEN_PREFIX + userType.toUpperCase() + ":" + email;
//             redisTemplate.opsForValue().set(key, token, TOKEN_TTL, TimeUnit.HOURS);
//             logger.debug("Stored token for user: {} with key: {}", email, key);
//         } catch (Exception e) {
//             logger.error("Failed to store token in Redis for user: {}. Error: {}", email, e.getMessage());
//             // Continue without throwing to allow login
//         }
//     }

//     public void removeToken(String userType, String email) {
//         try {
//             String key = TOKEN_PREFIX + userType.toUpperCase() + ":" + email;
//             redisTemplate.delete(key);
//             logger.debug("Removed token for user: {} with key: {}", email, key);
//         } catch (Exception e) {
//             logger.error("Failed to remove token from Redis for user: {}. Error: {}", email, e.getMessage());
//         }
//     }

//     public long countActiveUsersByType(String userType) {
//         try {
//             String pattern = TOKEN_PREFIX + userType.toUpperCase() + ":*";
//             Set<String> keys = redisTemplate.keys(pattern);
//             if (keys == null || keys.isEmpty()) {
//                 logger.debug("No keys found for pattern: {}", pattern);
//                 return 0L;
//             }
//             long count = keys.size();
//             logger.debug("Active users for type {}: {}", userType, count);
//             return count;
//         } catch (Exception e) {
//             logger.error("Failed to count active users for type: {}. Error: {}", userType, e.getMessage(), e);
//             return 0L;
//         }
//     }
// }


// package com.example.prog.service;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.redis.core.RedisTemplate;
// import org.springframework.data.redis.RedisConnectionFailureException;
// import org.springframework.stereotype.Service;
// import org.springframework.data.redis.connection.RedisConnectionFactory;
// import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
// import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
// import jakarta.annotation.PostConstruct;

// import java.util.Set;
// import java.util.concurrent.TimeUnit;


// @Service
// public class TokenStoreService {

//     private static final Logger logger = LoggerFactory.getLogger(TokenStoreService.class);

//     @Autowired
//     private RedisTemplate<String, String> redisTemplate;

//     @Autowired
//     private RedisConnectionFactory redisConnectionFactory;

//     private static final String REDIS_KEY_PREFIX = "cmda_log_user:";
//     private static final String TOKEN_PREFIX = REDIS_KEY_PREFIX + "token:";
//     private static final long TOKEN_TTL = 24; // Hours

//     @PostConstruct
//     public void logRedisConfig() {
//         if (redisConnectionFactory instanceof LettuceConnectionFactory) {
//             LettuceConnectionFactory lettuceFactory = (LettuceConnectionFactory) redisConnectionFactory;
//             RedisStandaloneConfiguration config = lettuceFactory.getStandaloneConfiguration();
//             logger.info("Redis Config - Host: {}, Port: {}, Database: {}, Timeout: {}",
//                         config.getHostName(), config.getPort(), config.getDatabase(), 
//                         lettuceFactory.getTimeout());
//         } else {
//             logger.info("Redis Connection Factory: {}", redisConnectionFactory.getClass().getName());
//         }
//     }

//     public void storeToken(String userType, String email, String token) {
//         try {
//             String key = TOKEN_PREFIX + userType.toUpperCase() + ":" + email;
//             redisTemplate.opsForValue().set(key, token, TOKEN_TTL, TimeUnit.HOURS);
//             logger.debug("Stored token for user: {} with key: {}", email, key);
//         } catch (RedisConnectionFailureException e) {
//             logger.error("Failed to store token in Redis for user: {}. Error: {}", email, e.getMessage(), e);
//         } catch (Exception e) {
//             logger.error("Unexpected error storing token in Redis for user: {}. Error: {}", email, e.getMessage(), e);
//         }
//     }

//     public void removeToken(String userType, String email) {
//         try {
//             String key = TOKEN_PREFIX + userType.toUpperCase() + ":" + email;
//             redisTemplate.delete(key);
//             logger.debug("Removed token for user: {} with key: {}", email, key);
//         } catch (Exception e) {
//             logger.error("Failed to remove token from Redis for user: {}. Error: {}", email, e.getMessage(), e);
//         }
//     }

//     public long countActiveUsersByType(String userType) {
//         try {
//             String pattern = TOKEN_PREFIX + userType.toUpperCase() + ":*";
//             Set<String> keys = redisTemplate.keys(pattern);
//             if (keys == null || keys.isEmpty()) {
//                 logger.debug("No keys found for pattern: {}", pattern);
//                 return 0L;
//             }
//             long count = keys.size();
//             logger.debug("Active users for type {}: {}", userType, count);
//             return count;
//         } catch (Exception e) {
//             logger.error("Failed to count active users for type: {}. Error: {}", userType, e.getMessage(), e);
//             return 0L;
//         }
//     }
// }
package com.example.prog.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import jakarta.annotation.PostConstruct;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
public class TokenStoreService {

    private static final Logger logger = LoggerFactory.getLogger(TokenStoreService.class);

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private RedisConnectionFactory redisConnectionFactory;

    private static final String REDIS_KEY_PREFIX = "cmda_log_user:";
    private static final String TOKEN_PREFIX = REDIS_KEY_PREFIX + "token:";
    private static final long TOKEN_TTL = 24; // Hours

    @PostConstruct
    public void logRedisConfig() {
        if (redisConnectionFactory instanceof LettuceConnectionFactory) {
            LettuceConnectionFactory lettuceFactory = (LettuceConnectionFactory) redisConnectionFactory;
            RedisStandaloneConfiguration config = lettuceFactory.getStandaloneConfiguration();
            logger.info("Redis Config - Host: {}, Port: {}, Database: {}, Timeout: {}",
                    config.getHostName(), config.getPort(), config.getDatabase(),
                    lettuceFactory.getTimeout());
        } else {
            logger.info("Redis Connection Factory: {}", redisConnectionFactory.getClass().getName());
        }
    }

    // Store token when a user logs in
    public void storeToken(String userType, String email, String token) {
        try {
            String key = TOKEN_PREFIX + userType.toUpperCase() + ":" + email;
            redisTemplate.opsForValue().set(key, token, TOKEN_TTL, TimeUnit.HOURS);
            logger.info("Token stored successfully for user: {} with key: {} and value: {}", email, key, token);
        } catch (RedisConnectionFailureException e) {
            logger.error("Failed to store token in Redis for user: {}. Error: {}", email, e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error storing token in Redis for user: {}. Error: {}", email, e.getMessage(), e);
        }
    }

    public void removeToken(String userType, String email) {
        try {
            String key = TOKEN_PREFIX + userType.toUpperCase() + ":" + email;
            redisTemplate.delete(key);
            logger.info("Token removed for user: {} with key: {}", email, key);
        } catch (Exception e) {
            logger.error("Failed to remove token from Redis for user: {}. Error: {}", email, e.getMessage(), e);
        }
    }

    /**
     * Retrieves a token from Redis for a given user type and email.
     * This method is crucial for validating if a token is still active in Redis.
     *
     * @param userType The type of user (e.g., "INDIVIDUAL", "CORPORATE").
     * @param email The email of the user.
     * @return The token string if found, otherwise null.
     */
    public String getToken(String userType, String email) {
        try {
            String key = TOKEN_PREFIX + userType.toUpperCase() + ":" + email;
            String token = redisTemplate.opsForValue().get(key);
            if (token != null) {
                logger.debug("Retrieved token for user: {} with key: {}", email, key);
            } else {
                logger.debug("No token found for user: {} with key: {}", email, key);
            }
            return token;
        } catch (RedisConnectionFailureException e) {
            logger.error("Failed to retrieve token from Redis for user: {}. Error: {}", email, e.getMessage(), e);
            return null;
        } catch (Exception e) {
            logger.error("Unexpected error retrieving token from Redis for user: {}. Error: {}", email, e.getMessage(), e);
            return null;
        }
    }

    public long countActiveUsersByType(String userType) {
        try {
            String pattern = TOKEN_PREFIX + userType.toUpperCase() + ":*";
            logger.debug("Searching keys with pattern: {}", pattern);
            Set<String> keys = redisTemplate.keys(pattern);
            if (keys == null || keys.isEmpty()) {
                logger.debug("No keys found for pattern: {}", pattern);
                return 0L;
            }
            long count = keys.size();
            logger.debug("Active users for type {}: {}", userType, count);
            return count;
        } catch (Exception e) {
            logger.error("Failed to count active users for type: {}. Error: {}", userType, e.getMessage(), e);
            return 0L;
        }
    }
}