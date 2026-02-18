package com.example.prog.new_portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String source;   // CLIENT | PYTHON_SERVICE | DATABASE | SYSTEM
    private String message;
    private T data;
}
