//package com.cmdahub.cmda_management_console.webinar.mapper;
//
//
//import com.cmdahub.cmda_management_console.webinar.entity.Registration;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//import com.cmdahub.cmda_management_console.webinar.dto.registration.RegistrationResponse;
//import com.cmdahub.cmda_management_console.webinar.dto.registration.UserWebinarResponse;
//
//import lombok.RequiredArgsConstructor;
//
//@Component
//@RequiredArgsConstructor
//public class RegistrationMapper {
//
//    @Autowired
//    private WebinarMapper webinarMapper;
//
//    @Autowired
//    private UserMapper userMapper;
//
//    // Convert Entity → Registration Response DTO
//    public RegistrationResponse toResponse(Registration entity) {
//
//        RegistrationResponse dto = new RegistrationResponse();
//        dto.setRegistrationId(entity.getId());
//        dto.setRegisteredAt(entity.getRegisteredAt());
//
//        dto.setUser(userMapper.toSummary(entity.getUser()));
//        dto.setWebinar(webinarMapper.toListItem(entity.getWebinar()));
//
//        return dto;
//    }
//
//    // Convert Entity → "My Webinars" view
//    public UserWebinarResponse toUserWebinar(Registration entity) {
//
//        UserWebinarResponse dto = new UserWebinarResponse();
//
//        dto.setWebinarId(entity.getWebinar().getId());
//        dto.setWebinarTitle(entity.getWebinar().getTitle());
//        dto.setStartDateTime(entity.getWebinar().getStartDateTime());
//        dto.setHostName(entity.getWebinar().getHost().getName());
//        dto.setJoinLink(entity.getWebinar().getWebinarLink());
//        dto.setEmail(entity.getEmail());
//        dto.setPhone(entity.getPhone());
//
//
//        return dto;
//    }
//}

package com.example.prog.webinar.mapper;

import com.example.prog.entity.UserDtls;
import com.example.prog.entity.webinar.Host;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.webinar.HostRepository;
import com.example.prog.webinar.dto.common.UserSummaryDTO;
import com.example.prog.webinar.dto.registration.RegistrationResponse;
import com.example.prog.webinar.dto.registration.UserWebinarResponse;
import com.example.prog.webinar.dto.webinar.WebinarListItemResponse;
import com.example.prog.webinar.entity.Registration;
import com.example.prog.webinar.entity.Webinar;
import com.example.prog.webinar.repository.WebinarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RegistrationMapper {

    private final UserRepository userRepository;
    private final WebinarRepository webinarRepository;
    private final HostRepository hostRepository;
    private final HostMapper hostMapper;

    // ================= Registration Response =================
    public RegistrationResponse toResponse(Registration registration) {

        UserDtls user = userRepository.findById(registration.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Webinar webinar = webinarRepository.findById(registration.getEntityId())
                .orElseThrow(() -> new RuntimeException("Webinar not found"));

        Host host = hostRepository.findById(webinar.getInstructorId())
                .orElseThrow(() -> new RuntimeException("Host not found"));

        // ---- User summary ----
        UserSummaryDTO userDto = new UserSummaryDTO();
        userDto.setId(user.getUserID());
        userDto.setFullname(user.getFullname());
        userDto.setEmail(user.getEmail());

        // ---- Webinar summary ----
        WebinarListItemResponse webinarDto = new WebinarListItemResponse();
        webinarDto.setId(webinar.getId());
        webinarDto.setTitle(webinar.getTitle());
        webinarDto.setStartDateTime(webinar.getStartDateTime());
        webinarDto.setHostName(host.getFullName());
        webinarDto.setFeatured(false);
        webinarDto.setThumbnail(webinar.getThumbnailUrl());


        // ---- Final response ----
        RegistrationResponse response = new RegistrationResponse();
        response.setRegistrationId(registration.getUuid());
        response.setRegisteredAt(registration.getEnrolledAt());
        response.setUser(userDto);
        response.setWebinar(webinarDto);
        response.setPaymentReferenceId(registration.getPaymentReferenceId());
        response.setAmountPaid(registration.getAmountPaid());
        response.setStatus(registration.getStatus());

        return response;
    }

    // ================= My Webinars =================
//    public UserWebinarResponse toUserWebinar(Registration registration) {
//
//        Webinar webinar = webinarRepository.findById(registration.getEntityId())
//                .orElseThrow(() -> new RuntimeException("Webinar not found"));
//
//        Host host = hostRepository.findById(webinar.getInstructorId())
//                .orElseThrow(() -> new RuntimeException("Host not found"));
//
//        UserWebinarResponse dto = new UserWebinarResponse();
//        dto.setWebinarId(webinar.getId());
//        dto.setWebinarTitle(webinar.getTitle());
//        dto.setStartDateTime(webinar.getStartDateTime());
//        dto.setHostName(host.getFullName());
//        dto.setJoinLink(webinar.getWebinarLink());
//
//        return dto;
//    }

    // ================= My Webinars =================
    public UserWebinarResponse toUserWebinar(Registration registration) {

        Webinar webinar = webinarRepository.findById(registration.getEntityId())
                .orElseThrow(() -> new RuntimeException("Webinar not found"));

        Host host = hostRepository.findById(webinar.getInstructorId())
                .orElseThrow(() -> new RuntimeException("Host not found"));

        UserWebinarResponse dto = new UserWebinarResponse();

        // ================= Webinar basic info =================
        dto.setWebinarId(webinar.getId());
        dto.setWebinarTitle(webinar.getTitle());
        dto.setDescription(webinar.getDescription());
        dto.setStartDateTime(webinar.getStartDateTime());

        // ================= Host =================
        dto.setHost(hostMapper.toResponse(host));

        // ================= STATUS (🔥 MOST IMPORTANT) =================
        dto.setStatus(registration.getStatus());

        // ================= Agenda (JSON → List<String>) =================
        if (webinar.getAgenda() != null && !webinar.getAgenda().isBlank()) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper =
                        new com.fasterxml.jackson.databind.ObjectMapper();

                dto.setAgenda(
                        mapper.readValue(
                                webinar.getAgenda(),
                                new com.fasterxml.jackson.core.type.TypeReference<
                                        java.util.List<String>>() {}
                        )
                );
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse webinar agenda", e);
            }
        }

        // ================= Join link (SECURE) =================
        if ("ENROLLED".equals(registration.getStatus())
                || "COMPLETED".equals(registration.getStatus())) {
            dto.setJoinLink(webinar.getWebinarLink());
        } else {
            dto.setJoinLink(null); // hide link
        }

        return dto;
    }

}