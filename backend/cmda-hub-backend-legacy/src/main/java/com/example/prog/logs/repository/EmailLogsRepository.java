package com.example.prog.logs.repository;

import com.example.prog.logs.entity.EmailLogs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailLogsRepository extends JpaRepository<EmailLogs, Long> {

    // ✅ Check if any email was already sent for a registration
    boolean existsByRegistrationId(Long registrationId);

    // ✅ Check by registration + subject (useful for reminders)
    boolean existsByRegistrationIdAndSubject(Long registrationId, String subject);

    // ✅ Get latest email log for a registration
    Optional<EmailLogs> findTopByRegistrationIdOrderBySentAtDesc(Long registrationId);

    // ✅ Count emails sent for a registration
    long countByRegistrationId(Long registrationId);

    // (Optional) custom JPQL if needed later
    @Query("""
        SELECT e
        FROM EmailLogs e
        WHERE e.registrationId = :registrationId
        ORDER BY e.sentAt DESC
    """)
    Optional<EmailLogs> findLatestByRegistrationId(Long registrationId);
}
