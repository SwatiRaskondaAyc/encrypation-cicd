// //log activity code 

// package com.example.prog.equityhub.controller;

// import org.springframework.web.bind.annotation.*;

// import com.example.prog.datasource.service.PortfolioService;
// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.equityhub.repo.ListedSecuritiesRepository;
// import com.example.prog.equityhub.service.SearchService;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.equitydatafetchRepo.EquityPlotFetchRepo;
// import com.example.prog.token.JwtUtil;
// import com.example.prog.service.UserActivityService;
// import com.example.prog.repository.TotalSymbolSearchCountRepository;
// import com.example.prog.entity.TotalSymbolSearchCount;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;

// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpSession;

// import org.json.JSONObject;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;

// import java.io.BufferedReader;
// import java.io.InputStreamReader;
// import java.time.LocalDateTime;
// import java.util.*;

// @RestController
// @RequestMapping("/api/stocks")
// public class SearchController {

//     @Autowired
//     private CorporateUserRepository corporateUserRepository;

//     @Autowired
//     private EquityPlotFetchRepo userStockActionRepository;

//     @Autowired
//     private SearchService stockService;

//     @Autowired
//     private HttpSession httpSession;
    
//     @Autowired
//     private JwtUtil jwtUtil;

//     @Autowired
//     private UserActivityService userActivityService;

//     @Autowired
//     private TotalSymbolSearchCountRepository symbolSearchTotalRepository;

//     private final ListedSecuritiesRepository listedSecuritiesRepository;
//     private final PortfolioService portfolioService;
//     private final UserRepository userRepository;

//     private static final Logger logger = LoggerFactory.getLogger(SearchController.class);

//     // In-memory map to track symbol search counts (daily basis)
//     private Map<String, Integer> symbolSearchCount = new HashMap<>();
//     private final Object lock = new Object(); // For thread safety

//     public SearchController(ListedSecuritiesRepository listedSecuritiesRepository,
//             PortfolioService portfolioService,
//             UserRepository userRepository) {
//         this.listedSecuritiesRepository = listedSecuritiesRepository;
//         this.portfolioService = portfolioService;
//         this.userRepository = userRepository;
//     }
    
//     // Method to log user activity
//     private void logUserActivity(String email, String userType, String activityType) {
//         if (email == null) {
//             email = "UNKNOWN";
//         }
//         userActivityService.logUserActivity(email, userType, activityType);
//     }

//     // Extract user details from JWT token
//     private Map<String, Object> extractUserDetailsFromToken(HttpServletRequest request) {
//         String authHeader = request.getHeader("Authorization");
//         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//             throw new RuntimeException("Missing or invalid Authorization header");
//         }
        
//         String jwtToken = authHeader.substring(7);
//         String email = jwtUtil.extractEmail(jwtToken);
        
//         CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//         if (corporateUser != null) {
//             Map<String, Object> userDetails = new HashMap<>();
//             userDetails.put("email", email);
//             userDetails.put("userType", "corporate");
//             userDetails.put("userId", corporateUser.getId());
//             return userDetails;
//         }
        
//         Optional<UserDtls> individualUserOpt = userRepository.findByEmail(email);
//         if (individualUserOpt.isPresent()) {
//             UserDtls individualUser = individualUserOpt.get();
//             Map<String, Object> userDetails = new HashMap<>();
//             userDetails.put("email", email);
//             userDetails.put("userType", "individual");
//             userDetails.put("userId", individualUser.getUserID());
//             return userDetails;
//         }
        
//         throw new RuntimeException("User not found for email: " + email);
//     }
    
//     // Fetch user's saved stocks
//     @GetMapping("/saved")
//     public ResponseEntity<List<Map<String, Object>>> getSavedStocks(HttpServletRequest request) {
//         try {
//             Map<String, Object> userDetails = extractUserDetailsFromToken(request);
//             String email = (String) userDetails.get("email");
//             String userType = (String) userDetails.get("userType");
//             Integer userId = (Integer) userDetails.get("userId");
            
//             List<Map<String, Object>> savedStocks = stockService.getSavedStocks(userType, userId, email);
//             logUserActivity(email, userType, "GET_SAVED_STOCKS");
//             return ResponseEntity.ok(savedStocks);
//         } catch (RuntimeException e) {
//             logUserActivity(null, "UNKNOWN", "GET_SAVED_STOCKS");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                     .body(Collections.emptyList());
//         } catch (Exception e) {
//             logUserActivity(null, "UNKNOWN", "GET_SAVED_STOCKS");
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Collections.emptyList());
//         }
//     }

//     //---After searched saved stock
    
//     @PostMapping("/saveStock")
//     public ResponseEntity<String> saveStock(
//         @RequestBody Map<String, String> requestBody,
//         HttpServletRequest request) {
//         try {
//             Map<String, Object> userDetails = extractUserDetailsFromToken(request);
//             String email = (String) userDetails.get("email");
//             String userType = (String) userDetails.get("userType");
//             Integer userId = (Integer) userDetails.get("userId");

//             String symbol = requestBody.get("symbol");
//             String companyName = requestBody.get("companyName");

//             ResponseEntity<String> response = stockService.saveStock(userType, userId, email, symbol, companyName);
//             logUserActivity(email, userType, "SAVE_STOCK");
//             return response;
//         } catch (RuntimeException e) {
//             logUserActivity(null, "UNKNOWN", "SAVE_STOCK");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
//         } catch (Exception e) {
//             logUserActivity(null, "UNKNOWN", "SAVE_STOCK");
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving stock");
//         }
//     }
    
//     // Search for stocks without requiring authentication
//     @GetMapping("/search")
//     public ResponseEntity<List<Map<String, String>>> searchStocks(
//         @RequestParam String query) {
//         try {
//             List<Map<String, String>> searchResults = stockService.searchStocks(query, false, null, null, null);
//             // Since no authentication, log with UNKNOWN user
//             if (!searchResults.isEmpty()) {
//                 String symbol = searchResults.get(0).get("symbol");
//                 if (symbol != null) {
//                     synchronized (lock) {
//                         symbolSearchCount.merge(symbol, 1, Integer::sum);
//                         TotalSymbolSearchCount total = symbolSearchTotalRepository.findById(symbol).orElse(new TotalSymbolSearchCount(symbol, 0));
//                         total.setTotalCount(total.getTotalCount() + 1);
//                         total.setLastUpdated(LocalDateTime.now());
//                         symbolSearchTotalRepository.save(total);
//                         logUserActivity(null, "UNKNOWN", "SEARCH_STOCKS" + symbol.toUpperCase());
//                     }
//                 }
//             }
//             logUserActivity(null, "UNKNOWN", "SEARCH_STOCKS");
//             return ResponseEntity.ok(searchResults);
//         } catch (Exception e) {
//             logUserActivity(null, "UNKNOWN", "SEARCH_STOCKS");
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Collections.emptyList());
//         }
//     }



//     // Delete a saved stock
//     @DeleteMapping("/delete")
//     public ResponseEntity<Map<String, String>> deleteSavedStock(
//         @RequestBody Map<String, String> requestBody,
//         HttpServletRequest request) {
//         try {
//             Map<String, Object> userDetails = extractUserDetailsFromToken(request);
//             String email = (String) userDetails.get("email");
//             String userType = (String) userDetails.get("userType");
//             Integer userID = (Integer) userDetails.get("userId");
            
//             String symbol = requestBody.get("symbol");
//             String companyName = requestBody.get("companyName");
            
//             ResponseEntity<Map<String, String>> response = stockService.deleteSavedStock(userType, userID, email, symbol, companyName);
//             logUserActivity(email, userType, "DELETE_SAVED_STOCK");
//             return response;
//         } catch (RuntimeException e) {
//             logUserActivity(null, "UNKNOWN", "DELETE_SAVED_STOCK");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                     .body(Map.of("error", e.getMessage()));
//         } catch (Exception e) {
//             logUserActivity(null, "UNKNOWN", "DELETE_SAVED_STOCK");
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "Unexpected error occurred while deleting stock"));
//         }
//     }

//     @PostMapping("/process")
//     public ResponseEntity<Map<String, Object>> processStock(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "candle_spread");
//         // Log activity based on success/failure
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "PROCESS_STOCK" : "PROCESS_STOCK");
//         return response;
//     }

//     @PostMapping("/candle_breach")
//     public ResponseEntity<Map<String, Object>> candleBreach(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "candle_breach");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "CANDLE_BREACH" : "CANDLE_BREACH");
//         return response;
//     }

//     @PostMapping("/last_traded_price")
//     public ResponseEntity<Map<String, Object>> lastTradedPrice(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "last_traded_price");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "LAST_TRADED_PRICE" : "LAST_TRADED_PRICE");
//         return response;
//     }

//     @PostMapping("/avg_box")
//     public ResponseEntity<Map<String, Object>> avgBoxPlot(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "avg_box");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "AVG_BOX" : "AVG_BOX");
//         return response;
//     }

//     @PostMapping("/worm_plot")
//     public ResponseEntity<Map<String, Object>> wormPlot(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "worm_plot");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "WORM_PLOT" : "WORM_PLOT");
//         return response;
//     }

//     @PostMapping("/macd_plot")
//     public ResponseEntity<Map<String, Object>> macdPlot(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "macd_plot");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "MACD_PLOT" : "MACD_PLOT");
//         return response;
//     }

//     @PostMapping("/predict_volatility")
//     public ResponseEntity<Map<String, Object>> volatilityPlot(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "predict_volatility");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "PREDICT_VOLATILITY" : "PREDICT_VOLATILITY");
//         return response;
//     }

//     @PostMapping("/sensex_vs_stock_corr_bar")
//     public ResponseEntity<Map<String, Object>> sensexVsStockCorrBar(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "sensex_vs_stock_corr_bar");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "SENSEX_VS_STOCK_CORR_BAR" : "SENSEX_VS_STOCK_CORR_BAR");
//         return response;
//     }

//     @PostMapping("/sensex_vs_stock_corr")
//     public ResponseEntity<Map<String, Object>> sensexVsStockCorr(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "sensex_vs_stock_corr");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "SENSEX_VS_STOCK_CORR" : "SENSEX_VS_STOCK_CORR");
//         return response;
//     }

//     @PostMapping("/corr_heatmap")
//     public ResponseEntity<Map<String, Object>> corrHeatmap(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "corr_heatmap");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "CORR_HEATMAP" : "CORR_HEATMAP");
//         return response;
//     }

//     @PostMapping("/delivrey_rate_gauge")
//     public ResponseEntity<Map<String, Object>> deliveryRateGauge(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "delivrey_rate_gauge");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "DELIVERY_RATE_GAUGE" : "DELIVERY_RATE_GAUGE");
//         return response;
//     }

//     @PostMapping("/industry_bubble")
//     public ResponseEntity<Map<String, Object>> industryBubble(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "industry_bubble");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "INDUSTRY_BUBBLE" : "INDUSTRY_BUBBLE");
//         return response;
//     }

//     @PostMapping("/technical_plot")
//     public ResponseEntity<Map<String, Object>> technicalPlot(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "technical_plot");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "TECHNICAL_PLOT" : "TECHNICAL_PLOT");
//         return response;
//     }
    
//     @PostMapping("/generate_values")
//     public ResponseEntity<Map<String, Object>> generateValues(
//             @RequestBody Map<String, String> requestBody) {
//         try {
//             String symbol = requestBody.get("symbol");
//             String companyName = requestBody.get("companyName");

//             ResponseEntity<Map<String, Object>> response = stockService.generateValues(symbol, companyName);
//             logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "GENERATE_VALUES" : "GENERATE_VALUES");
//             return response;
//         } catch (Exception e) {
//             logUserActivity(null, "UNKNOWN", "GENERATE_VALUES");
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
//         }
//     }

//     @PostMapping("/generate_prediction")
//     public ResponseEntity<Map<String, Object>> generatePrediction(
//             @RequestBody Map<String, String> requestBody) {
//         try {
//             String symbol = requestBody.get("symbol");
//             String companyName = requestBody.get("companyName");

//             ResponseEntity<Map<String, Object>> response = stockService.generatePrediction(symbol, companyName);
//             logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "GENERATE_PREDICTION" : "GENERATE_PREDICTION");
//             return response;
//         } catch (Exception e) {
//             logUserActivity(null, "UNKNOWN", "GENERATE_PREDICTION");
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
//         }
//     }

    
//     private ResponseEntity<Map<String, Object>> generatePlot(String symbol, String companyName, String plotType) {
//         String formattedSymbol = symbol + " - " + companyName;
//         try {
//             ProcessBuilder processBuilder = new ProcessBuilder(
//                    // "python", "src/main/resources/scripts/generate_plot.py", plotType, formattedSymbol
//                     "python3", "/app/PythonScript/EquityHub_Scripts/generate_plot.py", plotType, formattedSymbol
//             );
//             processBuilder.redirectErrorStream(false); // Keep stdout and stderr separate
//             Process process = processBuilder.start();

//             // Capture stdout (JSON output)
//             BufferedReader stdoutReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//             StringBuilder output = new StringBuilder();
//             String line;
//             while ((line = stdoutReader.readLine()) != null) {
//                 output.append(line);
//             }

//             // Capture stderr (for debugging)
//             BufferedReader stderrReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
//             StringBuilder errorOutput = new StringBuilder();
//             while ((line = stderrReader.readLine()) != null) {
//                 errorOutput.append(line).append("\n");
//             }

//             int exitCode = process.waitFor();
//             if (exitCode != 0) {
//                 System.err.println("Python script stderr: " + errorOutput.toString());
//                 return ResponseEntity.status(500).body(Map.of("error", "Python script failed with exit code: " + exitCode + "\nError: " + errorOutput.toString()));
//             }

//             // Validate JSON before parsing
//             String jsonString = output.toString().trim();
//             if (jsonString.isEmpty()) {
//                 return ResponseEntity.status(500).body(Map.of("error", "Empty output from Python script"));
//             }
//             if (!jsonString.startsWith("{")) {
//                 System.err.println("Invalid JSON output: " + jsonString);
//                 return ResponseEntity.status(500).body(Map.of("error", "Invalid JSON output from Python script: " + jsonString));
//             }

//             JSONObject jsonResponse = new JSONObject(jsonString);
//             return ResponseEntity.ok(jsonResponse.toMap());

//         } catch (Exception e) {
//             e.printStackTrace();
//             return ResponseEntity.status(500).body(Map.of("error", "Error processing stock data: " + e.getMessage()));
//         }
//     }

//     // Endpoint to get symbol search counts (daily basis)
//     @GetMapping("/search-counts")
//     public ResponseEntity<Map<String, Integer>> getSymbolSearchCounts() {
//         synchronized (lock) {
//             return ResponseEntity.ok(new HashMap<>(symbolSearchCount));
//         }
//     }

//     // Endpoint to get total symbol search counts from database
//     @GetMapping("/total-search-counts")
//     public ResponseEntity<Map<String, Integer>> getTotalSymbolSearchCounts() {
//         Map<String, Integer> totalCounts = new HashMap<>();
//         for (TotalSymbolSearchCount total : symbolSearchTotalRepository.findAll()) {
//             totalCounts.put(total.getSymbol(), total.getTotalCount());
//         }
//         return ResponseEntity.ok(totalCounts);
//     }
// }