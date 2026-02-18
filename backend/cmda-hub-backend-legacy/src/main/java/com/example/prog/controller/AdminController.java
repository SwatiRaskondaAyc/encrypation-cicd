

// package com.example.prog.controller;

// import com.example.prog.entity.CorporateUser;
// import com.example.prog.service.AdminService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/Admin")
// public class AdminController {

//     @Autowired
//     private AdminService corporateUserService;

//     @Value("${corporate.max.employees}")
//     private int maxEmployees; 

//     // Add Corporate User (with updated logic)
//     @PostMapping("/addCorporateUser")
//     public ResponseEntity<String> addCorporateUser(@RequestBody CorporateUser corporateUser, @RequestHeader("role") String role) {
//         if (!role.equals("Admin")) {
//             return ResponseEntity.status(403).body("Only Admin can add corporate users.");
//         }

//         // Password validation
//         if (corporateUser.getPassword().length() < 8) {
//             return ResponseEntity.badRequest().body("Password must be at least 8 characters long.");
//         }

//         corporateUser.setStatus(1); // Set new user as active

//         // Count only active employees (status = 1)
//         List<CorporateUser> activeEmployees = corporateUserService.getActiveCorporateUsers();
//         int activeEmployeeCount = activeEmployees.size();

//         // Check if Admin can add more users
//         if (activeEmployeeCount >= maxEmployees) {
//             return ResponseEntity.badRequest().body("Cannot add more than " + maxEmployees + " active employees.");
//         }

//         // Save new employee
//         corporateUserService.saveCorporateUser(corporateUser);
//         return ResponseEntity.ok("Corporate user added successfully.");
//     }

//     // Deactivate (soft delete) a corporate user
//     @DeleteMapping("/deleteCorporateUserByEmail/{email}")
//     public ResponseEntity<String> deleteCorporateUserByEmail(@PathVariable String email, @RequestHeader("role") String role) {
//         if (!role.equals("Admin")) {
//             return ResponseEntity.status(403).body("Only Admin can delete corporate users.");
//         }

//         // Check if user exists
//         CorporateUser user = corporateUserService.getCorporateUserByEmail(email);
//         if (user == null) {
//             return ResponseEntity.badRequest().body("No corporate user found with the given email.");
//         }

//         // Update status to 0 (Inactive)
//         user.setStatus(0);
//         corporateUserService.saveCorporateUser(user); // Save updated user

//         return ResponseEntity.ok("Corporate user deactivated. Admin can now add one more user.");
//     }

//     // Get all active corporate users
//     @GetMapping("/getAllCorporateUsers")
//     public ResponseEntity<List<CorporateUser>> getAllCorporateUsers(@RequestHeader("role") String role) {
//         if (!role.equals("Admin")) {
//             return ResponseEntity.status(403).body(null);
//         }

//         List<CorporateUser> activeUsers = corporateUserService.getActiveCorporateUsers();
//         return ResponseEntity.ok(activeUsers);
//     }
// }


package com.example.prog.controller;

import com.example.prog.entity.CorporateUser;
import com.example.prog.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/Admin")
public class AdminController {

    @Autowired
    private AdminService corporateUserService;

    @Value("${corporate.max.employees}")
    private int maxEmployees;

    // Add Corporate User (with updated logic)
    // @PostMapping("/addCorporateUser")
    // public ResponseEntity<String> addCorporateUser(
    //         @RequestBody CorporateUser corporateUser,
    //         @RequestHeader("role") String role,
    //         @RequestHeader("email") String adminEmail) {
    //     if (!role.equals("Admin")) {
    //         return ResponseEntity.status(403).body("Only Admin can add corporate users.");
    //     }

    //     // Password validation
    //     if (corporateUser.getPassword() == null || corporateUser.getPassword().length() < 8) {
    //         return ResponseEntity.badRequest().body("Password must be at least 8 characters long.");
    //     }

    //     // Fetch the admin's details to get their adminId
    //     CorporateUser admin = corporateUserService.getCorporateUserByEmail(adminEmail);
    //     if (admin == null) {
    //         return ResponseEntity.badRequest().body("Admin not found with email: " + adminEmail);
    //     }

    //     // Set the same adminId as the admin for the new user
    //     corporateUser.setAdminId(admin.getAdminId());
    //     corporateUser.setStatus(1); // Set new user as active

    //     // Count only active employees with the same adminId
    //     List<CorporateUser> activeEmployees = corporateUserService.getActiveCorporateUsersByAdminId(admin.getAdminId());
    //     int activeEmployeeCount = activeEmployees.size();

    //     // Check if Admin can add more users
    //     if (activeEmployeeCount >= maxEmployees) {
    //         return ResponseEntity.badRequest().body("Cannot add more than " + maxEmployees + " active employees.");
    //     }

    //     // Save new employee
    //     corporateUserService.saveCorporateUser(corporateUser);
    //     return ResponseEntity.ok("Corporate user added successfully with Admin ID: " + corporateUser.getAdminId());
    // }

//  @PostMapping("/addCorporateUser")
//     public ResponseEntity<String> addCorporateUser(
//             @RequestBody CorporateUser corporateUser,
//             @RequestHeader("role") String role,
//             @RequestHeader("email") String adminEmail) {
//         if (!"Admin".equalsIgnoreCase(role)) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only Admin can add corporate users.");
//         }

//         // Password validation
//         if (corporateUser.getPassword() == null || corporateUser.getPassword().length() < 8) {
//             return ResponseEntity.badRequest().body("Password must be at least 8 characters long.");
//         }

//         // Fetch the admin's details to get their adminId
//         CorporateUser Admin = corporateUserService.getCorporateUserByEmail(adminEmail);
//         if (Admin == null) {
//             return ResponseEntity.badRequest().body("Admin not found with email: " + adminEmail);
//         }

//         // Ensure admin has role "admin"
//         if (!"Admin".equalsIgnoreCase(Admin.getRole())) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only users with role 'admin' can add corporate users.");
//         }

//         // Count active employees with the same adminId, excluding the admin
//         long activeEmployeeCount = corporateUserService.countActiveUsersByAdminIdAndRole(Admin.getAdminId(), "user", adminEmail);
//         if (activeEmployeeCount >= maxEmployees) {
//             return ResponseEntity.badRequest().body("Cannot add more than " + maxEmployees + " active employees.");
//         }

//         // Set fields for the new user
//         corporateUser.setAdminId(Admin.getAdminId());
//         corporateUser.setStatus(1); // Active
//         corporateUser.setRole("user"); // Set role to user

//         // Save new employee
//         corporateUserService.saveCorporateUser(corporateUser);
//         return ResponseEntity.ok("Corporate user added successfully with Admin ID: " + corporateUser.getAdminId());
//     }


 @PostMapping("/addCorporateUser")
    public ResponseEntity<String> addCorporateUser(
            @RequestBody CorporateUser corporateUser,
            @RequestHeader("role") String role,
            @RequestHeader("email") String adminEmail) {
        if (!"Admin".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only Admin can add corporate users.");
        }

        // Password validation
        if (corporateUser.getPassword() == null || corporateUser.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters long.");
        }

        // Fetch the admin's details to get their adminId
        CorporateUser admin = corporateUserService.getCorporateUserByEmail(adminEmail);
        if (admin == null) {
            return ResponseEntity.badRequest().body("Admin not found with email: " + adminEmail);
        }

        // Ensure admin has role "admin"
        if (!"admin".equalsIgnoreCase(admin.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only users with role 'admin' can add corporate users.");
        }

        // Check if user already exists
        CorporateUser existingUser = corporateUserService.getCorporateUserByEmail(corporateUser.getEmail());
        if (existingUser != null) {
            // Check if user has the same adminId and is inactive
            if (!existingUser.getAdminId().equals(admin.getAdminId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cannot reactivate user with different Admin ID.");
            }
            if (existingUser.getStatus() == 1) {
                return ResponseEntity.badRequest().body("User is already active with email: " + corporateUser.getEmail());
            }

            // Count active employees (excluding admin) to check limit
            long activeEmployeeCount = corporateUserService.countActiveUsersByAdminIdAndRole(admin.getAdminId(), "user", adminEmail);
            if (activeEmployeeCount >= maxEmployees) {
                return ResponseEntity.badRequest().body("Cannot reactivate user: maximum of " + maxEmployees + " active employees reached.");
            }

            // Reactivate existing user
            if (corporateUser.getPassword() != null && !corporateUser.getPassword().isEmpty()) {
                existingUser.setPassword(corporateUser.getPassword()); // Will be hashed in saveCorporateUser
            }
            if (corporateUser.getEmployeeName() != null && !corporateUser.getEmployeeName().isEmpty()) {
                existingUser.setEmployeeName(corporateUser.getEmployeeName());
            }
            if (corporateUser.getMobileNum() != null && !corporateUser.getMobileNum().isEmpty()) {
                existingUser.setMobileNum(corporateUser.getMobileNum());
            }
            if (corporateUser.getCompanyName() != null && !corporateUser.getCompanyName().isEmpty()) {
                existingUser.setCompanyName(corporateUser.getCompanyName());
            }
            if (corporateUser.getJobTitle() != null && !corporateUser.getJobTitle().isEmpty()) {
                existingUser.setJobTitle(corporateUser.getJobTitle());
            }
            if (corporateUser.getUserType() != null && !corporateUser.getUserType().isEmpty()) {
                existingUser.setUserType(corporateUser.getUserType());
            }
            existingUser.setStatus(1); // Reactivate user
            // Keep existing adminId and role
            corporateUserService.saveCorporateUser(existingUser);
            return ResponseEntity.ok("Corporate user reactivated successfully with Admin ID: " + existingUser.getAdminId());
        }

        // Count active employees with the same adminId, excluding the admin
        long activeEmployeeCount = corporateUserService.countActiveUsersByAdminIdAndRole(admin.getAdminId(), "user", adminEmail);
        if (activeEmployeeCount >= maxEmployees) {
            return ResponseEntity.badRequest().body("Cannot add more than " + maxEmployees + " active employees.");
        }

        // Set fields for the new user
        corporateUser.setAdminId(admin.getAdminId());
        corporateUser.setStatus(1); // Active
        corporateUser.setRole("user"); // Set role to user

        // Save new employee
        corporateUserService.saveCorporateUser(corporateUser);
        return ResponseEntity.ok("Corporate user added successfully with Admin ID: " + corporateUser.getAdminId());
    }

    // Deactivate (soft delete) a corporate user
    @DeleteMapping("/deleteCorporateUserByEmail/{email}")
    public ResponseEntity<String> deleteCorporateUserByEmail(
            @PathVariable String email,
            @RequestHeader("role") String role,
            @RequestHeader("email") String adminEmail) {
        if (!role.equals("Admin")) {
            return ResponseEntity.status(403).body("Only Admin can delete corporate users.");
        }

        // Fetch the admin's details to get their adminId
        CorporateUser admin = corporateUserService.getCorporateUserByEmail(adminEmail);
        if (admin == null) {
            return ResponseEntity.badRequest().body("Admin not found with email: " + adminEmail);
        }

        // Check if user exists and has the same adminId
        CorporateUser user = corporateUserService.getCorporateUserByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("No corporate user found with the given email.");
        }
        if (!user.getAdminId().equals(admin.getAdminId())) {
            return ResponseEntity.status(403).body("Cannot delete user with different Admin ID.");
        }

        // Update status to 0 (Inactive)
        user.setStatus(0);
        corporateUserService.saveCorporateUser(user); // Save updated user

        return ResponseEntity.ok("Corporate user deactivated. Admin can now add one more user.");
    }

    // Get all active corporate users with the same adminId
 @GetMapping("/getAllCorporateUsers")
    public ResponseEntity<List<CorporateUser>> getAllCorporateUsers(
            @RequestHeader("role") String role,
            @RequestHeader("email") String adminEmail) {
        if (!role.equals("Admin")) {
            return ResponseEntity.status(403).body(null);
        }

        // Fetch the admin's details to get their adminId
        CorporateUser admin = corporateUserService.getCorporateUserByEmail(adminEmail);
        if (admin == null) {
            return ResponseEntity.status(404).body(null);
        }

        // Fetch only active users with role "user" and same adminId, excluding the admin
        List<CorporateUser> activeUsers = corporateUserService.getActiveCorporateUsersByAdminIdAndRole(
                admin.getAdminId(), "user", adminEmail);
        return ResponseEntity.ok(activeUsers);
    }
}