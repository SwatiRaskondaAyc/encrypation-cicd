// package com.example.prog.indices.controller;

// import com.example.prog.indices.config.IndustriesProperties;
// import com.example.prog.indices.service.IndustryService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.net.URLDecoder;
// import java.nio.charset.StandardCharsets;
// import java.util.Arrays;
// import java.util.HashSet;
// import java.util.Set;

// @RestController
// @RequestMapping("/api/industries")
// public class IndustryDividendController {

//     @Autowired
//     private IndustryService industryService;

//     @Autowired
//     private IndustriesProperties industriesProperties;

//     // Pre-normalized set for O(1) lookup
//     private final Set<String> allowedNames = new HashSet<>();

//     // This runs in constructor → SAFE because String[] is injected
//     public IndustryDividendController(IndustriesProperties industriesProperties) {
//         this.industriesProperties = industriesProperties;
//         Arrays.stream(industriesProperties.getAllowed())
//                 .map(this::normalize)
//                 .forEach(allowedNames::add);
//     }

//     @GetMapping("/dividend")
//     public ResponseEntity<String> getDividendDetails(@RequestParam("name") String rawName) {
//         String decoded = URLDecoder.decode(rawName, StandardCharsets.UTF_8);
//         String normalized = normalize(decoded);

//         if (!allowedNames.contains(normalized)) {
//             return ResponseEntity.badRequest()
//                     .body("Invalid industry name: " + decoded);
//         }

//         return ResponseEntity.ok(industryService.getDividendDetails(decoded));
//     }

//     private String normalize(String s) {
//         return s.trim().replaceAll("\\s+", " ");
//     }
// }

// package com.example.prog.indices.controller;

// import com.example.prog.indices.config.IndustriesProperties;
// import com.example.prog.indices.service.IndustryService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.Arrays;
// import java.util.HashSet;
// import java.util.Set;

// @RestController
// @RequestMapping("/api/industries")
// public class IndustryDividendController {

//     private final IndustryService industryService;
//     private final Set<String> allowedNames = new HashSet<>();

//     @Autowired
//     public IndustryDividendController(IndustryService industryService, IndustriesProperties industriesProperties) {
//         this.industryService = industryService;
//         Arrays.stream(industriesProperties.getAllowed())
//                 .map(this::normalize)
//                 .forEach(allowedNames::add);
//     }

//     @GetMapping("/dividend")
//     public ResponseEntity<String> getDividendDetails(@RequestParam("name") String name) {
//         String normalized = normalize(name);

//         if (!allowedNames.contains(normalized)) {
//             return ResponseEntity.badRequest()
//                     .body("Invalid industry name: " + name);
//         }

//         String response = industryService.getDividendDetails(name);
//         return ResponseEntity.ok(response);
//     }

//     private String normalize(String s) {
//         return s.trim().replaceAll("\\s+", " ");
//     }
// }

package com.example.prog.indices.controller;

import com.example.prog.indices.service.IndustryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/industries")
public class IndustryDividendController {

    private final IndustryService industryService;

    @Autowired
    public IndustryDividendController(IndustryService industryService) {
        this.industryService = industryService;
    }

    @GetMapping("/dividend")
    public ResponseEntity<String> getDividendDetails(@RequestParam("name") String name) {
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Industry name is required.");
        }

        String response = industryService.getDividendDetails(name.trim());
        return ResponseEntity.ok(response);
    }
}
