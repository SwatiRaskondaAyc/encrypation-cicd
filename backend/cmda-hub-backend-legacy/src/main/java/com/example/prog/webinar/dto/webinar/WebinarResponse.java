//package com.cmdahub.cmda_management_console.webinar.dto.webinar;
//
//
//import lombok.Data;
//
//import java.time.LocalDateTime;
//
//import com.cmdahub.cmda_management_console.webinar.dto.hosts.HostResponse;
//
//@Data
//public class WebinarResponse {
//
//    private Long id;
//    private String title;
//    private String description;
//    private String agenda;
//    private LocalDateTime startDateTime;
//    private int durationMinutes;
//    private boolean featured;
//    private String webinarLink;
//    private String thumbnailUrl;
//    private String thumbnail;
//
//
//    private HostResponse host; // nested response
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getTitle() {
//        return title;
//    }
//
//    public void setTitle(String title) {
//        this.title = title;
//    }
//
//    public String getDescription() {
//        return description;
//    }
//
//    public void setDescription(String description) {
//        this.description = description;
//    }
//
//    public String getAgenda() {
//        return agenda;
//    }
//
//    public void setAgenda(String agenda) {
//        this.agenda = agenda;
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
//    public int getDurationMinutes() {
//        return durationMinutes;
//    }
//
//    public void setDurationMinutes(int durationMinutes) {
//        this.durationMinutes = durationMinutes;
//    }
//
//    public boolean isFeatured() {
//        return featured;
//    }
//
//    public void setFeatured(boolean featured) {
//        this.featured = featured;
//    }
//
//    public String getWebinarLink() {
//        return webinarLink;
//    }
//
//    public void setWebinarLink(String webinarLink) {
//        this.webinarLink = webinarLink;
//    }
//
//    public HostResponse getHost() {
//        return host;
//    }
//
//    public void setHost(HostResponse host) {
//        this.host = host;
//    }
//
//
//}

package com.example.prog.webinar.dto.webinar;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class WebinarResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime startDateTime;
    private int durationMinutes;
    private boolean featured;
    private String webinarLink;

    // resolved host display name
    private String hostName;

    // thumbnail filename
    private String thumbnail;

    private List<String> agenda;

    public List<String> getAgenda() {
        return agenda;
    }

    public void setAgenda(List<String> agenda) {
        this.agenda = agenda;
    }
    // -------- GETTERS & SETTERS --------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public String getWebinarLink() {
        return webinarLink;
    }

    public void setWebinarLink(String webinarLink) {
        this.webinarLink = webinarLink;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }
}
