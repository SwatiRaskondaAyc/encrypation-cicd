package com.example.prog.brokerage.repository;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.prog.brokerage.dto.BrokerageRequest;

@Repository
public class BrokeragePythonRepository {

    private final RestTemplate restTemplate;
    private final String pythonUrl;

    public BrokeragePythonRepository(RestTemplate restTemplate,
                                    //  @Value("${python.url:http://app:3000/calculate_brokerage}") String pythonUrl) {
        
                                             @Value("${python.url:http://localhost:8000/calculate_brokerage}") String pythonUrl) {

                                     this.restTemplate = restTemplate;
        this.pythonUrl = pythonUrl;
    }

    public String calculate(BrokerageRequest request) {
        String url = UriComponentsBuilder.fromHttpUrl(pythonUrl)
                .queryParam("exchange", request.getExchange())
                .queryParam("buy_price", request.getBuyPrice())
                .queryParam("sell_price", request.getSellPrice())
                .queryParam("gender", request.getGender())
                .queryParam("quantity", request.getQuantity())
                .queryParam("broker", request.getBroker())
                .queryParam("timeframe", request.getTimeframe())
                .toUriString();

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }
}