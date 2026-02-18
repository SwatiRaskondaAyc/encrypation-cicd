package com.example.prog.service;

import java.time.LocalDateTime;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.prog.entity.ApiRequestLog;
import com.example.prog.repository.ApiRequestLogRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class ApiRequestLogService {

    @Autowired 
    private ApiRequestLogRepository logRepo;
    

    private static final int THRESHOLD = 10;

    public boolean isSuspicious(HttpServletRequest req) {
        String ip = req.getRemoteAddr();
        String path = req.getRequestURI();
        String method = req.getMethod();
        String userAgent = req.getHeader("User-Agent");
        String email = getEmailFromContext();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime cutoff = now.minusMinutes(5);

        var existing = logRepo.findTopByEmailAndIpAddressAndEndpointAndHttpMethodAndTimestampAfter(
                email, ip, path, method, cutoff
        );

        if (existing.isPresent()) {
            ApiRequestLog log = existing.get();
            log.incrementRequestCount();
            log.setTimestamp(now);
            if (log.getRequestCount() >= THRESHOLD) {
                log.setIsSuspicious(true);
            }
            logRepo.save(log);
            return Boolean.TRUE.equals(log.getIsSuspicious());
        } else {
            ApiRequestLog log = new ApiRequestLog();
            log.setEmail(email);
            log.setIpAddress(ip);
            log.setEndpoint(path);
            log.setHttpMethod(method);
            log.setTimestamp(now);
            log.setUserAgent(userAgent);
            log.setRequestCount(1);
            log.setIsSuspicious(userAgent != null && userAgent.toLowerCase().contains("curl"));
            logRepo.save(log);
            return log.getIsSuspicious();
        }
    }

    private String getEmailFromContext() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof String s) return s;
        return null;
    }
    
    @Transactional
    public void resetCountForIpAndEndpoint(String ip, String endpoint) {
    	logRepo.resetRequestCountByIpAndEndpoint(ip, endpoint);
    }
}
