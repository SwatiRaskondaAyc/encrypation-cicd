package com.example.prog.datasource.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class ResultDataSourceConfig {
		
	
    @Bean(name = "resultDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.result")
    public DataSource usersPortfolioDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "resultJdbcTemplate")
    public JdbcTemplate portfolioJdbcTemplate(@Qualifier("resultDataSource") DataSource ds) {
        return new JdbcTemplate(ds);
    }
}
