package com.example.prog.news.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class NewsService {

    // private static final String FASTAPI_BASE_URL = "http://app:3000/news/search";
        private static final String FASTAPI_BASE_URL = "http://localhost:8000/news/search";


    public String getNewsFromFastAPI(String query, boolean useNlp) {

        RestTemplate restTemplate = new RestTemplate();

        String url = UriComponentsBuilder.fromHttpUrl(FASTAPI_BASE_URL)
                .queryParam("query", query)
                .queryParam("use_nlp", useNlp)
                .toUriString();

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getBody();

        } catch (HttpStatusCodeException httpEx) {
            // Errors like 400, 404, 500 coming from FastAPI
            return buildErrorJson(
                    "FastAPI returned an error response",
                    url,
                    httpEx.getStatusCode().value(),
                    httpEx.getResponseBodyAsString(),
                    httpEx.getMessage()
            );

        } catch (ResourceAccessException connEx) {
            // Connection refused / timeout / DNS failures
            return buildErrorJson(
                    "Unable to reach FastAPI service",
                    url,
                    0,
                    null,
                    connEx.getMessage()
            );

        } catch (Exception ex) {
            // Unexpected errors
            return buildErrorJson(
                    "Unexpected error while calling FastAPI",
                    url,
                    0,
                    null,
                    ex.getMessage()
            );
        }
    }

    private String buildErrorJson(String message,
                                  String url,
                                  int statusCode,
                                  String fastApiResponse,
                                  String exceptionMessage) {

        return "{\n" +
                "  \"error\": \"" + message + "\",\n" +
                "  \"url\": \"" + url + "\",\n" +
                "  \"status_code\": " + statusCode + ",\n" +
                "  \"fastapi_response\": " + (fastApiResponse == null ? null : "\"" + fastApiResponse + "\"") + ",\n" +
                "  \"exception\": \"" + exceptionMessage + "\"\n" +
                "}";
    }
}

