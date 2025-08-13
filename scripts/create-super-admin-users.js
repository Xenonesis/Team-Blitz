const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
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
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();

async function createSuperAdminUsers() {
  try {
    console.log('🚀 Creating super admin users...');

    const superAdminEmails = [
      'itisaddy7@gmail.com',
      'aayushtonk02@gmail.com'
    ];

    const defaultPassword = 'SuperAdmin123!';
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    for (const email of superAdminEmails) {
      // Check if user already exists
      const existingUser = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (!existingUser.empty) {
        console.log(`⚠️  User ${email} already exists!`);
        continue;
      }

      // Create super admin user
      const adminUser = {
        username: email.split('@')[0], // Use email prefix as username
        email: email,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to Firestore
      const docRef = await db.collection('users').add(adminUser);
      console.log(`✅ Super admin user created: ${email}`);
      console.log(`📄 Document ID: ${docRef.id}`);
    }
    
    console.log('\n🔐 Login Credentials for Super Admins:');
    superAdminEmails.forEach(email => {
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${defaultPassword}`);
      console.log('   ---');
    });
    
    console.log('\n⚠️  Security Note:');
    console.log('   Please change passwords after first login!');
    
    console.log('\n🌐 Access URLs:');
    console.log('   Login: /admin/login');
    console.log('   Admin Panel: /admin');
    
  } catch (error) {
    console.error('❌ Error creating super admin users:', error);
    
    if (error.code === 5) {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Make sure Firestore API is enabled');
      console.log('   2. Create a Firestore database in Firebase Console');
      console.log('   3. Check your Firebase credentials in .env.local');
    }
  } finally {
    process.exit(0);
  }
}

createSuperAdminUsers();