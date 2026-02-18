// package com.example.prog.service.userpoints;

// import com.example.prog.dto.userpoints.PointsResponseDTO;
// import com.example.prog.repository.PlotRatingRepository;
// import com.example.prog.repository.PortfolioRatingRepository;
// import com.example.prog.repository.TutorialVideoRatingRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// @Service
// public class PointsAggregationService {

//     @Autowired
//     private PlotRatingRepository plotRatingRepository;

//     @Autowired
//     private PortfolioRatingRepository portfolioRatingRepository;

//     @Autowired
//     private TutorialVideoRatingRepository tutorialVideoRatingRepository;

//     /**
//      * Get total plot points per user
//      */
//     public PointsResponseDTO getPlotPointsPerUser() {
//         List<Object[]> results = plotRatingRepository.getTotalPointsPerUser();
//         return buildPointsResponse("plot", results);
//     }

//     /**
//      * Get total portfolio points per user
//      */
//     public PointsResponseDTO getPortfolioPointsPerUser() {
//         List<Object[]> results = portfolioRatingRepository.getTotalPointsPerUser();
//         return buildPointsResponse("portfolio", results);
//     }

//     /**
//      * Get total tutorial points per user
//      */
//     public PointsResponseDTO getTutorialPointsPerUser() {
//         List<Object[]> results = tutorialVideoRatingRepository.getTotalPointsPerUser();
//         return buildPointsResponse("tutorial", results);
//     }

//     /**
//      * Get plot points for a specific user
//      */
//     public Integer getPlotPointsForUser(Integer userId) {
//         Integer points = plotRatingRepository.sumEarnedPointsByUserId(userId);
//         return points != null ? points : 0;
//     }

//     /**
//      * Get portfolio points for a specific user
//      */
//     public Integer getPortfolioPointsForUser(Integer userId) {
//         Integer points = portfolioRatingRepository.sumEarnedPointsByUserId(userId);
//         return points != null ? points : 0;
//     }

//     /**
//      * Get tutorial points for a specific user
//      */
//     public Integer getTutorialPointsForUser(Integer userId) {
//         Integer points = tutorialVideoRatingRepository.sumEarnedPointsByUserId(userId);
//         return points != null ? points : 0;
//     }

//     private PointsResponseDTO buildPointsResponse(String category, List<Object[]> results) {
//         Map<Integer, Integer> userPoints = new HashMap<>();
//         Integer totalPoints = 0;

//         for (Object[] result : results) {
//             Integer userId = ((Number) result[0]).intValue();
//             Integer points = ((Number) result[1]).intValue();
//             userPoints.put(userId, points);
//             totalPoints += points;
//         }

//         return new PointsResponseDTO(category, userPoints, userPoints.size(), totalPoints);
//     }
// }

// package com.example.prog.service.userpoints;

// import com.example.prog.entity.userpoints.UserPointsSummary;
// import com.example.prog.repository.PlotRatingRepository;
// import com.example.prog.repository.PortfolioRatingRepository;
// import com.example.prog.repository.TutorialVideoRatingRepository;
// import com.example.prog.repository.userpoints.UserPointsSummaryRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.time.LocalDateTime;
// import java.util.*;
// import java.util.stream.Collectors;

// @Service
// @Transactional
// public class PointsAggregationService {

//     @Autowired
//     private PlotRatingRepository plotRatingRepository;

//     @Autowired
//     private PortfolioRatingRepository portfolioRatingRepository;

//     @Autowired
//     private TutorialVideoRatingRepository tutorialVideoRatingRepository;

//     @Autowired
//     private UserPointsSummaryRepository userPointsSummaryRepository;

//     /**
//      * Main aggregation method - updates all users points summary
//      */
//     public Map<String, Object> updateAllUsersPointsSummary() {
//         Map<String, Object> result = new HashMap<>();
//         long startTime = System.currentTimeMillis();

//         try {
//             System.out.println("Starting points aggregation for all users...");

//             // Step 1: Fetch points from all three tables
//             Map<Integer, Integer> plotPoints = fetchPlotPointsPerUser();
//             Map<Integer, Integer> portfolioPoints = fetchPortfolioPointsPerUser();
//             Map<Integer, Integer> tutorialPoints = fetchTutorialPointsPerUser();

//             // Step 2: Get all unique user IDs
//             Set<Integer> allUserIds = getAllUserIds(plotPoints, portfolioPoints, tutorialPoints);

//             // Step 3: Process each user
//             int processedCount = 0;
//             int createdCount = 0;
//             int updatedCount = 0;
//             int errorCount = 0;

//             List<Map<String, Object>> userResults = new ArrayList<>();

//             for (Integer userId : allUserIds) {
//                 try {
//                     Map<String, Object> userResult = processUserPoints(
//                             userId, plotPoints, portfolioPoints, tutorialPoints);
                    
//                     userResults.add(userResult);
//                     processedCount++;

//                     if ((Boolean) userResult.get("created")) {
//                         createdCount++;
//                     } else {
//                         updatedCount++;
//                     }

//                 } catch (Exception e) {
//                     errorCount++;
//                     System.err.println("Error processing user " + userId + ": " + e.getMessage());
//                 }
//             }

//             // Step 4: Build response
//             long endTime = System.currentTimeMillis();
//             long duration = endTime - startTime;

//             result.put("status", "SUCCESS");
//             result.put("message", "Points aggregation completed successfully");
//             result.put("processingTimeMs", duration);
//             result.put("totalUsersProcessed", processedCount);
//             result.put("recordsCreated", createdCount);
//             result.put("recordsUpdated", updatedCount);
//             result.put("errors", errorCount);
//             result.put("totalUsersInSystem", allUserIds.size());
//             result.put("userResults", userResults);
//             result.put("summary", buildSummaryStatistics(userResults));

//             System.out.println("Points aggregation completed in " + duration + "ms. " +
//                     "Processed: " + processedCount + ", Errors: " + errorCount);

//         } catch (Exception e) {
//             result.put("status", "ERROR");
//             result.put("message", "Points aggregation failed: " + e.getMessage());
//             result.put("errors", 1);
//             System.err.println("Critical error in points aggregation: " + e.getMessage());
//             e.printStackTrace();
//         }

//         return result;
//     }

//     /**
//      * Process points for a single user
//      */
//     private Map<String, Object> processUserPoints(Integer userId, 
//                                                  Map<Integer, Integer> plotPoints,
//                                                  Map<Integer, Integer> portfolioPoints,
//                                                  Map<Integer, Integer> tutorialPoints) {
        
//         // Get points for this user (default to 0 if not found)
//         Integer equityPoints = plotPoints.getOrDefault(userId, 0);
//         Integer portfolioPointsValue = portfolioPoints.getOrDefault(userId, 0);
//         Integer tutorialPointsValue = tutorialPoints.getOrDefault(userId, 0);
//         Integer totalPoints = equityPoints + portfolioPointsValue + tutorialPointsValue;

//         // Check if user summary exists
//         Optional<UserPointsSummary> existingSummary = userPointsSummaryRepository.findByUserId(userId);
//         boolean created = false;

//         UserPointsSummary summary;
//         if (existingSummary.isPresent()) {
//             // Update existing record
//             summary = existingSummary.get();
//             summary.updatePoints(equityPoints, portfolioPointsValue, tutorialPointsValue);
//         } else {
//             // Create new record
//             summary = new UserPointsSummary(userId, equityPoints, portfolioPointsValue, tutorialPointsValue);
//             created = true;
//         }

//         // Save to database
//         UserPointsSummary saved = userPointsSummaryRepository.save(summary);

//         // Build user result
//         Map<String, Object> userResult = new HashMap<>();
//         userResult.put("userId", userId);
//         userResult.put("equityPoints", equityPoints);
//         userResult.put("portfolioPoints", portfolioPointsValue);
//         userResult.put("tutorialPoints", tutorialPointsValue);
//         userResult.put("totalPoints", totalPoints);
//         userResult.put("created", created);
//         userResult.put("summaryId", saved.getId());
//         userResult.put("updatedAt", saved.getUpdatedAt());

//         return userResult;
//     }

//     /**
//      * Fetch plot points per user
//      */
//     private Map<Integer, Integer> fetchPlotPointsPerUser() {
//         List<Object[]> results = plotRatingRepository.getTotalPointsPerUser();
//         return convertToMap(results);
//     }

//     /**
//      * Fetch portfolio points per user
//      */
//     private Map<Integer, Integer> fetchPortfolioPointsPerUser() {
//         List<Object[]> results = portfolioRatingRepository.getTotalPointsPerUser();
//         return convertToMap(results);
//     }

//     /**
//      * Fetch tutorial points per user
//      */
//     private Map<Integer, Integer> fetchTutorialPointsPerUser() {
//         List<Object[]> results = tutorialVideoRatingRepository.getTotalPointsPerUser();
//         return convertToMap(results);
//     }

//     /**
//      * Convert repository results to Map<UserId, Points>
//      */
//     private Map<Integer, Integer> convertToMap(List<Object[]> results) {
//         return results.stream()
//                 .collect(Collectors.toMap(
//                         result -> ((Number) result[0]).intValue(),
//                         result -> ((Number) result[1]).intValue()
//                 ));
//     }

//     /**
//      * Get all unique user IDs from all point sources
//      */
//     private Set<Integer> getAllUserIds(Map<Integer, Integer>... pointsMaps) {
//         Set<Integer> allUserIds = new HashSet<>();
//         for (Map<Integer, Integer> pointsMap : pointsMaps) {
//             allUserIds.addAll(pointsMap.keySet());
//         }
//         return allUserIds;
//     }

//     /**
//      * Build summary statistics
//      */
//     private Map<String, Object> buildSummaryStatistics(List<Map<String, Object>> userResults) {
//         Map<String, Object> summary = new HashMap<>();

//         if (userResults.isEmpty()) {
//             return summary;
//         }

//         // Calculate totals and averages
//         int totalEquityPoints = userResults.stream()
//                 .mapToInt(r -> (Integer) r.get("equityPoints"))
//                 .sum();
//         int totalPortfolioPoints = userResults.stream()
//                 .mapToInt(r -> (Integer) r.get("portfolioPoints"))
//                 .sum();
//         int totalTutorialPoints = userResults.stream()
//                 .mapToInt(r -> (Integer) r.get("tutorialPoints"))
//                 .sum();
//         int grandTotalPoints = userResults.stream()
//                 .mapToInt(r -> (Integer) r.get("totalPoints"))
//                 .sum();

//         double avgPointsPerUser = (double) grandTotalPoints / userResults.size();

//         // Find top performers
//         List<Map<String, Object>> topPerformers = userResults.stream()
//                 .sorted((a, b) -> ((Integer) b.get("totalPoints")).compareTo((Integer) a.get("totalPoints")))
//                 .limit(5)
//                 .collect(Collectors.toList());

//         summary.put("totalEquityPoints", totalEquityPoints);
//         summary.put("totalPortfolioPoints", totalPortfolioPoints);
//         summary.put("totalTutorialPoints", totalTutorialPoints);
//         summary.put("grandTotalPoints", grandTotalPoints);
//         summary.put("averagePointsPerUser", Math.round(avgPointsPerUser * 100.0) / 100.0);
//         summary.put("topPerformers", topPerformers);

//         return summary;
//     }

//     /**
//      * Get points summary for a specific user
//      */
//     public Map<String, Object> getUserPointsSummary(Integer userId) {
//         Optional<UserPointsSummary> summary = userPointsSummaryRepository.findByUserId(userId);
        
//         if (summary.isPresent()) {
//             UserPointsSummary userSummary = summary.get();
//             Map<String, Object> result = new HashMap<>();
//             result.put("userId", userSummary.getUserId());
//             result.put("equityPoints", userSummary.getEquityPoints());
//             result.put("portfolioPoints", userSummary.getPortfolioPoints());
//             result.put("tutorialPoints", userSummary.getTutorialPoints());
//             result.put("totalPoints", userSummary.getTotalPoints());
//             result.put("createdAt", userSummary.getCreatedAt());
//             result.put("updatedAt", userSummary.getUpdatedAt());
//             result.put("summaryId", userSummary.getId());
//             return result;
//         } else {
//             // Calculate on-the-fly if not in summary table
//             return calculateUserPointsOnDemand(userId);
//         }
//     }

//     /**
//      * Calculate user points without saving to summary table
//      */
//     private Map<String, Object> calculateUserPointsOnDemand(Integer userId) {
//         Integer equityPoints = plotRatingRepository.sumEarnedPointsByUserId(userId);
//         Integer portfolioPoints = portfolioRatingRepository.sumEarnedPointsByUserId(userId);
//         Integer tutorialPoints = tutorialVideoRatingRepository.sumEarnedPointsByUserId(userId);

//         Map<String, Object> result = new HashMap<>();
//         result.put("userId", userId);
//         result.put("equityPoints", equityPoints != null ? equityPoints : 0);
//         result.put("portfolioPoints", portfolioPoints != null ? portfolioPoints : 0);
//         result.put("tutorialPoints", tutorialPoints != null ? tutorialPoints : 0);
//         result.put("totalPoints", 
//             (equityPoints != null ? equityPoints : 0) + 
//             (portfolioPoints != null ? portfolioPoints : 0) + 
//             (tutorialPoints != null ? tutorialPoints : 0));
//         result.put("calculatedOnDemand", true);
        
//         return result;
//     }
// }


// package com.example.prog.service.userpoints;

// import com.example.prog.dto.userpoints.PointsResponseDTO;
// import com.example.prog.repository.PlotRatingRepository;
// import com.example.prog.repository.PortfolioRatingRepository;
// import com.example.prog.repository.TutorialVideoRatingRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// @Service
// public class PointsAggregationService {

//     @Autowired
//     private PlotRatingRepository plotRatingRepository;

//     @Autowired
//     private PortfolioRatingRepository portfolioRatingRepository;

//     @Autowired
//     private TutorialVideoRatingRepository tutorialVideoRatingRepository;

//     /**
//      * Get total plot points per user
//      */
//     public PointsResponseDTO getPlotPointsPerUser() {
//         List<Object[]> results = plotRatingRepository.getTotalPointsPerUser();
//         return buildPointsResponse("plot", results);
//     }

//     /**
//      * Get total portfolio points per user
//      */
//     public PointsResponseDTO getPortfolioPointsPerUser() {
//         List<Object[]> results = portfolioRatingRepository.getTotalPointsPerUser();
//         return buildPointsResponse("portfolio", results);
//     }

//     /**
//      * Get total tutorial points per user
//      */
//     public PointsResponseDTO getTutorialPointsPerUser() {
//         List<Object[]> results = tutorialVideoRatingRepository.getTotalPointsPerUser();
//         return buildPointsResponse("tutorial", results);
//     }

//     /**
//      * Get plot points for a specific user
//      */
//     public Integer getPlotPointsForUser(Integer userId) {
//         Integer points = plotRatingRepository.sumEarnedPointsByUserId(userId);
//         return points != null ? points : 0;
//     }

//     /**
//      * Get portfolio points for a specific user
//      */
//     public Integer getPortfolioPointsForUser(Integer userId) {
//         Integer points = portfolioRatingRepository.sumEarnedPointsByUserId(userId);
//         return points != null ? points : 0;
//     }

//     /**
//      * Get tutorial points for a specific user
//      */
//     public Integer getTutorialPointsForUser(Integer userId) {
//         Integer points = tutorialVideoRatingRepository.sumEarnedPointsByUserId(userId);
//         return points != null ? points : 0;
//     }

//     /**
//      * Get total points for a user across all categories
//      */
//     public Integer getTotalPointsForUser(Integer userId) {
//         Integer plotPoints = getPlotPointsForUser(userId);
//         Integer portfolioPoints = getPortfolioPointsForUser(userId);
//         Integer tutorialPoints = getTutorialPointsForUser(userId);
//         return plotPoints + portfolioPoints + tutorialPoints;
//     }

//     /**
//      * Get detailed points breakdown for a user
//      */
//     public Map<String, Object> getUserPointsBreakdown(Integer userId) {
//         Map<String, Object> breakdown = new HashMap<>();
//         breakdown.put("userId", userId);
//         breakdown.put("plotPoints", getPlotPointsForUser(userId));
//         breakdown.put("portfolioPoints", getPortfolioPointsForUser(userId));
//         breakdown.put("tutorialPoints", getTutorialPointsForUser(userId));
//         breakdown.put("totalPoints", getTotalPointsForUser(userId));
//         return breakdown;
//     }

//     /**
//      * Build PointsResponseDTO from repository results
//      */
//     private PointsResponseDTO buildPointsResponse(String category, List<Object[]> results) {
//         Map<Integer, Integer> userPoints = new HashMap<>();
//         Integer totalPoints = 0;

//         for (Object[] result : results) {
//             Integer userId = ((Number) result[0]).intValue();
//             Integer points = ((Number) result[1]).intValue();
//             userPoints.put(userId, points);
//             totalPoints += points;
//         }

//         return new PointsResponseDTO(category, userPoints, userPoints.size(), totalPoints);
//     }

//     /**
//      * Get all users with their total points
//      */
//     public Map<Integer, Integer> getAllUsersTotalPoints() {
//         Map<Integer, Integer> allPoints = new HashMap<>();

//         // Add plot points
//         List<Object[]> plotResults = plotRatingRepository.getTotalPointsPerUser();
//         for (Object[] result : plotResults) {
//             Integer userId = ((Number) result[0]).intValue();
//             Integer points = ((Number) result[1]).intValue();
//             allPoints.put(userId, allPoints.getOrDefault(userId, 0) + points);
//         }

//         // Add portfolio points
//         List<Object[]> portfolioResults = portfolioRatingRepository.getTotalPointsPerUser();
//         for (Object[] result : portfolioResults) {
//             Integer userId = ((Number) result[0]).intValue();
//             Integer points = ((Number) result[1]).intValue();
//             allPoints.put(userId, allPoints.getOrDefault(userId, 0) + points);
//         }

//         // Add tutorial points
//         List<Object[]> tutorialResults = tutorialVideoRatingRepository.getTotalPointsPerUser();
//         for (Object[] result : tutorialResults) {
//             Integer userId = ((Number) result[0]).intValue();
//             Integer points = ((Number) result[1]).intValue();
//             allPoints.put(userId, allPoints.getOrDefault(userId, 0) + points);
//         }

//         return allPoints;
//     }
// }


// package com.example.prog.service.userpoints;

// import com.example.prog.dto.userpoints.PointsResponseDTO;
// import com.example.prog.repository.PlotRatingRepository;
// import com.example.prog.repository.PortfolioRatingRepository;
// import com.example.prog.repository.TutorialVideoRatingRepository;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// @Service
// public class PointsAggregationService {

//     private static final Logger logger = LoggerFactory.getLogger(PointsAggregationService.class);

//     @Autowired
//     private PlotRatingRepository plotRatingRepository;

//     @Autowired
//     private PortfolioRatingRepository portfolioRatingRepository;

//     @Autowired
//     private TutorialVideoRatingRepository tutorialVideoRatingRepository;

// public Integer calculatePlotPointsForUser(Integer userId) {
//     try {
//         Integer points = plotRatingRepository.sumEarnedPointsByUserId(userId);
//         return points != null ? points : 0;
//     } catch (Exception e) {
//         logger.error("Error calculating plot points for user {}: {}", userId, e.getMessage());
//         return 0;
//     }
// }

// public Integer calculatePortfolioPointsForUser(Integer userId) {
//     try {
//         Integer points = portfolioRatingRepository.sumEarnedPointsByUserId(userId);
//         return points != null ? points : 0;
//     } catch (Exception e) {
//         logger.error("Error calculating portfolio points for user {}: {}", userId, e.getMessage());
//         return 0;
//     }
// }

// public Integer calculateTutorialPointsForUser(Integer userId) {
//     try {
//         Integer points = tutorialVideoRatingRepository.sumEarnedPointsByUserId(userId);
//         return points != null ? points : 0;
//     } catch (Exception e) {
//         logger.error("Error calculating tutorial points for user {}: {}", userId, e.getMessage());
//         return 0;
//     }
// }
//     /**
//      * Get total plot points per user
//      */
//     public PointsResponseDTO getPlotPointsPerUser() {
//         try {
//             List<Object[]> results = plotRatingRepository.getTotalPointsPerUser();
//             return buildPointsResponse("plot", results);
//         } catch (Exception e) {
//             logger.error("Error fetching plot points per user", e);
//             return new PointsResponseDTO("plot", new HashMap<>(), 0, 0);
//         }
//     }

//     /**
//      * Get total portfolio points per user
//      */
//     public PointsResponseDTO getPortfolioPointsPerUser() {
//         try {
//             List<Object[]> results = portfolioRatingRepository.getTotalPointsPerUser();
//             return buildPointsResponse("portfolio", results);
//         } catch (Exception e) {
//             logger.error("Error fetching portfolio points per user", e);
//             return new PointsResponseDTO("portfolio", new HashMap<>(), 0, 0);
//         }
//     }

//     /**
//      * Get total tutorial points per user
//      */
//     public PointsResponseDTO getTutorialPointsPerUser() {
//         try {
//             List<Object[]> results = tutorialVideoRatingRepository.getTotalPointsPerUser();
//             return buildPointsResponse("tutorial", results);
//         } catch (Exception e) {
//             logger.error("Error fetching tutorial points per user", e);
//             return new PointsResponseDTO("tutorial", new HashMap<>(), 0, 0);
//         }
//     }

//     /**
//      * Get plot points for a specific user
//      */
//     public Integer getPlotPointsForUser(Integer userId) {
//         try {
//             Integer points = plotRatingRepository.sumEarnedPointsByUserId(userId);
//             return points != null ? points : 0;
//         } catch (Exception e) {
//             logger.error("Error fetching plot points for user: {}", userId, e);
//             return 0;
//         }
//     }

//     /**
//      * Get portfolio points for a specific user
//      */
//     public Integer getPortfolioPointsForUser(Integer userId) {
//         try {
//             Integer points = portfolioRatingRepository.sumEarnedPointsByUserId(userId);
//             return points != null ? points : 0;
//         } catch (Exception e) {
//             logger.error("Error fetching portfolio points for user: {}", userId, e);
//             return 0;
//         }
//     }

//     /**
//      * Get tutorial points for a specific user
//      */
//     public Integer getTutorialPointsForUser(Integer userId) {
//         try {
//             Integer points = tutorialVideoRatingRepository.sumEarnedPointsByUserId(userId);
//             return points != null ? points : 0;
//         } catch (Exception e) {
//             logger.error("Error fetching tutorial points for user: {}", userId, e);
//             return 0;
//         }
//     }

//     /**
//      * Get all aggregated points per user from all three tables
//      */
//     public Map<Integer, Map<String, Integer>> getAllUsersAggregatedPoints() {
//         Map<Integer, Map<String, Integer>> allUsersPoints = new HashMap<>();
        
//         try {
//             // Get points from each table
//             Map<Integer, Integer> plotPoints = fetchPointsAsMap(plotRatingRepository.getTotalPointsPerUser());
//             Map<Integer, Integer> portfolioPoints = fetchPointsAsMap(portfolioRatingRepository.getTotalPointsPerUser());
//             Map<Integer, Integer> tutorialPoints = fetchPointsAsMap(tutorialVideoRatingRepository.getTotalPointsPerUser());

//             // Combine all user IDs
//             allUsersPoints.keySet().addAll(plotPoints.keySet());
//             allUsersPoints.keySet().addAll(portfolioPoints.keySet());
//             allUsersPoints.keySet().addAll(tutorialPoints.keySet());

//             // Build complete points map for each user
//             for (Integer userId : allUsersPoints.keySet()) {
//                 Map<String, Integer> userPoints = new HashMap<>();
//                 userPoints.put("plot", plotPoints.getOrDefault(userId, 0));
//                 userPoints.put("portfolio", portfolioPoints.getOrDefault(userId, 0));
//                 userPoints.put("tutorial", tutorialPoints.getOrDefault(userId, 0));
//                 userPoints.put("total", 
//                     userPoints.get("plot") + userPoints.get("portfolio") + userPoints.get("tutorial"));
                
//                 allUsersPoints.put(userId, userPoints);
//             }
            
//             logger.info("Successfully aggregated points for {} users", allUsersPoints.size());
            
//         } catch (Exception e) {
//             logger.error("Error aggregating all users points", e);
//         }
        
//         return allUsersPoints;
//     }

//     private Map<Integer, Integer> fetchPointsAsMap(List<Object[]> results) {
//         Map<Integer, Integer> pointsMap = new HashMap<>();
//         for (Object[] result : results) {
//             try {
//                 Integer userId = ((Number) result[0]).intValue();
//                 Integer points = ((Number) result[1]).intValue();
//                 pointsMap.put(userId, points);
//             } catch (Exception e) {
//                 logger.warn("Error processing result: {}", result, e);
//             }
//         }
//         return pointsMap;
//     }

//     private PointsResponseDTO buildPointsResponse(String category, List<Object[]> results) {
//         Map<Integer, Integer> userPoints = new HashMap<>();
//         Integer totalPoints = 0;

//         for (Object[] result : results) {
//             try {
//                 Integer userId = ((Number) result[0]).intValue();
//                 Integer points = ((Number) result[1]).intValue();
//                 userPoints.put(userId, points);
//                 totalPoints += points;
//             } catch (Exception e) {
//                 logger.warn("Error building points response for category: {}", category, e);
//             }
//         }

//         return new PointsResponseDTO(category, userPoints, userPoints.size(), totalPoints);
//     }
// }


package com.example.prog.service.userpoints;

import com.example.prog.dto.userpoints.PointsResponseDTO;
import com.example.prog.repository.PlotRatingRepository;
import com.example.prog.repository.PortfolioRatingRepository;
import com.example.prog.repository.TutorialVideoRatingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PointsAggregationService {

    private static final Logger logger = LoggerFactory.getLogger(PointsAggregationService.class);

    @Autowired
    private PlotRatingRepository plotRatingRepository;

    @Autowired
    private PortfolioRatingRepository portfolioRatingRepository;

    @Autowired
    private TutorialVideoRatingRepository tutorialVideoRatingRepository;

public Integer calculatePlotPointsForUser(Integer userId) {
    try {
        Integer points = plotRatingRepository.sumEarnedPointsByUserId(userId);
        return points != null ? points : 0;
    } catch (Exception e) {
        logger.error("Error calculating plot points for user {}: {}", userId, e.getMessage());
        return 0;
    }
}

public Integer calculatePortfolioPointsForUser(Integer userId) {
    try {
        Integer points = portfolioRatingRepository.sumEarnedPointsByUserId(userId);
        return points != null ? points : 0;
    } catch (Exception e) {
        logger.error("Error calculating portfolio points for user {}: {}", userId, e.getMessage());
        return 0;
    }
}

public Integer calculateTutorialPointsForUser(Integer userId) {
    try {
        Integer points = tutorialVideoRatingRepository.sumEarnedPointsByUserId(userId);
        return points != null ? points : 0;
    } catch (Exception e) {
        logger.error("Error calculating tutorial points for user {}: {}", userId, e.getMessage());
        return 0;
    }
}
    /**
     * Get total plot points per user
     */
    public PointsResponseDTO getPlotPointsPerUser() {
        try {
            List<Object[]> results = plotRatingRepository.getTotalPointsPerUser();
            return buildPointsResponse("plot", results);
        } catch (Exception e) {
            logger.error("Error fetching plot points per user", e);
            return new PointsResponseDTO("plot", new HashMap<>(), 0, 0);
        }
    }

    /**
     * Get total portfolio points per user
     */
    public PointsResponseDTO getPortfolioPointsPerUser() {
        try {
            List<Object[]> results = portfolioRatingRepository.getTotalPointsPerUser();
            return buildPointsResponse("portfolio", results);
        } catch (Exception e) {
            logger.error("Error fetching portfolio points per user", e);
            return new PointsResponseDTO("portfolio", new HashMap<>(), 0, 0);
        }
    }

    /**
     * Get total tutorial points per user
     */
    public PointsResponseDTO getTutorialPointsPerUser() {
        try {
            List<Object[]> results = tutorialVideoRatingRepository.getTotalPointsPerUser();
            return buildPointsResponse("tutorial", results);
        } catch (Exception e) {
            logger.error("Error fetching tutorial points per user", e);
            return new PointsResponseDTO("tutorial", new HashMap<>(), 0, 0);
        }
    }

    /**
     * Get plot points for a specific user
     */
    public Integer getPlotPointsForUser(Integer userId) {
        try {
            Integer points = plotRatingRepository.sumEarnedPointsByUserId(userId);
            return points != null ? points : 0;
        } catch (Exception e) {
            logger.error("Error fetching plot points for user: {}", userId, e);
            return 0;
        }
    }

    /**
     * Get portfolio points for a specific user
     */
    public Integer getPortfolioPointsForUser(Integer userId) {
        try {
            Integer points = portfolioRatingRepository.sumEarnedPointsByUserId(userId);
            return points != null ? points : 0;
        } catch (Exception e) {
            logger.error("Error fetching portfolio points for user: {}", userId, e);
            return 0;
        }
    }

    /**
     * Get tutorial points for a specific user
     */
    public Integer getTutorialPointsForUser(Integer userId) {
        try {
            Integer points = tutorialVideoRatingRepository.sumEarnedPointsByUserId(userId);
            return points != null ? points : 0;
        } catch (Exception e) {
            logger.error("Error fetching tutorial points for user: {}", userId, e);
            return 0;
        }
    }

    /**
     * Get all aggregated points per user from all three tables
     */
    public Map<Integer, Map<String, Integer>> getAllUsersAggregatedPoints() {
        Map<Integer, Map<String, Integer>> allUsersPoints = new HashMap<>();
        
        try {
            // Get points from each table
            Map<Integer, Integer> plotPoints = fetchPointsAsMap(plotRatingRepository.getTotalPointsPerUser());
            Map<Integer, Integer> portfolioPoints = fetchPointsAsMap(portfolioRatingRepository.getTotalPointsPerUser());
            Map<Integer, Integer> tutorialPoints = fetchPointsAsMap(tutorialVideoRatingRepository.getTotalPointsPerUser());

            // Combine all user IDs
            allUsersPoints.keySet().addAll(plotPoints.keySet());
            allUsersPoints.keySet().addAll(portfolioPoints.keySet());
            allUsersPoints.keySet().addAll(tutorialPoints.keySet());

            // Build complete points map for each user
            for (Integer userId : allUsersPoints.keySet()) {
                Map<String, Integer> userPoints = new HashMap<>();
                userPoints.put("plot", plotPoints.getOrDefault(userId, 0));
                userPoints.put("portfolio", portfolioPoints.getOrDefault(userId, 0));
                userPoints.put("tutorial", tutorialPoints.getOrDefault(userId, 0));
                userPoints.put("total", 
                    userPoints.get("plot") + userPoints.get("portfolio") + userPoints.get("tutorial"));
                
                allUsersPoints.put(userId, userPoints);
            }
            
            logger.info("Successfully aggregated points for {} users", allUsersPoints.size());
            
        } catch (Exception e) {
            logger.error("Error aggregating all users points", e);
        }
        
        return allUsersPoints;
    }

    private Map<Integer, Integer> fetchPointsAsMap(List<Object[]> results) {
        Map<Integer, Integer> pointsMap = new HashMap<>();
        for (Object[] result : results) {
            try {
                Integer userId = ((Number) result[0]).intValue();
                Integer points = ((Number) result[1]).intValue();
                pointsMap.put(userId, points);
            } catch (Exception e) {
                logger.warn("Error processing result: {}", result, e);
            }
        }
        return pointsMap;
    }

    private PointsResponseDTO buildPointsResponse(String category, List<Object[]> results) {
        Map<Integer, Integer> userPoints = new HashMap<>();
        Integer totalPoints = 0;

        for (Object[] result : results) {
            try {
                Integer userId = ((Number) result[0]).intValue();
                Integer points = ((Number) result[1]).intValue();
                userPoints.put(userId, points);
                totalPoints += points;
            } catch (Exception e) {
                logger.warn("Error building points response for category: {}", category, e);
            }
        }

        return new PointsResponseDTO(category, userPoints, userPoints.size(), totalPoints);
    }
}