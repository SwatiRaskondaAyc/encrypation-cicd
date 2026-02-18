package com.example.prog.token;

public class DuplicateFileUploadException extends RuntimeException {
    public DuplicateFileUploadException(String message) {
        super(message);
    }
}