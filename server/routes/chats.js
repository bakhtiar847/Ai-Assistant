const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Get all chats for a user
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new chat
router.post('/', async (req, res) => {
  try {
    const newChat = new Chat({ userId: req.user._id, messages: [] });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
