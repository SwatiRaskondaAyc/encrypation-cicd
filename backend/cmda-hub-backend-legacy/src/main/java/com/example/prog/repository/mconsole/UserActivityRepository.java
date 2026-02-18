

// package com.example.prog.repository.mconsole;

// import com.example.prog.entity.UserActivity;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;

// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Map;

// public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {

//     @Query("SELECT new map(u.userType as userType, COUNT(DISTINCT u.email) as count) FROM UserActivity u " +
//            "WHERE u.activityTimestamp BETWEEN :startDate AND :endDate " +
//            "AND u.activityType IN ('INDIVIDUAL_LOGIN_SUCCESS', 'CORPORATE_LOGIN_SUCCESS', 'LOGIN') " +
//            "GROUP BY u.userType")
//     List<Map<String, Object>> countDailyVisitorsByType(@Param("startDate") LocalDateTime startDate, 
//                                                        @Param("endDate") LocalDateTime endDate);

//     @Query("SELECT u FROM UserActivity u WHERE u.email = :email ORDER BY u.activityTimestamp DESC")
//     List<UserActivity> findActivitiesByEmail(@Param("email") String email);

//     @Query("SELECT u FROM UserActivity u ORDER BY u.activityTimestamp DESC LIMIT 10")
//     List<UserActivity> findLatestActivities();
// }

package com.example.prog.repository.mconsole;

import com.example.prog.entity.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {

    @Query("SELECT new map(u.userType as userType, COUNT(DISTINCT u.email) as count) FROM UserActivity u " +
           "WHERE u.activityTimestamp BETWEEN :startDate AND :endDate " +
           "AND u.activityType IN ('INDIVIDUAL_LOGIN_SUCCESS', 'CORPORATE_LOGIN_SUCCESS', 'LOGIN') " +
           "GROUP BY u.userType")
    List<Map<String, Object>> countDailyVisitorsByType(@Param("startDate") LocalDateTime startDate, 
                                                       @Param("endDate") LocalDateTime endDate);

    @Query("SELECT u FROM UserActivity u WHERE u.email = :email ORDER BY u.activityTimestamp DESC")
    List<UserActivity> findActivitiesByEmail(@Param("email") String email);

    @Query("SELECT u FROM UserActivity u ORDER BY u.activityTimestamp DESC LIMIT 10")
    List<UserActivity> findLatestActivities();

//     @Query("SELECT u.activityType, COUNT(u) as count " +
//            "FROM UserActivity u " +
//            "WHERE DATE(u.activityTimestamp) = :date " +
//            "AND u.activityType LIKE 'FILE_UPLOAD_SUCCESS_%' " +
//            "GROUP BY u.activityType")
//     List<Object[]> findPlatformCountsByDate(@Param("date") LocalDate date);
// }

@Query("SELECT u.activityType, COUNT(u) as count " +
       "FROM UserActivity u " +
       "WHERE CAST(u.activityTimestamp AS DATE) = :date " +
       "AND (u.activityType LIKE 'FILE_UPLOAD_SUCCESS_[A-Za-z0-9][A-Za-z0-9]%_SUCCESS' OR u.activityType LIKE 'FILE_UPLOAD_[A-Za-z0-9][A-Za-z0-9]%_SUCCESS') " +
       "GROUP BY u.activityType")
List<Object[]> findPlatformCountsByDate(@Param("date") LocalDate date);
}