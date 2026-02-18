# 🔐 Portfolio Encryption — Complete Technical Documentation

**Version:** 2.0 (Two-Step: Normalize + Analyze)  
**Last Updated:** February 13, 2026  
**Author:** CMDA Hub Development Team

---

## 📑 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Encryption Algorithms & Standards](#3-encryption-algorithms--standards)
4. [System Components](#4-system-components)
5. [Key Management](#5-key-management)
6. [Flow 1: Secure Normalization (File Upload)](#6-flow-1-secure-normalization-file-upload)
7. [Flow 2: Secure Analysis (JSON Data)](#7-flow-2-secure-analysis-json-data)
8. [Detailed Code Walkthrough](#8-detailed-code-walkthrough)
9. [Data Format Reference](#9-data-format-reference)
10. [Security Considerations](#10-security-considerations)
11. [Troubleshooting Guide](#11-troubleshooting-guide)
12. [File Reference Map](#12-file-reference-map)

---

## 1. Executive Summary

**No intermediate server (Java Backend) can read the plaintext data.** While the Java backend now handles the RSA-wrapping of the AES key to keep the Public Key hidden from the client, it still cannot decrypt the data payload as it lacks the RSA Private Key. The Java backend acts as an **intelligence proxy**.

### Why Hybrid Encryption?

| Approach | Problem |
|----------|---------|
| RSA only | Too slow for large files; RSA can only encrypt data smaller than the key size (~245 bytes for 2048-bit) |
| AES only | No way to securely share the AES key between browser and server |
| **Hybrid (RSA + AES)** | **AES encrypts the data (fast, unlimited size). RSA encrypts the AES key (small, secure key exchange).** ✅ |

### Two-Step Architecture

The system operates in **two distinct phases**:

```
┌──────────────────┐     ┌──────────────────┐
│  STEP 1:         │     │  STEP 2:         │
│  NORMALIZATION   │ ──► │  ANALYSIS        │
│                  │     │                  │
│  Upload file     │     │  Analyze the     │
│  Decrypt & parse │     │  normalized data │
│  Return JSON     │     │  Return results  │
└──────────────────┘     └──────────────────┘
```

- **Step 1 (Normalize):** User uploads an encrypted file → Node.js decrypts it → Python normalizes the raw broker file → encrypted normalized JSON is returned to the browser.
- **Step 2 (Analyze):** User clicks "Analyze Portfolio" → the normalized JSON is re-encrypted and sent → Node.js decrypts it → Python performs full analysis → encrypted analysis results are returned.

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                                │
│                                                                      │
│  ┌────────────────────┐    ┌─────────────────────┐                   │
│  │  EncryptionService  │    │  portfolioApi.js     │                   │
│  │  • generateSessionKey│    │  • uploadSecureNorm  │                   │
│  │  • encryptFile       │    │  • analyzeSecure     │                   │
│  │  • encryptSessionKey │    │                     │                   │
│  │  • decryptData       │    │                     │                   │
│  └────────┬────────────┘    └─────────┬───────────┘                   │
│           │                           │                               │
│  ┌────────┴───────────────────────────┴───────────┐                   │
│  │           useSecureUpload Hook                  │                   │
│  │  • normalizePortfolio() → calls uploadSecureNorm│                   │
│  │  • runSecureAnalysis()  → calls analyzeSecure   │                   │
│  └────────────────────────┬───────────────────────┘                   │
│                           │                                           │
│  ┌────────────────────────┴───────────────────────┐                   │
│  │           PortLandPage.jsx (UI)                 │                   │
│  │  • handleUploadChoice() → Step 1                │                   │
│  │  • handleAnalyzeFiltered() → Step 2             │                   │
│  └─────────────────────────────────────────────────┘                   │
└──────────────┬───────────────────────────────────────────────────────┘
               │ HTTPS (Encrypted Payloads)
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                JAVA BACKEND (Spring Boot) — Port 8080                │
│                                                                      │
│  ┌─────────────────────────────────────┐                             │
│  │  SecurePortfolioController.java      │                             │
│  │  POST /api/portfolio/secure-normalize│  ← Receives AES-enc data + key
│  │  POST /api/portfolio/secure-analyze  │  ← Receives AES-enc JSON + key
│  └──────────────────┬──────────────────┘                             │
│                     │                                                │
│  ┌──────────────────┴──────────────────┐                             │
│  │  SecurePortfolioService.java         │                             │
│  │  • getPublicKey()                    │  ← Internal call to Node     │
│  │  • encryptSessionKey()               │  ← RSA-Encrypts AES Key ✅   │
│  │  • secureNormalize()                 │  ← Proxy to Node.js          │
│  │  • secureAnalyzeJson()               │  ← Proxy to Node.js          │
│  └──────────────────┬──────────────────┘                             │
│                     │ ⚠️ CANNOT DECRYPT PAYLOAD — Just wraps the key      │
└──────────────┬──────────────────────────────────────────────────────┘
               │ HTTP (Internal Network)
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│           NODE.JS SECURITY SERVICE — Port 3001                       │
│                                                                      │
│  ┌─────────────────────────────────────┐                             │
│  │  app.js                              │                             │
│  │  GET  /public-key                    │  ← Serves RSA public key   │
│  │  POST /normalize                     │  ← Decrypt file + normalize│
│  │  POST /analyze-json                  │  ← Decrypt JSON + analyze  │
│  └──────────────────┬──────────────────┘                             │
│                     │                                                │
│  ┌──────────────────┴──────────────────┐                             │
│  │  cryptoUtils.js                      │                             │
│  │  • generateRSAKeyPair()              │  ← One-time key generation │
│  │  • decryptSessionKey()               │  ← RSA-OAEP decrypt        │
│  │  • decryptFile()                     │  ← AES-256-GCM decrypt     │
│  │  • encryptData()                     │  ← AES-256-GCM encrypt     │
│  └──────────────────┬──────────────────┘                             │
│               🔑 HOLDS PRIVATE KEY — Only service that can decrypt    │
└──────────────┬──────────────────────────────────────────────────────┘
               │ HTTP (Internal Network)
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│           PYTHON ANALYTICS ENGINE (FastAPI) — Port 8000              │
│                                                                      │
│  ┌─────────────────────────────────────┐                             │
│  │  app.py                              │                             │
│  │  POST /api/normalize-portfolio       │  ← Parse & normalize file  │
│  │  POST /api/portfolio-analysis        │  ← Full financial analysis │
│  └─────────────────────────────────────┘                             │
│  ⚠️ Receives PLAINTEXT — Must be on same server / internal network   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Encryption Algorithms & Standards

### 3.1 AES-256-GCM (Symmetric Encryption)

| Property | Value |
|----------|-------|
| **Algorithm** | AES (Advanced Encryption Standard) |
| **Mode** | GCM (Galois/Counter Mode) |
| **Key Size** | 256 bits |
| **IV Size** | 96 bits (12 bytes) |
| **Auth Tag Size** | 128 bits (16 bytes) |
| **Purpose** | Encrypt/decrypt file data and JSON payloads |

**Why GCM?** GCM provides both **confidentiality** (encryption) and **integrity** (authentication tag). If anyone tampers with the ciphertext, decryption will fail — providing tamper detection.

### 3.2 RSA-OAEP (Asymmetric Encryption)

| Property | Value |
|----------|-------|
| **Algorithm** | RSA (Rivest–Shamir–Adleman) |
| **Padding** | OAEP (Optimal Asymmetric Encryption Padding) |
| **Hash** | SHA-256 |
| **Key Size** | 2048 bits |
| **Key Format** | Public: SPKI/PEM, Private: PKCS8/PEM |
| **Purpose** | Securely transport the AES session key |

### 3.3 Web Crypto API (Browser-Side)

The browser uses the **W3C Web Crypto API** (`window.crypto.subtle`) for all cryptographic operations. This is a hardware-accelerated, native browser API — no third-party libraries needed.

### 3.4 Node.js `crypto` Module (Server-Side)

The Node.js security service uses the built-in `crypto` module (backed by OpenSSL) for RSA decryption, AES-GCM decryption, and AES-GCM encryption.

---

## 4. System Components

### 4.1 Frontend (React)

| File | Purpose |
|------|---------|
| `EncryptionService.js` | Core crypto functions: key generation, encrypt/decrypt |
| `portfolioApi.js` | API client: `uploadSecureNormalize()`, `analyzeSecurePortfolio()` |
| `useSecureUpload.js` | React hook: orchestrates the two-step process |
| `PortLandPage.jsx` | UI component: handles user interactions |

### 4.2 Java Backend (Spring Boot)

| File | Purpose |
|------|---------|
| `SecurePortfolioController.java` | REST endpoints: `/public-key`, `/secure-normalize`, `/secure-analyze` |
| `SecurePortfolioService.java` | Service layer: proxies requests to Node.js |

### 4.3 Node.js Security Service (Express)

| File | Purpose |
|------|---------|
| `app.js` | Express server: `/public-key`, `/normalize`, `/analyze-json` |
| `cryptoUtils.js` | Crypto utilities: RSA key gen, AES encrypt/decrypt |
| `rsa_keys.json` | Persisted RSA key pair (auto-generated on first run) |

### 4.4 Python Analytics Engine (FastAPI)

| File | Purpose |
|------|---------|
| `app.py` | FastAPI server: `/api/normalize-portfolio`, `/api/portfolio-analysis` |
| `orchestrator.py` | Business logic: file parsing, normalization, analysis |

---

## 5. Key Management

### 5.1 RSA Key Pair Lifecycle

```
FIRST START:
┌────────────────────┐
│ Node.js starts     │
│                    │
│ Does rsa_keys.json │──── NO ───► Generate new RSA-2048 key pair
│ exist?             │              └── Save to rsa_keys.json
│                    │
│        YES         │
│         │          │
│  Load from file    │
└────────────────────┘
```

**Key File Location:** `node_security_service/rsa_keys.json`

```json
{
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqh...\n-----END PUBLIC KEY-----",
  "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----"
}
```

**Important:**
- The **private key** NEVER leaves the Node.js service.
- The **public key** is served to the frontend via the `/public-key` endpoint.
- Keys are **persisted** across restarts (loaded from `rsa_keys.json`).
- To rotate keys, delete `rsa_keys.json` and restart the Node.js service.

### 5.2 AES Session Key Lifecycle

```
PER-REQUEST:
┌─────────────────────────────────────────────────────────────────┐
│ Browser generates AES-256 key  ──► Used to encrypt data         │
│ Browser sends Plain AES key + Ciphertext to Java                │
│                                                                 │
│ Java fetches RSA Public Key from Node.js Service                │
│ Java encrypts AES key with RSA                                  │
│                                                                 │
│ Node.js decrypts AES key with RSA Private Key                   │
│ Node.js uses AES key to decrypt data                            │
│ Node.js uses SAME AES key to encrypt the response               │
│                                                                 │
│ Browser uses original AES key to decrypt the response           │
│ Session key is stored in React state for the Analysis step      │
└─────────────────────────────────────────────────────────────────┘
```

**Session Key Reuse:** The session key generated during normalization is **stored in React state** (`currentSessionKey`) and can be reused for the analysis step. If it's unavailable (e.g., loaded from a saved portfolio), a **fresh session key** is generated automatically.

---

## 6. Flow 1: Secure Normalization (File Upload)

This flow handles the initial file upload, where the user's broker CSV/Excel file is encrypted, sent to the server, decrypted, normalized into a standard JSON format, then encrypted and returned.

### 6.1 Sequence Diagram

```
  Browser                    Java Backend              Node.js               Python
    │                           │                        │                      │
    │  1. Generate AES-256 key  │                        │                      │
    │  2. Encrypt file with AES │                        │                      │
    │  3. POST /secure-normalize│                        │                      │
    │     [encrypted file]      │                        │                      │
    │     [plain AES key]       │                        │                      │
    │     [IV]                  │                        │                      │
    │ ─────────────────────────►│  4. GET /public-key    │                      │
    │                           │ ─────────────────────►│                      │
    │                           │ ◄─────────────────────│                      │
    │                           │                        │                      │
    │                           │  5. RSA-Encrypt AES key│                      │
    │                           │                        │                      │
    │                           │  6. POST /normalize    │                      │
    │                           │     [encrypted file]  │                      │
    │                           │     [RSA-enc AES key] │                      │
    │                           │ ─────────────────────►│                      │
    │                           │                        │                      │
    │                           │                        │  7. Decrypt AES key  │
    │                           │                        │     (RSA Private Key)│
    │                           │                        │                      │
    │                           │                        │  8. Decrypt file     │
    │                           │                        │     (AES-256-GCM)    │
    │                           │                        │                      │
    │                           │                        │  9. POST /normalize  │
    │                           │                        │     [plaintext file] │
    │                           │                        │─────────────────────►│
    │                           │                        │                      │
    │                           │                        │  10. Normalized JSON │
    │                           │                        │◄─────────────────────│
    │                           │                        │                      │
    │                           │                        │  11. Encrypt response│
    │                           │                        │      (AES-256-GCM)  │
    │                           │                        │                      │
    │                           │◄───────────────────────│  {encryptedData, iv} │
    │◄──────────────────────────│  Proxy response        │                      │
    │                           │                        │                      │
    │  12. Decrypt response     │                        │                      │
    │      (AES-256-GCM)        │                        │                      │
    │                           │                        │                      │
    │  13. Store sessionKey     │                        │                      │
    │      in React state       │                        │                      │
```

### 6.2 Step-by-Step Breakdown

#### Step 1-4: Client-Side Preparation (Browser)

**File:** `portfolioApi.js` → `uploadSecureNormalize()`

```javascript
// 1. Generate a random 256-bit AES session key
const sessionKey = await generateSessionKey();

// 2. Encrypt the file contents with AES-GCM
const { encryptedContent, iv } = await encryptFile(file, sessionKey);

// 3. Fetch the server's RSA public key
const publicKeyPem = await this.getPublicKey();

// 4. Encrypt the AES session key with RSA-OAEP
const encryptedSessionKey = await encryptSessionKey(sessionKey, publicKeyPem);
```

**What's happening:**
- `generateSessionKey()` calls `window.crypto.subtle.generateKey()` to create a random AES-256-GCM key.
- `encryptFile()` reads the file as an ArrayBuffer, generates a random 12-byte IV, and encrypts using AES-GCM.
- `encryptSessionKey()` imports the RSA public key PEM, exports the AES key to raw bytes, and encrypts with RSA-OAEP.

#### Step 5: Send Encrypted Payload

```javascript
const formData = new FormData();
formData.append('file', encryptedFileBlob, file.name + '.enc');      // Encrypted file
formData.append('encryptedKey', arrayBufferToBase64(encryptedSessionKey)); // RSA-encrypted AES key
formData.append('iv', arrayBufferToBase64(new Uint8Array(iv)));           // IV for AES-GCM

const response = await apiClient.uploadFile('/portfolio/secure-normalize', formData);
```

**Payload sent over the network:**
| Field | Content | Format |
|-------|---------|--------|
| `file` | AES-GCM encrypted file data + 16-byte auth tag | Binary blob |
| `encryptedKey` | RSA-OAEP encrypted AES-256 key | Base64 string |
| `iv` | Random 12-byte initialization vector | Base64 string |

#### Step 5 (Java Proxy): 

**File:** `SecurePortfolioController.java` → `secureNormalize()`

```java
@PostMapping(value = "/secure-normalize", produces = "application/json")
public ResponseEntity<String> secureNormalize(
    @RequestParam("file") MultipartFile file,
    @RequestParam("encryptedKey") String encryptedKey,
    @RequestParam("iv") String iv, ...
) {
    String result = securePortfolioService.secureNormalize(file, encryptedKey, iv, portfolioId, brokerId);
    return ResponseEntity.ok(result);
}
```

**File:** `SecurePortfolioService.java` → `secureNormalize()`

```java
public String secureNormalize(MultipartFile file, String encryptedKey, String iv, ...) {
    String url = NODE_SERVICE_URL + "/normalize";
    // Forwards the encrypted file, key, and IV as multipart/form-data to Node.js
    // Cannot decrypt anything — just a proxy
}
```

⚠️ **The Java backend CANNOT see the plaintext.** It receives the encrypted blob and forwards it unchanged.

#### Steps 6-7: Decryption (Node.js)

**File:** `app.js` → `POST /normalize`

```javascript
// 6. Decrypt the AES session key using RSA private key
const sessionKey = decryptSessionKey(req.body.encryptedKey, keys.privateKey);

// 7. Decrypt the file using AES-256-GCM
const decryptedFileBuffer = decryptFile(req.file.buffer, sessionKey, req.body.iv);
```

**File:** `cryptoUtils.js` → `decryptSessionKey()`

```javascript
function decryptSessionKey(encryptedKeyBase64, privateKeyPem) {
    const buffer = Buffer.from(encryptedKeyBase64, 'base64');
    return crypto.privateDecrypt(
        {
            key: privateKeyPem,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        buffer
    );
}
```

**File:** `cryptoUtils.js` → `decryptFile()`

```javascript
function decryptFile(encryptedFileBuffer, sessionKeyBuffer, ivBase64) {
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', sessionKeyBuffer, iv);

    // Web Crypto API appends the 16-byte auth tag to the end of the ciphertext
    const authTagLength = 16;
    const authTag = encryptedFileBuffer.slice(encryptedFileBuffer.length - authTagLength);
    const encryptedContent = encryptedFileBuffer.slice(0, encryptedFileBuffer.length - authTagLength);

    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
}
```

**Critical Detail:** The Web Crypto API (browser) appends the GCM authentication tag (16 bytes) to the end of the ciphertext. Node.js `crypto` module expects the auth tag separately. So the Node.js code manually **splits the last 16 bytes** as the auth tag.

#### Steps 8-9: Normalization (Python)

```javascript
const pythonNormalizeUrl = 'http://localhost:8000/api/normalize-portfolio';
const normalizeResponse = await fetch(pythonNormalizeUrl, { method: 'POST', body: formData });
const normalizedData = await normalizeResponse.json();
```

The decrypted file (plaintext CSV/Excel) is sent to the Python service which:
1. Detects the broker format (Groww, Zerodha, etc.)
2. Finds the header row
3. Normalizes column names to a standard schema
4. Enriches trade data with market data (if DB is available)
5. Returns a JSON array of normalized transactions

#### Step 10: Encrypt Response (Node.js)

**File:** `cryptoUtils.js` → `encryptData()`

```javascript
function encryptData(data, sessionKeyBuffer) {
    const iv = crypto.randomBytes(12);                                         // New random IV
    const cipher = crypto.createCipheriv('aes-256-gcm', sessionKeyBuffer, iv);

    let encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Append auth tag (matching Web Crypto behavior)
    const finalBuffer = Buffer.concat([encrypted, authTag]);

    return {
        encryptedData: finalBuffer.toString('base64'),
        iv: iv.toString('base64')
    };
}
```

**Response JSON:**
```json
{
    "encryptedData": "Base64(AES-GCM ciphertext + authTag)",
    "iv": "Base64(12-byte IV)"
}
```

#### Steps 11-13: Client-Side Decryption

```javascript
// 11. Decrypt the response using the original session key
const decryptedResponse = await decryptData(
    base64ToArrayBuffer(response.encryptedData),
    base64ToArrayBuffer(response.iv),
    sessionKey  // Same key generated in Step 1
);

// 12-13. Return data and session key for Step 2
return { data: decryptedResponse, sessionKey };
```

---

## 7. Flow 2: Secure Analysis (JSON Data)

After the user reviews the normalized transactions table and clicks **"Analyze Portfolio"** (or **"Analyze Filtered Data"**), this flow starts.

### 7.1 Sequence Diagram

```
  Browser                    Java Backend              Node.js               Python
    │                           │                        │                      │
    │  1. Encrypt normalizedData│                        │                      │
    │     with AES-GCM          │                        │                      │
    │  2. Encrypt AES key w/RSA │                        │                      │
    │                           │                        │                      │
    │  3. POST /secure-analyze  │                        │                      │
    │     {encryptedData,       │                        │                      │
    │      encryptedKey, iv}    │                        │                      │
    │ ─────────────────────────►│  Proxy POST            │                      │
    │                           │  /analyze-json         │                      │
    │                           │───────────────────────►│                      │
    │                           │                        │                      │
    │                           │                        │  4. Decrypt AES key  │
    │                           │                        │  5. Decrypt JSON     │
    │                           │                        │                      │
    │                           │                        │  6. POST /analysis   │
    │                           │                        │     [plaintext JSON] │
    │                           │                        │─────────────────────►│
    │                           │                        │                      │
    │                           │                        │  7. Analysis results │
    │                           │                        │◄─────────────────────│
    │                           │                        │                      │
    │                           │                        │  8. Encrypt response │
    │                           │                        │                      │
    │                           │◄───────────────────────│  {encryptedData, iv} │
    │◄──────────────────────────│                        │                      │
    │                           │                        │                      │
    │  9. Decrypt response      │                        │                      │
    │  10. Display analysis     │                        │                      │
    │      dashboard            │                        │                      │
```

### 7.2 Step-by-Step Breakdown

#### Steps 1-2: Client-Side Encryption

**File:** `portfolioApi.js` → `analyzeSecurePortfolio()`

```javascript
// 1. Encrypt the normalized JSON data with AES-GCM
const jsonString = JSON.stringify(normalizedData);
const encoder = new TextEncoder();
const dataBuffer = encoder.encode(jsonString);
const iv = window.crypto.getRandomValues(new Uint8Array(12));

const encryptedContent = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    sessionKey,       // Reused from normalization OR freshly generated
    dataBuffer
);

// 2. Encrypt session key for server  
const publicKeyPem = await this.getPublicKey();
const encryptedSessionKey = await encryptSessionKey(sessionKey, publicKeyPem);
```

**Key Reuse vs. Fresh Key:**
- If the user just uploaded a file (Step 1 completed), the **same session key** is reused.
- If the user loaded a saved portfolio (no Step 1), a **fresh session key** is automatically generated by `useSecureUpload.js`:

```javascript
let keyToUse = sessionKey;
if (!keyToUse) {
    console.log("Generating fresh session key for analysis...");
    keyToUse = await generateSessionKey();
}
```

#### Step 3: Send Encrypted JSON Payload

```javascript
const payload = {
    encryptedData: arrayBufferToBase64(encryptedContent),   // AES-GCM encrypted JSON
    encryptedKey: arrayBufferToBase64(encryptedSessionKey),  // RSA-encrypted AES key
    iv: arrayBufferToBase64(iv)                              // 12-byte IV
};

const response = await apiClient.post('/portfolio/secure-analyze', payload);
```

#### Steps 3 (Java Proxy):

**File:** `SecurePortfolioController.java`

```java
@PostMapping(value = "/secure-analyze", produces = "application/json")
public ResponseEntity<String> secureAnalyze(@RequestBody Map<String, String> payload) {
    String result = securePortfolioService.secureAnalyzeJson(
        payload.get("encryptedData"),
        payload.get("encryptedKey"),
        payload.get("iv")
    );
    return ResponseEntity.ok(result);
}
```

⚠️ Again, Java **cannot decrypt** — it just forwards the encrypted JSON blob to Node.js.

#### Steps 4-8: Node.js Decrypt → Python Analyze → Encrypt Response

**File:** `app.js` → `POST /analyze-json`

```javascript
// 4-5. Decrypt
const sessionKey = decryptSessionKey(req.body.encryptedKey, keys.privateKey);
const decryptedPayload = decryptFile(
    Buffer.from(req.body.encryptedData, 'base64'),
    sessionKey,
    req.body.iv
);
const transactionList = JSON.parse(decryptedPayload.toString('utf8'));

// 6-7. Send to Python for analysis
const analysisResponse = await axios.post(pythonAnalysisUrl, { transactions: transactionList });

// 8. Encrypt the combined result
const finalResult = {
    transactions: transactionList,
    analysis: analysisResponse.data
};
const encryptedResponse = encryptData(finalResult, sessionKey);
res.json(encryptedResponse);
```

#### Steps 9-10: Client-Side Decryption & Display

```javascript
const decryptedResponse = await decryptData(
    base64ToArrayBuffer(response.encryptedData),
    base64ToArrayBuffer(response.iv),
    sessionKey
);
// decryptedResponse = { transactions: [...], analysis: {...} }
```

---

## 8. Detailed Code Walkthrough

### 8.1 `EncryptionService.js` — Browser Crypto Functions

| Function | Input | Output | Algorithm |
|----------|-------|--------|-----------|
| `generateSessionKey()` | None | `CryptoKey` (AES-256-GCM) | Web Crypto `generateKey` |
| `encryptFile(file, sessionKey)` | File + CryptoKey | `{ iv, encryptedContent }` | AES-256-GCM |
| `encryptSessionKey(sessionKey, publicKeyPem)` | CryptoKey + PEM string | `Uint8Array` (ciphertext) | RSA-OAEP SHA-256 |
| `decryptData(encryptedData, iv, sessionKey)` | ArrayBuffer × 2 + CryptoKey | Parsed JSON object | AES-256-GCM |
| `arrayBufferToBase64(buffer)` | ArrayBuffer | Base64 string | Encoding utility |
| `base64ToArrayBuffer(base64)` | Base64 string | ArrayBuffer | Encoding utility |

### 8.2 `cryptoUtils.js` — Node.js Crypto Functions

| Function | Input | Output | Algorithm |
|----------|-------|--------|-----------|
| `generateRSAKeyPair()` | None | `{ publicKey, privateKey }` PEM | RSA-2048 |
| `decryptSessionKey(base64, privatePem)` | Base64 + PEM | Buffer (32 bytes = AES key) | RSA-OAEP SHA-256 |
| `decryptFile(buffer, key, ivBase64)` | Buffer + Buffer + Base64 | Buffer (plaintext) | AES-256-GCM |
| `encryptData(data, key)` | Object + Buffer | `{ encryptedData, iv }` | AES-256-GCM |

### 8.3 `useSecureUpload.js` — React Hook

| Function | Triggers | What it does |
|----------|----------|-------------|
| `normalizePortfolio(save, file, name, broker, id)` | User uploads file | Calls `uploadSecureNormalize()`, returns `{ success, portfolioId, data, sessionKey }` |
| `runSecureAnalysis(data, sessionKey, portfolioId, save)` | User clicks "Analyze Portfolio" | Generates key if missing, calls `analyzeSecurePortfolio()`, returns `{ success, data, analysis }` |

### 8.4 `PortLandPage.jsx` — UI Integration

| Function | When called | What happens |
|----------|-------------|-------------|
| `handleUploadChoice(save)` | User clicks "Upload" or "Save & Upload" | Calls `normalizePortfolio()` → stores session key → shows transactions table (Step 4) |
| `handleAnalyzeFiltered()` | User clicks "Analyze Portfolio" button | Calls `runSecureAnalysis()` with current data and session key → shows analysis dashboard |
| `handleBackToTransactions()` | User clicks "Back" from analysis | Hides analysis, shows transactions table |

---

## 9. Data Format Reference

### 9.1 Normalization Request (Multipart Form)

```
POST /api/portfolio/secure-normalize
Content-Type: multipart/form-data

file:          <binary blob - AES-GCM encrypted file + auth tag>
encryptedKey:  <Base64 string - RSA-OAEP encrypted AES-256 key>
iv:            <Base64 string - 12-byte IV>
portfolioId:   <string - optional>
brokerId:      <string - optional>
```

### 9.2 Normalization Response

```json
{
    "encryptedData": "<Base64 string - AES-GCM encrypted JSON + auth tag>",
    "iv": "<Base64 string - 12-byte IV>"
}
```

**After decryption, the JSON contains:**
```json
[
    {
        "universal_trade_id": "...",
        "Symbol": "RELIANCE",
        "Scrip_Name": "RELIANCE INDUSTRIES LTD",
        "Trade_execution_time": "2024-01-01 10:00:00",
        "Order_Type": "B",
        "Qty": 10.0,
        "Mkt_Price": 2500.0,
        "Amount": 25000.0,
        "Exchange": "NSE",
        "Series": "EQ",
        "ISIN": "INE002A01018",
        "Intraday_Flag": false
    }
]
```

### 9.3 Analysis Request (JSON)

```
POST /api/portfolio/secure-analyze
Content-Type: application/json

{
    "encryptedData": "<Base64 - AES-GCM encrypted normalized JSON>",
    "encryptedKey": "<Base64 - RSA-OAEP encrypted AES key>",
    "iv": "<Base64 - 12-byte IV>"
}
```

### 9.4 Analysis Response

```json
{
    "encryptedData": "<Base64 - AES-GCM encrypted result>",
    "iv": "<Base64 - 12-byte IV>"
}
```

**After decryption:**
```json
{
    "transactions": [ /* normalized trades */ ],
    "analysis": {
        "top_performing": { /* ... */ },
        "sector_analysis": { /* ... */ },
        "risk_analysis": { /* ... */ },
        "trade_analysis": { /* ... */ },
        /* ... more analysis sections ... */
    }
}
```

---

## 10. Security Considerations

### 10.1 What IS Protected

| Threat | Protection |
|--------|-----------|
| **Man-in-the-middle** | Data is AES-encrypted before leaving the browser. Even if HTTPS is compromised, the attacker sees only ciphertext. |
| **Java backend compromise** | The Java backend is a blind proxy. It cannot decrypt any data. Only Node.js has the private key. |
| **Data tampering** | AES-GCM provides authentication. Any modification to the ciphertext causes decryption failure. |
| **Session key interception** | The AES session key is encrypted with RSA-2048. Only the RSA private key holder can recover it. |
| **Replay attacks** | Each request uses a fresh random IV. Even encrypting the same data twice produces different ciphertext. |

### 10.2 What is NOT Protected (Current Limitations)

| Risk | Status |
|------|--------|
| **Node.js ↔ Python communication** | Plaintext over HTTP on localhost. Acceptable if on same machine; needs TLS if on different hosts. |
| **RSA key stored on disk** | `rsa_keys.json` is stored unencrypted. Should use OS keystore or HSM in production. |
| **No key rotation** | Keys persist forever. Should implement periodic key rotation. |
| **No mutual authentication** | The browser trusts any public key served. Should pin the public key or use certificates. |

### 10.3 Payload Size Limits

| Component | Limit | Configuration |
|-----------|-------|---------------|
| Node.js Express JSON | 50 MB | `express.json({ limit: '50mb' })` |
| Node.js Multer file | 50 MB | `limits: { fileSize: 50 * 1024 * 1024 }` |
| Java Spring Multipart | 50 MB | `spring.servlet.multipart.max-file-size=50MB` |
| Java Tomcat | 50 MB | `server.tomcat.max-http-form-post-size=50MB` |
| Python FastAPI | 50 MB | `MAX_FILE_SIZE = 50 * 1024 * 1024` |

---

## 11. Troubleshooting Guide

### 11.1 `PayloadTooLargeError: request entity too large`

**Cause:** The encrypted data exceeds the server's payload limit.  
**Fix:** Increase limits in `node_security_service/app.js`:
```javascript
app.use(express.json({ limit: '50mb' }));
```

### 11.2 `Invalid encrypted response from server`

**Cause:** The response from the server doesn't contain `encryptedData` or `iv`.  
**Debug Steps:**  
1. Check Node.js logs for decryption errors.
2. Verify the RSA keys haven't been rotated (browser cached old public key).
3. Check if the Python service is running (`http://localhost:8000`).

### 11.3 `OperationError` during `window.crypto.subtle.decrypt`

**Cause:** The authentication tag verification failed. This means:
- The data was corrupted in transit, OR
- The wrong session key is being used, OR
- The IV doesn't match.

**Debug Steps:**
1. Verify the session key stored in React state matches the one used for encryption.
2. Check if the base64 encoding/decoding is correct.
3. Ensure no middleware is modifying the response body.

### 11.4 `Error: Decryption failed` in Node.js

**Cause:** RSA decryption of the session key failed.  
**Possible reasons:**
- RSA keys were regenerated (browser has stale public key) — **refresh the page**.
- The `encryptedKey` was corrupted during Base64 encoding.

### 11.5 Fresh Key Generation for Saved Portfolios

When a user loads a saved portfolio (no file upload), there's no session key from Step 1. The system automatically generates a fresh key:
```javascript
if (!keyToUse) {
    keyToUse = await generateSessionKey();
}
```
This works because the analysis flow is self-contained — it generates a new AES key, encrypts the data, sends it, and decrypts the response with the same key.

---

## 12. File Reference Map

```
encryption/
├── Frontend/cmda-hub-frontend-legacy/src/
│   ├── utils/
│   │   ├── EncryptionService.js          ← 🔐 Core crypto (AES + RSA)
│   │   └── portfolioApi.js               ← 📡 API client (secure upload + analyze)
│   ├── hooks/
│   │   └── useSecureUpload.js            ← 🪝 React hook (orchestrator)
│   └── components/Portfolio/
│       └── PortLandPage.jsx              ← 🖥️ UI (buttons, state management)
│
├── backend/cmda-hub-backend-legacy/src/main/java/.../
│   ├── controller/
│   │   └── SecurePortfolioController.java ← 🚪 REST endpoints (proxy)
│   ├── services/
│   │   └── SecurePortfolioService.java    ← 📦 Service layer (proxy)
│   └── resources/
│       └── application.properties         ← ⚙️ Config (file size limits)
│
├── node_security_service/
│   ├── app.js                             ← 🔑 Express server (decrypt/encrypt)
│   ├── cryptoUtils.js                     ← 🧮 RSA + AES functions
│   └── rsa_keys.json                      ← 🗝️ Persisted RSA key pair
│
└── python/portfolio--main/backend/
    └── app.py                             ← 📊 FastAPI (normalize + analyze)
```

---

## Summary: The Encryption Journey of a Single Trade

```
📄 User's broker CSV file (e.g., "trades.csv")
    │
    ▼ [Browser: AES-256-GCM encrypt with random key + random IV]
🔒 Encrypted blob + RSA-encrypted AES key + IV
    │
    ▼ [HTTPS to Java Backend]
📦 Java Backend receives encrypted blob (CANNOT read it)
    │
    ▼ [HTTP to Node.js]
🔓 Node.js decrypts AES key (RSA private key) → decrypts file (AES-GCM)
    │
    ▼ [HTTP to Python]
📊 Python normalizes CSV → returns JSON
    │
    ▼ [Node.js: AES-256-GCM encrypt with SAME session key + new IV]
🔒 Encrypted JSON response
    │
    ▼ [HTTP to Java → HTTPS to Browser]
🔓 Browser decrypts with original session key
    │
    ▼ 
📋 User sees normalized transactions table

    ═══════════════════════════════════════
    User clicks "Analyze Portfolio"
    ═══════════════════════════════════════

📋 Normalized JSON data
    │
    ▼ [Browser: AES-256-GCM encrypt + RSA-encrypt key]
🔒 Encrypted JSON + encrypted key + IV
    │
    ▼ [HTTPS → Java (proxy) → Node.js]
🔓 Node.js decrypts → sends to Python
    │
    ▼ [Python performs analysis]
📊 Analysis results (charts, metrics, insights)
    │
    ▼ [Node.js encrypts response]
🔒 Encrypted analysis results
    │
    ▼ [→ Java (proxy) → Browser decrypts]
📈 User sees the analysis dashboard
```

---

*End of Documentation*
