// Super slow user creation with 10 second delays
console.log('🐌 SUPER SLOW USER CREATION');
console.log('===========================\n');

const remainingEmails = [
  'ashmes16@gmail.com',
  'officialprachi1211@gmail.com',
  'alimuneerali245@gmail.com',
  'swati01mishra01@gmail.com',
  'admin@teamblitz.com'
];

console.log('📋 EMAILS TO CREATE (ONE EVERY 10 SECONDS):');
remainingEmails.forEach((email, index) => {
  console.log(`${index + 1}. ${email}`);
});

console.log('\n⏰ This will take about 50 seconds total...\n');

async function createUsersSlowly() {
  for (let i = 0; i < remainingEmails.length; i++) {
    const email = remainingEmails[i];
    console.log(`\n🔧 Creating user ${i + 1}/${remainingEmails.length}: ${email}`);
    
    const username = email.split('@')[0];
    const defaultPassword = 'teamblitz2025';
    const adminEmails = ['admin@teamblitz.com'];
    const role = adminEmails.includes(email) ? 'admin' : 'user';
    
    const userData = {
      username: username,
      email: email,
      password: defaultPassword,
      role: role
    };
    
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
        console.log(`✅ SUCCESS: Created ${email} (${role})`);
      } else if (result.error && result.error.includes('already exists')) {
        console.log(`⚠️  Already exists: ${email}`);
      } else if (result.error && result.error.includes('Too many requests')) {
        console.log(`⏳ Rate limited: ${email} - will try again later`);
      } else {
        console.log(`❌ Failed: ${email} - ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${email} - ${error.message}`);
    }
    
    // 10 second delay between requests
    if (i < remainingEmails.length - 1) {
      console.log('⏳ Waiting 10 seconds before next user...');
      for (let j = 10; j > 0; j--) {
        process.stdout.write(`\r⏰ ${j} seconds remaining...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      process.stdout.write('\r                           \r');
    }
  }
  
  console.log('\n🎉 User creation attempt completed!');
  console.log('\n🔍 Next steps:');
  console.log('1. Refresh your admin panel');
  console.log('2. Check the password manager dropdown');
  console.log('3. Test password updates with available users');
}

createUsersSlowly().catch(console.error);