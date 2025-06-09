const express = require('express');
const passport = require('passport');
const router = express.Router();

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home.html',
  failureRedirect: '/login.html'
}));

router.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/login.html');
});

module.exports = router;
