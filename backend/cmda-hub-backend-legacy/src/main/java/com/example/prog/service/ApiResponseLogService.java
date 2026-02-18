package com.example.prog.service;

import com.example.prog.entity.ApiResponseLog;
import com.example.prog.repository.ApiResponseLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApiResponseLogService {

    private final ApiResponseLogRepository responseLogRepository;

    public ApiResponseLogService(ApiResponseLogRepository responseLogRepository) {
        this.responseLogRepository = responseLogRepository;
    }

    public List<ApiResponseLog> getAllLogs() {
        return responseLogRepository.findAll();
    }
    
    public void log(String ip, String endpoint, int responseCode, String message) {
        ApiResponseLog log = new ApiResponseLog(
                LocalDateTime.now(),
                ip,
                endpoint,
                responseCode,
                message
        );
        responseLogRepository.save(log);
    }
}
