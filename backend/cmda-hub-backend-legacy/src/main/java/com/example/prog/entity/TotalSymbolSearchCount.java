package com.example.prog.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.time.LocalDateTime;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "EquityHub_Search_Count")
@Data
public class TotalSymbolSearchCount {



    @Id
   @Column(name = "symbol", nullable = false, unique = true)
    private String symbol;

    @Column(name = "total_count", nullable = false)
    private int totalCount;


    private LocalDateTime lastUpdated;

 
      // Default constructor
    public TotalSymbolSearchCount() {}

    public TotalSymbolSearchCount(String symbol, int totalCount) {
        this.symbol = symbol;
        this.totalCount = totalCount;
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and Setters
    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
