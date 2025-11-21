const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from headers (x-auth-token or Authorization Bearer)
  const token =
    req.header('x-auth-token') ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token using secret from .env
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not defined in .env');

    const decoded = jwt.verify(token, secret);
    req.user = decoded.user; // Attach user info to request object
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    res.status(401).json({ msg: 'Token is not valid or expired' });
  }
};
