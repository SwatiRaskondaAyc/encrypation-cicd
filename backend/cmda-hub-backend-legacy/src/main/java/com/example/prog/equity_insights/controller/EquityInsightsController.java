package com.example.prog.equity_insights.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.prog.equity_insights.services.EquityInsightsServiceWrap;

@RestController
@RequestMapping("/api/equity-insights")
public class EquityInsightsController {

    @Autowired
    private EquityInsightsServiceWrap equityInsightsService;


    @GetMapping("/search/options")
    public String searchOptions() {
        return equityInsightsService.searchOptions();
    }

    @GetMapping("/price-action-history/{fincode}")
    public String getPriceActionHistory(
            @PathVariable String fincode,
            @RequestParam String start_date,
            @RequestParam String end_date) {
        return equityInsightsService.getPriceActionHistory(fincode, start_date, end_date);
    }


    @GetMapping("/micro-patterns/{fincode}")
    public String getMicroPatterns(@PathVariable String fincode) {
        return equityInsightsService.getMicroPatterns(fincode);
    }

}