import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Debugging Firebase connection...');
    
    // Check environment variables
    const envCheck = {
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_PRIVATE_KEY_ID: !!process.env.FIREBASE_PRIVATE_KEY_ID,
      FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_CLIENT_ID: !!process.env.FIREBASE_CLIENT_ID,
      JWT_SECRET: !!process.env.JWT_SECRET,
      ADMIN_SECRET: !!process.env.ADMIN_SECRET,
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