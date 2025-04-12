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

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// ✅ API Routes
app.use('/api/auth', authRoutes);         // e.g. /api/auth/send-otp
app.use('/api', authRoutes); // Includes /user/me route
app.use('/api', dashboardRoutes);
app.use('/api', submissionRoutes);
app.use('/api', authRoutes); // Includes /user/me route


// ✅ Health check
app.get('/', (req, res) => {
  res.send('🌟 Radiant Skincare API');
});

// ✅ Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
