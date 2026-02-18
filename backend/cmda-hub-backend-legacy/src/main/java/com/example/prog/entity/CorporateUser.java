package com.example.prog.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.context.annotation.Primary;

@Primary
@Entity
@Table(name = "corporate_user")
public class CorporateUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;
    
    @Column(name = "employee_name", nullable = false, length = 100)
    private String employeeName;

    @Column(name = "job_title",nullable = false, length = 250)
    private String jobTitle;

    @Column(name = "email", unique = true, nullable = false, length = 255)
    private String email;

	@Column(name = "admin_id", nullable = false, length = 255)
    private String adminId;

	 @Column(name = "subscription")
    private Integer subscription;
    
   @Column(name = "user_type", length = 50)
    private String userType; // New field for userType (Salaried or Housewife)


    @Column(name = "password_hash", nullable = false, length = 250)
    private String password;
    
    @Transient 
    private String confirmpassword;
    
    @Column(name = "mobile_num", length = 15)
    private String mobileNum;

	   @Column(name = "promocode")
    private String promoCode;
    
   

    @Column(name = "role")
    private String role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "reset_token")
    private String resetToken;
    
    @Column(name = "status")
   private int status;
    
     @Column(name = "profile_picture")
    private String profilePicture;
    
    private LocalDateTime tokenExpiry;
    
  
    
    private String gender;
    
    private String adharcard;
    
    private String pancard;
    
    private String address;
    
    private LocalDate dateofbirth;

	@Column(name = "User_Level", length = 20)
    private String userLevel;  // "Nowy" or "Professional"

    @Column(name = "Ai_Enable")
    private Boolean aiEnable;


	public String getUserLevel() {
		return userLevel;
	}

	public void setUserLevel(String userLevel) {
		this.userLevel = userLevel;
	}

	public Boolean getAiEnable() {
		return aiEnable;
	}

	public void setAiEnable(Boolean aiEnable) {
		this.aiEnable = aiEnable;
	}

	
    
    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

	   public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

//	public String getEmployeeEmail() {
//		return employeeEmail;
//	}
//
//	public void setEmployeeEmail(String employeeEmail) {
//		this.employeeEmail = employeeEmail;
//	}

	public String getConfirmpassword() {
		return confirmpassword;
	}

	public void setConfirmpassword(String confirmpassword) {
		this.confirmpassword = confirmpassword;
	}

	public String getResetToken() {
		return resetToken;
	}

	public void setResetToken(String resetToken) {
		this.resetToken = resetToken;
	}

	public LocalDateTime getTokenExpiry() {
		return tokenExpiry;
	}

	public void setTokenExpiry(LocalDateTime tokenExpiry) {
		this.tokenExpiry = tokenExpiry;
	}

	// public String getProfilePictureUrl() {
	//     return profilePictureUrl;
	// }

	// public void setProfilePictureUrl(String profilePictureUrl) {
	//     this.profilePictureUrl = profilePictureUrl;
	// }
	@Override
	public String toString() {
		return "CorporateUser [id=" + id + ", companyName=" + companyName + ", employeeName=" + employeeName
				+ ", jobTitle=" + jobTitle + ", email=" + email + ", password=" + password + ", confirmpassword="
				+ confirmpassword + ", mobileNum=" + mobileNum + ", role=" + role + ", createdAt=" + createdAt
				+ ", updatedAt=" + updatedAt + ", resetToken=" + resetToken + ", status=" + status + ", tokenExpiry="
				+ tokenExpiry + ", ProfilePicture=" + profilePicture + ", gender=" + gender + ", adharcard=" + adharcard
				+ ", pancard=" + pancard + ", address=" + address + ", dateofbirth=" + dateofbirth + ", getId()="
				+ getId() + ", getCompanyName()=" + getCompanyName() + ", getEmail()=" + getEmail() + ", getPassword()="
				+ getPassword() + ", getJobTitle()=" + getJobTitle() + ", getRole()=" + getRole() + ", getCreatedAt()="
				+ getCreatedAt() + ", getUpdatedAt()=" + getUpdatedAt() + ", getEmployeeName()=" + getEmployeeName()
				+ ", getConfirmpassword()=" + getConfirmpassword() + ", getResetToken()=" + getResetToken()
				+ ", getTokenExpiry()=" + getTokenExpiry() + ", getMobileNum()=" + getMobileNum()
				+ ", getProfilePicture()=" + getProfilePicture() + ", getGender()=" + getGender() + ", getAdharcard()="
				+ getAdharcard() + ", getPancard()=" + getPancard() + ", getAddress()=" + getAddress()
				+ ", getDateofbirth()=" + getDateofbirth() + ", getStatus()=" + getStatus() + ", getClass()="
				+ getClass() + ", hashCode()=" + hashCode() + ", toString()=" + super.toString() + ",userType=" + userType +"]";
	}

	public String getMobileNum() {
		return mobileNum;
	}

	public void setMobileNum(String mobileNum) {
		this.mobileNum = mobileNum;
	}

	public String getProfilePicture() {
        return profilePicture;
    }


	 public void setProfilePicture(String profilePicture) {
	        this.profilePicture = profilePicture;
	    }

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getAdharcard() {
		return adharcard;
	}

	public void setAdharcard(String adharcard) {
		this.adharcard = adharcard;
	}

	public String getPancard() {
		return pancard;
	}

	public void setPancard(String pancard) {
		this.pancard = pancard;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public LocalDate getDateofbirth() {
		return dateofbirth;
	}

	public void setDateofbirth(LocalDate dateofbirth) {
		this.dateofbirth = dateofbirth;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

		public String getAdminId() {
		return adminId;
	}

	public void setAdminId(String adminId) {
		this.adminId = adminId;
	}

			public String getPromoCode() {
		return promoCode;
	}

	public void setPromoCode(String promoCode) {
		this.promoCode = promoCode;
	}

	public Integer getSubscription() {
		return subscription;
	}


	public void setSubscription(Integer subscription) {
		this.subscription = subscription;
	}
	
}

