package com.example.prog.webinar.service_interface;



import com.example.prog.entity.webinar.Host;

import java.util.List;
import java.util.Optional;

public interface HostService {

    Host createHost(Host host);

    Host updateHost(Long id, Host host);

    Host getHost(Long id);

    List<Host> getAllHosts();

    void deleteHost(Long id);

    Optional<Host> findById(Long id);

}
