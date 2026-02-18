package com.example.prog.datasource.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
public class UserLedgersDataSourceConfig {

   @Bean(name = "userLedgersDataSource")
   @ConfigurationProperties(prefix = "spring.datasource.userledgers")
   public DataSource userLedgersDataSource() {
       return DataSourceBuilder.create().build();
   }
    // @Bean(name = "userLedgersDataSource")
    // @ConfigurationProperties(prefix = "spring.datasource.userledgers")
    // public DataSource userLedgersDataSource() {
    //     return DataSourceBuilder
    //             .create()
    //             .type(com.zaxxer.hikari.HikariDataSource.class)
    //             .build();
    // }

    @Bean(name = "userLedgersJdbcTemplate")
    public JdbcTemplate userLedgersJdbcTemplate(
            @Qualifier("userLedgersDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    
    @Bean(name = "userLedgersTransactionManager")
    public PlatformTransactionManager userLedgerTransactionManager(
            @Qualifier("userLedgersDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
