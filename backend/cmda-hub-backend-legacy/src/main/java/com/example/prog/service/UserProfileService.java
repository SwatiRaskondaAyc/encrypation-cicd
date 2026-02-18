package com.example.prog.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.prog.entity.UserDtls;
import com.example.prog.entity.Userprofile;


public interface UserProfileService
{
	
	
    Userprofile getUserProfile(String email);
   
	
	
	List<Userprofile> getAllUserProfiles();
	UserDtls updateUserProfile(UserDtls userProfile);



	



	UserDtls completeUserProfile(UserDtls additionalDetails);



	String getFullName(String email);



	UserDtls getUserByEmail(String tokenEmail);



	String saveProfilePicture(String tokenEmail, MultipartFile file)throws IOException;



	void updateUserProfilePicture(String tokenEmail, String imageUrl);



	String getProfilePicture(String tokenEmail);

		boolean deactivateUserAccount(String tokenEmail);



	
}

