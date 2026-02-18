// package com.example.prog.repository;

// import com.example.prog.entity.PortfolioRating;
// import org.springframework.data.jpa.repository.JpaRepository;
// import java.util.List;
// import java.util.Optional;

// public interface PortfolioRatingRepository extends JpaRepository<PortfolioRating, Long> {
//     Optional<PortfolioRating> findByPlotTypeAndUserIdAndUserType(String plotType, Integer userId, String userType);
//     List<PortfolioRating> findByPlotType(String plotType);
// }

// --------------------user points repo --------------------


package com.example.prog.repository;

import com.example.prog.entity.PortfolioRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRatingRepository extends JpaRepository<PortfolioRating, Long> {
    
    Optional<PortfolioRating> findByPlotTypeAndUserIdAndUserType(String plotType, Integer userId, String userType);
    List<PortfolioRating> findByPlotType(String plotType);
    
    @Query("SELECT COALESCE(SUM(pr.earnedPoint), 0) FROM PortfolioRating pr WHERE pr.userId = :userId")
    Integer sumEarnedPointsByUserId(@Param("userId") Integer userId);
    
    // @Query("SELECT pr.userId, SUM(pr.earnedPoint) as totalPoints FROM PortfolioRating pr GROUP BY pr.userId")
    // List<Object[]> getTotalPointsPerUser();
    
    @Query("SELECT COUNT(pr) FROM PortfolioRating pr WHERE pr.userId = :userId")
    Long countByUserId(@Param("userId") Integer userId);

    @Query("SELECT pr.userId, COALESCE(SUM(pr.earnedPoint), 0) as totalPoints FROM PortfolioRating pr GROUP BY pr.userId")
List<Object[]> getTotalPointsPerUser();

//  @Query("SELECT DISTINCT pr.userId FROM PortfolioRating pr WHERE pr.userEmail = :email")
//     Integer findUserIdByEmail(@Param("email") String email);
}