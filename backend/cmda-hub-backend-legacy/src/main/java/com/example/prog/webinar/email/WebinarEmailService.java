package com.example.prog.webinar.email;


import com.example.prog.webinar.entity.Registration;
import com.example.prog.webinar.entity.Webinar;

public interface WebinarEmailService {

    // 1️⃣ Immediate email
    void sendRegistrationConfirmationEmail(
            Registration registration,
            Webinar webinar
    );

    // 2️⃣ 6-hour reminder
    void send6HourReminderEmail(
            Registration registration,
            Webinar webinar
    );

    // 3️⃣ 1-hour reminder
    void send1HourReminderEmail(
            Registration registration,
            Webinar webinar
    );
}
