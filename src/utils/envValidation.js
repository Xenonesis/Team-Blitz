import logger from './logger.js';

// Required environment variables for production
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'JWT_SECRET',
  'ADMIN_SECRET',
  'NEXT_PUBLIC_BASE_URL'
];

// Optional but recommended environment variables
const RECOMMENDED_ENV_VARS = [
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'JWT_EXPIRES_IN'
];

// Validate environment variables
export const validateEnvironment = () => {
  const missing = [];
  const warnings = [];

  // Check required variables
  REQUIRED_ENV_VARS.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Check recommended variables
  RECOMMENDED_ENV_VARS.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  });

  // Log results
  if (missing.length > 0) {
    logger.error('Missing required environment variables:', missing);
    
    // Don't fail build during CI/CD or build process
    if (process.env.NODE_ENV === 'production' && !process.env.CI && !process.env.NETLIFY) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    } else {
      logger.warn('Build continuing despite missing environment variables - some features may not work');
    }
  }

  if (warnings.length > 0) {
    logger.warn('Missing recommended environment variables:', warnings);
  }

  // Validate JWT secret strength in production (but don't fail build)
  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET) {
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret.length < 32) {
      logger.warn('JWT_SECRET should be at least 32 characters long for production');
    }

    // Check for default/weak secrets
    const weakSecrets = [
      'your-super-secret-jwt-key-change-this-in-production',
      'team-blitz-super-secret-jwt-key-2025-production-ready'
    ];
    
    if (weakSecrets.includes(jwtSecret)) {
      logger.error('Using default JWT_SECRET in production! Please change it.');
      // Don't fail build, just warn
      logger.warn('Build continuing with default JWT_SECRET - please update for security');
    }
  }

  logger.success('Environment validation completed');
  return true;
};

// Get environment-specific configuration
export const getConfig = () => {
  return {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    adminSecret: process.env.ADMIN_SECRET,
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    },
    email: {
      user: process.env.GMAIL_USER,
      password: process.env.GMAIL_APP_PASSWORD,
    }
  };
};