package com.example.prog.webinar.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Calendar_Events")
public class CalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "webinar_id", nullable = false)
    private Long webinarId;

    private LocalDate eventDate;

    // -------- GETTERS & SETTERS --------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Long getWebinarId() {
        return webinarId;
    }

    public void setWebinarId(Long webinarId) {
        this.webinarId = webinarId;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }
}

