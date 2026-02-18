// package com.example.prog.entity.userpoints;

// import com.example.prog.Enum.PointsCategory;
// import org.hibernate.annotations.CreationTimestamp;

// import jakarta.persistence.*;  // Changed from javax.persistence to jakarta.persistence
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "user_points")
// public class UserPoints {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
    
//     private Long userId;
    
//     @Enumerated(EnumType.STRING)
//     private PointsCategory category;
    
//     private Integer pointsEarned;
//     private String activityDescription;
//     private String referenceId;
    
//     @CreationTimestamp
//     private LocalDateTime earnedAt;
    
//     // Default constructor
//     public UserPoints() {}
    
//     // Parameterized constructor
//     public UserPoints(Long userId, PointsCategory category, Integer pointsEarned, 
//                      String activityDescription, String referenceId) {
//         this.userId = userId;
//         this.category = category;
//         this.pointsEarned = pointsEarned;
//         this.activityDescription = activityDescription;
//         this.referenceId = referenceId;
//     }
    
//     // Getters and Setters
//     public Long getId() { return id; }
//     public void setId(Long id) { this.id = id; }
    
//     public Long getUserId() { return userId; }
//     public void setUserId(Long userId) { this.userId = userId; }
    
//     public PointsCategory getCategory() { return category; }
//     public void setCategory(PointsCategory category) { this.category = category; }
    
//     public Integer getPointsEarned() { return pointsEarned; }
//     public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }
    
//     public String getActivityDescription() { return activityDescription; }
//     public void setActivityDescription(String activityDescription) { this.activityDescription = activityDescription; }
    
//     public String getReferenceId() { return referenceId; }
//     public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
    
//     public LocalDateTime getEarnedAt() { return earnedAt; }
//     public void setEarnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; }
// }


package com.example.prog.entity.userpoints;

import com.example.prog.Enum.PointsCategory;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_points")
public class UserPoints {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "userId")
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private PointsCategory category;

    @Column(name = "pointsEarned")
    private Integer pointsEarned;

    @Column(name = "activityDescription")
    private String activityDescription;

    @Column(name = "referenceId")
    private String referenceId;

    @CreationTimestamp
    @Column(name = "earnedAt")
    private LocalDateTime earnedAt;

    // Constructors
    public UserPoints() {}

    public UserPoints(Long userId, PointsCategory category, Integer pointsEarned, 
                     String activityDescription, String referenceId) {
        this.userId = userId;
        this.category = category;
        this.pointsEarned = pointsEarned;
        this.activityDescription = activityDescription;
        this.referenceId = referenceId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public PointsCategory getCategory() { return category; }
    public void setCategory(PointsCategory category) { this.category = category; }

    public Integer getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }

    public String getActivityDescription() { return activityDescription; }
    public void setActivityDescription(String activityDescription) { this.activityDescription = activityDescription; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public LocalDateTime getEarnedAt() { return earnedAt; }
    public void setEarnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; }
}