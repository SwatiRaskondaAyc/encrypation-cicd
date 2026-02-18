package com.example.prog.repository.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.prog.entity.assessment.AssessmentResult;

@Repository
public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {
    // Add more queries if needed later
}