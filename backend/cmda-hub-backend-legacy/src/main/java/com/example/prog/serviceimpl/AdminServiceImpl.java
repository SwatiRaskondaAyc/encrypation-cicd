
	
// 	package com.example.prog.serviceimpl;

// 	import com.example.prog.entity.CorporateUser;
// 	import com.example.prog.repository.AdminRepository;
// 	import com.example.prog.service.AdminService;

// import java.util.List;

// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.stereotype.Service;
// 	import org.springframework.transaction.annotation.Transactional;

// 	@Service
// 	public class AdminServiceImpl implements AdminService {

// 	    private final AdminRepository adminRepository;
	    
// 	    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


// 	    public AdminServiceImpl(AdminRepository adminRepository) {
// 	        this.adminRepository = adminRepository;
// 	    }


	    

// 	    @Override
// 	    public List<CorporateUser> getAllCorporateUsers() {
// 	        return adminRepository.findAll();
// 	    }

// 	    @Override
// 	    public void saveCorporateUser(CorporateUser corporateUser) {
// 	    	String hashedPassword = passwordEncoder.encode(corporateUser.getPassword());
// 	        corporateUser.setPassword(hashedPassword);

// 	    	adminRepository.save(corporateUser);
// 	    }

	
// 	    @Override
// 		public CorporateUser getCorporateUserByEmail(String email) {
// 		    return adminRepository.findByEmail(email);
// 		}
	    

// 	    @Transactional
// 	    @Override
// 		public void deleteCorporateUserByEmail(String email) {
// 	    	adminRepository.deleteByEmail(email);
// 		}

// 		@Override
// 		public List<CorporateUser> getActiveCorporateUsers() {
// 			// TODO Auto-generated method stub
// 			return adminRepository.findByStatus(1);
// 		}

// 	}

// package com.example.prog.serviceimpl;

// import com.example.prog.entity.CorporateUser;
// import com.example.prog.repository.AdminRepository;
// import com.example.prog.service.AdminService;

// import java.util.List;

// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// @Service
// public class AdminServiceImpl implements AdminService {

//     private final AdminRepository adminRepository;
    
//     private final BCryptPasswordEncoder passwordEncoder;

//     public AdminServiceImpl(AdminRepository adminRepository, BCryptPasswordEncoder passwordEncoder) {
//         this.adminRepository = adminRepository;
//         this.passwordEncoder = passwordEncoder;
//     }

//     @Override
//     public List<CorporateUser> getAllCorporateUsers() {
//         return adminRepository.findAll();
//     }

//     @Override
//     @Transactional
//     public void saveCorporateUser(CorporateUser corporateUser) {
//         if (corporateUser.getPassword() != null && !corporateUser.getPassword().isEmpty()) {
//             String hashedPassword = passwordEncoder.encode(corporateUser.getPassword());
//             corporateUser.setPassword(hashedPassword);
//         }
//         adminRepository.save(corporateUser);
//     }

//     @Override
//     public CorporateUser getCorporateUserByEmail(String email) {
//         return adminRepository.findByEmail(email);
//     }

//     @Override
//     @Transactional
//     public void deleteCorporateUserByEmail(String email) {
//         adminRepository.deleteByEmail(email);
//     }

//     @Override
//     public List<CorporateUser> getActiveCorporateUsers() {
//         return adminRepository.findByStatus(1);
//     }

//     @Override
//     public List<CorporateUser> getActiveCorporateUsersByAdminId(String adminId) {
//         return adminRepository.findByAdminIdAndStatus(adminId, 1);
//     }

// 	 @Override
//     public List<CorporateUser> getActiveCorporateUsersByAdminIdAndRole(String adminId, String role, String excludeEmail) {
//         return adminRepository.findByAdminIdAndStatusAndRoleAndEmailNot(adminId, 1, role, excludeEmail);
//     }
// }

package com.example.prog.serviceimpl;

import com.example.prog.entity.CorporateUser;
import com.example.prog.repository.AdminRepository;
import com.example.prog.service.AdminService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminServiceImpl(AdminRepository adminRepository, BCryptPasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<CorporateUser> getAllCorporateUsers() {
        return adminRepository.findAll();
    }

    @Override
    @Transactional
    public void saveCorporateUser(CorporateUser corporateUser) {
        if (corporateUser.getPassword() != null && !corporateUser.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(corporateUser.getPassword());
            corporateUser.setPassword(hashedPassword);
        }
        adminRepository.save(corporateUser);
    }

    @Override
    public CorporateUser getCorporateUserByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public void deleteCorporateUserByEmail(String email) {
        adminRepository.deleteByEmail(email);
    }

    @Override
    public List<CorporateUser> getActiveCorporateUsers() {
        return adminRepository.findByStatus(1);
    }

    @Override
    public List<CorporateUser> getActiveCorporateUsersByAdminId(String adminId) {
        return adminRepository.findByAdminIdAndStatus(adminId, 1);
    }

    @Override
    public List<CorporateUser> getActiveCorporateUsersByAdminIdAndRole(String adminId, String role, String excludeEmail) {
        return adminRepository.findByAdminIdAndStatusAndRoleAndEmailNot(adminId, 1, role, excludeEmail);
    }

    @Override
    public long countActiveUsersByAdminIdAndRole(String adminId, String role, String excludeEmail) {
        return adminRepository.countByAdminIdAndStatusAndRoleAndEmailNot(adminId, 1, role, excludeEmail);
    }
}
