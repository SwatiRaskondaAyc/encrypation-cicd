package com.example.prog.repository.portfolioRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.prog.entity.UserDtls;
import com.example.prog.entity.portfolio.UserPortfolioUploads;
//
//@Repository
//public interface UserPortfolioUploadRepository extends JpaRepository<UserPortfolioUploads, Integer> {
//
//	Optional<UserPortfolioUploads> findByUserIDAndUserType(int userID, String userType);
////
//    Optional<UserPortfolioUploads> findByUploadId(String uploadId);
//    
// // new:
//    List<UserPortfolioUploads> findAllByUserIDAndUserType(int userId, String userType);
////
////    // ← and, if you also need to look up by platform:
////    Optional<UserPortfolioUploads> 
////        findByUserIDAndUserTypeAndPlatform(int userID, String userType, String platform);
//    
//    Optional<UserPortfolioUploads> findByUserIDAndUserTypeAndPlatform(int userID, String userType, String platform);
//	
//    Optional<UserPortfolioUploads> findByPortfolioTableNameAndUserIDAndUserType(String portfolioTableName, int userID,
//			String userType);
//	
//}

@Repository
public interface UserPortfolioUploadRepository extends JpaRepository<UserPortfolioUploads, Integer> {

	Optional<UserPortfolioUploads> findByUserIDAndUserType(int userID, String userType);
//
    Optional<UserPortfolioUploads> findByUploadId(String uploadId);
    
 // new:
    List<UserPortfolioUploads> findAllByUserIDAndUserType(int userId, String userType);
//
//    // ← and, if you also need to look up by platform:
//    Optional<UserPortfolioUploads> 
//        findByUserIDAndUserTypeAndPlatform(int userID, String userType, String platform);
    
    Optional<UserPortfolioUploads> findByUserIDAndUserTypeAndPlatform(int userID, String userType, String platform);
	
    Optional<UserPortfolioUploads> findByPortfolioTableNameAndUserIDAndUserType(String portfolioTableName, int userID,
			String userType);
    
    Optional<UserPortfolioUploads> findByPortfolioTableName(String tablename);
	
}