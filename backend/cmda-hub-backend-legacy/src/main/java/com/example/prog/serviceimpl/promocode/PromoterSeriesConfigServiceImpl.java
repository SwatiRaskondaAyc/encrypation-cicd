// package com.example.prog.serviceimpl.promocode;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import com.example.prog.entity.promocode.PromoterSeriesConfig;
// import com.example.prog.repository.promocode.PromoterSeriesConfigRepository;
// import com.example.prog.service.promocode.PromoterSeriesConfigService;

// import java.time.LocalDate;
// import java.util.List;

// @Service
// public class PromoterSeriesConfigServiceImpl implements PromoterSeriesConfigService {

//     @Autowired
//     private PromoterSeriesConfigRepository repository;

//     @Override
//     public PromoterSeriesConfig createPromoterSeriesConfig(PromoterSeriesConfig config) {
//         // Validate the manually provided series
//         if (config.getSeries() <= 0) {
//             throw new IllegalArgumentException("Series must be a positive integer");
//         }

//         // Check if a series with the same promoterType and series number already exists
//         PromoterSeriesConfig existing = repository.findByPromoterTypeAndSeries(
//             config.getPromoterType(), config.getSeries()
//         );
//         if (existing != null) {
//             throw new IllegalArgumentException(
//                 "Series " + config.getSeries() + " already exists for promoter type: " + config.getPromoterType()
//             );
//         }

//         // Save the config with the manually provided series
//         return repository.save(config);
//     }

//     @Override
//     public PromoterSeriesConfig getLatestSeriesForType(String promoterType) {
//         PromoterSeriesConfig config = repository.findTopByPromoterTypeOrderBySeriesDesc(promoterType);
//         if (config == null) {
//             throw new RuntimeException("No series found for promoter type: " + promoterType);
//         }
//         return config;
//     }

//     @Override
//     public List<PromoterSeriesConfig> getAllPromoterSeriesConfigs() {
//         return repository.findAll();
//     }

//     @Override
//     public PromoterSeriesConfig updateExpiry(Long id, LocalDate expiry) {
//         // Validate expiry date
//         if (expiry == null) {
//             throw new IllegalArgumentException("Expiry date cannot be null");
//         }
//         if (expiry.isBefore(LocalDate.now())) {
//             throw new IllegalArgumentException("Expiry date must be today or in the future");
//         }

//         // Find the record by ID using custom query
//         PromoterSeriesConfig config = repository.findByIdCustom(id);
//         if (config == null) {
//             throw new RuntimeException("PromoterSeriesConfig not found for ID: " + id);
//         }

//         // Update the expiry date
//         config.setExpiry(expiry);

//         // Save and return the updated record
//         return repository.save(config);
//     }
// }

package com.example.prog.serviceimpl.promocode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.prog.entity.promocode.PromoterSeriesConfig;
import com.example.prog.repository.promocode.PromoterSeriesConfigRepository;
import com.example.prog.service.promocode.PromoterSeriesConfigService;

import java.time.LocalDate;
import java.util.List;

@Service
public class PromoterSeriesConfigServiceImpl implements PromoterSeriesConfigService {

    @Autowired
    private PromoterSeriesConfigRepository repository;

    @Override
    public PromoterSeriesConfig createPromoterSeriesConfig(PromoterSeriesConfig config) {
        // Validate the manually provided series
        if (config.getSeries() <= 0) {
            throw new IllegalArgumentException("Series must be a positive integer");
        }

        // Check if a series with the same promoterType and series number already exists
        PromoterSeriesConfig existing = repository.findByPromoterTypeAndSeries(
            config.getPromoterType(), config.getSeries()
        );
        if (existing != null) {
            throw new IllegalArgumentException(
                "Series " + config.getSeries() + " already exists for promoter type: " + config.getPromoterType()
            );
        }

        // Save the config with the manually provided series
        return repository.save(config);
    }

    @Override
    public PromoterSeriesConfig getLatestSeriesForType(String promoterType) {
        PromoterSeriesConfig config = repository.findTopByPromoterTypeOrderBySeriesDesc(promoterType);
        if (config == null) {
            throw new RuntimeException("No series found for promoter type: " + promoterType);
        }
        return config;
    }

    @Override
    public List<PromoterSeriesConfig> getAllPromoterSeriesConfigs() {
        return repository.findAll();
    }

    @Override
    public PromoterSeriesConfig updateExpiry(Long id, LocalDate expiry) {
        // Validate expiry date
        if (expiry == null) {
            throw new IllegalArgumentException("Expiry date cannot be null");
        }
        if (expiry.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Expiry date must be today or in the future");
        }

        // Find the record by ID using custom query
        PromoterSeriesConfig config = repository.findByIdCustom(id);
        if (config == null) {
            throw new RuntimeException("PromoterSeriesConfig not found for ID: " + id);
        }

        // Update the expiry date
        config.setExpiry(expiry);

        // Save and return the updated record
        return repository.save(config);
    }

    // New implementation: Get config by promoterType and series
    @Override
    public PromoterSeriesConfig getConfigByTypeAndSeries(String promoterType, Integer series) {
        PromoterSeriesConfig config = repository.findByPromoterTypeAndSeries(promoterType, series);
        if (config == null) {
            throw new RuntimeException("No series config found for promoter type: " + promoterType + ", series: " + series);
        }
        return config;
    }
}