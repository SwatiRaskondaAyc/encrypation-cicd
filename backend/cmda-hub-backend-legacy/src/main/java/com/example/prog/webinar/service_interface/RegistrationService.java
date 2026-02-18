//package com.cmdahub.cmda_management_console.webinar.serviceInterfaces;
//
//import com.cmdahub.cmda_management_console.webinar.entity.Registration;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Map;
//
//public interface RegistrationService {
//
//    /**
//     * Register a user for a webinar (email & phone mandatory).
//     * Duplicate registration checks remain in implementation.
//     */
//    Registration registerUser(
//            Long webinarId,
//            Integer userId,
//            String email,
//            String phone
//    );
//
//    /**
//     * Get all registrations for a webinar (admin use).
//     */
//    List<Registration> getRegistrationsForWebinar(Long webinarId);
//
//    /**
//     * Get all webinars registered by a user.
//     */
//    List<Registration> getUserRegistrations(Integer userId);
//
//    /**
//     * Registrations eligible for 6-hour reminder email.
//     */
//    List<Registration> get6HrPending(LocalDateTime start, LocalDateTime end);
//
//    /**
//     * Registrations eligible for 1-hour reminder email.
//     */
//    List<Registration> get1HrPending(LocalDateTime start, LocalDateTime end);
//
//    /**
//     * Mark 6-hour reminder email as sent.
//     */
//    void mark6hrReminderSent(Long id);
//
//    /**
//     * Mark 1-hour reminder email as sent.
//     */
//    void mark1hrReminderSent(Long id);
//
//    List<Map<String, Object>> getUserCalendar(
//            Integer userId,
//            int year,
//            int month
//    );
//
//    List<Registration> getUserWebinarsByDate(
//            Integer userId,
//            LocalDate date
//    );
//
//}
package com.example.prog.webinar.service_interface;

import com.example.prog.webinar.dto.registration.RegistrationRequest;
import com.example.prog.webinar.dto.registration.RegistrationResponse;
import com.example.prog.webinar.dto.registration.UserWebinarResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface RegistrationService {

    // ================= USER REGISTRATION =================

    /**
     * Register a user for a webinar.
     * - Validates user & webinar
     * - Prevents duplicate registration
     * - Sets backend-managed fields
     */
    RegistrationResponse registerUser(RegistrationRequest request);

    // ================= USER VIEWS =================

    /**
     * Get all webinars registered by a user.
     */
    List<UserWebinarResponse> getUserRegistrations(Integer userId);

    /**
     * Calendar view of user's webinars.
     */
    List<Map<String, Object>> getUserCalendar(
            Integer userId,
            int year,
            int month
    );

    /**
     * Get user webinars by date.
     */
    List<UserWebinarResponse> getUserWebinarsByDate(
            Integer userId,
            LocalDate date
    );

    // ================= ADMIN / SYSTEM =================

    /**
     * Registrations eligible for 6-hour reminder email.
     */
    List<Long> get6HrPending(LocalDateTime start, LocalDateTime end);

    /**
     * Registrations eligible for 1-hour reminder email.
     */
    List<Long> get1HrPending(LocalDateTime start, LocalDateTime end);

    /**
     * Mark 6-hour reminder email as sent.
     */
    void mark6hrReminderSent(Long registrationId);

    /**
     * Mark 1-hour reminder email as sent.
     */
    void mark1hrReminderSent(Long registrationId);
}