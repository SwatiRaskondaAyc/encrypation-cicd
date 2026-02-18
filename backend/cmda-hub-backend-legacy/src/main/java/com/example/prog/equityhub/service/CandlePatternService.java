package com.example.prog.equityhub.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;

public interface CandlePatternService {

	ResponseEntity<Map<String, Object>> getCandlePatterns(String symbol);
	
}