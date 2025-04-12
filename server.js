const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import routes
const dashboardRoutes = require('./routes/dashboardRoutes');
const submissionRoutes = require('./routes/submission');
const authRoutes = require('./routes/auth'); // Make sure this includes /me route

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Whitelist for frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://radiant-phi-ten.vercel.app'
];

// ✅ CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('❌ CORS error for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ JSON Body Parser
app.use(express.json());

// ✅ Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// ✅ API Routes
app.use('/api/auth', authRoutes);               // /api/auth/login, /register, /send-otp, /me
app.use('/api', dashboardRoutes);     // /api/dashboard/data
app.use('/api/submission', submissionRoutes);   // /api/submission/analyze

// ❌ REMOVE Redundant routes — You already declared them above with correct prefixes
// app.use('/api', dashboardRoutes);
// app.use('/api', submissionRoutes);
// app.use('/api', authRoutes);

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('🌟 Radiant Skincare API');
});

// ✅ Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
