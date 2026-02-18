package com.example.prog.service;

import com.example.prog.entity.TutorialVideoRating;

public interface TutorialVideoRatingService {
    TutorialVideoRating rateVideo(String videoName, Integer userId, String userType, Integer rating) throws Exception;
    Double getAverageRating(String videoName);
    Integer getUserRating(String videoName, Integer userId, String userType);
}