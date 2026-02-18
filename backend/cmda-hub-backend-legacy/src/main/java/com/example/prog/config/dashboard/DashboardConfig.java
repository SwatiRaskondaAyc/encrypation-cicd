// package com.example.prog.config.dashboard;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Configuration;

// import jakarta.annotation.PostConstruct;

// import java.io.File;

// @Configuration
// public class DashboardConfig {

//     @Value("${dashboard.storage.path:/app/DashboardLogs}")
//     private String dashboardStoragePath;

//     @PostConstruct
//     public void init() {
//         File directory = new File(dashboardStoragePath);
//         if (!directory.exists()) {
//             boolean created = directory.mkdirs();
//             if (!created) {
//                 throw new RuntimeException("Failed to create dashboard storage directory: " + dashboardStoragePath);
//             }
//         }
//     }

//     public String getDashboardStoragePath() {
//         return dashboardStoragePath;
//     }
// }

package com.example.prog.config.dashboard;



import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

import java.io.File;

@Configuration
public class DashboardConfig {

    private static final String DASHBOARD_STORAGE_PATH = "/app/DashboardLogs/";

    @PostConstruct
    public void init() {
        File directory = new File(DASHBOARD_STORAGE_PATH);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (!created) {
                throw new RuntimeException("Failed to create dashboard storage directory: " + DASHBOARD_STORAGE_PATH);
            }
        }
    }

    public static String getDashboardStoragePath() {
        return DASHBOARD_STORAGE_PATH;
    }
}
