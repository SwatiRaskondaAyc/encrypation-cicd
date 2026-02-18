package com.example.prog.controller.assessment;


import com.example.prog.dto.assessment.AssessmentRequestDTO;
import com.example.prog.dto.assessment.QuestionResponseDTO;
import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.UserDtls;
import com.example.prog.entity.assessment.AssessmentResult;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.repository.UserRepository;
import com.example.prog.service.assessment.AssessmentService;
import com.example.prog.token.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/assessment")
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CorporateUserRepository corporateUserRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // STEP 1: Reuse this method from SearchController
    private Map<String, Object> extractUserDetailsFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String jwtToken = authHeader.substring(7);
        String email = jwtUtil.extractEmail(jwtToken);

        CorporateUser corporateUser = corporateUserRepository.findByemail(email);
        if (corporateUser != null) {
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("email", email);
            userDetails.put("userType", "corporate");
            userDetails.put("userId", corporateUser.getId());
            return userDetails;
        }

        Optional<UserDtls> individualUserOpt = userRepository.findByEmail(email);
        if (individualUserOpt.isPresent()) {
            UserDtls individualUser = individualUserOpt.get();
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("email", email);
            userDetails.put("userType", "individual");
            userDetails.put("userId", individualUser.getUserID());
            return userDetails;
        }

        throw new RuntimeException("User not found for email: " + email);
    }

    // STEP 2: Submit assessment using extracted user details
    @PostMapping("/submit")
    public ResponseEntity<?> submitAssessment(@RequestBody AssessmentRequestDTO requestDTO,
                                              HttpServletRequest request) {
        try {
            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
            String email = (String) userDetails.get("email");

            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid JWT token"));
            }

            boolean isCorporate = userDetails.get("userType").equals("corporate");
            int userID = (Integer) userDetails.get("userId");

            AssessmentResult result = assessmentService.submitAssessment(requestDTO, userID, isCorporate);

            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Assessment submission failed: " + e.getMessage()));
        }
    }

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionResponseDTO>> getAssessmentQuestions() {
        return ResponseEntity.ok(assessmentService.getRandomAssessmentQuestions());
    }
}

//@RestController
//@RequestMapping("/api/assessment")
//public class AssessmentController {
//
//    @Autowired
//    private AssessmentService assessmentService;
//
//    @PostMapping("/submit")
//    public ResponseEntity<AssessmentResult> submitAssessment(@RequestBody AssessmentRequestDTO requestDTO) {
//        AssessmentResult result = assessmentService.submitAssessment(requestDTO);
//        return ResponseEntity.ok(result);
//    }
//    
//    
//    @GetMapping("/questions")
//    public ResponseEntity<List<QuestionResponseDTO>> getAssessmentQuestions() {
//        return ResponseEntity.ok(assessmentService.getRandomAssessmentQuestions());
//    }
//}

//@RestController
//@RequestMapping("/api/assessment")
//public class AssessmentController {
//
//    @Autowired
//    private AssessmentService assessmentService;
//
//    @Autowired
//    private SessionUtil sessionUtil;
//
//    @Autowired
//    private HttpSession httpSession;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private CorporateUserRepository corporateUserRepository;
//
//    @PostMapping("/submit")
//    public ResponseEntity<?> submitAssessment(@RequestBody AssessmentRequestDTO requestDTO,
//                                              HttpServletRequest request) {
//        try {
//            // Extract user details from JWT and session
//            Map<String, Object> userDetails = sessionUtil.extractAndStoreUserDetails(request, httpSession);
//            String email = (String) userDetails.get("email");
//
//            if (email == null) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("error", "Invalid JWT token"));
//            }
//
//            boolean isCorporate = userDetails.get("userType").equals("corporate");
//            int userID = (Integer) userDetails.get("userId");
//
//            // Optional: Re-validate user from DB
//            if (isCorporate) {
//                CorporateUser corpUser = corporateUserRepository.findByemail(email);
//                if (corpUser == null) {
//                    return ResponseEntity.badRequest()
//                            .body(Map.of("error", "Corporate user not found."));
//                }
//                userID = corpUser.getId();
//            } else {
//                UserDtls user = userRepository.findByEmail(email)
//                        .orElseThrow(() -> new IllegalArgumentException("Individual user not found."));
//                userID = user.getUserID();
//            }
//
//            // Call the service with userId or other details if needed
//            AssessmentResult result = assessmentService.submitAssessment(requestDTO, userID, isCorporate);
//
//            return ResponseEntity.ok(result);
//
//        } catch (Exception e) {
//            return ResponseEntity.badRequest()
//                    .body(Map.of("error", "Assessment submission failed: " + e.getMessage()));
//        }
//    }
//
//    @GetMapping("/questions")
//    public ResponseEntity<List<QuestionResponseDTO>> getAssessmentQuestions() {
//        return ResponseEntity.ok(assessmentService.getRandomAssessmentQuestions());
//    }
//}
