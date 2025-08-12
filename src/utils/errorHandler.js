import { NextResponse } from 'next/server';
import logger from './logger.js';

// Production-ready error handler
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler for API routes
export const handleApiError = (error, context = {}) => {
  logger.error('API Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && !error.isOperational) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Internal server error';

  return NextResponse.json(
    { error: message },
    { status: statusCode }
  );
};

// Async error wrapper for API routes
export const asyncHandler = (fn) => {
  return async (req, ...args) => {
    try {
      return await fn(req, ...args);
    } catch (error) {
      return handleApiError(error, { url: req.url, method: req.method });
    }
  };
};

// Validation error handler
export const handleValidationError = (errors) => {
  const formattedErrors = errors.map(error => ({
    field: error.path,
    message: error.message
  }));

  throw new AppError('Validation failed', 400, true);
};

// Database error handler
export const handleDatabaseError = (error) => {
  logger.error('Database Error:', error);
  
  if (error.code === 11000) {
    throw new AppError('Duplicate entry found', 409, true);
  }
  
  if (error.name === 'ValidationError') {
    throw new AppError('Invalid data provided', 400, true);
  }
  
  throw new AppError('Database operation failed', 500, false);
};