package com.example.prog.equityhub.controller;

import com.example.prog.equityhub.service.MarketService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class MarketController {

    private final MarketService marketService;

    public MarketController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping("/api/market/top-company")
    public Map<String, Object> getTopCompanyByClosePrice() {
        return marketService.getTopCompanyByClosePrice();
    }
}
