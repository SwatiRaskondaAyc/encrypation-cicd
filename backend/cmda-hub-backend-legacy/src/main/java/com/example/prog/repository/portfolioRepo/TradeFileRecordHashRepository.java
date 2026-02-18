// package com.example.prog.repository.portfolioRepo;

// import java.util.Optional;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// import com.example.prog.entity.portfolio.TradeFileRecordHash;

// @Repository
// public interface TradeFileRecordHashRepository extends JpaRepository<TradeFileRecordHash, Long> {

//     // Check for duplicate file hash by user and platform
//     boolean existsByUserIdAndPlatformAndTradeFileHash(int userId, String platform, String tradeFileHash);

//     // Optional: to fetch existing record
//     Optional<TradeFileRecordHash> findByUserIdAndPlatformAndTradeFileHash(int userId, String platform, String tradeFileHash);
    
//     Optional<TradeFileRecordHash> findByUserIdAndPlatform(int userId, String platform);
// }

package com.example.prog.repository.portfolioRepo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.prog.entity.portfolio.TradeFileRecordHash;

@Repository
public interface TradeFileRecordHashRepository extends JpaRepository<TradeFileRecordHash, Long> {

    // Check for duplicate file hash by user and platform
    boolean existsByUserIdAndPlatformAndTradeFileHash(int userId, String platform, String tradeFileHash);

    // Optional: to fetch existing record
    Optional<TradeFileRecordHash> findByUserIdAndPlatformAndTradeFileHash(int userId, String platform, String tradeFileHash);
    
    Optional<TradeFileRecordHash> findByUserIdAndPlatform(int userId, String platform);
    
    // ✅ NEW: Fetch by uploadID
    Optional<TradeFileRecordHash> findByUploadId(String uploadId);

    // ✅ NEW: Delete by uploadID
    void deleteByUploadId(String uploadId);
}