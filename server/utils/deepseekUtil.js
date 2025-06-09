const axios = require('axios');

async function callDeepSeek(prompt, agentConfig) {
  // Placeholder for calling the DeepSeek API
  const response = await axios.post('https://api.deepseek.com/v1/chat', {
    prompt,
    agent: agentConfig
  });
  return response.data;
}

module.exports = { callDeepSeek };
