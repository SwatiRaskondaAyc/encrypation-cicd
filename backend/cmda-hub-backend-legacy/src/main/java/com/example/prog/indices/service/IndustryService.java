// package com.example.prog.indices.service;

// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;
// import java.net.URLEncoder;
// import java.nio.charset.StandardCharsets;

// @Service
// public class IndustryService {

//     private final RestTemplate restTemplate = new RestTemplate();
//     private static final String PYTHON_SERVICE_URL = "http://app:3000/industry_dividend_details?industry_name=";

//     public String getDividendDetails(String industryName) {
//         String encoded = URLEncoder.encode(industryName, StandardCharsets.UTF_8);
//         String url = PYTHON_SERVICE_URL + encoded;
//         return restTemplate.getForObject(url, String.class);
//     }
// }

package com.example.prog.indices.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Service
public class IndustryService {

    private final RestTemplate restTemplate = new RestTemplate();
    // private static final String PYTHON_SERVICE_URL = "http://app:3000/industry_dividend_details";
    private static final String PYTHON_SERVICE_URL = "http://localhost:8000/industry_dividend_details";


    public String getDividendDetails(String industryName) {
        // Build the URI safely with automatic encoding
        URI uri = UriComponentsBuilder
                .fromHttpUrl(PYTHON_SERVICE_URL)
                .queryParam("industry_name", industryName)
                .build()
                .encode()   // ✅ Encode special characters like spaces, &, -
                .toUri();

        return restTemplate.getForObject(uri, String.class);
    }
}