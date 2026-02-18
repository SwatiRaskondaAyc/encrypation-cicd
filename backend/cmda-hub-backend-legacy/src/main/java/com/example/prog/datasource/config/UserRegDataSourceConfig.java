// package com.example.prog.datasource.config;

// import org.springframework.beans.factory.annotation.Qualifier;
// import org.springframework.boot.context.properties.ConfigurationProperties;
// import org.springframework.boot.jdbc.DataSourceBuilder;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.context.annotation.Primary;
// import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.orm.jpa.JpaTransactionManager;
// import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
// import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

// import com.zaxxer.hikari.HikariDataSource;

// import jakarta.persistence.EntityManagerFactory;
// import javax.sql.DataSource;
// import java.util.HashMap;
// import java.util.Map;

// @Configuration
// @EnableJpaRepositories(
//         basePackages = {"com.example.prog.repository","com.example.prog.zoho.repository"} ,
//         entityManagerFactoryRef = "userEntityManager",
//         transactionManagerRef = "userTransactionManager"
// )
// public class UserRegDataSourceConfig {

// 	@Primary
//     @Bean(name = "userDataSource")
//     @ConfigurationProperties(prefix = "spring.datasource.user")
//     public DataSource dataSource() {
// //        return DataSourceBuilder.create().build();
// 		HikariDataSource dataSource = DataSourceBuilder.create().type(HikariDataSource.class).build();
// 	    // dataSource.setJdbcUrl("jdbc:sqlserver://AYCANALYTICS-DC:1433;databaseName=UserReg;encrypt=false;trustServerCertificate=true;");
// 	    dataSource.setJdbcUrl("jdbc:sqlserver://168.231.121.219:1433;databaseName=CMDA_Users_Hub;encrypt=false;trustServerCertificate=true;");
//         return dataSource;
//     }

// 	@Primary
//     @Bean(name = "userEntityManager")
//     public LocalContainerEntityManagerFactoryBean entityManagerFactory(
//             @Qualifier("userDataSource") DataSource dataSource) {
//         LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
//         em.setDataSource(dataSource);
//         em.setPackagesToScan("com.example.prog.entity");
//         em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());

//         Map<String, Object> properties = new HashMap<>();
//         properties.put("hibernate.hbm2ddl.auto", "update");
//         properties.put("hibernate.dialect", "org.hibernate.dialect.SQLServer2012Dialect");
//         em.setJpaPropertyMap(properties);

//         return em;
//     }

// 	@Primary
//     @Bean(name = "userTransactionManager")
//     public JpaTransactionManager transactionManager(
//             @Qualifier("userEntityManager") EntityManagerFactory entityManagerFactory) {
//         return new JpaTransactionManager(entityManagerFactory);
//     }

// 	@Primary
//     @Bean(name = "userJdbcTemplate")
//     public JdbcTemplate jdbcTemplate(@Qualifier("userDataSource") DataSource dataSource) {
//         return new JdbcTemplate(dataSource);
//     }
// }

// package com.example.prog.datasource.config;

// import org.springframework.beans.factory.annotation.Qualifier;
// import org.springframework.boot.context.properties.ConfigurationProperties;
// import org.springframework.boot.jdbc.DataSourceBuilder;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.context.annotation.Primary;
// import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.orm.jpa.JpaTransactionManager;
// import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
// import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

// import com.zaxxer.hikari.HikariDataSource;

// import jakarta.persistence.EntityManagerFactory;
// import javax.sql.DataSource;
// import java.util.HashMap;
// import java.util.Map;

// @Configuration
// @EnableJpaRepositories(
//         basePackages = {"com.example.prog.repository","com.example.prog.zoho.repository"} ,
//         entityManagerFactoryRef = "userEntityManager",
//         transactionManagerRef = "userTransactionManager"
// )
// public class UserRegDataSourceConfig {

// // 	@Primary
// //     @Bean(name = "userDataSource")
// //     @ConfigurationProperties(prefix = "spring.datasource.user")
// //     public DataSource dataSource() {
// // //        return DataSourceBuilder.create().build();
// // 		HikariDataSource dataSource = DataSourceBuilder.create().type(HikariDataSource.class).build();
// // 	    // dataSource.setJdbcUrl("jdbc:sqlserver://AYCANALYTICS-DC:1433;databaseName=UserReg;encrypt=false;trustServerCertificate=true;");
// // 	    dataSource.setJdbcUrl("jdbc:sqlserver://168.231.121.219:1433;databaseName=CMDA_Users_Hub;encrypt=false;trustServerCertificate=true;");
// //         return dataSource;
// //     }

    // @Primary
    // @Bean(name = "userDataSource")
    // @ConfigurationProperties(prefix = "spring.datasource.user")
    // public DataSource dataSource() {
    //     HikariDataSource dataSource = DataSourceBuilder.create()
    //             .type(HikariDataSource.class)
    //             .build();
    //      dataSource.setJdbcUrl("jdbc:sqlserver://168.231.121.219:1433;databaseName=CMDA_Users_Hub;encrypt=false;trustServerCertificate=true;lastUpdateCount=true;sendStringParametersAsUnicode=false");
    //     return dataSource;
    // }

// 	@Primary
//     @Bean(name = "userEntityManager")
//     public LocalContainerEntityManagerFactoryBean entityManagerFactory(
//             @Qualifier("userDataSource") DataSource dataSource) {
//         LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
//         em.setDataSource(dataSource);
//         em.setPackagesToScan("com.example.prog.entity");
//         em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());

//         Map<String, Object> properties = new HashMap<>();
//         properties.put("hibernate.hbm2ddl.auto", "update");
//         properties.put("hibernate.dialect", "org.hibernate.dialect.SQLServer2012Dialect");
//         properties.put("hibernate.id.new_generator_mappings", "true"); // 👈 important
//         em.setJpaPropertyMap(properties);
//         em.setJpaPropertyMap(properties);

//         return em;
//     }

// 	@Primary
//     @Bean(name = "userTransactionManager")
//     public JpaTransactionManager transactionManager(
//             @Qualifier("userEntityManager") EntityManagerFactory entityManagerFactory) {
//         return new JpaTransactionManager(entityManagerFactory);
//     }

// 	@Primary
//     @Bean(name = "userJdbcTemplate")
//     public JdbcTemplate jdbcTemplate(@Qualifier("userDataSource") DataSource dataSource) {
//         return new JdbcTemplate(dataSource);
//     }
// }


package com.example.prog.datasource.config;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableJpaRepositories(
        basePackages = {"com.example.prog.repository", "com.example.prog.zoho.repository"},
        entityManagerFactoryRef = "userEntityManager",
        transactionManagerRef = "userTransactionManager"
)
public class UserRegDataSourceConfig {

    // @Primary
    // @Bean(name = "userDataSource")
    // @ConfigurationProperties(prefix = "spring.datasource.user")
    // public DataSource userDataSource() {
    //     return DataSourceBuilder.create()
    //             .type(HikariDataSource.class)
    //             .build();
    //              dataSource.setJdbcUrl("jdbc:sqlserver://168.231.121.219:1433;databaseName=CMDA_Users_Hub;encrypt=false;trustServerCertificate=true;sendStringParametersAsUnicode=false");
    // }

     @Primary
    @Bean(name = "userDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.user")
    public DataSource dataSource() {
        HikariDataSource dataSource = DataSourceBuilder.create()
                .type(HikariDataSource.class)
                .build();
         dataSource.setJdbcUrl("jdbc:sqlserver://168.231.121.219:1433;databaseName=CMDA_Users_Hub;encrypt=false;trustServerCertificate=true;lastUpdateCount=false;sendStringParametersAsUnicode=false");
        return dataSource;
    }

    @Primary
    @Bean(name = "userEntityManager")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            @Qualifier("userDataSource") DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("com.example.prog.entity");
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "update");
        properties.put("hibernate.dialect", "org.hibernate.dialect.SQLServerDialect");
        properties.put("hibernate.jdbc.use_get_generated_keys", "true");
        properties.put("hibernate.session_factory.statement_inspector", "com.example.prog.config.NocountOffInspector");  // Add this
        em.setJpaPropertyMap(properties);
        return em;
    }

    @Primary
    @Bean(name = "userTransactionManager")
    public JpaTransactionManager transactionManager(
            @Qualifier("userEntityManager") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }

    @Primary
    @Bean(name = "userJdbcTemplate")
    public JdbcTemplate jdbcTemplate(@Qualifier("userDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    
    @Bean(name = "globalTransactionManager")
    public PlatformTransactionManager globalTransactionManager(
            @Qualifier("userTransactionManager") PlatformTransactionManager userTM,
            @Qualifier("userLedgersTransactionManager") PlatformTransactionManager ledgerTM) {
        return new org.springframework.data.transaction.ChainedTransactionManager(userTM, ledgerTM);
    }
}
