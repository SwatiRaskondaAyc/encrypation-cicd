//package com.cmdahub.cmda_management_console.webinar.services;
//
//
//import com.cmdahub.cmda_management_console.security.entity.Host;
//import com.cmdahub.cmda_management_console.webinar.entity.Webinar;
//import com.cmdahub.cmda_management_console.webinar.serviceInterfaces.WebinarService;
//import com.cmdahub.cmda_management_console.security.repository.HostRepository;
//import com.cmdahub.cmda_management_console.webinar.webinarRepo.WebinarRepository;
//import lombok.RequiredArgsConstructor;
//
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//
//
//@Service
//@RequiredArgsConstructor
//public class WebinarServiceImpl implements WebinarService {
//
//    @Autowired
//    private WebinarRepository webinarRepository;
//
//    @Autowired
//    private HostRepository hostRepository;
//
//    @Override
//    public Webinar createWebinar(Webinar webinar, Long hostId) {
//
//        Host host = hostRepository.findById(hostId)
//                .orElseThrow(() -> new RuntimeException("Host not found"));
//
//        webinar.setHost(host);
//        return webinarRepository.save(webinar);
//    }
//
//    @Override
//    public Webinar updateWebinar(Long id, Webinar updated, Long hostId) {
//
//        Webinar webinar = webinarRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Webinar not found"));
//
//        Host host = hostRepository.findById(hostId)
//                .orElseThrow(() -> new RuntimeException("Host not found"));
//
//        webinar.setTitle(updated.getTitle());
//        webinar.setAgenda(updated.getAgenda());
//        webinar.setDescription(updated.getDescription());
//        webinar.setDurationMinutes(updated.getDurationMinutes());
//        webinar.setStartDateTime(updated.getStartDateTime());
//        webinar.setWebinarLink(updated.getWebinarLink());
//        webinar.setIsFeatured(updated.getIsFeatured());
//        webinar.setHost(host);
//
//        return webinarRepository.save(webinar);
//    }
//
//    @Override
//    public Webinar getWebinar(Long id) {
//        return webinarRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Webinar not found"));
//    }
//
//    @Override
//    public List<Webinar> getAllWebinars() {
//        return webinarRepository.findAll();
//    }
//
//    @Override
//    public List<Webinar> getUpcomingWebinars() {
//        return webinarRepository.findByStartDateTimeAfter(LocalDateTime.now());
//    }
//
//    @Override
//    public List<Webinar> getPastWebinars() {
//        return webinarRepository.findByStartDateTimeBefore(LocalDateTime.now());
//    }
//
//    @Override
//    public void deleteWebinar(Long id) {
//        webinarRepository.deleteById(id);
//    }
//}

package com.example.prog.webinar.service;


import com.example.prog.webinar.entity.Webinar;
import com.example.prog.webinar.repository.WebinarRepository;
import com.example.prog.webinar.service_interface.WebinarService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WebinarServiceImpl implements WebinarService {

    // ✅ constructor injection (industry standard)
    private final WebinarRepository webinarRepository;

    @Override
    public Webinar createWebinar(Webinar webinar) {

        // ✅ host/instructor ID is already inside Webinar entity
        // no cross-DB entity fetching
        if (webinar.getInstructorId() == null) {
            throw new RuntimeException("Instructor ID must not be null");
        }

        return webinarRepository.save(webinar);
    }

    @Override
    public Webinar updateWebinar(Long id, Webinar updated, Long hostId) {

        Webinar webinar = webinarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Webinar not found"));

        // ✅ preserve previous flow: hostId comes from method param
        webinar.setInstructorId(hostId);

        webinar.setTitle(updated.getTitle());
        webinar.setDescription(updated.getDescription());
        webinar.setStartDateTime(updated.getStartDateTime());
        webinar.setDurationMinutes(updated.getDurationMinutes());
        webinar.setWebinarLink(updated.getWebinarLink());
        webinar.setPrice(updated.getPrice());
        webinar.setActive(updated.isActive());

        return webinarRepository.save(webinar);
    }

    @Override
    public Webinar getWebinar(Long id) {
        return webinarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Webinar not found"));
    }

    @Override
    public List<Webinar> getAllWebinars() {
        return webinarRepository.findAll();
    }

    @Override
    public List<Webinar> getUpcomingWebinars() {
        return webinarRepository.findByStartDateTimeAfter(LocalDateTime.now());
    }

    @Override
    public List<Webinar> getPastWebinars() {
        return webinarRepository.findByStartDateTimeBefore(LocalDateTime.now());
    }

    @Override
    public List<Webinar> getWebinarsByInstructor(Long instructorId) {
        return webinarRepository.findByInstructorId(instructorId);
    }

    @Override
    public List<Webinar> getActiveWebinars() {
        return webinarRepository.findByActiveTrue();
    }

    @Override
    public void deleteWebinar(Long id) {
        webinarRepository.deleteById(id);
    }
}
