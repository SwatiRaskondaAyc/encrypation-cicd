package com.example.prog.logs.service;

import com.example.prog.logs.entity.EmailLogs;
import com.example.prog.logs.repository.EmailLogsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailLogServiceImpl implements EmailLogService {

    private final EmailLogsRepository emailLogsRepository;

    @Override
    public boolean isEmailAlreadySent(Long registrationId, String subject) {
        return emailLogsRepository
                .existsByRegistrationIdAndSubject(registrationId, subject);
    }

    @Override
    public void logSuccess(
            Long registrationId,
            String email,
            String subject,
            String body
    ) {
        save(registrationId, email, subject, body, "SUCCESS");
    }

    @Override
    public void logFailure(
            Long registrationId,
            String email,
            String subject,
            String body
    ) {
        save(registrationId, email, subject, body, "FAILED");
    }

    private void save(
            Long registrationId,
            String email,
            String subject,
            String body,
            String status
    ) {
        EmailLogs log = new EmailLogs();
        log.setRegistrationId(registrationId);
        log.setEmail(email);
        log.setSubject(subject);
        log.setBody(body);
        log.setStatus(status);

        emailLogsRepository.save(log);
    }
}
