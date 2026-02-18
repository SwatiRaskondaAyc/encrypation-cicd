// package com.example.prog.controller.sector;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import java.io.BufferedReader;
// import java.io.InputStreamReader;
// import java.util.stream.Collectors;

// @RestController
// @RequestMapping("/api/landpage")
// public class SectorSummaryController {

//     @GetMapping("/sector-summary")
//     public ResponseEntity<?> getSectorSummary() { //app/PythonScript/Portfolio
//         try {
//             // Replace with the actual path to your Python executable and script
//             // ProcessBuilder builder = new ProcessBuilder("python", "src/main/resources/cmda_Landing_page/Sector_info.py");
//             ProcessBuilder builder = new ProcessBuilder("python3", "/app/PythonScript/cmda_Landing_page/Sector_info.py");
            
//             builder.redirectErrorStream(true);  // Merge error with output

//             Process process = builder.start();

//             // Read the output from the Python script
//             BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
// //            String output = reader.lines().collect(Collectors.joining("\n"));
//             StringBuilder output = new StringBuilder();
//           String line;
//           while ((line = reader.readLine()) != null) {
//           	System.out.println("Python Output: " + line);
//               output.append(line);
//           }

//             int exitCode = process.waitFor();
//             if (exitCode != 0) {
//                 return ResponseEntity.status(500).body("Python script exited with code " + exitCode);
//             }

//             // Output is already in JSON format from Python
//             return ResponseEntity.ok().body(output);

//         } catch (Exception e) {
//             return ResponseEntity.status(500).body("Error running Python script: " + e.getMessage());
//         }
//     }
// }

// package com.example.prog.controller.landingpage;

// import com.example.prog.service.landingpage.LandingPageService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
// import com.fasterxml.jackson.databind.ObjectMapper;

// @RestController
// @RequestMapping("/api/landpage")
// // @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
// public class LandPageController {

//     @Autowired
//     private LandingPageService landPageService;

//     @GetMapping("/sector-summary")
//     public ResponseEntity<Object> getSectorSummary() {
//         System.out.println("Received request for /api/landpage/sector-summary");
//         try {
//             Object result = landPageService.getSectorSummary();
//             System.out.println("Successfully fetched sector summary data");
//             // Log the result to the console
//             ObjectMapper objectMapper = new ObjectMapper();
//             String resultJson = objectMapper.writeValueAsString(result);
//             System.out.println("Sector Summary Data: " + resultJson);
//             return ResponseEntity.ok(result);
//         } catch (Exception e) {
//             System.err.println("Error executing Python script: " + e.getMessage());
//             e.printStackTrace();
//             return ResponseEntity.status(500).body("Error executing Python script: " + e.getMessage());
//         }
//     }
// }


// --- // --- New endpoint Industry Divident Yeild (Added by Shreya)

package com.example.prog.controller.landingpage;

import com.example.prog.service.landingpage.LandingPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/landpage")
public class LandPageController {

    @Autowired
    private LandingPageService landPageService;

    @GetMapping("/sector-summary")
    public ResponseEntity<Object> getSectorSummary() {
        return fetchAndLog("Sector Summary", () -> landPageService.getSectorSummary());
    }

    @GetMapping("/industry-dividend-yield")
    public ResponseEntity<Object> getIndustryDividendYield() {
        return fetchAndLog("Industry Dividend Yield", () -> landPageService.getIndustryDividendYield());
    }

    private ResponseEntity<Object> fetchAndLog(String label, ApiCall apiCall) {
        System.out.println("Received request for " + label);
        try {
            Object result = apiCall.call();
            ObjectMapper mapper = new ObjectMapper();
            System.out.println(label + " Data: " + mapper.writeValueAsString(result));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error fetching " + label + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching " + label + ": " + e.getMessage());
        }
    }

    @FunctionalInterface
    private interface ApiCall {
        Object call() throws Exception;
    }
}
