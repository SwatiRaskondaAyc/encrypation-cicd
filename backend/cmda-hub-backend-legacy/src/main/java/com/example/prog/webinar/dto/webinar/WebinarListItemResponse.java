//package com.cmdahub.cmda_management_console.webinar.dto.webinar;
//
//import lombok.Data;
//import java.time.LocalDateTime;
//
//@Data
//public class WebinarListItemResponse {
//
//    private Long id;
//    private String title;
//    private String hostName;
//    private LocalDateTime startDateTime;
//    private boolean featured;
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
//    public String getHostName() {
//        return hostName;
//    }
//
//    public void setHostName(String hostName) {
//        this.hostName = hostName;
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
//    public boolean isFeatured() {
//        return featured;
//    }
//
//    public void setFeatured(boolean featured) {
//        this.featured = featured;
//    }
//
//
//    public void setThumbnail(String thumbnail) {
//    }
//}
//

package com.example.prog.webinar.dto.webinar;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WebinarListItemResponse {

    private Long id;
    private String title;
    private String hostName;
    private LocalDateTime startDateTime;
    private boolean featured;
    private String thumbnail;   // ✅ added

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

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }
}
