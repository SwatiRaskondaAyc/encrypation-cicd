//package com.example.prog.new_portfolio.dto;
//
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//import com.fasterxml.jackson.annotation.JsonProperty;
//import lombok.Data;
//
//import java.time.LocalDate;
//
//@Data
//@JsonIgnoreProperties(ignoreUnknown = true) // safe guard
//public class TradeTransactionDTO {
//
//    @JsonProperty("Stock name")
//    private String stockName;
//
//    @JsonProperty("Scrip_Name")
//    private String scripName;
//
//    @JsonProperty("ISIN")
//    private String isin;
//
//    @JsonProperty("Order_Type")
//    private String orderType;
//
//    @JsonProperty("Qty")
//    private Integer qty;
//
//    @JsonProperty("Amount")
//    private Double amount;
//
//    @JsonProperty("Exchange")
//    private String exchange;
//
//    @JsonProperty("Exchange Order Id")
//    private String exchangeOrderId;
//
//    @JsonProperty("Trade_Date")
//    private LocalDate tradeDate;
//
//    @JsonProperty("Order status")
//    private String orderStatus;
//
//    @JsonProperty("Mkt_Price")
//    private Double mktPrice;
//
//    @JsonProperty("Brokerage_Amt")
//    private Double brokerageAmt;
//
//    @JsonProperty("Taxes")
//    private Double taxes;
//
//    @JsonProperty("Symbol")
//    private String symbol;
//}
/// //////////////////////////////////////////////////////////////
//package com.example.prog.new_portfolio.dto;
////
////import com.fasterxml.jackson.annotation.JsonFormat;
////import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
////import com.fasterxml.jackson.annotation.JsonProperty;
////import lombok.Data;
////import java.time.LocalDateTime;
////import java.time.OffsetDateTime;
////
////@Data
////@JsonIgnoreProperties(ignoreUnknown = true)
////public class TradeTransactionDTO {
////
////    @JsonProperty("universal_trade_id")
////    private String universalTradeId;
////
////    @JsonProperty("Symbol")
////    private String symbol;
////
////    @JsonProperty("Scrip_Name")
////    private String scripName;
////
//////    @JsonProperty("Trade_execution_time")
//////    private LocalDateTime tradeExecutionTime;
////
////    @JsonProperty("Trade_execution_time")
////    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
////    private LocalDateTime tradeExecutionTime;
////
////    @JsonProperty("Order_Type")
////    private String orderType;
////
////    @JsonProperty("Qty")
////    private Double qty;
////
////    @JsonProperty("Mkt_Price")
////    private Double mktPrice;
////
////    @JsonProperty("Amount")
////    private Double amount;
////
////    @JsonProperty("Exchange")
////    private String exchange;
////
////    @JsonProperty("Series")
////    private String series;
////
////    @JsonProperty("ISIN")
////    private String isin;
////
////    @JsonProperty("Intraday_Flag")
////    private Boolean intradayFlag;
////
////    @JsonProperty("Brokerage")
////    private Double brokerage;
////
////    @JsonProperty("STT")
////    private Double stt;
////
////    @JsonProperty("TransN_Chgs")
////    private Double transNChgs;
////
////    @JsonProperty("Stamp_Duty")
////    private Double stampDuty;
////
////    @JsonProperty("Sebi_Tax")
////    private Double sebiTax;
////
////    @JsonProperty("CGST")
////    private Double cgst;
////
////    @JsonProperty("CGST_on_Transn_Chrg")
////    private Double cgstOnTransnChrg;
////
////    @JsonProperty("SGST")
////    private Double sgst;
////
////    @JsonProperty("IGST")
////    private Double igst;
////
////    @JsonProperty("GST_Total")
////    private Double gstTotal;
////
////    @JsonProperty("Total_Taxes")
////    private Double totalTaxes;
////
////    @JsonProperty("Total_Charges")
////    private Double totalCharges;
////}



/// ///////////////////////////////////////////////////////////////////////////////////////////////////////

package com.example.prog.new_portfolio.dto;

import com.example.prog.new_portfolio.utils.FlexibleLocalDateTimeDeserializer;
import com.example.prog.new_portfolio.utils.FlexibleStringDeserializer;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TradeTransactionDTO {
    @JsonProperty("universal_trade_id")
    private String universalTradeId;

    @JsonProperty("Symbol")
    private String symbol;

    @JsonProperty("Scrip_Name")
    private String scripName;

//    @JsonProperty("Trade_execution_time")
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
//    private LocalDateTime tradeExecutionTime;

    @JsonProperty("Trade_execution_time")
    @JsonDeserialize(using = FlexibleLocalDateTimeDeserializer.class)
    // This ensures that when returning JSON to the frontend, it is a String
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime tradeExecutionTime;

    @JsonProperty("Order_Type")
    private String orderType;

    @JsonProperty("Qty")
    private Double qty;

    @JsonProperty("Mkt_Price")
    private Double mktPrice;

//    @JsonProperty("Amount")
//    private String amount; // String to safely handle commas like "-76,067.36"
    @JsonProperty("Amount")
    @JsonDeserialize(using = FlexibleStringDeserializer.class)
    private String amount;

    @JsonProperty("Exchange")
    private String exchange;

    @JsonProperty("Series")
    private String series;

    @JsonProperty("ISIN")
    private String isin;

    @JsonProperty("Intraday_Flag")
    private Boolean intradayFlag;

    @JsonProperty("Brokerage")
    private Double brokerage;

    @JsonProperty("STT")
    private Double stt;

    @JsonProperty("TransN_Chgs")
    private Double transNChgs;

    @JsonProperty("Stamp_Duty")
    private Double stampDuty;

    @JsonProperty("Sebi_Tax")
    private Double sebiTax;

    @JsonProperty("CGST")
    private Double cgst;

    @JsonProperty("CGST_on_Transn_Chrg")
    private Double cgstOnTransnChrg;

    @JsonProperty("SGST")
    private Double sgst;

    @JsonProperty("IGST")
    private Double igst;

    @JsonProperty("GST_Total")
    private Double gstTotal;

    @JsonProperty("Total_Taxes")
    private Double totalTaxes;

    @JsonProperty("Total_Charges")
    private Double totalCharges;
}