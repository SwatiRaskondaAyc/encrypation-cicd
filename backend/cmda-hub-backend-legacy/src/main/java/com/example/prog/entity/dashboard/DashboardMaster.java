// package com.example.prog.entity.dashboard;

// import jakarta.persistence.*;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "dashboard_master")
// public class DashboardMaster {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "dash_id")
//     private int dashId;

//     @Column(name = "dash_name", nullable = false, length = 100) // Changed from "dashboard_name" to "dash_name"
//     private String dashboardName;
 

//     @Column(name = "updated_at", nullable = false)
//     private LocalDateTime updatedAt;

//     @Column(name = "user_id", nullable = false)
//     private int userId;

//     @Column(name = "user_type", nullable = false, length = 20)
//     private String userType;

//     // Default constructor
//     public DashboardMaster() {
//     }

//     // Parameterized constructor
//     public DashboardMaster(String dashboardName, LocalDateTime updatedAt, int userId, String userType) {
//         this.dashboardName = dashboardName;
//         this.updatedAt = updatedAt;
//         this.userId = userId;
//         this.userType = userType;
//     }

//     // Getters
//     public int getDashId() {
//         return dashId;
//     }

//     public String getDashboardName() {
//         return dashboardName;
//     }

//     public LocalDateTime getUpdatedAt() {
//         return updatedAt;
//     }

//     public int getUserId() {
//         return userId;
//     }

//     public String getUserType() {
//         return userType;
//     }

//     // Setters
//     public void setDashId(int dashId) {
//         this.dashId = dashId;
//     }

//     public void setDashboardName(String dashboardName) {
//         this.dashboardName = dashboardName;
//     }

//     public void setUpdatedAt(LocalDateTime updatedAt) {
//         this.updatedAt = updatedAt;
//     }

//     public void setUserId(int userId) {
//         this.userId = userId;
//     }

//     public void setUserType(String userType) {
//         this.userType = userType;
//     }

//     @Override
//     public String toString() {
//         return "DashboardMaster{" +
//                 "dashId=" + dashId +
//                 ", dashboardName='" + dashboardName + '\'' +
//                 ", updatedAt=" + updatedAt +
//                 ", userId=" + userId +
//                 ", userType='" + userType + '\'' +
//                 '}';
//     }
// }

// package com.example.prog.entity.dashboard;

// import jakarta.persistence.*;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "dashboard_master")
// public class DashboardMaster {



// 	@Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "dash_id")
//     private int dashId;

//     @Column(name = "dash_name", nullable = false, length = 100) // Changed from "dashboard_name" to "dash_name"
//     private String dashboardName;
 

//     @Column(name = "updated_at", nullable = false)
//     private LocalDateTime updatedAt;

//     @Column(name = "user_id", nullable = false)
//     private int userId;

//     @Column(name = "user_type", nullable = false, length = 20)
//     private String userType;
    
    
//     @Column(name = "share_token", nullable = false)
//     private String shareToken;

//     // Default constructor
//     public DashboardMaster() {
//     }

//     // Parameterized constructor
//     public DashboardMaster(int dashId, String dashboardName, LocalDateTime updatedAt, int userId, String userType,
// 			String shareToken) {
// 		super();
// 		this.dashId = dashId;
// 		this.dashboardName = dashboardName;
// 		this.updatedAt = updatedAt;
// 		this.userId = userId;
// 		this.userType = userType;
// 		this.shareToken = shareToken;
// 	}

//     // Getters
//     public int getDashId() {
//         return dashId;
//     }

//     public String getDashboardName() {
//         return dashboardName;
//     }

//     public LocalDateTime getUpdatedAt() {
//         return updatedAt;
//     }

//     public int getUserId() {
//         return userId;
//     }

//     public String getUserType() {
//         return userType;
//     }

//     // Setters
//     public void setDashId(int dashId) {
//         this.dashId = dashId;
//     }

//     public void setDashboardName(String dashboardName) {
//         this.dashboardName = dashboardName;
//     }

//     public void setUpdatedAt(LocalDateTime updatedAt) {
//         this.updatedAt = updatedAt;
//     }

//     public void setUserId(int userId) {
//         this.userId = userId;
//     }

//     public void setUserType(String userType) {
//         this.userType = userType;
//     }

//     @Override
// 	public String toString() {
// 		return "DashboardMaster [dashId=" + dashId + ", dashboardName=" + dashboardName + ", updatedAt=" + updatedAt
// 				+ ", userId=" + userId + ", userType=" + userType + ", shareToken=" + shareToken + ", getDashId()="
// 				+ getDashId() + ", getDashboardName()=" + getDashboardName() + ", getUpdatedAt()=" + getUpdatedAt()
// 				+ ", getUserId()=" + getUserId() + ", getUserType()=" + getUserType() + ", getShareToken()="
// 				+ getShareToken() + ", getClass()=" + getClass() + ", hashCode()=" + hashCode() + ", toString()="
// 				+ super.toString() + "]";
// 	}

// 	public String getShareToken() {
// 		return shareToken;
// 	}

// 	public void setShareToken(String shareToken) {
// 		this.shareToken = shareToken;
// 	}
// }




package com.example.prog.entity.dashboard;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dashboard_master")
public class DashboardMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dash_id")
    private int dashId;

    @Column(name = "dash_name", nullable = false, length = 100) // Changed from "dashboard_name" to "dash_name"
    private String dashboardName;
 

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "user_id", nullable = false)
    private int userId;

    @Column(name = "user_type", nullable = false, length = 20)
    private String userType;

    @Column(name = "screenshot_path")  // Make sure this column exists in your table
    private String screenshotPath;

    // Default constructor
    public DashboardMaster() {
    }

    // Parameterized constructor
    public DashboardMaster(String dashboardName, LocalDateTime updatedAt, int userId, String userType) {
        this.dashboardName = dashboardName;
        this.updatedAt = updatedAt;
        this.userId = userId;
        this.userType = userType;
    }

    // Getters
    public int getDashId() {
        return dashId;
    }

    public String getDashboardName() {
        return dashboardName;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public int getUserId() {
        return userId;
    }

    public String getUserType() {
        return userType;
    }

    // Setters
    public void setDashId(int dashId) {
        this.dashId = dashId;
    }

    public void setDashboardName(String dashboardName) {
        this.dashboardName = dashboardName;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getScreenshotPath() {
    return screenshotPath;
}

    public void setScreenshotPath(String screenshotPath) {
        this.screenshotPath = screenshotPath;
    }

    @Override
    public String toString() {
        return "DashboardMaster{" +
                "dashId=" + dashId +
                ", dashboardName='" + dashboardName + '\'' +
                ", updatedAt=" + updatedAt +
                ", userId=" + userId +
                ", userType='" + userType + '\'' +
                '}';
    }
}