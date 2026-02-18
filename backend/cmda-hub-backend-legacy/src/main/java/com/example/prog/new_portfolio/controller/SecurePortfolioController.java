package com.example.prog.new_portfolio.controller;

import com.example.prog.new_portfolio.services.SecurePortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"}, allowCredentials = "true", allowedHeaders = "*")
public class SecurePortfolioController {

    private final SecurePortfolioService securePortfolioService;

    @Autowired
    public SecurePortfolioController(SecurePortfolioService securePortfolioService) {
        this.securePortfolioService = securePortfolioService;
    }

//    @GetMapping("/public-key")
//    public ResponseEntity<Map<String, String>> getPublicKey() {
//        Map<String, String> response = new HashMap<>();
//        response.put("publicKey", securePortfolioService.getPublicKey());
//        return ResponseEntity.ok(response);
//    }

    @PostMapping(value = "/secure-normalize", produces = "application/json")
    public ResponseEntity<String> secureNormalize(
            @RequestParam("file") MultipartFile file,
            @RequestParam("encryptedKey") String encryptedKey,
            @RequestParam("iv") String iv,
            @RequestParam(value = "portfolioId", required = false) String portfolioId,
            @RequestParam(value = "brokerId", required = false) String brokerId
    ) {
        try {
            String result = securePortfolioService.secureNormalize(file, encryptedKey, iv, portfolioId, brokerId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error in secure normalization: " + e.getMessage());
        }
    }

    @PostMapping(value = "/secure-analyze", produces = "application/json")
    public ResponseEntity<String> secureAnalyze(@RequestBody Map<String, String> payload) {
        try {
            String result = securePortfolioService.secureAnalyzeJson(
                payload.get("encryptedData"),
                payload.get("encryptedKey"),
                payload.get("iv")
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error in secure analysis: " + e.getMessage());
        }
    }
}
