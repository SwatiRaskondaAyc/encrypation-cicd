package com.example.prog.datasource.config;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
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
        basePackages = "com.example.prog.webinar.repository",
        entityManagerFactoryRef = "learningEntityManagerFactory",
        transactionManagerRef = "learningTransactionManager"
)
public class CmdaLearningDbConfig {

    //    @Bean(name = "learningDataSource")
//    @ConfigurationProperties(prefix = "spring.datasource.cmda-learning")
//    public DataSource learningDataSource() {
//        return DataSourceBuilder.create()
//                .type(HikariDataSource.class)
//                .build();
//    }
    @Bean(name = "learningDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.cmda-learning")
    public DataSource learningDataSource() {
        // This allows Hikari to specifically map its unique fields (like jdbcUrl)
        return new HikariDataSource();
    }

    @Bean(name = "learningEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean learningEntityManagerFactory(
            @Qualifier("learningDataSource") DataSource dataSource) {

        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);

        // Ensure this package contains the @Entity classes for the Learning DB
        em.setPackagesToScan("com.example.prog.webinar.entity");

        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "update");
        properties.put("hibernate.dialect", "org.hibernate.dialect.SQLServerDialect");
        properties.put("hibernate.show_sql", "true");
        properties.put("hibernate.format_sql", "true");

        // This bypasses the global TypeContributor bug
        em.setJpaPropertyMap(properties);

        return em;
    }

    @Bean(name = "learningTransactionManager")
    public PlatformTransactionManager learningTransactionManager(
            @Qualifier("learningEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}