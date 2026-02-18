package com.example.prog.reddit.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class RedditScrapeService {

    private final RestTemplate restTemplate = new RestTemplate();

    // Change host if you run Python elsewhere (e.g. localhost:3000)
    // private static final String PYTHON_SERVICE_URL = "http://app:3000/reddit_scrape";
    private static final String PYTHON_SERVICE_URL = "http://localhost:8000/reddit_scrape";


    /**
     * Calls Python FastAPI and returns the JSON string.
     */
    public String getRedditData(String keyword, String timeframe) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(PYTHON_SERVICE_URL)
                    .queryParam("keyword", keyword)
                    .queryParam("timeframe", timeframe)
                    .encode()
                    .toUriString();

            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            throw new RuntimeException(
                "Error fetching Reddit data for keyword=" + keyword +
                " timeframe=" + timeframe, e);
        }
    }
}