package com.example.prog.config;



import com.example.prog.service.UserActivityService;
import com.example.prog.serviceimpl.CustomUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class UserActivityInterceptor implements HandlerInterceptor {

    @Autowired
    private UserActivityService userActivityService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            // Assuming userId and userType are stored in the principal or can be derived
            // You may need to adjust based on your UserDetails implementation
            Object principal = authentication.getPrincipal();
            if (principal instanceof CustomUserDetails) { // Replace with your UserDetails implementation
                CustomUserDetails userDetails = (CustomUserDetails) principal;
                userActivityService.logUserActivity(
                    userDetails.getEmail(),
                    userDetails.getUserType(),
                    "PAGE_VISIT"
                );
            }
        }
        return true;
    }
}
