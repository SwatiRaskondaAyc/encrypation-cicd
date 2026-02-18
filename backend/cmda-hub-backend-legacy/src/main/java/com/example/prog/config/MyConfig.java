
// // working code //
// package com.example.prog.config;



// import org.springframework.beans.factory.annotation.Autowired;

// import org.springframework.context.annotation.Bean;

// import org.springframework.context.annotation.Configuration;

// import org.springframework.security.authentication.AuthenticationManager;

// import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

// import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;

// import org.springframework.security.config.annotation.web.builders.HttpSecurity;

// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

// import org.springframework.security.config.http.SessionCreationPolicy;

// import org.springframework.security.core.session.SessionRegistry;

// import org.springframework.security.core.userdetails.UserDetailsService;

// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// import org.springframework.security.web.session.HttpSessionEventPublisher;

// import org.springframework.security.web.SecurityFilterChain;

// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

// import com.example.prog.serviceimpl.CustomOAuth2UserService;

// import com.example.prog.config.JwtAuthenticationFilter;

// import com.example.prog.service.TokenStoreService;

// import com.example.prog.token.JwtUtil;



// import jakarta.servlet.http.HttpServletResponse;

// import java.io.IOException;

// import java.util.List; // Added import for List



// import org.slf4j.Logger;

// import org.slf4j.LoggerFactory; // Added import for Logger and LoggerFactory



// @Configuration

// @EnableWebSecurity

// public class MyConfig {



//   @Autowired

//   private CustomerUserDtlsConfig detailsService;



//   @Autowired

//   private CustomOAuth2UserService customOAuth2UserService;



//   @Autowired

//   private SessionRegistry sessionRegistry;



//   @Autowired

//   private JwtAuthenticationFilter jwtAuthenticationFilter;



//   @Autowired

//   private TokenStoreService tokenStoreService;



//   @Autowired

//   private JwtUtil jwtUtil;



//   private static final Logger logger = LoggerFactory.getLogger(MyConfig.class); // Initialized Logger



//   @Bean

//   public UserDetailsService getUserDetailsService() {

//     return new CustomerUserDtlsConfig();

//   }



//   @Bean

//   public BCryptPasswordEncoder getPassword() {

//     return new BCryptPasswordEncoder();

//   }



//   @Bean

//   public HttpSessionEventPublisher httpSessionEventPublisher() {

//     return new HttpSessionEventPublisher();

//   }



//   @Bean

//   public DaoAuthenticationProvider daoProvider() {

//     DaoAuthenticationProvider dao = new DaoAuthenticationProvider();

//     dao.setUserDetailsService(getUserDetailsService());

//     dao.setPasswordEncoder(getPassword());

//     return dao;

//   }



//   @Bean

//   public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {

//     AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);

//     auth.authenticationProvider(daoProvider());

//     return auth.build();

//   }



// @Bean

// public AuthenticationSuccessHandler authenticationSuccessHandler() {

//   return (request, response, authentication) -> {

//     String email = authentication.getName();

//     String userType = determineUserType(email);

//     List<String> roles = List.of("USER"); // Replace with actual role logic

//     String jwtToken = jwtUtil.generateToken(email, userType, roles);

//     logger.debug("Generated JWT token for email: {}, userType: {}, token: {}", email, userType, jwtToken);

//     tokenStoreService.storeToken(userType, email, jwtToken);

//     logger.debug("Stored token for email: {}, key: cmda_log_user:token:{}:{}", email, userType, email);

//     response.setHeader("Authorization", "Bearer " + jwtToken);

//     response.setStatus(HttpServletResponse.SC_OK);

//     response.setContentType("application/json");

//     try {

//       response.getWriter().write("{\"message\": \"Login successful\", \"token\": \"" + jwtToken + "\"}");

//     } catch (IOException e) {

//       logger.error("Failed to write login response: {}", e.getMessage(), e);

//     }

//   };

// }



//   private String determineUserType(String email) {

//     if (email.endsWith("@individual.com")) return "INDIVIDUAL";

//     if (email.endsWith("@corporate.com")) return "CORPORATE";

//     return "INDIVIDUAL"; // Default

//   }

// @Bean
// public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//     http
//         .csrf(csrf -> csrf.disable())
//         .cors(cors -> {}) // Enable CORS using WebConfig
//         .authorizeHttpRequests(authz -> authz
//             // Permit public endpoints first
//             .requestMatchers(
//                 "/api/auth/**",
//                 "/login/oauth2/**",
//                 "/api/management/api-request-logs",
//                 "/api/management/blocked-ips",
//                 "/api/management/response-logs",
//                 "/api/management/admin/login",
//                 "/api/management/admin/setup",
//                 "/api/stocks/test/**", // Covers /api/stocks/test/search and /api/stocks/test/suggest
//                 "/api/file/**",
//                 "/api/landpage/**",
//                 "/api/assessment/questions",
//                 "/api/stocks/**",
//                 "/api/promoter-series/**",
//                 "/api/promo-codes/**",
//                 "/api/promo-usages/**",
//                 "/api/file/total-platform-counts",
//                 "/api/Shareholding/**",
//                 "/api/financial/**",
//                 "/api/consolidate/**",
//                 "/api/candle-patterns/**",
//                 "/api/Userprofile/**",
//                 "/api/dashboard/**",
//                 "/api/indices/**"
//             ).permitAll()
//             // Role-based endpoints
//             .requestMatchers("/api/management/**").hasRole("ADMIN")
//             .requestMatchers("/user/**").hasRole("USER")
//             .requestMatchers("/corporate/**").hasRole("CORPORATE")
//             // All other requests require authentication
//             .anyRequest().authenticated()
//         )
//         .sessionManagement(session -> session
//             .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//             .maximumSessions(1)
//             .sessionRegistry(sessionRegistry)
//         )
//         .formLogin(form -> form
//             .loginProcessingUrl("/login")
//             .successHandler(authenticationSuccessHandler())
//             .permitAll()
//         )
//         .logout(logout -> logout
//             .logoutUrl("/logout")
//             .logoutSuccessUrl("/login?logout")
//             .permitAll()
//         )
//         .exceptionHandling(exception -> exception
//             .authenticationEntryPoint((request, response, authException) -> {
//                 response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                 response.setContentType("application/json");
//                 try {
//                     response.getWriter().write("{\"error\": \"Unauthorized: Invalid or missing JWT token\"}");
//                 } catch (IOException e) {
//                     logger.error("Failed to write error response: {}", e.getMessage(), e);
//                 }
//             })
//         )
//         .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
//     return http.build();
// }


// }

////main code////

// Before mail sending

// package com.example.prog.config;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.core.session.SessionRegistry;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.web.session.HttpSessionEventPublisher;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

// import com.example.prog.serviceimpl.CustomOAuth2UserService;
// import com.example.prog.config.JwtAuthenticationFilter;
// import com.example.prog.service.TokenStoreService;
// import com.example.prog.token.JwtUtil;

// import jakarta.servlet.http.HttpServletResponse;
// import java.io.IOException;
// import java.util.List;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;

// @Configuration
// @EnableWebSecurity
// public class MyConfig {

//     @Autowired
//     private CustomerUserDtlsConfig detailsService;

//     @Autowired
//     private CustomOAuth2UserService customOAuth2UserService;

//     @Autowired
//     private SessionRegistry sessionRegistry;

//     @Autowired
//     private JwtAuthenticationFilter jwtAuthenticationFilter;

//     @Autowired
//     private TokenStoreService tokenStoreService;

//     @Autowired
//     private JwtUtil jwtUtil;

//     private static final Logger logger = LoggerFactory.getLogger(MyConfig.class);

//     @Bean
//     public UserDetailsService getUserDetailsService() {
//         return new CustomerUserDtlsConfig();
//     }

//     @Bean
//     public BCryptPasswordEncoder getPassword() {
//         return new BCryptPasswordEncoder();
//     }

//     @Bean
//     public HttpSessionEventPublisher httpSessionEventPublisher() {
//         return new HttpSessionEventPublisher();
//     }

//     @Bean
//     public DaoAuthenticationProvider daoProvider() {
//         DaoAuthenticationProvider dao = new DaoAuthenticationProvider();
//         dao.setUserDetailsService(getUserDetailsService());
//         dao.setPasswordEncoder(getPassword());
//         return dao;
//     }

//     @Bean
//     public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
//         AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);
//         auth.authenticationProvider(daoProvider());
//         return auth.build();
//     }

//     @Bean
//     public AuthenticationSuccessHandler authenticationSuccessHandler() {
//         return (request, response, authentication) -> {
//             String email = authentication.getName();
//             String userType = determineUserType(email);
//             List<String> roles = List.of("USER"); // Replace with actual role logic
//             String jwtToken = jwtUtil.generateToken(email, userType, roles);
//             logger.debug("Generated JWT token for email: {}, userType: {}, token: {}", email, userType, jwtToken);
//             tokenStoreService.storeToken(userType, email, jwtToken);
//             logger.debug("Stored token for email: {}, key: cmda_log_user:token:{}:{}", email, userType, email);
//             response.setHeader("Authorization", "Bearer " + jwtToken);
//             response.setStatus(HttpServletResponse.SC_OK);
//             response.setContentType("application/json");
//             try {
//                 response.getWriter().write("{\"message\": \"Login successful\", \"token\": \"" + jwtToken + "\"}");
//             } catch (IOException e) {
//                 logger.error("Failed to write login response: {}", e.getMessage(), e);
//             }
//         };
//     }

//     private String determineUserType(String email) {
//         if (email.endsWith("@individual.com")) return "INDIVIDUAL";
//         if (email.endsWith("@corporate.com")) return "CORPORATE";
//         return "INDIVIDUAL"; // Default
//     }

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//             .csrf(csrf -> csrf.disable())
//             .cors(cors -> {}) // Enable CORS using WebConfig
//             .authorizeHttpRequests(authz -> authz
//                 // Permit public endpoints first
//                 .requestMatchers(
//                     "/api/auth/**",
//                     "/login/oauth2/**",
//                     "/api/management/api-request-logs",
//                     "/api/management/blocked-ips",
//                     "/api/management/response-logs",
//                     "/api/management/admin/login",
//                     "/api/management/admin/setup",
//                     "/api/stocks/test/**", // Covers /api/stocks/test/search and /api/stocks/test/suggest
//                     "/api/file/**",
//                     "/api/landpage/**",
//                     "/api/assessment/questions",
//                     "/api/stocks/**",
//                     "/api/promoter-series/**",
//                     "/api/promo-codes/**",
//                     "/api/promo-usages/**",
//                     "/api/file/total-platform-counts",
//                     "/api/Shareholding/**",
//                     "/api/financial/**",
//                     "/api/consolidate/**",
//                     "/api/candle-patterns/**",
//                     "/api/Userprofile/**",
//                     "/api/indices/**",
//                     "/api/dashboard/**",
//                     "/api/market/top-company/**"
//                 ).permitAll()
//                 // Role-based endpoints
//                 .requestMatchers("/api/management/**").hasRole("ADMIN")
//                 .requestMatchers("/user/**").hasRole("USER")
//                 .requestMatchers("/corporate/**").hasRole("CORPORATE")
//                 // All other requests require authentication
//                 .anyRequest().authenticated()
//             )
//             .sessionManagement(session -> session
//                 .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                 .maximumSessions(1)
//                 .sessionRegistry(sessionRegistry)
//             )
//             .formLogin(form -> form
//                 .loginProcessingUrl("/login")
//                 .successHandler(authenticationSuccessHandler())
//                 .permitAll()
//             )
//             .logout(logout -> logout
//                 .logoutUrl("/logout")
//                 .logoutSuccessUrl("/login?logout")
//                 .permitAll()
//             )
//             .exceptionHandling(exception -> exception
//                 .authenticationEntryPoint((request, response, authException) -> {
//                     response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                     response.setContentType("application/json");
//                     try {
//                         response.getWriter().write("{\"error\": \"Unauthorized: Invalid or missing JWT token\"}");
//                     } catch (IOException e) {
//                         logger.error("Failed to write error response: {}", e.getMessage(), e);
//                     }
//                 })
//             )
//             // Add JWT filter
//             .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
//         return http.build();
//     }
// }

package com.example.prog.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.example.prog.serviceimpl.CustomOAuth2UserService;
import com.example.prog.config.JwtAuthenticationFilter;
import com.example.prog.service.TokenStoreService;
import com.example.prog.token.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
@EnableWebSecurity
public class MyConfig {

    @Autowired
    private CustomerUserDtlsConfig detailsService;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private SessionRegistry sessionRegistry;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private TokenStoreService tokenStoreService;

    @Autowired
    private JwtUtil jwtUtil;

    private static final Logger logger = LoggerFactory.getLogger(MyConfig.class);

    @Bean
    public UserDetailsService getUserDetailsService() {
        return new CustomerUserDtlsConfig();
    }

    @Bean
    public BCryptPasswordEncoder getPassword() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }

    @Bean
    public DaoAuthenticationProvider daoProvider() {
        DaoAuthenticationProvider dao = new DaoAuthenticationProvider();
        dao.setUserDetailsService(getUserDetailsService());
        dao.setPasswordEncoder(getPassword());
        return dao;
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);
        auth.authenticationProvider(daoProvider());
        return auth.build();
    }

    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return (request, response, authentication) -> {
            String email = authentication.getName();
            String userType = determineUserType(email);
            List<String> roles = List.of("USER"); // Replace with actual role logic
            String jwtToken = jwtUtil.generateToken(email, userType, roles);
            logger.debug("Generated JWT token for email: {}, userType: {}, token: {}", email, userType, jwtToken);
            tokenStoreService.storeToken(userType, email, jwtToken);
            logger.debug("Stored token for email: {}, key: cmda_log_user:token:{}:{}", email, userType, email);
            response.setHeader("Authorization", "Bearer " + jwtToken);
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            try {
                response.getWriter().write("{\"message\": \"Login successful\", \"token\": \"" + jwtToken + "\"}");
            } catch (IOException e) {
                logger.error("Failed to write login response: {}", e.getMessage(), e);
            }
        };
    }

    private String determineUserType(String email) {
        if (email.endsWith("@individual.com")) return "INDIVIDUAL";
        if (email.endsWith("@corporate.com")) return "CORPORATE";
        return "INDIVIDUAL"; // Default
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) // Enable CORS using WebConfig
            .authorizeHttpRequests(authz -> authz
                // Permit public endpoints first
                .requestMatchers("/api/ratings/*/average").permitAll() // Allow public access to average rating endpoint
                .requestMatchers("/api/ratings/**").authenticated() // Require authentication for other /api/ratings endpoints
                .requestMatchers(
                    "/api/auth/**",
                    "/login/oauth2/**",
                    "/api/oauth/zoho/**",
                    "/api/images/**",
                    "/api/unsubscribe",
                    "/api/management/api-request-logs",
                    "/api/management/blocked-ips",
                    "/api/management/response-logs",
                    "/api/management/admin/login",
                    "/api/management/admin/setup",
                    "/api/stocks/test/**", // Covers /api/stocks/test/search and /api/stocks/test/suggest
                    "/api/file/**",
                    "/api/landpage/**",
                    "/api/assessment/questions",
                    "/api/stocks/**",
                    "/api/promoter-series/**",
                    "/api/promo-codes/**",
                    "/api/promo-usages/**",
                    "/api/file/total-platform-counts",
                    "/api/Shareholding/**",
                    "/api/financial/**",
                    "/api/consolidate/**",
                    "/api/candle-patterns/**",
                    "/api/Userprofile/**",
                    "/api/indices/**",
                    "/api/dashboard/**",
                    "api/market/top-company",
                    "/api/users/forgetpass/**",
                    "/api/brokerage/**",
                    "/api/paper-trade/**",
                    "/api/industries/**",
                    "/api/create-batch-job/**",
                    "/api/industries/dividend/**",
                    "/api/points/**",
                    "/api/brokerage/calculate/**",
                    "/api/news/search/**",
                    "/api/reddit/scrape/**",
                    "/api/equity-insights/**",
                    "/api/user/webinars/**",
                    "/api/patterns/scan",
                    "/api/price-action/one-year",
                    "/api/users/resetpassword"
                ).permitAll()
                // Role-based endpoints
                .requestMatchers("/api/management/**").hasRole("ADMIN")
                .requestMatchers("/user/**").hasRole("USER")
                .requestMatchers("/corporate/**").hasRole("CORPORATE")
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .maximumSessions(1)
                .sessionRegistry(sessionRegistry)
            )
            .formLogin(form -> form
                .loginProcessingUrl("/login")
                .successHandler(authenticationSuccessHandler())
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .permitAll()
            )
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    try {
                        response.getWriter().write("{\"error\": \"Unauthorized: Invalid or missing JWT token\"}");
                    } catch (IOException e) {
                        logger.error("Failed to write error response: {}", e.getMessage(), e);
                    }
                })
            )
            // Add JWT filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}