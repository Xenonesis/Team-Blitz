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
    const envResult = validateEnvironment();
    
    if (envResult.status === 'degraded') {
      logger.warn('Environment validation returned degraded status - some features may not work');
      logger.warn('Placeholder values detected:', envResult.placeholders || []);
      // Continue with limited functionality
    }
    
    if (!schedulerInitialized && process.env.NODE_ENV !== 'development') {
      logger.info('Initializing Team Blitz server...');
      
      // Only initialize scheduler if we have proper email configuration
      const hasEmailConfig = process.env.GMAIL_USER && 
                            process.env.GMAIL_APP_PASSWORD && 
                            !process.env.GMAIL_USER.includes('placeholder') &&
                            !process.env.GMAIL_APP_PASSWORD.includes('placeholder');
      
      if (hasEmailConfig) {
        // Initialize the email scheduler
        initializeScheduler();
        logger.success('Email scheduler initialized');
      } else {
        logger.warn('Email configuration missing or using placeholders - scheduler disabled');
      }
      
      schedulerInitialized = true;
      logger.success('Server initialization complete!');
    } else if (process.env.NODE_ENV === 'development') {
      logger.info('Development mode - scheduler initialization skipped');
      logger.info('Use manual notification trigger for testing');
    }
  } catch (error) {
    logger.error('Server initialization failed:', error);
    // Don't throw error during build or with placeholder values
    if (!process.env.CI && !process.env.NETLIFY && process.env.NODE_ENV !== 'production') {
      throw error;
    } else {
      logger.warn('Continuing with limited functionality due to initialization error');
    }
  }
};
