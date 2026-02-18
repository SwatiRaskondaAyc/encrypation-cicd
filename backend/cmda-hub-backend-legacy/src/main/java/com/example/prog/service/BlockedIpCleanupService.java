package com.example.prog.service;

import com.example.prog.entity.BlockedIp;
import com.example.prog.repository.BlockedIpRepository;
import com.example.prog.repository.ApiRequestLogRepository;

import org.springframework.data.repository.query.Param;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BlockedIpCleanupService {

    private final BlockedIpRepository blockedIpRepository;
    private final ApiRequestLogRepository apiRequestLogRepository;

    public BlockedIpCleanupService(BlockedIpRepository blockedIpRepository,
                                   ApiRequestLogRepository apiRequestLogRepository) {
        this.blockedIpRepository = blockedIpRepository;
        this.apiRequestLogRepository = apiRequestLogRepository;
    }

    // Runs every 5 minutes
    @Transactional
    @Scheduled(fixedRate = 120000)
    public void cleanExpiredBlockedIps() {
        List<BlockedIp> expiredIps = blockedIpRepository.findAllByUnblockAtBefore(LocalDateTime.now());

        if (!expiredIps.isEmpty()) {
            for (BlockedIp ip : expiredIps) {
                // Reset suspicious flag in ApiRequestLog
                apiRequestLogRepository.resetSuspiciousFlagByIp(ip.getIpAddress());
                apiRequestLogRepository.resetRequestCountByIp(ip.getIpAddress());
            }

            blockedIpRepository.deleteAll(expiredIps);
            System.out.println("Deleted expired BlockedIp entries and reset suspicious flags: " + expiredIps.size());
        }
    }
}