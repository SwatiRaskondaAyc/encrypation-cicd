// ```````````````````````````wc``````````````
// package com.example.prog.interceptor;

// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.userpoints.UserPoints;
// import com.example.prog.Enum.PointsCategory;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.userpoints.UserPointsRepository;
// import com.example.prog.service.userpoints.UserPointsSummaryService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Component;
// import com.example.prog.service.UserProfileService; // NEW SERVICE TO FETCH USER TYPE
// import java.util.Optional; 

// import java.time.LocalDateTime;

// @Component
// public class PointsTrackingInterceptor {
    
//     @Autowired
//     private UserPointsRepository userPointsRepository;
    
//     @Autowired
//     private UserPointsSummaryService userPointsSummaryService;

//     @Autowired
//     private CorporateUserRepository corporateUserRepository;
//     @Autowired
//     private UserRepository userRepository;


//     @Autowired
//     private UserProfileService userProfileService; // NEW SERVICE TO FETCH USER TYPE

//     // For tutorial ratings with exact points
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
            
//             UserPoints saved = userPointsRepository.save(userPoints);
//             System.out.println("DEBUG: Points saved to user_points table. ID: " + saved.getId());
            
//             // Also update summary - FIXED: Added userType parameter
//             String userType = "individual"; // You need to fetch this from user service
//             userPointsSummaryService.calculateAndUpdateUserPoints(userId.intValue(), userType);
            
//         } catch (Exception e) {
//             System.err.println("ERROR: Failed to save tutorial points: " + e.getMessage());
//             e.printStackTrace();
//         }
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
//     // For equity ratings
//     public void trackEquityRating(Long userId, Integer ratingValue, String plotType, String plotName) {
//         System.out.println("DEBUG: Tracking equity rating - User: " + userId + ", Plot: " + plotType);
        
//         try {
//             UserPoints userPoints = new UserPoints();
//             userPoints.setUserId(userId);
//             userPoints.setCategory(PointsCategory.EQUITY_RATING);
//             userPoints.setPointsEarned(calculateEquityPoints(ratingValue, plotType));
//             userPoints.setActivityDescription("Rated equity plot: " + plotName + " (" + plotType + ")");
//             userPoints.setReferenceId("EQUITY_" + plotType.toUpperCase());
//             userPoints.setEarnedAt(LocalDateTime.now());
            
//             UserPoints saved = userPointsRepository.save(userPoints);
//             System.out.println("DEBUG: Points saved to user_points table. ID: " + saved.getId());
            
//             // Also update summary - FIXED: Added userType parameter
//             String userType = "individual"; // You need to fetch this from user service
//             userPointsSummaryService.calculateAndUpdateUserPoints(userId.intValue(), userType);
            
//         } catch (Exception e) {
//             System.err.println("ERROR: Failed to save equity points: " + e.getMessage());
//             e.printStackTrace();
//         }
//     }

//     // For portfolio ratings
//     public void trackPortfolioRating(Long userId, Integer ratingValue, String plotType, String portfolioName) {
//         System.out.println("DEBUG: Tracking portfolio rating - User: " + userId + ", Plot: " + plotType);
        
//         try {
//             UserPoints userPoints = new UserPoints();
//             userPoints.setUserId(userId);
//             userPoints.setCategory(PointsCategory.PORTFOLIO_RATING);
//             userPoints.setPointsEarned(calculatePortfolioPoints(ratingValue, plotType));
//             userPoints.setActivityDescription("Rated portfolio: " + portfolioName + " (" + plotType + ")");
//             userPoints.setReferenceId("PORTFOLIO_" + plotType.toUpperCase());
//             userPoints.setEarnedAt(LocalDateTime.now());
            
//             UserPoints saved = userPointsRepository.save(userPoints);
//             System.out.println("DEBUG: Points saved to user_points table. ID: " + saved.getId());
            
//             // Also update summary - FIXED: Added userType parameter
//             String userType = "individual"; // You need to fetch this from user service
//             userPointsSummaryService.calculateAndUpdateUserPoints(userId.intValue(), userType);
            
//         } catch (Exception e) {
//             System.err.println("ERROR: Failed to save portfolio points: " + e.getMessage());
//             e.printStackTrace();
//         }
//     }

//     // REMOVE THIS DUPLICATE METHOD - It's already in PointsTrackingService
//     // public void trackNewRating(Long userId, PointsCategory category, Integer ratingValue, String entityName, String plotType) {
//     //     // Remove this duplicate method
//     // }

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
    
//     // ADD THESE MISSING METHODS:
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
    
//     private int calculateTutorialPoints(Integer ratingValue) {
//         return ratingValue * 20;
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


package com.example.prog.interceptor;

import com.example.prog.entity.userpoints.UserPoints;
import com.example.prog.Enum.PointsCategory;
import com.example.prog.repository.userpoints.UserPointsRepository;
import com.example.prog.service.userpoints.UserPointsSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PointsTrackingInterceptor {
    
    @Autowired
    private UserPointsRepository userPointsRepository;
    
    @Autowired
    private UserPointsSummaryService userPointsSummaryService;

    /**
     * AUTO-UPDATE: Track tutorial ratings with automatic summary update
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
            
            UserPoints saved = userPointsRepository.save(userPoints);
            System.out.println("DEBUG: Points saved to user_points table. ID: " + saved.getId());
            
            // AUTO-UPDATE: Automatically update summary
            updateUserPointsSummary(userId.intValue());
            
        } catch (Exception e) {
            System.err.println("ERROR: Failed to save tutorial points: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * AUTO-UPDATE: Track equity ratings with automatic summary update
     */
    public void trackEquityRating(Long userId, Integer ratingValue, String plotType, String plotName) {
        System.out.println("DEBUG: Tracking equity rating - User: " + userId + ", Plot: " + plotType);
        
        try {
            UserPoints userPoints = new UserPoints();
            userPoints.setUserId(userId);
            userPoints.setCategory(PointsCategory.EQUITY_RATING);
            userPoints.setPointsEarned(calculateEquityPoints(ratingValue, plotType));
            userPoints.setActivityDescription("Rated equity plot: " + plotName + " (" + plotType + ")");
            userPoints.setReferenceId("EQUITY_" + plotType.toUpperCase());
            userPoints.setEarnedAt(LocalDateTime.now());
            
            UserPoints saved = userPointsRepository.save(userPoints);
            System.out.println("DEBUG: Points saved to user_points table. ID: " + saved.getId());
            
            // AUTO-UPDATE: Automatically update summary
            updateUserPointsSummary(userId.intValue());
            
        } catch (Exception e) {
            System.err.println("ERROR: Failed to save equity points: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * AUTO-UPDATE: Track portfolio ratings with automatic summary update
     */
    public void trackPortfolioRating(Long userId, Integer ratingValue, String plotType, String portfolioName) {
        System.out.println("DEBUG: Tracking portfolio rating - User: " + userId + ", Plot: " + plotType);
        
        try {
            UserPoints userPoints = new UserPoints();
            userPoints.setUserId(userId);
            userPoints.setCategory(PointsCategory.PORTFOLIO_RATING);
            userPoints.setPointsEarned(calculatePortfolioPoints(ratingValue, plotType));
            userPoints.setActivityDescription("Rated portfolio: " + portfolioName + " (" + plotType + ")");
            userPoints.setReferenceId("PORTFOLIO_" + plotType.toUpperCase());
            userPoints.setEarnedAt(LocalDateTime.now());
            
            UserPoints saved = userPointsRepository.save(userPoints);
            System.out.println("DEBUG: Points saved to user_points table. ID: " + saved.getId());
            
            // AUTO-UPDATE: Automatically update summary
            updateUserPointsSummary(userId.intValue());
            
        } catch (Exception e) {
            System.err.println("ERROR: Failed to save portfolio points: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * AUTO-UPDATE: Internal method to update user points summary
     */
    private void updateUserPointsSummary(Integer userId) {
        try {
            String userType = getUserTypeFromUserId(userId);
            userPointsSummaryService.calculateAndUpdateUserPoints(userId, userType);
        } catch (Exception e) {
            System.err.println("ERROR: Failed to auto-update user points summary for user " + userId + ": " + e.getMessage());
            // Don't throw exception - log and continue
        }
    }

    /**
     * AUTO-UPDATE: Get user type (implement properly based on your user service)
     */
    private String getUserTypeFromUserId(Integer userId) {
        // This should call your user service to get actual user type
        return "individual";
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
    
    // Additional calculation methods
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
    
    private int calculateTutorialPoints(Integer ratingValue) {
        return ratingValue * 20;
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