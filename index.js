const express = require('express');
const cors = require('cors');
require('dotenv').config();

const summarizeRoutes = require('./routes/summarizeRoutes');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

console.log('Starting server...');
require('dotenv').config();

const connectDB = require('./config/db');

console.log('Connecting to DB...');
connectDB();

console.log('Setting up express...');

app.use(cors());
app.use(express.json());

app.use('/api/summarize', summarizeRoutes);
app.use('/api/quizzes', quizRoutes);
app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app;