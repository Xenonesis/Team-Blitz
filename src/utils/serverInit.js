import { initializeScheduler } from './scheduler.js';
import { productionConfig } from '@/config/production';

let schedulerInitialized = false;

import logger from './logger.js';
import { validateEnvironment } from './envValidation.js';

export const initializeServer = () => {
  try {
    // Skip initialization during build process
    // Environment variables (kept as comments for reference):
    // CI, NETLIFY, NODE_ENV=production
    const isBuildEnvironment = process.env.CI || process.env.NETLIFY || process.env.NODE_ENV === 'test';
    if (isBuildEnvironment) {
      logger.info('Build environment detected - skipping server initialization');
      return;
    }

    // Validate environment first
    validateEnvironment();
    
    if (!schedulerInitialized && productionConfig.isProduction) {
      logger.info('Initializing Team Blitz server...');
      
      // Check if email service is configured
      const hasEmailConfig = productionConfig.gmailUser && 
                            productionConfig.gmailAppPassword && 
                            productionConfig.gmailUser.trim() !== '' && 
                            productionConfig.gmailAppPassword.trim() !== '';
      
      if (hasEmailConfig) {
        // Initialize the email scheduler
        initializeScheduler();
        logger.success('Email scheduler initialized with Gmail configuration');
      } else {
        logger.info('Email service not configured - scheduler disabled');
        logger.info('Core application functionality available without email features');
      }
      
      schedulerInitialized = true;
      logger.success('Server initialization complete!');
    } else if (productionConfig.isDevelopment) {
      logger.info('Development mode - scheduler initialization skipped');
      logger.info('Use manual notification trigger for testing');
    }
  } catch (error) {
    logger.error('Server initialization failed:', error);
    throw error;
  }
};
