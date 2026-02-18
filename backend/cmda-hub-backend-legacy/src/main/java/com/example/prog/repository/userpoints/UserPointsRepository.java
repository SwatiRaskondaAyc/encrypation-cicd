// package com.example.prog.repository.userpoints;

// import com.example.prog.entity.userpoints.UserPoints;
// import com.example.prog.Enum.PointsCategory;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// import java.util.List;

// @Repository
// public interface UserPointsRepository extends JpaRepository<UserPoints, Long> {
    
//     // Find all points for a specific user
//     List<UserPoints> findByUserIdOrderByEarnedAtDesc(Long userId);
    
//     // Find points by user and category
//     List<UserPoints> findByUserIdAndCategoryOrderByEarnedAtDesc(Long userId, PointsCategory category);
    
//     // Get total points by category for a user
//     @Query("SELECT SUM(up.pointsEarned) FROM UserPoints up WHERE up.userId = :userId AND up.category = :category")
//     Integer getTotalPointsByUserAndCategory(@Param("userId") Long userId, @Param("category") PointsCategory category);
    
//     // Get points summary grouped by category
//     @Query("SELECT up.category, SUM(up.pointsEarned), COUNT(up) " +
//            "FROM UserPoints up WHERE up.userId = :userId GROUP BY up.category")
//     List<Object[]> getPointsSummaryByUser(@Param("userId") Long userId);
    
//     // Native queries to read from your actual rating tables
//     @Query(value = "SELECT user_id, rating, timestamp, video_name, earned_point FROM [CMDA_Users_Hub].[dbo].[tutorial_video_ratings]", nativeQuery = true)
//     List<Object[]> findExistingTutorialRatings();
    
//     @Query(value = "SELECT user_id, rating, timestamp, PlotType, earned_point FROM [CMDA_Users_Hub].[dbo].[plot_ratings]", nativeQuery = true)
//     List<Object[]> findExistingEquityRatings();
    
//     @Query(value = "SELECT user_id, rating, timestamp, plot_type, earned_point FROM [CMDA_Users_Hub].[dbo].[portfolio_ratings]", nativeQuery = true)
//     List<Object[]> findExistingPortfolioRatings();
// }


package com.example.prog.repository.userpoints;

import com.example.prog.entity.userpoints.UserPoints;
import com.example.prog.Enum.PointsCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPointsRepository extends JpaRepository<UserPoints, Long> {
    
    // Find all points for a specific user
    List<UserPoints> findByUserIdOrderByEarnedAtDesc(Long userId);
    
    // Find points by user and category
    List<UserPoints> findByUserIdAndCategoryOrderByEarnedAtDesc(Long userId, PointsCategory category);
    
    // Get total points by category for a user
    @Query("SELECT SUM(up.pointsEarned) FROM UserPoints up WHERE up.userId = :userId AND up.category = :category")
    Integer getTotalPointsByUserAndCategory(@Param("userId") Long userId, @Param("category") PointsCategory category);
    
    // Get points summary grouped by category
    @Query("SELECT up.category, SUM(up.pointsEarned), COUNT(up) " +
           "FROM UserPoints up WHERE up.userId = :userId GROUP BY up.category")
    List<Object[]> getPointsSummaryByUser(@Param("userId") Long userId);
}