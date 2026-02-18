package com.example.prog.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.prog.entity.BlockedIp;

public interface BlockedIpRepository extends JpaRepository<BlockedIp, Long> {
    boolean existsByIpAddressAndUnblockAtAfter(String ipAddress, LocalDateTime time);
    List<BlockedIp> findAllByUnblockAtBefore(LocalDateTime now);
    
 // Fetch all blocked IPs, latest first
    List<BlockedIp> findAllByOrderByBlockedAtDesc();

    // Fetch only currently active blocked IPs
    List<BlockedIp> findByUnblockAtAfter(LocalDateTime now);

    // Fetch all blocked entries for a given IP
    List<BlockedIp> findByIpAddress(String ipAddress);

}