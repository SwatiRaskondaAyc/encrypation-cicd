package com.example.prog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.prog.entity.Plan;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    // You can add custom query methods if necessary, for example:
    // List<Plan> findByPlanType(String planType);
}