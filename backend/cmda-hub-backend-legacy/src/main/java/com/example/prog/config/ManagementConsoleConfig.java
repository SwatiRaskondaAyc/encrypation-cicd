package com.example.prog.config;

import org.springframework.context.annotation.Configuration;
// import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
// @EnableRetry
public class ManagementConsoleConfig {
    // Configuration for scheduling tasks, if needed for periodic activity log updates
}