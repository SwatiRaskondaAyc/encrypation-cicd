package com.example.prog.logs.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "Email_Logs")
@Data
public class EmailLogs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Just store the ID, no foreign key relationship
    @Column(name = "registration_id", nullable = false)
    private Long registrationId;

    @Column(nullable = false)
    private String email;

    private String subject;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String body;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt = LocalDateTime.now();

    private String status;  // SUCCESS / FAILED
}
