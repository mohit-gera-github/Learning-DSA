const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const topicRoutes = require('./routes/topicRoutes');
const problemRoutes = require('./routes/problemRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

// Routes
app.use('/api/topics', topicRoutes);
app.use('/api/problems', problemRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('DSA Visual Learn API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (Database offline)`);
    });
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something broke!' });
});
