const jwt = require('jsonwebtoken');
const User = require('../models/User');


const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, managerKey } = req.body;

    
    let role = 'user';
    if (managerKey !== undefined) {
      if (!process.env.MANAGER_KEY || managerKey !== process.env.MANAGER_KEY) {
        return res.status(403).json({ success: false, message: 'Invalid manager key' });
      }
      role = 'manager';
    }

  
    const user = await User.create({ name, email, password, role });

   
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
   
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }
   
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ success: false, message });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }


    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /auth/me
exports.me = (req, res) => {
  res.json({ success: true, user: req.user });
};