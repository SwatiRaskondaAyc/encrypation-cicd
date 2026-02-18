

package com.example.prog.repository;

import com.example.prog.entity.TotalPlatformUsageCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TotalPlatformUsageCountRepository extends JpaRepository<TotalPlatformUsageCount, Long> {
    Optional<TotalPlatformUsageCount> findByPlatform(String platform);
}