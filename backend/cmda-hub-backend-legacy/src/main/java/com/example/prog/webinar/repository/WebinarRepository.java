//package com.cmdahub.cmda_management_console.webinar.webinarRepo;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import com.cmdahub.cmda_management_console.webinar.entity.Webinar;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//public interface WebinarRepository extends JpaRepository<Webinar, Long> {
//
//    List<Webinar> findByIsFeaturedTrue();
//
//    List<Webinar> findByHost_Id(Long hostId);
//
//    List<Webinar> findByStartDateTimeAfter(LocalDateTime now);
//
//    List<Webinar> findByStartDateTimeBefore(LocalDateTime now);
//
//    List<Webinar> findByTitleContainingIgnoreCase(String title);
//}

package com.example.prog.webinar.repository;

import com.example.prog.webinar.entity.Webinar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface WebinarRepository extends JpaRepository<Webinar, Long> {

    List<Webinar> findByInstructorId(Long instructorId);

    List<Webinar> findByActiveTrue();

    List<Webinar> findByStartDateTimeAfter(LocalDateTime time);

    List<Webinar> findByStartDateTimeBefore(LocalDateTime time);

    List<Webinar> findByTitleContainingIgnoreCase(String title);
}

