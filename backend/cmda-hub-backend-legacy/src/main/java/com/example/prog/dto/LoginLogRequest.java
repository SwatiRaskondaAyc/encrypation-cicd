package com.example.prog.dto;

public class LoginLogRequest {
    private int userId;
    private String userType;
    private String userEmail;
    private String userName;
    private String ipAddress;
    private String userAgent;
    private String activityType; // "LOGIN" or "LOGOUT"

    public LoginLogRequest() {}

    public LoginLogRequest(int userId, String userType, String userEmail, String userName, String ipAddress, String userAgent, String activityType) {
        this.userId = userId;
        this.userType = userType;
        this.userEmail = userEmail;
        this.userName = userName;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.activityType = activityType;
    }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }
}
