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

async function createAdminUser() {
  try {
    console.log('🚀 Creating admin user...');

    // Check if admin user already exists
    const existingAdmin = await db.collection('users')
      .where('email', '==', 'admin@teamblitz.com')
      .limit(1)
      .get();

    if (!existingAdmin.empty) {
      console.log('⚠️  Admin user already exists!');
      console.log('📝 Login credentials:');
      console.log('   Email: admin@teamblitz.com');
      console.log('   Password: admin123');
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const adminUser = {
      username: 'admin',
      email: 'admin@teamblitz.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to Firestore
    const docRef = await db.collection('users').add(adminUser);
    console.log('✅ Admin user created successfully!');
    console.log(`📄 Document ID: ${docRef.id}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('   Email: admin@teamblitz.com');
    console.log('   Password: admin123');
    
    console.log('\n⚠️  Security Note:');
    console.log('   Please change the admin password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    
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

createAdminUser();