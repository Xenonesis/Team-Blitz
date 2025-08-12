#!/usr/bin/env node

/**
 * Test script to verify Firebase connection
 * Run this after setting up your Firebase credentials
 */

import { config } from 'dotenv';
config();

async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase Connection...\n');
  
  try {
    // Test Firebase Admin connection
    console.log('📡 Testing Firebase Admin SDK...');
    const { adminDb } = await import('../src/utils/firebaseAdmin.js');
    
    // Test connection by trying to read from a collection
    const testCollection = adminDb.collection('_connection_test');
    await testCollection.limit(1).get();
    
    console.log('✅ Firebase Admin SDK connected successfully!');
    console.log(`✅ Project ID: ${process.env.FIREBASE_PROJECT_ID || 'teamblitz-45f98'}`);
    
    // Test client SDK
    console.log('\n📱 Testing Firebase Client SDK...');
    const { db } = await import('../src/utils/firebase.js');
    
    console.log('✅ Firebase Client SDK initialized successfully!');
    
    // Test database connection with dbConnect
    console.log('\n🔌 Testing database connection utility...');
    const dbConnect = (await import('../src/utils/dbConnect.js')).default;
    await dbConnect();
    
    console.log('\n🎉 All Firebase connections successful!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: node src/utils/seed.js');
    console.log('2. Run: npm run dev');
    console.log('3. Test your application');
    
  } catch (error) {
    console.error('\n❌ Firebase connection failed:');
    console.error(error.message);
    
    if (error.message.includes('private_key')) {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Make sure you have downloaded the service account JSON from Firebase Console');
      console.log('2. Update your .env.local file with the correct credentials');
      console.log('3. Check that FIREBASE_PRIVATE_KEY is properly formatted with \\n characters');
    }
    
    if (error.message.includes('project')) {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Verify your Firebase project ID is correct: teamblitz-45f98');
      console.log('2. Make sure Firestore is enabled in Firebase Console');
    }
    
    process.exit(1);
  }
}

// Run the test
testFirebaseConnection();