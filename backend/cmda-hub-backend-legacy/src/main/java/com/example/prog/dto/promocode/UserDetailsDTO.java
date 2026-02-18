//package com.example.prog.dto.promocode;
//
//public class UserDetailsDTO {
//    private int userId;
//    private String email;
//    private String userType;
//
//    // Constructor
//    public UserDetailsDTO(int userId, String email, String userType) {
//        this.userId = userId;
//        this.email = email;
//        this.userType = userType;
//    }
//
//    // Getters and setters
//    public int getUserId() { return userId; }
//    public void setUserId(int userId) { this.userId = userId; }
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//    public String getUserType() { return userType; }
//    public void setUserType(String userType) { this.userType = userType; }
//}


package com.example.prog.dto.promocode;

import java.time.LocalDate;

public class UserDetailsDTO {
    private int userId;
    private String email;
    private String userType;
    private String promoCode;
    private LocalDate regDate;
    private LocalDate toDate;

    public UserDetailsDTO(int userId, String email, String userType) {
        this.userId = userId;
        this.email = email;
        this.userType = userType;
    }

    public UserDetailsDTO(int userId, String email, String userType, String promoCode, LocalDate regDate, LocalDate toDate) {
        this.userId = userId;
        this.email = email;
        this.userType = userType;
        this.promoCode = promoCode;
        this.regDate = regDate;
        this.toDate = toDate;
    }

    // Getters and Setters
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }

    public LocalDate getRegDate() {
        return regDate;
    }

    public void setRegDate(LocalDate regDate) {
        this.regDate = regDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }
}