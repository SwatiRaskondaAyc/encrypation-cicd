package com.example.prog.repository.promocode;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.prog.entity.promocode.PromoCode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
// import org.springframework.data.jpa.repository.Query;


@Repository
public interface PromoCodeRepository extends JpaRepository<PromoCode, Long> {

	
    List<PromoCode> findAll();
	long countByPromoterTypeAndSeries(String promoterType, Integer series);

	PromoCode findByPromotionCode(String promoCode);

	PromoCode findByPromoterTypeAndSeries(String promoterType, Integer series);

	// Table for promoters

	// @Query("SELECT p FROM Promoter p WHERE p.validTo >= :today")
    // List<Promoter> findAllActivePromoters(LocalDate today);
	@Modifying
    @Query("UPDATE PromoCode p SET p.paid = :paid, p.transactionId = :transactionId, p.paidAt = :paidAt WHERE p.promotionCode = :promotionCode")
    void updatePaymentStatus(@Param("promotionCode") String promotionCode, 
                           @Param("paid") Boolean paid, 
                           @Param("transactionId") String transactionId, 
                           @Param("paidAt") LocalDateTime paidAt);

	
}

