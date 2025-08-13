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

async function verifyAdminSetup() {
  try {
    console.log('✅ ADMIN SETUP VERIFICATION');
    console.log('===========================\n');

    // Check super admin
    const superAdminQuery = await db.collection('users')
      .where('email', '==', 'itisaddy7@gmail.com')
      .limit(1)
      .get();

    if (!superAdminQuery.empty) {
      const superAdmin = superAdminQuery.docs[0].data();
      console.log('🔑 SUPER ADMIN:');
      console.log(`   Email: ${superAdmin.email}`);
      console.log(`   Role: ${superAdmin.role}`);
      console.log(`   Can access /admin: ${superAdmin.role === 'super_admin' ? '✅ YES' : '❌ NO'}`);
      console.log(`   Can access live hackathons: ✅ YES`);
    } else {
      console.log('❌ Super admin not found!');
    }

    console.log('');

    // Check admin
    const adminQuery = await db.collection('users')
      .where('email', '==', 'aayushtonk02@gmail.com')
      .limit(1)
      .get();

    if (!adminQuery.empty) {
      const adminUser = adminQuery.docs[0].data();
      console.log('👤 ADMIN:');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Can access /admin: ${adminUser.role === 'super_admin' ? '✅ YES' : '❌ NO'}`);
      console.log(`   Can access live hackathons: ${adminUser.role === 'admin' || adminUser.role === 'super_admin' ? '✅ YES' : '❌ NO'}`);
    } else {
      console.log('❌ Admin user not found!');
    }

    console.log('\n🔐 LOGIN CREDENTIALS:');
    console.log('=====================');
    console.log('Super Admin:');
    console.log('   📧 Email: itisaddy7@gmail.com');
    console.log('   🔑 Password: admin123 (or SuperAdmin123! or teamblitz2025)');
    console.log('   🌐 Access: /admin + /live_hackthons');
    console.log('');
    console.log('Admin:');
    console.log('   📧 Email: aayushtonk02@gmail.com');
    console.log('   🔑 Password: admin123 (or SuperAdmin123! or teamblitz2025)');
    console.log('   🌐 Access: /live_hackthons only');

    console.log('\n🧪 TESTING STEPS:');
    console.log('=================');
    console.log('1. Log out from the application completely');
    console.log('2. Clear browser cache and localStorage');
    console.log('3. Go to /admin/login');
    console.log('4. Login with itisaddy7@gmail.com');
    console.log('5. Should be redirected to /admin successfully');
    console.log('6. Try logging in with aayushtonk02@gmail.com');
    console.log('7. Should be blocked from /admin but can access /live_hackthons');

  } catch (error) {
    console.error('❌ Error verifying admin setup:', error);
  } finally {
    process.exit(0);
  }
}

verifyAdminSetup();