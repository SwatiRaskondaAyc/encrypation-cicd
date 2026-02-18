package com.example.prog.new_portfolio.services;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

//@Service
//public class PortfolioSchemaService {
//
//    private final JdbcTemplate jdbcTemplate;
//
//    public PortfolioSchemaService(
//            @Qualifier("userLedgersJdbcTemplate") JdbcTemplate jdbcTemplate) {
//        this.jdbcTemplate = jdbcTemplate;
//    }
//
//    public void createPortfolioTable(String tableName) {
//        // Using the exact field names from your Python response as column names
//        String sql = """
//            IF NOT EXISTS (
//                SELECT * FROM sys.tables WHERE name = '%s'
//            )
//            BEGIN
//                CREATE TABLE %s (
//                    portfolio_id NVARCHAR(100),
//                    broker_id NVARCHAR(100),
//                    universal_trade_id NVARCHAR(150),
//                    Symbol NVARCHAR(100),
//                    Scrip_Name NVARCHAR(200),
//                    Trade_execution_time DATETIME2,
//                    Order_Type NVARCHAR(10),
//                    Qty FLOAT,
//                    Mkt_Price FLOAT,
//                    Amount FLOAT,
//                    Exchange NVARCHAR(50),
//                    Series NVARCHAR(50),
//                    ISIN NVARCHAR(50),
//                    Intraday_Flag BIT,
//                    Brokerage FLOAT,
//                    STT FLOAT,
//                    TransN_Chgs FLOAT,
//                    Stamp_Duty FLOAT,
//                    Sebi_Tax FLOAT,
//                    CGST FLOAT,
//                    CGST_on_Transn_Chrg FLOAT,
//                    SGST FLOAT,
//                    IGST FLOAT,
//                    GST_Total FLOAT,
//                    Total_Taxes FLOAT,
//                    Total_Charges FLOAT,
//                    created_at DATETIME DEFAULT GETDATE()
//                )
//            END
//            """.formatted(tableName, tableName);
//
//        jdbcTemplate.execute(sql);
//    }
//}

@Service
public class PortfolioSchemaService {

    private final JdbcTemplate jdbcTemplate;

    public PortfolioSchemaService(
            @Qualifier("userLedgersJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void createPortfolioTable(String tableName) {
        // 1. OBJECT_ID check is safer than sys.tables
        // 2. Added Index for universal_trade_id to support the 'WHERE NOT EXISTS' check
        String sql = """
            IF OBJECT_ID('dbo.[%s]', 'U') IS NULL
            BEGIN
                CREATE TABLE dbo.[%s] (
                    portfolio_id NVARCHAR(100),
                    broker_id NVARCHAR(100),
                    universal_trade_id NVARCHAR(150),
                    Symbol NVARCHAR(100),
                    Scrip_Name NVARCHAR(200),
                    Trade_execution_time DATETIME2,
                    Order_Type NVARCHAR(10),
                    Qty FLOAT,
                    Mkt_Price FLOAT,
                    Amount FLOAT,
                    Exchange NVARCHAR(50),
                    Series NVARCHAR(50),
                    ISIN NVARCHAR(50),
                    Intraday_Flag BIT,
                    Brokerage FLOAT,
                    STT FLOAT,
                    TransN_Chgs FLOAT,
                    Stamp_Duty FLOAT,
                    Sebi_Tax FLOAT,
                    CGST FLOAT,
                    CGST_on_Transn_Chrg FLOAT,
                    SGST FLOAT,
                    IGST FLOAT,
                    GST_Total FLOAT,
                    Total_Taxes FLOAT,
                    Total_Charges FLOAT,
                    created_at DATETIME DEFAULT GETDATE()
                );

                -- Create index for performance on duplicate checks
                CREATE INDEX IX_%s_UTID ON dbo.[%s] (universal_trade_id, portfolio_id);
            END
            """.formatted(tableName, tableName, tableName, tableName);

        jdbcTemplate.execute(sql);
    }
}