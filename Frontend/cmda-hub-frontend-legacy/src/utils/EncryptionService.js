/**
 * EncryptionService.js
 * Handles Hybrid Encryption (AES + RSA) for secure file transfer.
 */

// Generate a random AES-GCM key (Session Key)
export async function generateSessionKey() {
    return window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

// Encrypt file data using the Session Key (AES-GCM)
export async function encryptFile(file, sessionKey) {
    const fileData = await file.arrayBuffer();
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

    const encryptedContent = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        sessionKey,
        fileData
    );

    return {
        iv: Array.from(iv),
        encryptedContent: new Uint8Array(encryptedContent),
    };
}

// Encrypt the Session Key using the Server's Public RSA Key
export async function encryptSessionKey(sessionKey, publicKeyPem) {
    // 1. Import the RSA Public Key
    const binaryDer = pemToArrayBuffer(publicKeyPem);
    const publicKey = await window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        false,
        ["encrypt"]
    );

    // 2. Export the Session Key to raw bytes
    const sessionKeyRaw = await window.crypto.subtle.exportKey("raw", sessionKey);

    // 3. Encrypt the Session Key
    const encryptedKey = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey,
        sessionKeyRaw
    );

    return new Uint8Array(encryptedKey);
}

// Decrypt data using the Session Key (AES-GCM)
export async function decryptData(encryptedData, iv, sessionKey) {
    const decryptedContent = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: new Uint8Array(iv),
        },
        sessionKey,
        encryptedData
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedContent));
}

// --- Helper: Convert PEM to ArrayBuffer ---
function pemToArrayBuffer(pem) {
    const b64Lines = removeLines(pem);
    const b64Prefix = b64Lines.replace("-----BEGIN PUBLIC KEY-----", "");
    const b64Final = b64Prefix.replace("-----END PUBLIC KEY-----", "");
    const str = atob(b64Final.trim());
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function removeLines(str) {
    return str.replace(/(\r\n|\n|\r)/gm, "");
}

// --- Helper: ArrayBuffer to Base64 ---
export function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// --- Helper: Base64 to ArrayBuffer ---
export function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
