package com.example.prog.serviceimpl.landingpage;

import com.example.prog.service.landingpage.LandingPageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class LandingPageServiceImpl implements LandingPageService {

    private static final Logger logger = LoggerFactory.getLogger(LandingPageServiceImpl.class);

    // @Value("${fastapi.sectoral.url:http://app:3000/equity_sectoral_analysis}")
        @Value("${fastapi.sectoral.url:http://mtm_v1-app-1:3000/equity_sectoral_analysis}")

    private String sectorSummaryUrl;

    // @Value("${fastapi.dividend.url:http://app:3000/industry_dividend_yield}")
        @Value("${fastapi.dividend.url:http://mtm_v1-app-1:3000/industry_dividend_yield}")

    private String dividendYieldUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public Object getSectorSummary() throws Exception {
        return callFastApi(sectorSummaryUrl, "sectoral analysis");
    }

    @Override
    public Object getIndustryDividendYield() throws Exception {
        return callFastApi(dividendYieldUrl, "industry dividend yield");
    }

    private Object callFastApi(String url, String logContext) {
        logger.info("Calling FastAPI endpoint for {}: {}", logContext, url);

        try {
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                logger.error("FastAPI returned non-success for {}: {}", logContext, response.getStatusCode());
                throw new RuntimeException("Failed to fetch " + logContext + " from FastAPI");
            }

            logger.debug("FastAPI Response for {}: {}", logContext, response.getBody());
            return response.getBody();

        } catch (Exception e) {
            logger.error("Error calling FastAPI for {}: {}", logContext, e.getMessage());
            throw new RuntimeException("Error calling FastAPI for " + logContext + ": " + e.getMessage());
        }
    }
}

