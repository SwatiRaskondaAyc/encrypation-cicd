package com.example.prog.candle_pattern.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.prog.candle_pattern.service.CandlePatternServiceWrap;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CandlePatternControllerWrap {

    @Autowired
    private CandlePatternServiceWrap candlePatternService;

    @PostMapping("/patterns/scan")
    public String scanPatterns(@RequestBody String requestBody) {
        return candlePatternService.scanPatterns(requestBody);
    }

    @PostMapping("/price-action/one-year")
    public String getPriceActionData(@RequestBody String requestBody) {
        return candlePatternService.getPriceActionData(requestBody);
    }
    
  
}


