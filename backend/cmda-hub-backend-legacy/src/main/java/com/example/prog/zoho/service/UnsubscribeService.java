
package com.example.prog.zoho.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.prog.entity.UserDtls;
import com.example.prog.repository.UserRepository;

@Service
public class UnsubscribeService {
    
    @Autowired
    private UserRepository userRepository;
    
    // In-memory storage for tokens (you can use Redis in production)
    private final Map<String, String> unsubscribeTokens = new ConcurrentHashMap<>();
    
    public boolean isSubscribed(String email) {
        Optional<UserDtls> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            UserDtls user = userOptional.get();
            // Check if subscription is 1 (subscribed) or 0 (unsubscribed)
            return user.getSubscription() != null && user.getSubscription() == 1;
        }
        return false;
    }
    
    @Transactional
    public void unsubscribe(String email) {
        Optional<UserDtls> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            UserDtls user = userOptional.get();
            user.setSubscription(0); // Set subscription to 0 (unsubscribed)
            userRepository.save(user);
            System.out.println("✅ User unsubscribed: " + email);
        } else {
            System.out.println("⚠️ User not found for unsubscribe: " + email);
        }
    }
    
    @Transactional
    public void subscribe(String email) {
        Optional<UserDtls> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            UserDtls user = userOptional.get();
            user.setSubscription(1); // Set subscription to 1 (subscribed)
            userRepository.save(user);
            System.out.println("✅ User subscribed: " + email);
        } else {
            System.out.println("⚠️ User not found for subscribe: " + email);
        }
    }
    
    public String generateUnsubscribeToken(String email) {
        String token = UUID.randomUUID().toString();
        unsubscribeTokens.put(token, email.toLowerCase());
        return token;
    }
    
    public boolean validateAndUnsubscribe(String token, String email) {
        String storedEmail = unsubscribeTokens.get(token);
        if (storedEmail != null && storedEmail.equals(email.toLowerCase())) {
            unsubscribe(email);
            unsubscribeTokens.remove(token);
            return true;
        }
        return false;
    }
    
   

     public List<SubscriberInfo> getActiveSubscribers() {
        // Fetch all users from database and filter those with subscription = 1
        // Optional<UserDtls> allUsers = userRepository.findByEmail("digambarchalkapure@gmail.com");
        List<UserDtls> allUsers = userRepository.findAll();
        
        return allUsers.stream()
                .filter(user -> user.getSubscription() != null && user.getSubscription() == 1)
                .filter(user -> user.getEmail() != null && !user.getEmail().trim().isEmpty())
                .map(user -> new SubscriberInfo(
                     user.getEmail(), 
                    user.getFullname() != null ? user.getFullname() : "User" // Default name if null
                ))
                .collect(Collectors.toList());
    }
    
    
    
    // Optional: Get subscriber count for logging
    public long getActiveSubscriberCount() {
        return getActiveSubscribers().size();
    }
    
    // Optional: Check if user exists
    public boolean userExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    // DTO class for subscriber information
    public static class SubscriberInfo {
        private String email;
        private String name;
        
        public SubscriberInfo(String email, String name) {
            this.email = email;
            this.name = name;
        }
        
        // getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}

