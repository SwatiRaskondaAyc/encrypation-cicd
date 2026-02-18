package com.example.prog.equityhub.service;

import com.example.prog.entity.equityDataFetch.EquityPlotFetch;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

// public interface SearchService {
//     List<Map<String, Object>> getSavedStocks(String userType, Integer userId, String email);

//     List<Map<String, String>> searchStocks(String query, boolean shouldSave, String userType, Integer userId, String email, Pageable pageable);

//     ResponseEntity<Map<String, String>> deleteSavedStock(String userType, Integer userID, String email, String symbol, String companyName);

//     ResponseEntity<Map<String, Object>> generateValues(String symbol, String companyName);

//     ResponseEntity<Map<String, Object>> generatePrediction(String symbol, String companyName);

//     ResponseEntity<Map<String, Object>> generatePlot(String symbol, String companyName, String plotType);

//     EquityPlotFetch getOrSaveUserStockAction(String userType, Integer userId, String symbol, String companyName, boolean shouldSave);

//     ResponseEntity<String> saveStock(String userType, Integer userId, String email, String symbol, String companyName);

//     List<Map<String, String>> searchPrefix(String prefix);

//     List<Map<String, String>> getCompanySuggestions(String prefix);
// }

public interface SearchService {
    List<Map<String, Object>> getSavedStocks(String userType, Integer userId, String email);

    List<Map<String, String>> searchStocks(String query, boolean shouldSave, String userType, Integer userId, String email, Pageable pageable);

    ResponseEntity<Map<String, String>> deleteSavedStock(String userType, Integer userID, String email, String symbol, String companyName);

    ResponseEntity<Map<String, Object>> generateValues(String symbol, String companyName);

    ResponseEntity<Map<String, Object>> generatePrediction(String symbol, String companyName);

    ResponseEntity<Map<String, Object>> generatePlot(String symbol, String companyName, String plotType);

    EquityPlotFetch getOrSaveUserStockAction(String userType, Integer userId, String symbol, String companyName, boolean shouldSave);

    ResponseEntity<String> saveStock(String userType, Integer userId, String email, String symbol, String companyName);

    List<Map<String, String>> searchPrefix(String prefix);

    List<Map<String, String>> getCompanySuggestions(String prefix);

    // New method to get the count of companies
    int getCompaniesCount();
}