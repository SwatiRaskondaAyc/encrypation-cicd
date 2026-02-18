package com.example.prog.reddit.controller;

import com.example.prog.reddit.service.RedditScrapeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reddit")
public class RedditScrapeController {

    @Autowired
    private RedditScrapeService redditScrapeService;

    @GetMapping("/scrape")
    public ResponseEntity<String> scrape(
            @RequestParam("keyword")   String keyword,
            @RequestParam("timeframe") String timeframe) {

        String json = redditScrapeService.getRedditData(keyword, timeframe);
        return ResponseEntity.ok(json);
    }
}