//"src/main/resources/scripts/candle_spread_distribution.py"
package com.example.prog.datasource.service;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

@Service
public class PythonService {

	public JSONObject executePythonScript(String scriptPath, File jsonFile) {
	    String pythonCommand = "python " + scriptPath + " " + jsonFile.getAbsolutePath();
	    System.out.println("Executing: " + pythonCommand);

	    StringBuilder output = new StringBuilder();
	    StringBuilder error = new StringBuilder();
	    try {
	        Process process = Runtime.getRuntime().exec(pythonCommand);
	        BufferedReader stdOutput = new BufferedReader(new InputStreamReader(process.getInputStream()));
	        BufferedReader stdError = new BufferedReader(new InputStreamReader(process.getErrorStream()));

	        String line;
	        while ((line = stdOutput.readLine()) != null) {
	            output.append(line);
	        }
	        while ((line = stdError.readLine()) != null) {
	            error.append(line);
	        }

	        int exitCode = process.waitFor();
	        System.out.println("Python script exited with code: " + exitCode);
	        System.out.println("Python script output: " + output.toString());
	        System.out.println("Python script error: " + error.toString());

	        if (exitCode != 0) {
	            throw new RuntimeException("Python script failed. Error: " + error.toString());
	        }

	        return new JSONObject(output.toString());
	    } catch (Exception e) {
	        throw new RuntimeException("Error executing Python script", e);
	    }
	}
	
	public JSONObject executeSensexCalculator(File jsonFile, double percentChangeSensex) {
	    try {
	        // Construct the command with both arguments
	        // String command = "python src/main/resources/scripts/SensexCalculator.py " 
            String command = "python3 /app/PythonScript/EquityHub_Scripts/SensexCalculator.py" 
	                         + jsonFile.getAbsolutePath() + " " + percentChangeSensex;

	        Process process = Runtime.getRuntime().exec(command);
	        BufferedReader stdInput = new BufferedReader(new InputStreamReader(process.getInputStream()));
	        BufferedReader stdError = new BufferedReader(new InputStreamReader(process.getErrorStream()));

	        StringBuilder output = new StringBuilder();
	        String line;
	        while ((line = stdInput.readLine()) != null) {
	            output.append(line);
	        }

	        StringBuilder error = new StringBuilder();
	        while ((line = stdError.readLine()) != null) {
	            error.append(line);
	        }

	        int exitCode = process.waitFor();
	        if (exitCode != 0) {
	            throw new RuntimeException("Python script failed with error: " + error.toString());
	        }

	        return new JSONObject(output.toString());
	    } catch (Exception e) {
	        throw new RuntimeException("Error executing Python script", e);
	    }
	}



    public JSONObject executeCandleSpreadScript(File jsonFile) {
        // String scriptPath = "src/main/resources/scripts/candle_spread_distribution.py"; ///app/PythonScript/EquityHub_Scripts/SensexCalculator.py"
         String scriptPath = "/app/PythonScript/EquityHub_Scripts/candle_spread_distribution.py";
        return executePythonScript(scriptPath, jsonFile);
    }
    
    public JSONObject executeDeliveryRateGauge(File jsonFile) {
        // String scriptPath = "src/main/resources/scripts/delivery_rate_gauge.py";
        String scriptPath = "/app/PythonScript/EquityHub_Scripts/delivery_rate_gauge.py";
        return executePythonScript(scriptPath, jsonFile);
    }
    
    public JSONObject executeCreateAvgBoxPlot(File jsonFile) {
        // String scriptPath = "src/main/resources/scripts/create_avg_box_plot.py";
        String scriptPath = "/app/PythonScript/EquityHub_Scripts/create_avg_box_plot.py";
        return executePythonScript(scriptPath, jsonFile);
    }
    
    public JSONObject executeCandleBreach(File jsonFile) {
        // String scriptPath = "src/main/resources/scripts/candle_breach_analysis.py";
        String scriptPath = "/app/PythonScript/EquityHub_Scripts/candle_breach_analysis.py";
        return executePythonScript(scriptPath, jsonFile);
    }
    
    public JSONObject executeMacdPlot(File jsonFile) {
        // String scriptPath = "src/main/resources/scripts/create_macd_plot.py";
        String scriptPath = "/app/PythonScript/EquityHub_Scripts/create_macd_plot.py";
        return executePythonScript(scriptPath, jsonFile);
    }
    
    public JSONObject executeVolatilityPlot(File jsonFile) {
        // String scriptPath = "src/main/resources/scripts/create_volatility_plot.py";
        String scriptPath = "/app/PythonScript/EquityHub_Scripts/create_volatility_plot.py";
        return executePythonScript(scriptPath, jsonFile);
    }
    
    public JSONObject executeWormPlot(File jsonFile) {
        // String scriptPath = "src/main/resources/scripts/create_worm_plot.py";
        String scriptPath = "/app/PythonScript/EquityHub_Scripts/create_worm_plot.py";
        return executePythonScript(scriptPath, jsonFile);
    }
    
    public JSONObject executeSensexVsStockBars(File jsonFile, String stockSymbol) {
        // String scriptPath = "src/main/resources/scripts/sensex_vs_stock_corr_bar.py";
         String scriptPath = "/app/PythonScript/EquityHub_Scripts/sensex_vs_stock_corr_bar.py";
        String pythonCommand = "python " + scriptPath + " " + jsonFile.getAbsolutePath() + " " + stockSymbol;
        System.out.println("Executing: " + pythonCommand);

        StringBuilder output = new StringBuilder();
        StringBuilder error = new StringBuilder();
        try {
            Process process = Runtime.getRuntime().exec(pythonCommand);
            BufferedReader stdOutput = new BufferedReader(new InputStreamReader(process.getInputStream()));
            BufferedReader stdError = new BufferedReader(new InputStreamReader(process.getErrorStream()));

            String line;
            while ((line = stdOutput.readLine()) != null) {
                output.append(line);
            }
            while ((line = stdError.readLine()) != null) {
                error.append(line);
            }

            int exitCode = process.waitFor();
            System.out.println("Python script exited with code: " + exitCode);
            System.out.println("Python script output: " + output.toString());
            System.out.println("Python script error: " + error.toString());

            if (exitCode != 0) {
                throw new RuntimeException("Python script failed. Error: " + error.toString());
            }

            return new JSONObject(output.toString());
        } catch (Exception e) {
            throw new RuntimeException("Error executing Python script", e);
        }
    }

    public JSONObject executeSensexStockCorr(File jsonFile, String stockSymbol) {
        // String scriptPath = "src/main/resources/scripts/Sensex_Stock_Corr.py";
        String scriptPath = "/app/PythonScript/EquityHub_Scripts/Sensex_Stock_Corr.py";
        String pythonCommand = "python " + scriptPath + " " + jsonFile.getAbsolutePath() + " " + stockSymbol;
        System.out.println("Executing: " + pythonCommand);

        StringBuilder output = new StringBuilder();
        StringBuilder error = new StringBuilder();
        try {
            Process process = Runtime.getRuntime().exec(pythonCommand);
            BufferedReader stdOutput = new BufferedReader(new InputStreamReader(process.getInputStream()));
            BufferedReader stdError = new BufferedReader(new InputStreamReader(process.getErrorStream()));

            String line;
            while ((line = stdOutput.readLine()) != null) {
                output.append(line);
            }
            while ((line = stdError.readLine()) != null) {
                error.append(line);
            }

            int exitCode = process.waitFor();
            System.out.println("Python script exited with code: " + exitCode);
            System.out.println("Python script output: " + output.toString());
            System.out.println("Python script error: " + error.toString());

            if (exitCode != 0) {
                throw new RuntimeException("Python script failed. Error: " + error.toString());
            }

            return new JSONObject(output.toString());
        } catch (Exception e) {
            throw new RuntimeException("Error executing Python script", e);
        }
    }
    
    public JSONObject executeCorrHeatmap(File jsonFile, String stockSymbol) {
        // String scriptPath = "src/main/resources/scripts/corr_heatmap.py";
        String scriptPath = "/app/PythonScript/EquityHub_Scripts/corr_heatmap.py";
        String pythonCommand = "python " + scriptPath + " " + jsonFile.getAbsolutePath() + " " + stockSymbol;
        System.out.println("Executing: " + pythonCommand);

        StringBuilder output = new StringBuilder();
        StringBuilder error = new StringBuilder();
        try {
            Process process = Runtime.getRuntime().exec(pythonCommand);
            BufferedReader stdOutput = new BufferedReader(new InputStreamReader(process.getInputStream()));
            BufferedReader stdError = new BufferedReader(new InputStreamReader(process.getErrorStream()));

            String line;
            while ((line = stdOutput.readLine()) != null) {
                output.append(line);
            }
            while ((line = stdError.readLine()) != null) {
                error.append(line);
            }

            int exitCode = process.waitFor();
            System.out.println("Python script exited with code: " + exitCode);
            System.out.println("Python script output: " + output.toString());
            System.out.println("Python script error: " + error.toString());

            if (exitCode != 0) {
                throw new RuntimeException("Python script failed. Error: " + error.toString());
            }

            return new JSONObject(output.toString());
        } catch (Exception e) {
            throw new RuntimeException("Error executing Python script", e);
        }
    }
    
    public JSONObject executePctHlcPlot(File jsonFile) {
        // String scriptPath = "src/main/resources/scripts/pct_hlc_plot.py";
        String scriptPath = "src/main/resources/scripts/pct_hlc_plot.py";
        return executePythonScript(scriptPath, jsonFile);
    }

    public JSONObject executeLastTradedPriceBoxPlot(File jsonFile) {
        // String scriptPath = "src/main/resources/scripts/last_traded_price_box_plot.py";
        String scriptPath = "/app/PythonScript/EquityHub_Scripts/last_traded_price_box_plot.py";
        String pythonCommand = "python " + scriptPath + " " + jsonFile.getAbsolutePath() ;
        System.out.println("Executing: " + pythonCommand);

        StringBuilder output = new StringBuilder();
        try {
            Process process = Runtime.getRuntime().exec(pythonCommand);
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();
            System.out.println("Python script exited with code: " + exitCode);

            if (exitCode != 0) {
                throw new RuntimeException("Python script failed. Output: " + output.toString());
            }

            System.out.println("Python script output: " + output.toString());
            return new JSONObject(output.toString());
        } catch (Exception e) {
            throw new RuntimeException("Error executing Python script", e);
        }
    }
}
