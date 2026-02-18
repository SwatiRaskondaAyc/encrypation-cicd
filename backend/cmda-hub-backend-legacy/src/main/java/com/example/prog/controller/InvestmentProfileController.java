package com.example.prog.controller;

import com.example.prog.entity.InvestmentProfile;
import com.example.prog.service.InvestmentProfileService;
import com.example.prog.token.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
public class InvestmentProfileController {

    @Autowired
    private InvestmentProfileService profileService;

    @Autowired
    private JwtUtil jwtUtil;

    // Submit Quiz
    @PostMapping("/submit")
    public ResponseEntity<?> submitQuiz(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody InvestmentProfile profileRequest) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        try {
            InvestmentProfile saved = profileService.saveProfile(email, profileRequest);
            return ResponseEntity.ok(Map.of(
                "message", "Investment profile saved successfully!",
                "quizCompleted", true,
                "redirectTo", "/home"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to save profile: " + e.getMessage()));
        }
    }

    // Skip Quiz
    @PostMapping("/skip")
    public ResponseEntity<?> skipQuiz(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        try {
            profileService.skipProfile(email);
            return ResponseEntity.ok(Map.of(
                "message", "Quiz skipped. Welcome!",
                "quizCompleted", false,
                "redirectTo", "/home"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage()));
        }
    }

    // Check if quiz already done (optional, for frontend)
    @GetMapping("/status")
    public ResponseEntity<?> getQuizStatus(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        boolean completed = profileService.hasCompletedQuiz(email);
        return ResponseEntity.ok(Map.of("quizCompleted", completed));
    }
}