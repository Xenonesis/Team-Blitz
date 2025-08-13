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

// Determine role based on email (same logic as User model)
function determineRoleByEmail(email) {
  if (!email) return 'user';
  
  const normalizedEmail = email.toLowerCase();
  
  // Super admin (only one)
  if (normalizedEmail === 'itisaddy7@gmail.com') {
    return 'super_admin';
  }
  
  // Admins (two specific emails)
  const adminEmails = [
    'itisaddy7@gmail.com',
    'aayushtonk@02@gmail.com'
  ];
  
  if (adminEmails.includes(normalizedEmail)) {
    return 'admin';
  }
  
  // All other emails are users by default
  return 'user';
}

async function fixUserRoles() {
  try {
    console.log('🔧 Fixing User Roles...\n');

    // Get all users
    const usersSnapshot = await db.collection('users').get();
    console.log(`📊 Found ${usersSnapshot.size} users in database\n`);

    if (usersSnapshot.empty) {
      console.log('❌ No users found in database!');
      return;
    }

    let updatedCount = 0;

    // Process each user
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      const currentRole = userData.role;
      const correctRole = determineRoleByEmail(userData.email);

      console.log(`👤 ${userData.email}`);
      console.log(`   Current role: ${currentRole}`);
      console.log(`   Correct role: ${correctRole}`);

      if (currentRole !== correctRole) {
        console.log(`   🔄 Updating role from "${currentRole}" to "${correctRole}"`);
        
        await db.collection('users').doc(doc.id).update({
          role: correctRole,
          updatedAt: new Date()
        });
        
        updatedCount++;
        console.log(`   ✅ Updated successfully!`);
      } else {
        console.log(`   ✅ Role is already correct`);
      }
      console.log('');
    }

    console.log(`🎉 Role fix completed!`);
    console.log(`📊 Updated ${updatedCount} user(s)\n`);

    // Show final role summary
    console.log('📋 Final Role Summary:');
    console.log('=====================');
    
    const updatedSnapshot = await db.collection('users').get();
    const roleCounts = { super_admin: 0, admin: 0, user: 0 };
    
    updatedSnapshot.forEach(doc => {
      const userData = doc.data();
      const role = userData.role || 'user';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
      
      if (role === 'super_admin' || role === 'admin') {
        console.log(`🔑 ${role.toUpperCase()}: ${userData.email}`);
      }
    });
    
    console.log(`\n📊 Role Distribution:`);
    console.log(`   Super Admins: ${roleCounts.super_admin}`);
    console.log(`   Admins: ${roleCounts.admin}`);
    console.log(`   Users: ${roleCounts.user}`);
    
    console.log('\n🔐 Admin Access:');
    console.log('   itisaddy7@gmail.com → Super Admin (can access /admin)');
    console.log('   aayushtonk02@gmail.com → Admin (live hackathons only)');
    
  } catch (error) {
    console.error('❌ Error fixing user roles:', error);
  } finally {
    process.exit(0);
  }
}

fixUserRoles();