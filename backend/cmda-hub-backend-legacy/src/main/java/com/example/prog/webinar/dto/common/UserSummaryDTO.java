package com.example.prog.webinar.dto.common;

import lombok.Data;

@Data
public class UserSummaryDTO {

    private Integer id;
    private String fullname;
    private String email;
    private String thumbnail;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


}
