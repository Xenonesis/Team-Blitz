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

async function verifyAndFixAdmin() {
  try {
    console.log('🔍 Verifying Super Admin Setup...');
    console.log('📧 Email: itisaddy7@gmail.com');
    
    // Check if super admin user exists
    const userQuery = await db.collection('users')
      .where('email', '==', 'itisaddy7@gmail.com')
      .limit(1)
      .get();

    if (userQuery.empty) {
      console.log('❌ Super Admin user NOT FOUND in database');
      console.log('🔧 Creating Super Admin user...');
      
      // Create the user
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('TeamBlitz2025!', salt);
      
      const superAdminUser = {
        username: 'superadmin',
        email: 'itisaddy7@gmail.com',
        password: hashedPassword,
        role: 'super_admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await db.collection('users').add(superAdminUser);
      console.log('✅ Super Admin user created!');
      console.log(`📄 Document ID: ${docRef.id}`);
    } else {
      const userDoc = userQuery.docs[0];
      const userData = userDoc.data();
      
      console.log('✅ Super Admin user found in database');
      console.log('📊 User Details:');
      console.log(`   - Email: ${userData.email}`);
      console.log(`   - Username: ${userData.username}`);
      console.log(`   - Role: ${userData.role}`);
      console.log(`   - Active: ${userData.isActive}`);
      console.log(`   - Created: ${userData.createdAt?.toDate()}`);
      
      // Test password
      console.log('\n🔐 Testing password...');
      const testPassword = 'TeamBlitz2025!';
      const isPasswordValid = await bcrypt.compare(testPassword, userData.password);
      
      if (isPasswordValid) {
        console.log('✅ Password is correct');
      } else {
        console.log('❌ Password is incorrect - updating...');
        
        // Update password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(testPassword, salt);
        
        await userDoc.ref.update({
          password: hashedPassword,
          role: 'super_admin',
          isActive: true,
          updatedAt: new Date()
        });
        
        console.log('✅ Password updated successfully');
      }
    }
    
    // Check allowed emails
    console.log('\n📧 Checking allowed emails...');
    const emailQuery = await db.collection('allowed_emails')
      .where('email', '==', 'itisaddy7@gmail.com')
      .limit(1)
      .get();
    
    if (emailQuery.empty) {
      console.log('❌ Email not in allowed list - adding...');
      
      const allowedEmailData = {
        email: 'itisaddy7@gmail.com',
        status: 'allowed',
        addedBy: 'system',
        addedAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('allowed_emails').add(allowedEmailData);
      console.log('✅ Added to allowed emails');
    } else {
      const emailDoc = emailQuery.docs[0];
      const emailData = emailDoc.data();
      console.log(`✅ Email found in allowed list - Status: ${emailData.status}`);
      
      if (emailData.status !== 'allowed') {
        await emailDoc.ref.update({
          status: 'allowed',
          updatedAt: new Date()
        });
        console.log('✅ Email status updated to allowed');
      }
    }
    
    console.log('\n🎉 SETUP COMPLETE!');
    console.log('\n🔐 Login Credentials:');
    console.log('   Email: itisaddy7@gmail.com');
    console.log('   Password: TeamBlitz2025!');
    console.log('\n🌐 Admin Panel: https://teamblitz.netlify.app/admin/login');
    
    console.log('\n🔧 If login still fails, check:');
    console.log('   1. Network connection');
    console.log('   2. Browser console for errors');
    console.log('   3. Firebase console for any issues');
    
  } catch (error) {
    console.error('❌ Error:', error);
    
    if (error.code === 'permission-denied') {
      console.log('\n🔒 Permission denied - Check:');
      console.log('   1. Firestore security rules');
      console.log('   2. Service account permissions');
      console.log('   3. Database exists and is accessible');
    }
  } finally {
    process.exit(0);
  }
}

verifyAndFixAdmin();