import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Routes from './routes/index.js'; // Use ESM import syntax with '.mjs' extension

// Rest of your code remains the same...

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load environment variables from .env
dotenv.config();

// MongoDB connection URL from .env
const mongoURL = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define routes
app.use('/api/v1', Routes);
app.get('/api/v1', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
