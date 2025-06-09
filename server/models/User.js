const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  settings: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true }
  }
});

module.exports = mongoose.model('User', UserSchema);
