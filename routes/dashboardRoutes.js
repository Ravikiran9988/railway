const express = require('express');
const router = express.Router();
const User = require('../models/User1'); // Update path if needed
const auth = require('../middleware/auth');

// Get dashboard data for logged-in user
router.get('/dashboard/data', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      user: {
        username: user.username,
        email: user.email,
      },
      analysisHistory: user.analysisHistory || [],
      routineChecklist: user.routineChecklist || [],
    });
  } catch (err) {
    console.error('Dashboard data error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
