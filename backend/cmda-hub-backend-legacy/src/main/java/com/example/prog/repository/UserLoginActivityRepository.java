package com.example.prog.repository;

import com.example.prog.entity.UserLoginActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserLoginActivityRepository extends JpaRepository<UserLoginActivity, Long> {

    // Existing methods
    List<UserLoginActivity> findByUserIdAndUserTypeAndLogoutAtIsNull(int userId, String userType);
    List<UserLoginActivity> findByUserIdAndUserTypeOrderByLoginAtDesc(int userId, String userType);
    List<UserLoginActivity> findByUserIdAndUserTypeAndLoginAtBetweenOrderByLoginAtDesc(
            int userId, String userType, LocalDateTime start, LocalDateTime end);
    List<UserLoginActivity> findByLogoutAtIsNull();
    Optional<UserLoginActivity> findTopByUserIdAndUserTypeOrderByLoginAtDesc(int userId, String userType);

    @Query("SELECT COUNT(a) FROM UserLoginActivity a WHERE a.userId = :userId AND a.userType = :userType AND a.loginStatus = 'SUCCESS'")
    Long countSuccessfulLoginsByUser(@Param("userId") int userId, @Param("userType") String userType);

    // Get activities by userId only
    List<UserLoginActivity> findByUserIdOrderByLoginAtDesc(int userId);
    
    // Get last activity by userId only
    Optional<UserLoginActivity> findTopByUserIdOrderByLoginAtDesc(int userId);

    List<UserLoginActivity> findByUserIdAndLogoutAtIsNull(int userId);

    // Modifying queries for immediate persistence using native SQL for precision (SQL Server syntax)
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "UPDATE user_login_activity SET logout_at = GETDATE(), session_duration_seconds = DATEDIFF(SECOND, login_at, GETDATE()) WHERE user_id = :userId AND user_type = :userType AND logout_at IS NULL", nativeQuery = true)
    int closeActiveSessions(@Param("userId") int userId, @Param("userType") String userType);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "UPDATE user_login_activity SET logout_at = GETDATE(), session_duration_seconds = DATEDIFF(SECOND, login_at, GETDATE()) WHERE user_id = :userId AND logout_at IS NULL", nativeQuery = true)
    int closeAllActiveSessionsByUserId(@Param("userId") int userId);
}