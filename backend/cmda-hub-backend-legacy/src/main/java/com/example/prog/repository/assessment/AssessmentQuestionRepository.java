package com.example.prog.repository.assessment;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.prog.entity.assessment.AssessmentQuestion;

import java.util.List;

@Repository
public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestion, String> {

    @Query(value = "SELECT TOP 3 * FROM Assessment_Question WHERE Question_Category = :category ORDER BY NEWID()", nativeQuery = true)
    List<AssessmentQuestion> findRandom3ByCategory(@Param("category") String category);

    @Query(value = "SELECT TOP 1 * FROM Assessment_Question ORDER BY NEWID()", nativeQuery = true)
    AssessmentQuestion findAnyRandomQuestion();
}

