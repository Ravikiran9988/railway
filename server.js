const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const dashboardRoutes = require('./routes/dashboardRoutes');
const submissionRoutes = require('./routes/submission');
const authRoutes = require('./routes/auth');

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

// ✅ Handle preflight requests for all routes
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Optional: Explicit CORS headers (safety net)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigins.includes(req.headers.origin) ? req.headers.origin : '');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// ✅ Log all request origins (for debugging)
app.use((req, res, next) => {
  console.log('🌍 Request Origin:', req.headers.origin);
  next();
});

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
app.use('/api', dashboardRoutes);               // /api/dashboard/data
app.use('/api/submission', submissionRoutes);   // /api/submission/analyze

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
