import { initializeScheduler } from './scheduler.js';

let schedulerInitialized = false;

import logger from './logger.js';
import { validateEnvironment } from './envValidation.js';

export const initializeServer = () => {
  try {
    // Skip initialization during build process
    if (process.env.CI || process.env.NETLIFY || process.env.NODE_ENV === 'test') {
      logger.info('Build environment detected - skipping server initialization');
      return;
    }

    // Validate environment first
    validateEnvironment();
    
    if (!schedulerInitialized && process.env.NODE_ENV !== 'development') {
      logger.info('Initializing Team Blitz server...');
      
      // Check if email service is configured
      const hasEmailConfig = process.env.GMAIL_USER && 
                            process.env.GMAIL_APP_PASSWORD && 
                            process.env.GMAIL_USER.trim() !== '' && 
                            process.env.GMAIL_APP_PASSWORD.trim() !== '';
      
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
    } else if (process.env.NODE_ENV === 'development') {
      logger.info('Development mode - scheduler initialization skipped');
      logger.info('Use manual notification trigger for testing');
    }
  } catch (error) {
    logger.error('Server initialization failed:', error);
    throw error;
  }
};
