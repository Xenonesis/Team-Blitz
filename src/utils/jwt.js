import jwt from 'jsonwebtoken';
import { productionConfig } from '@/config/production';

// Environment variables (kept as comments for reference):
// JWT_SECRET=TeamBlitz2025ProductionSecureJWTSecretKey64CharactersLongForMaximumSecurity
// JWT_EXPIRES_IN=7d

const JWT_SECRET = productionConfig.jwtSecret;
const JWT_EXPIRES_IN = productionConfig.jwtExpiresIn;

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
