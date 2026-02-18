
package com.example.prog.webinar.email;

import com.example.prog.entity.UserDtls;
import com.example.prog.webinar.entity.Registration;
import com.example.prog.webinar.entity.Webinar;
import com.example.prog.repository.UserRepository;
import com.example.prog.zoho.service.SMTPMailService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebinarEmailServiceImpl implements WebinarEmailService {

    private final SMTPMailService smtpMailService;
    private final EmailTemplateService templateService;
    private final UserRepository userRepository;

    // ================= REGISTRATION CONFIRMATION =================
    @Async
    @Override
    public void sendRegistrationConfirmationEmail(
            Registration reg,
            Webinar webinar
    ) {
        UserDtls user = getUser(reg.getUserId());

        smtpMailService.sendMail(
                user.getEmail(),              // TO
                user.getFullname(),           // Receiver name
                "Webinar Registration Confirmation",
                templateService.registrationConfirmation(reg, webinar),
                null
        );
    }

    // ================= 6 HOUR REMINDER =================
    @Async
    @Override
    public void send6HourReminderEmail(
            Registration reg,
            Webinar webinar
    ) {
        UserDtls user = getUser(reg.getUserId());

        smtpMailService.sendMail(
                user.getEmail(),
                user.getFullname(),
                "Webinar Reminder – Starts in 6 Hours",
                templateService.sixHourReminder(reg, webinar),
                null
        );
    }

    // ================= 1 HOUR REMINDER =================
    @Async
    @Override
    public void send1HourReminderEmail(
            Registration reg,
            Webinar webinar
    ) {
        UserDtls user = getUser(reg.getUserId());

        smtpMailService.sendMail(
                user.getEmail(),
                user.getFullname(),
                "Final Reminder – Webinar Starts in 1 Hour",
                templateService.oneHourReminder(reg, webinar),
                null
        );
    }

    // ================= PRIVATE HELPER =================
    private UserDtls getUser(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }
}
