const jwt = require('jsonwebtoken');
const User = require('src/models/User');





const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {

      return res.status(401).json({ success: false, message: 'Authentication required (missing token)' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }



    req.user = user;
    next();
  } catch (err) {
   
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' });
  }
  next();
};

module.exports = { protect, authorize }