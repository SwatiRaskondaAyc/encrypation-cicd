// package com.example.prog.controller.promocode;




// //Controller for PromoCode
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import com.example.prog.entity.promocode.PromoCode;
// import com.example.prog.service.promocode.PromoCodeService;

// @RestController
// @RequestMapping("/api/promo-codes")
// public class PromoCodeController {

//  @Autowired
//  private PromoCodeService service;

//  @PostMapping
//  public ResponseEntity<PromoCode> create(@RequestBody PromoCode promoCode) {
//      return ResponseEntity.ok(service.createPromoCode(promoCode));
//  }

//  @GetMapping("/{code}")
//  public ResponseEntity<PromoCode> getByCode(@PathVariable String code) {
//      return ResponseEntity.ok(service.getByCode(code));
//  }
// }


package com.example.prog.controller.promocode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.prog.entity.promocode.PromoCode;
import com.example.prog.entity.promocode.PromoterSeriesConfig;
import com.example.prog.service.promocode.PromoCodeService;

import java.util.List;

// New DTO for series details
record SeriesDetails(Double commission, Integer distributionLimit) {}

@RestController
@RequestMapping("/api/promo-codes")
public class PromoCodeController {

    @Autowired
    private PromoCodeService service;

    @PostMapping
    public ResponseEntity<PromoCode> create(@RequestBody PromoCode promoCode) {
        return ResponseEntity.ok(service.createPromoCode(promoCode));
    }

    @GetMapping("/{code}")
    public ResponseEntity<PromoCode> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(service.getByCode(code));
    }

    @GetMapping("/suggest-promoter-types")
    public ResponseEntity<List<String>> suggestPromoterTypes(@RequestParam(required = false) String prefix) {
        return ResponseEntity.ok(service.getPromoterTypeSuggestions(prefix));
    }

    @GetMapping("/series-details")
    public ResponseEntity<SeriesDetails> getSeriesDetails(
            @RequestParam String promoterType,
            @RequestParam Integer series) {
        PromoterSeriesConfig config = service.getSeriesDetails(promoterType, series);
        return ResponseEntity.ok(new SeriesDetails(config.getPromoCodeCommission(), config.getDistributionLimit()));
    }

    @GetMapping("/all")
    public ResponseEntity<List<PromoCode>> getAllPromoCodes() {
        return ResponseEntity.ok(service.getAllPromoCodes());
    }

    @PutMapping("/{code}")
    public ResponseEntity<PromoCode> updateDates(
            @PathVariable String code,
            @RequestBody PromoCode updatedPromoCode) {
        PromoCode updated = service.updatePromoCodeDates(code, updatedPromoCode.getValidFrom(), updatedPromoCode.getValidTo());
        return ResponseEntity.ok(updated);
    }
}