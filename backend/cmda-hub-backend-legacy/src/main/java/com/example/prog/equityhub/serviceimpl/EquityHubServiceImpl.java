// package com.example.prog.equityhub.serviceimpl;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.*;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;

// import com.example.prog.entity.equityDataFetch.EquityPlotFetch;
// import com.example.prog.equityhub.entity.ListedSecurities;
// import com.example.prog.equityhub.repo.ListedSecuritiesRepository;
// import com.example.prog.equityhub.service.SearchService;
// import com.example.prog.repository.equitydatafetchRepo.EquityPlotFetchRepo;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;
// import java.util.concurrent.ConcurrentHashMap;
// import jakarta.annotation.PostConstruct;

// import org.springframework.web.client.HttpClientErrorException;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import java.time.LocalDateTime;
// import java.util.*;
// import java.util.stream.Collectors;

// @Service
// public class EquityHubServiceImpl implements SearchService {

//     private static final Logger logger = LoggerFactory.getLogger(EquityHubServiceImpl.class);

//     private static final int MAX_SUGGESTIONS = 10;

//     @Autowired
//     private EquityPlotFetchRepo equityPlotFetchRepository;

//     @Autowired
//     private ListedSecuritiesRepository listedSecuritiesRepository;

//     @Value("${fastapi.service.url:http://127.0.0.1:8000}")
//     private String fastApiBaseUrl;

//     private final Map<String, List<Map<String, String>>> prefixCache = new ConcurrentHashMap<>();
//     private List<ListedSecurities> allCompanies;

//     @PostConstruct
//     public void init() {
//         logger.info("Loading all companies for search optimization...");
//         long startTime = System.currentTimeMillis();
        
//         allCompanies = listedSecuritiesRepository.findAll();
        
//         // Query all companies with basicIndustry
//         List<Object[]> companyData = listedSecuritiesRepository.findCompaniesByPrefix("", 0, Integer.MAX_VALUE);
//         Map<String, Map<String, String>> companyMap = companyData.stream()
//             .collect(Collectors.toMap(
//                 row -> (String) row[0], // symbol
//                 row -> Map.of(
//                     "symbol", (String) row[0],
//                     "companyName", (String) row[1],
//                     "basicIndustry", row[2] != null ? (String) row[2] : ""
//                 ),
//                 (a, b) -> a, // Keep first occurrence to avoid duplicates
//                 LinkedHashMap::new
//             ));

//         // Build cache for first 3 characters of symbol and company name
//         for (int i = 1; i <= 3; i++) {
//             for (ListedSecurities company : allCompanies) {
//                 Map<String, String> companyDataMap = companyMap.get(company.getSymbol());
//                 if (companyDataMap == null) continue; // Skip if no matching data

//                 // Cache by company name prefix
//                 if (company.getCompanyName().length() >= i) {
//                     String namePrefix = company.getCompanyName().substring(0, i).toLowerCase();
//                     prefixCache.computeIfAbsent(namePrefix, k -> new ArrayList<>())
//                               .add(companyDataMap);
//                 }
//                 // Cache by symbol prefix
//                 if (company.getSymbol().length() >= i) {
//                     String symbolPrefix = company.getSymbol().substring(0, i).toLowerCase();
//                     prefixCache.computeIfAbsent(symbolPrefix, k -> new ArrayList<>())
//                               .add(companyDataMap);
//                 }
//             }
//         }

//         // Deduplicate cache entries for each prefix
//         prefixCache.replaceAll((key, value) -> value.stream()
//             .collect(Collectors.toMap(
//                 m -> m.get("symbol"), 
//                 m -> m, 
//                 (a, b) -> a, 
//                 LinkedHashMap::new
//             ))
//             .values()
//             .stream()
//             .collect(Collectors.toList()));

//         logger.info("Loaded {} companies in {} ms", allCompanies.size(), 
//                    System.currentTimeMillis() - startTime);
//     }

//     @Override
//     public List<Map<String, String>> searchPrefix(String prefix) {
//         if (prefix == null || prefix.trim().isEmpty()) {
//             return Collections.emptyList();
//         }

//         final String searchPrefix = prefix.toLowerCase();
//         List<Map<String, String>> securities;

//         if (searchPrefix.length() <= 3 && prefixCache.containsKey(searchPrefix)) {
//             securities = prefixCache.get(searchPrefix);
//         } else {
//             List<Object[]> results = listedSecuritiesRepository.findCompaniesByPrefix(searchPrefix, 0, MAX_SUGGESTIONS);
//             securities = results.stream()
//                 .map(row -> Map.of(
//                     "symbol", (String) row[0],
//                     "companyName", (String) row[1],
//                     "basicIndustry", row[2] != null ? (String) row[2] : ""
//                 ))
//                 .toList();
//         }

//         // Remove duplicates based on "symbol"
//         return securities.stream()
//             .collect(Collectors.collectingAndThen(
//                 Collectors.toMap(m -> m.get("symbol"), m -> m, (a, b) -> a, LinkedHashMap::new),
//                 map -> new ArrayList<>(map.values())
//             ));
//     }

//     @Override
//     public List<Map<String, String>> getCompanySuggestions(String prefix) {
//         long startTime = System.currentTimeMillis();
//         final String searchPrefix = prefix.toLowerCase();
        
//         List<Map<String, String>> results;
//         if (prefixCache.containsKey(searchPrefix)) {
//             logger.debug("Cache hit for prefix: {}", searchPrefix);
//             results = prefixCache.get(searchPrefix);
//         } else {
//             results = searchPrefix(searchPrefix);
//         }

//         // Ensure no duplicates in the final output
//         results = results.stream()
//             .collect(Collectors.collectingAndThen(
//                 Collectors.toMap(m -> m.get("symbol"), m -> m, (a, b) -> a, LinkedHashMap::new),
//                 map -> new ArrayList<>(map.values())
//             ))
//             .stream()
//             .limit(MAX_SUGGESTIONS)
//             .collect(Collectors.toList());
        
//         logger.debug("Search for prefix '{}' took {} ms", searchPrefix, 
//                    System.currentTimeMillis() - startTime);
        
//         return results;
//     }

//     @Override
//     public List<Map<String, Object>> getSavedStocks(String userType, Integer userId, String email) {
//         logger.info("Fetching saved stocks for UserID: {}, UserType: {}, Email: {}", userId, userType, email);

//         List<EquityPlotFetch> savedStocks = equityPlotFetchRepository.findByUserTypeAndUserID(userType, userId);

//         List<Map<String, Object>> results = new ArrayList<>();
//         for (EquityPlotFetch stock : savedStocks) {
//             Map<String, Object> stockData = new HashMap<>();
//             stockData.put("userID", stock.getUserID());
//             stockData.put("userType", stock.getUserType());
//             stockData.put("symbol", stock.getSymbol());
//             stockData.put("companyName", stock.getCompanyName());
//             stockData.put("updatedAt", stock.getUpdatedAt().toString());
//             results.add(stockData);
//         }

//         logger.info("Retrieved {} saved stocks for UserID: {}", results.size(), userId);
//         return results;
//     }

//     @Override
//     public List<Map<String, String>> searchStocks(String query, boolean shouldSave, 
//             String userType, Integer userId, String email, Pageable pageable) {
//         logger.info("Search request - UserID: {}, UserType: {}, Email: {}, Query: {}, shouldSave: {}",
//                 userId, userType, email, query, shouldSave);

//         String searchQuery = (query != null ? query.trim() : "") + "%";

//         List<Map<String, String>> results = new ArrayList<>();
//         Page<Object[]> stockData = listedSecuritiesRepository.findBySymbolOrCompanyName(searchQuery, pageable);

//         for (Object[] record : stockData.getContent()) {
//             String symbol = (String) record[0];
//             String companyName = (String) record[1];
//             String basicIndustry = (String) record[2];

//             if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
//                 logger.warn("Invalid stock data for query: {}, symbol: {}, companyName: {}", query, symbol, companyName);
//                 continue;
//             }

//             if (shouldSave) {
//                 EquityPlotFetch action = getOrSaveUserStockAction(userType, userId, symbol, companyName, true);
//                 if (action == null) {
//                     logger.error("Failed to save stock action for user: {}, symbol: {}, companyName: {}",
//                             userId, symbol, companyName);
//                 }
//             }

//             Map<String, String> stock = new HashMap<>();
//             stock.put("symbol", symbol);
//             stock.put("companyName", companyName);
//             stock.put("basicIndustry", basicIndustry != null ? basicIndustry : "");
//             results.add(stock);
//         }

//         return results;
//     }

//     @Override
//     public ResponseEntity<Map<String, String>> deleteSavedStock(String userType, Integer userID, String email, String symbol, String companyName) {
//         if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
//             logger.warn("Missing or empty symbol or companyName in delete request for UserID: {}", userID);
//             return ResponseEntity.badRequest()
//                     .body(Map.of("error", "Missing or empty symbol or companyName"));
//         }

//         logger.info("Delete request - UserID: {}, UserType: {}, Email: {}, Symbol: {}, CompanyName: {}",
//                 userID, userType, email, symbol, companyName);

//         Optional<EquityPlotFetch> existingActionOpt = equityPlotFetchRepository
//                 .findByUserTypeAndUserIDAndSymbolAndCompanyName(userType, userID, symbol, companyName);

//         if (!existingActionOpt.isPresent()) {
//             logger.warn("Stock action not found for deletion - UserID: {}, Symbol: {}, CompanyName: {}",
//                     userID, symbol, companyName);
//             return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                     .body(Map.of("error", "Stock not found in saved list"));
//         }

//         EquityPlotFetch stockToDelete = existingActionOpt.get();
//         equityPlotFetchRepository.delete(stockToDelete);

//         logger.info("Successfully deleted stock action for UserID: {}, Symbol: {}, CompanyName: {}",
//                 userID, symbol, companyName);

//         return ResponseEntity.ok(Map.of("message", "Stock successfully deleted from saved list"));
//     }

//     @Override
//     public ResponseEntity<Map<String, Object>> generateValues(String symbol, String companyName) {
//         logger.info("Generating values for Symbol: {}, CompanyName: {}", symbol, companyName);

//         if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
//             return ResponseEntity.badRequest().body(Map.of("error", "Missing or empty symbol or companyName"));
//         }

//         try {
//             RestTemplate restTemplate = new RestTemplate();
//             String formattedSymbol = symbol.toUpperCase();
//             String url = String.format("%s/generate_values?symbols=%s", fastApiBaseUrl, formattedSymbol);

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
//             logger.error("FastAPI error for generateValues: {}", e.getResponseBodyAsString());
//             return ResponseEntity.status(e.getStatusCode())
//                     .body(Map.of("error", "FastAPI error: " + e.getResponseBodyAsString()));
//         } catch (Exception e) {
//             logger.error("Error calling FastAPI for generateValues: {}", e.getMessage());
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
//         }
//     }

//     @Override
//     public ResponseEntity<Map<String, Object>> generatePrediction(String symbol, String companyName) {
//         logger.info("Generating prediction for Symbol: {}, CompanyName: {}", symbol, companyName);

//         if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
//             return ResponseEntity.badRequest().body(Map.of("error", "Missing or empty symbol or companyName"));
//         }

//         try {
//             RestTemplate restTemplate = new RestTemplate();
//             String formattedSymbol = symbol.toUpperCase();
//             String url = String.format("%s/generate_prediction?symbols=%s", fastApiBaseUrl, formattedSymbol);

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
//             logger.error("FastAPI error for generatePrediction: {}", e.getResponseBodyAsString());
//             return ResponseEntity.status(e.getStatusCode())
//                     .body(Map.of("error", "FastAPI error: " + e.getResponseBodyAsString()));
//         } catch (Exception e) {
//             logger.error("Error calling FastAPI for generatePrediction: {}", e.getMessage());
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
//         }
//     }

//     @Override
//     public ResponseEntity<Map<String, Object>> generatePlot(String symbol, String companyName, String plotType) {
//         logger.info("Generating plot for Symbol: {}, CompanyName: {}, PlotType: {}", symbol, companyName, plotType);

//         if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
//             return ResponseEntity.badRequest().body(Map.of("error", "Missing or empty symbol or companyName"));
//         }

//         try {
//             RestTemplate restTemplate = new RestTemplate();
//             String formattedSymbol = symbol.toUpperCase();
//             String url = String.format("%s/plot_generation?symbols=%s&plot_type=%s&period=TTM",
//                     fastApiBaseUrl, formattedSymbol, plotType);

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
//             logger.error("FastAPI error for plot generation: {}", e.getResponseBodyAsString());
//             return ResponseEntity.status(e.getStatusCode())
//                     .body(Map.of("error", "FastAPI error: " + e.getResponseBodyAsString()));
//         } catch (Exception e) {
//             logger.error("Error calling FastAPI for plot generation: {}", e.getMessage());
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
//         }
//     }

//     @Override
//     public EquityPlotFetch getOrSaveUserStockAction(String userType, Integer userId, String symbol, String companyName, boolean shouldSave) {
//         Optional<EquityPlotFetch> existingActionOpt = equityPlotFetchRepository
//                 .findByUserTypeAndUserIDAndSymbolAndCompanyName(userType, userId, symbol, companyName);

//         if (existingActionOpt.isPresent()) {
//             EquityPlotFetch existingAction = existingActionOpt.get();
//             logger.info("Existing stock action found for user: {}, symbol: {}, companyName: {}",
//                     userId, symbol, companyName);

//             if (shouldSave) {
//                 existingAction.setUpdatedAt(LocalDateTime.now());
//                 equityPlotFetchRepository.save(existingAction);
//                 logger.info("Updated existing stock action timestamp for user: {}, symbol: {}, companyName: {}",
//                         userId, symbol, companyName);
//             }

//             return existingAction;

//         } else {
//             if (shouldSave) {
//                 EquityPlotFetch action = new EquityPlotFetch();
//                 action.setUserType(userType);
//                 action.setUserID(userId);
//                 action.setSymbol(symbol);
//                 action.setCompanyName(companyName);
//                 action.setUpdatedAt(LocalDateTime.now());
//                 equityPlotFetchRepository.save(action);
//                 logger.info("Saved new stock action for user: {}, symbol: {}, companyName: {}",
//                         userId, symbol, companyName);
//                 return action;
//             } else {
//                 logger.info("User chose not to save stock action for: {}, symbol: {}, companyName: {}",
//                         userId, symbol, companyName);
//                 return null;
//             }
//         }
//     }

//     @Override
//     public ResponseEntity<String> saveStock(String userType, Integer userId, String email, String symbol, String companyName) {
//         if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
//             return ResponseEntity.badRequest().body("Missing or empty symbol or company name");
//         }

//         try {
//             EquityPlotFetch action = getOrSaveUserStockAction(userType, userId, symbol, companyName, true);
//             if (action != null) {
//                 return ResponseEntity.ok("Stock saved successfully");
//             } else {
//                 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save stock");
//             }
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving stock: " + e.getMessage());
//         }
//     }
// }

package com.example.prog.equityhub.serviceimpl;

import com.example.prog.entity.equityDataFetch.EquityPlotFetch;
import com.example.prog.equityhub.repo.ListedSecuritiesRepository;
import com.example.prog.repository.equitydatafetchRepo.EquityPlotFetchRepo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import com.example.prog.equityhub.service.SearchService;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class EquityHubServiceImpl implements SearchService {

    private static final Logger logger = LoggerFactory.getLogger(EquityHubServiceImpl.class);

    private static final int MAX_SUGGESTIONS = 10;

    @Autowired
    private EquityPlotFetchRepo equityPlotFetchRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${fastapi.service.url:http://127.0.0.1:8000}")
    private String fastApiBaseUrl;

    // In-memory list of companies loaded from JSON query
    private List<Map<String, String>> companies = new ArrayList<>();

    @PostConstruct
    public void init() {
        logger.info("Initializing service and loading companies...");
        loadCompanies();
    }

    @Scheduled(cron = "0 0 0 * * ?") // Run every day at midnight
    public void refreshCompanies() {
        logger.info("Refreshing companies data...");
        loadCompanies();
    }

    private void loadCompanies() {
        // String sql = "SET NOCOUNT ON; " +
        //              "SELECT DISTINCT CompName, Symbol, industry " +
        //              "FROM [Accord_Data].dbo.Company_master " +
        //              "WHERE Symbol IS NOT NULL " +
        //              "AND LTRIM(RTRIM(Symbol)) <> '' " +
        //              "AND industry IS NOT NULL " +
        //              "AND LTRIM(RTRIM(industry)) <> 'Unspecified' " +
        //              "FOR JSON PATH, ROOT('Companies');";

            String sql =
                        "SET NOCOUNT ON; " +
                        "SELECT DISTINCT CompName, Symbol, industry " +
                        "FROM [Accord_Data].dbo.Company_master " +   // <-- space after table
                        "WHERE Symbol IS NOT NULL " +                // <-- space after condition
                        "AND LTRIM(RTRIM(Symbol)) <> '' " +
                        "AND industry NOT IN ('Cash and Cash Equivalents','ETF', 'Index') " +
                        "AND industry IS NOT NULL " +
                        "AND LTRIM(RTRIM(industry)) <> 'Unspecified' " +
                        "AND Nse_sublisting = 'Active' " +
                        "FOR JSON PATH, ROOT('Companies');";

        try {
            String json = jdbcTemplate.query(sql, rs -> {
                StringBuilder jsonBuilder = new StringBuilder();
                while (rs.next()) {
                    jsonBuilder.append(rs.getString(1));
                }
                return jsonBuilder.toString();
            });

            if (json == null || json.isEmpty()) {
                logger.error("No data returned from companies query");
                return;
            }
            logger.debug("Raw JSON from query: {}", json);

            Map<String, List<Map<String, String>>> data = objectMapper.readValue(json, new TypeReference<Map<String, List<Map<String, String>>>>() {});
            List<Map<String, String>> loadedCompanies = data.get("Companies");

            if (loadedCompanies == null) {
                logger.error("Invalid JSON structure: missing 'Companies' root");
                return;
            }

            // Log each company's fields for debugging
            loadedCompanies.forEach(c -> logger.debug("Loaded company: Symbol={}, CompName={}, industry={}",
                    c.get("Symbol"), c.get("CompName"), c.get("industry")));

            // Map CompName to CompanyName and industry to Basic_Industry for frontend compatibility
            loadedCompanies = loadedCompanies.stream()
                    .map(c -> Map.of(
                            "Symbol", c.getOrDefault("Symbol", ""),
                            "CompanyName", c.getOrDefault("CompName", ""),
                            "Basic_Industry", c.getOrDefault("industry", "")
                    ))
                    .collect(Collectors.toMap(
                            m -> m.get("Symbol"),
                            m -> m,
                            (a, b) -> a, // Keep first occurrence for duplicates
                            LinkedHashMap::new
                    ))
                    .values()
                    .stream()
                    .collect(Collectors.toList());

            synchronized (this) {
                this.companies = loadedCompanies;
            }
            logger.info("Loaded {} companies from JSON query", this.companies.size());
        } catch (Exception e) {
            logger.error("Error loading companies from JSON query: {}", e.getMessage(), e);
        }
    }

    @Override
    public List<Map<String, String>> searchPrefix(String prefix) {
        if (prefix == null || prefix.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String searchPrefix = prefix.toLowerCase();
        return companies.stream()
                .filter(c -> (c.get("CompanyName") != null && c.get("CompanyName").toLowerCase().startsWith(searchPrefix)) ||
                        (c.get("Symbol") != null && c.get("Symbol").toLowerCase().startsWith(searchPrefix)))
                .map(c -> Map.of(
                        "symbol", c.get("Symbol"),
                        "companyName", c.get("CompanyName"),
                        "basicIndustry", c.getOrDefault("Basic_Industry", "")
                ))
                .sorted(Comparator.comparing(m -> m.get("companyName")))
                .limit(MAX_SUGGESTIONS)
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, String>> getCompanySuggestions(String prefix) {
        long startTime = System.currentTimeMillis();
        List<Map<String, String>> results = searchPrefix(prefix);
        logger.debug("Search for prefix '{}' took {} ms and returned {} results", prefix, System.currentTimeMillis() - startTime, results.size());
        return results;
    }

    @Override
    public List<Map<String, Object>> getSavedStocks(String userType, Integer userId, String email) {
        logger.info("Fetching saved stocks for UserID: {}, UserType: {}, Email: {}", userId, userType, email);

        List<EquityPlotFetch> savedStocks = equityPlotFetchRepository.findByUserTypeAndUserID(userType, userId);

        List<Map<String, Object>> results = new ArrayList<>();
        for (EquityPlotFetch stock : savedStocks) {
            Map<String, Object> stockData = new HashMap<>();
            stockData.put("userID", stock.getUserID());
            stockData.put("userType", stock.getUserType());
            stockData.put("symbol", stock.getSymbol());
            stockData.put("companyName", stock.getCompanyName());
            stockData.put("updatedAt", stock.getUpdatedAt().toString());
            results.add(stockData);
        }

        logger.info("Retrieved {} saved stocks for UserID: {}", results.size(), userId);
        return results;
    }

    @Override
    public List<Map<String, String>> searchStocks(String query, boolean shouldSave, 
            String userType, Integer userId, String email, Pageable pageable) {
        logger.info("Search request - UserID: {}, UserType: {}, Email: {}, Query: {}, shouldSave: {}",
                userId, userType, email, query, shouldSave);

        String searchQuery = (query != null ? query.trim().toUpperCase() : "");

        List<Map<String, String>> filtered = companies.stream()
                .filter(c -> (c.get("Symbol") != null && c.get("Symbol").toUpperCase().startsWith(searchQuery)) ||
                        (c.get("CompanyName") != null && c.get("CompanyName").toUpperCase().startsWith(searchQuery)))
                .map(c -> Map.of(
                        "symbol", c.get("Symbol"),
                        "companyName", c.get("CompanyName"),
                        "basicIndustry", c.getOrDefault("Basic_Industry", "")
                ))
                .sorted(Comparator.comparing(m -> m.get("companyName")))
                .collect(Collectors.toList());

        // Apply pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), filtered.size());
        List<Map<String, String>> results = (start < filtered.size()) ? filtered.subList(start, end) : new ArrayList<>();

        for (Map<String, String> stock : results) {
            String symbol = stock.get("symbol");
            String companyName = stock.get("companyName");

            if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
                logger.warn("Invalid stock data for query: {}, symbol: {}, companyName: {}", query, symbol, companyName);
                continue;
            }

            if (shouldSave) {
                EquityPlotFetch action = getOrSaveUserStockAction(userType, userId, symbol, companyName, true);
                if (action == null) {
                    logger.error("Failed to save stock action for user: {}, symbol: {}, companyName: {}",
                            userId, symbol, companyName);
                }
            }
        }

        return results;
    }

    @Override
    public ResponseEntity<Map<String, String>> deleteSavedStock(String userType, Integer userID, String email, String symbol, String companyName) {
        if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
            logger.warn("Missing or empty symbol or companyName in delete request for UserID: {}", userID);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Missing or empty symbol or companyName"));
        }

        logger.info("Delete request - UserID: {}, UserType: {}, Email: {}, Symbol: {}, CompanyName: {}",
                userID, userType, email, symbol, companyName);

        Optional<EquityPlotFetch> existingActionOpt = equityPlotFetchRepository
                .findByUserTypeAndUserIDAndSymbolAndCompanyName(userType, userID, symbol, companyName);

        if (!existingActionOpt.isPresent()) {
            logger.warn("Stock action not found for deletion - UserID: {}, Symbol: {}, CompanyName: {}",
                    userID, symbol, companyName);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Stock not found in saved list"));
        }

        EquityPlotFetch stockToDelete = existingActionOpt.get();
        equityPlotFetchRepository.delete(stockToDelete);

        logger.info("Successfully deleted stock action for UserID: {}, Symbol: {}, CompanyName: {}",
                userID, symbol, companyName);

        return ResponseEntity.ok(Map.of("message", "Stock successfully deleted from saved list"));
    }

    @Override
    public ResponseEntity<Map<String, Object>> generateValues(String symbol, String companyName) {
        logger.info("Generating values for Symbol: {}, CompanyName: {}", symbol, companyName);

        if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing or empty symbol or companyName"));
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            String formattedSymbol = symbol.toUpperCase();
            String url = String.format("%s/generate_values?symbols=%s", fastApiBaseUrl, formattedSymbol);

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
            logger.error("FastAPI error for generateValues: {}", e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", "FastAPI error: " + e.getResponseBodyAsString()));
        } catch (Exception e) {
            logger.error("Error calling FastAPI for generateValues: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
        }
    }

    @Override
    public ResponseEntity<Map<String, Object>> generatePrediction(String symbol, String companyName) {
        logger.info("Generating prediction for Symbol: {}, CompanyName: {}", symbol, companyName);

        if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing or empty symbol or companyName"));
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            String formattedSymbol = symbol.toUpperCase();
            String url = String.format("%s/generate_prediction?symbols=%s", fastApiBaseUrl, formattedSymbol);

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
            logger.error("FastAPI error for generatePrediction: {}", e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", "FastAPI error: " + e.getResponseBodyAsString()));
        } catch (Exception e) {
            logger.error("Error calling FastAPI for generatePrediction: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
        }
    }

    @Override
    public ResponseEntity<Map<String, Object>> generatePlot(String symbol, String companyName, String plotType) {
        logger.info("Generating plot for Symbol: {}, CompanyName: {}, PlotType: {}", symbol, companyName, plotType);

        if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing or empty symbol or companyName"));
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            String formattedSymbol = symbol.toUpperCase();
            String url = String.format("%s/plot_generation?symbols=%s&plot_type=%s&period=TTM",
                    fastApiBaseUrl, formattedSymbol, plotType);

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
            logger.error("FastAPI error for plot generation: {}", e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", "FastAPI error: " + e.getResponseBodyAsString()));
        } catch (Exception e) {
            logger.error("Error calling FastAPI for plot generation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error processing stock data: " + e.getMessage()));
        }
    }

    @Override
    public EquityPlotFetch getOrSaveUserStockAction(String userType, Integer userId, String symbol, String companyName, boolean shouldSave) {
        Optional<EquityPlotFetch> existingActionOpt = equityPlotFetchRepository
                .findByUserTypeAndUserIDAndSymbolAndCompanyName(userType, userId, symbol, companyName);

        if (existingActionOpt.isPresent()) {
            EquityPlotFetch existingAction = existingActionOpt.get();
            logger.info("Existing stock action found for user: {}, symbol: {}, companyName: {}",
                    userId, symbol, companyName);

            if (shouldSave) {
                existingAction.setUpdatedAt(LocalDateTime.now());
                equityPlotFetchRepository.save(existingAction);
                logger.info("Updated existing stock action timestamp for user: {}, symbol: {}, companyName: {}",
                        userId, symbol, companyName);
            }

            return existingAction;

        } else {
            if (shouldSave) {
                EquityPlotFetch action = new EquityPlotFetch();
                action.setUserType(userType);
                action.setUserID(userId);
                action.setSymbol(symbol);
                action.setCompanyName(companyName);
                action.setUpdatedAt(LocalDateTime.now());
                equityPlotFetchRepository.save(action);
                logger.info("Saved new stock action for user: {}, symbol: {}, companyName: {}",
                        userId, symbol, companyName);
                return action;
            } else {
                logger.info("User chose not to save stock action for: {}, symbol: {}, companyName: {}",
                        userId, symbol, companyName);
                return null;
            }
        }
    }

    @Override
    public ResponseEntity<String> saveStock(String userType, Integer userId, String email, String symbol, String companyName) {
        if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
            return ResponseEntity.badRequest().body("Missing or empty symbol or company name");
        }

        try {
            EquityPlotFetch action = getOrSaveUserStockAction(userType, userId, symbol, companyName, true);
            if (action != null) {
                return ResponseEntity.ok("Stock saved successfully");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save stock");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving stock: " + e.getMessage());
        }
    }

    @Override
    public int getCompaniesCount() {
        synchronized (this) {
            return companies.size();
        }
    }
}