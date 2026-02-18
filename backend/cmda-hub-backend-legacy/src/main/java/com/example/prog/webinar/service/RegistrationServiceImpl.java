//package com.cmdahub.cmda_management_console.webinar.services;
//
//import com.cmdahub.cmda_management_console.security.entity.UserDtls;
//import com.cmdahub.cmda_management_console.security.repository.UserRepository;
//import com.cmdahub.cmda_management_console.webinar.entity.Registration;
//import com.cmdahub.cmda_management_console.webinar.entity.Webinar;
//
//
//import com.cmdahub.cmda_management_console.webinar.serviceInterfaces.RegistrationService;
//import com.cmdahub.cmda_management_console.webinar.webinarRepo.RegistrationRepository;
//import com.cmdahub.cmda_management_console.webinar.webinarRepo.WebinarRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Map;
//
//@Service
//@RequiredArgsConstructor
//public class RegistrationServiceImpl implements RegistrationService {
//
//    private final RegistrationRepository registrationRepository;
//    private final WebinarRepository webinarRepository;
//    private final UserRepository userRepository;
////    private final WebinarEmailService webinarEmailService;
//
//    @Override
//    public Registration registerUser(
//            Long webinarId,
//            Integer userId,
//            String email,
//            String phone) {
//
//        // ✅ SAFETY CHECKS
//        if (webinarId == null) {
//            throw new IllegalArgumentException("webinarId must not be null");
//        }
//        if (userId == null) {
//            throw new IllegalArgumentException("userId must not be null");
//        }
//
//        Webinar webinar = webinarRepository.findById(webinarId)
//                .orElseThrow(() -> new RuntimeException("Webinar not found"));
//
//        UserDtls user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // ✅ Prevent double registration
//        if (registrationRepository
//                .findByWebinar_IdAndUser_UserID(webinarId, userId)
//                .isPresent()) {
//            throw new RuntimeException("Already registered");
//        }
//
//        Registration registration = new Registration();
//        registration.setWebinar(webinar);
//        registration.setUser(user);
//        registration.setRegisteredAt(LocalDateTime.now());
//        registration.setEmail(email);
//        registration.setPhone(phone);
//
//        // ✅ SAVE FIRST
//        Registration saved = registrationRepository.save(registration);
//
////        // 🔔 SEND CONFIRMATION EMAIL (ASYNC / SAFE)
////        webinarEmailService
////                .sendRegistrationConfirmationEmail(saved, webinar);
//
//        return saved;
//    }
//
//    @Override
//    public List<Registration> getRegistrationsForWebinar(Long webinarId) {
//        return registrationRepository.findByWebinar_Id(webinarId);
//    }
//
//    @Override
//    public List<Registration> getUserRegistrations(Integer userId) {
//        return registrationRepository.findByUser_UserID(userId);
//    }
//
//    @Override
//    public List<Registration> get6HrPending(LocalDateTime start, LocalDateTime end) {
//        return registrationRepository
//                .findByEmailSent6hrFalseAndWebinar_StartDateTimeBetween(start, end);
//    }
//
//    @Override
//    public List<Registration> get1HrPending(LocalDateTime start, LocalDateTime end) {
//        return registrationRepository
//                .findByEmailSent1hrFalseAndWebinar_StartDateTimeBetween(start, end);
//    }
//
//    @Override
//    public void mark6hrReminderSent(Long id) {
//        Registration r = registrationRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Registration not found"));
//        r.setEmailSent6hr(true);
//        registrationRepository.save(r);
//    }
//
//    @Override
//    public void mark1hrReminderSent(Long id) {
//        Registration r = registrationRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Registration not found"));
//        r.setEmailSent1hr(true);
//        registrationRepository.save(r);
//    }
//
//
//
//    @Override
//    public List<Map<String, Object>> getUserCalendar(
//            Integer userId, int year, int month) {
//
//        return registrationRepository
//                .findUserCalendar(userId, year, month)
//                .stream()
//                .map(r -> Map.of(
//                        "date", r[0].toString(),
//                        "count", r[1]
//                ))
//                .toList();
//    }
//
//    @Override
//    public List<Registration> getUserWebinarsByDate(
//            Integer userId, LocalDate date) {
//
//        return registrationRepository
//                .findByUser_UserIDAndWebinar_StartDateTimeBetween(
//                        userId,
//                        date.atStartOfDay(),
//                        date.plusDays(1).atStartOfDay()
//                );
//    }
//
//}

package com.example.prog.webinar.service;

import com.example.prog.repository.UserRepository;
import com.example.prog.webinar.dto.registration.RegistrationRequest;
import com.example.prog.webinar.dto.registration.RegistrationResponse;
import com.example.prog.webinar.dto.registration.UserWebinarResponse;
import com.example.prog.webinar.email.WebinarEmailService;
import com.example.prog.webinar.entity.Registration;
import com.example.prog.webinar.entity.Webinar;
import com.example.prog.webinar.mapper.RegistrationMapper;
import com.example.prog.webinar.repository.RegistrationRepository;
import com.example.prog.webinar.repository.WebinarRepository;
import com.example.prog.webinar.service_interface.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final WebinarRepository webinarRepository;
    private final UserRepository userRepository;
    private final RegistrationMapper registrationMapper;
    private final WebinarEmailService webinarEmailService;

    private static final String ENTITY_TYPE_WEB = "WEB";

    // ================= REGISTER USER =================

    @Override
    public RegistrationResponse registerUser(RegistrationRequest request) {

        Long webinarId = request.getEntityId();
        Integer userId = request.getUserId();

        if (webinarId == null) {
            throw new IllegalArgumentException("webinarId must not be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("userId must not be null");
        }

        // ✅ Validate webinar
        Webinar webinar = webinarRepository.findById(webinarId)
                .orElseThrow(() -> new RuntimeException("Webinar not found"));

        // ✅ Validate user
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Prevent duplicate registration
        registrationRepository
                .findByUserIdAndEntityIdAndEntityType(userId, webinarId, ENTITY_TYPE_WEB)
                .ifPresent(r -> {
                    throw new RuntimeException("User already registered for this webinar");
                });

        // ✅ Create registration
        Registration registration = new Registration();
        registration.setUserId(userId);
        registration.setEntityId(webinarId);
        registration.setEntityType(ENTITY_TYPE_WEB);
        registration.setEnrolledAt(LocalDateTime.now());
        registration.setStatus("ENROLLED");
        registration.setPaymentReferenceId(null);
        registration.setAmountPaid(null);
        registration.setPaymentReferenceId(request.getPaymentReferenceId());
        registration.setAmountPaid(request.getAmountPaid());

        Registration saved = registrationRepository.save(registration);
        webinarEmailService.sendRegistrationConfirmationEmail(saved, webinar);
        return registrationMapper.toResponse(saved);
    }

    // ================= USER VIEWS =================

    @Override
    public List<UserWebinarResponse> getUserRegistrations(Integer userId) {

        return registrationRepository.findByUserId(userId)
                .stream()
                .map(registrationMapper::toUserWebinar)
                .toList();
    }

    @Override
    public List<Map<String, Object>> getUserCalendar(
            Integer userId, int year, int month) {

        // 1️⃣ Get all registrations of user
        List<Registration> registrations =
                registrationRepository.findByUserId(userId);

        // 2️⃣ Filter WEB registrations and map to webinars
        Map<LocalDate, List<UserWebinarResponse>> groupedByDate =
                registrations.stream()
                        .filter(r -> ENTITY_TYPE_WEB.equals(r.getEntityType()))
                        .map(r -> webinarRepository.findById(r.getEntityId())
                                .map(webinar -> {
                                    UserWebinarResponse resp =
                                            registrationMapper.toUserWebinar(r);
                                    resp.setStartDateTime(webinar.getStartDateTime());
                                    return resp;
                                })
                                .orElse(null)
                        )
                        .filter(resp -> resp != null)
                        // 3️⃣ Filter by year & month
                        .filter(resp ->
                                resp.getStartDateTime().getYear() == year &&
                                        resp.getStartDateTime().getMonthValue() == month
                        )
                        // 4️⃣ Group by date
                        .collect(
                                java.util.stream.Collectors.groupingBy(
                                        resp -> resp.getStartDateTime().toLocalDate()
                                )
                        );

        // 5️⃣ Build calendar response
        return groupedByDate.entrySet()
                .stream()
                .map(entry -> Map.of(
                        "date", entry.getKey(),
                        "webinars", entry.getValue()
                ))
                .sorted(
                        java.util.Comparator.comparing(
                                e -> (LocalDate) e.get("date")
                        )
                )
                .toList();
    }


    @Override
    public List<UserWebinarResponse> getUserWebinarsByDate(
            Integer userId, LocalDate date) {

        return registrationRepository.findByUserId(userId)
                .stream()
                // 1️⃣ Only webinars
                .filter(r -> ENTITY_TYPE_WEB.equals(r.getEntityType()))
                // 2️⃣ Resolve webinar + filter by date
                .map(r -> webinarRepository.findById(r.getEntityId())
                        .map(webinar -> {
                            if (webinar.getStartDateTime()
                                    .toLocalDate()
                                    .equals(date)) {

                                UserWebinarResponse resp =
                                        registrationMapper.toUserWebinar(r);
                                resp.setStartDateTime(webinar.getStartDateTime());
                                return resp;
                            }
                            return null;
                        })
                        .orElse(null)
                )
                // 3️⃣ Remove non-matching
                .filter(resp -> resp != null)
                .toList();
    }


    // ================= REMINDER SUPPORT =================

    @Override
    public List<Long> get6HrPending(LocalDateTime start, LocalDateTime end) {
        throw new UnsupportedOperationException(
                "6-hour reminders are handled via EmailLog scheduler"
        );
    }

    @Override
    public List<Long> get1HrPending(LocalDateTime start, LocalDateTime end) {
        throw new UnsupportedOperationException(
                "1-hour reminders are handled via EmailLog scheduler"
        );
    }

    @Override
    public void mark6hrReminderSent(Long registrationId) {
        throw new UnsupportedOperationException(
                "Reminder tracking is handled in EmailLog"
        );
    }

    @Override
    public void mark1hrReminderSent(Long registrationId) {
        throw new UnsupportedOperationException(
                "Reminder tracking is handled in EmailLog"
        );
    }
}

