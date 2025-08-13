const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin using environment variables
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

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || "teamblitz-45f98",
    });
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
    console.log('Make sure your Firebase environment variables are set in .env.local');
    process.exit(1);
  }
}

const db = admin.firestore();

async function updateEmailAddress() {
  console.log('🔄 Updating email address from aayushtonk@02@gmail.com to aayushtonk02@gmail.com...\n');
  
  const oldEmail = 'aayushtonk@02@gmail.com';
  const newEmail = 'aayushtonk02@gmail.com';
  
  try {
    // Update in allowed_emails collection
    console.log('📋 Updating allowed_emails collection...');
    const allowedEmailsQuery = await db.collection('allowed_emails')
      .where('email', '==', oldEmail)
      .get();
    
    if (!allowedEmailsQuery.empty) {
      const batch = db.batch();
      allowedEmailsQuery.docs.forEach(doc => {
        batch.update(doc.ref, { 
          email: newEmail,
          updatedAt: new Date()
        });
      });
      await batch.commit();
      console.log(`✅ Updated ${allowedEmailsQuery.docs.length} record(s) in allowed_emails collection`);
    } else {
      console.log('ℹ️  No records found in allowed_emails collection with old email');
    }
    
    // Update in users collection
    console.log('\n👥 Updating users collection...');
    const usersQuery = await db.collection('users')
      .where('email', '==', oldEmail)
      .get();
    
    if (!usersQuery.empty) {
      const batch = db.batch();
      usersQuery.docs.forEach(doc => {
        batch.update(doc.ref, { 
          email: newEmail,
          updatedAt: new Date()
        });
      });
      await batch.commit();
      console.log(`✅ Updated ${usersQuery.docs.length} record(s) in users collection`);
    } else {
      console.log('ℹ️  No records found in users collection with old email');
    }
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    
    // Check allowed_emails
    const verifyAllowedEmails = await db.collection('allowed_emails')
      .where('email', '==', newEmail)
      .get();
    console.log(`✅ Found ${verifyAllowedEmails.docs.length} record(s) with new email in allowed_emails`);
    
    // Check users
    const verifyUsers = await db.collection('users')
      .where('email', '==', newEmail)
      .get();
    console.log(`✅ Found ${verifyUsers.docs.length} record(s) with new email in users`);
    
    // Check for any remaining old email records
    const checkOldAllowedEmails = await db.collection('allowed_emails')
      .where('email', '==', oldEmail)
      .get();
    const checkOldUsers = await db.collection('users')
      .where('email', '==', oldEmail)
      .get();
    
    if (checkOldAllowedEmails.empty && checkOldUsers.empty) {
      console.log('\n🎉 Email address update completed successfully!');
      console.log(`📧 Old email: ${oldEmail}`);
      console.log(`📧 New email: ${newEmail}`);
    } else {
      console.log('\n⚠️  Warning: Some old email records may still exist');
      console.log(`Old records in allowed_emails: ${checkOldAllowedEmails.docs.length}`);
      console.log(`Old records in users: ${checkOldUsers.docs.length}`);
    }
    
  } catch (error) {
    console.error('❌ Error updating email address:', error);
    process.exit(1);
  }
}

// Run update
updateEmailAddress()
  .then(() => {
    console.log('\n✅ Update process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Update failed:', error);
    process.exit(1);
  });