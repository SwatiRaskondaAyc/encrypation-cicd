//package com.example.prog.controller.dashboard;
//
//
//import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
//import com.example.prog.service.dashboard.DashboardMasterService;
//import jakarta.servlet.http.HttpServletRequest;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/dashboard")
//public class DashboardMasterController {
//
//    private static final Logger logger = LoggerFactory.getLogger(DashboardMasterController.class);
//
//    @Autowired
//    private DashboardMasterService dashboardService;
//
//    @PostMapping("/save")
//    @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//    public ResponseEntity<Map<String, Object>> saveDashboard(
//            @RequestBody DashboardSaveRequestDTO requestDTO,
//            HttpServletRequest request) {
//        logger.info("Received save dashboard request for dashboardName: {}", 
//                    requestDTO.getDashboard().getDashboardName());
//
//        Map<String, Object> response = dashboardService.saveDashboard(requestDTO, request);
//        return createResponseEntity(response);
//    }
//
//
//    
//    @GetMapping("/fetch")
//    @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//    public ResponseEntity<Map<String, Object>> fetchDashboards(HttpServletRequest request) {
//        logger.info("Received fetch dashboards request");
//        Map<String, Object> response = dashboardService.fetchDashboards(request);
//        return createResponseEntity(response);
//    }
//
//    @DeleteMapping("/delete/{dashId}")
//    @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//    public ResponseEntity<Map<String, Object>> deleteDashboard(
//            @PathVariable("dashId") int dashId,
//            HttpServletRequest request) {
//        logger.info("Received delete dashboard request for dashId: {}", dashId);
//        Map<String, Object> response = dashboardService.deleteDashboard(dashId, request);
//        return createResponseEntity(response);
//    }
//
//    private ResponseEntity<Map<String, Object>> createResponseEntity(Map<String, Object> response) {
//        if (response.containsKey("error")) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//        }
//        return ResponseEntity.ok(response);
//    }
//
//}










//package com.example.prog.controller.dashboard;
//
//import com.example.prog.config.dashboard.DashboardConfig;
//import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
//import com.example.prog.service.dashboard.DashboardMasterService;
//import com.example.prog.utils.DashboardUtils;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.validation.Valid;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/dashboard")
//public class DashboardMasterController {
//
//    private static final Logger logger = LoggerFactory.getLogger(DashboardMasterController.class);
//
//    @Autowired
//    private DashboardMasterService dashboardService;
//
//    @PostMapping("/save")
//    @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//    public ResponseEntity<Map<String, Object>> saveDashboard(
//            @Valid @RequestBody DashboardSaveRequestDTO requestDTO,
//            HttpServletRequest request) {
//        logger.info("Received save dashboard request for dashboardName: {}", 
//                    requestDTO.getDashboard().getDashboardName());
//        Map<String, Object> response = dashboardService.saveDashboard(requestDTO, request);
//        return createResponseEntity(response);
//    }
//
//    @GetMapping("/fetch")
//    @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//    public ResponseEntity<Map<String, Object>> fetchDashboards(HttpServletRequest request) {
//        logger.info("Received fetch dashboards request");
//        Map<String, Object> response = dashboardService.fetchDashboards(request);
//        return createResponseEntity(response);
//    }
//
//    @DeleteMapping("/delete/{dashId}")
//    @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//    public ResponseEntity<Map<String, Object>> deleteDashboard(
//            @PathVariable("dashId") int dashId,
//            HttpServletRequest request) {
//        logger.info("Received delete dashboard request for dashId: {}", dashId);
//        Map<String, Object> response = dashboardService.deleteDashboard(dashId, request);
//        return createResponseEntity(response);
//    }
//
//    @GetMapping("/{dashId}")
//    public ResponseEntity<?> getDashboard(
//            @PathVariable("dashId") int dashId,
//            HttpServletRequest request) {
//        logger.info("Received request for dashboard with dashId: {}", dashId);
//        String authHeader = request.getHeader("Authorization");
//        boolean isAuthenticated = false;
//
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            try {
//                Map<String, Object> response = dashboardService.fetchDashboardById(dashId, request);
//                return ResponseEntity.ok(response);
//            } catch (Exception e) {
//                logger.warn("Authentication failed or dashboard not accessible: {}", e.getMessage());
//            }
//        }
//
//        // Unauthorized access: serve screenshot
//        try {
//            byte[] screenshot = DashboardUtils.readScreenshot(dashId, DashboardConfig.getDashboardStoragePath());
//            return ResponseEntity.ok()
//                    .contentType(MediaType.IMAGE_PNG)
//                    .body(screenshot);
//        } catch (Exception e) {
//            logger.error("Failed to serve screenshot for dashId: {}: {}", dashId, e.getMessage());
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(Map.of("error", "Dashboard or screenshot not found"));
//        }
//    }
//
//    private ResponseEntity<Map<String, Object>> createResponseEntity(Map<String, Object> response) {
//        if (response.containsKey("error")) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//        }
//        return ResponseEntity.ok(response);
//    }
//}


///--------------------------Swati's code -----------------------------------'

// package com.example.prog.controller.dashboard;

// import com.example.prog.config.dashboard.DashboardConfig;
// import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
// import com.example.prog.service.dashboard.DashboardMasterService;
// import com.example.prog.utils.DashboardUtils;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.validation.Valid;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.*;

// import java.util.Map;

// @RestController
// @RequestMapping("/api/dashboard")
// public class DashboardMasterController {

//     private static final Logger logger = LoggerFactory.getLogger(DashboardMasterController.class);

    // @Autowired
    // private DashboardMasterService dashboardService;

//     @PostMapping("/save")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> saveDashboard(
//             @Valid @RequestBody DashboardSaveRequestDTO requestDTO,
//             HttpServletRequest request) {
//         logger.info("Received save dashboard request for dashboardName: {}", 
//                     requestDTO.getDashboard().getDashboardName());
//         Map<String, Object> response = dashboardService.saveDashboard(requestDTO, request);
//         return createResponseEntity(response);
//     }

//     @GetMapping("/fetch")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> fetchDashboards(HttpServletRequest request) {
//         logger.info("Received fetch dashboards request");
//         Map<String, Object> response = dashboardService.fetchDashboards(request);
//         return createResponseEntity(response);
//     }

//     @DeleteMapping("/delete/{dashId}")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> deleteDashboard(
//             @PathVariable("dashId") int dashId,
//             HttpServletRequest request) {
//         logger.info("Received delete dashboard request for dashId: {}", dashId);
//         Map<String, Object> response = dashboardService.deleteDashboard(dashId, request);
//         return createResponseEntity(response);
//     }

//     @GetMapping("/{dashId}")
//     public ResponseEntity<?> getDashboard(
//             @PathVariable("dashId") int dashId,
//             HttpServletRequest request) {
//         logger.info("Received request for dashboard with dashId: {}", dashId);
//         String authHeader = request.getHeader("Authorization");
//         boolean isAuthenticated = false;

//         if (authHeader != null && authHeader.startsWith("Bearer ")) {
//             try {
//                 Map<String, Object> response = dashboardService.fetchDashboardById(dashId, request);
//                 return ResponseEntity.ok(response);
//             } catch (Exception e) {
//                 logger.warn("Authentication failed or dashboard not accessible: {}", e.getMessage());
//             }
//         }

//         // Unauthorized access: serve screenshot
//         try {
//             byte[] screenshot = DashboardUtils.readScreenshot(dashId, DashboardConfig.getDashboardStoragePath());
//             return ResponseEntity.ok()
//                     .contentType(MediaType.IMAGE_PNG)
//                     .body(screenshot);
//         } catch (Exception e) {
//             logger.error("Failed to serve screenshot for dashId: {}: {}", dashId, e.getMessage());
//             return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                     .body(Map.of("error", "Dashboard or screenshot not found"));
//         }
//     }

//     @GetMapping("/public/{dashId}")
//     public ResponseEntity<?> getPublicDashboard(@PathVariable("dashId") int dashId) {
//         logger.info("Received public request for dashboard with dashId: {}", dashId);
//         try {
//             Map<String, Object> response = dashboardService.fetchPublicDashboard(dashId);
//             return ResponseEntity.ok(response);
//         } catch (Exception e) {
//             logger.error("Failed to fetch public dashboard for dashId: {}: {}", dashId, e.getMessage());
//             return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                     .body(Map.of("error", "Dashboard not found"));
//         }
//     }
    
//     @PostMapping("/snapshot/{dashId}")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> takeSnapshot(
//             @PathVariable("dashId") int dashId,
//             @RequestBody Map<String, String> requestBody,
//             HttpServletRequest request) {
//         logger.info("Received snapshot request for dashId: {}", dashId);
//         String base64Screenshot = requestBody.get("screenshot");
//         if (base64Screenshot == null || base64Screenshot.isEmpty()) {
//             logger.error("No screenshot provided for dashId: {}", dashId);
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                     .body(Map.of("error", "No screenshot provided"));
//         }
//         Map<String, Object> response = dashboardService.saveSnapshot(dashId, base64Screenshot, request);
//         return createResponseEntity(response);
//     }

//     private ResponseEntity<Map<String, Object>> createResponseEntity(Map<String, Object> response) {
//         if (response.containsKey("error")) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//         }
//         return ResponseEntity.ok(response);
//     }
// }













//------------------------------------friday-----------------


// package com.example.prog.controller.dashboard;

// import com.example.prog.config.dashboard.DashboardConfig;
// import com.example.prog.dto.dashboard.DashboardSaveRequestDTO;
// import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
// import com.example.prog.service.dashboard.DashboardMasterService;
// import com.example.prog.serviceimpl.dashboard.DashboardMasterServiceImpl;
// import com.example.prog.utils.DashboardUtils;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.validation.Valid;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.*;
// import java.io.IOException;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/dashboard")
// public class DashboardMasterController {

//     private static final Logger logger = LoggerFactory.getLogger(DashboardMasterController.class);
//       private final DashboardMasterServiceImpl dashboardMasterService;
//     private final DashboardUtils dashboardUtils;
//     private final DashboardConfig dashboardConfig;

//     @Autowired
//     public DashboardMasterController(DashboardMasterServiceImpl dashboardMasterService,
//                                      DashboardUtils dashboardUtils,
//                                      DashboardConfig dashboardConfig) {
//         this.dashboardMasterService = dashboardMasterService;
//         this.dashboardUtils = dashboardUtils;
//         this.dashboardConfig = dashboardConfig;
//     }

//     @DeleteMapping("/delete/{dashId}")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> deleteDashboard(
//             @PathVariable("dashId") int dashId,
//             HttpServletRequest request) {
//         logger.info("Received delete dashboard request for dashId: {}", dashId);
//         Map<String, Object> response = dashboardService.deleteDashboard(dashId, request);
//         return createResponseEntity(response);
//     }

//     @GetMapping("/{dashId}")
//     public ResponseEntity<?> getDashboard(
//             @PathVariable("dashId") int dashId,
//             HttpServletRequest request) {
//         logger.info("Received request for dashboard with dashId: {}", dashId);
//         String authHeader = request.getHeader("Authorization");
//         boolean isAuthenticated = false;

//         if (authHeader != null && authHeader.startsWith("Bearer ")) {
//             try {
//                 Map<String, Object> response = dashboardService.fetchDashboardById(dashId, request);
//                 return ResponseEntity.ok(response);
//             } catch (Exception e) {
//                 logger.warn("Authentication failed or dashboard not accessible: {}", e.getMessage());
//             }
//         }

//         // Unauthorized access: serve screenshot
//         try {
//             byte[] screenshot = DashboardUtils.readScreenshot(dashId, DashboardConfig.getDashboardStoragePath());
//             return ResponseEntity.ok()
//                     .contentType(MediaType.IMAGE_PNG)
//                     .body(screenshot);
//         } catch (Exception e) {
//             logger.error("Failed to serve screenshot for dashId: {}: {}", dashId, e.getMessage());
//             return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                     .body(Map.of("error", "Dashboard or screenshot not found"));
//         }
//     }

//     @GetMapping("/public/{dashId}")
//     public ResponseEntity<?> getPublicDashboard(@PathVariable int dashId) {
//         logger.info("Fetching public dashboard with dashId: {}", dashId);
//         try {
//             byte[] screenshot = dashboardUtils.readScreenshot(dashId, dashboardConfig.getDashboardStoragePath());
//             HttpHeaders headers = new HttpHeaders();
//             headers.setContentType(MediaType.IMAGE_PNG);
//             return new ResponseEntity<>(screenshot, headers, HttpStatus.OK);
//         } catch (IOException e) {
//             logger.error("Error fetching public dashboard screenshot for dashId {}: {}", dashId, e.getMessage());
//             return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                     .body(Map.of("error", "Screenshot not found: " + e.getMessage()));
//         }
//     }
    
//     @PostMapping("/snapshot/{dashId}")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> takeSnapshot(
//             @PathVariable("dashId") int dashId,
//             @RequestBody Map<String, String> requestBody,
//             HttpServletRequest request) {
//         logger.info("Received snapshot request for dashId: {}", dashId);
//         String base64Screenshot = requestBody.get("screenshot");
//         if (base64Screenshot == null || base64Screenshot.isEmpty()) {
//             logger.error("No screenshot provided for dashId: {}", dashId);
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                     .body(Map.of("error", "No screenshot provided"));
//         }
//         Map<String, Object> response = dashboardService.saveSnapshot(dashId, base64Screenshot, request);
//         return createResponseEntity(response);
//     }

//     private ResponseEntity<Map<String, Object>> createResponseEntity(Map<String, Object> response) {
//         if (response.containsKey("error")) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//         }
//         return ResponseEntity.ok(response);
//     }
// }



//-------------------------------20/6/25 Working---------------


// package com.example.prog.controller.dashboard;

// import com.example.prog.config.dashboard.DashboardConfig;
// import com.example.prog.serviceimpl.dashboard.DashboardMasterServiceImpl;
// import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
// import com.example.prog.service.dashboard.DashboardMasterService;
// import com.example.prog.utils.DashboardUtils;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.validation.Valid;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.*;

// import java.io.IOException;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/dashboard")
// public class DashboardMasterController {

//     private static final Logger logger = LoggerFactory.getLogger(DashboardMasterController.class);
//     private final DashboardMasterServiceImpl dashboardMasterService;
//     private final DashboardUtils dashboardUtils;
//     private final DashboardConfig dashboardConfig;

//     @Autowired
//     public DashboardMasterController(DashboardMasterServiceImpl dashboardMasterService,
//                                          DashboardUtils dashboardUtils,
//                                          DashboardConfig dashboardConfig) {
//         this.dashboardMasterService = dashboardMasterService;
//         this.dashboardUtils = dashboardUtils;
//         this.dashboardConfig = dashboardConfig;


//     }


//     @Autowired
//     private DashboardMasterService dashboardService;

//     private static final String DASHBOARD_STORAGE_PATH = "DashboardLogs/";
    
//      @PostMapping("/save")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> saveDashboard(
//             @Valid @RequestBody DashboardSaveRequestDTO requestDTO,
//             HttpServletRequest request) {
//         logger.info("Received save dashboard request for dashboardName: {}", 
//                     requestDTO.getDashboard().getDashboardName());
//         Map<String, Object> response = dashboardService.saveDashboard(requestDTO, request);
//         return createResponseEntity(response);
//     }

//     @GetMapping("/fetch")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> fetchDashboards(HttpServletRequest request) {
//         logger.info("Received fetch dashboards request");
//         Map<String, Object> response = dashboardService.fetchDashboards(request);
//         return createResponseEntity(response);
//     }

//     @DeleteMapping("/delete/{dashId}")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> deleteDashboard(
//             @PathVariable("dashId") int dashId,
//             HttpServletRequest request) {
//         logger.info("Received delete dashboard request for dashId: {}", dashId);
//         Map<String, Object> response = dashboardMasterService.deleteDashboard(dashId, request);
//         return createResponseEntity(response);
//     }

//     @GetMapping("/{dashId}")
//     public ResponseEntity<?> getDashboard(
//             @PathVariable int dashId,
//             HttpServletRequest request) {
//         logger.info("Received request for dashboard with dashId: {}", dashId);
//         String authHeader = request.getHeader("Authorization");
//         boolean isAuthenticated = false;

//         if (authHeader != null && authHeader.startsWith("Bearer ")) {
//             try {
//                 Map<String, Object> response = dashboardMasterService.fetchDashboardById(dashId, request);
//                 return ResponseEntity.ok(response);
//             } catch (Exception e) {
//                 logger.warn("Authentication failed or dashboard not accessible: {}", e.getMessage());
//             }
//         }

//         // Unauthorized access: serve screenshot
//         try {
//             byte[] screenshot = dashboardUtils.readScreenshot(dashId, dashboardConfig.getDashboardStoragePath());
//             return ResponseEntity.ok()
//                     .contentType(MediaType.IMAGE_PNG)
//                     .body(screenshot);
//         } catch (Exception e) {
//             logger.error("Failed to serve screenshot for dashId: {}: {}", dashId, e.getMessage());
//             return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                     .body(Map.of("error", "Dashboard or screenshot not found"));
//         }
//     }

//     @GetMapping("/public/{dashId}")
//     public ResponseEntity<?> getPublicDashboard(@PathVariable int dashId) {
//         logger.info("Fetching public dashboard with dashId: {}", dashId);
//         try {
//             byte[] screenshot = dashboardUtils.readScreenshot(dashId, dashboardConfig.getDashboardStoragePath());
//             HttpHeaders headers = new HttpHeaders();
//             headers.setContentType(MediaType.IMAGE_PNG);
//             return new ResponseEntity<>(screenshot, headers, HttpStatus.OK);
//         } catch (IOException e) {
//             logger.error("Error fetching public dashboard screenshot for dashId {}: {}", dashId, e.getMessage());
//             return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                     .body(Map.of("error", "Screenshot not found: " + e.getMessage()));
//         }
//     }
    
//     @PostMapping("/snapshot/{dashId}")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> takeSnapshot(
//             @PathVariable("dashId") int dashId,
//             @RequestBody Map<String, String> requestBody,
//             HttpServletRequest request) {
//         logger.info("Received snapshot request for dashId: {}", dashId);
//         String base64Screenshot = requestBody.get("screenshot");
//         if (base64Screenshot == null || base64Screenshot.isEmpty()) {
//             logger.error("No screenshot provided for dashId: {}", dashId);
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                     .body(Map.of("error", "No screenshot provided"));
//         }
//         Map<String, Object> response = dashboardMasterService.saveSnapshot(dashId, base64Screenshot, request);
//         return createResponseEntity(response);
//     }

//     private ResponseEntity<Map<String, Object>> createResponseEntity(Map<String, Object> response) {
//         if (response.containsKey("error")) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//         }
//         return ResponseEntity.ok(response);
//     }
// }


//----------------04/07/25 working -------------------------

// package com.example.prog.controller.dashboard;

// import com.example.prog.config.dashboard.DashboardConfig;
// import com.example.prog.serviceimpl.dashboard.DashboardMasterServiceImpl;
// import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
// import com.example.prog.service.dashboard.DashboardMasterService;
// import com.example.prog.utils.DashboardUtils;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.validation.Valid;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.*;

// import java.io.IOException;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/dashboard")
// public class DashboardMasterController {

//     private static final Logger logger = LoggerFactory.getLogger(DashboardMasterController.class);
//     private final DashboardMasterServiceImpl dashboardMasterService;
//     private final DashboardUtils dashboardUtils;
//     private final DashboardConfig dashboardConfig;

//     @Autowired
//     public DashboardMasterController(DashboardMasterServiceImpl dashboardMasterService,
//                                          DashboardUtils dashboardUtils,
//                                          DashboardConfig dashboardConfig) {
//         this.dashboardMasterService = dashboardMasterService;
//         this.dashboardUtils = dashboardUtils;
//         this.dashboardConfig = dashboardConfig;


//     }


//     @Autowired
//     private DashboardMasterService dashboardService;

//     private static final String DASHBOARD_STORAGE_PATH = "DashboardLogs/";
    
//      @PostMapping("/save")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> saveDashboard(
//             @Valid @RequestBody DashboardSaveRequestDTO requestDTO,
//             HttpServletRequest request) {
//         logger.info("Received save dashboard request for dashboardName: {}", 
//                     requestDTO.getDashboard().getDashboardName());
//         Map<String, Object> response = dashboardService.saveDashboard(requestDTO, request);
//         return createResponseEntity(response);
//     }

//     @GetMapping("/fetch")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> fetchDashboards(HttpServletRequest request) {
//         logger.info("Received fetch dashboards request");
//         Map<String, Object> response = dashboardService.fetchDashboards(request);
//         return createResponseEntity(response);
//     }

//     @DeleteMapping("/delete/{dashId}")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> deleteDashboard(
//             @PathVariable("dashId") int dashId,
//             HttpServletRequest request) {
//         logger.info("Received delete dashboard request for dashId: {}", dashId);
//         Map<String, Object> response = dashboardMasterService.deleteDashboard(dashId, request);
//         return createResponseEntity(response);
//     }

//     @GetMapping("/{dashId}")
//     public ResponseEntity<?> getDashboard(
//             @PathVariable int dashId,
//             HttpServletRequest request) {
//         logger.info("Received request for dashboard with dashId: {}", dashId);
//         String authHeader = request.getHeader("Authorization");
//         boolean isAuthenticated = false;

//         if (authHeader != null && authHeader.startsWith("Bearer ")) {
//             try {
//                 Map<String, Object> response = dashboardMasterService.fetchDashboardById(dashId, request);
//                 return ResponseEntity.ok(response);
//             } catch (Exception e) {
//                 logger.warn("Authentication failed or dashboard not accessible: {}", e.getMessage());
//             }
//         }

//         // Unauthorized access: serve screenshot
//         try {
//             byte[] screenshot = dashboardUtils.readScreenshot(dashId, dashboardConfig.getDashboardStoragePath());
//             return ResponseEntity.ok()
//                     .contentType(MediaType.IMAGE_PNG)
//                     .body(screenshot);
//         } catch (Exception e) {
//             logger.error("Failed to serve screenshot for dashId: {}: {}", dashId, e.getMessage());
//             return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                     .body(Map.of("error", "Dashboard or screenshot not found"));
//         }
//     }

//     @GetMapping("/public/{dashId}")
//     public ResponseEntity<?> getPublicDashboard(@PathVariable int dashId) {
//         logger.info("Fetching public dashboard with dashId: {}", dashId);
//         try {
//             byte[] screenshot = dashboardUtils.readScreenshot(dashId, dashboardConfig.getDashboardStoragePath());
//             HttpHeaders headers = new HttpHeaders();
//             headers.setContentType(MediaType.IMAGE_PNG);
//             return new ResponseEntity<>(screenshot, headers, HttpStatus.OK);
//         } catch (IOException e) {
//             logger.error("Error fetching public dashboard screenshot for dashId {}: {}", dashId, e.getMessage());
//             return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                     .body(Map.of("error", "Screenshot not found: " + e.getMessage()));
//         }
//     }
    
//     @PostMapping("/snapshot/{dashId}")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> takeSnapshot(
//             @PathVariable("dashId") int dashId,
//             @RequestBody Map<String, String> requestBody,
//             HttpServletRequest request) {
//         logger.info("Received snapshot request for dashId: {}", dashId);
//         String base64Screenshot = requestBody.get("screenshot");
//         if (base64Screenshot == null || base64Screenshot.isEmpty()) {
//             logger.error("No screenshot provided for dashId: {}", dashId);
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                     .body(Map.of("error", "No screenshot provided"));
//         }
//         Map<String, Object> response = dashboardMasterService.saveSnapshot(dashId, base64Screenshot, request);
//           return createResponseEntity(response);
// }
//  // New endpoint to fetch all snapshots for the user
//     @GetMapping("/snapshots")
//     @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//     public ResponseEntity<Map<String, Object>> fetchSnapshots(HttpServletRequest request) {
//         logger.info("Received fetch snapshots request");
//         Map<String, Object> response = dashboardMasterService.fetchSnapshots(request);
//         return createResponseEntity(response);
//     }

//     private ResponseEntity<Map<String, Object>> createResponseEntity(Map<String, Object> response) {
//         if (response.containsKey("error")) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//         }
//         return ResponseEntity.ok(response);
//     }
// }


///////-----------------------5.30-----------------------------



package com.example.prog.controller.dashboard;

import com.example.prog.config.dashboard.DashboardConfig;
import com.example.prog.serviceimpl.dashboard.DashboardMasterServiceImpl;
import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
import com.example.prog.service.dashboard.DashboardMasterService;
import com.example.prog.utils.DashboardUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardMasterController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardMasterController.class);
    private final DashboardMasterServiceImpl dashboardMasterService;
    private final DashboardUtils dashboardUtils;
    private final DashboardConfig dashboardConfig;

    @Autowired
    public DashboardMasterController(DashboardMasterServiceImpl dashboardMasterService,
                                    DashboardUtils dashboardUtils,
                                    DashboardConfig dashboardConfig) {
        this.dashboardMasterService = dashboardMasterService;
        this.dashboardUtils = dashboardUtils;
        this.dashboardConfig = dashboardConfig;
    }

    @Autowired
    private DashboardMasterService dashboardService;

    // private static final String DASHBOARD_STORAGE_PATH = "DashboardLogs/";

    @PostMapping("/save")
    @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
    public ResponseEntity<Map<String, Object>> saveDashboard(
            @Valid @RequestBody DashboardSaveRequestDTO requestDTO,
            HttpServletRequest request) {
        logger.info("Received save dashboard request for dashboardName: {}", 
                    requestDTO.getDashboard().getDashboardName());
        Map<String, Object> response = dashboardService.saveDashboard(requestDTO, request);
        return createResponseEntity(response);
    }

    @GetMapping("/fetch")
    @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
    public ResponseEntity<Map<String, Object>> fetchDashboards(HttpServletRequest request) {
        logger.info("Received fetch dashboards request");
        Map<String, Object> response = dashboardService.fetchDashboards(request);
        return createResponseEntity(response);
    }

    @DeleteMapping("/delete/{dashId}")
    @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
    public ResponseEntity<Map<String, Object>> deleteDashboard(
            @PathVariable("dashId") int dashId,
            HttpServletRequest request) {
        logger.info("Received delete dashboard request for dashId: {}", dashId);
        Map<String, Object> response = dashboardMasterService.deleteDashboard(dashId, request);
        return createResponseEntity(response);
    }

      @DeleteMapping("/snapshot/{dashId}")
    @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
    public ResponseEntity<Map<String, Object>> deleteSnapshot(@PathVariable("dashId") int dashId, HttpServletRequest request) {
        logger.info("Received request to delete snapshot for dashId: {}", dashId);
        Map<String, Object> response = dashboardMasterService.deleteSnapshot(dashId, request);
        return createResponseEntity(response);
    }

    @GetMapping("/{dashId}")
    public ResponseEntity<?> getDashboard(
            @PathVariable int dashId,
            HttpServletRequest request) {
        logger.info("Received request for dashboard with dashId: {}", dashId);
        String authHeader = request.getHeader("Authorization");
        boolean isAuthenticated = false;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                Map<String, Object> response = dashboardMasterService.fetchDashboardById(dashId, request);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                logger.warn("Authentication failed or dashboard not accessible: {}", e.getMessage());
            }
        }

        // Unauthorized access: serve screenshot
        try {
            byte[] screenshot = dashboardUtils.readScreenshot(dashId, dashboardConfig.getDashboardStoragePath());
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(screenshot);
        } catch (Exception e) {
            logger.error("Failed to serve screenshot for dashId: {}: {}", dashId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Dashboard or screenshot not found"));
        }
    }

    @GetMapping("/public/{dashId}")
    public ResponseEntity<?> getPublicDashboard(@PathVariable int dashId) {
        logger.info("Fetching public dashboard with dashId: {}", dashId);
        try {
            byte[] screenshot = dashboardUtils.readScreenshot(dashId, dashboardConfig.getDashboardStoragePath());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            return new ResponseEntity<>(screenshot, headers, HttpStatus.OK);
        } catch (IOException e) {
            logger.error("Error fetching public dashboard screenshot for dashId {}: {}", dashId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Screenshot not found: " + e.getMessage()));
        }
    }

    @PostMapping("/snapshot/{dashId}")
    @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
    public ResponseEntity<Map<String, Object>> takeSnapshot(
            @PathVariable("dashId") int dashId,
            @RequestBody Map<String, String> requestBody,
            HttpServletRequest request) {
        logger.info("Received snapshot request for dashId: {}", dashId);
        String base64Screenshot = requestBody.get("screenshot");
        if (base64Screenshot == null || base64Screenshot.isEmpty()) {
            logger.error("No screenshot provided for dashId: {}", dashId);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "No screenshot provided"));
        }
        Map<String, Object> response = dashboardMasterService.saveSnapshot(dashId, base64Screenshot, request);
        return createResponseEntity(response);
    }

    // New endpoint to fetch all snapshots for the user
    @GetMapping("/snapshots")
    @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
    public ResponseEntity<Map<String, Object>> fetchSnapshots(HttpServletRequest request) {
        logger.info("Received fetch snapshots request");
        Map<String, Object> response = dashboardMasterService.fetchSnapshots(request);
        return createResponseEntity(response);
    }

    // New endpoint to serve images from /app/DashboardLogs/
    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path file = Paths.get("/app/DashboardLogs/" + filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_PNG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error serving image {}: {}", filename, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    private ResponseEntity<Map<String, Object>> createResponseEntity(Map<String, Object> response) {
        if (response.containsKey("error")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        return ResponseEntity.ok(response);
    }
}