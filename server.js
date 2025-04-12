const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dashboardRoutes = require('./routes/dashboardRoutes');
const submissionRoutes = require('./routes/submission');
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Exporting app and port if used in test or other modules
exports.app = app;
exports.PORT = PORT;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Parses application/json
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ DB Error:', err));

// ✅ API Routes
app.use('/api', dashboardRoutes);
app.use('/api', submissionRoutes);
app.use('/api', authRoutes); // Includes /user/me route

// ✅ Health check / root route
app.get('/', (req, res) => {
  res.send('🌟 Radiant Skincare API');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log ('🚀 Server running on http://localhost:${PORT}');

  });