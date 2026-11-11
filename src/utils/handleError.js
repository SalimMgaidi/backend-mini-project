// controller handler
const ApiError = require('./ApiError');

const handleError = (res, err) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ success: false, message });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Server error' });
};


module.exports = handleError;