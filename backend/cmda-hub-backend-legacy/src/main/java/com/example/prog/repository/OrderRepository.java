package com.example.prog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.prog.entity.Plan;


public interface OrderRepository extends JpaRepository<Plan, Long> {

	public Plan findByOrderId(String orderId);
}
