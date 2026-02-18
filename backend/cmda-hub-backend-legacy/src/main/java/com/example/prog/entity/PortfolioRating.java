// package com.example.prog.entity;

// import jakarta.persistence.*;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "portfolio_ratings")
// public class PortfolioRating {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "rating_id")
//     private Long ratingId;

//     @Column(name = "plot_type")
//     private String plotType;

//     @Column(name = "user_id")
//     private Integer userId;

//     @Column(name = "user_type")
//     private String userType; // "corporate" or "individual"

//     @Column(name = "timestamp")
//     private LocalDateTime timestamp;

//     @Column(name = "rating")
//     private Integer rating; // 1-5

//     @Column(name = "earned_point")
//     private Integer earnedPoint; // points awarded if first time, else 0

//     // Getters and Setters
//     public Long getRatingId() {
//         return ratingId;
//     }

//     public void setRatingId(Long ratingId) {
//         this.ratingId = ratingId;
//     }

//     public String getPlotType() {
//         return plotType;
//     }

//     public void setPlotType(String plotType) {
//         this.plotType = plotType;
//     }

//     public Integer getUserId() {
//         return userId;
//     }

//     public void setUserId(Integer userId) {
//         this.userId = userId;
//     }

//     public String getUserType() {
//         return userType;
//     }

//     public void setUserType(String userType) {
//         this.userType = userType;
//     }

//     public LocalDateTime getTimestamp() {
//         return timestamp;
//     }

//     public void setTimestamp(LocalDateTime timestamp) {
//         this.timestamp = timestamp;
//     }

//     public Integer getRating() {
//         return rating;
//     }

//     public void setRating(Integer rating) {
//         this.rating = rating;
//     }

//     public Integer getEarnedPoint() {
//         return earnedPoint;
//     }

//     public void setEarnedPoint(Integer earnedPoint) {
//         this.earnedPoint = earnedPoint;
//     }
// }

// --------------------user points repo --------------------


package com.example.prog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio_ratings")
public class PortfolioRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Long ratingId;

    @Column(name = "plot_type")
    private String plotType;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "user_type")
    private String userType; // "corporate" or "individual"

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @Column(name = "rating")
    private Integer rating; // 1-5

    @Column(name = "earned_point")
    private Integer earnedPoint; // points awarded if first time, else 0

    // Getters and Setters
    public Long getRatingId() {
        return ratingId;
    }

    public void setRatingId(Long ratingId) {
        this.ratingId = ratingId;
    }

    public String getPlotType() {
        return plotType;
    }

    public void setPlotType(String plotType) {
        this.plotType = plotType;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Integer getEarnedPoint() {
        return earnedPoint;
    }

    public void setEarnedPoint(Integer earnedPoint) {
        this.earnedPoint = earnedPoint;
    }
}