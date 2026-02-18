package com.example.prog.equityhub.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

@RestController
@RequestMapping("/api/financial")
public class FinancialOverviewController {

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

    private static final Logger logger = LoggerFactory.getLogger(FinancialOverviewController.class);

    // Valid plot types for financial data
    private static final Set<String> VALID_PLOT_TYPES = new HashSet<>(List.of(
        "financial_overview",
        "balance_sheet",
        "income_statement",
        "cash_flow_statement",
        "financial_ratios"
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


        @GetMapping("fin_ov/{symbol}")
    public ResponseEntity<List<Map<String, Object>>> getFinancialDataBySymbol(@PathVariable String symbol) {
        String sql = "SELECT cm.SYMBOL, cm.COMPNAME, fo.* " +
                     "FROM vw_financials_overview fo " +
                     "JOIN Company_master cm ON fo.FINCODE = cm.FINCODE " +
                     "WHERE cm.SYMBOL = ?";

        List<Map<String, Object>> result = null;
        try {
            result = jdbcTemplate.queryForList(sql, symbol);
        } catch (Exception e) {
            result = null;
        }

        if (result == null || result.isEmpty()) {
            try {
                String fallbackSql =
                        "WITH ranked AS ( " +
                        "  SELECT cm.SYMBOL, cm.COMPNAME, pl.*, " +
                        "    ROW_NUMBER() OVER ( " +
                        "      PARTITION BY pl.FINCODE, pl.Year_end " +
                        "      ORDER BY CASE WHEN pl.Type = 'S' THEN 0 ELSE 1 END, pl.No_Months DESC " +
                        "    ) AS rn " +
                        "  FROM dbo.Finance_pl pl " +
                        "  JOIN Company_master cm ON cm.FINCODE = pl.FINCODE " +
                        "  WHERE cm.SYMBOL = ? " +
                        ") " +
                        "SELECT * FROM ranked WHERE rn = 1 ORDER BY Year_end";
                result = jdbcTemplate.queryForList(fallbackSql, symbol);
            } catch (Exception e) {
                result = null;
            }
        }

        if (result == null || result.isEmpty()) {
            try {
                String viewFallbackSql = "SELECT cm.SYMBOL, cm.COMPNAME, fo.* " +
                        "FROM vw_income_statement fo " +
                        "JOIN Company_master cm ON fo.FINCODE = cm.FINCODE " +
                        "WHERE cm.SYMBOL = ?";
                result = jdbcTemplate.queryForList(viewFallbackSql, symbol);
            } catch (Exception e) {
                result = Collections.emptyList();
            }
        }

        return ResponseEntity.ok(result);
    }
    
    @GetMapping("balance_sheet/{symbol}")
    public ResponseEntity<List<Map<String, Object>>> getBalanceSheetDataBySymbol(@PathVariable String symbol) {
        // Finance_bs can have multiple rows per Year_end with different No_months.
        // Pick the "best" row per Year_end: prefer 12 months, else largest No_months.
        String sql =
                "WITH ranked AS ( " +
                "  SELECT cm.SYMBOL, cm.COMPNAME, bs.*, " +
                "    ROW_NUMBER() OVER ( " +
                "      PARTITION BY bs.Fincode, bs.Year_end, bs.Type " +
                "      ORDER BY CASE WHEN bs.No_months = 12 THEN 0 ELSE 1 END, bs.No_months DESC " +
                "    ) AS rn " +
                "  FROM dbo.Finance_bs bs " +
                "  JOIN Company_master cm ON cm.FINCODE = bs.Fincode " +
                "  WHERE cm.SYMBOL = ? AND bs.Type = 'S' " +
                ") " +
                "SELECT * FROM ranked WHERE rn = 1 ORDER BY Year_end";

        Exception lastError = null;
        List<Map<String, Object>> result = null;
        try {
            result = jdbcTemplate.queryForList(sql, symbol);
        } catch (Exception e) {
            lastError = e;
            result = null;
        }

        if (result == null || result.isEmpty()) {
            try {
                String fallbackSql =
                        "WITH ranked AS ( " +
                        "  SELECT cm.SYMBOL, cm.COMPNAME, bs.*, " +
                        "    ROW_NUMBER() OVER ( " +
                        "      PARTITION BY bs.Fincode, bs.Year_end " +
                        "      ORDER BY CASE WHEN bs.Type = 'S' THEN 0 ELSE 1 END, bs.No_months DESC " +
                        "    ) AS rn " +
                        "  FROM dbo.Finance_bs bs " +
                        "  JOIN Company_master cm ON cm.FINCODE = bs.Fincode " +
                        "  WHERE cm.SYMBOL = ? " +
                        ") " +
                        "SELECT * FROM ranked WHERE rn = 1 ORDER BY Year_end";
                result = jdbcTemplate.queryForList(fallbackSql, symbol);
            } catch (Exception e) {
                lastError = e;
                result = null;
            }
        }

        if (result == null || result.isEmpty()) {
            try {
                String viewFallbackSql = "SELECT cm.SYMBOL, cm.COMPNAME, fo.* " +
                        "FROM dbo.vw_balance_sheet fo " +
                        "JOIN Company_master cm ON fo.FINCODE = cm.FINCODE " +
                        "WHERE cm.SYMBOL = ?";
                result = jdbcTemplate.queryForList(viewFallbackSql, symbol);
            } catch (Exception e) {
                lastError = e;
                result = null;
            }
        }

        if (result == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(Map.of("error", lastError != null ? lastError.getMessage() : "Unknown error")));
        }

        return ResponseEntity.ok(result);
    }
    
    
    @GetMapping("income_state/{symbol}")
    public ResponseEntity<List<Map<String, Object>>> getIncomeSateDataBySymbol(@PathVariable String symbol) {
        String sql = "SELECT cm.SYMBOL, cm.COMPNAME,  fo.* " +
                     "FROM vw_income_statement fo " +
                     "join Company_master cm on fo.FINCODE = cm.FINCODE " +
                     "WHERE cm.SYMBOL = ?";

        try {
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, symbol);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(Map.of("error", e.getMessage())));
        }
    }

    @GetMapping("profit_loss/{symbol}")
    public ResponseEntity<List<Map<String, Object>>> getProfitLossDataBySymbol(@PathVariable String symbol) {
        // Finance_pl can have multiple rows per Year_end with different No_Months (interims, odd periods).
        // Pick the "best" row per Year_end: prefer 12 months, else largest No_Months.
        String sql =
                "WITH ranked AS ( " +
                "  SELECT cm.SYMBOL, cm.COMPNAME, pl.*, " +
                "    ROW_NUMBER() OVER ( " +
                "      PARTITION BY pl.FINCODE, pl.Year_end, pl.TYPE " +
                "      ORDER BY CASE WHEN pl.No_Months = 12 THEN 0 ELSE 1 END, pl.No_Months DESC " +
                "    ) AS rn " +
                "  FROM dbo.Finance_pl pl " +
                "  JOIN Company_master cm ON cm.FINCODE = pl.FINCODE " +
                "  WHERE cm.SYMBOL = ? AND pl.TYPE = 'S' " +
                ") " +
                "SELECT * FROM ranked WHERE rn = 1 ORDER BY Year_end";

        List<Map<String, Object>> result = null;
        try {
            result = jdbcTemplate.queryForList(sql, symbol);
        } catch (Exception e) {
            result = null;
        }

        if (result == null || result.isEmpty()) {
            try {
                String fallbackSql =
                        "WITH ranked AS ( " +
                        "  SELECT cm.SYMBOL, cm.COMPNAME, pl.*, " +
                        "    ROW_NUMBER() OVER ( " +
                        "      PARTITION BY pl.FINCODE, pl.Year_end " +
                        "      ORDER BY CASE WHEN pl.TYPE = 'S' THEN 0 ELSE 1 END, pl.No_Months DESC " +
                        "    ) AS rn " +
                        "  FROM dbo.Finance_pl pl " +
                        "  JOIN Company_master cm ON cm.FINCODE = pl.FINCODE " +
                        "  WHERE cm.SYMBOL = ? " +
                        ") " +
                        "SELECT * FROM ranked WHERE rn = 1 ORDER BY Year_end";
                result = jdbcTemplate.queryForList(fallbackSql, symbol);
            } catch (Exception e) {
                result = null;
            }
        }

        if (result == null || result.isEmpty()) {
            try {
                String viewFallbackSql = "SELECT cm.SYMBOL, cm.COMPNAME, fo.* " +
                        "FROM vw_income_statement fo " +
                        "JOIN Company_master cm ON fo.FINCODE = cm.FINCODE " +
                        "WHERE cm.SYMBOL = ?";
                result = jdbcTemplate.queryForList(viewFallbackSql, symbol);
            } catch (Exception e) {
                result = Collections.emptyList();
            }
        }

        return ResponseEntity.ok(result);
    }
    
    @GetMapping("CashFlow_state/{symbol}")
    public ResponseEntity<List<Map<String, Object>>> getCashFlowStateDataBySymbol(@PathVariable String symbol) {
        // Finance_cf can have multiple rows per Year_end with different No_Months.
        // Pick the "best" row per Year_end: prefer 12 months, else largest No_Months.
        String sql =
                "WITH ranked AS ( " +
                "  SELECT cm.SYMBOL, cm.COMPNAME, cf.*, " +
                "    ROW_NUMBER() OVER ( " +
                "      PARTITION BY cf.FINCODE, cf.Year_end, cf.type " +
                "      ORDER BY CASE WHEN cf.No_Months = 12 THEN 0 ELSE 1 END, cf.No_Months DESC " +
                "    ) AS rn " +
                "  FROM dbo.Finance_cf cf " +
                "  JOIN Company_master cm ON cm.FINCODE = cf.FINCODE " +
                "  WHERE cm.SYMBOL = ? AND cf.type = 'S' " +
                ") " +
                "SELECT * FROM ranked WHERE rn = 1 ORDER BY Year_end";
        Exception lastError = null;
        List<Map<String, Object>> result = null;
        try {
            result = jdbcTemplate.queryForList(sql, symbol);
        } catch (Exception e) {
            lastError = e;
            result = null;
        }

        if (result == null || result.isEmpty()) {
            try {
                String fallbackSql =
                        "WITH ranked AS ( " +
                        "  SELECT cm.SYMBOL, cm.COMPNAME, cf.*, " +
                        "    ROW_NUMBER() OVER ( " +
                        "      PARTITION BY cf.FINCODE, cf.Year_end " +
                        "      ORDER BY CASE WHEN cf.Type = 'S' THEN 0 ELSE 1 END, cf.No_Months DESC " +
                        "    ) AS rn " +
                        "  FROM dbo.Finance_cf cf " +
                        "  JOIN Company_master cm ON cm.FINCODE = cf.FINCODE " +
                        "  WHERE cm.SYMBOL = ? " +
                        ") " +
                        "SELECT * FROM ranked WHERE rn = 1 ORDER BY Year_end";
                result = jdbcTemplate.queryForList(fallbackSql, symbol);
            } catch (Exception e) {
                lastError = e;
                result = null;
            }
        }

        if (result == null || result.isEmpty()) {
            try {
                String viewFallbackSql = "SELECT cm.SYMBOL, cm.COMPNAME, fo.* " +
                        "FROM dbo.vw_cash_flow_statement fo " +
                        "JOIN Company_master cm ON fo.FINCODE = cm.FINCODE " +
                        "WHERE cm.SYMBOL = ?";
                result = jdbcTemplate.queryForList(viewFallbackSql, symbol);
            } catch (Exception e) {
                lastError = e;
                result = null;
            }
        }

        if (result == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(Map.of("error", lastError != null ? lastError.getMessage() : "Unknown error")));
        }

        return ResponseEntity.ok(result);
    }
    
    
    @GetMapping("financial_ratios/{symbol}")
    public ResponseEntity<List<Map<String, Object>>> getFinancialRatiosDataBySymbol(@PathVariable String symbol) {
        List<Map<String, Object>> result = null;
        Exception lastError = null;

        // Prefer full Accord ratios table (146 indicators) when available.
        try {
            String sql =
                    "SELECT cm.SYMBOL, cm.COMPNAME, fr.* " +
                    "FROM dbo.Finance_ratios fr " +
                    "JOIN Company_master cm ON cm.FINCODE = fr.FINCODE " +
                    "WHERE cm.SYMBOL = ? AND fr.Type = 'S' " +
                    "ORDER BY fr.Year_end";
            result = jdbcTemplate.queryForList(sql, symbol);
        } catch (Exception e) {
            lastError = e;
            result = null;
        }

        if (result == null || result.isEmpty()) {
            try {
                String viewSql = "SELECT cm.SYMBOL, cm.COMPNAME, fo.* " +
                        "FROM dbo.vw_financial_ratios fo " +
                        "JOIN Company_master cm ON fo.FINCODE = cm.FINCODE " +
                        "WHERE cm.SYMBOL = ?";
                result = jdbcTemplate.queryForList(viewSql, symbol);
            } catch (Exception e) {
                lastError = e;
                result = null;
            }
        }

        if (result == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(Map.of("error", lastError != null ? lastError.getMessage() : "Unknown error")));
        }

        return ResponseEntity.ok(result);
    }

    //  Ignore Code Below this Line not for fetching data

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
