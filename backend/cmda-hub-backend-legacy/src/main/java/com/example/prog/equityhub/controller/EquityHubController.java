// package com.example.prog.equityhub.controller;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.*;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.client.RestTemplate;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;

// import com.example.prog.datasource.service.PortfolioService;
// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.equityhub.entity.ListedSecurities;
// import com.example.prog.equityhub.repo.ListedSecuritiesRepository;
// import com.example.prog.equityhub.service.SearchService;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.equitydatafetchRepo.EquityPlotFetchRepo;
// import com.example.prog.token.JwtUtil;
// import com.example.prog.service.UserActivityService;
// import com.example.prog.repository.TotalSymbolSearchCountRepository;
// import com.example.prog.entity.TotalSymbolSearchCount;

// import jakarta.servlet.http.HttpSession;
// import java.util.stream.Collectors;
// import java.time.LocalDateTime;

// import org.springframework.web.client.HttpClientErrorException;
// import com.fasterxml.jackson.databind.ObjectMapper;

// import org.json.JSONObject;
// import java.net.URLEncoder;
// import java.nio.charset.StandardCharsets;
// import java.util.*;
// import jakarta.servlet.http.HttpServletRequest;
// import java.io.BufferedReader;
// import java.io.InputStreamReader;

// @RestController
// @RequestMapping("/api/stocks/test")
// public class EquityHubController {

//     @Autowired
//     private CorporateUserRepository corporateUserRepository;

//     @Autowired
//     private EquityPlotFetchRepo userStockActionRepository;

//     @Autowired
//     private SearchService stockService;

//     @Autowired
//     private HttpSession httpSession;

//     @Autowired
//     private JwtUtil jwtUtil; // Inject JwtUtil

//     @Autowired
//     private UserActivityService userActivityService;

//     @Autowired
//     private TotalSymbolSearchCountRepository symbolSearchTotalRepository;

//     @Autowired
//     private ObjectMapper objectMapper;

//     private final ListedSecuritiesRepository listedSecuritiesRepository;
//     private final PortfolioService portfolioService;
//     private final UserRepository userRepository;

//     @Value("${fastapi.service.url:http://app:3000}")
//     private String fastApiBaseUrl;

//     private static final Logger logger = LoggerFactory.getLogger(EquityHubController.class);

//     // In-memory map to track symbol search counts (daily basis)
//     private Map<String, Integer> symbolSearchCount = new HashMap<>();
//     private final Object lock = new Object(); // For thread safety

//     public EquityHubController(ListedSecuritiesRepository listedSecuritiesRepository,
//                             PortfolioService portfolioService,
//                             UserRepository userRepository) {
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

//     // Save a stock
//     @PostMapping("/saveStock")
//     public ResponseEntity<String> saveStock(
//             @RequestBody Map<String, String> requestBody,
//             HttpServletRequest request) {
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

//    // Previous code
//     // @GetMapping("/search")
//     // public ResponseEntity<List<Map<String, String>>> searchStocks(
//     //         @RequestParam String query,
//     //         @RequestParam(defaultValue = "false") boolean shouldSave,
//     //         @RequestParam(defaultValue = "0") int page,
//     //         @RequestParam(defaultValue = "10") int size,
//     //         HttpServletRequest request) {
//     //     try {
//     //         Map<String, Object> userDetails = extractUserDetailsFromToken(request);
//     //         String email = (String) userDetails.get("email");
//     //         String userType = (String) userDetails.get("userType");
//     //         Integer userId = (Integer) userDetails.get("userId");

//     //         Pageable pageable = PageRequest.of(page, size);
//     //         return ResponseEntity.ok(stockService.searchStocks(query, shouldSave, userType, userId, email, pageable));
//     //     } catch (RuntimeException e) {
//     //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//     //                 .body(Collections.emptyList());
//     //     } catch (Exception e) {
//     //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//     //                 .body(Collections.emptyList());
//     //     }
//     // }

// // Only for testing companies loding
//     @GetMapping("/companies-count")
//     public ResponseEntity<Integer> getCompaniesCount() {
//         return ResponseEntity.ok(stockService.getCompaniesCount());
//     }

//     @GetMapping("/search")
//     public ResponseEntity<List<Map<String, String>>> searchStocks(
//             @RequestParam String query,
//             @RequestParam(defaultValue = "false") boolean shouldSave,
//             @RequestParam(defaultValue = "0") int page,
//             @RequestParam(defaultValue = "10") int size,
//             HttpServletRequest request) {
//         try {
//             Map<String, Object> userDetails = extractUserDetailsFromToken(request);
//             String email = (String) userDetails.get("email");
//             String userType = (String) userDetails.get("userType");
//             Integer userId = (Integer) userDetails.get("userId");

//             Pageable pageable = PageRequest.of(page, size);
//             return ResponseEntity.ok(stockService.searchStocks(query, shouldSave, userType, userId, email, pageable));
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                     .body(Collections.emptyList());
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Collections.emptyList());
//         }
//     }



//     @GetMapping("/suggest")
//     public ResponseEntity<List<Map<String, String>>> getCompanySuggestions(
//             @RequestParam String prefix,
//             @RequestParam(defaultValue = "10") int limit) {
//         List<Map<String, String>> suggestions = stockService.getCompanySuggestions(prefix);
//         return ResponseEntity.ok(suggestions);
//     }

//     // Delete a saved stock
//     @DeleteMapping("/delete")
//     public ResponseEntity<Map<String, String>> deleteSavedStock(
//             @RequestBody Map<String, String> requestBody,
//             HttpServletRequest request) {
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

//     @PostMapping("/compute_public_trading_activity")
//     public ResponseEntity<Map<String, Object>> computePublicTradingActivity(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlotWithoutFastApi(stockData.get("symbol"), stockData.get("companyName"), "compute_public_trading_activity");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "COMPUTE_PUBLIC_TRADING_ACTIVITY" : "COMPUTE_PUBLIC_TRADING_ACTIVITY");
//         return response;
//     }

//     private ResponseEntity<Map<String, Object>> generatePlotWithoutFastApi(String symbol, String companyName, String plotType) {
//         String formattedSymbol = symbol + " - " + companyName;
//         try {
//             ProcessBuilder processBuilder = new ProcessBuilder(
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

//     @PostMapping("/candle_chronicle")
//     public ResponseEntity<Map<String, Object>> processStock(@RequestBody Map<String, String> stockData) {
//         String symbol = stockData.get("symbol");
//         String companyName = stockData.get("companyName");
//         String figType = stockData.get("fig_type"); // Extract fig_type from request body
//         ResponseEntity<Map<String, Object>> response = generateCandlrPlot(symbol, companyName, figType, "candle_chronicle");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "CANDLE_CHRONICLE" : "CANDLE_CHRONICLE");
//         return response;
//     }

//     private ResponseEntity<Map<String, Object>> generateCandlrPlot(String symbol, String companyName, String figType, String plotType) {
//         try {
//             RestTemplate restTemplate = new RestTemplate();
            
//             String url = fastApiBaseUrl + "/plot_generation"
//                 + "?symbol=" + URLEncoder.encode(symbol, StandardCharsets.UTF_8)
//                 + "&period=TTM"
//                 + "&plot_type=" + URLEncoder.encode(plotType, StandardCharsets.UTF_8)
//                 + "&fig=" + URLEncoder.encode(figType, StandardCharsets.UTF_8);

//             @SuppressWarnings("unchecked")
//             Map<String, Object> response = restTemplate.getForObject(url, Map.class);

//             if (response == null || response.containsKey("error")) {
//                 return ResponseEntity.status(500).body(Map.of("error", "FastAPI error: " + (response != null ? response.get("error") : "Unknown error")));
//             }

//             response.put("companyName", companyName);
//             return ResponseEntity.ok(response);

//         } catch (Exception e) {
//             return ResponseEntity.status(500).body(Map.of("error", "Failed to generate plot: " + e.getMessage()));
//         }
//     }

//     @PostMapping("/breach_busters")
//     public ResponseEntity<Map<String, Object>> candleBreach(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "breach_busters");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "BREACH_BUSTERS" : "BREACH_BUSTERS");
//         return response;
//     }
    
//     @PostMapping("/price_trend")
//     public ResponseEntity<Map<String, Object>> price_trend(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "price_trend");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "PRICE_TREND" : "PRICE_TREND");
//         return response;
//     }

//     @PostMapping("/pegy")
//     public ResponseEntity<Map<String, Object>> pegy(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "pegy");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "Pegy" : "Pegy");
//         return response;
//     }
    
//     @PostMapping("/trend_tapestry")
//     public ResponseEntity<Map<String, Object>> trendTapestry(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "trend_tapestry");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "TREND_TAPESTRY" : "TREND_TAPESTRY");
//         return response;
//     }
    
//     @PostMapping("/macd")
//     public ResponseEntity<Map<String, Object>> macd(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "macd");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "MACD" : "MACD");
//         return response;
//     }
    
//     @PostMapping("/sensex_stock_fluctuations")
//     public ResponseEntity<Map<String, Object>> SensexStockFluctuations(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "sensex_stock_fluctuations");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "SENSEX_STOCK_FLUCTUATIONS" : "SENSEX_STOCK_FLUCTUATIONS");
//         return response;
//     }

//     @PostMapping("/sensex_symphony")
//     public ResponseEntity<Map<String, Object>> SensexSymphony(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "sensex_symphony");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "SENSEX_SYMPHONY" : "SENSEX_SYMPHONY");
//         return response;
//     }
    
//     @PostMapping("/performance_heatmap")
//     public ResponseEntity<Map<String, Object>> PerformanceHeatmap(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "performance_heatmap");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "PERFORMANCE_HEATMAP" : "PERFORMANCE_HEATMAP");
//         return response;
//     }
    
//     @PostMapping("/pe_eps_book_value")
//     public ResponseEntity<Map<String, Object>> PeEpsBookValue(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "pe_eps_book_value");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "PE_EPS_BOOK_VALUE" : "PE_EPS_BOOK_VALUE");
//         return response;
//     }
    
//     @PostMapping("/box_plot")
//     public ResponseEntity<Map<String, Object>> BoxPlot(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "box_plot");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "BOX_PLOT" : "BOX_PLOT");
//         return response;
//     }
    
//     @PostMapping("/market_mood")
//     public ResponseEntity<Map<String, Object>> MarketMood(@RequestBody Map<String, String> stockData) {
//         ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "market_mood");
//         logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "MARKET_MOOD" : "MARKET_MOOD");
//         return response;
//     }

//     @PostMapping("/sensex_movement_corr_calculator")
//     public ResponseEntity<Map<String, Object>> sensex_movement_corr_calculator(@RequestBody Map<String, String> stockData) {
//         return generatePlot(stockData.get("symbol"), stockData.get("companyName"), "sensex_movement_corr_calculator");
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

//     @PostMapping("/generate_values")
//     public ResponseEntity<Map<String, Object>> generateValues(
//             @RequestBody Map<String, String> requestBody) {
//         try {
//             String symbol = requestBody.get("symbol");
//             String companyName = requestBody.get("companyName");

//             ResponseEntity<Map<String, Object>> response = generateValues(symbol, companyName);
//             logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "GENERATE_VALUES" : "GENERATE_VALUES");
//             return response;
//         } catch (Exception e) {
//             logUserActivity(null, "UNKNOWN", "GENERATE_VALUES");
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
//         }
//     }

//     private ResponseEntity<Map<String, Object>> generateValues(String symbol, String companyName) {
//         try {
//             RestTemplate restTemplate = new RestTemplate();
//             String formattedSymbol = symbol.toUpperCase();
//             String url = String.format("%s/load_data?symbol=%s",
//                     fastApiBaseUrl, formattedSymbol);

//             ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

//             if (response.getStatusCode() == HttpStatus.OK) {
//                 Map<String, Object> responseBody = response.getBody();
//                 if (responseBody != null && "success".equals(responseBody.get("status"))) {
//                     return ResponseEntity.ok((Map<String, Object>) responseBody.get("data"));
//                 } else {
//                     String errorMsg = responseBody != null ? (String) responseBody.get("message") : "Unknown error from FastAPI";
//                     return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                             .body(Map.of("error", errorMsg));
//                 }
//             } else {
//                 return ResponseEntity.status(response.getStatusCode())
//                         .body(Map.of("error", "FastAPI returned non-200 status: " + response.getStatusCodeValue()));
//             }
//         } catch (HttpClientErrorException e) {
//             return ResponseEntity.status(e.getStatusCode())
//                     .body(Map.of("error", "FastAPI error: " + e.getResponseBodyAsString()));
//         } catch (Exception e) {
//             logger.error("Error calling FastAPI for plot generation: {}", e.getMessage());
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
//         }
//     }

//     private ResponseEntity<Map<String, Object>> generatePlot(String symbol, String companyName, String plotType) {
//     try {
//         RestTemplate restTemplate = new RestTemplate();
//         String formattedSymbol = symbol.toUpperCase();
//         String url = String.format("%s/plot_generation?symbol=%s&plot_type=%s&period=TTM",
//                 fastApiBaseUrl, URLEncoder.encode(formattedSymbol, StandardCharsets.UTF_8), URLEncoder.encode(plotType, StandardCharsets.UTF_8));
//         logger.info("Attempting to call FastAPI at URL: {}", url);

//         // Make HTTP GET request to FastAPI
//         ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
//         Map<String, Object> responseBody = response.getBody();

//         if (response.getStatusCode() == HttpStatus.OK && responseBody != null && "success".equals(responseBody.get("status"))) {
//             Object data = responseBody.get("data");
//             Map<String, Object> dataMap;

//             logger.info("Data field: {} (type: {})", data, data != null ? data.getClass().getName() : "null");

//             if (data instanceof String) {
//                 // Parse the JSON string into a Map
//                 try {
//                     dataMap = objectMapper.readValue((String) data, Map.class);
//                 } catch (Exception e) {
//                     logger.error("Failed to parse data field as JSON: {}", data, e);
//                     return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                             .body(Map.of("error", "Failed to parse data field: " + e.getMessage()));
//                 }
//             } else if (data instanceof Map) {
//                 dataMap = (Map<String, Object>) data;
//             } else {
//                 logger.error("Unexpected data type for 'data' field: {}", data != null ? data.getClass().getName() : "null");
//                 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                         .body(Map.of("error", "Unexpected data type in FastAPI response: " + (data != null ? data.getClass().getName() : "null")));
//             }
//             return ResponseEntity.ok(dataMap);
//         } else {
//             String errorMsg = responseBody != null ? (String) responseBody.get("message") : "Unknown error from FastAPI";
//             logger.error("FastAPI error: {}", errorMsg);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", errorMsg));
//         }
//     } catch (HttpClientErrorException e) {
//         logger.error("FastAPI HTTP error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
//         return ResponseEntity.status(e.getStatusCode())
//                 .body(Map.of("error", "FastAPI error: " + e.getResponseBodyAsString()));
//     } catch (Exception e) {
//         logger.error("Error calling FastAPI for plot generation at {}: {}", fastApiBaseUrl, e.getMessage(), e);
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                 .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
//     }
// }
    
// //    private ResponseEntity<Map<String, Object>> generatePlot(String symbol, String companyName, String plotType) {
// //         try {
// //             RestTemplate restTemplate = new RestTemplate();
// //             String formattedSymbol = symbol.toUpperCase();
// //             String url = String.format("%s/plot_generation?symbol=%s&plot_type=%s&period=TTM",
// //                     fastApiBaseUrl, formattedSymbol, plotType);

// //             ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

// //             if (response.getStatusCode() == HttpStatus.OK) {
// //                 Map<String, Object> responseBody = response.getBody();
// //                 if (responseBody != null && "success".equals(responseBody.get("status"))) {
// //                     return ResponseEntity.ok((Map<String, Object>) responseBody.get("data"));
// //                 } else {
// //                     String errorMsg = responseBody != null ? (String) responseBody.get("message") : "Unknown error from FastAPI";
// //                     return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
// //                              .body(Map.of("error", errorMsg));
// //                 }
// //             } else {
// //                 return ResponseEntity.status(response.getStatusCode())
// //                         .body(Map.of("error", "FastAPI returned non-200 status: " + response.getStatusCodeValue()));
// //             }
// //         } catch (HttpClientErrorException e) {
// //             return ResponseEntity.status(e.getStatusCode())
// //                     .body(Map.of("error", "FastAPI error: " + e.getResponseBodyAsString()));
// //         } catch (Exception e) {
// //             logger.error("Error calling FastAPI for plot generation: {}", e.getMessage());
// //             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
// //                     .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
// //         }
// //     }
// }

package com.example.prog.equityhub.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.example.prog.datasource.service.PortfolioService;
import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.UserDtls;
import com.example.prog.equityhub.entity.ListedSecurities;
import com.example.prog.equityhub.repo.ListedSecuritiesRepository;
import com.example.prog.equityhub.service.SearchService;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.equitydatafetchRepo.EquityPlotFetchRepo;
import com.example.prog.token.JwtUtil;
import com.example.prog.service.UserActivityService;
import com.example.prog.repository.TotalSymbolSearchCountRepository;
import com.example.prog.entity.TotalSymbolSearchCount;
import com.example.prog.service.RatingService; // New import for RatingService

import jakarta.servlet.http.HttpSession;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

import org.springframework.web.client.HttpClientErrorException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.json.JSONObject;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import jakarta.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.InputStreamReader;

@RestController
@RequestMapping("/api/stocks/test")
public class EquityHubController {

    @Autowired
    private CorporateUserRepository corporateUserRepository;

    @Autowired
    private EquityPlotFetchRepo userStockActionRepository;

    @Autowired
    private SearchService stockService;

    @Autowired
    private HttpSession httpSession;

    @Autowired
    private JwtUtil jwtUtil; // Inject JwtUtil

    @Autowired
    private UserActivityService userActivityService;

    @Autowired
    private TotalSymbolSearchCountRepository symbolSearchTotalRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RatingService ratingService; // New dependency for RatingService

    private final ListedSecuritiesRepository listedSecuritiesRepository;
    private final PortfolioService portfolioService;
    private final UserRepository userRepository;

    // @Value("${fastapi.service.url:http://app:3000}")
        @Value("${fastapi.service.url:http://localhost:8000}")

    private String fastApiBaseUrl;

    private static final Logger logger = LoggerFactory.getLogger(EquityHubController.class);

    // In-memory map to track symbol search counts (daily basis)
    private Map<String, Integer> symbolSearchCount = new HashMap<>();
    private final Object lock = new Object(); // For thread safety

    public EquityHubController(ListedSecuritiesRepository listedSecuritiesRepository,
                            PortfolioService portfolioService,
                            UserRepository userRepository) {
        this.listedSecuritiesRepository = listedSecuritiesRepository;
        this.portfolioService = portfolioService;
        this.userRepository = userRepository;
    }

    // Method to log user activity
    private void logUserActivity(String email, String userType, String activityType) {
        if (email == null) {
            email = "UNKNOWN";
        }
        userActivityService.logUserActivity(email, userType, activityType);
    }

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

    // Fetch user's saved stocks
    @GetMapping("/saved")
    public ResponseEntity<List<Map<String, Object>>> getSavedStocks(HttpServletRequest request) {
        try {
            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
            String email = (String) userDetails.get("email");
            String userType = (String) userDetails.get("userType");
            Integer userId = (Integer) userDetails.get("userId");

            List<Map<String, Object>> savedStocks = stockService.getSavedStocks(userType, userId, email);
            logUserActivity(email, userType, "GET_SAVED_STOCKS");
            return ResponseEntity.ok(savedStocks);
        } catch (RuntimeException e) {
            logUserActivity(null, "UNKNOWN", "GET_SAVED_STOCKS");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.emptyList());
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "GET_SAVED_STOCKS");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    // Save a stock
    @PostMapping("/saveStock")
    public ResponseEntity<String> saveStock(
            @RequestBody Map<String, String> requestBody,
            HttpServletRequest request) {
        try {
            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
            String email = (String) userDetails.get("email");
            String userType = (String) userDetails.get("userType");
            Integer userId = (Integer) userDetails.get("userId");

            String symbol = requestBody.get("symbol");
            String companyName = requestBody.get("companyName");

            ResponseEntity<String> response = stockService.saveStock(userType, userId, email, symbol, companyName);
            logUserActivity(email, userType, "SAVE_STOCK");
            return response;
        } catch (RuntimeException e) {
            logUserActivity(null, "UNKNOWN", "SAVE_STOCK");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "SAVE_STOCK");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving stock");
        }
    }

    // Only for testing companies loading
    @GetMapping("/companies-count")
    public ResponseEntity<Integer> getCompaniesCount() {
        return ResponseEntity.ok(stockService.getCompaniesCount());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, String>>> searchStocks(
            @RequestParam String query,
            @RequestParam(defaultValue = "false") boolean shouldSave,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {
        try {
            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
            String email = (String) userDetails.get("email");
            String userType = (String) userDetails.get("userType");
            Integer userId = (Integer) userDetails.get("userId");

            Pageable pageable = PageRequest.of(page, size);
            return ResponseEntity.ok(stockService.searchStocks(query, shouldSave, userType, userId, email, pageable));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.emptyList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @GetMapping("/suggest")
    public ResponseEntity<List<Map<String, String>>> getCompanySuggestions(
            @RequestParam String prefix,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, String>> suggestions = stockService.getCompanySuggestions(prefix);
        return ResponseEntity.ok(suggestions);
    }

    // Delete a saved stock
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteSavedStock(
            @RequestBody Map<String, String> requestBody,
            HttpServletRequest request) {
        try {
            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
            String email = (String) userDetails.get("email");
            String userType = (String) userDetails.get("userType");
            Integer userID = (Integer) userDetails.get("userId");

            String symbol = requestBody.get("symbol");
            String companyName = requestBody.get("companyName");

            ResponseEntity<Map<String, String>> response = stockService.deleteSavedStock(userType, userID, email, symbol, companyName);
            logUserActivity(email, userType, "DELETE_SAVED_STOCK");
            return response;
        } catch (RuntimeException e) {
            logUserActivity(null, "UNKNOWN", "DELETE_SAVED_STOCK");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "DELETE_SAVED_STOCK");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Unexpected error occurred while deleting stock"));
        }
    }

    // Endpoint to get symbol search counts (daily basis)
    @GetMapping("/search-counts")
    public ResponseEntity<Map<String, Integer>> getSymbolSearchCounts() {
        synchronized (lock) {
            return ResponseEntity.ok(new HashMap<>(symbolSearchCount));
        }
    }

    // Endpoint to get total symbol search counts from database
    @GetMapping("/total-search-counts")
    public ResponseEntity<Map<String, Integer>> getTotalSymbolSearchCounts() {
        Map<String, Integer> totalCounts = new HashMap<>();
        for (TotalSymbolSearchCount total : symbolSearchTotalRepository.findAll()) {
            totalCounts.put(total.getSymbol(), total.getTotalCount());
        }
        return ResponseEntity.ok(totalCounts);
    }

    @PostMapping("/compute_public_trading_activity")
    public ResponseEntity<Map<String, Object>> computePublicTradingActivity(@RequestBody Map<String, String> stockData) {
        ResponseEntity<Map<String, Object>> response = generatePlotWithoutFastApi(stockData.get("symbol"), stockData.get("companyName"), "compute_public_trading_activity");
        logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "COMPUTE_PUBLIC_TRADING_ACTIVITY" : "COMPUTE_PUBLIC_TRADING_ACTIVITY");
        return response;
    }

    private ResponseEntity<Map<String, Object>> generatePlotWithoutFastApi(String symbol, String companyName, String plotType) {
        String formattedSymbol = symbol + " - " + companyName;
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "python3", "/app/PythonScript/EquityHub_Scripts/generate_plot.py", plotType, formattedSymbol
            );
            processBuilder.redirectErrorStream(false); // Keep stdout and stderr separate
            Process process = processBuilder.start();

            // Capture stdout (JSON output)
            BufferedReader stdoutReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = stdoutReader.readLine()) != null) {
                output.append(line);
            }

            // Capture stderr (for debugging)
            BufferedReader stderrReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            StringBuilder errorOutput = new StringBuilder();
            while ((line = stderrReader.readLine()) != null) {
                errorOutput.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                System.err.println("Python script stderr: " + errorOutput.toString());
                return ResponseEntity.status(500).body(Map.of("error", "Python script failed with exit code: " + exitCode + "\nError: " + errorOutput.toString()));
            }

            // Validate JSON before parsing
            String jsonString = output.toString().trim();
            if (jsonString.isEmpty()) {
                return ResponseEntity.status(500).body(Map.of("error", "Empty output from Python script"));
            }
            if (!jsonString.startsWith("{")) {
                System.err.println("Invalid JSON output: " + jsonString);
                return ResponseEntity.status(500).body(Map.of("error", "Invalid JSON output from Python script: " + jsonString));
            }

            JSONObject jsonResponse = new JSONObject(jsonString);
            return ResponseEntity.ok(jsonResponse.toMap());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error processing stock data: " + e.getMessage()));
        }
    }

    @PostMapping("/candle_chronicle")
    public ResponseEntity<Map<String, Object>> processStock(@RequestBody Map<String, String> stockData) {
        String symbol = stockData.get("symbol");
        String companyName = stockData.get("companyName");
        String figType = stockData.get("fig_type"); // Extract fig_type from request body
        // String figType = stockData.get("fig_type");        // e.g., "OC"
        String period = stockData.get("period");

        // Default fallbacks
        if (figType == null || figType.isEmpty()) figType = "OC";
        if (period == null || period.isEmpty()) period = "TTM";
        
        ResponseEntity<Map<String, Object>> response = generateCandlrPlot(symbol, companyName, figType, period, "candle_chronicle");
        logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "CANDLE_CHRONICLE" : "CANDLE_CHRONICLE");
        return response;
    }

    private ResponseEntity<Map<String, Object>> generateCandlrPlot(String symbol, String companyName, String figType, String period, String plotType) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            
            String url = fastApiBaseUrl + "/plot_generation"
                + "?symbol=" + URLEncoder.encode(symbol, StandardCharsets.UTF_8)
                + "&plot_type=" + URLEncoder.encode(plotType, StandardCharsets.UTF_8)
                + "&fig=" + URLEncoder.encode(figType, StandardCharsets.UTF_8)
                + "&period=" + URLEncoder.encode(period, StandardCharsets.UTF_8);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || response.containsKey("error")) {
                return ResponseEntity.status(500).body(Map.of("error", "FastAPI error: " + (response != null ? response.get("error") : "Unknown error")));
            }

            response.put("companyName", companyName);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to generate plot: " + e.getMessage()));
        }
    }

    @PostMapping("/breach_busters")
    public ResponseEntity<Map<String, Object>> candleBreach(@RequestBody Map<String, String> stockData) {
        ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "breach_busters");
        logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "BREACH_BUSTERS" : "BREACH_BUSTERS");
        return response;
    }

    @PostMapping("/pegy")
    public ResponseEntity<Map<String, Object>> pegy(@RequestBody Map<String, String> stockData) {
        ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "pegy");
        logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "Pegy" : "Pegy");
        return response;
    }
    
    
    @PostMapping("/price_trend")
    public ResponseEntity<Map<String, Object>> price_trend(@RequestBody Map<String, String> stockData) {
        ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "price_trend");
        logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "PRICE_TREND" : "PRICE_TREND");
        return response;
    }
    
    @PostMapping("/trend_tapestry")
    public ResponseEntity<Map<String, Object>> trendTapestry(@RequestBody Map<String, String> stockData) {
        ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "trend_tapestry");
        logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "TREND_TAPESTRY" : "TREND_TAPESTRY");
        return response;
    }
    
    @PostMapping("/macd")
    public ResponseEntity<Map<String, Object>> macd(@RequestBody Map<String, String> stockData) {
        ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "macd");
        logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "MACD" : "MACD");
        return response;
    }
    
    @PostMapping("/sensex_stock_fluctuations")
    public ResponseEntity<Map<String, Object>> SensexStockFluctuations(@RequestBody Map<String, String> stockData) {
        ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "sensex_stock_fluctuations");
        logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "SENSEX_STOCK_FLUCTUATIONS" : "SENSEX_STOCK_FLUCTUATIONS");
        return response;
    }

    @PostMapping("/sensex_symphony")
    public ResponseEntity<Map<String, Object>> SensexSymphony(@RequestBody Map<String, String> stockData) {
        ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "sensex_symphony");
        logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "SENSEX_SYMPHONY" : "SENSEX_SYMPHONY");
        return response;
    }
    
    @PostMapping("/performance_heatmap")
    public ResponseEntity<Map<String, Object>> PerformanceHeatmap(@RequestBody Map<String, String> stockData) {
        ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "performance_heatmap");
        logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "PERFORMANCE_HEATMAP" : "PERFORMANCE_HEATMAP");
        return response;
    }
    
    @PostMapping("/pe_eps_book_value")
    public ResponseEntity<Map<String, Object>> PeEpsBookValue(@RequestBody Map<String, String> stockData) {
        ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "pe_eps_book_value");
        logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "PE_EPS_BOOK_VALUE" : "PE_EPS_BOOK_VALUE");
        return response;
    }
    
    @PostMapping("/box_plot")
    public ResponseEntity<Map<String, Object>> BoxPlot(@RequestBody Map<String, String> stockData) {
        ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "box_plot");
        logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "BOX_PLOT" : "BOX_PLOT");
        return response;
    }
    
    @PostMapping("/market_mood")
    public ResponseEntity<Map<String, Object>> MarketMood(@RequestBody Map<String, String> stockData) {
        ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "market_mood");
        logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "MARKET_MOOD" : "MARKET_MOOD");
        return response;
    }

    // @PostMapping("/sensex_movement_corr_calculator")
    // public ResponseEntity<Map<String, Object>> sensex_movement_corr_calculator(@RequestBody Map<String, String> stockData) {
    //     ResponseEntity<Map<String, Object>> response = generatePlot(stockData.get("symbol"), stockData.get("companyName"), "sensex_movement_corr_calculator");
    //     logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "SENSEX_MOVEMENT_CORR_CALCULATOR" : "SENSEX_MOVEMENT_CORR_CALCULATOR");
    //     return response;
    // }

    @PostMapping("/sensex_movement_corr_calculator")

    public ResponseEntity<Map<String, Object>> sensex_movement_corr_calculator(@RequestBody Map<String, String> stockData) {

        return generatePlot(stockData.get("symbol"), stockData.get("companyName"), "sensex_movement_corr_calculator");

    } 
    
    @PostMapping("/generate_prediction")
    public ResponseEntity<Map<String, Object>> generatePrediction(
            @RequestBody Map<String, String> requestBody) {
        try {
            String symbol = requestBody.get("symbol");
            String companyName = requestBody.get("companyName");

            ResponseEntity<Map<String, Object>> response = stockService.generatePrediction(symbol, companyName);
            logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "GENERATE_PREDICTION" : "GENERATE_PREDICTION");
            return response;
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "GENERATE_PREDICTION");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
        }
    }

    @PostMapping("/generate_values")
    public ResponseEntity<Map<String, Object>> generateValues(
            @RequestBody Map<String, String> requestBody) {
        try {
            String symbol = requestBody.get("symbol");
            String companyName = requestBody.get("companyName");

            ResponseEntity<Map<String, Object>> response = generateValues(symbol, companyName);
            logUserActivity(null, "UNKNOWN", response.getStatusCode() == HttpStatus.OK ? "GENERATE_VALUES" : "GENERATE_VALUES");
            return response;
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "GENERATE_VALUES");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
        }
    }

    private ResponseEntity<Map<String, Object>> generateValues(String symbol, String companyName) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String formattedSymbol = symbol.toUpperCase();
            String url = String.format("%s/load_data?symbol=%s",
                    fastApiBaseUrl, formattedSymbol);

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                if (responseBody != null && "success".equals(responseBody.get("status"))) {
                    return ResponseEntity.ok((Map<String, Object>) responseBody.get("data"));
                } else {
                    String errorMsg = responseBody != null ? (String) responseBody.get("message") : "Unknown error from FastAPI";
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("error", errorMsg));
                }
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body(Map.of("error", "FastAPI returned non-200 status: " + response.getStatusCodeValue()));
            }
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", "FastAPI error: " + e.getResponseBodyAsString()));
        } catch (Exception e) {
            logger.error("Error calling FastAPI for plot generation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
        }
    }

    private ResponseEntity<Map<String, Object>> generatePlot(String symbol, String companyName, String plotType) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String formattedSymbol = symbol.toUpperCase();
            String url = String.format("%s/plot_generation?symbol=%s&plot_type=%s&period=TTM",
                    fastApiBaseUrl, URLEncoder.encode(formattedSymbol, StandardCharsets.UTF_8), URLEncoder.encode(plotType, StandardCharsets.UTF_8));
            logger.info("Attempting to call FastAPI at URL: {}", url);

            // Make HTTP GET request to FastAPI
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> responseBody = response.getBody();

            if (response.getStatusCode() == HttpStatus.OK && responseBody != null && "success".equals(responseBody.get("status"))) {
                Object data = responseBody.get("data");
                Map<String, Object> dataMap;

                logger.info("Data field: {} (type: {})", data, data != null ? data.getClass().getName() : "null");

                if (data instanceof String) {
                    // Parse the JSON string into a Map
                    try {
                        dataMap = objectMapper.readValue((String) data, Map.class);
                    } catch (Exception e) {
                        logger.error("Failed to parse data field as JSON: {}", data, e);
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of("error", "Failed to parse data field: " + e.getMessage()));
                    }
                } else if (data instanceof Map) {
                    dataMap = (Map<String, Object>) data;
                } else {
                    logger.error("Unexpected data type for 'data' field: {}", data != null ? data.getClass().getName() : "null");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("error", "Unexpected data type in FastAPI response: " + (data != null ? data.getClass().getName() : "null")));
                }
                return ResponseEntity.ok(dataMap);
            } else {
                String errorMsg = responseBody != null ? (String) responseBody.get("message") : "Unknown error from FastAPI";
                logger.error("FastAPI error: {}", errorMsg);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", errorMsg));
            }
        } catch (HttpClientErrorException e) {
            logger.error("FastAPI HTTP error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", "FastAPI error: " + e.getResponseBodyAsString()));
        } catch (Exception e) {
            logger.error("Error calling FastAPI for plot generation at {}: {}", fastApiBaseUrl, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
        }
    }

    // New endpoints for ratings

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
            Set<String> validPlotTypes = new HashSet<>(Arrays.asList(
                "candle_chronicle", "breach_busters", "price_trend", "trend_tapestry",
                "macd", "sensex_stock_fluctuations", "sensex_symphony", "performance_heatmap",
                "pe_eps_book_value", "box_plot", "market_mood", "sensex_movement_corr_calculator",
                "compute_public_trading_activity","pegy"
            ));
            if (!validPlotTypes.contains(plotType)) {
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
    //         Set<String> validPlotTypes = new HashSet<>(Arrays.asList(
    //             "candle_chronicle", "breach_busters", "price_trend", "trend_tapestry",
    //             "macd", "sensex_stock_fluctuations", "sensex_symphony", "performance_heatmap",
    //             "pe_eps_book_value", "box_plot", "market_mood", "sensex_movement_corr_calculator",
    //             "compute_public_trading_activity"
    //         ));
    //         if (!validPlotTypes.contains(plotType)) {
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
        Set<String> validPlotTypes = new HashSet<>(Arrays.asList(
            "candle_chronicle", "breach_busters", "price_trend", "trend_tapestry",
            "macd", "sensex_stock_fluctuations", "sensex_symphony", "performance_heatmap",
            "pe_eps_book_value", "box_plot", "market_mood", "sensex_movement_corr_calculator",
            "compute_public_trading_activity","pegy"
        ));
        if (!validPlotTypes.contains(plotType)) {
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
            Set<String> validPlotTypes = new HashSet<>(Arrays.asList(
                "candle_chronicle", "breach_busters", "price_trend", "trend_tapestry",
                "macd", "sensex_stock_fluctuations", "sensex_symphony", "performance_heatmap",
                "pe_eps_book_value", "box_plot", "market_mood", "sensex_movement_corr_calculator",
                "compute_public_trading_activity","pegy"
            ));
            if (!validPlotTypes.contains(plotType)) {
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