package com.example.prog.datasource.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class AccordDataSourceConfig {

    @Bean(name = "accordDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.accord")
    public DataSource accordDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "accordJdbcTemplate")
    public JdbcTemplate accordJdbcTemplate(@Qualifier("accordDataSource") DataSource ds) {
        return new JdbcTemplate(ds);
    }
}

