// package com.example.prog.entity.portfolio;

// import jakarta.persistence.*;
// import java.time.LocalDateTime;

// import com.example.prog.entity.UserDtls;

// @Entity
// @Table(name = "user_portfolio_uploads")
// public class UserPortfolioUploads {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Integer portfolioId;

//     @Column(name = "user_id")
//     private int userID;  // This should match your user entity class

//     @Column(name = "portfolio_table_name", nullable = false)
//     private String portfolioTableName;

//     @Column(name = "upload_id", nullable = false)
//     private String uploadId;

//     private String platform; 
    
//     @Column(name = "uploaded_at")
//     private LocalDateTime uploadedAt;
    
//     @Column(name = "user_type")
//     private String userType ;
    
//     @Column(name = "portfolio_name")
//     private String portfolioName;
    
//     // Getters and Setters

//     public String getPortfolioName() {
// 		return portfolioName;
// 	}

// 	public void setPortfolioName(String portfolioName) {
// 		this.portfolioName = portfolioName;
// 	}

// 	public Integer getPortfolioId() {
//         return portfolioId;
//     }

//     public void setPortfolioId(Integer portfolioId) {
//         this.portfolioId = portfolioId;
//     }

  

//     public String getPortfolioTableName() {
//         return portfolioTableName;
//     }

//     public void setPortfolioTableName(String portfolioTableName) {
//         this.portfolioTableName = portfolioTableName;
//     }

//     public String getUploadId() {
//         return uploadId;
//     }

//     public void setUploadId(String uploadId) {
//         this.uploadId = uploadId;
//     }

//     public LocalDateTime getUploadedAt() {
//         return uploadedAt;
//     }

//     public void setUploadedAt(LocalDateTime uploadedAt) {
//         this.uploadedAt = uploadedAt;
//     }


// //	@Override
// //	public String toString() {
// //		return "UserPortfolioUploads [portfolioId=" + portfolioId + ", userID=" + userID + ", portfolioTableName="
// //				+ portfolioTableName + ", uploadId=" + uploadId + ", platform=" + platform + ", uploadedAt="
// //				+ uploadedAt + ", userType=" + userType + ", getPortfolioId()=" + getPortfolioId()
// //				+ ", getPortfolioTableName()=" + getPortfolioTableName() + ", getUploadId()=" + getUploadId()
// //				+ ", getUploadedAt()=" + getUploadedAt() + ", getUserType()=" + getUserType() + ", getUserID()="
// //				+ getUserID() + ", getPlatform()=" + getPlatform() + ", getClass()=" + getClass() + ", hashCode()="
// //				+ hashCode() + ", toString()=" + super.toString() + "]";
// //	}

// 	public String getUserType() {
// 		return userType;
// 	}

// 	@Override
// 	public String toString() {
// 		return "UserPortfolioUploads [portfolioId=" + portfolioId + ", userID=" + userID + ", portfolioTableName="
// 				+ portfolioTableName + ", uploadId=" + uploadId + ", platform=" + platform + ", uploadedAt="
// 				+ uploadedAt + ", userType=" + userType + ", portfolioName=" + portfolioName + ", getPortfolioName()="
// 				+ getPortfolioName() + ", getPortfolioId()=" + getPortfolioId() + ", getPortfolioTableName()="
// 				+ getPortfolioTableName() + ", getUploadId()=" + getUploadId() + ", getUploadedAt()=" + getUploadedAt()
// 				+ ", getUserType()=" + getUserType() + ", getUserID()=" + getUserID() + ", getPlatform()="
// 				+ getPlatform() + ", getClass()=" + getClass() + ", hashCode()=" + hashCode() + ", toString()="
// 				+ super.toString() + "]";
// 	}

// 	public void setUserType(String userType) {
// 		this.userType = userType;
// 	}

// 	public int getUserID() {
// 		return userID;
// 	}

// 	public void setUserID(int userID) {
// 		this.userID = userID;
// 	}

// 	public String getPlatform() {
// 		return platform;
// 	}

// 	public void setPlatform(String platform) {
// 		this.platform = platform;
// 	}
// }

package com.example.prog.entity.portfolio;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.prog.entity.UserDtls;

@Entity
@Table(name = "user_portfolio_uploads")
public class UserPortfolioUploads {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer portfolioId;

    @Column(name = "user_id")
    private int userID;  // This should match your user entity class

    @Column(name = "portfolio_table_name", nullable = false)
    private String portfolioTableName;

    @Column(name = "upload_id", nullable = false)
    private String uploadId;

    private String platform; 
    
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;
    
    @Column(name = "user_type")
    private String userType ;

     @Column(name = "resultId")
    private Integer resultId;

    
    @Column(name = "portfolio_name")
    private String portfolioName;
    
    // Getters and Setters

    public String getPortfolioName() {
		return portfolioName;
	}

	public void setPortfolioName(String portfolioName) {
		this.portfolioName = portfolioName;
	}

	public Integer getPortfolioId() {
        return portfolioId;
    }

    public void setPortfolioId(Integer portfolioId) {
        this.portfolioId = portfolioId;
    }

   public Integer getResultId() {
        return resultId;
    }

    public void setResultId(Integer resultId) {
        this.resultId = resultId;
    }

    public String getPortfolioTableName() {
        return portfolioTableName;
    }

    public void setPortfolioTableName(String portfolioTableName) {
        this.portfolioTableName = portfolioTableName;
    }

    public String getUploadId() {
        return uploadId;
    }

    public void setUploadId(String uploadId) {
        this.uploadId = uploadId;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }


//	@Override
//	public String toString() {
//		return "UserPortfolioUploads [portfolioId=" + portfolioId + ", userID=" + userID + ", portfolioTableName="
//				+ portfolioTableName + ", uploadId=" + uploadId + ", platform=" + platform + ", uploadedAt="
//				+ uploadedAt + ", userType=" + userType + ", getPortfolioId()=" + getPortfolioId()
//				+ ", getPortfolioTableName()=" + getPortfolioTableName() + ", getUploadId()=" + getUploadId()
//				+ ", getUploadedAt()=" + getUploadedAt() + ", getUserType()=" + getUserType() + ", getUserID()="
//				+ getUserID() + ", getPlatform()=" + getPlatform() + ", getClass()=" + getClass() + ", hashCode()="
//				+ hashCode() + ", toString()=" + super.toString() + "]";
//	}

	public String getUserType() {
		return userType;
	}

	@Override
	public String toString() {
		return "UserPortfolioUploads [portfolioId=" + portfolioId + ", userID=" + userID + ", portfolioTableName="
				+ portfolioTableName + ", uploadId=" + uploadId + ", platform=" + platform + ", uploadedAt="
				+ uploadedAt + ", userType=" + userType + ", portfolioName=" + portfolioName + ", getPortfolioName()="
				+ getPortfolioName() + ", getPortfolioId()=" + getPortfolioId() + ", getPortfolioTableName()="
				+ getPortfolioTableName() + ", getUploadId()=" + getUploadId() + ", getUploadedAt()=" + getUploadedAt()
				+ ", getUserType()=" + getUserType() + ", getUserID()=" + getUserID() + ", getPlatform()="
				+ getPlatform() + ", getClass()=" + getClass() + ", hashCode()=" + hashCode() + ", toString()="
				+ super.toString() + "]";
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public int getUserID() {
		return userID;
	}

	public void setUserID(int userID) {
		this.userID = userID;
	}

	public String getPlatform() {
		return platform;
	}

	public void setPlatform(String platform) {
		this.platform = platform;
	}
}

