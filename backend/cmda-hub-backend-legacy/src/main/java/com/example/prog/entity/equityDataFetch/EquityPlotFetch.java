package com.example.prog.entity.equityDataFetch;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "equity_plot_fetch")
public class EquityPlotFetch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-generate the primary key (or use another strategy)
    private int equityhubId;

    @Column(nullable = false)  // Example of making a column mandatory
    private String symbol;

    @Column(nullable = false)
    private String companyName;

    @Column(name = "user_id", nullable = false)  // Explicit column mapping
    private int userID;

//    @Column(nullable = false)
//    private String plotName;

    @Column(name = "user_type", nullable = false)
    private String userType;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public EquityPlotFetch() {
    }

    public EquityPlotFetch(String symbol, String companyName, int userID, String plotName,
                           int equityhubId, String userType, LocalDateTime updatedAt) {
        this.symbol = symbol;
        this.companyName = companyName;
        this.userID = userID;
//        this.plotName = plotName;
        this.equityhubId = equityhubId;
        this.userType = userType;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

//    public String getPlotName() {
//        return plotName;
//    }
//
//    public void setPlotName(String plotName) {
//        this.plotName = plotName;
//    }

    public int getEquityhubId() {
        return equityhubId;
    }

    public void setEquityhubId(int equityhubId) {
        this.equityhubId = equityhubId;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // toString method for easy printing
    @Override
    public String toString() {
        return "EquityPlotFetch{" +
                "symbol='" + symbol + '\'' +
                ", companyName='" + companyName + '\'' +
                ", userID=" + userID +
//                ", plotName='" + plotName + '\'' +
                ", equityhubId=" + equityhubId +
                ", userType='" + userType + '\'' +
                ", updatedAt=" + updatedAt +
                '}';
    }
}


