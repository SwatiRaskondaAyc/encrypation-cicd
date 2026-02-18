// EmailLogRepository.java
package com.example.prog.zoho.repository;

import com.example.prog.entity.EmailLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.sql.Timestamp;
import java.util.List;

@Repository
public interface EmailLogRepository extends JpaRepository<EmailLogEntity, Long> {
    
    int countBySentAtBetween(Timestamp start, Timestamp end);
    
    List<EmailLogEntity> findByBatchJobId(String batchJobId);
    
    List<EmailLogEntity> findByBatchJobIdAndStatus(String batchJobId, String status);

     // Also add this for better performance
    @Query("SELECT e.recipientEmail FROM EmailLogEntity e WHERE e.batchJobId = :batchJobId")
    List<String> findRecipientEmailsByBatchJobId(@Param("batchJobId") String batchJobId);
    
    @Query("SELECT COUNT(e) FROM EmailLogEntity e WHERE e.status = :status AND e.sentAt BETWEEN :start AND :end")
    int countByStatusAndSentAtBetween(@Param("status") String status, 
                                     @Param("start") Timestamp start, 
                                     @Param("end") Timestamp end);
    
    @Query("SELECT e FROM EmailLogEntity e WHERE e.batchJobId = :batchJobId ORDER BY e.sentAt DESC")
    List<EmailLogEntity> findByBatchJobIdOrderBySentAtDesc(@Param("batchJobId") String batchJobId);
}