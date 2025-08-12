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

async function debugLogin() {
  try {
    console.log('🔍 Debugging login issue...\n');

    // Check if users collection exists and has data
    const usersSnapshot = await db.collection('users').get();
    console.log(`📊 Total users in database: ${usersSnapshot.size}`);

    if (usersSnapshot.empty) {
      console.log('❌ No users found in database!');
      return;
    }

    // List all users
    console.log('\n👥 Users in database:');
    usersSnapshot.forEach((doc, index) => {
      const userData = doc.data();
      console.log(`${index + 1}. ID: ${doc.id}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Username: ${userData.username}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   Active: ${userData.isActive}`);
      console.log(`   Password Hash: ${userData.password ? 'Present' : 'Missing'}`);
      console.log('');
    });

    // Try to find the admin user specifically
    const adminQuery = await db.collection('users')
      .where('email', '==', 'admin@teamblitz.com')
      .limit(1)
      .get();

    if (adminQuery.empty) {
      console.log('❌ Admin user not found by email query!');
      
      // Try to create admin user
      console.log('🔧 Creating admin user...');
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const adminUser = {
        username: 'admin',
        email: 'admin@teamblitz.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await db.collection('users').add(adminUser);
      console.log(`✅ Admin user created with ID: ${docRef.id}`);
    } else {
      const adminDoc = adminQuery.docs[0];
      const adminData = adminDoc.data();
      
      console.log('✅ Admin user found!');
      console.log(`   Document ID: ${adminDoc.id}`);
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Username: ${adminData.username}`);
      console.log(`   Role: ${adminData.role}`);
      console.log(`   Active: ${adminData.isActive}`);
      
      // Test password comparison
      if (adminData.password) {
        const isPasswordValid = await bcrypt.compare('admin123', adminData.password);
        console.log(`   Password Test: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
        
        if (!isPasswordValid) {
          console.log('🔧 Fixing password...');
          const salt = await bcrypt.genSalt(12);
          const hashedPassword = await bcrypt.hash('admin123', salt);
          
          await db.collection('users').doc(adminDoc.id).update({
            password: hashedPassword,
            updatedAt: new Date()
          });
          
          console.log('✅ Password updated successfully!');
        }
      } else {
        console.log('❌ No password hash found!');
      }
    }

    console.log('\n🔐 Login Credentials:');
    console.log('   Email: admin@teamblitz.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    process.exit(0);
  }
}

debugLogin();