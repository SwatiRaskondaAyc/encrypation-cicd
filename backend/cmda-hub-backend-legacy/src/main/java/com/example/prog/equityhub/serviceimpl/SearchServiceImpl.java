//package com.example.prog.equityhub.serviceimpl;
//
//import org.springframework.stereotype.Service;
//
//import com.example.prog.entity.equityDataFetch.EquityPlotFetch;
//import com.example.prog.equityhub.repo.ListedSecuritiesRepository;
//import com.example.prog.equityhub.service.SearchService;
//import com.example.prog.repository.equitydatafetchRepo.EquityPlotFetchRepo;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Service;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import java.io.BufferedReader;
//import java.io.InputStreamReader;
//import java.time.LocalDateTime;
//import java.util.*;
//import org.json.JSONObject;
//
//@Service
//public class SearchServiceImpl implements SearchService
//
//{
//	
//	
//	  private static final Logger logger = LoggerFactory.getLogger(SearchServiceImpl.class);
//
//	    @Autowired
//	    private EquityPlotFetchRepo equityPlotFetchRepository;
//
//	    @Autowired
//	    private ListedSecuritiesRepository listedSecuritiesRepository;
//
//	    @Override
//	    public List<Map<String, Object>> getSavedStocks(String userType, Integer userId, String email) {
//	        logger.info("Fetching saved stocks for UserID: {}, UserType: {}, Email: {}", userId, userType, email);
//
//	        List<EquityPlotFetch> savedStocks = equityPlotFetchRepository.findByUserTypeAndUserID(userType, userId);
//
//	        List<Map<String, Object>> results = new ArrayList<>();
//	        for (EquityPlotFetch stock : savedStocks) {
//	            Map<String, Object> stockData = new HashMap<>();
//	            stockData.put("userID", stock.getUserID());
//	            stockData.put("userType", stock.getUserType());
//	            stockData.put("symbol", stock.getSymbol());
//	            stockData.put("companyName", stock.getCompanyName());
//	            stockData.put("updatedAt", stock.getUpdatedAt().toString());
//	            results.add(stockData);
//	        }
//
//	        logger.info("Retrieved {} saved stocks for UserID: {}", results.size(), userId);
//	        return results;
//	    }
//
//	    @Override
//	    public List<Map<String, String>> searchStocks(String query, boolean shouldSave, String userType, Integer userId, String email) {
//	        logger.info("Search request - UserID: {}, UserType: {}, Email: {}, Query: {}, shouldSave: {}",
//	                userId, userType, email, query, shouldSave);
//
//	        List<Map<String, String>> results = new ArrayList<>();
//	        List<Object[]> stockData = listedSecuritiesRepository.findBySymbolOrCompanyName(query);
//
//	        for (Object[] record : stockData) {
//	            String symbol = (String) record[0];
//	            String companyName = (String) record[1];
//	            String basicIndustry = (String) record[2];
//
//	            if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
//	                logger.warn("Invalid stock data for query: {}, symbol: {}, companyName: {}", query, symbol, companyName);
//	                continue;
//	            }
//
//	            if (shouldSave) {
//	                EquityPlotFetch action = getOrSaveUserStockAction(userType, userId, symbol, companyName, true);
//	                if (action == null) {
//	                    logger.error("Failed to save stock action for user: {}, symbol: {}, companyName: {}", 
//	                            userId, symbol, companyName);
//	                }
//	            }
//
//	            Map<String, String> stock = new HashMap<>();
//	            stock.put("symbol", symbol);
//	            stock.put("companyName", companyName);
//	            stock.put("basicIndustry", basicIndustry);
//	            results.add(stock);
//	        }
//
//	        return results;
//	    }
//
//	    @Override
//	    public ResponseEntity<Map<String, String>> deleteSavedStock(String userType, Integer userID, String email, String symbol, String companyName) {
//	        // Validate request body
//	        if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
//	            logger.warn("Missing or empty symbol or companyName in delete request for UserID: {}", userID);
//	            return ResponseEntity.badRequest()
//	                    .body(Map.of("error", "Missing or empty symbol or companyName"));
//	        }
//
//	        // Log deletion request
//	        logger.info("Delete request - UserID: {}, UserType: {}, Email: {}, Symbol: {}, CompanyName: {}",
//	        		userID, userType, email, symbol, companyName);
//
//	        // Check if the stock action exists for the specific user
//	        Optional<EquityPlotFetch> existingActionOpt = equityPlotFetchRepository
//	                .findByUserTypeAndUserIDAndSymbolAndCompanyName(userType, userID, symbol, companyName);
//
//	        if (!existingActionOpt.isPresent()) {
//	            logger.warn("Stock action not found for deletion - UserID: {}, Symbol: {}, CompanyName: {}",
//	            		userID, symbol, companyName);
//	            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//	                    .body(Map.of("error", "Stock not found in saved list"));
//	        }
//
//	        // Delete the stock action
//	        EquityPlotFetch stockToDelete = existingActionOpt.get();
//	        equityPlotFetchRepository.delete(stockToDelete);
//
//	        logger.info("Successfully deleted stock action for UserID: {}, Symbol: {}, CompanyName: {}",
//	        		userID, symbol, companyName);
//
//	        return ResponseEntity.ok(Map.of("message", "Stock successfully deleted from saved list"));
//	    }
//	    @Override
//	    public ResponseEntity<Map<String, Object>> generateValues(String symbol, String companyName) {
//	        logger.info("Symbol: {}, CompanyName: {}", symbol, companyName);
//
//	        if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
//	            return ResponseEntity.badRequest().body(Map.of("error", "Missing or empty symbol or companyName"));
//	        }
//
//	        String formattedSymbol = symbol + " - " + companyName;
//
//	        try {
//	            ProcessBuilder processBuilder = new ProcessBuilder(
//	                    "python", "src/main/resources/scripts/generate_values.py", formattedSymbol
//	            );
//	            processBuilder.redirectErrorStream(true);
//	            Process process = processBuilder.start();
//
//	            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//	            StringBuilder output = new StringBuilder();
//	            String line;
//	            while ((line = reader.readLine()) != null) {
//	                System.err.println("PYTHON ERROR: " + line);
//	                output.append(line);
//	            }
//
//	            int exitCode = process.waitFor();
//	            if (exitCode != 0) {
//	                return ResponseEntity.status(500).body(Map.of("error", "Python script failed with exit code: " + exitCode));
//	            }
//
//	            JSONObject jsonResponse = new JSONObject(output.toString());
//	            return ResponseEntity.ok(jsonResponse.toMap());
//
//	        } catch (Exception e) {
//	            return ResponseEntity.status(500).body(Map.of("error", "Error processing stock data: " + e.getMessage()));
//	        }
//	    }
//
//
//	    @Override
//	    public ResponseEntity<Map<String, Object>> generatePrediction(String symbol, String companyName) {
//	        logger.info("Symbol: {}, CompanyName: {}", symbol, companyName);
//
//	        if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
//	            return ResponseEntity.badRequest().body(Map.of("error", "Missing or empty symbol or companyName"));
//	        }
//
//	        String formattedSymbol = symbol + " - " + companyName;
//
//	        try {
//	            ProcessBuilder processBuilder = new ProcessBuilder(
//	                    "python", "src/main/resources/scripts/ML_algorithms.py", formattedSymbol
//	            );
//	            processBuilder.redirectErrorStream(true);
//	            Process process = processBuilder.start();
//
//	            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//	            StringBuilder output = new StringBuilder();
//	            String line;
//	            while ((line = reader.readLine()) != null) {
//	                System.err.println("PYTHON ERROR: " + line);
//	                output.append(line);
//	            }
//
//	            int exitCode = process.waitFor();
//	            if (exitCode != 0) {
//	                return ResponseEntity.status(500).body(Map.of("error", "Python script failed with exit code: " + exitCode));
//	            }
//
//	            JSONObject jsonResponse = new JSONObject(output.toString());
//	            return ResponseEntity.ok(jsonResponse.toMap());
//
//	        } catch (Exception e) {
//	            return ResponseEntity.status(500).body(Map.of("error", "Error processing stock data: " + e.getMessage()));
//	        }
//	    }
//
//	
//	    
//	    @Override
//	    public ResponseEntity<Map<String, Object>> generatePlot(String symbol, String companyName, String plotType) {
//	        String formattedSymbol = symbol + " - " + companyName;
//	        try {
//	            ProcessBuilder processBuilder = new ProcessBuilder(
//	                    "python", "src/main/resources/scripts/generate_plot.py", plotType, formattedSymbol
//	            );
//	            processBuilder.redirectErrorStream(true);
//	            Process process = processBuilder.start();
//
//	            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//	            StringBuilder output = new StringBuilder();
//	            String line;
//	            while ((line = reader.readLine()) != null) {
//	                System.err.println("PYTHON ERROR: " + line);
//	                output.append(line);
//	            }
//
//	            int exitCode = process.waitFor();
//	            if (exitCode != 0) {
//	                return ResponseEntity.status(500).body(Map.of("error", "Python script failed with exit code: " + exitCode));
//	            }
//
//	            JSONObject jsonResponse = new JSONObject(output.toString());
//	            return ResponseEntity.ok(jsonResponse.toMap());
//
//	        } catch (Exception e) {
//	            return ResponseEntity.status(500).body(Map.of("error", "Error processing stock data: " + e.getMessage()));
//	        }
//	    }
//
//	    @Override
//	    public EquityPlotFetch getOrSaveUserStockAction(String userType, Integer userId, String symbol, String companyName, boolean shouldSave) {
//	        Optional<EquityPlotFetch> existingActionOpt = equityPlotFetchRepository
//	                .findByUserTypeAndUserIDAndSymbolAndCompanyName(userType, userId, symbol, companyName);
//
//	        if (existingActionOpt.isPresent()) {
//	            EquityPlotFetch existingAction = existingActionOpt.get();
//	            logger.info("Existing stock action found for user: {}, symbol: {}, companyName: {}",
//	                    userId, symbol, companyName);
//
//	            if (shouldSave) {
//	                existingAction.setUpdatedAt(LocalDateTime.now());
//	                equityPlotFetchRepository.save(existingAction);
//	                logger.info("Updated existing stock action timestamp for user: {}, symbol: {}, companyName: {}",
//	                        userId, symbol, companyName);
//	            }
//
//	            return existingAction;
//
//	        } else {
//	            if (shouldSave) {
//	                EquityPlotFetch action = new EquityPlotFetch();
//	                action.setUserType(userType);
//	                action.setUserID(userId);
//	                action.setSymbol(symbol);
//	                action.setCompanyName(companyName);
//	                action.setUpdatedAt(LocalDateTime.now());
//	                equityPlotFetchRepository.save(action);
//	                logger.info("Saved new stock action for user: {}, symbol: {}, companyName: {}",
//	                        userId, symbol, companyName);
//	                return action;
//	            } else {
//	                logger.info("User chose not to save stock action for: {}, symbol: {}, companyName: {}",
//	                        userId, symbol, companyName);
//	                return null;
//	            }
//	        }
//	    }
//
//		@Override
//		public ResponseEntity<String> saveStock(String userType, Integer userId, String email, String symbol, String companyName) {
//		    if (symbol == null || companyName == null || symbol.isEmpty() || companyName.isEmpty()) {
//		        return ResponseEntity.badRequest().body("Missing or empty symbol or company name");
//		    }
//
//		    try {
//		        EquityPlotFetch action = getOrSaveUserStockAction(userType, userId, symbol, companyName, true);
//		        if (action != null) {
//		            return ResponseEntity.ok("Stock saved successfully");
//		        } else {
//		            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save stock");
//		        }
//		    } catch (Exception e) {
//		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving stock: " + e.getMessage());
//		    }
//		}
//
//	
//}
//
