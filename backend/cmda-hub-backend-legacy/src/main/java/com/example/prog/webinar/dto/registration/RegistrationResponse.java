//package com.cmdahub.cmda_management_console.webinar.dto.registration;
//
//import lombok.Data;
//
//import java.time.LocalDateTime;
//
//import com.cmdahub.cmda_management_console.webinar.dto.common.UserSummaryDTO;
//import com.cmdahub.cmda_management_console.webinar.dto.webinar.WebinarListItemResponse;
//
//@Data
//public class RegistrationResponse {
//
//    private Long registrationId;
//    private LocalDateTime registeredAt;
//
//    private String email;
//    private String phone;
//
//
//    private WebinarListItemResponse webinar;
//    private UserSummaryDTO user;
//
//    public Long getRegistrationId() {
//        return registrationId;
//    }
//
//    public void setRegistrationId(Long registrationId) {
//        this.registrationId = registrationId;
//    }
//
//    public LocalDateTime getRegisteredAt() {
//        return registeredAt;
//    }
//
//    public void setRegisteredAt(LocalDateTime registeredAt) {
//        this.registeredAt = registeredAt;
//    }
//
//    public WebinarListItemResponse getWebinar() {
//        return webinar;
//    }
//
//    public void setWebinar(WebinarListItemResponse webinar) {
//        this.webinar = webinar;
//    }
//
//    public UserSummaryDTO getUser() {
//        return user;
//    }
//
//    public void setUser(UserSummaryDTO user) {
//        this.user = user;
//    }
//
//
//}

package com.example.prog.webinar.dto.registration;

import com.example.prog.webinar.dto.common.UserSummaryDTO;
import com.example.prog.webinar.dto.webinar.WebinarListItemResponse;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;



@Data
public class RegistrationResponse {

    private Long registrationId;
    private LocalDateTime registeredAt;
    private String paymentReferenceId;
    private BigDecimal amountPaid;
    private WebinarListItemResponse webinar;
    private UserSummaryDTO user;
    private String status;


    // -------- GETTERS & SETTERS --------

    public Long getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(Long registrationId) {
        this.registrationId = registrationId;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }



    public WebinarListItemResponse getWebinar() {
        return webinar;
    }

    public void setWebinar(WebinarListItemResponse webinar) {
        this.webinar = webinar;
    }

    public UserSummaryDTO getUser() {
        return user;
    }

    public void setUser(UserSummaryDTO user) {
        this.user = user;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
