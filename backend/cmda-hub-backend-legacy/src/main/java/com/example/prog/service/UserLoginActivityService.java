
package com.example.prog.service;

import com.example.prog.entity.UserDtls;
import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.UserLoginActivity;
import com.example.prog.repository.UserLoginActivityRepository;
import com.example.prog.dto.LoginLogRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserLoginActivityService {

    @Autowired
    private UserLoginActivityRepository loginActivityRepository;

    @Autowired
    private ManagementConsoleLogService externalLogService;

    @PersistenceContext
    private EntityManager entityManager;

    // Method for UserDtls (Individual users)
    public UserLoginActivity recordLogin(UserDtls user, String ipAddress, String userAgent) {
        long start = System.currentTimeMillis();
        UserLoginActivity session = null;
        
        // Dynamically determine userType from role (Phase 2 Harmonization)
        // If role is ROLE_CORPORATE, we must record it as CORPORATE even in UserDtls table
        String userType = (user.getRole() != null && user.getRole().contains("CORPORATE")) ? "CORPORATE" : "INDIVIDUAL";
        
        try {
            session = recordLoginTransactional(
                user.getUserID(), 
                userType, 
                user.getEmail(), 
                user.getFullname(), 
                ipAddress, 
                userAgent
            );
            System.out.println("PERF: recordLogin DB operation took " + (System.currentTimeMillis() - start) + "ms for " + userType);
        } catch (Exception e) {
            System.err.println("CRITICAL: Failed to record login activity: " + e.getMessage());
        }

        // Record to Management Console (Async - STRICTLY OUTSIDE transactional block)
        if (session != null) {
            dispatchExternalLog(user.getUserID(), userType, user.getEmail(), user.getFullname(), ipAddress, userAgent, "LOGIN");
        }
        
        System.out.println("PERF: recordLogin TOTAL took " + (System.currentTimeMillis() - start) + "ms");
        return session;
    }

    // Method for CorporateUser (Corporate users)
    public UserLoginActivity recordLogin(CorporateUser user, String ipAddress, String userAgent) {
        long start = System.currentTimeMillis();
        UserLoginActivity session = null;
        try {
            session = recordLoginTransactional(
                user.getId(), 
                "CORPORATE", 
                user.getEmail(), 
                user.getEmployeeName(), 
                ipAddress, 
                userAgent
            );
            System.out.println("PERF: recordLogin DB operation took " + (System.currentTimeMillis() - start) + "ms for CORPORATE");
        } catch (Exception e) {
            System.err.println("CRITICAL: Failed to record login activity: " + e.getMessage());
        }

        // Record to Management Console (Async - STRICTLY OUTSIDE transactional block)
        if (session != null) {
            dispatchExternalLog(user.getId(), "CORPORATE", user.getEmail(), user.getEmployeeName(), ipAddress, userAgent, "LOGIN");
        }

        System.out.println("PERF: recordLogin TOTAL took " + (System.currentTimeMillis() - start) + "ms");
        return session;
    }

    // Common transactional method for DB operations
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public UserLoginActivity recordLoginTransactional(int userId, String userType, String userEmail, 
                                                       String userName, String ipAddress, String userAgent) {
        // Close ALL existing active sessions (safety measure) using direct update
        loginActivityRepository.closeActiveSessions(userId, userType);

        // Create new login activity
        UserLoginActivity loginActivity = new UserLoginActivity(
            userId, userType, userEmail, userName, LocalDateTime.now(), ipAddress, userAgent
        );

        UserLoginActivity savedSession = loginActivityRepository.save(loginActivity);
        entityManager.flush(); // Force immediate write
        return savedSession;
    }

    private void dispatchExternalLog(int userId, String userType, String userEmail, String userName, 
                                    String ipAddress, String userAgent, String activityType) {
        long start = System.currentTimeMillis();
        try {
            LoginLogRequest externalRequest = new LoginLogRequest(
                userId, userType, userEmail, userName, ipAddress, userAgent, activityType
            );
            if ("LOGIN".equals(activityType)) {
                externalLogService.recordExternalLogin(externalRequest);
            } else {
                externalLogService.recordExternalLogout(externalRequest);
            }
            System.out.println("PERF: External log dispatch took " + (System.currentTimeMillis() - start) + "ms");
        } catch (Exception e) {
            System.err.println("Error calling external log service: " + e.getMessage());
        }
    }

    public void recordLogout(int userId, String userType) {
        long start = System.currentTimeMillis();
        System.out.println("DEBUG: recordLogout started for userId=" + userId + ", userType=" + userType);
        
        try {
            int updatedRows = recordLogoutTransactional(userId, userType);
            System.out.println("PERF: Logout DB update took " + (System.currentTimeMillis() - start) + "ms, rows=" + updatedRows);
        } catch (Exception e) {
            System.err.println("CRITICAL: Failed to record logout: " + e.getMessage());
        }
        
        // Record to Management Console (Async) - OUTSIDE transaction
        dispatchExternalLog(userId, userType, "N/A", "N/A", "0.0.0.0", "N/A", "LOGOUT");
        
        System.out.println("PERF: recordLogout TOTAL took " + (System.currentTimeMillis() - start) + "ms");
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public int recordLogoutTransactional(int userId, String userType) {
        int updatedRows = loginActivityRepository.closeActiveSessions(userId, userType);
        entityManager.flush(); // Force immediate write
        return updatedRows;
    }

    public void recordLogout(int userId) {
        long start = System.currentTimeMillis();
        int updatedRows = recordLogoutAllTransactional(userId);
        System.out.println("PERF: LogoutAll DB update took " + (System.currentTimeMillis() - start) + "ms, rows=" + updatedRows);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public int recordLogoutAllTransactional(int userId) {
        int updatedRows = loginActivityRepository.closeAllActiveSessionsByUserId(userId);
        entityManager.flush(); // Force immediate write
        return updatedRows;
    }


    // EXISTING: Method with both parameters
    public List<UserLoginActivity> getUserLoginHistory(int userId, String userType) {
        return loginActivityRepository.findByUserIdAndUserTypeOrderByLoginAtDesc(userId, userType);
    }

    // NEW: Overloaded method for controller (userId only)
    public List<UserLoginActivity> getUserLoginHistory(int userId) {
        return loginActivityRepository.findByUserIdOrderByLoginAtDesc(userId);
    }

    public List<UserLoginActivity> getActiveSessions() {
        return loginActivityRepository.findByLogoutAtIsNull();
    }

    public List<UserLoginActivity> getAllLoginActivities() {
        return loginActivityRepository.findAll();
    }

    public Optional<UserLoginActivity> getCurrentSession(int userId, String userType) {
        List<UserLoginActivity> sessions = loginActivityRepository.findByUserIdAndUserTypeAndLogoutAtIsNull(userId, userType);
        return sessions.stream()
            .sorted((a, b) -> b.getLoginAt().compareTo(a.getLoginAt()))
            .findFirst();
    }

    // EXISTING: Method with both parameters
    public Optional<UserLoginActivity> getLastLoginActivity(int userId, String userType) {
        return loginActivityRepository.findTopByUserIdAndUserTypeOrderByLoginAtDesc(userId, userType);
    }

    // NEW: Overloaded method for controller (userId only)
    public Optional<UserLoginActivity> getLastLoginActivity(int userId) {
        return loginActivityRepository.findTopByUserIdOrderByLoginAtDesc(userId);
    }
}