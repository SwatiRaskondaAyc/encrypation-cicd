package com.example.prog.controller.userpoints;

import com.example.prog.service.userpoints.PointsAggregationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/points")
public class PointsAggregationController {

    @Autowired
    private PointsAggregationService pointsAggregationService;

    /**
     * POST /api/points/summary/update-all
     * Aggregates all user points and updates the summary table
     */
    // @PostMapping("/summary/update-all")
    // public ResponseEntity<Map<String, Object>> updateAllUsersPointsSummary() {
    //     try {
    //         Map<String, Object> result = pointsAggregationService.updateAllUsersPointsSummary();
    //         return ResponseEntity.ok(result);
    //     } catch (Exception e) {
    //         Map<String, Object> errorResponse = new HashMap<>();
    //         errorResponse.put("status", "ERROR");
    //         errorResponse.put("message", "Failed to update points summary: " + e.getMessage());
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    //     }
    // }

    /**
     * GET /api/points/summary/user/{userId}
     * Get points summary for a specific user
    //  */
    // @GetMapping("/summary/user/{userId}")
    // public ResponseEntity<Map<String, Object>> getUserPointsSummary(@PathVariable Integer userId) {
    //     try {
    //         Map<String, Object> summary = pointsAggregationService.getUserPointsSummary(userId);
    //         return ResponseEntity.ok(summary);
    //     } catch (Exception e) {
    //         Map<String, Object> errorResponse = new HashMap<>();
    //         errorResponse.put("error", "Failed to fetch user points summary: " + e.getMessage());
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    //     }
    // }

    /**
     * GET /api/points/summary/status
     * Get aggregation status and statistics
     */
    @GetMapping("/summary/status")
    public ResponseEntity<Map<String, Object>> getAggregationStatus() {
        try {
            // This would typically check database counts and recent activity
            Map<String, Object> status = new HashMap<>();
            status.put("service", "Points Aggregation Service");
            status.put("status", "ACTIVE");
            status.put("lastUpdated", java.time.LocalDateTime.now());
            status.put("supportedOperations", new String[]{
                "updateAllUsersPointsSummary", 
                "getUserPointsSummary"
            });
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get service status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}