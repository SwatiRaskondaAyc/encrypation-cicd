// package com.example.prog.repository;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Modifying;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;
// import org.springframework.transaction.annotation.Transactional;

// import com.example.prog.entity.CorporateUser;

// @Repository
// @EnableJpaRepositories(basePackages = "com.example.prog.repository")

// public interface CorporateUserRepository extends JpaRepository<CorporateUser, Integer> {

// 	public CorporateUser findByemail(String email);

//     CorporateUser findByResetToken(String token);

// 	public CorporateUser findByEmail(String tokenEmail);

// 	@Modifying
// 	@Transactional
// 	@Query("UPDATE CorporateUser u SET u.profilePicture = :profilePicture WHERE u.email = :email")
// 	int updateProfilePicture(@Param("email") String email, @Param("profilePicture") String profilePicture);

//  @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(u.adminId, LENGTH(?1) + 1) AS INTEGER)), 0) " +
//            "FROM CorporateUser u WHERE u.adminId LIKE ?2")
//     int findMaxAdminIdIncrement(String prefix, String pattern);

// }

package com.example.prog.repository;

import com.example.prog.entity.CorporateUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CorporateUserRepository extends JpaRepository<CorporateUser, Integer> {

    CorporateUser findByemail(String email);

    CorporateUser findByResetToken(String token);

    @Modifying
    @Transactional
    @Query("UPDATE CorporateUser u SET u.profilePicture = :profilePicture WHERE u.email = :email")
    int updateProfilePicture(@Param("email") String email, @Param("profilePicture") String profilePicture);

    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(u.adminId, LENGTH(?1) + 1) AS INTEGER)), 0) " +
            "FROM CorporateUser u WHERE u.adminId LIKE ?2")
    int findMaxAdminIdIncrement(String prefix, String pattern);

    @Modifying
    @Transactional
    @Query("DELETE FROM CorporateUser u WHERE u.adminId = :adminId")
    void deleteByAdminId(@Param("adminId") String adminId);

    @Modifying
    @Transactional
    @Query("DELETE FROM CorporateUser u WHERE u.email = :email")
    void deleteByEmail(@Param("email") String email);
}