package com.example.prog.config;

import com.example.prog.entity.AdminUser;
import com.example.prog.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AdminConfig {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initAdmin() {
        return args -> {
            String adminEmail = "admin@aycanalytics.com";
            // String adminPassword = "Admin@123"; // Hardcoded password
            String adminPassword = "@Yc@2026@"; // Hardcoded password
            if (adminUserRepository.findByEmail(adminEmail).isEmpty()) {
                AdminUser admin = new AdminUser();
                admin.setEmail(adminEmail);
                admin.setPasswordHash(passwordEncoder.encode(adminPassword));
                adminUserRepository.save(admin);
                System.out.println("Admin user created with email: " + adminEmail);
            }
        };
    }
}