const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const TherapySession = require('../models/TherapySession'); 
const authMiddleware = require('../middleware/authMiddleware');

// Loading environment variables
require("dotenv").config({ path: "./config.env" });

const app = express();
app.use(express.json());
app.use(cors());

// Set port and database URI from environment variables
const PORT = process.env.PORT || 5000;
const Db = process.env.ATLAS_URI;
const SECRET_KEY = process.env.SECRET_KEY;

let db, users, therapyHistory;

// MongoDB client configuration
const client = new MongoClient(Db, {
    ssl: true,
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000
});

// Main function to connect to MongoDB and start the server
async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db("myphysiotherapist");
        users = db.collection("Users");
        therapyHistory = db.collection("therapyHistory");
        await users.createIndex({ username: 1 }, { unique: true });
    } catch (e) {
        console.error("Failed to connect to MongoDB:", e);
        process.exit(1);
    }

    // API endpoints for user authentication and therapy sessions
    app.post('/signup', async (req, res) => {
        const { username, password, painLocation, painIntensity } = req.body;
        try {
            if (await users.findOne({ username })) {
                return res.status(400).send("User already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await users.insertOne({ username, password: hashedPassword, painLocation, painIntensity });
            res.status(201).send("User registered");
        } catch (error) {
            console.error("Signup error:", error);
            res.status(500).send("Error registering user: " + error.message);
        }
    });

    // Login endpoint for user authentication
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await users.findOne({ username });
            if (user && await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '1h' });
                res.json({ token, username: user.username });
            } else {
                res.status(401).send("Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).send("Error during login: " + error.message);
        }
    });

    // Get user endpoint to retrieve user data
    app.get('/user/:username', async (req, res) => {
        const { username } = req.params;
        if (!username) {
            return res.status(400).send({ error: "Username is required" });
        }
    
        try {
            const user_2 = await users.findOne({ username }, { projection: { password: 0, _id: 0 } });
            if (!user_2) {
                console.log(`User not found: ${username}`); // Enhanced logging
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user_2);
        } catch (error) {
            console.error(`Error fetching user ${username}:`, error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    
    // Endpoint to save therapy session history
    router.post('/history', authMiddleware, async (req, res) => {
        const { date, exercises } = req.body;
        const username = req.user.username; // username from auth token
    
        const today = new Date(date);
        today.setHours(0, 0, 0, 0);
    
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
    
        try {
            // Check if a session already exists for today
            const existingSession = await TherapySession.findOne({
                username: username,
                date: {
                    $gte: today,
                    $lt: tomorrow
                }
            });
    
            if (existingSession) {
                return res.status(409).json({ message: 'A session has already been recorded today.' });
            }
    
            const newSession = new TherapySession({
                username,
                date: today,
                exercises
            });
    
            await newSession.save();
            res.status(201).json(newSession);
        } catch (error) {
            res.status(500).json({ message: 'Error saving therapy session', error });
        }
    });

    // Endpoint to retrieve therapy session history
    router.get('/history', authMiddleware, async (req, res) => {
        try {
            const username = req.user.username;
            const sessions = await TherapySession.find({ username }).sort({ date: -1 });
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching therapy history' });
        }
    });
    

    
    // Start the Express server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)).on('error', err => {
        console.error('Failed to start server:', err);
    });
}

main().catch(console.error);

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});







