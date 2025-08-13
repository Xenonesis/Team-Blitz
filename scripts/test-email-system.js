const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin using environment variables
const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID || "teamblitz-45f98",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || "teamblitz-45f98",
  });
}

const db = admin.firestore();

async function testEmailSystem() {
  console.log('🧪 Testing Email Access System...\n');
  
  try {
    // Test 1: Get all allowed emails
    console.log('📋 Test 1: Fetching allowed emails from database');
    const allowedSnapshot = await db.collection('allowed_emails')
      .where('status', '==', 'allowed')
      .get();
    
    const allowedEmails = allowedSnapshot.docs.map(doc => doc.data().email);
    console.log(`✅ Found ${allowedEmails.length} allowed emails:`);
    allowedEmails.forEach(email => console.log(`   - ${email}`));
    
    // Test 2: Get all blocked emails
    console.log('\n📋 Test 2: Fetching blocked emails from database');
    const blockedSnapshot = await db.collection('allowed_emails')
      .where('status', '==', 'blocked')
      .get();
    
    const blockedEmails = blockedSnapshot.docs.map(doc => doc.data().email);
    console.log(`✅ Found ${blockedEmails.length} blocked emails:`);
    if (blockedEmails.length > 0) {
      blockedEmails.forEach(email => console.log(`   - ${email}`));
    } else {
      console.log('   (No blocked emails)');
    }
    
    // Test 3: Get all registered users
    console.log('\n👥 Test 3: Fetching registered users from database');
    const usersSnapshot = await db.collection('users').get();
    const userEmails = usersSnapshot.docs.map(doc => doc.data().email);
    console.log(`✅ Found ${userEmails.length} registered users:`);
    userEmails.forEach(email => console.log(`   - ${email}`));
    
    // Test 4: Check access status for each registered user
    console.log('\n🔍 Test 4: Checking access status for registered users');
    for (const userEmail of userEmails) {
      const isAllowed = allowedEmails.includes(userEmail);
      const isBlocked = blockedEmails.includes(userEmail);
      
      let status = 'NO ACCESS';
      if (isAllowed) status = 'ALLOWED';
      if (isBlocked) status = 'BLOCKED';
      
      console.log(`   ${userEmail}: ${status}`);
    }
    
    // Test 5: Show statistics
    console.log('\n📊 Test 5: Email System Statistics');
    console.log(`   Total Allowed Emails: ${allowedEmails.length}`);
    console.log(`   Total Blocked Emails: ${blockedEmails.length}`);
    console.log(`   Total Registered Users: ${userEmails.length}`);
    
    const registeredWithAccess = userEmails.filter(email => allowedEmails.includes(email)).length;
    const registeredWithoutAccess = userEmails.filter(email => !allowedEmails.includes(email) && !blockedEmails.includes(email)).length;
    const registeredBlocked = userEmails.filter(email => blockedEmails.includes(email)).length;
    
    console.log(`   Registered Users with Access: ${registeredWithAccess}`);
    console.log(`   Registered Users without Access: ${registeredWithoutAccess}`);
    console.log(`   Registered Users Blocked: ${registeredBlocked}`);
    
    const invitedNotRegistered = allowedEmails.filter(email => !userEmails.includes(email)).length;
    console.log(`   Invited but Not Registered: ${invitedNotRegistered}`);
    
    console.log('\n✅ Email system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing email system:', error);
    process.exit(1);
  }
}

// Run test
testEmailSystem()
  .then(() => {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });