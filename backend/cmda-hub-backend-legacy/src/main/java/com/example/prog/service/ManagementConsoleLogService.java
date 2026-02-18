package com.example.prog.service;

import com.example.prog.dto.LoginLogRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;

@Service
public class ManagementConsoleLogService {

    private static final Logger logger = LoggerFactory.getLogger(ManagementConsoleLogService.class);

    @Value("${management.console.api.url}")
    private String apiUrl;

    @Value("${management.console.api.key}")
    private String apiKey;

    private RestTemplate restTemplate;

    @PostConstruct
    public void init() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000); // 5 seconds
        factory.setReadTimeout(5000);    // 5 seconds
        this.restTemplate = new RestTemplate(factory);
        logger.info("ManagementConsoleLogService initialized with 5s timeouts.");
    }

    @Async
    public void recordExternalLogin(LoginLogRequest request) {
        request.setActivityType("LOGIN");
        sendToManagementConsole(request);
    }

    @Async
    public void recordExternalLogout(LoginLogRequest request) {
        request.setActivityType("LOGOUT");
        sendToManagementConsole(request);
    }

    private void sendToManagementConsole(LoginLogRequest request) {
        long startTime = System.currentTimeMillis();
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-KEY", apiKey);
            
            HttpEntity<LoginLogRequest> entity = new HttpEntity<>(request, headers);
            
            // Note: The apiUrl should include the correct endpoint for the management console
            String targetUrl = apiUrl;

            logger.info("ExternalLog: Sending {} activity for user {} to {}", request.getActivityType(), request.getUserId(), targetUrl);
            restTemplate.postForEntity(targetUrl, entity, String.class);
            
            long duration = System.currentTimeMillis() - startTime;
            logger.info("ExternalLog: Successfully recorded {} activity. Latency: {}ms", request.getActivityType(), duration);
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            logger.error("ExternalLog: Failed to record {} activity after {}ms. Error: {}", 
                request.getActivityType(), duration, e.getMessage());
        }
    }
}
