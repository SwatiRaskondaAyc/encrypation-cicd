package com.example.prog.serviceimpl;


import org.springframework.stereotype.Service;

import com.example.prog.entity.ActivityLog;
import com.example.prog.repository.ActivityLogRepository;

import java.time.LocalDateTime;

@Service
public class ActivityLogService {

    private final ActivityLogRepository repository;

    public ActivityLogService(ActivityLogRepository repository) {
        this.repository = repository;
    }

    public void saveActivity(String activity, String userIp) {
        ActivityLog log = new ActivityLog(activity, userIp, LocalDateTime.now());
        repository.save(log);
    }
}
