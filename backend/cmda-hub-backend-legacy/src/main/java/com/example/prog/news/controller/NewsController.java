package com.example.prog.news.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.prog.news.service.NewsService;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    // Example: GET /api/news/search?query=gold
    @GetMapping("/search")
    public String searchNews(@RequestParam String query,
                             @RequestParam(defaultValue = "false") boolean useNlp) {
        return newsService.getNewsFromFastAPI(query, useNlp);
    }
}

