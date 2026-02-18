package com.example.prog.zoho.repository;

import com.example.prog.entity.PosterJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PosterJobRepository extends JpaRepository<PosterJobEntity, String> {

    List<PosterJobEntity> findAllByOrderByCreatedAtDesc();
    
    List<PosterJobEntity> findByStatusIn(List<String> statuses);
    
    List<PosterJobEntity> findByStatus(String status);
    
    @Query("SELECT COUNT(p) FROM PosterJobEntity p WHERE p.status IN ('CREATED', 'PROCESSING', 'WAITING_FOR_RESET')")
    int countActiveJobs();
    
    Optional<PosterJobEntity> findFirstByStatusOrderByCreatedAtAsc(String status);
}