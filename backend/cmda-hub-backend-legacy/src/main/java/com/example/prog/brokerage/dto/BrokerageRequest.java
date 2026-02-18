package com.example.prog.brokerage.dto;


import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Set;

public class BrokerageRequest {

    @NotBlank(message = "exchange is required")
    @Pattern(regexp = "NSE|BSE", message = "exchange must be NSE or BSE")
    private String exchange;

    @NotNull(message = "buy_price is required")
    @DecimalMin(value = "0", inclusive = true)
    private BigDecimal buyPrice;

    @NotNull(message = "sell_price is required")
    @DecimalMin(value = "0", inclusive = true)
    private BigDecimal sellPrice;

    @NotBlank(message = "gender is required")
    @Pattern(regexp = "MALE|FEMALE|OTHER")
    private String gender;

    @NotNull(message = "quantity is required")
    @Min(1)
    private Integer quantity;

    @NotBlank(message = "broker is required")
    private String broker;

    @NotBlank(message = "timeframe is required")
    @Pattern(regexp = "Delivery|Intraday")
    private String timeframe;

    // Valid brokers
    private static final Set<String> VALID_BROKERS = Set.of(
        "GROWW", "ZERODHA", "ANGELONE", "PAYTMMONEY", "DHAN",
        "5PAISA", "UPSTOX", "FYERS", "PROSTOCKS",
        "ICICIDIRECT_MONEYSAVER", "ICICIDIRECT_PRIME_TIER1", "ICICIDIRECT_IVALUE",
        "KOTAK_TRADE_FREE_YOUTH", "KOTAK_TRADE_FREE",
        "INDMONEY", "PHONEPE_SHARE_MARKET", "SHAREKHAN", "SHOONYA", "SAMCO"
    );

    // Manual getters
    public String getExchange() { return exchange; }
    public BigDecimal getBuyPrice() { return buyPrice; }
    public BigDecimal getSellPrice() { return sellPrice; }
    public String getGender() { return gender; }
    public Integer getQuantity() { return quantity; }
    public String getBroker() { return broker; }
    public String getTimeframe() { return timeframe; }

    // Manual setters
    public void setExchange(String exchange) { this.exchange = exchange; }
    public void setBuyPrice(BigDecimal buyPrice) { this.buyPrice = buyPrice; }
    public void setSellPrice(BigDecimal sellPrice) { this.sellPrice = sellPrice; }
    public void setGender(String gender) { this.gender = gender; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setBroker(String broker) { this.broker = broker; }
    public void setTimeframe(String timeframe) { this.timeframe = timeframe; }

    // Validation method
    public void validateBroker() {
        if (!VALID_BROKERS.contains(this.broker)) {
            throw new IllegalArgumentException("Invalid broker: " + broker);
        }
        if ("ICICIDIRECT_IVALUE".equalsIgnoreCase(this.broker) && "Delivery".equalsIgnoreCase(this.timeframe)) {
            throw new IllegalArgumentException("Delivery trades not allowed on ICICIDIRECT_IVALUE plan");
        }
    }
}