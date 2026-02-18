package com.example.prog.indices.serviceImpl;


import com.example.prog.indices.service.IndexService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Service
public class IndexServiceImpl implements IndexService {

    @Value("${indices.provider.base-url}")
    private String baseUrl;


    @Override
    public String getIndexData(String indexName) {
        try {
            // Build proper URL with query param (encodes spaces as %20)
            URI uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
                    .queryParam("index_name", indexName)
                    .build()
                    .encode()
                    .toUri();

            RestTemplate restTemplate = new RestTemplate();
            return restTemplate.getForObject(uri, String.class);

        } catch (RestClientException e) {
            throw new RuntimeException("Error fetching index data from provider for " + indexName, e);
        }
    }
}

