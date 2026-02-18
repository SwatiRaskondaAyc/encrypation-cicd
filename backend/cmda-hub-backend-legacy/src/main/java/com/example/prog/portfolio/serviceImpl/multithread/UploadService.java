package com.example.prog.portfolio.serviceImpl.multithread;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.prog.portfolio.serviceImpl.FileProcessingService;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

// @Service
// public class UploadService {

//     @Autowired
//     private FileProcessingService fileProcessingService;

//     @Autowired
//     private SimpMessagingTemplate messagingTemplate;

//     public void handleUpload(MultipartFile file, String platform, String uploadId, int userId, boolean isCorporate, Map<String, String> customMapping, List<Map<String, Object>> mappedData ) {
//         messagingTemplate.convertAndSend("/topic/upload-status/" + uploadId, "Upload started...");

//         fileProcessingService.performColumnMappingAsync(file, platform, uploadId, userId, isCorporate, customMapping )
//             .thenCompose(result -> {
//                 messagingTemplate.convertAndSend("/topic/upload-status/" + uploadId, "Column mapping completed...");
//                 String mappedFile = (String) result.get("mappedFile");
//                 return fileProcessingService.processFileAsync(mappedFile, platform, uploadId, userId, isCorporate, true);
//             })
//             .thenCompose(result -> {
//                 messagingTemplate.convertAndSend("/topic/upload-status/" + uploadId, "File processed...");
//                 String processedFilePath = (String) result.get("processedFilePath");
//                 Path path = Path.of(processedFilePath);
//                 return fileProcessingService.createTableFromCsvAsync(path, platform, userId, isCorporate,mappedData );
//             })
//             .thenAccept(tableName -> {
//                 messagingTemplate.convertAndSend("/topic/upload-status/" + uploadId, "Table created: " + tableName);
//             })
//             .exceptionally(ex -> {
//                 messagingTemplate.convertAndSend("/topic/upload-status/" + uploadId, "Error: " + ex.getMessage());
//                 return null;
//             });
//     }
// }


@Service
public class UploadService {

    @Autowired
    private FileProcessingService fileProcessingService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void handleUpload(MultipartFile file, String platform, String uploadId, int userId, boolean isCorporate, Map<String, String> customMapping, List<Map<String, Object>> mappedData, boolean savedata ) {
        messagingTemplate.convertAndSend("/topic/upload-status/" + uploadId, "Upload started...");

        fileProcessingService.performColumnMappingAsync(file, platform, uploadId, userId, isCorporate, customMapping, savedata )
            .thenCompose(result -> {
                messagingTemplate.convertAndSend("/topic/upload-status/" + uploadId, "Column mapping completed...");
                String mappedFile = (String) result.get("mappedFile");
                return fileProcessingService.processFileAsync(mappedFile, platform, uploadId, userId, isCorporate, true);
            })
            .thenCompose(result -> {
                messagingTemplate.convertAndSend("/topic/upload-status/" + uploadId, "File processed...");
                String processedFilePath = (String) result.get("processedFilePath");
                Path path = Path.of(processedFilePath);
                return fileProcessingService.createTableFromCsvAsync(path, platform, userId, isCorporate,mappedData );
            })
            .thenAccept(tableName -> {
                messagingTemplate.convertAndSend("/topic/upload-status/" + uploadId, "Table created: " + tableName);
            })
            .exceptionally(ex -> {
                messagingTemplate.convertAndSend("/topic/upload-status/" + uploadId, "Error: " + ex.getMessage());
                return null;
            });
    }
}