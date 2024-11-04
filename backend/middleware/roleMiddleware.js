// backend/middleware/roleMiddleware.js

exports.requireRole = (role) => {
    return (req, res, next) => {
      const user = req.user;  // Assuming req.user contains decoded JWT payload
  
      if (user && user.role === role) {
        next();  // User has the required role, proceed
      } else {
        res.status(403).json({ message: 'Forbidden: Insufficient role privileges' });
      }
    };
  };
  