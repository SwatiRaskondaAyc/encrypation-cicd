package com.example.prog.zoho.service;

import com.example.prog.entity.BatchJobEntity;
import com.example.prog.zoho.repository.BatchJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BatchJobRecovery {
    
    @Autowired
    private BatchJobRepository batchJobRepository;
    
    @EventListener(ApplicationReadyEvent.class)
    public void recoverOnStartup() {
        System.out.println("🔍 BatchJobRecovery: Checking for pending jobs after server start...");
        
        List<BatchJobEntity> waitingJobs = batchJobRepository.findByStatus("WAITING_FOR_RESET");
        
        if (waitingJobs.isEmpty()) {
            System.out.println("✅ No pending batch jobs found");
            return;
        }
        
        System.out.println("🎯 Found " + waitingJobs.size() + " batch jobs in WAITING_FOR_RESET state:");
        
        for (BatchJobEntity job : waitingJobs) {
            System.out.println("   📧 " + job.getJobName() + 
                             " - Progress: " + job.getProgress() + "%" +
                             " - Remaining: " + (job.getTotalEmails() - (job.getSentCount() + job.getFailedCount())));
        }
        
        System.out.println("🔄 These jobs will be automatically resumed by the scheduler within 5 minutes");
    }
}