// Check if specific user exists in database
const userToCheck = 'swati01mishra01@gmail.com';

console.log('🔍 CHECKING USER EXISTENCE');
console.log('==========================\n');
console.log(`👤 Checking: ${userToCheck}\n`);

async function checkUserExists() {
  try {
    // Try to login with the user to see if they exist
    console.log('🧪 Testing login to check if user exists...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userToCheck,
        password: 'teamblitz2025'
      })
    });
    
    const result = await response.json();
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📝 Response: ${result.error || result.message}\n`);
    
    if (response.status === 401 && result.error === 'Invalid credentials') {
      console.log('❌ USER DOES NOT EXIST');
      console.log('The user was never successfully created in the database\n');
      
      console.log('🔧 SOLUTION: Create the user');
      console.log('Run: node scripts/create-single-user.js swati01mishra01@gmail.com');
      
    } else if (response.status === 403 && result.error.includes('Access has been revoked')) {
      console.log('✅ USER EXISTS in database');
      console.log('❌ But NOT in allowed emails list\n');
      
      console.log('🔧 SOLUTION: Add to allowed emails');
      console.log('Add swati01mishra01@gmail.com to allowed emails via admin panel');
      
    } else if (response.status === 401 && result.error === 'Account is deactivated') {
      console.log('✅ USER EXISTS in database');
      console.log('❌ But account is deactivated\n');
      
    } else if (response.status === 200) {
      console.log('✅ USER EXISTS and CAN LOGIN');
      console.log('User is properly set up and working');
      
    } else {
      console.log('🤔 UNEXPECTED RESPONSE');
      console.log('Need to investigate further');
    }
    
  } catch (error) {
    console.log(`❌ Error checking user: ${error.message}`);
  }
}

// Also try to create the user if it doesn't exist
async function createUserIfNeeded() {
  console.log('\n🔧 ATTEMPTING TO CREATE USER...');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'swati01mishra01',
        email: 'swati01mishra01@gmail.com',
        password: 'teamblitz2025',
        role: 'user'
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ USER CREATED SUCCESSFULLY');
      console.log('Now add to allowed emails list via admin panel');
    } else if (result.error && result.error.includes('already exists')) {
      console.log('⚠️  USER ALREADY EXISTS');
      console.log('The user exists but may not be in allowed emails list');
    } else if (result.error && result.error.includes('Too many requests')) {
      console.log('⏳ RATE LIMITED');
      console.log('Wait a few minutes and try again');
    } else {
      console.log(`❌ CREATION FAILED: ${result.error}`);
    }
    
  } catch (error) {
    console.log(`❌ Error creating user: ${error.message}`);
  }
}

async function main() {
  await checkUserExists();
  await createUserIfNeeded();
}

main().catch(console.error);