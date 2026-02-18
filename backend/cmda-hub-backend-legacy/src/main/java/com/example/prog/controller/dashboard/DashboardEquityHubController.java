//package com.example.prog.controller.dashboard;
//
//import com.example.prog.service.dashboard.DashboardEquityService;
//
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
//@RequestMapping("/api/equityhub")
//public class DashboardEquityHubController {
//
//    private static final Logger logger = LoggerFactory.getLogger(DashboardEquityHubController.class);
//
//    @Autowired
//    private DashboardEquityService equityHubService;
//
//    @PostMapping("/save")
//    @PreAuthorize("hasRole('Individual') or hasRole('CORPORATE')")
//    public ResponseEntity<Map<String, Object>> saveEquityHubPlot(
//            @RequestParam("dashId") int dashId,
//            @RequestParam("symbol") String symbol,
//            @RequestParam("companyName") String companyName,
//            HttpServletRequest request) {
//        logger.info("Received request to save EquityHub plot for dashId: {}, symbol: {}, companyName: {}", dashId, symbol, companyName);
//        Map<String, Object> response = equityHubService.saveEquityHubPlot(dashId, symbol, companyName, request);
//        return createResponseEntity(response);
//    }
//
//    private ResponseEntity<Map<String, Object>> createResponseEntity(Map<String, Object> response) {
//        if (response.containsKey("error")) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//        }
//        return ResponseEntity.ok(response);
//    }
//}
