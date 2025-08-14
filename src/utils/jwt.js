import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  try {
    // If using placeholder JWT_SECRET, reject all tokens gracefully
    if (JWT_SECRET.includes('placeholder') || JWT_SECRET.includes('build-time')) {
      throw new Error('Authentication temporarily unavailable - placeholder JWT secret');
    }
    
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.message.includes('placeholder')) {
      throw new Error('Authentication temporarily unavailable');
    }
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
