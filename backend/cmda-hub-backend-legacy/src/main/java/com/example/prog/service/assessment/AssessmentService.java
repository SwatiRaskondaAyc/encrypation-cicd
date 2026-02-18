package com.example.prog.service.assessment;


import java.util.List;

import com.example.prog.dto.assessment.AssessmentRequestDTO;
import com.example.prog.dto.assessment.QuestionResponseDTO;
import com.example.prog.entity.assessment.AssessmentResult;

public interface AssessmentService {
//    AssessmentResult submitAssessment(AssessmentRequestDTO requestDTO);
    List<QuestionResponseDTO> getRandomAssessmentQuestions();
    
    public AssessmentResult submitAssessment(AssessmentRequestDTO requestDTO, int userId, boolean isCorporate);

}
