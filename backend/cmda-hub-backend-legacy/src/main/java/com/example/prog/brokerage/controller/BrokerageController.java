package com.example.prog.brokerage.controller;

import com.example.prog.brokerage.dto.BrokerageRequest;
import com.example.prog.brokerage.service.BrokerageService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/brokerage")
public class BrokerageController {

    private final BrokerageService service;

    public BrokerageController(BrokerageService service) {
        this.service = service;
    }

    @PostMapping(value = "/calculate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> calculatePost(@Valid @RequestBody BrokerageRequest request) {
        return ResponseEntity.ok(service.calculateBrokerage(request));
    }

    @GetMapping(value = "/calculate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> calculateGet(@Valid BrokerageRequest request) {
        return ResponseEntity.ok(service.calculateBrokerage(request));
    }
}