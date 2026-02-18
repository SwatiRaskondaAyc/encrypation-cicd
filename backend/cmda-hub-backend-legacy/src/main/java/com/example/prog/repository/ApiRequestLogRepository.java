// package com.example.prog.repository;

// import com.example.prog.entity.ApiRequestLog;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// @Repository
// public interface ApiRequestLogRepository extends JpaRepository<ApiRequestLog, Long> {
	
// }


package com.example.prog.repository;

import com.example.prog.entity.ApiRequestLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApiRequestLogRepository extends JpaRepository<ApiRequestLog, Long> {

	Optional<ApiRequestLog> findTopByEmailAndIpAddressAndEndpointAndHttpMethodAndTimestampAfter(
		    String email,
		    String ipAddress,
		    String endpoint,
		    String httpMethod,
		    LocalDateTime after
		);
	
	@Query("SELECT DISTINCT a.ipAddress FROM ApiRequestLog a WHERE a.isSuspicious = true")
	List<String> findSuspiciousIps();
	
	@Modifying
	@Query("UPDATE ApiRequestLog a SET a.isSuspicious = false WHERE a.ipAddress = :ip")
	void resetSuspiciousFlagByIp(@Param("ip") String ip);
	
	@Modifying
	@Query("UPDATE ApiRequestLog a SET a.requestCount = 1 WHERE a.ipAddress = :ip AND a.endpoint = :endpoint")
	void resetRequestCountByIpAndEndpoint(@Param("ip") String ip, @Param("endpoint") String endpoint);
	
	@Modifying
	@Query("UPDATE ApiRequestLog a SET a.requestCount = 1 WHERE a.ipAddress = :ip")
	void resetRequestCountByIp(@Param("ip") String ip);
	
	List<ApiRequestLog> findByTimestampBefore(LocalDateTime cutoff);
	
	// Fetch all logs ordered by latest first
	List<ApiRequestLog> findAllByOrderByTimestampDesc();

	// Fetch logs by IP
	List<ApiRequestLog> findByIpAddressOrderByTimestampDesc(String ipAddress);

	// Fetch suspicious logs only
	List<ApiRequestLog> findByIsSuspiciousTrueOrderByTimestampDesc();

	// Fetch logs within a time range
	List<ApiRequestLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

	// Search logs by endpoint (for filtering/search in frontend)
	List<ApiRequestLog> findByEndpointContainingIgnoreCase(String keyword);
}