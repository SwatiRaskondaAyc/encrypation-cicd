package com.example.prog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "user_activity_log")
public class UserActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "user_type")
    private String userType; // INDIVIDUAL or CORPORATE

    @Column(name = "activity_type")
    private String activityType; // e.g., LOGIN, LOGOUT, PAGE_VISIT

    @Column(name = "activity_timestamp")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSSSS")
    private LocalDateTime activityTimestamp;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public LocalDateTime getActivityTimestamp() {
        return activityTimestamp;
    }

    public void setActivityTimestamp(LocalDateTime activityTimestamp) {
        this.activityTimestamp = activityTimestamp;
    }
}