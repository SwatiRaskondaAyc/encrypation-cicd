//package com.cmdahub.cmda_management_console.webinar.mapper;
//
//
//
//import com.cmdahub.cmda_management_console.security.entity.Host;
//import com.cmdahub.cmda_management_console.webinar.entity.Webinar;
//import org.springframework.beans.factory.annotation.Autowired;
//
//import lombok.RequiredArgsConstructor;
//
//import org.springframework.stereotype.Component;
//
//import com.cmdahub.cmda_management_console.webinar.dto.webinar.WebinarListItemResponse;
//import com.cmdahub.cmda_management_console.webinar.dto.webinar.WebinarRequest;
//import com.cmdahub.cmda_management_console.webinar.dto.webinar.WebinarResponse;
//
//@Component
//@RequiredArgsConstructor
//public class WebinarMapper {
//
//    @Autowired
//    private HostMapper hostMapper;
//
//    // Convert DTO → Entity (used for create/update)
//    public Webinar toEntity(WebinarRequest req, Host host) {
//
//        Webinar w = new Webinar();
//        w.setTitle(req.getTitle());
//        w.setDescription(req.getDescription());
//        w.setAgenda(req.getAgenda());
//        w.setStartDateTime(req.getStartDateTime());
//        w.setDurationMinutes(req.getDurationMinutes());
//        w.setIsFeatured(req.isFeatured());
//        w.setWebinarLink(req.getWebinarLink());
//        w.setHost(host);
//
//        if (req.getThumbnail() != null) {
//            w.setThumbnail(req.getThumbnail());
//        }
//
//        return w;
//    }
//
//    // Convert Entity → Detailed Response
//    public WebinarResponse toResponse(Webinar entity) {
//
//        WebinarResponse dto = new WebinarResponse();
//        dto.setId(entity.getId());
//        dto.setTitle(entity.getTitle());
//        dto.setDescription(entity.getDescription());
//        dto.setAgenda(entity.getAgenda());
//        dto.setStartDateTime(entity.getStartDateTime());
//        dto.setDurationMinutes(entity.getDurationMinutes());
//        dto.setFeatured(entity.getIsFeatured());
//        dto.setWebinarLink(entity.getWebinarLink());
//        dto.setThumbnail(entity.getThumbnail());  //new
//
//        // Nested host object
//        dto.setHost(hostMapper.toResponse(entity.getHost()));
//
//        return dto;
//    }
//
//    // Convert Entity → Lightweight List Item Response
//    public WebinarListItemResponse toListItem(Webinar entity) {
//
//        WebinarListItemResponse dto = new WebinarListItemResponse();
//        dto.setId(entity.getId());
//        dto.setTitle(entity.getTitle());
//        dto.setHostName(entity.getHost().getName());
//        dto.setStartDateTime(entity.getStartDateTime());
//        dto.setFeatured(entity.getIsFeatured());
//        dto.setThumbnail(entity.getThumbnail());    //new
//
//        return dto;
//    }
//
//}
//


package com.example.prog.webinar.mapper;


import com.example.prog.webinar.dto.hosts.HostResponse;
import com.example.prog.webinar.dto.webinar.WebinarListItemResponse;
import com.example.prog.webinar.dto.webinar.WebinarRequest;
import com.example.prog.webinar.dto.webinar.WebinarResponse;
import com.example.prog.webinar.entity.Webinar;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebinarMapper {
    private final AgendaJsonMapper agendaJsonMapper;
    // ================= DTO → Entity =================
    public Webinar toEntity(WebinarRequest req) {

        Webinar w = new Webinar();
        w.setTitle(req.getTitle());
        w.setDescription(req.getDescription());
        w.setStartDateTime(req.getStartDateTime());
        w.setDurationMinutes(req.getDurationMinutes());
        w.setWebinarLink(req.getWebinarLink());
        w.setInstructorId(req.getHostId());   // 🔑 mapping
        w.setPrice(req.getPrice());
        w.setActive(true);
        // ✅ agenda List → JSON
        w.setAgenda(agendaJsonMapper.toJson(req.getAgenda()));
        if (req.getThumbnail() != null) {
            w.setThumbnailUrl(req.getThumbnail());
        }

        return w;
    }

    // ================= Entity → Detailed Response =================
    public WebinarResponse toResponse(Webinar entity, String hostName) {

        WebinarResponse dto = new WebinarResponse();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setStartDateTime(entity.getStartDateTime());
        dto.setDurationMinutes(entity.getDurationMinutes());
        dto.setWebinarLink(entity.getWebinarLink());
        dto.setThumbnail(entity.getThumbnailUrl());
        dto.setHostName(hostName); // resolved outside mapper
        // ✅ JSON → List
        dto.setAgenda(
                agendaJsonMapper.fromJson(entity.getAgenda())
        );
        return dto;
    }

    // ================= Entity → List Item =================
    public WebinarListItemResponse toListItem(Webinar entity, String hostName) {

        WebinarListItemResponse dto = new WebinarListItemResponse();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setHostName(hostName);
        dto.setStartDateTime(entity.getStartDateTime());
        dto.setThumbnail(entity.getThumbnailUrl());

        return dto;
    }
}
