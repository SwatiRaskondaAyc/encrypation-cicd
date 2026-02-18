package com.example.prog.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "zoho_users")
public class ZohoUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "auth_provider")
    private String authProvider;

    @Column(name = "auth_token")
    private String authToken;

    @Column(name = "date_of_joining")
    private LocalDateTime dateOfJoining;

    @Column(name = "date_of_permanent")
    private LocalDateTime dateOfPermanent;

    @Column(name = "mail_id")
    private String mailId;

    @Column(name = "emp_id")
    private String empId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "job_position")
    private String jobPosition;

    @Column(name = "last_login_date")
    private LocalDateTime lastLoginDate;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "role")
    private String role;

    @Column(name = "status")
    private String status;

    @Column(name = "permission")
    private String permission;

    @Column(name = "token_expiry")
    private LocalDateTime tokenExpiry;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "password")
    private String password;

    @Column(name = "zoho_access_token")
    private String zohoAccessToken;

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "account_id")
    private String accountId;

    public ZohoUser() {
    }

    public ZohoUser(Long id, String authProvider, String authToken, LocalDateTime dateOfJoining,
                    LocalDateTime dateOfPermanent, String mailId, String empId, String firstName, String jobPosition,
                    LocalDateTime lastLoginDate, String lastName, String phone, String role, String status,
                    String permission, LocalDateTime tokenExpiry, LocalDateTime updatedAt, String userName,
                    String password, String zohoAccessToken, String refreshToken, String accountId) {
        this.id = id;
        this.authProvider = authProvider;
        this.authToken = authToken;
        this.dateOfJoining = dateOfJoining;
        this.dateOfPermanent = dateOfPermanent;
        this.mailId = mailId;
        this.empId = empId;
        this.firstName = firstName;
        this.jobPosition = jobPosition;
        this.lastLoginDate = lastLoginDate;
        this.lastName = lastName;
        this.phone = phone;
        this.role = role;
        this.status = status;
        this.permission = permission;
        this.tokenExpiry = tokenExpiry;
        this.updatedAt = updatedAt;
        this.userName = userName;
        this.password = password;
        this.zohoAccessToken = zohoAccessToken;
        this.refreshToken = refreshToken;
        this.accountId = accountId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAuthProvider() {
        return authProvider;
    }

    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
    }

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    public LocalDateTime getDateOfJoining() {
        return dateOfJoining;
    }

    public void setDateOfJoining(LocalDateTime dateOfJoining) {
        this.dateOfJoining = dateOfJoining;
    }

    public LocalDateTime getDateOfPermanent() {
        return dateOfPermanent;
    }

    public void setDateOfPermanent(LocalDateTime dateOfPermanent) {
        this.dateOfPermanent = dateOfPermanent;
    }

    public String getMailId() {
        return mailId;
    }

    public void setMailId(String mailId) {
        this.mailId = mailId;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getJobPosition() {
        return jobPosition;
    }

    public void setJobPosition(String jobPosition) {
        this.jobPosition = jobPosition;
    }

    public LocalDateTime getLastLoginDate() {
        return lastLoginDate;
    }

    public void setLastLoginDate(LocalDateTime lastLoginDate) {
        this.lastLoginDate = lastLoginDate;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public LocalDateTime getTokenExpiry() {
        return tokenExpiry;
    }

    public void setTokenExpiry(LocalDateTime tokenExpiry) {
        this.tokenExpiry = tokenExpiry;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getZohoAccessToken() {
        return zohoAccessToken;
    }

    public void setZohoAccessToken(String zohoAccessToken) {
        this.zohoAccessToken = zohoAccessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    @Override
    public String toString() {
        return "ZohoUser [id=" + id + ", authProvider=" + authProvider + ", authToken=" + authToken
                + ", dateOfJoining=" + dateOfJoining + ", dateOfPermanent=" + dateOfPermanent + ", mailId=" + mailId
                + ", empId=" + empId + ", firstName=" + firstName + ", jobPosition=" + jobPosition + ", lastLoginDate="
                + lastLoginDate + ", lastName=" + lastName + ", phone=" + phone + ", role=" + role + ", status="
                + status + ", permission=" + permission + ", tokenExpiry=" + tokenExpiry + ", updatedAt=" + updatedAt
                + ", userName=" + userName + ", password=" + password + ", zohoAccessToken=" + zohoAccessToken
                + ", refreshToken=" + refreshToken + ", accountId=" + accountId + "]";
    }
}