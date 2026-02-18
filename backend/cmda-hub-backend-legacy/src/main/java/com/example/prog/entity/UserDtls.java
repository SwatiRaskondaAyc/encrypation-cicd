


package com.example.prog.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import java.time.LocalDate;
import java.time.LocalDateTime;


import org.springframework.context.annotation.Primary;

@Primary
@Entity
@Table(name = "user_dtls")
public class UserDtls {


	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userID;

    @Column(name = "user_name", nullable = false, length = 100)
    private String fullname;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password_hash", length = 250)
    private String password;
    
    @Transient
    private String confirmpassword;

    @Column(name = "GoogleUserID", length = 100)
    private String googleUserID;

    @Column(name = "CountryCode", length = 15)
    private String countryCode;

    @Column(name = "mobile_num", length = 15)
    private String mobileNum;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
      @Column(name = "user_type", length = 50)
    private String userType; // New field for userType (Salaried or Housewife)

    @Column(name = "role", nullable = false)
    private String role = "ROLE_USER";  // Default to ROLE_USER
    
    @Column(name = "reset_token")
    private String resetToken;
    
    @Column(name = "status")
   private int status;

         @Column(name = "promocode")
    private String promoCode;
    
    private LocalDateTime tokenExpiry;
    
    @Column(name = "ProfilePicture")
    private String profilePicture;
    
    private String gender;
    
    private String adharcard;
    
    private String pancard;
    
    private String address;
    
    private LocalDate dateofbirth;

@Column(name = "User_Level", length = 20)
private String userLevel; // "__Newbie__" or "Professional"
 
@Column(name = "Ai_Enable")
private Boolean aiEnable;

// @Column(name = "subscription")
// private Integer subscription;

@Column(nullable = false, name = "subscription", columnDefinition = "INT DEFAULT 1")
private Integer subscription = 1;
 
 
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

    public boolean isTokenValid() {
        return tokenExpiry != null && tokenExpiry.isAfter(LocalDateTime.now());
    }

    
    public LocalDateTime getTokenExpiry() {
		return tokenExpiry;
	}



	public void setTokenExpiry(LocalDateTime tokenExpiry) {
		this.tokenExpiry = tokenExpiry;
	}


    public String getRole() {
		return role;
	}

	// Getters and setters
    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getUserType() {
		return userType;
	}


	public void setUserType(String userType) {
		this.userType = userType;
	}

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getGoogleUserID() {
        return googleUserID;
    }

    public void setGoogleUserID(String googleUserID) {
        this.googleUserID = googleUserID;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getMobileNum() {
        return mobileNum;
    }

    public void setMobileNum(String mobileNum) {
        this.mobileNum = mobileNum;
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

    public void setRole(String string) {
		this.role = role;
		
	}
    
    public String getResetToken() {
		return resetToken;
	}

	public void setResetToken(String resetToken) {
		this.resetToken = resetToken;
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
	
	public String getConfirmpassword() {
		return confirmpassword;
	}


	public void setConfirmpassword(String confirmpassword) {
		this.confirmpassword = confirmpassword;
	}
	
    @Override
	public String toString() {
		return "UserDtls [userID=" + userID + ", fullname=" + fullname + ", email=" + email + ", password=" + password
				+ ", confirmpassword=" + confirmpassword + ", googleUserID=" + googleUserID + ", countryCode="
				+ countryCode + ", mobileNum=" + mobileNum + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt
				+ ", role=" + role + ", resetToken=" + resetToken + ", status=" + status + ", tokenExpiry="
				+ tokenExpiry + ", profilePicture=" + profilePicture + ", gender=" + gender + ", adharcard="
				+ adharcard + ", pancard=" + pancard + ", address=" + address + ", dateofbirth=" + dateofbirth
				+ ", isTokenValid()=" + isTokenValid() + ", getTokenExpiry()=" + getTokenExpiry() + ", getRole()="
				+ getRole() + ", getUserID()=" + getUserID() + ", getFullname()=" + getFullname() + ", getEmail()="
				+ getEmail() + ", getPassword()=" + getPassword() + ", getGoogleUserID()=" + getGoogleUserID()
				+ ", getCountryCode()=" + getCountryCode() + ", getMobileNum()=" + getMobileNum() + ", getCreatedAt()="
				+ getCreatedAt() + ", getUpdatedAt()=" + getUpdatedAt() + ", getResetToken()=" + getResetToken()
				 + ", getGender()=" + getGender() + ", getAdharcard()="
				+ getAdharcard() + ", getPancard()=" + getPancard() + ", getAddress()=" + getAddress()
				+ ", getDateofbirth()=" + getDateofbirth() + ", getConfirmpassword()=" + getConfirmpassword()
				+ ", getStatus()=" + getStatus() + ", getProfilePicture()=" + getProfilePicture()
				+ ",getUserType()=" + getUserType() + ", getClass()=" + getClass() + ", hashCode()=" + hashCode() + ", toString()=" + super.toString()
				+ "]";
	}


	public int getStatus() {
		return status;
	}


	public void setStatus(int status) {
		this.status = status;
	}


	public String getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(String profilePicture) {
		this.profilePicture = profilePicture;
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

