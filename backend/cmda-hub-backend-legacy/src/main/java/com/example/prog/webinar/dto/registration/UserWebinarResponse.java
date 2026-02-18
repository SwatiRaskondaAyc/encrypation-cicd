//package com.cmdahub.cmda_management_console.webinar.dto.registration;
//
//import lombok.Data;
//
//import java.time.LocalDateTime;
//
//@Data
//public class UserWebinarResponse {
//
//    private Long webinarId;
//    private String webinarTitle;
//    private LocalDateTime startDateTime;
//    private String hostName;
//    private String joinLink;  // Only visible to registered user
//
//    public Long getWebinarId() {
//        return webinarId;
//    }
//
//    public void setWebinarId(Long webinarId) {
//        this.webinarId = webinarId;
//    }
//
//    public String getWebinarTitle() {
//        return webinarTitle;
//    }
//
//    public void setWebinarTitle(String webinarTitle) {
//        this.webinarTitle = webinarTitle;
//    }
//
//    public LocalDateTime getStartDateTime() {
//        return startDateTime;
//    }
//
//    public void setStartDateTime(LocalDateTime startDateTime) {
//        this.startDateTime = startDateTime;
//    }
//
//    public String getHostName() {
//        return hostName;
//    }
//
//    public void setHostName(String hostName) {
//        this.hostName = hostName;
//    }
//
//    public String getJoinLink() {
//        return joinLink;
//    }
//
//    public void setJoinLink(String joinLink) {
//        this.joinLink = joinLink;
//    }
//
//
//    public void setEmail(String email) {
//    }
//
//    public void setPhone(String phone) {
//    }
//}

//package com.example.prog.webinar.dto.registration;
//
//import lombok.Data;
//import java.time.LocalDateTime;
//
//@Data
//public class UserWebinarResponse {
//
//    private Long webinarId;
//    private String webinarTitle;
//    private LocalDateTime startDateTime;
//    private String hostName;
//    private String joinLink;  // Only visible to registered user
//
//    // -------- GETTERS & SETTERS --------
//
//    public Long getWebinarId() {
//        return webinarId;
//    }
//
//    public void setWebinarId(Long webinarId) {
//        this.webinarId = webinarId;
//    }
//
//    public String getWebinarTitle() {
//        return webinarTitle;
//    }
//
//    public void setWebinarTitle(String webinarTitle) {
//        this.webinarTitle = webinarTitle;
//    }
//
//    public LocalDateTime getStartDateTime() {
//        return startDateTime;
//    }
//
//    public void setStartDateTime(LocalDateTime startDateTime) {
//        this.startDateTime = startDateTime;
//    }
//
//    public String getHostName() {
//        return hostName;
//    }
//
//    public void setHostName(String hostName) {
//        this.hostName = hostName;
//    }
//
//    public String getJoinLink() {
//        return joinLink;
//    }
//
//    public void setJoinLink(String joinLink) {
//        this.joinLink = joinLink;
//    }
//}

package com.example.prog.webinar.dto.registration;

import com.example.prog.webinar.dto.hosts.HostResponse;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserWebinarResponse {

    private Long webinarId;
    private String webinarTitle;
    private String description;
    private LocalDateTime startDateTime;
    private HostResponse host;   // ✅ replaced hostName with full host object
    private List<String> agenda;   // ✅ ADD THIS
    private String status;
    private String joinLink;     // Only visible to registered user

    // -------- GETTERS & SETTERS --------

    public Long getWebinarId() {
        return webinarId;
    }

    public void setWebinarId(Long webinarId) {
        this.webinarId = webinarId;
    }

    public String getWebinarTitle() {
        return webinarTitle;
    }

    public void setWebinarTitle(String webinarTitle) {
        this.webinarTitle = webinarTitle;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public HostResponse getHost() {
        return host;
    }

    public void setHost(HostResponse host) {
        this.host = host;
    }

    public String getJoinLink() {
        return joinLink;
    }

    public void setJoinLink(String joinLink) {
        this.joinLink = joinLink;
    }

    public List<String> getAgenda() {     // ✅ ADD
        return agenda;
    }

    public void setAgenda(List<String> agenda) {   // ✅ ADD
        this.agenda = agenda;
    }
    public String getDescription() {          // ✅ ADD
        return description;
    }

    public void setDescription(String description) {  // ✅ ADD
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
