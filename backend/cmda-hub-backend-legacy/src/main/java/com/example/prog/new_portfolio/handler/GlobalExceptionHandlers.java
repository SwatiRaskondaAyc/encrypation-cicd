package com.example.prog.new_portfolio.handler;

import com.example.prog.new_portfolio.dto.ApiResponse;
import com.example.prog.new_portfolio.exception.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandlers {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<?>> validation(ValidationException ex) {
        return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "CLIENT", ex.getMessage(), null));
    }

    @ExceptionHandler(PythonServiceException.class)
    public ResponseEntity<ApiResponse<?>> python(PythonServiceException ex) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(new ApiResponse<>(false, "PYTHON_SERVICE", ex.getMessage(), null));
    }

    @ExceptionHandler(DatabaseOperationException.class)
    public ResponseEntity<ApiResponse<?>> db(DatabaseOperationException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "DATABASE", ex.getMessage(), null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> system(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "SYSTEM", "Unexpected error", null));
    }
}
