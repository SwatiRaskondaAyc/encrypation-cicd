package com.example.prog.service;

import com.sun.management.OperatingSystemMXBean;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SystemMetricsService {

    public Map<String, Object> getSystemMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        // JVM Memory Metrics
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory() / (1024 * 1024); // MB
        long freeMemory = runtime.freeMemory() / (1024 * 1024); // MB
        long usedMemory = totalMemory - freeMemory; // MB
        double memoryUsage = (usedMemory * 100.0) / totalMemory; // % used
        metrics.put("memoryUsage", Math.round(memoryUsage * 100.0) / 100.0); // Round to 2 decimals
        metrics.put("totalMemory", totalMemory); // MB
        metrics.put("usedMemory", usedMemory); // MB

        // CPU Usage (via OperatingSystemMXBean)
        OperatingSystemMXBean osBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
        double cpuUsage = osBean.getProcessCpuLoad() * 100; // % CPU usage
        metrics.put("cpuUsage", cpuUsage >= 0 ? Math.round(cpuUsage * 100.0) / 100.0 : 0); // Round to 2 decimals

        // Disk Usage (simplified, requires File system access or SIGAR - placeholder for now)
        metrics.put("diskUsage", 0); // To be implemented
        metrics.put("totalDisk", 0); // To be implemented

        // Uptime (JVM uptime in days and hours)
        long uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();
        long days = Duration.ofMillis(uptimeMs).toDays();
        long hours = Duration.ofMillis(uptimeMs - (days * 24 * 60 * 60 * 1000)).toHours();
        metrics.put("uptime", String.format("%dd %dh", days, hours));

        // Average Response Time (requires custom tracking, placeholder)
        metrics.put("avgResponseTime", 0); // To be implemented with metrics collection

        // Historical Data
        metrics.put("timestamps", getLastHourTimestamps());
        metrics.put("memoryHistory", getMemoryHistory(memoryUsage)); // Pass memoryUsage to getMemoryHistory

        return metrics;
    }

    private List<String> getLastHourTimestamps() {
        List<String> timestamps = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        for (int i = 0; i < 5; i++) {
            timestamps.add(now.minusMinutes(i * 15).format(formatter));
        }
        Collections.reverse(timestamps); // Reverse the list in place
        return timestamps;
    }

    private List<Double> getMemoryHistory(double currentMemoryUsage) {
        List<Double> history = new ArrayList<>();
        // Simulate a slight variation around the current memory usage for a trend
        for (int i = 0; i < 5; i++) {
            double variation = (Math.random() * 2 - 1); // Random variation between -1% and +1%
            history.add(Math.round((currentMemoryUsage + variation) * 100.0) / 100.0); // Round to 2 decimals
        }
        return history;
    }
}