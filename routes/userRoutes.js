const express = require('express');
const router = express.Router();
const User = require('../models/User1');
const auth = require('../middleware/auth');

// GET /api/user/me - returns logged-in user's info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('User /me error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
