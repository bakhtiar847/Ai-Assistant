const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  agentId: mongoose.Schema.Types.ObjectId,
  messages: [{
    sender: String, // 'user' or agent name
    content: String,
    timestamp: Date
  }]
});
module.exports = mongoose.model('Chat', chatSchema);
