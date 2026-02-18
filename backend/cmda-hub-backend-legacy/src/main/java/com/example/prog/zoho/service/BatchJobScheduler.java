package com.example.prog.zoho.service;

import com.example.prog.entity.BatchJobEntity;
import com.example.prog.zoho.repository.BatchJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class BatchJobScheduler {
    
    @Autowired
    private SMTPMailService mailService;
    
    @Autowired
    private BatchJobRepository batchJobRepository;
    
    // Run every 5 minutes (300,000 milliseconds)
    @Scheduled(fixedRate = 300000)
    @Transactional
    public void resumePendingBatchJobs() {
        try {
            List<BatchJobEntity> waitingJobs = batchJobRepository.findByStatus("WAITING_FOR_RESET");
            
            if (waitingJobs.isEmpty()) {
                System.out.println("⏰ Scheduler: No pending jobs found");
                return;
            }
            
            System.out.println("🔄 Scheduler: Found " + waitingJobs.size() + " pending batch jobs");
            
            for (BatchJobEntity job : waitingJobs) {
                System.out.println("🚀 Attempting to resume: " + job.getJobName() + 
                                 " (Progress: " + job.getProgress() + "%)");
                
                // The processBatchJob method will handle limit checking
                mailService.processBatchJob(job.getId());
            }
        } catch (Exception e) {
            System.err.println("❌ Scheduler error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}