package com.example.prog.zoho.repository;

import com.example.prog.entity.PosterEmailLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface PosterEmailLogRepository extends JpaRepository<PosterEmailLogEntity, String> {

    List<PosterEmailLogEntity> findByPosterJobId(String posterJobId);
    
    List<PosterEmailLogEntity> findByPosterJobIdAndStatus(String posterJobId, String status);
    
    @Query("SELECT p.recipientEmail FROM PosterEmailLogEntity p WHERE p.posterJobId = :posterJobId")
    List<String> findRecipientEmailsByPosterJobId(@Param("posterJobId") String posterJobId);
    
    int countByPosterJobId(String posterJobId);
    
    int countByPosterJobIdAndStatus(String posterJobId, String status);
    
    int countBySentAtBetween(Timestamp start, Timestamp end);
    
    int countByStatusAndSentAtBetween(String status, Timestamp start, Timestamp end);
}