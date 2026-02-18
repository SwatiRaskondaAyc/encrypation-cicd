package com.example.prog.candle_pattern.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Service
public class CandlePatternServiceWrap {

    private final RestTemplate restTemplate;
    
    @Value("${api.key}")
    private String apiKey;
    
    // private static final String FASTAPI_BASE_URL = "http://0.0.0.0:9000";

    // private static final String FASTAPI_BASE_URL = "http://candle_app:9000";
    private static final String FASTAPI_BASE_URL = "http://localhost:9000";

    
    public CandlePatternServiceWrap() {
        this.restTemplate = new RestTemplate();
    }
    
     public String scanPatterns(String requestBody) {
        String url = FASTAPI_BASE_URL + "/patterns/scan";
        
        HttpHeaders headers = createHeaders();

         System.out.println("Headers being sent:");
    headers.forEach((key, values) -> {
        System.out.println(key + ": " + values);
    });

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                String.class
            );
            return response.getBody();
            
        } catch (HttpStatusCodeException httpEx) {
            return buildErrorJson(
                "Pattern scan API returned an error",
                url,
                httpEx.getStatusCode().value(),
                httpEx.getResponseBodyAsString(),
                httpEx.getMessage()
            );
            
        } catch (ResourceAccessException connEx) {
            return buildErrorJson(
                "Unable to reach Pattern scan service",
                url,
                0,
                null,
                connEx.getMessage()
            );
            
        } catch (Exception ex) {
            return buildErrorJson(
                "Unexpected error while calling Pattern scan API",
                url,
                0,
                null,
                ex.getMessage()
            );
        }
    }
    
    public String getPriceActionData(String requestBody) {
        String url = FASTAPI_BASE_URL + "/price-action/one-year";
        
        HttpHeaders headers = createHeaders();
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                String.class
            );
            return response.getBody();
            
        } catch (HttpStatusCodeException httpEx) {
            return buildErrorJson(
                "Price action API returned an error",
                url,
                httpEx.getStatusCode().value(),
                httpEx.getResponseBodyAsString(),
                httpEx.getMessage()
            );
            
        } catch (ResourceAccessException connEx) {
            return buildErrorJson(
                "Unable to reach Price action service",
                url,
                0,
                null,
                connEx.getMessage()
            );
            
        } catch (Exception ex) {
            return buildErrorJson(
                "Unexpected error while calling Price action API",
                url,
                0,
                null,
                ex.getMessage()
            );
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
    
    private String buildErrorJson(String message,
                                  String url,
                                  int statusCode,
                                  String fastApiResponse,
                                  String exceptionMessage) {
        
        // Escape JSON special characters
        String escapedResponse = fastApiResponse != null ? 
            fastApiResponse.replace("\"", "\\\"")
                          .replace("\n", "\\n")
                          .replace("\r", "\\r") : null;
        
        String escapedException = exceptionMessage != null ?
            exceptionMessage.replace("\"", "\\\"")
                           .replace("\n", "\\n")
                           .replace("\r", "\\r") : "";
        
        return "{\n" +
               "  \"error\": \"" + message + "\",\n" +
               "  \"url\": \"" + url + "\",\n" +
               "  \"status_code\": " + statusCode + ",\n" +
               "  \"fastapi_response\": " + (escapedResponse == null ? "null" : "\"" + escapedResponse + "\"") + ",\n" +
               "  \"exception\": \"" + escapedException + "\"\n" +
               "}";
    }
}



// package com.example.prog.candle_pattern.service;

// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.HttpStatusCodeException;
// import org.springframework.web.client.ResourceAccessException;
// import org.springframework.web.client.RestTemplate;

// @Service
// public class CandlePatternFastApiService {

//     private final RestTemplate restTemplate = new RestTemplate();

//     // For Docker container internal communication
//     private static final String FASTAPI_URL = "http://app:9000/patterns/scan";

//     public ResponseEntity<String> scanPatterns(String requestBody, String apiKey) {

//         HttpHeaders headers = new HttpHeaders();
//         headers.set("x-api-key", apiKey);
//         headers.set("origin", "https://cmdahub.com");
//         headers.setContentType(MediaType.APPLICATION_JSON);

//         HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

//         try {
//             String response = restTemplate.postForObject(
//                     FASTAPI_URL,
//                     entity,
//                     String.class
//             );
//             return ResponseEntity.ok(response);

//         } catch (HttpStatusCodeException httpEx) {
//             return ResponseEntity.ok(buildErrorJson(
//                     "FASTAPI_ERROR",
//                     "FastAPI returned a non-200 status",
//                     FASTAPI_URL,
//                     httpEx.getStatusCode().value(),
//                     httpEx.getResponseBodyAsString(),
//                     httpEx.getMessage()
//             ));

//         } catch (ResourceAccessException connEx) {
//             return ResponseEntity.ok(buildErrorJson(
//                     "CONNECTION_ERROR",
//                     "Unable to reach FastAPI service",
//                     FASTAPI_URL,
//                     0,
//                     null,
//                     connEx.getMessage()
//             ));

//         } catch (Exception ex) {
//             return ResponseEntity.ok(buildErrorJson(
//                     "UNKNOWN_ERROR",
//                     "Unexpected error calling FastAPI",
//                     FASTAPI_URL,
//                     0,
//                     null,
//                     ex.getMessage()
//             ));
//         }
//     }


//     private String buildErrorJson(
//             String errorType,
//             String message,
//             String url,
//             int httpStatus,
//             String fastApiResponse,
//             String exceptionMessage
//     ) {
//         return "{\n" +
//                 "  \"success\": false,\n" +
//                 "  \"error_type\": \"" + errorType + "\",\n" +
//                 "  \"message\": \"" + message + "\",\n" +
//                 "  \"url_called\": \"" + url + "\",\n" +
//                 "  \"fastapi_status\": " + httpStatus + ",\n" +
//                 "  \"fastapi_response\": " + (fastApiResponse == null ? null : "\"" + fastApiResponse.replace("\"", "'") + "\"") + ",\n" +
//                 "  \"exception\": \"" + exceptionMessage + "\",\n" +
//                 "  \"timestamp\": \"" + java.time.LocalDateTime.now() + "\"\n" +
//                 "}";
//     }
// }
