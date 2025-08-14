import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { validateEnvironment } from '@/utils/envValidation';
import logger from '@/utils/logger';

export async function GET() {
  const startTime = Date.now();
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: 'production',
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

    // Firebase configuration (using direct values)
    // FIREBASE_PROJECT_ID=teamblitz-45f98
    // FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@teamblitz-45f98.iam.gserviceaccount.com
    // FIREBASE_PRIVATE_KEY=...
    try {
      const firebaseConfig = {
        projectId: "teamblitz-45f98",
        clientEmail: "firebase-adminsdk-fbsvc@teamblitz-45f98.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFCHOffbfeJGpK\nBTwK2PX9jMv4krHqD2gAtfjtlaZuE9u+9H2jJaEe3cQwYsgbFIg/dvxyW9ijmbMc\n87O+/VxKNgEvtrgaCGrEY+RDZdlYi3MdT2p7sZM6sBPMjkRlWCweLez7gYnxaakN\nQqwkM3xj4pVkI0I10IR2cJkUTW24VjY+DI3AfdsnPb6BC9HJjS+/wzeEeJz6HKOC\nVQmPdGIDW9AtO6EL6zFwQQPgWh6kze5mKF9q9+/OFuu9TNstpD/cAEkw7AMXbH3W\ngeIXkPCaOSNKNRoXtmI9r05TzET+UuT1Cvt1Mch3YNv0g08ROcbZutmGHp9UVC2U\n9N+wboADAgMBAAECggEAMiBZUg0o1vIKvHQid1wFERFd3wprCvIKcovZHZCB++U/\ndZA72mK7X9/phqnK4ODTXNoHlYx6S/zRTZ9ObluEvDiLCrmAktbrWrVTIDZsGhO4\nII/QtlFR9I9RKixTiDjrWG40qTOmhW1tHbuFkdwrXDoL6aLyuEApQvyYZUrhjBCo\nbDIhXylfBgB3eAJEwzddM+/ln1+0YaKpZKcHbjyNwYe8mq0UuJn58BoIhLbln6gg\nkoXyx6ss7LJVwKdJcNJBToG4W1q/UbqxzT/cgm5M/7sUKSPNmCUw1BSYzY1mr+wk\ncXTZ9ic2gIjMklq0RLCWocMuHUxCqFlnGG2h1AsViQKBgQDrOyfY4jiYheAnac5q\nSSk7Q6PAWbpik81pzGHEF+l2qB8JaWLe0xdeJti7yG0o/5NXRaG4HP4RkTgAlToR\nyyneTt1pTA3TObLHz1l+4jtcs+F0k6GgeiIsnIyriZUZ6/gOn0lgijoif7jbhQ2Y\nZIl9dSxopKY5/0deaca184PmPwKBgQDWbes1PWycM2gpeFf4c+fTVKFmMkrUeTW0\n1LqZDQvhDW4nQnZFXeWkq5kBl0wihGPfydAiSDAumnsryEsij1zqGXz9gtR5CWhn\nD/X7xzeVnnP/SdqRpUZRdl4O7U/ekoDZOkxqbeevbfCr3L8cvjW9evIXY6r5Hz+E\naW4nvzSdPQKBgQCqjG1LllkqXIY0jUYXUYwPZ+8l2uiD6F2aQ5Dut9eRLDu0ezAw\nFiRvIwMowxxCCWsub1HdR0f+PKe55HgBxqdIgy2M1pN/fendbLyafjRD9jeUaiVZ\nULPOXIKxLENqU+e50ktFL3MO6EODBWjiAKKez4GvLRFII4n/LfngmfobyQKBgQCP\ndKhITRjNg6LrI6UPBlQRUWxNV9YyQglJOoy/+jd5UCfiwhcoH0KUoWzS4KrB6Pp8\nbKL/XHZHp3hB+VUzAOCziWvSmuWVOFMNqGL0F/q68XA/WeSNTho2Q893gxLNIAxt\nyA/5oB/BgPbjs+Jz01lWs9slBLwMwPgYmQRmOQh1LQKBgGqXGkXq79arRfuR24al\nT1Dx2tVwa94/bmz/Ni5bnhKsHMJCltF6UTG0EFJnQJN7w8H/zylhQFmS91wrIqG6\nP4A7b+tFdxYxhF13ajCBzxG8qricYs5nsVN65Zexo56SdDNhmr8JlySNYXJWcMbr\nxZhRFt0CkvSBVLFbRj83vDf9\n-----END PRIVATE KEY-----\n"
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