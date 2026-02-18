// package com.example.prog.repository;

// import com.example.prog.entity.TutorialVideoRating;
// import org.springframework.data.jpa.repository.JpaRepository;

// import java.util.List;
// import java.util.Optional;

// public interface TutorialVideoRatingRepository extends JpaRepository<TutorialVideoRating, Long> {
//     Optional<TutorialVideoRating> findByUserIdAndVideoName(Integer userId, String videoName);
//     List<TutorialVideoRating> findByVideoName(String videoName);
// }


// --------------------user points repo --------------------   



// package com.example.prog.repository;

// import com.example.prog.entity.TutorialVideoRating;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// import java.util.List;
// import java.util.Optional;

// @Repository
// public interface TutorialVideoRatingRepository extends JpaRepository<TutorialVideoRating, Long> {
    
//     // Make sure this method exists and returns Optional
//     Optional<TutorialVideoRating> findByUserIdAndVideoNameAndUserType(Integer userId, String videoName, String userType);
    
//     List<TutorialVideoRating> findByVideoName(String videoName);
    
//     // Your other existing methods...
//     TutorialVideoRating findByVideoNameAndUserIdAndUserType(String videoName, Integer userId, String userType);
    
//     @Query("SELECT AVG(tvr.rating) FROM TutorialVideoRating tvr WHERE tvr.videoName = :videoName")
//     Double findAverageRatingByVideoName(@Param("videoName") String videoName);
    
//     @Query("SELECT COALESCE(SUM(tvr.earnedPoint), 0) FROM TutorialVideoRating tvr WHERE tvr.userId = :userId")
//     Integer sumEarnedPointsByUserId(@Param("userId") Integer userId);
    
//     @Query("SELECT COUNT(tvr) FROM TutorialVideoRating tvr WHERE tvr.userId = :userId")
//     Long countByUserId(@Param("userId") Integer userId);
    
//     @Query("SELECT tvr FROM TutorialVideoRating tvr WHERE tvr.userId = :userId ORDER BY tvr.timestamp DESC")
//     List<TutorialVideoRating> findByUserId(@Param("userId") Integer userId);

//     @Query("SELECT tvr.userId, COALESCE(SUM(tvr.earnedPoint), 0) as totalPoints FROM TutorialVideoRating tvr GROUP BY tvr.userId")
//     List<Object[]> getTotalPointsPerUser();
    
// }



package com.example.prog.repository;

import com.example.prog.entity.TutorialVideoRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TutorialVideoRatingRepository extends JpaRepository<TutorialVideoRating, Long> {
    
    // Add the missing method
    @Query("SELECT t FROM TutorialVideoRating t WHERE t.userId = :userId AND t.videoName = :videoName")
    List<TutorialVideoRating> findByUserIdAndVideoName(@Param("userId") Integer userId, @Param("videoName") String videoName);
    
    // Your existing methods...
    @Query("SELECT t FROM TutorialVideoRating t WHERE t.userId = :userId AND t.videoName = :videoName AND t.userType = :userType")
    Optional<TutorialVideoRating> findSpecificRating(
        @Param("userId") Integer userId, 
        @Param("videoName") String videoName, 
        @Param("userType") String userType
    );
    
    @Query("SELECT pr.userId, COALESCE(SUM(pr.earnedPoint), 0) as totalPoints FROM TutorialVideoRating pr GROUP BY pr.userId")
    List<Object[]> getTotalPointsPerUser();

    List<TutorialVideoRating> findByVideoName(String videoName);
    List<TutorialVideoRating> findByUserId(Integer userId);
    List<TutorialVideoRating> findByUserIdAndUserType(Integer userId, String userType);

    @Query("SELECT AVG(tvr.rating) FROM TutorialVideoRating tvr WHERE tvr.videoName = :videoName")
    Double findAverageRatingByVideoName(@Param("videoName") String videoName);
    
    @Query("SELECT COALESCE(SUM(tvr.earnedPoint), 0) FROM TutorialVideoRating tvr WHERE tvr.userId = :userId")
    Integer sumEarnedPointsByUserId(@Param("userId") Integer userId);
    
    @Query("SELECT COUNT(tvr) FROM TutorialVideoRating tvr WHERE tvr.userId = :userId")
    Long countByUserId(@Param("userId") Integer userId);
}