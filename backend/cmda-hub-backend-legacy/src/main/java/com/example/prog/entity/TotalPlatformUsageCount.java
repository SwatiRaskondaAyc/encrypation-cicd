package com.example.prog.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "total_platform_usage_count")
public class TotalPlatformUsageCount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "platform", nullable = false, unique = true)
    private String platform;

    @Column(name = "total_count", nullable = false)
    private Integer totalCount;

    // Constructors
    public TotalPlatformUsageCount() {
    }

    public TotalPlatformUsageCount(String platform, Integer totalCount) {
        this.platform = platform;
        this.totalCount = totalCount;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public Integer getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Integer totalCount) {
        this.totalCount = totalCount;
    }
}