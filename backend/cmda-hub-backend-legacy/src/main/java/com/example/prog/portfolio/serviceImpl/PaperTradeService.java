// package com.example.prog.portfolio.serviceImpl;

// import com.example.prog.entity.paperTrade.PaperTradeMapping;
// import com.example.prog.repository.paperTradeRepo.PaperTradeMappingRepository;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Qualifier;
// import org.springframework.dao.EmptyResultDataAccessException;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.stereotype.Service;

// import java.io.IOException;
// import java.math.BigDecimal;
// import java.text.SimpleDateFormat;
// import java.time.LocalDate;
// import java.time.ZoneId;
// import java.time.format.DateTimeFormatter;
// import java.time.format.DateTimeParseException;
// import java.util.*;
// import java.util.stream.Collectors;

// import org.springframework.transaction.annotation.Transactional;

// @Service
// public class PaperTradeService {

//     private static final Logger logger = LoggerFactory.getLogger(PaperTradeService.class);

//     @Autowired
//     @Qualifier("ownPortfJdbcTemplate")
//     private JdbcTemplate ownPortfJdbcTemplate;

//     @Autowired
//     private PaperTradeMappingRepository mappingRepo;

//     // --------------------------------------------------------------------
//     // 1. CREATE NEW PORTFOLIO
//     // --------------------------------------------------------------------
//     @Transactional
//     public Map<String, Object> createNewPortfolio(int userId, boolean isCorporate, String displayName, BigDecimal corpus) {
//         try {
//             String prefix = isCorporate ? "Corporate" : "user";
//             PaperTradeMapping.UserType userType = isCorporate
//                     ? PaperTradeMapping.UserType.corporate
//                     : PaperTradeMapping.UserType.individual;

//             // ---- find max series ------------------------------------------------
//             String tablePattern = prefix + userId + "_Own_%_portf";
//             String sql = "SELECT table_name FROM information_schema.tables WHERE table_name LIKE ?";
//             List<String> tables = ownPortfJdbcTemplate.query(sql,
//                     (rs, rowNum) -> rs.getString("table_name"), tablePattern);

//             int maxSeries = tables.stream()
//                     .mapToInt(t -> {
//                         int s = t.indexOf("_Own_") + 5;
//                         int e = t.lastIndexOf("_portf");
//                         if (s > 4 && e > s) {
//                             try { return Integer.parseInt(t.substring(s, e)); }
//                             catch (NumberFormatException ex) { return 0; }
//                         }
//                         return 0;
//                     })
//                     .max().orElse(0);

//             int nextSeries = maxSeries + 1;
//             String internalTableName = prefix + userId + "_Own_" + nextSeries + "_portf";

//             // ---- create physical table -----------------------------------------
//             createPhysicalTable(internalTableName);

//             // ---- default display name -------------------------------------------
//             if (displayName == null || displayName.trim().isEmpty()) {
//                 displayName = "Portfolio " + nextSeries;
//             } else {
//                 displayName = displayName.trim();
//             }

//             // ---- duplicate name check -------------------------------------------
//             if (mappingRepo.existsByUserIdAndUserTypeAndDisplayName(userId, userType, displayName)) {
//                 return Map.of("error", "Portfolio name already exists");
//             }

//             // Default corpus if not provided
//             if (corpus == null || corpus.compareTo(BigDecimal.ZERO) <= 0) {
//                 corpus = BigDecimal.valueOf(10000); // default ₹10,000
//             }

//             // ---- persist mapping ------------------------------------------------
//             PaperTradeMapping mapping = PaperTradeMapping.builder()
//                     .userId(userId)
//                     .userType(userType)
//                     .internalTableName(internalTableName)
//                     .displayName(displayName)
//                     .corpus(corpus)
//                     .build();
//             mappingRepo.save(mapping);

//             logger.info("Created portfolio: {} -> {}", internalTableName, displayName);

//             return Map.of(
//                 "status", "New portfolio created successfully",
//                 "series", nextSeries,
//                 "internalTableName", internalTableName,
//                 "displayName", displayName,
//                 "corpus", corpus
//             );

//         } catch (Exception e) {
//             logger.error("Failed to create portfolio", e);
//             return Map.of("error", "Failed to create portfolio: " + e.getMessage());
//         }
//     }

//     // --------------------------------------------------------------------
//     // 2. CREATE PHYSICAL TABLE
//     // --------------------------------------------------------------------
//     private void createPhysicalTable(String tableName) {
//         List<String> cols = List.of("ID", "Symbol", "Date", "Time", "OrderType", "Qty",
//                 "Price", "MarketValue", "BrokerageAmount");
//         Map<String, String> types = Map.of(
//                 "ID", "INT IDENTITY(1,1) PRIMARY KEY",
//                 "Symbol", "VARCHAR(100)",
//                 "Date", "DATE",
//                 "Time", "VARCHAR(8)",
//                 "OrderType", "VARCHAR(1)",
//                 "Qty", "FLOAT",
//                 "Price", "FLOAT",
//                 "MarketValue", "FLOAT",
//                 "BrokerageAmount", "FLOAT",
//                 "Frame", "VARCHAR(10)"
//         );

//         String sql = "CREATE TABLE [" + tableName + "] (" +
//                 cols.stream()
//                         .map(c -> "[" + c + "] " + types.get(c))
//                         .collect(Collectors.joining(", ")) +
//                 ")";
//         ownPortfJdbcTemplate.execute(sql);
//     }

//     // --------------------------------------------------------------------
//     // 3. LIST ALL PORTFOLIOS
//     // --------------------------------------------------------------------
//     public List<Map<String, Object>> listPaperTradePortfolios(int userId, boolean isCorporate) {
//         PaperTradeMapping.UserType userType = isCorporate
//                 ? PaperTradeMapping.UserType.corporate
//                 : PaperTradeMapping.UserType.individual;

//         List<PaperTradeMapping> mappings = mappingRepo.findByUserIdAndUserType(userId, userType);
//         List<Map<String, Object>> result = new ArrayList<>();

//         for (PaperTradeMapping m : mappings) {
//             String tableName = m.getInternalTableName();
//             String displayName = m.getDisplayName();

//             List<Map<String, Object>> rows = ownPortfJdbcTemplate.queryForList("SELECT * FROM [" + tableName + "]");

//             Map<String, Object> portfolio = new HashMap<>();
//             portfolio.put("displayName", displayName);
//             portfolio.put("internalTableName", tableName);
//             portfolio.put("series", extractSeries(tableName));
//             portfolio.put("data", rows);
//             result.add(portfolio);
//         }
//         return result;
//     }

//     private String extractSeries(String tableName) {
//         int s = tableName.indexOf("_Own_") + 5;
//         int e = tableName.lastIndexOf("_portf");
//         return (s > 4 && e > s) ? tableName.substring(s, e) : "unknown";
//     }

//     // --------------------------------------------------------------------
//     // 4. SAVE TRADE DATA
//     // --------------------------------------------------------------------
//     public Map<String, Object> processPaperTradeData(
//             List<Map<String, Object>> tradeData,
//             int userId,
//             boolean isCorporate,
//             String displayName) throws IOException {

//         if (tradeData == null || tradeData.isEmpty()) {
//             return Map.of("error", "No trade data provided");
//         }
//         if (displayName == null || displayName.trim().isEmpty()) {
//             return Map.of("error", "Portfolio display name is required");
//         }

//         PaperTradeMapping.UserType userType = isCorporate
//                 ? PaperTradeMapping.UserType.corporate
//                 : PaperTradeMapping.UserType.individual;

//         Optional<PaperTradeMapping> opt = mappingRepo
//                 .findByUserIdAndUserTypeAndDisplayName(userId, userType, displayName.trim());

//         if (opt.isEmpty()) {
//             return Map.of("error", "Portfolio not found: " + displayName);
//         }

//         String tableName = opt.get().getInternalTableName();

//         List<Map<String, Object>> validated = validateTradeData(tradeData, tableName);
//         if (validated == null) {
//             return Map.of("error", "Validation failed");
//         }

//         insertIntoTable(tableName, validated);

//         return Map.of(
//                 "status", "Paper trade data saved successfully",
//                 "displayName", displayName,
//                 "series", extractSeries(tableName)
//         );
//     }

//     // --------------------------------------------------------------------
//     // 5. VALIDATE EACH ROW (same logic you already had)
//     // --------------------------------------------------------------------
//     private List<Map<String, Object>> validateTradeData(List<Map<String, Object>> raw) {
//         List<String> required = List.of("Symbol", "Date", "Time", "OrderType", "Qty",
//                 "Price", "MarketValue", "BrokerageAmount");

//         DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
//         DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm:ss");
//         SimpleDateFormat sqlDate = new SimpleDateFormat("yyyy-MM-dd");

//         List<Map<String, Object>> out = new ArrayList<>();

//         for (int i = 0; i < raw.size(); i++) {
//             Map<String, Object> rec = raw.get(i);
//             Map<String, Object> clean = new HashMap<>();

//             // ---- mandatory columns ------------------------------------------------
//             for (String col : required) {
//                 Object v = rec.get(col);
//                 if (v == null || v.toString().trim().isEmpty()) {
//                     logger.warn("Missing {} in row {}", col, i + 1);
//                     return null;
//                 }
//                 clean.put(col, v);
//             }

//             // ---- Date ------------------------------------------------------------
//             try {
//                 LocalDate d = LocalDate.parse(rec.get("Date").toString().trim(), dateFmt);
//                 clean.put("Date", sqlDate.format(java.util.Date.from(d.atStartOfDay(ZoneId.systemDefault()).toInstant())));
//             } catch (DateTimeParseException ex) {
//                 logger.warn("Invalid date in row {}", i + 1);
//                 return null;
//             }

//             // ---- Time ------------------------------------------------------------
//             try {
//                 java.time.LocalTime.parse(rec.get("Time").toString().trim(), timeFmt);
//             } catch (DateTimeParseException ex) {
//                 logger.warn("Invalid time in row {}", i + 1);
//                 return null;
//             }

//             // ---- OrderType -------------------------------------------------------
//             String ot = rec.get("OrderType").toString().trim();
//             if (!ot.equals("B") && !ot.equals("S")) {
//                 logger.warn("Invalid OrderType {} in row {}", ot, i + 1);
//                 return null;
//             }

//             // ---- numeric ---------------------------------------------------------
//             try {
//                 Double.parseDouble(rec.get("Qty").toString().trim());
//                 Double.parseDouble(rec.get("Price").toString().trim());
//                 Double.parseDouble(rec.get("MarketValue").toString().trim());
//                 Double.parseDouble(rec.get("BrokerageAmount").toString().trim());
//             } catch (NumberFormatException ex) {
//                 logger.warn("Non-numeric value in row {}", i + 1);
//                 return null;
//             }

//             // ---- Determine Frame (Intraday / Interday)
//             String symbol = rec.get("Symbol").toString().trim();
//             String frame = determineFrame(tableName, symbol, tradeDate, ot);
//             clean.put("Frame", frame);

//             out.add(clean);
//         }
//         return out;
//     }

//     // --------------------------------------------------------------------
//     // Determin Frame helper method
//     // --------------------------------------------------------------------

//     private String determineFrame(String tableName, String symbol, LocalDate tradeDate, String orderType) {
//         String opposite = orderType.equals("B") ? "S" : "B";

//         String sql = "SELECT COUNT(*) FROM [" + tableName + "] " +
//                     "WHERE Symbol = ? AND Date = ? AND OrderType = ?";

//         try {
//             Integer count = ownPortfJdbcTemplate.queryForObject(sql,
//                     Integer.class, symbol, tradeDate, opposite);

//             return (count != null && count > 0) ? "Intraday" : "Interday";
//         } catch (Exception e) {
//             logger.warn("Error determining frame for {} on {}", symbol, tradeDate, e);
//             return "Interday"; // default safe
//         }
//     }
    

//     // --------------------------------------------------------------------
//     // 6. INSERT ROWS
//     // --------------------------------------------------------------------
//     private void insertIntoTable(String tableName, List<Map<String, Object>> rows) {
//         List<String> cols = List.of("Symbol", "Date", "Time", "OrderType", "Qty",
//                 "Price", "MarketValue", "BrokerageAmount", "Frame");

//         String colList = cols.stream().map(c -> "[" + c + "]").collect(Collectors.joining(", "));

//         for (Map<String, Object> r : rows) {
//             StringJoiner values = new StringJoiner(",", "(", ")");
//             for (String c : cols) {
//                 Object v = r.get(c);
//                 if (v == null) {
//                     values.add("NULL");
//                 } else if (c.equals("Symbol") || c.equals("Time") || c.equals("OrderType") || c.equals("Date")) {
//                     values.add("'" + v.toString().replace("'", "''") + "'");
//                 } else {
//                     values.add(v.toString());
//                 }
//             }
//             String sql = "INSERT INTO [" + tableName + "] (" + colList + ") VALUES " + values;
//             ownPortfJdbcTemplate.execute(sql);
//         }
//     }

//     // --------------------------------------------------------------------
//     // 7. DELETE PORTFOLIO
//     // --------------------------------------------------------------------
//     @Transactional
//     public Map<String, Object> deletePaperTradeData(int userId, boolean isCorporate, String displayName) {
//         if (displayName == null || displayName.trim().isEmpty()) {
//             return Map.of("error", "Display name is required");
//         }

//         PaperTradeMapping.UserType userType = isCorporate
//                 ? PaperTradeMapping.UserType.corporate
//                 : PaperTradeMapping.UserType.individual;

//         Optional<PaperTradeMapping> opt = mappingRepo
//                 .findByUserIdAndUserTypeAndDisplayName(userId, userType, displayName.trim());

//         if (opt.isEmpty()) {
//             return Map.of("error", "Portfolio not found");
//         }

//         PaperTradeMapping mapping = opt.get();
//         String tableName = mapping.getInternalTableName();

//         try {
//             ownPortfJdbcTemplate.execute("DROP TABLE [" + tableName + "]");
//             mappingRepo.delete(mapping);
//             logger.info("Deleted portfolio table: {}", tableName);
//             return Map.of("status", "Portfolio deleted successfully");
//         } catch (Exception e) {
//             logger.error("Failed to drop table {}", tableName, e);
//             return Map.of("error", "Failed to delete: " + e.getMessage());
//         }
//     }

//     // --------------------------------------------------------------------
//     // 7. RENAME PORTFOLIO
//     // --------------------------------------------------------------------

//         @Transactional
//         public Map<String, Object> renamePortfolio(int userId, boolean isCorporate, String oldName, String newName) {
//         if (oldName == null || oldName.trim().isEmpty() || newName == null || newName.trim().isEmpty()) {
//             return Map.of("error", "Both old and new names are required");
//         }
//         if (oldName.trim().equalsIgnoreCase(newName.trim())) {
//             return Map.of("error", "Old and new names cannot be the same");
//         }

//         PaperTradeMapping.UserType userType = isCorporate
//                 ? PaperTradeMapping.UserType.corporate
//                 : PaperTradeMapping.UserType.individual;

//         Optional<PaperTradeMapping> opt = mappingRepo
//                 .findByUserIdAndUserTypeAndDisplayName(userId, userType, oldName.trim());

//         if (opt.isEmpty()) {
//             return Map.of("error", "Portfolio not found: " + oldName);
//         }

//         if (mappingRepo.existsByUserIdAndUserTypeAndDisplayName(userId, userType, newName.trim())) {
//             return Map.of("error", "Portfolio name already exists: " + newName);
//         }

//         PaperTradeMapping mapping = opt.get();
//         mapping.setDisplayName(newName.trim());
//         mappingRepo.save(mapping);

//         logger.info("Renamed portfolio: {} -> {}", oldName, newName);
//         return Map.of("status", "Renamed successfully", "newName", newName.trim());
//     }

//     // --------------------------------------------------------------------
//     // 7. DELETE TRANSCATION PORTFOLIO
//     // --------------------------------------------------------------------

//     @Transactional
//     public Map<String, Object> deleteTransaction(int userId, boolean isCorporate, String displayName, Integer transactionId) {
//         PaperTradeMapping.UserType userType = isCorporate
//                 ? PaperTradeMapping.UserType.corporate
//                 : PaperTradeMapping.UserType.individual;

//         Optional<PaperTradeMapping> opt = mappingRepo
//                 .findByUserIdAndUserTypeAndDisplayName(userId, userType, displayName.trim());

//         if (opt.isEmpty()) {
//             return Map.of("error", "Portfolio not found");
//         }

//         String tableName = opt.get().getInternalTableName();

//         // Fetch transaction
//         String sql = "SELECT OrderType, Symbol, Qty, Date FROM [" + tableName + "] WHERE ID = ?";
//         Map<String, Object> tx;
//         try {
//             tx = ownPortfJdbcTemplate.queryForMap(sql, transactionId);
//         } catch (Exception e) {
//             return Map.of("error", "Transaction not found");
//         }

//         String orderType = (String) tx.get("OrderType");
//         String symbol = (String) tx.get("Symbol");
//         double qty = (double) tx.get("Qty");
//         java.sql.Date date = (java.sql.Date) tx.get("Date");

//         if ("B".equals(orderType)) {
//             // Delete Buy → Delete all associated Sells (FIFO)
//             deleteAssociatedSells(tableName, symbol, date, qty);
//         } else if ("S".equals(orderType)) {
//             // Delete Sell → Reduce from earliest Buy
//             reduceBuyQuantity(tableName, symbol, date, qty);
//         }

//         // Finally delete the transaction itself
//         ownPortfJdbcTemplate.update("DELETE FROM [" + tableName + "] WHERE ID = ?", transactionId);

//         return Map.of("status", "Transaction deleted successfully");
//     }

//     private void deleteAssociatedSells(String tableName, String symbol, java.sql.Date buyDate, double buyQty) {
//         String sql = "SELECT ID, Qty FROM [" + tableName + "] " +
//                     "WHERE Symbol = ? AND OrderType = 'S' AND Date >= ? " +
//                     "ORDER BY Date ASC, Time ASC, ID ASC";

//         List<Map<String, Object>> sells = ownPortfJdbcTemplate.queryForList(sql, symbol, buyDate);
//         double remaining = buyQty;

//         for (Map<String, Object> sell : sells) {
//             if (remaining <= 0) break;
//             double sellQty = (double) sell.get("Qty");
//             int sellId = (int) sell.get("ID");

//             if (sellQty <= remaining) {
//                 ownPortfJdbcTemplate.update("DELETE FROM [" + tableName + "] WHERE ID = ?", sellId);
//                 remaining -= sellQty;
//             } else {
//                 ownPortfJdbcTemplate.update(
//                     "UPDATE [" + tableName + "] SET Qty = Qty - ? WHERE ID = ?", remaining, sellId);
//                 remaining = 0;
//             }
//         }
//     }

//     private void reduceBuyQuantity(String tableName, String symbol, java.sql.Date sellDate, double sellQty) {
//         String sql = "SELECT ID, Qty FROM [" + tableName + "] " +
//                     "WHERE Symbol = ? AND OrderType = 'B' AND Date <= ? " +
//                     "ORDER BY Date ASC, Time ASC, ID ASC";

//         List<Map<String, Object>> buys = ownPortfJdbcTemplate.queryForList(sql, symbol, sellDate);
//         double remaining = sellQty;

//         for (Map<String, Object> buy : buys) {
//             if (remaining <= 0) break;
//             double buyQty = (double) buy.get("Qty");
//             int buyId = (int) buy.get("ID");

//             if (buyQty <= remaining) {
//                 ownPortfJdbcTemplate.update("DELETE FROM [" + tableName + "] WHERE ID = ?", buyId);
//                 remaining -= buyQty;
//             } else {
//                 ownPortfJdbcTemplate.update(
//                     "UPDATE [" + tableName + "] SET Qty = Qty - ? WHERE ID = ?", remaining, buyId);
//                 remaining = 0;
//             }
//         }
//     }
// }


package com.example.prog.portfolio.serviceImpl;

import com.example.prog.entity.paperTrade.PaperTradeMapping;
import com.example.prog.repository.paperTradeRepo.PaperTradeMappingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PaperTradeService {

    private static final Logger logger = LoggerFactory.getLogger(PaperTradeService.class);

    @Autowired
    @Qualifier("ownPortfJdbcTemplate")
    private JdbcTemplate ownPortfJdbcTemplate;

    @Autowired
    private PaperTradeMappingRepository mappingRepo;

    /* --------------------------------------------------------------- */
    /* 1. CREATE NEW PORTFOLIO                                         */
    /* --------------------------------------------------------------- */
    @Transactional
    public Map<String, Object> createNewPortfolio(int userId, boolean isCorporate,
                                                  String displayName, BigDecimal corpus) {
        try {
            String prefix = isCorporate ? "Corporate" : "user";
            PaperTradeMapping.UserType userType = isCorporate
                    ? PaperTradeMapping.UserType.corporate
                    : PaperTradeMapping.UserType.individual;

            // ---- find max series ------------------------------------------------
            String tablePattern = prefix + userId + "_Own_%_portf";
            String sql = "SELECT table_name FROM information_schema.tables WHERE table_name LIKE ?";
            List<String> tables = ownPortfJdbcTemplate.query(sql,
                    (rs, rowNum) -> rs.getString("table_name"), tablePattern);

            int maxSeries = tables.stream()
                    .mapToInt(t -> {
                        int s = t.indexOf("_Own_") + 5;
                        int e = t.lastIndexOf("_portf");
                        if (s > 4 && e > s) {
                            try { return Integer.parseInt(t.substring(s, e)); }
                            catch (NumberFormatException ex) { return 0; }
                        }
                        return 0;
                    })
                    .max().orElse(0);

            int nextSeries = maxSeries + 1;
            String internalTableName = prefix + userId + "_Own_" + nextSeries + "_portf";

            // ---- create physical table -----------------------------------------
            createPhysicalTable(internalTableName);

            // ---- default display name -------------------------------------------
            if (displayName == null || displayName.trim().isEmpty()) {
                displayName = "Portfolio " + nextSeries;
            } else {
                displayName = displayName.trim();
            }

            // ---- duplicate name check -------------------------------------------
            if (mappingRepo.existsByUserIdAndUserTypeAndDisplayName(userId, userType, displayName)) {
                return Map.of("error", "Portfolio name already exists");
            }

            // Default corpus
            if (corpus == null || corpus.compareTo(BigDecimal.ZERO) <= 0) {
                corpus = BigDecimal.valueOf(10_000);
            }

            // ---- persist mapping ------------------------------------------------
            PaperTradeMapping mapping = PaperTradeMapping.builder()
                    .userId(userId)
                    .userType(userType)
                    .internalTableName(internalTableName)
                    .displayName(displayName)
                    .corpus(corpus)
                    .build();
            mappingRepo.save(mapping);

            logger.info("Created portfolio: {} -> {}", internalTableName, displayName);
            return Map.of(
                    "status", "New portfolio created successfully",
                    "series", nextSeries,
                    "internalTableName", internalTableName,
                    "displayName", displayName,
                    "corpus", corpus
            );

        } catch (Exception e) {
            logger.error("Failed to create portfolio", e);
            return Map.of("error", "Failed to create portfolio: " + e.getMessage());
        }
    }

    /* --------------------------------------------------------------- */
    /* 2. CREATE PHYSICAL TABLE (with ID + Frame)                     */
    /* --------------------------------------------------------------- */
    private void createPhysicalTable(String tableName) {
        List<String> cols = List.of(
                "ID", "Symbol", "Date", "Time", "OrderType", "Qty",
                "Price", "MarketValue", "BrokerageAmount", "Frame"
        );
        Map<String, String> types = Map.of(
                "ID", "INT IDENTITY(1,1) PRIMARY KEY",
                "Symbol", "VARCHAR(100)",
                "Date", "DATE",
                "Time", "VARCHAR(8)",
                "OrderType", "VARCHAR(1)",
                "Qty", "FLOAT",
                "Price", "FLOAT",
                "MarketValue", "FLOAT",
                "BrokerageAmount", "FLOAT",
                "Frame", "VARCHAR(10)"
        );

        String sql = "CREATE TABLE [" + tableName + "] (" +
                cols.stream()
                        .map(c -> "[" + c + "] " + types.get(c))
                        .collect(Collectors.joining(", ")) +
                ")";
        ownPortfJdbcTemplate.execute(sql);
    }

    /* --------------------------------------------------------------- */
    /* 3. LIST ALL PORTFOLIOS                                          */
    /* --------------------------------------------------------------- */
    public List<Map<String, Object>> listPaperTradePortfolios(int userId, boolean isCorporate) {
        PaperTradeMapping.UserType userType = isCorporate
                ? PaperTradeMapping.UserType.corporate
                : PaperTradeMapping.UserType.individual;

        List<PaperTradeMapping> mappings = mappingRepo.findByUserIdAndUserType(userId, userType);
        List<Map<String, Object>> result = new ArrayList<>();

        for (PaperTradeMapping m : mappings) {
            String tableName = m.getInternalTableName();
            String displayName = m.getDisplayName();
            BigDecimal corpus = m.getCorpus();
            int corpusValue = (corpus != null) ? corpus.intValue() : 100000;

            List<Map<String, Object>> rows = ownPortfJdbcTemplate.queryForList(
                    "SELECT * FROM [" + tableName + "]");

            Map<String, Object> portfolio = new HashMap<>();
            portfolio.put("displayName", displayName);
            portfolio.put("internalTableName", tableName);
            portfolio.put("series", extractSeries(tableName));
            portfolio.put("corpus", corpusValue);
            portfolio.put("data", rows);
            result.add(portfolio);
        }
        return result;
    }

    private String extractSeries(String tableName) {
        int s = tableName.indexOf("_Own_") + 5;
        int e = tableName.lastIndexOf("_portf");
        return (s > 4 && e > s) ? tableName.substring(s, e) : "unknown";
    }

    /* --------------------------------------------------------------- */
    /* 4. SAVE TRADE DATA                                              */
    /* --------------------------------------------------------------- */
    public Map<String, Object> processPaperTradeData(
            List<Map<String, Object>> tradeData,
            int userId, boolean isCorporate, String displayName) throws IOException {

        if (tradeData == null || tradeData.isEmpty()) {
            return Map.of("error", "No trade data provided");
        }
        if (displayName == null || displayName.trim().isEmpty()) {
            return Map.of("error", "Portfolio display name is required");
        }

        PaperTradeMapping.UserType userType = isCorporate
                ? PaperTradeMapping.UserType.corporate
                : PaperTradeMapping.UserType.individual;

        Optional<PaperTradeMapping> opt = mappingRepo
                .findByUserIdAndUserTypeAndDisplayName(userId, userType, displayName.trim());

        if (opt.isEmpty()) {
            return Map.of("error", "Portfolio not found: " + displayName);
        }

        String tableName = opt.get().getInternalTableName();

        List<Map<String, Object>> validated = validateTradeData(tradeData, tableName);
        if (validated == null) {
            return Map.of("error", "Validation failed");
        }

        insertIntoTable(tableName, validated);

        return Map.of(
                "status", "Paper trade data saved successfully",
                "displayName", displayName,
                "series", extractSeries(tableName)
        );
    }

    /* --------------------------------------------------------------- */
    /* 5. VALIDATE EACH ROW + DETERMINE FRAME                         */
    /* --------------------------------------------------------------- */
    private List<Map<String, Object>> validateTradeData(List<Map<String, Object>> raw,
                                                        String tableName) {
        List<String> required = List.of("Symbol", "Date", "Time", "OrderType", "Qty",
                "Price", "MarketValue", "BrokerageAmount");

        DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm:ss");
        SimpleDateFormat sqlDate = new SimpleDateFormat("yyyy-MM-dd");

        List<Map<String, Object>> out = new ArrayList<>();

        for (int i = 0; i < raw.size(); i++) {
            Map<String, Object> rec = raw.get(i);
            Map<String, Object> clean = new HashMap<>();

            // ---- mandatory columns ------------------------------------------------
            for (String col : required) {
                Object v = rec.get(col);
                if (v == null || v.toString().trim().isEmpty()) {
                    logger.warn("Missing {} in row {}", col, i + 1);
                    return null;
                }
                clean.put(col, v);
            }

            // ---- Date ------------------------------------------------------------
            LocalDate tradeDate;
            try {
                tradeDate = LocalDate.parse(rec.get("Date").toString().trim(), dateFmt);
                clean.put("Date", sqlDate.format(Date.from(tradeDate.atStartOfDay(ZoneId.systemDefault()).toInstant())));
            } catch (DateTimeParseException ex) {
                logger.warn("Invalid date in row {}", i + 1);
                return null;
            }

            // ---- Time ------------------------------------------------------------
            try {
                java.time.LocalTime.parse(rec.get("Time").toString().trim(), timeFmt);
            } catch (DateTimeParseException ex) {
                logger.warn("Invalid time in row {}", i + 1);
                return null;
            }

            // ---- OrderType -------------------------------------------------------
            String ot = rec.get("OrderType").toString().trim().toUpperCase();
            if (!ot.equals("B") && !ot.equals("S")) {
                logger.warn("Invalid OrderType {} in row {}", ot, i + 1);
                return null;
            }
            clean.put("OrderType", ot);

            // ---- numeric ---------------------------------------------------------
            try {
                Double qty = Double.parseDouble(rec.get("Qty").toString().trim());
                Double price = Double.parseDouble(rec.get("Price").toString().trim());
                Double mv = Double.parseDouble(rec.get("MarketValue").toString().trim());
                Double brok = Double.parseDouble(rec.get("BrokerageAmount").toString().trim());
                clean.put("Qty", qty);
                clean.put("Price", price);
                clean.put("MarketValue", mv);
                clean.put("BrokerageAmount", brok);
            } catch (NumberFormatException ex) {
                logger.warn("Non-numeric value in row {}", i + 1);
                return null;
            }

            // ---- Determine Frame (Intraday / Interday) -------------------------
            String symbol = rec.get("Symbol").toString().trim();
            String frame = determineFrame(tableName, symbol, tradeDate, ot);
            clean.put("Frame", frame);

            out.add(clean);
        }
        return out;
    }

    private String determineFrame(String tableName, String symbol,
                                  LocalDate tradeDate, String orderType) {
        String opposite = orderType.equals("B") ? "S" : "B";

        String sql = "SELECT COUNT(*) FROM [" + tableName + "] " +
                     "WHERE Symbol = ? AND Date = ? AND OrderType = ?";

        try {
            Integer cnt = ownPortfJdbcTemplate.queryForObject(sql,
                    Integer.class, symbol, Date.valueOf(tradeDate), opposite);
            return (cnt != null && cnt > 0) ? "Intraday" : "Interday";
        } catch (Exception e) {
            logger.warn("Error determining frame for {} on {}", symbol, tradeDate, e);
            return "Interday";
        }
    }

    /* --------------------------------------------------------------- */
    /* 6. INSERT ROWS (including Frame)                               */
    /* --------------------------------------------------------------- */
    private void insertIntoTable(String tableName, List<Map<String, Object>> rows) {
        List<String> cols = List.of("Symbol", "Date", "Time", "OrderType", "Qty",
                "Price", "MarketValue", "BrokerageAmount", "Frame");

        String colList = cols.stream().map(c -> "[" + c + "]").collect(Collectors.joining(", "));

        for (Map<String, Object> r : rows) {
            StringJoiner values = new StringJoiner(",", "(", ")");
            for (String c : cols) {
                Object v = r.get(c);
                if (v == null) {
                    values.add("NULL");
                } else if (c.equals("Symbol") || c.equals("Time") || c.equals("OrderType")
                        || c.equals("Date") || c.equals("Frame")) {
                    values.add("'" + v.toString().replace("'", "''") + "'");
                } else {
                    values.add(v.toString());
                }
            }
            String sql = "INSERT INTO [" + tableName + "] (" + colList + ") VALUES " + values;
            ownPortfJdbcTemplate.execute(sql);
        }
    }

    /* --------------------------------------------------------------- */
    /* 7. DELETE PORTFOLIO                                            */
    /* --------------------------------------------------------------- */
    @Transactional
    public Map<String, Object> deletePaperTradeData(int userId, boolean isCorporate,
                                                    String displayName) {
        if (displayName == null || displayName.trim().isEmpty()) {
            return Map.of("error", "Display name is required");
        }

        PaperTradeMapping.UserType userType = isCorporate
                ? PaperTradeMapping.UserType.corporate
                : PaperTradeMapping.UserType.individual;

        Optional<PaperTradeMapping> opt = mappingRepo
                .findByUserIdAndUserTypeAndDisplayName(userId, userType, displayName.trim());

        if (opt.isEmpty()) {
            return Map.of("error", "Portfolio not found");
        }

        PaperTradeMapping mapping = opt.get();
        String tableName = mapping.getInternalTableName();

        try {
            ownPortfJdbcTemplate.execute("DROP TABLE [" + tableName + "]");
            mappingRepo.delete(mapping);
            logger.info("Deleted portfolio table: {}", tableName);
            return Map.of("status", "Portfolio deleted successfully");
        } catch (Exception e) {
            logger.error("Failed to drop table {}", tableName, e);
            return Map.of("error", "Failed to delete: " + e.getMessage());
        }
    }

    /* --------------------------------------------------------------- */
    /* 8. RENAME PORTFOLIO                                            */
    /* --------------------------------------------------------------- */
    // @Transactional
    // public Map<String, Object> renamePortfolio(int userId, boolean isCorporate,
    //                                            String oldName, String newName) {
    //     if (oldName == null || oldName.trim().isEmpty() || newName == null || newName.trim().isEmpty()) {
    //         return Map.of("error", "Both old and new names are required");
    //     }
    //     if (oldName.trim().equalsIgnoreCase(newName.trim())) {
    //         return Map.of("error", "Old and new names cannot be the same");
    //     }

    //     PaperTradeMapping.UserType userType = isCorporate
    //             ? PaperTradeMapping.UserType.corporate
    //             : PaperTradeMapping.UserType.individual;

    //     Optional<PaperTradeMapping> opt = mappingRepo
    //             .findByUserIdAndUserTypeAndDisplayName(userId, userType, oldName.trim());

    //     if (opt.isEmpty()) {
    //         return Map.of("error", "Portfolio not found: " + oldName);
    //     }

    //     if (mappingRepo.existsByUserIdAndUserTypeAndDisplayName(userId, userType, newName.trim())) {
    //         return Map.of("error", "Portfolio name already exists: " + newName);
    //     }

    //     PaperTradeMapping mapping = opt.get();
    //     mapping.setDisplayName(newName.trim());
    //     mappingRepo.save(mapping);

    //     logger.info("Renamed portfolio: {} -> {}", oldName, newName);
    //     return Map.of("status", "Renamed successfully", "newName", newName.trim());
    // }

    /* --------------------------------------------------------------- */
    /* 9. DELETE SINGLE TRANSACTION (FIFO matching)                  */
    /* --------------------------------------------------------------- */
    @Transactional
    public Map<String, Object> deleteTransaction(int userId, boolean isCorporate,
                                                 String displayName, Integer transactionId) {
        PaperTradeMapping.UserType userType = isCorporate
                ? PaperTradeMapping.UserType.corporate
                : PaperTradeMapping.UserType.individual;

        Optional<PaperTradeMapping> opt = mappingRepo
                .findByUserIdAndUserTypeAndDisplayName(userId, userType, displayName.trim());

        if (opt.isEmpty()) {
            return Map.of("error", "Portfolio not found");
        }

        String tableName = opt.get().getInternalTableName();

        // ---- fetch the transaction to delete
        String sql = "SELECT OrderType, Symbol, Qty, Date FROM [" + tableName + "] WHERE ID = ?";
        Map<String, Object> tx;
        try {
            tx = ownPortfJdbcTemplate.queryForMap(sql, transactionId);
        } catch (Exception e) {
            return Map.of("error", "Transaction not found");
        }

        String orderType = (String) tx.get("OrderType");
        String symbol = (String) tx.get("Symbol");
        double qty = (double) tx.get("Qty");
        Date date = (Date) tx.get("Date");

        if ("B".equals(orderType)) {
            deleteAssociatedSells(tableName, symbol, date, qty);
        } else if ("S".equals(orderType)) {
            reduceBuyQuantity(tableName, symbol, date, qty);
        }

        ownPortfJdbcTemplate.update("DELETE FROM [" + tableName + "] WHERE ID = ?", transactionId);
        return Map.of("status", "Transaction deleted successfully");
    }

    private void deleteAssociatedSells(String tableName, String symbol,
                                       Date buyDate, double buyQty) {
        String sql = "SELECT ID, Qty FROM [" + tableName + "] " +
                     "WHERE Symbol = ? AND OrderType = 'S' AND Date >= ? " +
                     "ORDER BY Date ASC, Time ASC, ID ASC";

        List<Map<String, Object>> sells = ownPortfJdbcTemplate.queryForList(sql, symbol, buyDate);
        double remaining = buyQty;

        for (Map<String, Object> sell : sells) {
            if (remaining <= 0) break;
            double sellQty = (double) sell.get("Qty");
            int sellId = (int) sell.get("ID");

            if (sellQty <= remaining) {
                ownPortfJdbcTemplate.update("DELETE FROM [" + tableName + "] WHERE ID = ?", sellId);
                remaining -= sellQty;
            } else {
                ownPortfJdbcTemplate.update(
                        "UPDATE [" + tableName + "] SET Qty = Qty - ? WHERE ID = ?", remaining, sellId);
                remaining = 0;
            }
        }
    }

    private void reduceBuyQuantity(String tableName, String symbol,
                                   Date sellDate, double sellQty) {
        String sql = "SELECT ID, Qty FROM [" + tableName + "] " +
                     "WHERE Symbol = ? AND OrderType = 'B' AND Date <= ? " +
                     "ORDER BY Date ASC, Time ASC, ID ASC";

        List<Map<String, Object>> buys = ownPortfJdbcTemplate.queryForList(sql, symbol, sellDate);
        double remaining = sellQty;

        for (Map<String, Object> buy : buys) {
            if (remaining <= 0) break;
            double buyQty = (double) buy.get("Qty");
            int buyId = (int) buy.get("ID");

            if (buyQty <= remaining) {
                ownPortfJdbcTemplate.update("DELETE FROM [" + tableName + "] WHERE ID = ?", buyId);
                remaining -= buyQty;
            } else {
                ownPortfJdbcTemplate.update(
                        "UPDATE [" + tableName + "] SET Qty = Qty - ? WHERE ID = ?", remaining, buyId);
                remaining = 0;
            }
        }
    }

    /* --------------------------------------------------------------- */
    /* 10. EDIT PORTFOLIO (display name + corpus)                     */
    /* --------------------------------------------------------------- */
    @Transactional
    public Map<String, Object> editPortfolio(int userId, boolean isCorporate,
                                            String portfolioName,
                                            String newDisplayName,
                                            BigDecimal newCorpus) {

        if (portfolioName == null || portfolioName.isBlank()) {
            return Map.of("error", "Portfolio name is required");
        }

        PaperTradeMapping.UserType userType = isCorporate
                ? PaperTradeMapping.UserType.corporate
                : PaperTradeMapping.UserType.individual;

        Optional<PaperTradeMapping> opt = mappingRepo
                .findByUserIdAndUserTypeAndDisplayName(userId, userType, portfolioName);

        if (opt.isEmpty()) {
            return Map.of("error", "Portfolio not found: " + portfolioName);
        }

        PaperTradeMapping mapping = opt.get();
        boolean changed = false;
        String finalDisplayName = mapping.getDisplayName();

        // ----- DISPLAY NAME -----
        if (newDisplayName != null && !newDisplayName.isBlank()) {
            if (newDisplayName.equalsIgnoreCase(mapping.getDisplayName())) {
                // same name → ignore
            } else {
                // check uniqueness
                if (mappingRepo.existsByUserIdAndUserTypeAndDisplayName(userId, userType, newDisplayName)) {
                    return Map.of("error", "New portfolio name already exists: " + newDisplayName);
                }
                mapping.setDisplayName(newDisplayName);
                finalDisplayName = newDisplayName;
                changed = true;
            }
        }

        // ----- CORPUS -----
        if (newCorpus != null && newCorpus.compareTo(BigDecimal.ZERO) > 0) {
            if (newCorpus.compareTo(mapping.getCorpus()) != 0) {
                mapping.setCorpus(newCorpus);
                changed = true;
            }
        } else if (newCorpus != null) {
            return Map.of("error", "Corpus must be a positive value");
        }

        if (!changed) {
            return Map.of("status", "No changes applied");
        }

        mappingRepo.save(mapping);

        logger.info("Portfolio edited – userId:{}, oldName:{}, newName:{}, newCorpus:{}",
                userId, portfolioName, finalDisplayName, mapping.getCorpus());

        return Map.of(
                "status", "Portfolio updated successfully",
                "displayName", finalDisplayName,
                "corpus", mapping.getCorpus()
        );
    }
}