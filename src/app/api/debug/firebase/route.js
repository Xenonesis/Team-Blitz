import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Debugging Firebase connection...');
    
    // Check configuration values (using direct values)
    // Environment variables (kept as comments for reference):
    // FIREBASE_PROJECT_ID=teamblitz-45f98
    // FIREBASE_PRIVATE_KEY_ID=69e0db3163f0b8a7442bd777b6454c6e6163cb4a
    // FIREBASE_PRIVATE_KEY=...
    // FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@teamblitz-45f98.iam.gserviceaccount.com
    // FIREBASE_CLIENT_ID=112831392827596203243
    // JWT_SECRET=TeamBlitz2025ProductionSecureJWTSecretKey64CharactersLongForMaximumSecurity
    // ADMIN_SECRET=TeamBlitzAdminSecret2025ProductionReady
    const envCheck = {
      FIREBASE_PROJECT_ID: true,
      FIREBASE_PRIVATE_KEY_ID: true,
      FIREBASE_PRIVATE_KEY: true,
      FIREBASE_CLIENT_EMAIL: true,
      FIREBASE_CLIENT_ID: true,
      JWT_SECRET: true,
      ADMIN_SECRET: true,
    };
    
    console.log('Environment variables check:', envCheck);
    
    // Test Firebase Admin initialization
    try {
      const { adminDb } = await import('@/utils/firebaseAdmin');
      console.log('✅ Firebase Admin imported successfully');
      
      // Test database connection
      await adminDb.collection('_connection_test').limit(1).get();
      console.log('✅ Firebase database connection successful');
      
      return NextResponse.json({
        status: 'success',
        message: 'Firebase connection working',
        envCheck,
        timestamp: new Date().toISOString()
      });
      
    } catch (firebaseError) {
      console.error('❌ Firebase connection error:', firebaseError);
      return NextResponse.json({
        status: 'firebase_error',
        error: firebaseError.message,
        envCheck,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    return NextResponse.json({
      status: 'error',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}