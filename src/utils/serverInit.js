import { initializeScheduler } from './scheduler.js';

let schedulerInitialized = false;

import logger from './logger.js';
import { validateEnvironment } from './envValidation.js';

export const initializeServer = () => {
  try {
    // Validate environment first
    validateEnvironment();
    
    if (!schedulerInitialized && process.env.NODE_ENV !== 'development') {
      logger.info('Initializing Team Blitz server...');
      
      // Initialize the email scheduler
      initializeScheduler();
      
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
