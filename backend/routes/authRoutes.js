// backend/routes/authRoutes.js

const express = require('express');
const passport = require('passport');
const jwtService = require('../services/jwtService');

const router = express.Router();

// Google OAuth login route
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/' }), 
  (req, res) => {
    const token = jwtService.generateToken(req.user); // Issue JWT
    res.redirect(`http://localhost:3000/dashboard?token=${token}`); // Redirect with token
  }
);

// GitHub OAuth login route
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const token = jwtService.generateToken(req.user);
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);

  }
);

module.exports = router;
