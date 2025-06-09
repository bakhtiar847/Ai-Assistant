const express = require('express');
const passport = require('passport');
const router = express.Router();

// Login route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login'
}));

// Register, Logout, etc.

module.exports = router;
