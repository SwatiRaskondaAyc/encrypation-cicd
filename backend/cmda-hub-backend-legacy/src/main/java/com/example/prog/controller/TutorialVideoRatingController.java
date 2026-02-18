package com.example.prog.controller;

import com.example.prog.entity.TutorialVideoRating;
import com.example.prog.service.TutorialVideoRatingService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.repository.UserRepository;
import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.UserDtls;

import java.util.*;

import com.example.prog.token.JwtUtil;

@RestController
@RequestMapping("/api/ratings")
public class TutorialVideoRatingController {

    private static final Logger logger = LoggerFactory.getLogger(TutorialVideoRatingController.class);

    private static final List<String> VALID_VIDEO_NAMES = Arrays.asList(
        "Introduction to Search Features",
        "Market Mood",
        "Box Plot",
        "Trend Tapestry",
        "Sensex & Stock Fluctuation",
        "Sensex Impact Calculator",
        "MACD Indicator",
        "Sensex Symphony",
        "Breach Busters",
        "PE vs EPS vs Book Value",
        "Pegy Worm Plot Analysis",
        "Price Spread Over Time"
    );

    @Autowired
    private TutorialVideoRatingService ratingService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CorporateUserRepository corporateUserRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{videoName}")
    public ResponseEntity<String> submitRating(
            @PathVariable String videoName,
            @RequestBody Map<String, Integer> body,
            HttpServletRequest request) {
        try {
            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
            String email = (String) userDetails.get("email");
            String userType = (String) userDetails.get("userType");
            Integer userId = (Integer) userDetails.get("userId");

            Integer rating = body.get("rating");
            if (rating == null || rating < 1 || rating > 5) {
                return ResponseEntity.badRequest().body("Invalid rating value. Must be between 1 and 5.");
            }

            // Validate video name
            if (!VALID_VIDEO_NAMES.contains(videoName)) {
                return ResponseEntity.badRequest().body("Invalid video name: " + videoName);
            }

            ratingService.rateVideo(videoName, userId, userType, rating);
            logUserActivity(email, userType, "SUBMIT_RATING_" + videoName, null);
            return ResponseEntity.ok("Rating submitted successfully");
        } catch (RuntimeException e) {
            logUserActivity(null, "UNKNOWN", "SUBMIT_RATING", null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: " + e.getMessage());
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "SUBMIT_RATING", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error submitting rating: " + e.getMessage());
        }
    }

    // @GetMapping("/ratings/{videoName}/average")
    // public ResponseEntity<Double> getAverageRating(@PathVariable String videoName) {
    //     try {
    //         // Validate video name
    //         if (!VALID_VIDEO_NAMES.contains(videoName)) {
    //             return ResponseEntity.badRequest().body(0.0);
    //         }

    //         Double average = ratingService.getAverageRating(videoName);
    //         return ResponseEntity.ok(average);
    //     } catch (Exception e) {
    //         logger.error("Error fetching average rating for videoName {}: {}", videoName, e.getMessage());
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0.0);
    //     }
    // }

    @GetMapping("/{videoName}/average")
public ResponseEntity<Map<String, Double>> getAverageRating(@PathVariable String videoName) {
    try {
        // Validate video name
        if (!VALID_VIDEO_NAMES.contains(videoName)) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("average_rating", 0.0));
        }

        Double average = ratingService.getAverageRating(videoName);
        return ResponseEntity.ok(Collections.singletonMap("average_rating", average));
    } catch (Exception e) {
        logger.error("Error fetching average rating for videoName {}: {}", videoName, e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("average_rating", 0.0));
    }
}

    @GetMapping("/{videoName}/user")
    public ResponseEntity<Integer> getUserRating(@PathVariable String videoName, HttpServletRequest request) {
        try {
            // Validate video name
            if (!VALID_VIDEO_NAMES.contains(videoName)) {
                return ResponseEntity.badRequest().body(0);
            }

            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
            String userType = (String) userDetails.get("userType");
            Integer userId = (Integer) userDetails.get("userId");

            Integer userRating = ratingService.getUserRating(videoName, userId, userType);
            return ResponseEntity.ok(userRating);
        } catch (RuntimeException e) {
            logUserActivity(null, "UNKNOWN", "GET_USER_RATING", null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(0);
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "GET_USER_RATING", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0);
        }
    }

    private Map<String, Object> extractUserDetailsFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String jwtToken = authHeader.substring(7);
        String email = jwtUtil.extractEmail(jwtToken);

        CorporateUser corporateUser = corporateUserRepository.findByemail(email);
        if (corporateUser != null) {
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("email", email);
            userDetails.put("userType", "corporate");
            userDetails.put("userId", corporateUser.getId());
            return userDetails;
        }

        Optional<UserDtls> individualUserOpt = userRepository.findByEmail(email);
        if (individualUserOpt.isPresent()) {
            UserDtls individualUser = individualUserOpt.get();
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("email", email);
            userDetails.put("userType", "individual");
            userDetails.put("userId", individualUser.getUserID());
            return userDetails;
        }

        throw new RuntimeException("User not found for email: " + email);
    }

    private void logUserActivity(String email, String userType, String action, String details) {
        logger.info("UserActivity: email={}, userType={}, action={}, details={}", 
                    email != null ? email : "null", 
                    userType, 
                    action, 
                    details != null ? details : "null");
    }
}