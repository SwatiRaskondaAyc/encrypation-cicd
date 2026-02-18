// src/main/java/com/example/prog/entity/paperTrade/PaperTradeMapping.java

package com.example.prog.entity.paperTrade;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "paper_trade_mapping",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"user_id", "user_type", "display_name"})
       },
       indexes = {
           @Index(name = "idx_user", columnList = "user_id, user_type")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder                        // ← Let Lombok generate builder()
@ToString
public class PaperTradeMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "user_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private UserType userType;

    @Column(name = "internal_table_name", nullable = false, unique = true, length = 255)
    private String internalTableName;

    @Column(name = "display_name", nullable = false, length = 255)
    private String displayName;

    @Column(name = "corpus", precision = 19, scale = 2)
    private BigDecimal corpus;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum UserType {
        individual, corporate
    }
}