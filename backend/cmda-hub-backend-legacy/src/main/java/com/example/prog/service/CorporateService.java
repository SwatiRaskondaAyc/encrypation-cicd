// package com.example.prog.service;



// import java.io.IOException;

// import org.springframework.web.multipart.MultipartFile;

// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.Userprofile;



// public interface CorporateService 

// {

// 	void save(CorporateUser user);

	

// 	CorporateUser findByEmail(String email);



// 	CorporateUser updateCorpUserProfile(CorporateUser corpuserProfile);



// 	String saveProfilePictureUrl1(String tokenEmail, MultipartFile file)throws IOException;


// 	CorporateUser getCorporateUser(String email);



// 	String getEmployeeName(String email);



// 	CorporateUser getUserByEmail(String tokenEmail) ;



// 	 CorporateUser completeUserProfile(CorporateUser existingUserProfile);



// 	String saveProfilePicture(String tokenEmail, MultipartFile file);



// 	void updateUserProfilePicture(String tokenEmail, String imageUrl);



// 	String getProfilePicture(String tokenEmail);



// 	CorporateUser findCorporateUserByResetToken(String token);

// 	boolean deactivateCorporateUserAccount(String tokenEmail);
		






	
	

// }

package com.example.prog.service;

import com.example.prog.entity.CorporateUser;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CorporateService {

    void save(CorporateUser user);

    CorporateUser findByEmail(String email);

    CorporateUser updateCorpUserProfile(CorporateUser corpuserProfile);

    String saveProfilePictureUrl1(String tokenEmail, MultipartFile file) throws IOException;

    CorporateUser getCorporateUser(String email);

    String getEmployeeName(String email);

    CorporateUser getUserByEmail(String tokenEmail);

    CorporateUser completeUserProfile(CorporateUser existingUserProfile);

    String saveProfilePicture(String tokenEmail, MultipartFile file);

    void updateUserProfilePicture(String tokenEmail, String imageUrl);

    String getProfilePicture(String tokenEmail);

    CorporateUser findCorporateUserByResetToken(String token);

    boolean deleteCorporateUserAndAssociatedUsers(String email);
}
