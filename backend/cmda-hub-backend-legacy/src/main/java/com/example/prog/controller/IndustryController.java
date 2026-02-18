package com.example.prog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.prog.entity.Industry;
import com.example.prog.repository.IndustryRepository;

import java.util.List;

@RestController
@RequestMapping("/api/industries")
public class IndustryController {

    @Autowired
    private IndustryRepository industryRepository;

    @GetMapping("/by-material")
    public List<Industry> getIndustriesByMaterial(@RequestParam String material) {
        return industryRepository.findIndustriesByMaterial(material);
    }
}
