//package com.cmdahub.cmda_management_console.webinar.serviceInterfaces;
//
//
//import com.cmdahub.cmda_management_console.webinar.entity.Webinar;
//
//import java.util.List;
//
//public interface WebinarService {
//
//    Webinar createWebinar(Webinar webinar);
//
//    Webinar updateWebinar(Long id, Webinar webinar, Long hostId);
//
//    Webinar getWebinar(Long id);
//
//    List<Webinar> getAllWebinars();
//
//    List<Webinar> getUpcomingWebinars();
//
//    List<Webinar> getPastWebinars();
//
//    List<Webinar> getWebinarsByInstructor(Long instructorId);
//
//    void deleteWebinar(Long id);
//
//    List<Webinar> getActiveWebinars();
//}

package com.example.prog.webinar.service_interface;


import com.example.prog.webinar.entity.Webinar;

import java.util.List;

public interface WebinarService {

    Webinar createWebinar(Webinar webinar);

    Webinar updateWebinar(Long id, Webinar webinar, Long hostId);

    Webinar getWebinar(Long id);

    List<Webinar> getAllWebinars();

    List<Webinar> getUpcomingWebinars();

    List<Webinar> getPastWebinars();

    List<Webinar> getWebinarsByInstructor(Long instructorId);

    void deleteWebinar(Long id);

    List<Webinar> getActiveWebinars();
}
