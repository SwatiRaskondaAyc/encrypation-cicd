package com.example.prog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import org.springframework.context.annotation.Primary;

@Primary
@Entity
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String activity;
    private String userIp;
    private LocalDateTime timestamp;

    public ActivityLog() {}

    public ActivityLog(String activity, String userIp, LocalDateTime timestamp) {
        this.activity = activity;
        this.userIp = userIp;
        this.timestamp = timestamp;
    }

    // Getters and Setters
}
