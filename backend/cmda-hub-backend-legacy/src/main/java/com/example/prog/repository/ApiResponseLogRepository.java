package com.example.prog.repository;

import com.example.prog.entity.ApiResponseLog;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApiResponseLogRepository extends JpaRepository<ApiResponseLog, Long> {

	List<ApiResponseLog> findByIpAddress(String ipAddress);
	List<ApiResponseLog> findByResponseCode(Integer responseCode);
	List<ApiResponseLog> findByEndpointContaining(String keyword);
}
