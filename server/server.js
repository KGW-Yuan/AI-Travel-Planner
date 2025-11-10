const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Load environment variables FIRST
dotenv.config({ path: path.resolve(__dirname, 'src/config/.env') });

const authRoutes = require('./src/api/authRoutes');
const planRoutes = require('./src/api/planRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/plan', planRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('AI Travel Planner Backend is running!');
});

const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (process.env.CLOUDBASE_ENV_ID) {
    console.log(`Connected to CloudBase environment: ${process.env.CLOUDBASE_ENV_ID}`);
  } else {
    console.warn('CLOUDBASE_ENV_ID not found in .env file. Make sure you have configured it.');
  }
});