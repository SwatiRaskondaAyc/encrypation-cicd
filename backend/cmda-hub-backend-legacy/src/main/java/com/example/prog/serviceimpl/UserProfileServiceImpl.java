package com.example.prog.serviceimpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.prog.entity.UserDtls;
import com.example.prog.entity.Userprofile;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.UserprofileRepo;
import com.example.prog.service.FileStorageService;
import com.example.prog.service.UserProfileService;
import java.util.Map;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    @Autowired
    private UserprofileRepo userProfileRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

   
 @Override
    public Userprofile getUserProfile(String email) {
        UserDtls user = userRepo.findByEmail(email).orElse(null);

        if (user == null) {
            return null;
        }

        Userprofile userProfile = new Userprofile();
        userProfile.setUserID(user.getUserID());
        userProfile.setFullname(user.getFullname());
        userProfile.setMobileNum(user.getMobileNum());
        userProfile.setEmail(user.getEmail());
        // userProfile.setUserType(user.getUserType()); // Added userType mapping

        return userProfile;
    }

    @Override
    @Transactional
    public UserDtls updateUserProfile(UserDtls userProfile) {
        UserDtls user = userRepo.findByEmail(userProfile.getEmail()).orElse(null);
        if (user != null) {
            if (userProfile.getFullname() != null && !userProfile.getFullname().isEmpty()) {
                user.setFullname(userProfile.getFullname());
            }
            if (userProfile.getMobileNum() != null && !userProfile.getMobileNum().isEmpty()) {
                user.setMobileNum(userProfile.getMobileNum());
            }
            if (userProfile.getCountryCode() != null && !userProfile.getCountryCode().isEmpty()) {
                user.setCountryCode(userProfile.getCountryCode());
            }
            if (userProfile.getPassword() != null && !userProfile.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userProfile.getPassword()));
            }
            if (userProfile.getConfirmpassword() != null && !userProfile.getConfirmpassword().isEmpty()) {
                user.setConfirmpassword(userProfile.getConfirmpassword());
            }
            // if (userProfile.getUserType() != null && !userProfile.getUserType().isEmpty()) {
            //     user.setUserType(userProfile.getUserType()); // Added userType update
            // }

            user = userRepo.save(user);
            System.out.println("Updated user: " + user);

            return user;
        } else {
            throw new RuntimeException("User not found with email: " + userProfile.getEmail());
        }
    }

    @Override
    public List<Userprofile> getAllUserProfiles() {
        List<UserDtls> users = userRepo.findAll();

        return users.stream().map(user -> {
            Userprofile userProfile = new Userprofile();
            userProfile.setUserID(user.getUserID());
            userProfile.setFullname(user.getFullname());
            userProfile.setMobileNum(user.getMobileNum());
            userProfile.setEmail(user.getEmail());
            // userProfile.setUserType(user.getUserType()); // Added userType mapping
            return userProfile;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDtls completeUserProfile(UserDtls additionalDetails) {
        UserDtls user = userRepo.findByEmail(additionalDetails.getEmail()).orElse(null);
        if (user == null) {
            throw new RuntimeException("User with email " + additionalDetails.getEmail() + " not found.");
        }

        if (additionalDetails.getGender() != null) {
            user.setGender(additionalDetails.getGender());
        }
        if (additionalDetails.getAdharcard() != null) {
            user.setAdharcard(additionalDetails.getAdharcard());
        }
        if (additionalDetails.getPancard() != null) {
            user.setPancard(additionalDetails.getPancard());
        }
        if (additionalDetails.getAddress() != null) {
            user.setAddress(additionalDetails.getAddress());
        }
        if (additionalDetails.getDateofbirth() != null) {
            user.setDateofbirth(additionalDetails.getDateofbirth());
        }
        // if (additionalDetails.getUserType() != null) {
        //     user.setUserType(additionalDetails.getUserType()); // Added userType update
        // }

        return userRepo.save(user);
    }



		@Override
		public String getFullName(String email)  {
	        UserDtls userProfile = userRepo.findByEmail(email).orElse(null);
	        if (userProfile != null) {
	            return userProfile.getFullname();
	        } else {
	            throw new RuntimeException("SignUp First");
	        }
	    }




		@Override
		public UserDtls getUserByEmail(String tokenEmail) {
			
			return userRepo.findByEmail(tokenEmail).orElse(null);
		}


		
		 private static final String UPLOAD_DIR = "uploads/";


// 		@Override
// 		public String saveProfilePicture(String tokenEmail, MultipartFile file) throws IOException {
// //		   

// 			try {
// 		        // Upload Image (Ensure fileStorageService works)
// 		        String imageUrl = fileStorageService.uploadFile(file);
// 		        System.out.println("Uploaded Image URL: " + imageUrl);

// 		        // Fetch User from DB
// 		        UserDtls user = userRepo.findByEmail(tokenEmail).orElse(null); // No orElse(null) needed
// 		        if (user != null) {
// 		            user.setProfilePicture(imageUrl);
// 		            userRepo.save(user); // Saving the URL
// 		            System.out.println("Profile picture URL saved: " + user.getProfilePicture());
// 		            return imageUrl;
// 		        } else {
// 		            System.out.println("User not found for email: " + tokenEmail);
// 		        }
// 		    } catch (Exception e) {
// 		        System.out.println("Error Saving Image URL: " + e.getMessage());
// 		    }
// 		    return null; // Return null if image upload fails
// 		}

@Override
    public String saveProfilePicture(String tokenEmail, MultipartFile file) throws IOException {
        try {
            // Upload file and get the map of URLs
            Map<String, String> urlMap = fileStorageService.uploadFile(file);
            String imageUrl = urlMap.get("primaryUrl"); // Use primaryUrl as the main image URL
            System.out.println("Uploaded Image URL: " + imageUrl);

            // Fetch User from DB
            UserDtls user = userRepo.findByEmail(tokenEmail).orElse(null);
            if (user != null) {
                user.setProfilePicture(imageUrl);
                userRepo.save(user); // Saving the URL
                System.out.println("Profile picture URL saved: " + user.getProfilePicture());
                return imageUrl;
            } else {
                System.out.println("User not found for email: " + tokenEmail);
            }
        } catch (Exception e) {
            System.out.println("Error Saving Image URL: " + e.getMessage());
        }
        return null; // Return null if image upload fails
    }

		@Override
		 @Transactional
		public void updateUserProfilePicture(String tokenEmail, String imageUrl) {
//			UserDtls user = getUserProfille(tokenEmail);
//	        if (user != null) {
//	        	user.setProfilePictureUrl(imageUrl);
//	            userRepo.save(user);
//	        }
			
			int updatedRows = userRepo.updateProfilePicture(tokenEmail, imageUrl);
		    System.out.println("Rows updated: " + updatedRows);
		}
		
		



		    public UserDtls getUserProfille(String email) {
		    	UserDtls user = userRepo.findByEmail(email).orElse(null); // No Optional
		        return user != null ? user : null; 
		    }




		    @Override
		    public String getProfilePicture(String tokenEmail) {
		        return userRepo.findByEmail(tokenEmail) // Already Optional<UserDtls>
		                       .map(UserDtls::getProfilePicture)
		                       .orElse(null);
		    }



         @Override
		    public boolean deactivateUserAccount(String email) {
		        Optional<UserDtls> userOptional = userRepo.findByEmail(email);
		        if (userOptional.isEmpty()) {
		            return false;
		        }
		        UserDtls user = userOptional.get();
		        user.setStatus(0); // Assuming status is an integer field in UserDtls
		        userRepo.save(user);
		        return true;
		    }



			
		    
	

   

	
}

