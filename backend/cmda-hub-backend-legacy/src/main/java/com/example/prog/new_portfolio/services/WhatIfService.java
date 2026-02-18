package com.example.prog.new_portfolio.services;

import com.example.prog.new_portfolio.exception.PythonServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Service
public class WhatIfService {

    private final RestTemplate restTemplate;
    private final String FASTAPI_BASE_URL;

    public WhatIfService(RestTemplate restTemplate,
                         @Value("${services.portfolio-analysis.url}") String url) {
        this.restTemplate = restTemplate;
        this.FASTAPI_BASE_URL = url;
    }

    public String enrichHoldings(Object payload) {
        return post("/api/what-if/enrich-holdings", payload);
    }

    public String getAllSectors() {
        try {
            return restTemplate.getForObject(
                    FASTAPI_BASE_URL + "/api/what-if/sectors",
                    String.class);
        } catch (HttpStatusCodeException ex) {
            throw new PythonServiceException(
                    "FastAPI error while fetching sectors: " + ex.getResponseBodyAsString(),
                    ex
            );
        } catch (ResourceAccessException ex) {
            throw new PythonServiceException(
                    "FastAPI service unavailable while fetching sectors",
                    ex
            );
        }
    }

    public String getSectorHierarchy(String sector) {
        try {
            return restTemplate.getForObject(
                    FASTAPI_BASE_URL + "/api/what-if/hierarchy/sector/" + sector,
                    String.class);
        } catch (HttpStatusCodeException ex) {
            throw new PythonServiceException(
                    "FastAPI error while fetching sector hierarchy: " + ex.getResponseBodyAsString(),
                    ex
            );
        } catch (ResourceAccessException ex) {
            throw new PythonServiceException(
                    "FastAPI service unavailable while fetching sector hierarchy",
                    ex
            );
        }
    }

    public String getStockHierarchy(String symbol) {
        try {
            return restTemplate.getForObject(
                    FASTAPI_BASE_URL + "/api/what-if/sector-hierarchy/" + symbol,
                    String.class);
        } catch (HttpStatusCodeException ex) {
            throw new PythonServiceException(
                    "FastAPI error while fetching stock hierarchy: " + ex.getResponseBodyAsString(),
                    ex
            );
        } catch (ResourceAccessException ex) {
            throw new PythonServiceException(
                    "FastAPI service unavailable while fetching stock hierarchy",
                    ex
            );
        }
    }

    public String simulate(Object payload) {
        return post("/api/what-if/simulate", payload);
    }

    private String post(String path, Object payload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Object> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    FASTAPI_BASE_URL + path,
                    entity,
                    String.class
            );

            return response.getBody();

        } catch (HttpStatusCodeException ex) {
            throw new PythonServiceException(
                    "FastAPI error on " + path + ": " + ex.getResponseBodyAsString(),
                    ex
            );
        } catch (ResourceAccessException ex) {
            throw new PythonServiceException(
                    "FastAPI service unavailable on " + path,
                    ex
            );
        }
    }
}
