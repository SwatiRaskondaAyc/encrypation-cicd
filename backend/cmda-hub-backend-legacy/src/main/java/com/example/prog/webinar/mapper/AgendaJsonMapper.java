package com.example.prog.webinar.mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AgendaJsonMapper {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String toJson(List<String> agenda) {
        try {
            return agenda == null ? null : objectMapper.writeValueAsString(agenda);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert agenda to JSON", e);
        }
    }

    public List<String> fromJson(String agendaJson) {
        try {
            return agendaJson == null
                    ? List.of()
                    : objectMapper.readValue(
                    agendaJson,
                    new TypeReference<List<String>>() {}
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse agenda JSON", e);
        }
    }
}

