package com.example.prog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.context.annotation.Primary;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Primary
    @Bean(name = "gmailSender")
    public JavaMailSender gmailJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername("aycanalytics01@gmail.com");
        mailSender.setPassword("jljq xdtl eddk xtmb");

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        return mailSender;
    }

    @Bean(name = "zohoSender")
    public JavaMailSender zohoJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.zoho.in");
        mailSender.setPort(587);
        mailSender.setUsername("noreply@aycanalytics.com");
        mailSender.setPassword("wTJ6VPuhU0UQ");

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.trust", "smtp.zoho.in");
        return mailSender;
    }



    @Bean(name = "bigrockSupportSender")
    public JavaMailSender bigrockSupportSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.titan.email");
        mailSender.setPort(587);
        mailSender.setUsername("support@cmdahub.com");
        mailSender.setPassword("75cmda@23");

        Properties props = mailSender.getJavaMailProperties();
        
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.trust", "smtp.titan.email");
        props.put("mail.smtp.connectiontimeout", "15000");
        props.put("mail.smtp.timeout", "15000");
        props.put("mail.smtp.writetimeout", "15000");
        props.put("mail.debug", "true");

        mailSender.setDefaultEncoding("UTF-8");
        return mailSender;
    }


}