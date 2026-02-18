// package com.example.prog.entity.userpoints;

// import org.hibernate.annotations.CreationTimestamp;
// import org.hibernate.annotations.UpdateTimestamp;

// import jakarta.persistence.*;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "user_points_summary") // Make sure this matches your table name
// public class UserPointsSummary {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(name = "user_id", nullable = false, unique = true) // Match your column name
//     private Integer userId;

//     @Column(name = "equity_points", nullable = false) // Match your column name
//     private Integer equityPoints = 0;

//     @Column(name = "portfolio_points", nullable = false) // Match your column name
//     private Integer portfolioPoints = 0;

//     @Column(name = "tutorial_points", nullable = false) // Match your column name
//     private Integer tutorialPoints = 0;

//     @Column(name = "total_points", nullable = false) // Match your column name
//     private Integer totalPoints = 0;

//     @CreationTimestamp
//     @Column(name = "created_at", updatable = false) // Match your column name
//     private LocalDateTime createdAt;

//     @UpdateTimestamp
//     @Column(name = "updated_at") // Match your column name
//     private LocalDateTime updatedAt;

//     // Constructors
//     public UserPointsSummary() {}

//     public UserPointsSummary(Integer userId) {
//         this.userId = userId;
//     }

//     public UserPointsSummary(Integer userId, Integer equityPoints, Integer portfolioPoints, Integer tutorialPoints) {
//         this.userId = userId;
//         this.equityPoints = equityPoints;
//         this.portfolioPoints = portfolioPoints;
//         this.tutorialPoints = tutorialPoints;
//         this.totalPoints = equityPoints + portfolioPoints + tutorialPoints;
//     }

//     // Getters and Setters
//     public Long getId() { return id; }
//     public void setId(Long id) { this.id = id; }

//     public Integer getUserId() { return userId; }
//     public void setUserId(Integer userId) { this.userId = userId; }

//     public Integer getEquityPoints() { return equityPoints; }
//     public void setEquityPoints(Integer equityPoints) { 
//         this.equityPoints = equityPoints; 
//         calculateTotalPoints();
//     }

//     public Integer getPortfolioPoints() { return portfolioPoints; }
//     public void setPortfolioPoints(Integer portfolioPoints) { 
//         this.portfolioPoints = portfolioPoints; 
//         calculateTotalPoints();
//     }

//     public Integer getTutorialPoints() { return tutorialPoints; }
//     public void setTutorialPoints(Integer tutorialPoints) { 
//         this.tutorialPoints = tutorialPoints; 
//         calculateTotalPoints();
//     }

//     public Integer getTotalPoints() { return totalPoints; }
//     public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }

//     public LocalDateTime getCreatedAt() { return createdAt; }
//     public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

//     public LocalDateTime getUpdatedAt() { return updatedAt; }
//     public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

//     // Helper method to calculate total points
//     private void calculateTotalPoints() {
//         this.totalPoints = this.equityPoints + this.portfolioPoints + this.tutorialPoints;
//     }

//     // Method to update points
//     public void updatePoints(Integer equityPoints, Integer portfolioPoints, Integer tutorialPoints) {
//         this.equityPoints = equityPoints;
//         this.portfolioPoints = portfolioPoints;
//         this.tutorialPoints = tutorialPoints;
//         calculateTotalPoints();
//     }

//     @Override
//     public String toString() {
//         return "UserPointsSummary{" +
//                 "id=" + id +
//                 ", userId=" + userId +
//                 ", equityPoints=" + equityPoints +
//                 ", portfolioPoints=" + portfolioPoints +
//                 ", tutorialPoints=" + tutorialPoints +
//                 ", totalPoints=" + totalPoints +
//                 ", createdAt=" + createdAt +
//                 ", updatedAt=" + updatedAt +
//                 '}';
//     }
// }



package com.example.prog.entity.userpoints;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_points_summary")
public class UserPointsSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Integer userId;

    @Column(name = "user_type", nullable = false) // NEW COLUMN
    private String userType = "individual";

    @Column(name = "equity_points", nullable = false)
    private Integer equityPoints = 0;

    @Column(name = "portfolio_points", nullable = false)
    private Integer portfolioPoints = 0;

    @Column(name = "tutorial_points", nullable = false)
    private Integer tutorialPoints = 0;

    @Column(name = "total_points", nullable = false)
    private Integer totalPoints = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public UserPointsSummary() {}

    public UserPointsSummary(Integer userId, String userType) {
        this.userId = userId;
        this.userType = userType;
    }

    public UserPointsSummary(Integer userId, String userType, Integer equityPoints, Integer portfolioPoints, Integer tutorialPoints) {
        this.userId = userId;
        this.userType = userType;
        this.equityPoints = equityPoints;
        this.portfolioPoints = portfolioPoints;
        this.tutorialPoints = tutorialPoints;
        this.totalPoints = equityPoints + portfolioPoints + tutorialPoints;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }

    public Integer getEquityPoints() { return equityPoints; }
    public void setEquityPoints(Integer equityPoints) { 
        this.equityPoints = equityPoints; 
        calculateTotalPoints();
    }

    public Integer getPortfolioPoints() { return portfolioPoints; }
    public void setPortfolioPoints(Integer portfolioPoints) { 
        this.portfolioPoints = portfolioPoints; 
        calculateTotalPoints();
    }

    public Integer getTutorialPoints() { return tutorialPoints; }
    public void setTutorialPoints(Integer tutorialPoints) { 
        this.tutorialPoints = tutorialPoints; 
        calculateTotalPoints();
    }

    public Integer getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Helper method to calculate total points
    private void calculateTotalPoints() {
        this.totalPoints = this.equityPoints + this.portfolioPoints + this.tutorialPoints;
    }

    // Method to update points
    public void updatePoints(Integer equityPoints, Integer portfolioPoints, Integer tutorialPoints) {
        this.equityPoints = equityPoints;
        this.portfolioPoints = portfolioPoints;
        this.tutorialPoints = tutorialPoints;
        calculateTotalPoints();
    }

    @Override
    public String toString() {
        return "UserPointsSummary{" +
                "id=" + id +
                ", userId=" + userId +
                ", userType='" + userType + '\'' +
                ", equityPoints=" + equityPoints +
                ", portfolioPoints=" + portfolioPoints +
                ", tutorialPoints=" + tutorialPoints +
                ", totalPoints=" + totalPoints +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}