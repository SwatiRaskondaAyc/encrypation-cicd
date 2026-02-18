

// package com.example.prog.service;

// import com.example.prog.entity.UserActivity;
// import com.example.prog.repository.mconsole.UserActivityRepository;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;

// import java.time.LocalDateTime;

// @Service
// public class UserActivityService {

//     @Autowired
//     private UserActivityRepository userActivityRepository;


//     // Debug flag to control console logging (can be injected via application.properties)
//     private static final boolean DEBUG = false; // Set to true for debugging, false for production

//     // Add Logger declaration
//     private static final Logger logger = LoggerFactory.getLogger(UserActivityService.class);

//     public void logUserActivity(String email, String userType, String activityType, boolean success) {
//         UserActivity activity = new UserActivity();
//         activity.setEmail(email != null ? email : "UNKNOWN");
//         activity.setUserType(userType != null ? userType : "UNKNOWN");
//         activity.setActivityType(activityType != null ? activityType + (success ? "_SUCCESS" : "_FAILED") : "UNKNOWN");
//         activity.setActivityTimestamp(LocalDateTime.now());

//         try {
//             userActivityRepository.save(activity);
//             if (DEBUG) {
//                 // Replace System.out.println with logger.debug
//                 logger.debug("Activity logged: email={}, userType={}, activityType={}", activity.getEmail(), activity.getUserType(), activity.getActivityType());
//             }
//         } catch (Exception e) {
//             // Replace System.err.println with logger.error
//             logger.error("Failed to log activity: email={}, userType={}, activityType={}, error={}", activity.getEmail(), activity.getUserType(), activity.getActivityType(), e.getMessage());
//             e.printStackTrace();
//         }
//     }

//     public void logUserActivity(String email, String userType, String activityType) {
//         logUserActivity(email, userType, activityType, true);
//     }
// }

//without platform count

package com.example.prog.service;

import com.example.prog.entity.UserActivity;
import com.example.prog.entity.TotalPlatformUsageCount;
import com.example.prog.repository.mconsole.UserActivityRepository;
import com.example.prog.repository.TotalPlatformUsageCountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserActivityService {

    @Autowired
    private UserActivityRepository userActivityRepository;

    @Autowired
    private TotalPlatformUsageCountRepository totalPlatformUsageCountRepository; // Added dependency

    // Debug flag to control console logging (can be injected via application.properties)
    private static final boolean DEBUG = true; // Set to true for debugging, false for production

    // Add Logger declaration
    private static final Logger logger = LoggerFactory.getLogger(UserActivityService.class);

    @Transactional
    public void logUserActivity(String email, String userType, String activityType, boolean success, String platform) {
        UserActivity activity = new UserActivity();
        activity.setEmail(email != null ? email : "UNKNOWN");
        activity.setUserType(userType != null ? userType : "UNKNOWN");
        String finalActivityType = activityType != null ? activityType : "UNKNOWN";
        if (activityType != null && activityType.equals("FILE_UPLOAD_SUCCESS") && platform != null && !platform.trim().isEmpty()) {
            finalActivityType = "FILE_UPLOAD_" + platform.replaceAll("\\s+", "") + (success ? "_SUCCESS" : "_FAILED");
        } else {
            finalActivityType = finalActivityType + (success ? "_SUCCESS" : "_FAILED");
        }
        activity.setActivityType(finalActivityType);
        activity.setActivityTimestamp(LocalDateTime.now());

        try {
            userActivityRepository.save(activity);
            if (activityType != null && activityType.startsWith("FILE_UPLOAD") && success && platform != null && !platform.trim().isEmpty()) {
                updateTotalPlatformCount(platform.replaceAll("\\s+", ""));
            }
            if (DEBUG) {
                logger.debug("Activity logged: email={}, userType={}, activityType={}", activity.getEmail(), activity.getUserType(), activity.getActivityType());
            }
        } catch (Exception e) {
            logger.error("Failed to log activity: email={}, userType={}, activityType={}, error={}", activity.getEmail(), activity.getUserType(), activity.getActivityType(), e.getMessage());
            e.printStackTrace();
        }
    }

    public void logUserActivity(String email, String userType, String activityType) {
        logUserActivity(email, userType, activityType, true, null);
    }

    @Transactional
    private void updateTotalPlatformCount(String platform) {
        if (platform == null || platform.trim().isEmpty()) {
            logger.warn("Invalid platform name: '{}'. Skipping total platform count update.", platform);
            return;
        }
        TotalPlatformUsageCount total = totalPlatformUsageCountRepository.findByPlatform(platform)
                .orElse(new TotalPlatformUsageCount(platform, 0));
        total.setTotalCount(total.getTotalCount() + 1);
        totalPlatformUsageCountRepository.save(total);
        if (DEBUG) {
            logger.debug("Updated total platform count: platform={}, count={}", platform, total.getTotalCount());
        }
    }

    public Map<String, Integer> getDailyPlatformCounts(LocalDate date) {
        List<Object[]> results = userActivityRepository.findPlatformCountsByDate(date);
        Map<String, Integer> platformCounts = new HashMap<>();
        for (Object[] result : results) {
            String activityType = (String) result[0];
            if (DEBUG) {
                logger.debug("Processing activityType: {}", activityType);
            }
            if (activityType != null && (activityType.matches("FILE_UPLOAD_SUCCESS_[A-Za-z0-9]+") || activityType.matches("FILE_UPLOAD_[A-Za-z0-9]+_SUCCESS"))) {
                String platform;
                if (activityType.startsWith("FILE_UPLOAD_SUCCESS_")) {
                    platform = activityType.substring("FILE_UPLOAD_SUCCESS_".length());
                } else {
                    platform = activityType.substring("FILE_UPLOAD_".length(), activityType.length() - "_SUCCESS".length());
                }
                // Explicitly exclude known non-platform values
                if (platform != null && !platform.trim().isEmpty() && 
                    !platform.equals("ATTEMPT") && !platform.equals("SUCCESS") && 
                    !platform.equals("FAILED") && !platform.equals("UNKNOWN")) {
                    Long count = (Long) result[1];
                    platformCounts.put(platform, count.intValue());
                    if (DEBUG) {
                        logger.debug("Added platform count: platform={}, count={}", platform, count.intValue());
                    }
                } else {
                    if (DEBUG) {
                        logger.debug("Skipped invalid platform: {}", platform);
                    }
                }
            }
        }
        if (DEBUG) {
            logger.debug("Daily platform counts for date {}: {}", date, platformCounts);
        }
        return platformCounts;
    }
}