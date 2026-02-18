//package com.example.prog.controller.dashboard;
//
//
//
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.example.prog.entity.CorporateUser;
//import com.example.prog.entity.UserDtls;
//
//import com.example.prog.repository.CorporateUserRepository;
//import com.example.prog.repository.UserRepository;
//import com.example.prog.service.dashboard.DashboardPortfolioService;
//import com.example.prog.token.JwtUtil;
//
//import jakarta.servlet.http.HttpServletRequest;
//
//@RestController
//@RequestMapping("/api/portfolio")
//public class DashboardPortfolioController {
//	
//	
//		
//		@Autowired
//		private DashboardPortfolioService dashBoardService;
//		
//		@Autowired
//	    private CorporateUserRepository corporateUserRepository;
//		
//		@Autowired
//	    private UserRepository userRepository;
//
//		@PostMapping("/save")
//		public ResponseEntity<Map<String, String>> saveDashboardGraph(
//		        @RequestParam String uploadId,
//		        @RequestParam String graphType,
//		        @RequestParam String platform,
//		        HttpServletRequest request) {
//
//		    String authHeader = request.getHeader("Authorization");
//		    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//		        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//		                .body(Map.of("error", "Missing or invalid Authorization header"));
//		    }
//
//		    String jwtToken = authHeader.substring(7);
//		    String email = JwtUtil.extractEmail(jwtToken);
//
//		    boolean isCorporate = false;
//		    int userId ;
//		    // Check in CorporateUser
//		    CorporateUser corpUser = corporateUserRepository.findByemail(email);
//		    
//		    if (corpUser != null) {
//		        isCorporate = true;
//		        userId = corpUser.getId(); // assuming getId() returns corporate ID
//		        System.out.println("Corporate User ID: " + userId);
//		    } else {
//		        UserDtls user = userRepository.findByEmail(email).orElse(null);
//		        userId = user.getUserID();
//		        if (user == null) {
//		            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//		                    .body(Map.of("error", "User not found in the database."));
//		        }
//		        System.out.println("Individual User ID: " + userId);
//		    }
//		    String userType = isCorporate ? "corporate" : "individual";
//		    try {
//		        dashBoardService.createMapandTable(userId, uploadId, graphType, platform, userType);
//		        return ResponseEntity.ok(Map.of("message", "Table created successfully"));
//		    } catch (Exception e) {
//		        e.printStackTrace();
//		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//		                .body(Map.of("error", "Failed to create dashboard table: " + e.getMessage()));
//		    }
//		}
//
//	}
//
//
//
