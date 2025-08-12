import { isMockMode, mockDbConnect } from './mockFirebase.js';

let isConnected = false;
let connectionPromise = null;

// Firebase connection check
async function dbConnect() {
  // Return existing connection if already connected
  if (isConnected) {
    return true;
  }
  
  // Return existing promise if connection is in progress
  if (connectionPromise) {
    return connectionPromise;
  }
  
  connectionPromise = connectToDatabase();
  return connectionPromise;
}

async function connectToDatabase() {
  try {
    // Use mock Firebase if credentials are missing
    if (isMockMode()) {
      console.log('\n=================================');
      console.log('\x1b[33m%s\x1b[0m', '⚠️  Mock Firebase Connection (Demo Mode)');
      console.log('\x1b[33m%s\x1b[0m', '⚠️  Using mock data for testing');
      console.log('\x1b[33m%s\x1b[0m', '⚠️  Set up real Firebase credentials to use live data');
      console.log('=================================\n');
      
      isConnected = true;
      return await mockDbConnect();
    }
    
    // Import Firebase Admin only when we have credentials
    const { adminDb } = await import('./firebaseAdmin');
    
    // Test Firebase connection by attempting to read from a collection
    await adminDb.collection('_connection_test').limit(1).get();
    
    console.log('\n=================================');
    console.log('\x1b[32m%s\x1b[0m', '✅ Firebase Database Connection Status:');
    console.log('\x1b[32m%s\x1b[0m', '✅ Connected successfully to Firebase Firestore!');
    console.log('\x1b[32m%s\x1b[0m', `✅ Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
    console.log('=================================\n');
    
    isConnected = true;
    return adminDb;
  } catch (error) {
    console.log('\n=================================');
    console.error('\x1b[31m%s\x1b[0m', '❌ Firebase Connection Error:');
    console.error('\x1b[31m%s\x1b[0m', error.message);
    console.log('\x1b[33m%s\x1b[0m', '💡 Falling back to mock mode for testing...');
    console.log('=================================\n');
    
    // Fall back to mock mode if Firebase fails
    isConnected = true;
    return await mockDbConnect();
  } finally {
    connectionPromise = null;
  }
}

export default dbConnect;