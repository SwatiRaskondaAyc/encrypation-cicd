package com.example.prog.zoho.repository;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.apache.commons.text.StringEscapeUtils;

@Converter(autoApply = true)
public class EmojiSafeConverter implements AttributeConverter<String, String> {

    @Override
    public String convertToDatabaseColumn(String attribute) {
        return attribute == null ? null : StringEscapeUtils.escapeJava(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        return dbData == null ? null : StringEscapeUtils.unescapeJava(dbData);
    }
}

