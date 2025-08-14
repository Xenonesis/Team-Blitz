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

async function createSuperAdmin() {
  try {
    console.log('🚀 Creating Super Admin user...');
    console.log('📧 Email: itisaddy7@gmail.com');

    // Check if super admin user already exists
    const existingSuperAdmin = await db.collection('users')
      .where('email', '==', 'itisaddy7@gmail.com')
      .limit(1)
      .get();

    if (!existingSuperAdmin.empty) {
      console.log('⚠️  Super Admin user already exists!');
      
      // Update the existing user to ensure correct role and password
      const userDoc = existingSuperAdmin.docs[0];
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('TeamBlitz2025!', salt);
      
      await userDoc.ref.update({
        role: 'super_admin',
        password: hashedPassword,
        isActive: true,
        updatedAt: new Date()
      });
      
      console.log('✅ Super Admin user updated successfully!');
      console.log('\n🔐 Login Credentials:');
      console.log('   Email: itisaddy7@gmail.com');
      console.log('   Password: TeamBlitz2025!');
      console.log('\n🌐 Admin Panel: https://teamblitz.netlify.app/admin/login');
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('TeamBlitz2025!', salt);

    // Create super admin user
    const superAdminUser = {
      username: 'superadmin',
      email: 'itisaddy7@gmail.com',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to Firestore
    const docRef = await db.collection('users').add(superAdminUser);
    console.log('✅ Super Admin user created successfully!');
    console.log(`📄 Document ID: ${docRef.id}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('   Email: itisaddy7@gmail.com');
    console.log('   Password: TeamBlitz2025!');
    
    console.log('\n🌐 Access Admin Panel:');
    console.log('   URL: https://teamblitz.netlify.app/admin/login');
    
    console.log('\n🎯 Super Admin Capabilities:');
    console.log('   ✅ Manage all users and permissions');
    console.log('   ✅ Add/remove allowed emails');
    console.log('   ✅ Block/unblock users');
    console.log('   ✅ Reset user passwords');
    console.log('   ✅ View system statistics');
    
    // Also create allowed email entry
    const allowedEmailData = {
      email: 'itisaddy7@gmail.com',
      status: 'allowed',
      addedBy: 'system',
      addedAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('allowed_emails').add(allowedEmailData);
    console.log('✅ Added to allowed emails list');
    
  } catch (error) {
    console.error('❌ Error creating super admin user:', error);
    
    if (error.code === 5) {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Make sure Firestore API is enabled');
      console.log('   2. Create a Firestore database in Firebase Console');
      console.log('   3. Check your Firebase credentials in .env.local');
      console.log('   4. Ensure you have write permissions to Firestore');
    }
    
    if (error.message.includes('permission')) {
      console.log('\n🔒 Permission Issue:');
      console.log('   1. Check Firestore security rules');
      console.log('   2. Ensure service account has proper permissions');
      console.log('   3. Try running in test mode temporarily');
    }
  } finally {
    process.exit(0);
  }
}

createSuperAdmin();