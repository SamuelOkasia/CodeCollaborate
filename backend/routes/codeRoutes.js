// backend/routes/codeRoutes.js

const express = require('express');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Route to handle code submission
router.post('/submit', authenticateJWT, async (req, res) => {
  const { code } = req.body;

  try {
    const newCodeReview = await prisma.codeReview.create({
      data: {
        userId: req.user.id,  // Get user ID from the decoded JWT
        code,
      },
    });

    res.json(newCodeReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit code for review' });
  }
});

// Fetch all code reviews
router.get('/reviews', authenticateJWT, async (req, res) => {
    try {
      const codeReviews = await prisma.codeReview.findMany({
        include: {
          user: true,  // Fetch user who submitted the code
          feedback: {  // Fetch feedback on the code review
            include: {
              user: true,  // Fetch user (reviewer) who left feedback
            },
          },
        },
      });
  
      res.json(codeReviews);
    } catch (error) {
      console.error('Error fetching code reviews:', error);  // Log the error
      res.status(500).json({ error: 'Failed to fetch code reviews' });
    }
  });
  
  
  // backend/routes/codeRoutes.js

// Add feedback for a code review
router.post('/reviews/:id/feedback', authenticateJWT, async (req, res) => {
    const { comment } = req.body;
    const codeReviewId = req.params.id;
  
    try {
      const newFeedback = await prisma.feedback.create({
        data: {
          userId: req.user.id,  // Reviewer ID
          codeReviewId,
          comment,
        },
      });
  
      res.json(newFeedback);
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit feedback' });
    }
  });



  

module.exports = router;
