package com.example.prog.service.dashboard;

import com.example.prog.entity.dashboard.DashboardMaster;
import com.example.prog.repository.dashboard.DashboardMasterRepository;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.portfolioRepo.UserPortfolioUploadRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringJoiner;

@Service
public class DashboardPortfolioService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardPortfolioService.class);

    @Autowired
    @Qualifier("usersDashPortfolioJdbcTemplate")
    private JdbcTemplate usersDashPortfolioJdbcTemplate;

    @Autowired
    private UserPortfolioUploadRepository userPortfolioUploadRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DashboardMasterRepository dashboardMasterRepository;

    public Map<String, Object> savePortfolioPlot(int dashId, int userId, String uploadId, String graphType, 
            String platform, String userType, HttpServletRequest request) {
try {
// Validate inputs
if (uploadId == null || graphType == null || platform == null) {
logger.error("uploadId, graphType, and platform are required for portfolio");
throw new RuntimeException("uploadId, graphType, and platform are required for portfolio");
}

// Verify dashboard ownership
DashboardMaster dashboard = dashboardMasterRepository.findById(dashId)
.orElseThrow(() -> new RuntimeException("Dashboard not found with ID: " + dashId));
if (dashboard.getUserId() != userId) {
logger.warn("UserId: {} is not authorized to access dashboard with dashId: {}", userId, dashId);
throw new RuntimeException("Unauthorized: You can only access your own dashboards");
}

// Generate table name
String sanitizedPlatform = platform.replaceAll("\\s+", "");
String tableName = String.format("%s%d_%s_portdashboard", userType.toLowerCase(), userId, sanitizedPlatform); // Changed to corporate1_Robinhood_portdashboard
logger.info("Generated table name: {}", tableName);

// Create the table if it doesn't exist
createPortfolioTableIfNotExists(tableName);

// Insert the data
Map<String, Object> dataMap = new HashMap<>();
dataMap.put("dash_id", dashId);
dataMap.put("user_id", userId);
dataMap.put("upload_id", uploadId);
dataMap.put("graph_type", graphType);
dataMap.put("platform", platform);

Map<String, String> dataTypes = Map.of(
"dash_id", "INT",
"user_id", "INT",
"upload_id", "VARCHAR(100)",
"graph_type", "VARCHAR(100)",
"platform", "VARCHAR(100)"
);

insertGraphMetadata(tableName, dataMap, dataTypes);

// Fetch the auto-generated dash_port_id
Integer dashPortId = usersDashPortfolioJdbcTemplate.queryForObject(
String.format("SELECT TOP 1 dash_port_id FROM %s WHERE dash_id = ? AND user_id = ? AND upload_id = ? AND graph_type = ? AND platform = ? ORDER BY dash_port_id DESC", 
tableName),
Integer.class,
dashId, userId, uploadId, graphType, platform
);

Map<String, Object> response = new HashMap<>();
response.put("message", "Portfolio plot saved successfully");
response.put("dashPortId", dashPortId);
return response;

} catch (Exception e) {
logger.error("Error saving Portfolio plot: {}", e.getMessage(), e);
throw new RuntimeException("Error saving Portfolio plot: " + e.getMessage(), e); // Throw to propagate
}
    }

    private void createPortfolioTableIfNotExists(String tableName) {
        try {
            // Define column data types
            Map<String, String> dataTypes = Map.of(
                    "dash_id", "INT",
                    "user_id", "INT",
                    "upload_id", "VARCHAR(100)",
                    "graph_type", "VARCHAR(100)",
                    "platform", "VARCHAR(100)"
            );

            // Check if the table exists
            String checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
            Integer count = usersDashPortfolioJdbcTemplate.queryForObject(checkTableSql, Integer.class, tableName);

            // If not exists, create it dynamically with an auto-increment primary key
            if (count != null && count == 0) {
                StringBuilder createTableSql = new StringBuilder("CREATE TABLE " + tableName + " (");
                List<String> columnDefs = new ArrayList<>();

                // Add auto-increment primary key
                columnDefs.add("dash_port_id INT IDENTITY(1,1) PRIMARY KEY");

                // Add other columns
                for (Map.Entry<String, String> entry : dataTypes.entrySet()) {
                    columnDefs.add(entry.getKey() + " " + entry.getValue());
                }

                createTableSql.append(String.join(", ", columnDefs)).append(")");
                usersDashPortfolioJdbcTemplate.execute(createTableSql.toString());
                logger.info("Table {} created successfully", tableName);
            } else {
                logger.info("Table {} already exists", tableName);
            }
        } catch (Exception e) {
            logger.error("DB error for table {}: {}", tableName, e.getMessage(), e);
            throw new RuntimeException("Database error for: " + tableName, e);
        }
    }


    
    private void insertGraphMetadata(String tableName, Map<String, Object> dataMap, Map<String, String> dataTypes) {
        if (!tableName.matches("^[a-zA-Z0-9_]+$")) {
            throw new IllegalArgumentException("Invalid table name: " + tableName);
        }

        try {
            StringJoiner columnNames = new StringJoiner(", ");
            StringJoiner placeholders = new StringJoiner(", ");
            List<Object> values = new ArrayList<>();

            for (Map.Entry<String, Object> entry : dataMap.entrySet()) {
                String column = entry.getKey();
                if (!column.matches("^[a-zA-Z0-9_]+$")) {
                    throw new IllegalArgumentException("Invalid column name: " + column);
                }
                columnNames.add(column);
                placeholders.add("?");
                values.add(entry.getValue());
            }

            String sql = String.format("INSERT INTO %s (%s) VALUES (%s)",
                    tableName, columnNames.toString(), placeholders.toString());
            logger.debug("Executing insert SQL: {}", sql);
            int rowsAffected = usersDashPortfolioJdbcTemplate.update(sql, values.toArray());
            logger.debug("Rows affected by insert: {}", rowsAffected);
            logger.info("Data inserted into: {}", tableName);

        } catch (Exception e) {
            logger.error("DB error for table {}: {}", tableName, e.getMessage(), e);
            throw new RuntimeException("Failed to insert data into table: " + tableName, e);
        }
    
}}