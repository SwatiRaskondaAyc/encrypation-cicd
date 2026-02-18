package com.example.prog.serviceimpl.assessment;

import com.example.prog.entity.UserDtls;
import com.example.prog.dto.assessment.AnswerDTO;
import com.example.prog.dto.assessment.AssessmentRequestDTO;
import com.example.prog.dto.assessment.QuestionResponseDTO;
import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.assessment.AssessmentQuestion;
import com.example.prog.entity.assessment.AssessmentResult;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.assessment.AssessmentQuestionRepository;
import com.example.prog.repository.assessment.AssessmentResultRepository;
import com.example.prog.service.assessment.AssessmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

@Service
public class AssessmentServiceImpl implements AssessmentService {

    @Autowired
    private AssessmentQuestionRepository questionRepo;

    @Autowired
    private AssessmentResultRepository resultRepo;

    @Autowired
    private UserRepository userDtlsRepo;

    @Autowired
    private CorporateUserRepository corporateUserRepo;

    @Override
    public AssessmentResult submitAssessment(AssessmentRequestDTO requestDTO, int userId, boolean isCorporate) {
        int correct = 0;
        List<AnswerDTO> answers = requestDTO.getAnswers();

        for (AnswerDTO answer : answers) {

            AssessmentQuestion question = questionRepo.findById(answer.getQuestionId()).orElse(null);
            if (question == null) {
                System.out.println("Question not found in DB for ID: " + answer.getQuestionId());
                continue;
            }

            String selectedText = null;
            switch (answer.getSelectedOption()) {
                case "Option_A":
                    selectedText = question.getOptionA();
                    break;
                case "Option_B":
                    selectedText = question.getOptionB();
                    break;
                case "Option_C":
                    selectedText = question.getOptionC();
                    break;
                case "Option_D":
                    selectedText = question.getOptionD();
                    break;
            }

            if (question.getCorrectAns().trim().equalsIgnoreCase(selectedText != null ? selectedText.trim() : "")) {
                correct++;
            }
        }


        int total = answers.size();
        double score = (correct / (double) total) * 100;
        String resultStatus = score >= 80 ? "Passed" : "Failed";
        String userLevel = score >= 80 ? "professional" : "nowy";

        // Save assessment result
        AssessmentResult result = new AssessmentResult();
        result.setUserId(userId);
        result.setScore(score);
        result.setResultStatus(resultStatus);
        result.setAttemptedAt(LocalDateTime.now());
        resultRepo.save(result);

        // Update user level and AI flag
        if (isCorporate) {
            CorporateUser corpUser = corporateUserRepo.findById(userId).orElseThrow();
            corpUser.setUserLevel(userLevel);
            corpUser.setAiEnable("nowy".equals(userLevel));
            corporateUserRepo.save(corpUser);
        } else {
            UserDtls user = userDtlsRepo.findById(userId).orElseThrow();
            user.setUserLevel(userLevel);
            user.setAiEnable("nowy".equals(userLevel));
            userDtlsRepo.save(user);
        }

        return result;
    }
    
    
    @Override
    public List<QuestionResponseDTO> getRandomAssessmentQuestions() {
        List<QuestionResponseDTO> responseList = new ArrayList<>();

        List<AssessmentQuestion> general = questionRepo.findRandom3ByCategory("General");
        List<AssessmentQuestion> fundamental = questionRepo.findRandom3ByCategory("Fundamental");
        List<AssessmentQuestion> technical = questionRepo.findRandom3ByCategory("Technical");

        AssessmentQuestion randomAny = questionRepo.findAnyRandomQuestion();

        Stream.of(general, fundamental, technical)
                .flatMap(Collection::stream)
                .forEach(q -> responseList.add(convertToDto(q)));

        // Ensure random one isn't duplicate
        if (responseList.stream().noneMatch(q -> q.getQuestionId().equals(randomAny.getQuesId()))) {
            responseList.add(convertToDto(randomAny));
        }

        Collections.shuffle(responseList); // Optional: Shuffle final list
        return responseList;
    }
    
    private QuestionResponseDTO convertToDto(AssessmentQuestion question) {
        QuestionResponseDTO dto = new QuestionResponseDTO();
        dto.setQuestionId(question.getQuesId());
        dto.setQuestionCategory(question.getQuestionCategory());
        dto.setQuestion(question.getQuestion());
        dto.setOptionA(question.getOptionA());
        dto.setOptionB(question.getOptionB());
        dto.setOptionC(question.getOptionC());
        dto.setOptionD(question.getOptionD());
        dto.setCorrectAns(question.getCorrectAns());
        return dto;
    }
}


