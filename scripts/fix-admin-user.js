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

async function fixAdminUser() {
  try {
    console.log('🔧 Fixing admin user...\n');

    // Find the admin user
    const adminQuery = await db.collection('users')
      .where('email', '==', 'admin@teamblitz.com')
      .limit(1)
      .get();

    if (adminQuery.empty) {
      console.log('❌ Admin user not found!');
      return;
    }

    const adminDoc = adminQuery.docs[0];
    const adminData = adminDoc.data();
    
    console.log('📝 Current admin user data:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Username: ${adminData.username || 'undefined'}`);
    console.log(`   Role: ${adminData.role}`);
    console.log(`   Active: ${adminData.isActive}`);

    // Hash the password properly
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Update with all required fields
    const updateData = {
      username: 'admin',
      email: 'admin@teamblitz.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      updatedAt: new Date()
    };

    // Add createdAt if it doesn't exist
    if (!adminData.createdAt) {
      updateData.createdAt = new Date();
    }

    await db.collection('users').doc(adminDoc.id).update(updateData);
    
    console.log('\n✅ Admin user updated successfully!');
    console.log('📝 Updated fields:');
    console.log('   ✅ Username: admin');
    console.log('   ✅ Email: admin@teamblitz.com');
    console.log('   ✅ Password: admin123 (hashed)');
    console.log('   ✅ Role: admin');
    console.log('   ✅ Active: true');
    
    // Verify the password works
    const isPasswordValid = await bcrypt.compare('admin123', hashedPassword);
    console.log(`   ✅ Password verification: ${isPasswordValid ? 'PASS' : 'FAIL'}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('   Email: admin@teamblitz.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error fixing admin user:', error);
  } finally {
    process.exit(0);
  }
}

fixAdminUser();