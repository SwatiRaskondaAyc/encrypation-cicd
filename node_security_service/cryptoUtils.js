const crypto = require('crypto');

// Generate RSA Key Pair
function generateRSAKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
}

// Decrypt Session Key using RSA Private Key
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

// Decrypt File using AES-GCM
function decryptFile(encryptedFileBuffer, sessionKeyBuffer, ivBase64) {
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', sessionKeyBuffer, iv);

    // In Web Crypto API (Frontend), the authentication tag is appended to the ciphertext
    // The last 16 bytes are the auth tag
    const authTagLength = 16;
    const authTag = encryptedFileBuffer.slice(encryptedFileBuffer.length - authTagLength);
    const encryptedContent = encryptedFileBuffer.slice(0, encryptedFileBuffer.length - authTagLength);

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
    return decrypted;
}

// Encrypt Response using AES-GCM
function encryptData(data, sessionKeyBuffer) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', sessionKeyBuffer, iv);

    let encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Append auth tag to end (matching Web Crypto behavior for decryption)
    const finalBuffer = Buffer.concat([encrypted, authTag]);

    return {
        encryptedData: finalBuffer.toString('base64'), // Send as Base64
        iv: iv.toString('base64')
    };
}

module.exports = {
    generateRSAKeyPair,
    decryptSessionKey,
    decryptFile,
    encryptData
};
