// package com.example.prog.service;

// import java.util.List;

// import com.example.prog.entity.CorporateUser;

// public interface AdminService
// {
// //    CorporateUser addCorporateUser(CorporateUser user, String adminRole);
// //    void deleteCorporateUser(int userId, String adminRole);
	
// 	List<CorporateUser> getAllCorporateUsers();
//     void saveCorporateUser(CorporateUser corporateUser);
   
// 	CorporateUser getCorporateUserByEmail(String email);
// 	void deleteCorporateUserByEmail(String email);
// 	List<CorporateUser> getActiveCorporateUsers();
// }


package com.example.prog.service;

import com.example.prog.entity.CorporateUser;
import java.util.List;

// public interface AdminService {
//     List<CorporateUser> getAllCorporateUsers();
//     void saveCorporateUser(CorporateUser corporateUser);
//     CorporateUser getCorporateUserByEmail(String email);
//     void deleteCorporateUserByEmail(String email);
//     List<CorporateUser> getActiveCorporateUsers();
//     List<CorporateUser> getActiveCorporateUsersByAdminId(String adminId);
// 	List<CorporateUser> getActiveCorporateUsersByAdminIdAndRole(String adminId, String role, String excludeEmail);
// }

public interface AdminService {
    List<CorporateUser> getAllCorporateUsers();
    void saveCorporateUser(CorporateUser corporateUser);
    CorporateUser getCorporateUserByEmail(String email);
    void deleteCorporateUserByEmail(String email);
    List<CorporateUser> getActiveCorporateUsers();
    List<CorporateUser> getActiveCorporateUsersByAdminId(String adminId);
    List<CorporateUser> getActiveCorporateUsersByAdminIdAndRole(String adminId, String role, String excludeEmail);
    long countActiveUsersByAdminIdAndRole(String adminId, String role, String excludeEmail);
}