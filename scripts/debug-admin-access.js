const admin = require('firebase-admin');
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

async function debugAdminAccess() {
  try {
    console.log('🔍 Debugging Admin Access for itisaddy7@gmail.com\n');

    // Find the user
    const userQuery = await db.collection('users')
      .where('email', '==', 'itisaddy7@gmail.com')
      .limit(1)
      .get();

    if (userQuery.empty) {
      console.log('❌ User itisaddy7@gmail.com NOT FOUND in database!');
      console.log('\n💡 Solutions:');
      console.log('1. Run: node scripts/create-super-admins.js');
      console.log('2. Or manually create the user through registration');
      return;
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    console.log('✅ User Found!');
    console.log('==============');
    console.log(`📄 Document ID: ${userDoc.id}`);
    console.log(`📧 Email: ${userData.email}`);
    console.log(`👤 Username: ${userData.username}`);
    console.log(`🔑 Role: ${userData.role}`);
    console.log(`✅ Active: ${userData.isActive}`);
    console.log(`🔒 Password Hash: ${userData.password ? 'Present' : 'Missing'}`);
    console.log(`📅 Created: ${userData.createdAt?.toDate?.() || userData.createdAt}`);
    console.log(`📅 Updated: ${userData.updatedAt?.toDate?.() || userData.updatedAt}`);

    console.log('\n🔍 Role Analysis:');
    console.log('================');
    
    const expectedRole = 'super_admin';
    const currentRole = userData.role;
    
    console.log(`Expected Role: ${expectedRole}`);
    console.log(`Current Role: ${currentRole}`);
    
    if (currentRole === expectedRole) {
      console.log('✅ Role is CORRECT!');
      
      console.log('\n🔍 AuthContext Checks:');
      console.log('======================');
      console.log(`user?.role === 'super_admin': ${currentRole === 'super_admin'}`);
      console.log(`isSuperAdmin should be: ${currentRole === 'super_admin'}`);
      
      console.log('\n🔍 Possible Issues:');
      console.log('==================');
      console.log('1. Check browser console for JavaScript errors');
      console.log('2. Clear browser cache and localStorage');
      console.log('3. Try logging out and logging back in');
      console.log('4. Check if token is valid and contains correct user data');
      
    } else {
      console.log('❌ Role is INCORRECT!');
      console.log('\n🔧 Fixing role...');
      
      await db.collection('users').doc(userDoc.id).update({
        role: expectedRole,
        updatedAt: new Date()
      });
      
      console.log('✅ Role updated to super_admin!');
      console.log('\n💡 Next steps:');
      console.log('1. Log out from the application');
      console.log('2. Log back in with itisaddy7@gmail.com');
      console.log('3. Try accessing /admin again');
    }

    console.log('\n🔐 Login Test:');
    console.log('==============');
    console.log('Try logging in with these credentials:');
    console.log('📧 Email: itisaddy7@gmail.com');
    console.log('🔑 Password: admin123 (or SuperAdmin123! or teamblitz2025)');
    console.log('🌐 Admin URL: /admin');

    // Check all admin/super admin users
    console.log('\n👥 All Admin Users:');
    console.log('==================');
    
    const adminQuery = await db.collection('users')
      .where('role', 'in', ['admin', 'super_admin'])
      .get();
    
    if (adminQuery.empty) {
      console.log('❌ No admin users found!');
    } else {
      adminQuery.forEach((doc, index) => {
        const user = doc.data();
        console.log(`${index + 1}. ${user.email} (${user.role})`);
      });
    }

  } catch (error) {
    console.error('❌ Error debugging admin access:', error);
  } finally {
    process.exit(0);
  }
}

debugAdminAccess();