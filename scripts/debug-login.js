// Debug login issues
console.log('🔍 DEBUGGING LOGIN ISSUE');
console.log('========================\n');

async function debugLogin() {
  const testEmail = 'ashwinisj2005@gmail.com';
  const testPassword = 'teamblitz2025';
  
  console.log(`🧪 Testing login for: ${testEmail}`);
  console.log(`🔑 Using password: ${testPassword}\n`);
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    
    const result = await response.json();
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📝 Response Body:`, result);
    
    if (response.ok) {
      console.log('\n✅ LOGIN SUCCESS!');
      console.log('The user exists and password is correct.');
    } else {
      console.log('\n❌ LOGIN FAILED!');
      console.log(`Error: ${result.error}`);
      
      if (result.error === 'Invalid credentials') {
        console.log('\n🔍 POSSIBLE CAUSES:');
        console.log('1. User doesn\'t exist in database');
        console.log('2. Password is incorrect');
        console.log('3. Email case sensitivity issue');
        console.log('4. Password wasn\'t hashed correctly during creation');
      }
    }
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
  
  console.log('\n🔧 NEXT STEPS:');
  console.log('1. Try with a known working admin account');
  console.log('2. Check if user actually exists in database');
  console.log('3. Try recreating the user');
}

// Test with admin account too
async function testAdminLogin() {
  console.log('\n🔧 Testing with known admin account...');
  
  const adminEmail = 'aayushtonk02@gmail.com';
  const adminPassword = 'teamblitz2025';
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword
      })
    });
    
    const result = await response.json();
    
    console.log(`📊 Admin Login Status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Admin login works - system is functioning');
    } else {
      console.log('❌ Admin login also fails - system issue');
      console.log(`Error: ${result.error}`);
    }
    
  } catch (error) {
    console.log(`❌ Admin login request failed: ${error.message}`);
  }
}

async function main() {
  await debugLogin();
  await testAdminLogin();
}

main().catch(console.error);