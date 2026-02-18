package com.example.prog.service;

import com.example.prog.config.RateLimitProperties;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.function.Supplier;

@Service
@ConditionalOnProperty(name = "app.rate-limit.enabled", havingValue = "true", matchIfMissing = false)
public class RateLimitService {

    @Autowired(required = false)
    private ProxyManager<byte[]> proxyManager;

    @Autowired
    private RateLimitProperties properties;

    public boolean tryConsume(String category, String key) {
        if (proxyManager == null) {
            // Rate limiting is disabled, allow all requests
            return true;
        }
        
        String combinedKey = "rate_limit:" + category + ":" + key;
        RateLimitProperties.LimitConfig config = getLimitConfig(category);
        
        Supplier<BucketConfiguration> configurationSupplier = () -> {
            Bandwidth limit = Bandwidth.classic(config.getCapacity(), 
                    io.github.bucket4j.Refill.intervally(config.getRefillTokens(), Duration.ofMinutes(config.getRefillMinutes())));
            return BucketConfiguration.builder()
                    .addLimit(limit)
                    .build();
        };

        return proxyManager.builder().build(combinedKey.getBytes(), configurationSupplier)
                .tryConsume(1);
    }

    private RateLimitProperties.LimitConfig getLimitConfig(String category) {
        return switch (category.toLowerCase()) {
            case "high" -> properties.getHigh();
            case "data" -> properties.getData();
            default -> properties.getStandard();
        };
    }
}
