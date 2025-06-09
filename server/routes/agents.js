const express = require('express');
const Agent = require('../models/Agent');
const router = express.Router();
// Assume you have a deepseekUtil.ask(prompt) that queries DeepSeek

router.post('/create', async (req, res) => {
  // Generate AI attributes
  const name = await deepseekUtil.ask('Generate a random human name.');
  const personality = await deepseekUtil.ask('Describe a unique AI personality.');
  const lifeStory = await deepseekUtil.ask('Write a life story for an AI agent.');

  const agent = new Agent({ name, personality, lifeStory, notes: [], files: [] });
  await agent.save();
  res.json(agent);
});
module.exports = router;
