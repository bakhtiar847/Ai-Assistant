const mongoose = require('mongoose');
const agentSchema = new mongoose.Schema({
  name: String,
  personality: String,
  lifeStory: String,
  notes: [String],
  files: [String]
});
module.exports = mongoose.model('Agent', agentSchema);
