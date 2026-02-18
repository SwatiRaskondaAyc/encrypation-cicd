package com.example.prog.logs.service;


public interface EmailLogService {

    boolean isEmailAlreadySent(Long registrationId, String subject);

    void logSuccess(
            Long registrationId,
            String email,
            String subject,
            String body
    );

    void logFailure(
            Long registrationId,
            String email,
            String subject,
            String body
    );
}
