package com.example.prog.webinar.email;

import com.example.prog.webinar.entity.Registration;
import com.example.prog.webinar.entity.Webinar;
import org.springframework.stereotype.Service;

@Service
public class EmailTemplateService {

    public String registrationConfirmation(Registration reg, Webinar webinar) {
        return """
            
            You are successfully registered for the webinar.

            Title: %s
            Date & Time: %s
            Duration: %d minutes

            Join Link:
            %s

            Thank you,
            """.formatted(
                webinar.getTitle(),
                webinar.getStartDateTime(),
                webinar.getDurationMinutes(),
                webinar.getWebinarLink()
        );
    }

    public String sixHourReminder(Registration reg, Webinar webinar) {
        return """
            Reminder ⏰

            Your webinar "%s" will start in 6 hours.

            Start Time: %s
            Join Link:
            %s

            Please be ready.
            """.formatted(
                webinar.getTitle(),
                webinar.getStartDateTime(),
                webinar.getWebinarLink()
        );
    }

    public String oneHourReminder(Registration reg, Webinar webinar) {
        return """
            Final Reminder 🚨

            Your webinar "%s" will start in 1 hour.

            Join Link:
            %s
            """.formatted(
                webinar.getTitle(),
                webinar.getWebinarLink()
        );
    }
}
