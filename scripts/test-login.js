const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Testing login API...\n');
    
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@teamblitz.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login successful!');
    console.log('📝 Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();