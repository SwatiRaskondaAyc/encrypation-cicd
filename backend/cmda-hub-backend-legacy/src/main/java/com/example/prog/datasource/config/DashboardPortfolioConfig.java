package com.example.prog.datasource.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

	@Configuration
	public class DashboardPortfolioConfig {

	    @Bean(name = "usersDashPortfolioDataSource")
	    @ConfigurationProperties(prefix = "spring.datasource.usersdashportfolio")
	    public DataSource usersDashPortfolioDataSource() {
	        return DataSourceBuilder.create().build();
	    }

	    @Bean(name = "usersDashPortfolioJdbcTemplate")
	    public JdbcTemplate usersDashPortfolioJdbcTemplate(
	            @Qualifier("usersDashPortfolioDataSource") DataSource dataSource) {
	        return new JdbcTemplate(dataSource);
	    }
	}




