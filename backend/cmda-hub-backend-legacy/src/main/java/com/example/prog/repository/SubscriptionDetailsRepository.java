package com.example.prog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.prog.entity.SubscriptionDetails;

public interface SubscriptionDetailsRepository extends JpaRepository<SubscriptionDetails, String> {

	SubscriptionDetails findByOrderId(String orderId);
    
}
