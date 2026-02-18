//package com.example.prog.new_portfolio.services;
//
//import com.example.prog.new_portfolio.dto.TradeTransactionDTO;
//import com.example.prog.new_portfolio.exception.DatabaseOperationException;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Service;
//
//import java.sql.Date;
//import java.util.List;
//
//@Service
//public class DynamicPortfolioDataService {
//
//    private final JdbcTemplate jdbcTemplate;
//
//    public DynamicPortfolioDataService(
//            @Qualifier("userLedgersJdbcTemplate") JdbcTemplate jdbcTemplate) {
//        this.jdbcTemplate = jdbcTemplate;
//    }
//
//    public void insertTrades(
//            String tableName,
//            String portfolioId,
//            String brokerId,
//            List<TradeTransactionDTO> trades) {
//
//        try {
//            String sql = """
//                INSERT INTO %s (
//                    portfolio_id, broker_id, Trade_Date, Exch,
//                    Scrip_Name, ISIN, Symbol, Order_Type, Order_Status,
//                    Exchange_Order_Id, Qty, Mkt_Price, Amount,
//                    Brokerage_Amt, Taxes
//                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//                """.formatted(tableName);
//
//            jdbcTemplate.batchUpdate(sql, trades, trades.size(), (ps, t) -> {
//                ps.setString(1, portfolioId);
//                ps.setString(2, brokerId);
//                ps.setDate(3, Date.valueOf(t.getTradeDate()));
//                ps.setString(4, t.getExchange());
//                ps.setString(5, t.getScripName());
//                ps.setString(6, t.getIsin());
//                ps.setString(7, t.getSymbol());
//                ps.setString(8, t.getOrderType());
//                ps.setString(9,t.getOrderStatus());
//                ps.setString(10,t.getExchangeOrderId());
//                ps.setInt(11,t.getQty());
//                ps.setDouble(12,t.getMktPrice());
//                ps.setDouble(13,t.getAmount());
//                ps.setDouble(14,t.getBrokerageAmt());
//                ps.setDouble(15,t.getTaxes());
//            });
//
//        } catch (Exception ex) {
//            throw new DatabaseOperationException("DB insert failed", ex);
//        }
//    }
//}

package com.example.prog.new_portfolio.services;

import com.example.prog.new_portfolio.dto.TradeTransactionDTO;
import com.example.prog.new_portfolio.exception.DatabaseOperationException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class DynamicPortfolioDataService {

    private final JdbcTemplate jdbcTemplate;

    public DynamicPortfolioDataService(
            @Qualifier("userLedgersJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Inserts normalized trades into the dynamic table using exact field names
     * as provided by the Python response.
     */
//    public void insertTrades(
//            String tableName,
//            String portfolioId,
//            String brokerId,
//            List<TradeTransactionDTO> trades) {
//
//        if (trades == null || trades.isEmpty()) return;
//
//        try {
//            // Using the exact field names as column names
//            String sql = """
//                INSERT INTO %s (
//                    portfolio_id, broker_id, universal_trade_id, Symbol, Scrip_Name,
//                    Trade_execution_time, Order_Type, Qty, Mkt_Price, Amount,
//                    Exchange, Series, ISIN, Intraday_Flag, Brokerage, STT,
//                    TransN_Chgs, Stamp_Duty, Sebi_Tax, CGST, CGST_on_Transn_Chrg,
//                    SGST, IGST, GST_Total, Total_Taxes, Total_Charges
//                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//                """.formatted(tableName);
//
//            jdbcTemplate.batchUpdate(sql, trades, trades.size(), (ps, t) -> {
//                ps.setString(1, portfolioId);
//                ps.setString(2, brokerId);
//                ps.setString(3, t.getUniversalTradeId());
//                ps.setString(4, t.getSymbol());
//                ps.setString(5, t.getScripName());
//                // Handle LocalDateTime to Timestamp conversion
////                ps.setTimestamp(6, t.getTradeExecutionTime() != null ?
////                        java.sql.Timestamp.from(t.getTradeExecutionTime().toInstant()) : null);
//                ps.setTimestamp(6, t.getTradeExecutionTime() != null ?
//                        java.sql.Timestamp.valueOf(t.getTradeExecutionTime()) : null);
//                ps.setString(7, t.getOrderType());
//                ps.setDouble(8, t.getQty() != null ? t.getQty() : 0.0);
//                ps.setDouble(9, t.getMktPrice() != null ? t.getMktPrice() : 0.0);
////                ps.setDouble(10, t.getAmount() != null ? t.getAmount() : 0.0);
//                // FIX: Strip commas from amount string before saving as double
//                ps.setDouble(10, parseDoubleSafely(t.getAmount()));
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
//            });
//
//        } catch (Exception ex) {
//            throw new DatabaseOperationException("Batch insert into " + tableName + " failed", ex);
//        }
//    }

    /**
     * Helper method to clean amount strings like "-76,067.36"
     * and convert them to a valid double for the database.
     */
    private double parseDoubleSafely(Object value) {
        if (value == null) return 0.0;
        if (value instanceof Double) return (Double) value;
        try {
            // Removes commas so "-76,067.36" becomes a parseable "-76067.36"
            return Double.parseDouble(value.toString().replace(",", ""));
        } catch (Exception e) {
            return 0.0;
        }
    }
}