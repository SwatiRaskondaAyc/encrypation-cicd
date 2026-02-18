//package com.cmdahub.cmda_management_console.webinar.dto.webinar;
//
//import lombok.Data;
//
//import java.time.LocalDateTime;
//
//@Data
//public class WebinarRequest {
//
//    private String title;
//    private String description;
//    private String agenda;   // optional JSON string or plain text
//    private LocalDateTime startDateTime;
//    private int durationMinutes;
//    private boolean featured;
//    private String webinarLink;
//    private String thumbnailUrl;// optional
//    private String thumbnail;
//
//    private Long hostId;  // connect with host
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
//    public Long getHostId() {
//        return hostId;
//    }
//
//    public void setHostId(Long hostId) {
//        this.hostId = hostId;
//    }
//
//
//}

package com.example.prog.webinar.dto.webinar;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class WebinarRequest {

    private String title;
    private String description;
    private LocalDateTime startDateTime;
    private int durationMinutes;
    private boolean featured;
    private String webinarLink;
    private Double price;

    // thumbnail filename (set after upload OR optional on create)
    private String thumbnail;

    // instructor / host reference
    private Long hostId;

    private List<String> agenda;

    public List<String> getAgenda() {
        return agenda;
    }

    public void setAgenda(List<String> agenda) {
        this.agenda = agenda;
    }
    // -------- GETTERS & SETTERS --------

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

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public Long getHostId() {
        return hostId;
    }

    public void setHostId(Long hostId) {
        this.hostId = hostId;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
