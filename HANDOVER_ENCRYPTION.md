# 🔐 Portfolio Secure Encryption: Developer Handover Guide

This document describes the **Hybrid Encryption (AES + RSA)** implementation used for end-to-end data security.

## 🏗 High-Level Architecture
The system ensures that sensitive data is encrypted before leaving the browser. For enhanced security, the **RSA Public Key is hidden** from the client side and managed exclusively by the backend services.

### Data Flow Diagram
```
[ Browser ] 
     |
     | (AES Key + AES-Encrypted Data)
     ▼
[ Java Backend (Spring Boot) ] 
     | 
     | 1. Fetches RSA Public Key (Nodeservice internal)
     | 2. RSA-Encrypts the AES Key
     | 3. Proxies (RSA-Encrypted Key + AES-Encrypted Data)
     ▼
[ Node.js Security Service ]
     |
     | 1. Decrypts RSA Key using Private Key
     | 2. Decrypts AES Data using recovered Key
     | 3. Forwards Plaintext
     ▼
[ Python Analytics Engine ]
```

---

## 💻 1. Frontend Developer (React/JS)
**Files:** `src/utils/EncryptionService.js`, `src/utils/portfolioApi.js`, `useSecureUpload.js`

### Responsibilities:
-   **AES Key Generation**: Every upload/analysis generates a new 256-bit AES-GCM session key.
-   **Client-Side Encryption**: Use `window.crypto.subtle` to encrypt files (normalization) or JSON data (analysis) BEFORE sending.
-   **Session Key Export**: Export the `CryptoKey` to raw bytes and Base64 encode it.
-   **Payload Construction**: 
    -   **DO NOT** fetch any public key.
    -   Send the raw Base64 AES session key in the `encryptedKey` field. 
    -   Send the AES-encrypted data in `file` (as blob) or `encryptedData` (as base64).
    -   Send the 12-byte `iv`.

---

## ☕ 2. Java Backend Developer (Spring Boot)
**Files:** `SecurePortfolioService.java`, `SecurePortfolioController.java`, `MyConfig.java`

### Responsibilities:
-   **Key Shielding**: The `/api/portfolio/public-key` endpoint is commented out and disabled in security config to prevent client exposure.
-   **RSA Encryption**: 
    -   Internal call to Node.js `http://localhost:3001/public-key`.
    -   Algorithm: `RSA/ECB/OAEPWithSHA-256AndMGF1Padding`.
    -   Parameters: SHA-256 for both OAEP hash and MGF1 hash.
-   **Internal Proxy**: Acts as the bridge between the untrusted frontend and the trusted security service. It "upgrades" the security of the request by wrapping the session key in RSA before it traverses any internal network paths.

---

## 🟢 3. Node.js Security Service Developer (Express)
**Files:** `node_security_service/app.js`, `cryptoUtils.js`

### Responsibilities:
-   **The Vault**: This is the ONLY service that should ever see the RSA Private Key.
-   **RSA Decryption**: Decrypts the coming AES key from Java.
-   **AES Decryption**: Decrypts the actual data.
-   **Inter-Service Communication**: Forwards raw data to Python (`localhost:8000`) and receives the response.
-   **AES Response Encryption**: Uses the *same* AES session key to encrypt the final response so the browser can read it.

---

## 🐍 4. Python Developer (FastAPI)
**Files:** `python/portfolio--main/backend/app.py`

### Responsibilities:
-   **Pure Logic**: This service performs the heavy lifting (financial math, normalization).
-   **Data Security**: Always assumes the incoming data is plaintext. 
-   **Constraint**: This service must NOT be exposed to the public internet. Access should be restricted to the Node.js service IP.

---

## 🛠 Technical Specifications
| Feature | Implementation |
| :--- | :--- |
| **Symmetric Encryption** | AES-256-GCM |
| **Asymmetric Encryption** | RSA-2048 |
| **RSA Padding** | OAEP with MGF1 (SHA-256) |
| **Integrity Check** | GCM Auth Tag (128-bit) |
| **IV Length** | 96-bit (12 bytes) |

---

## 🚀 Setup & Execution
1.  **Node Service**: `npm start` (Port 3001) - Generates `rsa_keys.json`.
2.  **Python Engine**: `uvicorn app:app` (Port 8000).
3.  **Java Backend**: `mvn spring-boot:run` (Port 8080).
4.  **Frontend**: `npm run dev`.

---
