package com.example.prog.dto;

import java.util.Set;

public class MonitoredEndpoint {
    private static final Set<String> INCLUDED_PATHS = Set.of(
        "/api/auth/send-otp", "/api/auth/google", "/api/corporate/forgot-password", "/api/corporate/reset-password",
        "/api/users/login", "/api/users/forgot-password", "/api/users/reset-password", "/api/candle-patterns", "/api/stocks/predict",
        "/api/stocks",  "/api/file/upload", "/api/auth/login"
    );

    private static final Set<String> EXCLUDED_PATHS = Set.of(
        "/api/management/admin/login"
    );

    public static boolean shouldMonitor(String path) {
        return INCLUDED_PATHS.contains(path) && !EXCLUDED_PATHS.contains(path);
    }
}
