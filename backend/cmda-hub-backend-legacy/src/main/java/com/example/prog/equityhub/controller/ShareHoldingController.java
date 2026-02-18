// package com.example.prog.equityhub.controller;

// import java.util.Collections;
// import java.util.List;
// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Qualifier;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// @RequestMapping("api/Shareholding")
// public class ShareHoldingController {

// 	@Autowired
// 	@Qualifier("accordJdbcTemplate")
// 	private JdbcTemplate jdbcTemplate;
	
// 	@GetMapping("summary/{symbol}")
// 	public ResponseEntity<List<Map<String, Object>>> getShareDataBySymbol(@PathVariable String symbol) {
// 		String sql = "SELECT shp.* " +
// 				"FROM Share_Holding_Patterns shp " +
// 				"INNER JOIN ( " +
// 				   " SELECT Fincode, MAX(DATE_END) AS MaxDate " +
// 				   " FROM Share_Holding_Patterns " +
// 				   " GROUP BY Fincode" +
// 				" ) latest " +
// 				" ON shp.Fincode = latest.Fincode " +
// 				" AND shp.DATE_END = latest.MaxDate " +
// 				" WHERE Symbol = ? " ;
// 		try {
// 			List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, symbol);
// 			return ResponseEntity.ok(result);
// 		} catch (Exception e) {
// 			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
// 					.body(Collections.singletonList(Map.of("error",e.getMessage())));
// 		}	
// 	}
	
// 	@GetMapping("Overall/{symbol}")
// 	public ResponseEntity<List<Map<String, Object>>> getShareOvDataBySymbol(@PathVariable String symbol) {
// 		String sql = "WITH RankedData AS ("
// 				+ "    SELECT *, "
// 				+ "           ROW_NUMBER() OVER (PARTITION BY Fincode ORDER BY DATE_END DESC) AS rn "
// 				+ "    FROM Share_Holding_Patterns "
// 				+ ") "
// 				+ "SELECT * "
// 				+ "FROM RankedData "
// 				+ "WHERE rn <= 5 AND Symbol = ? "
// 				+ "ORDER BY Fincode, DATE_END DESC";
		
// 		try {
// 			List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, symbol);
// 			return ResponseEntity.ok(result);
// 		} catch (Exception e) {
// 			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
// 					.body(Collections.singletonList(Map.of("error",e.getMessage())));
// 		}	
// 	}
	
// }


package com.example.prog.equityhub.controller;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.UserDtls;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.repository.UserRepository;
import com.example.prog.service.RatingService;
import com.example.prog.service.UserActivityService;
import com.example.prog.token.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("api/Shareholding")
public class ShareHoldingController {

    @Autowired
    @Qualifier("accordJdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private CorporateUserRepository corporateUserRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserActivityService userActivityService;

    @Autowired
    private RatingService ratingService;

    private static final Logger logger = LoggerFactory.getLogger(ShareHoldingController.class);

    // Valid plot types for shareholding
    private static final Set<String> VALID_PLOT_TYPES = new HashSet<>(List.of(
        "shareholding_summary",
        "shareholding_overall"
    ));

    // Extract user details from JWT token
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

    // Log user activity
    private void logUserActivity(String email, String userType, String activityType) {
        if (email == null) {
            email = "UNKNOWN";
        }
        userActivityService.logUserActivity(email, userType, activityType);
    }

	@GetMapping("summary/{symbol}")
	public ResponseEntity<List<Map<String, Object>>> getShareDataBySymbol(@PathVariable String symbol) {
		String sql = "SELECT shp.* " +
				"FROM Share_Holding_Patterns shp " +
				"INNER JOIN ( " +
				   " SELECT Fincode, MAX(DATE_END) AS MaxDate " +
				   " FROM Share_Holding_Patterns " +
				   " GROUP BY Fincode" +
				" ) latest " +
				" ON shp.Fincode = latest.Fincode " +
				" AND shp.DATE_END = latest.MaxDate " +
				" WHERE Symbol = ? " ;
		try {
			List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, symbol);
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Collections.singletonList(Map.of("error",e.getMessage())));
		}	
	}
	
	@GetMapping("Overall/{symbol}")
	public ResponseEntity<List<Map<String, Object>>> getShareOvDataBySymbol(@PathVariable String symbol) {
		String sql = "WITH RankedData AS ("
				+ "    SELECT *, "
				+ "           ROW_NUMBER() OVER (PARTITION BY Fincode ORDER BY DATE_END DESC) AS rn "
				+ "    FROM Share_Holding_Patterns "
				+ ") "
				+ "SELECT * "
				+ "FROM RankedData "
				+ "WHERE rn <= 5 AND Symbol = ? "
				+ "ORDER BY Fincode, DATE_END DESC";
		
		try {
			List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, symbol);
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Collections.singletonList(Map.of("error",e.getMessage())));
		}	
	}

    @PostMapping("/ratings/{plotType}")
    public ResponseEntity<String> submitRating(
            @PathVariable String plotType,
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

            // Validate plotType
            if (!VALID_PLOT_TYPES.contains(plotType)) {
                return ResponseEntity.badRequest().body("Invalid plot type: " + plotType);
            }

            ratingService.submitRating(plotType, userId, userType, rating);
            logUserActivity(email, userType, "SUBMIT_RATING_" + plotType);
            return ResponseEntity.ok("Rating submitted successfully");
        } catch (RuntimeException e) {
            logUserActivity(null, "UNKNOWN", "SUBMIT_RATING");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: " + e.getMessage());
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "SUBMIT_RATING");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error submitting rating: " + e.getMessage());
        }
    }

    // @GetMapping("/ratings/{plotType}/average")
    // public ResponseEntity<Double> getAverageRating(@PathVariable String plotType) {
    //     try {
    //         // Validate plotType
    //         if (!VALID_PLOT_TYPES.contains(plotType)) {
    //             return ResponseEntity.badRequest().body(0.0);
    //         }

    //         Double average = ratingService.getAverage(plotType);
    //         return ResponseEntity.ok(average);
    //     } catch (Exception e) {
    //         logger.error("Error fetching average rating for plotType {}: {}", plotType, e.getMessage());
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0.0);
    //     }
    // }


        @GetMapping("/ratings/{plotType}/average")
    public ResponseEntity<Map<String, Double>> getAverageRating(@PathVariable String plotType) {
        try {
            // Validate plotType
            if (!VALID_PLOT_TYPES.contains(plotType)) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("average_rating", 0.0));
            }

            Double average = ratingService.getAverage(plotType);
            return ResponseEntity.ok(Collections.singletonMap("average_rating", average));
        } catch (Exception e) {
            logger.error("Error fetching average rating for plotType {}: {}", plotType, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("average_rating", 0.0));
        }
    }

    @GetMapping("/ratings/{plotType}/user")
    public ResponseEntity<Integer> getUserRating(@PathVariable String plotType, HttpServletRequest request) {
        try {
            // Validate plotType
            if (!VALID_PLOT_TYPES.contains(plotType)) {
                return ResponseEntity.badRequest().body(0);
            }

            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
            String userType = (String) userDetails.get("userType");
            Integer userId = (Integer) userDetails.get("userId");

            Integer userRating = ratingService.getUserRating(plotType, userId, userType);
            return ResponseEntity.ok(userRating);
        } catch (RuntimeException e) {
            logUserActivity(null, "UNKNOWN", "GET_USER_RATING");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(0);
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "GET_USER_RATING");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0);
        }
    }
}