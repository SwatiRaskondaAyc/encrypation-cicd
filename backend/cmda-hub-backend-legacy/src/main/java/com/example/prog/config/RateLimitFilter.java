package com.example.prog.config;

import com.example.prog.service.RateLimitService;
import com.example.prog.token.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@ConditionalOnProperty(name = "app.rate-limit.enabled", havingValue = "true", matchIfMissing = false)
@Order(Ordered.HIGHEST_PRECEDENCE + 1) // Run right after security/CORS but early
public class RateLimitFilter extends OncePerRequestFilter {

    @Autowired
    private RateLimitService rateLimitService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String path = request.getRequestURI();
        if (!path.startsWith("/api/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String category = resolveCategory(path);
        String key = resolveKey(request);

        if (!rateLimitService.tryConsume(category, key)) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too many requests. Please try again later.\", \"category\": \"" + category + "\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String resolveCategory(String path) {
        if (path.contains("/auth/login") || path.contains("/auth/send-otp") || path.contains("/users/forgetpass")) {
            return "high";
        }
        if (path.contains("/stocks/") || path.contains("/indices/") || path.contains("/portfolio/")) {
            return "data";
        }
        return "standard";
    }

    private String resolveKey(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String email = jwtUtil.extractEmail(token);
                if (email != null) return email;
            } catch (Exception e) {
                // Fallback to IP if token is invalid
            }
        }
        return request.getRemoteAddr();
    }
}
