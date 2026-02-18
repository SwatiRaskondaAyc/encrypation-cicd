package com.example.prog.zoho.serviceImpl;

import com.example.prog.entity.ZohoUser;
import com.example.prog.zoho.repository.ZohoUserRepo;
import com.example.prog.zoho.service.ZohoUserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ZohoUserServiceImpl implements ZohoUserService {

    private static final Logger logger = LoggerFactory.getLogger(ZohoUserServiceImpl.class);

    @Value("${zoho.client.id}")
    private String clientId;

    @Value("${zoho.client.secret}")
    private String clientSecret;

    @Value("${zoho.redirect.uri}")
    private String loginRedirectUri;

    @Value("${zoho.auth.url}")
    private String zohoAuthUrl;

    @Value("${zoho.token.url}")
    private String zohoTokenUrl;

    @Value("${zoho.api.url}")
    private String zohoApiUrl;

    @Autowired
    private ZohoUserRepo zohoUserRepository;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ZohoUserServiceImpl() {
        this.objectMapper = new ObjectMapper();
        this.restTemplate = new RestTemplate();
    }

    @Override
    public String getZohoLoginUrl() {
        String url = zohoAuthUrl + "?response_type=code" +
                "&client_id=" + clientId +
                "&redirect_uri=" + loginRedirectUri +
                "&scope=ZohoMail.organization.accounts.READ" +
                "&access_type=offline&prompt=consent";
        logger.debug("Generated Zoho login URL: {}", url);
        return url;
    }

    @Override
    public ZohoUser getAccessToken(String authCode) throws IOException, InterruptedException {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);
            body.add("redirect_uri", loginRedirectUri);
            body.add("code", authCode);
            body.add("grant_type", "authorization_code");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(zohoTokenUrl, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                String accessToken = jsonNode.has("access_token") ? jsonNode.get("access_token").asText() : null;
                String refreshToken = jsonNode.has("refresh_token") ? jsonNode.get("refresh_token").asText() : null;

                if (accessToken != null) {
                    ZohoUser user = new ZohoUser();
                    user.setZohoAccessToken(accessToken);
                    user.setRefreshToken(refreshToken);
                    return user;
                } else {
                    throw new RuntimeException("Zoho Error: " + jsonNode.toString());
                }
            } else {
                throw new RuntimeException("Failed to retrieve access token. Status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error("Error getting access token: {}", e.getMessage());
            throw new RuntimeException("Error getting access token: " + e.getMessage());
        }
    }

    @Override
    public String getEmployeeData(String accessToken) throws IOException, InterruptedException {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(zohoApiUrl, HttpMethod.GET, entity, String.class);

            logger.debug("Zoho API Response: {}", response.getBody());
            return response.getBody();
        } catch (Exception e) {
            logger.error("Exception occurred while calling Zoho API", e);
            return null;
        }
    }

    @Override
    public String extractEmailFromZohoResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            String email = jsonNode.get("data").get(0).get("primaryEmailAddress").asText();
            logger.debug("Extracted email: {}", email);
            return email;
        } catch (Exception e) {
            logger.error("Failed to extract email from response: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public String extractAccountIdFromZohoResponse(String response) throws JSONException {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            String accountId = jsonNode.get("data").get(0).get("accountId").asText();
            logger.debug("Extracted account ID: {}", accountId);
            return accountId;
        } catch (Exception e) {
            logger.error("Failed to extract account ID: {}", e.getMessage());
            throw new JSONException("Failed to extract account ID: " + e.getMessage());
        }
    }

    @Override
    public ZohoUser findByUserName(String userName) {
        if (userName == null || userName.trim().isEmpty()) {
            logger.warn("Invalid username provided for lookup");
            return null;
        }
        return zohoUserRepository.findByUserName(userName);
    }

    @Override
    public ZohoUser findByEmpId(String empId) {
        if (empId == null || empId.trim().isEmpty()) {
            logger.warn("Invalid employee ID provided for lookup");
            return null;
        }
        return zohoUserRepository.findByEmpId(empId);
    }

    @Override
    public boolean existsByMailId(String mailId) {
        if (mailId == null || mailId.trim().isEmpty()) {
            logger.warn("Invalid mailId provided for existence check");
            return false;
        }
        return zohoUserRepository.existsByMailId(mailId);
    }

    @Override
    public ZohoUser findByMailId(String mailId) {
        if (mailId == null || mailId.trim().isEmpty()) {
            logger.warn("Invalid mailId provided for lookup");
            return null;
        }
        return zohoUserRepository.findByMailId(mailId);
    }

    @Override
    public void save(ZohoUser user) {
        zohoUserRepository.save(user);
    }

    @Override
    public List<ZohoUserDTO> getAllEmployees() {
        List<ZohoUser> users = zohoUserRepository.findAll();
        return users.stream().map(user -> new ZohoUserDTO(
                user.getId(),
                user.getEmpId(),
                user.getFirstName(),
                user.getLastName(),
                user.getMailId(),
                user.getJobPosition(),
                user.getRole(),
                user.getPermission(),
                user.getDateOfJoining(),
                user.getLastLoginDate()
        )).collect(Collectors.toList());
    }

    @Override
    public ZohoUserDTO updatePermission(String empId, String permission) {
        ZohoUser user = zohoUserRepository.findByEmpId(empId);
        if (user == null) {
            throw new RuntimeException("Employee with ID " + empId + " not found.");
        }

        user.setPermission(permission);
        user.setUpdatedAt(LocalDateTime.now());
        zohoUserRepository.save(user);

        return new ZohoUserDTO(
                user.getId(),
                user.getEmpId(),
                user.getFirstName(),
                user.getLastName(),
                user.getMailId(),
                user.getJobPosition(),
                user.getRole(),
                user.getPermission(),
                user.getDateOfJoining(),
                user.getLastLoginDate()
        );
    }

    @Override
    public List<ZohoUserDTO> getEmployeesByPermission(String permission) {
        // TODO: Implement actual logic
        return null;
    }

    @Override
    public List<ZohoUserDTO> getEmployeesByRole(String role) {
        // TODO: Implement actual logic
        return null;
    }

    @Override
    public List<ZohoUserDTO> searchEmployeesByName(String name) {
        // TODO: Implement actual logic
        return null;
    }

    @Override
    public long countEmployeesByPermission(String permission) {
        // TODO: Implement actual logic
        return 0;
    }

    @Override
    public List<ZohoUserDTO> getEmployeesByJoinDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        // TODO: Implement actual logic
        return null;
    }
}
