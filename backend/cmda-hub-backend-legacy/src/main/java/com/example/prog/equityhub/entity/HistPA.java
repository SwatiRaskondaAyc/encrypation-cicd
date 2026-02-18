package com.example.prog.equityhub.entity;

import org.hibernate.annotations.Immutable;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Immutable
@Table(name = "HistPA")
public class HistPA {

    @Id
    @Column(name = "Symbol", nullable = false, length = 255)
    private String symbol;

    @Column(name = "Series", length = 255)
    private String series;

    @Column(name = "Date")
    @Temporal(TemporalType.DATE)
    private Date date;

    @Column(name = "PrevClose")
    private Float prevClose;

    @Column(name = "Open")
    private Float open;

    @Column(name = "High")
    private Float high;

    @Column(name = "Low")
    private Float low;

    @Column(name = "LastPrice")
    private Float lastPrice;

    @Column(name = "Close")
    private Float close;

    @Column(name = "AvgPrice")
    private Float avgPrice;

    @Column(name = "TotalTradedQty")
    private Float totalTradedQty;

    @Column(name = "TurnoverinRs")
    private Float turnoverInRs;

    @Column(name = "TotalTrades")
    private Float totalTrades;

    @Column(name = "DeliverableQty")
    private Long deliverableQty;

    @Column(name = "DeliveryPct")
    private Float deliveryPct;

    // Getters and Setters
    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getSeries() {
        return series;
    }

    public void setSeries(String series) {
        this.series = series;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Float getPrevClose() {
        return prevClose;
    }

    public void setPrevClose(Float prevClose) {
        this.prevClose = prevClose;
    }

    public Float getOpen() {
        return open;
    }

    public void setOpen(Float open) {
        this.open = open;
    }

    public Float getHigh() {
        return high;
    }

    public void setHigh(Float high) {
        this.high = high;
    }

    public Float getLow() {
        return low;
    }

    public void setLow(Float low) {
        this.low = low;
    }

    public Float getLastPrice() {
        return lastPrice;
    }

    public void setLastPrice(Float lastPrice) {
        this.lastPrice = lastPrice;
    }

    public Float getClose() {
        return close;
    }

    public void setClose(Float close) {
        this.close = close;
    }

    public Float getAvgPrice() {
        return avgPrice;
    }

    public void setAvgPrice(Float avgPrice) {
        this.avgPrice = avgPrice;
    }

    public Float getTotalTradedQty() {
        return totalTradedQty;
    }

    public void setTotalTradedQty(Float totalTradedQty) {
        this.totalTradedQty = totalTradedQty;
    }

    public Float getTurnoverInRs() {
        return turnoverInRs;
    }

    public void setTurnoverInRs(Float turnoverInRs) {
        this.turnoverInRs = turnoverInRs;
    }

    public Float getTotalTrades() {
        return totalTrades;
    }

    public void setTotalTrades(Float totalTrades) {
        this.totalTrades = totalTrades;
    }

    public Long getDeliverableQty() {
        return deliverableQty;
    }

    public void setDeliverableQty(Long deliverableQty) {
        this.deliverableQty = deliverableQty;
    }

    public Float getDeliveryPct() {
        return deliveryPct;
    }

    public void setDeliveryPct(Float deliveryPct) {
        this.deliveryPct = deliveryPct;
    }
}

