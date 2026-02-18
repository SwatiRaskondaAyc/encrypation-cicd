//package com.cmdahub.cmda_management_console.webinar.services;
//
//import com.cmdahub.cmda_management_console.security.entity.Host;
//import com.cmdahub.cmda_management_console.security.repository.HostRepository;
//import lombok.RequiredArgsConstructor;
//
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//import com.cmdahub.cmda_management_console.webinar.serviceInterfaces.HostService;
//
//@Service
//@RequiredArgsConstructor
//public class HostServiceImpl implements HostService {
//
//    @Autowired
//    HostRepository hostRepository;
//
//    @Override
//    public Host createHost(Host host) {
//        return hostRepository.save(host);
//    }
//
//    @Override
//    public Host updateHost(Long id, Host updated) {
//        Host host = hostRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Host not found"));
//
//        host.setName(updated.getName());
//        host.setRole(updated.getRole());
//        host.setBio(updated.getBio());
//        host.setLanguages(updated.getLanguages());
//        host.setPhotoUrl(updated.getPhotoUrl());
//        host.setLinkedin(updated.getLinkedin());
//        host.setTwitter(updated.getTwitter());
//        host.setInstagram(updated.getInstagram());
//
//        return hostRepository.save(host);
//    }
//
//    @Override
//    public Host getHost(Long id) {
//        return hostRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Host not found"));
//    }
//
//    @Override
//    public List<Host> getAllHosts() {
//        return hostRepository.findAll();
//    }
//
//    @Override
//    public void deleteHost(Long id) {
//        hostRepository.deleteById(id);
//    }
//}
//

package com.example.prog.webinar.service;


import com.example.prog.entity.webinar.Host;
import com.example.prog.repository.webinar.HostRepository;
import com.example.prog.webinar.service_interface.HostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HostServiceImpl implements HostService {

    // ✅ Constructor injection (industry standard)
    private final HostRepository hostRepository;

    @Override
    public Host createHost(Host host) {
        return hostRepository.save(host);
    }

    @Override
    public Host updateHost(Long id, Host updated) {

        Host host = hostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Host not found"));

        // 🔄 Updated as per new Host entity
        host.setFullName(updated.getFullName());
        host.setRole(updated.getRole());
        host.setBio(updated.getBio());
        host.setExperience(updated.getExperience());
        host.setLanguages(updated.getLanguages());
        host.setPhotoUrl(updated.getPhotoUrl());
        host.setLinkedinUrl(updated.getLinkedinUrl());

        host.setUpdatedAt(LocalDateTime.now());

        return hostRepository.save(host);
    }

    @Override
    public Host getHost(Long id) {
        return hostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Host not found"));
    }

    @Override
    public List<Host> getAllHosts() {
        return hostRepository.findAll();
    }

    @Override
    public void deleteHost(Long id) {
        hostRepository.deleteById(id);
    }

    @Override
    public Optional<Host> findById(Long id) {
        return hostRepository.findById(id);
    }
}
