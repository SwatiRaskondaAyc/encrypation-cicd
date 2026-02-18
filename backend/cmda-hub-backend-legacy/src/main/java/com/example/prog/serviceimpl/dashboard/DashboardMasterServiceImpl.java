//package com.example.prog.serviceimpl.dashboard;
//import com.example.prog.entity.CorporateUser;
//import com.example.prog.entity.UserDtls;
//import com.example.prog.entity.dashboard.DashboardMaster;
//import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
//import com.example.prog.entity.dashboard.EquityHubPlotDTO;
//import com.example.prog.entity.dashboard.PortfolioPlotDTO;
//import com.example.prog.repository.CorporateUserRepository;
//import com.example.prog.repository.UserRepository;
//import com.example.prog.repository.dashboard.DashboardMasterRepository;
//import com.example.prog.service.dashboard.DashboardEquityService;
//import com.example.prog.service.dashboard.DashboardMasterService;
//import com.example.prog.service.dashboard.DashboardPortfolioService;
//import com.example.prog.token.JwtUtil;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.transaction.Transactional;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//import java.util.function.Function;
//
//@Service
//public class DashboardMasterServiceImpl implements DashboardMasterService {
//
//    private static final Logger logger = LoggerFactory.getLogger(DashboardMasterServiceImpl.class);
//
//    @Autowired
//    private DashboardMasterRepository dashboardMasterRepository;
//
//    @Autowired
//    private DashboardEquityService equityHubService;
//
//    @Autowired
//    private DashboardPortfolioService portfolioService;
//
//    @Autowired
//    @Qualifier("dashboardJdbcTemplate")
//    private JdbcTemplate dashboardJdbcTemplate; // Points to CMDA_Dash_EquityHub
//
//    @Autowired
//    @Qualifier("usersDashPortfolioJdbcTemplate")
//    private JdbcTemplate usersDashPortfolioJdbcTemplate; // Points to CMDA_Dash_Portfolio
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
//    @Override
//    @Transactional(rollbackOn = Exception.class)
//    public Map<String, Object> saveDashboard(DashboardSaveRequestDTO requestDTO, HttpServletRequest request) {
//        logger.info("Saving dashboard: {}", requestDTO.getDashboard().getDashboardName());
//        return executeWithUserDetails(request, userDetails -> {
//            Integer userId = (Integer) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            if (userId == null || userType == null) {
//                logger.error("User ID or type not found in user details");
//                throw new RuntimeException("User ID or type not found in user details");
//            }
//
//            // Prepare DashboardMaster
//            DashboardMaster dashboard = requestDTO.getDashboard();
//            dashboard.setUserId(userId);
//            dashboard.setUserType(userType);
//            dashboard.setUpdatedAt(LocalDateTime.now());
//
//            // Save DashboardMaster
//            DashboardMaster savedDashboard = dashboardMasterRepository.save(dashboard);
//            int dashId = savedDashboard.getDashId();
//            logger.info("Dashboard saved with dashId: {}", dashId);
//
//            // Save EquityHub plots
//            List<Integer> equityHubPlotIds = new ArrayList<>();
//            List<Map<String, Object>> equityResponses = new ArrayList<>();
//            List<EquityHubPlotDTO> equityPlots = requestDTO.getEquityHubPlots() != null ? 
//                                                requestDTO.getEquityHubPlots() : new ArrayList<>();
//            for (EquityHubPlotDTO plot : equityPlots) {
//                Map<String, Object> response = equityHubService.saveEquityHubPlot(
//                        dashId, userId, userType, plot.getSymbol(), plot.getCompanyName(), 
//                        plot.getGraphType(), request);
//                equityResponses.add(response);
//                if (response.containsKey("dashEquityHubId")) {
//                    equityHubPlotIds.add((Integer) response.get("dashEquityHubId"));
//                }
//            }
//
//            // Save Portfolio plots
//            List<Integer> portfolioPlotIds = new ArrayList<>();
//            List<Map<String, Object>> portfolioResponses = new ArrayList<>();
//            List<PortfolioPlotDTO> portfolioPlots = requestDTO.getPortfolioPlots() != null ? 
//                                                  requestDTO.getPortfolioPlots() : new ArrayList<>();
//            for (PortfolioPlotDTO plot : portfolioPlots) {
//                Map<String, Object> response = portfolioService.savePortfolioPlot(
//                        dashId, userId, plot.getUploadId(), plot.getGraphType(), 
//                        plot.getPlatform(), userType, request);
//                portfolioResponses.add(response);
//                if (response.containsKey("dashPortId")) {
//                    portfolioPlotIds.add((Integer) response.get("dashPortId"));
//                }
//            }
//
//            // Prepare response
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Dashboard and plots saved successfully");
//            response.put("dashId", dashId);
//            response.put("equityHubPlotIds", equityHubPlotIds);
//            response.put("portfolioPlotIds", portfolioPlotIds);
//            return response;
//
//        }, "Error saving dashboard");
//    }
//
//    @Override
//    public Map<String, Object> fetchDashboards(HttpServletRequest request) {
//        logger.info("Fetching all dashboards");
//        return executeWithUserDetails(request, userDetails -> {
//            Integer userId = (Integer) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            if (userId == null || userType == null) {
//                logger.error("User ID or type not found in user details");
//                throw new RuntimeException("User ID or type not found in user details");
//            }
//
//            // Step 1: Fetch dashboards for the user from UserReg database
//            List<DashboardMaster> dashboards = dashboardMasterRepository.findByUserId(userId);
//            List<Map<String, Object>> dashboardData = new ArrayList<>();
//
//            // Step 2: For each dashboard, fetch associated plots
//            for (DashboardMaster dashboard : dashboards) {
//                Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//                dashboardData.add(dashboardEntry);
//            }
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Dashboards fetched successfully");
//            response.put("dashboards", dashboardData);
//            return response;
//        }, "Error fetching dashboards");
//    }
//
//    private Map<String, Object> fetchDashboardDetails(DashboardMaster dashboard, int userId, String userType) {
//        Map<String, Object> dashboardEntry = new HashMap<>();
//        dashboardEntry.put("dashId", dashboard.getDashId());
//        dashboardEntry.put("dashboardName", dashboard.getDashboardName());
//        dashboardEntry.put("userId", dashboard.getUserId());
//        dashboardEntry.put("userType", dashboard.getUserType());
//        dashboardEntry.put("updatedAt", dashboard.getUpdatedAt());
//
//        Map<String, Object> plotData = new HashMap<>();
//
//        // Step 3: Fetch EquityHub plots from CMDA_Dash_EquityHub
//        String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId); // e.g., corporate_1_equityhub
//        try {
//            String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//            Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
//            if (tableCount == null || tableCount == 0) {
//                logger.warn("EquityHub table {} does not exist for dashId: {}", equityTable, dashboard.getDashId());
//                plotData.put("equityHubPlots", new ArrayList<>());
//            } else {
//                String sql = String.format("SELECT dash_equity_hub_id, graph_type, symbol, company_name FROM %s WHERE dash_id = ? AND user_id = ?", equityTable);
//                logger.debug("Executing EquityHub query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
//                List<Map<String, Object>> equityPlots = dashboardJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
//                logger.info("Fetched {} EquityHub plots for dashId: {}", equityPlots.size(), dashboard.getDashId());
//                plotData.put("equityHubPlots", equityPlots);
//            }
//        } catch (Exception e) {
//            logger.error("Error fetching EquityHub plots for dashId: {} from table {}: {}", 
//                         dashboard.getDashId(), equityTable, e.getMessage(), e);
//            plotData.put("equityHubPlots", new ArrayList<>());
//        }
//
//        // Step 4: Fetch Portfolio plots from CMDA_Dash_Portfolio
//        try {
//            String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId); // e.g., corporate1_%_portdashboard
//            String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
//            logger.debug("Fetching portfolio tables with pattern: {}", tablePattern);
//            List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);
//
//            List<Map<String, Object>> portfolioPlots = new ArrayList<>();
//            if (matchingTables.isEmpty()) {
//                logger.warn("No portfolio tables found for pattern: {} for dashId: {}", tablePattern, dashboard.getDashId());
//            } else {
//                for (Map<String, Object> tableEntry : matchingTables) {
//                    String tableName = (String) tableEntry.get("TABLE_NAME");
//                    String sql = String.format("SELECT dash_port_id, upload_id, graph_type, platform FROM %s WHERE dash_id = ? AND user_id = ?", tableName);
//                    logger.debug("Executing Portfolio query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
//                    List<Map<String, Object>> tablePlots = usersDashPortfolioJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
//                    logger.info("Fetched {} plots from portfolio table {} for dashId: {}", tablePlots.size(), tableName, dashboard.getDashId());
//                    portfolioPlots.addAll(tablePlots);
//                }
//            }
//            plotData.put("portfolioPlots", portfolioPlots);
//        } catch (Exception e) {
//            logger.error("Error fetching Portfolio plots for dashId: {}: {}", dashboard.getDashId(), e.getMessage(), e);
//            plotData.put("portfolioPlots", new ArrayList<>());
//        }
//
//        dashboardEntry.put("plots", plotData);
//        return dashboardEntry;
//    }
//
//    @Override
//    @Transactional(rollbackOn = Exception.class)
//    public Map<String, Object> deleteDashboard(int dashId, HttpServletRequest request) {
//        logger.info("Deleting dashboard with dashId: {}", dashId);
//        return executeWithUserDetails(request, userDetails -> {
//            Integer userId = (Integer) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            if (userId == null || userType == null) {
//                logger.error("User ID or type not found in user details");
//                throw new RuntimeException("User ID or type not found in user details");
//            }
//
//            // Verify dashboard exists and user is authorized
//            Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//            if (dashboardOpt.isEmpty()) {
//                logger.warn("Dashboard with dashId: {} not found", dashId);
//                throw new RuntimeException("Dashboard not found with ID: " + dashId);
//            }
//
//            DashboardMaster dashboard = dashboardOpt.get();
//            if (dashboard.getUserId() != userId) {
//                logger.warn("UserId: {} is not authorized to delete dashboard with dashId: {}", userId, dashId);
//                throw new RuntimeException("Unauthorized: You can only delete your own dashboards");
//            }
//
//            // Step 1: Delete associated EquityHub plots from CMDA_Dash_EquityHub
//            String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId); // e.g., corporate_1_equityhub
//            try {
//                String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//                Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
//                if (tableCount != null && tableCount > 0) {
//                    // Delete plots for the given dashId
//                    String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", equityTable);
//                    int rowsAffected = dashboardJdbcTemplate.update(deleteSql, dashId);
//                    logger.info("Deleted {} EquityHub plots from table {} for dashId: {}", rowsAffected, equityTable, dashId);
//
//                    // Check if there are any remaining plots in the table
//                    String countSql = String.format("SELECT COUNT(*) FROM %s", equityTable);
//                    Integer remainingRows = dashboardJdbcTemplate.queryForObject(countSql, Integer.class);
//                    if (remainingRows != null && remainingRows == 0) {
//                        // No remaining plots, drop the table
//                        String dropSql = String.format("DROP TABLE %s", equityTable);
//                        dashboardJdbcTemplate.execute(dropSql);
//                        logger.info("Dropped EquityHub table {} as it has no remaining plots", equityTable);
//                    } else {
//                        logger.info("EquityHub table {} still has {} plots for other dashboards, not dropping", equityTable, remainingRows);
//                    }
//                } else {
//                    logger.info("EquityHub table {} does not exist for dashId: {}, skipping deletion", equityTable, dashId);
//                }
//            } catch (Exception e) {
//                logger.error("Error deleting EquityHub plots for dashId: {} from table {}: {}", 
//                             dashId, equityTable, e.getMessage(), e);
//                throw new RuntimeException("Failed to delete EquityHub plots: " + e.getMessage(), e);
//            }
//
//            // Step 2: Delete associated Portfolio plots from CMDA_Dash_Portfolio
//            try {
//                String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId); // e.g., corporate1_%_portdashboard
//                String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
//                List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);
//
//                if (matchingTables.isEmpty()) {
//                    logger.info("No portfolio tables found for pattern: {} for dashId: {}, skipping deletion", tablePattern, dashId);
//                } else {
//                    for (Map<String, Object> tableEntry : matchingTables) {
//                        String tableName = (String) tableEntry.get("TABLE_NAME");
//                        // Delete plots for the given dashId
//                        String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", tableName);
//                        int rowsAffected = usersDashPortfolioJdbcTemplate.update(deleteSql, dashId);
//                        logger.info("Deleted {} Portfolio plots from table {} for dashId: {}", rowsAffected, tableName, dashId);
//
//                        // Check if there are any remaining plots in the table
//                        String countSql = String.format("SELECT COUNT(*) FROM %s", tableName);
//                        Integer remainingRows = usersDashPortfolioJdbcTemplate.queryForObject(countSql, Integer.class);
//                        if (remainingRows != null && remainingRows == 0) {
//                            // No remaining plots, drop the table
//                            String dropSql = String.format("DROP TABLE %s", tableName);
//                            usersDashPortfolioJdbcTemplate.execute(dropSql);
//                            logger.info("Dropped Portfolio table {} as it has no remaining plots", tableName);
//                        } else {
//                            logger.info("Portfolio table {} still has {} plots for other dashboards, not dropping", tableName, remainingRows);
//                        }
//                    }
//                }
//            } catch (Exception e) {
//                logger.error("Error deleting Portfolio plots for dashId: {}: {}", dashId, e.getMessage(), e);
//                throw new RuntimeException("Failed to delete Portfolio plots: " + e.getMessage(), e);
//            }
//
//            // Step 3: Delete the dashboard from dashboard_master in UserReg
//            dashboardMasterRepository.deleteById(dashId);
//            logger.info("Dashboard with dashId: {} deleted successfully", dashId);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Dashboard and associated plots deleted successfully");
//            return response;
//        }, "Error deleting dashboard with dashId: " + dashId);
//    }
//
//    private <T> T executeWithUserDetails(HttpServletRequest request, Function<Map<String, Object>, T> action, 
//                                        String errorMessage) {
//        try {
//            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
//            return action.apply(userDetails);
//        } catch (Exception e) {
//            logger.error("{}: {}", errorMessage, e.getMessage(), e);
//            throw new RuntimeException(errorMessage + ": " + e.getMessage());
//        }
//    }
//    
//    
//    private Map<String, Object> extractUserDetailsFromToken(HttpServletRequest request) {
//        String authHeader = request.getHeader("Authorization");
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            logger.error("Missing or invalid Authorization header");
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
//        logger.error("User not found for email: {}", email);
//        throw new RuntimeException("User not found for email: " + email);
//    }
//
//}




//package com.example.prog.serviceimpl.dashboard;
//
//import com.example.prog.config.dashboard.DashboardConfig;
//import com.example.prog.entity.CorporateUser;
//import com.example.prog.entity.UserDtls;
//import com.example.prog.entity.dashboard.DashboardMaster;
//import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
//import com.example.prog.entity.dashboard.EquityHubPlotDTO;
//import com.example.prog.entity.dashboard.PortfolioPlotDTO;
//import com.example.prog.repository.CorporateUserRepository;
//import com.example.prog.repository.UserRepository;
//import com.example.prog.repository.dashboard.DashboardMasterRepository;
//import com.example.prog.service.dashboard.DashboardEquityService;
//import com.example.prog.service.dashboard.DashboardPortfolioService;
//import com.example.prog.service.dashboard.DashboardMasterService;
//import com.example.prog.token.JwtUtil;
//import com.example.prog.utils.ChartGenerator;
//import com.example.prog.utils.DashboardUtils;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.transaction.Transactional;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Service;
//
//import java.io.IOException;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//import java.util.function.Function;
//
//@Service
//public class DashboardMasterServiceImpl implements DashboardMasterService {
//
//    private static final Logger logger = LoggerFactory.getLogger(DashboardMasterServiceImpl.class);
//
//    @Autowired
//    private DashboardMasterRepository dashboardMasterRepository;
//
//    @Autowired
//    private DashboardEquityService equityHubService;
//
//    @Autowired
//    private DashboardPortfolioService portfolioService;
//
//    @Autowired
//    @Qualifier("dashboardJdbcTemplate")
//    private JdbcTemplate dashboardJdbcTemplate;
//
//    @Autowired
//    @Qualifier("usersDashPortfolioJdbcTemplate")
//    private JdbcTemplate usersDashPortfolioJdbcTemplate;
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
//    @Override
//    @Transactional(rollbackOn = Exception.class)
//    public Map<String, Object> saveDashboard(DashboardSaveRequestDTO requestDTO, HttpServletRequest request) {
//        logger.info("Saving dashboard: {}", requestDTO.getDashboard().getDashboardName());
//        return executeWithUserDetails(request, userDetails -> {
//            Integer userId = (Integer) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            if (userId == null || userType == null) {
//                logger.error("User ID or type not found in user details");
//                throw new RuntimeException("User ID or type not found in user details");
//            }
//
//            // Prepare DashboardMaster
//            DashboardMaster dashboard = requestDTO.getDashboard();
//            dashboard.setUserId(userId);
//            dashboard.setUserType(userType);
//            dashboard.setUpdatedAt(LocalDateTime.now());
//
//            // Save DashboardMaster
//            DashboardMaster savedDashboard = dashboardMasterRepository.save(dashboard);
//            int dashId = savedDashboard.getDashId();
//            logger.info("Dashboard saved with dashId: {}", dashId);
//
//            // Save EquityHub plots
//            List<Integer> equityHubPlotIds = new ArrayList<>();
//            List<Map<String, Object>> equityResponses = new ArrayList<>();
//            List<EquityHubPlotDTO> equityPlots = requestDTO.getEquityHubPlots() != null ? 
//                                                requestDTO.getEquityHubPlots() : new ArrayList<>();
//            for (EquityHubPlotDTO plot : equityPlots) {
//                Map<String, Object> response = equityHubService.saveEquityHubPlot(
//                        dashId, userId, userType, plot.getSymbol(), plot.getCompanyName(), 
//                        plot.getGraphType(), request);
//                equityResponses.add(response);
//                if (response.containsKey("dashEquityHubId")) {
//                    equityHubPlotIds.add((Integer) response.get("dashEquityHubId"));
//                }
//            }
//
//            // Save Portfolio plots
//            List<Integer> portfolioPlotIds = new ArrayList<>();
//            List<Map<String, Object>> portfolioResponses = new ArrayList<>();
//            List<PortfolioPlotDTO> portfolioPlots = requestDTO.getPortfolioPlots() != null ? 
//                                                  requestDTO.getPortfolioPlots() : new ArrayList<>();
//            for (PortfolioPlotDTO plot : portfolioPlots) {
//                Map<String, Object> response = portfolioService.savePortfolioPlot(
//                        dashId, userId, plot.getUploadId(), plot.getGraphType(), 
//                        plot.getPlatform(), userType, request);
//                portfolioResponses.add(response);
//                if (response.containsKey("dashPortId")) {
//                    portfolioPlotIds.add((Integer) response.get("dashPortId"));
//                }
//            }
//
//            // Prepare dashboard data for JSON file
//            Map<String, Object> dashboardData = new HashMap<>();
//            dashboardData.put("dashId", dashId);
//            dashboardData.put("dashboardName", dashboard.getDashboardName());
//            dashboardData.put("userId", userId);
//            dashboardData.put("userType", userType);
//            dashboardData.put("updatedAt", dashboard.getUpdatedAt().toString());
//            Map<String, Object> plotData = new HashMap<>();
//            plotData.put("equityHubPlots", equityPlots);
//            plotData.put("portfolioPlots", portfolioPlots);
//            dashboardData.put("plots", plotData);
//
//            // Handle screenshot
//            String screenshotPath = null;
//            String base64Screenshot = null;
//            try {
//                // Use provided screenshot if available
//                if (requestDTO.getScreenshots() != null && !requestDTO.getScreenshots().isEmpty() 
//                        && requestDTO.getScreenshots().get(0).getScreenshot() != null) {
//                    base64Screenshot = requestDTO.getScreenshots().get(0).getScreenshot();
//                    logger.info("Using provided screenshot for dashId: {}", dashId);
//                } else {
//                    // Generate screenshot automatically
//                    base64Screenshot = ChartGenerator.generateDashboardScreenshot(equityPlots, portfolioPlots);
//                    logger.info("Generated automatic screenshot for dashId: {}", dashId);
//                }
//
//                // Save screenshot
//                screenshotPath = DashboardUtils.saveScreenshot(dashId, base64Screenshot, 
//                                                              DashboardConfig.getDashboardStoragePath());
//                dashboardData.put("screenshotPath", screenshotPath);
//            } catch (IOException e) {
//                logger.warn("Failed to save screenshot for dashId {}: {}", dashId, e.getMessage());
//                // Continue without screenshot
//            }
//
//            // Generate QR code
//            String qrCode = null;
//            try {
//                qrCode = DashboardUtils.generateQRCode("http://localhost:8080/api/dashboard/" + dashId);
//                dashboardData.put("qrCode", qrCode);
//            } catch (IOException e) {
//                logger.warn("Failed to generate QR code for dashId {}: {}", dashId, e.getMessage());
//            }
//
//            // Save dashboard JSON file
//            try {
//                DashboardUtils.saveDashboardFile(dashId, dashboardData, DashboardConfig.getDashboardStoragePath());
//            } catch (IOException e) {
//                logger.error("Failed to save dashboard JSON file for dashId: {}: {}", dashId, e.getMessage());
//                throw new RuntimeException("Failed to save dashboard JSON file: " + e.getMessage());
//            }
//
//            // Prepare response
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Dashboard and plots saved successfully");
//            response.put("dashId", dashId);
//            response.put("equityHubPlotIds", equityHubPlotIds);
//            response.put("portfolioPlotIds", portfolioPlotIds);
//            response.put("qrCode", qrCode);
//            if (screenshotPath != null) {
//                response.put("screenshotPath", screenshotPath);
//            }
//            return response;
//        }, "Error saving dashboard");
//    }
//
//    @Override
//    public Map<String, Object> fetchDashboards(HttpServletRequest request) {
//        logger.info("Fetching all dashboards");
//        return executeWithUserDetails(request, userDetails -> {
//            Integer userId = (Integer) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            if (userId == null || userType == null) {
//                logger.error("User ID or type not found in user details");
//                throw new RuntimeException("User ID or type not found in user details");
//            }
//
//            List<DashboardMaster> dashboards = dashboardMasterRepository.findByUserId(userId);
//            List<Map<String, Object>> dashboardData = new ArrayList<>();
//
//            for (DashboardMaster dashboard : dashboards) {
//                Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//                try {
//                    Map<String, Object> fileData = DashboardUtils.readDashboardFile(
//                            dashboard.getDashId(), DashboardConfig.getDashboardStoragePath());
//                    dashboardEntry.put("qrCode", fileData.get("qrCode"));
//                    dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
//                } catch (Exception e) {
//                    logger.warn("Failed to read dashboard file for dashId: {}: {}", dashboard.getDashId(), e.getMessage());
//                    dashboardEntry.put("qrCode", null);
//                    dashboardEntry.put("screenshotPath", null);
//                }
//                dashboardData.add(dashboardEntry);
//            }
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Dashboards fetched successfully");
//            response.put("dashboards", dashboardData);
//            return response;
//        }, "Error fetching dashboards");
//    }
//
//    @Override
//    public Map<String, Object> fetchDashboardById(int dashId, HttpServletRequest request) {
//        logger.info("Fetching dashboard with dashId: {}", dashId);
//        return executeWithUserDetails(request, userDetails -> {
//            Integer userId = (Integer) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            if (userId == null || userType == null) {
//                logger.error("User ID or type not found in user details");
//                throw new RuntimeException("User ID or type not found in user details");
//            }
//
//            Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//            if (dashboardOpt.isEmpty()) {
//                logger.warn("Dashboard with dashId: {} not found", dashId);
//                throw new RuntimeException("Dashboard not found with ID: " + dashId);
//            }
//
//            DashboardMaster dashboard = dashboardOpt.get();
//            if (dashboard.getUserId() != userId) {
//                logger.warn("UserId: {} is not authorized to access dashboard with dashId: {}", userId, dashId);
//                throw new RuntimeException("Unauthorized: You can only access your own dashboards");
//            }
//
//            Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//            try {
//                Map<String, Object> fileData = DashboardUtils.readDashboardFile(
//                        dashId, DashboardConfig.getDashboardStoragePath());
//                dashboardEntry.put("qrCode", fileData.get("qrCode"));
//                dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
//            } catch (Exception e) {
//                logger.warn("Failed to read dashboard file for dashId: {}: {}", dashId, e.getMessage());
//                dashboardEntry.put("qrCode", null);
//                dashboardEntry.put("screenshotPath", null);
//            }
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Dashboard fetched successfully");
//            response.put("dashboard", dashboardEntry);
//            return response;
//        }, "Error fetching dashboard with dashId: " + dashId);
//    }
//
//    @Override
//    @Transactional(rollbackOn = Exception.class)
//    public Map<String, Object> deleteDashboard(int dashId, HttpServletRequest request) {
//        logger.info("Deleting dashboard with dashId: {}", dashId);
//        return executeWithUserDetails(request, userDetails -> {
//            Integer userId = (Integer) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            if (userId == null || userType == null) {
//                logger.error("User ID or type not found in user details");
//                throw new RuntimeException("User ID or type not found in user details");
//            }
//
//            Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//            if (dashboardOpt.isEmpty()) {
//                logger.warn("Dashboard with dashId: {} not found", dashId);
//                throw new RuntimeException("Dashboard not found with ID: " + dashId);
//            }
//
//            DashboardMaster dashboard = dashboardOpt.get();
//            if (dashboard.getUserId() != userId) {
//                logger.warn("UserId: {} is not authorized to delete dashboard with dashId: {}", userId, dashId);
//                throw new RuntimeException("Unauthorized: You can only delete your own dashboards");
//            }
//
//            String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
//            try {
//                String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//                Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
//                if (tableCount != null && tableCount > 0) {
//                    String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", equityTable);
//                    int rowsAffected = dashboardJdbcTemplate.update(deleteSql, dashId);
//                    logger.info("Deleted {} EquityHub plots from table {} for dashId: {}", rowsAffected, equityTable, dashId);
//
//                    String countSql = String.format("SELECT COUNT(*) FROM %s", equityTable);
//                    Integer remainingRows = dashboardJdbcTemplate.queryForObject(countSql, Integer.class);
//                    if (remainingRows != null && remainingRows == 0) {
//                        String dropSql = String.format("DROP TABLE %s", equityTable);
//                        dashboardJdbcTemplate.execute(dropSql);
//                        logger.info("Dropped EquityHub table {} as it has no remaining plots", equityTable);
//                    } else {
//                        logger.info("EquityHub table {} still has {} plots for other dashboards, not dropping", equityTable, remainingRows);
//                    }
//                } else {
//                    logger.info("EquityHub table {} does not exist for dashId: {}, skipping deletion", equityTable, dashId);
//                }
//            } catch (Exception e) {
//                logger.error("Error deleting EquityHub plots for dashId: {} from table {}: {}", 
//                             dashId, equityTable, e.getMessage());
//                throw new RuntimeException("Failed to delete EquityHub plots: " + e.getMessage());
//            }
//
//            try {
//                String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId);
//                String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
//                List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);
//
//                if (matchingTables.isEmpty()) {
//                    logger.info("No portfolio tables found for pattern: {} for dashId: {}, skipping deletion", tablePattern, dashId);
//                } else {
//                    for (Map<String, Object> tableEntry : matchingTables) {
//                        String tableName = (String) tableEntry.get("TABLE_NAME");
//                        String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", tableName);
//                        int rowsAffected = usersDashPortfolioJdbcTemplate.update(deleteSql, dashId);
//                        logger.info("Deleted {} Portfolio plots from table {} for dashId: {}", rowsAffected, tableName, dashId);
//
//                        String countSql = String.format("SELECT COUNT(*) FROM %s", tableName);
//                        Integer remainingRows = usersDashPortfolioJdbcTemplate.queryForObject(countSql, Integer.class);
//                        if (remainingRows != null && remainingRows == 0) {
//                            String dropSql = String.format("DROP TABLE %s", tableName);
//                            usersDashPortfolioJdbcTemplate.execute(dropSql);
//                            logger.info("Dropped Portfolio table {} as it has no remaining plots", tableName);
//                        } else {
//                            logger.info("Portfolio table {} still has {} plots for other dashboards, not dropping", tableName, remainingRows);
//                        }
//                    }
//                }
//            } catch (Exception e) {
//                logger.error("Error deleting Portfolio plots for dashId: {}: {}", dashId, e.getMessage());
//                throw new RuntimeException("Failed to delete Portfolio plots: " + e.getMessage());
//            }
//
//            // Delete dashboard files
//            try {
//                DashboardUtils.deleteDashboardFiles(dashId, DashboardConfig.getDashboardStoragePath());
//            } catch (Exception e) {
//                logger.warn("Failed to delete dashboard files for dashId: {}: {}", dashId, e.getMessage());
//                // Continue with deletion even if file deletion fails
//            }
//
//            // Delete dashboard from database
//            dashboardMasterRepository.deleteById(dashId);
//            logger.info("Dashboard with dashId: {} deleted successfully", dashId);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Dashboard and associated plots deleted successfully");
//            return response;
//        }, "Error deleting dashboard with dashId: " + dashId);
//    }
//
//    private Map<String, Object> fetchDashboardDetails(DashboardMaster dashboard, int userId, String userType) {
//        Map<String, Object> dashboardEntry = new HashMap<>();
//        dashboardEntry.put("dashId", dashboard.getDashId());
//        dashboardEntry.put("dashboardName", dashboard.getDashboardName());
//        dashboardEntry.put("userId", dashboard.getUserId());
//        dashboardEntry.put("userType", dashboard.getUserType());
//        dashboardEntry.put("updatedAt", dashboard.getUpdatedAt());
//
//        Map<String, Object> plotData = new HashMap<>();
//        String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
//        try {
//            String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//            Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
//            if (tableCount == null || tableCount == 0) {
//                logger.warn("EquityHub table {} does not exist for dashId: {}", equityTable, dashboard.getDashId());
//                plotData.put("equityHubPlots", new ArrayList<>());
//            } else {
//                String sql = String.format("SELECT dash_equity_hub_id, graph_type, symbol, company_name FROM %s WHERE dash_id = ? AND user_id = ?", equityTable);
//                logger.debug("Executing EquityHub query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
//                List<Map<String, Object>> equityPlots = dashboardJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
//                logger.info("Fetched {} EquityHub plots for dashId: {}", equityPlots.size(), dashboard.getDashId());
//                plotData.put("equityHubPlots", equityPlots);
//            }
//        } catch (Exception e) {
//            logger.error("Error fetching EquityHub plots for dashId: {} from table {}: {}", 
//                         dashboard.getDashId(), equityTable, e.getMessage());
//            plotData.put("equityHubPlots", new ArrayList<>());
//        }
//
//        try {
//            String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId);
//            String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
//            logger.debug("Fetching portfolio tables with pattern: {}", tablePattern);
//            List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);
//
//            List<Map<String, Object>> portfolioPlots = new ArrayList<>();
//            if (matchingTables.isEmpty()) {
//                logger.warn("No portfolio tables found for pattern: {} for dashId: {}", tablePattern, dashboard.getDashId());
//            } else {
//                for (Map<String, Object> tableEntry : matchingTables) {
//                    String tableName = (String) tableEntry.get("TABLE_NAME");
//                    String sql = String.format("SELECT dash_port_id, upload_id, graph_type, platform FROM %s WHERE dash_id = ? AND user_id = ?", tableName);
//                    logger.debug("Executing Portfolio query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
//                    List<Map<String, Object>> tablePlots = usersDashPortfolioJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
//                    logger.info("Fetched {} plots from portfolio table {} for dashId: {}", tablePlots.size(), tableName, dashboard.getDashId());
//                    portfolioPlots.addAll(tablePlots);
//                }
//            }
//            plotData.put("portfolioPlots", portfolioPlots);
//        } catch (Exception e) {
//            logger.error("Error fetching Portfolio plots for dashId: {}: {}", dashboard.getDashId(), e.getMessage());
//            plotData.put("portfolioPlots", new ArrayList<>());
//        }
//
//        dashboardEntry.put("plots", plotData);
//        return dashboardEntry;
//    }
//
//    private <T> T executeWithUserDetails(HttpServletRequest request, Function<Map<String, Object>, T> action, 
//                                        String errorMessage) {
//        try {
//            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
//            return action.apply(userDetails);
//        } catch (Exception e) {
//            logger.error("{}: {}", errorMessage, e.getMessage());
//            throw new RuntimeException(errorMessage + ": " + e.getMessage());
//        }
//    }
//
//    private Map<String, Object> extractUserDetailsFromToken(HttpServletRequest request) {
//        String authHeader = request.getHeader("Authorization");
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            logger.error("Missing or invalid Authorization header");
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
//        logger.error("User not found for email: {}", email);
//        throw new RuntimeException("User not found for email: " + email);
//    }
//}




//---------------------swati----------------------



//package com.example.prog.serviceimpl.dashboard;
//
//import com.example.prog.config.dashboard.DashboardConfig;
//import com.example.prog.entity.CorporateUser;
//import com.example.prog.entity.UserDtls;
//import com.example.prog.entity.dashboard.DashboardMaster;
//import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
//import com.example.prog.entity.dashboard.EquityHubPlotDTO;
//import com.example.prog.entity.dashboard.PortfolioPlotDTO;
//import com.example.prog.repository.CorporateUserRepository;
//import com.example.prog.repository.UserRepository;
//import com.example.prog.repository.dashboard.DashboardMasterRepository;
//import com.example.prog.service.dashboard.DashboardEquityService;
//import com.example.prog.service.dashboard.DashboardPortfolioService;
//import com.example.prog.service.dashboard.DashboardMasterService;
//import com.example.prog.token.JwtUtil;
//import com.example.prog.utils.ChartGenerator;
//import com.example.prog.utils.DashboardUtils;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.transaction.Transactional;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Service;
//
//import java.io.IOException;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//import java.util.function.Function;
//
//@Service
//public class DashboardMasterServiceImpl implements DashboardMasterService {
//
//    private static final Logger logger = LoggerFactory.getLogger(DashboardMasterServiceImpl.class);
//
//    @Autowired
//    private DashboardMasterRepository dashboardMasterRepository;
//
//    @Autowired
//    private DashboardEquityService equityHubService;
//
//    @Autowired
//    private DashboardPortfolioService portfolioService;
//
//    @Autowired
//    @Qualifier("dashboardJdbcTemplate")
//    private JdbcTemplate dashboardJdbcTemplate;
//
//    @Autowired
//    @Qualifier("usersDashPortfolioJdbcTemplate")
//    private JdbcTemplate usersDashPortfolioJdbcTemplate;
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
//    @Override
//    @Transactional(rollbackOn = Exception.class)
//    public Map<String, Object> saveDashboard(DashboardSaveRequestDTO requestDTO, HttpServletRequest request) {
//        logger.info("Saving dashboard: {}", requestDTO.getDashboard().getDashboardName());
//        return executeWithUserDetails(request, userDetails -> {
//            Integer userId = (Integer) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            if (userId == null || userType == null) {
//                logger.error("User ID or type not found in user details");
//                throw new RuntimeException("User ID or type not found in user details");
//            }
//
//            DashboardMaster dashboard = requestDTO.getDashboard();
//            dashboard.setUserId(userId);
//            dashboard.setUserType(userType);
//            dashboard.setUpdatedAt(LocalDateTime.now());
//
//            DashboardMaster savedDashboard = dashboardMasterRepository.save(dashboard);
//            int dashId = savedDashboard.getDashId();
//            logger.info("Dashboard saved with dashId: {}", dashId);
//
//            List<Integer> equityHubPlotIds = new ArrayList<>();
//            List<Map<String, Object>> equityResponses = new ArrayList<>();
//            List<EquityHubPlotDTO> equityPlots = requestDTO.getEquityHubPlots() != null ? 
//                                                requestDTO.getEquityHubPlots() : new ArrayList<>();
//            for (EquityHubPlotDTO plot : equityPlots) {
//                Map<String, Object> response = equityHubService.saveEquityHubPlot(
//                        dashId, userId, userType, plot.getSymbol(), plot.getCompanyName(), 
//                        plot.getGraphType(), request);
//                equityResponses.add(response);
//                if (response.containsKey("dashEquityHubId")) {
//                    equityHubPlotIds.add((Integer) response.get("dashEquityHubId"));
//                }
//            }
//
//            List<Integer> portfolioPlotIds = new ArrayList<>();
//            List<Map<String, Object>> portfolioResponses = new ArrayList<>();
//            List<PortfolioPlotDTO> portfolioPlots = requestDTO.getPortfolioPlots() != null ? 
//                                                  requestDTO.getPortfolioPlots() : new ArrayList<>();
//            for (PortfolioPlotDTO plot : portfolioPlots) {
//                Map<String, Object> response = portfolioService.savePortfolioPlot(
//                        dashId, userId, plot.getUploadId(), plot.getGraphType(), 
//                        plot.getPlatform(), userType, request);
//                portfolioResponses.add(response);
//                if (response.containsKey("dashPortId")) {
//                    portfolioPlotIds.add((Integer) response.get("dashPortId"));
//                }
//            }
//
//            Map<String, Object> dashboardData = new HashMap<>();
//            dashboardData.put("dashId", dashId);
//            dashboardData.put("dashboardName", dashboard.getDashboardName());
//            dashboardData.put("userId", userId);
//            dashboardData.put("userType", userType);
//            dashboardData.put("updatedAt", dashboard.getUpdatedAt().toString());
//            Map<String, Object> plotData = new HashMap<>();
//            plotData.put("equityHubPlots", equityPlots);
//            plotData.put("portfolioPlots", portfolioPlots);
//            dashboardData.put("plots", plotData);
//
//            String screenshotPath = null;
//            String base64Screenshot = null;
//            try {
//                if (requestDTO.getScreenshots() != null && !requestDTO.getScreenshots().isEmpty() 
//                        && requestDTO.getScreenshots().get(0).getScreenshot() != null) {
//                    base64Screenshot = requestDTO.getScreenshots().get(0).getScreenshot();
//                    logger.info("Using provided screenshot for dashId: {}", dashId);
//                } else {
//                    base64Screenshot = ChartGenerator.generateDashboardScreenshot(equityPlots, portfolioPlots);
//                    logger.info("Generated automatic screenshot for dashId: {}", dashId);
//                }
//
//                screenshotPath = DashboardUtils.saveScreenshot(dashId, base64Screenshot, 
//                                                              DashboardConfig.getDashboardStoragePath());
//                dashboardData.put("screenshotPath", screenshotPath);
//            } catch (IOException e) {
//                logger.warn("Failed to save screenshot for dashId {}: {}", dashId, e.getMessage());
//            }
//
//            String qrCode = null;
//            try {
//                qrCode = DashboardUtils.generateQRCode("http://localhost:8080/api/dashboard/" + dashId);
//                dashboardData.put("qrCode", qrCode);
//            } catch (IOException e) {
//                logger.warn("Failed to generate QR code for dashId {}: {}", dashId, e.getMessage());
//            }
//
//            try {
//                DashboardUtils.saveDashboardFile(dashId, dashboardData, DashboardConfig.getDashboardStoragePath());
//            } catch (IOException e) {
//                logger.error("Failed to save dashboard JSON file for dashId: {}: {}", dashId, e.getMessage());
//                throw new RuntimeException("Failed to save dashboard JSON file: " + e.getMessage());
//            }
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Dashboard and plots saved successfully");
//            response.put("dashId", dashId);
//            response.put("equityHubPlotIds", equityHubPlotIds);
//            response.put("portfolioPlotIds", portfolioPlotIds);
//            response.put("qrCode", qrCode);
//            if (screenshotPath != null) {
//                response.put("screenshotPath", screenshotPath);
//            }
//            return response;
//        }, "Error saving dashboard");
//    }
//
//    @Override
//    public Map<String, Object> fetchDashboards(HttpServletRequest request) {
//        logger.info("Fetching all dashboards");
//        return executeWithUserDetails(request, userDetails -> {
//            Integer userId = (Integer) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            if (userId == null || userType == null) {
//                logger.error("User ID or type not found in user details");
//                throw new RuntimeException("User ID or type not found in user details");
//            }
//
//            List<DashboardMaster> dashboards = dashboardMasterRepository.findByUserId(userId);
//            List<Map<String, Object>> dashboardData = new ArrayList<>();
//
//            for (DashboardMaster dashboard : dashboards) {
//                Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//                try {
//                    Map<String, Object> fileData = DashboardUtils.readDashboardFile(
//                            dashboard.getDashId(), DashboardConfig.getDashboardStoragePath());
//                    dashboardEntry.put("qrCode", fileData.get("qrCode"));
//                    dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
//                } catch (Exception e) {
//                    logger.warn("Failed to read dashboard file for dashId: {}: {}", dashboard.getDashId(), e.getMessage());
//                    dashboardEntry.put("qrCode", null);
//                    dashboardEntry.put("screenshotPath", null);
//                }
//                dashboardData.add(dashboardEntry);
//            }
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Dashboards fetched successfully");
//            response.put("dashboards", dashboardData);
//            return response;
//        }, "Error fetching dashboards");
//    }
//
//    @Override
//    public Map<String, Object> fetchDashboardById(int dashId, HttpServletRequest request) {
//        logger.info("Fetching dashboard with dashId: {}", dashId);
//        return executeWithUserDetails(request, userDetails -> {
//            Integer userId = (Integer) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            if (userId == null || userType == null) {
//                logger.error("User ID or type not found in user details");
//                throw new RuntimeException("User ID or type not found in user details");
//            }
//
//            Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//            if (dashboardOpt.isEmpty()) {
//                logger.warn("Dashboard with dashId: {} not found", dashId);
//                throw new RuntimeException("Dashboard not found with ID: " + dashId);
//            }
//
//            DashboardMaster dashboard = dashboardOpt.get();
//            if (dashboard.getUserId() != userId) {
//                logger.warn("UserId: {} is not authorized to access dashboard with dashId: {}", userId, dashId);
//                throw new RuntimeException("Unauthorized: You can only access your own dashboards");
//            }
//
//            Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//            try {
//                Map<String, Object> fileData = DashboardUtils.readDashboardFile(
//                        dashId, DashboardConfig.getDashboardStoragePath());
//                dashboardEntry.put("qrCode", fileData.get("qrCode"));
//                dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
//            } catch (Exception e) {
//                logger.warn("Failed to read dashboard file for dashId: {}: {}", dashId, e.getMessage());
//                dashboardEntry.put("qrCode", null);
//                dashboardEntry.put("screenshotPath", null);
//            }
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Dashboard fetched successfully");
//            response.put("dashboard", dashboardEntry);
//            return response;
//        }, "Error fetching dashboard with dashId: " + dashId);
//    }
//
//    @Override
//    @Transactional(rollbackOn = Exception.class)
//    public Map<String, Object> deleteDashboard(int dashId, HttpServletRequest request) {
//        logger.info("Deleting dashboard with dashId: {}", dashId);
//        return executeWithUserDetails(request, userDetails -> {
//            Integer userId = (Integer) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            if (userId == null || userType == null) {
//                logger.error("User ID or type not found in user details");
//                throw new RuntimeException("User ID or type not found in user details");
//            }
//
//            Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//            if (dashboardOpt.isEmpty()) {
//                logger.warn("Dashboard with dashId: {} not found", dashId);
//                throw new RuntimeException("Dashboard not found with ID: " + dashId);
//            }
//
//            DashboardMaster dashboard = dashboardOpt.get();
//            if (dashboard.getUserId() != userId) {
//                logger.warn("UserId: {} is not authorized to delete dashboard with dashId: {}", userId, dashId);
//                throw new RuntimeException("Unauthorized: You can only delete your own dashboards");
//            }
//
//            String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
//            try {
//                String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//                Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
//                if (tableCount != null && tableCount > 0) {
//                    String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", equityTable);
//                    int rowsAffected = dashboardJdbcTemplate.update(deleteSql, dashId);
//                    logger.info("Deleted {} EquityHub plots from table {} for dashId: {}", rowsAffected, equityTable, dashId);
//
//                    String countSql = String.format("SELECT COUNT(*) FROM %s", equityTable);
//                    Integer remainingRows = dashboardJdbcTemplate.queryForObject(countSql, Integer.class);
//                    if (remainingRows != null && remainingRows == 0) {
//                        String dropSql = String.format("DROP TABLE %s", equityTable);
//                        dashboardJdbcTemplate.execute(dropSql);
//                        logger.info("Dropped EquityHub table {} as it has no remaining plots", equityTable);
//                    } else {
//                        logger.info("EquityHub table {} still has {} plots for other dashboards, not dropping", equityTable, remainingRows);
//                    }
//                } else {
//                    logger.info("EquityHub table {} does not exist for dashId: {}, skipping deletion", equityTable, dashId);
//                }
//            } catch (Exception e) {
//                logger.error("Error deleting EquityHub plots for dashId: {} from table {}: {}", 
//                             dashId, equityTable, e.getMessage());
//                throw new RuntimeException("Failed to delete EquityHub plots: " + e.getMessage());
//            }
//
//            try {
//                String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId);
//                String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
//                List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);
//
//                if (matchingTables.isEmpty()) {
//                    logger.info("No portfolio tables found for pattern: {} for dashId: {}, skipping deletion", tablePattern, dashId);
//                } else {
//                    for (Map<String, Object> tableEntry : matchingTables) {
//                        String tableName = (String) tableEntry.get("TABLE_NAME");
//                        String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", tableName);
//                        int rowsAffected = usersDashPortfolioJdbcTemplate.update(deleteSql, dashId);
//                        logger.info("Deleted {} Portfolio plots from table {} for dashId: {}", rowsAffected, tableName, dashId);
//
//                        String countSql = String.format("SELECT COUNT(*) FROM %s", tableName);
//                        Integer remainingRows = usersDashPortfolioJdbcTemplate.queryForObject(countSql, Integer.class);
//                        if (remainingRows != null && remainingRows == 0) {
//                            String dropSql = String.format("DROP TABLE %s", tableName);
//                            usersDashPortfolioJdbcTemplate.execute(dropSql);
//                            logger.info("Dropped Portfolio table {} as it has no remaining plots", tableName);
//                        } else {
//                            logger.info("Portfolio table {} still has {} plots for other dashboards, not dropping", tableName, remainingRows);
//                        }
//                    }
//                }
//            } catch (Exception e) {
//                logger.error("Error deleting Portfolio plots for dashId: {}: {}", dashId, e.getMessage());
//                throw new RuntimeException("Failed to delete Portfolio plots: " + e.getMessage());
//            }
//
//            try {
//                DashboardUtils.deleteDashboardFiles(dashId, DashboardConfig.getDashboardStoragePath());
//            } catch (Exception e) {
//                logger.warn("Failed to delete dashboard files for dashId: {}: {}", dashId, e.getMessage());
//            }
//
//            dashboardMasterRepository.deleteById(dashId);
//            logger.info("Dashboard with dashId: {} deleted successfully", dashId);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Dashboard and associated plots deleted successfully");
//            return response;
//        }, "Error deleting dashboard with dashId: " + dashId);
//    }
//    
//    
//    
//    
//    @Override
//    public Map<String, Object> fetchPublicDashboard(int dashId) {
//        logger.info("Fetching public dashboard with dashId: {}", dashId);
//        Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//        if (dashboardOpt.isEmpty()) {
//            logger.warn("Dashboard with dashId: {} not found", dashId);
//            throw new RuntimeException("Dashboard not found with ID: " + dashId);
//        }
//
//        DashboardMaster dashboard = dashboardOpt.get();
//        int userId = dashboard.getUserId();
//        String userType = dashboard.getUserType();
//
//        Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//        try {
//            Map<String, Object> fileData = DashboardUtils.readDashboardFile(
//                    dashId, DashboardConfig.getDashboardStoragePath());
//            dashboardEntry.put("qrCode", fileData.get("qrCode"));
//            dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
//        } catch (Exception e) {
//            logger.warn("Failed to read dashboard file for dashId: {}: {}", dashId, e.getMessage());
//            dashboardEntry.put("qrCode", null);
//            dashboardEntry.put("screenshotPath", null);
//        }
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("message", "Public dashboard fetched successfully");
//        response.put("dashboard", dashboardEntry);
//        return response;
//    }
//
//    @Override
//    @Transactional(rollbackOn = Exception.class)
//    public Map<String, Object> saveSnapshot(int dashId, String base64Screenshot, HttpServletRequest request) {
//        logger.info("Saving snapshot for dashId: {}", dashId);
//        return executeWithUserDetails(request, userDetails -> {
//            Integer userId = (Integer) userDetails.get("userId");
//            String userType = (String) userDetails.get("userType");
//            if (userId == null || userType == null) {
//                logger.error("User ID or type not found in user details");
//                throw new RuntimeException("User ID or type not found in user details");
//            }
//
//            Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//            if (dashboardOpt.isEmpty()) {
//                logger.warn("Dashboard with dashId: {} not found", dashId);
//                throw new RuntimeException("Dashboard not found with ID: " + dashId);
//            }
//
//            DashboardMaster dashboard = dashboardOpt.get();
//            if (dashboard.getUserId() != userId) {
//                logger.warn("UserId: {} is not authorized to update dashboard with dashId: {}", userId, dashId);
//                throw new RuntimeException("Unauthorized: You can only update your own dashboards");
//            }
//
//            Map<String, Object> dashboardData = fetchDashboardDetails(dashboard, userId, userType);
//            String screenshotPath = null;
//            try {
//                screenshotPath = DashboardUtils.saveScreenshot(dashId, base64Screenshot, 
//                                                              DashboardConfig.getDashboardStoragePath());
//                dashboardData.put("screenshotPath", screenshotPath);
//            } catch (IOException e) {
//                logger.error("Failed to save screenshot for dashId {}: {}", dashId, e.getMessage());
//                throw new RuntimeException("Failed to save screenshot: " + e.getMessage());
//            }
//
//            String qrCode = null;
//            try {
//                qrCode = DashboardUtils.generateQRCode("http://localhost:8080/api/dashboard/" + dashId);
//                dashboardData.put("qrCode", qrCode);
//            } catch (IOException e) {
//                logger.warn("Failed to generate QR code for dashId {}: {}", dashId, e.getMessage());
//            }
//
//            try {
//                DashboardUtils.saveDashboardFile(dashId, dashboardData, DashboardConfig.getDashboardStoragePath());
//            } catch (IOException e) {
//                logger.error("Failed to save dashboard JSON file for dashId: {}: {}", dashId, e.getMessage());
//                throw new RuntimeException("Failed to save dashboard JSON file: " + e.getMessage());
//            }
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Snapshot saved successfully");
//            response.put("dashId", dashId);
//            response.put("screenshotPath", screenshotPath);
//            response.put("qrCode", qrCode);
//            return response;
//        }, "Error saving snapshot for dashId: " + dashId);
//    }
//
//    private Map<String, Object> fetchDashboardDetails(DashboardMaster dashboard, int userId, String userType) {
//        Map<String, Object> dashboardEntry = new HashMap<>();
//        dashboardEntry.put("dashId", dashboard.getDashId());
//        dashboardEntry.put("dashboardName", dashboard.getDashboardName());
//        dashboardEntry.put("userId", dashboard.getUserId());
//        dashboardEntry.put("userType", dashboard.getUserType());
//        dashboardEntry.put("updatedAt", dashboard.getUpdatedAt());
//
//        Map<String, Object> plotData = new HashMap<>();
//        String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
//        try {
//            String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//            Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
//            if (tableCount == null || tableCount == 0) {
//                logger.warn("EquityHub table {} does not exist for dashId: {}", equityTable, dashboard.getDashId());
//                plotData.put("equityHubPlots", new ArrayList<>());
//            } else {
//                String sql = String.format("SELECT dash_equity_hub_id, graph_type, symbol, company_name FROM %s WHERE dash_id = ? AND user_id = ?", equityTable);
//                logger.debug("Executing EquityHub query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
//                List<Map<String, Object>> equityPlots = dashboardJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
//                logger.info("Fetched {} EquityHub plots for dashId: {}", equityPlots.size(), dashboard.getDashId());
//                plotData.put("equityHubPlots", equityPlots);
//            }
//        } catch (Exception e) {
//            logger.error("Error fetching EquityHub plots for dashId: {} from table {}: {}", 
//                         dashboard.getDashId(), equityTable, e.getMessage());
//            plotData.put("equityHubPlots", new ArrayList<>());
//        }
//
//        try {
//            String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId);
//            String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
//            logger.debug("Fetching portfolio tables with pattern: {}", tablePattern);
//            List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);
//
//            List<Map<String, Object>> portfolioPlots = new ArrayList<>();
//            if (matchingTables.isEmpty()) {
//                logger.warn("No portfolio tables found for pattern: {} for dashId: {}", tablePattern, dashboard.getDashId());
//            } else {
//                for (Map<String, Object> tableEntry : matchingTables) {
//                    String tableName = (String) tableEntry.get("TABLE_NAME");
//                    String sql = String.format("SELECT dash_port_id, upload_id, graph_type, platform FROM %s WHERE dash_id = ? AND user_id = ?", tableName);
//                    logger.debug("Executing Portfolio query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
//                    List<Map<String, Object>> tablePlots = usersDashPortfolioJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
//                    logger.info("Fetched {} plots from portfolio table {} for dashId: {}", tablePlots.size(), tableName, dashboard.getDashId());
//                    portfolioPlots.addAll(tablePlots);
//                }
//            }
//            plotData.put("portfolioPlots", portfolioPlots);
//        } catch (Exception e) {
//            logger.error("Error fetching Portfolio plots for dashId: {}: {}", dashboard.getDashId(), e.getMessage());
//            plotData.put("portfolioPlots", new ArrayList<>());
//        }
//
//        dashboardEntry.put("plots", plotData);
//        return dashboardEntry;
//    }
//
//    private <T> T executeWithUserDetails(HttpServletRequest request, Function<Map<String, Object>, T> action, 
//                                        String errorMessage) {
//        try {
//            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
//            return action.apply(userDetails);
//        } catch (Exception e) {
//            logger.error("{}: {}", errorMessage, e.getMessage());
//            throw new RuntimeException(errorMessage + ": " + e.getMessage());
//        }
//    }
//
//    private Map<String, Object> extractUserDetailsFromToken(HttpServletRequest request) {
//        String authHeader = request.getHeader("Authorization");
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            logger.error("Missing or invalid Authorization header");
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
//        logger.error("User not found for email: {}", email);
//        throw new RuntimeException("User not found for email: " + email);
//    }
//}



//------------------------18-6-25 :5.38---------------------------



// package com.example.prog.serviceimpl.dashboard;

// import com.example.prog.config.dashboard.DashboardConfig;
// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.dashboard.DashboardMaster;
// import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
// import com.example.prog.entity.dashboard.EquityHubPlotDTO;
// import com.example.prog.entity.dashboard.PortfolioPlotDTO;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.utils.DashboardUtils;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.dashboard.DashboardMasterRepository;
// import com.example.prog.service.dashboard.DashboardEquityService;
// import com.example.prog.service.dashboard.DashboardPortfolioService;
// import com.example.prog.service.dashboard.DashboardMasterService;
// import com.example.prog.token.JwtUtil;
// import com.example.prog.utils.ChartGenerator;
// import com.example.prog.utils.DashboardUtils;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.transaction.Transactional;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Qualifier;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.stereotype.Service;


// import java.io.IOException;
// import java.time.LocalDateTime;
// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.Optional;
// import java.util.function.Function;


// @Service
// public class DashboardMasterServiceImpl implements DashboardMasterService {

//     private static final Logger logger = LoggerFactory.getLogger(DashboardMasterServiceImpl.class);

//     private final DashboardMasterRepository dashboardMasterRepository;
//     private final DashboardEquityService equityHubService;
//     private final DashboardPortfolioService portfolioService;
//     private final JdbcTemplate dashboardJdbcTemplate;
//     private final JdbcTemplate usersDashPortfolioJdbcTemplate;
//     private final JwtUtil jwtUtil;
//     private final CorporateUserRepository corporateUserRepository;
//     private final UserRepository userRepository;
//     private final ObjectMapper objectMapper;
//     private final DashboardUtils dashboardUtils;
//     private final DashboardConfig dashboardConfig;

//     @Autowired
//     public DashboardMasterServiceImpl(
//             DashboardMasterRepository dashboardMasterRepository,
//             JdbcTemplate jdbcTemplate,
            
//             DashboardConfig dashboardConfig,
//             DashboardEquityService equityHubService,
//             DashboardPortfolioService portfolioService,
//             @Qualifier("dashboardJdbcTemplate") JdbcTemplate dashboardJdbcTemplate,
//             @Qualifier("usersDashPortfolioJdbcTemplate") JdbcTemplate usersDashPortfolioJdbcTemplate,
//             JwtUtil jwtUtil,
//             CorporateUserRepository corporateUserRepository,
//             UserRepository userRepository,
//             ObjectMapper objectMapper,
//             DashboardUtils dashboardUtils) {
//         this.dashboardMasterRepository = dashboardMasterRepository;
//         this.equityHubService = equityHubService;
//         this.portfolioService = portfolioService;
//         this.dashboardJdbcTemplate = dashboardJdbcTemplate;
//         this.usersDashPortfolioJdbcTemplate = usersDashPortfolioJdbcTemplate;
//         this.jwtUtil = jwtUtil;
//         this.jdbcTemplate = jdbcTemplate;
//         this.corporateUserRepository = corporateUserRepository;
//         this.userRepository = userRepository;
//         this.objectMapper = objectMapper;
//         this.dashboardConfig = dashboardConfig;
//         this.dashboardUtils = dashboardUtils;
//     }
    
//     @Override
// @Transactional(rollbackOn = Exception.class)
// public Map<String, Object> saveDashboard(DashboardSaveRequestDTO requestDTO, HttpServletRequest request) {
//     logger.info("Saving dashboard: {}", requestDTO.getDashboard().getDashboardName());
//     return executeWithUserDetails(request, userDetails -> {
//         Integer userId = (Integer) userDetails.get("userId");
//         String userType = (String) userDetails.get("userType");
//         if (userId == null || userType == null) {
//             logger.error("User ID or type not found in user details");
//             throw new RuntimeException("User ID or type not found in user details");
//         }

//         DashboardMaster dashboard = requestDTO.getDashboard();
//         dashboard.setUserId(userId);
//         dashboard.setUserType(userType);
//         dashboard.setUpdatedAt(LocalDateTime.now());

//         DashboardMaster savedDashboard = dashboardMasterRepository.save(dashboard);
//         int dashId = savedDashboard.getDashId();
//         logger.info("Dashboard saved with dashId: {}", dashId);

//         List<Integer> equityHubPlotIds = new ArrayList<>();
//         List<Map<String, Object>> equityResponses = new ArrayList<>();
//         List<EquityHubPlotDTO> equityPlots = requestDTO.getEquityHubPlots() != null ? 
//                                             requestDTO.getEquityHubPlots() : new ArrayList<>();
//         for (EquityHubPlotDTO plot : equityPlots) {
//             Map<String, Object> response = equityHubService.saveEquityHubPlot(
//                     dashId, userId, userType, plot.getSymbol(), plot.getCompanyName(), 
//                     plot.getGraphType(), request);
//             equityResponses.add(response);
//             if (response.containsKey("dashEquityHubId")) {
//                 equityHubPlotIds.add((Integer) response.get("dashEquityHubId"));
//             }
//         }

//         List<Integer> portfolioPlotIds = new ArrayList<>();
//         List<Map<String, Object>> portfolioResponses = new ArrayList<>();
//         List<PortfolioPlotDTO> portfolioPlots = requestDTO.getPortfolioPlots() != null ? 
//                                               requestDTO.getPortfolioPlots() : new ArrayList<>();
//         for (PortfolioPlotDTO plot : portfolioPlots) {
//             Map<String, Object> response = portfolioService.savePortfolioPlot(
//                     dashId, userId, plot.getUploadId(), plot.getGraphType(), 
//                     plot.getPlatform(), userType, request);
//             portfolioResponses.add(response);
//             if (response.containsKey("dashPortId")) {
//                 portfolioPlotIds.add((Integer) response.get("dashPortId"));
//             }
//         }

//         Map<String, Object> dashboardData = new HashMap<>();
//         dashboardData.put("dashId", dashId);
//         dashboardData.put("dashboardName", dashboard.getDashboardName());
//         dashboardData.put("userId", userId);
//         dashboardData.put("userType", userType);
//         dashboardData.put("updatedAt", dashboard.getUpdatedAt().toString());
//         Map<String, Object> plotData = new HashMap<>();
//         plotData.put("equityHubPlots", equityPlots);
//         plotData.put("portfolioPlots", portfolioPlots);
//         dashboardData.put("plots", plotData);

//         String screenshotPath = null;
//         String base64Screenshot = null;
//         try {
//             if (requestDTO.getScreenshots() != null && !requestDTO.getScreenshots().isEmpty() 
//                     && requestDTO.getScreenshots().get(0).getScreenshot() != null) {
//                 base64Screenshot = requestDTO.getScreenshots().get(0).getScreenshot();
//                 logger.info("Using provided screenshot for dashId: {}", dashId);
//             } else {
//                 base64Screenshot = ChartGenerator.generateDashboardScreenshot(equityPlots, portfolioPlots);
//                 logger.info("Generated automatic screenshot for dashId: {}", dashId);
//             }

//             String screenshotPathTemp = dashboardUtils.saveScreenshot(dashId, base64Screenshot, 
//                                                                      dashboardConfig.getDashboardStoragePath());
//             dashboardData.put("screenshotPath", screenshotPathTemp);
//             screenshotPath = screenshotPathTemp;
//         } catch (IOException e) {
//             logger.error("Failed to save screenshot for dashId {}: {}", dashId, e.getMessage());
//             throw new RuntimeException("Failed to save screenshot: " + e.getMessage(), e);
//         }

//         String qrCode = null;
//         try {
//             qrCode = dashboardUtils.generateQRCode("http://147.93.107.167:8181/api/dashboard/" + dashId);
//             dashboardData.put("qrCode", qrCode);
//         } catch (IOException e) {
//             logger.warn("Failed to generate QR code for dashId {}: {}", dashId, e.getMessage());
//         }

//         try {
//             dashboardUtils.saveDashboardFile(dashId, dashboardData, DashboardConfig.getDashboardStoragePath());
//         } catch (IOException e) {
//             logger.error("Failed to save dashboard JSON file for dashId: {}: {}", dashId, e.getMessage());
//             throw new RuntimeException("Failed to save dashboard JSON file: " + e.getMessage());
//         }

//         Map<String, Object> response = new HashMap<>();
//         response.put("message", "Dashboard and plots saved successfully");
//         response.put("dashId", dashId);
//         response.put("equityHubPlotIds", equityHubPlotIds);
//         response.put("portfolioPlotIds", portfolioPlotIds);
//         response.put("qrCode", qrCode);
//         if (screenshotPath != null) {
//             response.put("screenshotPath", screenshotPath);
//         }
//         return response;
//     }, "Error saving dashboard");
// }

//     @Override
//     public Map<String, Object> fetchDashboards(HttpServletRequest request) {
//         logger.info("Fetching all dashboards");
//         return executeWithUserDetails(request, userDetails -> {
//             Integer userId = (Integer) userDetails.get("userId");
//             String userType = (String) userDetails.get("userType");
//             if (userId == null || userType == null) {
//                 logger.error("User ID or type not found in user details");
//                 throw new RuntimeException("User ID or type not found in user details");
//             }

//             List<DashboardMaster> dashboards = dashboardMasterRepository.findByUserId(userId);
//             List<Map<String, Object>> dashboardData = new ArrayList<>();

//             for (DashboardMaster dashboard : dashboards) {
//                 Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//                 try {
//                     Map<String, Object> fileData = dashboardUtils.readDashboardFile(
//                             dashboard.getDashId(), DashboardConfig.getDashboardStoragePath());
//                     dashboardEntry.put("qrCode", fileData.get("qrCode"));
//                     dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
//                 } catch (Exception e) {
//                     logger.warn("Failed to read dashboard file for dashId: {}: {}", dashboard.getDashId(), e.getMessage());
//                     dashboardEntry.put("qrCode", null);
//                     dashboardEntry.put("screenshotPath", null);
//                 }
//                 dashboardData.add(dashboardEntry);
//             }

//             Map<String, Object> response = new HashMap<>();
//             response.put("message", "Dashboards fetched successfully");
//             response.put("dashboards", dashboardData);
//             return response;
//         }, "Error fetching dashboards");
//     }

//    @Override
// public Map<String, Object> fetchDashboardById(int dashId, HttpServletRequest request) {
//     logger.info("Fetching dashboard with dashId: {}", dashId);
//     return executeWithUserDetails(request, userDetails -> {
//         Integer userId = (Integer) userDetails.get("userId");
//         String userType = (String) userDetails.get("userType");
//         if (userId == null || userType == null) {
//             logger.error("User ID or type not found in user details");
//             throw new RuntimeException("User ID or type not found in user details");
//         }

//         Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//         if (dashboardOpt.isEmpty()) {
//             logger.warn("Dashboard with dashId: {} not found", dashId);
//             throw new RuntimeException("Dashboard not found with ID: " + dashId);
//         }

//         DashboardMaster dashboard = dashboardOpt.get();
//         if (dashboard.getUserId() != userId) {
//             logger.warn("UserId: {} is not authorized to access dashboard with dashId: {}", userId, dashId);
//             throw new RuntimeException("Unauthorized: You can only access your own dashboards");
//         }

//         Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//         // Updated dashboard file reading logic
//         try {
//             dashboardData = dashboardUtils.readDashboardFile(dashId, dashboardConfig.getDashboardStoragePath());
//             dashboardEntry.put("qrCode", dashboardData.get("qrCode"));
//             dashboardEntry.put("screenshotPath", dashboardData.get("screenshotPath"));
//         } catch (IOException e) {
//             logger.warn("Failed to read dashboard file for dashId: {}: {}", dashId, e.getMessage());
//             dashboardEntry.put("qrCode", null);
//             dashboardEntry.put("screenshotPath", null);
//         }

//         Map<String, Object> response = new HashMap<>();
//         response.put("message", "Dashboard fetched successfully");
//         response.put("dashboard", dashboardEntry);
//         return response;
//     }, "Error fetching dashboard with dashId: " + dashId);
// }

//     @Override
// @Transactional(rollbackOn = Exception.class)
// public Map<String, Object> deleteDashboard(int dashId, HttpServletRequest request) {
//     logger.info("Deleting dashboard with dashId: {}", dashId);
//     return executeWithUserDetails(request, userDetails -> {
//         Integer userId = (Integer) userDetails.get("userId");
//         String userType = (String) userDetails.get("userType");
//         if (userId == null || userType == null) {
//             logger.error("User ID or type not found in user details");
//             throw new RuntimeException("User ID or type not found in user details");
//         }

//         Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//         if (dashboardOpt.isEmpty()) {
//             logger.warn("Dashboard with dashId: {} not found", dashId);
//             throw new RuntimeException("Dashboard not found with ID: " + dashId);
//         }

//         DashboardMaster dashboard = dashboardOpt.get();
//         if (dashboard.getUserId() != userId) {
//             logger.warn("UserId: {} is not authorized to delete dashboard with dashId: {}", userId, dashId);
//             throw new RuntimeException("Unauthorized: You can only delete your own dashboards");
//         }

//         String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
//         try {
//             String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//             Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
//             if (tableCount != null && tableCount > 0) {
//                 String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", equityTable);
//                 int rowsAffected = dashboardJdbcTemplate.update(deleteSql, dashId);
//                 logger.info("Deleted {} EquityHub plots from table {} for dashId: {}", rowsAffected, equityTable, dashId);

//                 String countSql = String.format("SELECT COUNT(*) FROM %s", equityTable);
//                 Integer remainingRows = dashboardJdbcTemplate.queryForObject(countSql, Integer.class);
//                 if (remainingRows != null && remainingRows == 0) {
//                     String dropSql = String.format("DROP TABLE %s", equityTable);
//                     dashboardJdbcTemplate.execute(dropSql);
//                     logger.info("Dropped EquityHub table {} as it has no remaining plots", equityTable);
//                 } else {
//                     logger.info("EquityHub table {} still has {} plots for other dashboards, not dropping", equityTable, remainingRows);
//                 }
//             } else {
//                 logger.info("EquityHub table {} does not exist for dashId: {}, skipping deletion", equityTable, dashId);
//             }
//         } catch (Exception e) {
//             logger.error("Error deleting EquityHub plots for dashId: {} from table {}: {}", 
//                          dashId, equityTable, e.getMessage());
//             throw new RuntimeException("Failed to delete EquityHub plots: " + e.getMessage());
//         }

//         try {
//             String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId);
//             String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
//             List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);

//             if (matchingTables.isEmpty()) {
//                 logger.info("No portfolio tables found for pattern: {} for dashId: {}, skipping deletion", tablePattern, dashId);
//             } else {
//                 for (Map<String, Object> tableEntry : matchingTables) {
//                     String tableName = (String) tableEntry.get("TABLE_NAME");
//                     String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", tableName);
//                     int rowsAffected = usersDashPortfolioJdbcTemplate.update(deleteSql, dashId);
//                     logger.info("Deleted {} Portfolio plots from table {} for dashId: {}", rowsAffected, tableName, dashId);

//                     String countSql = String.format("SELECT COUNT(*) FROM %s", tableName);
//                     Integer remainingRows = usersDashPortfolioJdbcTemplate.queryForObject(countSql, Integer.class);
//                     if (remainingRows != null && remainingRows == 0) {
//                         String dropSql = String.format("DROP TABLE %s", tableName);
//                         usersDashPortfolioJdbcTemplate.execute(dropSql);
//                         logger.info("Dropped Portfolio table {} as it has no remaining plots", tableName);
//                     } else {
//                         logger.info("Portfolio table {} still has {} plots for other dashboards, not dropping", tableName, remainingRows);
//                     }
//                 }
//             }
//         } catch (Exception e) {
//             logger.error("Error deleting Portfolio plots for dashId: {}: {}", dashId, e.getMessage());
//             throw new RuntimeException("Failed to delete Portfolio plots: " + e.getMessage());
//         }

//         // Updated dashboard file deletion logic
//         try {
//             dashboardUtils.deleteDashboardFiles(dashId, dashboardConfig.getDashboardStoragePath());
//         } catch (IOException e) {
//             logger.warn("Failed to delete dashboard files for dashId: {}: {}", dashId, e.getMessage());
//         }

//         dashboardMasterRepository.deleteById(dashId);
//         logger.info("Dashboard with dashId: {} deleted successfully", dashId);

//         Map<String, Object> response = new HashMap<>();
//         response.put("message", "Dashboard and associated plots deleted successfully");
//         return response;
//     }, "Error deleting dashboard with dashId: " + dashId);
// }

//     @Override
//     public Map<String, Object> fetchPublicDashboard(int dashId) {
//         logger.info("Fetching public dashboard with dashId: {}", dashId);
//         Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//         if (dashboardOpt.isEmpty()) {
//             logger.warn("Dashboard with dashId: {} not found", dashId);
//             throw new RuntimeException("Dashboard not found with ID: " + dashId);
//         }

//         DashboardMaster dashboard = dashboardOpt.get();
//         int userId = dashboard.getUserId();
//         String userType = dashboard.getUserType();

//         Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//         try {
//             Map<String, Object> fileData = dashboardUtils.readDashboardFile(
//                     dashId, DashboardConfig.getDashboardStoragePath());
//             dashboardEntry.put("qrCode", fileData.get("qrCode"));
//             dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
//         } catch (Exception e) {
//             logger.warn("Failed to read dashboard file for dashId: {}: {}", dashId, e.getMessage());
//             dashboardEntry.put("qrCode", null);
//             dashboardEntry.put("screenshotPath", null);
//         }

//         Map<String, Object> response = new HashMap<>();
//         response.put("message", "Public dashboard fetched successfully");
//         response.put("dashboard", dashboardEntry);
//         return response;
//     }

//  @Override
// @Transactional(rollbackOn = Exception.class)
// public Map<String, Object> saveSnapshot(int dashId, String base64Screenshot, HttpServletRequest request) {
//     logger.info("Saving snapshot for dashId: {}", dashId);
//     return executeWithUserDetails(request, userDetails -> {
//         Integer userId = (Integer) userDetails.get("userId");
//         String userType = (String) userDetails.get("userType");
//         if (userId == null || userType == null) {
//             logger.error("User ID or type not found in user details");
//             throw new RuntimeException("User ID or type not found in user details");
//         }

//         Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//         if (dashboardOpt.isEmpty()) {
//             logger.warn("Dashboard with dashId: {} not found", dashId);
//             throw new RuntimeException("Dashboard not found with ID: " + dashId);
//         }

//         DashboardMaster dashboard = dashboardOpt.get();
//         if (dashboard.getUserId() != userId) {
//             logger.warn("UserId: {} is not authorized to update dashboard with dashId: {}", userId, dashId);
//             throw new RuntimeException("Unauthorized: You can only update your own dashboards");
//         }

//         Map<String, Object> dashboardData = fetchDashboardDetails(dashboard, userId, userType);
//         String screenshotPath = null;
//         // Updated screenshot saving logic
//         try {
//             String screenshotPath = dashboardUtils.saveScreenshot(dashId, base64Screenshot, 
//                                                                  dashboardConfig.getDashboardStoragePath());
//             dashboardData.put("screenshotPath", screenshotPath);
//         } catch (IOException e) {
//             logger.error("Failed to save screenshot for dashId {}: {}", dashId, e.getMessage());
//             throw new RuntimeException("Failed to save screenshot: " + e.getMessage(), e);
//         }

//         String qrCode = null;
//         try {
//             qrCode = dashboardUtils.generateQRCode(String.valueOf(dashId));
//             dashboardData.put("qrCode", qrCode);
//         } catch (IOException e) {
//             logger.warn("Failed to generate QR code for dashId {}: {}", dashId, e.getMessage());
//         }

//         // Updated dashboard file saving logic
//         try {
//             dashboardUtils.saveDashboardFile(dashId, dashboardData, dashboardConfig.getDashboardStoragePath());
//         } catch (IOException e) {
//             logger.error("Failed to save dashboard JSON file for dashId: {}: {}", dashId, e.getMessage());
//             throw new RuntimeException("Failed to save dashboard JSON file: " + e.getMessage(), e);
//         }

//         Map<String, Object> response = new HashMap<>();
//         response.put("message", "Snapshot saved successfully");
//         response.put("dashId", dashId);
//         response.put("screenshotPath", screenshotPath);
//         response.put("qrCode", qrCode);
//         return response;
//     }, "Error saving snapshot for dashId: " + dashId);
// }
//     private Map<String, Object> fetchDashboardDetails(DashboardMaster dashboard, int userId, String userType) {
//         Map<String, Object> dashboardEntry = new HashMap<>();
//         dashboardEntry.put("dashId", dashboard.getDashId());
//         dashboardEntry.put("dashboardName", dashboard.getDashboardName());
//         dashboardEntry.put("userId", dashboard.getUserId());
//         dashboardEntry.put("userType", dashboard.getUserType());
//         dashboardEntry.put("updatedAt", dashboard.getUpdatedAt().toString());

//         Map<String, Object> plotData = new HashMap<>();
//         String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
//         try {
//             String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//             Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
//             if (tableCount == null || tableCount == 0) {
//                 logger.warn("EquityHub table {} does not exist for dashId: {}", equityTable, dashboard.getDashId());
//                 plotData.put("equityHubPlots", new ArrayList<>());
//             } else {
//                 String sql = String.format("SELECT dash_equity_hub_id, graph_type, symbol, company_name FROM %s WHERE dash_id = ? AND user_id = ?", equityTable);
//                 logger.debug("Executing EquityHub query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
//                 List<Map<String, Object>> equityPlots = dashboardJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
//                 logger.info("Fetched {} EquityHub plots for dashId: {}", equityPlots.size(), dashboard.getDashId());
//                 plotData.put("equityHubPlots", equityPlots);
//             }
//         } catch (Exception e) {
//             logger.error("Error fetching EquityHub plots for dashId: {} from table {}: {}", 
//                          dashboard.getDashId(), equityTable, e.getMessage());
//             plotData.put("equityHubPlots", new ArrayList<>());
//         }

//         try {
//             String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId);
//             String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
//             logger.debug("Fetching portfolio tables with pattern: {}", tablePattern);
//             List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);

//             List<Map<String, Object>> portfolioPlots = new ArrayList<>();
//             if (matchingTables.isEmpty()) {
//                 logger.warn("No portfolio tables found for pattern: {} for dashId: {}", tablePattern, dashboard.getDashId());
//             } else {
//                 for (Map<String, Object> tableEntry : matchingTables) {
//                     String tableName = (String) tableEntry.get("TABLE_NAME");
//                     String sql = String.format("SELECT dash_port_id, upload_id, graph_type, platform FROM %s WHERE dash_id = ? AND user_id = ?", tableName);
//                     logger.debug("Executing Portfolio query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
//                     List<Map<String, Object>> tablePlots = usersDashPortfolioJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
//                     logger.info("Fetched {} plots from portfolio table {} for dashId: {}", tablePlots.size(), tableName, dashboard.getDashId());
//                     portfolioPlots.addAll(tablePlots);
//                 }
//             }
//             plotData.put("portfolioPlots", portfolioPlots);
//         } catch (Exception e) {
//             logger.error("Error fetching Portfolio plots for dashId: {}: {}", dashboard.getDashId(), e.getMessage());
//             plotData.put("portfolioPlots", new ArrayList<>());
//         }

//         dashboardEntry.put("plots", plotData);
//         return dashboardEntry;
//     }

//     private <T> T executeWithUserDetails(HttpServletRequest request, Function<Map<String, Object>, T> action, 
//                                         String errorMessage) {
//         try {
//             Map<String, Object> userDetails = extractUserDetailsFromToken(request);
//             return action.apply(userDetails);
//         } catch (Exception e) {
//             logger.error("{}: {}", errorMessage, e.getMessage());
//             throw new RuntimeException(errorMessage + ": " + e.getMessage());
//         }
//     }

//     private Map<String, Object> extractUserDetailsFromToken(HttpServletRequest request) {
//         String authHeader = request.getHeader("Authorization");
//         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//             logger.error("Missing or invalid Authorization header");
//             throw new RuntimeException("Missing or invalid Authorization header");
//         }

//         String jwtToken = authHeader.substring(7);
//         String email = jwtUtil.extractEmail(jwtToken);

//         CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//         if (corporateUser != null) {
//             Map<String, Object> userDetails = new HashMap<>();
//             userDetails.put("email", email);
//             userDetails.put("userType", "corporate");
//             userDetails.put("userId", corporateUser.getId());
//             return userDetails;
//         }

//         Optional<UserDtls> individualUserOpt = userRepository.findByEmail(email);
//         if (individualUserOpt.isPresent()) {
//             UserDtls individualUser = individualUserOpt.get();
//             Map<String, Object> userDetails = new HashMap<>();
//             userDetails.put("email", email);
//             userDetails.put("userType", "individual");
//             userDetails.put("userId", individualUser.getUserID());
//             return userDetails;
//         }

//         logger.error("User not found for email: {}", email);
//         throw new RuntimeException("User not found for email: " + email);
//     }
// }

















///--------------------------20/6/25 working --------------------------------



// package com.example.prog.serviceimpl.dashboard;

// import com.example.prog.config.dashboard.DashboardConfig;
// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.dashboard.DashboardMaster;
// import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
// import com.example.prog.entity.dashboard.EquityHubPlotDTO;
// import com.example.prog.entity.dashboard.PortfolioPlotDTO;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.utils.DashboardUtils;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.dashboard.DashboardMasterRepository;
// import com.example.prog.service.dashboard.DashboardEquityService;
// import com.example.prog.service.dashboard.DashboardPortfolioService;
// import com.example.prog.service.dashboard.DashboardMasterService;
// import com.example.prog.token.JwtUtil;
// import com.example.prog.utils.ChartGenerator;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.transaction.Transactional;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Qualifier;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.stereotype.Service;

// import java.io.IOException;
// import java.time.LocalDateTime;
// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.Optional;
// import java.util.function.Function;

// @Service
// public class DashboardMasterServiceImpl implements DashboardMasterService {

//     private static final Logger logger = LoggerFactory.getLogger(DashboardMasterServiceImpl.class);

//     private final DashboardMasterRepository dashboardMasterRepository;
//     private final DashboardEquityService equityHubService;
//     private final DashboardPortfolioService portfolioService;
//     private final JdbcTemplate dashboardJdbcTemplate;
//     private final JdbcTemplate usersDashPortfolioJdbcTemplate;
//     private final JdbcTemplate jdbcTemplate; // Added field
//     private final JwtUtil jwtUtil;
//     private final CorporateUserRepository corporateUserRepository;
//     private final UserRepository userRepository;
//     private final ObjectMapper objectMapper;
//     private final DashboardUtils dashboardUtils;
//     private final DashboardConfig dashboardConfig;

//     @Autowired
//     public DashboardMasterServiceImpl(
//             DashboardMasterRepository dashboardMasterRepository,
//             JdbcTemplate jdbcTemplate,
//             DashboardConfig dashboardConfig,
//             DashboardEquityService equityHubService,
//             DashboardPortfolioService portfolioService,
//             @Qualifier("dashboardJdbcTemplate") JdbcTemplate dashboardJdbcTemplate,
//             @Qualifier("usersDashPortfolioJdbcTemplate") JdbcTemplate usersDashPortfolioJdbcTemplate,
//             JwtUtil jwtUtil,
//             CorporateUserRepository corporateUserRepository,
//             UserRepository userRepository,
//             ObjectMapper objectMapper,
//             DashboardUtils dashboardUtils) {
//         this.dashboardMasterRepository = dashboardMasterRepository;
//         this.equityHubService = equityHubService;
//         this.portfolioService = portfolioService;
//         this.dashboardJdbcTemplate = dashboardJdbcTemplate;
//         this.usersDashPortfolioJdbcTemplate = usersDashPortfolioJdbcTemplate;
//         this.jdbcTemplate = jdbcTemplate;
//         this.jwtUtil = jwtUtil;
//         this.corporateUserRepository = corporateUserRepository;
//         this.userRepository = userRepository;
//         this.objectMapper = objectMapper;
//         this.dashboardUtils = dashboardUtils;
//         this.dashboardConfig = dashboardConfig;
//     }


//       private static final String DASHBOARD_STORAGE_PATH = "DashboardLogs/";

//     @Override
//     @Transactional(rollbackOn = Exception.class)
//     public Map<String, Object> saveDashboard(DashboardSaveRequestDTO requestDTO, HttpServletRequest request) {
//         logger.info("Saving dashboard: {}", requestDTO.getDashboard().getDashboardName());
//         return executeWithUserDetails(request, userDetails -> {
//             Integer userId = (Integer) userDetails.get("userId");
//             String userType = (String) userDetails.get("userType");
//             if (userId == null || userType == null) {
//                 logger.error("User ID or type not found in user details");
//                 throw new RuntimeException("User ID or type not found in user details");
//             }

//             DashboardMaster dashboard = requestDTO.getDashboard();
//             dashboard.setUserId(userId);
//             dashboard.setUserType(userType);
//             dashboard.setUpdatedAt(LocalDateTime.now());

//             DashboardMaster savedDashboard = dashboardMasterRepository.save(dashboard);
//             int dashId = savedDashboard.getDashId();
//             logger.info("Dashboard saved with dashId: {}", dashId);

//             List<Integer> equityHubPlotIds = new ArrayList<>();
//             List<Map<String, Object>> equityResponses = new ArrayList<>();
//             List<EquityHubPlotDTO> equityPlots = requestDTO.getEquityHubPlots() != null ? 
//                                                 requestDTO.getEquityHubPlots() : new ArrayList<>();
//             for (EquityHubPlotDTO plot : equityPlots) {
//                 Map<String, Object> response = equityHubService.saveEquityHubPlot(
//                         dashId, userId, userType, plot.getSymbol(), plot.getCompanyName(), 
//                         plot.getGraphType(), request);
//                 equityResponses.add(response);
//                 if (response.containsKey("dashEquityHubId")) {
//                     equityHubPlotIds.add((Integer) response.get("dashEquityHubId"));
//                 }
//             }

//             List<Integer> portfolioPlotIds = new ArrayList<>();
//             List<Map<String, Object>> portfolioResponses = new ArrayList<>();
//             List<PortfolioPlotDTO> portfolioPlots = requestDTO.getPortfolioPlots() != null ? 
//                                                   requestDTO.getPortfolioPlots() : new ArrayList<>();
//             for (PortfolioPlotDTO plot : portfolioPlots) {
//                 Map<String, Object> response = portfolioService.savePortfolioPlot(
//                         dashId, userId, plot.getUploadId(), plot.getGraphType(), 
//                         plot.getPlatform(), userType, request);
//                 portfolioResponses.add(response);
//                 if (response.containsKey("dashPortId")) {
//                     portfolioPlotIds.add((Integer) response.get("dashPortId"));
//                 }
//             }

//             Map<String, Object> dashboardData = new HashMap<>();
//             dashboardData.put("dashId", dashId);
//             dashboardData.put("dashboardName", dashboard.getDashboardName());
//             dashboardData.put("userId", userId);
//             dashboardData.put("userType", userType);
//             dashboardData.put("updatedAt", dashboard.getUpdatedAt().toString());
//             Map<String, Object> plotData = new HashMap<>();
//             plotData.put("equityHubPlots", equityPlots);
//             plotData.put("portfolioPlots", portfolioPlots);
//             dashboardData.put("plots", plotData);

//             String screenshotPath = null;
//             String base64Screenshot = null;
//             try {
//                 if (requestDTO.getScreenshots() != null && !requestDTO.getScreenshots().isEmpty() 
//                         && requestDTO.getScreenshots().get(0).getScreenshot() != null) {
//                     base64Screenshot = requestDTO.getScreenshots().get(0).getScreenshot();
//                     logger.info("Using provided screenshot for dashId: {}", dashId);
//                 } else {
//                     base64Screenshot = ChartGenerator.generateDashboardScreenshot(equityPlots, portfolioPlots);
//                     logger.info("Generated automatic screenshot for dashId: {}", dashId);
//                 }

//                 String screenshotPathTemp = dashboardUtils.saveScreenshot(dashId, base64Screenshot, 
//                                                                          dashboardConfig.getDashboardStoragePath());
//                 dashboardData.put("screenshotPath", screenshotPathTemp);
//                 screenshotPath = screenshotPathTemp;
//             } catch (IOException e) {
//                 logger.error("Failed to save screenshot for dashId {}: {}", dashId, e.getMessage());
//                 throw new RuntimeException("Failed to save screenshot: " + e.getMessage(), e);
//             }

//             String qrCode = null;
//             try {
//                 qrCode = dashboardUtils.generateQRCode("http://147.93.107.167:8181/api/dashboard/" + dashId);
//                 dashboardData.put("qrCode", qrCode);
//             } catch (IOException e) {
//                 logger.warn("Failed to generate QR code for dashId {}: {}", dashId, e.getMessage());
//             }

//             try {
//                 dashboardUtils.saveDashboardFile(dashId, dashboardData, dashboardConfig.getDashboardStoragePath());
//             } catch (IOException e) {
//                 logger.error("Failed to save dashboard JSON file for dashId: {}: {}", dashId, e.getMessage());
//                 throw new RuntimeException("Failed to save dashboard JSON file: " + e.getMessage());
//             }

//             Map<String, Object> response = new HashMap<>();
//             response.put("message", "Dashboard and plots saved successfully");
//             response.put("dashId", dashId);
//             response.put("equityHubPlotIds", equityHubPlotIds);
//             response.put("portfolioPlotIds", portfolioPlotIds);
//             response.put("qrCode", qrCode);
//             if (screenshotPath != null) {
//                 response.put("screenshotPath", screenshotPath);
//             }
//             return response;
//         }, "Error saving dashboard");
//     }

//     @Override
//     public Map<String, Object> fetchDashboards(HttpServletRequest request) {
//         logger.info("Fetching all dashboards");
//         return executeWithUserDetails(request, userDetails -> {
//             Integer userId = (Integer) userDetails.get("userId");
//             String userType = (String) userDetails.get("userType");
//             if (userId == null || userType == null) {
//                 logger.error("User ID or type not found in user details");
//                 throw new RuntimeException("User ID or type not found in user details");
//             }

//             List<DashboardMaster> dashboards = dashboardMasterRepository.findByUserId(userId);
//             List<Map<String, Object>> dashboardData = new ArrayList<>();

//             for (DashboardMaster dashboard : dashboards) {
//                 Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//                 try {
//                     Map<String, Object> fileData = dashboardUtils.readDashboardFile(
//                             dashboard.getDashId(), dashboardConfig.getDashboardStoragePath());
//                     dashboardEntry.put("qrCode", fileData.get("qrCode"));
//                     dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
//                 } catch (Exception e) {
//                     logger.warn("Failed to read dashboard file for dashId: {}: {}", dashboard.getDashId(), e.getMessage());
//                     dashboardEntry.put("qrCode", null);
//                     dashboardEntry.put("screenshotPath", null);
//                 }
//                 dashboardData.add(dashboardEntry);
//             }

//             Map<String, Object> response = new HashMap<>();
//             response.put("message", "Dashboards fetched successfully");
//             response.put("dashboards", dashboardData);
//             return response;
//         }, "Error fetching dashboards");
//     }

//     @Override
//     public Map<String, Object> fetchDashboardById(int dashId, HttpServletRequest request) {
//         logger.info("Fetching dashboard with dashId: {}", dashId);
//         return executeWithUserDetails(request, userDetails -> {
//             Integer userId = (Integer) userDetails.get("userId");
//             String userType = (String) userDetails.get("userType");
//             if (userId == null || userType == null) {
//                 logger.error("User ID or type not found in user details");
//                 throw new RuntimeException("User ID or type not found in user details");
//             }

//             Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//             if (dashboardOpt.isEmpty()) {
//                 logger.warn("Dashboard with dashId: {} not found", dashId);
//                 throw new RuntimeException("Dashboard not found with ID: " + dashId);
//             }

//             DashboardMaster dashboard = dashboardOpt.get();
//             if (dashboard.getUserId() != userId) {
//                 logger.warn("UserId: {} is not authorized to access dashboard with dashId: {}", userId, dashId);
//                 throw new RuntimeException("Unauthorized: You can only access your own dashboards");
//             }

//             Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//             try {
//                 Map<String, Object> fileData = dashboardUtils.readDashboardFile(dashId, dashboardConfig.getDashboardStoragePath());
//                 dashboardEntry.put("qrCode", fileData.get("qrCode"));
//                 dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
//             } catch (IOException e) {
//                 logger.warn("Failed to read dashboard file for dashId: {}: {}", dashId, e.getMessage());
//                 dashboardEntry.put("qrCode", null);
//                 dashboardEntry.put("screenshotPath", null);
//             }

//             Map<String, Object> response = new HashMap<>();
//             response.put("message", "Dashboard fetched successfully");
//             response.put("dashboard", dashboardEntry);
//             return response;
//         }, "Error fetching dashboard with dashId: " + dashId);
//     }

//     @Override
//     @Transactional(rollbackOn = Exception.class)
//     public Map<String, Object> deleteDashboard(int dashId, HttpServletRequest request) {
//         logger.info("Deleting dashboard with dashId: {}", dashId);
//         return executeWithUserDetails(request, userDetails -> {
//             Integer userId = (Integer) userDetails.get("userId");
//             String userType = (String) userDetails.get("userType");
//             if (userId == null || userType == null) {
//                 logger.error("User ID or type not found in user details");
//                 throw new RuntimeException("User ID or type not found in user details");
//             }

//             Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//             if (dashboardOpt.isEmpty()) {
//                 logger.warn("Dashboard with dashId: {} not found", dashId);
//                 throw new RuntimeException("Dashboard not found with ID: " + dashId);
//             }

//             DashboardMaster dashboard = dashboardOpt.get();
//             if (dashboard.getUserId() != userId) {
//                 logger.warn("UserId: {} is not authorized to delete dashboard with dashId: {}", userId, dashId);
//                 throw new RuntimeException("Unauthorized: You can only delete your own dashboards");
//             }

//             String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
//             try {
//                 String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//                 Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
//                 if (tableCount != null && tableCount > 0) {
//                     String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", equityTable);
//                     int rowsAffected = dashboardJdbcTemplate.update(deleteSql, dashId);
//                     logger.info("Deleted {} EquityHub plots from table {} for dashId: {}", rowsAffected, equityTable, dashId);

//                     String countSql = String.format("SELECT COUNT(*) FROM %s", equityTable);
//                     Integer remainingRows = dashboardJdbcTemplate.queryForObject(countSql, Integer.class);
//                     if (remainingRows != null && remainingRows == 0) {
//                         String dropSql = String.format("DROP TABLE %s", equityTable);
//                         dashboardJdbcTemplate.execute(dropSql);
//                         logger.info("Dropped EquityHub table {} as it has no remaining plots", equityTable);
//                     } else {
//                         logger.info("EquityHub table {} still has {} plots for other dashboards, not dropping", equityTable, remainingRows);
//                     }
//                 } else {
//                     logger.info("EquityHub table {} does not exist for dashId: {}, skipping deletion", equityTable, dashId);
//                 }
//             } catch (Exception e) {
//                 logger.error("Error deleting EquityHub plots for dashId: {} from table {}: {}", 
//                              dashId, equityTable, e.getMessage());
//                 throw new RuntimeException("Failed to delete EquityHub plots: " + e.getMessage());
//             }

//             try {
//                 String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId);
//                 String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
//                 List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);

//                 if (matchingTables.isEmpty()) {
//                     logger.info("No portfolio tables found for pattern: {} for dashId: {}, skipping deletion", tablePattern, dashId);
//                 } else {
//                     for (Map<String, Object> tableEntry : matchingTables) {
//                         String tableName = (String) tableEntry.get("TABLE_NAME");
//                         String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", tableName);
//                         int rowsAffected = usersDashPortfolioJdbcTemplate.update(deleteSql, dashId);
//                         logger.info("Deleted {} Portfolio plots from table {} for dashId: {}", rowsAffected, tableName, dashId);

//                         String countSql = String.format("SELECT COUNT(*) FROM %s", tableName);
//                         Integer remainingRows = usersDashPortfolioJdbcTemplate.queryForObject(countSql, Integer.class);
//                         if (remainingRows != null && remainingRows == 0) {
//                             String dropSql = String.format("DROP TABLE %s", tableName);
//                             usersDashPortfolioJdbcTemplate.execute(dropSql);
//                             logger.info("Dropped Portfolio table {} as it has no remaining plots", tableName);
//                         } else {
//                             logger.info("Portfolio table {} still has {} plots for other dashboards, not dropping", tableName, remainingRows);
//                         }
//                     }
//                 }
//             } catch (Exception e) {
//                 logger.error("Error deleting Portfolio plots for dashId: {}: {}", dashId, e.getMessage());
//                 throw new RuntimeException("Failed to delete Portfolio plots: " + e.getMessage());
//             }

//             try {
//                 dashboardUtils.deleteDashboardFiles(dashId, dashboardConfig.getDashboardStoragePath());
//             } catch (IOException e) {
//                 logger.warn("Failed to delete dashboard files for dashId: {}: {}", dashId, e.getMessage());
//             }

//             dashboardMasterRepository.deleteById(dashId);
//             logger.info("Dashboard with dashId: {} deleted successfully", dashId);

//             Map<String, Object> response = new HashMap<>();
//             response.put("message", "Dashboard and associated plots deleted successfully");
//             return response;
//         }, "Error deleting dashboard with dashId: " + dashId);
//     }

//     @Override
//     public Map<String, Object> fetchPublicDashboard(int dashId) {
//         logger.info("Fetching public dashboard with dashId: {}", dashId);
//         Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//         if (dashboardOpt.isEmpty()) {
//             logger.warn("Dashboard with dashId: {} not found", dashId);
//             throw new RuntimeException("Dashboard not found with ID: " + dashId);
//         }

//         DashboardMaster dashboard = dashboardOpt.get();
//         int userId = dashboard.getUserId();
//         String userType = dashboard.getUserType();

//         Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//         try {
//             Map<String, Object> fileData = dashboardUtils.readDashboardFile(
//                     dashId, dashboardConfig.getDashboardStoragePath());
//             dashboardEntry.put("qrCode", fileData.get("qrCode"));
//             dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
//         } catch (Exception e) {
//             logger.warn("Failed to read dashboard file for dashId: {}: {}", dashId, e.getMessage());
//             dashboardEntry.put("qrCode", null);
//             dashboardEntry.put("screenshotPath", null);
//         }

//         Map<String, Object> response = new HashMap<>();
//         response.put("message", "Public dashboard fetched successfully");
//         response.put("dashboard", dashboardEntry);
//         return response;
//     }

//     @Override
//     @Transactional(rollbackOn = Exception.class)
//     public Map<String, Object> saveSnapshot(int dashId, String base64Screenshot, HttpServletRequest request) {
//         logger.info("Saving snapshot for dashId: {}", dashId);
//         return executeWithUserDetails(request, userDetails -> {
//             Integer userId = (Integer) userDetails.get("userId");
//             String userType = (String) userDetails.get("userType");
//             if (userId == null || userType == null) {
//                 logger.error("User ID or type not found in user details");
//                 throw new RuntimeException("User ID or type not found in user details");
//             }

//             Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//             if (dashboardOpt.isEmpty()) {
//                 logger.warn("Dashboard with dashId: {} not found", dashId);
//                 throw new RuntimeException("Dashboard not found with ID: " + dashId);
//             }

//             DashboardMaster dashboard = dashboardOpt.get();
//             if (dashboard.getUserId() != userId) {
//                 logger.warn("UserId: {} is not authorized to update dashboard with dashId: {}", userId, dashId);
//                 throw new RuntimeException("Unauthorized: You can only update your own dashboards");
//             }

//             Map<String, Object> dashboardData = fetchDashboardDetails(dashboard, userId, userType);
//             String screenshotPath = null;
//             try {
//                 screenshotPath = dashboardUtils.saveScreenshot(dashId, base64Screenshot, 
//                                                               dashboardConfig.getDashboardStoragePath());
//                 dashboardData.put("screenshotPath", screenshotPath);
//             } catch (IOException e) {
//                 logger.error("Failed to save screenshot for dashId {}: {}", dashId, e.getMessage());
//                 throw new RuntimeException("Failed to save screenshot: " + e.getMessage(), e);
//             }

//             String qrCode = null;
//             try {
//                 qrCode = dashboardUtils.generateQRCode(String.valueOf(dashId));
//                 dashboardData.put("qrCode", qrCode);
//             } catch (IOException e) {
//                 logger.warn("Failed to generate QR code for dashId {}: {}", dashId, e.getMessage());
//             }

//             try {
//                 dashboardUtils.saveDashboardFile(dashId, dashboardData, dashboardConfig.getDashboardStoragePath());
//             } catch (IOException e) {
//                 logger.error("Failed to save dashboard JSON file for dashId: {}: {}", dashId, e.getMessage());
//                 throw new RuntimeException("Failed to save dashboard JSON file: " + e.getMessage());
//             }

//             Map<String, Object> response = new HashMap<>();
//             response.put("message", "Snapshot saved successfully");
//             response.put("dashId", dashId);
//             response.put("screenshotPath", screenshotPath);
//             response.put("qrCode", qrCode);
//             return response;
//         }, "Error saving snapshot for dashId: " + dashId);
//     }

//     private Map<String, Object> fetchDashboardDetails(DashboardMaster dashboard, int userId, String userType) {
//         Map<String, Object> dashboardEntry = new HashMap<>();
//         dashboardEntry.put("dashId", dashboard.getDashId());
//         dashboardEntry.put("dashboardName", dashboard.getDashboardName());
//         dashboardEntry.put("userId", dashboard.getUserId());
//         dashboardEntry.put("userType", dashboard.getUserType());
//         dashboardEntry.put("updatedAt", dashboard.getUpdatedAt().toString());

//         Map<String, Object> plotData = new HashMap<>();
//         String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
//         try {
//             String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//             Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
//             if (tableCount == null || tableCount == 0) {
//                 logger.warn("EquityHub table {} does not exist for dashId: {}", equityTable, dashboard.getDashId());
//                 plotData.put("equityHubPlots", new ArrayList<>());
//             } else {
//                 String sql = String.format("SELECT dash_equity_hub_id, graph_type, symbol, company_name FROM %s WHERE dash_id = ? AND user_id = ?", equityTable);
//                 logger.debug("Executing EquityHub query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
//                 List<Map<String, Object>> equityPlots = dashboardJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
//                 logger.info("Fetched {} EquityHub plots for dashId: {}", equityPlots.size(), dashboard.getDashId());
//                 plotData.put("equityHubPlots", equityPlots);
//             }
//         } catch (Exception e) {
//             logger.error("Error fetching EquityHub plots for dashId: {} from table {}: {}", 
//                          dashboard.getDashId(), equityTable, e.getMessage());
//             plotData.put("equityHubPlots", new ArrayList<>());
//         }

//         try {
//             String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId);
//             String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
//             logger.debug("Fetching portfolio tables with pattern: {}", tablePattern);
//             List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);

//             List<Map<String, Object>> portfolioPlots = new ArrayList<>();
//             if (matchingTables.isEmpty()) {
//                 logger.warn("No portfolio tables found for pattern: {} for dashId: {}", tablePattern, dashboard.getDashId());
//             } else {
//                 for (Map<String, Object> tableEntry : matchingTables) {
//                     String tableName = (String) tableEntry.get("TABLE_NAME");
//                     String sql = String.format("SELECT dash_port_id, upload_id, graph_type, platform FROM %s WHERE dash_id = ? AND user_id = ?", tableName);
//                     logger.debug("Executing Portfolio query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
//                     List<Map<String, Object>> tablePlots = usersDashPortfolioJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
//                     logger.info("Fetched {} plots from portfolio table {} for dashId: {}", tablePlots.size(), tableName, dashboard.getDashId());
//                     portfolioPlots.addAll(tablePlots);
//                 }
//             }
//             plotData.put("portfolioPlots", portfolioPlots);
//         } catch (Exception e) {
//             logger.error("Error fetching Portfolio plots for dashId: {}: {}", dashboard.getDashId(), e.getMessage());
//             plotData.put("portfolioPlots", new ArrayList<>());
//         }

//         dashboardEntry.put("plots", plotData);
//         return dashboardEntry;
//     }

//     private <T> T executeWithUserDetails(HttpServletRequest request, Function<Map<String, Object>, T> action, 
//                                         String errorMessage) {
//         try {
//             Map<String, Object> userDetails = extractUserDetailsFromToken(request);
//             return action.apply(userDetails);
//         } catch (Exception e) {
//             logger.error("{}: {}", errorMessage, e.getMessage());
//             throw new RuntimeException(errorMessage + ": " + e.getMessage());
//         }
//     }

//     private Map<String, Object> extractUserDetailsFromToken(HttpServletRequest request) {
//         String authHeader = request.getHeader("Authorization");
//         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//             logger.error("Missing or invalid Authorization header");
//             throw new RuntimeException("Missing or invalid Authorization header");
//         }

//         String jwtToken = authHeader.substring(7);
//         String email = jwtUtil.extractEmail(jwtToken);

//         CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//         if (corporateUser != null) {
//             Map<String, Object> userDetails = new HashMap<>();
//             userDetails.put("email", email);
//             userDetails.put("userType", "corporate");
//             userDetails.put("userId", corporateUser.getId());
//             return userDetails;
//         }

//         Optional<UserDtls> individualUserOpt = userRepository.findByEmail(email);
//         if (individualUserOpt.isPresent()) {
//             UserDtls individualUser = individualUserOpt.get();
//             Map<String, Object> userDetails = new HashMap<>();
//             userDetails.put("email", email);
//             userDetails.put("userType", "individual");
//             userDetails.put("userId", individualUser.getUserID());
//             return userDetails;
//         }

//         logger.error("User not found for email: {}", email);
//         throw new RuntimeException("User not found for email: " + email);
//     }
// }




//-------------------------------04/07/2025-------------------------


// package com.example.prog.serviceimpl.dashboard;

// import com.example.prog.config.dashboard.DashboardConfig;
// import com.example.prog.entity.CorporateUser;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.entity.dashboard.DashboardMaster;
// import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
// import com.example.prog.entity.dashboard.EquityHubPlotDTO;
// import com.example.prog.entity.dashboard.PortfolioPlotDTO;
// import com.example.prog.repository.CorporateUserRepository;
// import com.example.prog.utils.DashboardUtils;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.repository.dashboard.DashboardMasterRepository;
// import com.example.prog.service.dashboard.DashboardEquityService;
// import com.example.prog.service.dashboard.DashboardPortfolioService;
// import com.example.prog.service.dashboard.DashboardMasterService;
// import com.example.prog.token.JwtUtil;
// import com.example.prog.utils.ChartGenerator;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.transaction.Transactional;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Qualifier;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.stereotype.Service;

// import java.io.IOException;
// import java.time.LocalDateTime;
// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.Optional;
// import java.util.function.Function;

// @Service
// public class DashboardMasterServiceImpl implements DashboardMasterService {

//     private static final Logger logger = LoggerFactory.getLogger(DashboardMasterServiceImpl.class);

//     private final DashboardMasterRepository dashboardMasterRepository;
//     private final DashboardEquityService equityHubService;
//     private final DashboardPortfolioService portfolioService;
//     private final JdbcTemplate dashboardJdbcTemplate;
//     private final JdbcTemplate usersDashPortfolioJdbcTemplate;
//     private final JdbcTemplate jdbcTemplate; // Added field
//     private final JwtUtil jwtUtil;
//     private final CorporateUserRepository corporateUserRepository;
//     private final UserRepository userRepository;
//     private final ObjectMapper objectMapper;
//     private final DashboardUtils dashboardUtils;
//     private final DashboardConfig dashboardConfig;

//     @Autowired
//     public DashboardMasterServiceImpl(
//             DashboardMasterRepository dashboardMasterRepository,
//             JdbcTemplate jdbcTemplate,
//             DashboardConfig dashboardConfig,
//             DashboardEquityService equityHubService,
//             DashboardPortfolioService portfolioService,
//             @Qualifier("dashboardJdbcTemplate") JdbcTemplate dashboardJdbcTemplate,
//             @Qualifier("usersDashPortfolioJdbcTemplate") JdbcTemplate usersDashPortfolioJdbcTemplate,
//             JwtUtil jwtUtil,
//             CorporateUserRepository corporateUserRepository,
//             UserRepository userRepository,
//             ObjectMapper objectMapper,
//             DashboardUtils dashboardUtils) {
//         this.dashboardMasterRepository = dashboardMasterRepository;
//         this.equityHubService = equityHubService;
//         this.portfolioService = portfolioService;
//         this.dashboardJdbcTemplate = dashboardJdbcTemplate;
//         this.usersDashPortfolioJdbcTemplate = usersDashPortfolioJdbcTemplate;
//         this.jdbcTemplate = jdbcTemplate;
//         this.jwtUtil = jwtUtil;
//         this.corporateUserRepository = corporateUserRepository;
//         this.userRepository = userRepository;
//         this.objectMapper = objectMapper;
//         this.dashboardUtils = dashboardUtils;
//         this.dashboardConfig = dashboardConfig;
//     }


//       private static final String DASHBOARD_STORAGE_PATH = "DashboardLogs/";

//     @Override
//     @Transactional(rollbackOn = Exception.class)
//     public Map<String, Object> saveDashboard(DashboardSaveRequestDTO requestDTO, HttpServletRequest request) {
//         logger.info("Saving dashboard: {}", requestDTO.getDashboard().getDashboardName());
//         return executeWithUserDetails(request, userDetails -> {
//             Integer userId = (Integer) userDetails.get("userId");
//             String userType = (String) userDetails.get("userType");
//             if (userId == null || userType == null) {
//                 logger.error("User ID or type not found in user details");
//                 throw new RuntimeException("User ID or type not found in user details");
//             }

//             DashboardMaster dashboard = requestDTO.getDashboard();
//             dashboard.setUserId(userId);
//             dashboard.setUserType(userType);
//             dashboard.setUpdatedAt(LocalDateTime.now());

//             DashboardMaster savedDashboard = dashboardMasterRepository.save(dashboard);
//             int dashId = savedDashboard.getDashId();
//             logger.info("Dashboard saved with dashId: {}", dashId);

//             List<Integer> equityHubPlotIds = new ArrayList<>();
//             List<Map<String, Object>> equityResponses = new ArrayList<>();
//             List<EquityHubPlotDTO> equityPlots = requestDTO.getEquityHubPlots() != null ? 
//                                                 requestDTO.getEquityHubPlots() : new ArrayList<>();
//             for (EquityHubPlotDTO plot : equityPlots) {
//                 Map<String, Object> response = equityHubService.saveEquityHubPlot(
//                         dashId, userId, userType, plot.getSymbol(), plot.getCompanyName(), 
//                         plot.getGraphType(), request);
//                 equityResponses.add(response);
//                 if (response.containsKey("dashEquityHubId")) {
//                     equityHubPlotIds.add((Integer) response.get("dashEquityHubId"));
//                 }
//             }

//             List<Integer> portfolioPlotIds = new ArrayList<>();
//             List<Map<String, Object>> portfolioResponses = new ArrayList<>();
//             List<PortfolioPlotDTO> portfolioPlots = requestDTO.getPortfolioPlots() != null ? 
//                                                   requestDTO.getPortfolioPlots() : new ArrayList<>();
//             for (PortfolioPlotDTO plot : portfolioPlots) {
//                 Map<String, Object> response = portfolioService.savePortfolioPlot(
//                         dashId, userId, plot.getUploadId(), plot.getGraphType(), 
//                         plot.getPlatform(), userType, request);
//                 portfolioResponses.add(response);
//                 if (response.containsKey("dashPortId")) {
//                     portfolioPlotIds.add((Integer) response.get("dashPortId"));
//                 }
//             }

//             Map<String, Object> dashboardData = new HashMap<>();
//             dashboardData.put("dashId", dashId);
//             dashboardData.put("dashboardName", dashboard.getDashboardName());
//             dashboardData.put("userId", userId);
//             dashboardData.put("userType", userType);
//             dashboardData.put("updatedAt", dashboard.getUpdatedAt().toString());
//             Map<String, Object> plotData = new HashMap<>();
//             plotData.put("equityHubPlots", equityPlots);
//             plotData.put("portfolioPlots", portfolioPlots);
//             dashboardData.put("plots", plotData);

//             String screenshotPath = null;
//             String base64Screenshot = null;
//             try {
//                 if (requestDTO.getScreenshots() != null && !requestDTO.getScreenshots().isEmpty() 
//                         && requestDTO.getScreenshots().get(0).getScreenshot() != null) {
//                     base64Screenshot = requestDTO.getScreenshots().get(0).getScreenshot();
//                     logger.info("Using provided screenshot for dashId: {}", dashId);
//                 } else {
//                     base64Screenshot = ChartGenerator.generateDashboardScreenshot(equityPlots, portfolioPlots);
//                     logger.info("Generated automatic screenshot for dashId: {}", dashId);
//                 }

//                 String screenshotPathTemp = dashboardUtils.saveScreenshot(dashId, base64Screenshot, 
//                                                                          dashboardConfig.getDashboardStoragePath());
//                 dashboardData.put("screenshotPath", screenshotPathTemp);
//                 screenshotPath = screenshotPathTemp;
//             } catch (IOException e) {
//                 logger.error("Failed to save screenshot for dashId {}: {}", dashId, e.getMessage());
//                 throw new RuntimeException("Failed to save screenshot: " + e.getMessage(), e);
//             }

//             String qrCode = null;
//             try {
//                 qrCode = dashboardUtils.generateQRCode("http://147.93.107.167:8181/api/dashboard/" + dashId);
//                 dashboardData.put("qrCode", qrCode);
//             } catch (IOException e) {
//                 logger.warn("Failed to generate QR code for dashId {}: {}", dashId, e.getMessage());
//             }

//             try {
//                 dashboardUtils.saveDashboardFile(dashId, dashboardData, dashboardConfig.getDashboardStoragePath());
//             } catch (IOException e) {
//                 logger.error("Failed to save dashboard JSON file for dashId: {}: {}", dashId, e.getMessage());
//                 throw new RuntimeException("Failed to save dashboard JSON file: " + e.getMessage());
//             }

//             Map<String, Object> response = new HashMap<>();
//             response.put("message", "Dashboard and plots saved successfully");
//             response.put("dashId", dashId);
//             response.put("equityHubPlotIds", equityHubPlotIds);
//             response.put("portfolioPlotIds", portfolioPlotIds);
//             response.put("qrCode", qrCode);
//             if (screenshotPath != null) {
//                 response.put("screenshotPath", screenshotPath);
//             }
//             return response;
//         }, "Error saving dashboard");
//     }

//     @Override
//     public Map<String, Object> fetchDashboards(HttpServletRequest request) {
//         logger.info("Fetching all dashboards");
//         return executeWithUserDetails(request, userDetails -> {
//             Integer userId = (Integer) userDetails.get("userId");
//             String userType = (String) userDetails.get("userType");
//             if (userId == null || userType == null) {
//                 logger.error("User ID or type not found in user details");
//                 throw new RuntimeException("User ID or type not found in user details");
//             }

//             List<DashboardMaster> dashboards = dashboardMasterRepository.findByUserId(userId);
//             List<Map<String, Object>> dashboardData = new ArrayList<>();

//             for (DashboardMaster dashboard : dashboards) {
//                 Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//                 try {
//                     Map<String, Object> fileData = dashboardUtils.readDashboardFile(
//                             dashboard.getDashId(), dashboardConfig.getDashboardStoragePath());
//                     dashboardEntry.put("qrCode", fileData.get("qrCode"));
//                     dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
//                 } catch (Exception e) {
//                     logger.warn("Failed to read dashboard file for dashId: {}: {}", dashboard.getDashId(), e.getMessage());
//                     dashboardEntry.put("qrCode", null);
//                     dashboardEntry.put("screenshotPath", null);
//                 }
//                 dashboardData.add(dashboardEntry);
//             }

//             Map<String, Object> response = new HashMap<>();
//             response.put("message", "Dashboards fetched successfully");
//             response.put("dashboards", dashboardData);
//             return response;
//         }, "Error fetching dashboards");
//     }

//     @Override
//     public Map<String, Object> fetchDashboardById(int dashId, HttpServletRequest request) {
//         logger.info("Fetching dashboard with dashId: {}", dashId);
//         return executeWithUserDetails(request, userDetails -> {
//             Integer userId = (Integer) userDetails.get("userId");
//             String userType = (String) userDetails.get("userType");
//             if (userId == null || userType == null) {
//                 logger.error("User ID or type not found in user details");
//                 throw new RuntimeException("User ID or type not found in user details");
//             }

//             Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//             if (dashboardOpt.isEmpty()) {
//                 logger.warn("Dashboard with dashId: {} not found", dashId);
//                 throw new RuntimeException("Dashboard not found with ID: " + dashId);
//             }

//             DashboardMaster dashboard = dashboardOpt.get();
//             if (dashboard.getUserId() != userId) {
//                 logger.warn("UserId: {} is not authorized to access dashboard with dashId: {}", userId, dashId);
//                 throw new RuntimeException("Unauthorized: You can only access your own dashboards");
//             }

//             Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//             try {
//                 Map<String, Object> fileData = dashboardUtils.readDashboardFile(dashId, dashboardConfig.getDashboardStoragePath());
//                 dashboardEntry.put("qrCode", fileData.get("qrCode"));
//                 dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
//             } catch (IOException e) {
//                 logger.warn("Failed to read dashboard file for dashId: {}: {}", dashId, e.getMessage());
//                 dashboardEntry.put("qrCode", null);
//                 dashboardEntry.put("screenshotPath", null);
//             }

//             Map<String, Object> response = new HashMap<>();
//             response.put("message", "Dashboard fetched successfully");
//             response.put("dashboard", dashboardEntry);
//             return response;
//         }, "Error fetching dashboard with dashId: " + dashId);
//     }

//     @Override
//     @Transactional(rollbackOn = Exception.class)
//     public Map<String, Object> deleteDashboard(int dashId, HttpServletRequest request) {
//         logger.info("Deleting dashboard with dashId: {}", dashId);
//         return executeWithUserDetails(request, userDetails -> {
//             Integer userId = (Integer) userDetails.get("userId");
//             String userType = (String) userDetails.get("userType");
//             if (userId == null || userType == null) {
//                 logger.error("User ID or type not found in user details");
//                 throw new RuntimeException("User ID or type not found in user details");
//             }

//             Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//             if (dashboardOpt.isEmpty()) {
//                 logger.warn("Dashboard with dashId: {} not found", dashId);
//                 throw new RuntimeException("Dashboard not found with ID: " + dashId);
//             }

//             DashboardMaster dashboard = dashboardOpt.get();
//             if (dashboard.getUserId() != userId) {
//                 logger.warn("UserId: {} is not authorized to delete dashboard with dashId: {}", userId, dashId);
//                 throw new RuntimeException("Unauthorized: You can only delete your own dashboards");
//             }

//             String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
//             try {
//                 String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//                 Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
//                 if (tableCount != null && tableCount > 0) {
//                     String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", equityTable);
//                     int rowsAffected = dashboardJdbcTemplate.update(deleteSql, dashId);
//                     logger.info("Deleted {} EquityHub plots from table {} for dashId: {}", rowsAffected, equityTable, dashId);

//                     String countSql = String.format("SELECT COUNT(*) FROM %s", equityTable);
//                     Integer remainingRows = dashboardJdbcTemplate.queryForObject(countSql, Integer.class);
//                     if (remainingRows != null && remainingRows == 0) {
//                         String dropSql = String.format("DROP TABLE %s", equityTable);
//                         dashboardJdbcTemplate.execute(dropSql);
//                         logger.info("Dropped EquityHub table {} as it has no remaining plots", equityTable);
//                     } else {
//                         logger.info("EquityHub table {} still has {} plots for other dashboards, not dropping", equityTable, remainingRows);
//                     }
//                 } else {
//                     logger.info("EquityHub table {} does not exist for dashId: {}, skipping deletion", equityTable, dashId);
//                 }
//             } catch (Exception e) {
//                 logger.error("Error deleting EquityHub plots for dashId: {} from table {}: {}", 
//                              dashId, equityTable, e.getMessage());
//                 throw new RuntimeException("Failed to delete EquityHub plots: " + e.getMessage());
//             }

//             try {
//                 String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId);
//                 String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
//                 List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);

//                 if (matchingTables.isEmpty()) {
//                     logger.info("No portfolio tables found for pattern: {} for dashId: {}, skipping deletion", tablePattern, dashId);
//                 } else {
//                     for (Map<String, Object> tableEntry : matchingTables) {
//                         String tableName = (String) tableEntry.get("TABLE_NAME");
//                         String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", tableName);
//                         int rowsAffected = usersDashPortfolioJdbcTemplate.update(deleteSql, dashId);
//                         logger.info("Deleted {} Portfolio plots from table {} for dashId: {}", rowsAffected, tableName, dashId);

//                         String countSql = String.format("SELECT COUNT(*) FROM %s", tableName);
//                         Integer remainingRows = usersDashPortfolioJdbcTemplate.queryForObject(countSql, Integer.class);
//                         if (remainingRows != null && remainingRows == 0) {
//                             String dropSql = String.format("DROP TABLE %s", tableName);
//                             usersDashPortfolioJdbcTemplate.execute(dropSql);
//                             logger.info("Dropped Portfolio table {} as it has no remaining plots", tableName);
//                         } else {
//                             logger.info("Portfolio table {} still has {} plots for other dashboards, not dropping", tableName, remainingRows);
//                         }
//                     }
//                 }
//             } catch (Exception e) {
//                 logger.error("Error deleting Portfolio plots for dashId: {}: {}", dashId, e.getMessage());
//                 throw new RuntimeException("Failed to delete Portfolio plots: " + e.getMessage());
//             }

//             try {
//                 dashboardUtils.deleteDashboardFiles(dashId, dashboardConfig.getDashboardStoragePath());
//             } catch (IOException e) {
//                 logger.warn("Failed to delete dashboard files for dashId: {}: {}", dashId, e.getMessage());
//             }

//             dashboardMasterRepository.deleteById(dashId);
//             logger.info("Dashboard with dashId: {} deleted successfully", dashId);

//             Map<String, Object> response = new HashMap<>();
//             response.put("message", "Dashboard and associated plots deleted successfully");
//             return response;
//         }, "Error deleting dashboard with dashId: " + dashId);
//     }

//     @Override
//     public Map<String, Object> fetchPublicDashboard(int dashId) {
//         logger.info("Fetching public dashboard with dashId: {}", dashId);
//         Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//         if (dashboardOpt.isEmpty()) {
//             logger.warn("Dashboard with dashId: {} not found", dashId);
//             throw new RuntimeException("Dashboard not found with ID: " + dashId);
//         }

//         DashboardMaster dashboard = dashboardOpt.get();
//         int userId = dashboard.getUserId();
//         String userType = dashboard.getUserType();

//         Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
//         try {
//             Map<String, Object> fileData = dashboardUtils.readDashboardFile(
//                     dashId, dashboardConfig.getDashboardStoragePath());
//             dashboardEntry.put("qrCode", fileData.get("qrCode"));
//             dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
//         } catch (Exception e) {
//             logger.warn("Failed to read dashboard file for dashId: {}: {}", dashId, e.getMessage());
//             dashboardEntry.put("qrCode", null);
//             dashboardEntry.put("screenshotPath", null);
//         }

//         Map<String, Object> response = new HashMap<>();
//         response.put("message", "Public dashboard fetched successfully");
//         response.put("dashboard", dashboardEntry);
//         return response;
//     }

//     @Override
//     @Transactional(rollbackOn = Exception.class)
//     public Map<String, Object> saveSnapshot(int dashId, String base64Screenshot, HttpServletRequest request) {
//         logger.info("Saving snapshot for dashId: {}", dashId);
//         return executeWithUserDetails(request, userDetails -> {
//             Integer userId = (Integer) userDetails.get("userId");
//             String userType = (String) userDetails.get("userType");
//             if (userId == null || userType == null) {
//                 logger.error("User ID or type not found in user details");
//                 throw new RuntimeException("User ID or type not found in user details");
//             }

//             Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
//             if (dashboardOpt.isEmpty()) {
//                 logger.warn("Dashboard with dashId: {} not found", dashId);
//                 throw new RuntimeException("Dashboard not found with ID: " + dashId);
//             }

//             DashboardMaster dashboard = dashboardOpt.get();
//             if (dashboard.getUserId() != userId) {
//                 logger.warn("UserId: {} is not authorized to update dashboard with dashId: {}", userId, dashId);
//                 throw new RuntimeException("Unauthorized: You can only update your own dashboards");
//             }

//             Map<String, Object> dashboardData = fetchDashboardDetails(dashboard, userId, userType);
//             String screenshotPath = null;
//             try {
//                 screenshotPath = dashboardUtils.saveScreenshot(dashId, base64Screenshot, 
//                                                               dashboardConfig.getDashboardStoragePath());
//                 dashboardData.put("screenshotPath", screenshotPath);
//             } catch (IOException e) {
//                 logger.error("Failed to save screenshot for dashId {}: {}", dashId, e.getMessage());
//                 throw new RuntimeException("Failed to save screenshot: " + e.getMessage(), e);
//             }

//             String qrCode = null;
//             try {
//                 qrCode = dashboardUtils.generateQRCode(String.valueOf(dashId));
//                 dashboardData.put("qrCode", qrCode);
//             } catch (IOException e) {
//                 logger.warn("Failed to generate QR code for dashId {}: {}", dashId, e.getMessage());
//             }

//             try {
//                 dashboardUtils.saveDashboardFile(dashId, dashboardData, dashboardConfig.getDashboardStoragePath());
//             } catch (IOException e) {
//                 logger.error("Failed to save dashboard JSON file for dashId: {}: {}", dashId, e.getMessage());
//                 throw new RuntimeException("Failed to save dashboard JSON file: " + e.getMessage());
//             }

//             Map<String, Object> response = new HashMap<>();
//             response.put("message", "Snapshot saved successfully");
//             response.put("dashId", dashId);
//             response.put("screenshotPath", screenshotPath);
//             response.put("qrCode", qrCode);
//             return response;
//         }, "Error saving snapshot for dashId: " + dashId);
//     }

// // New method to fetch all snapshots for the user
//     @Override
//     public Map<String, Object> fetchSnapshots(HttpServletRequest request) {
//         logger.info("Fetching all snapshots");
//         return executeWithUserDetails(request, userDetails -> {
//             Integer userId = (Integer) userDetails.get("userId");
//             String userType = (String) userDetails.get("userType");
//             if (userId == null || userType == null) {
//                 logger.error("User ID or type not found in user details");
//                 throw new RuntimeException("User ID or type not found in user details");
//             }

//             List<DashboardMaster> dashboards = dashboardMasterRepository.findByUserId(userId);
//             List<Map<String, Object>> snapshotData = new ArrayList<>();

//             for (DashboardMaster dashboard : dashboards) {
//                 try {
//                     Map<String, Object> fileData = dashboardUtils.readDashboardFile(
//                             dashboard.getDashId(), dashboardConfig.getDashboardStoragePath());
//                     if (fileData.get("screenshotPath") != null) {
//                         Map<String, Object> snapshotEntry = new HashMap<>();
//                         snapshotEntry.put("dashId", dashboard.getDashId());
//                         snapshotEntry.put("dashboardName", dashboard.getDashboardName());
//                         snapshotEntry.put("screenshotPath", fileData.get("screenshotPath"));
//                         snapshotData.add(snapshotEntry);
//                     }
//                 } catch (Exception e) {
//                     logger.warn("Failed to read dashboard file for dashId: {}: {}", dashboard.getDashId(), e.getMessage());
//                 }
//             }

//             Map<String, Object> response = new HashMap<>();
//             response.put("message", "Snapshots fetched successfully");
//             response.put("snapshots", snapshotData);
//             return response;
//         }, "Error fetching snapshots");
//     }
//     private Map<String, Object> fetchDashboardDetails(DashboardMaster dashboard, int userId, String userType) {
//         Map<String, Object> dashboardEntry = new HashMap<>();
//         dashboardEntry.put("dashId", dashboard.getDashId());
//         dashboardEntry.put("dashboardName", dashboard.getDashboardName());
//         dashboardEntry.put("userId", dashboard.getUserId());
//         dashboardEntry.put("userType", dashboard.getUserType());
//         dashboardEntry.put("updatedAt", dashboard.getUpdatedAt().toString());

//         Map<String, Object> plotData = new HashMap<>();
//         String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
//         try {
//             String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//             Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
//             if (tableCount == null || tableCount == 0) {
//                 logger.warn("EquityHub table {} does not exist for dashId: {}", equityTable, dashboard.getDashId());
//                 plotData.put("equityHubPlots", new ArrayList<>());
//             } else {
//                 String sql = String.format("SELECT dash_equity_hub_id, graph_type, symbol, company_name FROM %s WHERE dash_id = ? AND user_id = ?", equityTable);
//                 logger.debug("Executing EquityHub query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
//                 List<Map<String, Object>> equityPlots = dashboardJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
//                 logger.info("Fetched {} EquityHub plots for dashId: {}", equityPlots.size(), dashboard.getDashId());
//                 plotData.put("equityHubPlots", equityPlots);
//             }
//         } catch (Exception e) {
//             logger.error("Error fetching EquityHub plots for dashId: {} from table {}: {}", 
//                          dashboard.getDashId(), equityTable, e.getMessage());
//             plotData.put("equityHubPlots", new ArrayList<>());
//         }

//         try {
//             String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId);
//             String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
//             logger.debug("Fetching portfolio tables with pattern: {}", tablePattern);
//             List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);

//             List<Map<String, Object>> portfolioPlots = new ArrayList<>();
//             if (matchingTables.isEmpty()) {
//                 logger.warn("No portfolio tables found for pattern: {} for dashId: {}", tablePattern, dashboard.getDashId());
//             } else {
//                 for (Map<String, Object> tableEntry : matchingTables) {
//                     String tableName = (String) tableEntry.get("TABLE_NAME");
//                     String sql = String.format("SELECT dash_port_id, upload_id, graph_type, platform FROM %s WHERE dash_id = ? AND user_id = ?", tableName);
//                     logger.debug("Executing Portfolio query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
//                     List<Map<String, Object>> tablePlots = usersDashPortfolioJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
//                     logger.info("Fetched {} plots from portfolio table {} for dashId: {}", tablePlots.size(), tableName, dashboard.getDashId());
//                     portfolioPlots.addAll(tablePlots);
//                 }
//             }
//             plotData.put("portfolioPlots", portfolioPlots);
//         } catch (Exception e) {
//             logger.error("Error fetching Portfolio plots for dashId: {}: {}", dashboard.getDashId(), e.getMessage());
//             plotData.put("portfolioPlots", new ArrayList<>());
//         }

//         dashboardEntry.put("plots", plotData);
//         return dashboardEntry;
//     }

//     private <T> T executeWithUserDetails(HttpServletRequest request, Function<Map<String, Object>, T> action, 
//                                         String errorMessage) {
//         try {
//             Map<String, Object> userDetails = extractUserDetailsFromToken(request);
//             return action.apply(userDetails);
//         } catch (Exception e) {
//             logger.error("{}: {}", errorMessage, e.getMessage());
//             throw new RuntimeException(errorMessage + ": " + e.getMessage());
//         }
//     }

//     private Map<String, Object> extractUserDetailsFromToken(HttpServletRequest request) {
//         String authHeader = request.getHeader("Authorization");
//         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//             logger.error("Missing or invalid Authorization header");
//             throw new RuntimeException("Missing or invalid Authorization header");
//         }

//         String jwtToken = authHeader.substring(7);
//         String email = jwtUtil.extractEmail(jwtToken);

//         CorporateUser corporateUser = corporateUserRepository.findByemail(email);
//         if (corporateUser != null) {
//             Map<String, Object> userDetails = new HashMap<>();
//             userDetails.put("email", email);
//             userDetails.put("userType", "corporate");
//             userDetails.put("userId", corporateUser.getId());
//             return userDetails;
//         }

//         Optional<UserDtls> individualUserOpt = userRepository.findByEmail(email);
//         if (individualUserOpt.isPresent()) {
//             UserDtls individualUser = individualUserOpt.get();
//             Map<String, Object> userDetails = new HashMap<>();
//             userDetails.put("email", email);
//             userDetails.put("userType", "individual");
//             userDetails.put("userId", individualUser.getUserID());
//             return userDetails;
//         }

//         logger.error("User not found for email: {}", email);
//         throw new RuntimeException("User not found for email: " + email);
//     }
// }




//====================================++++++++++++++++++++++++++++++++++++++


package com.example.prog.serviceimpl.dashboard;

import com.example.prog.config.dashboard.DashboardConfig;
import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.UserDtls;
import com.example.prog.entity.dashboard.DashboardMaster;
import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
import com.example.prog.entity.dashboard.EquityHubPlotDTO;
import com.example.prog.entity.dashboard.PortfolioPlotDTO;
import com.example.prog.repository.CorporateUserRepository;
import com.example.prog.utils.DashboardUtils;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.dashboard.DashboardMasterRepository;
import com.example.prog.service.dashboard.DashboardEquityService;
import com.example.prog.service.dashboard.DashboardPortfolioService;
import com.example.prog.service.dashboard.DashboardMasterService;
import com.example.prog.token.JwtUtil;
import com.example.prog.utils.ChartGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import java.nio.file.Files; // Added import
import java.nio.file.Path;  // Added import
import java.nio.file.Paths;

@Service
public class DashboardMasterServiceImpl implements DashboardMasterService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardMasterServiceImpl.class);

    private final DashboardMasterRepository dashboardMasterRepository;
    private final DashboardEquityService equityHubService;
    private final DashboardPortfolioService portfolioService;
    private final JdbcTemplate dashboardJdbcTemplate;
    private final JdbcTemplate usersDashPortfolioJdbcTemplate;
    private final JdbcTemplate jdbcTemplate;
    private final JwtUtil jwtUtil;
    private final CorporateUserRepository corporateUserRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final DashboardUtils dashboardUtils;
    private final DashboardConfig dashboardConfig;

    @Autowired
    public DashboardMasterServiceImpl(
            DashboardMasterRepository dashboardMasterRepository,
            JdbcTemplate jdbcTemplate,
            DashboardConfig dashboardConfig,
            DashboardEquityService equityHubService,
            DashboardPortfolioService portfolioService,
            @Qualifier("dashboardJdbcTemplate") JdbcTemplate dashboardJdbcTemplate,
            @Qualifier("usersDashPortfolioJdbcTemplate") JdbcTemplate usersDashPortfolioJdbcTemplate,
            JwtUtil jwtUtil,
            CorporateUserRepository corporateUserRepository,
            UserRepository userRepository,
            ObjectMapper objectMapper,
            DashboardUtils dashboardUtils) {
        this.dashboardMasterRepository = dashboardMasterRepository;
        this.equityHubService = equityHubService;
        this.portfolioService = portfolioService;
        this.dashboardJdbcTemplate = dashboardJdbcTemplate;
        this.usersDashPortfolioJdbcTemplate = usersDashPortfolioJdbcTemplate;
        this.jdbcTemplate = jdbcTemplate;
        this.jwtUtil = jwtUtil;
        this.corporateUserRepository = corporateUserRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
        this.dashboardUtils = dashboardUtils;
        this.dashboardConfig = dashboardConfig;
    }

    // private static final String DASHBOARD_STORAGE_PATH = "DashboardLogs/";

    // @Override
    // @Transactional(rollbackOn = Exception.class)
    // public Map<String, Object> saveDashboard(DashboardSaveRequestDTO requestDTO, HttpServletRequest request) {
    //     logger.info("Saving dashboard: {}", requestDTO.getDashboard().getDashboardName());
    //     return executeWithUserDetails(request, userDetails -> {
    //         Integer userId = (Integer) userDetails.get("userId");
    //         String userType = (String) userDetails.get("userType");
    //         if (userId == null || userType == null) {
    //             logger.error("User ID or type not found in user details");
    //             throw new RuntimeException("User ID or type not found in user details");
    //         }

    //         DashboardMaster dashboard = requestDTO.getDashboard();
    //         dashboard.setUserId(userId);
    //         dashboard.setUserType(userType);
    //         dashboard.setUpdatedAt(LocalDateTime.now());

    //         DashboardMaster savedDashboard = dashboardMasterRepository.save(dashboard);
    //         int dashId = savedDashboard.getDashId();
    //         logger.info("Dashboard saved with dashId: {}", dashId);

    //         List<Integer> equityHubPlotIds = new ArrayList<>();
    //         List<Map<String, Object>> equityResponses = new ArrayList<>();
    //         List<EquityHubPlotDTO> equityPlots = requestDTO.getEquityHubPlots() != null ? 
    //                                             requestDTO.getEquityHubPlots() : new ArrayList<>();
    //         for (EquityHubPlotDTO plot : equityPlots) {
    //             Map<String, Object> response = equityHubService.saveEquityHubPlot(
    //                     dashId, userId, userType, plot.getSymbol(), plot.getCompanyName(), 
    //                     plot.getGraphType(), request);
    //             equityResponses.add(response);
    //             if (response.containsKey("dashEquityHubId")) {
    //                 equityHubPlotIds.add((Integer) response.get("dashEquityHubId"));
    //             }
    //         }

    //         List<Integer> portfolioPlotIds = new ArrayList<>();
    //         List<Map<String, Object>> portfolioResponses = new ArrayList<>();
    //         List<PortfolioPlotDTO> portfolioPlots = requestDTO.getPortfolioPlots() != null ? 
    //                                               requestDTO.getPortfolioPlots() : new ArrayList<>();
    //         for (PortfolioPlotDTO plot : portfolioPlots) {
    //             Map<String, Object> response = portfolioService.savePortfolioPlot(
    //                     dashId, userId, plot.getUploadId(), plot.getGraphType(), 
    //                     plot.getPlatform(), userType, request);
    //             portfolioResponses.add(response);
    //             if (response.containsKey("dashPortId")) {
    //                 portfolioPlotIds.add((Integer) response.get("dashPortId"));
    //             }
    //         }

    //         Map<String, Object> dashboardData = new HashMap<>();
    //         dashboardData.put("dashId", dashId);
    //         dashboardData.put("dashboardName", dashboard.getDashboardName());
    //         dashboardData.put("userId", userId);
    //         dashboardData.put("userType", userType);
    //         dashboardData.put("updatedAt", dashboard.getUpdatedAt().toString());
    //         Map<String, Object> plotData = new HashMap<>();
    //         plotData.put("equityHubPlots", equityPlots);
    //         plotData.put("portfolioPlots", portfolioPlots);
    //         dashboardData.put("plots", plotData);

    //         String screenshotPath = null;
    //         String base64Screenshot = null;
    //         try {
    //             if (requestDTO.getScreenshots() != null && !requestDTO.getScreenshots().isEmpty() 
    //                     && requestDTO.getScreenshots().get(0).getScreenshot() != null) {
    //                 base64Screenshot = requestDTO.getScreenshots().get(0).getScreenshot();
    //                 logger.info("Using provided screenshot for dashId: {}", dashId);
    //             } else {
    //                 base64Screenshot = ChartGenerator.generateDashboardScreenshot(equityPlots, portfolioPlots);
    //                 logger.info("Generated automatic screenshot for dashId: {}", dashId);
    //             }

    //             String screenshotPathTemp = dashboardUtils.saveScreenshot(dashId, base64Screenshot, 
    //                                                                      dashboardConfig.getDashboardStoragePath());
    //             dashboardData.put("screenshotPath", screenshotPathTemp);
    //             screenshotPath = screenshotPathTemp;
    //         } catch (IOException e) {
    //             logger.error("Failed to save screenshot for dashId {}: {}", dashId, e.getMessage());
    //             throw new RuntimeException("Failed to save screenshot: " + e.getMessage(), e);
    //         }

    //         String qrCode = null;
    //         try {
    //             qrCode = dashboardUtils.generateQRCode("http://147.93.107.167:8181/api/dashboard/" + dashId);
    //             dashboardData.put("qrCode", qrCode);
    //         } catch (IOException e) {
    //             logger.warn("Failed to generate QR code for dashId {}: {}", dashId, e.getMessage());
    //         }

    //         try {
    //             dashboardUtils.saveDashboardFile(dashId, dashboardData, dashboardConfig.getDashboardStoragePath());
    //         } catch (IOException e) {
    //             logger.error("Failed to save dashboard JSON file for dashId: {}: {}", dashId, e.getMessage());
    //             throw new RuntimeException("Failed to save dashboard JSON file: " + e.getMessage());
    //         }

    //         Map<String, Object> response = new HashMap<>();
    //         response.put("message", "Dashboard and plots saved successfully");
    //         response.put("dashId", dashId);
    //         response.put("equityHubPlotIds", equityHubPlotIds);
    //         response.put("portfolioPlotIds", portfolioPlotIds);
    //         response.put("qrCode", qrCode);
    //         if (screenshotPath != null) {
    //             response.put("screenshotPath", screenshotPath);
    //         }
    //         return response;
    //     }, "Error saving dashboard");
    // }

    @Override
@Transactional(rollbackOn = Exception.class)
public Map<String, Object> saveDashboard(DashboardSaveRequestDTO requestDTO, HttpServletRequest request) {
    logger.info("Saving dashboard: {}", requestDTO.getDashboard().getDashboardName());
    return executeWithUserDetails(request, userDetails -> {
        Integer userId = (Integer) userDetails.get("userId");
        String userType = (String) userDetails.get("userType");
        if (userId == null || userType == null) {
            logger.error("User ID or type not found in user details");
            throw new RuntimeException("User ID or type not found in user details");
        }

        DashboardMaster dashboard = requestDTO.getDashboard();
        dashboard.setUserId(userId);
        dashboard.setUserType(userType);
        dashboard.setUpdatedAt(LocalDateTime.now());

        DashboardMaster savedDashboard = dashboardMasterRepository.save(dashboard);
        int dashId = savedDashboard.getDashId();
        logger.info("Dashboard saved with dashId: {}", dashId);

        List<Integer> equityHubPlotIds = new ArrayList<>();
        List<Map<String, Object>> equityResponses = new ArrayList<>();
        List<EquityHubPlotDTO> equityPlots = requestDTO.getEquityHubPlots() != null ? 
                                            requestDTO.getEquityHubPlots() : new ArrayList<>();
        for (EquityHubPlotDTO plot : equityPlots) {
            Map<String, Object> response = equityHubService.saveEquityHubPlot(
                    dashId, userId, userType, plot.getSymbol(), plot.getCompanyName(), 
                    plot.getGraphType(), request);
            equityResponses.add(response);
            if (response.containsKey("dashEquityHubId")) {
                equityHubPlotIds.add((Integer) response.get("dashEquityHubId"));
            }
        }

        List<Integer> portfolioPlotIds = new ArrayList<>();
        List<Map<String, Object>> portfolioResponses = new ArrayList<>();
        List<PortfolioPlotDTO> portfolioPlots = requestDTO.getPortfolioPlots() != null ? 
                                              requestDTO.getPortfolioPlots() : new ArrayList<>();
        for (PortfolioPlotDTO plot : portfolioPlots) {
            Map<String, Object> response = portfolioService.savePortfolioPlot(
                    dashId, userId, plot.getUploadId(), plot.getGraphType(), 
                    plot.getPlatform(), userType, request);
            portfolioResponses.add(response);
            if (response.containsKey("dashPortId")) {
                portfolioPlotIds.add((Integer) response.get("dashPortId"));
            }
        }

        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("dashId", dashId);
        dashboardData.put("dashboardName", dashboard.getDashboardName());
        dashboardData.put("userId", userId);
        dashboardData.put("userType", userType);
        dashboardData.put("updatedAt", dashboard.getUpdatedAt().toString());
        Map<String, Object> plotData = new HashMap<>();
        plotData.put("equityHubPlots", equityPlots);
        plotData.put("portfolioPlots", portfolioPlots);
        dashboardData.put("plots", plotData);

        // Only save screenshot if provided in the request
        String screenshotPath = null;
        String base64Screenshot = null;
        if (requestDTO.getScreenshots() != null && !requestDTO.getScreenshots().isEmpty() 
                && requestDTO.getScreenshots().get(0).getScreenshot() != null) {
            base64Screenshot = requestDTO.getScreenshots().get(0).getScreenshot();
            logger.info("Using provided screenshot for dashId: {}", dashId);
            try {
                screenshotPath = dashboardUtils.saveScreenshot(dashId, base64Screenshot, 
                                                              dashboardConfig.getDashboardStoragePath());
                dashboardData.put("screenshotPath", screenshotPath);
            } catch (IOException e) {
                logger.error("Failed to save screenshot for dashId {}: {}", dashId, e.getMessage());
                throw new RuntimeException("Failed to save screenshot: " + e.getMessage(), e);
            }
        } else {
            logger.info("No screenshot provided for dashId: {}, skipping screenshot save", dashId);
        }

        String qrCode = null;
        if (screenshotPath != null) { // Only generate QR code if screenshot is saved
            try {
                qrCode = dashboardUtils.generateQRCode("https://cmdahub.com/api/dashboard/" + dashId);
                dashboardData.put("qrCode", qrCode);
            } catch (IOException e) {
                logger.warn("Failed to generate QR code for dashId {}: {}", dashId, e.getMessage());
            }
        }

        try {
            dashboardUtils.saveDashboardFile(dashId, dashboardData, dashboardConfig.getDashboardStoragePath());
        } catch (IOException e) {
            logger.error("Failed to save dashboard JSON file for dashId: {}: {}", dashId, e.getMessage());
            throw new RuntimeException("Failed to save dashboard JSON file: " + e.getMessage());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Dashboard and plots saved successfully");
        response.put("dashId", dashId);
        response.put("equityHubPlotIds", equityHubPlotIds);
        response.put("portfolioPlotIds", portfolioPlotIds);
        if (qrCode != null) {
            response.put("qrCode", qrCode);
        }
        if (screenshotPath != null) {
            response.put("screenshotPath", screenshotPath);
        }
        return response;
    }, "Error saving dashboard");
}

    @Override
    public Map<String, Object> fetchDashboards(HttpServletRequest request) {
        logger.info("Fetching all dashboards");
        return executeWithUserDetails(request, userDetails -> {
            Integer userId = (Integer) userDetails.get("userId");
            String userType = (String) userDetails.get("userType");
            if (userId == null || userType == null) {
                logger.error("User ID or type not found in user details");
                throw new RuntimeException("User ID or type not found in user details");
            }

            List<DashboardMaster> dashboards = dashboardMasterRepository.findByUserId(userId);
            List<Map<String, Object>> dashboardData = new ArrayList<>();

            for (DashboardMaster dashboard : dashboards) {
                Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
                try {
                    Map<String, Object> fileData = dashboardUtils.readDashboardFile(
                            dashboard.getDashId(), dashboardConfig.getDashboardStoragePath());
                    dashboardEntry.put("qrCode", fileData.get("qrCode"));
                    dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
                } catch (Exception e) {
                    logger.warn("Failed to read dashboard file for dashId: {}: {}", dashboard.getDashId(), e.getMessage());
                    dashboardEntry.put("qrCode", null);
                    dashboardEntry.put("screenshotPath", null);
                }
                dashboardData.add(dashboardEntry);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Dashboards fetched successfully");
            response.put("dashboards", dashboardData);
            return response;
        }, "Error fetching dashboards");
    }

    @Override
    public Map<String, Object> fetchDashboardById(int dashId, HttpServletRequest request) {
        logger.info("Fetching dashboard with dashId: {}", dashId);
        return executeWithUserDetails(request, userDetails -> {
            Integer userId = (Integer) userDetails.get("userId");
            String userType = (String) userDetails.get("userType");
            if (userId == null || userType == null) {
                logger.error("User ID or type not found in user details");
                throw new RuntimeException("User ID or type not found in user details");
            }

            Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
            if (dashboardOpt.isEmpty()) {
                logger.warn("Dashboard with dashId: {} not found", dashId);
                throw new RuntimeException("Dashboard not found with ID: " + dashId);
            }

            DashboardMaster dashboard = dashboardOpt.get();
            if (dashboard.getUserId() != userId) {
                logger.warn("UserId: {} is not authorized to access dashboard with dashId: {}", userId, dashId);
                throw new RuntimeException("Unauthorized: You can only access your own dashboards");
            }

            Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
            try {
                Map<String, Object> fileData = dashboardUtils.readDashboardFile(dashId, dashboardConfig.getDashboardStoragePath());
                dashboardEntry.put("qrCode", fileData.get("qrCode"));
                dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
            } catch (IOException e) {
                logger.warn("Failed to read dashboard file for dashId: {}: {}", dashId, e.getMessage());
                dashboardEntry.put("qrCode", null);
                dashboardEntry.put("screenshotPath", null);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Dashboard fetched successfully");
            response.put("dashboard", dashboardEntry);
            return response;
        }, "Error fetching dashboard with dashId: " + dashId);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public Map<String, Object> deleteDashboard(int dashId, HttpServletRequest request) {
        logger.info("Deleting dashboard with dashId: {}", dashId);
        return executeWithUserDetails(request, userDetails -> {
            Integer userId = (Integer) userDetails.get("userId");
            String userType = (String) userDetails.get("userType");
            if (userId == null || userType == null) {
                logger.error("User ID or type not found in user details");
                throw new RuntimeException("User ID or type not found in user details");
            }

            Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
            if (dashboardOpt.isEmpty()) {
                logger.warn("Dashboard with dashId: {} not found", dashId);
                throw new RuntimeException("Dashboard not found with ID: " + dashId);
            }

            DashboardMaster dashboard = dashboardOpt.get();
            if (dashboard.getUserId() != userId) {
                logger.warn("UserId: {} is not authorized to delete dashboard with dashId: {}", userId, dashId);
                throw new RuntimeException("Unauthorized: You can only delete your own dashboards");
            }

            String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
            try {
                String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
                Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
                if (tableCount != null && tableCount > 0) {
                    String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", equityTable);
                    int rowsAffected = dashboardJdbcTemplate.update(deleteSql, dashId);
                    logger.info("Deleted {} EquityHub plots from table {} for dashId: {}", rowsAffected, equityTable, dashId);

                    String countSql = String.format("SELECT COUNT(*) FROM %s", equityTable);
                    Integer remainingRows = dashboardJdbcTemplate.queryForObject(countSql, Integer.class);
                    if (remainingRows != null && remainingRows == 0) {
                        String dropSql = String.format("DROP TABLE %s", equityTable);
                        dashboardJdbcTemplate.execute(dropSql);
                        logger.info("Dropped EquityHub table {} as it has no remaining plots", equityTable);
                    } else {
                        logger.info("EquityHub table {} still has {} plots for other dashboards, not dropping", equityTable, remainingRows);
                    }
                } else {
                    logger.info("EquityHub table {} does not exist for dashId: {}, skipping deletion", equityTable, dashId);
                }
            } catch (Exception e) {
                logger.error("Error deleting EquityHub plots for dashId: {} from table {}: {}", 
                             dashId, equityTable, e.getMessage());
                throw new RuntimeException("Failed to delete EquityHub plots: " + e.getMessage());
            }

            try {
                String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId);
                String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
                List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);

                if (matchingTables.isEmpty()) {
                    logger.info("No portfolio tables found for pattern: {} for dashId: {}, skipping deletion", tablePattern, dashId);
                } else {
                    for (Map<String, Object> tableEntry : matchingTables) {
                        String tableName = (String) tableEntry.get("TABLE_NAME");
                        String deleteSql = String.format("DELETE FROM %s WHERE dash_id = ?", tableName);
                        int rowsAffected = usersDashPortfolioJdbcTemplate.update(deleteSql, dashId);
                        logger.info("Deleted {} Portfolio plots from table {} for dashId: {}", rowsAffected, tableName, dashId);

                        String countSql = String.format("SELECT COUNT(*) FROM %s", tableName);
                        Integer remainingRows = usersDashPortfolioJdbcTemplate.queryForObject(countSql, Integer.class);
                        if (remainingRows != null && remainingRows == 0) {
                            String dropSql = String.format("DROP TABLE %s", tableName);
                            usersDashPortfolioJdbcTemplate.execute(dropSql);
                            logger.info("Dropped Portfolio table {} as it has no remaining plots", tableName);
                        } else {
                            logger.info("Portfolio table {} still has {} plots for other dashboards, not dropping", tableName, remainingRows);
                        }
                    }
                }
            } catch (Exception e) {
                logger.error("Error deleting Portfolio plots for dashId: {}: {}", dashId, e.getMessage());
                throw new RuntimeException("Failed to delete Portfolio plots: " + e.getMessage());
            }

            try {
                dashboardUtils.deleteDashboardFiles(dashId, dashboardConfig.getDashboardStoragePath());
            } catch (IOException e) {
                logger.warn("Failed to delete dashboard files for dashId: {}: {}", dashId, e.getMessage());
            }

            dashboardMasterRepository.deleteById(dashId);
            logger.info("Dashboard with dashId: {} deleted successfully", dashId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Dashboard and associated plots deleted successfully");
            return response;
        }, "Error deleting dashboard with dashId: " + dashId);
    }

    @Override
    public Map<String, Object> fetchPublicDashboard(int dashId) {
        logger.info("Fetching public dashboard with dashId: {}", dashId);
        Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
        if (dashboardOpt.isEmpty()) {
            logger.warn("Dashboard with dashId: {} not found", dashId);
            throw new RuntimeException("Dashboard not found with ID: " + dashId);
        }

        DashboardMaster dashboard = dashboardOpt.get();
        int userId = dashboard.getUserId();
        String userType = dashboard.getUserType();

        Map<String, Object> dashboardEntry = fetchDashboardDetails(dashboard, userId, userType);
        try {
            Map<String, Object> fileData = dashboardUtils.readDashboardFile(
                    dashId, dashboardConfig.getDashboardStoragePath());
            dashboardEntry.put("qrCode", fileData.get("qrCode"));
            dashboardEntry.put("screenshotPath", fileData.get("screenshotPath"));
        } catch (Exception e) {
            logger.warn("Failed to read dashboard file for dashId: {}: {}", dashId, e.getMessage());
            dashboardEntry.put("qrCode", null);
            dashboardEntry.put("screenshotPath", null);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Public dashboard fetched successfully");
        response.put("dashboard", dashboardEntry);
        return response;
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public Map<String, Object> saveSnapshot(int dashId, String base64Screenshot, HttpServletRequest request) {
        logger.info("Saving snapshot for dashId: {}", dashId);
        return executeWithUserDetails(request, userDetails -> {
            Integer userId = (Integer) userDetails.get("userId");
            String userType = (String) userDetails.get("userType");
            if (userId == null || userType == null) {
                logger.error("User ID or type not found in user details");
                throw new RuntimeException("User ID or type not found in user details");
            }

            Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.findById(dashId);
            if (dashboardOpt.isEmpty()) {
                logger.warn("Dashboard with dashId: {} not found", dashId);
                throw new RuntimeException("Dashboard not found with ID: " + dashId);
            }

            DashboardMaster dashboard = dashboardOpt.get();
            if (dashboard.getUserId() != userId) {
                logger.warn("UserId: {} is not authorized to update dashboard with dashId: {}", userId, dashId);
                throw new RuntimeException("Unauthorized: You can only update your own dashboards");
            }

            Map<String, Object> dashboardData = fetchDashboardDetails(dashboard, userId, userType);
            String screenshotPath = null;
            try {
                screenshotPath = dashboardUtils.saveScreenshot(dashId, base64Screenshot, 
                                                              dashboardConfig.getDashboardStoragePath());
                dashboardData.put("screenshotPath", screenshotPath);
            } catch (IOException e) {
                logger.error("Failed to save screenshot for dashId {}: {}", dashId, e.getMessage());
                throw new RuntimeException("Failed to save screenshot: " + e.getMessage(), e);
            }

            String qrCode = null;
            try {
                qrCode = dashboardUtils.generateQRCode(String.valueOf(dashId));
                dashboardData.put("qrCode", qrCode);
            } catch (IOException e) {
                logger.warn("Failed to generate QR code for dashId {}: {}", dashId, e.getMessage());
            }

            try {
                dashboardUtils.saveDashboardFile(dashId, dashboardData, dashboardConfig.getDashboardStoragePath());
            } catch (IOException e) {
                logger.error("Failed to save dashboard JSON file for dashId: {}: {}", dashId, e.getMessage());
                throw new RuntimeException("Failed to save dashboard JSON file: " + e.getMessage());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Snapshot saved successfully");
            response.put("dashId", dashId);
            response.put("screenshotPath", screenshotPath);
            response.put("qrCode", qrCode);
            return response;
        }, "Error saving snapshot for dashId: " + dashId);
    }


//     @Override
//     @Transactional(rollbackOn = Exception.class)
//     public Map<String, Object> deleteSnapshot(int dashId, HttpServletRequest request) {
//         logger.info("Deleting snapshot for dashId: {}", dashId);

//         return executeWithUserDetails(request, userDetails -> {
//             Integer userId = (Integer) userDetails.get("userId");
//             String userType = (String) userDetails.get("userType");

//             if (userId == null || userType == null) {
//                 logger.error("User ID or type not found in user details");
//                 throw new RuntimeException("User ID or type not found in user details");
//             }

//             // Validate ownership of dashboard
//             Optional<DashboardMaster> dashboardOpt = dashboardMasterRepository.getDashboardByDashId(dashId);
//             if (dashboardOpt.isEmpty()) {
//                 logger.warn("Dashboard with dashId: {} not found", dashId);
//                 throw new RuntimeException("Dashboard not found with ID: " + dashId);
//             }

//             DashboardMaster dashboard = dashboardOpt.get();
// //            if (!dashboard.getUserId().equals(userId)) {
//             if (dashboard.getUserId() != userId) {
//                 logger.warn("UserId: {} is not authorized to delete snapshot for dashId: {}", userId, dashId);
//                 throw new RuntimeException("Unauthorized: You can only delete your own dashboard snapshots");
//             }

//             // Delete screenshot and update JSON
//             try {
//                 boolean deleted = dashboardUtils.deleteSnapshotFile(dashId, dashboardConfig.getDashboardStoragePath());
                
//                 if (!deleted) {
//                     logger.warn("No snapshot file found for dashId: {}", dashId);
//                 }
//                 // dashboardMasterRepository.clearScreenshotPath(dashId);
//             } catch (IOException e) {
//                 logger.error("Failed to delete snapshot for dashId: {}: {}", dashId, e.getMessage());
//                 throw new RuntimeException("Failed to delete snapshot: " + e.getMessage());
//             }

//             Map<String, Object> response = new HashMap<>();
//             response.put("message", "Snapshot deleted successfully");
//             response.put("dashId", dashId);
//             return response;

//         }, "Error deleting snapshot for dashId: " + dashId);
//     }


// @Override
// @Transactional(rollbackOn = Exception.class)
// public Map<String, Object> deleteSnapshot(int dashId, HttpServletRequest request) {
//     logger.info("Deleting snapshot for dashId: {}", dashId);

//     return executeWithUserDetails(request, userDetails -> {
//         Integer userId = (Integer) userDetails.get("userId");
//         String userType = (String) userDetails.get("userType");

//         if (userId == null || userType == null) {
//             logger.error("User ID or type is missing in user details");
//             throw new RuntimeException("Missing user ID or user type");
//         }

//         // Fetch and validate dashboard
//         DashboardMaster dashboard = dashboardMasterRepository.getDashboardByDashId(dashId)
//                 .orElseThrow(() -> {
//                     logger.warn("Dashboard with dashId {} not found", dashId);
//                     return new RuntimeException("Dashboard not found with ID: " + dashId);
//                 });

//         if (dashboard.getUserId() != userId) {
//             logger.warn("User ID {} is not authorized to delete snapshot for dashId {}", userId, dashId);
//             throw new RuntimeException("Unauthorized: You can only delete your own dashboard snapshots.");
//         }

//         try {
//             boolean deleted = dashboardUtils.deleteSnapshotFile(dashId, dashboardConfig.getDashboardStoragePath());
//             if (!deleted) {
//                 logger.warn("No snapshot file found for dashId: {}", dashId);
//             }

//             // ✅ Clear screenshot path in DB
//             // dashboardMasterRepository.clearScreenshotPath(dashId);
//         } catch (IOException e) {
//             logger.error("Error deleting snapshot file for dashId {}: {}", dashId, e.getMessage());
//             throw new RuntimeException("Failed to delete snapshot: " + e.getMessage(), e);
//         }

//         Map<String, Object> response = new HashMap<>();
//         response.put("message", "Snapshot deleted successfully");
//         response.put("dashId", dashId);
//         return response;

//     }, "Error deleting snapshot for dashId: " + dashId);
// }

@Override
    @Transactional(rollbackOn = Exception.class)
    public Map<String, Object> deleteSnapshot(int dashId, HttpServletRequest request) {
        logger.info("Deleting snapshot for dashId: {}", dashId);

        return executeWithUserDetails(request, userDetails -> {
            Integer userId = (Integer) userDetails.get("userId");
            String userType = (String) userDetails.get("userType");

            if (userId == null || userType == null) {
                logger.error("User ID or type is missing in user details");
                throw new RuntimeException("Missing user ID or user type");
            }

            DashboardMaster dashboard = dashboardMasterRepository.getDashboardByDashId(dashId)
                    .orElseThrow(() -> {
                        logger.warn("Dashboard with dashId {} not found", dashId);
                        return new RuntimeException("Dashboard not found with ID: " + dashId);
                    });

            if (dashboard.getUserId() != userId) {
                logger.warn("User ID {} is not authorized to delete snapshot for dashId {}", userId, dashId);
                throw new RuntimeException("Unauthorized: You can only delete your own dashboard snapshots.");
            }

            Map<String, Object> response = new HashMap<>();
            // try {
            //    boolean deleted = dashboardUtils.deleteSnapshotFile(dashId, dashboardConfig.getDashboardStoragePath());
            //     dashboardMasterRepository.clearScreenshotPath(dashId);
            //     response.put("dashId", dashId);
            //     if (!deleted) {
            //         logger.warn("No snapshot file found for dashId: {}", dashId);
            //         response.put("message", "No snapshot found for the specified dashboard");
            //         return response;
            //     }
            //     response.put("message", "Snapshot deleted successfully");
            // } catch (IOException e) {
            //     logger.error("Error deleting snapshot file for dashId {}: {}", dashId, e.getMessage());
            //     throw new RuntimeException("Failed to delete snapshot: " + e.getMessage(), e);
            // }
            try {
                boolean deleted = dashboardUtils.deleteSnapshotFile(dashId, dashboardConfig.getDashboardStoragePath());
                dashboardMasterRepository.clearScreenshotPath(dashId);
                // Optionally delete JSON file to clear QR code
                Path jsonPath = Paths.get(dashboardConfig.getDashboardStoragePath(), "dashboard_" + dashId + ".json");
                Files.deleteIfExists(jsonPath);
                response.put("dashId", dashId);
                if (!deleted) {
                    logger.warn("No snapshot file found for dashId: {}", dashId);
                    response.put("message", "No snapshot found for the specified dashboard");
                    return response;
                }
                response.put("message", "Snapshot deleted successfully");
            } catch (IOException e) {
                logger.error("Error deleting snapshot file for dashId {}: {}", dashId, e.getMessage());
                throw new RuntimeException("Failed to delete snapshot: " + e.getMessage(), e);
            }
            return response;
        }, "Error deleting snapshot for dashId: " + dashId);
    }


    // @Override
    // public Map<String, Object> fetchSnapshots(HttpServletRequest request) {
    //     logger.info("Fetching all snapshots for request");
    //     return executeWithUserDetails(request, userDetails -> {
    //         Integer userId = (Integer) userDetails.get("userId");
    //         String userType = (String) userDetails.get("userType");
    //         if (userId == null || userType == null) {
    //             logger.error("User ID or type not found in user details: userId={}, userType={}", userId, userType);
    //             throw new RuntimeException("User ID or type not found in user details");
    //         }

    //         logger.debug("Fetching dashboards for userId: {}", userId);
    //         List<DashboardMaster> dashboards = dashboardMasterRepository.findByUserId(userId);
    //         logger.debug("Found {} dashboards for userId: {}", dashboards.size(), userId);

    //         List<Map<String, Object>> snapshotData = new ArrayList<>();
    //         if (dashboards.isEmpty()) {
    //             logger.warn("No dashboards found for userId: {}", userId);
    //         } else {
    //             for (DashboardMaster dashboard : dashboards) {
    //                 logger.debug("Processing dashboard: dashId={}, dashboardName={}", 
    //                            dashboard.getDashId(), dashboard.getDashboardName());
    //                 try {
    //                     Map<String, Object> fileData = dashboardUtils.readDashboardFile(
    //                             dashboard.getDashId(), dashboardConfig.getDashboardStoragePath());
    //                     logger.debug("File data for dashId {}: {}", dashboard.getDashId(), fileData);
    //                     if (fileData != null && fileData.containsKey("screenshotPath") && 
    //                         fileData.get("screenshotPath") != null) {
    //                         Map<String, Object> snapshotEntry = new HashMap<>();
    //                         snapshotEntry.put("dashId", dashboard.getDashId());
    //                         snapshotEntry.put("dashboardName", dashboard.getDashboardName());
    //                         snapshotEntry.put("screenshotPath", fileData.get("screenshotPath"));
    //                         snapshotData.add(snapshotEntry);
    //                         logger.debug("Added snapshot entry: {}", snapshotEntry);
    //                     } else {
    //                         logger.warn("No valid screenshotPath found for dashId: {}", dashboard.getDashId());
    //                     }
    //                 } catch (Exception e) {
    //                     logger.error("Failed to read dashboard file for dashId: {} with error: {}", 
    //                                dashboard.getDashId(), e.getMessage(), e);
    //                 }
    //             }
    //         }

    //         Map<String, Object> response = new HashMap<>();
    //         response.put("message", "Snapshots fetched successfully");
    //         response.put("snapshots", snapshotData);
    //         logger.info("Returning {} snapshots for userId: {}", snapshotData.size(), userId);
    //         return response;
    //     }, "Error fetching snapshots");
    // }

    @Override
public Map<String, Object> fetchSnapshots(HttpServletRequest request) {
    logger.info("Fetching all snapshots for request");
    return executeWithUserDetails(request, userDetails -> {
        Integer userId = (Integer) userDetails.get("userId");
        String userType = (String) userDetails.get("userType");
        if (userId == null || userType == null) {
            logger.error("User ID or type not found in user details: userId={}, userType={}", userId, userType);
            throw new RuntimeException("User ID or type not found in user details");
        }

        logger.debug("Fetching dashboards for userId: {}", userId);
        List<DashboardMaster> dashboards = dashboardMasterRepository.findByUserId(userId);
        logger.debug("Found {} dashboards for userId: {}", dashboards.size(), userId);

        List<Map<String, Object>> snapshotData = new ArrayList<>();
        if (dashboards.isEmpty()) {
            logger.warn("No dashboards found for userId: {}", userId);
        } else {
            for (DashboardMaster dashboard : dashboards) {
                logger.debug("Processing dashboard: dashId={}, dashboardName={}", 
                           dashboard.getDashId(), dashboard.getDashboardName());
                try {
                    Path screenshotPath = Paths.get(dashboardConfig.getDashboardStoragePath(), 
                                                 "dashboard_" + dashboard.getDashId() + "_screenshot.png");
                    if (Files.exists(screenshotPath)) {
                        Map<String, Object> fileData = dashboardUtils.readDashboardFile(
                                dashboard.getDashId(), dashboardConfig.getDashboardStoragePath());
                        if (fileData != null && fileData.containsKey("screenshotPath") && 
                            fileData.get("screenshotPath") != null) {
                            Map<String, Object> snapshotEntry = new HashMap<>();
                            snapshotEntry.put("dashId", dashboard.getDashId());
                            snapshotEntry.put("dashboardName", dashboard.getDashboardName());
                            snapshotEntry.put("screenshotPath", fileData.get("screenshotPath"));
                            snapshotData.add(snapshotEntry);
                            logger.debug("Added snapshot entry: {}", snapshotEntry);
                        }
                    } else {
                        logger.debug("No snapshot found for dashId: {}", dashboard.getDashId());
                    }
                } catch (Exception e) {
                    logger.error("Failed to read dashboard file for dashId: {} with error: {}", 
                               dashboard.getDashId(), e.getMessage(), e);
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Snapshots fetched successfully");
        response.put("snapshots", snapshotData);
        logger.info("Returning {} snapshots for userId: {}", snapshotData.size(), userId);
        return response;
    }, "Error fetching snapshots");
}

    private Map<String, Object> fetchDashboardDetails(DashboardMaster dashboard, int userId, String userType) {
        Map<String, Object> dashboardEntry = new HashMap<>();
        dashboardEntry.put("dashId", dashboard.getDashId());
        dashboardEntry.put("dashboardName", dashboard.getDashboardName());
        dashboardEntry.put("userId", dashboard.getUserId());
        dashboardEntry.put("userType", dashboard.getUserType());
        dashboardEntry.put("updatedAt", dashboard.getUpdatedAt().toString());

        Map<String, Object> plotData = new HashMap<>();
        String equityTable = String.format("%s_%d_equityhub", userType.toLowerCase(), userId);
        try {
            String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
            Integer tableCount = dashboardJdbcTemplate.queryForObject(checkTableSql, Integer.class, equityTable);
            if (tableCount == null || tableCount == 0) {
                logger.warn("EquityHub table {} does not exist for dashId: {}", equityTable, dashboard.getDashId());
                plotData.put("equityHubPlots", new ArrayList<>());
            } else {
                String sql = String.format("SELECT dash_equity_hub_id, graph_type, symbol, company_name FROM %s WHERE dash_id = ? AND user_id = ?", equityTable);
                logger.debug("Executing EquityHub query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
                List<Map<String, Object>> equityPlots = dashboardJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
                logger.info("Fetched {} EquityHub plots for dashId: {}", equityPlots.size(), dashboard.getDashId());
                plotData.put("equityHubPlots", equityPlots);
            }
        } catch (Exception e) {
            logger.error("Error fetching EquityHub plots for dashId: {} from table {}: {}", 
                         dashboard.getDashId(), equityTable, e.getMessage());
            plotData.put("equityHubPlots", new ArrayList<>());
        }

        try {
            String tablePattern = String.format("%s%d_%%_portdashboard", userType.toLowerCase(), userId);
            String sqlTables = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?";
            logger.debug("Fetching portfolio tables with pattern: {}", tablePattern);
            List<Map<String, Object>> matchingTables = usersDashPortfolioJdbcTemplate.queryForList(sqlTables, tablePattern);

            List<Map<String, Object>> portfolioPlots = new ArrayList<>();
            if (matchingTables.isEmpty()) {
                logger.warn("No portfolio tables found for pattern: {} for dashId: {}", tablePattern, dashboard.getDashId());
            } else {
                for (Map<String, Object> tableEntry : matchingTables) {
                    String tableName = (String) tableEntry.get("TABLE_NAME");
                    String sql = String.format("SELECT dash_port_id, upload_id, graph_type, platform FROM %s WHERE dash_id = ? AND user_id = ?", tableName);
                    logger.debug("Executing Portfolio query: {} with dashId={}, userId={}", sql, dashboard.getDashId(), userId);
                    List<Map<String, Object>> tablePlots = usersDashPortfolioJdbcTemplate.queryForList(sql, dashboard.getDashId(), userId);
                    logger.info("Fetched {} plots from portfolio table {} for dashId: {}", tablePlots.size(), tableName, dashboard.getDashId());
                    portfolioPlots.addAll(tablePlots);
                }
            }
            plotData.put("portfolioPlots", portfolioPlots);
        } catch (Exception e) {
            logger.error("Error fetching Portfolio plots for dashId: {}: {}", dashboard.getDashId(), e.getMessage());
            plotData.put("portfolioPlots", new ArrayList<>());
        }

        dashboardEntry.put("plots", plotData);
        return dashboardEntry;
    }

    private <T> T executeWithUserDetails(HttpServletRequest request, Function<Map<String, Object>, T> action, 
                                        String errorMessage) {
        try {
            Map<String, Object> userDetails = extractUserDetailsFromToken(request);
            return action.apply(userDetails);
        } catch (Exception e) {
            logger.error("{}: {}", errorMessage, e.getMessage());
            throw new RuntimeException(errorMessage + ": " + e.getMessage());
        }
    }

    private Map<String, Object> extractUserDetailsFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.error("Missing or invalid Authorization header");
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String jwtToken = authHeader.substring(7);
        String email = jwtUtil.extractEmail(jwtToken);
        logger.debug("Extracted email from token: {}", email);

        CorporateUser corporateUser = corporateUserRepository.findByemail(email);
        if (corporateUser != null) {
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("email", email);
            userDetails.put("userType", "corporate");
            userDetails.put("userId", corporateUser.getId());
            logger.debug("Found corporate user: userId={}, userType={}", corporateUser.getId(), "corporate");
            return userDetails;
        }

        Optional<UserDtls> individualUserOpt = userRepository.findByEmail(email);
        if (individualUserOpt.isPresent()) {
            UserDtls individualUser = individualUserOpt.get();
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("email", email);
            userDetails.put("userType", "individual");
            userDetails.put("userId", individualUser.getUserID());
            logger.debug("Found individual user: userId={}, userType={}", individualUser.getUserID(), "individual");
            return userDetails;
        }

        logger.error("User not found for email: {}", email);
        throw new RuntimeException("User not found for email: " + email);
    }
}