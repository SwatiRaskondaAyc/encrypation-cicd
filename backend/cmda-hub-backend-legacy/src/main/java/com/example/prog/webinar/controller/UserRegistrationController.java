//package com.cmdahub.cmda_management_console.webinar.controller.user;
//
//
//
//import com.cmdahub.cmda_management_console.webinar.dto.registration.RegistrationRequest;
//import com.cmdahub.cmda_management_console.webinar.dto.registration.RegistrationResponse;
//import com.cmdahub.cmda_management_console.webinar.dto.registration.UserWebinarResponse;
//import com.cmdahub.cmda_management_console.webinar.mapper.RegistrationMapper;
//import com.cmdahub.cmda_management_console.webinar.serviceInterfaces.RegistrationService;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//@RestController
//@RequestMapping("/api/register")
//@RequiredArgsConstructor
//public class UserRegistrationController {
//
//    @Autowired
//    private RegistrationService registrationService;
//
//    @Autowired
//    private RegistrationMapper registrationMapper;
//
//    @PostMapping
//    public ResponseEntity<RegistrationResponse> register(
//            @Valid @RequestBody RegistrationRequest req
//    ) {
//        var reg = registrationService.registerUser(
//                req.getWebinarId(),
//                req.getUserId(),
//                req.getEmail(),
//                req.getPhone()
//        );
//
//        return ResponseEntity.ok(registrationMapper.toResponse(reg));
//    }
//
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<List<UserWebinarResponse>> getMyWebinars(@PathVariable Integer userId) {
//
//        var list = registrationService.getUserRegistrations(userId)
//                .stream()
//                .map(registrationMapper::toUserWebinar)
//                .toList();
//
//        return ResponseEntity.ok(list);
//    }
//
//
//
//
//    @GetMapping("/user/webinars/calendar")
//    public List<Map<String, Object>> userCalendar(
//            @RequestParam Integer userId,
//            @RequestParam int year,
//            @RequestParam int month) {
//
//        return registrationService.getUserCalendar(userId, year, month);
//    }
//
//    @GetMapping("/user/webinars/by-date")
//    public List<UserWebinarResponse> userWebinarsByDate(
//            @RequestParam Integer userId,
//            @RequestParam LocalDate date) {
//
//        return registrationService
//                .getUserWebinarsByDate(userId, date)
//                .stream()
//                .map(registrationMapper::toUserWebinar)
//                .toList();
//    }
//
//
//
//
//}

//
//package com.example.prog.webinar.controller;
//
//import com.example.prog.new_portfolio.services.UserResolverService;
//import com.example.prog.new_portfolio.dto.UserContext;
//import com.example.prog.webinar.dto.registration.RegistrationRequest;
//import com.example.prog.webinar.dto.registration.RegistrationResponse;
//import com.example.prog.webinar.service_interface.RegistrationService;
//import jakarta.servlet.http.HttpServletRequest;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/register")
//@RequiredArgsConstructor
//public class UserRegistrationController {
//
//    private final RegistrationService registrationService;
//    private final UserResolverService userResolverService;
//
//    // ================= Register User =================
//    @PostMapping
//    public ResponseEntity<RegistrationResponse> register(
//            @RequestBody RegistrationRequest req,
//            HttpServletRequest httpRequest
//    ) {
//
//        // ✅ Resolve userId if not provided
//        if (req.getUserId() == null) {
//            UserContext userContext =
//                    userResolverService.getUserInfo(httpRequest);
//
//            req.setUserId(userContext.userId());
//        }
//
//        RegistrationResponse response =
//                registrationService.registerUser(req);
//
//        return ResponseEntity.ok(response);
//    }
//}
//
//    // ================= User Registrations =================
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<List<UserWebinarResponse>> getMyWebinars(
//            @PathVariable Integer userId) {
//
//        return ResponseEntity.ok(
//                registrationService.getUserRegistrations(userId)
//        );
//    }
//
//    // ================= Calendar View =================
//    @GetMapping("/user/webinars/calendar")
//    public ResponseEntity<List<Map<String, Object>>> userCalendar(
//            @RequestParam Integer userId,
//            @RequestParam int year,
//            @RequestParam int month) {
//
//        return ResponseEntity.ok(
//                registrationService.getUserCalendar(userId, year, month)
//        );
//    }
//
//    // ================= By Date =================
//    @GetMapping("/user/webinars/by-date")
//    public ResponseEntity<List<UserWebinarResponse>> userWebinarsByDate(
//            @RequestParam Integer userId,
//            @RequestParam LocalDate date) {
//
//        return ResponseEntity.ok(
//                registrationService.getUserWebinarsByDate(userId, date)
//        );
//    }
//}


package com.example.prog.webinar.controller;

import com.example.prog.new_portfolio.dto.UserContext;
import com.example.prog.new_portfolio.services.UserResolverService;
import com.example.prog.webinar.dto.registration.RegistrationRequest;
import com.example.prog.webinar.dto.registration.RegistrationResponse;
import com.example.prog.webinar.dto.registration.UserWebinarResponse;
import com.example.prog.webinar.service_interface.RegistrationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/register")
@RequiredArgsConstructor
public class UserRegistrationController {

    private final RegistrationService registrationService;
    private final UserResolverService userResolverService;

    // ================= Register User =================
//    @PostMapping
//    public ResponseEntity<RegistrationResponse> register(
//            @RequestBody RegistrationRequest req,
//            HttpServletRequest httpRequest
//    ) {
//        // Resolve userId from JWT (authoritative)
//        UserContext userContext =
//                userResolverService.getUserInfo(httpRequest);
//        req.setUserId(userContext.userId());
//
//        RegistrationResponse response =
//                registrationService.registerUser(req);
//
//        return ResponseEntity.ok(response);
//    }

    @PostMapping
    public ResponseEntity<RegistrationResponse> register(
            @RequestBody RegistrationRequest req,
            HttpServletRequest httpRequest
    ) {
        UserContext userContext =
                userResolverService.getUserInfo(httpRequest);

        req.setUserId(userContext.getUserId());

        RegistrationResponse response =
                registrationService.registerUser(req);

        return ResponseEntity.ok(response);
    }


    // ================= User Registrations =================
    @GetMapping("/user")
    public ResponseEntity<List<UserWebinarResponse>> getMyWebinars(
            HttpServletRequest httpRequest
    ) {
        UserContext userContext =
                userResolverService.getUserInfo(httpRequest);

        Integer userId = userContext.getUserId();

        return ResponseEntity.ok(
                registrationService.getUserRegistrations(userId)
        );
    }

    // ================= Calendar View =================
    @GetMapping("/user/webinars/calendar")
    public ResponseEntity<List<Map<String, Object>>> userCalendar(
            @RequestParam Integer userId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        return ResponseEntity.ok(
                registrationService.getUserCalendar(userId, year, month)
        );
    }

    // ================= By Date =================
    @GetMapping("/user/webinars/by-date")
    public ResponseEntity<List<UserWebinarResponse>> userWebinarsByDate(
            @RequestParam Integer userId,
            @RequestParam LocalDate date
    ) {
        return ResponseEntity.ok(
                registrationService.getUserWebinarsByDate(userId, date)
        );
    }
}
