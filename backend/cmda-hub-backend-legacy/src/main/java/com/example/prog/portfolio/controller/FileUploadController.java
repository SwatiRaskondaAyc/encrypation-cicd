
// package com.example.prog.portfolio.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.context.request.async.WebAsyncTask;
// import org.springframework.web.multipart.MultipartFile;
// import org.springframework.web.server.ResponseStatusException;

// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.TotalPlatformUsageCount;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.portfolio.UserPortfolioUploads;
// import com.example.prog.portfolio.serviceImpl.DeletePortfolioTableService;
// import com.example.prog.portfolio.serviceImpl.ExtractHeadersService;
// import com.example.prog.portfolio.serviceImpl.FileProcessingService;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.portfolioRepo.UserPortfolioUploadRepository;
// import com.example.prog.repository.TotalPlatformUsageCountRepository;
// import com.example.prog.service.UserActivityService;
// import com.example.prog.token.JwtUtil;
// import com.fasterxml.jackson.core.JsonProcessingException;
// import com.fasterxml.jackson.core.type.TypeReference;
// import com.fasterxml.jackson.databind.ObjectMapper;

// import jakarta.servlet.http.HttpServletRequest;

// import java.io.IOException;
// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.NoSuchElementException;
// import java.util.Optional;
// import java.util.UUID;
// import java.util.concurrent.Callable;
// import java.util.stream.Collectors;

// @RestController
// @RequestMapping("/api/file")
// public class FileUploadController {

//     @Autowired
//     private FileProcessingService fileProcessingService;

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private DeletePortfolioTableService deletePortfolioService;

//     @Autowired
//     private CorporateUserRepository corporateUserRepository;

//     @Autowired
//     private UserPortfolioUploadRepository userPortfolioUploadRepository;

//     @Autowired
//     private ExtractHeadersService extractHeaderService;

//     @Autowired
//     private JwtUtil jwtUtil;

//     @Autowired
//     private UserActivityService userActivityService;

//     @Autowired
//     private TotalPlatformUsageCountRepository totalPlatformUsageCountRepository;

//     private final Object lock = new Object(); // Lock for thread-safe daily counts

//     // Method to log user activity with platform for FILE_UPLOAD
//     private void logUserActivity(String email, String userType, String activityType, String platform) {
//         if (email == null) {
//             email = "UNKNOWN";
//         }
//         if (activityType.equals("FILE_UPLOAD_SUCCESS") && platform != null) {
//             activityType = "FILE_UPLOAD_" + platform.replaceAll("\\s+", "");
//         }
//         // userActivityService.//logUserActivity(email, userType, activityType, true, platform);
//     }

// //     // Method to log user activity with platform for FILE_UPLOAD
// // private void //logUserActivity(String email, String userType, String activityType, String platform) {
// //     if (email == null) {
// //         email = "UNKNOWN";
// //     }
// //     userActivityService.//logUserActivity(email, userType, activityType, true, platform);
// // }

//     @PostMapping("/upload")
//     public WebAsyncTask<ResponseEntity<Map<String, Object>>> uploadFile(
//             @RequestParam("file") MultipartFile file,
//             @RequestParam("platform") String platform,
//             @RequestParam("portfolioname") String portfolioName,
//             @RequestParam("save") boolean saveData,
//             @RequestParam(value = "customMappingStr", required = false) String customMappingStr,
//             HttpServletRequest request) {

//         Callable<ResponseEntity<Map<String, Object>>> callable = () -> {
//             String email = null;
//             String userType = null;
//             try {
//                 //logUserActivity(null, "UNKNOWN", "FILE_UPLOAD_ATTEMPT", null);

//                 Map<String, String> customMapping = (customMappingStr != null && !customMappingStr.isBlank())
//                         ? new ObjectMapper().readValue(customMappingStr, new TypeReference<>() {})
//                         : new HashMap<>();

//                 String authHeader = request.getHeader("Authorization");
//                 if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//                     //logUserActivity(null, "UNKNOWN", "FILE_UPLOAD_FAILED", null);
//                     return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                             .body(Map.of("error", "Missing or invalid Authorization header"));
//                 }

//                 String jwtToken = authHeader.substring(7);
//                 email = jwtUtil.extractEmail(jwtToken);
//                 if (email == null) {
//                     //logUserActivity(null, "UNKNOWN", "FILE_UPLOAD_FAILED", null);
//                     return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                             .body(Map.of("error", "Invalid JWT token"));
//                 }

//                 boolean isCorporate = false;
//                 int userID;
//                 CorporateUser corpUser = corporateUserRepository.findByemail(email);
//                 if (corpUser != null) {
//                     isCorporate = true;
//                     userID = corpUser.getId();
//                     userType = "corporate";
//                 } else {
//                     UserDtls user = userRepository.findByEmail(email)
//                             .orElseThrow(() -> new IllegalArgumentException("User not found in the database."));
//                     userID = user.getUserID();
//                     userType = "individual";
//                 }

//                 String uploadId = UUID.randomUUID().toString();

//                 String originalFilename = file.getOriginalFilename();
//                 if (originalFilename == null) {
//                     //logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
//                     return ResponseEntity.badRequest().body(Map.of("error", "Invalid file name."));
//                 }

//                 Map<String, Object> columnMappingResult;
//                 if (originalFilename.toLowerCase().endsWith(".csv")) {
//                     columnMappingResult = fileProcessingService
//                             .performCsvColumnMapping(file, platform, uploadId, userID, isCorporate, customMapping,saveData);
//                 } else if (originalFilename.toLowerCase().endsWith(".xls") || originalFilename.toLowerCase().endsWith(".xlsx")) {
//                     columnMappingResult = fileProcessingService
//                             .performColumnMappingAsync(file, platform, uploadId, userID, isCorporate, customMapping, saveData)
//                             .join();
//                 } else {
//                     //logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
//                     return ResponseEntity.badRequest()
//                             .body(Map.of("error", "Unsupported file format. Only CSV, XLS, and XLSX are allowed."));
//                 }

//                 if (columnMappingResult.containsKey("error")) {
//                     //logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
//                     return ResponseEntity.badRequest().body(columnMappingResult);
//                 }

//                 String mappedFilePath = (String) columnMappingResult.get("mappedFile");
//                 if (mappedFilePath == null) {
//                     //logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
//                     return ResponseEntity.badRequest()
//                             .body(Map.of("error", "Mapped file path is missing."));
//                 }
//                 System.out.println("Mapped CSV File Path: " + mappedFilePath);

//                 Map<String, Object> result = fileProcessingService
//                         .processFileAsync(mappedFilePath, platform, uploadId, userID, isCorporate, saveData)
//                         .join();

//                 result.put("uploadId", uploadId);

//                 String portfolioTableName;
//                 if (saveData) {
//                     portfolioTableName = (String) columnMappingResult.get("tableName");
//                     if (portfolioTableName == null || portfolioTableName.isBlank()) {
//                         //logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
//                         return ResponseEntity.badRequest()
//                             .body(Map.of("error", "Portfolio table name is missing."));
//                     }
//                     saveOrUpdateUpload(uploadId, userID, userType, platform, portfolioTableName, portfolioName);
//                     result.put("status", "Data saved successfully");
//                 } else {
//                     String prefix = isCorporate ? "Corporate" : "user";
//                     String sanitizedPlatform = platform.replaceAll("\\s+", "");
//                     portfolioTableName = "Temp_" + prefix + userID + "_" + sanitizedPlatform + "_portfolio_results";
//                     saveOrUpdateUpload(uploadId, userID, userType, platform, portfolioTableName, portfolioName);
//                     result.put("status", "Data processed without saving and temporary tables removed");
//                 }

//                 //logUserActivity(email, userType, "FILE_UPLOAD_SUCCESS", platform);
//                 return ResponseEntity.ok(result);
//             } catch (IllegalArgumentException e) {
//                 //logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
//                 return ResponseEntity.badRequest()
//                         .body(Map.of("error", e.getMessage()));
//             } catch (Exception e) {
//                 //logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
//                 return ResponseEntity.badRequest()
//                         .body(Map.of("error", "File processing failed: " + e.getMessage()));
//             }
//         };

//         WebAsyncTask<ResponseEntity<Map<String, Object>>> webAsyncTask = new WebAsyncTask<>(300000, callable);

//         webAsyncTask.onTimeout(() -> {
//             //logUserActivity(null, "UNKNOWN", "FILE_UPLOAD_TIMEOUT", null);
//             return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT)
//                     .body(Map.of("error", "Request timed out. Please try again."));
//         });

//         return webAsyncTask;
//     }

//     @PostMapping("/extract_headers")
//     public ResponseEntity<Map<String, Object>> extractHeaders(@RequestParam("file") MultipartFile file) {
//         try {
//             //logUserActivity(null, "UNKNOWN", "EXTRACT_HEADERS_ATTEMPT", null);

//             String fileName = file.getOriginalFilename();
//             List<String> headers = new ArrayList<>();

//             if (fileName == null) {
//                 //logUserActivity(null, "UNKNOWN", "EXTRACT_HEADERS_FAILED", null);
//                 throw new IllegalArgumentException("Invalid file");
//             }

//             if (fileName.endsWith(".csv")) {
//                 headers = extractHeaderService.extractCsvHeaders(file);
//             } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
//                 headers = extractHeaderService.extractExcelHeaders(file);
//             } else if (fileName.endsWith(".txt")) {
//                 headers = extractHeaderService.extractTxtHeaders(file);
//             } else {
//                 //logUserActivity(null, "UNKNOWN", "EXTRACT_HEADERS_FAILED", null);
//                 throw new UnsupportedOperationException("Unsupported file type");
//             }

//             //logUserActivity(null, "UNKNOWN", "EXTRACT_HEADERS_SUCCESS", null);
//             return ResponseEntity.ok(Map.of(
//                     "fileName", fileName,
//                     "headers", headers
//             ));

//         } catch (Exception e) {
//             System.err.println("Error in extractHeaders: " + e.getMessage());
//             e.printStackTrace();
//             //logUserActivity(null, "UNKNOWN", "EXTRACT_HEADERS_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "Failed to process file: " + e.getMessage()));
//         }
//     }

//     private void saveOrUpdateUpload(String uploadId, int userID, String userType, String platform, String portfolioTableName, String portfolioName) {
//         Optional<UserPortfolioUploads> existingUploadOpt = userPortfolioUploadRepository.findByPortfolioTableNameAndUserIDAndUserType(portfolioTableName, userID, userType);
//         UserPortfolioUploads uploadRecord = existingUploadOpt.orElseGet(UserPortfolioUploads::new);
//         uploadRecord.setUploadId(uploadId);
//         uploadRecord.setUserID(userID);
//         uploadRecord.setUserType(userType);
//         uploadRecord.setUploadedAt(LocalDateTime.now());
//         uploadRecord.setPortfolioTableName(portfolioTableName);
//         uploadRecord.setPlatform(platform);
//         uploadRecord.setPortfolioName(portfolioName);
//         userPortfolioUploadRepository.save(uploadRecord);
//     }

//     @GetMapping("/saved")
//     public ResponseEntity<List<Map<String, Object>>> listSavedPortfolios(HttpServletRequest request) {
//         String email = jwtUtil.extractEmail(parseBearer(request));
//         boolean isCorporate = false;
//         int userID;
//         String userType;

//         //logUserActivity(email, "UNKNOWN", "LIST_PORTFOLIOS_ATTEMPT", null);

//         CorporateUser corpUser = corporateUserRepository.findByemail(email);
//         if (corpUser != null) {
//             isCorporate = true;
//             userID = corpUser.getId();
//             userType = "corporate";
//         } else {
//             UserDtls user = userRepository.findByEmail(email)
//                     .orElseThrow(() -> {
//                         //logUserActivity(email, "individual", "LIST_PORTFOLIOS_FAILED", null);
//                         return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
//                     });
//             userID = user.getUserID();
//             userType = "individual";
//         }

//         List<UserPortfolioUploads> uploads = userPortfolioUploadRepository
//                 .findAllByUserIDAndUserType(userID, userType);

//         List<Map<String, Object>> dto = uploads.stream()
//                 .filter(u -> !u.getPortfolioTableName().startsWith("Temp"))
//                 .map(u -> {
//                     Map<String, Object> map = new HashMap<>();
//                     map.put("uploadId", u.getUploadId());
//                     map.put("platform", u.getPlatform());
//                     map.put("uploadedAt", u.getUploadedAt());
//                     map.put("portfolioTableName", u.getPortfolioTableName());
//                     return map;
//                 })
//                 .collect(Collectors.toList());

//         //logUserActivity(email, userType, "LIST_PORTFOLIOS_SUCCESS", null);
//         return ResponseEntity.ok(dto);
//     }

//     private String parseBearer(HttpServletRequest req) {
//         String h = req.getHeader("Authorization");
//         if (h == null || !h.startsWith("Bearer ")) {
//             //logUserActivity(null, "UNKNOWN", "AUTHORIZATION_FAILED", null);
//             throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
//         }
//         return h.substring(7);
//     }


//      // -------------------- Paper Trading added by Shreya ---------------------

//     @PostMapping("/paper-trade/create")
//     public ResponseEntity<Map<String, Object>> createNewPortfolio(HttpServletRequest request) {
//     String email = null;
//     String userType = "UNKNOWN";
//     try {
//         //logUserActivity(null, "UNKNOWN", "CREATE_PAPER_TRADE_PORTFOLIO_ATTEMPT", null);

//         String authHeader = request.getHeader("Authorization");
//         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//             //logUserActivity(null, "UNKNOWN", "CREATE_PAPER_TRADE_PORTFOLIO_FAILED", null);
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                     .body(Map.of("error", "Missing or invalid Authorization header"));
//         }

//         String jwtToken = authHeader.substring(7);
//         email = jwtUtil.extractEmail(jwtToken);
//         if (email == null) {
//             //logUserActivity(null, "UNKNOWN", "CREATE_PAPER_TRADE_PORTFOLIO_FAILED", null);
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                     .body(Map.of("error", "Invalid JWT token"));
//         }

//         boolean isCorporate = false;
//         int userID;
//         CorporateUser corpUser = corporateUserRepository.findByemail(email);
//         if (corpUser != null) {
//             isCorporate = true;
//             userID = corpUser.getId();
//             userType = "corporate";
//         } else {
//             UserDtls user = userRepository.findByEmail(email)
//                     .orElseThrow(() -> new IllegalArgumentException("User not found in the database."));
//             userID = user.getUserID();
//             userType = "individual";
//         }

//         // Call service to create new portfolio
//         Map<String, Object> result = fileProcessingService.createNewPortfolio(userID, isCorporate);

//         if (result.containsKey("error")) {
//             //logUserActivity(email, userType, "CREATE_PAPER_TRADE_PORTFOLIO_FAILED", null);
//             return ResponseEntity.badRequest().body(result);
//         }

//         //logUserActivity(email, userType, "CREATE_PAPER_TRADE_PORTFOLIO_SUCCESS", (String) result.get("portfolioName"));
//         return ResponseEntity.ok(result);

//         } catch (Exception e) {
//             //logUserActivity(email != null ? email : "UNKNOWN", userType, "CREATE_PAPER_TRADE_PORTFOLIO_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "Failed to create new portfolio: " + e.getMessage()));
//         }
//     }


//     @PostMapping("/paper-trade/save")
//     public ResponseEntity<Map<String, Object>> savePaperTrade(
//             @RequestBody List<Map<String, Object>> tradeData,
//             @RequestParam("portfolioname") String portfolioName,
//             HttpServletRequest request) {

//         String email = null;
//         String userType = "UNKNOWN";
//         try {
//             //logUserActivity(null, "UNKNOWN", "PAPER_TRADE_SAVE_ATTEMPT", null);

//             String authHeader = request.getHeader("Authorization");
//             if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//                 //logUserActivity(null, "UNKNOWN", "PAPER_TRADE_SAVE_FAILED", null);
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                         .body(Map.of("error", "Missing or invalid Authorization header"));
//             }

//             String jwtToken = authHeader.substring(7);
//             email = jwtUtil.extractEmail(jwtToken);
//             if (email == null) {
//                 //logUserActivity(null, "UNKNOWN", "PAPER_TRADE_SAVE_FAILED", null);
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                         .body(Map.of("error", "Invalid JWT token"));
//             }

//             boolean isCorporate = false;
//             int userID;
//             CorporateUser corpUser = corporateUserRepository.findByemail(email);
//             if (corpUser != null) {
//                 isCorporate = true;
//                 userID = corpUser.getId();
//                 userType = "corporate";
//             } else {
//                 UserDtls user = userRepository.findByEmail(email)
//                         .orElseThrow(() -> new IllegalArgumentException("User not found in the database."));
//                 userID = user.getUserID();
//                 userType = "individual";
//             }

//             // Process the paper trade data
//             Map<String, Object> result = fileProcessingService.processPaperTradeData(tradeData, userID, isCorporate, portfolioName);

//             if (result.containsKey("error")) {
//                 //logUserActivity(email, userType, "PAPER_TRADE_SAVE_FAILED", null);
//                 return ResponseEntity.badRequest().body(result);
//             }

//             String platform = "Own_" + result.get("series");
//             //logUserActivity(email, userType, "PAPER_TRADE_SAVE_SUCCESS", platform);
//             return ResponseEntity.ok(result);

//         } catch (IllegalArgumentException e) {
//             //logUserActivity(email != null ? email : "UNKNOWN", userType, "PAPER_TRADE_SAVE_FAILED", null);
//             return ResponseEntity.badRequest()
//                     .body(Map.of("error", e.getMessage()));
//         } catch (Exception e) {
//             //logUserActivity(email != null ? email : "UNKNOWN", userType, "PAPER_TRADE_SAVE_FAILED", null);
//             return ResponseEntity.badRequest()
//                     .body(Map.of("error", "Paper trade processing failed: " + e.getMessage()));
//         }
//     }
    
//     @GetMapping("/paper-trade/fetch")
//     public ResponseEntity<List<Map<String, Object>>> listSavedPaperTradePortfolios(HttpServletRequest request) {
//         String email = null;
//         String userType = "UNKNOWN";
//         try {
//             //logUserActivity(null, "UNKNOWN", "LIST_PAPER_TRADE_PORTFOLIOS_ATTEMPT", null);

//             String authHeader = request.getHeader("Authorization");
//             if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//                 //logUserActivity(null, "UNKNOWN", "LIST_PAPER_TRADE_PORTFOLIOS_FAILED", null);
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                         .body(List.of(Map.of("error", "Missing or invalid Authorization header")));
//             }

//             String jwtToken = authHeader.substring(7);
//             email = jwtUtil.extractEmail(jwtToken);
//             if (email == null) {
//                 //logUserActivity(null, "UNKNOWN", "LIST_PAPER_TRADE_PORTFOLIOS_FAILED", null);
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                         .body(List.of(Map.of("error", "Invalid JWT token")));
//             }

//             boolean isCorporate = false;
//             int userID;
//             CorporateUser corpUser = corporateUserRepository.findByemail(email);
//             if (corpUser != null) {
//                 isCorporate = true;
//                 userID = corpUser.getId();
//                 userType = "corporate";
//             } else {
//                 UserDtls user = userRepository.findByEmail(email)
//                         .orElseThrow(() -> new IllegalArgumentException("User not found in the database."));
//                 userID = user.getUserID();
//                 userType = "individual";
//             }

//             List<Map<String, Object>> portfolios = fileProcessingService.listPaperTradePortfolios(userID, isCorporate);

//             //logUserActivity(email, userType, "LIST_PAPER_TRADE_PORTFOLIOS_SUCCESS", null);
//             return ResponseEntity.ok(portfolios);

//         } catch (IllegalArgumentException e) {
//             //logUserActivity(email != null ? email : "UNKNOWN", userType, "LIST_PAPER_TRADE_PORTFOLIOS_FAILED", null);
//             return ResponseEntity.badRequest()
//                     .body(List.of(Map.of("error", e.getMessage())));
//         } catch (Exception e) {
//             //logUserActivity(email != null ? email : "UNKNOWN", userType, "LIST_PAPER_TRADE_PORTFOLIOS_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(List.of(Map.of("error", "Failed to fetch paper trade portfolios: " + e.getMessage())));
//         }
//     }

//     // Delete paper trading data
//     @DeleteMapping("/paper-trade/delete")
//     public ResponseEntity<Map<String, Object>> deletePaperTradeData(
//             @RequestParam("portfolioname") String portfolioName,
//             HttpServletRequest request) {
//         String email = null;
//         String userType = "UNKNOWN";
//         try {
//             //logUserActivity(null, "UNKNOWN", "DELETE_PAPER_TRADE_ATTEMPT", null);

//             String authHeader = request.getHeader("Authorization");
//             if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//                 //logUserActivity(null, "UNKNOWN", "DELETE_PAPER_TRADE_FAILED", null);
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                         .body(Map.of("error", "Missing or invalid Authorization header"));
//             }

//             String jwtToken = authHeader.substring(7);
//             email = jwtUtil.extractEmail(jwtToken);
//             if (email == null) {
//                 //logUserActivity(null, "UNKNOWN", "DELETE_PAPER_TRADE_FAILED", null);
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                         .body(Map.of("error", "Invalid JWT token"));
//             }

//             boolean isCorporate = false;
//             int userID;
//             CorporateUser corpUser = corporateUserRepository.findByemail(email);
//             if (corpUser != null) {
//                 isCorporate = true;
//                 userID = corpUser.getId();
//                 userType = "corporate";
//             } else {
//                 UserDtls user = userRepository.findByEmail(email)
//                         .orElseThrow(() -> new IllegalArgumentException("User not found in the database."));
//                 userID = user.getUserID();
//                 userType = "individual";
//             }

//             Map<String, Object> result = fileProcessingService.deletePaperTradeData(userID, isCorporate, portfolioName);

//             if (result.containsKey("error")) {
//                 //logUserActivity(email, userType, "DELETE_PAPER_TRADE_FAILED", null);
//                 return ResponseEntity.badRequest().body(result);
//             }

//             //logUserActivity(email, userType, "DELETE_PAPER_TRADE_SUCCESS", null);
//             return ResponseEntity.ok(result);

//         } catch (IllegalArgumentException e) {
//             //logUserActivity(email != null ? email : "UNKNOWN", userType, "DELETE_PAPER_TRADE_FAILED", null);
//             return ResponseEntity.badRequest()
//                     .body(Map.of("error", e.getMessage()));
//         } catch (Exception e) {
//             //logUserActivity(email != null ? email : "UNKNOWN", userType, "DELETE_PAPER_TRADE_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "Failed to delete paper trade data: " + e.getMessage()));
//         }
//     }
    
//     // ---- End Paper trading -----------

//     @GetMapping("/sample")
//     public ResponseEntity<?> getSampleUploadId() {
//         //logUserActivity(null, "UNKNOWN", "GET_SAMPLE_UPLOAD_ID_ATTEMPT", null);

//         return userPortfolioUploadRepository.findByPortfolioTableName("Sample_AxisBank_portf")
//                 .map(record -> {
//                     //logUserActivity(null, "UNKNOWN", "GET_SAMPLE_UPLOAD_ID_SUCCESS", null);
//                     return ResponseEntity.ok(record.getUploadId());
//                 })
//                 .orElseThrow(() -> {
//                     //logUserActivity(null, "UNKNOWN", "GET_SAMPLE_UPLOAD_ID_FAILED", null);
//                     return new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found");
//                 });
//     }

//     @DeleteMapping("/delete")
//     public ResponseEntity<String> deletePortfolioTable(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "DELETE_PORTFOLIO_ATTEMPT", null);

//         try {
//             boolean isDeleted = deletePortfolioService.deletePortfolioTable(uploadId);
//             if (isDeleted) {
//                 //logUserActivity(null, "UNKNOWN", "DELETE_PORTFOLIO_SUCCESS", null);
//                 return ResponseEntity.ok("Table deleted successfully.");
//             } else {
//                 //logUserActivity(null, "UNKNOWN", "DELETE_PORTFOLIO_FAILED", null);
//                 return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                         .body("Table does not exist or couldn't be deleted.");
//             }
//         } catch (Exception e) {
//             //logUserActivity(null, "UNKNOWN", "DELETE_PORTFOLIO_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body("Error deleting table: " + e.getMessage());
//         }
//     }

//     @GetMapping("/portfolio/chart-data")
//     public ResponseEntity<Map<String, Object>> getChartData(@RequestParam int userId, @RequestParam String platform, @RequestParam boolean isCorporate) {
//         String userType = isCorporate ? "corporate" : "individual";
//         //logUserActivity(null, userType, "GET_CHART_DATA_ATTEMPT", platform);

//         try {
//             String tableName = isCorporate
//                     ? "Corporate" + userId + "_" + platform + "_portfolio_results"
//                     : "user" + userId + "_" + platform + "_portfolio_results";

//             List<Map<String, Object>> results = fileProcessingService.getPortfolioResults(tableName);
//             //logUserActivity(null, userType, "GET_CHART_DATA_SUCCESS", platform);
//             return ResponseEntity.ok(Map.of("data", results));
//         } catch (Exception e) {
//             //logUserActivity(null, userType, "GET_CHART_DATA_FAILED", platform);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
//         }
//     }

//     @PostMapping("/portfolio_fifo_results")
//     public ResponseEntity<Map<String, Object>> getPortfolioFifoResults(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_FIFO_RESULTS_ATTEMPT", null);

//         Map<String, Object> processingResults = fileProcessingService.getResultsByUploadId(uploadId);
//         if (!processingResults.containsKey("portfolio_results")) {
//             //logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_FIFO_RESULTS_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", "Portfolio results not found."));
//         }
//         //logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_FIFO_RESULTS_SUCCESS", null);
//         return ResponseEntity.ok(Map.of("portfolio_fifo_results", processingResults.get("portfolio_results")));
//     }

//     @PostMapping("/latest_insights")
//     public ResponseEntity<?> getLatestInsights(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_LATEST_INSIGHTS_ATTEMPT", null);

//         try {
//             Map<String, Object> insightData = fileProcessingService.getInsightsDataFromDb(uploadId);
//             //logUserActivity(null, "UNKNOWN", "GET_LATEST_INSIGHTS_SUCCESS", null);
//             return ResponseEntity.ok(insightData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_LATEST_INSIGHTS_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_LATEST_INSIGHTS_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/short_nse_table")
//     public ResponseEntity<Map<String, Object>> shortNseTable(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "SHORT_NSE_TABLE_ATTEMPT", null);

//         Optional<UserPortfolioUploads> uploadOpt = userPortfolioUploadRepository.findByUploadId(uploadId);
//         if (uploadOpt.isEmpty()) {
//             //logUserActivity(null, "UNKNOWN", "SHORT_NSE_TABLE_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", "Invalid upload ID."));
//         }

//         UserPortfolioUploads upload = uploadOpt.get();
//         String platform = upload.getPlatform().replaceAll("\\s+", "");
//         String tablename = upload.getPortfolioTableName();
//         int userId = upload.getUserID();
//         boolean isCorporate = "corporate".equalsIgnoreCase(upload.getUserType());
//         String userType = isCorporate ? "corporate" : "individual";

//         String tableName = (isCorporate ? "Corporate" : "user") + userId + "_" + platform + "_portf";

//         if ("Sample_AxisBank_portf".equals(tablename)) {
//             tableName = tablename;
//         }

//         Map<String, Object> result = fileProcessingService.ShortNseFileFromTable(tableName);
//         //logUserActivity(null, userType, "SHORT_NSE_TABLE_SUCCESS", platform);
//         return ResponseEntity.ok(result);
//     }

//     @PostMapping("/top_ten_script")
//     public ResponseEntity<?> getTopTenScript(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_TOP_TEN_SCRIPT_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "top_ten_script");
//             //logUserActivity(null, "UNKNOWN", "GET_TOP_TEN_SCRIPT_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_TOP_TEN_SCRIPT_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_TOP_TEN_SCRIPT_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/stock_deployed_amt_over_time")
//     public ResponseEntity<?> getStockDeployedAmt(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_STOCK_DEPLOYED_AMT_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "stock_deployed_amt_over_time");
//             //logUserActivity(null, "UNKNOWN", "GET_STOCK_DEPLOYED_AMT_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_STOCK_DEPLOYED_AMT_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_STOCK_DEPLOYED_AMT_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/combined_box_plot")
//     public ResponseEntity<Map<String, Object>> getCombined(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_COMBINED_BOX_PLOT_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "combined_box_plot");
//             //logUserActivity(null, "UNKNOWN", "GET_COMBINED_BOX_PLOT_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_COMBINED_BOX_PLOT_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_COMBINED_BOX_PLOT_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/create_PNL_plot")
//     public ResponseEntity<Map<String, Object>> getPnl(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_PNL_PLOT_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "create_PNL_plot");
//             //logUserActivity(null, "UNKNOWN", "GET_PNL_PLOT_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_PNL_PLOT_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_PNL_PLOT_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/create_swot_plot")
//     public ResponseEntity<Map<String, Object>> getSwot(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_SWOT_PLOT_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "create_swot_plot");
//             //logUserActivity(null, "UNKNOWN", "GET_SWOT_PLOT_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_SWOT_PLOT_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_SWOT_PLOT_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/create_industry_sunburst")
//     public ResponseEntity<Map<String, Object>> getIndSun(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_INDUSTRY_SUNBURST_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "create_industry_sunburst");
//             //logUserActivity(null, "UNKNOWN", "GET_INDUSTRY_SUNBURST_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_INDUSTRY_SUNBURST_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_INDUSTRY_SUNBURST_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/create_user_sunburst_with_dropdown")
//     public ResponseEntity<Map<String, Object>> getUserSun(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_USER_SUNBURST_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "create_user_sunburst_with_dropdown");
//             //logUserActivity(null, "UNKNOWN", "GET_USER_SUNBURST_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_USER_SUNBURST_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_USER_SUNBURST_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/generate_combined_bubble_chart")
//     public ResponseEntity<Map<String, Object>> getCombinedBub(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_COMBINED_BUBBLE_CHART_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "generate_combined_bubble_chart");
//             //logUserActivity(null, "UNKNOWN", "GET_COMBINED_BUBBLE_CHART_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_COMBINED_BUBBLE_CHART_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", "e.getMessage()"));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_COMBINED_BUBBLE_CHART_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/create_invested_amount_plot")
//     public ResponseEntity<Map<String, Object>> getInvAmt(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_INVESTED_AMOUNT_PLOT_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "create_invested_amount_plot");
//             //logUserActivity(null, "UNKNOWN", "GET_INVESTED_AMOUNT_PLOT_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_INVESTED_AMOUNT_PLOT_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_INVESTED_AMOUNT_PLOT_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/create_best_trade_plot")
//     public ResponseEntity<Map<String, Object>> getBestTrade(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_BEST_TRADE_PLOT_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "create_best_trade_plot");
//             //logUserActivity(null, "UNKNOWN", "GET_BEST_TRADE_PLOT_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_BEST_TRADE_PLOT_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_BEST_TRADE_PLOT_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/classify_stocks_risk_return")
//     public ResponseEntity<Map<String, Object>> getStockRisk(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_STOCK_RISK_RETURN_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "classify_stocks_risk_return");
//             //logUserActivity(null, "UNKNOWN", "GET_STOCK_RISK_RETURN_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_STOCK_RISK_RETURN_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_STOCK_RISK_RETURN_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/plot_portfolio_eps_bv_quarterly_all_entries")
//     public ResponseEntity<Map<String, Object>> getEpsBvQuarterly(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_EPS_BV_QUARTERLY_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "plot_portfolio_eps_bv_quarterly_all_entries");
//             //logUserActivity(null, "UNKNOWN", "GET_EPS_BV_QUARTERLY_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_EPS_BV_QUARTERLY_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_EPS_BV_QUARTERLY_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/get_shareholding_data")
//     public ResponseEntity<Map<String, Object>> getShareholdingData(@RequestParam("uploadId") String uploadId) {
//     // Fetch results from the previous processing
//     try {
//         Map<String, Object> graphData =
//             fileProcessingService.getGraphDataFromDb(uploadId, "get_shareholding_data");
//         return ResponseEntity.ok(graphData);

//     } catch (NoSuchElementException e) {
//         return ResponseEntity.badRequest()
//                              .body(Map.of("error", e.getMessage()));
//     } catch (JsonProcessingException e) {
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                              .body(Map.of("error", "JSON conversion failed"));
//     }
// }

// @PostMapping("/get_price_aqcuisition_plot")
// public ResponseEntity<Map<String, Object>> getPriceAqcuisitionPlot(@RequestParam("uploadId") String uploadId) {
//   // Fetch results from the previous processing
//     try {
//         Map<String, Object> graphData =
//             fileProcessingService.getGraphDataFromDb(uploadId, "get_price_acquisition_plot");
//         return ResponseEntity.ok(graphData);

//     } catch (NoSuchElementException e) {
//         return ResponseEntity.badRequest()
//                              .body(Map.of("error", e.getMessage()));
//     } catch (JsonProcessingException e) {
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                              .body(Map.of("error", "JSON conversion failed"));
//     }
// }

//     @PostMapping("/calculate_portfolio_metrics")
//     public ResponseEntity<Map<String, Object>> getCalPortfMat(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_METRICS_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "calculate_portfolio_metrics");
//             //logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_METRICS_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_METRICS_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_METRICS_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/portfolio_replacements")
//     public ResponseEntity<Map<String, Object>> getPortfolioReplace(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_REPLACEMENTS_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "portfolio_replacements");
//             //logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_REPLACEMENTS_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_REPLACEMENTS_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_REPLACEMENTS_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/actual_date_replacements")
//     public ResponseEntity<Map<String, Object>> getActualDateReplace(@RequestParam("uploadId") String uploadId) {
//         //logUserActivity(null, "UNKNOWN", "GET_ACTUAL_DATE_REPLACEMENTS_ATTEMPT", null);

//         try {
//             Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "actual_date_replacements");
//             //logUserActivity(null, "UNKNOWN", "GET_ACTUAL_DATE_REPLACEMENTS_SUCCESS", null);
//             return ResponseEntity.ok(graphData);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_ACTUAL_DATE_REPLACEMENTS_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         } catch (JsonProcessingException e) {
//             //logUserActivity(null, "UNKNOWN", "GET_ACTUAL_DATE_REPLACEMENTS_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", "JSON conversion failed"));
//         }
//     }

//     @PostMapping("/build_Portfolio")
//     public ResponseEntity<Map<String, Object>> getBuildPortfolio() {
//         //logUserActivity(null, "UNKNOWN", "BUILD_PORTFOLIO_ATTEMPT", null);

//         try {
//             Map<String, Object> resultJsonString = fileProcessingService.generatePortfBuild();
//             //logUserActivity(null, "UNKNOWN", "BUILD_PORTFOLIO_SUCCESS", null);
//             return ResponseEntity.ok().body(resultJsonString);
//         } catch (NoSuchElementException e) {
//             //logUserActivity(null, "UNKNOWN", "BUILD_PORTFOLIO_FAILED", null);
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         }
//     }

//     // Endpoint to get daily platform usage counts
//     @GetMapping("/platform-counts")
//     public ResponseEntity<Map<String, Integer>> getPlatformCounts(@RequestParam(value = "date", required = false) String dateStr) {
//         //logUserActivity(null, "UNKNOWN", "GET_PLATFORM_COUNTS_ATTEMPT", null);

//         try {
//             LocalDate date = (dateStr != null && !dateStr.isBlank())
//                     ? LocalDate.parse(dateStr)
//                     : LocalDate.now();
//             synchronized (lock) {
//                 Map<String, Integer> platformCounts = userActivityService.getDailyPlatformCounts(date);
//                 //logUserActivity(null, "UNKNOWN", "GET_PLATFORM_COUNTS_SUCCESS", null);
//                 return ResponseEntity.ok(platformCounts);
//             }
//         } catch (Exception e) {
//             //logUserActivity(null, "UNKNOWN", "GET_PLATFORM_COUNTS_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", -1));
//         }
//     }

//     // Endpoint to get total platform usage counts from database
//     @GetMapping("/total-platform-counts")
//     public ResponseEntity<Map<String, Integer>> getTotalPlatformCounts() {
//         //logUserActivity(null, "UNKNOWN", "GET_TOTAL_PLATFORM_COUNTS_ATTEMPT", null);

//         try {
//             Map<String, Integer> totalCounts = new HashMap<>();
//             for (TotalPlatformUsageCount total : totalPlatformUsageCountRepository.findAll()) {
//                 totalCounts.put(total.getPlatform(), total.getTotalCount());
//             }
//             //logUserActivity(null, "UNKNOWN", "GET_TOTAL_PLATFORM_COUNTS_SUCCESS", null);
//             return ResponseEntity.ok(totalCounts);
//         } catch (Exception e) {
//             //logUserActivity(null, "UNKNOWN", "GET_TOTAL_PLATFORM_COUNTS_FAILED", null);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("error", -1));
//         }
//     }
// }

package com.example.prog.portfolio.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.WebAsyncTask;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.TotalPlatformUsageCount;
import com.example.prog.entity.UserDtls;
import com.example.prog.entity.portfolio.UserPortfolioUploads;
import com.example.prog.portfolio.serviceImpl.DeletePortfolioTableService;
import com.example.prog.portfolio.serviceImpl.ExtractHeadersService;
import com.example.prog.portfolio.serviceImpl.FileProcessingService;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.portfolioRepo.UserPortfolioUploadRepository;
import com.example.prog.repository.TotalPlatformUsageCountRepository;
import com.example.prog.service.PortfolioRatingService;
import com.example.prog.service.UserActivityService;
import com.example.prog.token.JwtUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.concurrent.Callable;

import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/file")
public class FileUploadController {

    @Autowired
    private FileProcessingService fileProcessingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeletePortfolioTableService deletePortfolioService;

    @Autowired
    private CorporateUserRepository corporateUserRepository;

    @Autowired
    private UserPortfolioUploadRepository userPortfolioUploadRepository;

    @Autowired
    private ExtractHeadersService extractHeaderService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserActivityService userActivityService;

    @Autowired
    private TotalPlatformUsageCountRepository totalPlatformUsageCountRepository;

    @Autowired
    private PortfolioRatingService portfolioRatingService;

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

    private final Object lock = new Object(); // Lock for thread-safe daily counts

    // Valid plot types for portfolio
    private static final Set<String> VALID_PORTFOLIO_PLOT_TYPES = new HashSet<>(List.of(
        "top_ten_script",
        "stock_deployed_amt_over_time",
        "combined_box_plot",
        "create_PNL_plot",
        "create_swot_plot",
        "create_industry_sunburst",
        "create_user_sunburst_with_dropdown",
        "generate_combined_bubble_chart",
        "create_invested_amount_plot",
        "create_best_trade_plot",
        "classify_stocks_risk_return",
        "plot_portfolio_eps_bv_quarterly_all_entries",
        "get_shareholding_data",
        "get_price_acquisition_plot",
        "calculate_portfolio_metrics",
        "portfolio_replacements",
        "actual_date_replacements"
    ));

    // Method to log user activity with platform
    private void logUserActivity(String email, String userType, String activityType, String platform) {
        if (email == null) {
            email = "UNKNOWN";
        }
        if (activityType.equals("FILE_UPLOAD_SUCCESS") && platform != null) {
            activityType = "FILE_UPLOAD_" + platform.replaceAll("\\s+", "");
        }
        // userActivityService.logUserActivity(email, userType, activityType, true, platform);
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

    @PostMapping("/upload")
    public WebAsyncTask<ResponseEntity<Map<String, Object>>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("platform") String platform,
            @RequestParam("portfolioname") String portfolioName,
            @RequestParam("save") boolean saveData,
            @RequestParam(value = "customMappingStr", required = false) String customMappingStr,
            HttpServletRequest request) {

        Callable<ResponseEntity<Map<String, Object>>> callable = () -> {
            String email = null;
            String userType = null;
            try {
                Map<String, String> customMapping = (customMappingStr != null && !customMappingStr.isBlank())
                        ? new ObjectMapper().readValue(customMappingStr, new TypeReference<>() {})
                        : new HashMap<>();

                String authHeader = request.getHeader("Authorization");
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    logUserActivity(null, "UNKNOWN", "FILE_UPLOAD_FAILED", platform);
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "Missing or invalid Authorization header"));
                }

                String jwtToken = authHeader.substring(7);
                email = jwtUtil.extractEmail(jwtToken);
                if (email == null) {
                    logUserActivity(null, "UNKNOWN", "FILE_UPLOAD_FAILED", platform);
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "Invalid JWT token"));
                }

                boolean isCorporate = false;
                int userID;
                CorporateUser corpUser = corporateUserRepository.findByemail(email);
                if (corpUser != null) {
                    isCorporate = true;
                    userID = corpUser.getId();
                    userType = "corporate";
                } else {
                    UserDtls user = userRepository.findByEmail(email)
                            .orElseThrow(() -> new IllegalArgumentException("User not found in the database."));
                    userID = user.getUserID();
                    userType = "individual";
                }

                String uploadId = UUID.randomUUID().toString();

                String originalFilename = file.getOriginalFilename();
                if (originalFilename == null) {
                    logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid file name."));
                }

                Map<String, Object> columnMappingResult;
                if (originalFilename.toLowerCase().endsWith(".csv")) {
                    columnMappingResult = fileProcessingService
                            .performCsvColumnMapping(file, platform, uploadId, userID, isCorporate, customMapping, saveData);
                } else if (originalFilename.toLowerCase().endsWith(".xls") || originalFilename.toLowerCase().endsWith(".xlsx")) {
                    columnMappingResult = fileProcessingService
                            .performColumnMappingAsync(file, platform, uploadId, userID, isCorporate, customMapping, saveData)
                            .join();
                } else {
                    logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Unsupported file format. Only CSV, XLS, and XLSX are allowed."));
                }

                if (columnMappingResult.containsKey("error")) {
                    logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
                    return ResponseEntity.badRequest().body(columnMappingResult);
                }

                String mappedFilePath = (String) columnMappingResult.get("mappedFile");
                if (mappedFilePath == null) {
                    logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Mapped file path is missing."));
                }
                System.out.println("Mapped CSV File Path: " + mappedFilePath);

                Map<String, Object> result = fileProcessingService
                        .processFileAsync(mappedFilePath, platform, uploadId, userID, isCorporate, saveData)
                        .join();

                result.put("uploadId", uploadId);

                String portfolioTableName;
                if (saveData) {
                    portfolioTableName = (String) columnMappingResult.get("tableName");
                    if (portfolioTableName == null || portfolioTableName.isBlank()) {
                        logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
                        return ResponseEntity.badRequest()
                            .body(Map.of("error", "Portfolio table name is missing."));
                    }
                    saveOrUpdateUpload(uploadId, userID, userType, platform, portfolioTableName, portfolioName);
                    result.put("status", "Data saved successfully");
                } else {
                    String prefix = isCorporate ? "Corporate" : "user";
                    String sanitizedPlatform = platform.replaceAll("\\s+", "");
                    portfolioTableName = "Temp_" + prefix + userID + "_" + sanitizedPlatform + "_portfolio_results";
                    saveOrUpdateUpload(uploadId, userID, userType, platform, portfolioTableName, portfolioName);
                    result.put("status", "Data processed without saving and temporary tables removed");
                }

                logUserActivity(email, userType, "FILE_UPLOAD_SUCCESS", platform);
                return ResponseEntity.ok(result);
            } catch (IllegalArgumentException e) {
                logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
                return ResponseEntity.badRequest()
                        .body(Map.of("error", e.getMessage()));
            } catch (Exception e) {
                logUserActivity(email, userType, "FILE_UPLOAD_FAILED", platform);
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File processing failed: " + e.getMessage()));
            }
        };

        WebAsyncTask<ResponseEntity<Map<String, Object>>> webAsyncTask = new WebAsyncTask<>(300000, callable);

        webAsyncTask.onTimeout(() -> {
            logUserActivity(null, "UNKNOWN", "FILE_UPLOAD_TIMEOUT", null);
            return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT)
                    .body(Map.of("error", "Request timed out. Please try again."));
        });

        return webAsyncTask;
    }

    @PostMapping("/extract_headers")
    public ResponseEntity<Map<String, Object>> extractHeaders(@RequestParam("file") MultipartFile file) {
        try {
            logUserActivity(null, "UNKNOWN", "EXTRACT_HEADERS_ATTEMPT", null);

            String fileName = file.getOriginalFilename();
            List<String> headers = new ArrayList<>();

            if (fileName == null) {
                logUserActivity(null, "UNKNOWN", "EXTRACT_HEADERS_FAILED", null);
                throw new IllegalArgumentException("Invalid file");
            }

            if (fileName.endsWith(".csv")) {
                headers = extractHeaderService.extractCsvHeaders(file);
            } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
                headers = extractHeaderService.extractExcelHeaders(file);
            } else if (fileName.endsWith(".txt")) {
                headers = extractHeaderService.extractTxtHeaders(file);
            } else {
                logUserActivity(null, "UNKNOWN", "EXTRACT_HEADERS_FAILED", null);
                throw new UnsupportedOperationException("Unsupported file type");
            }

            logUserActivity(null, "UNKNOWN", "EXTRACT_HEADERS_SUCCESS", null);
            return ResponseEntity.ok(Map.of(
                    "fileName", fileName,
                    "headers", headers
            ));

        } catch (Exception e) {
            System.err.println("Error in extractHeaders: " + e.getMessage());
            e.printStackTrace();
            logUserActivity(null, "UNKNOWN", "EXTRACT_HEADERS_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process file: " + e.getMessage()));
        }
    }

    private void saveOrUpdateUpload(String uploadId, int userID, String userType, String platform, String portfolioTableName, String portfolioName) {
        Optional<UserPortfolioUploads> existingUploadOpt = userPortfolioUploadRepository.findByPortfolioTableNameAndUserIDAndUserType(portfolioTableName, userID, userType);
        UserPortfolioUploads uploadRecord = existingUploadOpt.orElseGet(UserPortfolioUploads::new);
        uploadRecord.setUploadId(uploadId);
        uploadRecord.setUserID(userID);
        uploadRecord.setUserType(userType);
        uploadRecord.setUploadedAt(LocalDateTime.now());
        uploadRecord.setPortfolioTableName(portfolioTableName);
        uploadRecord.setPlatform(platform);
        uploadRecord.setPortfolioName(portfolioName);
        userPortfolioUploadRepository.save(uploadRecord);
    }

    @GetMapping("/saved")
    public ResponseEntity<List<Map<String, Object>>> listSavedPortfolios(HttpServletRequest request) {
        String email = jwtUtil.extractEmail(parseBearer(request));
        boolean isCorporate = false;
        int userID;
        String userType;

        logUserActivity(email, "UNKNOWN", "LIST_PORTFOLIOS_ATTEMPT", null);

        CorporateUser corpUser = corporateUserRepository.findByemail(email);
        if (corpUser != null) {
            isCorporate = true;
            userID = corpUser.getId();
            userType = "corporate";
        } else {
            UserDtls user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        logUserActivity(email, "individual", "LIST_PORTFOLIOS_FAILED", null);
                        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
                    });
            userID = user.getUserID();
            userType = "individual";
        }

        List<UserPortfolioUploads> uploads = userPortfolioUploadRepository
                .findAllByUserIDAndUserType(userID, userType);

        List<Map<String, Object>> dto = uploads.stream()
                .filter(u -> !u.getPortfolioTableName().startsWith("Temp"))
                .map(u -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("uploadId", u.getUploadId());
                    map.put("platform", u.getPlatform());
                    map.put("uploadedAt", u.getUploadedAt());
                    map.put("portfolioTableName", u.getPortfolioTableName());
                    return map;
                })
                .collect(Collectors.toList());

        logUserActivity(email, userType, "LIST_PORTFOLIOS_SUCCESS", null);
        return ResponseEntity.ok(dto);
    }

    private String parseBearer(HttpServletRequest req) {
        String h = req.getHeader("Authorization");
        if (h == null || !h.startsWith("Bearer ")) {
            logUserActivity(null, "UNKNOWN", "AUTHORIZATION_FAILED", null);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return h.substring(7);
    }

    @PostMapping("/paper-trade/create")
    public ResponseEntity<Map<String, Object>> createNewPortfolio(HttpServletRequest request) {
        String email = null;
        String userType = "UNKNOWN";
        try {
            logUserActivity(null, "UNKNOWN", "CREATE_PAPER_TRADE_PORTFOLIO_ATTEMPT", null);

            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logUserActivity(null, "UNKNOWN", "CREATE_PAPER_TRADE_PORTFOLIO_FAILED", null);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Missing or invalid Authorization header"));
            }

            String jwtToken = authHeader.substring(7);
            email = jwtUtil.extractEmail(jwtToken);
            if (email == null) {
                logUserActivity(null, "UNKNOWN", "CREATE_PAPER_TRADE_PORTFOLIO_FAILED", null);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid JWT token"));
            }

            boolean isCorporate = false;
            int userID;
            CorporateUser corpUser = corporateUserRepository.findByemail(email);
            if (corpUser != null) {
                isCorporate = true;
                userID = corpUser.getId();
                userType = "corporate";
            } else {
                UserDtls user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("User not found in the database."));
                userID = user.getUserID();
                userType = "individual";
            }

            Map<String, Object> result = fileProcessingService.createNewPortfolio(userID, isCorporate);

            if (result.containsKey("error")) {
                logUserActivity(email, userType, "CREATE_PAPER_TRADE_PORTFOLIO_FAILED", null);
                return ResponseEntity.badRequest().body(result);
            }

            logUserActivity(email, userType, "CREATE_PAPER_TRADE_PORTFOLIO_SUCCESS", (String) result.get("portfolioName"));
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            logUserActivity(email != null ? email : "UNKNOWN", userType, "CREATE_PAPER_TRADE_PORTFOLIO_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create new portfolio: " + e.getMessage()));
        }
    }

    @PostMapping("/paper-trade/save")
    public ResponseEntity<Map<String, Object>> savePaperTrade(
            @RequestBody List<Map<String, Object>> tradeData,
            @RequestParam("portfolioname") String portfolioName,
            HttpServletRequest request) {

        String email = null;
        String userType = "UNKNOWN";
        try {
            logUserActivity(null, "UNKNOWN", "PAPER_TRADE_SAVE_ATTEMPT", null);

            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logUserActivity(null, "UNKNOWN", "PAPER_TRADE_SAVE_FAILED", null);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Missing or invalid Authorization header"));
            }

            String jwtToken = authHeader.substring(7);
            email = jwtUtil.extractEmail(jwtToken);
            if (email == null) {
                logUserActivity(null, "UNKNOWN", "PAPER_TRADE_SAVE_FAILED", null);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid JWT token"));
            }

            boolean isCorporate = false;
            int userID;
            CorporateUser corpUser = corporateUserRepository.findByemail(email);
            if (corpUser != null) {
                isCorporate = true;
                userID = corpUser.getId();
                userType = "corporate";
            } else {
                UserDtls user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("User not found in the database."));
                userID = user.getUserID();
                userType = "individual";
            }

            Map<String, Object> result = fileProcessingService.processPaperTradeData(tradeData, userID, isCorporate, portfolioName);

            if (result.containsKey("error")) {
                logUserActivity(email, userType, "PAPER_TRADE_SAVE_FAILED", null);
                return ResponseEntity.badRequest().body(result);
            }

            String platform = "Own_" + result.get("series");
            logUserActivity(email, userType, "PAPER_TRADE_SAVE_SUCCESS", platform);
            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            logUserActivity(email != null ? email : "UNKNOWN", userType, "PAPER_TRADE_SAVE_FAILED", null);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logUserActivity(email != null ? email : "UNKNOWN", userType, "PAPER_TRADE_SAVE_FAILED", null);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Paper trade processing failed: " + e.getMessage()));
        }
    }

    @GetMapping("/paper-trade/fetch")
    public ResponseEntity<List<Map<String, Object>>> listSavedPaperTradePortfolios(HttpServletRequest request) {
        String email = null;
        String userType = "UNKNOWN";
        try {
            logUserActivity(null, "UNKNOWN", "LIST_PAPER_TRADE_PORTFOLIOS_ATTEMPT", null);

            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logUserActivity(null, "UNKNOWN", "LIST_PAPER_TRADE_PORTFOLIOS_FAILED", null);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(List.of(Map.of("error", "Missing or invalid Authorization header")));
            }

            String jwtToken = authHeader.substring(7);
            email = jwtUtil.extractEmail(jwtToken);
            if (email == null) {
                logUserActivity(null, "UNKNOWN", "LIST_PAPER_TRADE_PORTFOLIOS_FAILED", null);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(List.of(Map.of("error", "Invalid JWT token")));
            }

            boolean isCorporate = false;
            int userID;
            CorporateUser corpUser = corporateUserRepository.findByemail(email);
            if (corpUser != null) {
                isCorporate = true;
                userID = corpUser.getId();
                userType = "corporate";
            } else {
                UserDtls user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("User not found in the database."));
                userID = user.getUserID();
                userType = "individual";
            }

            List<Map<String, Object>> portfolios = fileProcessingService.listPaperTradePortfolios(userID, isCorporate);

            logUserActivity(email, userType, "LIST_PAPER_TRADE_PORTFOLIOS_SUCCESS", null);
            return ResponseEntity.ok(portfolios);

        } catch (IllegalArgumentException e) {
            logUserActivity(email != null ? email : "UNKNOWN", userType, "LIST_PAPER_TRADE_PORTFOLIOS_FAILED", null);
            return ResponseEntity.badRequest()
                    .body(List.of(Map.of("error", e.getMessage())));
        } catch (Exception e) {
            logUserActivity(email != null ? email : "UNKNOWN", userType, "LIST_PAPER_TRADE_PORTFOLIOS_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of(Map.of("error", "Failed to fetch paper trade portfolios: " + e.getMessage())));
        }
    }

    @DeleteMapping("/paper-trade/delete")
    public ResponseEntity<Map<String, Object>> deletePaperTradeData(
            @RequestParam("portfolioname") String portfolioName,
            HttpServletRequest request) {
        String email = null;
        String userType = "UNKNOWN";
        try {
            logUserActivity(null, "UNKNOWN", "DELETE_PAPER_TRADE_ATTEMPT", null);

            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logUserActivity(null, "UNKNOWN", "DELETE_PAPER_TRADE_FAILED", null);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Missing or invalid Authorization header"));
            }

            String jwtToken = authHeader.substring(7);
            email = jwtUtil.extractEmail(jwtToken);
            if (email == null) {
                logUserActivity(null, "UNKNOWN", "DELETE_PAPER_TRADE_FAILED", null);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid JWT token"));
            }

            boolean isCorporate = false;
            int userID;
            CorporateUser corpUser = corporateUserRepository.findByemail(email);
            if (corpUser != null) {
                isCorporate = true;
                userID = corpUser.getId();
                userType = "corporate";
            } else {
                UserDtls user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("User not found in the database."));
                userID = user.getUserID();
                userType = "individual";
            }

            Map<String, Object> result = fileProcessingService.deletePaperTradeData(userID, isCorporate, portfolioName);

            if (result.containsKey("error")) {
                logUserActivity(email, userType, "DELETE_PAPER_TRADE_FAILED", null);
                return ResponseEntity.badRequest().body(result);
            }

            logUserActivity(email, userType, "DELETE_PAPER_TRADE_SUCCESS", null);
            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            logUserActivity(email != null ? email : "UNKNOWN", userType, "DELETE_PAPER_TRADE_FAILED", null);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logUserActivity(email != null ? email : "UNKNOWN", userType, "DELETE_PAPER_TRADE_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete paper trade data: " + e.getMessage()));
        }
    }

    @GetMapping("/sample")
    public ResponseEntity<?> getSampleUploadId() {
        logUserActivity(null, "UNKNOWN", "GET_SAMPLE_UPLOAD_ID_ATTEMPT", null);

        return userPortfolioUploadRepository.findByPortfolioTableName("Sample_AxisBank_portf")
                .map(record -> {
                    logUserActivity(null, "UNKNOWN", "GET_SAMPLE_UPLOAD_ID_SUCCESS", null);
                    return ResponseEntity.ok(record.getUploadId());
                })
                .orElseThrow(() -> {
                    logUserActivity(null, "UNKNOWN", "GET_SAMPLE_UPLOAD_ID_FAILED", null);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found");
                });
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deletePortfolioTable(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "DELETE_PORTFOLIO_ATTEMPT", null);

        try {
            boolean isDeleted = deletePortfolioService.deletePortfolioTable(uploadId);
            if (isDeleted) {
                logUserActivity(null, "UNKNOWN", "DELETE_PORTFOLIO_SUCCESS", null);
                return ResponseEntity.ok("Table deleted successfully.");
            } else {
                logUserActivity(null, "UNKNOWN", "DELETE_PORTFOLIO_FAILED", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Table does not exist or couldn't be deleted.");
            }
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "DELETE_PORTFOLIO_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting table: " + e.getMessage());
        }
    }

    @GetMapping("/portfolio/chart-data")
    public ResponseEntity<Map<String, Object>> getChartData(@RequestParam int userId, @RequestParam String platform, @RequestParam boolean isCorporate) {
        String userType = isCorporate ? "corporate" : "individual";
        logUserActivity(null, userType, "GET_CHART_DATA_ATTEMPT", platform);

        try {
            String tableName = isCorporate
                    ? "Corporate" + userId + "_" + platform + "_portfolio_results"
                    : "user" + userId + "_" + platform + "_portfolio_results";

            List<Map<String, Object>> results = fileProcessingService.getPortfolioResults(tableName);
            logUserActivity(null, userType, "GET_CHART_DATA_SUCCESS", platform);
            return ResponseEntity.ok(Map.of("data", results));
        } catch (Exception e) {
            logUserActivity(null, userType, "GET_CHART_DATA_FAILED", platform);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/portfolio_fifo_results")
    public ResponseEntity<Map<String, Object>> getPortfolioFifoResults(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_FIFO_RESULTS_ATTEMPT", null);

        Map<String, Object> processingResults = fileProcessingService.getResultsByUploadId(uploadId);
        if (!processingResults.containsKey("portfolio_results")) {
            logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_FIFO_RESULTS_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", "Portfolio results not found."));
        }
        logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_FIFO_RESULTS_SUCCESS", null);
        return ResponseEntity.ok(Map.of("portfolio_fifo_results", processingResults.get("portfolio_results")));
    }

    @PostMapping("/latest_insights")
    public ResponseEntity<?> getLatestInsights(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_LATEST_INSIGHTS_ATTEMPT", null);

        try {
            Map<String, Object> insightData = fileProcessingService.getInsightsDataFromDb(uploadId);
            logUserActivity(null, "UNKNOWN", "GET_LATEST_INSIGHTS_SUCCESS", null);
            return ResponseEntity.ok(insightData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_LATEST_INSIGHTS_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_LATEST_INSIGHTS_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/short_nse_table")
    public ResponseEntity<Map<String, Object>> shortNseTable(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "SHORT_NSE_TABLE_ATTEMPT", null);

        Optional<UserPortfolioUploads> uploadOpt = userPortfolioUploadRepository.findByUploadId(uploadId);
        if (uploadOpt.isEmpty()) {
            logUserActivity(null, "UNKNOWN", "SHORT_NSE_TABLE_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid upload ID."));
        }

        UserPortfolioUploads upload = uploadOpt.get();
        String platform = upload.getPlatform().replaceAll("\\s+", "");
        String tablename = upload.getPortfolioTableName();
        int userId = upload.getUserID();
        boolean isCorporate = "corporate".equalsIgnoreCase(upload.getUserType());
        String userType = isCorporate ? "corporate" : "individual";

        String tableName = (isCorporate ? "Corporate" : "user") + userId + "_" + platform + "_portf";

        if ("Sample_AxisBank_portf".equals(tablename)) {
            tableName = tablename;
        }

        Map<String, Object> result = fileProcessingService.ShortNseFileFromTable(tableName);
        logUserActivity(null, userType, "SHORT_NSE_TABLE_SUCCESS", platform);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/top_ten_script")
    public ResponseEntity<?> getTopTenScript(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_TOP_TEN_SCRIPT_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "top_ten_script");
            logUserActivity(null, "UNKNOWN", "GET_TOP_TEN_SCRIPT_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_TOP_TEN_SCRIPT_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_TOP_TEN_SCRIPT_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/stock_deployed_amt_over_time")
    public ResponseEntity<?> getStockDeployedAmt(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_STOCK_DEPLOYED_AMT_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "stock_deployed_amt_over_time");
            logUserActivity(null, "UNKNOWN", "GET_STOCK_DEPLOYED_AMT_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_STOCK_DEPLOYED_AMT_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_STOCK_DEPLOYED_AMT_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/combined_box_plot")
    public ResponseEntity<Map<String, Object>> getCombined(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_COMBINED_BOX_PLOT_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "combined_box_plot");
            logUserActivity(null, "UNKNOWN", "GET_COMBINED_BOX_PLOT_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_COMBINED_BOX_PLOT_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_COMBINED_BOX_PLOT_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/create_PNL_plot")
    public ResponseEntity<Map<String, Object>> getPnl(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_PNL_PLOT_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "create_PNL_plot");
            logUserActivity(null, "UNKNOWN", "GET_PNL_PLOT_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_PNL_PLOT_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_PNL_PLOT_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/create_swot_plot")
    public ResponseEntity<Map<String, Object>> getSwot(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_SWOT_PLOT_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "create_swot_plot");
            logUserActivity(null, "UNKNOWN", "GET_SWOT_PLOT_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_SWOT_PLOT_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_SWOT_PLOT_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/create_industry_sunburst")
    public ResponseEntity<Map<String, Object>> getIndSun(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_INDUSTRY_SUNBURST_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "create_industry_sunburst");
            logUserActivity(null, "UNKNOWN", "GET_INDUSTRY_SUNBURST_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_INDUSTRY_SUNBURST_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_INDUSTRY_SUNBURST_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/create_user_sunburst_with_dropdown")
    public ResponseEntity<Map<String, Object>> getUserSun(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_USER_SUNBURST_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "create_user_sunburst_with_dropdown");
            logUserActivity(null, "UNKNOWN", "GET_USER_SUNBURST_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_USER_SUNBURST_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_USER_SUNBURST_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/generate_combined_bubble_chart")
    public ResponseEntity<Map<String, Object>> getCombinedBub(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_COMBINED_BUBBLE_CHART_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "generate_combined_bubble_chart");
            logUserActivity(null, "UNKNOWN", "GET_COMBINED_BUBBLE_CHART_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_COMBINED_BUBBLE_CHART_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_COMBINED_BUBBLE_CHART_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/create_invested_amount_plot")
    public ResponseEntity<Map<String, Object>> getInvAmt(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_INVESTED_AMOUNT_PLOT_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "create_invested_amount_plot");
            logUserActivity(null, "UNKNOWN", "GET_INVESTED_AMOUNT_PLOT_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_INVESTED_AMOUNT_PLOT_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_INVESTED_AMOUNT_PLOT_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/create_best_trade_plot")
    public ResponseEntity<Map<String, Object>> getBestTrade(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_BEST_TRADE_PLOT_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "create_best_trade_plot");
            logUserActivity(null, "UNKNOWN", "GET_BEST_TRADE_PLOT_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_BEST_TRADE_PLOT_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_BEST_TRADE_PLOT_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/classify_stocks_risk_return")
    public ResponseEntity<Map<String, Object>> getStockRisk(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_STOCK_RISK_RETURN_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "classify_stocks_risk_return");
            logUserActivity(null, "UNKNOWN", "GET_STOCK_RISK_RETURN_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_STOCK_RISK_RETURN_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_STOCK_RISK_RETURN_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/plot_portfolio_eps_bv_quarterly_all_entries")
    public ResponseEntity<Map<String, Object>> getEpsBvQuarterly(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_EPS_BV_QUARTERLY_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "plot_portfolio_eps_bv_quarterly_all_entries");
            logUserActivity(null, "UNKNOWN", "GET_EPS_BV_QUARTERLY_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_EPS_BV_QUARTERLY_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_EPS_BV_QUARTERLY_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/get_shareholding_data")
    public ResponseEntity<Map<String, Object>> getShareholdingData(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_SHAREHOLDING_DATA_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "get_shareholding_data");
            logUserActivity(null, "UNKNOWN", "GET_SHAREHOLDING_DATA_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_SHAREHOLDING_DATA_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_SHAREHOLDING_DATA_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/get_price_acquisition_plot")
    public ResponseEntity<Map<String, Object>> getPriceAcquisitionPlot(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_PRICE_ACQUISITION_PLOT_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "get_price_acquisition_plot");
            logUserActivity(null, "UNKNOWN", "GET_PRICE_ACQUISITION_PLOT_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_PRICE_ACQUISITION_PLOT_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_PRICE_ACQUISITION_PLOT_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/calculate_portfolio_metrics")
    public ResponseEntity<Map<String, Object>> getCalPortfMat(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_METRICS_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "calculate_portfolio_metrics");
            logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_METRICS_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_METRICS_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_METRICS_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/portfolio_replacements")
    public ResponseEntity<Map<String, Object>> getPortfolioReplace(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_REPLACEMENTS_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "portfolio_replacements");
            logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_REPLACEMENTS_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_REPLACEMENTS_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_PORTFOLIO_REPLACEMENTS_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/actual_date_replacements")
    public ResponseEntity<Map<String, Object>> getActualDateReplace(@RequestParam("uploadId") String uploadId) {
        logUserActivity(null, "UNKNOWN", "GET_ACTUAL_DATE_REPLACEMENTS_ATTEMPT", null);

        try {
            Map<String, Object> graphData = fileProcessingService.getGraphDataFromDb(uploadId, "actual_date_replacements");
            logUserActivity(null, "UNKNOWN", "GET_ACTUAL_DATE_REPLACEMENTS_SUCCESS", null);
            return ResponseEntity.ok(graphData);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "GET_ACTUAL_DATE_REPLACEMENTS_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (JsonProcessingException e) {
            logUserActivity(null, "UNKNOWN", "GET_ACTUAL_DATE_REPLACEMENTS_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "JSON conversion failed"));
        }
    }

    @PostMapping("/build_Portfolio")
    public ResponseEntity<Map<String, Object>> getBuildPortfolio() {
        logUserActivity(null, "UNKNOWN", "BUILD_PORTFOLIO_ATTEMPT", null);

        try {
            Map<String, Object> resultJsonString = fileProcessingService.generatePortfBuild();
            logUserActivity(null, "UNKNOWN", "BUILD_PORTFOLIO_SUCCESS", null);
            return ResponseEntity.ok().body(resultJsonString);
        } catch (NoSuchElementException e) {
            logUserActivity(null, "UNKNOWN", "BUILD_PORTFOLIO_FAILED", null);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/platform-counts")
    public ResponseEntity<Map<String, Integer>> getPlatformCounts(@RequestParam(value = "date", required = false) String dateStr) {
        logUserActivity(null, "UNKNOWN", "GET_PLATFORM_COUNTS_ATTEMPT", null);

        try {
            LocalDate date = (dateStr != null && !dateStr.isBlank())
                    ? LocalDate.parse(dateStr)
                    : LocalDate.now();
            synchronized (lock) {
                Map<String, Integer> platformCounts = userActivityService.getDailyPlatformCounts(date);
                logUserActivity(null, "UNKNOWN", "GET_PLATFORM_COUNTS_SUCCESS", null);
                return ResponseEntity.ok(platformCounts);
            }
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "GET_PLATFORM_COUNTS_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", -1));
        }
    }

    @GetMapping("/total-platform-counts")
    public ResponseEntity<Map<String, Integer>> getTotalPlatformCounts() {
        logUserActivity(null, "UNKNOWN", "GET_TOTAL_PLATFORM_COUNTS_ATTEMPT", null);

        try {
            Map<String, Integer> totalCounts = new HashMap<>();
            for (TotalPlatformUsageCount total : totalPlatformUsageCountRepository.findAll()) {
                totalCounts.put(total.getPlatform(), total.getTotalCount());
            }
            logUserActivity(null, "UNKNOWN", "GET_TOTAL_PLATFORM_COUNTS_SUCCESS", null);
            return ResponseEntity.ok(totalCounts);
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "GET_TOTAL_PLATFORM_COUNTS_FAILED", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", -1));
        }
    }

    // Rating endpoints
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
            if (!VALID_PORTFOLIO_PLOT_TYPES.contains(plotType)) {
                return ResponseEntity.badRequest().body("Invalid plot type: " + plotType);
            }

            portfolioRatingService.submitRating(plotType, userId, userType, rating);
            logUserActivity(email, userType, "SUBMIT_RATING_" + plotType, null);
            return ResponseEntity.ok("Rating submitted successfully");
        } catch (RuntimeException e) {
            logUserActivity(null, "UNKNOWN", "SUBMIT_RATING", null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: " + e.getMessage());
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "SUBMIT_RATING", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error submitting rating: " + e.getMessage());
        }
    }

    // @GetMapping("/ratings/{plotType}/average")
    // public ResponseEntity<Double> getAverageRating(@PathVariable String plotType) {
    //     try {
    //         // Validate plotType
    //         if (!VALID_PORTFOLIO_PLOT_TYPES.contains(plotType)) {
    //             return ResponseEntity.badRequest().body(0.0);
    //         }

    //         Double average = portfolioRatingService.getAverage(plotType);
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
        if (!VALID_PORTFOLIO_PLOT_TYPES.contains(plotType)) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("average_rating", 0.0));
        }

        Double average = portfolioRatingService.getAverage(plotType);
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
            if (!VALID_PORTFOLIO_PLOT_TYPES.contains(plotType)) {
                return ResponseEntity.badRequest().body(0);
            }

            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
            String userType = (String) userDetails.get("userType");
            Integer userId = (Integer) userDetails.get("userId");

            Integer userRating = portfolioRatingService.getUserRating(plotType, userId, userType);
            return ResponseEntity.ok(userRating);
        } catch (RuntimeException e) {
            logUserActivity(null, "UNKNOWN", "GET_USER_RATING", null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(0);
        } catch (Exception e) {
            logUserActivity(null, "UNKNOWN", "GET_USER_RATING", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0);
        }
    }
}