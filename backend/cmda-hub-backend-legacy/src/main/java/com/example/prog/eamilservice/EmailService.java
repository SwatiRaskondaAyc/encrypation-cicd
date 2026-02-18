package com.example.prog.eamilservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.Random;

@Service
public class EmailService {

    @Autowired
    @Qualifier("gmailSender")
    private JavaMailSender mailSender;

    // Generate OTP
    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }

    // Send OTP Email
    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your OTP for Registration");
        message.setText("Your OTP for registration is: " + otp + ". It is valid for 5 minutes.");
        mailSender.send(message);
    }
}
