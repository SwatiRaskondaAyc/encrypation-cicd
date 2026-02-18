// package com.example.prog.repository.promocode;

// import com.example.prog.entity.promocode.PromoCodeUsage;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// import java.util.List;

// @Repository
// public interface PromoCodeUsageRepository extends JpaRepository<PromoCodeUsage, Long> {
//     List<PromoCodeUsage> findByPromoCode(String promoCode);

	
// }

package com.example.prog.repository.promocode;

import com.example.prog.entity.promocode.PromoCodeUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromoCodeUsageRepository extends JpaRepository<PromoCodeUsage, Long> {
    List<PromoCodeUsage> findByPromoCode(String promoCode);

    // Added method to count usage of a specific promo code
    long countByPromoCode(String promoCode);
}