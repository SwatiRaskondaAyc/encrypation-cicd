package com.example.prog.new_portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserContext {
    private final int userId;
    private final String userType;
    private final String email;
}