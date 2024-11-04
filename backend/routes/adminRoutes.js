// backend/routes/adminRoutes.js

const express = require('express');
const { requireRole } = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/admin', requireRole('admin'), (req, res) => {
  // Admin-only logic here
  res.json({ message: 'Welcome Admin!' });
});

module.exports = router;
