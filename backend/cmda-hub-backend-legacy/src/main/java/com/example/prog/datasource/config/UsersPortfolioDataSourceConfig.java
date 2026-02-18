package com.example.prog.datasource.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class UsersPortfolioDataSourceConfig {

    @Bean(name = "usersPortfolioDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.usersportfolio")
    public DataSource usersPortfolioDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "portfolioJdbcTemplate")
    public JdbcTemplate portfolioJdbcTemplate(@Qualifier("usersPortfolioDataSource") DataSource ds) {
        return new JdbcTemplate(ds);
    }
}

