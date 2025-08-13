const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Import the allowed emails from config
const { ALLOWED_EMAILS, SUPER_ADMIN_EMAILS } = require('../src/config/allowedEmails.js');

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

async function migrateAllowedEmails() {
  console.log('Starting migration of allowed emails to database...');
  
  try {
    const allowedEmailsCollection = db.collection('allowed_emails');
    
    // Combine all emails (SUPER_ADMIN_EMAILS are also allowed)
    const allAllowedEmails = [...new Set([...ALLOWED_EMAILS, ...SUPER_ADMIN_EMAILS])];
    
    console.log(`Found ${allAllowedEmails.length} emails to migrate`);
    
    const batch = db.batch();
    let count = 0;
    
    for (const email of allAllowedEmails) {
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if email already exists
      const existingDoc = await allowedEmailsCollection.where('email', '==', normalizedEmail).get();
      
      if (existingDoc.empty) {
        // Add new email
        const docRef = allowedEmailsCollection.doc();
        batch.set(docRef, {
          email: normalizedEmail,
          status: 'allowed',
          addedBy: 'system_migration',
          addedAt: new Date(),
          updatedAt: new Date()
        });
        count++;
        console.log(`Queued for migration: ${normalizedEmail}`);
      } else {
        console.log(`Already exists: ${normalizedEmail}`);
      }
    }
    
    if (count > 0) {
      await batch.commit();
      console.log(`✅ Successfully migrated ${count} emails to database`);
    } else {
      console.log('✅ No new emails to migrate - all emails already exist in database');
    }
    
    // Verify migration
    const allDocs = await allowedEmailsCollection.where('status', '==', 'allowed').get();
    console.log(`📊 Total allowed emails in database: ${allDocs.size}`);
    
    console.log('\n📋 Current allowed emails in database:');
    allDocs.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${data.email} (added by: ${data.addedBy})`);
    });
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

// Run migration
migrateAllowedEmails()
  .then(() => {
    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });