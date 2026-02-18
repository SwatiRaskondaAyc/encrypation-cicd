//package com.cmdahub.cmda_management_console.webinar.controller.user;
//
//
//
//import com.cmdahub.cmda_management_console.webinar.dto.webinar.WebinarListItemResponse;
//import com.cmdahub.cmda_management_console.webinar.dto.webinar.WebinarResponse;
//import com.cmdahub.cmda_management_console.webinar.mapper.WebinarMapper;
//import com.cmdahub.cmda_management_console.webinar.serviceInterfaces.WebinarService;
//import lombok.RequiredArgsConstructor;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//
//@RestController
//@RequestMapping("/api/user/webinars")
//@RequiredArgsConstructor
//public class UserWebinarController {
//
//    @Autowired
//    private WebinarService webinarService;
//
//    @Autowired
//    private WebinarMapper webinarMapper;
//
//    @GetMapping
//    public ResponseEntity<List<WebinarListItemResponse>> getUpcoming() {
//
//        var list = webinarService.getUpcomingWebinars()
//                .stream()
//                .map(webinarMapper::toListItem)
//                .toList();
//
//        return ResponseEntity.ok(list);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<WebinarResponse> getDetails(@PathVariable Long id) {
//        return ResponseEntity.ok(
//                webinarMapper.toResponse(webinarService.getWebinar(id))
//        );
//    }
//}

package com.example.prog.webinar.controller;


import com.example.prog.entity.webinar.Host;
import com.example.prog.webinar.dto.hosts.HostResponse;
import com.example.prog.webinar.dto.registration.UserWebinarResponse;
import com.example.prog.webinar.dto.webinar.WebinarListItemResponse;
import com.example.prog.webinar.dto.webinar.WebinarResponse;
import com.example.prog.webinar.entity.Webinar;
import com.example.prog.webinar.mapper.HostMapper;
import com.example.prog.webinar.mapper.WebinarMapper;
import com.example.prog.webinar.service_interface.HostService;
import com.example.prog.webinar.service_interface.WebinarService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user/webinars")
@RequiredArgsConstructor
public class UserWebinarController {

    // ✅ constructor injection (industry standard)
    private final WebinarService webinarService;
    private final HostService hostService;
    private final WebinarMapper webinarMapper;
    private final HostMapper hostMapper;


    @GetMapping
    public ResponseEntity<List<WebinarListItemResponse>> getUpcoming() {

        List<WebinarListItemResponse> list = webinarService.getUpcomingWebinars()
                .stream()
                .map(webinar -> {
                    String hostName = hostService
                            .getHost(webinar.getInstructorId())
                            .getFullName();

                    return webinarMapper.toListItem(webinar, hostName);
                })
                .toList();

        return ResponseEntity.ok(list);
    }


    @GetMapping("/{id}")
    public ResponseEntity<UserWebinarResponse> getDetails(@PathVariable Long id) {

        Webinar webinar = webinarService.getWebinar(id);

        // fetch host
        Host host = hostService.getHost(webinar.getInstructorId());
        HostResponse hostResponse = hostMapper.toResponse(host);

        UserWebinarResponse response = new UserWebinarResponse();
        response.setWebinarId(webinar.getId());
        response.setWebinarTitle(webinar.getTitle());
        response.setDescription(webinar.getDescription());
        response.setStartDateTime(webinar.getStartDateTime());
        response.setHost(hostResponse);
        response.setJoinLink(webinar.getWebinarLink());

        // ✅ AGENDA MAPPING (JSON → List<String>)
        if (webinar.getAgenda() != null && !webinar.getAgenda().isBlank()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                List<String> agendaList = mapper.readValue(
                        webinar.getAgenda(),
                        new TypeReference<List<String>>() {}
                );
                response.setAgenda(agendaList);
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse webinar agenda", e);
            }
        }

        return ResponseEntity.ok(response);
    }
}

