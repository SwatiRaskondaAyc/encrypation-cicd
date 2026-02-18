
package com.example.prog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_login_activity")
public class UserLoginActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "user_id", nullable = false)
    private int userId;

    @Column(name = "user_type", nullable = false, length = 20)
    private String userType; // "INDIVIDUAL" or "CORPORATE"

    @Column(name = "user_email", nullable = false, length = 255)
    private String userEmail;

    @Column(name = "user_name", length = 100)
    private String userName;

    @Column(name = "login_at", nullable = false)
    private LocalDateTime loginAt;

    @Column(name = "logout_at")
    private LocalDateTime logoutAt;

    @Column(name = "session_duration_seconds")
    private Long sessionDurationSeconds;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "device_info", length = 200)
    private String deviceInfo;

    @Column(name = "login_status", length = 20)
    private String loginStatus; // SUCCESS, FAILED

    @Column(name = "failure_reason", length = 200)
    private String failureReason;

    // Constructors
    public UserLoginActivity() {}

    public UserLoginActivity(int userId, String userType, String userEmail, String userName, 
                           LocalDateTime loginAt, String ipAddress, String userAgent) {
        this.userId = userId;
        this.userType = userType;
        this.userEmail = userEmail;
        this.userName = userName;
        this.loginAt = loginAt;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.loginStatus = "SUCCESS";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public LocalDateTime getLoginAt() {
        return loginAt;
    }

    public void setLoginAt(LocalDateTime loginAt) {
        this.loginAt = loginAt;
    }

    public LocalDateTime getLogoutAt() {
        return logoutAt;
    }

    public void setLogoutAt(LocalDateTime logoutAt) {
        this.logoutAt = logoutAt;
        if (this.loginAt != null && logoutAt != null) {
            this.sessionDurationSeconds = java.time.Duration.between(this.loginAt, logoutAt).getSeconds();
        }
    }

    public Long getSessionDurationSeconds() {
        return sessionDurationSeconds;
    }

    public void setSessionDurationSeconds(Long sessionDurationSeconds) {
        this.sessionDurationSeconds = sessionDurationSeconds;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public String getLoginStatus() {
        return loginStatus;
    }

    public void setLoginStatus(String loginStatus) {
        this.loginStatus = loginStatus;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    @Override
    public String toString() {
        return "UserLoginActivity{" +
                "id=" + id +
                ", userId=" + userId +
                ", userType='" + userType + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", userName='" + userName + '\'' +
                ", loginAt=" + loginAt +
                ", logoutAt=" + logoutAt +
                ", sessionDurationSeconds=" + sessionDurationSeconds +
                ", ipAddress='" + ipAddress + '\'' +
                ", loginStatus='" + loginStatus + '\'' +
                '}';
    }
}