package com.example.prog.service;

import com.example.prog.repository.ApiRequestLogRepository;
import com.example.prog.entity.ApiRequestLog;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApiRequestLogCleanupService {

    private final ApiRequestLogRepository apiRequestLogRepository;

    public ApiRequestLogCleanupService(ApiRequestLogRepository apiRequestLogRepository) {
        this.apiRequestLogRepository = apiRequestLogRepository;
    }

    // Run every 2 minutes for testing
    @Scheduled(fixedRate = 900000) // every 2 minutes
    public void cleanOldLogs() {
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        List<ApiRequestLog> oldLogs = apiRequestLogRepository.findByTimestampBefore(fiveMinutesAgo);
        if (!oldLogs.isEmpty()) {
            apiRequestLogRepository.deleteAll(oldLogs);
            System.out.println("Deleted old ApiRequestLog entries: " + oldLogs.size());
        }
    }
}