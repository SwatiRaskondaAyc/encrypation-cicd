
	
	
package com.example.prog.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.prog.entity.Support;
import com.example.prog.repository.SupportRepo;
import com.example.prog.service.SupportService;

@Service
public class SupportServiceImpl implements SupportService {

    @Autowired
    private SupportRepo supportRepository;

    @Override
    public Support saveSupport(Support support)
    {
        return supportRepository.save(support);
    }
}
