const User = require('../models/User');
const jwt = require('jsonwebtoken');

const genToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use!' });
    }
    
    const user = await User.create({ name, email, password });
    
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      storageUsed: user.storageUsed,
      storageLimit: user.storageLimit,
      token: genToken(user._id),
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Oops! Invalid email or password' });
    }
    
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      storageUsed: user.storageUsed,
      storageLimit: user.storageLimit,
      token: genToken(user._id),
    });
  } catch (err) {
    console.log("Login err:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      storageUsed: user.storageUsed,
      storageLimit: user.storageLimit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
