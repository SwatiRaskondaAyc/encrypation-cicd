package com.example.prog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.prog.entity.SubscriptionMaster;

public interface SubscriptionMasterRepository extends JpaRepository<SubscriptionMaster, String> {
    // JpaRepository already includes the findById method
    // Add custom queries if needed
}
