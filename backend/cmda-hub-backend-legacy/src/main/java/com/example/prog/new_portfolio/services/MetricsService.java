package com.example.prog.new_portfolio.services;

import com.example.prog.new_portfolio.exception.PythonServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;


import java.util.Map;

@Service
public class MetricsService {

    private final RestTemplate restTemplate;
    private final String FASTAPI_BASE_URL;

    public MetricsService(RestTemplate restTemplate,
                          @Value("${services.portfolio-analysis.url}") String url) {
        this.restTemplate = restTemplate;
        this.FASTAPI_BASE_URL = url;
    }

    public String calculateBeta(Map<String, Object> payload) {
        return postJson("/api/calculate-beta", payload);
    }

    public String calculateAlpha(Map<String, Object> payload) {
        return postJson("/api/calculate-alpha", payload);
    }

    public String calculateRatios(Map<String, Object> payload) {
        return postJson("/api/calculate-ratios", payload);
    }

    private String postJson(String path, Object payload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Object> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response =
                    restTemplate.postForEntity(FASTAPI_BASE_URL + path, request, String.class);

            return response.getBody();
        } catch (HttpStatusCodeException ex) {
            throw new PythonServiceException(ex.getResponseBodyAsString(), ex);
        }
    }
}

