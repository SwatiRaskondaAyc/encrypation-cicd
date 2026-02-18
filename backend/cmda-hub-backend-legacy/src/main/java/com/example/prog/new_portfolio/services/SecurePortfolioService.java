package com.example.prog.new_portfolio.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.core.io.ByteArrayResource;

import javax.crypto.Cipher;
import javax.crypto.spec.OAEPParameterSpec;
import javax.crypto.spec.PSource;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.MGF1ParameterSpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Map;
import java.util.HashMap;

@Service
public class SecurePortfolioService {

    private final RestTemplate restTemplate;
    
    // Node.js Security Service URL
    private final String NODE_SERVICE_URL = "http://localhost:3001"; 

    public SecurePortfolioService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getPublicKey() {
        String url = NODE_SERVICE_URL + "/public-key";
        return restTemplate.getForObject(url, String.class);
    }

    private String encryptSessionKey(String plainSessionKeyBase64) {
        try {
            String publicKeyPem = getPublicKey();
            String publicKeyRaw = publicKeyPem
                    .replace("-----BEGIN PUBLIC KEY-----", "")
                    .replace("-----END PUBLIC KEY-----", "")
                    .replaceAll("\\s", "");
            
            byte[] keyBytes = Base64.getDecoder().decode(publicKeyRaw);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            PublicKey publicKey = kf.generatePublic(spec);

            Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
            OAEPParameterSpec oaepParams = new OAEPParameterSpec(
                    "SHA-256", "MGF1", MGF1ParameterSpec.SHA256, PSource.PSpecified.DEFAULT);
            cipher.init(Cipher.ENCRYPT_MODE, publicKey, oaepParams);

            byte[] sessionKeyBytes = Base64.getDecoder().decode(plainSessionKeyBase64);
            byte[] encryptedKey = cipher.doFinal(sessionKeyBytes);
            
            return Base64.getEncoder().encodeToString(encryptedKey);
        } catch (Exception e) {
            throw new RuntimeException("Failed to RSA encrypt session key: " + e.getMessage(), e);
        }
    }

    public String secureNormalize(MultipartFile file, String plainSessionKey, String iv, String portfolioId, String brokerId) {
        String url = NODE_SERVICE_URL + "/normalize";

        try {
            // RSA Encrypt the session key on backend
            String encryptedKey = encryptSessionKey(plainSessionKey);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            
            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            
            body.add("file", fileResource);
            body.add("encryptedKey", encryptedKey);
            body.add("iv", iv);
            if (portfolioId != null) body.add("portfolioId", portfolioId);
            if (brokerId != null) body.add("brokerId", brokerId);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
            return response.getBody();

        } catch (Exception e) {
            throw new RuntimeException("Error during normalization proxy: " + e.getMessage(), e);
        }
    }

    public String secureAnalyzeJson(String encryptedData, String plainSessionKey, String iv) {
        String url = NODE_SERVICE_URL + "/analyze-json";

        try {
            // RSA Encrypt the session key on backend
            String encryptedKey = encryptSessionKey(plainSessionKey);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = new HashMap<>();
            body.put("encryptedData", encryptedData);
            body.put("encryptedKey", encryptedKey);
            body.put("iv", iv);

            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
            return response.getBody();

        } catch (Exception e) {
            throw new RuntimeException("Error during analysis proxy: " + e.getMessage(), e);
        }
    }
}
