package com.example.prog.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.example.prog.entity.UserDtls;
import com.example.prog.entity.Userprofile;


@Repository
public interface UserprofileRepo extends JpaRepository<Userprofile, Integer> 

{

////	  @Query("SELECT u FROM Userprofile u WHERE (:email IS NULL OR u.email = :email) AND (:name IS NULL OR u.name = :name)")
////	    List<Userprofile> findUserProfilesByQuery(
////	        @Param("email") String email,
////	        @Param("fullname") String fullname,
////	        @Param("mobileNum") String mobileNum,
////	        @Param("profilePicture") String profilePicture
////	        
////	    );
//
//	  @Query("SELECT u FROM Userprofile u WHERE  (:id IS NULL OR u.id = :id) AND (:email IS NULL OR u.email = :email) AND (:fullname IS NULL OR u.fullname = :fullname)  AND (:mobileNum IS NULL OR u.mobileNum = :mobileNum) AND (:profilePicture IS NULL OR u.profilePicture = :profilePicture)")
//
//	      List<Userprofile> findUserProfilesByQuery(
//			String email, 
//			String fullname, 
//			int mobileNum, 
//			String profilePicture,
//			Long id
//			                      );
//	
//
//	  Userprofile findUserProfileByEmail(String email);

	UserDtls  findByEmail(String email);
	
}
