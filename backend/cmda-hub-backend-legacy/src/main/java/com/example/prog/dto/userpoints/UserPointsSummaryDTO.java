// // package com.example.prog.dto.userpoints;

// // import com.example.prog.entity.userpoints.UserPoints;

// // import java.util.List;
// // import java.util.Map;

// // public class UserPointsProfileDTO {
// //     private Long userId;
// //     private Map<String, Object> summary;
// //     private Map<String, Object> categoryDetails;
// //     private List<UserPoints> recentActivities;
    
// //     // Default constructor
// //     public UserPointsProfileDTO() {}
    
// //     // Getters and Setters
// //     public Long getUserId() { return userId; }
// //     public void setUserId(Long userId) { this.userId = userId; }
    
// //     public Map<String, Object> getSummary() { return summary; }
// //     public void setSummary(Map<String, Object> summary) { this.summary = summary; }
    
// //     public Map<String, Object> getCategoryDetails() { return categoryDetails; }
// //     public void setCategoryDetails(Map<String, Object> categoryDetails) { this.categoryDetails = categoryDetails; }
    
// //     public List<UserPoints> getRecentActivities() { return recentActivities; }
// //     public void setRecentActivities(List<UserPoints> recentActivities) { this.recentActivities = recentActivities; }
// // }

// package com.example.prog.dto.userpoints;

// import java.time.LocalDateTime;

// public class UserPointsSummaryDTO {
//     private Long id;
//     private Integer userId;
//     private Integer equityPoints;
//     private Integer portfolioPoints;
//     private Integer tutorialPoints;
//     private Integer totalPoints;
//     private LocalDateTime createdAt;
//     private LocalDateTime updatedAt;
    
//     // Constructors
//     public UserPointsSummaryDTO() {}
    
//     public UserPointsSummaryDTO(Integer userId, Integer equityPoints, Integer portfolioPoints, 
//                                Integer tutorialPoints, Integer totalPoints) {
//         this.userId = userId;
//         this.equityPoints = equityPoints;
//         this.portfolioPoints = portfolioPoints;
//         this.tutorialPoints = tutorialPoints;
//         this.totalPoints = totalPoints;
//     }
    
//     // Getters and Setters
//     public Long getId() { return id; }
//     public void setId(Long id) { this.id = id; }
    
//     public Integer getUserId() { return userId; }
//     public void setUserId(Integer userId) { this.userId = userId; }
    
//     public Integer getEquityPoints() { return equityPoints; }
//     public void setEquityPoints(Integer equityPoints) { this.equityPoints = equityPoints; }
    
//     public Integer getPortfolioPoints() { return portfolioPoints; }
//     public void setPortfolioPoints(Integer portfolioPoints) { this.portfolioPoints = portfolioPoints; }
    
//     public Integer getTutorialPoints() { return tutorialPoints; }
//     public void setTutorialPoints(Integer tutorialPoints) { this.tutorialPoints = tutorialPoints; }
    
//     public Integer getTotalPoints() { return totalPoints; }
//     public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }
    
//     public LocalDateTime getCreatedAt() { return createdAt; }
//     public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
//     public LocalDateTime getUpdatedAt() { return updatedAt; }
//     public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
// }


package com.example.prog.dto.userpoints;

import java.time.LocalDateTime;

public class UserPointsSummaryDTO {
    private Long id;
    private Integer userId;
    private String userType; // NEW FIELD
    private Integer equityPoints;
    private Integer portfolioPoints;
    private Integer tutorialPoints;
    private Integer totalPoints;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public UserPointsSummaryDTO() {}
    
    public UserPointsSummaryDTO(Integer userId, String userType, Integer equityPoints, Integer portfolioPoints, 
                               Integer tutorialPoints, Integer totalPoints) {
        this.userId = userId;
        this.userType = userType;
        this.equityPoints = equityPoints;
        this.portfolioPoints = portfolioPoints;
        this.tutorialPoints = tutorialPoints;
        this.totalPoints = totalPoints;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
    
    public Integer getEquityPoints() { return equityPoints; }
    public void setEquityPoints(Integer equityPoints) { this.equityPoints = equityPoints; }
    
    public Integer getPortfolioPoints() { return portfolioPoints; }
    public void setPortfolioPoints(Integer portfolioPoints) { this.portfolioPoints = portfolioPoints; }
    
    public Integer getTutorialPoints() { return tutorialPoints; }
    public void setTutorialPoints(Integer tutorialPoints) { this.tutorialPoints = tutorialPoints; }
    
    public Integer getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}