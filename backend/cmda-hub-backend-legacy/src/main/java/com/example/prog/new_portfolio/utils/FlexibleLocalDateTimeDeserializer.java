package com.example.prog.new_portfolio.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class FlexibleLocalDateTimeDeserializer
        extends JsonDeserializer<LocalDateTime> {

    private static final DateTimeFormatter[] SUPPORTED_FORMATS = {
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"),
            DateTimeFormatter.ISO_LOCAL_DATE_TIME,      // 2023-05-02T12:08:27
            DateTimeFormatter.ISO_OFFSET_DATE_TIME,     // 2023-05-02T12:08:27+05:30
            DateTimeFormatter.ISO_INSTANT               // 2023-05-02T12:08:27Z
    };

    private static final DateTimeFormatter DATE_ONLY =
            DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public LocalDateTime deserialize(JsonParser p,
                                     DeserializationContext ctxt)
            throws IOException {

        String value = p.getText();

        if (value == null) {
            return null;
        }

        value = value.trim();

        if (value.isEmpty()) {
            return null;
        }

        // 1️⃣ Try full datetime formats
        for (DateTimeFormatter formatter : SUPPORTED_FORMATS) {
            try {
                if (formatter == DateTimeFormatter.ISO_INSTANT) {
                    return LocalDateTime.ofInstant(
                            Instant.parse(value),
                            ZoneId.systemDefault()
                    );
                }

                if (formatter == DateTimeFormatter.ISO_OFFSET_DATE_TIME) {
                    return OffsetDateTime.parse(value, formatter)
                            .toLocalDateTime();
                }

                return LocalDateTime.parse(value, formatter);

            } catch (DateTimeParseException ignored) {
            }
        }

        // 2️⃣ Try date-only format
        try {
            LocalDate date = LocalDate.parse(value, DATE_ONLY);
            return date.atStartOfDay(); // ONLY when time is missing
        } catch (DateTimeParseException e) {
            throw new RuntimeException(
                    "Unsupported Trade_execution_time format: " + value, e
            );
        }
    }
}
