package com.example.prog.equityhub.serviceimpl;

import com.example.prog.equityhub.repo.MarketRepository;
import com.example.prog.equityhub.service.MarketService;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class MarketServiceImpl implements MarketService {

    private final MarketRepository marketRepository;

    public MarketServiceImpl(MarketRepository marketRepository) {
        this.marketRepository = marketRepository;
    }

    @Override
    public Map<String, Object> getTopCompanyByClosePrice() {
        return marketRepository.findTopCompanyByClosePrice();
    }
}

