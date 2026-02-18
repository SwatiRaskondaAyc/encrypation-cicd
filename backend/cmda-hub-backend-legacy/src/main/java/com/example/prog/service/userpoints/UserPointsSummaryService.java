// // package com.example.prog.service.userpoints;

// // import com.example.prog.entity.userpoints.UserPointsSummary;
// // import com.example.prog.repository.PlotRatingRepository;
// // import com.example.prog.repository.PortfolioRatingRepository;
// // import com.example.prog.repository.TutorialVideoRatingRepository;
// // import com.example.prog.repository.userpoints.UserPointsSummaryRepository;
// // import org.springframework.beans.factory.annotation.Autowired;
// // import org.springframework.scheduling.annotation.Scheduled;
// // import org.springframework.stereotype.Service;
// // import org.springframework.transaction.annotation.Transactional;

// // import java.util.HashMap;
// // import java.util.Map;
// // import java.util.Optional;

// // @Service
// // @Transactional
// // public class UserPointsAggregationService {

// //     @Autowired
// //     private PlotRatingRepository plotRatingRepository;

// //     @Autowired
// //     private PortfolioRatingRepository portfolioRatingRepository;

// //     @Autowired
// //     private TutorialVideoRatingRepository tutorialVideoRatingRepository;

// //     @Autowired
// //     private UserPointsSummaryRepository userPointsSummaryRepository;

// //     /**
// //      * Calculate and update points for a specific user
// //      */
// //     public UserPointsSummary calculateAndUpdateUserPoints(Integer userid) {
// //         // Calculate points from each category
// //         Integer equityPoints = calculateEquityPoints(userid);
// //         Integer portfolioPoints = calculatePortfolioPoints(userid);
// //         Integer tutorialPoints = calculateTutorialPoints(userid);
// //         Integer totalPoints = equityPoints + portfolioPoints + tutorialPoints;

// //         // Save or update in UserPointsSummary table
// //         Optional<UserPointsSummary> existingSummary = userPointsSummaryRepository.findByUserId(userid);

// //         UserPointsSummary userPointsSummary;
// //         if (existingSummary.isPresent()) {
// //             userPointsSummary = existingSummary.get();
// //             userPointsSummary.updatePoints(equityPoints, portfolioPoints, tutorialPoints);
// //         } else {
// //             userPointsSummary = new UserPointsSummary(userid, equityPoints, portfolioPoints, tutorialPoints);
// //         }

// //         return userPointsSummaryRepository.save(userPointsSummary);
// //     }

// //     /**
// //      * Get user points summary with categorized breakdown
// //      */
// //     public Map<String, Object> getUserPointsSummary(Integer userid) {
// //         Optional<UserPointsSummary> summaryOpt = userPointsSummaryRepository.findByUserId(userid);

// //         if (summaryOpt.isPresent()) {
// //             UserPointsSummary summary = summaryOpt.get();
// //             return buildSummaryResponse(summary);
// //         } else {
// //             // Calculate and create summary if doesn't exist
// //             UserPointsSummary newSummary = calculateAndUpdateUserPoints(userid);
// //             return buildSummaryResponse(newSummary);
// //         }
// //     }

// //     /**
// //      * Get all users points summary (for admin view)
// //      */
// //     public Map<String, Object> getAllUsersPointsSummary() {
// //         // This would typically be paginated in real implementation
// //         Map<String, Object> response = new HashMap<>();

// //         // Get total points across all users
// //         Integer totalPointsAllUsers = userPointsSummaryRepository.getTotalPointsAcrossAllUsers();

// //         response.put("totalUsers", userPointsSummaryRepository.count());
// //         response.put("totalPointsAllUsers", totalPointsAllUsers);
// //         response.put("userSummaries", userPointsSummaryRepository.findAll());

// //         return response;
// //     }

// //     /**
// //      * Scheduled job to recalculate all user points (runs daily at 2 AM)
// //      */
// //     @Scheduled(cron = "0 0 2 * * ?") // Daily at 2 AM
// //     public void recalculateAllUserPoints() {
// //         // Get all unique user IDs from all rating tables
// //         // This is a simplified version - you might want to get unique users from your user table
// //         System.out.println("Starting scheduled points recalculation...");

// //         // In a real implementation, you would get all user IDs from your user table
// //         // For now, this is a placeholder for the scheduled job
// //     }

// //     /**
// //      * Manual trigger to recalculate points for all users
// //      */
// //     public void recalculateAllUsersPoints() {
// //         // This would iterate through all users and recalculate their points
// //         // Implementation depends on how you get all user IDs
// //         System.out.println("Manual points recalculation triggered");
// //     }

// //     private Integer calculateEquityPoints(Integer userid) {
// //         Integer points = plotRatingRepository.sumEarnedPointsByUserId(userid);
// //         return points != null ? points : 0;
// //     }

// //     private Integer calculatePortfolioPoints(Integer userid) {
// //         Integer points = portfolioRatingRepository.sumEarnedPointsByUserId(userid);
// //         return points != null ? points : 0;
// //     }

// //     private Integer calculateTutorialPoints(Integer userid) {
// //         Integer points = tutorialVideoRatingRepository.sumEarnedPointsByUserId(userid);
// //         return points != null ? points : 0;
// //     }

// //     private Map<String, Object> buildSummaryResponse(UserPointsSummary summary) {
// //         Map<String, Object> response = new HashMap<>();

// //         response.put("summaryId", summary.getId());
// //         response.put("userid", summary.getUserId());
// //         response.put("totalPoints", summary.getTotalPoints());
// //         response.put("breakdown", Map.of(
// //             "equity", Map.of(
// //                 "points", summary.getEquityPoints(),
// //                 "category", "Equity Plots",
// //                 "description", "Points earned from rating equity analysis plots"
// //             ),
// //             "portfolio", Map.of(
// //                 "points", summary.getPortfolioPoints(),
// //                 "category", "Portfolio Analysis", 
// //                 "description", "Points earned from rating portfolio management plots"
// //             ),
// //             "tutorial", Map.of(
// //                 "points", summary.getTutorialPoints(),
// //                 "category", "Tutorial Videos",
// //                 "description", "Points earned from rating tutorial videos"
// //             )
// //         ));
// //         response.put("lastUpdated", summary.getUpdatedAt());

// //         return response;
// //     }
// // }

// // package com.example.prog.service.userpoints;

// // import com.example.prog.dto.userpoints.UserPointsSummaryDTO;
// // import com.example.prog.entity.userpoints.UserPointsSummary;
// // import com.example.prog.repository.userpoints.UserPointsSummaryRepository;
// // import com.example.prog.repository.PlotRatingRepository;
// // import com.example.prog.repository.PortfolioRatingRepository;
// // import com.example.prog.repository.TutorialVideoRatingRepository;
// // import org.springframework.beans.factory.annotation.Autowired;
// // import org.springframework.stereotype.Service;
// // import org.springframework.transaction.annotation.Transactional;

// // import java.util.HashMap;
// // import java.util.List;
// // import java.util.Map;
// // import java.util.Optional;
// // import java.util.stream.Collectors;

// // @Service
// // @Transactional
// // public class UserPointsSummaryService {

// //     @Autowired
// //     private UserPointsSummaryRepository userPointsSummaryRepository;

// //     @Autowired
// //     private PlotRatingRepository plotRatingRepository;

// //     @Autowired
// //     private PortfolioRatingRepository portfolioRatingRepository;

// //     @Autowired
// //     private TutorialVideoRatingRepository tutorialVideoRatingRepository;

// //     @Autowired
// //     private PointsAggregationService pointsAggregationService;

// //     /**
// //      * Calculate and update points summary for a specific user
// //      */
// //     public UserPointsSummaryDTO calculateAndUpdateUserPoints(Integer userId) {
// //         // Calculate points from each category
// //         Integer equityPoints = pointsAggregationService.getPlotPointsForUser(userId);
// //         Integer portfolioPoints = pointsAggregationService.getPortfolioPointsForUser(userId);
// //         Integer tutorialPoints = pointsAggregationService.getTutorialPointsForUser(userId); // ADDED THIS LINE
// //         Integer totalPoints = equityPoints + portfolioPoints + tutorialPoints;

// //         // Save or update in UserPointsSummary table
// //         Optional<UserPointsSummary> existingSummary = userPointsSummaryRepository.findByUserId(userId);

// //         UserPointsSummary userPointsSummary;
// //         if (existingSummary.isPresent()) {
// //             userPointsSummary = existingSummary.get();
// //             userPointsSummary.updatePoints(equityPoints, portfolioPoints, tutorialPoints);
// //         } else {
// //             userPointsSummary = new UserPointsSummary(userId, equityPoints, portfolioPoints, tutorialPoints);
// //         }

// //         UserPointsSummary saved = userPointsSummaryRepository.save(userPointsSummary);
// //         return convertToDTO(saved);
// //     }

// //     /**
// //      * Update points summary for all users
// //      */
// //     public Map<String, Object> updateAllUsersPointsSummary() {
// //         Map<String, Object> result = new HashMap<>();
// //         int processedCount = 0;
// //         int errorCount = 0;

// //         // Get all unique user IDs from all rating tables
// //         Map<Integer, Boolean> allUserIds = getAllUserIds();

// //         for (Integer userId : allUserIds.keySet()) {
// //             try {
// //                 calculateAndUpdateUserPoints(userId);
// //                 processedCount++;
// //             } catch (Exception e) {
// //                 errorCount++;
// //                 System.err.println("Error processing user " + userId + ": " + e.getMessage());
// //             }
// //         }

// //         result.put("status", "COMPLETED");
// //         result.put("totalUsers", allUserIds.size());
// //         result.put("processedUsers", processedCount);
// //         result.put("errors", errorCount);
// //         result.put("message", "User points summary update completed");

// //         return result;
// //     }

// //     /**
// //      * Get user points summary
// //      */
// //     public UserPointsSummaryDTO getUserPointsSummary(Integer userId) {
// //         Optional<UserPointsSummary> summary = userPointsSummaryRepository.findByUserId(userId);
// //         return summary.map(this::convertToDTO)
// //                      .orElseGet(() -> calculateAndUpdateUserPoints(userId));
// //     }

// //     /**
// //      * Get all users points summary (leaderboard)
// //      */
// //     public List<UserPointsSummaryDTO> getAllUsersPointsSummary() {
// //         List<UserPointsSummary> summaries = userPointsSummaryRepository.findAllByOrderByTotalPointsDesc();
// //         return summaries.stream()
// //                        .map(this::convertToDTO)
// //                        .collect(Collectors.toList());
// //     }

// //     /**
// //      * Get points leaderboard
// //      */
// //     public Map<String, Object> getPointsLeaderboard() {
// //         List<UserPointsSummaryDTO> leaderboard = getAllUsersPointsSummary();
// //         Integer totalPointsAllUsers = userPointsSummaryRepository.getTotalPointsAcrossAllUsers();

// //         Map<String, Object> result = new HashMap<>();
// //         result.put("leaderboard", leaderboard);
// //         result.put("totalUsers", leaderboard.size());
// //         result.put("totalPointsAllUsers", totalPointsAllUsers);
// //         result.put("topPerformer", leaderboard.isEmpty() ? null : leaderboard.get(0));

// //         return result;
// //     }

// //     private Map<Integer, Boolean> getAllUserIds() {
// //         Map<Integer, Boolean> userIds = new HashMap<>();

// //         // Get user IDs from plot ratings
// //         List<Object[]> plotUsers = plotRatingRepository.getTotalPointsPerUser();
// //         for (Object[] result : plotUsers) {
// //             userIds.put(((Number) result[0]).intValue(), true);
// //         }

// //         // Get user IDs from portfolio ratings
// //         List<Object[]> portfolioUsers = portfolioRatingRepository.getTotalPointsPerUser();
// //         for (Object[] result : portfolioUsers) {
// //             userIds.put(((Number) result[0]).intValue(), true);
// //         }

// //         // Get user IDs from tutorial ratings
// //         List<Object[]> tutorialUsers = tutorialVideoRatingRepository.getTotalPointsPerUser();
// //         for (Object[] result : tutorialUsers) {
// //             userIds.put(((Number) result[0]).intValue(), true);
// //         }

// //         return userIds;
// //     }

// //     private UserPointsSummaryDTO convertToDTO(UserPointsSummary summary) {
// //         UserPointsSummaryDTO dto = new UserPointsSummaryDTO();
// //         dto.setId(summary.getId());
// //         dto.setUserId(summary.getUserId());
// //         dto.setEquityPoints(summary.getEquityPoints());
// //         dto.setPortfolioPoints(summary.getPortfolioPoints());
// //         dto.setTutorialPoints(summary.getTutorialPoints());
// //         dto.setTotalPoints(summary.getTotalPoints());
// //         dto.setCreatedAt(summary.getCreatedAt());
// //         dto.setUpdatedAt(summary.getUpdatedAt());
// //         return dto;
// //     }
// // }

// package com.example.prog.service.userpoints;

// import com.example.prog.dto.userpoints.UserPointsSummaryDTO;
// import com.example.prog.entity.userpoints.UserPointsSummary;
// import com.example.prog.repository.userpoints.UserPointsSummaryRepository;
// import com.example.prog.repository.PlotRatingRepository;
// import com.example.prog.repository.PortfolioRatingRepository;
// import com.example.prog.repository.TutorialVideoRatingRepository;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.time.LocalDateTime;
// import java.util.*;

// @Service
// public class UserPointsSummaryService {

//     private static final Logger logger = LoggerFactory.getLogger(UserPointsSummaryService.class);

//     @Autowired
//     private UserPointsSummaryRepository userPointsSummaryRepository;

//     @Autowired
//     private PlotRatingRepository plotRatingRepository;

//     @Autowired
//     private PortfolioRatingRepository portfolioRatingRepository;

//     @Autowired
//     private TutorialVideoRatingRepository tutorialVideoRatingRepository;

//     @Autowired
//     private PointsAggregationService pointsAggregationService;

//     /**
//      * FIXED: Safe method to calculate and update points for a specific user
//      * Uses separate transaction to avoid rollback contamination
//      */
//     public UserPointsSummaryDTO calculateAndUpdateUserPoints(Integer userId) {
//     // Calculate points from each category
//     Integer equityPoints = pointsAggregationService.getPlotPointsForUser(userId);
//     Integer portfolioPoints = pointsAggregationService.getPortfolioPointsForUser(userId);
//     Integer tutorialPoints = pointsAggregationService.getTutorialPointsForUser(userId);
//     Integer totalPoints = equityPoints + portfolioPoints + tutorialPoints;

//     // Simple JPA approach - let JPA handle the upsert
//     Optional<UserPointsSummary> existingSummary = userPointsSummaryRepository.findByUserId(userId);

//     UserPointsSummary userPointsSummary;
//     if (existingSummary.isPresent()) {
//         userPointsSummary = existingSummary.get();
//         userPointsSummary.updatePoints(equityPoints, portfolioPoints, tutorialPoints);
//     } else {
//         userPointsSummary = new UserPointsSummary(userId, equityPoints, portfolioPoints, tutorialPoints);
//     }

//     UserPointsSummary saved = userPointsSummaryRepository.save(userPointsSummary);
//     return convertToDTO(saved);
// }
//     /**
//      * FIXED: Main aggregation method with proper transaction management
//      * Uses non-transactional method to avoid rollback contamination
//      */
//     // public Map<String, Object> updateAllUsersPointsSummary() {
//     //     long startTime = System.currentTimeMillis();
//     //     Map<String, Object> result = new HashMap<>();

//     //     try {
//     //         logger.info("Starting points aggregation for all users...");

//     //         // Get all aggregated points (non-transactional)
//     //         Map<Integer, Map<String, Integer>> allUsersPoints = 
//     //             pointsAggregationService.getAllUsersAggregatedPoints();

//     //         int processedCount = 0;
//     //         int successCount = 0;
//     //         int errorCount = 0;
//     //         List<Map<String, Object>> errors = new ArrayList<>();

//     //         // Process each user in separate transactions
//     //         for (Map.Entry<Integer, Map<String, Integer>> entry : allUsersPoints.entrySet()) {
//     //             Integer userId = entry.getKey();
//     //             Map<String, Integer> points = entry.getValue();

//     //             try {
//     //                 // Process each user in isolation
//     //                 processSingleUserInTransaction(userId, points);
//     //                 successCount++;
//     //                 processedCount++;

//     //             } catch (Exception e) {
//     //                 errorCount++;
//     //                 Map<String, Object> error = new HashMap<>();
//     //                 error.put("userId", userId);
//     //                 error.put("error", e.getMessage());
//     //                 errors.add(error);
//     //                 logger.warn("Failed to process user {}: {}", userId, e.getMessage());
//     //             }
//     //         }

//     //         // Build success response
//     //         long endTime = System.currentTimeMillis();

//     //         result.put("status", "SUCCESS");
//     //         result.put("message", "Points aggregation completed");
//     //         result.put("timestamp", LocalDateTime.now().toString());
//     //         result.put("processingTimeMs", endTime - startTime);
//     //         result.put("totalUsers", allUsersPoints.size());
//     //         result.put("usersProcessed", processedCount);
//     //         result.put("successfulUpdates", successCount);
//     //         result.put("failedUpdates", errorCount);
//     //         result.put("errors", errors);

//     //         logger.info("Points aggregation completed. Success: {}, Failed: {}, Time: {}ms", 
//     //                    successCount, errorCount, (endTime - startTime));

//     //     } catch (Exception e) {
//     //         logger.error("Critical error in points aggregation: {}", e.getMessage(), e);

//     //         result.put("status", "ERROR");
//     //         result.put("message", "Points aggregation failed: " + e.getMessage());
//     //         result.put("timestamp", LocalDateTime.now().toString());
//     //         result.put("usersProcessed", 0);
//     //         result.put("failedUpdates", 0);
//     //     }

//     //     return result;
//     // }

//     /**
//      * Process single user in a separate transaction to avoid rollback contamination
//      */
//     // @Transactional
//     // protected void processSingleUserInTransaction(Integer userId, Map<String, Integer> points) {
//     //     Integer equityPoints = points.getOrDefault("plot", 0);
//     //     Integer portfolioPoints = points.getOrDefault("portfolio", 0);
//     //     Integer tutorialPoints = points.getOrDefault("tutorial", 0);
//     //     Integer totalPoints = points.getOrDefault("total", 0);

//     //     // Use native query upsert to avoid JPA merge issues
//     //     int updated = userPointsSummaryRepository.upsertUserPoints(
//     //         userId, equityPoints, portfolioPoints, tutorialPoints, totalPoints);

//     //     if (updated == 0) {
//     //         throw new RuntimeException("Failed to upsert user points");
//     //     }
//     // }

//     /**
//      * Safe method to get user points summary
//      */
//     public UserPointsSummaryDTO getUserPointsSummary(Integer userId) {
//         try {
//             Optional<UserPointsSummary> summary = userPointsSummaryRepository.findByUserId(userId);

//             if (summary.isPresent()) {
//                 return convertToDTO(summary.get());
//             } else {
//                 // Calculate on demand if not exists
//                 return calculateAndUpdateUserPoints(userId);
//             }
//         } catch (Exception e) {
//             logger.error("Error getting summary for user {}: {}", userId, e.getMessage());
//             // Return empty DTO instead of throwing exception
//             return new UserPointsSummaryDTO(userId, 0, 0, 0, 0);
//         }
//     }

//     /**
//      * Get points leaderboard
//      */
//     // public Map<String, Object> getPointsLeaderboard() {
//     //     try {
//     //         List<UserPointsSummary> summaries = userPointsSummaryRepository.findAllByOrderByTotalPointsDesc();
//     //         List<UserPointsSummaryDTO> leaderboard = new ArrayList<>();

//     //         for (UserPointsSummary summary : summaries) {
//     //             leaderboard.add(convertToDTO(summary));
//     //         }

//     //         Integer totalPointsAllUsers = userPointsSummaryRepository.getTotalPointsAcrossAllUsers();

//     //         Map<String, Object> result = new HashMap<>();
//     //         result.put("leaderboard", leaderboard);
//     //         result.put("totalUsers", leaderboard.size());
//     //         result.put("totalPointsAllUsers", totalPointsAllUsers);
//     //         result.put("topPerformer", leaderboard.isEmpty() ? null : leaderboard.get(0));
//     //         result.put("timestamp", LocalDateTime.now().toString());

//     //         return result;
//     //     } catch (Exception e) {
//     //         logger.error("Error getting leaderboard: {}", e.getMessage());
//     //         Map<String, Object> errorResult = new HashMap<>();
//     //         errorResult.put("error", "Failed to fetch leaderboard");
//     //         errorResult.put("leaderboard", Collections.emptyList());
//     //         return errorResult;
//     //     }
//     // }

//     /**
//      * Safe point getters with proper error handling
//      */
//     private Integer safeGetPlotPoints(Integer userId) {
//         try {
//             Integer points = plotRatingRepository.sumEarnedPointsByUserId(userId);
//             return points != null ? points : 0;
//         } catch (Exception e) {
//             logger.warn("Error getting plot points for user {}: {}", userId, e.getMessage());
//             return 0;
//         }
//     }

//     private Integer safeGetPortfolioPoints(Integer userId) {
//         try {
//             Integer points = portfolioRatingRepository.sumEarnedPointsByUserId(userId);
//             return points != null ? points : 0;
//         } catch (Exception e) {
//             logger.warn("Error getting portfolio points for user {}: {}", userId, e.getMessage());
//             return 0;
//         }
//     }

//     private Integer safeGetTutorialPoints(Integer userId) {
//         try {
//             Integer points = tutorialVideoRatingRepository.sumEarnedPointsByUserId(userId);
//             return points != null ? points : 0;
//         } catch (Exception e) {
//             logger.warn("Error getting tutorial points for user {}: {}", userId, e.getMessage());
//             return 0;
//         }
//     }

//     /**
//      * Upsert user points using native query
//      */
//     // private UserPointsSummaryDTO upsertUserPoints(Integer userId, Integer equityPoints, 
//     //                                              Integer portfolioPoints, Integer tutorialPoints, 
//     //                                              Integer totalPoints) {
//     //     try {
//     //         int result = userPointsSummaryRepository.upsertUserPoints(
//     //             userId, equityPoints, portfolioPoints, tutorialPoints, totalPoints);

//     //         if (result > 0) {
//     //             // Fetch the updated record
//     //             Optional<UserPointsSummary> updated = userPointsSummaryRepository.findByUserId(userId);
//     //             if (updated.isPresent()) {
//     //                 return convertToDTO(updated.get());
//     //             }
//     //         }

//     //         throw new RuntimeException("Upsert operation failed");

//     //     } catch (Exception e) {
//     //         logger.error("Upsert failed for user {}: {}", userId, e.getMessage());
//     //         throw new RuntimeException("Database operation failed", e);
//     //     }
//     // }

//     private UserPointsSummaryDTO convertToDTO(UserPointsSummary summary) {
//         UserPointsSummaryDTO dto = new UserPointsSummaryDTO();
//         dto.setId(summary.getId());
//         dto.setUserId(summary.getUserId());
//         dto.setEquityPoints(summary.getEquityPoints());
//         dto.setPortfolioPoints(summary.getPortfolioPoints());
//         dto.setTutorialPoints(summary.getTutorialPoints());
//         dto.setTotalPoints(summary.getTotalPoints());
//         dto.setCreatedAt(summary.getCreatedAt());
//         dto.setUpdatedAt(summary.getUpdatedAt());
//         return dto;
//     }
// }

// package com.example.prog.service.userpoints;

// import com.example.prog.dto.userpoints.UserPointsSummaryDTO;
// import com.example.prog.entity.userpoints.UserPointsSummary;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.CorporateUser; // ADD THIS IMPORT
// import com.example.prog.repository.userpoints.UserPointsSummaryRepository;
// import com.example.prog.repository.PlotRatingRepository;
// import com.example.prog.repository.PortfolioRatingRepository;
// import com.example.prog.repository.TutorialVideoRatingRepository;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.CorporateUserRepository; // ADD THIS IMPORT
// import com.example.prog.token.JwtUtil;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.util.Optional;

// @Service
// public class UserPointsSummaryService {

//     private static final Logger logger = LoggerFactory.getLogger(UserPointsSummaryService.class);

//     @Autowired
//     private UserPointsSummaryRepository userPointsSummaryRepository;

//     @Autowired
//     private PlotRatingRepository plotRatingRepository;

//     @Autowired
//     private PortfolioRatingRepository portfolioRatingRepository;

//     @Autowired
//     private TutorialVideoRatingRepository tutorialVideoRatingRepository;

//     @Autowired
//     private PointsAggregationService pointsAggregationService;

//     @Autowired
//     private JwtUtil jwtUtil;

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private CorporateUserRepository corporateUserRepository; // ADD THIS

//     /**
//      * Get user points summary by JWT token
//      */
//     public UserPointsSummaryDTO getUserPointsSummaryByToken(String token) {
//         try {
//             // Validate token first
//             if (!jwtUtil.validateToken(token)) {
//                 throw new RuntimeException("Invalid or expired token");
//             }

//             // Extract user information from token
//             String email = jwtUtil.extractEmail(token);
//             String userType = jwtUtil.extractUserType(token);

//             logger.info("Fetching points for user email: {}, type from token: {}", email, userType);

//             // Get ACTUAL user ID from UserRepository using email (SAME PATTERN AS PromoCodeUsageServiceImpl)
//             Integer userId = getActualUserIdFromEmail(email);

//             if (userId == null) {
//                 throw new RuntimeException("User not found for email: " + email);
//             }

//             logger.info("Found actual user ID: {} for email: {}", userId, email);

//             return getUserPointsSummary(userId);

//         } catch (Exception e) {
//             logger.error("Error extracting user info from token", e);
//             throw new RuntimeException("Invalid token or user not found: " + e.getMessage());
//         }
//     }

//     /**
//      * Get ACTUAL user ID from email using UserRepository - SAME PATTERN AS PromoCodeUsageServiceImpl
//      */
//     private Integer getActualUserIdFromEmail(String email) {
//         try {
//             // Method 1: Check UserDtls (individual users) - SAME AS PromoCodeUsageServiceImpl
//             Optional<UserDtls> userDtls = userRepository.findByEmail(email);
//             if (userDtls.isPresent()) {
//                 Integer userId = userDtls.get().getUserID();
//                 logger.info("Found user in UserDtls: ID={}, Email={}", userId, email);
//                 return userId;
//             }

//             // Method 2: Check CorporateUser - SAME AS PromoCodeUsageServiceImpl
//             CorporateUser corporateUser = corporateUserRepository.findByEmail(email);
//             if (corporateUser != null) {
//                 Integer userId = corporateUser.getId();
//                 logger.info("Found user in CorporateUser: ID={}, Email={}", userId, email);
//                 return userId;
//             }

//             logger.warn("No user found in UserDtls or CorporateUser for email: {}", email);
//             return null;

//         } catch (Exception e) {
//             logger.error("Error getting user ID for email: {}", email, e);
//             return null;
//         }
//     }

//     /**
//      * Get user type from User entity - ENHANCED VERSION
//      */
//     private String getUserTypeFromUser(Object user) {
//         try {
//             if (user instanceof UserDtls) {
//                 UserDtls userDtls = (UserDtls) user;
//                 // Check if UserDtls has a userType field
//                 if (userDtls.getUserType() != null && !userDtls.getUserType().isEmpty()) {
//                     return userDtls.getUserType();
//                 }
//                 return "INDIVIDUAL"; // Default for UserDtls
//             } else if (user instanceof CorporateUser) {
//                 return "CORPORATE"; // Always corporate for CorporateUser
//             }
//             return "INDIVIDUAL"; // Default fallback
//         } catch (Exception e) {
//             logger.warn("Error getting user type from User entity, using default");
//             return "INDIVIDUAL";
//         }
//     }

//     /**
//      * Get user type from user ID - ENHANCED VERSION
//      */
//     private String getUserTypeFromUserId(Integer userId) {
//         try {
//             // Method 1: Check UserDtls - SAME PATTERN AS PromoCodeUsageServiceImpl
//             Optional<UserDtls> userDtls = userRepository.findById(userId);
//             if (userDtls.isPresent()) {
//                 return getUserTypeFromUser(userDtls.get());
//             }

//             // Method 2: Check CorporateUser - SAME PATTERN AS PromoCodeUsageServiceImpl
//             CorporateUser corporateUser = corporateUserRepository.findById(userId).orElse(null);
//             if (corporateUser != null) {
//                 return getUserTypeFromUser(corporateUser);
//             }

//             logger.warn("No user found for ID: {}, using default user type", userId);
//             return "INDIVIDUAL";
//         } catch (Exception e) {
//             logger.error("Error getting user type for user ID: {}", userId, e);
//             return "INDIVIDUAL";
//         }
//     }

//     /**
//      * Get actual user type from email - NEW METHOD
//      */
//     private String getActualUserTypeFromEmail(String email) {
//         try {
//             // Method 1: Check UserDtls
//             Optional<UserDtls> userDtls = userRepository.findByEmail(email);
//             if (userDtls.isPresent()) {
//                 return getUserTypeFromUser(userDtls.get());
//             }

//             // Method 2: Check CorporateUser
//             CorporateUser corporateUser = corporateUserRepository.findByEmail(email);
//             if (corporateUser != null) {
//                 return getUserTypeFromUser(corporateUser);
//             }

//             logger.warn("No user found for email: {}, using default user type", email);
//             return "INDIVIDUAL";
//         } catch (Exception e) {
//             logger.error("Error getting user type for email: {}", email, e);
//             return "INDIVIDUAL";
//         }
//     }

//     /**
//      * Calculate and update user points with actual userType
//      */
//     public UserPointsSummaryDTO calculateAndUpdateUserPoints(Integer userId, String userType) {
//         // If userType is not provided, fetch it from UserRepository
//         if (userType == null) {
//             userType = getUserTypeFromUserId(userId);
//         }

//         // Calculate points from each category
//         Integer equityPoints = pointsAggregationService.getPlotPointsForUser(userId);
//         Integer portfolioPoints = pointsAggregationService.getPortfolioPointsForUser(userId);
//         Integer tutorialPoints = pointsAggregationService.getTutorialPointsForUser(userId);
//         Integer totalPoints = equityPoints + portfolioPoints + tutorialPoints;

//         Optional<UserPointsSummary> existingSummary = userPointsSummaryRepository.findByUserId(userId);

//         UserPointsSummary userPointsSummary;
//         if (existingSummary.isPresent()) {
//             userPointsSummary = existingSummary.get();
//             userPointsSummary.setUserType(userType);
//             userPointsSummary.updatePoints(equityPoints, portfolioPoints, tutorialPoints);
//         } else {
//             userPointsSummary = new UserPointsSummary(userId, userType, equityPoints, portfolioPoints, tutorialPoints);
//         }

//         UserPointsSummary saved = userPointsSummaryRepository.save(userPointsSummary);
//         return convertToDTO(saved);
//     }

//     /**
//      * Get user points summary by user ID
//      */
//     public UserPointsSummaryDTO getUserPointsSummary(Integer userId) {
//         try {
//             Optional<UserPointsSummary> summary = userPointsSummaryRepository.findByUserId(userId);

//             if (summary.isPresent()) {
//                 return convertToDTO(summary.get());
//             } else {
//                 // Calculate on demand if not exists
//                 String userType = getUserTypeFromUserId(userId);
//                 return calculateAndUpdateUserPoints(userId, userType);
//             }
//         } catch (Exception e) {
//             logger.error("Error getting summary for user {}: {}", userId, e.getMessage());
//             // Return empty DTO instead of throwing exception
//             return new UserPointsSummaryDTO(userId, "INDIVIDUAL", 0, 0, 0, 0);
//         }
//     }

//     private UserPointsSummaryDTO convertToDTO(UserPointsSummary summary) {
//         UserPointsSummaryDTO dto = new UserPointsSummaryDTO();
//         dto.setId(summary.getId());
//         dto.setUserId(summary.getUserId());
//         dto.setUserType(summary.getUserType());
//         dto.setEquityPoints(summary.getEquityPoints());
//         dto.setPortfolioPoints(summary.getPortfolioPoints());
//         dto.setTutorialPoints(summary.getTutorialPoints());
//         dto.setTotalPoints(summary.getTotalPoints());
//         dto.setCreatedAt(summary.getCreatedAt());
//         dto.setUpdatedAt(summary.getUpdatedAt());
//         return dto;
//     }
// }

package com.example.prog.service.userpoints;

import com.example.prog.dto.userpoints.UserPointsSummaryDTO;
import com.example.prog.entity.userpoints.UserPointsSummary;
import com.example.prog.entity.UserDtls;
import com.example.prog.entity.CorporateUser;
import com.example.prog.repository.userpoints.UserPointsSummaryRepository;
import com.example.prog.repository.PlotRatingRepository;
import com.example.prog.repository.PortfolioRatingRepository;
import com.example.prog.repository.TutorialVideoRatingRepository;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.token.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Optional;
import java.util.List;

@Service
public class UserPointsSummaryService {

    private static final Logger logger = LoggerFactory.getLogger(UserPointsSummaryService.class);

    @Autowired
    private UserPointsSummaryRepository userPointsSummaryRepository;

    @Autowired
    private PlotRatingRepository plotRatingRepository;

    @Autowired
    private PortfolioRatingRepository portfolioRatingRepository;

    @Autowired
    private TutorialVideoRatingRepository tutorialVideoRatingRepository;

    @Autowired
    private PointsAggregationService pointsAggregationService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CorporateUserRepository corporateUserRepository;

    @Transactional
    public UserPointsSummaryDTO updateUserPointsSummary(Integer userId, Integer plotPoints,
            Integer portfolioPoints, Integer tutorialPoints,
            Integer totalPoints) {
        UserPointsSummary summary = userPointsSummaryRepository.findByUserId(userId)
                .orElse(new UserPointsSummary());

        summary.setUserId(userId);
        // CORRECTED: Use equityPoints instead of plotPoints to match your entity
        summary.setEquityPoints(plotPoints);
        summary.setPortfolioPoints(portfolioPoints);
        summary.setTutorialPoints(tutorialPoints);
        summary.setTotalPoints(totalPoints);
        // CORRECTED: Use setUpdatedAt instead of setLastUpdated to match your entity
        summary.setUpdatedAt(LocalDateTime.now());

        UserPointsSummary saved = userPointsSummaryRepository.save(summary);
        return convertToDTO(saved);
    }

    @Transactional
    public Map<String, Object> recalculateAllUsersPoints() {
        Map<String, Object> result = new HashMap<>();
        int updatedUsers = 0;
        int totalPoints = 0;

        // Get all user IDs from different repositories
        List<Integer> allUserIds = userPointsSummaryRepository.findAllUserIds();

        for (Integer userId : allUserIds) {
            try {
                // Recalculate points for each user
                Integer plotPoints = pointsAggregationService.calculatePlotPointsForUser(userId);
                Integer portfolioPoints = pointsAggregationService.calculatePortfolioPointsForUser(userId);
                Integer tutorialPoints = pointsAggregationService.calculateTutorialPointsForUser(userId);

                int userTotalPoints = plotPoints + portfolioPoints + tutorialPoints;

                // Update the summary
                updateUserPointsSummary(userId, plotPoints, portfolioPoints, tutorialPoints, userTotalPoints);

                updatedUsers++;
                totalPoints += userTotalPoints;

            } catch (Exception e) {
                logger.error("Error recalculating points for user ID: {}", userId, e);
            }
        }

        result.put("updatedUsers", updatedUsers);
        result.put("totalPointsRecalculated", totalPoints);
        result.put("timestamp", LocalDateTime.now().toString());

        return result;
    }

    /**
     * Get user points summary by JWT token
     */
    public UserPointsSummaryDTO getUserPointsSummaryByToken(String token) {
        try {
            // Validate token first
            if (!jwtUtil.validateToken(token)) {
                throw new RuntimeException("Invalid or expired token");
            }

            // Extract user information from token
            String email = jwtUtil.extractEmail(token);
            String userType = jwtUtil.extractUserType(token);

            logger.info("Fetching points for user email: {}, type from token: {}", email, userType);

            // Get ACTUAL user ID from UserRepository using email
            Integer userId = getActualUserIdFromEmail(email);

            if (userId == null) {
                throw new RuntimeException("User not found for email: " + email);
            }

            logger.info("Found actual user ID: {} for email: {}", userId, email);

            return getUserPointsSummary(userId);

        } catch (Exception e) {
            logger.error("Error extracting user info from token", e);
            throw new RuntimeException("Invalid token or user not found: " + e.getMessage());
        }
    }

    /**
     * Get ACTUAL user ID from email using UserRepository
     */
    private Integer getActualUserIdFromEmail(String email) {
        try {
            // Method 1: Check UserDtls (individual users)
            Optional<UserDtls> userDtls = userRepository.findByEmail(email);
            if (userDtls.isPresent()) {
                Integer userId = userDtls.get().getUserID();
                logger.info("Found user in UserDtls: ID={}, Email={}", userId, email);
                return userId;
            }

            // Method 2: Check CorporateUser
            CorporateUser corporateUser = corporateUserRepository.findByemail(email);
            if (corporateUser != null) {
                Integer userId = corporateUser.getId();
                logger.info("Found user in CorporateUser: ID={}, Email={}", userId, email);
                return userId;
            }

            logger.warn("No user found in UserDtls or CorporateUser for email: {}", email);
            return null;

        } catch (Exception e) {
            logger.error("Error getting user ID for email: {}", email, e);
            return null;
        }
    }

    /**
     * Get user type from User entity
     */
    private String getUserTypeFromUser(Object user) {
        try {
            if (user instanceof UserDtls) {
                UserDtls userDtls = (UserDtls) user;
                if (userDtls.getUserType() != null && !userDtls.getUserType().isEmpty()) {
                    return userDtls.getUserType();
                }
                return "INDIVIDUAL";
            } else if (user instanceof CorporateUser) {
                return "CORPORATE";
            }
            return "INDIVIDUAL";
        } catch (Exception e) {
            logger.warn("Error getting user type from User entity, using default");
            return "INDIVIDUAL";
        }
    }

    /**
     * Get user type from user ID
     */
    private String getUserTypeFromUserId(Integer userId) {
        try {
            // Method 1: Check UserDtls
            Optional<UserDtls> userDtls = userRepository.findById(userId);
            if (userDtls.isPresent()) {
                return getUserTypeFromUser(userDtls.get());
            }

            // Method 2: Check CorporateUser
            CorporateUser corporateUser = corporateUserRepository.findById(userId).orElse(null);
            if (corporateUser != null) {
                return getUserTypeFromUser(corporateUser);
            }

            logger.warn("No user found for ID: {}, using default user type", userId);
            return "INDIVIDUAL";
        } catch (Exception e) {
            logger.error("Error getting user type for user ID: {}", userId, e);
            return "INDIVIDUAL";
        }
    }

    /**
     * Get actual user type from email
     */
    private String getActualUserTypeFromEmail(String email) {
        try {
            // Method 1: Check UserDtls
            Optional<UserDtls> userDtls = userRepository.findByEmail(email);
            if (userDtls.isPresent()) {
                return getUserTypeFromUser(userDtls.get());
            }

            // Method 2: Check CorporateUser
            CorporateUser corporateUser = corporateUserRepository.findByemail(email);
            if (corporateUser != null) {
                return getUserTypeFromUser(corporateUser);
            }

            logger.warn("No user found for email: {}, using default user type", email);
            return "INDIVIDUAL";
        } catch (Exception e) {
            logger.error("Error getting user type for email: {}", email, e);
            return "INDIVIDUAL";
        }
    }

    /**
     * Calculate and update user points with actual userType
     */
    public UserPointsSummaryDTO calculateAndUpdateUserPoints(Integer userId, String userType) {
        // If userType is not provided, fetch it from UserRepository
        if (userType == null) {
            userType = getUserTypeFromUserId(userId);
        }

        // Calculate points from each category
        Integer equityPoints = pointsAggregationService.calculatePlotPointsForUser(userId);
        Integer portfolioPoints = pointsAggregationService.calculatePortfolioPointsForUser(userId);
        Integer tutorialPoints = pointsAggregationService.calculateTutorialPointsForUser(userId);
        Integer totalPoints = equityPoints + portfolioPoints + tutorialPoints;

        Optional<UserPointsSummary> existingSummary = userPointsSummaryRepository.findByUserId(userId);

        UserPointsSummary userPointsSummary;
        if (existingSummary.isPresent()) {
            userPointsSummary = existingSummary.get();
            userPointsSummary.setUserType(userType);
            userPointsSummary.updatePoints(equityPoints, portfolioPoints, tutorialPoints);
        } else {
            userPointsSummary = new UserPointsSummary(userId, userType, equityPoints, portfolioPoints, tutorialPoints);
        }

        UserPointsSummary saved = userPointsSummaryRepository.save(userPointsSummary);
        return convertToDTO(saved);
    }

    /**
     * Get user points summary by user ID
     */
    public UserPointsSummaryDTO getUserPointsSummary(Integer userId) {
        try {
            Optional<UserPointsSummary> summary = userPointsSummaryRepository.findByUserId(userId);

            if (summary.isPresent()) {
                return convertToDTO(summary.get());
            } else {
                // Calculate on demand if not exists
                String userType = getUserTypeFromUserId(userId);
                return calculateAndUpdateUserPoints(userId, userType);
            }
        } catch (Exception e) {
            logger.error("Error getting summary for user {}: {}", userId, e.getMessage());
            // Return empty DTO instead of throwing exception
            return new UserPointsSummaryDTO(userId, "INDIVIDUAL", 0, 0, 0, 0);
        }
    }

    private UserPointsSummaryDTO convertToDTO(UserPointsSummary summary) {
        UserPointsSummaryDTO dto = new UserPointsSummaryDTO();
        dto.setId(summary.getId());
        dto.setUserId(summary.getUserId());
        dto.setUserType(summary.getUserType());
        dto.setEquityPoints(summary.getEquityPoints());
        dto.setPortfolioPoints(summary.getPortfolioPoints());
        dto.setTutorialPoints(summary.getTutorialPoints());
        dto.setTotalPoints(summary.getTotalPoints());
        dto.setCreatedAt(summary.getCreatedAt());
        dto.setUpdatedAt(summary.getUpdatedAt());
        return dto;
    }
}