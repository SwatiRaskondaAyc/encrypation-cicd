package com.example.prog.config;

import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.codec.ByteArrayCodec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RateLimitConfig {

    @Bean
    @ConditionalOnProperty(name = "app.rate-limit.enabled", havingValue = "true", matchIfMissing = false)
    public ProxyManager<byte[]> proxyManager(
            @Value("${spring.data.redis.host:${spring.redis.host:cmda-redis-core}}") String redisHost,
            @Value("${spring.data.redis.port:${spring.redis.port:6379}}") int redisPort) {
        
        RedisURI redisUri = RedisURI.Builder
                .redis(redisHost, redisPort)
                .build();
        
        RedisClient redisClient = RedisClient.create(redisUri);
        StatefulRedisConnection<byte[], byte[]> connection = redisClient.connect(ByteArrayCodec.INSTANCE);
        
        return LettuceBasedProxyManager.builderFor(connection)
                .withExpirationStrategy(io.github.bucket4j.distributed.ExpirationAfterWriteStrategy.basedOnTimeForRefillingBucketUpToMax(
                    java.time.Duration.ofHours(1)))
                .build();
    }
}

