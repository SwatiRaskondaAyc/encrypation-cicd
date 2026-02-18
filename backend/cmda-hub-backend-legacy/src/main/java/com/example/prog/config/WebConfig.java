// package com.example.prog.config;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.EnableWebMvc;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
// import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
// import com.example.prog.token.*;

// @Configuration
// @EnableWebMvc
// public class WebConfig implements WebMvcConfigurer {
// 	@Value("${frontend.url}")  // Fetching value from application.properties
//     private String frontendUrl;

//     @Value("${frontend.urll}") // Second frontend URL from application.properties
//     private String frontendUrll;

//     @Value("${alternate.frontend.url}")
//     private String alternateFrontendUrl;

//     	 @Autowired
// 	    private UserActivityInterceptor userActivityInterceptor;

//     @Override
//     public void addCorsMappings(CorsRegistry registry) {
//         registry.addMapping("/**")
//         // .allowedOrigins(frontendUrl) // Specify your frontend origin
//         .allowedOrigins(frontendUrl, frontendUrll, alternateFrontendUrl)
//                 .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                 .allowedHeaders("*")
//                 .allowCredentials(true);

//     }

//     @Override
//     public void addInterceptors(InterceptorRegistry registry) {
//         registry.addInterceptor(userActivityInterceptor);
//     }

// }

package com.example.prog.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import com.example.prog.token.*;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    @Value("${frontend.url}") // Fetching value from application.properties
    private String frontendUrl;

    @Value("${frontend.urll}") // Second frontend URL from application.properties
    private String frontendUrll;

    @Value("${alternate.frontend.url}")
    private String alternateFrontendUrl;

    @Value("${green.frontend.url}")
    private String greenFrontendUrl;

    @Autowired
    private UserActivityInterceptor userActivityInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/unsubscribe")
                .allowedOriginPatterns("*") // This allows any origin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(false) // Important: set to false for wildcard origins
                .maxAge(3600);

        registry.addMapping("/**")
                // .allowedOrigins(frontendUrl) // Specify your frontend origin
                .allowedOrigins(
                        "https://cmdahub.com",
                        "https://www.cmdahub.com",
                        "https://green.cmdahub.com",
                        "http://localhost:5173",
                        "http://localhost:5174",
                        "http://localhost:5674",
                        frontendUrl,
                        frontendUrll,
                        alternateFrontendUrl,
                        greenFrontendUrl)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);

    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userActivityInterceptor);
    }

}