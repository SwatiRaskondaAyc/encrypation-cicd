package com.example.prog.brokerage.service;

import com.example.prog.brokerage.dto.BrokerageRequest;

public interface BrokerageService {
    String calculateBrokerage(BrokerageRequest request);
}