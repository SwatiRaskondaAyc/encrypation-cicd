package com.example.prog.entity;

import org.springframework.context.annotation.Primary;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Primary
@Entity
public class Userprofile {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userID;

    private String fullname;
    
    @Column(nullable = false, unique = true, name = "email")
    private String email;
    private String mobileNum;
    @Lob
    private String profilePicture;
        private String userType;
    
    
       public Userprofile(int userID, String fullname, String email, String mobileNum, String profilePicture,
    			String userType) {
    		super();
    		this.userID = userID;
    		this.fullname = fullname;
    		this.email = email;
    		this.mobileNum = mobileNum;
    		this.profilePicture = profilePicture;
    		this.userType = userType;
    	}


    public Userprofile() {
			// TODO Auto-generated constructor stub
		}


	// Getters and Setters
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

	public String getMobileNum() {
		return mobileNum;
	}

	public void setMobileNum(String contact) {
		this.mobileNum = contact;
	}

    public String getUserType() {
		return userType;
	}


	public void setUserType(String userType) {
		this.userType = userType;
	}

@Override
	public String toString() {
		return "Userprofile [userID=" + userID + ", fullname=" + fullname + ", email=" + email + ", mobileNum="
				+ mobileNum + ", profilePicture=" + profilePicture + ", userType=" + userType + ", getUserID()="
				+ getUserID() + ", getFullname()=" + getFullname() + ", getEmail()=" + getEmail()
				+ ", getProfilePicture()=" + getProfilePicture() + ", getMobileNum()=" + getMobileNum()
				+ ", getUserType()=" + getUserType() + ", getClass()=" + getClass() + ", hashCode()=" + hashCode()
				+ ", toString()=" + super.toString() + "]";
	}
}

