package com.example.prog.entity.new_portfolio;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Master_UserLedgers")
@Data
public class MasterUserLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "upload_id", nullable = false)
    private String uploadId;

    @Column(name = "user_type", nullable = false)
    private String userType;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "PID", nullable = false)
    private String pid; // This is your portfolioId

    @Column(name = "BrokerId", nullable = false)
    private String brokerId;

    @Column(name = "portfolio_name", nullable = false)
    private String portfolioName;

    @Column(name = "portfolio_table_name", nullable = false)
    private String portfolioTableName;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

}
