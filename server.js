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

const allowedOrigins = [
  'http://localhost:5173',
  'https://radiant.phi-ten.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
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
app.use('/api', authRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('🌟 Radiant Skincare API');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

