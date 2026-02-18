
// /// ----------------uPLOADid cODE 
// package com.example.prog.portfolio.serviceImpl;



// import java.io.*;
// import java.nio.charset.StandardCharsets;
// import java.nio.file.Files;

// import java.nio.file.Path;
// import java.nio.file.StandardOpenOption;
// import java.security.MessageDigest;
// import java.security.NoSuchAlgorithmException;
// import java.text.ParseException;

// import java.text.SimpleDateFormat;
// import java.time.LocalDate;
// import java.time.LocalTime;
// import java.time.ZoneId;
// import java.time.ZonedDateTime;
// import java.time.format.DateTimeFormatter;
// import java.time.format.DateTimeFormatterBuilder;
// import java.time.format.DateTimeParseException;
// import java.util.ArrayList;

// import java.util.Arrays;
// import java.util.Base64;
// import java.util.Calendar;
// import java.util.Date;

// import java.util.HashMap;

// import java.util.HashSet;

// import java.util.LinkedHashSet;

// import java.util.List;

// import java.util.Map;

// import java.util.NoSuchElementException;

// import java.util.Objects;

// import java.util.Optional;

// import java.util.Set;

// import java.util.StringJoiner;

// import java.util.concurrent.CompletableFuture;

// import java.util.concurrent.ConcurrentHashMap;
// import java.util.stream.Collectors;

// import org.apache.poi.ss.usermodel.Cell;

// import org.apache.poi.ss.usermodel.CellType;

// import org.apache.poi.ss.usermodel.DateUtil;

// import org.apache.poi.ss.usermodel.Row;

// import org.apache.poi.ss.usermodel.Sheet;

// import org.apache.poi.ss.usermodel.Workbook;

// import org.apache.poi.ss.usermodel.WorkbookFactory;

// import org.springframework.beans.factory.annotation.Autowired;

// import org.springframework.beans.factory.annotation.Qualifier;

// import org.springframework.jdbc.support.GeneratedKeyHolder;

// import org.springframework.jdbc.support.KeyHolder;

// import org.springframework.dao.DataAccessException;

// import org.springframework.http.HttpEntity;

// import org.springframework.http.HttpHeaders;

// import org.springframework.http.MediaType;

// import org.springframework.http.ResponseEntity;
// import org.springframework.jdbc.BadSqlGrammarException;
// import org.springframework.jdbc.core.JdbcTemplate;

// import org.springframework.scheduling.annotation.Async;

// import org.springframework.security.core.context.SecurityContextHolder;

// import org.springframework.stereotype.Service;

// import org.springframework.web.client.RestTemplate;

// import org.springframework.web.multipart.MultipartFile;

// import org.apache.commons.csv.CSVFormat;
// import org.apache.commons.csv.CSVParser;
// import org.apache.commons.csv.CSVRecord;
// import org.apache.commons.io.input.BOMInputStream;
// import java.util.Locale;



// import com.example.prog.entity.UserDtls;

// import com.example.prog.entity.portfolio.UserPortfolioUploads;

// import com.example.prog.repository.UserRepository;

// import com.example.prog.repository.portfolioRepo.UserPortfolioUploadRepository;

// // import com.example.prog.exception.DuplicateFileUploadException;

// import com.example.prog.token.DuplicateFileUploadException;



// import com.fasterxml.jackson.core.JsonProcessingException;

// import com.fasterxml.jackson.core.type.TypeReference;

// import com.fasterxml.jackson.databind.ObjectMapper;

// import com.example.prog.repository.portfolioRepo.TradeFileRecordHashRepository;

// import com.example.prog.entity.portfolio.TradeFileRecordHash;


// import jakarta.transaction.Transactional;

// import com.fasterxml.jackson.core.JsonProcessingException;

// import org.slf4j.Logger;

// import org.slf4j.LoggerFactory;
// /////UserId Code---------------------




// @Service
// public class FileProcessingService {

//     @Autowired
//     private ColumnMappingService columnMappingService;

//     @Autowired
//     private UserRepository userRepository;            // ← NEW: to look up userId
    
//     @Autowired
//     @Qualifier("portfolioJdbcTemplate")
//     private JdbcTemplate portfolioJdbcTemplate;
    
//     @Autowired
//     @Qualifier("resultJdbcTemplate")  // defined for CMDA_portf_Result
//     private JdbcTemplate resultJdbcTemplate;

//     @Autowired
//     @Qualifier("ownPortfJdbcTemplate")  // defined for CMDA_Own_Portf
//     private JdbcTemplate ownPortfJdbcTemplate;

//     @Autowired
//     private UserPortfolioUploadRepository userPortfolioUploadRepository;

//     @Autowired
//     private ObjectMapper objectMapper;


//     @Autowired
//     private TradeFileRecordHashRepository tradeFileRecordHashRepository;

//     @Async("taskExecutor")
//     public CompletableFuture<Map<String, Object>> performColumnMappingAsync(MultipartFile file, String platform, String uploadId, int userID, boolean isCorporate , Map<String, String> customMapping, boolean saveData ) {
//     	System.out.println("Running performColumnMappingAsync in thread: " + Thread.currentThread().getName());
//     	try {
//             return CompletableFuture.completedFuture(performColumnMapping(file, platform, uploadId, userID, isCorporate,customMapping,saveData));
//         } catch (IOException e) {
//             e.printStackTrace();
//             return CompletableFuture.failedFuture(e);
//         }
//     }

//     @Async("taskExecutor")
//     public CompletableFuture<Map<String, Object>> processFileAsync(String mappedFilePath, String platform, String uploadId, int userID, boolean isCorporate, boolean saveData) {
//     	System.out.println("Running processFileAsync in thread: " + Thread.currentThread().getName());
//     	return CompletableFuture.completedFuture(processFile(mappedFilePath, platform, uploadId, userID, isCorporate, saveData));
//     }

//     @Async("taskExecutor")
//     public CompletableFuture<String> createTableFromCsvAsync(Path csvPath, String platform, int userID, boolean isCorporate,List<Map<String, Object>> mappedData) {
//     	 System.out.println("Running createTableFromCsvAsync in thread: " + Thread.currentThread().getName());
//     	try {
//             return CompletableFuture.completedFuture(createTableFromCsv(csvPath, platform, userID, isCorporate,mappedData));
//         } catch (IOException e) {
//             e.printStackTrace();
//             // return a failed future or custom error message
//             return CompletableFuture.failedFuture(e);
//         }
//     }


//     public Map<String, Object> getGraphDataFromDb(
//             String uploadId,
//             String graphName) throws JsonProcessingException {

//         // 1) find the upload row
//         UserPortfolioUploads up = userPortfolioUploadRepository
//             .findByUploadId(uploadId)
//             .orElseThrow(() ->
//                 new NoSuchElementException("No saved upload " + uploadId));

//         // 2) build table names
//         // String prefix = up.getUserType().equals("corporate")
//         //                 ? "Corporate" : "user";
//         // String platform = up.getPlatform().replaceAll("\\s+", "");
//         // String portTbl = prefix + up.getUserID() + "_" + platform + "_portfolio_results";
//         // String txnTbl  = prefix + up.getUserID() + "_" + platform + "_transcation";
        
//         // String tablename = userPortfolioUploadRepository.findByUploadId(uploadId).map(record -> record.getPortfolioTableName()).orElse(null); 

//         String prefix = up.getUserType().equals("corporate")
//                     ? "Corporate" : "user";
//         String platform = up.getPlatform().replaceAll("\\s+", "");
//         String baseTableName = prefix + up.getUserID() + "_" + platform;
//         String portTbl = baseTableName + "_portfolio_results";
//         String txnTbl = baseTableName + "_transcation";

//         String tablename = up.getPortfolioTableName();

//         if (tablename.contains("Temp")) {
//         portTbl = "Temp_" + baseTableName + "_portfolio_results";
//         txnTbl = "Temp_" + baseTableName + "_transcation";
//         }
			
//         if("Sample_AxisBank_portf".equals(tablename)) {
//         	portTbl = "Sample_AxisBank_portfolio_results";
//         	txnTbl  = "Sample_AxisBank_transcation";
//         }
//         // 3) query both tables
//         List<Map<String, Object>> portData =
//             resultJdbcTemplate.queryForList("SELECT * FROM [" + portTbl + "]");
//         List<Map<String, Object>> txnData  =
//             resultJdbcTemplate.queryForList("SELECT * FROM [" + txnTbl  + "]");

//         // 4) to JSON
//         String results1Json = objectMapper.writeValueAsString(portData);
//         String results2Json = objectMapper.writeValueAsString(txnData);

//         // 5) invoke your existing Python-based graph generator
//         return generateGraphs(results1Json, results2Json, graphName);
//     }
    

//  private final Map<String, String> filePathMap = new ConcurrentHashMap<>();
//  private final Map<String, Map<String, Object>> processingResultMap = new ConcurrentHashMap<>();

 
//     private static final Logger logger = LoggerFactory.getLogger(FileProcessingService.class); 


// // New Code performColumnMapping

// public Map<String, Object> performCsvColumnMapping(
//             MultipartFile file,
//             String platform,
//             String uploadId,
//             int userId,
//             boolean isCorporate,
//             Map<String, String> customMapping, boolean saveData) throws IOException {

//         logger.debug("Starting CSV column mapping for platform: {}", platform);

//         Map<String, String> columnMapping;
//         if ("Other".equalsIgnoreCase(platform)) {
//             if (customMapping == null || customMapping.isEmpty()) {
//                 logger.warn("Custom mapping not provided for platform 'Other'");
//                 return Map.of("error", "Custom mapping required for platform 'Other'.");
//             }
//             columnMapping = customMapping;
//         } else {
//             columnMapping = columnMappingService.getMapping(platform);
//             if (columnMapping == null || columnMapping.isEmpty()) {
//                 logger.warn("No mapping found for platform: {}", platform);
//                 return Map.of("error", "Invalid platform specified.");
//             }
//         }

//         List<String> taxColumns = columnMappingService.getTaxColumns();
//         Set<String> allExpectedColumns = new HashSet<>(columnMapping.values());
//         List<Map<String, Object>> mappedData = new ArrayList<>();
//         boolean aggregatedTaxesExistsInFile = columnMapping.containsValue("Aggregated_Taxes");
//         int tradeDateParseCount = 0;

//         Reader reader = new InputStreamReader(new BOMInputStream(file.getInputStream()), StandardCharsets.UTF_8);
//         try (CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withTrim())) {

//             Map<String, Integer> headerMap = csvParser.getHeaderMap();
//             Map<String, String> reverseMap = new HashMap<>();
//             for (Map.Entry<String, String> entry : columnMapping.entrySet()) {
//                 reverseMap.put(entry.getValue(), entry.getKey());
//             }

//             for (CSVRecord csvRecord : csvParser) {
//                 Map<String, Object> record = new HashMap<>();
//                 double aggregatedTaxes = 0;
//                 String tradeDateStr = null;
//                 String tradeTimeStr = null;

//                 for (String key : allExpectedColumns) {
//                     String originalHeader = reverseMap.get(key);
//                     String value = csvRecord.isMapped(originalHeader) ? csvRecord.get(originalHeader).trim() : "";

//                     if ("Trade_Date".equals(key)) {
//                         String formattedDate = "";
//                         try {
//                             logger.debug("Raw Trade_Date before parsing (row {}): '{}'", csvRecord.getRecordNumber(), value);
//                             DateTimeFormatter formatter = new DateTimeFormatterBuilder()
//                             	    .parseCaseInsensitive()
//                             	    .appendOptional(DateTimeFormatter.ofPattern("MM/dd/yyyy"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("MM-d-yyyy"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("M/d/yyyy"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("M-d-yyyy"))

//                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm a"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))

//                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd MMM yyyy"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MMM-yy"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("d-MMM-yy"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("d-M-yyyy"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("d/M/yyyy"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("yyyy/MM/dd"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("MM-dd-yyyy"))
//                                     .toFormatter(Locale.ENGLISH);
                            
//                             LocalDate date = LocalDate.parse(value, formatter);
//                             formattedDate = new SimpleDateFormat("dd-MM-yyyy")
//                                 .format(Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant()));

//                             logger.debug("Formatted Trade_Date after parsing (row {}): '{}'", csvRecord.getRecordNumber(), formattedDate);
//                             tradeDateParseCount++;
//                         } catch (Exception e) {
//                             logger.warn("Unable to parse Trade_Date '{}' at row {}: {}", value, csvRecord.getRecordNumber(), e.getMessage());
//                         }
//                         record.put("Trade_Date", formattedDate);
//                         tradeDateStr = formattedDate;
//                         continue;
//                     }

//                     if ("Trade_Time".equals(key)) {
//                         tradeTimeStr = value;
//                     }
                    
//                     if ((key.equals("Brok_Amt") && value.isEmpty())) {
//                         value = "0";
//                     }

//                     if ((key.equals("Exchange") && value.isEmpty())) {
//                         value = "NSE";
//                     }

//                     record.put(key, value);
//                 }
                
//                 boolean shouldCalculateTaxes = true;
//                 if (aggregatedTaxesExistsInFile) {
//                     String originalAggHeader = reverseMap.get("Aggregated_Taxes");
//                     String aggVal = csvRecord.isMapped(originalAggHeader) ? csvRecord.get(originalAggHeader).trim() : "";

//                     try {
//                         if (!aggVal.isEmpty()) {
//                             double val = Double.parseDouble(aggVal);
//                             record.put("Aggregated_Taxes", val);
//                             shouldCalculateTaxes = false;
//                         }
//                     } catch (NumberFormatException e) {
//                         logger.debug("Invalid Aggregated_Taxes value '{}' at row {}: {}", aggVal, csvRecord.getRecordNumber(), e.getMessage());
//                     }
//                 }

//                 if (shouldCalculateTaxes) {
//                     aggregatedTaxes = 0;
//                     for (String taxKey : taxColumns) {
//                         String originalTaxHeader = reverseMap.get(taxKey);
//                         String taxVal = csvRecord.isMapped(originalTaxHeader) ? csvRecord.get(originalTaxHeader).trim() : "0";
//                         try {
//                             aggregatedTaxes += Double.parseDouble(taxVal);
//                         } catch (NumberFormatException e) {
//                             logger.debug("Invalid tax value '{}' at row {}: {}", taxVal, csvRecord.getRecordNumber(), e.getMessage());
//                         }
//                     }
//                     record.put("Aggregated_Taxes", aggregatedTaxes);
//                 }

//                 try {
//                     if (tradeDateStr != null && !tradeDateStr.isEmpty()) {
//                         LocalDate tradeDate = LocalDate.parse(tradeDateStr, DateTimeFormatter.ofPattern("dd-MM-yyyy"));

//                         int year = tradeDate.getYear();
//                         int month = tradeDate.getMonthValue();
//                         int day = tradeDate.getDayOfMonth();

//                         if (month <= 2) {
//                             year -= 1;
//                             month += 12;
//                         }
//                         int a = year / 100;
//                         int b = a / 4;
//                         int c = 2 - a + b;
//                         int e = (int) (365.25 * (year + 4716));
//                         int f = (int) (30.6001 * (month + 1));
//                         double julianDate = c + day + e + f - 1524.5;

//                         if (tradeTimeStr != null && !tradeTimeStr.isEmpty()) {
//                             try {
//                                 double fractionOfDay;
//                                 if (tradeTimeStr.matches("\\d*\\.\\d+")) {
//                                     fractionOfDay = Double.parseDouble(tradeTimeStr);
//                                 } else {
//                                     LocalTime tradeTime = LocalTime.parse(tradeTimeStr, DateTimeFormatter.ofPattern("[HH:mm:ss][HH:mm]"));
//                                     fractionOfDay = tradeTime.toSecondOfDay() / 86400.0;
//                                 }
//                                 julianDate += fractionOfDay;
//                             } catch (Exception e1) {
//                                 logger.debug("Invalid Trade_Time format '{}' at row {}: {}", tradeTimeStr, csvRecord.getRecordNumber(), e1.getMessage());
//                             }
//                         }
//                         record.put("Julian_Date", julianDate);
//                     } else {
//                         continue;
//                     }
//                 } catch (Exception e) {
//                     logger.warn("Invalid Trade_Date format '{}' at row {}, skipping row", tradeDateStr, csvRecord.getRecordNumber());
//                     continue;
//                 }

//                 for (String expectedColumn : allExpectedColumns) {
//                     if (!record.containsKey(expectedColumn)) {
//                         record.put(expectedColumn, 0);
//                     }
//                 }

//                 mappedData.add(record);
//             }

//             logger.info("Total Trade_Date values successfully parsed: {}", tradeDateParseCount);

//             for (Map<String, Object> record : mappedData) {
//                 for (String taxColumn : taxColumns) {
//                     record.remove(taxColumn);
//                 }
//             }

//             if (mappedData.isEmpty()) return Map.of("error", "No valid data rows processed.");

//             try {
//                 MessageDigest digest = MessageDigest.getInstance("SHA-256");
//                 StringBuilder sb = new StringBuilder();
//                 for (Map<String, Object> row : mappedData) {
//                     for (String key : allExpectedColumns) {
//                         sb.append(key).append(":" ).append(row.getOrDefault(key, "")).append(";");
//                     }
//                 }
//                 byte[] hashBytes = digest.digest(sb.toString().getBytes(StandardCharsets.UTF_8));
//                 StringBuilder hexString = new StringBuilder();
//                 for (byte b : hashBytes) {
//                     hexString.append(String.format("%02x", b));
//                 }
//                 String fileHash = hexString.toString();
//                 if(saveData) {
//                 Optional<TradeFileRecordHash> existingRecordOpt = tradeFileRecordHashRepository.findByUserIdAndPlatform(userId, platform);
//                 if (existingRecordOpt.isPresent()) {
//                     TradeFileRecordHash existingRecord = existingRecordOpt.get();
//                     if (existingRecord.getTradeFileHash().equals(fileHash)) {
//                         throw new DuplicateFileUploadException("This file has already been uploaded.");
//                     } else {
//                         existingRecord.setTradeFileHash(fileHash);
//                         existingRecord.setUploadId(uploadId);
//                         tradeFileRecordHashRepository.save(existingRecord);
//                     }
//                 } else {
//                     TradeFileRecordHash newRecord = new TradeFileRecordHash(userId, platform, fileHash, uploadId);
//                     tradeFileRecordHashRepository.save(newRecord);
//                 }
//                 }
//             } catch (NoSuchAlgorithmException e) {
//                 logger.error("SHA-256 not available: {}", e.getMessage());
//             }

//             Path tempFilePath = Files.createTempFile("mapped_data_" + uploadId, ".csv");
//             try {
//                 saveToCSV(tempFilePath, mappedData);
//                 filePathMap.put(uploadId, tempFilePath.toString());

//                 String tableName = createTableFromCsv(tempFilePath, platform, userId, isCorporate, mappedData);
//                 if (tableName == null || tableName.isBlank()) {
//                     return Map.of("error", "Failed to create table from CSV.");
//                 }

//                 return Map.of("mappedFile", tempFilePath.toString(), "tableName", tableName);
//             } catch (IOException e) {
//                 logger.error("CSV save failed: {}", e.getMessage(), e);
//                 return Map.of("error", "Failed to save CSV: " + e.getMessage());
//             }
//         } catch (IOException e) {
//             logger.error("Error processing CSV file: {}", e.getMessage(), e);
//             return Map.of("error", "CSV file processing failed: " + e.getMessage());
//         }
//     }

//   public Map<String, Object> performColumnMapping(
//             MultipartFile file,
//             String platform,
//             String uploadId,
//             int userId,
//             boolean isCorporate,
//             Map<String, String> customMapping, boolean saveData) throws IOException {

//         logger.debug("Starting column mapping for platform: {}", platform);

//         Map<String, String> columnMapping;
//         if ("Other".equalsIgnoreCase(platform)) {
//             if (customMapping == null || customMapping.isEmpty()) {
//                 logger.warn("Custom mapping not provided for platform 'Other'");
//                 return Map.of("error", "Custom mapping required for platform 'Other'.");
//             }
//             columnMapping = customMapping;
//             logger.debug("Using custom mapping: {}", columnMapping);
//         } else {
//             columnMapping = columnMappingService.getMapping(platform);
//             if (columnMapping == null || columnMapping.isEmpty()) {
//                 logger.warn("No mapping found for platform: {}", platform);
//                 return Map.of("error", "Invalid platform specified.");
//             }
//             logger.debug("Fetched mapping for platform {}: {}", platform, columnMapping);
//         }

//         List<String> taxColumns = columnMappingService.getTaxColumns();
//         Set<String> allExpectedColumns = new HashSet<>(columnMapping.values());
//         Map<Integer, String> columnIndexMapping = new HashMap<>();
//         Set<Integer> taxColumnIndices = new HashSet<>();
//         Set<String> mappedColumns = new HashSet<>();
//         List<Map<String, Object>> mappedData = new ArrayList<>();
//         boolean aggregatedTaxesExistsInFile = false;

//         try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
//             Sheet sheet = workbook.getSheetAt(0);
//             if (sheet == null) return Map.of("error", "Invalid file format.");

//             Row headerRow = sheet.getRow(0);
//             if (headerRow == null) return Map.of("error", "No header row found.");

//             // Header mapping
//             for (Cell cell : headerRow) {
//                 String header = cell.getStringCellValue() != null ? cell.getStringCellValue().trim() : "";
//                 if (!header.isEmpty() && columnMapping.containsKey(header)) {
//                     String mappedKey = columnMapping.get(header);
//                     int colIndex = cell.getColumnIndex();

//                     if ("Aggregated_Taxes".equals(mappedKey)) {
//                         aggregatedTaxesExistsInFile = true;
//                         columnIndexMapping.put(colIndex, mappedKey);
//                         mappedColumns.add(mappedKey);
//                     } else if (taxColumns.contains(mappedKey)) {
//                         taxColumnIndices.add(colIndex);
//                     } else {
//                         columnIndexMapping.put(colIndex, mappedKey);
//                         mappedColumns.add(mappedKey);
//                     }
//                 }
//             }

//             if (columnIndexMapping.isEmpty() && taxColumnIndices.isEmpty()) {
//                 logger.warn("No valid columns mapped from header row.");
//                 return Map.of("error", "No valid columns mapped.");
//             }

//             // Row processing
//             for (int i = 1; i <= sheet.getLastRowNum(); i++) {
//                 Row row = sheet.getRow(i);
//                 if (row == null) continue;

//                 Map<String, Object> record = new HashMap<>();
//                 double aggregatedTaxes = 0;
//                 String tradeDateStr = null;
//                 String tradeTimeStr = null;

//                 for (Map.Entry<Integer, String> entry : columnIndexMapping.entrySet()) {
//                     Cell cell = row.getCell(entry.getKey(), Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
//                     String columnName = entry.getValue();
//                     Object value = getCellValue(cell);

//                     if ("Trade_Date".equals(columnName)) {
//                         String formattedDate = "";
//                         try {
//                             if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
//                                 // Excel date format
//                                 Date javaDate = cell.getDateCellValue();
//                                 formattedDate = new SimpleDateFormat("dd-MM-yyyy").format(javaDate);
//                             } else {
//                                 // Handle string formats
//                                 String raw = value.toString().trim();

//                                 DateTimeFormatter formatter = new DateTimeFormatterBuilder()
//                                     .parseCaseInsensitive()
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm a"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy")) // fallback
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MMM-yy"))
//                                     .appendOptional(DateTimeFormatter.ofPattern("dd MMM yyyy"))   // optional extra
//                                     .appendOptional(DateTimeFormatter.ofPattern("MM-dd-yyyy"))     // optional extra
//                                     .toFormatter(Locale.ENGLISH);
//                                 LocalDate date = LocalDate.parse(raw, formatter);
//                                 Date javaDate = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
//                                 formattedDate = new SimpleDateFormat("dd-MM-yyyy").format(javaDate);
//                             }
//                         } catch (Exception e) {
//                             logger.warn("Unable to parse Trade_Date '{}' at row {}: {}", value, i, e.getMessage());
//                             formattedDate = ""; // Ensure it's not missing
//                         }

//                         // ✅ Always include Trade_Date in the record (even if empty)
//                         record.put("Trade_Date", formattedDate);
//                         tradeDateStr = formattedDate;

//                         continue; // Skip duplicate assignment below
//                     }

//                     if ("Trade_Time".equals(columnName)) {
//                         tradeTimeStr = value != null ? value.toString() : null;
//                     }

//                     record.put(columnName, value);
//                 }

//                 if (!aggregatedTaxesExistsInFile) {
//                     for (Integer taxIndex : taxColumnIndices) {
//                         Cell taxCell = row.getCell(taxIndex, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
//                         Object taxValue = getCellValue(taxCell);
//                         try {
//                             aggregatedTaxes += Double.parseDouble(taxValue.toString());
//                         } catch (NumberFormatException e) {
//                             logger.debug("Invalid tax value '{}' at row {}, column {}: {}", taxValue, i, taxIndex, e.getMessage());
//                         }
//                     }
//                     record.put("Aggregated_Taxes", aggregatedTaxes);
//                 }

//                 // Julian Date Calculation
//                 try {
//                     if (tradeDateStr != null && !tradeDateStr.isEmpty()) {
//                         LocalDate tradeDate;
//                         if (tradeDateStr.matches("\\d+(\\.\\d+)?")) {
//                             double serial = Double.parseDouble(tradeDateStr);
//                             Date javaDate = DateUtil.getJavaDate(serial);
//                             tradeDate = javaDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
//                         } else {
//                             DateTimeFormatter formatter = new DateTimeFormatterBuilder()
//                                 .parseCaseInsensitive()
//                                 .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm a"))
//                                 .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a"))
//                                 .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))
//                                 .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
//                                 .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
//                                 .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
//                                 .appendOptional(DateTimeFormatter.ofPattern("dd-MMM-yy"))
//                                 .appendOptional(DateTimeFormatter.ofPattern("dd MMM yyyy"))   // optional extra
//                                 .appendOptional(DateTimeFormatter.ofPattern("MM-dd-yyyy"))     // optional extra
//                                 .toFormatter(Locale.ENGLISH);
//                             tradeDate = LocalDate.parse(tradeDateStr, formatter);
//                         }

//                         int year = tradeDate.getYear();
//                         int month = tradeDate.getMonthValue();
//                         int day = tradeDate.getDayOfMonth();

//                         if (month <= 2) {
//                             year -= 1;
//                             month += 12;
//                         }
//                         int a = year / 100;
//                         int b = a / 4;
//                         int c = 2 - a + b;
//                         int e = (int) (365.25 * (year + 4716));
//                         int f = (int) (30.6001 * (month + 1));
//                         double julianDate = c + day + e + f - 1524.5;

//                         if (tradeTimeStr != null && !tradeTimeStr.isEmpty()) {
//                             try {
//                                 double fractionOfDay;
//                                 if (tradeTimeStr.matches("\\d*\\.\\d+")) {
//                                     fractionOfDay = Double.parseDouble(tradeTimeStr);
//                                 } else {
//                                     LocalTime tradeTime = LocalTime.parse(tradeTimeStr, DateTimeFormatter.ofPattern("[HH:mm:ss][HH:mm]"));
//                                     fractionOfDay = tradeTime.toSecondOfDay() / 86400.0;
//                                 }
//                                 julianDate += fractionOfDay;
//                             } catch (Exception e1) {
//                                 logger.debug("Invalid Trade_Time format '{}' at row {}: {}", tradeTimeStr, i, e1.getMessage());
//                             }
//                         }

//                         record.put("Julian_Date", julianDate);
//                     } else {
//                         continue; // Skip row if no Trade_Date
//                     }
//                 } catch (Exception e) {
//                     logger.warn("Invalid Trade_Date format '{}' at row {}, skipping row", tradeDateStr, i);
//                     continue;
//                 }

//                 for (String expectedColumn : allExpectedColumns) {
//                     if (!record.containsKey(expectedColumn)) {
//                         record.put(expectedColumn, 0);
//                     }
//                 }

//                 mappedData.add(record);
//             }

//             // Remove tax columns from records
//             for (Map<String, Object> record : mappedData) {
//                 for (String taxColumn : taxColumns) {
//                     record.remove(taxColumn);
//                 }
//             }

//             if (mappedData.isEmpty()) return Map.of("error", "No valid data rows processed.");

//             // Generate file-level hash
//             try {
//                 MessageDigest digest = MessageDigest.getInstance("SHA-256");
//                 StringBuilder sb = new StringBuilder();
//                 for (Map<String, Object> row : mappedData) {
//                     for (String key : allExpectedColumns) {
//                         sb.append(key).append(":").append(row.getOrDefault(key, "")).append(";");
//                     }
//                 }
//                 byte[] hashBytes = digest.digest(sb.toString().getBytes(StandardCharsets.UTF_8));
//                 StringBuilder hexString = new StringBuilder();
//                 for (byte b : hashBytes) {
//                     hexString.append(String.format("%02x", b));
//                 }
//                 String fileHash = hexString.toString();
//                 logger.debug("Generated file-level hash: {}", fileHash);
                
//                 if(saveData) {
//                 Optional<TradeFileRecordHash> existingRecordOpt = tradeFileRecordHashRepository.findByUserIdAndPlatform(userId, platform);
                
// 	                if (existingRecordOpt.isPresent()) {
// 	                    TradeFileRecordHash existingRecord = existingRecordOpt.get();
// 	                    if (existingRecord.getTradeFileHash().equals(fileHash)) {
// 	                        throw new DuplicateFileUploadException("This file has already been uploaded.");
// 	                    } else {
// 	                        existingRecord.setTradeFileHash(fileHash);
// 	                        existingRecord.setUploadId(uploadId);
// 	                        tradeFileRecordHashRepository.save(existingRecord);
// 	                    }
// 	                } else {
	                	
// 	                    TradeFileRecordHash newRecord = new TradeFileRecordHash(userId, platform, fileHash, uploadId);
// 	                    tradeFileRecordHashRepository.save(newRecord);
	                	
// 	                }
//                 }

//             } catch (NoSuchAlgorithmException e) {
//                 logger.error("SHA-256 not available: {}", e.getMessage());
//             }

//             // Save CSV & create table
//             Path tempFilePath = Files.createTempFile("mapped_data_" + uploadId, ".csv");
//             try {
//                 saveToCSV(tempFilePath, mappedData);
//                 filePathMap.put(uploadId, tempFilePath.toString());

//                 String tableName = createTableFromCsv(tempFilePath, platform, userId, isCorporate, mappedData);
//                 if (tableName == null || tableName.isBlank()) {
//                     return Map.of("error", "Failed to create table from CSV.");
//                 }

//                 return Map.of("mappedFile", tempFilePath.toString(), "tableName", tableName);
//             } catch (IOException e) {
//                 logger.error("CSV save failed: {}", e.getMessage(), e);
//                 return Map.of("error", "Failed to save CSV: " + e.getMessage());
//             }

//         } catch (IOException e) {
//             logger.error("Error processing Excel file: {}", e.getMessage(), e);
//             return Map.of("error", "File processing failed: " + e.getMessage());
//         }
//     }

// // New code createTableFromCsv

//    public String createTableFromCsv(Path csvPath, String platform, int userId, boolean isCorporate, List<Map<String, Object>> mappedData) throws IOException {
//         List<String> lines = Files.readAllLines(csvPath, StandardCharsets.UTF_8);
//         if (lines.isEmpty()) {
//             logger.error("CSV file is empty: {}", csvPath);
//             throw new IllegalArgumentException("CSV file is empty.");
//         }

//         String firstLine = lines.get(0).replace("\uFEFF", ""); // Remove BOM
//         String[] headers = firstLine.split(",", -1);

//         List<String[]> rows = lines.subList(1, lines.size()).stream()
//             .map(line -> line.split(",", -1))
//             .filter(row -> row.length == headers.length)
//             .toList();

//         String sanitizedPlatform = platform.replaceAll("\\s+", "");
//         String tableNamePrefix = isCorporate ? "Corporate" : "user";
//         String tableName = tableNamePrefix + userId + "_" + sanitizedPlatform + "_portf";

//         Map<String, String> dataTypes = Map.of(
//             "Exchange", "VARCHAR(100)",
//             "Trade_Date", "DATE",
//             "Order_Type", "VARCHAR(50)",
//             "Qty", "FLOAT",
//             "Scrip_Name", "VARCHAR(150)",
//             "Brok_Amt", "FLOAT",
//             "Aggregated_Taxes", "FLOAT",
//             "Mkt_Price", "FLOAT"
//         );

//         try {
//             String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//             Integer count = portfolioJdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);
//             if (count == null || count == 0) {
//                 List<String> columns = new ArrayList<>();
//                 for (String header : headers) {
//                     String colName = header.trim().replaceAll("\\s+", "_").replaceAll("[^a-zA-Z0-9_]", "");
//                     if (colName.isEmpty()) continue;
//                     String type = dataTypes.getOrDefault(colName, "VARCHAR(255)");
//                     columns.add("[" + colName + "] " + type);
//                 }
//                 columns.add("[Julian_Date] FLOAT");
//                 columns.add("[Hashcode] VARCHAR(64)");
//                 String sql = "CREATE TABLE [" + tableName + "] (" + String.join(", ", columns) + ")";
//                 portfolioJdbcTemplate.execute(sql);
//             }
//         } catch (DataAccessException e) {
//             logger.error("Failed to create table '{}': {}", tableName, e.getMessage(), e);
//             throw new IOException("Failed to create table: " + e.getMessage(), e);
//         }

//         String colsJoined = Arrays.stream(headers)
//             .map(h -> h.trim().replaceAll("\\s+", "_").replaceAll("[^a-zA-Z0-9_]", ""))
//             .map(col -> "[" + col + "]")
//             .collect(Collectors.joining(","));

//         SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");

//         for (int rowIndex = 0; rowIndex < rows.size(); rowIndex++) {
//             String[] vals = rows.get(rowIndex);
//             try {
//                 StringJoiner valuesJoiner = new StringJoiner(",", "(", ")");
//                 for (int i = 0; i < vals.length && i < headers.length; i++) {
//                     String rawHeader = headers[i].trim();
//                     String colName = rawHeader.replaceAll("\\s+", "_").replaceAll("[^a-zA-Z0-9_]", "");
//                     String value = vals[i].trim();

//                     // Format Trade_Date correctly
//                     if ("Trade_Date".equalsIgnoreCase(colName)) {
//                         try {
//                             if (value.matches("\\d+(\\.\\d+)?")) {
//                                 double serial = Double.parseDouble(value);
//                                 Date javaDate = DateUtil.getJavaDate(serial);
//                                 value = outputFormat.format(javaDate);
//                             } else if (value.matches("\\d{2}/\\d{2}/\\d{4}")) {
//                                 value = outputFormat.format(new SimpleDateFormat("dd/MM/yyyy").parse(value));
//                             } else if (value.matches("\\d{2}-\\d{2}-\\d{4}")) {
//                                 value = outputFormat.format(new SimpleDateFormat("dd-MM-yyyy").parse(value));
//                             } else if (value.matches("\\d{4}-\\d{2}-\\d{2}")) {
//                                 // already in correct format
//                             } else {
//                                 value = outputFormat.format(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").parse(value));
//                             }
//                         } catch (ParseException e) {
//                             logger.warn("Invalid Trade_Date format '{}', row {}", value, rowIndex);
//                             value = "";
//                         }
//                     }

//                     // Format each column value based on type
//                     String columnType = dataTypes.getOrDefault(colName, "VARCHAR(255)");
//                     if (value.isEmpty()) {
//                         valuesJoiner.add("NULL");
//                     } else if (columnType.startsWith("VARCHAR")) {
//                         valuesJoiner.add("'" + value.replace("'", "''") + "'");
//                     } else if (columnType.equals("DATE")) {
//                         valuesJoiner.add("'" + value + "'");
//                     } else {
//                         valuesJoiner.add(value); // numeric values without quotes
//                     }
//                 }

//                 double julianDate = 0.0;
//                 if (rowIndex < mappedData.size()) {
//                     Object julianObj = mappedData.get(rowIndex).get("Julian_Date");
//                     if (julianObj instanceof Number) {
//                         julianDate = ((Number) julianObj).doubleValue();
//                     }
//                 }

// //                String hash = String.valueOf(String.join("|", vals).hashCode());
//                 // ✅ NEW: Use mappedData to extract values and generate hash
//                 String qty = "", brokAmt = "", mktPrice = "", agTax = "", trade_id = "";

//                 if (rowIndex < mappedData.size()) {
//                     Map<String, Object> rowMap = mappedData.get(rowIndex);
//                     qty = String.valueOf(rowMap.getOrDefault("Qty", "")).trim();
//                     brokAmt = String.valueOf(rowMap.getOrDefault("Brok_Amt", "")).trim();
//                     mktPrice = String.valueOf(rowMap.getOrDefault("Mkt_Price", "")).trim();
//                     agTax = String.valueOf(rowMap.getOrDefault("Aggregated_Taxes", "")).trim();
//                     trade_id = String.valueOf(rowMap.getOrDefault("Trade_Id", "")).trim();
//                 }

//                 String combined = qty + "|" + brokAmt + "|" + mktPrice + "|" + agTax + "|" + trade_id;
//                 String hash = String.valueOf(generateSHA256(combined));
                
//                 String existsCheck = "SELECT COUNT(*) FROM [" + tableName + "] WHERE Julian_Date = ? AND Hashcode = ?";
//                 Integer exists = portfolioJdbcTemplate.queryForObject(existsCheck, Integer.class, julianDate, hash);
//                 if (exists != null && exists > 0) {
//                     continue;
//                 }

//                 valuesJoiner.add(String.valueOf(julianDate));
//                 valuesJoiner.add("'" + hash + "'");

//                 String insertSQL = "INSERT INTO [" + tableName + "] (" + colsJoined + ", [Julian_Date], [Hashcode]) VALUES " + valuesJoiner;
//                 portfolioJdbcTemplate.execute(insertSQL);
//             } catch (DataAccessException e) {
//                 logger.error("Error inserting row {}: {}", rowIndex, e.getMessage(), e);
//             }
//         }

//         return tableName;
//     }

    
//     private String generateSHA256(String input) {
//         try {
//             MessageDigest digest = MessageDigest.getInstance("SHA-256");
//             byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
//             StringBuilder sb = new StringBuilder();
//             for (byte b : hashBytes) {
//                 sb.append(String.format("%02x", b));
//             }
//             return sb.toString();
//         } catch (NoSuchAlgorithmException e) {
//             throw new RuntimeException("SHA-256 algorithm not available", e);
//         }
//     }


// // End code 
// //        
//     //     @Transactional
//     //     public String createTableFromCsv(Path csvPath, String platform, int userId, boolean isCorporate) throws IOException {
//     //         // Read CSV lines
//     //         List<String> lines = Files.readAllLines(csvPath);
//     //         if (lines.isEmpty()) {
                
//     //             throw new IllegalArgumentException("CSV file is empty.");
//     //         }

//     //     String[] headers = lines.get(0).split(",", -1);
//     //     if (headers.length == 0) {
            
//     //         throw new IllegalArgumentException("No headers found in CSV.");
//     //     }

//     //     List<String[]> rows = lines.subList(1, lines.size()).stream()
//     //             .map(line -> line.split(",", -1))
//     //             .filter(row -> row.length == headers.length)
//     //             .toList();

//     //     // Generate table name
//     //     String sanitizedPlatform = platform.replaceAll("\\s+", "");
//     //     String tableNamePrefix = isCorporate ? "Corporate" : "user";
//     //     String tableName = tableNamePrefix + userId + "_" + sanitizedPlatform + "_portf";

//     //     // Define column data types
//     //     Map<String, String> dataTypes = Map.of(
//     //             "Exchange", "VARCHAR(100)",
//     //             "Trade_Date", "DATE",
//     //             "Order_Type", "VARCHAR(50)",
//     //             "Qty", "FLOAT",
//     //             "Scrip_Name", "VARCHAR(150)",
//     //             "Brok_Amt", "FLOAT",
//     //             "Aggregated_Taxes", "FLOAT",
//     //             "Mkt_Price", "FLOAT"
//     //     );

//     //     // Create table if it doesn't exist
//     //     try {
//     //         String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//     //         Integer count = portfolioJdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);
//     //         if (count == null || count == 0) {
//     //             StringBuilder sqlBuilder = new StringBuilder("CREATE TABLE [").append(tableName).append("] (");
//     //             boolean first = true;
//     //             for (String header : headers) {
//     //                 String colName = header.trim().replaceAll("\\s+", "_");
//     //                 if (colName.isEmpty()) {
                        
//     //                     continue;
//     //                 }
//     //                 String type = dataTypes.getOrDefault(colName, "VARCHAR(255)");
//     //                 if (!first) {
//     //                     sqlBuilder.append(", ");
//     //                 }
//     //                 sqlBuilder.append("[").append(colName).append("] ").append(type);
//     //                 first = false;
//     //             }
//     //             sqlBuilder.append(")");
//     //             portfolioJdbcTemplate.execute(sqlBuilder.toString());
               
//     //         }
//     //     } catch (DataAccessException e) {
            
//     //         throw new IOException("Failed to create table: " + e.getMessage(), e);
//     //     }

//     //     // Prepare column names for insertion
//     //     String colsJoined = Arrays.stream(headers)
//     //             .map(h -> h.trim())
//     //             .filter(h -> !h.isEmpty())
//     //             .map(h -> "[" + h.replaceAll("\\s+", "_") + "]")
//     //             .collect(Collectors.joining(","));

//     //     if (colsJoined.isEmpty()) {
            
//     //     }

//     //     // Insert rows
//     //     SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
//     //     for (String[] vals : rows) {
//     //         try {
//     //             StringJoiner valuesJoiner = new StringJoiner(",", "(", ")");
//     //             for (int i = 0; i < vals.length && i < headers.length; i++) {
//     //                 String colName = headers[i].trim().replaceAll("\\s+", "_");
//     //                 if (colName.isEmpty()) {
//     //                     valuesJoiner.add("''");
//     //                     continue;
//     //                 }
//     //                 String value = vals[i].trim();
//     //                 if ("Trade_Date".equalsIgnoreCase(colName) && !value.isEmpty()) {
//     //                     try {
//     //                         if (value.matches("\\d+(\\.\\d+)?")) {
//     //                             double serial = Double.parseDouble(value);
//     //                             Date javaDate = DateUtil.getJavaDate(serial);
//     //                             value = outputFormat.format(javaDate);
//     //                         } else if (value.matches("\\d{2}/\\d{2}/\\d{4}")) {
//     //                             Date parsed = new SimpleDateFormat("dd/MM/yyyy").parse(value);
//     //                             value = outputFormat.format(parsed);
//     //                         } else if (value.matches("\\d{2}-\\d{2}-\\d{4} \\d{2}:\\d{2} [APap][Mm]")) {
//     //                             Date parsed = new SimpleDateFormat("dd-MM-yyyy hh:mm a").parse(value);
//     //                             value = outputFormat.format(parsed);
//     //                         } else if (value.matches("\\d{2}-\\d{2}-\\d{4}")) {
//     //                             Date parsed = new SimpleDateFormat("dd-MM-yyyy").parse(value);
//     //                             value = outputFormat.format(parsed);
//     //                         } else if (value.matches("\\d{4}-\\d{2}-\\d{2}")) {
//     //                             // Already in correct format
//     //                         } else {
//     //                             Date parsed = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").parse(value);
//     //                             value = outputFormat.format(parsed);
//     //                         }
//     //                     } catch (ParseException pe) {
                            
//     //                         value = "";
//     //                     }
//     //                 }
//     //                 valuesJoiner.add("'" + value.replace("'", "''") + "'");
//     //             }

//     //             String insertSQL = "INSERT INTO [" + tableName + "] (" + colsJoined + ") VALUES " + valuesJoiner;
//     //             portfolioJdbcTemplate.execute(insertSQL);
//     //         } catch (DataAccessException e) {
                
               
//     //         }
//     //     }

//     //     return tableName;
//     // }  

// // private void saveToCSV(Path filePath, List<Map<String, Object>> data) throws IOException {
// // //    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
// //     try (BufferedWriter writer = Files.newBufferedWriter(filePath)) {
// //         // ... (headers)
// //     	 if (data.isEmpty()) return;
// //     	   Set<String> headers = new LinkedHashSet<>(data.get(0).keySet());
// // 	       writer.write(String.join(",", headers));
// // 	       writer.newLine();
	       
// //            // Writing data rows
// //            for (Map<String, Object> row : data) {
// //                List<String> rowData = new ArrayList<>();
// //                for (String header : headers) {
// //                    rowData.add(row.get(header).toString());
// //                }
// //                writer.write(String.join(",", rowData));
// //                writer.newLine();
// //            }
           
// //     }
// // }
// //  New Code 
//     private void saveToCSV(Path filePath, List<Map<String, Object>> data) throws IOException {
// //      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//       try (BufferedWriter writer = Files.newBufferedWriter(filePath)) {
//           // ... (headers)
//       	 if (data.isEmpty()) return;
//       	   Set<String> headers = new LinkedHashSet<>(data.get(0).keySet());
// 	      	 headers.remove("Trade_Time");
// 	         headers.remove("Julian_Date");
// 	         headers.remove("Trade_Id");
//   	       writer.write(String.join(",", headers));
//   	       writer.newLine();
  	       
//              // Writing data rows
//              for (Map<String, Object> row : data) {
//                  List<String> rowData = new ArrayList<>();
//                  for (String header : headers) {
//                      rowData.add(row.get(header).toString());
//                  }
//                  writer.write(String.join(",", rowData));
//                  writer.newLine();
//              }          
//       }
//   }

// // End code 

//     private Object getCellValue(Cell cell) {
//         switch (cell.getCellType()) {
//             case STRING:  return cell.getStringCellValue();
//             case NUMERIC: return cell.getNumericCellValue();
//             case BOOLEAN: return cell.getBooleanCellValue();
//             default:      return "";
//         }
//     }
    

// //		private Object getCellValue(Cell cell) {
// //		    if (cell == null) return "";
// //		
// //		    if (cell.getCellType() == CellType.NUMERIC) {
// //		        if (DateUtil.isCellDateFormatted(cell)) {
// //		            // Convert Excel serial to Java Date, then format
// //		            //Date date = cell.getDateCellValue();
// //		           // return new SimpleDateFormat("dd-MM-yyyy").format(date);
// //		            //return new SimpleDateFormat("yyyy-MM-dd").format(date);
// //		            return cell.getDateCellValue();
// //		        } else {
// //		            return cell.getNumericCellValue();
// //		        }
// //		    }
// //		    else if (cell.getCellType() == CellType.STRING) {
// //		        return cell.getStringCellValue();
// //		    }
// //		    else if (cell.getCellType() == CellType.BOOLEAN) {
// //		        return cell.getBooleanCellValue();
// //		    }
// //		    else {
// //		        return "";
// //		    }
// //		}
   
    
//     public Map<String, Object> processFile(String mappedFilePath, String platform, String uploadId, int userId, boolean isCorporate, boolean isSaveData) {
//         Map<String, Object> result = new HashMap<>();
//         try {
// //            ProcessBuilder processBuilder = new ProcessBuilder("python", "src/main/resources/Portfolio/process_file.py", mappedFilePath, platform);
//         	ProcessBuilder processBuilder = new ProcessBuilder("python3", "/app/PythonScript/Portfolio/process_file.py", mappedFilePath, platform);
//             processBuilder.redirectErrorStream(true);
//             Process process = processBuilder.start();

//             BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//             StringBuilder output = new StringBuilder();
//             String line;
//             while ((line = reader.readLine()) != null) {
//                 System.out.println("Python Output: " + line);
//                 output.append(line);
//             }

//             if (process.waitFor() == 0) {
//                 ObjectMapper objectMapper = new ObjectMapper();
//                 result = objectMapper.readValue(output.toString(), new TypeReference<Map<String, Object>>() {});
//                 processingResultMap.put(uploadId, result);

//                 //  Save results in CMDA_portf_Result database
//                 saveResultToResultDb(result, platform, userId, isCorporate,isSaveData);
//             } else {
//                 result.put("error", "Python script failed.");
//             }

//         } catch (IOException | InterruptedException e) {
//             result.put("error", "File processing failed: " + e.getMessage());
//         }
//         return result;
//     }


//     @SuppressWarnings("unchecked")
//     private void saveResultToResultDb(Map<String, Object> resultData,
//                                       String platform,
//                                       int userId,
//                                       boolean isCorporate,
//                                       boolean isSaveData) {

//         // 1) extract the two lists
//         List<Map<String, Object>> portfolioResults =
//             (List<Map<String, Object>>) resultData.get("portfolio_results");
//         List<Map<String, Object>> transactions =
//             (List<Map<String, Object>>) resultData.get("transactions");

// //        // 2) build table names
//         String prefix = isCorporate ? "Corporate" : "user";
//         String sanitizedPlatform = platform.replaceAll("\\s+", "");
//         String portTbl = prefix + userId +"_"+ sanitizedPlatform + "_portfolio_results";
//         String txnTbl  = prefix + userId +"_"+ sanitizedPlatform + "_transcation";
// //

//         // 3) handle each table
//         if(isSaveData) {
// 	        createAndPopulate(portfolioResults, portTbl);
// 	        createAndPopulate(transactions, txnTbl);
//         }else {
//         	createAndPopulateTemp(portfolioResults, portTbl);
//         	createAndPopulateTemp(transactions, txnTbl);
//         }
//     }
    
//     private void createAndPopulate(List<Map<String, Object>> rows, String tableName) {
//         if (rows == null || rows.isEmpty()) return;
//         String safeTbl = "[" + tableName + "]";

//         try {
//             // Define expected data types for known columns
//             Map<String, String> columnTypes = Map.ofEntries(
//                 Map.entry("Date", "DATE"),
//                 Map.entry("Trade_Date", "DATE"),
//                 Map.entry("Scrip", "VARCHAR(150)"),
//                 Map.entry("Symbol", "VARCHAR(50)"),
//                 Map.entry("Remaining_Qty", "FLOAT"),
//                 Map.entry("Deployed_Amount", "FLOAT"),
//                 Map.entry("Market_Value", "FLOAT"),
//                 Map.entry("Unrealized_%_Return", "FLOAT"),
//                 Map.entry("Unrealized_PNL", "FLOAT"),
//                 Map.entry("Realized_PNL", "FLOAT"),
//                 Map.entry("Brokerage_Amount", "FLOAT"),
//                 Map.entry("Invested_Amount", "FLOAT"),
//                 Map.entry("Turn_Over_Amount", "FLOAT"),
//                 Map.entry("Exchange", "VARCHAR(100)"),
//                 Map.entry("Scrip_Name", "VARCHAR(150)"),
//                 Map.entry("Order_Type", "VARCHAR(50)"),
//                 Map.entry("Qty", "FLOAT"),
//                 Map.entry("Mkt_Price", "FLOAT"),
//                 Map.entry("Brok_Amt", "FLOAT"),
//                 Map.entry("Aggregated_Taxes", "FLOAT"),
//                 Map.entry("CustomQty", "FLOAT"),
//                 Map.entry("CumulativeQty", "FLOAT")
//             );

//             // Extract columns
//             Set<String> keys = rows.get(0).keySet();
//             StringBuilder ddl = new StringBuilder();

//             // CREATE TABLE if not exists
//             ddl.append("IF NOT EXISTS (SELECT * FROM sys.tables WHERE name='")
//                .append(tableName).append("')\n")
//                .append("  CREATE TABLE ").append(safeTbl).append(" (\n")
//                .append("    id INT IDENTITY(1,1) PRIMARY KEY");

//             for (String k : keys) {
//                 String col = k.replaceAll("\\s+", "_");
//                 String sqlType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");
//                 ddl.append(",\n    [").append(col).append("] ").append(sqlType);
//             }

 
//             ddl.append("\n);\n");

//             // ALTER TABLE to add any missing columns
//             for (String k : keys) {
//                 String col = k.replaceAll("\\s+", "_");
//                 String sqlType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");
//                 ddl.append("IF EXISTS (SELECT * FROM sys.tables WHERE name='")
//                    .append(tableName).append("')\n")
//                    .append("  AND NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS\n")
//                    .append("                   WHERE TABLE_NAME='").append(tableName)
//                    .append("' AND COLUMN_NAME='").append(col).append("')\n")
//                    .append("    ALTER TABLE ").append(safeTbl)
//                    .append(" ADD [").append(col).append("] ").append(sqlType).append(";\n");
//             }

           
//             resultJdbcTemplate.execute(ddl.toString());

//             for (Map<String, Object> row : rows) {
//                 try {
//                     List<String> cols = new ArrayList<>();
//                     List<String> vals = new ArrayList<>();
                   

//                     for (String k : keys) {
//                         String col = k.replaceAll("\\s+", "_");
//                         cols.add("[" + col + "]");

//                         Object val = row.get(k);
//                         String cleanedVal;

//                         if (val == null) {
//                             vals.add("NULL");
                           
//                             continue;
//                         }

//                         String expectedType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");

//                         if (expectedType.equals("DATE")) {
//                             try {
//                                 String value = val.toString().trim();

//                                 if (value.matches("\\d+(\\.0+)?")) {
//                                     double serial = Double.parseDouble(value);
//                                     java.util.Date javaDate = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(serial);
//                                     cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(javaDate);
//                                 } else if (value.matches("\\d{2}/\\d{2}/\\d{4}")) {
//                                     java.util.Date parsedDate = new SimpleDateFormat("dd/MM/yyyy").parse(value);
//                                     cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(parsedDate);
//                                 } else if (value.matches("\\d{2}-\\d{2}-\\d{4}")) {
//                                     java.util.Date parsedDate = new SimpleDateFormat("dd-MM-yyyy").parse(value);
//                                     cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(parsedDate);
//                                 } else {
//                                     cleanedVal = value;
//                                 }

//                                 vals.add("'" + cleanedVal + "'");
//                             } catch (Exception e) {
//                                 cleanedVal = val.toString().replace("'", "''");
//                                 vals.add("'" + cleanedVal + "'");
//                             }
//                         } else if (expectedType.startsWith("FLOAT") || expectedType.startsWith("INT")) {
//                             cleanedVal = val.toString().replace(",", "");
//                             vals.add(cleanedVal);
//                         } else {
//                             cleanedVal = val.toString().replace("'", "''");
//                             vals.add("'" + cleanedVal + "'");
//                         }
//                     }

//                     String insert = "INSERT INTO " + safeTbl +
//                                     " (" + String.join(", ", cols) + ") VALUES (" + String.join(", ", vals) + ")";
//                     resultJdbcTemplate.execute(insert);
//                 } catch (Exception e) {
//                     e.printStackTrace(); // or log the error
//                 }
//             }
//         } catch (Exception ex) {
//             ex.printStackTrace(); // or log the outer error
//         }
//     }
    
// //  this function is created for temp storage
//  private void createAndPopulateTemp(List<Map<String, Object>> rows, String baseTableName) {
//      if (rows == null || rows.isEmpty()) return;

//      String tempTableName = "Temp_" + baseTableName;
//      System.out.println(tempTableName);

//      Map<String, String> columnTypes = Map.ofEntries(
//          Map.entry("Date", "DATE"),
//          Map.entry("Trade_Date", "DATE"),
//          Map.entry("Scrip", "VARCHAR(150)"),
//          Map.entry("Symbol", "VARCHAR(50)"),
//          Map.entry("Remaining_Qty", "FLOAT"),
//          Map.entry("Deployed_Amount", "FLOAT"),
//          Map.entry("Market_Value", "FLOAT"),
//          Map.entry("Unrealized_%_Return", "FLOAT"),
//          Map.entry("Unrealized_PNL", "FLOAT"),
//          Map.entry("Realized_PNL", "FLOAT"),
//          Map.entry("Brokerage_Amount", "FLOAT"),
//          Map.entry("Invested_Amount", "FLOAT"),
//          Map.entry("Turn_Over_Amount", "FLOAT"),
//          Map.entry("Exchange", "VARCHAR(100)"),
//          Map.entry("Scrip_Name", "VARCHAR(150)"),
//          Map.entry("Order_Type", "VARCHAR(50)"),
//          Map.entry("Qty", "FLOAT"),
//          Map.entry("Mkt_Price", "FLOAT"),
//          Map.entry("Brok_Amt", "FLOAT"),
//          Map.entry("Aggregated_Taxes", "FLOAT"),
//          Map.entry("CustomQty", "FLOAT"),
//          Map.entry("CumulativeQty", "FLOAT"),
//          Map.entry("RowHash", "INT")
//      );

//      Set<String> keys = rows.get(0).keySet();
//      StringBuilder ddl = new StringBuilder();

//      try {
//          ddl.append("IF OBJECT_ID('tempdb..").append(tempTableName).append("') IS NOT NULL DROP TABLE ").append(tempTableName).append(";\n");

//          ddl.append("CREATE TABLE ").append(tempTableName).append(" (\n")
//              .append("    id INT IDENTITY(1,1) PRIMARY KEY");

//          for (String k : keys) {
//              String col = k.replaceAll("\\s+", "_");
//              String sqlType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");
//              ddl.append(",\n    [").append(col).append("] ").append(sqlType);
//          }

//          ddl.append(",\n [RowHash] INT");
//          ddl.append("\n);\n");

//          // Execute CREATE TABLE
//          resultJdbcTemplate.execute(ddl.toString());
//      } catch (Exception e) {
//          System.err.println("Error creating temp table: " + e.getMessage());
//          e.printStackTrace();
//          return;
//      }

//      for (Map<String, Object> row : rows) {
//          try {
//              List<String> cols = new ArrayList<>();
//              List<String> vals = new ArrayList<>();
//              StringBuilder hashSource = new StringBuilder();

//              for (String k : keys) {
//                  String col = k.replaceAll("\\s+", "_");
//                  cols.add("[" + col + "]");
//                  Object val = row.get(k);
//                  String cleanedVal;

//                  if (val == null) {
//                      vals.add("NULL");
//                      hashSource.append("null|");
//                      continue;
//                  }

//                  String expectedType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");

//                  try {
//                      if (expectedType.equals("DATE")) {
//                          String value = val.toString().trim();
//                          if (value.matches("\\d+(\\.0+)?")) {
//                              double serial = Double.parseDouble(value);
//                              java.util.Date javaDate = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(serial);
//                              cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(javaDate);
//                          } else if (value.matches("\\d{2}/\\d{2}/\\d{4}")) {
//                              java.util.Date parsedDate = new SimpleDateFormat("dd/MM/yyyy").parse(value);
//                              cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(parsedDate);
//                          } else if (value.matches("\\d{2}-\\d{2}-\\d{4}")) {
//                              java.util.Date parsedDate = new SimpleDateFormat("dd-MM-yyyy").parse(value);
//                              cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(parsedDate);
//                          } else {
//                              cleanedVal = value;
//                          }
//                          vals.add("'" + cleanedVal + "'");
//                      } else if (expectedType.startsWith("FLOAT") || expectedType.startsWith("INT")) {
//                          cleanedVal = val.toString().replace(",", "");
//                          vals.add(cleanedVal);
//                      } else {
//                          cleanedVal = val.toString().replace("'", "''");
//                          vals.add("'" + cleanedVal + "'");
//                      }
//                      hashSource.append(cleanedVal).append("|");
//                  } catch (Exception e) {
//                      cleanedVal = val.toString().replace("'", "''");
//                      vals.add("'" + cleanedVal + "'");
//                      hashSource.append(cleanedVal).append("|");
//                  }
//              }

//              int rowHash = hashSource.toString().hashCode();
//              cols.add("[RowHash]");
//              vals.add(String.valueOf(rowHash));

//              String insert = "INSERT INTO " + tempTableName + " (" +
//                              String.join(", ", cols) + ") VALUES (" +
//                              String.join(", ", vals) + ")";
//              resultJdbcTemplate.execute(insert);
//          } catch (Exception e) {
//              System.err.println("Error inserting row into temp table: " + e.getMessage());
//              e.printStackTrace();
//          }
//      }
//  }
  

    
//     public List<Map<String, Object>> getPortfolioResults(String tableName) {
//         String query = "SELECT * FROM " + tableName;
//         return resultJdbcTemplate.queryForList(query);
//     }
    
//     public Map<String, Object> getResultsByUploadId(String uploadId) {
//         Map<String, Object> result = new HashMap<>();
//         try {
//             // 1. Find user upload record
//         	UserPortfolioUploads uploads = userPortfolioUploadRepository.findByUploadId(uploadId)
// 	                .orElseThrow(() -> new RuntimeException("Upload not found with ID: " + uploadId));

// 	        String portfolioTableName = uploads.getPortfolioTableName();

	       
// 	        String prefix = uploads.getUserType().equalsIgnoreCase("corporate") ? "Corporate" : "user";
// 	        String sanitizedPlatform = uploads.getPlatform().replaceAll("\\s+", "");
// 	        String baseTableName = prefix + uploads.getUserID() + "_" + sanitizedPlatform;

// 	        String resultTableName = baseTableName + "_portfolio_results";
// 	        String transactionTableName = baseTableName + "_transcation";

// 			if (portfolioTableName.contains("Temp")) {
// 				resultTableName = "Temp_" + baseTableName + "_portfolio_results";
// 				transactionTableName = "Temp_" + baseTableName + "_transcation";
// 			}
// 			if("Sample_AxisBank_portf".equals(portfolioTableName)) {
// 				resultTableName = "Sample_AxisBank_portfolio_results";
// 				transactionTableName = "Sample_AxisBank_transcation";
// 	        }       

//             // 2. Fetch data from tables
// 			// 1. Get all results
// 			List<Map<String, Object>> portfolioResults = resultJdbcTemplate.queryForList("SELECT * FROM [" + resultTableName + "]");

// 			// 2. Find latest valid date
// 			Optional<String> maxDateOpt = portfolioResults.stream()
// 			    .map(row -> row.get("Date"))
// 			    .filter(Objects::nonNull)
// 			    .filter(val -> val instanceof java.util.Date || val instanceof java.sql.Timestamp || val instanceof String)
// 			    .map(val -> {
// 			        if (val instanceof String str) return str;
// 			        else if (val instanceof java.util.Date dt) return new SimpleDateFormat("yyyy-MM-dd").format(dt);
// 			        else return null;
// 			    })
// 			    .filter(Objects::nonNull)
// 			    .max(String::compareTo);

// 			// 3. Filter by max date and remaining qty > 0
// 			if (maxDateOpt.isPresent()) {
// 			    String maxDate = maxDateOpt.get();
// 			    portfolioResults = portfolioResults.stream()
// 			        .filter(row -> {
// 			            Object dateObj = row.get("Date");
// 			            String rowDate = (dateObj instanceof java.util.Date || dateObj instanceof java.sql.Timestamp)
// 			                    ? new SimpleDateFormat("yyyy-MM-dd").format(dateObj)
// 			                    : String.valueOf(dateObj);
// 			            Object remainingQtyObj = row.get("Remaining_Qty");
// 			            double qty = 0.0;
// 			            try {
// 			                qty = Double.parseDouble(String.valueOf(remainingQtyObj));
// 			            } catch (Exception e) {
// 			                // Ignore parse error
// 			            }
// 			            return maxDate.equals(rowDate) && qty > 0.0;
// 			        })
// 			        .collect(Collectors.toList());
// 			} else {
// 			    portfolioResults = List.of(); // No valid dates
// 			}


//             List<Map<String, Object>> transactions = resultJdbcTemplate.queryForList("SELECT * FROM [" + transactionTableName + "]");

//             SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

//             // Format date fields for portfolioResults
//             portfolioResults.forEach(row -> {
//                 Object dateVal = row.get("Date");
//                 if (dateVal instanceof java.sql.Timestamp || dateVal instanceof java.util.Date) {
//                     row.put("Date", sdf.format(dateVal));
//                 }

//                 Object tradeDate = row.get("Trade_Date");
//                 if (tradeDate instanceof java.sql.Timestamp || tradeDate instanceof java.util.Date) {
//                     row.put("Trade_Date", sdf.format(tradeDate));
//                 }
//             });

//             // Format date fields for transactions (optional if needed)
//             transactions.forEach(row -> {
//                 Object tradeDate = row.get("Trade_Date");
//                 if (tradeDate instanceof java.sql.Timestamp || tradeDate instanceof java.util.Date) {
//                     row.put("Trade_Date", sdf.format(tradeDate));
//                 }
//             });
            
            
//             result.put("portfolio_results", portfolioResults);
//             result.put("transactions", transactions);
//         } catch (Exception e) {
//             result.put("error", "Failed to fetch results: " + e.getMessage());
//         }
//         return result;
//     }


//     // Retrieve the mapped file path based on uploadId
//     public String getMappedFilePath(String uploadId) {
//         return filePathMap.get(uploadId);
//     }
    
//     public void deleteTemporaryTables(int userId, String platform, boolean isCorporate) {
//         String tablePrefix = isCorporate ? "Corporate" : "user";
//         String sanitizedPlatform = platform.replaceAll("\\s+", "");

//         String portfTable = tablePrefix + userId + "_" + sanitizedPlatform + "_portf";
//         String resultTable = tablePrefix + userId + "_portfolio_results";
//         String transTable = tablePrefix + userId + "_transcation";

//         try {
//             portfolioJdbcTemplate.execute("DROP TABLE IF EXISTS [" + portfTable + "]");
//             resultJdbcTemplate.execute("DROP TABLE IF EXISTS [" + resultTable + "]");
//             resultJdbcTemplate.execute("DROP TABLE IF EXISTS [" + transTable + "]");

//             System.out.println("Temporary tables dropped for user " + userId);
//         } catch (Exception e) {
//             System.err.println("Error while deleting temp tables: " + e.getMessage());
//         }
//     }
    
//     public Map<String, Object> getInsightsDataFromDb(String uploadId) throws JsonProcessingException {
//         // 1) Find upload row
//         UserPortfolioUploads up = userPortfolioUploadRepository
//             .findByUploadId(uploadId)
//             .orElseThrow(() -> new NoSuchElementException("No saved upload " + uploadId));
//         String tablename = up.getPortfolioTableName();
//         // 2) Build table names
//         // String prefix = up.getUserType().equals("corporate") ? "Corporate" : "user";
//         // String platform = up.getPlatform().replaceAll("\\s+", "");
//         // String portTbl = prefix + up.getUserID() + "_" + platform + "_portfolio_results";
//         // String txnTbl  = prefix + up.getUserID() + "_" + platform + "_transcation";
        
//         // 2) Build table names
//         String prefix = up.getUserType().equals("corporate") ? "Corporate" : "user";
//         String platform = up.getPlatform().replaceAll("\\s+", "");
//         String baseTableName = prefix + up.getUserID() + "_" + platform;
//         String portTbl = baseTableName + "_portfolio_results";
//         String txnTbl = baseTableName + "_transcation";

//         if (tablename.contains("Temp")) {
//             portTbl = "Temp_" + baseTableName + "_portfolio_results";
//             txnTbl = "Temp_" + baseTableName + "_transcation";
//         }


//         if("Sample_AxisBank_portf".equals(tablename)) {
//         	portTbl = "Sample_AxisBank_portfolio_results";
//         	txnTbl  = "Sample_AxisBank_transcation";
//         }

//         // 3) Query both tables
//         List<Map<String, Object>> portData = resultJdbcTemplate.queryForList("SELECT * FROM [" + portTbl + "]");
//         List<Map<String, Object>> txnData  = resultJdbcTemplate.queryForList("SELECT * FROM [" + txnTbl  + "]");

//         // 4) Convert to JSON
//         String results1Json = objectMapper.writeValueAsString(portData);
//         String results2Json = objectMapper.writeValueAsString(txnData);

//         // 5) Call insights generator
//         return getLatestPortfolioInsights(results1Json);
//     }

//     public Map<String, Object> getLatestPortfolioInsights(String latestData) {
//         Map<String, Object> result = new HashMap<>();
//         try {
//             File latestDataFile = File.createTempFile("latest_data", ".json");
//             File transactionFile = File.createTempFile("transaction_data", ".json");
//             try (BufferedWriter writer = new BufferedWriter(new FileWriter(latestDataFile))) {
//                 writer.write(latestData);
//             }

// //            ProcessBuilder processBuilder = new ProcessBuilder("python", 
// //                    "src/main/resources/Portfolio/PortfolioInsights.py", 
//   	      ProcessBuilder processBuilder = new ProcessBuilder("python3", 
//                   "/app/PythonScript/Portfolio/PortfolioInsights.py", 
//                     latestDataFile.getAbsolutePath()); 
// //                    transactionFile.getAbsolutePath());
//             processBuilder.redirectErrorStream(true);
//             Process process = processBuilder.start();
//             BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//             StringBuilder output = new StringBuilder();
//             String line;
//             while ((line = reader.readLine()) != null) {
//             	 System.out.println("Python Output: " + line);
//                 output.append(line);
//             }
//             int exitCode = process.waitFor();
//             if (exitCode == 0) {
//                 ObjectMapper objectMapper = new ObjectMapper();
//                 result = objectMapper.readValue(output.toString(), Map.class);
//             } else {
//                 result.put("error", "Python script failed.");
//             }
//             latestDataFile.delete();
//             transactionFile.delete();
//         } catch (IOException | InterruptedException e) {
//             result.put("error", "Error executing Python script: " + e.getMessage());
//         }
//         return result;
//     }
    
//     public Map<String, Object> ShortNseFileFromTable(String tableName) {
//         try {
//             // 1. Fetch data
//             List<Map<String, Object>> tableData = portfolioJdbcTemplate.queryForList("SELECT * FROM [" + tableName + "]");
//             String jsonData = objectMapper.writeValueAsString(tableData);

//             // 2. Write JSON to a temporary file
//             Path tempJsonFile = Files.createTempFile("short_nse_data_", ".json");
//             Files.writeString(tempJsonFile, jsonData);

//             // 3. Call the Python script with the temp file path
// //            ProcessBuilder pb = new ProcessBuilder("python", "src/main/resources/Portfolio/ShortNseTable.py", tempJsonFile.toString());
//             ProcessBuilder pb = new ProcessBuilder("python3", "/app/PythonScript/Portfolio/ShortNseTable.py", tempJsonFile.toString());
//             pb.redirectErrorStream(true);

//             Process process = pb.start();
//             BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//             StringBuilder output = new StringBuilder();
//             String line;
//             while ((line = reader.readLine()) != null) {
//                 System.out.println("Python Output: " + line);
//                 output.append(line);
//             }

//             int exitCode = process.waitFor();

//             // Clean up
//             Files.deleteIfExists(tempJsonFile);

//             if (exitCode == 0) {
//                 return objectMapper.readValue(output.toString(), new TypeReference<>() {});
//             } else {
//                 return Map.of("error", "Python script failed.");
//             }

//         } catch (Exception e) {
//             return Map.of("error", "Failed to process table: " + e.getMessage());
//         }
//     }

    
// public Map<String, Object> generatePortfBuild() {
//     Map<String, Object> result = new HashMap<>();
//     try {
// //        ProcessBuilder processBuilder = new ProcessBuilder(
// //            "python", "src/main/resources/Portfolio/OwnPortfolio.py"
// //        );
//         ProcessBuilder processBuilder = new ProcessBuilder(
//                 "python3", "/app/PythonScript/Portfolio/OwnPortfolio.py"
//             );
//         processBuilder.redirectErrorStream(true);
//         Process process = processBuilder.start();

//         BufferedReader reader = new BufferedReader(
//             new InputStreamReader(process.getInputStream())
//         );
//         StringBuilder output = new StringBuilder();
//         String line;
//         while ((line = reader.readLine()) != null) {
//             System.out.println("Python Output: " + line);
//             output.append(line);
//         }

//         int exitCode = process.waitFor();
//         if (exitCode != 0) {
//             result.put("error", "Python process exited with code " + exitCode);
//             return result;
//         }

//         ObjectMapper objectMapper = new ObjectMapper();
//         // Safe parse with error reporting
//         try {
//             result = objectMapper.readValue(output.toString(), Map.class);
//         } catch (com.fasterxml.jackson.core.JsonParseException e) {
//             result.put("error", "Invalid JSON from Python: " + e.getMessage());
//         }

//     } catch (IOException | InterruptedException e) {
//         result.put("error", "Graph generation failed: " + e.getMessage());
//     }
//     return result;
// }

//     public Map<String, Object> generateGraphs(String results1Json, String results2Json, String graphType) {
//         Map<String, Object> result = new HashMap<>();
//         try {
//             Path tempFile1 = Files.createTempFile("results1", ".json");
//             Path tempFile2 = Files.createTempFile("results2", ".json");    
//             ObjectMapper objectMapper = new ObjectMapper();
//             Files.write(tempFile1, objectMapper.writeValueAsBytes(results1Json), StandardOpenOption.WRITE);
//             Files.write(tempFile2, objectMapper.writeValueAsBytes(results2Json), StandardOpenOption.WRITE);
//             ProcessBuilder processBuilder = new ProcessBuilder(
// //                "python", "src/main/resources/Portfolio/portfolio_visualizations.py",
//             	"python3", "/app/PythonScript/Portfolio/portfolio_visualizations.py",
//                 tempFile1.toString(), tempFile2.toString(), graphType);
//             processBuilder.redirectErrorStream(true);
//             Process process = processBuilder.start();
//             BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//             StringBuilder output = new StringBuilder();
//             String line;
//             while ((line = reader.readLine()) != null) {
//             	System.out.println("Python Output: " + line);
//                 output.append(line);
//             }
//             process.waitFor();
//             ObjectMapper objectMapper1 = new ObjectMapper();
//             result = objectMapper1.readValue(output.toString(), Map.class);
//         } catch (IOException | InterruptedException e) {
//             result.put("error", "Graph generation failed: " + e.getMessage());
//         }
//         return result;
//     }

// //--------------Paper Trading added by Shreya

//     // Create a new empty portfolio (new table)
//     public Map<String, Object> createNewPortfolio(int userId, boolean isCorporate) {
//         try {
//             String prefix = isCorporate ? "Corporate" : "user";

//             // Find existing portfolios
//             String tablePattern = prefix + userId + "_Own_%_portf";
//             String checkTablesSql = "SELECT table_name FROM information_schema.tables WHERE table_name LIKE ?";
//             List<String> tableNames = ownPortfJdbcTemplate.query(checkTablesSql, (rs, rowNum) -> rs.getString("table_name"), tablePattern);

//             // Find max series number
//             int maxSeries = 0;
//             for (String tableName : tableNames) {
//                 int startIndex = tableName.indexOf("_Own_") + 5;
//                 int endIndex = tableName.lastIndexOf("_portf");
//                 if (startIndex > 0 && endIndex > startIndex) {
//                     try {
//                         int series = Integer.parseInt(tableName.substring(startIndex, endIndex));
//                         maxSeries = Math.max(maxSeries, series);
//                     } catch (NumberFormatException ignore) {}
//                 }
//             }

//             int nextSeries = maxSeries + 1;
//             String newTableName = prefix + userId + "_Own_" + nextSeries + "_portf";

//             // Define expected columns
//             List<String> expectedColumns = List.of("Symbol", "Date", "Time", "OrderType", "Qty",
//                                                   "Price", "MarketValue", "BrokerageAmount");
//             Map<String, String> dataTypes = Map.of(
//                 "Symbol", "VARCHAR(100)",
//                 "Date", "DATE",
//                 "Time", "VARCHAR(8)",
//                 "OrderType", "VARCHAR(1)",
//                 "Qty", "FLOAT",
//                 "Price", "FLOAT",
//                 "MarketValue", "FLOAT",
//                 "BrokerageAmount", "FLOAT"
//             );

//             // Build CREATE TABLE SQL
//             List<String> columns = new ArrayList<>();
//             for (String col : expectedColumns) {
//                 columns.add("[" + col + "] " + dataTypes.get(col));
//             }
//             String sql = "CREATE TABLE [" + newTableName + "] (" + String.join(", ", columns) + ")";
//             ownPortfJdbcTemplate.execute(sql);

//             logger.info("Created new portfolio table: {}", newTableName);

//             return Map.of(
//                 "status", "New portfolio created successfully",
//                 "portfolioName", String.valueOf(nextSeries),
//                 "tableName", newTableName,
//                 "series", nextSeries
//             );

//         } catch (Exception e) {
//             logger.error("Failed to create new portfolio: {}", e.getMessage(), e);
//             return Map.of("error", "Failed to create new portfolio: " + e.getMessage());
//         }
//     }

//     private Map<String, String> getPaperTradeMapping() {
//         Map<String, String> mapping = new HashMap<>();
//         mapping.put("Symbol", "Symbol");
//         mapping.put("Date", "Date");
//         mapping.put("Time", "Time");
//         mapping.put("OrderType", "OrderType");
//         mapping.put("Qty", "Qty");
//         mapping.put("Price", "Price");
//         mapping.put("MarketValue", "MarketValue");
//         mapping.put("BrokerageAmount", "BrokerageAmount");
//         return mapping;
//     }

//     // Process paper trade data from JSON
//     public Map<String, Object> processPaperTradeData(
//             List<Map<String, Object>> tradeData,
//             int userId,
//             boolean isCorporate,
//             String portfolioName) throws IOException {

//         logger.debug("Processing paper trade data for userId: {}, isCorporate: {}, portfolioName: {}", userId, isCorporate, portfolioName);

//         // Validate trade data
//         if (tradeData == null || tradeData.isEmpty()) {
//             logger.warn("No trade data provided");
//             return Map.of("error", "No trade data provided");
//         }

//         if (portfolioName == null || portfolioName.trim().isEmpty()) {
//             logger.warn("No portfolio name provided");
//             return Map.of("error", "No portfolio name provided");
//         }

//         // Sanitize portfolioName to avoid invalid table name characters
//         String sanitizedPortfolioName = portfolioName.replaceAll("[^a-zA-Z0-9_]", "");

//         // Define expected columns
//         List<String> expectedColumns = List.of("Symbol", "Date", "Time", "OrderType", "Qty",
//                                               "Price", "MarketValue", "BrokerageAmount");

//         // Validate each record
//         List<Map<String, Object>> validatedData = new ArrayList<>();
//         DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
//         DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
//         SimpleDateFormat sqlDateFormat = new SimpleDateFormat("yyyy-MM-dd");

//         for (int i = 0; i < tradeData.size(); i++) {
//             Map<String, Object> record = tradeData.get(i);
//             Map<String, Object> validatedRecord = new HashMap<>();

//             // Check for missing or invalid columns
//             for (String col : expectedColumns) {
//                 if (!record.containsKey(col) || record.get(col) == null || record.get(col).toString().trim().isEmpty()) {
//                     logger.warn("Missing or empty value for column {} in record {}", col, i);
//                     return Map.of("error", "Missing or empty value for column " + col + " in record " + (i + 1));
//                 }
//                 validatedRecord.put(col, record.get(col));
//             }

//             // Validate and format Date
//             String dateStr = record.get("Date").toString().trim();
//             try {
//                 LocalDate date = LocalDate.parse(dateStr, dateFormatter);
//                 validatedRecord.put("Date", sqlDateFormat.format(java.util.Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant())));
//             } catch (DateTimeParseException e) {
//                 logger.warn("Invalid Date format '{}' in record {}: {}", dateStr, i, e.getMessage());
//                 return Map.of("error", "Invalid Date format in record " + (i + 1) + ": " + dateStr);
//             }

//             // Validate Time
//             String timeStr = record.get("Time").toString().trim();
//             try {
//                 java.time.LocalTime.parse(timeStr, timeFormatter);
//                 validatedRecord.put("Time", timeStr);
//             } catch (DateTimeParseException e) {
//                 logger.warn("Invalid Time format '{}' in record {}: {}", timeStr, i, e.getMessage());
//                 return Map.of("error", "Invalid Time format in record " + (i + 1) + ": " + timeStr);
//             }

//             // Validate OrderType
//             String orderType = record.get("OrderType").toString().trim();
//             if (!orderType.equals("B") && !orderType.equals("S")) {
//                 logger.warn("Invalid OrderType '{}' in record {}", orderType, i);
//                 return Map.of("error", "Invalid OrderType in record " + (i + 1) + ": must be 'B' or 'S'");
//             }

//             // Validate numeric fields
//             try {
//                 Double.parseDouble(record.get("Qty").toString().trim());
//                 Double.parseDouble(record.get("Price").toString().trim());
//                 Double.parseDouble(record.get("MarketValue").toString().trim());
//                 Double.parseDouble(record.get("BrokerageAmount").toString().trim());
//             } catch (NumberFormatException e) {
//                 logger.warn("Invalid numeric value in record {}: {}", i, e.getMessage());
//                 return Map.of("error", "Invalid numeric value in record " + (i + 1));
//             }

//             validatedData.add(validatedRecord);
//         }

//         // Table name with portfolio name
//         String prefix = isCorporate ? "Corporate" : "user";
//         String tableName = prefix + userId + "_Own_" + sanitizedPortfolioName + "_portf";

//         // Define column types
//         Map<String, String> dataTypes = Map.of(
//             "Symbol", "VARCHAR(100)",
//             "Date", "DATE",
//             "Time", "VARCHAR(8)",
//             "OrderType", "VARCHAR(1)",
//             "Qty", "FLOAT",
//             "Price", "FLOAT",
//             "MarketValue", "FLOAT",
//             "BrokerageAmount", "FLOAT"
//         );

//         // Create table if not exists
//         try {
//             String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//             Integer count = ownPortfJdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);
//             if (count == null || count == 0) {
//                 List<String> columns = new ArrayList<>();
//                 for (String col : expectedColumns) {
//                     String type = dataTypes.get(col);
//                     columns.add("[" + col + "] " + type);
//                 }
//                 String sql = "CREATE TABLE [" + tableName + "] (" + String.join(", ", columns) + ")";
//                 ownPortfJdbcTemplate.execute(sql);
//                 logger.info("Created table: {}", tableName);
//             }
//         } catch (BadSqlGrammarException e) {
//             logger.error("Failed to create table '{}': {}", tableName, e.getMessage(), e);
//             throw new IOException("Failed to create table: " + e.getMessage(), e);
//         }

//         // Insert data (append to existing table)
//         String colsJoined = String.join(",", expectedColumns.stream().map(col -> "[" + col + "]").toList());
//         for (Map<String, Object> record : validatedData) {
//             try {
//                 StringJoiner valuesJoiner = new StringJoiner(",", "(", ")");
//                 for (String col : expectedColumns) {
//                     Object value = record.get(col);
//                     String columnType = dataTypes.get(col);
//                     if (value == null) {
//                         valuesJoiner.add("NULL");
//                     } else if (columnType.startsWith("VARCHAR") || columnType.equals("DATE")) {
//                         String strValue = value.toString().replace("'", "''");
//                         valuesJoiner.add("'" + strValue + "'");
//                     } else {
//                         valuesJoiner.add(value.toString());
//                     }
//                 }

//                 String insertSQL = "INSERT INTO [" + tableName + "] (" + colsJoined + ") VALUES " + valuesJoiner;
//                 ownPortfJdbcTemplate.execute(insertSQL);
//             } catch (BadSqlGrammarException e) {
//                 logger.error("Error inserting record into {}: {}", tableName, e.getMessage(), e);
//                 throw new IOException("Failed to insert record: " + e.getMessage(), e);
//             }
//         }

//         return Map.of(
//             "status", "Paper trade data saved successfully",
//             "tableName", tableName,
//             "series", sanitizedPortfolioName
//         );
//     }

//     // List saved paper trading portfolios (multiple tables per user) with table contents
//     public List<Map<String, Object>> listPaperTradePortfolios(int userId, boolean isCorporate) {
//         String prefix = isCorporate ? "Corporate" : "user";
//         String tablePattern = prefix + userId + "_Own_%_portf";
//         String checkTablesSql = "SELECT table_name FROM information_schema.tables WHERE table_name LIKE ?";
//         List<String> tableNames = ownPortfJdbcTemplate.query(checkTablesSql, (rs, rowNum) -> rs.getString("table_name"), tablePattern);
//         List<Map<String, Object>> portfolios = new ArrayList<>();
//         for (String tableName : tableNames) {
//             Map<String, Object> portfolio = new HashMap<>();
//             portfolio.put("tableName", tableName);

//             // Extract series from tableName
//             int startIndex = tableName.indexOf("_Own_") + 5;
//             int endIndex = tableName.lastIndexOf("_portf");
//             String series = (startIndex > 4 && endIndex > startIndex) ? tableName.substring(startIndex, endIndex) : "unknown";
//             portfolio.put("platform", "Own_" + series);
//             // Fetch table contents
//             String selectSql = "SELECT * FROM [" + tableName + "]";
//             List<Map<String, Object>> tableData = ownPortfJdbcTemplate.queryForList(selectSql);
//             portfolio.put("data", tableData);
//             portfolios.add(portfolio);
//         }
//         return portfolios;
//     }

//     // Delete paper trading data (drop specific table)
//     public Map<String, Object> deletePaperTradeData(int userId, boolean isCorporate, String portfolioName) {
//         if (portfolioName == null || portfolioName.trim().isEmpty()) {
//             logger.warn("No portfolio name provided for deletion");
//             return Map.of("error", "No portfolio name provided");
//         }
//         // Sanitize portfolioName
//         String sanitizedPortfolioName = portfolioName.replaceAll("[^a-zA-Z0-9_]", "");

//         String prefix = isCorporate ? "Corporate" : "user";
//         String tableName = prefix + userId + "_Own_" + sanitizedPortfolioName + "_portf";
//         String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//         Integer count = ownPortfJdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);
//         if (count == null || count == 0) {
//             logger.warn("Table does not exist: {}", tableName);
//             return Map.of("status", "Table does not exist");
//         }
//         try {
//             String dropSql = "DROP TABLE [" + tableName + "]";
//             ownPortfJdbcTemplate.execute(dropSql);
//             logger.info("Dropped table: {}", tableName);
//             return Map.of("status", "Paper trade data deleted successfully");
//         } catch (BadSqlGrammarException e) {
//             logger.error("Failed to drop table '{}': {}", tableName, e.getMessage(), e);
//             return Map.of("error", "Failed to delete paper trade data: " + e.getMessage());
//         }
//     }  
//     // ------------------- End Paper trading ------------------------ 
    

// }
    

    

// // -------------new code for temp table 
// // package com.example.prog.portfolio.serviceImpl;

// // import java.io.*;
// // import java.nio.charset.StandardCharsets;
// // import java.nio.file.Files;
// // import java.nio.file.Path;
// // import java.nio.file.StandardOpenOption;
// // import java.security.MessageDigest;
// // import java.security.NoSuchAlgorithmException;
// // import java.text.ParseException;
// // import java.text.SimpleDateFormat;
// // import java.time.LocalDate;
// // import java.time.LocalTime;
// // import java.time.ZoneId;
// // import java.time.ZonedDateTime;
// // import java.time.format.DateTimeFormatter;
// // import java.time.format.DateTimeFormatterBuilder;
// // import java.time.format.DateTimeParseException;
// // import java.util.*;
// // import java.util.concurrent.CompletableFuture;
// // import java.util.concurrent.ConcurrentHashMap;
// // import java.util.stream.Collectors;

// // import org.apache.commons.csv.CSVFormat;
// // import org.apache.commons.csv.CSVParser;
// // import org.apache.commons.csv.CSVRecord;
// // import org.apache.commons.io.input.BOMInputStream;
// // import org.apache.poi.ss.usermodel.*;
// // import org.slf4j.Logger;
// // import org.slf4j.LoggerFactory;
// // import org.springframework.beans.factory.annotation.Autowired;
// // import org.springframework.beans.factory.annotation.Qualifier;
// // import org.springframework.jdbc.core.JdbcTemplate;
// // import org.springframework.scheduling.annotation.Async;
// // import org.springframework.scheduling.annotation.Scheduled;
// // import org.springframework.stereotype.Service;
// // import org.springframework.web.client.RestTemplate;
// // import org.springframework.web.multipart.MultipartFile;

// // import com.example.prog.entity.UserDtls;
// // import com.example.prog.entity.portfolio.UserPortfolioUploads;
// // import com.example.prog.repository.UserRepository;
// // import com.example.prog.repository.portfolioRepo.UserPortfolioUploadRepository;
// // import com.example.prog.token.DuplicateFileUploadException;
// // import com.example.prog.repository.portfolioRepo.TradeFileRecordHashRepository;
// // import com.example.prog.entity.portfolio.TradeFileRecordHash;
// // import com.fasterxml.jackson.core.JsonProcessingException;
// // import com.fasterxml.jackson.core.type.TypeReference;
// // import com.fasterxml.jackson.databind.ObjectMapper;

// // import jakarta.transaction.Transactional;

// // import java.time.LocalDateTime;

// // @Service
// // public class FileProcessingService {

// //     @Autowired
// //     private ColumnMappingService columnMappingService;

// //     @Autowired
// //     private UserRepository userRepository;

// //     @Autowired
// //     @Qualifier("portfolioJdbcTemplate")
// //     private JdbcTemplate portfolioJdbcTemplate;

// //     @Autowired
// //     @Qualifier("resultJdbcTemplate")
// //     private JdbcTemplate resultJdbcTemplate;

// //     @Autowired
// //     private UserPortfolioUploadRepository userPortfolioUploadRepository;

// //     @Autowired
// //     private ObjectMapper objectMapper;

// //     @Autowired
// //     private TradeFileRecordHashRepository tradeFileRecordHashRepository;

// //     private final Map<String, String> filePathMap = new ConcurrentHashMap<>();
// //     private final Map<String, Map<String, Object>> processingResultMap = new ConcurrentHashMap<>();
// //     private static final Logger logger = LoggerFactory.getLogger(FileProcessingService.class);

// //     // Metadata table for tracking temporary tables
// //     private static final String TEMP_TABLE_METADATA = "TempTableMetadata";

// //     @PostConstruct
// //     public void initTempTableMetadata() {
// //         String createMetadataTable = "IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = '" + TEMP_TABLE_METADATA + "') " +
// //                 "CREATE TABLE " + TEMP_TABLE_METADATA + " (" +
// //                 "TableName NVARCHAR(128) PRIMARY KEY, " +
// //                 "CreatedAt DATETIME NOT NULL)";
// //         try {
// //             resultJdbcTemplate.execute(createMetadataTable);
// //             logger.info("TempTableMetadata table initialized.");
// //         } catch (Exception e) {
// //             logger.error("Failed to create TempTableMetadata table: {}", e.getMessage(), e);
// //         }
// //     }

// //     @Async("taskExecutor")
// //     public CompletableFuture<Map<String, Object>> performColumnMappingAsync(MultipartFile file, String platform, String uploadId, int userID, boolean isCorporate, Map<String, String> customMapping, boolean saveData) {
// //         System.out.println("Running performColumnMappingAsync in thread: " + Thread.currentThread().getName());
// //         try {
// //             return CompletableFuture.completedFuture(performColumnMapping(file, platform, uploadId, userID, isCorporate, customMapping, saveData));
// //         } catch (IOException e) {
// //             e.printStackTrace();
// //             return CompletableFuture.failedFuture(e);
// //         }
// //     }

// //     @Async("taskExecutor")
// //     public CompletableFuture<Map<String, Object>> processFileAsync(String mappedFilePath, String platform, String uploadId, int userID, boolean isCorporate, boolean saveData) {
// //         System.out.println("Running processFileAsync in thread: " + Thread.currentThread().getName());
// //         return CompletableFuture.completedFuture(processFile(mappedFilePath, platform, uploadId, userID, isCorporate, saveData));
// //     }

// //     @Async("taskExecutor")
// //     public CompletableFuture<String> createTableFromCsvAsync(Path csvPath, String platform, int userID, boolean isCorporate, List<Map<String, Object>> mappedData) {
// //         System.out.println("Running createTableFromCsvAsync in thread: " + Thread.currentThread().getName());
// //         try {
// //             return CompletableFuture.completedFuture(createTableFromCsv(csvPath, platform, userID, isCorporate, mappedData));
// //         } catch (IOException e) {
// //             e.printStackTrace();
// //             return CompletableFuture.failedFuture(e);
// //         }
// //     }

// //     public Map<String, Object> performColumnMapping(
// //             MultipartFile file,
// //             String platform,
// //             String uploadId,
// //             int userId,
// //             boolean isCorporate,
// //             Map<String, String> customMapping,
// //             boolean saveData) throws IOException {

// //         logger.debug("Starting column mapping for platform: {}", platform);

// //         Map<String, String> columnMapping;
// //         if ("Other".equalsIgnoreCase(platform)) {
// //             if (customMapping == null || customMapping.isEmpty()) {
// //                 logger.warn("Custom mapping not provided for platform 'Other'");
// //                 return Map.of("error", "Custom mapping required for platform 'Other'.");
// //             }
// //             columnMapping = customMapping;
// //             logger.debug("Using custom mapping: {}", columnMapping);
// //         } else {
// //             columnMapping = columnMappingService.getMapping(platform);
// //             if (columnMapping == null || columnMapping.isEmpty()) {
// //                 logger.warn("No mapping found for platform: {}", platform);
// //                 return Map.of("error", "Invalid platform specified.");
// //             }
// //             logger.debug("Fetched mapping for platform {}: {}", platform, columnMapping);
// //         }

// //         List<String> taxColumns = columnMappingService.getTaxColumns();
// //         Set<String> allExpectedColumns = new HashSet<>(columnMapping.values());
// //         Map<Integer, String> columnIndexMapping = new HashMap<>();
// //         Set<Integer> taxColumnIndices = new HashSet<>();
// //         Set<String> mappedColumns = new HashSet<>();
// //         List<Map<String, Object>> mappedData = new ArrayList<>();
// //         boolean aggregatedTaxesExistsInFile = false;

// //         try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
// //             Sheet sheet = workbook.getSheetAt(0);
// //             if (sheet == null) return Map.of("error", "Invalid file format.");

// //             Row headerRow = sheet.getRow(0);
// //             if (headerRow == null) return Map.of("error", "No header row found.");

// //             for (Cell cell : headerRow) {
// //                 String header = cell.getStringCellValue() != null ? cell.getStringCellValue().trim() : "";
// //                 if (!header.isEmpty() && columnMapping.containsKey(header)) {
// //                     String mappedKey = columnMapping.get(header);
// //                     int colIndex = cell.getColumnIndex();

// //                     if ("Aggregated_Taxes".equals(mappedKey)) {
// //                         aggregatedTaxesExistsInFile = true;
// //                         columnIndexMapping.put(colIndex, mappedKey);
// //                         mappedColumns.add(mappedKey);
// //                     } else if (taxColumns.contains(mappedKey)) {
// //                         taxColumnIndices.add(colIndex);
// //                     } else {
// //                         columnIndexMapping.put(colIndex, mappedKey);
// //                         mappedColumns.add(mappedKey);
// //                     }
// //                 }
// //             }

// //             if (columnIndexMapping.isEmpty() && taxColumnIndices.isEmpty()) {
// //                 logger.warn("No valid columns mapped from header row.");
// //                 return Map.of("error", "No valid columns mapped.");
// //             }

// //             for (int i = 1; i <= sheet.getLastRowNum(); i++) {
// //                 Row row = sheet.getRow(i);
// //                 if (row == null) continue;

// //                 Map<String, Object> record = new HashMap<>();
// //                 double aggregatedTaxes = 0;
// //                 String tradeDateStr = null;
// //                 String tradeTimeStr = null;

// //                 for (Map.Entry<Integer, String> entry : columnIndexMapping.entrySet()) {
// //                     Cell cell = row.getCell(entry.getKey(), Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
// //                     String columnName = entry.getValue();
// //                     Object value = getCellValue(cell);

// //                     if ("Trade_Date".equals(columnName)) {
// //                         String formattedDate = "";
// //                         try {
// //                             if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
// //                                 Date javaDate = cell.getDateCellValue();
// //                                 formattedDate = new SimpleDateFormat("dd-MM-yyyy").format(javaDate);
// //                             } else {
// //                                 String raw = value.toString().trim();
// //                                 DateTimeFormatter formatter = new DateTimeFormatterBuilder()
// //                                     .parseCaseInsensitive()
// //                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm a"))
// //                                     .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a"))
// //                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))
// //                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
// //                                     .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
// //                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
// //                                     .appendOptional(DateTimeFormatter.ofPattern("dd-MMM-yy"))
// //                                     .appendOptional(DateTimeFormatter.ofPattern("dd MMM yyyy"))
// //                                     .appendOptional(DateTimeFormatter.ofPattern("MM-dd-yyyy"))
// //                                     .toFormatter(Locale.ENGLISH);
// //                                 LocalDate date = LocalDate.parse(raw, formatter);
// //                                 Date javaDate = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
// //                                 formattedDate = new SimpleDateFormat("dd-MM-yyyy").format(javaDate);
// //                             }
// //                         } catch (Exception e) {
// //                             logger.warn("Unable to parse Trade_Date '{}' at row {}: {}", value, i, e.getMessage());
// //                             formattedDate = "";
// //                         }
// //                         record.put("Trade_Date", formattedDate);
// //                         tradeDateStr = formattedDate;
// //                         continue;
// //                     }

// //                     if ("Trade_Time".equals(columnName)) {
// //                         tradeTimeStr = value != null ? value.toString() : null;
// //                     }

// //                     record.put(columnName, value);
// //                 }

// //                 if (!aggregatedTaxesExistsInFile) {
// //                     for (Integer taxIndex : taxColumnIndices) {
// //                         Cell taxCell = row.getCell(taxIndex, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
// //                         Object taxValue = getCellValue(taxCell);
// //                         try {
// //                             aggregatedTaxes += Double.parseDouble(taxValue.toString());
// //                         } catch (NumberFormatException e) {
// //                             logger.debug("Invalid tax value '{}' at row {}, column {}: {}", taxValue, i, taxIndex, e.getMessage());
// //                         }
// //                     }
// //                     record.put("Aggregated_Taxes", aggregatedTaxes);
// //                 }

// //                 try {
// //                     if (tradeDateStr != null && !tradeDateStr.isEmpty()) {
// //                         LocalDate tradeDate;
// //                         if (tradeDateStr.matches("\\d+(\\.\\d+)?")) {
// //                             double serial = Double.parseDouble(tradeDateStr);
// //                             Date javaDate = DateUtil.getJavaDate(serial);
// //                             tradeDate = javaDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
// //                         } else {
// //                             DateTimeFormatter formatter = new DateTimeFormatterBuilder()
// //                                 .parseCaseInsensitive()
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm a"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd-MMM-yy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd MMM yyyy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("MM-dd-yyyy"))
// //                                 .toFormatter(Locale.ENGLISH);
// //                             tradeDate = LocalDate.parse(tradeDateStr, formatter);
// //                         }

// //                         int year = tradeDate.getYear();
// //                         int month = tradeDate.getMonthValue();
// //                         int day = tradeDate.getDayOfMonth();

// //                         if (month <= 2) {
// //                             year -= 1;
// //                             month += 12;
// //                         }
// //                         int a = year / 100;
// //                         int b = a / 4;
// //                         int c = 2 - a + b;
// //                         int e = (int) (365.25 * (year + 4716));
// //                         int f = (int) (30.6001 * (month + 1));
// //                         double julianDate = c + day + e + f - 1524.5;

// //                         if (tradeTimeStr != null && !tradeTimeStr.isEmpty()) {
// //                             try {
// //                                 double fractionOfDay;
// //                                 if (tradeTimeStr.matches("\\d*\\.\\d+")) {
// //                                     fractionOfDay = Double.parseDouble(tradeTimeStr);
// //                                 } else {
// //                                     LocalTime tradeTime = LocalTime.parse(tradeTimeStr, DateTimeFormatter.ofPattern("[HH:mm:ss][HH:mm]"));
// //                                     fractionOfDay = tradeTime.toSecondOfDay() / 86400.0;
// //                                 }
// //                                 julianDate += fractionOfDay;
// //                             } catch (Exception e1) {
// //                                 logger.debug("Invalid Trade_Time format '{}' at row {}: {}", tradeTimeStr, i, e1.getMessage());
// //                             }
// //                         }

// //                         record.put("Julian_Date", julianDate);
// //                     } else {
// //                         continue;
// //                     }
// //                 } catch (Exception e) {
// //                     logger.warn("Invalid Trade_Date format '{}' at row {}, skipping row", tradeDateStr, i);
// //                     continue;
// //                 }

// //                 for (String expectedColumn : allExpectedColumns) {
// //                     if (!record.containsKey(expectedColumn)) {
// //                         record.put(expectedColumn, 0);
// //                     }
// //                 }

// //                 mappedData.add(record);
// //             }

// //             for (Map<String, Object> record : mappedData) {
// //                 for (String taxColumn : taxColumns) {
// //                     record.remove(taxColumn);
// //                 }
// //             }

// //             if (mappedData.isEmpty()) return Map.of("error", "No valid data rows processed.");

// //             try {
// //                 MessageDigest digest = MessageDigest.getInstance("SHA-256");
// //                 StringBuilder sb = new StringBuilder();
// //                 for (Map<String, Object> row : mappedData) {
// //                     for (String key : allExpectedColumns) {
// //                         sb.append(key).append(":").append(row.getOrDefault(key, "")).append(";");
// //                     }
// //                 }
// //                 byte[] hashBytes = digest.digest(sb.toString().getBytes(StandardCharsets.UTF_8));
// //                 StringBuilder hexString = new StringBuilder();
// //                 for (byte b : hashBytes) {
// //                     hexString.append(String.format("%02x", b));
// //                 }
// //                 String fileHash = hexString.toString();
// //                 logger.debug("Generated file-level hash: {}", fileHash);

// //                 if (saveData) {
// //                     Optional<TradeFileRecordHash> existingRecordOpt = tradeFileRecordHashRepository.findByUserIdAndPlatform(userId, platform);
// //                     if (existingRecordOpt.isPresent()) {
// //                         TradeFileRecordHash existingRecord = existingRecordOpt.get();
// //                         if (existingRecord.getTradeFileHash().equals(fileHash)) {
// //                             throw new DuplicateFileUploadException("This file has already been uploaded.");
// //                         } else {
// //                             existingRecord.setTradeFileHash(fileHash);
// //                             existingRecord.setUploadId(uploadId);
// //                             tradeFileRecordHashRepository.save(existingRecord);
// //                         }
// //                     } else {
// //                         TradeFileRecordHash newRecord = new TradeFileRecordHash(userId, platform, fileHash, uploadId);
// //                         tradeFileRecordHashRepository.save(newRecord);
// //                     }
// //                 }

// //             } catch (NoSuchAlgorithmException e) {
// //                 logger.error("SHA-256 not available: {}", e.getMessage());
// //             }

// //             Path tempFilePath = Files.createTempFile("mapped_data_" + uploadId, ".csv");
// //             try {
// //                 saveToCSV(tempFilePath, mappedData);
// //                 filePathMap.put(uploadId, tempFilePath.toString());

// //                 String tableName = createTableFromCsv(tempFilePath, platform, userId, isCorporate, mappedData);
// //                 if (tableName == null || tableName.isBlank()) {
// //                     return Map.of("error", "Failed to create table from CSV.");
// //                 }

// //                 return Map.of("mappedFile", tempFilePath.toString(), "tableName", tableName);
// //             } catch (IOException e) {
// //                 logger.error("CSV save failed: {}", e.getMessage(), e);
// //                 return Map.of("error", "Failed to save CSV: " + e.getMessage());
// //             }

// //         } catch (IOException e) {
// //             logger.error("Error processing Excel file: {}", e.getMessage(), e);
// //             return Map.of("error", "File processing failed: " + e.getMessage());
// //         }
// //     }

// //     public Map<String, Object> performCsvColumnMapping(
// //             MultipartFile file,
// //             String platform,
// //             String uploadId,
// //             int userId,
// //             boolean isCorporate,
// //             Map<String, String> customMapping,
// //             boolean saveData) throws IOException {

// //         logger.debug("Starting CSV column mapping for platform: {}", platform);

// //         Map<String, String> columnMapping;
// //         if ("Other".equalsIgnoreCase(platform)) {
// //             if (customMapping == null || customMapping.isEmpty()) {
// //                 logger.warn("Custom mapping not provided for platform 'Other'");
// //                 return Map.of("error", "Custom mapping required for platform 'Other'.");
// //             }
// //             columnMapping = customMapping;
// //         } else {
// //             columnMapping = columnMappingService.getMapping(platform);
// //             if (columnMapping == null || columnMapping.isEmpty()) {
// //                 logger.warn("No mapping found for platform: {}", platform);
// //                 return Map.of("error", "Invalid platform specified.");
// //             }
// //         }

// //         List<String> taxColumns = columnMappingService.getTaxColumns();
// //         Set<String> allExpectedColumns = new HashSet<>(columnMapping.values());
// //         List<Map<String, Object>> mappedData = new ArrayList<>();
// //         boolean aggregatedTaxesExistsInFile = columnMapping.containsValue("Aggregated_Taxes");
// //         int tradeDateParseCount = 0;

// //         Reader reader = new InputStreamReader(new BOMInputStream(file.getInputStream()), StandardCharsets.UTF_8);
// //         try (CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withTrim())) {
// //             Map<String, Integer> headerMap = csvParser.getHeaderMap();
// //             Map<String, String> reverseMap = new HashMap<>();
// //             for (Map.Entry<String, String> entry : columnMapping.entrySet()) {
// //                 reverseMap.put(entry.getValue(), entry.getKey());
// //             }

// //             for (CSVRecord csvRecord : csvParser) {
// //                 Map<String, Object> record = new HashMap<>();
// //                 double aggregatedTaxes = 0;
// //                 String tradeDateStr = null;
// //                 String tradeTimeStr = null;

// //                 for (String key : allExpectedColumns) {
// //                     String originalHeader = reverseMap.get(key);
// //                     String value = csvRecord.isMapped(originalHeader) ? csvRecord.get(originalHeader).trim() : "";

// //                     if ("Trade_Date".equals(key)) {
// //                         String formattedDate = "";
// //                         try {
// //                             logger.debug("Raw Trade_Date before parsing (row {}): '{}'", csvRecord.getRecordNumber(), value);
// //                             DateTimeFormatter formatter = new DateTimeFormatterBuilder()
// //                                 .parseCaseInsensitive()
// //                                 .appendOptional(DateTimeFormatter.ofPattern("MM/dd/yyyy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("MM-d-yyyy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("M/d/yyyy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("M-d-yyyy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm a"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd MMM yyyy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("dd-MMM-yy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("d-MMM-yy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("d-M-yyyy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("d/M/yyyy"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("yyyy/MM/dd"))
// //                                 .appendOptional(DateTimeFormatter.ofPattern("MM-dd-yyyy"))
// //                                 .toFormatter(Locale.ENGLISH);
// //                             LocalDate date = LocalDate.parse(value, formatter);
// //                             formattedDate = new SimpleDateFormat("dd-MM-yyyy")
// //                                 .format(Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant()));
// //                             logger.debug("Formatted Trade_Date after parsing (row {}): '{}'", csvRecord.getRecordNumber(), formattedDate);
// //                             tradeDateParseCount++;
// //                         } catch (Exception e) {
// //                             logger.warn("Unable to parse Trade_Date '{}' at row {}: {}", value, csvRecord.getRecordNumber(), e.getMessage());
// //                         }
// //                         record.put("Trade_Date", formattedDate);
// //                         tradeDateStr = formattedDate;
// //                         continue;
// //                     }

// //                     if ("Trade_Time".equals(key)) {
// //                         tradeTimeStr = value;
// //                     }

// //                     if ((key.equals("Brok_Amt") && value.isEmpty())) {
// //                         value = "0";
// //                     }

// //                     record.put(key, value);
// //                 }

// //                 boolean shouldCalculateTaxes = true;
// //                 if (aggregatedTaxesExistsInFile) {
// //                     String originalAggHeader = reverseMap.get("Aggregated_Taxes");
// //                     String aggVal = csvRecord.isMapped(originalAggHeader) ? csvRecord.get(originalAggHeader).trim() : "";
// //                     try {
// //                         if (!aggVal.isEmpty()) {
// //                             double val = Double.parseDouble(aggVal);
// //                             record.put("Aggregated_Taxes", val);
// //                             shouldCalculateTaxes = false;
// //                         }
// //                     } catch (NumberFormatException e) {
// //                         logger.debug("Invalid Aggregated_Taxes value '{}' at row {}: {}", aggVal, csvRecord.getRecordNumber(), e.getMessage());
// //                     }
// //                 }

// //                 if (shouldCalculateTaxes) {
// //                     aggregatedTaxes = 0;
// //                     for (String taxKey : taxColumns) {
// //                         String originalTaxHeader = reverseMap.get(taxKey);
// //                         String taxVal = csvRecord.isMapped(originalTaxHeader) ? csvRecord.get(originalTaxHeader).trim() : "0";
// //                         try {
// //                             aggregatedTaxes += Double.parseDouble(taxVal);
// //                         } catch (NumberFormatException e) {
// //                             logger.debug("Invalid tax value '{}' at row {}: {}", taxVal, csvRecord.getRecordNumber(), e.getMessage());
// //                         }
// //                     }
// //                     record.put("Aggregated_Taxes", aggregatedTaxes);
// //                 }

// //                 try {
// //                     if (tradeDateStr != null && !tradeDateStr.isEmpty()) {
// //                         LocalDate tradeDate = LocalDate.parse(tradeDateStr, DateTimeFormatter.ofPattern("dd-MM-yyyy"));
// //                         int year = tradeDate.getYear();
// //                         int month = tradeDate.getMonthValue();
// //                         int day = tradeDate.getDayOfMonth();

// //                         if (month <= 2) {
// //                             year -= 1;
// //                             month += 12;
// //                         }
// //                         int a = year / 100;
// //                         int b = a / 4;
// //                         int c = 2 - a + b;
// //                         int e = (int) (365.25 * (year + 4716));
// //                         int f = (int) (30.6001 * (month + 1));
// //                         double julianDate = c + day + e + f - 1524.5;

// //                         if (tradeTimeStr != null && !tradeTimeStr.isEmpty()) {
// //                             try {
// //                                 double fractionOfDay;
// //                                 if (tradeTimeStr.matches("\\d*\\.\\d+")) {
// //                                     fractionOfDay = Double.parseDouble(tradeTimeStr);
// //                                 } else {
// //                                     LocalTime tradeTime = LocalTime.parse(tradeTimeStr, DateTimeFormatter.ofPattern("[HH:mm:ss][HH:mm]"));
// //                                     fractionOfDay = tradeTime.toSecondOfDay() / 86400.0;
// //                                 }
// //                                 julianDate += fractionOfDay;
// //                             } catch (Exception e1) {
// //                                 logger.debug("Invalid Trade_Time format '{}' at row {}: {}", tradeTimeStr, csvRecord.getRecordNumber(), e1.getMessage());
// //                             }
// //                         }
// //                         record.put("Julian_Date", julianDate);
// //                     } else {
// //                         continue;
// //                     }
// //                 } catch (Exception e) {
// //                     logger.warn("Invalid Trade_Date format '{}' at row {}, skipping row", tradeDateStr, csvRecord.getRecordNumber());
// //                     continue;
// //                 }

// //                 for (String expectedColumn : allExpectedColumns) {
// //                     if (!record.containsKey(expectedColumn)) {
// //                         record.put(expectedColumn, 0);
// //                     }
// //                 }

// //                 mappedData.add(record);
// //             }

// //             logger.info("Total Trade_Date values successfully parsed: {}", tradeDateParseCount);

// //             for (Map<String, Object> record : mappedData) {
// //                 for (String taxColumn : taxColumns) {
// //                     record.remove(taxColumn);
// //                 }
// //             }

// //             if (mappedData.isEmpty()) return Map.of("error", "No valid data rows processed.");

// //             try {
// //                 MessageDigest digest = MessageDigest.getInstance("SHA-256");
// //                 StringBuilder sb = new StringBuilder();
// //                 for (Map<String, Object> row : mappedData) {
// //                     for (String key : allExpectedColumns) {
// //                         sb.append(key).append(":").append(row.getOrDefault(key, "")).append(";");
// //                     }
// //                 }
// //                 byte[] hashBytes = digest.digest(sb.toString().getBytes(StandardCharsets.UTF_8));
// //                 StringBuilder hexString = new StringBuilder();
// //                 for (byte b : hashBytes) {
// //                     hexString.append(String.format("%02x", b));
// //                 }
// //                 String fileHash = hexString.toString();
// //                 if (saveData) {
// //                     Optional<TradeFileRecordHash> existingRecordOpt = tradeFileRecordHashRepository.findByUserIdAndPlatform(userId, platform);
// //                     if (existingRecordOpt.isPresent()) {
// //                         TradeFileRecordHash existingRecord = existingRecordOpt.get();
// //                         if (existingRecord.getTradeFileHash().equals(fileHash)) {
// //                             throw new DuplicateFileUploadException("This file has already been uploaded.");
// //                         } else {
// //                             existingRecord.setTradeFileHash(fileHash);
// //                             existingRecord.setUploadId(uploadId);
// //                             tradeFileRecordHashRepository.save(existingRecord);
// //                         }
// //                     } else {
// //                         TradeFileRecordHash newRecord = new TradeFileRecordHash(userId, platform, fileHash, uploadId);
// //                         tradeFileRecordHashRepository.save(newRecord);
// //                     }
// //                 }
// //             } catch (NoSuchAlgorithmException e) {
// //                 logger.error("SHA-256 not available: {}", e.getMessage());
// //             }

// //             Path tempFilePath = Files.createTempFile("mapped_data_" + uploadId, ".csv");
// //             try {
// //                 saveToCSV(tempFilePath, mappedData);
// //                 filePathMap.put(uploadId, tempFilePath.toString());

// //                 String tableName = createTableFromCsv(tempFilePath, platform, userId, isCorporate, mappedData);
// //                 if (tableName == null || tableName.isBlank()) {
// //                     return Map.of("error", "Failed to create table from CSV.");
// //                 }

// //                 return Map.of("mappedFile", tempFilePath.toString(), "tableName", tableName);
// //             } catch (IOException e) {
// //                 logger.error("CSV save failed: {}", e.getMessage(), e);
// //                 return Map.of("error", "Failed to save CSV: " + e.getMessage());
// //             }
// //         } catch (IOException e) {
// //             logger.error("Error processing CSV file: {}", e.getMessage(), e);
// //             return Map.of("error", "CSV file processing failed: " + e.getMessage());
// //         }
// //     }

// //     public String createTableFromCsv(Path csvPath, String platform, int userId, boolean isCorporate, List<Map<String, Object>> mappedData) throws IOException {
// //         List<String> lines = Files.readAllLines(csvPath, StandardCharsets.UTF_8);
// //         if (lines.isEmpty()) {
// //             logger.error("CSV file is empty: {}", csvPath);
// //             throw new IllegalArgumentException("CSV file is empty.");
// //         }

// //         String firstLine = lines.get(0).replace("\uFEFF", "");
// //         String[] headers = firstLine.split(",", -1);

// //         List<String[]> rows = lines.subList(1, lines.size()).stream()
// //             .map(line -> line.split(",", -1))
// //             .filter(row -> row.length == headers.length)
// //             .toList();

// //         String sanitizedPlatform = platform.replaceAll("\\s+", "");
// //         String tableNamePrefix = isCorporate ? "Corporate" : "user";
// //         String tableName = tableNamePrefix + userId + "_" + sanitizedPlatform + "_portf";

// //         Map<String, String> dataTypes = Map.of(
// //             "Exchange", "VARCHAR(100)",
// //             "Trade_Date", "DATE",
// //             "Order_Type", "VARCHAR(50)",
// //             "Qty", "FLOAT",
// //             "Scrip_Name", "VARCHAR(150)",
// //             "Brok_Amt", "FLOAT",
// //             "Aggregated_Taxes", "FLOAT",
// //             "Mkt_Price", "FLOAT"
// //         );

// //         try {
// //             String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
// //             Integer count = portfolioJdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);
// //             if (count == null || count == 0) {
// //                 List<String> columns = new ArrayList<>();
// //                 for (String header : headers) {
// //                     String colName = header.trim().replaceAll("\\s+", "_").replaceAll("[^a-zA-Z0-9_]", "");
// //                     if (colName.isEmpty()) continue;
// //                     String type = dataTypes.getOrDefault(colName, "VARCHAR(255)");
// //                     columns.add("[" + colName + "] " + type);
// //                 }
// //                 columns.add("[Julian_Date] FLOAT");
// //                 columns.add("[Hashcode] VARCHAR(64)");
// //                 String sql = "CREATE TABLE [" + tableName + "] (" + String.join(", ", columns) + ")";
// //                 portfolioJdbcTemplate.execute(sql);
// //             }
// //         } catch (DataAccessException e) {
// //             logger.error("Failed to create table '{}': {}", tableName, e.getMessage(), e);
// //             throw new IOException("Failed to create table: " + e.getMessage(), e);
// //         }

// //         String colsJoined = Arrays.stream(headers)
// //             .map(h -> h.trim().replaceAll("\\s+", "_").replaceAll("[^a-zA-Z0-9_]", ""))
// //             .map(col -> "[" + col + "]")
// //             .collect(Collectors.joining(","));

// //         SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");

// //         for (int rowIndex = 0; rowIndex < rows.size(); rowIndex++) {
// //             String[] vals = rows.get(rowIndex);
// //             try {
// //                 StringJoiner valuesJoiner = new StringJoiner(",", "(", ")");
// //                 for (int i = 0; i < vals.length && i < headers.length; i++) {
// //                     String rawHeader = headers[i].trim();
// //                     String colName = rawHeader.replaceAll("\\s+", "_").replaceAll("[^a-zA-Z0-9_]", "");
// //                     String value = vals[i].trim();

// //                     if ("Trade_Date".equalsIgnoreCase(colName)) {
// //                         try {
// //                             if (value.matches("\\d+(\\.\\d+)?")) {
// //                                 double serial = Double.parseDouble(value);
// //                                 Date javaDate = DateUtil.getJavaDate(serial);
// //                                 value = outputFormat.format(javaDate);
// //                             } else if (value.matches("\\d{2}/\\d{2}/\\d{4}")) {
// //                                 value = outputFormat.format(new SimpleDateFormat("dd/MM/yyyy").parse(value));
// //                             } else if (value.matches("\\d{2}-\\d{2}-\\d{4}")) {
// //                                 value = outputFormat.format(new SimpleDateFormat("dd-MM-yyyy").parse(value));
// //                             } else if (value.matches("\\d{4}-\\d{2}-\\d{2}")) {
// //                             } else {
// //                                 value = outputFormat.format(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").parse(value));
// //                             }
// //                         } catch (ParseException e) {
// //                             logger.warn("Invalid Trade_Date format '{}', row {}", value, rowIndex);
// //                             value = "";
// //                         }
// //                     }

// //                     String columnType = dataTypes.getOrDefault(colName, "VARCHAR(255)");
// //                     if (value.isEmpty()) {
// //                         valuesJoiner.add("NULL");
// //                     } else if (columnType.startsWith("VARCHAR")) {
// //                         valuesJoiner.add("'" + value.replace("'", "''") + "'");
// //                     } else if (columnType.equals("DATE")) {
// //                         valuesJoiner.add("'" + value + "'");
// //                     } else {
// //                         valuesJoiner.add(value);
// //                     }
// //                 }

// //                 double julianDate = 0.0;
// //                 if (rowIndex < mappedData.size()) {
// //                     Object julianObj = mappedData.get(rowIndex).get("Julian_Date");
// //                     if (julianObj instanceof Number) {
// //                         julianDate = ((Number) julianObj).doubleValue();
// //                     }
// //                 }

// //                 String qty = "", brokAmt = "", mktPrice = "", agTax = "", trade_id = "";
// //                 if (rowIndex < mappedData.size()) {
// //                     Map<String, Object> rowMap = mappedData.get(rowIndex);
// //                     qty = String.valueOf(rowMap.getOrDefault("Qty", "")).trim();
// //                     brokAmt = String.valueOf(rowMap.getOrDefault("Brok_Amt", "")).trim();
// //                     mktPrice = String.valueOf(rowMap.getOrDefault("Mkt_Price", "")).trim();
// //                     agTax = String.valueOf(rowMap.getOrDefault("Aggregated_Taxes", "")).trim();
// //                     trade_id = String.valueOf(rowMap.getOrDefault("Trade_Id", "")).trim();
// //                 }

// //                 String combined = qty + "|" + brokAmt + "|" + mktPrice + "|" + agTax + "|" + trade_id;
// //                 String hash = String.valueOf(generateSHA256(combined));

// //                 String existsCheck = "SELECT COUNT(*) FROM [" + tableName + "] WHERE Julian_Date = ? AND Hashcode = ?";
// //                 Integer exists = portfolioJdbcTemplate.queryForObject(existsCheck, Integer.class, julianDate, hash);
// //                 if (exists != null && exists > 0) {
// //                     continue;
// //                 }

// //                 valuesJoiner.add(String.valueOf(julianDate));
// //                 valuesJoiner.add("'" + hash + "'");

// //                 String insertSQL = "INSERT INTO [" + tableName + "] (" + colsJoined + ", [Julian_Date], [Hashcode]) VALUES " + valuesJoiner;
// //                 portfolioJdbcTemplate.execute(insertSQL);
// //             } catch (DataAccessException e) {
// //                 logger.error("Error inserting row {}: {}", rowIndex, e.getMessage(), e);
// //             }
// //         }

// //         return tableName;
// //     }

// //     private String generateSHA256(String input) {
// //         try {
// //             MessageDigest digest = MessageDigest.getInstance("SHA-256");
// //             byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
// //             StringBuilder sb = new StringBuilder();
// //             for (byte b : hashBytes) {
// //                 sb.append(String.format("%02x", b));
// //             }
// //             return sb.toString();
// //         } catch (NoSuchAlgorithmException e) {
// //             throw new RuntimeException("SHA-256 algorithm not available", e);
// //         }
// //     }

// //     private void saveToCSV(Path filePath, List<Map<String, Object>> data) throws IOException {
// //         try (BufferedWriter writer = Files.newBufferedWriter(filePath)) {
// //             if (data.isEmpty()) return;
// //             Set<String> headers = new LinkedHashSet<>(data.get(0).keySet());
// //             headers.remove("Trade_Time");
// //             headers.remove("Julian_Date");
// //             headers.remove("Trade_Id");
// //             writer.write(String.join(",", headers));
// //             writer.newLine();

// //             for (Map<String, Object> row : data) {
// //                 List<String> rowData = new ArrayList<>();
// //                 for (String header : headers) {
// //                     rowData.add(row.get(header).toString());
// //                 }
// //                 writer.write(String.join(",", rowData));
// //                 writer.newLine();
// //             }
// //         }
// //     }

// //     private Object getCellValue(Cell cell) {
// //         switch (cell.getCellType()) {
// //             case STRING:  return cell.getStringCellValue();
// //             case NUMERIC: return cell.getNumericCellValue();
// //             case BOOLEAN: return cell.getBooleanCellValue();
// //             default:      return "";
// //         }
// //     }

// //     public Map<String, Object> processFile(String mappedFilePath, String platform, String uploadId, int userId, boolean isCorporate, boolean isSaveData) {
// //         Map<String, Object> result = new HashMap<>();
// //         try {
// //             ProcessBuilder processBuilder = new ProcessBuilder("python3", "/app/PythonScript/Portfolio/process_file.py", mappedFilePath, platform);
// //             processBuilder.redirectErrorStream(true);
// //             Process process = processBuilder.start();

// //             BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
// //             StringBuilder output = new StringBuilder();
// //             String line;
// //             while ((line = reader.readLine()) != null) {
// //                 System.out.println("Python Output: " + line);
// //                 output.append(line);
// //             }

// //             if (process.waitFor() == 0) {
// //                 ObjectMapper objectMapper = new ObjectMapper();
// //                 result = objectMapper.readValue(output.toString(), new TypeReference<Map<String, Object>>() {});
// //                 processingResultMap.put(uploadId, result);
// //                 saveResultToResultDb(result, platform, userId, isCorporate, isSaveData);
// //             } else {
// //                 result.put("error", "Python script failed.");
// //             }
// //         } catch (IOException | InterruptedException e) {
// //             result.put("error", "File processing failed: " + e.getMessage());
// //         }
// //         return result;
// //     }

// //     @SuppressWarnings("unchecked")
// //     private void saveResultToResultDb(Map<String, Object> resultData, String platform, int userId, boolean isCorporate, boolean isSaveData) {
// //         List<Map<String, Object>> portfolioResults = (List<Map<String, Object>>) resultData.get("portfolio_results");
// //         List<Map<String, Object>> transactions = (List<Map<String, Object>>) resultData.get("transactions");

// //         String prefix = isCorporate ? "Corporate" : "user";
// //         String sanitizedPlatform = platform.replaceAll("\\s+", "");
// //         String portTbl = prefix + userId + "_" + sanitizedPlatform + "_portfolio_results";
// //         String txnTbl = prefix + userId + "_" + sanitizedPlatform + "_transcation";

// //         if (isSaveData) {
// //             createAndPopulate(portfolioResults, portTbl);
// //             createAndPopulate(transactions, txnTbl);
// //         } else {
// //             createAndPopulateTemp(portfolioResults, portTbl);
// //             createAndPopulateTemp(transactions, txnTbl);
// //         }
// //     }

// //     private void createAndPopulate(List<Map<String, Object>> rows, String tableName) {
// //         if (rows == null || rows.isEmpty()) return;
// //         String safeTbl = "[" + tableName + "]";

// //         try {
// //             Map<String, String> columnTypes = Map.ofEntries(
// //                 Map.entry("Date", "DATE"),
// //                 Map.entry("Trade_Date", "DATE"),
// //                 Map.entry("Scrip", "VARCHAR(150)"),
// //                 Map.entry("Symbol", "VARCHAR(50)"),
// //                 Map.entry("Remaining_Qty", "FLOAT"),
// //                 Map.entry("Deployed_Amount", "FLOAT"),
// //                 Map.entry("Market_Value", "FLOAT"),
// //                 Map.entry("Unrealized_%_Return", "FLOAT"),
// //                 Map.entry("Unrealized_PNL", "FLOAT"),
// //                 Map.entry("Realized_PNL", "FLOAT"),
// //                 Map.entry("Brokerage_Amount", "FLOAT"),
// //                 Map.entry("Invested_Amount", "FLOAT"),
// //                 Map.entry("Turn_Over_Amount", "FLOAT"),
// //                 Map.entry("Exchange", "VARCHAR(100)"),
// //                 Map.entry("Scrip_Name", "VARCHAR(150)"),
// //                 Map.entry("Order_Type", "VARCHAR(50)"),
// //                 Map.entry("Qty", "FLOAT"),
// //                 Map.entry("Mkt_Price", "FLOAT"),
// //                 Map.entry("Brok_Amt", "FLOAT"),
// //                 Map.entry("Aggregated_Taxes", "FLOAT"),
// //                 Map.entry("CustomQty", "FLOAT"),
// //                 Map.entry("CumulativeQty", "FLOAT")
// //             );

// //             Set<String> keys = rows.get(0).keySet();
// //             StringBuilder ddl = new StringBuilder();
// //             ddl.append("IF NOT EXISTS (SELECT * FROM sys.tables WHERE name='")
// //                .append(tableName).append("')\n")
// //                .append("  CREATE TABLE ").append(safeTbl).append(" (\n")
// //                .append("    id INT IDENTITY(1,1) PRIMARY KEY");

// //             for (String k : keys) {
// //                 String col = k.replaceAll("\\s+", "_");
// //                 String sqlType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");
// //                 ddl.append(",\n    [").append(col).append("] ").append(sqlType);
// //             }
// //             ddl.append("\n);\n");

// //             for (String k : keys) {
// //                 String col = k.replaceAll("\\s+", "_");
// //                 String sqlType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");
// //                 ddl.append("IF EXISTS (SELECT * FROM sys.tables WHERE name='")
// //                    .append(tableName).append("')\n")
// //                    .append("  AND NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS\n")
// //                    .append("                   WHERE TABLE_NAME='").append(tableName)
// //                    .append("' AND COLUMN_NAME='").append(col).append("')\n")
// //                    .append("    ALTER TABLE ").append(safeTbl)
// //                    .append(" ADD [").append(col).append("] ").append(sqlType).append(";\n");
// //             }

// //             resultJdbcTemplate.execute(ddl.toString());

// //             for (Map<String, Object> row : rows) {
// //                 try {
// //                     List<String> cols = new ArrayList<>();
// //                     List<String> vals = new ArrayList<>();

// //                     for (String k : keys) {
// //                         String col = k.replaceAll("\\s+", "_");
// //                         cols.add("[" + col + "]");
// //                         Object val = row.get(k);
// //                         String cleanedVal;

// //                         if (val == null) {
// //                             vals.add("NULL");
// //                             continue;
// //                         }

// //                         String expectedType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");
// //                         if (expectedType.equals("DATE")) {
// //                             try {
// //                                 String value = val.toString().trim();
// //                                 if (value.matches("\\d+(\\.0+)?")) {
// //                                     double serial = Double.parseDouble(value);
// //                                     java.util.Date javaDate = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(serial);
// //                                     cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(javaDate);
// //                                 } else if (value.matches("\\d{2}/\\d{2}/\\d{4}")) {
// //                                     java.util.Date parsedDate = new SimpleDateFormat("dd/MM/yyyy").parse(value);
// //                                     cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(parsedDate);
// //                                 } else if (value.matches("\\d{2}-\\d{2}-\\d{4}")) {
// //                                     java.util.Date parsedDate = new SimpleDateFormat("dd-MM-yyyy").parse(value);
// //                                     cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(parsedDate);
// //                                 } else {
// //                                     cleanedVal = value;
// //                                 }
// //                                 vals.add("'" + cleanedVal + "'");
// //                             } catch (Exception e) {
// //                                 cleanedVal = val.toString().replace("'", "''");
// //                                 vals.add("'" + cleanedVal + "'");
// //                             }
// //                         } else if (expectedType.startsWith("FLOAT") || expectedType.startsWith("INT")) {
// //                             cleanedVal = val.toString().replace(",", "");
// //                             vals.add(cleanedVal);
// //                         } else {
// //                             cleanedVal = val.toString().replace("'", "''");
// //                             vals.add("'" + cleanedVal + "'");
// //                         }
// //                     }

// //                     String insert = "INSERT INTO " + safeTbl +
// //                                     " (" + String.join(", ", cols) + ") VALUES (" + String.join(", ", vals) + ")";
// //                     resultJdbcTemplate.execute(insert);
// //                 } catch (Exception e) {
// //                     e.printStackTrace();
// //                 }
// //             }
// //         } catch (Exception ex) {
// //             ex.printStackTrace();
// //         }
// //     }

// //     private void createAndPopulateTemp(List<Map<String, Object>> rows, String baseTableName) {
// //         if (rows == null || rows.isEmpty()) return;

// //         String tempTableName = "#Temp_" + baseTableName;
// //         System.out.println("Creating temp table: " + tempTableName);

// //         Map<String, String> columnTypes = Map.ofEntries(
// //             Map.entry("Date", "DATE"),
// //             Map.entry("Trade_Date", "DATE"),
// //             Map.entry("Scrip", "VARCHAR(150)"),
// //             Map.entry("Symbol", "VARCHAR(50)"),
// //             Map.entry("Remaining_Qty", "FLOAT"),
// //             Map.entry("Deployed_Amount", "FLOAT"),
// //             Map.entry("Market_Value", "FLOAT"),
// //             Map.entry("Unrealized_%_Return", "FLOAT"),
// //             Map.entry("Unrealized_PNL", "FLOAT"),
// //             Map.entry("Realized_PNL", "FLOAT"),
// //             Map.entry("Brokerage_Amount", "FLOAT"),
// //             Map.entry("Invested_Amount", "FLOAT"),
// //             Map.entry("Turn_Over_Amount", "FLOAT"),
// //             Map.entry("Exchange", "VARCHAR(100)"),
// //             Map.entry("Scrip_Name", "VARCHAR(150)"),
// //             Map.entry("Order_Type", "VARCHAR(50)"),
// //             Map.entry("Qty", "FLOAT"),
// //             Map.entry("Mkt_Price", "FLOAT"),
// //             Map.entry("Brok_Amt", "FLOAT"),
// //             Map.entry("Aggregated_Taxes", "FLOAT"),
// //             Map.entry("CustomQty", "FLOAT"),
// //             Map.entry("CumulativeQty", "FLOAT"),
// //             Map.entry("RowHash", "INT")
// //         );

// //         Set<String> keys = rows.get(0).keySet();
// //         StringBuilder ddl = new StringBuilder();

// //         try {
// //             // Drop existing temp table if it exists
// //             ddl.append("IF OBJECT_ID('tempdb..").append(tempTableName).append("') IS NOT NULL DROP TABLE ").append(tempTableName).append(";\n");

// //             // Create temp table
// //             ddl.append("CREATE TABLE ").append(tempTableName).append(" (\n")
// //                .append("    id INT IDENTITY(1,1) PRIMARY KEY");

// //             for (String k : keys) {
// //                 String col = k.replaceAll("\\s+", "_");
// //                 String sqlType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");
// //                 ddl.append(",\n    [").append(col).append("] ").append(sqlType);
// //             }
// //             ddl.append(",\n [RowHash] INT");
// //             ddl.append("\n);\n");

// //             // Execute CREATE TABLE
// //             resultJdbcTemplate.execute(ddl.toString());

// //             // Record creation in metadata table
// //             String insertMetadata = "INSERT INTO " + TEMP_TABLE_METADATA + " (TableName, CreatedAt) VALUES (?, ?)";
// //             resultJdbcTemplate.update(insertMetadata, tempTableName, LocalDateTime.now());

// //         } catch (Exception e) {
// //             logger.error("Error creating temp table {}: {}", tempTableName, e.getMessage(), e);
// //             return;
// //         }

// //         for (Map<String, Object> row : rows) {
// //             try {
// //                 List<String> cols = new ArrayList<>();
// //                 List<String> vals = new ArrayList<>();
// //                 StringBuilder hashSource = new StringBuilder();

// //                 for (String k : keys) {
// //                     String col = k.replaceAll("\\s+", "_");
// //                     cols.add("[" + col + "]");
// //                     Object val = row.get(k);
// //                     String cleanedVal;

// //                     if (val == null) {
// //                         vals.add("NULL");
// //                         hashSource.append("null|");
// //                         continue;
// //                     }

// //                     String expectedType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");
// //                     try {
// //                         if (expectedType.equals("DATE")) {
// //                             String value = val.toString().trim();
// //                             if (value.matches("\\d+(\\.0+)?")) {
// //                                 double serial = Double.parseDouble(value);
// //                                 java.util.Date javaDate = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(serial);
// //                                 cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(javaDate);
// //                             } else if (value.matches("\\d{2}/\\d{2}/\\d{4}")) {
// //                                 java.util.Date parsedDate = new SimpleDateFormat("dd/MM/yyyy").parse(value);
// //                                 cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(parsedDate);
// //                             } else if (value.matches("\\d{2}-\\d{2}-\\d{4}")) {
// //                                 java.util.Date parsedDate = new SimpleDateFormat("dd-MM-yyyy").parse(value);
// //                                 cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(parsedDate);
// //                             } else {
// //                                 cleanedVal = value;
// //                             }
// //                             vals.add("'" + cleanedVal + "'");
// //                         } else if (expectedType.startsWith("FLOAT") || expectedType.startsWith("INT")) {
// //                             cleanedVal = val.toString().replace(",", "");
// //                             vals.add(cleanedVal);
// //                         } else {
// //                             cleanedVal = val.toString().replace("'", "''");
// //                             vals.add("'" + cleanedVal + "'");
// //                         }
// //                         hashSource.append(cleanedVal).append("|");
// //                     } catch (Exception e) {
// //                         cleanedVal = val.toString().replace("'", "''");
// //                         vals.add("'" + cleanedVal + "'");
// //                         hashSource.append(cleanedVal).append("|");
// //                     }
// //                 }

// //                 int rowHash = hashSource.toString().hashCode();
// //                 cols.add("[RowHash]");
// //                 vals.add(String.valueOf(rowHash));

// //                 String insert = "INSERT INTO " + tempTableName + " (" +
// //                                 String.join(", ", cols) + ") VALUES (" +
// //                                 String.join(", ", vals) + ")";
// //                 resultJdbcTemplate.execute(insert);
// //             } catch (Exception e) {
// //                 logger.error("Error inserting row into temp table {}: {}", tempTableName, e.getMessage(), e);
// //             }
// //         }
// //     }

// //     @Scheduled(fixedRate = 300000) // Run every 5 minutes
// //     public void cleanupOldTempTables() {
// //         logger.info("Starting cleanup of old temporary tables");
// //         String selectOldTables = "SELECT TableName FROM " + TEMP_TABLE_METADATA +
// //                 " WHERE CreatedAt < DATEADD(HOUR, -1, GETDATE())";
// //         List<String> oldTables;
// //         try {
// //             oldTables = resultJdbcTemplate.queryForList(selectOldTables, String.class);
// //         } catch (Exception e) {
// //             logger.error("Failed to query old temporary tables: {}", e.getMessage(), e);
// //             return;
// //         }

// //         for (String tableName : oldTables) {
// //             try {
// //                 // Drop the temporary table
// //                 String dropTable = "IF OBJECT_ID('tempdb.." + tableName + "') IS NOT NULL DROP TABLE " + tableName;
// //                 resultJdbcTemplate.execute(dropTable);
// //                 logger.info("Dropped temporary table: {}", tableName);

// //                 // Remove metadata entry
// //                 String deleteMetadata = "DELETE FROM " + TEMP_TABLE_METADATA + " WHERE TableName = ?";
// //                 resultJdbcTemplate.update(deleteMetadata, tableName);
// //                 logger.info("Removed metadata for table: {}", tableName);
// //             } catch (Exception e) {
// //                 logger.error("Failed to clean up table {}: {}", tableName, e.getMessage(), e);
// //             }
// //         }
// //         logger.info("Completed cleanup of old temporary tables");
// //     }

// //     public List<Map<String, Object>> getPortfolioResults(String tableName) {
// //         String query = "SELECT * FROM " + tableName;
// //         return resultJdbcTemplate.queryForList(query);
// //     }

// //     public Map<String, Object> getResultsByUploadId(String uploadId) {
// //         Map<String, Object> result = new HashMap<>();
// //         try {
// //             UserPortfolioUploads uploads = userPortfolioUploadRepository.findByUploadId(uploadId)
// //                     .orElseThrow(() -> new RuntimeException("Upload not found with ID: " + uploadId));

// //             String portfolioTableName = uploads.getPortfolioTableName();
// //             String prefix = uploads.getUserType().equalsIgnoreCase("corporate") ? "Corporate" : "user";
// //             String sanitizedPlatform = uploads.getPlatform().replaceAll("\\s+", "");
// //             String baseTableName = prefix + uploads.getUserID() + "_" + sanitizedPlatform;

// //             String resultTableName = baseTableName + "_portfolio_results";
// //             String transactionTableName = baseTableName + "_transcation";

// //             if (portfolioTableName.contains("#")) {
// //                 resultTableName = "#Temp_" + baseTableName + "_portfolio_results";
// //                 transactionTableName = "#Temp_" + baseTableName + "_transcation";
// //             }
// //             if ("Sample_AxisBank_portf".equals(portfolioTableName)) {
// //                 resultTableName = "Sample_AxisBank_portfolio_results";
// //                 transactionTableName = "Sample_AxisBank_transcation";
// //             }

// //             List<Map<String, Object>> portfolioResults = resultJdbcTemplate.queryForList("SELECT * FROM [" + resultTableName + "]");

// //             Optional<String> maxDateOpt = portfolioResults.stream()
// //                 .map(row -> row.get("Date"))
// //                 .filter(Objects::nonNull)
// //                 .filter(val -> val instanceof java.util.Date || val instanceof java.sql.Timestamp || val instanceof String)
// //                 .map(val -> {
// //                     if (val instanceof String str) return str;
// //                     else if (val instanceof java.util.Date dt) return new SimpleDateFormat("yyyy-MM-dd").format(dt);
// //                     else return null;
// //                 })
// //                 .filter(Objects::nonNull)
// //                 .max(String::compareTo);

// //             if (maxDateOpt.isPresent()) {
// //                 String maxDate = maxDateOpt.get();
// //                 portfolioResults = portfolioResults.stream()
// //                     .filter(row -> {
// //                         Object dateObj = row.get("Date");
// //                         String rowDate = (dateObj instanceof java.util.Date || dateObj instanceof java.sql.Timestamp)
// //                                 ? new SimpleDateFormat("yyyy-MM-dd").format(dateObj)
// //                                 : String.valueOf(dateObj);
// //                         Object remainingQtyObj = row.get("Remaining_Qty");
// //                         double qty = 0.0;
// //                         try {
// //                             qty = Double.parseDouble(String.valueOf(remainingQtyObj));
// //                         } catch (Exception e) {
// //                         }
// //                         return maxDate.equals(rowDate) && qty > 0.0;
// //                     })
// //                     .collect(Collectors.toList());
// //             } else {
// //                 portfolioResults = List.of();
// //             }

// //             List<Map<String, Object>> transactions = resultJdbcTemplate.queryForList("SELECT * FROM [" + transactionTableName + "]");

// //             SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
// //             portfolioResults.forEach(row -> {
// //                 Object dateVal = row.get("Date");
// //                 if (dateVal instanceof java.sql.Timestamp || dateVal instanceof java.util.Date) {
// //                     row.put("Date", sdf.format(dateVal));
// //                 }
// //                 Object tradeDate = row.get("Trade_Date");
// //                 if (tradeDate instanceof java.sql.Timestamp || tradeDate instanceof java.util.Date) {
// //                     row.put("Trade_Date", sdf.format(tradeDate));
// //                 }
// //             });

// //             transactions.forEach(row -> {
// //                 Object tradeDate = row.get("Trade_Date");
// //                 if (tradeDate instanceof java.sql.Timestamp || tradeDate instanceof java.util.Date) {
// //                     row.put("Trade_Date", sdf.format(tradeDate));
// //                 }
// //             });

// //             result.put("portfolio_results", portfolioResults);
// //             result.put("transactions", transactions);
// //         } catch (Exception e) {
// //             result.put("error", "Failed to fetch results: " + e.getMessage());
// //         }
// //         return result;
// //     }

// //     public String getMappedFilePath(String uploadId) {
// //         return filePathMap.get(uploadId);
// //     }

// //     public void deleteTemporaryTables(int userId, String platform, boolean isCorporate) {
// //         String tablePrefix = isCorporate ? "Corporate" : "user";
// //         String sanitizedPlatform = platform.replaceAll("\\s+", "");
// //         String portfTable = tablePrefix + userId + "_" + sanitizedPlatform + "_portf";
// //         String resultTable = tablePrefix + userId + "_portfolio_results";
// //         String transTable = tablePrefix + userId + "_transcation";

// //         try {
// //             portfolioJdbcTemplate.execute("DROP TABLE IF EXISTS [" + portfTable + "]");
// //             resultJdbcTemplate.execute("DROP TABLE IF EXISTS [" + resultTable + "]");
// //             resultJdbcTemplate.execute("DROP TABLE IF EXISTS [" + transTable + "]");
// //             System.out.println("Temporary tables dropped for user " + userId);
// //         } catch (Exception e) {
// //             System.err.println("Error while deleting temp tables: " + e.getMessage());
// //         }
// //     }

// //     public Map<String, Object> getInsightsDataFromDb(String uploadId) throws JsonProcessingException {
// //         UserPortfolioUploads up = userPortfolioUploadRepository
// //             .findByUploadId(uploadId)
// //             .orElseThrow(() -> new NoSuchElementException("No saved upload " + uploadId));
// //         String tablename = up.getPortfolioTableName();
// //         String prefix = up.getUserType().equals("corporate") ? "Corporate" : "user";
// //         String platform = up.getPlatform().replaceAll("\\s+", "");
// //         String portTbl = prefix + up.getUserID() + "_" + platform + "_portfolio_results";
// //         String txnTbl = prefix + up.getUserID() + "_" + platform + "_transcation";

// //         if ("Sample_AxisBank_portf".equals(tablename)) {
// //             portTbl = "Sample_AxisBank_portfolio_results";
// //             txnTbl = "Sample_AxisBank_transcation";
// //         }

// //         List<Map<String, Object>> portData = resultJdbcTemplate.queryForList("SELECT * FROM [" + portTbl + "]");
// //         List<Map<String, Object>> txnData = resultJdbcTemplate.queryForList("SELECT * FROM [" + txnTbl + "]");

// //         String results1Json = objectMapper.writeValueAsString(portData);
// //         String results2Json = objectMapper.writeValueAsString(txnData);

// //         return getLatestPortfolioInsights(results1Json);
// //     }

// //     public Map<String, Object> getLatestPortfolioInsights(String latestData) {
// //         Map<String, Object> result = new HashMap<>();
// //         try {
// //             File latestDataFile = File.createTempFile("latest_data", ".json");
// //             try (BufferedWriter writer = new BufferedWriter(new FileWriter(latestDataFile))) {
// //                 writer.write(latestData);
// //             }

// //             ProcessBuilder processBuilder = new ProcessBuilder(
// //                 "python3", "/app/PythonScript/Portfolio/PortfolioInsights.py",
// //                 latestDataFile.getAbsolutePath());
// //             processBuilder.redirectErrorStream(true);
// //             Process process = processBuilder.start();
// //             BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
// //             StringBuilder output = new StringBuilder();
// //             String line;
// //             while ((line = reader.readLine()) != null) {
// //                 System.out.println("Python Output: " + line);
// //                 output.append(line);
// //             }
// //             int exitCode = process.waitFor();
// //             if (exitCode == 0) {
// //                 ObjectMapper objectMapper = new ObjectMapper();
// //                 result = objectMapper.readValue(output.toString(), Map.class);
// //             } else {
// //                 result.put("error", "Python script failed.");
// //             }
// //             latestDataFile.delete();
// //         } catch (IOException | InterruptedException e) {
// //             result.put("error", "Error executing Python script: " + e.getMessage());
// //         }
// //         return result;
// //     }

// //     public Map<String, Object> ShortNseFileFromTable(String tableName) {
// //         try {
// //             List<Map<String, Object>> tableData = portfolioJdbcTemplate.queryForList("SELECT * FROM [" + tableName + "]");
// //             String jsonData = objectMapper.writeValueAsString(tableData);

// //             Path tempJsonFile = Files.createTempFile("short_nse_data_", ".json");
// //             Files.writeString(tempJsonFile, jsonData);

// //             ProcessBuilder pb = new ProcessBuilder("python3", "/app/PythonScript/Portfolio/ShortNseTable.py", tempJsonFile.toString());
// //             pb.redirectErrorStream(true);

// //             Process process = pb.start();
// //             BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
// //             StringBuilder output = new StringBuilder();
// //             String line;
// //             while ((line = reader.readLine()) != null) {
// //                 System.out.println("Python Output: " + line);
// //                 output.append(line);
// //             }

// //             int exitCode = process.waitFor();
// //             Files.deleteIfExists(tempJsonFile);

// //             if (exitCode == 0) {
// //                 return objectMapper.readValue(output.toString(), new TypeReference<>() {});
// //             } else {
// //                 return Map.of("error", "Python script failed.");
// //             }
// //         } catch (Exception e) {
// //             return Map.of("error", "Failed to process table: " + e.getMessage());
// //         }
// //     }

// //     public Map<String, Object> generatePortfBuild() {
// //         Map<String, Object> result = new HashMap<>();
// //         try {
// //             ProcessBuilder processBuilder = new ProcessBuilder(
// //                 "python3", "/app/PythonScript/Portfolio/OwnPortfolio.py"
// //             );
// //             processBuilder.redirectErrorStream(true);
// //             Process process = processBuilder.start();

// //             BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
// //             StringBuilder output = new StringBuilder();
// //             String line;
// //             while ((line = reader.readLine()) != null) {
// //                 System.out.println("Python Output: " + line);
// //                 output.append(line);
// //             }

// //             int exitCode = process.waitFor();
// //             if (exitCode != 0) {
// //                 result.put("error", "Python process exited with code " + exitCode);
// //                 return result;
// //             }

// //             ObjectMapper objectMapper = new ObjectMapper();
// //             try {
// //                 result = objectMapper.readValue(output.toString(), Map.class);
// //             } catch (com.fasterxml.jackson.core.JsonParseException e) {
// //                 result.put("error", "Invalid JSON from Python: " + e.getMessage());
// //             }
// //         } catch (IOException | InterruptedException e) {
// //             result.put("error", "Graph generation failed: " + e.getMessage());
// //         }
// //         return result;
// //     }

// //     public Map<String, Object> generateGraphs(String results1Json, String results2Json, String graphType) {
// //         Map<String, Object> result = new HashMap<>();
// //         try {
// //             Path tempFile1 = Files.createTempFile("results1", ".json");
// //             Path tempFile2 = Files.createTempFile("results2", ".json");
// //             ObjectMapper objectMapper = new ObjectMapper();
// //             Files.write(tempFile1, objectMapper.writeValueAsBytes(results1Json), StandardOpenOption.WRITE);
// //             Files.write(tempFile2, objectMapper.writeValueAsBytes(results2Json), StandardOpenOption.WRITE);
// //             ProcessBuilder processBuilder = new ProcessBuilder(
// //                 "python3", "/app/PythonScript/Portfolio/portfolio_visualizations.py",
// //                 tempFile1.toString(), tempFile2.toString(), graphType);
// //             processBuilder.redirectErrorStream(true);
// //             Process process = processBuilder.start();
// //             BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
// //             StringBuilder output = new StringBuilder();
// //             String line;
// //             while ((line = reader.readLine()) != null) {
// //                 System.out.println("Python Output: " + line);
// //                 output.append(line);
// //             }
// //             process.waitFor();
// //             ObjectMapper objectMapper1 = new ObjectMapper();
// //             result = objectMapper1.readValue(output.toString(), Map.class);
// //         } catch (IOException | InterruptedException e) {
// //             result.put("error", "Graph generation failed: " + e.getMessage());
// //         }
// //         return result;
// //     }

// //     public Map<String, Object> getGraphDataFromDb(String uploadId, String graphName) throws JsonProcessingException {
// //         UserPortfolioUploads up = userPortfolioUploadRepository
// //             .findByUploadId(uploadId)
// //             .orElseThrow(() -> new NoSuchElementException("No saved upload " + uploadId));

// //         String prefix = up.getUserType().equals("corporate") ? "Corporate" : "user";
// //         String platform = up.getPlatform().replaceAll("\\s+", "");
// //         String portTbl = prefix + up.getUserID() + "_" + platform + "_portfolio_results";
// //         String txnTbl = prefix + up.getUserID() + "_" + platform + "_transcation";

// //         String tablename = userPortfolioUploadRepository.findByUploadId(uploadId).map(record -> record.getPortfolioTableName()).orElse(null);
// //         if ("Sample_AxisBank_portf".equals(tablename)) {
// //             portTbl = "Sample_AxisBank_portfolio_results";
// //             txnTbl = "Sample_AxisBank_transcation";
// //         }

// //         List<Map<String, Object>> portData = resultJdbcTemplate.queryForList("SELECT * FROM [" + portTbl + "]");
// //         List<Map<String, Object>> txnData = resultJdbcTemplate.queryForList("SELECT * FROM [" + txnTbl + "]");

// //         String results1Json = objectMapper.writeValueAsString(portData);
// //         String results2Json = objectMapper.writeValueAsString(txnData);

// //         return generateGraphs(results1Json, results2Json, graphName);
// //     }
// // }




package com.example.prog.portfolio.serviceImpl;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.text.ParseException;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;

import java.util.Arrays;
import java.util.Base64;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;

import java.util.HashMap;

import java.util.HashSet;

import java.util.LinkedHashSet;

import java.util.List;

import java.util.Map;

import java.util.NoSuchElementException;

import java.util.Objects;

import java.util.Optional;

import java.util.Set;

import java.util.StringJoiner;

import java.util.concurrent.CompletableFuture;

import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Cell;

import org.apache.poi.ss.usermodel.CellType;

import org.apache.poi.ss.usermodel.DateUtil;

import org.apache.poi.ss.usermodel.Row;

import org.apache.poi.ss.usermodel.Sheet;

import org.apache.poi.ss.usermodel.Workbook;

import org.apache.poi.ss.usermodel.WorkbookFactory;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.beans.factory.annotation.Qualifier;

import org.springframework.jdbc.support.GeneratedKeyHolder;

import org.springframework.jdbc.support.KeyHolder;

import org.springframework.dao.DataAccessException;

import org.springframework.http.HttpEntity;

import org.springframework.http.HttpHeaders;

import org.springframework.http.MediaType;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.core.JdbcTemplate;

import org.springframework.scheduling.annotation.Async;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import org.springframework.web.client.RestTemplate;

import org.springframework.web.multipart.MultipartFile;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.input.BOMInputStream;
import java.util.Locale;



import com.example.prog.entity.UserDtls;

import com.example.prog.entity.portfolio.UserPortfolioUploads;

import com.example.prog.repository.UserRepository;

import com.example.prog.repository.portfolioRepo.UserPortfolioUploadRepository;

// import com.example.prog.exception.DuplicateFileUploadException;

import com.example.prog.token.DuplicateFileUploadException;



import com.fasterxml.jackson.core.JsonProcessingException;

import com.fasterxml.jackson.core.type.TypeReference;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.sqlserver.jdbc.SQLServerColumnEncryptionJavaKeyStoreProvider;
import com.example.prog.repository.portfolioRepo.TradeFileRecordHashRepository;

import com.example.prog.entity.portfolio.TradeFileRecordHash;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.slf4j.Logger;

import org.slf4j.LoggerFactory;
/////UserId Code---------------------


@Service
public class FileProcessingService {

    @Autowired
    private ColumnMappingService columnMappingService;

    @Autowired
    private UserRepository userRepository;            // ← NEW: to look up userId
    
    @Autowired
    @Qualifier("portfolioJdbcTemplate")
    private JdbcTemplate portfolioJdbcTemplate;
    
    @Autowired
    @Qualifier("resultJdbcTemplate")  // defined for CMDA_portf_Result
    private JdbcTemplate resultJdbcTemplate;

    @Autowired
    @Qualifier("ownPortfJdbcTemplate")  // defined for CMDA_Own_Portf
    private JdbcTemplate ownPortfJdbcTemplate;

    @Autowired
    private UserPortfolioUploadRepository userPortfolioUploadRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TradeFileRecordHashRepository tradeFileRecordHashRepository;

    @Async("taskExecutor")
    public CompletableFuture<Map<String, Object>> performColumnMappingAsync(MultipartFile file, String platform, String uploadId, int userID, boolean isCorporate , Map<String, String> customMapping, boolean saveData ) {
    	System.out.println("Running performColumnMappingAsync in thread: " + Thread.currentThread().getName());
    	try {
            return CompletableFuture.completedFuture(performColumnMapping(file, platform, uploadId, userID, isCorporate,customMapping,saveData));
        } catch (IOException e) {
            e.printStackTrace();
            return CompletableFuture.failedFuture(e);
        }
    }

    @Async("taskExecutor")
    public CompletableFuture<Map<String, Object>> processFileAsync(String mappedFilePath, String platform, String uploadId, int userID, boolean isCorporate, boolean saveData) {
    	System.out.println("Running processFileAsync in thread: " + Thread.currentThread().getName());
    	return CompletableFuture.completedFuture(processFile(mappedFilePath, platform, uploadId, userID, isCorporate, saveData));
    }

    @Async("taskExecutor")
    public CompletableFuture<String> createTableFromCsvAsync(Path csvPath, String platform, int userID, boolean isCorporate,List<Map<String, Object>> mappedData) {
    	 System.out.println("Running createTableFromCsvAsync in thread: " + Thread.currentThread().getName());
    	try {
            return CompletableFuture.completedFuture(createTableFromCsv(csvPath, platform, userID, isCorporate,mappedData));
        } catch (IOException e) {
            e.printStackTrace();
            // return a failed future or custom error message
            return CompletableFuture.failedFuture(e);
        }
    }


    public Map<String, Object> getGraphDataFromDb(
            String uploadId,
            String graphName) throws JsonProcessingException {

        // 1) find the upload row
        UserPortfolioUploads up = userPortfolioUploadRepository
            .findByUploadId(uploadId)
            .orElseThrow(() ->
                new NoSuchElementException("No saved upload " + uploadId));

        // 2) build table names
        // String prefix = up.getUserType().equals("corporate")
        //                 ? "Corporate" : "user";
        // String platform = up.getPlatform().replaceAll("\\s+", "");
        // String portTbl = prefix + up.getUserID() + "_" + platform + "_portfolio_results";
        // String txnTbl  = prefix + up.getUserID() + "_" + platform + "_transcation";
        
        // String tablename = userPortfolioUploadRepository.findByUploadId(uploadId).map(record -> record.getPortfolioTableName()).orElse(null); 

        String prefix = up.getUserType().equals("corporate")
                    ? "Corporate" : "user";
        String platform = up.getPlatform().replaceAll("\\s+", "");
        String baseTableName = prefix + up.getUserID() + "_" + platform;
        String portTbl = baseTableName + "_portfolio_results";
        String txnTbl = baseTableName + "_transcation";

        String tablename = up.getPortfolioTableName();

        if (tablename.contains("Temp")) {
        portTbl = "Temp_" + baseTableName + "_portfolio_results";
        txnTbl = "Temp_" + baseTableName + "_transcation";
        }
			
        if("Sample_AxisBank_portf".equals(tablename)) {
        	portTbl = "Sample_AxisBank_portfolio_results";
        	txnTbl  = "Sample_AxisBank_transcation";
        }
        // 3) query both tables
        List<Map<String, Object>> portData =
            resultJdbcTemplate.queryForList("SELECT * FROM [" + portTbl + "]");
        List<Map<String, Object>> txnData  =
            resultJdbcTemplate.queryForList("SELECT * FROM [" + txnTbl  + "]");

        // 4) to JSON
        String results1Json = objectMapper.writeValueAsString(portData);
        String results2Json = objectMapper.writeValueAsString(txnData);

        // 5) invoke your existing Python-based graph generator
        return generateGraphs(results1Json, results2Json, graphName);
    }
    

 private final Map<String, String> filePathMap = new ConcurrentHashMap<>();
 private final Map<String, Object> processingResultMap = new ConcurrentHashMap<>();

 
    private static final Logger logger = LoggerFactory.getLogger(FileProcessingService.class); 


// New Code performColumnMapping

public Map<String, Object> performCsvColumnMapping(
            MultipartFile file,
            String platform,
            String uploadId,
            int userId,
            boolean isCorporate,
            Map<String, String> customMapping, boolean saveData) throws IOException {

        logger.debug("Starting CSV column mapping for platform: {}", platform);

        Map<String, String> columnMapping;
        if ("Other".equalsIgnoreCase(platform)) {
            if (customMapping == null || customMapping.isEmpty()) {
                logger.warn("Custom mapping not provided for platform 'Other'");
                return Map.of("error", "Custom mapping required for platform 'Other'.");
            }
            columnMapping = customMapping;
        } else {
            columnMapping = columnMappingService.getMapping(platform);
            if (columnMapping == null || columnMapping.isEmpty()) {
                logger.warn("No mapping found for platform: {}", platform);
                return Map.of("error", "Invalid platform specified.");
            }
        }

        List<String> taxColumns = columnMappingService.getTaxColumns();
        Set<String> allExpectedColumns = new HashSet<>(columnMapping.values());
        List<Map<String, Object>> mappedData = new ArrayList<>();
        boolean aggregatedTaxesExistsInFile = columnMapping.containsValue("Aggregated_Taxes");
        int tradeDateParseCount = 0;

        Reader reader = new InputStreamReader(new BOMInputStream(file.getInputStream()), StandardCharsets.UTF_8);
        try (CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withTrim())) {

            Map<String, Integer> headerMap = csvParser.getHeaderMap();
            Map<String, String> reverseMap = new HashMap<>();
            for (Map.Entry<String, String> entry : columnMapping.entrySet()) {
                reverseMap.put(entry.getValue(), entry.getKey());
            }

            for (CSVRecord csvRecord : csvParser) {
                Map<String, Object> record = new HashMap<>();
                double aggregatedTaxes = 0;
                String tradeDateStr = null;
                String tradeTimeStr = null;

                for (String key : allExpectedColumns) {
                    String originalHeader = reverseMap.get(key);
                    String value = csvRecord.isMapped(originalHeader) ? csvRecord.get(originalHeader).trim() : "";

                    if ("Trade_Date".equals(key)) {
                        String formattedDate = "";
                        try {
                            logger.debug("Raw Trade_Date before parsing (row {}): '{}'", csvRecord.getRecordNumber(), value);
                            DateTimeFormatter formatter = new DateTimeFormatterBuilder()
                            	    .parseCaseInsensitive()
                            	    .appendOptional(DateTimeFormatter.ofPattern("MM/dd/yyyy"))
                                    .appendOptional(DateTimeFormatter.ofPattern("MM-d-yyyy"))
                                    .appendOptional(DateTimeFormatter.ofPattern("M/d/yyyy"))
                                    .appendOptional(DateTimeFormatter.ofPattern("M-d-yyyy"))

                                    .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm a"))
                                    .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a"))
                                    .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))
                                    .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))

                                    .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
                                    .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                                    .appendOptional(DateTimeFormatter.ofPattern("dd MMM yyyy"))
                                    .appendOptional(DateTimeFormatter.ofPattern("dd-MMM-yy"))
                                    .appendOptional(DateTimeFormatter.ofPattern("d-MMM-yy"))
                                    .appendOptional(DateTimeFormatter.ofPattern("d-M-yyyy"))
                                    .appendOptional(DateTimeFormatter.ofPattern("d/M/yyyy"))
                                    .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                                    .appendOptional(DateTimeFormatter.ofPattern("yyyy/MM/dd"))
                                    .appendOptional(DateTimeFormatter.ofPattern("MM-dd-yyyy"))
                                    .toFormatter(Locale.ENGLISH);
                            
                            LocalDate date = LocalDate.parse(value, formatter);
                            formattedDate = new SimpleDateFormat("dd-MM-yyyy")
                                .format(Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant()));

                            logger.debug("Formatted Trade_Date after parsing (row {}): '{}'", csvRecord.getRecordNumber(), formattedDate);
                            tradeDateParseCount++;
                        } catch (Exception e) {
                            logger.warn("Unable to parse Trade_Date '{}' at row {}: {}", value, csvRecord.getRecordNumber(), e.getMessage());
                        }
                        record.put("Trade_Date", formattedDate);
                        tradeDateStr = formattedDate;
                        continue;
                    }

                    if ("Trade_Time".equals(key)) {
                        tradeTimeStr = value;
                    }
                    
                    if ((key.equals("Brok_Amt") && value.isEmpty())) {
                        value = "0";
                    }

                    if ((key.equals("Exchange") && value.isEmpty())) {
                        value = "NSE";
                    }

                    record.put(key, value);
                }
                
                boolean shouldCalculateTaxes = true;
                if (aggregatedTaxesExistsInFile) {
                    String originalAggHeader = reverseMap.get("Aggregated_Taxes");
                    String aggVal = csvRecord.isMapped(originalAggHeader) ? csvRecord.get(originalAggHeader).trim() : "";

                    try {
                        if (!aggVal.isEmpty()) {
                            double val = Double.parseDouble(aggVal);
                            record.put("Aggregated_Taxes", val);
                            shouldCalculateTaxes = false;
                        }
                    } catch (NumberFormatException e) {
                        logger.debug("Invalid Aggregated_Taxes value '{}' at row {}: {}", aggVal, csvRecord.getRecordNumber(), e.getMessage());
                    }
                }

                if (shouldCalculateTaxes) {
                    aggregatedTaxes = 0;
                    for (String taxKey : taxColumns) {
                        String originalTaxHeader = reverseMap.get(taxKey);
                        String taxVal = csvRecord.isMapped(originalTaxHeader) ? csvRecord.get(originalTaxHeader).trim() : "0";
                        try {
                            aggregatedTaxes += Double.parseDouble(taxVal);
                        } catch (NumberFormatException e) {
                            logger.debug("Invalid tax value '{}' at row {}: {}", taxVal, csvRecord.getRecordNumber(), e.getMessage());
                        }
                    }
                    record.put("Aggregated_Taxes", aggregatedTaxes);
                }

                try {
                    if (tradeDateStr != null && !tradeDateStr.isEmpty()) {
                        LocalDate tradeDate = LocalDate.parse(tradeDateStr, DateTimeFormatter.ofPattern("dd-MM-yyyy"));

                        int year = tradeDate.getYear();
                        int month = tradeDate.getMonthValue();
                        int day = tradeDate.getDayOfMonth();

                        if (month <= 2) {
                            year -= 1;
                            month += 12;
                        }
                        int a = year / 100;
                        int b = a / 4;
                        int c = 2 - a + b;
                        int e = (int) (365.25 * (year + 4716));
                        int f = (int) (30.6001 * (month + 1));
                        double julianDate = c + day + e + f - 1524.5;

                        if (tradeTimeStr != null && !tradeTimeStr.isEmpty()) {
                            try {
                                double fractionOfDay;
                                if (tradeTimeStr.matches("\\d*\\.\\d+")) {
                                    fractionOfDay = Double.parseDouble(tradeTimeStr);
                                } else {
                                    LocalTime tradeTime = LocalTime.parse(tradeTimeStr, DateTimeFormatter.ofPattern("[HH:mm:ss][HH:mm]"));
                                    fractionOfDay = tradeTime.toSecondOfDay() / 86400.0;
                                }
                                julianDate += fractionOfDay;
                            } catch (Exception e1) {
                                logger.debug("Invalid Trade_Time format '{}' at row {}: {}", tradeTimeStr, csvRecord.getRecordNumber(), e1.getMessage());
                            }
                        }
                        record.put("Julian_Date", julianDate);
                    } else {
                        continue;
                    }
                } catch (Exception e) {
                    logger.warn("Invalid Trade_Date format '{}' at row {}, skipping row", tradeDateStr, csvRecord.getRecordNumber());
                    continue;
                }

                for (String expectedColumn : allExpectedColumns) {
                    if (!record.containsKey(expectedColumn)) {
                        record.put(expectedColumn, 0);
                    }
                }

                mappedData.add(record);
            }

            logger.info("Total Trade_Date values successfully parsed: {}", tradeDateParseCount);

            for (Map<String, Object> record : mappedData) {
                for (String taxColumn : taxColumns) {
                    record.remove(taxColumn);
                }
            }

            if (mappedData.isEmpty()) return Map.of("error", "No valid data rows processed.");

            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                StringBuilder sb = new StringBuilder();
                for (Map<String, Object> row : mappedData) {
                    for (String key : allExpectedColumns) {
                        sb.append(key).append(":" ).append(row.getOrDefault(key, "")).append(";");
                    }
                }
                byte[] hashBytes = digest.digest(sb.toString().getBytes(StandardCharsets.UTF_8));
                StringBuilder hexString = new StringBuilder();
                for (byte b : hashBytes) {
                    hexString.append(String.format("%02x", b));
                }
                String fileHash = hexString.toString();
                if(saveData) {
                Optional<TradeFileRecordHash> existingRecordOpt = tradeFileRecordHashRepository.findByUserIdAndPlatform(userId, platform);
                if (existingRecordOpt.isPresent()) {
                    TradeFileRecordHash existingRecord = existingRecordOpt.get();
                    if (existingRecord.getTradeFileHash().equals(fileHash)) {
                        throw new DuplicateFileUploadException("This file has already been uploaded.");
                    } else {
                        existingRecord.setTradeFileHash(fileHash);
                        existingRecord.setUploadId(uploadId);
                        tradeFileRecordHashRepository.save(existingRecord);
                    }
                } else {
                    TradeFileRecordHash newRecord = new TradeFileRecordHash(userId, platform, fileHash, uploadId);
                    tradeFileRecordHashRepository.save(newRecord);
                }
                }
            } catch (NoSuchAlgorithmException e) {
                logger.error("SHA-256 not available: {}", e.getMessage());
            }

            Path tempFilePath = Files.createTempFile("mapped_data_" + uploadId, ".csv");
            try {
                saveToCSV(tempFilePath, mappedData);
                filePathMap.put(uploadId, tempFilePath.toString());

                String tableName = createTableFromCsv(tempFilePath, platform, userId, isCorporate, mappedData);
                if (tableName == null || tableName.isBlank()) {
                    return Map.of("error", "Failed to create table from CSV.");
                }

                return Map.of("mappedFile", tempFilePath.toString(), "tableName", tableName);
            } catch (IOException e) {
                logger.error("CSV save failed: {}", e.getMessage(), e);
                return Map.of("error", "Failed to save CSV: " + e.getMessage());
            }
        } catch (IOException e) {
            logger.error("Error processing CSV file: {}", e.getMessage(), e);
            return Map.of("error", "CSV file processing failed: " + e.getMessage());
        }
    }


  public Map<String, Object> performColumnMapping(
            MultipartFile file,
            String platform,
            String uploadId,
            int userId,
            boolean isCorporate,
            Map<String, String> customMapping, boolean saveData) throws IOException {

        logger.debug("Starting column mapping for platform: {}", platform);

        Map<String, String> columnMapping;
        if ("Other".equalsIgnoreCase(platform)) {
            if (customMapping == null || customMapping.isEmpty()) {
                logger.warn("Custom mapping not provided for platform 'Other'");
                return Map.of("error", "Custom mapping required for platform 'Other'.");
            }
            columnMapping = customMapping;
            logger.debug("Using custom mapping: {}", columnMapping);
        } else {
            columnMapping = columnMappingService.getMapping(platform);
            if (columnMapping == null || columnMapping.isEmpty()) {
                logger.warn("No mapping found for platform: {}", platform);
                return Map.of("error", "Invalid platform specified.");
            }
            logger.debug("Fetched mapping for platform {}: {}", platform, columnMapping);
        }

        List<String> taxColumns = columnMappingService.getTaxColumns();
        Set<String> allExpectedColumns = new HashSet<>(columnMapping.values());
        Map<Integer, String> columnIndexMapping = new HashMap<>();
        Set<Integer> taxColumnIndices = new HashSet<>();
        Set<String> mappedColumns = new HashSet<>();
        List<Map<String, Object>> mappedData = new ArrayList<>();
        boolean aggregatedTaxesExistsInFile = false;

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null) return Map.of("error", "Invalid file format.");

            Row headerRow = sheet.getRow(0);
            if (headerRow == null) return Map.of("error", "No header row found.");

            // Header mapping
            for (Cell cell : headerRow) {
                String header = cell.getStringCellValue() != null ? cell.getStringCellValue().trim() : "";
                if (!header.isEmpty() && columnMapping.containsKey(header)) {
                    String mappedKey = columnMapping.get(header);
                    int colIndex = cell.getColumnIndex();

                    if ("Aggregated_Taxes".equals(mappedKey)) {
                        aggregatedTaxesExistsInFile = true;
                        columnIndexMapping.put(colIndex, mappedKey);
                        mappedColumns.add(mappedKey);
                    } else if (taxColumns.contains(mappedKey)) {
                        taxColumnIndices.add(colIndex);
                    } else {
                        columnIndexMapping.put(colIndex, mappedKey);
                        mappedColumns.add(mappedKey);
                    }
                }
            }

            if (columnIndexMapping.isEmpty() && taxColumnIndices.isEmpty()) {
                logger.warn("No valid columns mapped from header row.");
                return Map.of("error", "No valid columns mapped.");
            }

            // Row processing
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                Map<String, Object> record = new HashMap<>();
                double aggregatedTaxes = 0;
                String tradeDateStr = null;
                String tradeTimeStr = null;

                for (Map.Entry<Integer, String> entry : columnIndexMapping.entrySet()) {
                    Cell cell = row.getCell(entry.getKey(), Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    String columnName = entry.getValue();
                    Object value = getCellValue(cell);

                    if ("Trade_Date".equals(columnName)) {
                        String formattedDate = "";
                        try {
                            if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
                                // Excel date format
                                Date javaDate = cell.getDateCellValue();
                                formattedDate = new SimpleDateFormat("dd-MM-yyyy").format(javaDate);
                            } else {
                                // Handle string formats
                                String raw = value.toString().trim();

                                DateTimeFormatter formatter = new DateTimeFormatterBuilder()
                                    .parseCaseInsensitive()
                                    .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm a"))
                                    .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a"))
                                    .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))
                                    .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
                                    .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                                    .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy")) // fallback
                                    .appendOptional(DateTimeFormatter.ofPattern("dd-MMM-yy"))
                                    .appendOptional(DateTimeFormatter.ofPattern("dd MMM yyyy"))   // optional extra
                                    .appendOptional(DateTimeFormatter.ofPattern("MM-dd-yyyy"))     // optional extra
                                    .toFormatter(Locale.ENGLISH);
                                LocalDate date = LocalDate.parse(raw, formatter);
                                Date javaDate = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
                                formattedDate = new SimpleDateFormat("dd-MM-yyyy").format(javaDate);
                            }
                        } catch (Exception e) {
                            logger.warn("Unable to parse Trade_Date '{}' at row {}: {}", value, i, e.getMessage());
                            formattedDate = ""; // Ensure it's not missing
                        }

                        // ✅ Always include Trade_Date in the record (even if empty)
                        record.put("Trade_Date", formattedDate);
                        tradeDateStr = formattedDate;

                        continue; // Skip duplicate assignment below
                    }

                    if ("Trade_Time".equals(columnName)) {
                        tradeTimeStr = value != null ? value.toString() : null;
                    }

                    record.put(columnName, value);
                }

                if (!aggregatedTaxesExistsInFile) {
                    for (Integer taxIndex : taxColumnIndices) {
                        Cell taxCell = row.getCell(taxIndex, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                        Object taxValue = getCellValue(taxCell);
                        try {
                            aggregatedTaxes += Double.parseDouble(taxValue.toString());
                        } catch (NumberFormatException e) {
                            logger.debug("Invalid tax value '{}' at row {}, column {}: {}", taxValue, i, taxIndex, e.getMessage());
                        }
                    }
                    record.put("Aggregated_Taxes", aggregatedTaxes);
                }

                // Julian Date Calculation
                try {
                    if (tradeDateStr != null && !tradeDateStr.isEmpty()) {
                        LocalDate tradeDate;
                        if (tradeDateStr.matches("\\d+(\\.\\d+)?")) {
                            double serial = Double.parseDouble(tradeDateStr);
                            Date javaDate = DateUtil.getJavaDate(serial);
                            tradeDate = javaDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                        } else {
                            DateTimeFormatter formatter = new DateTimeFormatterBuilder()
                                .parseCaseInsensitive()
                                .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm a"))
                                .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a"))
                                .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))
                                .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
                                .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                                .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                                .appendOptional(DateTimeFormatter.ofPattern("dd-MMM-yy"))
                                .appendOptional(DateTimeFormatter.ofPattern("dd MMM yyyy"))   // optional extra
                                .appendOptional(DateTimeFormatter.ofPattern("MM-dd-yyyy"))     // optional extra
                                .toFormatter(Locale.ENGLISH);
                            tradeDate = LocalDate.parse(tradeDateStr, formatter);
                        }

                        int year = tradeDate.getYear();
                        int month = tradeDate.getMonthValue();
                        int day = tradeDate.getDayOfMonth();

                        if (month <= 2) {
                            year -= 1;
                            month += 12;
                        }
                        int a = year / 100;
                        int b = a / 4;
                        int c = 2 - a + b;
                        int e = (int) (365.25 * (year + 4716));
                        int f = (int) (30.6001 * (month + 1));
                        double julianDate = c + day + e + f - 1524.5;

                        if (tradeTimeStr != null && !tradeTimeStr.isEmpty()) {
                            try {
                                double fractionOfDay;
                                if (tradeTimeStr.matches("\\d*\\.\\d+")) {
                                    fractionOfDay = Double.parseDouble(tradeTimeStr);
                                } else {
                                    LocalTime tradeTime = LocalTime.parse(tradeTimeStr, DateTimeFormatter.ofPattern("[HH:mm:ss][HH:mm]"));
                                    fractionOfDay = tradeTime.toSecondOfDay() / 86400.0;
                                }
                                julianDate += fractionOfDay;
                            } catch (Exception e1) {
                                logger.debug("Invalid Trade_Time format '{}' at row {}: {}", tradeTimeStr, i, e1.getMessage());
                            }
                        }

                        record.put("Julian_Date", julianDate);
                    } else {
                        continue; // Skip row if no Trade_Date
                    }
                } catch (Exception e) {
                    logger.warn("Invalid Trade_Date format '{}' at row {}, skipping row", tradeDateStr, i);
                    continue;
                }

                for (String expectedColumn : allExpectedColumns) {
                    if (!record.containsKey(expectedColumn)) {
                        record.put(expectedColumn, 0);
                    }
                }

                mappedData.add(record);
            }

            // Remove tax columns from records
            for (Map<String, Object> record : mappedData) {
                for (String taxColumn : taxColumns) {
                    record.remove(taxColumn);
                }
            }

            if (mappedData.isEmpty()) return Map.of("error", "No valid data rows processed.");

            // Generate file-level hash
            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                StringBuilder sb = new StringBuilder();
                for (Map<String, Object> row : mappedData) {
                    for (String key : allExpectedColumns) {
                        sb.append(key).append(":").append(row.getOrDefault(key, "")).append(";");
                    }
                }
                byte[] hashBytes = digest.digest(sb.toString().getBytes(StandardCharsets.UTF_8));
                StringBuilder hexString = new StringBuilder();
                for (byte b : hashBytes) {
                    hexString.append(String.format("%02x", b));
                }
                String fileHash = hexString.toString();
                logger.debug("Generated file-level hash: {}", fileHash);
                
                if(saveData) {
                Optional<TradeFileRecordHash> existingRecordOpt = tradeFileRecordHashRepository.findByUserIdAndPlatform(userId, platform);
                
	                if (existingRecordOpt.isPresent()) {
	                    TradeFileRecordHash existingRecord = existingRecordOpt.get();
	                    if (existingRecord.getTradeFileHash().equals(fileHash)) {
	                        throw new DuplicateFileUploadException("This file has already been uploaded.");
	                    } else {
	                        existingRecord.setTradeFileHash(fileHash);
	                        existingRecord.setUploadId(uploadId);
	                        tradeFileRecordHashRepository.save(existingRecord);
	                    }
	                } else {
	                	
	                    TradeFileRecordHash newRecord = new TradeFileRecordHash(userId, platform, fileHash, uploadId);
	                    tradeFileRecordHashRepository.save(newRecord);
	                	
	                }
                }

            } catch (NoSuchAlgorithmException e) {
                logger.error("SHA-256 not available: {}", e.getMessage());
            }

            // Save CSV & create table
            Path tempFilePath = Files.createTempFile("mapped_data_" + uploadId, ".csv");
            try {
                saveToCSV(tempFilePath, mappedData);
                filePathMap.put(uploadId, tempFilePath.toString());

                String tableName = createTableFromCsv(tempFilePath, platform, userId, isCorporate, mappedData);
                if (tableName == null || tableName.isBlank()) {
                    return Map.of("error", "Failed to create table from CSV.");
                }

                return Map.of("mappedFile", tempFilePath.toString(), "tableName", tableName);
            } catch (IOException e) {
                logger.error("CSV save failed: {}", e.getMessage(), e);
                return Map.of("error", "Failed to save CSV: " + e.getMessage());
            }

        } catch (IOException e) {
            logger.error("Error processing Excel file: {}", e.getMessage(), e);
            return Map.of("error", "File processing failed: " + e.getMessage());
        }
    }

// New code createTableFromCsv

    public String createTableFromCsv(Path csvPath, String platform, int userId, boolean isCorporate, List<Map<String, Object>> mappedData) throws IOException {
    // Ensure encryption keys are setup before creating table
    setupEncryptionKeys();

    List<String> lines = Files.readAllLines(csvPath, StandardCharsets.UTF_8);
    if (lines.isEmpty()) {
        logger.error("CSV file is empty: {}", csvPath);
        throw new IllegalArgumentException("CSV file is empty.");
    }
    String firstLine = lines.get(0).replace("\uFEFF", ""); // Remove BOM
    String[] headers = firstLine.split(",", -1);
    String sanitizedPlatform = platform.replaceAll("\\s+", "");
    String tableNamePrefix = isCorporate ? "Corporate" : "user";
    String tableName = tableNamePrefix + userId + "_" + sanitizedPlatform + "_portf";
    Map<String, String> dataTypes = Map.of(
            "Exchange", "VARCHAR(100)",
            "Trade_Date", "DATE",
            "Order_Type", "VARCHAR(50)",
            "Qty", "FLOAT",
            "Scrip_Name", "VARCHAR(150)",
            "Brok_Amt", "FLOAT",
            "Aggregated_Taxes", "FLOAT",
            "Mkt_Price", "FLOAT",
            "Julian_Date", "FLOAT",
            "Hashcode", "VARCHAR(64) COLLATE Latin1_General_BIN2"
    );

    Set<String> encryptedColumns = Set.of("Exchange", "Trade_Date", "Order_Type", "Qty", "Scrip_Name", "Brok_Amt", "Aggregated_Taxes", "Mkt_Price");
    Set<String> deterministicEncryptedColumns = Set.of(); // No deterministic encryption

    try {
        String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
        Integer count = portfolioJdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);
        if (count == null || count == 0) {
            // Ensure all required columns are included
            Set<String> allColumns = new LinkedHashSet<>(Arrays.asList(headers));
            allColumns.addAll(Arrays.asList("Julian_Date", "Hashcode")); // Always include these
            List<String> columns = new ArrayList<>();
            for (String header : allColumns) {
                String colName = header.trim().replaceAll("\\s+", "_").replaceAll("[^a-zA-Z0-9_]", "");
                if (colName.isEmpty()) continue;
                String type = dataTypes.getOrDefault(colName, "VARCHAR(255)");
                String columnDef = "[" + colName + "] " + type;
                if (encryptedColumns.contains(colName)) {
                    columnDef += " ENCRYPTED WITH (COLUMN_ENCRYPTION_KEY = [NewCEK_portf_map], ENCRYPTION_TYPE = RANDOMIZED, ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256')";
                } else if (deterministicEncryptedColumns.contains(colName)) {
                    columnDef += " ENCRYPTED WITH (COLUMN_ENCRYPTION_KEY = [NewCEK_portf_map], ENCRYPTION_TYPE = DETERMINISTIC, ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256')";
                }
                columns.add(columnDef);
            }
            String sql = "CREATE TABLE [" + tableName + "] (" + String.join(", ", columns) + ")";
            logger.info("Creating table with SQL: {}", sql);
            portfolioJdbcTemplate.execute(sql);
            logger.info("Table '{}' created successfully.", tableName);
        }

        // Prepare insert SQL with all columns
        List<String> columnNames = new ArrayList<>();
        for (String header : headers) {
            String colName = header.trim().replaceAll("\\s+", "_").replaceAll("[^a-zA-Z0-9_]", "");
            if (!colName.isEmpty()) columnNames.add("[" + colName + "]");
        }
        columnNames.add("[Julian_Date]");
        columnNames.add("[Hashcode]");
        String colsJoined = String.join(",", columnNames);
        String placeholders = String.join(",", Collections.nCopies(columnNames.size(), "?"));
        String insertSQL = "INSERT INTO [" + tableName + "] (" + colsJoined + ") VALUES (" + placeholders + ")";

        // Process rows
        List<String[]> rows = lines.subList(1, lines.size()).stream()
                .map(line -> line.split(",", -1))
                .filter(row -> row.length == headers.length)
                .toList();
        SimpleDateFormat[] dateFormats = {
                new SimpleDateFormat("dd/MM/yyyy"),
                new SimpleDateFormat("dd-MM-yyyy"),
                new SimpleDateFormat("yyyy-MM-dd"),
                new SimpleDateFormat("MM/dd/yyyy"),
                new SimpleDateFormat("MM-dd-yyyy"),
                new SimpleDateFormat("dd MMM yyyy"),
                new SimpleDateFormat("dd-MMM-yy"),
                new SimpleDateFormat("d-MMM-yy"),
                new SimpleDateFormat("d-M-yyyy"),
                new SimpleDateFormat("d/M/yyyy")
        };

        for (int rowIndex = 0; rowIndex < rows.size(); rowIndex++) {
            String[] vals = rows.get(rowIndex);
            Object[] params = new Object[columnNames.size()];
            int paramIndex = 0;

            for (int i = 0; i < vals.length && i < headers.length; i++) {
                String rawHeader = headers[i].trim();
                String colName = rawHeader.replaceAll("\\s+", "_").replaceAll("[^a-zA-Z0-9_]", "");
                String value = (vals[i] != null ? vals[i].trim() : "");
                String columnType = dataTypes.getOrDefault(colName, "VARCHAR(255)");

                if ("Trade_Date".equalsIgnoreCase(colName)) {
                    java.sql.Date sqlDate = null;
                    if (value.matches("\\d+(\\.\\d+)?")) {
                        try {
                            double serial = Double.parseDouble(value);
                            java.util.Date javaDate = DateUtil.getJavaDate(serial);
                            sqlDate = new java.sql.Date(javaDate.getTime());
                        } catch (Exception e) {
                            logger.warn("Invalid Excel serial date '{}' at row {}: {}", value, rowIndex + 2, e.getMessage());
                        }
                    } else if (!value.isEmpty()) {
                        for (SimpleDateFormat format : dateFormats) {
                            try {
                                java.util.Date parsed = format.parse(value);
                                sqlDate = new java.sql.Date(parsed.getTime());
                                break;
                            } catch (ParseException ignored) {
                                // Try next format
                            }
                        }
                        if (sqlDate == null) {
                            logger.warn("Invalid Trade_Date format '{}' at row {}", value, rowIndex + 2);
                        }
                    }
                    params[paramIndex++] = sqlDate;
                } else if (columnType.equals("FLOAT")) {
                    Double doubleValue = null;
                    if (!value.isEmpty()) {
                        try {
                            doubleValue = Double.parseDouble(value);
                        } catch (NumberFormatException e) {
                            logger.warn("Invalid FLOAT value '{}' for column '{}' at row {}: {}", value, colName, rowIndex + 2, e.getMessage());
                            doubleValue = null; // Set to null for invalid numbers
                        }
                    }
                    params[paramIndex++] = doubleValue;
                } else {
                    params[paramIndex++] = value.isEmpty() ? null : value;
                }
            }

            // Add Julian_Date and Hashcode
            double julianDate = 0.0;
            String hash = "";
            if (rowIndex < mappedData.size()) {
                Map<String, Object> mappedRow = mappedData.get(rowIndex);
                Object julianObj = mappedRow.get("Julian_Date");
                if (julianObj instanceof Number) {
                    julianDate = ((Number) julianObj).doubleValue();
                }
                String qty = String.valueOf(mappedRow.getOrDefault("Qty", "")).trim();
                String brokAmt = String.valueOf(mappedRow.getOrDefault("Brok_Amt", "")).trim();
                String mktPrice = String.valueOf(mappedRow.getOrDefault("Mkt_Price", "")).trim();
                String agTax = String.valueOf(mappedRow.getOrDefault("Aggregated_Taxes", "")).trim();
                String tradeId = String.valueOf(mappedRow.getOrDefault("Trade_Id", "")).trim();
                String combined = qty + "|" + brokAmt + "|" + mktPrice + "|" + agTax + "|" + tradeId;
                hash = generateSHA256(combined);
            }
            params[paramIndex++] = julianDate;
            params[paramIndex++] = hash;

            // Check for duplicates
            String existsCheck = "SELECT COUNT(*) FROM [" + tableName + "] WHERE Julian_Date = ? AND Hashcode = ?";
            try {
                Integer exists = portfolioJdbcTemplate.queryForObject(existsCheck, new Object[]{julianDate, hash}, Integer.class);
                if (exists != null && exists > 0) {
                    logger.info("Skipping duplicate row {} with Julian_Date {} and Hashcode {}", rowIndex + 2, julianDate, hash);
                    continue;
                }
            } catch (Exception e) {
                logger.error("Error executing duplicate check for row {}: {}", rowIndex + 2, e.getMessage(), e);
                throw new SQLException("Duplicate check failed: " + e.getMessage(), e);
            }

            // Insert row
            logger.debug("Executing insert query: {} with params: {}", insertSQL, Arrays.toString(params));
            portfolioJdbcTemplate.update(insertSQL, params);
            logger.info("Inserted row {} into table '{}'", rowIndex + 2, tableName);
        }
        return tableName;
    } catch (Exception e) {
        logger.error("Failed to create or populate table '{}': {}", tableName, e.getMessage(), e);
        throw new IOException("Failed to create or populate table: " + e.getMessage(), e);
    }
}


        @PostConstruct
        public void setupEncryptionKeys() {
            String cmkName = "JavaCMK_portf_map";
            String cekName = "NewCEK_portf_map";
            String alias = "te-ed0c454c-6a94-4094-a9a2-db8f18b05ff7";
            String keyStoreLocation = System.getenv("KEYSTORE_LOCATION") != null 
                ? System.getenv("KEYSTORE_LOCATION") + "/CMK_portf_map.pfx"
                : "/app/keystore/CMK_portf_map.pfx";
            String keyStoreSecret = "admin@YC007star";
            String algorithm = "RSA_OAEP";
            String plainTextCek = "0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF";
            
            // Create CMK only if missing (no drop/recreate)
            String checkCmkSql = "SELECT COUNT(*) FROM sys.column_master_keys WHERE name = ?";
            Integer cmkCount = portfolioJdbcTemplate.queryForObject(checkCmkSql, Integer.class, cmkName);
            if (cmkCount == null || cmkCount == 0) {
                String createCmkSql = String.format(
                    "CREATE COLUMN MASTER KEY [%s] WITH (KEY_STORE_PROVIDER_NAME = 'MSSQL_JAVA_KEYSTORE', KEY_PATH = '%s')",
                    cmkName, alias);
                portfolioJdbcTemplate.execute(createCmkSql);
                logger.info("CMK '{}' created successfully.", cmkName);
            } else {
                // Just log existing (no provider check/drop to avoid errors)
                logger.info("CMK '{}' already exists (skipping creation).", cmkName);
            }

            // Create CEK only if missing (no drop)
            String checkCekSql = "SELECT COUNT(*) FROM sys.column_encryption_keys WHERE name = ?";
            Integer cekCount = portfolioJdbcTemplate.queryForObject(checkCekSql, Integer.class, cekName);
            if (cekCount == null || cekCount == 0) {
                String connectionUrl = "jdbc:sqlserver://168.231.121.219:1433;databaseName=CMDA_Portf_Map;" +
                                    "columnEncryptionSetting=Enabled;" +
                                    "keyStoreAuthentication=JavaKeyStorePassword;" +
                                    "keyStoreLocation=" + keyStoreLocation + ";" +
                                    "keyStoreSecret=" + keyStoreSecret + ";" +
                                    "keyStoreType=PKCS12;" +
                                    "trustServerCertificate=true;" +
                                    "encrypt=true;" +
                                    "user=kvm8_shreyad;password=Ayc2025Shreya";

                try (Connection conn = DriverManager.getConnection(connectionUrl);
                    Statement stmt = conn.createStatement()) {
                    SQLServerColumnEncryptionJavaKeyStoreProvider storeProvider =
                        new SQLServerColumnEncryptionJavaKeyStoreProvider(keyStoreLocation, keyStoreSecret.toCharArray());
                    byte[] plainCekBytes = hexStringToByteArray(plainTextCek.replace("0x", ""));
                    if (plainCekBytes.length != 32) {
                        throw new IllegalArgumentException("CEK must be 32 bytes for AEAD_AES_256_CBC_HMAC_SHA_256. Found: " + plainCekBytes.length);
                    }
                    byte[] encryptedCek = storeProvider.encryptColumnEncryptionKey(alias, algorithm, plainCekBytes);
                    String createCekSql = String.format(
                        "CREATE COLUMN ENCRYPTION KEY [%s] WITH VALUES (" +
                        "COLUMN_MASTER_KEY = [%s], ALGORITHM = '%s', ENCRYPTED_VALUE = 0x%s)",
                        cekName, cmkName, algorithm, byteArrayToHex(encryptedCek));
                    stmt.executeUpdate(createCekSql);
                    logger.info("CEK '{}' created successfully.", cekName);
                } catch (SQLException e) {
                    logger.error("CEK creation failed: {}", e.getMessage(), e);
                    throw new RuntimeException("CEK creation failed: " + e.getMessage(), e);
                }
            } else {
                logger.info("CEK '{}' already exists (skipping creation).", cekName);
            }
        }

// Helpers methods
        private byte[] hexStringToByteArray(String s) {
            int len = s.length();
            byte[] data = new byte[len / 2];
            for (int i = 0; i < len; i += 2) {
                data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4) + Character.digit(s.charAt(i + 1), 16));
            }
            return data;
        }

        private String byteArrayToHex(byte[] a) {
            StringBuilder sb = new StringBuilder(a.length * 2);
            for (byte b : a) {
                sb.append(String.format("%02x", b).toUpperCase());
            }
            return sb.toString();
        }

    private String generateSHA256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
//  New Code 

private void saveToCSV(Path filePath, List<Map<String, Object>> data) throws IOException {
    if (data.isEmpty()) return;
    // Fixed standard headers in order (for AxisBank/Excel; ignores extras for "Other")
    List<String> headers = Arrays.asList("Trade_Date", "Exchange", "Order_Type", "Qty", "Scrip_Name", "Brok_Amt", "Aggregated_Taxes", "Mkt_Price");
    try (BufferedWriter writer = Files.newBufferedWriter(filePath, StandardCharsets.UTF_8)) {
        writer.write(String.join(",", headers));
        writer.newLine();
        // Writing data rows
        for (Map<String, Object> row : data) {
            List<String> rowData = new ArrayList<>();
            for (String header : headers) {
                rowData.add(row.getOrDefault(header, "").toString());
            }
            writer.write(String.join(",", rowData));
            writer.newLine();
        }
    }
}
//     private void saveToCSV(Path filePath, List<Map<String, Object>> data) throws IOException {
// //      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//       try (BufferedWriter writer = Files.newBufferedWriter(filePath)) {
//           // ... (headers)
//       	 if (data.isEmpty()) return;
//       	   Set<String> headers = new LinkedHashSet<>(data.get(0).keySet());
// 	      	 headers.remove("Trade_Time");
// 	         headers.remove("Julian_Date");
// 	         headers.remove("Trade_Id");
//   	       writer.write(String.join(",", headers));
//   	       writer.newLine();
  	       
//              // Writing data rows
//              for (Map<String, Object> row : data) {
//                  List<String> rowData = new ArrayList<>();
//                  for (String header : headers) {
//                      rowData.add(row.get(header).toString());
//                  }
//                  writer.write(String.join(",", rowData));
//                  writer.newLine();
//              }          
//       }
//   }

// End code 

    private Object getCellValue(Cell cell) {
        switch (cell.getCellType()) {
            case STRING:  return cell.getStringCellValue();
            case NUMERIC: return cell.getNumericCellValue();
            case BOOLEAN: return cell.getBooleanCellValue();
            default:      return "";
        }
    } 
    
    public Map<String, Object> processFile(String mappedFilePath, String platform, String uploadId, int userId, boolean isCorporate, boolean isSaveData) {
        Map<String, Object> result = new HashMap<>();
        try {
//            ProcessBuilder processBuilder = new ProcessBuilder("python", "src/main/resources/Portfolio/process_file.py", mappedFilePath, platform);
        	ProcessBuilder processBuilder = new ProcessBuilder("python3", "/app/PythonScript/Portfolio/process_file.py", mappedFilePath, platform);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("Python Output: " + line);
                output.append(line);
            }

            if (process.waitFor() == 0) {
                ObjectMapper objectMapper = new ObjectMapper();
                result = objectMapper.readValue(output.toString(), new TypeReference<Map<String, Object>>() {});
                processingResultMap.put(uploadId, result);

                //  Save results in CMDA_portf_Result database
                saveResultToResultDb(result, platform, userId, isCorporate,isSaveData);
            } else {
                result.put("error", "Python script failed.");
            }

        } catch (IOException | InterruptedException e) {
            result.put("error", "File processing failed: " + e.getMessage());
        }
        return result;
    }


//     @SuppressWarnings("unchecked")
//     private void saveResultToResultDb(Map<String, Object> resultData,
//                                       String platform,
//                                       int userId,
//                                       boolean isCorporate,
//                                       boolean isSaveData) {

//         // 1) extract the two lists
//         List<Map<String, Object>> portfolioResults =
//             (List<Map<String, Object>>) resultData.get("portfolio_results");
//         List<Map<String, Object>> transactions =
//             (List<Map<String, Object>>) resultData.get("transactions");

// //        // 2) build table names
//         String prefix = isCorporate ? "Corporate" : "user";
//         String sanitizedPlatform = platform.replaceAll("\\s+", "");
//         String portTbl = prefix + userId +"_"+ sanitizedPlatform + "_portfolio_results";
//         String txnTbl  = prefix + userId +"_"+ sanitizedPlatform + "transactions";
// //

//         // 3) handle each table
//         if(isSaveData) {
// 	        createAndPopulate(portfolioResults, portTbl);
// 	        createAndPopulate(transactions, txnTbl);
//         }else {
//         	createAndPopulateTemp(portfolioResults, portTbl);
//         	createAndPopulateTemp(transactions, txnTbl);
//         }
//     }

        @SuppressWarnings("unchecked")
        private void saveResultToResultDb(Map<String, Object> resultData,
                                        String platform,
                                        int userId,
                                        boolean isCorporate,
                                        boolean isSaveData) {
            List<Map<String, Object>> portfolioResults =
                (List<Map<String, Object>>) resultData.get("portfolio_results");
            List<Map<String, Object>> transactions =
                (List<Map<String, Object>>) resultData.get("transactions");

            String prefix = isCorporate ? "Corporate" : "user";
            String sanitizedPlatform = platform.replaceAll("\\s+", "");
            String portTbl = prefix + userId + "_" + sanitizedPlatform + "_portfolio_results";
            // String txnTbl = prefix + userId + "_" + sanitizedPlatform + "_transaction";\
             String txnTbl = prefix + userId + "_" + sanitizedPlatform + "_transcation";

            if (isSaveData) {
                createAndPopulate(portfolioResults, portTbl);
                createAndPopulate(transactions, txnTbl);
            } else {
                createAndPopulateTemp(portfolioResults, portTbl);
                createAndPopulateTemp(transactions, txnTbl);
            }
        }


    // private void createAndPopulate(List<Map<String, Object>> rows, String tableName) {
    //     if (rows == null || rows.isEmpty()) return;
    //     String safeTbl = "[" + tableName + "]";

    //     try {
    //         // Define expected data types for known columns
    //         Map<String, String> columnTypes = Map.ofEntries(
    //             Map.entry("Date", "DATE"),
    //             Map.entry("Trade_Date", "DATE"),
    //             Map.entry("Scrip", "VARCHAR(150)"),
    //             Map.entry("Symbol", "VARCHAR(50)"),
    //             Map.entry("Remaining_Qty", "FLOAT"),
    //             Map.entry("Deployed_Amount", "FLOAT"),
    //             Map.entry("Market_Value", "FLOAT"),
    //             Map.entry("Unrealized_%_Return", "FLOAT"),
    //             Map.entry("Unrealized_PNL", "FLOAT"),
    //             Map.entry("Realized_PNL", "FLOAT"),
    //             Map.entry("Brokerage_Amount", "FLOAT"),
    //             Map.entry("Invested_Amount", "FLOAT"),
    //             Map.entry("Turn_Over_Amount", "FLOAT"),
    //             Map.entry("Exchange", "VARCHAR(100)"),
    //             Map.entry("Scrip_Name", "VARCHAR(150)"),
    //             Map.entry("Order_Type", "VARCHAR(50)"),
    //             Map.entry("Qty", "FLOAT"),
    //             Map.entry("Mkt_Price", "FLOAT"),
    //             Map.entry("Brok_Amt", "FLOAT"),
    //             Map.entry("Aggregated_Taxes", "FLOAT"),
    //             Map.entry("CustomQty", "FLOAT"),
    //             Map.entry("CumulativeQty", "FLOAT")
    //         );

    //         // Extract columns
    //         Set<String> keys = rows.get(0).keySet();
    //         StringBuilder ddl = new StringBuilder();

    //         // CREATE TABLE if not exists
    //         ddl.append("IF NOT EXISTS (SELECT * FROM sys.tables WHERE name='")
    //            .append(tableName).append("')\n")
    //            .append("  CREATE TABLE ").append(safeTbl).append(" (\n")
    //            .append("    id INT IDENTITY(1,1) PRIMARY KEY");

    //         for (String k : keys) {
    //             String col = k.replaceAll("\\s+", "_");
    //             String sqlType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");
    //             ddl.append(",\n    [").append(col).append("] ").append(sqlType);
    //         }

 
    //         ddl.append("\n);\n");

    //         // ALTER TABLE to add any missing columns
    //         for (String k : keys) {
    //             String col = k.replaceAll("\\s+", "_");
    //             String sqlType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");
    //             ddl.append("IF EXISTS (SELECT * FROM sys.tables WHERE name='")
    //                .append(tableName).append("')\n")
    //                .append("  AND NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS\n")
    //                .append("                   WHERE TABLE_NAME='").append(tableName)
    //                .append("' AND COLUMN_NAME='").append(col).append("')\n")
    //                .append("    ALTER TABLE ").append(safeTbl)
    //                .append(" ADD [").append(col).append("] ").append(sqlType).append(";\n");
    //         }

           
    //         resultJdbcTemplate.execute(ddl.toString());

    //         for (Map<String, Object> row : rows) {
    //             try {
    //                 List<String> cols = new ArrayList<>();
    //                 List<String> vals = new ArrayList<>();
                   

    //                 for (String k : keys) {
    //                     String col = k.replaceAll("\\s+", "_");
    //                     cols.add("[" + col + "]");

    //                     Object val = row.get(k);
    //                     String cleanedVal;

    //                     if (val == null) {
    //                         vals.add("NULL");
                           
    //                         continue;
    //                     }

    //                     String expectedType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");

    //                     if (expectedType.equals("DATE")) {
    //                         try {
    //                             String value = val.toString().trim();

    //                             if (value.matches("\\d+(\\.0+)?")) {
    //                                 double serial = Double.parseDouble(value);
    //                                 java.util.Date javaDate = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(serial);
    //                                 cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(javaDate);
    //                             } else if (value.matches("\\d{2}/\\d{2}/\\d{4}")) {
    //                                 java.util.Date parsedDate = new SimpleDateFormat("dd/MM/yyyy").parse(value);
    //                                 cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(parsedDate);
    //                             } else if (value.matches("\\d{2}-\\d{2}-\\d{4}")) {
    //                                 java.util.Date parsedDate = new SimpleDateFormat("dd-MM-yyyy").parse(value);
    //                                 cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(parsedDate);
    //                             } else {
    //                                 cleanedVal = value;
    //                             }

    //                             vals.add("'" + cleanedVal + "'");
    //                         } catch (Exception e) {
    //                             cleanedVal = val.toString().replace("'", "''");
    //                             vals.add("'" + cleanedVal + "'");
    //                         }
    //                     } else if (expectedType.startsWith("FLOAT") || expectedType.startsWith("INT")) {
    //                         cleanedVal = val.toString().replace(",", "");
    //                         vals.add(cleanedVal);
    //                     } else {
    //                         cleanedVal = val.toString().replace("'", "''");
    //                         vals.add("'" + cleanedVal + "'");
    //                     }
    //                 }

    //                 String insert = "INSERT INTO " + safeTbl +
    //                                 " (" + String.join(", ", cols) + ") VALUES (" + String.join(", ", vals) + ")";
    //                 resultJdbcTemplate.execute(insert);
    //             } catch (Exception e) {
    //                 e.printStackTrace(); // or log the error
    //             }
    //         }
    //     } catch (Exception ex) {
    //         ex.printStackTrace(); // or log the outer error
    //     }
    // }

private void createAndPopulate(List<Map<String, Object>> rows, String tableName) {
    if (rows == null || rows.isEmpty()) {
        logger.info("No rows to process for table '{}'", tableName);
        return;
    }
    String safeTbl = "[" + tableName + "]";

    try {
        // Define expected data types for known columns
        Map<String, String> columnTypes = Map.ofEntries(
            Map.entry("Date", "DATE"),
            Map.entry("Trade_Date", "DATE"),
            Map.entry("Scrip", "VARCHAR(150) COLLATE Latin1_General_BIN2"),
            Map.entry("Symbol", "VARCHAR(50) COLLATE Latin1_General_BIN2"),
            Map.entry("Remaining_Qty", "FLOAT"),
            Map.entry("Deployed_Amount", "FLOAT"),
            Map.entry("Market_Value", "FLOAT"),
            Map.entry("Unrealized_%_Return", "FLOAT"),
            Map.entry("Unrealized_PNL", "FLOAT"),
            Map.entry("Realized_PNL", "FLOAT"),
            Map.entry("Brokerage_Amount", "FLOAT"),
            Map.entry("Invested_Amount", "FLOAT"),
            Map.entry("Turn_Over_Amount", "FLOAT"),
            Map.entry("Exchange", "VARCHAR(100) COLLATE Latin1_General_BIN2"),
            Map.entry("Scrip_Name", "VARCHAR(150) COLLATE Latin1_General_BIN2"),
            Map.entry("Order_Type", "VARCHAR(50) COLLATE Latin1_General_BIN2"),
            Map.entry("Qty", "FLOAT"),
            Map.entry("Mkt_Price", "FLOAT"),
            Map.entry("Brok_Amt", "FLOAT"),
            Map.entry("Aggregated_Taxes", "FLOAT"),
            Map.entry("CustomQty", "FLOAT"),
            Map.entry("CumulativeQty", "FLOAT")
        );

        // Define encryption settings
        Set<String> randomizedEncryptedColumns = Set.of(
            "Remaining_Qty", "Deployed_Amount", "Market_Value",
            "Unrealized_%_Return", "Unrealized_PNL", "Realized_PNL", "Brokerage_Amount",
            "Invested_Amount", "Turn_Over_Amount", "Qty", "Mkt_Price", "Brok_Amt",
            "Aggregated_Taxes", "CustomQty", "CumulativeQty"
        );
        Set<String> deterministicEncryptedColumns = Set.of(
            "Date", "Trade_Date", "Scrip", "Symbol", "Exchange", "Scrip_Name", "Order_Type"
        );

        // Extract columns from the first row
        Set<String> keys = rows.get(0).keySet();
        StringBuilder ddl = new StringBuilder();

        // Log input column names for debugging
        logger.debug("Input column names for table '{}': {}", tableName, keys);

        // Validate input column names after sanitization
        for (String k : keys) {
            String sanitized_k = k.replaceAll("[^a-zA-Z0-9_%]", "_");
            if (!columnTypes.containsKey(sanitized_k)) {
                logger.warn("Sanitized column '{}' (original '{}') not found in columnTypes, will use default type NVARCHAR(MAX)", sanitized_k, k);
            }
        }

        // Drop the table if it exists to ensure correct encryption settings
        ddl.append("IF EXISTS (SELECT * FROM sys.tables WHERE name='")
           .append(tableName).append("')\n")
           .append("  DROP TABLE ").append(safeTbl).append(";\n");

        // CREATE TABLE
        ddl.append("CREATE TABLE ").append(safeTbl).append(" (\n")
           .append("    id INT IDENTITY(1,1) PRIMARY KEY");

        for (String k : keys) {
            String sanitized_k = k.replaceAll("[^a-zA-Z0-9_%]", "_");
            String col = sanitized_k;
            String sqlType = columnTypes.getOrDefault(sanitized_k, "NVARCHAR(MAX) COLLATE Latin1_General_BIN2");
            String columnDef = ",\n    [" + col + "] " + sqlType;
            if (randomizedEncryptedColumns.contains(sanitized_k)) {
                columnDef += " ENCRYPTED WITH (COLUMN_ENCRYPTION_KEY = [NewCEK_portf_results], ENCRYPTION_TYPE = RANDOMIZED, ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256')";
            } else if (deterministicEncryptedColumns.contains(sanitized_k)) {
                columnDef += " ENCRYPTED WITH (COLUMN_ENCRYPTION_KEY = [NewCEK_portf_results], ENCRYPTION_TYPE = DETERMINISTIC, ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256')";
            }
            ddl.append(columnDef);
        }
        ddl.append("\n);\n");

        // Execute DDL
        logger.debug("Executing DDL for table '{}': {}", tableName, ddl);
        resultJdbcTemplate.execute(ddl.toString());
        logger.info("Table '{}' created successfully.", tableName);

        // Verify encryption settings
        String verifySQL = "SELECT c.name, c.encryption_type_desc " +
                          "FROM sys.columns c " +
                          "JOIN sys.tables t ON c.object_id = t.object_id " +
                          "WHERE t.name = ?";
        List<Map<String, Object>> encryptionStatus = resultJdbcTemplate.queryForList(verifySQL, tableName);
        for (Map<String, Object> status : encryptionStatus) {
            String colName = (String) status.get("name");
            String encType = (String) status.get("encryption_type_desc");
            if (randomizedEncryptedColumns.contains(colName) && !"RANDOMIZED".equals(encType)) {
                logger.error("Column '{}' in table '{}' is not encrypted with RANDOMIZED (actual: {})", colName, tableName, encType);
                throw new SQLException("Column '" + colName + "' is not correctly encrypted in table '" + tableName + "'");
            } else if (deterministicEncryptedColumns.contains(colName) && !"DETERMINISTIC".equals(encType)) {
                logger.error("Column '{}' in table '{}' is not encrypted with DETERMINISTIC (actual: {})", colName, tableName, encType);
                throw new SQLException("Column '" + colName + "' is not correctly encrypted in table '" + tableName + "'");
            } else if ((randomizedEncryptedColumns.contains(colName) || deterministicEncryptedColumns.contains(colName)) && encType != null) {
                logger.info("Column '{}' in table '{}' is correctly encrypted with {}", colName, tableName, encType);
            }
        }

        // Prepare insert SQL
        List<String> cols = keys.stream()
            .map(k -> "[" + k.replaceAll("[^a-zA-Z0-9_%]", "_") + "]")
            .collect(Collectors.toList());
        String insertSQL = "INSERT INTO " + safeTbl +
                          " (" + String.join(", ", cols) + ") VALUES (" +
                          String.join(",", Collections.nCopies(cols.size(), "?")) + ")";

        // Prepare argTypes based on column order
        int[] argTypes = new int[keys.size()];
        int typeIndex = 0;
        for (String k : keys) {
            String sanitized_k = k.replaceAll("[^a-zA-Z0-9_%]", "_");
            String expectedType = columnTypes.getOrDefault(sanitized_k, "NVARCHAR(MAX)");
            if (expectedType.startsWith("DATE")) {
                argTypes[typeIndex] = Types.DATE;
            } else if (expectedType.startsWith("FLOAT")) {
                argTypes[typeIndex] = Types.DOUBLE;
            } else {
                argTypes[typeIndex] = Types.VARCHAR;
            }
            typeIndex++;
        }

        // Date formats for parsing
        SimpleDateFormat[] dateFormats = {
            new SimpleDateFormat("dd/MM/yyyy"),
            new SimpleDateFormat("dd-MM-yyyy"),
            new SimpleDateFormat("yyyy-MM-dd"),
            new SimpleDateFormat("MM/dd/yyyy"),
            new SimpleDateFormat("MM-dd-yyyy"),
            new SimpleDateFormat("dd MMM yyyy"),
            new SimpleDateFormat("dd-MMM-yy"),
            new SimpleDateFormat("d-MMM-yy"),
            new SimpleDateFormat("d-M-yyyy"),
            new SimpleDateFormat("d/M/yyyy")
        };

        for (int rowIndex = 0; rowIndex < rows.size(); rowIndex++) {
            Map<String, Object> row = rows.get(rowIndex);
            Object[] params = new Object[cols.size()];
            int paramIndex = 0;

            for (String k : keys) {
                String col = k.replaceAll("[^a-zA-Z0-9_%]", "_");
                Object val = row.get(k);
                String expectedType = columnTypes.getOrDefault(col, "NVARCHAR(MAX)");

                if (expectedType.startsWith("DATE")) {
                    java.sql.Date sqlDate = null;
                    if (val != null && !val.toString().trim().isEmpty()) {
                        String value = val.toString().trim();
                        logger.debug("Processing date value '{}' for column '{}' at row {}", value, k, rowIndex + 1);
                        if (value.matches("\\d+(\\.\\d+)?")) {
                            try {
                                double serial = Double.parseDouble(value);
                                java.util.Date javaDate = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(serial);
                                sqlDate = new java.sql.Date(javaDate.getTime());
                            } catch (NumberFormatException e) {
                                logger.error("Invalid Excel serial date '{}' for column '{}' at row {}: {}", value, k, rowIndex + 1, e.getMessage());
                                throw new SQLException("Invalid Excel serial date '" + value + "' for column '" + k + "' at row " + (rowIndex + 1));
                            }
                        } else {
                            for (SimpleDateFormat format : dateFormats) {
                                try {
                                    format.setLenient(false);
                                    java.util.Date parsed = format.parse(value);
                                    sqlDate = new java.sql.Date(parsed.getTime());
                                    break;
                                } catch (ParseException ignored) {
                                    // Try next format
                                }
                            }
                            if (sqlDate == null) {
                                logger.error("Invalid date format '{}' for column '{}' at row {}", value, k, rowIndex + 1);
                                throw new SQLException("Invalid date format '" + value + "' for column '" + k + "' at row " + (rowIndex + 1));
                            }
                        }
                    } else {
                        logger.debug("Null or empty date value for column '{}' at row {}", k, rowIndex + 1);
                    }
                    params[paramIndex++] = sqlDate;
                } else if (expectedType.startsWith("FLOAT")) {
                    Double doubleValue = null;
                    if (val != null && !val.toString().trim().isEmpty()) {
                        try {
                            String cleanedVal = val.toString().trim()
                                .replace(",", "")
                                .replace("%", "")
                                .replace(" ", "")
                                .replaceAll("[^0-9.\\-]", "");
                            doubleValue = Double.parseDouble(cleanedVal);
                        } catch (NumberFormatException e) {
                            logger.error("Invalid FLOAT value '{}' for column '{}' at row {}: {}", val, k, rowIndex + 1, e.getMessage());
                            throw new SQLException("Invalid FLOAT value '" + val + "' for column '" + k + "' at row " + (rowIndex + 1));
                        }
                    }
                    params[paramIndex++] = doubleValue;
                } else {
                    String stringValue = val != null ? val.toString().trim() : null;
                    params[paramIndex++] = stringValue;
                }
            }

            logger.debug("Insert params for table '{}', row {}: {}", tableName, rowIndex + 1, Arrays.toString(params));
            try {
                logger.debug("Executing insert for table '{}', row {}: {}", tableName, rowIndex + 1, insertSQL);
                resultJdbcTemplate.update(insertSQL, params, argTypes);
                logger.info("Inserted row {} into table '{}'", rowIndex + 1, tableName);
            } catch (Exception e) {
                logger.error("Failed to insert row {} into table '{}': {}", rowIndex + 1, tableName, e.getMessage(), e);
                throw new SQLException("Insert failed for row " + (rowIndex + 1) + ": " + e.getMessage(), e);
            }
        }
    } catch (Exception ex) {
        logger.error("Failed to create or populate table '{}': {}", tableName, ex.getMessage(), ex);
        throw new RuntimeException("Failed to create or populate table '" + tableName + "': " + ex.getMessage(), ex);
    }
}

 private void createAndPopulateTemp(List<Map<String, Object>> rows, String baseTableName) {
     if (rows == null || rows.isEmpty()) return;

     String tempTableName = "Temp_" + baseTableName;
     System.out.println(tempTableName);

     Map<String, String> columnTypes = Map.ofEntries(
         Map.entry("Date", "DATE"),
         Map.entry("Trade_Date", "DATE"),
         Map.entry("Scrip", "VARCHAR(150)"),
         Map.entry("Symbol", "VARCHAR(50)"),
         Map.entry("Remaining_Qty", "FLOAT"),
         Map.entry("Deployed_Amount", "FLOAT"),
         Map.entry("Market_Value", "FLOAT"),
         Map.entry("Unrealized_%_Return", "FLOAT"),
         Map.entry("Unrealized_PNL", "FLOAT"),
         Map.entry("Realized_PNL", "FLOAT"),
         Map.entry("Brokerage_Amount", "FLOAT"),
         Map.entry("Invested_Amount", "FLOAT"),
         Map.entry("Turn_Over_Amount", "FLOAT"),
         Map.entry("Exchange", "VARCHAR(100)"),
         Map.entry("Scrip_Name", "VARCHAR(150)"),
         Map.entry("Order_Type", "VARCHAR(50)"),
         Map.entry("Qty", "FLOAT"),
         Map.entry("Mkt_Price", "FLOAT"),
         Map.entry("Brok_Amt", "FLOAT"),
         Map.entry("Aggregated_Taxes", "FLOAT"),
         Map.entry("CustomQty", "FLOAT"),
         Map.entry("CumulativeQty", "FLOAT"),
         Map.entry("RowHash", "INT")
     );

     Set<String> keys = rows.get(0).keySet();
     StringBuilder ddl = new StringBuilder();

     try {
         ddl.append("IF OBJECT_ID('tempdb..").append(tempTableName).append("') IS NOT NULL DROP TABLE ").append(tempTableName).append(";\n");

         ddl.append("CREATE TABLE ").append(tempTableName).append(" (\n")
             .append("    id INT IDENTITY(1,1) PRIMARY KEY");

         for (String k : keys) {
             String col = k.replaceAll("\\s+", "_");
             String sqlType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");
             ddl.append(",\n    [").append(col).append("] ").append(sqlType);
         }

         ddl.append(",\n [RowHash] INT");
         ddl.append("\n);\n");

         // Execute CREATE TABLE
         resultJdbcTemplate.execute(ddl.toString());
     } catch (Exception e) {
         System.err.println("Error creating temp table: " + e.getMessage());
         e.printStackTrace();
         return;
     }

     for (Map<String, Object> row : rows) {
         try {
             List<String> cols = new ArrayList<>();
             List<String> vals = new ArrayList<>();
             StringBuilder hashSource = new StringBuilder();

             for (String k : keys) {
                 String col = k.replaceAll("\\s+", "_");
                 cols.add("[" + col + "]");
                 Object val = row.get(k);
                 String cleanedVal;

                 if (val == null) {
                     vals.add("NULL");
                     hashSource.append("null|");
                     continue;
                 }

                 String expectedType = columnTypes.getOrDefault(k, "NVARCHAR(MAX)");

                 try {
                     if (expectedType.equals("DATE")) {
                         String value = val.toString().trim();
                         if (value.matches("\\d+(\\.0+)?")) {
                             double serial = Double.parseDouble(value);
                             java.util.Date javaDate = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(serial);
                             cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(javaDate);
                         } else if (value.matches("\\d{2}/\\d{2}/\\d{4}")) {
                             java.util.Date parsedDate = new SimpleDateFormat("dd/MM/yyyy").parse(value);
                             cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(parsedDate);
                         } else if (value.matches("\\d{2}-\\d{2}-\\d{4}")) {
                             java.util.Date parsedDate = new SimpleDateFormat("dd-MM-yyyy").parse(value);
                             cleanedVal = new SimpleDateFormat("yyyy-MM-dd").format(parsedDate);
                         } else {
                             cleanedVal = value;
                         }
                         vals.add("'" + cleanedVal + "'");
                     } else if (expectedType.startsWith("FLOAT") || expectedType.startsWith("INT")) {
                         cleanedVal = val.toString().replace(",", "");
                         vals.add(cleanedVal);
                     } else {
                         cleanedVal = val.toString().replace("'", "''");
                         vals.add("'" + cleanedVal + "'");
                     }
                     hashSource.append(cleanedVal).append("|");
                 } catch (Exception e) {
                     cleanedVal = val.toString().replace("'", "''");
                     vals.add("'" + cleanedVal + "'");
                     hashSource.append(cleanedVal).append("|");
                 }
             }

             int rowHash = hashSource.toString().hashCode();
             cols.add("[RowHash]");
             vals.add(String.valueOf(rowHash));

             String insert = "INSERT INTO " + tempTableName + " (" +
                             String.join(", ", cols) + ") VALUES (" +
                             String.join(", ", vals) + ")";
             resultJdbcTemplate.execute(insert);
         } catch (Exception e) {
             System.err.println("Error inserting row into temp table: " + e.getMessage());
             e.printStackTrace();
         }
     }
 }
  

    
    public List<Map<String, Object>> getPortfolioResults(String tableName) {
        String query = "SELECT * FROM " + tableName;
        return resultJdbcTemplate.queryForList(query);
    }
    
    public Map<String, Object> getResultsByUploadId(String uploadId) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 1. Find user upload record
        	UserPortfolioUploads uploads = userPortfolioUploadRepository.findByUploadId(uploadId)
	                .orElseThrow(() -> new RuntimeException("Upload not found with ID: " + uploadId));

	        String portfolioTableName = uploads.getPortfolioTableName();

	       
	        String prefix = uploads.getUserType().equalsIgnoreCase("corporate") ? "Corporate" : "user";
	        String sanitizedPlatform = uploads.getPlatform().replaceAll("\\s+", "");
	        String baseTableName = prefix + uploads.getUserID() + "_" + sanitizedPlatform;

	        String resultTableName = baseTableName + "_portfolio_results";
	        String transactionTableName = baseTableName + "_transcation";

			if (portfolioTableName.contains("Temp")) {
				resultTableName = "Temp_" + baseTableName + "_portfolio_results";
				transactionTableName = "Temp_" + baseTableName + "_transcation";
			}
			if("Sample_AxisBank_portf".equals(portfolioTableName)) {
				resultTableName = "Sample_AxisBank_portfolio_results";
				transactionTableName = "Sample_AxisBank_transcation";
	        }       

            // 2. Fetch data from tables
			// 1. Get all results
			List<Map<String, Object>> portfolioResults = resultJdbcTemplate.queryForList("SELECT * FROM [" + resultTableName + "]");

			// 2. Find latest valid date
			Optional<String> maxDateOpt = portfolioResults.stream()
			    .map(row -> row.get("Date"))
			    .filter(Objects::nonNull)
			    .filter(val -> val instanceof java.util.Date || val instanceof java.sql.Timestamp || val instanceof String)
			    .map(val -> {
			        if (val instanceof String str) return str;
			        else if (val instanceof java.util.Date dt) return new SimpleDateFormat("yyyy-MM-dd").format(dt);
			        else return null;
			    })
			    .filter(Objects::nonNull)
			    .max(String::compareTo);

			// 3. Filter by max date and remaining qty > 0
			if (maxDateOpt.isPresent()) {
			    String maxDate = maxDateOpt.get();
			    portfolioResults = portfolioResults.stream()
			        .filter(row -> {
			            Object dateObj = row.get("Date");
			            String rowDate = (dateObj instanceof java.util.Date || dateObj instanceof java.sql.Timestamp)
			                    ? new SimpleDateFormat("yyyy-MM-dd").format(dateObj)
			                    : String.valueOf(dateObj);
			            Object remainingQtyObj = row.get("Remaining_Qty");
			            double qty = 0.0;
			            try {
			                qty = Double.parseDouble(String.valueOf(remainingQtyObj));
			            } catch (Exception e) {
			                // Ignore parse error
			            }
			            return maxDate.equals(rowDate) && qty > 0.0;
			        })
			        .collect(Collectors.toList());
			} else {
			    portfolioResults = List.of(); // No valid dates
			}


            List<Map<String, Object>> transactions = resultJdbcTemplate.queryForList("SELECT * FROM [" + transactionTableName + "]");

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            // Format date fields for portfolioResults
            portfolioResults.forEach(row -> {
                Object dateVal = row.get("Date");
                if (dateVal instanceof java.sql.Timestamp || dateVal instanceof java.util.Date) {
                    row.put("Date", sdf.format(dateVal));
                }

                Object tradeDate = row.get("Trade_Date");
                if (tradeDate instanceof java.sql.Timestamp || tradeDate instanceof java.util.Date) {
                    row.put("Trade_Date", sdf.format(tradeDate));
                }
            });

            // Format date fields for transactions (optional if needed)
            transactions.forEach(row -> {
                Object tradeDate = row.get("Trade_Date");
                if (tradeDate instanceof java.sql.Timestamp || tradeDate instanceof java.util.Date) {
                    row.put("Trade_Date", sdf.format(tradeDate));
                }
            });
            
            
            result.put("portfolio_results", portfolioResults);
            result.put("transactions", transactions);
        } catch (Exception e) {
            result.put("error", "Failed to fetch results: " + e.getMessage());
        }
        return result;
    }


    // Retrieve the mapped file path based on uploadId
    public String getMappedFilePath(String uploadId) {
        return filePathMap.get(uploadId);
    }
    
    public void deleteTemporaryTables(int userId, String platform, boolean isCorporate) {
        String tablePrefix = isCorporate ? "Corporate" : "user";
        String sanitizedPlatform = platform.replaceAll("\\s+", "");

        String portfTable = tablePrefix + userId + "_" + sanitizedPlatform + "_portf";
        String resultTable = tablePrefix + userId + "_portfolio_results";
        String transTable = tablePrefix + userId + "_transcation";

        try {
            portfolioJdbcTemplate.execute("DROP TABLE IF EXISTS [" + portfTable + "]");
            resultJdbcTemplate.execute("DROP TABLE IF EXISTS [" + resultTable + "]");
            resultJdbcTemplate.execute("DROP TABLE IF EXISTS [" + transTable + "]");

            System.out.println("Temporary tables dropped for user " + userId);
        } catch (Exception e) {
            System.err.println("Error while deleting temp tables: " + e.getMessage());
        }
    }
    
    public Map<String, Object> getInsightsDataFromDb(String uploadId) throws JsonProcessingException {
        // 1) Find upload row
        UserPortfolioUploads up = userPortfolioUploadRepository
            .findByUploadId(uploadId)
            .orElseThrow(() -> new NoSuchElementException("No saved upload " + uploadId));
        String tablename = up.getPortfolioTableName();
        // 2) Build table names
        // String prefix = up.getUserType().equals("corporate") ? "Corporate" : "user";
        // String platform = up.getPlatform().replaceAll("\\s+", "");
        // String portTbl = prefix + up.getUserID() + "_" + platform + "_portfolio_results";
        // String txnTbl  = prefix + up.getUserID() + "_" + platform + "_transcation";
        
        // 2) Build table names
        String prefix = up.getUserType().equals("corporate") ? "Corporate" : "user";
        String platform = up.getPlatform().replaceAll("\\s+", "");
        String baseTableName = prefix + up.getUserID() + "_" + platform;
        String portTbl = baseTableName + "_portfolio_results";
        String txnTbl = baseTableName + "_transcation";

        if (tablename.contains("Temp")) {
            portTbl = "Temp_" + baseTableName + "_portfolio_results";
            txnTbl = "Temp_" + baseTableName + "_transcation";
        }


        if("Sample_AxisBank_portf".equals(tablename)) {
        	portTbl = "Sample_AxisBank_portfolio_results";
        	txnTbl  = "Sample_AxisBank_transcation";
        }

        // 3) Query both tables
        List<Map<String, Object>> portData = resultJdbcTemplate.queryForList("SELECT * FROM [" + portTbl + "]");
        List<Map<String, Object>> txnData  = resultJdbcTemplate.queryForList("SELECT * FROM [" + txnTbl  + "]");

        // 4) Convert to JSON
        String results1Json = objectMapper.writeValueAsString(portData);
        String results2Json = objectMapper.writeValueAsString(txnData);

        // 5) Call insights generator
        return getLatestPortfolioInsights(results1Json);
    }

    public Map<String, Object> getLatestPortfolioInsights(String latestData) {
        Map<String, Object> result = new HashMap<>();
        try {
            File latestDataFile = File.createTempFile("latest_data", ".json");
            File transactionFile = File.createTempFile("transaction_data", ".json");
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(latestDataFile))) {
                writer.write(latestData);
            }

//            ProcessBuilder processBuilder = new ProcessBuilder("python", 
//                    "src/main/resources/Portfolio/PortfolioInsights.py", 
  	      ProcessBuilder processBuilder = new ProcessBuilder("python3", 
                  "/app/PythonScript/Portfolio/PortfolioInsights.py", 
                    latestDataFile.getAbsolutePath()); 
//                    transactionFile.getAbsolutePath());
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
            	 System.out.println("Python Output: " + line);
                output.append(line);
            }
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                ObjectMapper objectMapper = new ObjectMapper();
                result = objectMapper.readValue(output.toString(), Map.class);
            } else {
                result.put("error", "Python script failed.");
            }
            latestDataFile.delete();
            transactionFile.delete();
        } catch (IOException | InterruptedException e) {
            result.put("error", "Error executing Python script: " + e.getMessage());
        }
        return result;
    }
    
    public Map<String, Object> ShortNseFileFromTable(String tableName) {
        try {
            // 1. Fetch data
            List<Map<String, Object>> tableData = portfolioJdbcTemplate.queryForList("SELECT * FROM [" + tableName + "]");
            String jsonData = objectMapper.writeValueAsString(tableData);

            // 2. Write JSON to a temporary file
            Path tempJsonFile = Files.createTempFile("short_nse_data_", ".json");
            Files.writeString(tempJsonFile, jsonData);

            // 3. Call the Python script with the temp file path
//            ProcessBuilder pb = new ProcessBuilder("python", "src/main/resources/Portfolio/ShortNseTable.py", tempJsonFile.toString());
            ProcessBuilder pb = new ProcessBuilder("python3", "/app/PythonScript/Portfolio/ShortNseTable.py", tempJsonFile.toString());
            pb.redirectErrorStream(true);

            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("Python Output: " + line);
                output.append(line);
            }

            int exitCode = process.waitFor();

            // Clean up
            Files.deleteIfExists(tempJsonFile);

            if (exitCode == 0) {
                return objectMapper.readValue(output.toString(), new TypeReference<>() {});
            } else {
                return Map.of("error", "Python script failed.");
            }

        } catch (Exception e) {
            return Map.of("error", "Failed to process table: " + e.getMessage());
        }
    }

    
public Map<String, Object> generatePortfBuild() {
    Map<String, Object> result = new HashMap<>();
    try {
//        ProcessBuilder processBuilder = new ProcessBuilder(
//            "python", "src/main/resources/Portfolio/OwnPortfolio.py"
//        );
        ProcessBuilder processBuilder = new ProcessBuilder(
                "python3", "/app/PythonScript/Portfolio/OwnPortfolio.py"
            );
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        BufferedReader reader = new BufferedReader(
            new InputStreamReader(process.getInputStream())
        );
        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println("Python Output: " + line);
            output.append(line);
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            result.put("error", "Python process exited with code " + exitCode);
            return result;
        }

        ObjectMapper objectMapper = new ObjectMapper();
        // Safe parse with error reporting
        try {
            result = objectMapper.readValue(output.toString(), Map.class);
        } catch (com.fasterxml.jackson.core.JsonParseException e) {
            result.put("error", "Invalid JSON from Python: " + e.getMessage());
        }

    } catch (IOException | InterruptedException e) {
        result.put("error", "Graph generation failed: " + e.getMessage());
    }
    return result;
}

    public Map<String, Object> generateGraphs(String results1Json, String results2Json, String graphType) {
        Map<String, Object> result = new HashMap<>();
        try {
            Path tempFile1 = Files.createTempFile("results1", ".json");
            Path tempFile2 = Files.createTempFile("results2", ".json");    
            ObjectMapper objectMapper = new ObjectMapper();
            Files.write(tempFile1, objectMapper.writeValueAsBytes(results1Json), StandardOpenOption.WRITE);
            Files.write(tempFile2, objectMapper.writeValueAsBytes(results2Json), StandardOpenOption.WRITE);
            ProcessBuilder processBuilder = new ProcessBuilder(
//                "python", "src/main/resources/Portfolio/portfolio_visualizations.py",
            	"python3", "/app/PythonScript/Portfolio/portfolio_visualizations.py",
                tempFile1.toString(), tempFile2.toString(), graphType);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
            	System.out.println("Python Output: " + line);
                output.append(line);
            }
            process.waitFor();
            ObjectMapper objectMapper1 = new ObjectMapper();
            result = objectMapper1.readValue(output.toString(), Map.class);
        } catch (IOException | InterruptedException e) {
            result.put("error", "Graph generation failed: " + e.getMessage());
        }
        return result;
    }

  //Paper trading added by shreya  
    // Create a new empty portfolio (new table)
    public Map<String, Object> createNewPortfolio(int userId, boolean isCorporate) {
        try {
            String prefix = isCorporate ? "Corporate" : "user";

            // Find existing portfolios
            String tablePattern = prefix + userId + "_Own_%_portf";
            String checkTablesSql = "SELECT table_name FROM information_schema.tables WHERE table_name LIKE ?";
            List<String> tableNames = ownPortfJdbcTemplate.query(checkTablesSql, (rs, rowNum) -> rs.getString("table_name"), tablePattern);

            // Find max series number
            int maxSeries = 0;
            for (String tableName : tableNames) {
                int startIndex = tableName.indexOf("_Own_") + 5;
                int endIndex = tableName.lastIndexOf("_portf");
                if (startIndex > 0 && endIndex > startIndex) {
                    try {
                        int series = Integer.parseInt(tableName.substring(startIndex, endIndex));
                        maxSeries = Math.max(maxSeries, series);
                    } catch (NumberFormatException ignore) {}
                }
            }

            int nextSeries = maxSeries + 1;
            String newTableName = prefix + userId + "_Own_" + nextSeries + "_portf";

            // Define expected columns
            List<String> expectedColumns = List.of("Symbol", "Date", "Time", "OrderType", "Qty",
                                                  "Price", "MarketValue", "BrokerageAmount");
            Map<String, String> dataTypes = Map.of(
                "Symbol", "VARCHAR(100)",
                "Date", "DATE",
                "Time", "VARCHAR(8)",
                "OrderType", "VARCHAR(1)",
                "Qty", "FLOAT",
                "Price", "FLOAT",
                "MarketValue", "FLOAT",
                "BrokerageAmount", "FLOAT"
            );

            // Build CREATE TABLE SQL
            List<String> columns = new ArrayList<>();
            for (String col : expectedColumns) {
                columns.add("[" + col + "] " + dataTypes.get(col));
            }
            String sql = "CREATE TABLE [" + newTableName + "] (" + String.join(", ", columns) + ")";
            ownPortfJdbcTemplate.execute(sql);

            logger.info("Created new portfolio table: {}", newTableName);

            return Map.of(
                "status", "New portfolio created successfully",
                "portfolioName", String.valueOf(nextSeries),
                "tableName", newTableName,
                "series", nextSeries
            );

        } catch (Exception e) {
            logger.error("Failed to create new portfolio: {}", e.getMessage(), e);
            return Map.of("error", "Failed to create new portfolio: " + e.getMessage());
        }
    }

    private Map<String, String> getPaperTradeMapping() {
        Map<String, String> mapping = new HashMap<>();
        mapping.put("Symbol", "Symbol");
        mapping.put("Date", "Date");
        mapping.put("Time", "Time");
        mapping.put("OrderType", "OrderType");
        mapping.put("Qty", "Qty");
        mapping.put("Price", "Price");
        mapping.put("MarketValue", "MarketValue");
        mapping.put("BrokerageAmount", "BrokerageAmount");
        return mapping;
    }

    // Process paper trade data from JSON
    public Map<String, Object> processPaperTradeData(
            List<Map<String, Object>> tradeData,
            int userId,
            boolean isCorporate,
            String portfolioName) throws IOException {

        logger.debug("Processing paper trade data for userId: {}, isCorporate: {}, portfolioName: {}", userId, isCorporate, portfolioName);

        // Validate trade data
        if (tradeData == null || tradeData.isEmpty()) {
            logger.warn("No trade data provided");
            return Map.of("error", "No trade data provided");
        }

        if (portfolioName == null || portfolioName.trim().isEmpty()) {
            logger.warn("No portfolio name provided");
            return Map.of("error", "No portfolio name provided");
        }

        // Sanitize portfolioName to avoid invalid table name characters
        String sanitizedPortfolioName = portfolioName.replaceAll("[^a-zA-Z0-9_]", "");

        // Define expected columns
        List<String> expectedColumns = List.of("Symbol", "Date", "Time", "OrderType", "Qty",
                                              "Price", "MarketValue", "BrokerageAmount");

        // Validate each record
        List<Map<String, Object>> validatedData = new ArrayList<>();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        SimpleDateFormat sqlDateFormat = new SimpleDateFormat("yyyy-MM-dd");

        for (int i = 0; i < tradeData.size(); i++) {
            Map<String, Object> record = tradeData.get(i);
            Map<String, Object> validatedRecord = new HashMap<>();

            // Check for missing or invalid columns
            for (String col : expectedColumns) {
                if (!record.containsKey(col) || record.get(col) == null || record.get(col).toString().trim().isEmpty()) {
                    logger.warn("Missing or empty value for column {} in record {}", col, i);
                    return Map.of("error", "Missing or empty value for column " + col + " in record " + (i + 1));
                }
                validatedRecord.put(col, record.get(col));
            }

            // Validate and format Date
            String dateStr = record.get("Date").toString().trim();
            try {
                LocalDate date = LocalDate.parse(dateStr, dateFormatter);
                validatedRecord.put("Date", sqlDateFormat.format(java.util.Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant())));
            } catch (DateTimeParseException e) {
                logger.warn("Invalid Date format '{}' in record {}: {}", dateStr, i, e.getMessage());
                return Map.of("error", "Invalid Date format in record " + (i + 1) + ": " + dateStr);
            }

            // Validate Time
            String timeStr = record.get("Time").toString().trim();
            try {
                java.time.LocalTime.parse(timeStr, timeFormatter);
                validatedRecord.put("Time", timeStr);
            } catch (DateTimeParseException e) {
                logger.warn("Invalid Time format '{}' in record {}: {}", timeStr, i, e.getMessage());
                return Map.of("error", "Invalid Time format in record " + (i + 1) + ": " + timeStr);
            }

            // Validate OrderType
            String orderType = record.get("OrderType").toString().toString().trim();
            if (!orderType.equals("B") && !orderType.equals("S")) {
                logger.warn("Invalid OrderType '{}' in record {}", orderType, i);
                return Map.of("error", "Invalid OrderType in record " + (i + 1) + ": must be 'B' or 'S'");
            }

            // Validate numeric fields
            try {
                Double.parseDouble(record.get("Qty").toString().trim());
                Double.parseDouble(record.get("Price").toString().trim());
                Double.parseDouble(record.get("MarketValue").toString().trim());
                Double.parseDouble(record.get("BrokerageAmount").toString().trim());
            } catch (NumberFormatException e) {
                logger.warn("Invalid numeric value in record {}: {}", i, e.getMessage());
                return Map.of("error", "Invalid numeric value in record " + (i + 1));
            }

            validatedData.add(validatedRecord);
        }

        // Table name with portfolio name
        String prefix = isCorporate ? "Corporate" : "user";
        String tableName = prefix + userId + "_Own_" + sanitizedPortfolioName + "_portf";

        // Define column types
        Map<String, String> dataTypes = Map.of(
            "Symbol", "VARCHAR(100)",
            "Date", "DATE",
            "Time", "VARCHAR(8)",
            "OrderType", "VARCHAR(1)",
            "Qty", "FLOAT",
            "Price", "FLOAT",
            "MarketValue", "FLOAT",
            "BrokerageAmount", "FLOAT"
        );

        // Create table if not exists
        try {
            String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
            Integer count = ownPortfJdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);
            if (count == null || count == 0) {
                List<String> columns = new ArrayList<>();
                for (String col : expectedColumns) {
                    String type = dataTypes.get(col);
                    columns.add("[" + col + "] " + type);
                }
                String sql = "CREATE TABLE [" + tableName + "] (" + String.join(", ", columns) + ")";
                ownPortfJdbcTemplate.execute(sql);
                logger.info("Created table: {}", tableName);
            }
        } catch (BadSqlGrammarException e) {
            logger.error("Failed to create table '{}': {}", tableName, e.getMessage(), e);
            throw new IOException("Failed to create table: " + e.getMessage(), e);
        }

        // Insert data (append to existing table)
        String colsJoined = String.join(",", expectedColumns.stream().map(col -> "[" + col + "]").toList());
        for (Map<String, Object> record : validatedData) {
            try {
                StringJoiner valuesJoiner = new StringJoiner(",", "(", ")");
                for (String col : expectedColumns) {
                    Object value = record.get(col);
                    String columnType = dataTypes.get(col);
                    if (value == null) {
                        valuesJoiner.add("NULL");
                    } else if (columnType.startsWith("VARCHAR") || columnType.equals("DATE")) {
                        String strValue = value.toString().replace("'", "''");
                        valuesJoiner.add("'" + strValue + "'");
                    } else {
                        valuesJoiner.add(value.toString());
                    }
                }

                String insertSQL = "INSERT INTO [" + tableName + "] (" + colsJoined + ") VALUES " + valuesJoiner;
                ownPortfJdbcTemplate.execute(insertSQL);
            } catch (BadSqlGrammarException e) {
                logger.error("Error inserting record into {}: {}", tableName, e.getMessage(), e);
                throw new IOException("Failed to insert record: " + e.getMessage(), e);
            }
        }

        return Map.of(
            "status", "Paper trade data saved successfully",
            "tableName", tableName,
            "series", sanitizedPortfolioName
        );
    }

    // List saved paper trading portfolios (multiple tables per user) with table contents
    public List<Map<String, Object>> listPaperTradePortfolios(int userId, boolean isCorporate) {
        String prefix = isCorporate ? "Corporate" : "user";
        String tablePattern = prefix + userId + "_Own_%_portf";
        String checkTablesSql = "SELECT table_name FROM information_schema.tables WHERE table_name LIKE ?";
        List<String> tableNames = ownPortfJdbcTemplate.query(checkTablesSql, (rs, rowNum) -> rs.getString("table_name"), tablePattern);
        List<Map<String, Object>> portfolios = new ArrayList<>();
        for (String tableName : tableNames) {
            Map<String, Object> portfolio = new HashMap<>();
            portfolio.put("tableName", tableName);

            // Extract series from tableName
            int startIndex = tableName.indexOf("_Own_") + 5;
            int endIndex = tableName.lastIndexOf("_portf");
            String series = (startIndex > 4 && endIndex > startIndex) ? tableName.substring(startIndex, endIndex) : "unknown";
            portfolio.put("platform", "Own_" + series);
            // Fetch table contents
            String selectSql = "SELECT * FROM [" + tableName + "]";
            List<Map<String, Object>> tableData = ownPortfJdbcTemplate.queryForList(selectSql);
            portfolio.put("data", tableData);
            portfolios.add(portfolio);
        }
        return portfolios;
    }

    // Delete paper trading data (drop specific table)
    public Map<String, Object> deletePaperTradeData(int userId, boolean isCorporate, String portfolioName) {
        if (portfolioName == null || portfolioName.trim().isEmpty()) {
            logger.warn("No portfolio name provided for deletion");
            return Map.of("error", "No portfolio name provided");
        }
        // Sanitize portfolioName
        String sanitizedPortfolioName = portfolioName.replaceAll("[^a-zA-Z0-9_]", "");

        String prefix = isCorporate ? "Corporate" : "user";
        String tableName = prefix + userId + "_Own_" + sanitizedPortfolioName + "_portf";
        String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
        Integer count = ownPortfJdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);
        if (count == null || count == 0) {
            logger.warn("Table does not exist: {}", tableName);
            return Map.of("status", "Table does not exist");
        }
        try {
            String dropSql = "DROP TABLE [" + tableName + "]";
            ownPortfJdbcTemplate.execute(dropSql);
            logger.info("Dropped table: {}", tableName);
            return Map.of("status", "Paper trade data deleted successfully");
        } catch (BadSqlGrammarException e) {
            logger.error("Failed to drop table '{}': {}", tableName, e.getMessage(), e);
            return Map.of("error", "Failed to delete paper trade data: " + e.getMessage());
        }
    } 
} 
    // ------------------- End Paper trading ------------------------ 