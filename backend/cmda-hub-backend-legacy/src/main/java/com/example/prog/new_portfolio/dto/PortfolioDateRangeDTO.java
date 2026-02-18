package com.example.prog.new_portfolio.dto;

import lombok.Data;
import java.time.LocalDate;

@Data // Assuming you use Lombok's @Data for getters/setters/constructor
public class PortfolioDateRangeDTO {
    private final LocalDate minDate;
    private final LocalDate maxDate;

    // All-args constructor provided by @Data or manually:
    public PortfolioDateRangeDTO(LocalDate minDate, LocalDate maxDate) {
        this.minDate = minDate;
        this.maxDate = maxDate;
    }
}