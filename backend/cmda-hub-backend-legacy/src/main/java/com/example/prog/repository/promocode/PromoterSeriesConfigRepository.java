// // Repository Interface for PromoterSeriesConfig
// package com.example.prog.repository.promocode;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// import com.example.prog.entity.promocode.PromoterSeriesConfig;


// import java.util.Optional;

// @Repository
// public interface PromoterSeriesConfigRepository extends JpaRepository<PromoterSeriesConfig, Long> {
//     // Custom query to find the latest series for a promoter type
//     Optional<PromoterSeriesConfig> findTopByPromoterTypeOrderBySeriesDesc(String promoterType);
    
//     // Find by promoter type and series
//     PromoterSeriesConfig findByPromoterTypeAndSeries(String promoterType, Integer series);

	
// }

package com.example.prog.repository.promocode;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.prog.entity.promocode.PromoterSeriesConfig;

@Repository
public interface PromoterSeriesConfigRepository extends JpaRepository<PromoterSeriesConfig, Long> {
    // Custom query to find the latest series for a promoter type
    PromoterSeriesConfig findTopByPromoterTypeOrderBySeriesDesc(String promoterType);
    
    // Find by promoter type and series
    PromoterSeriesConfig findByPromoterTypeAndSeries(String promoterType, Integer series);

    // Custom query to find by ID, returning PromoterSeriesConfig directly
    @Query("SELECT p FROM PromoterSeriesConfig p WHERE p.id = ?1")
    PromoterSeriesConfig findByIdCustom(Long id);
}