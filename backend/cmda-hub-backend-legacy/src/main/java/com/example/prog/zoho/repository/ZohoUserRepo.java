package com.example.prog.zoho.repository;

import com.example.prog.entity.ZohoUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ZohoUserRepo extends JpaRepository<ZohoUser, Long> {

    // Existing query methods
    ZohoUser findByUserName(String userName);
    ZohoUser findByEmpId(String empId);
    boolean existsByMailId(String mailId);
    ZohoUser findByMailId(String mailId);

    // New query methods
    // Find employees by permission (e.g., GRANTED, REVOKED)
    List<ZohoUser> findByPermission(String permission);

    // Find employees by role (e.g., HR, EMPLOYEE)
    List<ZohoUser> findByRole(String role);

    // Find employees by job position
    List<ZohoUser> findByJobPosition(String jobPosition);

    // Find employees by status (e.g., ACTIVE, INACTIVE)
    List<ZohoUser> findByStatus(String status);

    // Find employees who joined within a date range
    List<ZohoUser> findByDateOfJoiningBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Find employees with last login after a specific date
    List<ZohoUser> findByLastLoginDateAfter(LocalDateTime date);

    // Find employees by partial name match (case-insensitive)
    @Query("SELECT u FROM ZohoUser u WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<ZohoUser> findByNameContainingIgnoreCase(@Param("name") String name);

    // Find employees by permission and role combination
    List<ZohoUser> findByPermissionAndRole(String permission, String role);

    // Find employees with expired tokens
    @Query("SELECT u FROM ZohoUser u WHERE u.tokenExpiry < :currentDate")
    List<ZohoUser> findByTokenExpiryBefore(@Param("currentDate") LocalDateTime currentDate);

    // Count employees by permission
    @Query("SELECT COUNT(u) FROM ZohoUser u WHERE u.permission = :permission")
    long countByPermission(@Param("permission") String permission);

    // Count active employees
    @Query("SELECT COUNT(u) FROM ZohoUser u WHERE u.status = 'ACTIVE'")
    long countActiveEmployees();

    // Find employees by account ID
    List<ZohoUser> findByAccountId(String accountId);

    // Check if a phone number exists
    boolean existsByPhone(String phone);
}