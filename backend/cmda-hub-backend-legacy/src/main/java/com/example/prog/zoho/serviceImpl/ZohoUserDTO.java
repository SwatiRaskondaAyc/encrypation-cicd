package com.example.prog.zoho.serviceImpl;

import java.time.LocalDateTime;

public class ZohoUserDTO {
    private Long id;
    private String empId;
    private String firstName;
    private String lastName;
    private String mailId;
    private String jobPosition;
    private String role;
    private String permission;
    private LocalDateTime dateOfJoining;
    private LocalDateTime lastLoginDate;

    public ZohoUserDTO() {}

    public ZohoUserDTO(Long id, String empId, String firstName, String lastName, String mailId,
                       String jobPosition, String role, String permission, LocalDateTime dateOfJoining,
                       LocalDateTime lastLoginDate) {
        this.id = id;
        this.empId = empId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mailId = mailId;
        this.jobPosition = jobPosition;
        this.role = role;
        this.permission = permission;
        this.dateOfJoining = dateOfJoining;
        this.lastLoginDate = lastLoginDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getMailId() { return mailId; }
    public void setMailId(String mailId) { this.mailId = mailId; }
    public String getJobPosition() { return jobPosition; }
    public void setJobPosition(String jobPosition) { this.jobPosition = jobPosition; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getPermission() { return permission; }
    public void setPermission(String permission) { this.permission = permission; }
    public LocalDateTime getDateOfJoining() { return dateOfJoining; }
    public void setDateOfJoining(LocalDateTime dateOfJoining) { this.dateOfJoining = dateOfJoining; }
    public LocalDateTime getLastLoginDate() { return lastLoginDate; }
    public void setLastLoginDate(LocalDateTime lastLoginDate) { this.lastLoginDate = lastLoginDate; }
}