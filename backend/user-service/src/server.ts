import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from 'firebase-admin';

import dotenv from 'dotenv';

dotenv.config(); // Load .env file

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Check if the FIREBASE_SERVICE_KEY_PATH is defined
if (!process.env.FIREBASE_SERVICE_KEY_PATH) {
  throw new Error('FIREBASE_SERVICE_KEY_PATH is not defined in .env file');
}

// Initialize Firebase Admin SDK using the path from the .env file
const serviceAccount = require(process.env.FIREBASE_SERVICE_KEY_PATH);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});

// Register a new user
app.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({ email, password });
    res.status(201).json({ message: 'User created successfully', userId: userRecord.uid });
  } catch (error) {
    const err = error as Error;  // Cast the error to Error type
    res.status(400).json({ error: err.message });
  }
});

// Get user profile
app.get('/profile/:uid', async (req: Request, res: Response) => {
  try {
    const userRecord = await admin.auth().getUser(req.params.uid);
    res.status(200).json(userRecord);
  } catch (error) {
    const err = error as Error;  // Cast the error to Error type
    res.status(404).json({ error: 'User not found', message: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
