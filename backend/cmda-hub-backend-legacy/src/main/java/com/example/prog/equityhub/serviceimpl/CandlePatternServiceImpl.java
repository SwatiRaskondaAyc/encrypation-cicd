package com.example.prog.equityhub.serviceimpl;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.prog.equityhub.service.CandlePatternService;

@Service
public class CandlePatternServiceImpl implements CandlePatternService {
	
	
	 	@Override
	    public ResponseEntity<Map<String, Object>> getCandlePatterns(String symbol) {
	       // String formattedSymbol = symbol + " - " + companyName;
	        try {
	            ProcessBuilder processBuilder = new ProcessBuilder( ///app/CandlestickPatternDetector
	                    // "python", "src/main/resources/CandlestickPatternDetector/pattern_visualizer.py", symbol
						"python3", "/app/CandlestickPatternDetector/pattern_visualizer.py", symbol
	            );
	            processBuilder.redirectErrorStream(true);
	            Process process = processBuilder.start();

	            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
	            StringBuilder output = new StringBuilder();
	            String line;
	            while ((line = reader.readLine()) != null) {
	                System.err.println("PYTHON ERROR: " + line);
	                output.append(line);
	            }

	            int exitCode = process.waitFor();
	            if (exitCode != 0) {
	                return ResponseEntity.status(500).body(Map.of("error", "Python script failed with exit code: " + exitCode));
	            }

	            JSONObject jsonResponse = new JSONObject(output.toString());
	            return ResponseEntity.ok(jsonResponse.toMap());

	        } catch (Exception e) {
	            return ResponseEntity.status(500).body(Map.of("error", "Error processing stock data: " + e.getMessage()));
	        }
	    }


}
