//package com.cmdahub.cmda_management_console.webinar.webinarRepo;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import com.cmdahub.cmda_management_console.webinar.entity.CalendarEvent;
//
//import java.util.List;
//
//public interface CalendarEventRepository extends JpaRepository<com.cmdahub.cmda_management_console.webinar.entity.CalendarEvent, Long> {
//
//    // All events of specific user
//    List<CalendarEvent> findByUser_UserID(Integer userId);
//
//    // All events of specific webinar
//    List<CalendarEvent> findByWebinar_Id(Long webinarId);
//
//    // Monthly view
//    List<CalendarEvent> findByUser_UserIDAndEventDateBetween(
//            Integer userId,
//            java.time.LocalDate start,
//            java.time.LocalDate end
//    );
//}

package com.example.prog.webinar.repository;

import com.example.prog.webinar.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    // All events of a user
    List<CalendarEvent> findByUserId(Integer userId);

    // All events of a webinar
    List<CalendarEvent> findByWebinarId(Long webinarId);

    // Events on a specific date
    List<CalendarEvent> findByUserIdAndEventDate(
            Integer userId,
            LocalDate eventDate
    );
}
