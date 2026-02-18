

// package com.example.prog.controller.promocode;

// import com.example.prog.dto.promocode.UserDetailsDTO;
// import com.example.prog.entity.promocode.PromoCodeUsage;
// import com.example.prog.service.promocode.PromoCodeUsageService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import com.example.prog.dto.promocode.PromoCodeStatusDTO;

// import java.util.List;

// @RestController
// @RequestMapping("/api/promo-usages")
// public class PromoCodeUsageController {

//     @Autowired
//     private PromoCodeUsageService service;

//     @PostMapping
//     public ResponseEntity<PromoCodeUsage> record(@RequestBody PromoCodeUsage usage) {
//         return ResponseEntity.ok(service.recordUsage(usage));
//     }

//     @GetMapping("/users/{promoCode}")
//     public ResponseEntity<Object> getUsersByPromoCode(@PathVariable String promoCode) {
//         return ResponseEntity.ok(service.getUsersByPromoCode(promoCode));
//     }

//     @GetMapping("/status/{promoCode}")
//     public ResponseEntity<PromoCodeStatusDTO> getPromoCodeStatus(@PathVariable String promoCode) {
//         return ResponseEntity.ok(service.getPromoCodeStatus(promoCode));
//     }

//     @GetMapping("/all")
//     public ResponseEntity<List<PromoCodeUsage>> getAllPromoCodeUsages() {
//         return ResponseEntity.ok(service.getAllPromoCodeUsages());
//     }

//     @GetMapping("/created-codes")
//     public ResponseEntity<List<String>> getAllCreatedPromoCodes() {
//         return ResponseEntity.ok(service.getAllCreatedPromoCodes());
//     }
// }

package com.example.prog.controller.promocode;

import com.example.prog.dto.promocode.UserDetailsDTO;
import com.example.prog.entity.promocode.PromoCodeUsage;
import com.example.prog.service.promocode.PromoCodeUsageService;

import com.example.prog.dto.promocode.PromoCodeDetailedStatusDTO;

import com.example.prog.dto.promocode.PaymentRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.prog.dto.promocode.PromoCodeStatusDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/promo-usages")
public class PromoCodeUsageController {

    @Autowired
    private PromoCodeUsageService service;

    @PostMapping
    public ResponseEntity<PromoCodeUsage> record(@RequestBody PromoCodeUsage usage) {
        return ResponseEntity.ok(service.recordUsage(usage));
    }

    @GetMapping("/users/{promoCode}")
    public ResponseEntity<Object> getUsersByPromoCode(@PathVariable String promoCode) {
        return ResponseEntity.ok(service.getUsersByPromoCode(promoCode));
    }

    @GetMapping("/status/{promoCode}")
      public ResponseEntity<PromoCodeDetailedStatusDTO> getPromoCodeStatus(@PathVariable String promoCode) {
        return ResponseEntity.ok(service.getPromoCodeStatus(promoCode));
    }

    @GetMapping("/all")
    public ResponseEntity<List<PromoCodeUsage>> getAllPromoCodeUsages() {
        return ResponseEntity.ok(service.getAllPromoCodeUsages());
    }

    @GetMapping("/created-codes")
    public ResponseEntity<List<String>> getAllCreatedPromoCodes() {
        return ResponseEntity.ok(service.getAllCreatedPromoCodes());
    }

    @PostMapping("/mark-paid/{promoCode}")
    public ResponseEntity<Map<String, Object>> markPromoCodeAsPaid(
            @PathVariable String promoCode,
            @RequestBody PaymentRequest paymentRequest) {
        try {
            Map<String, Object> result = service.markPromoCodeAsPaid(promoCode, paymentRequest);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to update paid status: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
