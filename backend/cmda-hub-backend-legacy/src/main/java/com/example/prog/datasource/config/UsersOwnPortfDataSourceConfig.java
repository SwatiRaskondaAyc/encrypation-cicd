package com.example.prog.datasource.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class UsersOwnPortfDataSourceConfig {
	
	
    @Bean(name = "ownDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.usersownportfolio")
    public DataSource usersPortfolioDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "ownPortfJdbcTemplate")
    public JdbcTemplate portfolioJdbcTemplate(@Qualifier("ownDataSource") DataSource ds) {
        return new JdbcTemplate(ds);
    }

}
