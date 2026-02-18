//package com.cmdahub.cmda_management_console.webinar.dto.hosts;
//
//import lombok.Data;
//
//@Data
//public class HostResponse {
//    private Long id;
//    private String name;
//    private String role;
//    private String experience;
//    private String bio;
//    private String languages;
//    private String photoUrl;
//    private String linkedin;
//    private String twitter;
//    private String instagram;
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public String getRole() {
//        return role;
//    }
//
//    public void setRole(String role) {
//        this.role = role;
//    }
//
//    public String getBio() {
//        return bio;
//    }
//
//    public void setBio(String bio) {
//        this.bio = bio;
//    }
//
//    public String getLanguages() {
//        return languages;
//    }
//
//    public void setLanguages(String languages) {
//        this.languages = languages;
//    }
//
//    public String getPhotoUrl() {
//        return photoUrl;
//    }
//
//    public void setPhotoUrl(String photoUrl) {
//        this.photoUrl = photoUrl;
//    }
//
//    public String getLinkedin() {
//        return linkedin;
//    }
//
//    public void setLinkedin(String linkedin) {
//        this.linkedin = linkedin;
//    }
//
//    public String getTwitter() {
//        return twitter;
//    }
//
//    public void setTwitter(String twitter) {
//        this.twitter = twitter;
//    }
//
//    public String getInstagram() {
//        return instagram;
//    }
//
//    public void setInstagram(String instagram) {
//        this.instagram = instagram;
//    }
//
//
//}

package com.example.prog.webinar.dto.hosts;

import lombok.Data;

@Data
public class HostResponse {

    private Long id;
    private String name;
    private String role;
    private String experience;
    private String bio;
    private String languages;
    private String photoUrl;
    private String linkedin;

    // Explicit getters & setters (optional due to @Data)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }
}
