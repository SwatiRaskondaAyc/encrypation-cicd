
package com.example.prog.new_portfolio.controller;

import com.example.prog.new_portfolio.dto.ApiResponse;
import com.example.prog.new_portfolio.dto.PortfolioDateRangeDTO;
import com.example.prog.new_portfolio.dto.TradeTransactionDTO;
import com.example.prog.new_portfolio.dto.UserContext;
import com.example.prog.entity.new_portfolio.MasterUserLedger;
import com.example.prog.repository.new_portfolio.MasterUserLedgerRepository;
import com.example.prog.new_portfolio.services.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    

    private final PortfolioAnalysisService analysisService;
    private final PortfolioSchemaService schemaService;
    private final PortfolioDataPersistenceService dataPersistenceService;
    private final UserResolverService userResolverService;
    private final MasterUserLedgerRepository masterRepository;
    private final ObjectMapper mapper;
    private final PortfolioOrchestratorService orchestratorService;
    private final MetricsService metricsService;
    private final WhatIfService whatIfService;
  

    // public PortfolioController(
    //         PortfolioAnalysisService analysisService,
    //         PortfolioSchemaService schemaService,
    //         PortfolioDataPersistenceService dataPersistenceService,
    //         UserResolverService userResolverService,
    //         MasterUserLedgerRepository masterRepository,
    //         ObjectMapper mapper,
    //         PortfolioOrchestratorService orchestratorService) {
    //     this.analysisService = analysisService;
    //     this.schemaService = schemaService;
    //     this.dataPersistenceService = dataPersistenceService;
    //     this.userResolverService = userResolverService;
    //     this.masterRepository = masterRepository;
    //     this.mapper = mapper;
    //     this.orchestratorService = orchestratorService;
    // }

    public PortfolioController(
            PortfolioAnalysisService analysisService,
            PortfolioSchemaService schemaService,
            PortfolioDataPersistenceService dataPersistenceService,
            UserResolverService userResolverService,
            MasterUserLedgerRepository masterRepository,
            ObjectMapper mapper,
            PortfolioOrchestratorService orchestratorService,
            MetricsService metricsService,   
            WhatIfService whatIfService) {

        this.analysisService = analysisService;
        this.schemaService = schemaService;
        this.dataPersistenceService = dataPersistenceService;
        this.userResolverService = userResolverService;
        this.masterRepository = masterRepository;
        this.mapper = mapper;
        this.orchestratorService = orchestratorService;
        this.metricsService = metricsService;
        this.whatIfService = whatIfService;
        
    }

    /**
     * 1. ANALYZE & SAVE
     * Normalizes file via FastAPI and registers/updates the Master Ledger.
     */

    @PostMapping("/normalized")
    public ResponseEntity<ApiResponse<List<TradeTransactionDTO>>> analyzeAndSavePortfolio(
            HttpServletRequest request,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean save,
            @RequestParam(required = false) String portfolioId,
            @RequestParam(required = false) String portfolioName,
            @RequestParam(required = false) String brokerId) throws Exception {

        UserContext user = userResolverService.getUserInfo(request);
        String userIdStr = String.valueOf(user.getUserId());
        String tableName = generateTableName(user);

        // 1. Parse file (Independent of DB transaction)
        List<TradeTransactionDTO> fileTrades = parseTrades(file, brokerId);
        if (fileTrades.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse<>(false, "SYSTEM", "No trades found in file.", null));
        }

        // --- CASE A: PREVIEW ONLY ---
        if (!save) {
            return ResponseEntity.ok(new ApiResponse<>(true, "SYSTEM", "Preview data only.", fileTrades));
        }

        // --- CASE B: SAVE (Atomic Operation) ---
        if (portfolioId == null || brokerId == null) {
            throw new IllegalArgumentException("Portfolio ID and Broker ID are required to save.");
        }

        // Call orchestrator for atomic business logic and DB updates
        orchestratorService.processAndSavePortfolio(
                user, tableName, portfolioId, portfolioName, brokerId, fileTrades);

        // 2. Fetch full history to return to UI
        List<TradeTransactionDTO> fullHistory = dataPersistenceService.findAllTrades(tableName, portfolioId);

        return ResponseEntity.ok(new ApiResponse<>(true, "SYSTEM", "Saved successfully.", fullHistory));
    }
    /**
     * 2. GET TRADES BY RANGE
     * Fetches trades from the user-specific dynamic table.
     */
    @GetMapping("/get_trades_inrange")
    public ResponseEntity<ApiResponse<List<TradeTransactionDTO>>> getTrades(
            HttpServletRequest request,
            @RequestParam String portfolioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        UserContext user = userResolverService.getUserInfo(request);
        String tableName = generateTableName(user);

        List<TradeTransactionDTO> trades = dataPersistenceService.findTradesByDateRange(
                tableName, portfolioId, startDate, endDate);

        return ResponseEntity.ok(new ApiResponse<>(true, "SYSTEM", "Retrieved " + trades.size() + " trades.", trades));
    }

    /**
     * 3. DELETE SPECIFIC RANGE
     * Deletes a slice of data from the dynamic table.
     */
    @DeleteMapping("/delete_trades")
    public ResponseEntity<ApiResponse<Void>> deleteTradesRange(
            HttpServletRequest request,
            @RequestParam String portfolioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        UserContext user = userResolverService.getUserInfo(request);
        String tableName = generateTableName(user);

        dataPersistenceService.deleteTradesByDateRange(tableName, portfolioId, startDate, endDate);

        return ResponseEntity.ok(new ApiResponse<>(true, "SYSTEM", "Trades deleted for the selected range.", null));
    }

   
    @DeleteMapping("/full_delete")
    public ResponseEntity<ApiResponse<Void>> deleteEntirePortfolio(
            HttpServletRequest request,
            @RequestParam String portfolioId) {

        UserContext user = userResolverService.getUserInfo(request);
        String tableName = generateTableName(user);

        // Atomic delete via Orchestrator
        orchestratorService.deleteEntirePortfolio(String.valueOf(user.getUserId()), portfolioId, tableName);

        return ResponseEntity.ok(new ApiResponse<>(true, "SYSTEM", "Portfolio wiped completely.", null));
    }

    /**
     * 5. LIST USER PORTFOLIOS (LEDGERS)
     * Returns all registered portfolios for the logged-in user.
     */
    @GetMapping("/my_portfolios")
    public ResponseEntity<ApiResponse<List<MasterUserLedger>>> getMyPortfolios(HttpServletRequest request) {
        UserContext user = userResolverService.getUserInfo(request);
        List<MasterUserLedger> ledgers = masterRepository.findByUserId(String.valueOf(user.getUserId()));
        return ResponseEntity.ok(new ApiResponse<>(true, "SYSTEM", "Ledgers retrieved.", ledgers));
    }

    /**
     * 6. GET CURRENT DATE RANGE
     */
    @GetMapping("/range")
    public ResponseEntity<ApiResponse<PortfolioDateRangeDTO>> getRange(
            HttpServletRequest request,
            @RequestParam String portfolioId) {

        UserContext user = userResolverService.getUserInfo(request);
        String tableName = generateTableName(user);

        PortfolioDateRangeDTO range = dataPersistenceService.getPortfolioDateRange(tableName, portfolioId);

        return ResponseEntity.ok(new ApiResponse<>(true, "SYSTEM", "Range fetched.", range));
    }

    /**
     * 9. GET ALL TRADES FOR A SPECIFIC PORTFOLIO
     * Retrieves the complete transaction history from the user's dynamic table.
     */
    @GetMapping("/all_trades")
    public ResponseEntity<ApiResponse<List<TradeTransactionDTO>>> getAllTrades(
            HttpServletRequest request,
            @RequestParam String portfolioId) {

        // 1. Extract user context to identify the correct dynamic table
        UserContext user = userResolverService.getUserInfo(request);
        String tableName = generateTableName(user);

        // 2. Fetch data using your existing persistence method
        // This method is efficient as it uses the specialized userLedgerJdbcTemplate
        List<TradeTransactionDTO> allTrades = dataPersistenceService.findAllTrades(tableName, portfolioId);

        // 3. Return structured response
        String message = allTrades.isEmpty()
                ? "No transaction history found for this portfolio."
                : "Retrieved " + allTrades.size() + " trades successfully.";

        return ResponseEntity.ok(new ApiResponse<>(true, "SYSTEM", message, allTrades));
    }

    /**
     * 7. RAW JSON ANALYSIS
     * Forwards JSON directly to Python FastAPI.
     */
    @PostMapping("/analyze-json")
    public ResponseEntity<String> analyzePortfolioJson(@RequestBody Object jsonData) {
        String result = analysisService.analyzePortfolio(jsonData);
        return ResponseEntity.ok(result);
    }

    /**
     * 8. UPDATE PORTFOLIO NAME
     * Updates the display name of a specific portfolio in the Master Ledger.
     */
    @PutMapping("/update_name")
    public ResponseEntity<ApiResponse<MasterUserLedger>> updatePortfolioName(
            HttpServletRequest request,
            @RequestParam String portfolioId,
            @RequestParam String newPortfolioName) {

        UserContext user = userResolverService.getUserInfo(request);
        String userIdStr = String.valueOf(user.getUserId());

        // 1. Find the existing ledger entry
        Optional<MasterUserLedger> existingEntry = masterRepository.findByUserIdAndPid(userIdStr, portfolioId);

        if (existingEntry.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "SYSTEM", "Portfolio not found for this user.", null));
        }

        // 2. Update the name
        MasterUserLedger portfolio = existingEntry.get();
        portfolio.setPortfolioName(newPortfolioName);

        // Optional: Update the last updated timestamp
        portfolio.setUploadedAt(LocalDateTime.now());

        // 3. Save changes
        MasterUserLedger updatedLedger = masterRepository.save(portfolio);

        return ResponseEntity.ok(new ApiResponse<>(true, "SYSTEM", "Portfolio name updated successfully.", updatedLedger));
    }


    // --- Private Helper Methods ---

    private String generateTableName(UserContext user) {
        String type = user.getUserType().substring(0, 1).toUpperCase() + user.getUserType().substring(1);
        return type + "_User_" + user.getUserId() + "_Portfolio";
    }

//    private List<TradeTransactionDTO> parseTrades(MultipartFile file, String brokerId) throws Exception {
//        String json = analysisService.normalizePortfolio(file,brokerId);
//        return mapper.readValue(json, new TypeReference<List<TradeTransactionDTO>>() {});
//    }
private List<TradeTransactionDTO> parseTrades(MultipartFile file, String brokerId) throws Exception {
    // 1. Get the raw JSON string from the Python service
    String rawJson = analysisService.normalizePortfolio(file, brokerId);

    // 2. Read the JSON as a Tree/Node
    JsonNode rootNode = mapper.readTree(rawJson);

    // 3. Handle the response based on the actual JSON structure
    JsonNode tradesArray;
    if (rootNode.isArray()) {
        // If Python returns [...] directly (as shown in your response sample)
        tradesArray = rootNode;
    } else if (rootNode.has("data") && rootNode.get("data").isArray()) {
        // Fallback if it's wrapped in {"data": [...]}
        tradesArray = rootNode.get("data");
    } else {
        throw new RuntimeException("Unexpected response format from Python. Expected a JSON array.");
    }

    // 4. Convert the array part into your List of DTOs
    return mapper.convertValue(tradesArray, new TypeReference<List<TradeTransactionDTO>>() {});
}

// new api's
    @PostMapping("/metrics/beta")
    public ResponseEntity<String> calculateBeta(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(metricsService.calculateBeta(payload));
    }

    @PostMapping("/metrics/alpha")
    public ResponseEntity<String> calculateAlpha(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(metricsService.calculateAlpha(payload));
    }

    @PostMapping("/metrics/ratios")
    public ResponseEntity<String> calculateRatios(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(metricsService.calculateRatios(payload));
    }


    @PostMapping("/what-if/enrich")
    public ResponseEntity<String> enrichHoldings(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(whatIfService.enrichHoldings(payload));
    }

    @GetMapping("/what-if/sectors")
    public ResponseEntity<String> getAllSectors() {
        return ResponseEntity.ok(whatIfService.getAllSectors());
    }

    @GetMapping("/what-if/hierarchy/sector/{sector}")
    public ResponseEntity<String> getSectorHierarchy(@PathVariable String sector) {
        return ResponseEntity.ok(whatIfService.getSectorHierarchy(sector));
    }

    @GetMapping("/what-if/sector-hierarchy/{symbol}")
    public ResponseEntity<String> getStockHierarchy(@PathVariable String symbol) {
        return ResponseEntity.ok(whatIfService.getStockHierarchy(symbol));
    }

    @PostMapping("/what-if/simulate")
    public ResponseEntity<String> simulateWhatIf(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(whatIfService.simulate(payload));
    }

   


}