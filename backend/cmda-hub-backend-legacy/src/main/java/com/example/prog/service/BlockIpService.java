package com.example.prog.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.prog.entity.BlockedIp;
import com.example.prog.repository.BlockedIpRepository;

@Service
public class BlockIpService {

    @Autowired 
    private BlockedIpRepository blockedIpRepo;

    private static final int BLOCK_MINUTES = 3;

    public boolean isBlocked(String ip) {
        return blockedIpRepo.existsByIpAddressAndUnblockAtAfter(ip, LocalDateTime.now());
    }

    public void block(String ip) {
        LocalDateTime now = LocalDateTime.now();
        if (!isBlocked(ip)) {
            BlockedIp block = new BlockedIp();
            block.setIpAddress(ip);
            block.setBlockedAt(now);
            block.setUnblockAt(now.plusMinutes(BLOCK_MINUTES));
            blockedIpRepo.save(block);
        }
    }
}
