const express = require('express');
const router = express.Router();
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

// Define rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// Get user settings
router.get('/', limiter, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings');
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user settings
router.post('/', limiter, async (req, res) => {
  try {
    const { theme, notifications } = req.body;
    const user = await User.findById(req.user._id);
    user.settings.theme = theme;
    user.settings.notifications = notifications;
    await user.save();
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
