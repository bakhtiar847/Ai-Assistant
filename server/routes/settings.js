const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user settings
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings');
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user settings
router.post('/', async (req, res) => {
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
