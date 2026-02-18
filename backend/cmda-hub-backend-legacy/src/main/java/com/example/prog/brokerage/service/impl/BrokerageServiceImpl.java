package com.example.prog.brokerage.service.impl;

import com.example.prog.brokerage.dto.BrokerageRequest;
import com.example.prog.brokerage.repository.BrokeragePythonRepository;
import com.example.prog.brokerage.service.BrokerageService;
import org.springframework.stereotype.Service;

@Service
public class BrokerageServiceImpl implements BrokerageService {

    private final BrokeragePythonRepository repository;

    public BrokerageServiceImpl(BrokeragePythonRepository repository) {
        this.repository = repository;
    }

    @Override
    public String calculateBrokerage(BrokerageRequest request) {
        request.validateBroker();
        return repository.calculate(request);
    }
}