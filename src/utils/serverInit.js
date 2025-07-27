import { initializeScheduler } from './scheduler.js';

let schedulerInitialized = false;

export const initializeServer = () => {
  if (!schedulerInitialized && process.env.NODE_ENV !== 'development') {
    console.log('🚀 Initializing Team Blitz server...');
    
    // Initialize the email scheduler
    initializeScheduler();
    
    schedulerInitialized = true;
    console.log('✅ Server initialization complete!');
  } else if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Development mode - scheduler initialization skipped');
    console.log('💡 Use manual notification trigger for testing');
  }
};
