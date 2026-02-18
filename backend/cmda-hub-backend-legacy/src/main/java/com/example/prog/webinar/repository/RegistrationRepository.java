//package com.cmdahub.cmda_management_console.webinar.webinarRepo;
//
//import com.cmdahub.cmda_management_console.webinar.entity.Registration;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//
//
//public interface RegistrationRepository extends JpaRepository<Registration, Long> {
//
//    // Check if user already registered
//    Optional<Registration> findByWebinar_IdAndUser_UserID(Long webinarId, Integer userId);
//
//    // All registrations for a webinar
//    List<Registration> findByWebinar_Id(Long webinarId);
//
//    // All registrations by a user
//    List<Registration> findByUser_UserID(Integer userId);
//
//    // Pending 6-hour reminders
//    List<Registration> findByEmailSent6hrFalseAndWebinar_StartDateTimeBetween(
//            LocalDateTime start, LocalDateTime end
//    );
//
//    // Pending 1-hour reminders
//    List<Registration> findByEmailSent1hrFalseAndWebinar_StartDateTimeBetween(
//            LocalDateTime start, LocalDateTime end
//    );
//
//    @Query("""
//    SELECT CAST(w.startDateTime AS date), COUNT(r.id)
//    FROM Registration r
//    JOIN r.webinar w
//    WHERE r.user.userID = :userId
//      AND YEAR(w.startDateTime) = :year
//      AND MONTH(w.startDateTime) = :month
//    GROUP BY CAST(w.startDateTime AS date)
//""")
//    List<Object[]> findUserCalendar(
//            @Param("userId") Integer userId,
//            @Param("year") int year,
//            @Param("month") int month
//    );
//
//    List<Registration> findByUser_UserIDAndWebinar_StartDateTimeBetween(
//            Integer userId,
//            LocalDateTime start,
//            LocalDateTime end
//    );
//
//}


//package com.example.prog.webinar.repository;
//
//import com.example.prog.webinar.entity.Registration;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//
//public interface RegistrationRepository extends JpaRepository<Registration, Long> {
//
//    // One user → one entity (WEB / CRS)
//    Optional<Registration> findByUserIdAndEntityIdAndEntityType(
//            Integer userId,
//            Long entityId,
//            String entityType
//    );
//
//    // All enrollments of a user
//    List<Registration> findByUserId(Integer userId);
//
//    // All enrollments for a webinar
//    List<Registration> findByEntityIdAndEntityType(
//            Long entityId,
//            String entityType   // "WEB"
//    );
//
//    // Paid enrollments only
//    List<Registration> findByStatus(String status);
//
//    // Pending 6-hour reminders
//    List<Registration> findByEmailSent6hrFalseAndWebinar_StartDateTimeBetween(
//            LocalDateTime start, LocalDateTime end
//    );
//
//    // Pending 1-hour reminders
//    List<Registration> findByEmailSent1hrFalseAndWebinar_StartDateTimeBetween(
//            LocalDateTime start, LocalDateTime end
//    );
//
//    @Query("""
//        SELECT r
//        FROM Registration r, Webinar w
//        WHERE r.entityType = 'WEB'
//          AND r.entityId = w.id
//          AND w.startDateTime BETWEEN :from AND :to
//    """)
//    List<Registration> findWebinarRegistrationsBetween(
//            LocalDateTime from,
//            LocalDateTime to
//    );
//}


package com.example.prog.webinar.repository;

import com.example.prog.webinar.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    // One user → one entity (WEB / CRS)
    Optional<Registration> findByUserIdAndEntityIdAndEntityType(
            Integer userId,
            Long entityId,
            String entityType
    );

    // All enrollments of a user
    List<Registration> findByUserId(Integer userId);

    // All enrollments for a specific entity
    List<Registration> findByEntityIdAndEntityType(
            Long entityId,
            String entityType
    );

    // Filter by status (ENROLLED / COMPLETED / etc.)
    List<Registration> findByStatus(String status);

    // ✅ CORRECT way to fetch webinar registrations by time
    @Query("""
        SELECT r
        FROM Registration r, Webinar w
        WHERE r.entityType = 'WEB'
          AND r.entityId = w.id
          AND w.startDateTime BETWEEN :from AND :to
    """)
    List<Registration> findWebinarRegistrationsBetween(
            LocalDateTime from,
            LocalDateTime to
    );
}
