const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const summarizeRoutes = require('./routes/summarizeRoutes');
const quizRoutes = require('./routes/quizRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/summarize', summarizeRoutes);
app.use('/api/quizzes', quizRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
