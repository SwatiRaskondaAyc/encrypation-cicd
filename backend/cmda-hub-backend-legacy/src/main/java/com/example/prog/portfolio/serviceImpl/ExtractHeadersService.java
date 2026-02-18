//before code 
// package com.example.prog.portfolio.serviceImpl;

// import java.io.BufferedReader;
// import java.io.IOException;
// import java.io.InputStreamReader;
// import java.util.ArrayList;
// import java.util.Arrays;
// import java.util.List;

// import org.apache.poi.ss.usermodel.Cell;
// import org.apache.poi.ss.usermodel.Row;
// import org.apache.poi.ss.usermodel.Sheet;
// import org.apache.poi.ss.usermodel.Workbook;
// import org.apache.poi.ss.usermodel.WorkbookFactory;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;
// import org.slf4j.Logger; // Add this import
// import org.slf4j.LoggerFactory;



// @Service
// public class ExtractHeadersService {
	
// 	public List<String> extractCsvHeaders(MultipartFile file) throws IOException {
// 	    try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
// 	        String line = reader.readLine();
// 	        return line != null ? Arrays.asList(line.split(",")) : List.of();
// 	    }
// 	}

// 	public List<String> extractTxtHeaders(MultipartFile file) throws IOException {
// 	    return extractCsvHeaders(file); // Assuming it's comma/tab-separated like CSV
// 	}

// 	public List<String> extractExcelHeaders(MultipartFile file) throws IOException {
// 	    List<String> headers = new ArrayList<>();
// 	    try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
// 	        Sheet sheet = workbook.getSheetAt(0);
// 	        Row row = sheet.getRow(0); // header row
// 	        if (row != null) {
// 	            for (Cell cell : row) {
// 	                headers.add(cell.getStringCellValue());
// 	            }
// 	        }
// 	    }
// 	    return headers;
// 	}

// }




package com.example.prog.portfolio.serviceImpl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.slf4j.Logger; // Add this import
import org.slf4j.LoggerFactory; // Add this import
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ExtractHeadersService {
    private static final Logger logger = LoggerFactory.getLogger(ExtractHeadersService.class);

    public List<String> extractCsvHeaders(MultipartFile file) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line = reader.readLine();
            if (line == null || line.trim().isEmpty()) {
                logger.warn("CSV file is empty or has no headers: {}", file.getOriginalFilename());
                throw new IllegalArgumentException("CSV file is empty or has no headers.");
            }
            return Arrays.stream(line.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }
    }

    public List<String> extractTxtHeaders(MultipartFile file) throws IOException {
        return extractCsvHeaders(file); // Assuming comma/tab-separated like CSV
    }

    public List<String> extractExcelHeaders(MultipartFile file) throws IOException {
        List<String> headers = new ArrayList<>();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null) {
                logger.warn("No sheet found in Excel file: {}", file.getOriginalFilename());
                throw new IllegalArgumentException("No sheet found in Excel file.");
            }
            Row row = sheet.getRow(0); // header row
            if (row == null) {
                logger.warn("No header row found in Excel file: {}", file.getOriginalFilename());
                throw new IllegalArgumentException("No header row found in Excel file.");
            }
            for (Cell cell : row) {
                String header = cell.getStringCellValue() != null ? cell.getStringCellValue().trim() : "";
                if (!header.isEmpty()) {
                    headers.add(header);
                }
            }
            if (headers.isEmpty()) {
                logger.warn("No valid headers found in Excel file: {}", file.getOriginalFilename());
                throw new IllegalArgumentException("No valid headers found in Excel file.");
            }
        }
        return headers;
    }
}