package com.example.prog.new_portfolio.services;



import com.example.prog.new_portfolio.exception.PythonServiceException;

import com.example.prog.new_portfolio.exception.ValidationException;

import org.springframework.core.io.FileSystemResource;

import org.springframework.http.*;

import org.springframework.stereotype.Service;

import org.springframework.util.LinkedMultiValueMap;

import org.springframework.util.MultiValueMap;

import org.springframework.web.client.HttpStatusCodeException;

import org.springframework.web.client.RestTemplate;

import org.springframework.web.multipart.MultipartFile;



import java.io.File;

import java.util.HashMap;

import java.util.Map;



@Service

public class PortfolioAnalysisService {



    private final RestTemplate restTemplate;



    // FastAPI base URL - use localhost for local development
    private final String FASTAPI_BASE_URL = "http://localhost:8000";



    public PortfolioAnalysisService(RestTemplate restTemplate) {

        this.restTemplate = restTemplate;

    }



    /**

     * Matches Python: @app.post("/api/normalize-portfolio")

     * Logic: Sends MultipartFile, receives the raw JSON array string.

     */

    public String normalizePortfolio(MultipartFile file, String brokerId) {

        validateFile(file);

        File tempFile = null;



        try {

            tempFile = convertToTempFile(file, "normalize-");



            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.MULTIPART_FORM_DATA);



            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            body.add("file", new FileSystemResource(tempFile));



            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);



            String fullUrl = FASTAPI_BASE_URL + "/api/normalize-portfolio";



            ResponseEntity<String> response = restTemplate.postForEntity(fullUrl, request, String.class);



            return response.getBody();



        } catch (HttpStatusCodeException ex) {

            throw new PythonServiceException("Python API Error: " + ex.getResponseBodyAsString(), ex);

        } catch (Exception ex) {

            throw new PythonServiceException("Normalization failed: " + ex.getMessage(), ex);

        } finally {

            if (tempFile != null && tempFile.exists()) tempFile.delete();

        }

    }



    /**

     * Matches Python: @app.post("/api/portfolio-analysis")

     * Logic: Wraps the JSON list into the "transactions" key.

     */

    public String analyzePortfolio(Object transactionsData) {

        String url = FASTAPI_BASE_URL + "/api/portfolio-analysis";



        try {

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);



            Map<String, Object> payload = new HashMap<>();

            payload.put("transactions", transactionsData);



            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);



            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);



            return response.getBody();

        } catch (HttpStatusCodeException ex) {

            throw new PythonServiceException("Analysis API Error: " + ex.getResponseBodyAsString(), ex);

        } catch (Exception ex) {

            throw new PythonServiceException("Analysis API failed: " + ex.getMessage(), ex);

        }

    }



    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) throw new ValidationException("File is empty");

    }



    private File convertToTempFile(MultipartFile file, String prefix) throws Exception {

        String originalName = file.getOriginalFilename();

        String ext = (originalName != null && originalName.contains("."))

                ? originalName.substring(originalName.lastIndexOf("."))

                : ".tmp";

        File temp = File.createTempFile(prefix, ext);

        file.transferTo(temp);

        return temp;

    }

}

