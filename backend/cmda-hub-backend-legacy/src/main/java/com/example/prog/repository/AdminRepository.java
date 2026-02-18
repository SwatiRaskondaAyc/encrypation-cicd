// package com.example.prog.repository;


	
	

// 	import com.example.prog.entity.CorporateUser;



// import org.springframework.data.jpa.repository.JpaRepository;
// 	import org.springframework.stereotype.Repository;
// import org.springframework.transaction.annotation.Transactional;

// import java.util.List;
// import java.util.Optional;

// 	@Repository
// 	public interface AdminRepository extends JpaRepository<CorporateUser, Integer> 
// 	{

// 		CorporateUser findByEmail(String email);

		
// 		@Transactional
// 		void deleteByEmail(String email);


// 		List<CorporateUser> findByStatus(int status);
	   
// 	}

// package com.example.prog.repository;

// import com.example.prog.entity.CorporateUser;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;
// import org.springframework.transaction.annotation.Transactional;

// import java.util.List;

// @Repository
// public interface AdminRepository extends JpaRepository<CorporateUser, Integer> {
//     CorporateUser findByEmail(String email);

//     @Transactional
//     void deleteByEmail(String email);

//     List<CorporateUser> findByStatus(int status);

//     List<CorporateUser> findByAdminIdAndStatus(String adminId, int status);

// 	 List<CorporateUser> findByAdminIdAndStatusAndRoleAndEmailNot(String adminId, int status, String role, String email);
// }


package com.example.prog.repository;

import com.example.prog.entity.CorporateUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AdminRepository extends JpaRepository<CorporateUser, Integer> {
    CorporateUser findByEmail(String email);

    @Transactional
    void deleteByEmail(String email);

    List<CorporateUser> findByStatus(int status);

    List<CorporateUser> findByAdminIdAndStatus(String adminId, int status);

    List<CorporateUser> findByAdminIdAndStatusAndRoleAndEmailNot(String adminId, int status, String role, String email);

    @Query("SELECT COUNT(u) FROM CorporateUser u WHERE u.adminId = :adminId AND u.status = :status AND u.role = :role AND u.email != :excludeEmail")
    long countByAdminIdAndStatusAndRoleAndEmailNot(
            @Param("adminId") String adminId,
            @Param("status") int status,
            @Param("role") String role,
            @Param("excludeEmail") String excludeEmail);
}

	