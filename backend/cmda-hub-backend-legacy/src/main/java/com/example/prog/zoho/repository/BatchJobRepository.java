// BatchJobRepository.java
package com.example.prog.zoho.repository;

import com.example.prog.entity.BatchJobEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

@Repository
public interface BatchJobRepository extends JpaRepository<BatchJobEntity, String> {
    
    List<BatchJobEntity> findByStatusIn(List<String> statuses);

    // Add this method if it doesn't exist
    List<BatchJobEntity> findByStatus(String status);
    
    Optional<BatchJobEntity> findTopByOrderByCreatedAtDesc();
    
    List<BatchJobEntity> findAllByOrderByCreatedAtDesc();
    
    @Query("SELECT b FROM BatchJobEntity b WHERE b.status = :status ORDER BY b.createdAt DESC")
    List<BatchJobEntity> findByStatusOrderByCreatedAtDesc(@Param("status") String status);
    
    @Query("SELECT COUNT(b) FROM BatchJobEntity b WHERE b.status = :status")
    long countByStatus(@Param("status") String status);

     @Modifying
    @Transactional
   @Query(value = """
    INSERT INTO batch_jobs 
    (id, job_name, subject, message, features_json, status, total_emails, created_at, updated_at)
    VALUES (:id, :jobName, N:subject, N:message, N:featuresJson, :status, :totalEmails, GETDATE(), GETDATE())
    """, nativeQuery = true)
    void insertBatchJobNative(
        @Param("id") String id,
        @Param("jobName") String jobName,
        @Param("subject") String subject,
        @Param("message") String message,
        @Param("featuresJson") String featuresJson,
        @Param("status") String status,
        @Param("totalEmails") int totalEmails
    );
}