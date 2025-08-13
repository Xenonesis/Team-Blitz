// Real-time password update test - shows exactly what's happening
const http = require('http');

console.log('🔥 SIMPLE PASSWORD TEST');
console.log('=======================\n');

// Test the API endpoint directly
function testPasswordUpdate() {
  const postData = JSON.stringify({
    targetEmail: 'ashmes16@gmail.com',
    newPassword: 'qwerty'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/admin/update-password',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('📡 Making API call...');
  console.log(`   URL: http://localhost:3001/api/admin/update-password`);
  console.log(`   Method: POST`);
  console.log(`   Data: ${postData}\n`);

  const req = http.request(options, (res) => {
    let data = '';
    
    console.log(`📊 Status: ${res.statusCode}`);
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`📝 Response: ${data}\n`);
      
      if (res.statusCode === 200) {
        console.log('✅ SUCCESS! Password API is working');
      } else if (res.statusCode === 401) {
        console.log('🔐 NEED LOGIN TOKEN - This is normal, API needs authentication');
      } else {
        console.log('❌ ERROR - Something is wrong with the API');
      }
    });
  });

  req.on('error', (error) => {
    console.log('💥 CONNECTION ERROR:', error.message);
    console.log('💡 Make sure your Next.js server is running: npm run dev');
  });

  req.write(postData);
  req.end();
}

console.log('🚀 Testing your password API...\n');
testPasswordUpdate();