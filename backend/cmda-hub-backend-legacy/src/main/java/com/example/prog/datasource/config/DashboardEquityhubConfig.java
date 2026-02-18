package com.example.prog.datasource.config;

import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DashboardEquityhubConfig {
    @Bean(name = "dashboardEquityhubDataSource") // Renamed to avoid conflict
    @ConfigurationProperties(prefix = "spring.datasource.dashboard")
    public DataSource dashboardEquityhubDataSource() { // Method name updated for clarity
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "dashboardJdbcTemplate")
    public JdbcTemplate dashboardJdbcTemplate(@Qualifier("dashboardEquityhubDataSource") DataSource ds) {
        return new JdbcTemplate(ds);
    }
}