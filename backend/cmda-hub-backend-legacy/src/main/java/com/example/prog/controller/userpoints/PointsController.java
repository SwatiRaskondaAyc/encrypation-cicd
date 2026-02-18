// ------------wc----------------------


// package com.example.prog.controller.userpoints;

// import com.example.prog.dto.userpoints.PointsResponseDTO;
// import com.example.prog.dto.userpoints.UserPointsSummaryDTO;
// import com.example.prog.service.userpoints.PointsAggregationService;
// import com.example.prog.service.userpoints.UserPointsSummaryService;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.time.LocalDateTime;
// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/points")
// public class PointsController {

//     private static final Logger logger = LoggerFactory.getLogger(PointsController.class);

//     @Autowired
//     private PointsAggregationService pointsAggregationService;

//     @Autowired
//     private UserPointsSummaryService userPointsSummaryService;

//     /**
//      * GET /api/points/summary/my-points
//      * Get points summary for current user using JWT token
//      */
//     @GetMapping("/summary/my-points")
//     public ResponseEntity<?> getMyPointsSummary(@RequestHeader("Authorization") String authorizationHeader) {
//         try {
//             // Extract token from Authorization header
//             String token = extractTokenFromHeader(authorizationHeader);
            
//             UserPointsSummaryDTO summary = userPointsSummaryService.getUserPointsSummaryByToken(token);
            
//             Map<String, Object> response = new HashMap<>();
//             response.put("success", true);
//             response.put("message", "Points summary retrieved successfully");
//             response.put("data", summary);
//             response.put("timestamp", LocalDateTime.now().toString());
            
//             return ResponseEntity.ok(response);
            
//         } catch (Exception e) {
//             logger.error("Error getting points summary from token", e);
            
//             Map<String, Object> errorResponse = new HashMap<>();
//             errorResponse.put("success", false);
//             errorResponse.put("error", "Failed to fetch user points summary");
//             errorResponse.put("message", e.getMessage());
//             errorResponse.put("timestamp", LocalDateTime.now().toString());
            
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
//         }
//     }

//     /**
//      * GET /api/points/plot
//      */
//     @GetMapping("/plot")
//     public ResponseEntity<PointsResponseDTO> getPlotPoints() {
//         try {
//             PointsResponseDTO response = pointsAggregationService.getPlotPointsPerUser();
//             return ResponseEntity.ok(response);
//         } catch (Exception e) {
//             logger.error("Error in getPlotPoints", e);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//         }
//     }

//     /**
//      * GET /api/points/portfolio
//      */
//     @GetMapping("/portfolio")
//     public ResponseEntity<PointsResponseDTO> getPortfolioPoints() {
//         try {
//             PointsResponseDTO response = pointsAggregationService.getPortfolioPointsPerUser();
//             return ResponseEntity.ok(response);
//         } catch (Exception e) {
//             logger.error("Error in getPortfolioPoints", e);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//         }
//     }

//     /**
//      * GET /api/points/tutorial
//      */
//     @GetMapping("/tutorial")
//     public ResponseEntity<PointsResponseDTO> getTutorialPoints() {
//         try {
//             PointsResponseDTO response = pointsAggregationService.getTutorialPointsPerUser();
//             return ResponseEntity.ok(response);
//         } catch (Exception e) {
//             logger.error("Error in getTutorialPoints", e);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//         }
//     }

//     /**
//      * GET /api/points/summary/user/{userId} - Keep for admin purposes
//      */
//     @GetMapping("/summary/user/{userId}")
//     public ResponseEntity<?> getUserPointsSummary(@PathVariable Integer userId) {
//         try {
//             UserPointsSummaryDTO summary = userPointsSummaryService.getUserPointsSummary(userId);
//             return ResponseEntity.ok(summary);
//         } catch (Exception e) {
//             logger.error("Error getting summary for user {}", userId, e);
            
//             Map<String, Object> errorResponse = new HashMap<>();
//             errorResponse.put("error", "Failed to fetch user points summary");
//             errorResponse.put("userId", userId);
            
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
//         }
//     }

//     /**
//      * GET /api/points/status
//      */
//     @GetMapping("/status")
//     public ResponseEntity<Map<String, Object>> getServiceStatus() {
//         Map<String, Object> status = new HashMap<>();
//         status.put("service", "Points Aggregation Service");
//         status.put("status", "ACTIVE");
//         status.put("timestamp", LocalDateTime.now().toString());
//         status.put("version", "2.0");
//         status.put("features", "JWT Token Support, User Type Tracking");
        
//         return ResponseEntity.ok(status);
//     }

//     /**
//      * Helper method to extract token from Authorization header
//      */
//     private String extractTokenFromHeader(String authorizationHeader) {
//         if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
//             return authorizationHeader.substring(7);
//         }
//         throw new RuntimeException("Invalid Authorization header. Must start with 'Bearer '");
//     }
// }


package com.example.prog.controller.userpoints;

import com.example.prog.dto.userpoints.PointsResponseDTO;
import com.example.prog.dto.userpoints.UserPointsSummaryDTO;
import com.example.prog.service.userpoints.PointsAggregationService;
import com.example.prog.service.userpoints.UserPointsSummaryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/points")
public class PointsController {

    private static final Logger logger = LoggerFactory.getLogger(PointsController.class);

    @Autowired
    private PointsAggregationService pointsAggregationService;

    @Autowired
    private UserPointsSummaryService userPointsSummaryService;

    
    /**
     * POST /api/points/recalculate/{userId}
     * Recalculate and update points for a specific user
     */
    @PostMapping("/recalculate/{userId}")
    public ResponseEntity<?> recalculateUserPoints(@PathVariable Integer userId) {
        try {
            logger.info("Recalculating points for user ID: {}", userId);
            
            // Recalculate points from all sources
            Integer plotPoints = pointsAggregationService.calculatePlotPointsForUser(userId);
            Integer portfolioPoints = pointsAggregationService.calculatePortfolioPointsForUser(userId);
            Integer tutorialPoints = pointsAggregationService.calculateTutorialPointsForUser(userId);
            
            int totalPoints = plotPoints + portfolioPoints + tutorialPoints;
            
            // Update user points summary
            UserPointsSummaryDTO updatedSummary = userPointsSummaryService.updateUserPointsSummary(
                userId, plotPoints, portfolioPoints, tutorialPoints, totalPoints
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Points recalculated successfully");
            response.put("userId", userId);
            response.put("recalculatedPoints", Map.of(
                "plotPoints", plotPoints,
                "portfolioPoints", portfolioPoints,
                "tutorialPoints", tutorialPoints,
                "totalPoints", totalPoints
            ));
            response.put("updatedSummary", updatedSummary);
            response.put("timestamp", LocalDateTime.now().toString());
            
            logger.info("Successfully recalculated points for user ID: {}. Total: {}", userId, totalPoints);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error recalculating points for user ID: {}", userId, e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to recalculate user points");
            errorResponse.put("userId", userId);
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now().toString());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * POST /api/points/recalculate/all
     * Recalculate points for all users (admin functionality)
     */
    @PostMapping("/recalculate/all")
    public ResponseEntity<?> recalculateAllUsersPoints() {
        try {
            logger.info("Recalculating points for all users");
            
            Map<String, Object> result = userPointsSummaryService.recalculateAllUsersPoints();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Points recalculated for all users successfully");
            response.put("data", result);
            response.put("timestamp", LocalDateTime.now().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error recalculating points for all users", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to recalculate points for all users");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now().toString());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }


   @GetMapping("/summary/my-points")
    public ResponseEntity<?> getMyPointsSummary(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // Extract token from Authorization header
            String token = extractTokenFromHeader(authorizationHeader);
            
            UserPointsSummaryDTO summary = userPointsSummaryService.getUserPointsSummaryByToken(token);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Points summary retrieved successfully");
            response.put("data", summary);
            response.put("timestamp", LocalDateTime.now().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error getting points summary from token", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch user points summary");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now().toString());
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    /**
     * GET /api/points/plot
     */
    @GetMapping("/plot")
    public ResponseEntity<PointsResponseDTO> getPlotPoints() {
        try {
            PointsResponseDTO response = pointsAggregationService.getPlotPointsPerUser();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in getPlotPoints", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/points/portfolio
     */
    @GetMapping("/portfolio")
    public ResponseEntity<PointsResponseDTO> getPortfolioPoints() {
        try {
            PointsResponseDTO response = pointsAggregationService.getPortfolioPointsPerUser();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in getPortfolioPoints", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/points/tutorial
     */
    @GetMapping("/tutorial")
    public ResponseEntity<PointsResponseDTO> getTutorialPoints() {
        try {
            PointsResponseDTO response = pointsAggregationService.getTutorialPointsPerUser();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in getTutorialPoints", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/points/summary/user/{userId} - Keep for admin purposes
     */
    @GetMapping("/summary/user/{userId}")
    public ResponseEntity<?> getUserPointsSummary(@PathVariable Integer userId) {
        try {
            UserPointsSummaryDTO summary = userPointsSummaryService.getUserPointsSummary(userId);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            logger.error("Error getting summary for user {}", userId, e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch user points summary");
            errorResponse.put("userId", userId);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * GET /api/points/status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getServiceStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "Points Aggregation Service");
        status.put("status", "ACTIVE");
        status.put("timestamp", LocalDateTime.now().toString());
        status.put("version", "2.0");
        status.put("features", "JWT Token Support, User Type Tracking, Points Recalculation");
        
        return ResponseEntity.ok(status);
    }

    /**
     * Helper method to extract token from Authorization header
     */
    private String extractTokenFromHeader(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        throw new RuntimeException("Invalid Authorization header. Must start with 'Bearer '");
    }

   
}