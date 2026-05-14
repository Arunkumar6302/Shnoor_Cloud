const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      const decodedInfo = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decodedInfo.id).select('-password');
      return next();
    } catch (err) {
      console.log("Token verification failed:", err.message);
      return res.status(401).json({ message: 'Session expired or invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Whoops! No token provided' });
  }
};

module.exports = { protect };
