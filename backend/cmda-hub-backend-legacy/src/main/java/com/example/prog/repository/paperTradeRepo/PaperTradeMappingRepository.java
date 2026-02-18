package com.example.prog.repository.paperTradeRepo;

// src/main/java/com/yourpackage/repository/PaperTradePortfolioMappingRepository.java


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.prog.entity.paperTrade.PaperTradeMapping;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaperTradeMappingRepository extends JpaRepository<PaperTradeMapping, Long> {

    List<PaperTradeMapping> findByUserIdAndUserType(Integer userId, PaperTradeMapping.UserType userType);

    Optional<PaperTradeMapping> findByUserIdAndUserTypeAndDisplayName(
            Integer userId, PaperTradeMapping.UserType userType, String displayName);

    Optional<PaperTradeMapping> findByInternalTableName(String internalTableName);

    boolean existsByUserIdAndUserTypeAndDisplayName(Integer userId, PaperTradeMapping.UserType userType, String displayName);
    
}