// Production-ready logging utility
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

class Logger {
  constructor() {
    this.isDev = isDevelopment;
    this.isProd = isProduction;
  }

  // Info level logging
  info(message, ...args) {
    if (this.isDev) {
      console.log(`ℹ️ ${message}`, ...args);
    } else if (this.isProd) {
      // In production, you might want to send to a logging service
      // For now, we'll keep essential logs
      if (this.isEssentialLog(message)) {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
      }
    }
  }

  // Error level logging (always logged)
  error(message, ...args) {
    console.error(`❌ [ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  }

  // Warning level logging
  warn(message, ...args) {
    if (this.isDev) {
      console.warn(`⚠️ ${message}`, ...args);
    } else if (this.isProd) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }

  // Debug level logging (development only)
  debug(message, ...args) {
    if (this.isDev) {
      console.debug(`🐛 ${message}`, ...args);
    }
  }

  // Success level logging
  success(message, ...args) {
    if (this.isDev) {
      console.log(`✅ ${message}`, ...args);
    } else if (this.isProd && this.isEssentialLog(message)) {
      console.log(`[SUCCESS] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }

  // Check if log is essential for production
  isEssentialLog(message) {
    const essentialKeywords = [
      'server initialization',
      'database connection',
      'authentication',
      'stage update',
      'email sent',
      'error',
      'failed',
      'success'
    ];
    
    return essentialKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Structured logging for production monitoring
  logEvent(event, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      data,
      environment: process.env.NODE_ENV
    };

    if (this.isProd) {
      console.log(JSON.stringify(logEntry));
    } else {
      console.log(`📊 Event: ${event}`, data);
    }
  }
}

export default new Logger();