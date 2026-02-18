package com.example.prog.repository.new_portfolio;

import com.example.prog.entity.new_portfolio.MasterUserLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface MasterUserLedgerRepository extends JpaRepository<MasterUserLedger, String> {

    // Efficiently check how many portfolios the user has
    long countByUserId(String userId);
    // Find all portfolios for a specific user
    List<MasterUserLedger> findByUserId(String userId);

    // Check if a specific PID already exists for a user
    boolean existsByUserIdAndPid(String userId, String pid);

    // Delete record when a portfolio is wiped
    @Transactional
    void deleteByUserIdAndPid(String userId, String pid);

    // Inside MasterUserLedgerRepository.java
    Optional<MasterUserLedger> findByUserIdAndPid(String userId, String pid);
}
