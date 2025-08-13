// Test script to verify admin API access
console.log('🧪 TESTING ADMIN API ACCESS');
console.log('===========================\n');

async function testAdminAPI() {
  try {
    const baseURL = 'http://localhost:3000';
    
    console.log('🔐 Step 1: Login as super admin...');
    
    // Login as super admin
    const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'itisaddy7@gmail.com',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed! Trying alternative passwords...');
      
      // Try SuperAdmin123!
      const loginResponse2 = await fetch(`${baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'itisaddy7@gmail.com',
          password: 'SuperAdmin123!'
        })
      });
      
      if (!loginResponse2.ok) {
        // Try teamblitz2025
        const loginResponse3 = await fetch(`${baseURL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'itisaddy7@gmail.com',
            password: 'teamblitz2025'
          })
        });
        
        if (!loginResponse3.ok) {
          const error = await loginResponse3.json();
          console.log('❌ All login attempts failed:', error.error);
          return;
        } else {
          const loginData = await loginResponse3.json();
          console.log('✅ Login successful with password: teamblitz2025');
          await testAPIs(loginData.token);
        }
      } else {
        const loginData = await loginResponse2.json();
        console.log('✅ Login successful with password: SuperAdmin123!');
        await testAPIs(loginData.token);
      }
    } else {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful with password: admin123');
      await testAPIs(loginData.token);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function testAPIs(token) {
  const baseURL = 'http://localhost:3000';
  
  console.log('\n🔍 Step 2: Testing admin APIs...');
  
  // Test allowed-emails API
  console.log('\n📧 Testing /api/admin/allowed-emails...');
  try {
    const emailsResponse = await fetch(`${baseURL}/api/admin/allowed-emails`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (emailsResponse.ok) {
      const emailsData = await emailsResponse.json();
      console.log('✅ Allowed emails API works!');
      console.log(`   Found ${emailsData.count} allowed emails`);
      console.log(`   Found ${emailsData.blockedCount} blocked emails`);
    } else {
      const error = await emailsResponse.json();
      console.log(`❌ Allowed emails API failed: ${error.error}`);
    }
  } catch (error) {
    console.log(`❌ Allowed emails API error: ${error.message}`);
  }
  
  // Test users API
  console.log('\n👥 Testing /api/admin/users...');
  try {
    const usersResponse = await fetch(`${baseURL}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log('✅ Users API works!');
      console.log(`   Found ${usersData.count} users`);
    } else {
      const error = await usersResponse.json();
      console.log(`❌ Users API failed: ${error.error}`);
    }
  } catch (error) {
    console.log(`❌ Users API error: ${error.message}`);
  }
  
  console.log('\n🎉 API testing completed!');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    return response.ok;
  } catch (error) {
    return false;
  }
}

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
  await testAdminAPI();
}

main().catch(console.error);