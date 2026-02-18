package com.example.prog.new_portfolio.services;

import com.example.prog.new_portfolio.dto.UserContext;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.repository.UserRepository;
import com.example.prog.token.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public class UserResolverService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final CorporateUserRepository corporateUserRepository;

    public UserResolverService(JwtUtil jwtUtil, UserRepository userRepository, CorporateUserRepository corporateUserRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.corporateUserRepository = corporateUserRepository;
    }

    /**
     * Extracts token from request and resolves User ID and Type from DB.
     */
    public UserContext getUserInfo(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String jwtToken = authHeader.substring(7);
        String email = jwtUtil.extractEmail(jwtToken);

        if (email == null) {
            throw new RuntimeException("Invalid JWT token");
        }

        // Check Corporate first
        var corpUser = corporateUserRepository.findByemail(email);
        if (corpUser != null) {
            return new UserContext(corpUser.getId(), "corporate", email);
        }

        // Check Individual
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        return new UserContext(user.getUserID(), "individual", email);
    }
}