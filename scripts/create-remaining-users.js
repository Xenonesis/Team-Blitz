// Script to create the remaining users with longer delays
console.log('🔧 CREATING REMAINING USERS (SLOWER)');
console.log('===================================\n');

const remainingEmails = [
  'officialprachi1211@gmail.com',
  'alimuneerali245@gmail.com', 
  'ashmes16@gmail.com',
  'swati01mishra01@gmail.com',
  'admin@teamblitz.com'
];

console.log('📋 REMAINING EMAILS TO CREATE:');
remainingEmails.forEach((email, index) => {
  console.log(`${index + 1}. ${email}`);
});

console.log('\n🚀 CREATING USERS WITH 2 SECOND DELAYS...\n');

async function createRemainingUsers() {
  try {
    for (let i = 0; i < remainingEmails.length; i++) {
      const email = remainingEmails[i];
      console.log(`Creating user ${i + 1}/${remainingEmails.length}: ${email}`);
      
      // Extract username from email
      const username = email.split('@')[0];
      const defaultPassword = 'teamblitz2025';
      
      // Determine role
      const adminEmails = ['admin@teamblitz.com'];
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
      
      // 2 second delay between requests to avoid rate limiting
      if (i < remainingEmails.length - 1) {
        console.log('⏳ Waiting 2 seconds...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('\n🎉 REMAINING USERS CREATION COMPLETED!');
    console.log('\n📋 ALL USERS SHOULD NOW EXIST IN DATABASE');
    console.log('Password for all users: teamblitz2025');
    
  } catch (error) {
    console.error('💥 Script failed:', error);
  }
}

createRemainingUsers().catch(console.error);