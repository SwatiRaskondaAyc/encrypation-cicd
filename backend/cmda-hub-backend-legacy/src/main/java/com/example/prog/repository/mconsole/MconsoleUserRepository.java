package com.example.prog.repository.mconsole;




//import java.util.Optional;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;
//
//import com.example.prog.entity.MconsoleUser;
//
//@Repository
//public interface MconsoleUserRepository extends JpaRepository<MconsoleUser, Integer> {
//
//    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true AND u.userType = :userType")
//    long countActiveUsersByType(String userType);
//
//    @Query("SELECT COUNT(u) FROM User u WHERE u.active = false AND u.userType = :userType")
//    long countInactiveUsersByType(String userType);
//
//    @Query("SELECT COUNT(u) FROM User u WHERE u.userType = :userType")
//    long countRegisteredUsersByType(String userType);
//
//    Optional<MconsoleUser> findByEmail(String email);
//}







import com.example.prog.entity.MconsoleUser;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MconsoleUserRepository extends JpaRepository<MconsoleUser, Integer> {

    @Query("SELECT COUNT(u) FROM MconsoleUser u WHERE UPPER(u.userType) = UPPER(:userType) AND u.isActive = true")
    long countActiveUsersByType(@Param("userType") String userType);

    @Query("SELECT COUNT(u) FROM MconsoleUser u WHERE UPPER(u.userType) = UPPER(:userType)")
    long countRegisteredUsersByType(@Param("userType") String userType);
    
    @Query("SELECT COUNT(u) FROM MconsoleUser u WHERE UPPER(u.userType) = UPPER(:userType) AND u.isActive = false")
    long countInactiveUsersByType(@Param("userType") String userType);
    
    Optional<MconsoleUser> findByEmail(String email);
}