package com.example.prog.portfolio.controller;


import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.UserDtls;
import com.example.prog.portfolio.serviceImpl.PaperTradeService;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.example.prog.token.JwtUtil;

@RestController
@RequestMapping("/api/paper-trade")
public class PaperTradeController {

    @Autowired
    private PaperTradeService paperTradeService;  // ← NEW SERVICE

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CorporateUserRepository corporateUserRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // --------------------------------------------------------------------
    // 1. CREATE NEW PORTFOLIO (with optional display name)
    // --------------------------------------------------------------------
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createNewPortfolio(
            @RequestParam(value = "name", required = false) String displayName,
            @RequestParam(value = "corpus", required = false) BigDecimal corpus,
            HttpServletRequest request) {

        String email = null;
        String userType = "UNKNOWN";
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Missing or invalid Authorization header"));
            }

            String jwtToken = authHeader.substring(7);
            email = jwtUtil.extractEmail(jwtToken);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid JWT token"));
            }

            boolean isCorporate = false;
            int userID;
            CorporateUser corpUser = corporateUserRepository.findByemail(email);
            if (corpUser != null) {
                isCorporate = true;
                userID = corpUser.getId();
                userType = "corporate";
            } else {
                UserDtls user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));
                userID = user.getUserID();
                userType = "individual";
            }

            Map<String, Object> result = paperTradeService.createNewPortfolio(userID, isCorporate, displayName, corpus);

            if (result.containsKey("error")) {
                return ResponseEntity.badRequest().body(result);
            }

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create portfolio: " + e.getMessage()));
        }
    }

    // --------------------------------------------------------------------
    // 2. SAVE PAPER TRADE DATA (by display name)
    // --------------------------------------------------------------------
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> savePaperTrade(
            @RequestBody List<Map<String, Object>> tradeData,
            @RequestParam("portfolioname") String displayName,
            HttpServletRequest request) {

        String email = null;
        String userType = "UNKNOWN";
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Missing or invalid Authorization header"));
            }

            String jwtToken = authHeader.substring(7);
            email = jwtUtil.extractEmail(jwtToken);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid JWT token"));
            }

            boolean isCorporate = false;
            int userID;
            CorporateUser corpUser = corporateUserRepository.findByemail(email);
            if (corpUser != null) {
                isCorporate = true;
                userID = corpUser.getId();
                userType = "corporate";
            } else {
                UserDtls user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));
                userID = user.getUserID();
                userType = "individual";
            }

            Map<String, Object> result = paperTradeService.processPaperTradeData(
                    tradeData, userID, isCorporate, displayName);

            if (result.containsKey("error")) {
                return ResponseEntity.badRequest().body(result);
            }

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Save failed: " + e.getMessage()));
        }
    }

    // --------------------------------------------------------------------
    // 3. LIST ALL PORTFOLIOS
    // --------------------------------------------------------------------
    @GetMapping("/fetch")
    public ResponseEntity<List<Map<String, Object>>> listPaperTradePortfolios(HttpServletRequest request) {
        String email = null;
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(List.of(Map.of("error", "Missing or invalid Authorization header")));
            }

            String jwtToken = authHeader.substring(7);
            email = jwtUtil.extractEmail(jwtToken);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(List.of(Map.of("error", "Invalid JWT token")));
            }

            boolean isCorporate = false;
            int userID;
            CorporateUser corpUser = corporateUserRepository.findByemail(email);
            if (corpUser != null) {
                isCorporate = true;
                userID = corpUser.getId();
            } else {
                UserDtls user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));
                userID = user.getUserID();
            }

            List<Map<String, Object>> portfolios = paperTradeService.listPaperTradePortfolios(userID, isCorporate);
            return ResponseEntity.ok(portfolios);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(List.of(Map.of("error", e.getMessage())));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of(Map.of("error", "Failed to fetch portfolios: " + e.getMessage())));
        }
    }

    // --------------------------------------------------------------------
    // 4. DELETE PORTFOLIO (by display name)
    // --------------------------------------------------------------------
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, Object>> deletePaperTradeData(
            @RequestParam("portfolioname") String displayName,
            HttpServletRequest request) {

        String email = null;
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Missing or invalid Authorization header"));
            }

            String jwtToken = authHeader.substring(7);
            email = jwtUtil.extractEmail(jwtToken);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid JWT token"));
            }

            boolean isCorporate = false;
            int userID;
            CorporateUser corpUser = corporateUserRepository.findByemail(email);
            if (corpUser != null) {
                isCorporate = true;
                userID = corpUser.getId();
            } else {
                UserDtls user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));
                userID = user.getUserID();
            }

            Map<String, Object> result = paperTradeService.deletePaperTradeData(userID, isCorporate, displayName);

            if (result.containsKey("error")) {
                return ResponseEntity.badRequest().body(result);
            }

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Delete failed: " + e.getMessage()));
        }
    }

    // --------------------------------------------------------------------
    // 5. RENAME PORTFOLIO (NEW ENDPOINT)
    // --------------------------------------------------------------------
    // @PatchMapping("/rename")
    // public ResponseEntity<Map<String, Object>> renamePortfolio(
    //         @RequestParam("oldName") String oldName,
    //         @RequestParam("newName") String newName,
    //         HttpServletRequest request) {

    //     String email = null;
    //     try {
    //         String authHeader = request.getHeader("Authorization");
    //         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    //             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
    //                     .body(Map.of("error", "Missing or invalid Authorization header"));
    //         }

    //         String jwtToken = authHeader.substring(7);
    //         email = jwtUtil.extractEmail(jwtToken);
    //         if (email == null) {
    //             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
    //                     .body(Map.of("error", "Invalid JWT token"));
    //         }

    //         boolean isCorporate = false;
    //         int userID;
    //         CorporateUser corpUser = corporateUserRepository.findByemail(email);
    //         if (corpUser != null) {
    //             isCorporate = true;
    //             userID = corpUser.getId();
    //         } else {
    //             UserDtls user = userRepository.findByEmail(email)
    //                     .orElseThrow(() -> new IllegalArgumentException("User not found"));
    //             userID = user.getUserID();
    //         }

    //         Map<String, Object> result = paperTradeService.renamePortfolio(userID, isCorporate, oldName, newName);

    //         if (result.containsKey("error")) {
    //             return ResponseEntity.badRequest().body(result);
    //         }

    //         return ResponseEntity.ok(result);

    //     } catch (IllegalArgumentException e) {
    //         return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //                 .body(Map.of("error", "Rename failed: " + e.getMessage()));
    //     }
    // }

    // --------------------------------------------------------------------
    // 6. Delete Row transcation Paper Trade 
    // --------------------------------------------------------------------

    @DeleteMapping("/transaction-delete")
    public ResponseEntity<Map<String, Object>> deleteTransaction(
            @RequestParam("portfolioname") String displayName,
            @RequestParam("transactionId") Integer transactionId,
            HttpServletRequest request) {

        String email = null;
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Missing or invalid Authorization header"));
            }

            String jwtToken = authHeader.substring(7);
            email = jwtUtil.extractEmail(jwtToken);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid JWT token"));
            }

            boolean isCorporate = false;
            int userID;
            CorporateUser corpUser = corporateUserRepository.findByemail(email);
            if (corpUser != null) {
                isCorporate = true;
                userID = corpUser.getId();
            } else {
                UserDtls user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));
                userID = user.getUserID();
            }

            Map<String, Object> result = paperTradeService.deleteTransaction(
                    userID, isCorporate, displayName, transactionId);

            if (result.containsKey("error")) {
                return ResponseEntity.badRequest().body(result);
            }
            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Delete transaction failed: " + e.getMessage()));
        }
    }

    // --------------------------------------------------------------------
    // 7. EDIT PORTFOLIO (display name + corpus)
    // --------------------------------------------------------------------
    @PatchMapping("/edit")
    public ResponseEntity<Map<String, Object>> editPortfolio(
            @RequestParam("portfolioname") String portfolioName,
            @RequestParam(value = "newName", required = false) String newName,
            @RequestParam(value = "corpus", required = false) BigDecimal corpus,
            HttpServletRequest request) {

        // ---------- JWT + user lookup (same as all other endpoints) ----------
        String email = null;
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Missing or invalid Authorization header"));
            }

            String jwtToken = authHeader.substring(7);
            email = jwtUtil.extractEmail(jwtToken);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid JWT token"));
            }

            boolean isCorporate = false;
            int userID;
            CorporateUser corpUser = corporateUserRepository.findByemail(email);
            if (corpUser != null) {
                isCorporate = true;
                userID = corpUser.getId();
            } else {
                UserDtls user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));
                userID = user.getUserID();
            }

            // ---------- delegate to service ----------
            Map<String, Object> result = paperTradeService.editPortfolio(
                    userID, isCorporate, portfolioName.trim(),
                    newName == null ? null : newName.trim(),
                    corpus);

            if (result.containsKey("error")) {
                return ResponseEntity.badRequest().body(result);
            }
            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Edit failed: " + e.getMessage()));
        }
    }

    }
