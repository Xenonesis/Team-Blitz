import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { adminDb } = await import('@/utils/firebaseAdmin');
    
    // Test basic operations
    const tests = [];
    
    // Test 1: Read from users collection
    try {
      const usersSnapshot = await adminDb.collection('users').limit(1).get();
      tests.push({
        operation: 'Read users collection',
        status: 'success',
        count: usersSnapshot.size
      });
    } catch (error) {
      tests.push({
        operation: 'Read users collection',
        status: 'error',
        error: error.message
      });
    }
    
    // Test 2: Write to test collection
    try {
      await adminDb.collection('_test').add({
        test: true,
        timestamp: new Date()
      });
      tests.push({
        operation: 'Write to test collection',
        status: 'success'
      });
    } catch (error) {
      tests.push({
        operation: 'Write to test collection',
        status: 'error',
        error: error.message
      });
    }
    
    // Test 3: Read from allowed_emails collection
    try {
      const emailsSnapshot = await adminDb.collection('allowed_emails').limit(1).get();
      tests.push({
        operation: 'Read allowed_emails collection',
        status: 'success',
        count: emailsSnapshot.size
      });
    } catch (error) {
      tests.push({
        operation: 'Read allowed_emails collection',
        status: 'error',
        error: error.message
      });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Firestore operations test completed',
      tests,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}