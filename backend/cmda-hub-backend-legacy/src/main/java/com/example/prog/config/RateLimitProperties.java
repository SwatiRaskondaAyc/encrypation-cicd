package com.example.prog.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.rate-limit")
public class RateLimitProperties {
    private LimitConfig high = new LimitConfig(5, 1);
    private LimitConfig data = new LimitConfig(20, 1);
    private LimitConfig standard = new LimitConfig(60, 1);

    public LimitConfig getHigh() { return high; }
    public void setHigh(LimitConfig high) { this.high = high; }
    public LimitConfig getData() { return data; }
    public void setData(LimitConfig data) { this.data = data; }
    public LimitConfig getStandard() { return standard; }
    public void setStandard(LimitConfig standard) { this.standard = standard; }

    public static class LimitConfig {
        private int capacity;
        private int refillTokens;
        private int refillMinutes = 1;

        public LimitConfig() {}
        public LimitConfig(int capacity, int refillTokens) {
            this.capacity = capacity;
            this.refillTokens = refillTokens;
        }

        public int getCapacity() { return capacity; }
        public void setCapacity(int capacity) { this.capacity = capacity; }
        public int getRefillTokens() { return refillTokens; }
        public void setRefillTokens(int refillTokens) { this.refillTokens = refillTokens; }
        public int getRefillMinutes() { return refillMinutes; }
        public void setRefillMinutes(int refillMinutes) { this.refillMinutes = refillMinutes; }
    }
}
