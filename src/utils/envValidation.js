import logger from './logger.js';
import { productionConfig } from '@/config/production';

// Environment variables (kept as comments for reference):
// NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDlGIXeOtusP7iP7m6qgKmBH1xo8ulVJFI
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=teamblitz-45f98.firebaseapp.com
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=teamblitz-45f98
// FIREBASE_PROJECT_ID=teamblitz-45f98
// FIREBASE_PRIVATE_KEY=...
// FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@teamblitz-45f98.iam.gserviceaccount.com
// JWT_SECRET=TeamBlitz2025ProductionSecureJWTSecretKey64CharactersLongForMaximumSecurity
// ADMIN_SECRET=TeamBlitzAdminSecret2025ProductionReady
// NEXT_PUBLIC_BASE_URL=https://teamblitz.netlify.app
// GMAIL_USER=
// GMAIL_APP_PASSWORD=
// JWT_EXPIRES_IN=7d

// Validate configuration (now using direct values)
export const validateEnvironment = () => {
  const missing = [];
  const warnings = [];

  // Check required configuration values
  const requiredConfigs = [
    { key: 'firebaseApiKey', value: productionConfig.firebaseApiKey },
    { key: 'firebaseAuthDomain', value: productionConfig.firebaseAuthDomain },
    { key: 'firebaseProjectId', value: productionConfig.firebaseProjectId },
    { key: 'adminFirebaseProjectId', value: productionConfig.adminFirebaseProjectId },
    { key: 'firebasePrivateKey', value: productionConfig.firebasePrivateKey },
    { key: 'firebaseClientEmail', value: productionConfig.firebaseClientEmail },
    { key: 'jwtSecret', value: productionConfig.jwtSecret },
    { key: 'adminSecret', value: productionConfig.adminSecret },
    { key: 'baseUrl', value: productionConfig.baseUrl }
  ];

  requiredConfigs.forEach(config => {
    if (!config.value) {
      missing.push(config.key);
    }
  });

  // Check recommended configuration values
  const recommendedConfigs = [
    { key: 'gmailUser', value: productionConfig.gmailUser },
    { key: 'gmailAppPassword', value: productionConfig.gmailAppPassword },
    { key: 'jwtExpiresIn', value: productionConfig.jwtExpiresIn }
  ];

  recommendedConfigs.forEach(config => {
    if (!config.value) {
      warnings.push(config.key);
    }
  });

  // Log results
  if (missing.length > 0) {
    logger.error('Missing required configuration values:', missing);
    throw new Error(`Missing required configuration values: ${missing.join(', ')}`);
  }

  if (warnings.length > 0) {
    logger.warn('Missing recommended configuration values:', warnings);
  }

  // Validate JWT secret strength in production
  if (productionConfig.isProduction) {
    const jwtSecret = productionConfig.jwtSecret;
    if (jwtSecret && jwtSecret.length < 32) {
      logger.warn('JWT_SECRET should be at least 32 characters long for production');
    }
  }

  logger.success('Configuration validation completed - all required values present');
  return true;
};

// Get environment-specific configuration
export const getConfig = () => {
  return {
    isDevelopment: productionConfig.isDevelopment,
    isProduction: productionConfig.isProduction,
    baseUrl: productionConfig.baseUrl,
    jwtSecret: productionConfig.jwtSecret,
    jwtExpiresIn: productionConfig.jwtExpiresIn,
    adminSecret: productionConfig.adminSecret,
    firebase: {
      projectId: productionConfig.adminFirebaseProjectId,
      privateKey: productionConfig.firebasePrivateKey.replace(/\\n/g, '\n'),
      clientEmail: productionConfig.firebaseClientEmail,
    },
    email: {
      user: productionConfig.gmailUser,
      password: productionConfig.gmailAppPassword,
    }
  };
};