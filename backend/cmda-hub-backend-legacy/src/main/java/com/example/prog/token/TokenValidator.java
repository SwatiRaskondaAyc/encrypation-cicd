// package com.example.prog.token;

// public class TokenValidator {
    
//     public static String validateAndExtractEmail(String authorizationHeader) {
//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             throw new UnauthorizedException("Invalid or missing Authorization header");
//         }

//         String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
//         try {
//             return JwtUtil.extractEmail(token);
//         } catch (Exception e) {
//             throw new UnauthorizedException("Invalid token");
//         }
//     }

// }


package com.example.prog.token;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;

@Component
public class TokenValidator {

    private static final Logger logger = LoggerFactory.getLogger(TokenValidator.class);

    @Value("${jwt.secret}")
    private String secret;

    private static SecretKey SECRET_KEY;

    @PostConstruct
    public void init() {
        SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String validateAndExtractEmail(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Invalid Authorization header: {}", authHeader);
            throw new IllegalArgumentException("Invalid or missing Bearer token");
        }

        String token = authHeader.substring(7);
        try {
            String email = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            logger.debug("Extracted email from token: {}", email);
            return email;
        } catch (ExpiredJwtException e) {
            logger.error("Token expired: {}", e.getMessage());
            throw new IllegalArgumentException("Token expired");
        } catch (SignatureException | MalformedJwtException e) {
            logger.error("Invalid token: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid token");
        } catch (Exception e) {
            logger.error("Token validation failed: {}", e.getMessage());
            throw new IllegalArgumentException("Token validation failed");
        }
    }
}

