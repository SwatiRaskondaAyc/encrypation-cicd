package com.example.prog.service.multithread;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendUploadStatus(int userId, String message) {
        messagingTemplate.convertAndSend("/topic/status/" + userId, message);
    }
}
