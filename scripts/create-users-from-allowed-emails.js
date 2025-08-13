// Script to create real user accounts from allowed emails
console.log('🔧 CREATING REAL USERS FROM ALLOWED EMAILS');
console.log('==========================================\n');

const allowedEmails = [
  'aayushtonk02@gmail.com',
  'itisaddy7@gmail.com', 
  'ashwinisj2005@gmail.com',
  'officialprachi1211@gmail.com',
  'alimuneerali245@gmail.com',
  'ashmes16@gmail.com',
  'swati01mishra01@gmail.com',
  'admin@teamblitz.com'
];

console.log('📋 EMAILS TO CREATE AS USERS:');
allowedEmails.forEach((email, index) => {
  console.log(`${index + 1}. ${email}`);
});

console.log('\n🚀 CREATING USERS...\n');

async function createUsersFromEmails() {
  try {
    // Make API calls to create each user
    for (let i = 0; i < allowedEmails.length; i++) {
      const email = allowedEmails[i];
      console.log(`Creating user ${i + 1}/${allowedEmails.length}: ${email}`);
      
      // Extract username from email (part before @)
      const username = email.split('@')[0];
      
      // Default password for all users
      const defaultPassword = 'teamblitz2025';
      
      // Determine role (admins vs regular users)
      const adminEmails = ['aayushtonk02@gmail.com', 'itisaddy7@gmail.com', 'admin@teamblitz.com'];
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
      
      try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
          console.log(`✅ Created: ${email} (${role})`);
        } else {
          if (result.error && result.error.includes('already exists')) {
            console.log(`⚠️  Already exists: ${email}`);
          } else {
            console.log(`❌ Failed: ${email} - ${result.error}`);
          }
        }
      } catch (error) {
        console.log(`❌ Error creating ${email}:`, error.message);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n🎉 USER CREATION COMPLETED!');
    console.log('\n📋 DEFAULT CREDENTIALS:');
    console.log('Password for all users: teamblitz2025');
    console.log('\n🔑 ADMIN USERS:');
    console.log('- aayushtonk02@gmail.com');
    console.log('- itisaddy7@gmail.com');
    console.log('- admin@teamblitz.com');
    console.log('\n👤 REGULAR USERS:');
    console.log('- ashwinisj2005@gmail.com');
    console.log('- officialprachi1211@gmail.com');
    console.log('- alimuneerali245@gmail.com');
    console.log('- ashmes16@gmail.com');
    console.log('- swati01mishra01@gmail.com');
    
  } catch (error) {
    console.error('💥 Script failed:', error);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking if server is running...');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server not running on localhost:3000');
    console.log('💡 Please start your server first:');
    console.log('   npm run dev');
    console.log('\nThen run this script again.');
    return;
  }
  
  console.log('✅ Server is running!\n');
  await createUsersFromEmails();
}

main().catch(console.error);