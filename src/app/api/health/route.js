import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { validateEnvironment } from '@/utils/envValidation';
import logger from '@/utils/logger';

export async function GET() {
  const startTime = Date.now();
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    checks: {}
  };

  try {
    // Environment validation
    try {
      validateEnvironment();
      health.checks.environment = { status: 'healthy', message: 'All required environment variables present' };
    } catch (error) {
      health.checks.environment = { status: 'unhealthy', message: error.message };
      health.status = 'unhealthy';
    }

    // Database connectivity
    try {
      await dbConnect();
      health.checks.database = { status: 'healthy', message: 'Database connection successful' };
    } catch (error) {
      health.checks.database = { status: 'unhealthy', message: 'Database connection failed' };
      health.status = 'unhealthy';
    }

    // Firebase configuration
    try {
      const firebaseConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
      };
      
      if (firebaseConfig.projectId && firebaseConfig.clientEmail && firebaseConfig.privateKey) {
        health.checks.firebase = { status: 'healthy', message: 'Firebase configuration present' };
      } else {
        health.checks.firebase = { status: 'unhealthy', message: 'Firebase configuration incomplete' };
        health.status = 'unhealthy';
      }
    } catch (error) {
      health.checks.firebase = { status: 'unhealthy', message: 'Firebase configuration error' };
      health.status = 'unhealthy';
    }

    // Response time
    const responseTime = Date.now() - startTime;
    health.responseTime = `${responseTime}ms`;

    // Log health check
    logger.logEvent('health_check', {
      status: health.status,
      responseTime: responseTime,
      checks: Object.keys(health.checks).map(key => ({
        name: key,
        status: health.checks[key].status
      }))
    });

    const statusCode = health.status === 'healthy' ? 200 : 503;
    return NextResponse.json(health, { status: statusCode });

  } catch (error) {
    logger.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      responseTime: `${Date.now() - startTime}ms`
    }, { status: 503 });
  }
}