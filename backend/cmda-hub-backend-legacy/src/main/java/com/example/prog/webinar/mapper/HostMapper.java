//package com.cmdahub.cmda_management_console.webinar.mapper;
//
//
//import com.cmdahub.cmda_management_console.security.entity.Host;
//import org.springframework.stereotype.Component;
//
//import com.cmdahub.cmda_management_console.webinar.dto.hosts.HostRequest;
//import com.cmdahub.cmda_management_console.webinar.dto.hosts.HostResponse;
//
//@Component
//public class HostMapper {
//
//    // Convert Request DTO → Entity
//    public Host toEntity(HostRequest req) {
//        Host host = new Host();
//        host.setName(req.getName());
//        host.setRole(req.getRole());
//        host.setExperience(req.getExperience());
//        host.setBio(req.getBio());
//        host.setLanguages(req.getLanguages());
//        host.setPhotoUrl(req.getPhotoUrl());
//        host.setLinkedin(req.getLinkedin());
//        host.setTwitter(req.getTwitter());
//        host.setInstagram(req.getInstagram());
//        return host;
//    }
//
//    // Convert Entity → Response DTO
//    public HostResponse toResponse(Host entity) {
//        HostResponse dto = new HostResponse();
//        dto.setId(entity.getId());
//        dto.setName(entity.getName());
//        dto.setRole(entity.getRole());
//        dto.setExperience(entity.getExperience());
//        dto.setBio(entity.getBio());
//        dto.setLanguages(entity.getLanguages());
//        dto.setPhotoUrl(entity.getPhotoUrl());
//        dto.setLinkedin(entity.getLinkedin());
//        dto.setTwitter(entity.getTwitter());
//        dto.setInstagram(entity.getInstagram());
//        return dto;
//    }
//}

package com.example.prog.webinar.mapper;


import com.example.prog.entity.webinar.Host;
import com.example.prog.webinar.dto.hosts.HostRequest;
import com.example.prog.webinar.dto.hosts.HostResponse;
import org.springframework.stereotype.Component;

@Component
public class HostMapper {

    // Convert Request DTO → Entity
    public Host toEntity(HostRequest req) {
        Host host = new Host();

        host.setFullName(req.getName());          // mapped
        host.setRole(req.getRole());
        host.setExperience(req.getExperience());
        host.setBio(req.getBio());
        host.setLanguages(req.getLanguages());
        host.setPhotoUrl(req.getPhotoUrl());
        host.setLinkedinUrl(req.getLinkedin());

        // userId is optional → not set here
        return host;
    }

    // Convert Entity → Response DTO
    public HostResponse toResponse(Host entity) {
        HostResponse dto = new HostResponse();

        dto.setId(entity.getUuid());              // mapped
        dto.setName(entity.getFullName());
        dto.setRole(entity.getRole());
        dto.setExperience(entity.getExperience());
        dto.setBio(entity.getBio());
        dto.setLanguages(entity.getLanguages());
        dto.setPhotoUrl(entity.getPhotoUrl());
        dto.setLinkedin(entity.getLinkedinUrl());

        return dto;
    }
}
