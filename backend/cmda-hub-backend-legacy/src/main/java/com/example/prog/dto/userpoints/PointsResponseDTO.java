package com.example.prog.dto.userpoints;

import java.util.Map;

public class PointsResponseDTO {
    private String category;
    private Map<Integer, Integer> userPoints;
    private Integer totalUsers;
    private Integer totalPoints;
    
    // Constructors
    public PointsResponseDTO() {}
    
    public PointsResponseDTO(String category, Map<Integer, Integer> userPoints, 
                           Integer totalUsers, Integer totalPoints) {
        this.category = category;
        this.userPoints = userPoints;
        this.totalUsers = totalUsers;
        this.totalPoints = totalPoints;
    }
    
    // Getters and Setters
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Map<Integer, Integer> getUserPoints() { return userPoints; }
    public void setUserPoints(Map<Integer, Integer> userPoints) { this.userPoints = userPoints; }
    
    public Integer getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Integer totalUsers) { this.totalUsers = totalUsers; }
    
    public Integer getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }
}