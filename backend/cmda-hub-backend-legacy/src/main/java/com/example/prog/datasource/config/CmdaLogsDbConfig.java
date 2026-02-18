package com.example.prog.datasource.config;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.example.prog.logs.repository",
        entityManagerFactoryRef = "logsEntityManagerFactory",
        transactionManagerRef = "logsTransactionManager"
)
public class CmdaLogsDbConfig {

    // -------- DATA SOURCE --------
    @Bean(name = "logsDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.cmda-logs")
    public DataSource logsDataSource() {
        // Required for SQL Server + Hikari jdbc-url mapping
        return new HikariDataSource();
    }

    // -------- ENTITY MANAGER --------
    @Bean(name = "logsEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean logsEntityManagerFactory(
            @Qualifier("logsDataSource") DataSource dataSource) {

        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);

        // Package containing @Entity classes for CMDA_Logs_DB
        em.setPackagesToScan("com.example.prog.logs.entity");

        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "update");
        properties.put("hibernate.dialect", "org.hibernate.dialect.SQLServerDialect");
        properties.put("hibernate.show_sql", "true");
        properties.put("hibernate.format_sql", "true");

        em.setJpaPropertyMap(properties);
        return em;
    }

    // -------- TRANSACTION MANAGER --------
    @Bean(name = "logsTransactionManager")
    public PlatformTransactionManager logsTransactionManager(
            @Qualifier("logsEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}
