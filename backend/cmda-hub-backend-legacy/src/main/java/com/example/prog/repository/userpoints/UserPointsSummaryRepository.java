// package com.example.prog.repository.userpoints;

// import com.example.prog.entity.userpoints.UserPointsSummary;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Modifying;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;
// import org.springframework.transaction.annotation.Transactional;

// import java.util.Optional;

// @Repository
// public interface UserPointsSummaryRepository extends JpaRepository<UserPointsSummary, Long> {
    
//     Optional<UserPointsSummary> findByUserId(Integer userId);
    
//     @Query("SELECT ups FROM UserPointsSummary ups WHERE ups.userId = :userId")
//     Optional<UserPointsSummary> findUserPointsSummaryByUserId(@Param("userId") Integer userId);
    
//     @Modifying
//     @Transactional
//     @Query("UPDATE UserPointsSummary ups SET " +
//            "ups.equityPoints = :equityPoints, " +
//            "ups.portfolioPoints = :portfolioPoints, " +
//            "ups.tutorialPoints = :tutorialPoints, " +
//            "ups.totalPoints = :totalPoints, " +
//            "ups.updatedAt = CURRENT_TIMESTAMP " +
//            "WHERE ups.userId = :userId")
//     int updateUserPoints(@Param("userId") Integer userId,
//                          @Param("equityPoints") Integer equityPoints,
//                          @Param("portfolioPoints") Integer portfolioPoints,
//                          @Param("tutorialPoints") Integer tutorialPoints,
//                          @Param("totalPoints") Integer totalPoints);
    
//     @Query("SELECT COALESCE(SUM(ups.totalPoints), 0) FROM UserPointsSummary ups")
//     Integer getTotalPointsAcrossAllUsers();
    
//     @Query("SELECT COUNT(ups) FROM UserPointsSummary ups WHERE ups.userId = :userId")
//     boolean existsByUserId(@Param("userId") Integer userId);
// }

// package com.example.prog.repository.userpoints;

// import com.example.prog.entity.userpoints.UserPointsSummary;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Modifying;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;
// import org.springframework.transaction.annotation.Transactional;
// import java.util.List;
// import java.util.Optional;

// // @Repository
// // public interface UserPointsSummaryRepository extends JpaRepository<UserPointsSummary, Long> {
    
// //     Optional<UserPointsSummary> findByUserId(Integer userId);
    
// //     @Query("SELECT ups FROM UserPointsSummary ups WHERE ups.userId = :userId")
// //     Optional<UserPointsSummary> findUserPointsSummaryByUserId(@Param("userId") Integer userId);
    
// //     @Modifying
// //     @Transactional
// //     @Query("UPDATE UserPointsSummary ups SET " +
// //            "ups.equityPoints = :equityPoints, " +
// //            "ups.portfolioPoints = :portfolioPoints, " +
// //            "ups.tutorialPoints = :tutorialPoints, " +
// //            "ups.totalPoints = :totalPoints, " +
// //            "ups.updatedAt = CURRENT_TIMESTAMP " +
// //            "WHERE ups.userId = :userId")
// //     int updateUserPoints(@Param("userId") Integer userId,
// //                          @Param("equityPoints") Integer equityPoints,
// //                          @Param("portfolioPoints") Integer portfolioPoints,
// //                          @Param("tutorialPoints") Integer tutorialPoints,
// //                          @Param("totalPoints") Integer totalPoints);
    
// //     @Query("SELECT COALESCE(SUM(ups.totalPoints), 0) FROM UserPointsSummary ups")
// //     Integer getTotalPointsAcrossAllUsers();
    
// //     @Query("SELECT COUNT(ups) FROM UserPointsSummary ups WHERE ups.userId = :userId")
// //     boolean existsByUserId(@Param("userId") Integer userId);
// // }

// @Repository
// public interface UserPointsSummaryRepository extends JpaRepository<UserPointsSummary, Long> {

//     Optional<UserPointsSummary> findByUserId(Integer userId);

// //     @Modifying
// //     @Transactional
// //     @Query("UPDATE UserPointsSummary ups SET " +
// //            "ups.equityPoints = :equityPoints, " +
// //            "ups.portfolioPoints = :portfolioPoints, " +
// //            "ups.tutorialPoints = :tutorialPoints, " +
// //            "ups.totalPoints = :totalPoints, " +
// //            "ups.updatedAt = CURRENT_TIMESTAMP " +
// //            "WHERE ups.userId = :userId")
// //     int updateUserPoints(@Param("userId") Integer userId,
// //                          @Param("equityPoints") Integer equityPoints,
// //                          @Param("portfolioPoints") Integer portfolioPoints,
// //                          @Param("tutorialPoints") Integer tutorialPoints,
// //                          @Param("totalPoints") Integer totalPoints);

// @Modifying
// @Transactional
// @Query("UPDATE UserPointsSummary ups SET " +
//        "ups.equityPoints = :equityPoints, " +
//        "ups.portfolioPoints = :portfolioPoints, " +
//        "ups.tutorialPoints = :tutorialPoints, " +
//        "ups.totalPoints = :totalPoints, " +
//        "ups.updatedAt = CURRENT_TIMESTAMP " +
//        "WHERE ups.userId = :userId")
// int updateUserPoints(@Param("userId") Integer userId,
//                      @Param("equityPoints") Integer equityPoints,
//                      @Param("portfolioPoints") Integer portfolioPoints,
//                      @Param("tutorialPoints") Integer tutorialPoints,
//                      @Param("totalPoints") Integer totalPoints);

//     @Query("SELECT COALESCE(SUM(ups.totalPoints), 0) FROM UserPointsSummary ups")
//     Integer getTotalPointsAcrossAllUsers();

//     // Use Spring Data derived method for existence check:
//     boolean existsByUserId(Integer userId);
    
//      List<UserPointsSummary> findAllByOrderByTotalPointsDesc();
// }


package com.example.prog.repository.userpoints;

import com.example.prog.entity.userpoints.UserPointsSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

// @Repository
// public interface UserPointsSummaryRepository extends JpaRepository<UserPointsSummary, Long> {
    
//     Optional<UserPointsSummary> findByUserId(Integer userId);
    
//     @Query("SELECT ups FROM UserPointsSummary ups WHERE ups.userId = :userId")
//     Optional<UserPointsSummary> findUserPointsSummaryByUserId(@Param("userId") Integer userId);
    
//     @Modifying
//     @Transactional
//     @Query("UPDATE UserPointsSummary ups SET " +
//            "ups.equityPoints = :equityPoints, " +
//            "ups.portfolioPoints = :portfolioPoints, " +
//            "ups.tutorialPoints = :tutorialPoints, " +
//            "ups.totalPoints = :totalPoints, " +
//            "ups.updatedAt = CURRENT_TIMESTAMP " +
//            "WHERE ups.userId = :userId")
//     int updateUserPoints(@Param("userId") Integer userId,
//                          @Param("equityPoints") Integer equityPoints,
//                          @Param("portfolioPoints") Integer portfolioPoints,
//                          @Param("tutorialPoints") Integer tutorialPoints,
//                          @Param("totalPoints") Integer totalPoints);
    
//     @Query("SELECT COALESCE(SUM(ups.totalPoints), 0) FROM UserPointsSummary ups")
//     Integer getTotalPointsAcrossAllUsers();
    
//     @Query("SELECT COUNT(ups) FROM UserPointsSummary ups WHERE ups.userId = :userId")
//     boolean existsByUserId(@Param("userId") Integer userId);
    
//     List<UserPointsSummary> findAllByOrderByTotalPointsDesc();
    
//     // Alternative: Use simple native INSERT with conflict handling
//   @Modifying
// @Transactional
// @Query(value = "MERGE user_points_summary AS target " +
//        "USING (VALUES (:userId, :equityPoints, :portfolioPoints, :tutorialPoints, :totalPoints)) " +
//        "AS source (user_id, equity_points, portfolio_points, tutorial_points, total_points) " +
//        "ON target.user_id = source.user_id " +
//        "WHEN MATCHED THEN " +
//        "UPDATE SET equity_points = source.equity_points, " +
//        "portfolio_points = source.portfolio_points, " +
//        "tutorial_points = source.tutorial_points, " +
//        "total_points = source.total_points, " +
//        "updated_at = GETDATE() " +
//        "WHEN NOT MATCHED THEN " +
//        "INSERT (user_id, equity_points, portfolio_points, tutorial_points, total_points, created_at, updated_at) " +
//        "VALUES (source.user_id, source.equity_points, source.portfolio_points, " +
//        "source.tutorial_points, source.total_points, GETDATE(), GETDATE());", 
//        nativeQuery = true)
// int upsertUserPoints(@Param("userId") Integer userId,
//                     @Param("equityPoints") Integer equityPoints,
//                     @Param("portfolioPoints") Integer portfolioPoints,
//                     @Param("tutorialPoints") Integer tutorialPoints,
//                     @Param("totalPoints") Integer totalPoints);
//               }

@Repository
public interface UserPointsSummaryRepository extends JpaRepository<UserPointsSummary, Long> {
    
    // Find by userId and userType
    Optional<UserPointsSummary> findByUserIdAndUserType(Integer userId, String userType);
    
    // Find by userId only (for backward compatibility)
    Optional<UserPointsSummary> findByUserId(Integer userId);
    
    @Query("SELECT ups FROM UserPointsSummary ups WHERE ups.userId = :userId AND ups.userType = :userType")
    Optional<UserPointsSummary> findUserPointsSummaryByUserIdAndUserType(
            @Param("userId") Integer userId, @Param("userType") String userType);
    
    @Modifying
    @Transactional
    @Query("UPDATE UserPointsSummary ups SET " +
           "ups.equityPoints = :equityPoints, " +
           "ups.portfolioPoints = :portfolioPoints, " +
           "ups.tutorialPoints = :tutorialPoints, " +
           "ups.totalPoints = :totalPoints, " +
           "ups.updatedAt = CURRENT_TIMESTAMP " +
           "WHERE ups.userId = :userId AND ups.userType = :userType")
    int updateUserPoints(@Param("userId") Integer userId,
                         @Param("userType") String userType,
                         @Param("equityPoints") Integer equityPoints,
                         @Param("portfolioPoints") Integer portfolioPoints,
                         @Param("tutorialPoints") Integer tutorialPoints,
                         @Param("totalPoints") Integer totalPoints);
    
    // Other methods remain the same...
    List<UserPointsSummary> findByUserType(String userType);
    
    @Query("SELECT COALESCE(SUM(ups.totalPoints), 0) FROM UserPointsSummary ups WHERE ups.userType = :userType")
    Integer getTotalPointsByUserType(@Param("userType") String userType);

    @Query("SELECT DISTINCT ups.userId FROM UserPointsSummary ups")
List<Integer> findAllUserIds();
}