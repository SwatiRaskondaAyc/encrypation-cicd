package com.example.prog.equity_insights.services;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;
import org.springframework.beans.factory.annotation.Value;

@Service
public class EquityInsightsServiceWrap {

    @Value("${api.key}")
    private String apiKey;

    private static final String BASE_URL = "http://equity_insights_ms-app-1:9001/api/v1/equity-insights";

    private final RestTemplate restTemplate;

    public EquityInsightsServiceWrap() {
        this.restTemplate = new RestTemplate();
    }

    // ------------------------------------------------------------------------
    // GET => /search/options
    // ------------------------------------------------------------------------
    public String searchOptions() {
        String url = BASE_URL + "/search/options";

        HttpEntity<String> entity = new HttpEntity<>(createHeaders());

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class);

            return response.getBody();

        } catch (HttpStatusCodeException ex) {
            return buildErrorJson("Options API Error", url,
                    ex.getStatusCode().value(), ex.getResponseBodyAsString(), ex.getMessage());

        } catch (ResourceAccessException ex) {
            return buildErrorJson("Unable to reach Options API", url,
                    0, null, ex.getMessage());

        } catch (Exception ex) {
            return buildErrorJson("Unexpected error", url,
                    0, null, ex.getMessage());
        }
    }

    // ------------------------------------------------------------------------
    // GET => /price-action-history/{fincode}
    // ------------------------------------------------------------------------
    public String getPriceActionHistory(String fincode, String start_date, String end_date) {

    String url = BASE_URL + "/candle-chart/price-action-history/" 
                 + fincode 
                 + "?start_date=" + start_date 
                 + "&end_date=" + end_date;

        HttpEntity<String> entity = new HttpEntity<>(createHeaders());

        try {
            ResponseEntity<String> response =
                    restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return response.getBody();

        } catch (HttpStatusCodeException ex) {
            return buildErrorJson("Price action history API Error", url,
                    ex.getStatusCode().value(), ex.getResponseBodyAsString(), ex.getMessage());

        } catch (ResourceAccessException ex) {
            return buildErrorJson("Unable to reach price action API", url,
                    0, null, ex.getMessage());

        } catch (Exception ex) {
            return buildErrorJson("Unexpected error", url,
                    0, null, ex.getMessage());
        }
    }

    // ------------------------------------------------------------------------
    // GET => /micro-patterns/{fincode}
    // ------------------------------------------------------------------------
    public String getMicroPatterns(String fincode) {
        String url = BASE_URL + "/candle-chart/micro-patterns/" + fincode;

        HttpEntity<String> entity = new HttpEntity<>(createHeaders());

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class);

            return response.getBody();

        } catch (HttpStatusCodeException ex) {
            return buildErrorJson("Micro pattern API Error", url,
                    ex.getStatusCode().value(), ex.getResponseBodyAsString(), ex.getMessage());

        } catch (ResourceAccessException ex) {
            return buildErrorJson("Unable to reach micro pattern API", url,
                    0, null, ex.getMessage());

        } catch (Exception ex) {
            return buildErrorJson("Unexpected error", url,
                    0, null, ex.getMessage());
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);
        headers.set("Origin", "https://cmdahub.com");
        headers.set("Referer", "https://cmdahub.com");
        headers.set("Content-Type", "application/json");
        return headers;
    }

    private String buildErrorJson(
            String message, String url, int statusCode,
            String fastApiResponse, String exceptionMessage) {

        String escapedResponse = fastApiResponse != null
                ? fastApiResponse.replace("\"", "\\\"")
                : null;

        return "{\n" +
                "  \"error\": \"" + message + "\",\n" +
                "  \"url\": \"" + url + "\",\n" +
                "  \"status_code\": " + statusCode + ",\n" +
                "  \"fastapi_response\": " + (escapedResponse == null ? "null" : "\"" + escapedResponse + "\"") + ",\n" +
                "  \"exception\": \"" + exceptionMessage + "\"\n" +
                "}";
    }
}