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
  const placeholders = [];

  // Check required variables
  REQUIRED_ENV_VARS.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      missing.push(varName);
    } else if (value.includes('placeholder') || value.includes('build-')) {
      placeholders.push(varName);
    }
  });

  // Check recommended variables
  RECOMMENDED_ENV_VARS.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      warnings.push(varName);
    } else if (value.includes('placeholder') || value.includes('build-')) {
      placeholders.push(varName);
    }
  });

  // Handle placeholder values in production
  if (placeholders.length > 0) {
    logger.warn('Using placeholder environment variables:', placeholders);
    if (process.env.NODE_ENV === 'production') {
      logger.warn('Application running with placeholder values - some features may not work correctly');
      // Don't throw error, just warn
      return { status: 'degraded', placeholders, missing, warnings };
    }
  }

  // Log results
  if (missing.length > 0) {
    logger.error('Missing required environment variables:', missing);

    // Don't fail in production with Netlify/CI or when placeholders are being used
    if (process.env.NODE_ENV === 'production' && (process.env.CI || process.env.NETLIFY || placeholders.length > 0)) {
      logger.warn('Production environment detected with missing variables - continuing with degraded functionality');
      return { status: 'degraded', missing, warnings, placeholders };
    } else if (process.env.NODE_ENV !== 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  if (warnings.length > 0) {
    logger.warn('Missing recommended environment variables:', warnings);
  }

  // Validate JWT secret strength in production (but don't fail)
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

    if (weakSecrets.includes(jwtSecret) || jwtSecret.includes('placeholder')) {
      logger.warn('Using placeholder/default JWT_SECRET - please update for security');
    }
  }

  logger.success('Environment validation completed');
  return { status: 'healthy', missing: [], warnings, placeholders };
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