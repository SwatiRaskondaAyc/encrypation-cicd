package com.example.prog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "api_response_logs")
public class ApiResponseLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "ip_address", nullable = false, length = 45)
    private String ipAddress;

    @Column(name = "endpoint", nullable = false, length = 255)
    private String endpoint;

    @Column(name = "response_code", nullable = false)
    private Integer responseCode;

    @Column(name = "response_message", columnDefinition = "TEXT")
    private String responseMessage;

    // Constructors
    public ApiResponseLog() {}

    public ApiResponseLog(LocalDateTime timestamp, String ipAddress, String endpoint,
                          Integer responseCode, String responseMessage) {
        this.timestamp = timestamp;
        this.ipAddress = ipAddress;
        this.endpoint = endpoint;
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public Integer getResponseCode() {
        return responseCode;
    }

    public void setResponseCode(Integer responseCode) {
        this.responseCode = responseCode;
    }

    public String getResponseMessage() {
        return responseMessage;
    }

    public void setResponseMessage(String responseMessage) {
        this.responseMessage = responseMessage;
    }
}