
//package com.example.prog.webinar.email;
//
//import com.example.prog.entity.UserDtls;
//import com.example.prog.logs.service.EmailLogService;
//import com.example.prog.repository.UserRepository;
//import com.example.prog.webinar.entity.Registration;
//import com.example.prog.webinar.repository.RegistrationRepository;
//import com.example.prog.webinar.repository.WebinarRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDateTime;
//
//@Component
//@RequiredArgsConstructor
//public class WebinarEmailScheduler {
//
//    private final RegistrationRepository registrationRepository;
//    private final WebinarRepository webinarRepository;
//    private final WebinarEmailService emailService;
//    private final EmailLogService emailLogService;
//    private final UserRepository userRepository;
//    private final EmailTemplateService templateService;
//
//    private static final String SUBJECT_6HR =
//            "Webinar Reminder – Starts in 6 Hours";
//    private static final String SUBJECT_1HR =
//            "Final Reminder – Webinar Starts in 1 Hour";
//
//    // ================= 6 HOUR REMINDER =================
//    @Scheduled(fixedRate = 10 * 60 * 1000)
//    public void send6HourReminders() {
//
//        LocalDateTime from = LocalDateTime.now().plusHours(6);
//        LocalDateTime to = from.plusMinutes(30);
//
//        registrationRepository
//                .findWebinarRegistrationsBetween(from, to)
//                .forEach(reg -> {
//
//                    // ✅ USE REGISTRATION ID
//                    if (emailLogService
//                            .isEmailAlreadySent(reg.getUuid(), SUBJECT_6HR)) {
//                        return;
//                    }
//
//                    webinarRepository.findById(reg.getEntityId())
//                            .ifPresent(webinar -> {
//
//                                UserDtls user =
//                                        userRepository.findById(reg.getUserId())
//                                                .orElseThrow();
//
//                                String body =
//                                        templateService
//                                                .sixHourReminder(reg, webinar);
//
//                                try {
//                                    emailService
//                                            .send6HourReminderEmail(reg, webinar);
//
//                                    emailLogService.logSuccess(
//                                            reg.getUuid(),           // ✅ registrationId
//                                            user.getEmail(),       // ✅ email
//                                            SUBJECT_6HR,
//                                            body
//                                    );
//                                } catch (Exception e) {
//                                    emailLogService.logFailure(
//                                            reg.getUuid(),
//                                            user.getEmail(),
//                                            SUBJECT_6HR,
//                                            body
//                                    );
//                                }
//                            });
//                });
//    }
//
//    // ================= 1 HOUR REMINDER =================
//    @Scheduled(fixedRate = 10 * 60 * 1000)
//    public void send1HourReminders() {
//
//        LocalDateTime from = LocalDateTime.now().plusHours(1);
//        LocalDateTime to = from.plusMinutes(30);
//
//        registrationRepository
//                .findWebinarRegistrationsBetween(from, to)
//                .forEach(reg -> {
//
//                    if (emailLogService
//                            .isEmailAlreadySent(reg.getUuid(), SUBJECT_1HR)) {
//                        return;
//                    }
//
//                    webinarRepository.findById(reg.getEntityId())
//                            .ifPresent(webinar -> {
//
//                                UserDtls user =
//                                        userRepository.findById(reg.getUserId())
//                                                .orElseThrow();
//
//                                String body =
//                                        templateService
//                                                .oneHourReminder(reg, webinar);
//
//                                try {
//                                    emailService
//                                            .send1HourReminderEmail(reg, webinar);
//
//                                    emailLogService.logSuccess(
//                                            reg.getUuid(),
//                                            user.getEmail(),
//                                            SUBJECT_1HR,
//                                            body
//                                    );
//                                } catch (Exception e) {
//                                    emailLogService.logFailure(
//                                            reg.getUuid(),
//                                            user.getEmail(),
//                                            SUBJECT_1HR,
//                                            body
//                                    );
//                                }
//                            });
//                });
//    }
//}
