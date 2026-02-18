package com.example.prog.repository;

import com.example.prog.entity.InvestmentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InvestmentProfileRepository extends JpaRepository<InvestmentProfile, Long> {
    Optional<InvestmentProfile> findByEmail(String email);
    boolean existsByEmail(String email);
}