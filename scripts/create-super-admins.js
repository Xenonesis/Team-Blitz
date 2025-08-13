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

async function createSuperAdmins() {
  try {
    console.log('🚀 Creating Super Admin Users...\n');

    const superAdmins = [
      {
        username: 'addy',
        email: 'itisaddy7@gmail.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        username: 'aayush',
        email: 'aayushtonk02@gmail.com',
        password: 'admin123',
        role: 'admin'
      }
    ];

    for (const adminData of superAdmins) {
      console.log(`🔍 Checking ${adminData.email}...`);
      
      // Check if user already exists
      const existingUser = await db.collection('users')
        .where('email', '==', adminData.email)
        .limit(1)
        .get();

      if (!existingUser.empty) {
        console.log(`✅ ${adminData.email} already exists!`);
        continue;
      }

      // Hash the password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Create user
      const userData = {
        username: adminData.username,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to Firestore
      const docRef = await db.collection('users').add(userData);
      console.log(`✅ ${adminData.email} created successfully! (ID: ${docRef.id})`);
    }
    
    console.log('\n🎉 Super Admin Setup Complete!');
    console.log('\n🔐 Login Credentials:');
    console.log('   Email: itisaddy7@gmail.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('   Email: aayushtonk02@gmail.com');
    console.log('   Password: admin123');
    
    console.log('\n⚠️  Security Notes:');
    console.log('   1. Change passwords after first login!');
    console.log('   2. Only these emails can access /admin');
    console.log('   3. These users have full admin privileges');
    
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

createSuperAdmins();