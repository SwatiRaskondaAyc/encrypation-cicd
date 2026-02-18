package com.example.prog.datasource.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.zaxxer.hikari.HikariDataSource;

import jakarta.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.example.prog.equityhub.repo",
        entityManagerFactoryRef = "marketEntityManager",
        transactionManagerRef = "marketTransactionManager"
)
public class MktDBDataSourceConfig {

    @Bean(name = "marketDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.market")
    public DataSource dataSource() {
//        return DataSourceBuilder.create().build();
    	HikariDataSource dataSource = DataSourceBuilder.create().type(HikariDataSource.class).build();
	    // dataSource.setJdbcUrl("jdbc:sqlserver://AYCANALYTICS-DC:1433;databaseName=MktDB;encrypt=false;trustServerCertificate=true;");
	    // dataSource.setJdbcUrl("jdbc:sqlserver://147.93.107.167:1433;databaseName=CMDA_MktDB;encrypt=false;trustServerCertificate=true;");
        dataSource.setJdbcUrl("jdbc:sqlserver://168.231.121.219:1433;databaseName=CMDA_MktDB;encrypt=false;trustServerCertificate=true;");
        return dataSource;
    }

    @Bean(name = "marketEntityManager")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            @Qualifier("marketDataSource") DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("com.example.prog.equityhub.entity");
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "none");
        properties.put("hibernate.dialect", "org.hibernate.dialect.SQLServer2012Dialect");
        em.setJpaPropertyMap(properties);

        return em;
    }

    @Bean(name = "marketTransactionManager")
    public JpaTransactionManager transactionManager(
            @Qualifier("marketEntityManager") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }

    @Bean(name = "marketJdbcTemplate")
    public JdbcTemplate jdbcTemplate(@Qualifier("marketDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
