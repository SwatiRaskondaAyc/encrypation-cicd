package com.example.prog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity to store temporarily blocked IP addresses.
 */
@Entity
@Table(name = "blocked_ips")
public class BlockedIp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ip_address", nullable = false, unique = true)
    private String ipAddress;

    @Column(name = "blocked_at", nullable = false)
    private LocalDateTime blockedAt;

    @Column(name = "unblock_at", nullable = false)
    private LocalDateTime unblockAt;

    // Constructors
    public BlockedIp() {}

    public BlockedIp(String ipAddress, LocalDateTime blockedAt, LocalDateTime unblockAt) {
        this.ipAddress = ipAddress;
        this.blockedAt = blockedAt;
        this.unblockAt = unblockAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public LocalDateTime getBlockedAt() {
        return blockedAt;
    }

    public void setBlockedAt(LocalDateTime blockedAt) {
        this.blockedAt = blockedAt;
    }

    public LocalDateTime getUnblockAt() {
        return unblockAt;
    }

    public void setUnblockAt(LocalDateTime unblockAt) {
        this.unblockAt = unblockAt;
    }

    // Optional: Add toString(), equals(), and hashCode() if needed
}
