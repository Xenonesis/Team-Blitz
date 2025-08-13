// Fix user access by adding all users to allowed emails list
console.log('🔧 FIXING USER ACCESS');
console.log('=====================\n');

const usersToAllow = [
  'ashwinisj2005@gmail.com',
  'officialprachi1211@gmail.com', 
  'alimuneerali245@gmail.com',
  'ashmes16@gmail.com',
  'swati01mishra01@gmail.com',
  'admin@teamblitz.com'
];

console.log('📋 USERS TO ADD TO ALLOWED LIST:');
usersToAllow.forEach((email, index) => {
  console.log(`${index + 1}. ${email}`);
});

console.log('\n🔧 Adding users to allowed emails list...\n');

async function addUsersToAllowedList() {
  // First, get admin token by logging in
  console.log('🔐 Getting admin token...');
  
  try {
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'itisaddy7@gmail.com',
        password: 'teamblitz2025'
      })
    });
    
    const loginResult = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.log('❌ Admin login failed:', loginResult.error);
      console.log('💡 Try logging in manually first to verify admin credentials');
      return;
    }
    
    const adminToken = loginResult.token;
    console.log('✅ Admin login successful\n');
    
    // Add each user to allowed emails
    for (let i = 0; i < usersToAllow.length; i++) {
      const email = usersToAllow[i];
      console.log(`Adding ${i + 1}/${usersToAllow.length}: ${email}`);
      
      try {
        const response = await fetch('http://localhost:3000/api/admin/allowed-emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({ email: email })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          console.log(`✅ Added: ${email}`);
        } else {
          console.log(`❌ Failed: ${email} - ${result.error}`);
        }
      } catch (error) {
        console.log(`❌ Error adding ${email}:`, error.message);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n🎉 COMPLETED!');
    console.log('\n🧪 NOW TEST LOGIN:');
    console.log('Try logging in with any of these users:');
    usersToAllow.forEach(email => {
      console.log(`- ${email} / teamblitz2025`);
    });
    
  } catch (error) {
    console.log('❌ Script failed:', error.message);
  }
}

addUsersToAllowedList().catch(console.error);