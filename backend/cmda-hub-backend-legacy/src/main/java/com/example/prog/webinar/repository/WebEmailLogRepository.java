//package com.cmdahub.cmda_management_console.webinar.webinarRepo;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import com.cmdahub.cmda_management_console.webinar.entity.EmailLog;
//
//import java.util.List;
//
//public interface WebEmailLogRepository extends JpaRepository<com.cmdahub.cmda_management_console.webinar.entity.EmailLog, Long> {
//
//    List<EmailLog> findByRegistration_Id(Long registrationId);
//
//    List<EmailLog> findByStatus(String status);
//}

package com.example.prog.webinar.repository;

import com.example.prog.webinar.entity.EmailLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WebEmailLogRepository extends JpaRepository<EmailLog, Long> {

    List<EmailLog> findByRegistrationId(Long registrationId);

    List<EmailLog> findByStatus(String status);
}
