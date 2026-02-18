package com.example.prog.controller;

import org.springframework.web.bind.annotation.*;

import com.example.prog.serviceimpl.ActivityLogService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/activity")
public class ActivityLogController {

    private final ActivityLogService service;

    public ActivityLogController(ActivityLogService service) {
        this.service = service;
    }

    @PostMapping
    public void logActivity(@RequestBody String activity, HttpServletRequest request) {
        String userIp = request.getRemoteAddr();
        service.saveActivity(activity, userIp);
    }
}

