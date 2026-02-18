package com.example.prog.datasource.service;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class PortfolioService {

    // Method to execute the Python script and return the plot data
    public JSONObject executePlotScript(String symbol, String plotType) {
        try {
            // Build the command to execute the Python script with arguments
            // ProcessBuilder processBuilder = new ProcessBuilder(
            //         "python", 
            //         "src/main/resources/scripts/generate_plot.py",  symbol , symbol 
                    
            // );
            ProcessBuilder processBuilder = new ProcessBuilder(
            "python3", "/app/PythonScript/EquityHub_Scripts/generate_plot.py", symbol, symbol);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            // Capture the Python script's output
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            // Check the process's exit status
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Python script execution failed with exit code " + exitCode);
            }

            // Convert the output to JSON and return
            return new JSONObject(output.toString());
        } catch (Exception e) {
            throw new RuntimeException("Error executing Python script", e);
        }
    }
}
