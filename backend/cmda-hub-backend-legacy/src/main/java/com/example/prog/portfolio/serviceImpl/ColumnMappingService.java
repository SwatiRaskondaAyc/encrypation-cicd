package com.example.prog.portfolio.serviceImpl;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ColumnMappingService {

    private static final Map<String, Map<String, String>> PLATFORM_MAPPINGS = new HashMap<>();
    private static final List<String> TAX_COLUMNS = Arrays.asList(
            "CGST", "Stamp_Duty", "Transn_Chrg", "CGST_on_Transn_Chrg",
            "STT", "Sebi_Turnover_Tax", "SGST", "IGST", "Other_Chrg"
    );

    	 static {
    	        Map<String, String> axisBankMapping = new HashMap<>();
    	        axisBankMapping.put("Trd Dt", "Trade_Date");
    	        axisBankMapping.put("Exch", "Exchange");
    	        axisBankMapping.put("Scrip Name", "Scrip_Name");
    	        axisBankMapping.put("Buy/Sell", "Order_Type");
    	        axisBankMapping.put("Qty", "Qty");
    	        axisBankMapping.put("Mkt Price", "Mkt_Price");
    	        axisBankMapping.put("Brok Amt", "Brok_Amt");
                axisBankMapping.put("Aggregated Taxes", "Aggregated_Taxes");

                axisBankMapping.put("Trade Time", "Trade_Time");


    	        axisBankMapping.put("CGST", "CGST");
    	        axisBankMapping.put("Stamp Duty", "Stamp_Duty");
    	        axisBankMapping.put("Transn Chrg", "Transn_Chrg");
    	        axisBankMapping.put("CGST on Transn Chrg", "CGST_on_Transn_Chrg");
    	        axisBankMapping.put("STT", "STT");
    	        axisBankMapping.put("Sebi Turnover Tax", "Sebi_Turnover_Tax");
    	        axisBankMapping.put("SGST", "SGST");
    	        axisBankMapping.put("IGST", "IGST");
    	        axisBankMapping.put("Other Chrg", "Other_Chrg");

    	        PLATFORM_MAPPINGS.put("Axis Bank", axisBankMapping);
    	        
    	        
        PLATFORM_MAPPINGS.put("Zerodha", Map.of(
                "trade_date", "Trade_Date",
                "exchange", "Exchange",
                "symbol", "Scrip_Name",
                "trade_type", "Order_Type",
                "trade_id", "Trade_Id",
                "quantity", "Qty",
                "price", "Mkt_Price",
                "Brok_amt", "Brok_Amt"
        ));
        
        PLATFORM_MAPPINGS.put("Groww", Map.of(
                "trade_date", "Trade_Date",
                "exchange", "Exchange",
                "symbol", "Scrip_Name",
                "trade_type", "Order_Type",
                "Exchange Order Id", "Trade_Id",
                "quantity", "Qty",
                "price", "Mkt_Price",
                "Brok_amt", "Brok_Amt"
        ));
        
        //other platform shared by Amaan 
        PLATFORM_MAPPINGS.put("HDFC", Map.of(
                "Trd Dt", "Trade_Date",
                "Exch", "Exchange",
                "Scrip Name", "Scrip_Name",
                "Buy/Sell", "Order_Type",
                "Qty", "Qty",
                "Mkt Price", "Mkt_Price",
                "Brok Amt", "Brok_Amt" ,
                "Aggregated Taxes", "Aggregated_Taxes"
        ));

         //Own platform for Learning
        PLATFORM_MAPPINGS.put("Own", Map.of(
        	    "Date", "Trade_Date",
        	    "Exch", "Exchange",
        	    "Time", "Trade_Time",           
        	    "Symbol", "Scrip_Name",
        	    "OrderType", "Order_Type",
        	    "Qty", "Qty",
        	    "Price", "Mkt_Price",
        	    "BrokerageAmount", "Brok_Amt"
        ));
        
        
        //other platform shared by Amaan 
        // PLATFORM_MAPPINGS.put("Other", Map.of(
        //         "trade_date", "Trade_Date",
        //         "exchange", "Exchange",
        //         "Stock Names", "Scrip_Name",
        //         "trade_type", "Order_Type",
        //         "quantity", "Qty",
        //         "price", "Mkt_Price",
        //         "brokerage amount", "Brok_Amt"
        // ));

        // PLATFORM_MAPPINGS.put("Other", Map.of(
        //         "Trd Dt", "Trade_Date",
        //         "Exch", "Exchange",
        //         "Scrip Name", "Scrip_Name",
        //         "Buy/Sell", "Order_Type",
        //         "Qty", "Qty",
        //         "Mkt Price", "Mkt_Price",
        //         "Brok Amt", "Brok_Amt",
        //         "Aggregated Taxes", "Aggregated_Taxes"
        // ));
    }

    public Map<String, String> getMapping(String platform) {
        return PLATFORM_MAPPINGS.getOrDefault(platform, Collections.emptyMap());
    }

    public List<String> getTaxColumns() {
        return TAX_COLUMNS;
    }
}

