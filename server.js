// whoisatoshi.net Backend API
// Node.js + Express.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS || ['https://whoisatoshi.net', 'http://localhost:3000'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // max 100 request per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Database Path
const dbPath = path.join(__dirname, 'data', 'poll-results.json');
const ipLogsPath = path.join(__dirname, 'data', 'ip-logs.json');

// Initialize Database
function initializeDatabase() {
    const data = {
        'Hal Finney': 2450,
        'Nick Szabo': 2100,
        'Adam Back': 1950,
        'Len Sassaman': 850,
        'A Group (Collective)': 620,
        'Still Unknown': 1030,
        'last_updated': new Date().toISOString()
    };

    if (!fs.existsSync(path.join(__dirname, 'data'))) {
        fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
    }

    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    }

    if (!fs.existsSync(ipLogsPath)) {
        fs.writeFileSync(ipLogsPath, JSON.stringify({}, null, 2));
    }
}

// Get Client IP
function getClientIP(req) {
    return (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0];
}

// Hash IP (privacy)
function hashIP(ip) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(ip + process.env.IP_SALT || 'secret').digest('hex');
}

// Read Poll Data
function getPollData() {
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch {
        return {
            'Hal Finney': 0,
            'Nick Szabo': 0,
            'Adam Back': 0,
            'Len Sassaman': 0,
            'A Group (Collective)': 0,
            'Still Unknown': 0,
            'last_updated': new Date().toISOString()
        };
    }
}

// Write Poll Data
function savePollData(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('Database write error:', err);
        return false;
    }
}

// Read IP Logs
function getIPLogs() {
    try {
        return JSON.parse(fs.readFileSync(ipLogsPath, 'utf8'));
    } catch {
        return {};
    }
}

// Save IP Logs
function saveIPLogs(logs) {
    try {
        fs.writeFileSync(ipLogsPath, JSON.stringify(logs, null, 2));
        return true;
    } catch {
        return false;
    }
}

// ============= ROUTES =============

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// GET: Poll Results
app.get('/api/poll/results', (req, res) => {
    const data = getPollData();
    const total = Object.values(data)
        .filter((v, i) => i < Object.keys(data).length - 1)
        .reduce((a, b) => a + b, 0);

    const results = {};
    for (let [key, value] of Object.entries(data)) {
        if (key !== 'last_updated') {
            results[key] = {
                votes: value,
                percentage: ((value / total) * 100).toFixed(2)
            };
        }
    }

    res.json({
        success: true,
        total_votes: total,
        results,
        last_updated: data.last_updated
    });
});

// POST: Submit Vote
app.post('/api/poll/vote', (req, res) => {
    const { candidate } = req.body;
    const clientIP = getClientIP(req);
    const hashedIP = hashIP(clientIP);

    // Validation
    if (!candidate) {
        return res.status(400).json({ 
            success: false, 
            message: 'Candidate name required' 
        });
    }

    const validCandidates = [
        'Hal Finney',
        'Nick Szabo',
        'Adam Back',
        'Len Sassaman',
        'A Group (Collective)',
        'Still Unknown'
    ];

    if (!validCandidates.includes(candidate)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid candidate' 
        });
    }

    // Check if IP already voted today
    const ipLogs = getIPLogs();
    const today = new Date().toDateString();

    if (ipLogs[hashedIP]) {
        const lastVoteDate = new Date(ipLogs[hashedIP].last_vote).toDateString();
        if (lastVoteDate === today) {
            return res.status(429).json({ 
                success: false, 
                message: 'You have already voted today. Come back tomorrow!' 
            });
        }
    }

    // Record vote
    const data = getPollData();
    data[candidate] = (data[candidate] || 0) + 1;
    data.last_updated = new Date().toISOString();

    // Update IP logs
    ipLogs[hashedIP] = {
        last_vote: new Date().toISOString(),
        last_candidate: candidate
    };

    // Save to database
    const saved = savePollData(data) && saveIPLogs(ipLogs);

    if (saved) {
        // Calculate total for response
        const total = Object.values(data)
            .filter((v, i) => i < Object.keys(data).length - 1)
            .reduce((a, b) => a + b, 0);

        const results = {};
        for (let [key, value] of Object.entries(data)) {
            if (key !== 'last_updated') {
                results[key] = {
                    votes: value,
                    percentage: ((value / total) * 100).toFixed(2)
                };
            }
        }

        // Analytics event
        logAnalytics({
            event: 'vote_submitted',
            candidate,
            timestamp: new Date().toISOString(),
            ip_hash: hashedIP
        });

        res.json({
            success: true,
            message: 'Vote submitted successfully!',
            results,
            total_votes: total
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to save vote' 
        });
    }
});

// GET: Candidates Data
app.get('/api/candidates', (req, res) => {
    const candidates = [
        {
            id: 'hal-finney',
            name: 'Hal Finney',
            birth_year: 1956,
            death_year: 2014,
            role: 'First Bitcoin TX Receiver',
            evidence: [
                { type: 'writing_style', confidence: 5, description: 'NYT analysis: closest match' },
                { type: 'connection', confidence: 4, description: 'Neighbor of Dorian Nakamoto' },
                { type: 'expertise', confidence: 5, description: 'PGP Expert & Cypherpunk' }
            ],
            score: 9.2
        },
        {
            id: 'nick-szabo',
            name: 'Nick Szabo',
            birth_year: 1964,
            role: 'Bit Gold Inventor',
            evidence: [
                { type: 'predecessor', confidence: 5, description: 'Bit Gold (1998) - closest tech predecessor' },
                { type: 'media', confidence: 4, description: 'NYT: Most compelling evidence' },
                { type: 'expertise', confidence: 5, description: 'Cryptography expert' }
            ],
            score: 8.8
        },
        {
            id: 'adam-back',
            name: 'Adam Back',
            birth_year: 1965,
            role: 'Hashcash / PoW Inventor',
            evidence: [
                { type: 'whitepaper', confidence: 5, description: 'Only name mentioned in whitepaper' },
                { type: 'technical', confidence: 5, description: 'Creator of Hashcash (PoW basis)' },
                { type: 'community', confidence: 4, description: 'Leading cryptographer' }
            ],
            score: 8.5
        },
        {
            id: 'len-sassaman',
            name: 'Len Sassaman',
            birth_year: 1980,
            death_year: 2011,
            role: 'PGP Developer',
            evidence: [
                { type: 'timeline', confidence: 4, description: 'Died months after Satoshi\'s last message' },
                { type: 'connection', confidence: 4, description: 'Close Finney collaboration' },
                { type: 'expertise', confidence: 5, description: 'Deep PGP expertise' }
            ],
            score: 7.3
        }
    ];

    res.json({
        success: true,
        candidates
    });
});

// GET: Stats for Dashboard
app.get('/api/stats', (req, res) => {
    const data = getPollData();
    const ipLogs = getIPLogs();
    
    const total = Object.values(data)
        .filter((v, i) => i < Object.keys(data).length - 1)
        .reduce((a, b) => a + b, 0);

    res.json({
        success: true,
        total_votes: total,
        unique_voters: Object.keys(ipLogs).length,
        server_uptime: process.uptime(),
        database_size: fs.statSync(dbPath).size
    });
});

// Analytics Logging
function logAnalytics(event) {
    const logPath = path.join(__dirname, 'data', 'analytics.log');
    const log = JSON.stringify(event) + '\n';
    
    try {
        fs.appendFileSync(logPath, log);
    } catch (err) {
        console.error('Analytics logging error:', err);
    }
}

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Endpoint not found' 
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start Server
initializeDatabase();
app.listen(PORT, () => {
    console.log(`🚀 whoisatoshi.net API running on port ${PORT}`);
    console.log(`📊 Database: ${dbPath}`);
    console.log(`🔐 CORS enabled for: ${process.env.ALLOWED_ORIGINS || 'localhost'}`);
});

module.exports = app;
