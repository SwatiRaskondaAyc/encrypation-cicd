package com.example.prog.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.prog.entity.UserDtls;


@Repository
public interface UserRepository extends JpaRepository <UserDtls,Integer> {

	//public UserDtls findByEmail(String em);

	public UserDtls findByResetToken(String token);
 	Optional<UserDtls> findByEmail(String email);

//	public int updateProfilePictureUrl(String tokenEmail, String imageUrl);
//	
	@Modifying
	@Transactional
	@Query("UPDATE UserDtls u SET u.profilePicture = :profilePicture WHERE u.email = :email")
	int updateProfilePicture(@Param("email") String email, @Param("profilePicture") String profilePicture);

	List<UserDtls> findByGoogleUserIDIsNullAndUserType(String userType);
    List<UserDtls> findByGoogleUserIDIsNotNullAndUserType(String userType);
    List<UserDtls> findByUserType(String userType);

}