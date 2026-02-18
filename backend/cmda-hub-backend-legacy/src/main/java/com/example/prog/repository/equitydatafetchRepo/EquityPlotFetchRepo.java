package com.example.prog.repository.equitydatafetchRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.prog.entity.equityDataFetch.EquityPlotFetch;



	
	@Repository
	public interface EquityPlotFetchRepo extends JpaRepository<EquityPlotFetch, Integer> {

	

//		boolean existsByUserTypeAndUserIDAndSymbolAndCompanyName(String userType, Integer userID, String symbol,
//				String companyName);

		Optional<EquityPlotFetch> findByUserTypeAndUserIDAndSymbolAndCompanyName(String userType, Integer userID,
				String symbol, String companyName);

		List<EquityPlotFetch> findByUserTypeAndUserID(String userType, Integer userID);

	}