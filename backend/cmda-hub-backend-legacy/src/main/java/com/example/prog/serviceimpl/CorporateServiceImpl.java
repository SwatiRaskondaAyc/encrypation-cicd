// package com.example.prog.serviceimpl;


// import java.io.IOException;
// import java.util.Optional;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
// import org.springframework.web.multipart.MultipartFile;

// import com.example.prog.dto.LoginDTO;
// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.Userprofile;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.service.CorporateService;
// import com.example.prog.service.FileStorageService;



// @Service
// public class CorporateServiceImpl implements CorporateService {
//     @Autowired
//     private CorporateUserRepository corporateRepository;
    
//     @Autowired
//     private BCryptPasswordEncoder passwordEncoder;
    
//     @Autowired
//     private FileStorageService fileStorageService;

//     public String login(LoginDTO loginDTO) {
//         CorporateUser corporate = corporateRepository.findByemail(loginDTO.getEmail());
//         if (corporate != null && corporate.getRole().equals("admin")) {
//             return corporate.getEmail();
//         } else {
//             throw new RuntimeException("Invalid credentials");
//         }
//     }

// 	@Override
// 	 @Transactional
// 	public void save(CorporateUser user) {
		
// 		corporateRepository.save(user);
		
// 	}

// 	@Override
// 	public CorporateUser findByEmail(String email) {
// 		// TODO Auto-generated method stub
// 		return corporateRepository.findByemail(email);
// 	}


	
//     @Override
//     public CorporateUser updateCorpUserProfile(CorporateUser corpuserProfile) {
//         CorporateUser user = corporateRepository.findByemail(corpuserProfile.getEmail());
        
//         if (user != null) {
//             if (corpuserProfile.getCompanyName() != null && !corpuserProfile.getCompanyName().isEmpty()) {
//                 user.setCompanyName(corpuserProfile.getCompanyName());
//             }
//             if (corpuserProfile.getEmployeeName() != null && !corpuserProfile.getEmployeeName().isEmpty()) {
//                 user.setEmployeeName(corpuserProfile.getEmployeeName());
//             }
//             if (corpuserProfile.getEmail() != null && !corpuserProfile.getEmail().isEmpty()) {
//                 user.setEmail(corpuserProfile.getEmail());
//             }
//             if (corpuserProfile.getPassword() != null && !corpuserProfile.getPassword().isEmpty()) {
//                 user.setPassword(passwordEncoder.encode(corpuserProfile.getPassword()));
//             }
//             if (corpuserProfile.getConfirmpassword() != null && !corpuserProfile.getConfirmpassword().isEmpty()) {
//                 user.setConfirmpassword(corpuserProfile.getConfirmpassword());
//             }
//             if (corpuserProfile.getJobTitle() != null && !corpuserProfile.getJobTitle().isEmpty()) {
//                 user.setJobTitle(corpuserProfile.getJobTitle());
//             }
//             if (corpuserProfile.getUserType() != null && !corpuserProfile.getUserType().isEmpty()) {
//                 user.setUserType(corpuserProfile.getUserType());
//             }

//             user = corporateRepository.save(user);
//             System.out.println("Updated user: " + user);

//             return user;
//         } else {
//             throw new RuntimeException("User not found with email: " + corpuserProfile.getEmail());
//         }
//     }

//     @Override
//     public CorporateUser getCorporateUser(String email) {
//         CorporateUser user = corporateRepository.findByemail(email);
        
//         if (user == null) {
//             return null;
//         }
        
//         CorporateUser userProfile = new CorporateUser();
//         userProfile.setCompanyName(user.getCompanyName());
//         userProfile.setEmployeeName(user.getEmployeeName());
//         userProfile.setEmail(user.getEmail());
//         userProfile.setMobileNum(user.getMobileNum());
//         userProfile.setJobTitle(user.getJobTitle());
//         userProfile.setRole(user.getRole());
//         userProfile.setUserType(user.getUserType()); // Added userType
        
//         return userProfile;
//     }

// 	@Override
// 	public String getEmployeeName(String email) {
// 		 CorporateUser userProfile = corporateRepository.findByemail(email);
// 	        if (userProfile != null) {
// 	            return userProfile.getEmployeeName();
// 	        } else {
// 	            throw new RuntimeException("SignUp First");
// 	        }
// 	}

// 	@Override
// 	public CorporateUser getUserByEmail(String tokenEmail) {
// 		// TODO Auto-generated method stub
// 		return corporateRepository.findByemail(tokenEmail);
// 	}

//  @Override
//     @Transactional
//     public CorporateUser completeUserProfile(CorporateUser additionalDetails) {
//         CorporateUser user = corporateRepository.findByemail(additionalDetails.getEmail());
//         if (user == null) {
//             throw new RuntimeException("User with email " + additionalDetails.getEmail() + " not found.");
//         }

//         if (additionalDetails.getGender() != null) {
//             user.setGender(additionalDetails.getGender());
//         }
//         if (additionalDetails.getAdharcard() != null) {
//             user.setAdharcard(additionalDetails.getAdharcard());
//         }
//         if (additionalDetails.getPancard() != null) {
//             user.setPancard(additionalDetails.getPancard());
//         }
//         if (additionalDetails.getAddress() != null) {
//             user.setAddress(additionalDetails.getAddress());
//         }
//         if (additionalDetails.getDateofbirth() != null) {
//             user.setDateofbirth(additionalDetails.getDateofbirth());
//         }
//         if (additionalDetails.getUserType() != null) {
//             user.setUserType(additionalDetails.getUserType());
//         }

//         return corporateRepository.save(user);
//     }
	
// 	 private static final String UPLOAD_DIR = "uploads/";

// 	@Override
// 	public String saveProfilePicture(String tokenEmail, MultipartFile file) {
// 		try {
// 	        // Upload Image (Ensure fileStorageService works)
// 	        String imageUrl = fileStorageService.uploadFile(file);
// 	        System.out.println("Uploaded Image URL: " + imageUrl);

// 	        // Fetch User from DB
// 	        CorporateUser user = corporateRepository.findByEmail(tokenEmail); // No orElse(null) needed
// 	        if (user != null) {
// 	            user.setProfilePicture(imageUrl);
// 	            corporateRepository.save(user); // Saving the URL
// 	            System.out.println("Profile picture URL saved: " + user.getProfilePicture());
// 	            return imageUrl;
// 	        } else {
// 	            System.out.println("User not found for email: " + tokenEmail);
// 	        }
// 	    } catch (Exception e) {
// 	        System.out.println("Error Saving Image URL: " + e.getMessage());
// 	    }
// 	    return null; // Return null if image upload fails
// 	}
// 	@Override
// 	@Transactional
// 	public void updateUserProfilePicture(String tokenEmail, String imageUrl) {

// 		int updatedRows = corporateRepository.updateProfilePicture(tokenEmail, imageUrl);
// 	    System.out.println("Rows updated: " + updatedRows);
		
// 	}
	
// 	 public CorporateUser getUserProfille(String email) {
// 		 CorporateUser user = corporateRepository.findByEmail(email); // No Optional
// 	        return user != null ? user : null; 
// 	    }


// 	@Override
// 	public String getProfilePicture(String tokenEmail) {
// 		return Optional.ofNullable(corporateRepository.findByEmail(tokenEmail)) // Wrap in Optional
// 	            .map(CorporateUser::getProfilePicture) // Now mapping will work
// 	            .orElse(null);
// 	}

// 	@Override
// 	public String saveProfilePictureUrl1(String tokenEmail, MultipartFile file) throws IOException {
// 		// TODO Auto-generated method stub
// 		return null;
// 	}

// 	@Override
// 	public CorporateUser findCorporateUserByResetToken(String token) {
// 		// TODO Auto-generated method stub
// 		return corporateRepository.findByResetToken(token);
// 	}

//     @Override
//     @Transactional
//     public boolean deactivateCorporateUserAccount(String email) {
//         CorporateUser user = corporateRepository.findByEmail(email);
//         if (user == null) {
//             return false;
//         }
//         user.setStatus(0); // Assuming status is an integer field in CorporateUser
//         corporateRepository.save(user);
//         return true;
//     }

	

// }


package com.example.prog.serviceimpl;

import java.io.IOException;
import java.util.Optional;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.prog.dto.LoginDTO;
import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.UserDtls;
import com.example.prog.entity.Userprofile;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.service.CorporateService;
import com.example.prog.service.FileStorageService;

@Service
public class CorporateServiceImpl implements CorporateService {

    @Autowired
    private CorporateUserRepository corporateRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private FileStorageService fileStorageService;


    public String login(LoginDTO loginDTO) {
        CorporateUser corporate = corporateRepository.findByemail(loginDTO.getEmail());
        if (corporate != null && corporate.getRole().equals("admin")) {
            return corporate.getEmail();
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    @Override
    @Transactional
    public void save(CorporateUser user) {
        corporateRepository.save(user);
    }

    @Override
    public CorporateUser findByEmail(String email) {
        return corporateRepository.findByemail(email);
    }

    @Override
    public CorporateUser updateCorpUserProfile(CorporateUser corpuserProfile) {
        CorporateUser user = corporateRepository.findByemail(corpuserProfile.getEmail());
        if (user != null) {
            if (corpuserProfile.getCompanyName() != null && !corpuserProfile.getCompanyName().isEmpty()) {
                user.setCompanyName(corpuserProfile.getCompanyName());
            }
            if (corpuserProfile.getEmployeeName() != null && !corpuserProfile.getEmployeeName().isEmpty()) {
                user.setEmployeeName(corpuserProfile.getEmployeeName());
            }
            if (corpuserProfile.getEmail() != null && !corpuserProfile.getEmail().isEmpty()) {
                user.setEmail(corpuserProfile.getEmail());
            }
            if (corpuserProfile.getPassword() != null && !corpuserProfile.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(corpuserProfile.getPassword()));
            }
            if (corpuserProfile.getConfirmpassword() != null && !corpuserProfile.getConfirmpassword().isEmpty()) {
                user.setConfirmpassword(corpuserProfile.getConfirmpassword());
            }
            if (corpuserProfile.getJobTitle() != null && !corpuserProfile.getJobTitle().isEmpty()) {
                user.setJobTitle(corpuserProfile.getJobTitle());
            }
            if (corpuserProfile.getUserType() != null && !corpuserProfile.getUserType().isEmpty()) {
                user.setUserType(corpuserProfile.getUserType());
            }
            return corporateRepository.save(user);
        } else {
            throw new RuntimeException("User not found with email: " + corpuserProfile.getEmail());
        }
    }

    @Override
    public CorporateUser getCorporateUser(String email) {
        CorporateUser user = corporateRepository.findByemail(email);
        if (user == null) {
            return null;
        }
        CorporateUser userProfile = new CorporateUser();
        userProfile.setCompanyName(user.getCompanyName());
        userProfile.setEmployeeName(user.getEmployeeName());
        userProfile.setEmail(user.getEmail());
        userProfile.setMobileNum(user.getMobileNum());
        userProfile.setJobTitle(user.getJobTitle());
        userProfile.setRole(user.getRole());
        userProfile.setUserType(user.getUserType());
        return userProfile;
    }

    @Override
    public String getEmployeeName(String email) {
        CorporateUser userProfile = corporateRepository.findByemail(email);
        if (userProfile != null) {
            return userProfile.getEmployeeName();
        } else {
            throw new RuntimeException("SignUp First");
        }
    }

    @Override
    public CorporateUser getUserByEmail(String tokenEmail) {
        return corporateRepository.findByemail(tokenEmail);
    }

    @Override
    @Transactional
    public CorporateUser completeUserProfile(CorporateUser additionalDetails) {
        CorporateUser user = corporateRepository.findByemail(additionalDetails.getEmail());
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
        if (additionalDetails.getUserType() != null) {
            user.setUserType(additionalDetails.getUserType());
        }
        return corporateRepository.save(user);
    }

    // @Override
    // public String saveProfilePicture(String tokenEmail, MultipartFile file) {
    //     try {
    //         String imageUrl = fileStorageService.uploadFile(file);
    //         CorporateUser user = corporateRepository.findByemail(tokenEmail);
    //         if (user != null) {
    //             user.setProfilePicture(imageUrl);
    //             corporateRepository.save(user);
    //             return imageUrl;
    //         }
    //     } catch (Exception e) {
    //         System.out.println("Error Saving Image URL: " + e.getMessage());
    //     }
    //     return null;
    // }

@Override
    public String saveProfilePicture(String tokenEmail, MultipartFile file) {
        try {
            // Upload file and get the map of URLs
            Map<String, String> urlMap = fileStorageService.uploadFile(file);
            String imageUrl = urlMap.get("primaryUrl"); // Use primaryUrl as the main image URL
            CorporateUser user = corporateRepository.findByemail(tokenEmail);
            if (user != null) {
                user.setProfilePicture(imageUrl);
                corporateRepository.save(user);
                return imageUrl;
            }
        } catch (Exception e) {
            System.out.println("Error Saving Image URL: " + e.getMessage());
        }
        return null;
    }
    @Override
    @Transactional
    public void updateUserProfilePicture(String tokenEmail, String imageUrl) {
        int updatedRows = corporateRepository.updateProfilePicture(tokenEmail, imageUrl);
        System.out.println("Rows updated: " + updatedRows);
    }

    @Override
    public String getProfilePicture(String tokenEmail) {
        return Optional.ofNullable(corporateRepository.findByemail(tokenEmail))
                .map(CorporateUser::getProfilePicture)
                .orElse(null);
    }

    @Override
    public String saveProfilePictureUrl1(String tokenEmail, MultipartFile file) throws IOException {
        return null;
    }

    @Override
    public CorporateUser findCorporateUserByResetToken(String token) {
        return corporateRepository.findByResetToken(token);
    }

    @Override
    @Transactional
    public boolean deleteCorporateUserAndAssociatedUsers(String email) {
        CorporateUser admin = corporateRepository.findByemail(email);
        if (admin == null) {
            return false;
        }
        String adminId = admin.getAdminId();
        if (adminId == null) {
            return false;
        }
        try {
            // Delete all users with the same adminId
            corporateRepository.deleteByAdminId(adminId);
            // Delete the admin user
            corporateRepository.deleteByEmail(email);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}