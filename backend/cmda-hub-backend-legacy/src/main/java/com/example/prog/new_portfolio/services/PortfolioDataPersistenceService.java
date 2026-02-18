//package com.example.prog.new_portfolio.services;
//
//import com.example.prog.new_portfolio.dto.TradeTransactionDTO;
//import com.example.prog.new_portfolio.dto.PortfolioDateRangeDTO; // Assuming you create this DTO
//import com.example.prog.new_portfolio.exception.DatabaseOperationException;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.dao.EmptyResultDataAccessException;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.jdbc.core.RowMapper;
//import org.springframework.stereotype.Service;
//
//import java.sql.ResultSet;
//import java.sql.SQLException;
//import java.time.LocalDate;
//import java.util.List;
//
//@Service
//public class PortfolioDataPersistenceService {
//
//    private final JdbcTemplate userLedgerJdbcTemplate;
//    private final RowMapper<TradeTransactionDTO> tradeRowMapper = new TradeTransactionRowMapper();
//
//    public PortfolioDataPersistenceService(
//            @Qualifier("userLedgersJdbcTemplate") JdbcTemplate jdbcTemplate) {
//        this.userLedgerJdbcTemplate = jdbcTemplate;
//    }
//
//    // --- Static Table Operations (user_portfolio_analysis) ---
//    // (Existing saveAnalysis and getLatestAnalysis methods remain here)
//    // ...
//
//    /**
//     * INSERT Operation: Inserts a list of trades into the dynamic table,
//     * skipping duplicates based on the composite unique key (Trade_Date, Symbol, Order_Type, Qty, Amount).
//     * This uses a single batch update with the WHERE NOT EXISTS clause.
//     */
////    public void insertTrades(
////            String tableName,
////            String portfolioId,
////            String brokerId,
////            List<TradeTransactionDTO> trades) {
////
////        if (trades == null || trades.isEmpty()) return;
////
////        try {
////            // SQL Server batch INSERT with duplicate check using the composite key
////            String sql = String.format("""
////        INSERT INTO %s (
////            portfolio_id, broker_id, Trade_Date, Exch,
////            Scrip_Name, ISIN, Symbol, Order_Type, Order_Status,
////            Exchange_Order_Id, Qty, Mkt_Price, Amount,
////            Brokerage_Amt, Taxes
////        )
////        SELECT
////            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
////        WHERE NOT EXISTS (
////            SELECT 1 FROM %s
////            WHERE Trade_Date = ?    -- 16
////              AND Symbol = ?        -- 17
////              AND Order_Type = ?    -- 18
////              AND Qty = ?           -- 19
////              AND Amount = ?        -- 20
////        )
////        """, tableName, tableName);
////
////            // The total number of parameters is 15 (for INSERT) + 5 (for WHERE NOT EXISTS) = 20
////            userLedgerJdbcTemplate.batchUpdate(sql, trades, trades.size(), (ps, t) -> {
////                // Note: We use java.sql.Date.valueOf(t.getTradeDate()) directly for both insertions
////
////                // INSERT Parameters (1-15)
////                ps.setString(1, portfolioId);
////                ps.setString(2, brokerId);
////                // Simplified Date Handling (Index 3)
////                ps.setDate(3, java.sql.Date.valueOf(t.getTradeDate()));
////                ps.setString(4, t.getExchange());
////                ps.setString(5, t.getScripName());
////                ps.setString(6, t.getIsin());
////                ps.setString(7, t.getSymbol());
////                ps.setString(8, t.getOrderType());
////                ps.setString(9,t.getOrderStatus());
////                ps.setString(10,t.getExchangeOrderId());
////                ps.setInt(11,t.getQty());
////                ps.setDouble(12,t.getMktPrice());
////                ps.setDouble(13,t.getAmount());
////                ps.setDouble(14,t.getBrokerageAmt());
////                ps.setDouble(15,t.getTaxes());
////
////                // WHERE NOT EXISTS Parameters (16-20)
////                // Simplified Date Handling (Index 16)
////                ps.setDate(16, java.sql.Date.valueOf(t.getTradeDate()));
////                ps.setString(17, t.getSymbol());
////                ps.setString(18, t.getOrderType());
////                ps.setInt(19,t.getQty());
////                ps.setDouble(20,t.getAmount());
////            });
////
////        } catch (Exception ex) {
////            throw new DatabaseOperationException("DB insert failed in batch update", ex);
////        }
////    }
//
//    public void insertTrades(
//            String tableName,
//            String portfolioId,
//            String brokerId,
//            List<TradeTransactionDTO> trades) {
//
//        if (trades == null || trades.isEmpty()) return;
//
//        try {
//            // Added portfolio_id = ? to the WHERE NOT EXISTS clause
//            String sql = String.format("""
//        INSERT INTO %s (
//            portfolio_id, broker_id, Trade_Date, Exch,
//            Scrip_Name, ISIN, Symbol, Order_Type, Order_Status,
//            Exchange_Order_Id, Qty, Mkt_Price, Amount,
//            Brokerage_Amt, Taxes
//        )
//        SELECT
//            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
//        WHERE NOT EXISTS (
//            SELECT 1 FROM %s
//            WHERE Trade_Date = ?    -- 16
//              AND Symbol = ?        -- 17
//              AND Order_Type = ?    -- 18
//              AND Qty = ?           -- 19
//              AND Amount = ?        -- 20
//              AND portfolio_id = ?  -- 21 (CRITICAL: Scope check)
//        )
//        """, tableName, tableName);
//
//            // Total parameters: 15 (Insert) + 6 (Check) = 21
//            userLedgerJdbcTemplate.batchUpdate(sql, trades, trades.size(), (ps, t) -> {
//
//                // --- INSERT Parameters (1-15) ---
//                ps.setString(1, portfolioId);
//                ps.setString(2, brokerId);
//                ps.setDate(3, java.sql.Date.valueOf(t.getTradeDate()));
//                ps.setString(4, t.getExchange());
//                ps.setString(5, t.getScripName());
//                ps.setString(6, t.getIsin());
//                ps.setString(7, t.getSymbol());
//                ps.setString(8, t.getOrderType());
//                ps.setString(9, t.getOrderStatus());
//                ps.setString(10, t.getExchangeOrderId());
//                ps.setInt(11, t.getQty());
//                ps.setDouble(12, t.getMktPrice());
//                ps.setDouble(13, t.getAmount());
//                ps.setDouble(14, t.getBrokerageAmt());
//                ps.setDouble(15, t.getTaxes());
//
//                // --- WHERE NOT EXISTS Parameters (16-21) ---
//                ps.setDate(16, java.sql.Date.valueOf(t.getTradeDate()));
//                ps.setString(17, t.getSymbol());
//                ps.setString(18, t.getOrderType());
//                ps.setInt(19, t.getQty());
//                ps.setDouble(20, t.getAmount());
//                ps.setString(21, portfolioId); // Check against THIS portfolio only
//            });
//
//        } catch (Exception ex) {
//            throw new DatabaseOperationException("DB insert failed in batch update", ex);
//        }
//    }
//
//    // --- Dynamic Table Operations (CRUD on Trade Transactions) ---
//
//    // READ (All trades for a portfolio)
//    public List<TradeTransactionDTO> findAllTrades(String tableName, String portfolioId) {
//        // ... (Existing code)
//        String sql = String.format("SELECT * FROM %s WHERE portfolio_id = ?", tableName);
//        return userLedgerJdbcTemplate.query(sql, tradeRowMapper, portfolioId);
//    }
//
//    // DELETE (All trades for a portfolio)
//    public void deleteAllTrades(String tableName, String portfolioId) {
//        // ... (Existing code)
//        String sql = String.format("DELETE FROM %s WHERE portfolio_id = ?", tableName);
//        userLedgerJdbcTemplate.update(sql, portfolioId);
//    }
//
//
//
//    // --- Dynamic Table Operations (CRUD with Date Range) ---
//
//    // READ (Trades within a date range)
//    public List<TradeTransactionDTO> findTradesByDateRange(
//            String tableName,
//            String portfolioId,
//            LocalDate startDate,
//            LocalDate endDate) {
//        // ... (Existing code)
//        String sql = String.format("""
//            SELECT * FROM %s
//            WHERE portfolio_id = ?
//            AND Trade_Date BETWEEN ? AND ?
//            ORDER BY Trade_Date ASC
//            """, tableName);
//
//        return userLedgerJdbcTemplate.query(
//                sql,
//                tradeRowMapper,
//                portfolioId,
//                startDate,
//                endDate
//        );
//    }
//
//    // DELETE (Trades within a date range)
//    public void deleteTradesByDateRange(
//            String tableName,
//            String portfolioId,
//            LocalDate startDate,
//            LocalDate endDate) {
//        // ... (Existing code)
//        String sql = String.format("""
//            DELETE FROM %s
//            WHERE portfolio_id = ?
//            AND Trade_Date BETWEEN ? AND ?
//            """, tableName);
//
//        userLedgerJdbcTemplate.update(
//                sql,
//                portfolioId,
//                startDate,
//                endDate
//        );
//    }
//
//    // --- NEW DYNAMIC OPERATIONS ---
//
//    /**
//     * READ Operation: Retrieves the min and max trade dates for a given portfolio.
//     */
//    public PortfolioDateRangeDTO getPortfolioDateRange(String tableName, String portfolioId) {
//        try {
//            String sql = String.format("""
//                SELECT
//                    MIN(Trade_Date) AS Min_Date,
//                    MAX(Trade_Date) AS Max_Date
//                FROM %s
//                WHERE portfolio_id = ?
//                """, tableName);
//
//            return userLedgerJdbcTemplate.queryForObject(sql, new Object[]{portfolioId}, (rs, rowNum) -> {
//                // If MIN(Trade_Date) is null, the portfolio is empty
//                if (rs.getDate("Min_Date") == null) {
//                    return null;
//                }
//
//                // Convert SQL Date to Java 8 LocalDate
//                LocalDate minDate = rs.getDate("Min_Date").toLocalDate();
//                LocalDate maxDate = rs.getDate("Max_Date").toLocalDate();
//
//                return new PortfolioDateRangeDTO(minDate, maxDate);
//            });
//
//        } catch (EmptyResultDataAccessException ex) {
//            // Should be caught by the null check above, but safe to include
//            return null;
//        } catch (Exception ex) {
//            throw new DatabaseOperationException("Failed to retrieve portfolio date range", ex);
//        }
//    }
//
//    /**
//     * READ Operation: Counts the total number of trade transactions for a portfolio.
//     */
//    public Integer countTrades(String tableName, String portfolioId) {
//        try {
//            String sql = String.format("SELECT COUNT(*) FROM %s WHERE portfolio_id = ?", tableName);
//            // queryForObject(String, Class<T>, Object...) returns the result
//            return userLedgerJdbcTemplate.queryForObject(sql, Integer.class, portfolioId);
//        } catch (Exception ex) {
//            throw new DatabaseOperationException("Failed to count trades", ex);
//        }
//    }
//
//    /**
//     * READ Operation: Checks if a trade with a specific Exchange Order ID exists.
//     * This is useful for idempotent operations or single-record lookups.
//     */
//    public boolean tradeExistsByExchangeOrderId(String tableName, String exchangeOrderId) {
//        String sql = String.format("SELECT COUNT(1) FROM %s WHERE Exchange_Order_Id = ?", tableName);
//        Integer count = userLedgerJdbcTemplate.queryForObject(sql, Integer.class, exchangeOrderId);
//        return count != null && count > 0;
//    }
//
//    /**
//     * UPDATE Operation: Modifies an existing trade transaction based on its unique key.
//     * Assuming 'Exchange_Order_Id' can uniquely identify a row IF it is present.
//     * If not present, you would need to use an 'id' column or the composite key for the WHERE clause.
//     */
//    public int updateTradeByExchangeOrderId(String tableName, TradeTransactionDTO trade) {
//        String sql = String.format("""
//            UPDATE %s SET
//                Trade_Date = ?, Exch = ?, Scrip_Name = ?, ISIN = ?, Symbol = ?,
//                Order_Type = ?, Order_Status = ?, Qty = ?, Mkt_Price = ?,
//                Amount = ?, Brokerage_Amt = ?, Taxes = ?
//            WHERE Exchange_Order_Id = ?
//            """, tableName);
//
//        return userLedgerJdbcTemplate.update(
//                sql,
//                trade.getTradeDate(),
//                trade.getExchange(),
//                trade.getScripName(),
//                trade.getIsin(),
//                trade.getSymbol(),
//                trade.getOrderType(),
//                trade.getOrderStatus(),
//                trade.getQty(),
//                trade.getMktPrice(),
//                trade.getAmount(),
//                trade.getBrokerageAmt(),
//                trade.getTaxes(),
//                trade.getExchangeOrderId() // WHERE clause parameter
//        );
//    }
//
//    // --- RowMapper Implementation ---
//    // (The existing TradeTransactionRowMapper remains here)
//    private static class TradeTransactionRowMapper implements RowMapper<TradeTransactionDTO> {
//        @Override
//        public TradeTransactionDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
//            // ... (The full implementation from the previous response)
//            TradeTransactionDTO dto = new TradeTransactionDTO();
//            String scripName = rs.getString("Scrip_Name");
//            dto.setScripName(scripName);
//            dto.setStockName(scripName);
//            dto.setIsin(rs.getString("ISIN"));
//            dto.setOrderType(rs.getString("Order_Type"));
//            dto.setQty(rs.getInt("Qty"));
//            dto.setAmount(rs.getDouble("Amount"));
//            dto.setExchange(rs.getString("Exch"));
//            dto.setExchangeOrderId(rs.getString("Exchange_Order_Id"));
//            dto.setTradeDate(rs.getDate("Trade_Date").toLocalDate());
//            dto.setOrderStatus(rs.getString("Order_Status"));
//            dto.setMktPrice(rs.getDouble("Mkt_Price"));
//            dto.setBrokerageAmt(rs.getDouble("Brokerage_Amt"));
//            dto.setTaxes(rs.getDouble("Taxes"));
//            dto.setSymbol(rs.getString("Symbol"));
//
//            return dto;
//        }
//    }
//}


//package com.example.prog.new_portfolio.services;
//
//import com.example.prog.new_portfolio.dto.TradeTransactionDTO;
//import com.example.prog.new_portfolio.dto.PortfolioDateRangeDTO;
//import com.example.prog.new_portfolio.exception.DatabaseOperationException;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.dao.EmptyResultDataAccessException;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.jdbc.core.RowMapper;
//import org.springframework.stereotype.Service;
//
//import java.sql.ResultSet;
//import java.sql.SQLException;
//import java.sql.Timestamp;
//import java.time.LocalDate;
//import java.time.ZoneOffset;
//import java.util.List;
//
//@Service
//public class PortfolioDataPersistenceService {
//
//    private final JdbcTemplate userLedgerJdbcTemplate;
//    private final RowMapper<TradeTransactionDTO> tradeRowMapper = new TradeTransactionRowMapper();
//
//    public PortfolioDataPersistenceService(
//            @Qualifier("userLedgersJdbcTemplate") JdbcTemplate jdbcTemplate) {
//        this.userLedgerJdbcTemplate = jdbcTemplate;
//    }
//
//    // -------------------------------------------------------------------------
//    // 1. CREATE / INSERT OPERATIONS
//    // -------------------------------------------------------------------------
//
//    public void insertTrades(String tableName, String portfolioId, String brokerId, List<TradeTransactionDTO> trades) {
//        if (trades == null || trades.isEmpty()) return;
//
//        try {
//            String sql = String.format("""
//                INSERT INTO %s (
//                    portfolio_id, broker_id, universal_trade_id, Symbol, Scrip_Name,
//                    Trade_execution_time, Order_Type, Qty, Mkt_Price, Amount,
//                    Exchange, Series, ISIN, Intraday_Flag, Brokerage, STT,
//                    TransN_Chgs, Stamp_Duty, Sebi_Tax, CGST, CGST_on_Transn_Chrg,
//                    SGST, IGST, GST_Total, Total_Taxes, Total_Charges
//                )
//                SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
//                WHERE NOT EXISTS (
//                    SELECT 1 FROM %s WHERE universal_trade_id = ? AND portfolio_id = ?
//                )
//                """, tableName, tableName);
//
//            userLedgerJdbcTemplate.batchUpdate(sql, trades, trades.size(), (ps, t) -> {
//                ps.setString(1, portfolioId);
//                ps.setString(2, brokerId);
//                ps.setString(3, t.getUniversalTradeId());
//                ps.setString(4, t.getSymbol());
//                ps.setString(5, t.getScripName());
//                ps.setTimestamp(6, t.getTradeExecutionTime() != null ?
//                        Timestamp.valueOf(t.getTradeExecutionTime()) : null);
//                ps.setString(7, t.getOrderType());
//                ps.setDouble(8, t.getQty() != null ? t.getQty() : 0.0);
//                ps.setDouble(9, t.getMktPrice() != null ? t.getMktPrice() : 0.0);
//                ps.setDouble(10, t.getAmount() != null ? t.getAmount() : 0.0);
//                ps.setString(11, t.getExchange());
//                ps.setString(12, t.getSeries());
//                ps.setString(13, t.getIsin());
//                ps.setBoolean(14, t.getIntradayFlag() != null && t.getIntradayFlag());
//                ps.setDouble(15, t.getBrokerage() != null ? t.getBrokerage() : 0.0);
//                ps.setDouble(16, t.getStt() != null ? t.getStt() : 0.0);
//                ps.setDouble(17, t.getTransNChgs() != null ? t.getTransNChgs() : 0.0);
//                ps.setDouble(18, t.getStampDuty() != null ? t.getStampDuty() : 0.0);
//                ps.setDouble(19, t.getSebiTax() != null ? t.getSebiTax() : 0.0);
//                ps.setDouble(20, t.getCgst() != null ? t.getCgst() : 0.0);
//                ps.setDouble(21, t.getCgstOnTransnChrg() != null ? t.getCgstOnTransnChrg() : 0.0);
//                ps.setDouble(22, t.getSgst() != null ? t.getSgst() : 0.0);
//                ps.setDouble(23, t.getIgst() != null ? t.getIgst() : 0.0);
//                ps.setDouble(24, t.getGstTotal() != null ? t.getGstTotal() : 0.0);
//                ps.setDouble(25, t.getTotalTaxes() != null ? t.getTotalTaxes() : 0.0);
//                ps.setDouble(26, t.getTotalCharges() != null ? t.getTotalCharges() : 0.0);
//
//                ps.setString(27, t.getUniversalTradeId());
//                ps.setString(28, portfolioId);
//            });
//        } catch (Exception ex) {
//            throw new DatabaseOperationException("Batch insert failed for " + tableName, ex);
//        }
//    }
//
//    // -------------------------------------------------------------------------
//    // 2. READ OPERATIONS
//    // -------------------------------------------------------------------------
//
//    public List<TradeTransactionDTO> findAllTrades(String tableName, String portfolioId) {
//        String sql = String.format("SELECT * FROM %s WHERE portfolio_id = ? ORDER BY Trade_execution_time DESC", tableName);
//        return userLedgerJdbcTemplate.query(sql, tradeRowMapper, portfolioId);
//    }
//
//    public List<TradeTransactionDTO> findTradesByDateRange(String tableName, String portfolioId, LocalDate start, LocalDate end) {
//        String sql = String.format("""
//            SELECT * FROM %s WHERE portfolio_id = ?
//            AND CAST(Trade_execution_time AS DATE) BETWEEN ? AND ?
//            ORDER BY Trade_execution_time ASC
//            """, tableName);
//        return userLedgerJdbcTemplate.query(sql, tradeRowMapper, portfolioId, start, end);
//    }
//
//    public PortfolioDateRangeDTO getPortfolioDateRange(String tableName, String portfolioId) {
//        try {
//            String sql = String.format("""
//                SELECT MIN(Trade_execution_time) AS Min_Date, MAX(Trade_execution_time) AS Max_Date
//                FROM %s WHERE portfolio_id = ?""", tableName);
//            return userLedgerJdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
//                Timestamp min = rs.getTimestamp("Min_Date");
//                Timestamp max = rs.getTimestamp("Max_Date");
//                if (min == null) return null;
//                return new PortfolioDateRangeDTO(min.toLocalDateTime().toLocalDate(), max.toLocalDateTime().toLocalDate());
//            }, portfolioId);
//        } catch (EmptyResultDataAccessException ex) { return null; }
//    }
//
//    public Integer countTrades(String tableName, String portfolioId) {
//        String sql = String.format("SELECT COUNT(*) FROM %s WHERE portfolio_id = ?", tableName);
//        return userLedgerJdbcTemplate.queryForObject(sql, Integer.class, portfolioId);
//    }
//
//    public boolean tradeExistsByUniversalId(String tableName, String universalTradeId) {
//        String sql = String.format("SELECT COUNT(1) FROM %s WHERE universal_trade_id = ?", tableName);
//        Integer count = userLedgerJdbcTemplate.queryForObject(sql, Integer.class, universalTradeId);
//        return count != null && count > 0;
//    }
//
//
//
//    // -------------------------------------------------------------------------
//    // 3. UPDATE OPERATIONS
//    // -------------------------------------------------------------------------
//
//    public int updateTradeByUniversalId(String tableName, TradeTransactionDTO trade) {
//        String sql = String.format("""
//            UPDATE %s SET
//                Symbol = ?, Scrip_Name = ?, Trade_execution_time = ?, Order_Type = ?,
//                Qty = ?, Mkt_Price = ?, Amount = ?, Exchange = ?, ISIN = ?,
//                Brokerage = ?, STT = ?, GST_Total = ?, Total_Taxes = ?
//            WHERE universal_trade_id = ?
//            """, tableName);
//
//        return userLedgerJdbcTemplate.update(sql,
//                trade.getSymbol(), trade.getScripName(),
//                trade.getTradeExecutionTime() != null ? Timestamp.from(trade.getTradeExecutionTime().toInstant()) : null,
//                trade.getOrderType(), trade.getQty(), trade.getMktPrice(), trade.getAmount(),
//                trade.getExchange(), trade.getIsin(), trade.getBrokerage(), trade.getStt(),
//                trade.getGstTotal(), trade.getTotalTaxes(), trade.getUniversalTradeId());
//    }
//
//    // -------------------------------------------------------------------------
//    // 4. DELETE OPERATIONS
//    // -------------------------------------------------------------------------
//
//    public void deleteAllTrades(String tableName, String portfolioId) {
//        String sql = String.format("DELETE FROM %s WHERE portfolio_id = ?", tableName);
//        userLedgerJdbcTemplate.update(sql, portfolioId);
//    }
//
//    public void deleteTradesByDateRange(String tableName, String portfolioId, LocalDate start, LocalDate end) {
//        String sql = String.format("""
//            DELETE FROM %s WHERE portfolio_id = ?
//            AND CAST(Trade_execution_time AS DATE) BETWEEN ? AND ?
//            """, tableName);
//        userLedgerJdbcTemplate.update(sql, portfolioId, start, end);
//    }
//
//    // -------------------------------------------------------------------------
//    // ROW MAPPER
//    // -------------------------------------------------------------------------
//
//    private static class TradeTransactionRowMapper implements RowMapper<TradeTransactionDTO> {
//        @Override
//        public TradeTransactionDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
//            TradeTransactionDTO dto = new TradeTransactionDTO();
//            dto.setUniversalTradeId(rs.getString("universal_trade_id"));
//            dto.setSymbol(rs.getString("Symbol"));
//            dto.setScripName(rs.getString("Scrip_Name"));
//            Timestamp ts = rs.getTimestamp("Trade_execution_time");
//            if (ts != null) dto.setTradeExecutionTime(ts.toInstant().atOffset(ZoneOffset.UTC));
//            dto.setOrderType(rs.getString("Order_Type"));
//            dto.setQty(rs.getDouble("Qty"));
//            dto.setMktPrice(rs.getDouble("Mkt_Price"));
//            dto.setAmount(rs.getDouble("Amount"));
//            dto.setExchange(rs.getString("Exchange"));
//            dto.setSeries(rs.getString("Series"));
//            dto.setIsin(rs.getString("ISIN"));
//            dto.setIntradayFlag(rs.getBoolean("Intraday_Flag"));
//            dto.setBrokerage(rs.getDouble("Brokerage"));
//            dto.setStt(rs.getDouble("STT"));
//            dto.setTransNChgs(rs.getDouble("TransN_Chgs"));
//            dto.setStampDuty(rs.getDouble("Stamp_Duty"));
//            dto.setSebiTax(rs.getDouble("Sebi_Tax"));
//            dto.setCgst(rs.getDouble("CGST"));
//            dto.setCgstOnTransnChrg(rs.getDouble("CGST_on_Transn_Chrg"));
//            dto.setSgst(rs.getDouble("SGST"));
//            dto.setIgst(rs.getDouble("IGST"));
//            dto.setGstTotal(rs.getDouble("GST_Total"));
//            dto.setTotalTaxes(rs.getDouble("Total_Taxes"));
//            dto.setTotalCharges(rs.getDouble("Total_Charges"));
//            return dto;
//        }
//    }
//}
/// ///////////////////////////////////////////////////////////////////////////////////
package com.example.prog.new_portfolio.services;

import com.example.prog.new_portfolio.dto.TradeTransactionDTO;
import com.example.prog.new_portfolio.dto.PortfolioDateRangeDTO;
import com.example.prog.new_portfolio.exception.DatabaseOperationException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Service
public class PortfolioDataPersistenceService {

    private final JdbcTemplate userLedgerJdbcTemplate;
    private final RowMapper<TradeTransactionDTO> tradeRowMapper = new TradeTransactionRowMapper();

    public PortfolioDataPersistenceService(
            @Qualifier("userLedgersJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.userLedgerJdbcTemplate = jdbcTemplate;
    }

    // -------------------------------------------------------------------------
    // 1. CREATE / INSERT OPERATIONS
    // -------------------------------------------------------------------------

    public void insertTrades(String tableName, String portfolioId, String brokerId, List<TradeTransactionDTO> trades) {
        if (trades == null || trades.isEmpty()) return;

        try {
            // The query uses a WHERE NOT EXISTS clause to prevent duplicate universal_trade_ids
            String sql = String.format("""
                INSERT INTO %s (
                    portfolio_id, broker_id, universal_trade_id, Symbol, Scrip_Name,
                    Trade_execution_time, Order_Type, Qty, Mkt_Price, Amount,
                    Exchange, Series, ISIN, Intraday_Flag, Brokerage, STT,
                    TransN_Chgs, Stamp_Duty, Sebi_Tax, CGST, CGST_on_Transn_Chrg,
                    SGST, IGST, GST_Total, Total_Taxes, Total_Charges
                )
                SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                WHERE NOT EXISTS (
                    SELECT 1 FROM %s WHERE universal_trade_id = ? AND portfolio_id = ?
                )
                """, tableName, tableName);

            userLedgerJdbcTemplate.batchUpdate(sql, trades, trades.size(), (ps, t) -> {
                ps.setString(1, portfolioId);
                ps.setString(2, brokerId);
                ps.setString(3, t.getUniversalTradeId());
                ps.setString(4, t.getSymbol());
                ps.setString(5, t.getScripName());

                // LocalDateTime to SQL Timestamp conversion
                ps.setTimestamp(6, t.getTradeExecutionTime() != null ?
                        Timestamp.valueOf(t.getTradeExecutionTime()) : null);

                ps.setString(7, t.getOrderType());
                ps.setDouble(8, t.getQty() != null ? t.getQty() : 0.0);
                ps.setDouble(9, t.getMktPrice() != null ? t.getMktPrice() : 0.0);

                // Safely parse amount string (removing commas)
                ps.setDouble(10, parseDoubleSafely(t.getAmount()));

                ps.setString(11, t.getExchange());
                ps.setString(12, t.getSeries());
                ps.setString(13, t.getIsin());
                ps.setBoolean(14, t.getIntradayFlag() != null && t.getIntradayFlag());
                ps.setDouble(15, t.getBrokerage() != null ? t.getBrokerage() : 0.0);
                ps.setDouble(16, t.getStt() != null ? t.getStt() : 0.0);
                ps.setDouble(17, t.getTransNChgs() != null ? t.getTransNChgs() : 0.0);
                ps.setDouble(18, t.getStampDuty() != null ? t.getStampDuty() : 0.0);
                ps.setDouble(19, t.getSebiTax() != null ? t.getSebiTax() : 0.0);
                ps.setDouble(20, t.getCgst() != null ? t.getCgst() : 0.0);
                ps.setDouble(21, t.getCgstOnTransnChrg() != null ? t.getCgstOnTransnChrg() : 0.0);
                ps.setDouble(22, t.getSgst() != null ? t.getSgst() : 0.0);
                ps.setDouble(23, t.getIgst() != null ? t.getIgst() : 0.0);
                ps.setDouble(24, t.getGstTotal() != null ? t.getGstTotal() : 0.0);
                ps.setDouble(25, t.getTotalTaxes() != null ? t.getTotalTaxes() : 0.0);
                ps.setDouble(26, t.getTotalCharges() != null ? t.getTotalCharges() : 0.0);

                // Parameters for WHERE NOT EXISTS
                ps.setString(27, t.getUniversalTradeId());
                ps.setString(28, portfolioId);
            });
        } catch (Exception ex) {
            throw new DatabaseOperationException("Batch insert failed for table: " + tableName, ex);
        }
    }

    // -------------------------------------------------------------------------
    // 2. READ OPERATIONS
    // -------------------------------------------------------------------------

    public List<TradeTransactionDTO> findAllTrades(String tableName, String portfolioId) {
        String sql = String.format("SELECT * FROM %s WHERE portfolio_id = ? ORDER BY Trade_execution_time DESC", tableName);
        return userLedgerJdbcTemplate.query(sql, tradeRowMapper, portfolioId);
    }

    public List<TradeTransactionDTO> findTradesByDateRange(String tableName, String portfolioId, LocalDate start, LocalDate end) {
        String sql = String.format("""
            SELECT * FROM %s WHERE portfolio_id = ? 
            AND CAST(Trade_execution_time AS DATE) BETWEEN ? AND ?
            ORDER BY Trade_execution_time ASC
            """, tableName);
        return userLedgerJdbcTemplate.query(sql, tradeRowMapper, portfolioId, start, end);
    }

    public PortfolioDateRangeDTO getPortfolioDateRange(String tableName, String portfolioId) {
        try {
            String sql = String.format("""
                SELECT MIN(Trade_execution_time) AS Min_Date, MAX(Trade_execution_time) AS Max_Date 
                FROM %s WHERE portfolio_id = ?""", tableName);
            return userLedgerJdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Timestamp min = rs.getTimestamp("Min_Date");
                Timestamp max = rs.getTimestamp("Max_Date");
                if (min == null) return null;
                return new PortfolioDateRangeDTO(min.toLocalDateTime().toLocalDate(), max.toLocalDateTime().toLocalDate());
            }, portfolioId);
        } catch (EmptyResultDataAccessException ex) { return null; }
    }

    // -------------------------------------------------------------------------
    // 3. UTILITIES & CLEANUP
    // -------------------------------------------------------------------------

    private double parseDoubleSafely(Object value) {
        if (value == null) return 0.0;
        if (value instanceof Double) return (Double) value;
        try {
            // Strips commas from strings like "-76,067.36"
            return Double.parseDouble(value.toString().replace(",", ""));
        } catch (Exception e) {
            return 0.0;
        }
    }

    public void deleteAllTrades(String tableName, String portfolioId) {
        String sql = String.format("DELETE FROM %s WHERE portfolio_id = ?", tableName);
        userLedgerJdbcTemplate.update(sql, portfolioId);
    }

    public void deleteTradesByDateRange(String tableName, String portfolioId, LocalDate start, LocalDate end) {
        String sql = String.format("""
            DELETE FROM %s WHERE portfolio_id = ? 
            AND CAST(Trade_execution_time AS DATE) BETWEEN ? AND ?
            """, tableName);
        userLedgerJdbcTemplate.update(sql, portfolioId, start, end);
    }

    // -------------------------------------------------------------------------
    // ROW MAPPER (SQL Result to Java DTO)
    // -------------------------------------------------------------------------

    private static class TradeTransactionRowMapper implements RowMapper<TradeTransactionDTO> {
        @Override
        public TradeTransactionDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            TradeTransactionDTO dto = new TradeTransactionDTO();
            dto.setUniversalTradeId(rs.getString("universal_trade_id"));
            dto.setSymbol(rs.getString("Symbol"));
            dto.setScripName(rs.getString("Scrip_Name"));

            Timestamp ts = rs.getTimestamp("Trade_execution_time");
            if (ts != null) dto.setTradeExecutionTime(ts.toLocalDateTime());

            dto.setOrderType(rs.getString("Order_Type"));
            dto.setQty(rs.getDouble("Qty"));
            dto.setMktPrice(rs.getDouble("Mkt_Price"));

            // Note: Since Amount is numeric in DB, we convert it back to String for the DTO
            dto.setAmount(String.valueOf(rs.getDouble("Amount")));

            dto.setExchange(rs.getString("Exchange"));
            dto.setSeries(rs.getString("Series"));
            dto.setIsin(rs.getString("ISIN"));
            dto.setIntradayFlag(rs.getBoolean("Intraday_Flag"));
            dto.setBrokerage(rs.getDouble("Brokerage"));
            dto.setStt(rs.getDouble("STT"));
            dto.setTransNChgs(rs.getDouble("TransN_Chgs"));
            dto.setStampDuty(rs.getDouble("Stamp_Duty"));
            dto.setSebiTax(rs.getDouble("Sebi_Tax"));
            dto.setCgst(rs.getDouble("CGST"));
            dto.setCgstOnTransnChrg(rs.getDouble("CGST_on_Transn_Chrg"));
            dto.setSgst(rs.getDouble("SGST"));
            dto.setIgst(rs.getDouble("IGST"));
            dto.setGstTotal(rs.getDouble("GST_Total"));
            dto.setTotalTaxes(rs.getDouble("Total_Taxes"));
            dto.setTotalCharges(rs.getDouble("Total_Charges"));
            return dto;
        }
    }
}