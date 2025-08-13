// Script to create one user at a time
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('🔧 CREATE SINGLE USER');
  console.log('====================\n');
  console.log('Usage: node scripts/create-single-user.js <email>');
  console.log('\nExample:');
  console.log('node scripts/create-single-user.js ashmes16@gmail.com\n');
  console.log('📋 EMAILS TO CREATE:');
  console.log('- officialprachi1211@gmail.com');
  console.log('- alimuneerali245@gmail.com');
  console.log('- ashmes16@gmail.com');
  console.log('- swati01mishra01@gmail.com');
  console.log('- admin@teamblitz.com');
  process.exit(0);
}

const email = args[0];

async function createSingleUser(email) {
  console.log(`🔧 Creating user: ${email}\n`);
  
  try {
    // Extract username from email
    const username = email.split('@')[0];
    const defaultPassword = 'teamblitz2025';
    
    // Determine role
    const adminEmails = ['admin@teamblitz.com', 'aayushtonk@02@gmail.com', 'itisaddy7@gmail.com'];
    const role = adminEmails.includes(email) ? 'admin' : 'user';
    
    const userData = {
      username: username,
      email: email,
      password: defaultPassword,
      role: role
    };
    
    // Add admin secret for admin users
    if (role === 'admin') {
      userData.adminSecret = 'team-blitz-admin-2025';
    }
    
    console.log('📊 User data:', {
      username: userData.username,
      email: userData.email,
      role: userData.role,
      hasAdminSecret: !!userData.adminSecret
    });
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ SUCCESS: Created ${email} (${role})`);
      console.log(`🔑 Password: ${defaultPassword}`);
    } else {
      if (result.error && result.error.includes('already exists')) {
        console.log(`⚠️  User already exists: ${email}`);
      } else {
        console.log(`❌ FAILED: ${result.error}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
}

createSingleUser(email);