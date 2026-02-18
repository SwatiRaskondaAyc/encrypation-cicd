//```````````````````````````wc``````````````````````````

// package com.example.prog.service.userpoints;

// import com.example.prog.entity.userpoints.UserPoints;
// import com.example.prog.Enum.PointsCategory;
// import com.example.prog.repository.userpoints.UserPointsRepository;
// import com.example.prog.service.UserProfileService;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.repository.UserRepository; // ADD THIS IMPORT
// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.UserDtls; // ADD THIS IMPORT
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.time.LocalDateTime;
// import java.util.Optional; // ADD THIS IMPORT

// @Service
// @Transactional
// public class PointsTrackingService {
    
//     @Autowired
//     private UserPointsRepository pointsRepository;
    
//     @Autowired
//     private UserPointsSummaryService userPointsSummaryService;

//     @Autowired
//     private UserProfileService userProfileService;

//     @Autowired
// private CorporateUserRepository corporateUserRepository;

//     @Autowired
//     private UserRepository userRepository; // ADD THIS

//     // Points calculation methods
//     private int calculateTutorialPoints(Integer ratingValue) {
//         return ratingValue * 20;
//     }
    
//     private int calculateEquityPoints(Integer ratingValue, String plotType) {
//         int basePoints = ratingValue * 15;
        
//         if (plotType.contains("breach") || plotType.contains("trend") || 
//             plotType.contains("fluctuations") || plotType.contains("heatmap")) {
//             basePoints += 5;
//         }
        
//         return basePoints;
//     }
    
//     private int calculatePortfolioPoints(Integer ratingValue, String plotType) {
//         int basePoints = ratingValue * 25;
        
//         if (plotType.contains("combined") || plotType.contains("swot") || 
//             plotType.contains("bubble") || plotType.contains("metrics") ||
//             plotType.contains("risk_return")) {
//             basePoints += 10;
//         }
        
//         return basePoints;
//     }
    
//     private String getUserTypeFromUserId(Integer userId) {
//     try {
//         // Method 1: Check UserDtls
//         Optional<UserDtls> userDtls = userRepository.findById(userId);
//         if (userDtls.isPresent()) {
//             return userDtls.get().getUserType() != null ? userDtls.get().getUserType() : "INDIVIDUAL";
//         }

//         // Method 2: Check CorporateUser
//         CorporateUser corporateUser = corporateUserRepository.findById(userId).orElse(null);
//         if (corporateUser != null) {
//             return "CORPORATE";
//         }

//         return "INDIVIDUAL";
//     } catch (Exception e) {
//         System.err.println("ERROR: Failed to fetch user type for user " + userId + ": " + e.getMessage());
//         return "INDIVIDUAL";
//     }
// }
//     // Track new ratings in real-time - FIXED: Added userType parameter
//     public void trackNewRating(Long userId, PointsCategory category, Integer ratingValue, String entityName, String plotType) {
//         System.out.println("DEBUG: trackNewRating called - User: " + userId + ", Category: " + category);
        
//         int points = calculatePoints(category, ratingValue, plotType);
//         String description = buildActivityDescription(category, entityName, plotType);
//         String referenceId = buildReferenceId(category, entityName);
        
//         UserPoints userPoints = new UserPoints(
//             userId, 
//             category, 
//             points, 
//             description,
//             referenceId
//         );
        
//         try {
//             UserPoints saved = pointsRepository.save(userPoints);
//             System.out.println("DEBUG: Points saved to user_points table. ID: " + saved.getId());
            
//             // AUTO-UPDATE: Fetch actual user type from database
//             try {
//                 String userType = getUserTypeFromUserId(userId.intValue()); // Fetch actual user type
//                 userPointsSummaryService.calculateAndUpdateUserPoints(userId.intValue(), userType);
//                 System.out.println("DEBUG: User points summary updated for user: " + userId + " with type: " + userType);
//             } catch (Exception e) {
//                 System.err.println("ERROR: Failed to update user points summary for user " + userId + ": " + e.getMessage());
//             }
            
//         } catch (Exception e) {
//             System.err.println("ERROR: Failed to save user points: " + e.getMessage());
//             e.printStackTrace();
//         }
//     }

    
//     // Add this method for tutorial ratings with exact points - FIXED: Added userType parameter
//     public void trackTutorialRatingWithPoints(Long userId, Integer ratingValue, String videoName, Integer earnedPoints) {
//         System.out.println("DEBUG: Tracking tutorial rating with exact points - User: " + userId + ", Video: " + videoName + ", Points: " + earnedPoints);
        
//         try {
//             UserPoints userPoints = new UserPoints();
//             userPoints.setUserId(userId);
//             userPoints.setCategory(PointsCategory.TUTORIAL_RATING);
//             userPoints.setPointsEarned(earnedPoints);
//             userPoints.setActivityDescription("Rated tutorial video: " + videoName);
//             userPoints.setReferenceId("TUTORIAL_" + videoName.replaceAll("\\s+", "_").toUpperCase());
//             userPoints.setEarnedAt(LocalDateTime.now());
            
//             UserPoints saved = pointsRepository.save(userPoints);
//             System.out.println("DEBUG: Points saved to user_points table. ID: " + saved.getId());
            
//             // Also update summary - FIXED: Use the method to get actual user type
//             String userType = getUserTypeFromUserId(userId.intValue());
//             userPointsSummaryService.calculateAndUpdateUserPoints(userId.intValue(), userType);
            
//         } catch (Exception e) {
//             System.err.println("ERROR: Failed to save tutorial points: " + e.getMessage());
//             e.printStackTrace();
//         }
//     }
    
//     private int calculatePoints(PointsCategory category, Integer ratingValue, String plotType) {
//         switch (category) {
//             case TUTORIAL_RATING:
//                 return calculateTutorialPoints(ratingValue);
//             case EQUITY_RATING:
//                 return calculateEquityPoints(ratingValue, plotType);
//             case PORTFOLIO_RATING:
//                 return calculatePortfolioPoints(ratingValue, plotType);
//             default:
//                 return ratingValue * 10;
//         }
//     }
    
//     private String buildActivityDescription(PointsCategory category, String entityName, String plotType) {
//         switch (category) {
//             case TUTORIAL_RATING:
//                 return "Rated tutorial video: " + entityName;
//             case EQUITY_RATING:
//                 return "Rated equity plot: " + entityName + " (" + plotType + ")";
//             case PORTFOLIO_RATING:
//                 return "Rated portfolio: " + entityName + " (" + plotType + ")";
//             default:
//                 return "Rated: " + entityName;
//         }
//     }
    
//     private String buildReferenceId(PointsCategory category, String entityName) {
//         return category.toString() + "_" + entityName.replaceAll("\\s+", "_").toUpperCase();
//     }
// }


package com.example.prog.service.userpoints;

import com.example.prog.entity.userpoints.UserPoints;
import com.example.prog.interceptor.PointsTrackingInterceptor;
import com.example.prog.Enum.PointsCategory;
import com.example.prog.repository.userpoints.UserPointsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class PointsTrackingService {
    
    @Autowired
    private UserPointsRepository pointsRepository;
    
    @Autowired
    private UserPointsSummaryService userPointsSummaryService;

       @Autowired
    private PointsTrackingInterceptor pointsTrackingInterceptor;

    // Points calculation methods
    private int calculateTutorialPoints(Integer ratingValue) {
        return ratingValue * 20;
    }
    
    private int calculateEquityPoints(Integer ratingValue, String plotType) {
        int basePoints = ratingValue * 15;
        
        if (plotType.contains("breach") || plotType.contains("trend") || 
            plotType.contains("fluctuations") || plotType.contains("heatmap")) {
            basePoints += 5;
        }
        
        return basePoints;
    }
    
    private int calculatePortfolioPoints(Integer ratingValue, String plotType) {
        int basePoints = ratingValue * 25;
        
        if (plotType.contains("combined") || plotType.contains("swot") || 
            plotType.contains("bubble") || plotType.contains("metrics") ||
            plotType.contains("risk_return")) {
            basePoints += 10;
        }
        
        return basePoints;
    }
    
    /**
     * AUTO-UPDATE: Track new ratings and automatically update user summary
     */
    public void trackNewRating(Long userId, PointsCategory category, Integer ratingValue, String entityName, String plotType) {
        System.out.println("DEBUG: trackNewRating called - User: " + userId + ", Category: " + category);
        
        int points = calculatePoints(category, ratingValue, plotType);
        String description = buildActivityDescription(category, entityName, plotType);
        String referenceId = buildReferenceId(category, entityName);
        
        UserPoints userPoints = new UserPoints(
            userId, 
            category, 
            points, 
            description,
            referenceId
        );
        
        try {
            // Save individual points record
            UserPoints saved = pointsRepository.save(userPoints);
            System.out.println("DEBUG: Points saved to user_points table. ID: " + saved.getId());
            
            // AUTO-UPDATE: Automatically update user points summary
            updateUserPointsSummary(userId.intValue());
            System.out.println("DEBUG: User points summary auto-updated for user: " + userId);
            
        } catch (Exception e) {
            System.err.println("ERROR: Failed to save user points: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * AUTO-UPDATE: Track tutorial ratings with exact points
     */
    public void trackTutorialRatingWithPoints(Long userId, Integer ratingValue, String videoName, Integer earnedPoints) {
        System.out.println("DEBUG: Tracking tutorial rating with exact points - User: " + userId + ", Video: " + videoName + ", Points: " + earnedPoints);
        
        try {
            UserPoints userPoints = new UserPoints();
            userPoints.setUserId(userId);
            userPoints.setCategory(PointsCategory.TUTORIAL_RATING);
            userPoints.setPointsEarned(earnedPoints);
            userPoints.setActivityDescription("Rated tutorial video: " + videoName);
            userPoints.setReferenceId("TUTORIAL_" + videoName.replaceAll("\\s+", "_").toUpperCase());
            userPoints.setEarnedAt(LocalDateTime.now());
            
            // Save individual points record
            UserPoints saved = pointsRepository.save(userPoints);
            System.out.println("DEBUG: Points saved to user_points table. ID: " + saved.getId());
            
            // AUTO-UPDATE: Automatically update user points summary
            updateUserPointsSummary(userId.intValue());
            System.out.println("DEBUG: User points summary auto-updated for user: " + userId);
            
        } catch (Exception e) {
            System.err.println("ERROR: Failed to save tutorial points: " + e.getMessage());
            e.printStackTrace();
        }
    }

     public void trackTutorialRatingWithPoints(Long userId, String videoName, Integer earnedPoints) {
        // pointsTrackingInterceptor.trackTutorialRatingWithPoints(userId, videoName, earnedPoints);
    }
    /**
     * AUTO-UPDATE: Internal method to update user points summary
     */
    private void updateUserPointsSummary(Integer userId) {
        try {
            String userType = getUserTypeFromUserId(userId); // You need to implement this
            userPointsSummaryService.calculateAndUpdateUserPoints(userId, userType);
        } catch (Exception e) {
            System.err.println("ERROR: Failed to auto-update user points summary for user " + userId + ": " + e.getMessage());
            // Don't throw exception - log and continue
        }
    }

    /**
     * AUTO-UPDATE: Get user type (you need to implement this properly)
     */
    private String getUserTypeFromUserId(Integer userId) {
        // This should call your user service to get actual user type
        // For now, return default
        return "individual";
    }
    
    private int calculatePoints(PointsCategory category, Integer ratingValue, String plotType) {
        switch (category) {
            case TUTORIAL_RATING:
                return calculateTutorialPoints(ratingValue);
            case EQUITY_RATING:
                return calculateEquityPoints(ratingValue, plotType);
            case PORTFOLIO_RATING:
                return calculatePortfolioPoints(ratingValue, plotType);
            default:
                return ratingValue * 10;
        }
    }
    
    private String buildActivityDescription(PointsCategory category, String entityName, String plotType) {
        switch (category) {
            case TUTORIAL_RATING:
                return "Rated tutorial video: " + entityName;
            case EQUITY_RATING:
                return "Rated equity plot: " + entityName + " (" + plotType + ")";
            case PORTFOLIO_RATING:
                return "Rated portfolio: " + entityName + " (" + plotType + ")";
            default:
                return "Rated: " + entityName;
        }
    }
    
    private String buildReferenceId(PointsCategory category, String entityName) {
        return category.toString() + "_" + entityName.replaceAll("\\s+", "_").toUpperCase();
    }
}