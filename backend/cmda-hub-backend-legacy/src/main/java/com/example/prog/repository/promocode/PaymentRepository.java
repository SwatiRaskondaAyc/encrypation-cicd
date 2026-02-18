// PaymentRepository.java
package com.example.prog.repository.promocode;

import com.example.prog.entity.promocode.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByPromoCode(String promoCode);
    Boolean existsByTransactionId(String transactionId);
}