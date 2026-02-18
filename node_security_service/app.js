const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const { generateRSAKeyPair, decryptSessionKey, decryptFile, encryptData } = require('./cryptoUtils');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configure Multer (Memory Storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// 1. Generate or Load RSA Key Pair
const KEYS_FILE = path.join(__dirname, 'rsa_keys.json');
let keys = null;

try {
    if (fs.existsSync(KEYS_FILE)) {
        console.log("Loading existing RSA keys from", KEYS_FILE);
        const keysJson = fs.readFileSync(KEYS_FILE, 'utf8');
        keys = JSON.parse(keysJson);
    } else {
        console.log("Generating new RSA Key Pair...");
        keys = generateRSAKeyPair();
        fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2));
        console.log("RSA Key Pair saved to", KEYS_FILE);
    }
} catch (e) {
    console.error("Failed to manage RSA keys:", e);
    process.exit(1);
}

// 2. Health Check / Index
app.get('/', (req, res) => {
    res.json({ status: "running", service: "Node Security Service" });
});

// 3. Public Key Endpoint
app.get('/public-key', (req, res) => {
    res.send(keys.publicKey);
});

// 4. Encrypted Normalization Endpoint
app.post('/normalize', upload.single('file'), async (req, res) => {
    try {
        if (!req.file || !req.body.encryptedKey || !req.body.iv) {
            return res.status(400).json({ error: "Missing file, encryptedKey, or iv" });
        }

        console.log("Receiving file for normalization...");
        const sessionKey = decryptSessionKey(req.body.encryptedKey, keys.privateKey);
        const decryptedFileBuffer = decryptFile(req.file.buffer, sessionKey, req.body.iv);

        const cleanedFilename = req.file.originalname.replace(/\.enc$/, '');
        const formData = new FormData();
        const blob = new Blob([decryptedFileBuffer], { type: 'application/octet-stream' });
        formData.append('file', blob, cleanedFilename);

        if (req.body.portfolioId) formData.append('portfolioId', req.body.portfolioId);
        if (req.body.brokerId) formData.append('brokerId', req.body.brokerId);

        const pythonNormalizeUrl = 'http://localhost:8000/api/normalize-portfolio';
        const normalizeResponse = await fetch(pythonNormalizeUrl, { method: 'POST', body: formData });

        if (!normalizeResponse.ok) {
            const errorText = await normalizeResponse.text();
            throw new Error(`Normalization failed: ${normalizeResponse.status} ${errorText}`);
        }

        const normalizedData = await normalizeResponse.json();
        const encryptedResponse = encryptData(normalizedData, sessionKey);

        console.log("Normalization successful. Returning encrypted JSON.");
        res.json(encryptedResponse);

    } catch (error) {
        console.error("Error in /normalize:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 5. Encrypted Analysis Endpoint (Direct JSON)
app.post('/analyze-json', async (req, res) => {
    try {
        if (!req.body.encryptedData || !req.body.encryptedKey || !req.body.iv) {
            return res.status(400).json({ error: "Missing encryptedData, encryptedKey, or iv" });
        }

        console.log("Receiving JSON for analysis...");
        const sessionKey = decryptSessionKey(req.body.encryptedKey, keys.privateKey);

        // Decrypt the transaction data
        const decryptedPayload = decryptFile(
            Buffer.from(req.body.encryptedData, 'base64'),
            sessionKey,
            req.body.iv
        );
        const transactionList = JSON.parse(decryptedPayload.toString('utf8'));

        console.log(`Analyzing ${transactionList.length} transactions...`);

        const pythonAnalysisUrl = 'http://localhost:8000/api/portfolio-analysis';
        const analysisResponse = await axios.post(pythonAnalysisUrl, { transactions: transactionList });
        const analysisResult = analysisResponse.data;

        const finalResult = {
            transactions: transactionList,
            analysis: analysisResult
        };

        const encryptedResponse = encryptData(finalResult, sessionKey);
        console.log("Analysis successful. Returning encrypted result.");
        res.json(encryptedResponse);

    } catch (error) {
        console.error("Error in /analyze-json:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Node Security Service running on http://localhost:${port}`);
});
