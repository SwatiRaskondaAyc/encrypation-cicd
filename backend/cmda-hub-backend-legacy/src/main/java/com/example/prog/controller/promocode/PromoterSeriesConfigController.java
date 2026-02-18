package com.example.prog.controller.promocode;

//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import com.example.prog.entity.promocode.PromoCodeConfig;
//import com.example.prog.service.promocode.PromoterSeriesConfigService;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/promo/config")
//public class PromoterSeriesConfigController {
//
//    @Autowired
//    private PromoterSeriesConfigService service;
//
//    @PostMapping
//    public ResponseEntity<PromoCodeConfig> create(@RequestBody PromoCodeConfig config) {
//        return ResponseEntity.ok(service.createConfig(config));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<PromoCodeConfig> update(@PathVariable Long id, @RequestBody PromoCodeConfig config) {
//        return ResponseEntity.ok(service.updateConfig(id, config));
//    }
//
//    @GetMapping("/{type}/{sequence}")
//    public ResponseEntity<PromoCodeConfig> getByTypeAndSequence(@PathVariable String type, @PathVariable Integer sequence) {
//        PromoCodeConfig config = service.getConfigByTypeAndSequence(type, sequence);
//        if (config == null) return ResponseEntity.notFound().build();
//        return ResponseEntity.ok(config);
//    }
//
//    @GetMapping("/{type}")
//    public ResponseEntity<List<PromoCodeConfig>> getByType(@PathVariable String type) {
//        return ResponseEntity.ok(service.getConfigsByType(type));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> delete(@PathVariable Long id) {
//        service.deleteConfig(id);
//        return ResponseEntity.noContent().build();
//    }
//}

//Controller for PromoterSeriesConfig
// package com.example.prog.controller.promocode;

// package com.example.prog.controller.promocode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.prog.entity.promocode.PromoterSeriesConfig;
import com.example.prog.service.promocode.PromoterSeriesConfigService;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/promoter-series")
@CrossOrigin(origins = "http://147.93.107.167:5181", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.OPTIONS})
public class PromoterSeriesConfigController {

    @Autowired
    private PromoterSeriesConfigService service;

    @PostMapping
    public ResponseEntity<PromoterSeriesConfig> create(@RequestBody PromoterSeriesConfig config) {
        return ResponseEntity.ok(service.createPromoterSeriesConfig(config));
    }

    @GetMapping("/latest/{promoterType}")
    public ResponseEntity<PromoterSeriesConfig> getLatest(@PathVariable String promoterType) {
        return ResponseEntity.ok(service.getLatestSeriesForType(promoterType));
    }

    @GetMapping("/all")
    public ResponseEntity<List<PromoterSeriesConfig>> getAll() {
        return ResponseEntity.ok(service.getAllPromoterSeriesConfigs());
    }

    // @PatchMapping("/{id}/expiry")
    // public ResponseEntity<PromoterSeriesConfig> updateExpiry(@PathVariable Long id, @RequestBody LocalDate expiry) {
    //     return ResponseEntity.ok(service.updateExpiry(id, expiry));
    // }

    record ExpiryUpdateDTO(LocalDate expiry) {}

@PatchMapping("/{id}/expiry")
public ResponseEntity<PromoterSeriesConfig> updateExpiry(@PathVariable Long id, @RequestBody ExpiryUpdateDTO dto) {
    return ResponseEntity.ok(service.updateExpiry(id, dto.expiry()));
}
}