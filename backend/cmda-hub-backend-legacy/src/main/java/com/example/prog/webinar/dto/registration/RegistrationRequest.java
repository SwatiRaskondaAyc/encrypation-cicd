package com.example.prog.webinar.dto.registration;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RegistrationRequest {

//    @NotNull(message = "User ID is required")
//    private Integer userId;
    private Integer userId;

    @NotNull(message = "Entity ID is required")
    private Long entityId;   // webinarId OR courseId

    @NotBlank(message = "Entity type is required")
    private String entityType;   // WEB | CRS

    @NotBlank(message = "Status is required")
    private String status;   // PENDING_PAYMENT | ENROLLED | COMPLETED

    private String paymentReferenceId;   // optional

    private BigDecimal amountPaid;        // optional
}
