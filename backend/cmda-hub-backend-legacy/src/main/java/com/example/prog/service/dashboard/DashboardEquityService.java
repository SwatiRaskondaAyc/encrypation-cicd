//package com.example.prog.service.dashboard;
//
//
//
//import com.example.prog.entity.CorporateUser;
//
//import com.example.prog.entity.UserDtls;
//import com.example.prog.entity.dashboard.DashboardMaster;
//import com.example.prog.repository.CorporateUserRepository;
//
//import com.example.prog.repository.UserRepository;
//import com.example.prog.repository.dashboard.DashboardMasterRepository;
//import com.example.prog.token.JwtUtil;
//import jakarta.servlet.http.HttpServletRequest;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Service;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Optional;
//
//@Service
//public class DashboardEquityService {
//
//    private static final Logger logger = LoggerFactory.getLogger(DashboardEquityService.class);
//
//    @Autowired
//    private JdbcTemplate jdbcTemplate;
//
//    @Autowired
//    private DashboardMasterRepository dashboardMasterRepository;
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Autowired
//    private CorporateUserRepository corporateUserRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    public Map<String, Object> saveEquityHubPlot(int dashId, String symbol, String companyName, HttpServletRequest request) {
//        try {
//            // Extract user details from JWT token
//            Map<String, Object> UserDtls = extractUserDetailsFromToken(request);
//            int userID = (int) UserDtls.get("userID");
//            String userType = (String) UserDtls.get("userType");
//            String email = (String) UserDtls.get("email");
//            logger.info("Extracted user details: email={}, userId={}, userType={}", email, userID, userType);
//
//            // Fetch userId and graphType from dashboard_master table
//            DashboardMaster dashboard = dashboardMasterRepository.findById(dashId)
//                    .orElseThrow(() -> new RuntimeException("Dashboard not found with ID: " + dashId));
//
//            // Verify that the dashboard belongs to the user
//            if (dashboard.getUserID() != userID) {
//                logger.warn("UserId: {} is not authorized to access dashboard with dashId: {}", userID, dashId);
//                throw new RuntimeException("Unauthorized: You can only access your own dashboards");
//            }
//
//            String graphType = dashboard.getPlotFrom(); // Assuming plotFrom is the graphType
//            if (graphType == null) {
//                throw new RuntimeException("Graph type not specified in dashboard with ID: " + dashId);
//            }
//
//            // Generate table name: usertype_userid_equityhub
//            String tableName = String.format("%s_%d_equityhub", userType, userID).toLowerCase();
//            logger.info("Generated table name: {}", tableName);
//
//            // Create the table if it doesn't exist
//            createEquityHubTableIfNotExists(tableName);
//
//            // Insert the data into the table
//            String sql = String.format(
//                    "INSERT INTO %s (userID, graphType, symbol, companyName) VALUES (?, ?, ?, ?)",
//                    tableName
//            );
//            jdbcTemplate.update(sql, userID, graphType, symbol, companyName);
//
//            // Fetch the auto-generated dashEquityHubId
//            Integer dashEquityHubId = jdbcTemplate.queryForObject(
//                    String.format("SELECT dashEquityHubId FROM %s WHERE userId = ? AND graphType = ? AND symbol = ? AND companyName = ? ORDER BY dashEquityHubId DESC LIMIT 1", tableName),
//                    Integer.class,
//                    userID, graphType, symbol, companyName
//            );
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "EquityHub plot saved successfully");
//            response.put("dashEquityHubId", dashEquityHubId);
//            return response;
//
//        } catch (Exception e) {
//            logger.error("Error saving EquityHub plot: {}", e.getMessage(), e);
//            Map<String, Object> response = new HashMap<>();
//            response.put("error", "Error saving EquityHub plot: " + e.getMessage());
//            return response;
//        }
//    }
//
//    private void createEquityHubTableIfNotExists(String tableName) {
//        try {
//            // Check if the table exists
//            String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?";
//            int tableCount = jdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);
//
//            if (tableCount == 0) {
//                logger.info("Creating table: {}", tableName);
//                String createTableSql = String.format(
//                        "CREATE TABLE %s (" +
//                                "dashEquityHubId INT PRIMARY KEY AUTO_INCREMENT," +
//                                "userID INT NOT NULL," +
//                                "graphType VARCHAR(50) NOT NULL," +
//                                "symbol VARCHAR(50) NOT NULL," +
//                                "companyName VARCHAR(100) NOT NULL" +
//                                ")",
//                        tableName
//                );
//                jdbcTemplate.execute(createTableSql);
//                logger.info("Table {} created successfully", tableName);
//            } else {
//                logger.info("Table {} already exists", tableName);
//            }
//        } catch (Exception e) {
//            logger.error("Error creating table {}: {}", tableName, e.getMessage(), e);
//            throw new RuntimeException("Failed to create table: " + tableName, e);
//        }
//    }
//
//    private Map<String, Object> extractUserDetailsFromToken(HttpServletRequest request) {
//        String authHeader = request.getHeader("Authorization");
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            logger.warn("Missing or invalid Authorization header");
//            throw new RuntimeException("Missing or invalid Authorization header");
//        }
//
//        String jwtToken = authHeader.substring(7);
//        String email = jwtUtil.extractEmail(jwtToken);
//
//        CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//        if (corporateUser != null) {
//            Map<String, Object> userDetails = new HashMap<>();
//            userDetails.put("email", email);
//            userDetails.put("userType", "corporate");
//            userDetails.put("userID", corporateUser.getId());
//            return userDetails;
//        }
//
//        Optional<UserDtls> individualUserOpt = userRepository.findByEmail(email);
//        if (individualUserOpt.isPresent()) {
//            UserDtls individualUser = individualUserOpt.get();
//            Map<String, Object> userDetails = new HashMap<>();
//            userDetails.put("email", email);
//            userDetails.put("userType", "individual");
//            userDetails.put("userID", individualUser.getUserID());
//            return userDetails;
//        }
//
//        logger.warn("User not found for email: {}", email);
//        throw new RuntimeException("User not found for email: " + email);
//    }
//}


//package com.example.prog.service.dashboard;
//
//import com.example.prog.entity.CorporateUser;
//import com.example.prog.entity.UserDtls;
//import com.example.prog.entity.dashboard.DashboardMaster;
//import com.example.prog.repository.CorporateUserRepository;
//import com.example.prog.repository.UserRepository;
//import com.example.prog.repository.dashboard.DashboardMasterRepository;
//import com.example.prog.token.JwtUtil;
//import jakarta.servlet.http.HttpServletRequest;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Service;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Optional;
//
//@Service
//public class DashboardEquityService {
//
//    private static final Logger logger = LoggerFactory.getLogger(DashboardEquityService.class);
//
//    @Autowired
//    @Qualifier("dashboardJdbcTemplate")
//    private JdbcTemplate jdbcTemplate;
//
//    @Autowired
//    private DashboardMasterRepository dashboardMasterRepository;
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Autowired
//    private CorporateUserRepository corporateUserRepository;
//
//    @Autowired
//    private UserRepository userRepository;

//    public Map<String, Object> saveEquityHubPlot(int dashId, String symbol, String companyName, HttpServletRequest request) {
//        try {
//            // Extract user details from JWT token
//            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
//            int userId = (int) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            String email = (String) userDetails.get("email");
//            logger.info("Extracted user details: email={}, userId={}, userType={}", email, userId, userType);
//
//            // Fetch userId and graphType from dashboard_master table
//            DashboardMaster dashboard = dashboardMasterRepository.findById(dashId)
//                    .orElseThrow(() -> new RuntimeException("Dashboard not found with ID: " + dashId));
//
//            // Verify that the dashboard belongs to the user
//            if (dashboard.getUserId() != userId) {
//                logger.warn("UserId: {} is not authorized to access dashboard with dashId: {}", userId, dashId);
//                throw new RuntimeException("Unauthorized: You can only access your own dashboards");
//            }
//
//            String graphType = dashboard.getPlotFrom();
//            if (graphType == null) {
//                throw new RuntimeException("Graph type not specified in dashboard with ID: " + dashId);
//            }
//
//            // Generate table name: usertype_userid_equityhub
//            String tableName = String.format("%s_%d_equityhub", userType, userId).toLowerCase();
//            logger.info("Generated table name: {}", tableName);
//
//            // Create the table if it doesn't exist
//            createEquityHubTableIfNotExists(tableName);
//
//            // Insert the data into the table
//            String sql = String.format(
//                    "INSERT INTO %s (userId, graphType, symbol, companyName) VALUES (?, ?, ?, ?)",
//                    tableName
//            );
//            jdbcTemplate.update(sql, userId, graphType, symbol, companyName);
//
//            // Fetch the auto-generated dashEquityHubId
//            Integer dashEquityHubId = jdbcTemplate.queryForObject(
//                    String.format("SELECT TOP 1 dashEquityHubId FROM %s WHERE userId = ? AND graphType = ? AND symbol = ? AND companyName = ? ORDER BY dashEquityHubId DESC", tableName),
//                    Integer.class,
//                    userId, graphType, symbol, companyName
//            );
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "EquityHub plot saved successfully");
//            response.put("dashEquityHubId", dashEquityHubId);
//            return response;
//
//        } catch (Exception e) {
//            logger.error("Error saving EquityHub plot: {}", e.getMessage(), e);
//            Map<String, Object> response = new HashMap<>();
//            response.put("error", "Error saving EquityHub plot: " + e.getMessage());
//            return response;
//        }
//    }
//
//    private void createEquityHubTableIfNotExists(String tableName) {
//        try {
//            // Check if the table exists in the current database
//            String checkTableSql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = ?";
//            int tableCount = jdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);
//
//            if (tableCount == 0) {
//                logger.info("Creating table: {}", tableName);
//                String createTableSql = String.format(
//                        "CREATE TABLE %s (" +
//                                "dashEquityHubId INT PRIMARY KEY IDENTITY(1,1)," +
//                                "userId INT NOT NULL," +
//                                "graphType VARCHAR(50) NOT NULL," +
//                                "symbol VARCHAR(50) NOT NULL," +
//                                "companyName VARCHAR(100) NOT NULL" +
//                                ")",
//                        tableName
//                );
//                jdbcTemplate.execute(createTableSql);
//                logger.info("Table {} created successfully", tableName);
//            } else {
//                logger.info("Table {} already exists", tableName);
//            }
//        } catch (Exception e) {
//            logger.error("Error creating table {}: {}", tableName, e.getMessage(), e);
//            throw new RuntimeException("Failed to create table: " + tableName, e);
//        }
//    }
//
//    private Map<String, Object> extractUserDetailsFromToken(HttpServletRequest request) {
//        String authHeader = request.getHeader("Authorization");
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            logger.warn("Missing or invalid Authorization header");
//            throw new RuntimeException("Missing or invalid Authorization header");
//        }
//
//        String jwtToken = authHeader.substring(7);
//        String email = jwtUtil.extractEmail(jwtToken);
//
//        CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//        if (corporateUser != null) {
//            Map<String, Object> userDetails = new HashMap<>();
//            userDetails.put("email", email);
//            userDetails.put("userType", "corporate");
//            userDetails.put("userId", corporateUser.getId());
//            return userDetails;
//        }
//
//        Optional<UserDtls> individualUserOpt = userRepository.findByEmail(email);
//        if (individualUserOpt.isPresent()) {
//            UserDtls individualUser = individualUserOpt.get();
//            Map<String, Object> userDetails = new HashMap<>();
//            userDetails.put("email", email);
//            userDetails.put("userType", "individual");
//            userDetails.put("userId", individualUser.getUserID());
//            return userDetails;
//        }
//
//        logger.warn("User not found for email: {}", email);
//        throw new RuntimeException("User not found for email: " + email);
//    }
    
    
//    public Map<String, Object> saveEquityHubPlot(int dashId, String symbol, String companyName, String graphType, HttpServletRequest request) {
//        try {
//            // Validate graphType
//            if (graphType == null) {
//                logger.error("graphType is required for equityhub");
//                throw new RuntimeException("graphType is required for equityhub");
//            }
//
//            // Extract user details from JWT token
//            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
//            int userId = (int) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            String email = (String) userDetails.get("email");
//            logger.info("Extracted user details: email={}, userId={}, userType={}", email, userId, userType);
//
//            // Fetch DashboardMaster to verify ownership
//            DashboardMaster dashboard = dashboardMasterRepository.findById(dashId)
//                    .orElseThrow(() -> new RuntimeException("Dashboard not found with ID: " + dashId));
//
//            // Verify that the dashboard belongs to the user
//            if (dashboard.getUserId() != userId) {
//                logger.warn("UserId: {} is not authorized to access dashboard with dashId: {}", userId, dashId);
//                throw new RuntimeException("Unauthorized: You can only access your own dashboards");
//            }
//
//            // Generate table name: usertype_userid_equityhub
//            String tableName = String.format("%s_%d_equityhub", userType, userId).toLowerCase();
//            logger.info("Generated table name: {}", tableName);
//
//            // Create the table if it doesn't exist
//            createEquityHubTableIfNotExists(tableName);
//
//            // Insert the data into the table
//            String sql = String.format(
//                    "INSERT INTO %s (userId, graphType, symbol, companyName) VALUES (?, ?, ?, ?)",
//                    tableName
//            );
//            jdbcTemplate.update(sql, userId, graphType, symbol, companyName);
//
//            // Fetch the auto-generated dashEquityHubId
//            Integer dashEquityHubId = jdbcTemplate.queryForObject(
//                    String.format("SELECT TOP 1 dashEquityHubId FROM %s WHERE userId = ? AND graphType = ? AND symbol = ? AND companyName = ? ORDER BY dashEquityHubId DESC", tableName),
//                    Integer.class,
//                    userId, graphType, symbol, companyName
//            );
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "EquityHub plot saved successfully");
//            response.put("dashEquityHubId", dashEquityHubId);
//            return response;
//
//        } catch (Exception e) {
//            logger.error("Error saving EquityHub plot: {}", e.getMessage(), e);
//            Map<String, Object> response = new HashMap<>();
//            response.put("error", "Error saving EquityHub plot: " + e.getMessage());
//            return response;
//        }
//    }
//
//    private void createEquityHubTableIfNotExists(String tableName) {
//        try {
//            // Check if the table exists in the current database
//            String checkTableSql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = ?";
//            int tableCount = jdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);
//
//            if (tableCount == 0) {
//                logger.info("Creating table: {}", tableName);
//                String createTableSql = String.format(
//                        "CREATE TABLE %s (" +
//                                "dashEquityHubId INT PRIMARY KEY IDENTITY(1,1)," +
//                                "userId INT NOT NULL," +
//                                "graphType VARCHAR(50) NOT NULL," +
//                                "symbol VARCHAR(50) NOT NULL," +
//                                "companyName VARCHAR(100) NOT NULL" +
//                                ")",
//                        tableName
//                );
//                jdbcTemplate.execute(createTableSql);
//                logger.info("Table {} created successfully", tableName);
//            } else {
//                logger.info("Table {} already exists", tableName);
//            }
//        } catch (Exception e) {
//            logger.error("Error creating table {}: {}", tableName, e.getMessage(), e);
//            throw new RuntimeException("Failed to create table: " + tableName, e);
//        }
//    }
//
//    public Map<String, Object> extractUserDetailsFromToken(HttpServletRequest request) {
//        String authHeader = request.getHeader("Authorization");
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            logger.warn("Missing or invalid Authorization header");
//            throw new RuntimeException("Missing or invalid Authorization header");
//        }
//
//        String jwtToken = authHeader.substring(7);
//        String email = jwtUtil.extractEmail(jwtToken);
//
//        CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//        if (corporateUser != null) {
//            Map<String, Object> userDetails = new HashMap<>();
//            userDetails.put("email", email);
//            userDetails.put("userType", "corporate");
//            userDetails.put("userId", corporateUser.getId());
//            return userDetails;
//        }
//
//        Optional<UserDtls> individualUserOpt = userRepository.findByEmail(email);
//        if (individualUserOpt.isPresent()) {
//            UserDtls individualUser = individualUserOpt.get();
//            Map<String, Object> userDetails = new HashMap<>();
//            userDetails.put("email", email);
//            userDetails.put("userType", "individual");
//            userDetails.put("userId", individualUser.getUserID());
//            return userDetails;
//        }
//
//        logger.warn("User not found for email: {}", email);
//        throw new RuntimeException("User not found for email: " + email);
//    }
//}
    
//   package com.example.prog.service.dashboard;
//
//import jakarta.servlet.http.HttpServletRequest;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Service;
//
//import com.example.prog.entity.dashboard.DashboardMaster;
//import com.example.prog.repository.dashboard.DashboardMasterRepository;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class DashboardEquityService {
//
//    private static final Logger logger = LoggerFactory.getLogger(DashboardEquityService.class);
//
//    @Autowired
//    private JdbcTemplate dashboardJdbcTemplate;
//
//    @Autowired
//    private DashboardMasterRepository dashboardMasterRepository;
//
//    public Map<String, Object> saveEquityHubPlot(int dashId, int userId, String userType, String symbol, 
//                                                String companyName, String graphType, HttpServletRequest request) {
//        try {
//            // Validate inputs
//            if (symbol == null || companyName == null || graphType == null) {
//                logger.error("symbol, companyName, and graphType are required for equityhub");
//                throw new RuntimeException("symbol, companyName, and graphType are required for equityhub");
//            }
//
//            // Verify dashboard ownership
//            DashboardMaster dashboard = dashboardMasterRepository.findById(dashId)
//                    .orElseThrow(() -> new RuntimeException("Dashboard not found with ID: " + dashId));
//            if (dashboard.getUserId() != userId) {
//                logger.warn("UserId: {} is not authorized to access dashboard with dashId: {}", userId, dashId);
//                throw new RuntimeException("Unauthorized: You can only access your own dashboards");
//            }
//
//            // Generate table name
//            String tableName = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
//            createEquityHubTableIfNotExists(tableName);
//
//            // Insert plot data
//            String sql = String.format(
//                    "INSERT INTO %s (dash_id, user_id, graph_type, symbol, company_name) VALUES (?, ?, ?, ?, ?)",
//                    tableName
//            );
//            dashboardJdbcTemplate.update(sql, dashId, userId, graphType, symbol, companyName);
//
//            // Fetch the inserted plot ID
//            Integer dashEquityHubId = dashboardJdbcTemplate.queryForObject(
//                    String.format("SELECT TOP 1 dash_equity_hub_id FROM %s WHERE dash_id = ? AND user_id = ? AND graph_type = ? AND symbol = ? AND company_name = ? ORDER BY dash_equity_hub_id DESC", 
//                                  tableName),
//                    Integer.class,
//                    dashId, userId, graphType, symbol, companyName
//            );
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "EquityHub plot saved successfully");
//            response.put("dashEquityHubId", dashEquityHubId);
//            return response;
//
//        } catch (Exception e) {
//            logger.error("Error saving EquityHub plot: {}", e.getMessage(), e);
//            Map<String, Object> response = new HashMap<>();
//            response.put("error", "Error saving EquityHub plot: " + e.getMessage());
//            return response;
//        }
//    }
//
//    private void createEquityHubTableIfNotExists(String tableName) {
//        try {
//            // Define column data types
//            Map<String, String> dataTypes = Map.of(
//                    "dash_id", "INT",
//                    "user_id", "INT",
//                    "graph_type", "VARCHAR(50)",
//                    "symbol", "VARCHAR(50)",
//                    "company_name", "VARCHAR(100)"
//            );
//
//            // Check if the table exists
//            String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//            Integer count = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);
//
//            // If not exists, create it dynamically with an auto-increment primary key
//            if (count != null && count == 0) {
//                StringBuilder createTableSql = new StringBuilder("CREATE TABLE " + tableName + " (");
//                List<String> columnDefs = new ArrayList<>();
//
//                // Add auto-increment primary key
//                columnDefs.add("dash_equity_hub_id INT IDENTITY(1,1) PRIMARY KEY");
//
//                // Add other columns
//                for (Map.Entry<String, String> entry : dataTypes.entrySet()) {
//                    columnDefs.add(entry.getKey() + " " + entry.getValue());
//                }
//
//                // Add foreign key constraint
//                columnDefs.add("FOREIGN KEY (dash_id) REFERENCES dashboard_master(dash_id)");
//
//                createTableSql.append(String.join(", ", columnDefs)).append(")");
//                dashboardJdbcTemplate.execute(createTableSql.toString());
//                logger.info("Table {} created successfully", tableName);
//            } else {
//                logger.info("Table {} already exists", tableName);
//            }
//        } catch (Exception e) {
//            logger.error("DB error for table {}: {}", tableName, e.getMessage(), e);
//            throw new RuntimeException("Database error for: " + tableName, e);
//        }
//    }
//}


package com.example.prog.service.dashboard;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.prog.entity.dashboard.DashboardMaster;
import com.example.prog.repository.dashboard.DashboardMasterRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardEquityService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardEquityService.class);

    @Autowired
    @Qualifier("dashboardJdbcTemplate")
    private JdbcTemplate dashboardJdbcTemplate;

    @Autowired
    private DashboardMasterRepository dashboardMasterRepository;

//    public Map<String, Object> saveEquityHubPlot(int dashId, int userId, String userType, String symbol, 
//                                                String companyName, String graphType, HttpServletRequest request) {
//        try {
//            logger.info("Attempting to save EquityHub plot: dashId={}, userId={}, userType={}, symbol={}, companyName={}, graphType={}",
//                    dashId, userId, userType, symbol, companyName, graphType);
//
//            // Validate inputs
//            if (symbol == null || companyName == null || graphType == null) {
//                logger.error("symbol, companyName, and graphType are required for equityhub");
//                throw new RuntimeException("symbol, companyName, and graphType are required for equityhub");
//            }
//
//            // Verify dashboard ownership
//            logger.debug("Fetching dashboard with dashId={}", dashId);
//            DashboardMaster dashboard = dashboardMasterRepository.findById(dashId)
//                    .orElseThrow(() -> new RuntimeException("Dashboard not found with ID: " + dashId));
//            if (dashboard.getUserId() != userId) {
//                logger.warn("UserId: {} is not authorized to access dashboard with dashId: {}", userId, dashId);
//                throw new RuntimeException("Unauthorized: You can only access your own dashboards");
//            }
//
//            // Generate table name
//            String tableName = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
//            logger.info("Generated table name: {}", tableName);
//
//            // Create table if it doesn't exist
//            createEquityHubTableIfNotExists(tableName);
//
//            // Insert plot data
//            logger.debug("Inserting plot data into table: {}", tableName);
//            String sql = String.format(
//                    "INSERT INTO %s (dash_id, user_id, graph_type, symbol, company_name) VALUES (?, ?, ?, ?, ?)",
//                    tableName
//            );
//            dashboardJdbcTemplate.update(sql, dashId, userId, graphType, symbol, companyName);
//
//            // Fetch the inserted plot ID
//            logger.debug("Fetching dash_equity_hub_id from table: {}", tableName);
//            Integer dashEquityHubId = dashboardJdbcTemplate.queryForObject(
//                    String.format("SELECT TOP 1 dash_equity_hub_id FROM %s WHERE dash_id = ? AND user_id = ? AND graph_type = ? AND symbol = ? AND company_name = ? ORDER BY dash_equity_hub_id DESC", 
//                                  tableName),
//                    Integer.class,
//                    dashId, userId, graphType, symbol, companyName
//            );
//
//            logger.info("EquityHub plot saved successfully with dashEquityHubId={}", dashEquityHubId);
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "EquityHub plot saved successfully");
//            response.put("dashEquityHubId", dashEquityHubId);
//            return response;
//
//        } catch (Exception e) {
//            logger.error("Error saving EquityHub plot: {}", e.getMessage(), e);
//            Map<String, Object> response = new HashMap<>();
//            response.put("error", "Error saving EquityHub plot: " + e.getMessage());
//            return response;
//        }
//    }

//    private void createEquityHubTableIfNotExists(String tableName) {
//        try {
//            // Define column data types
//            Map<String, String> dataTypes = Map.of(
//                    "dash_id", "INT",
//                    "user_id", "INT",
//                    "graph_type", "VARCHAR(50)",
//                    "symbol", "VARCHAR(50)",
//                    "company_name", "VARCHAR(100)"
//            );
//
//            // Check if the table exists
//            String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//            Integer count = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);
//
//            // If not exists, create it dynamically with an auto-increment primary key
//            if (count != null && count == 0) {
//                StringBuilder createTableSql = new StringBuilder("CREATE TABLE " + tableName + " (");
//                List<String> columnDefs = new ArrayList<>();
//
//                // Add auto-increment primary key
//                columnDefs.add("dash_equity_hub_id INT IDENTITY(1,1) PRIMARY KEY");
//
//                // Add other columns
//                for (Map.Entry<String, String> entry : dataTypes.entrySet()) {
//                    columnDefs.add(entry.getKey() + " " + entry.getValue());
//                }
//
//                // Add foreign key constraint
//                columnDefs.add("FOREIGN KEY (dash_id) REFERENCES dashboard_master(dash_id)");
//
//                createTableSql.append(String.join(", ", columnDefs)).append(")");
//                dashboardJdbcTemplate.execute(createTableSql.toString());
//                logger.info("Table {} created successfully", tableName);
//            } else {
//                logger.info("Table {} already exists", tableName);
//            }
//        } catch (Exception e) {
//            logger.error("DB error for table {}: {}", tableName, e.getMessage(), e);
//            throw new RuntimeException("Database error for: " + tableName, e);
//        }
//    }
    
    
    public Map<String, Object> saveEquityHubPlot(int dashId, int userId, String userType, String symbol, 
            String companyName, String graphType, HttpServletRequest request) {
try {
logger.info("Attempting to save EquityHub plot: dashId={}, userId={}, userType={}, symbol={}, companyName={}, graphType={}",
dashId, userId, userType, symbol, companyName, graphType);

// Validate inputs
if (symbol == null || companyName == null || graphType == null) {
logger.error("symbol, companyName, and graphType are required for equityhub");
throw new RuntimeException("symbol, companyName, and graphType are required for equityhub");
}

// Verify dashboard ownership
logger.debug("Fetching dashboard with dashId={}", dashId);
DashboardMaster dashboard = dashboardMasterRepository.findById(dashId)
.orElseThrow(() -> new RuntimeException("Dashboard not found with ID: " + dashId));
if (dashboard.getUserId() != userId) {
logger.warn("UserId: {} is not authorized to access dashboard with dashId: {}", userId, dashId);
throw new RuntimeException("Unauthorized: You can only access your own dashboards");
}

// Generate table name
String tableName = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
logger.info("Generated table name: {}", tableName);

// Create table if it doesn't exist
createEquityHubTableIfNotExists(tableName);

// Insert plot data
logger.debug("Inserting plot data into table: {}", tableName);
String sql = String.format(
"INSERT INTO %s (dash_id, user_id, graph_type, symbol, company_name) VALUES (?, ?, ?, ?, ?)",
tableName
);
dashboardJdbcTemplate.update(sql, dashId, userId, graphType, symbol, companyName);

// Fetch the inserted plot ID
logger.debug("Fetching dash_equity_hub_id from table: {}", tableName);
Integer dashEquityHubId = dashboardJdbcTemplate.queryForObject(
String.format("SELECT TOP 1 dash_equity_hub_id FROM %s WHERE dash_id = ? AND user_id = ? AND graph_type = ? AND symbol = ? AND company_name = ? ORDER BY dash_equity_hub_id DESC", 
tableName),
Integer.class,
dashId, userId, graphType, symbol, companyName
);

logger.info("EquityHub plot saved successfully with dashEquityHubId={}", dashEquityHubId);
Map<String, Object> response = new HashMap<>();
response.put("message", "EquityHub plot saved successfully");
response.put("dashEquityHubId", dashEquityHubId);
return response;

} catch (Exception e) {
logger.error("Error saving EquityHub plot: {}", e.getMessage(), e);
Map<String, Object> response = new HashMap<>();
response.put("error", "Error saving EquityHub plot: " + e.getMessage());
return response;
}
}
    
    private void createEquityHubTableIfNotExists(String tableName) {
        try {
            // Define column data types
            Map<String, String> dataTypes = Map.of(
                    "dash_id", "INT",
                    "user_id", "INT",
                    "graph_type", "VARCHAR(50)",
                    "symbol", "VARCHAR(50)",
                    "company_name", "VARCHAR(100)"
            );

            // Check if the table exists
            String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
            Integer count = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);

            // If not exists, create it dynamically with an auto-increment primary key
            if (count != null && count == 0) {
                StringBuilder createTableSql = new StringBuilder("CREATE TABLE " + tableName + " (");
                List<String> columnDefs = new ArrayList<>();

                // Add auto-increment primary key
                columnDefs.add("dash_equity_hub_id INT IDENTITY(1,1) PRIMARY KEY");

                // Add other columns
                for (Map.Entry<String, String> entry : dataTypes.entrySet()) {
                    columnDefs.add(entry.getKey() + " " + entry.getValue());
                }

                createTableSql.append(String.join(", ", columnDefs)).append(")");
                dashboardJdbcTemplate.execute(createTableSql.toString());
                logger.info("Table {} created successfully", tableName);
            } else {
                logger.info("Table {} already exists", tableName);
            }
        } catch (Exception e) {
            logger.error("DB error for table {}: {}", tableName, e.getMessage(), e);
            throw new RuntimeException("Database error for: " + tableName, e);
        }
    }
}