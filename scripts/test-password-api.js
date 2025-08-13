// Simple test to verify password update API is working
const https = require('https');
const http = require('http');

async function testPasswordAPI() {
  console.log('🔍 Testing Password Update API...\n');
  
  // Test configuration
  const baseURL = 'http://localhost:3001';
  const testEmail = 'ashmes16@gmail.com';
  const newPassword = 'qwerty';
  
  console.log(`📊 Testing against: ${baseURL}`);
  console.log(`👤 Target user: ${testEmail}`);
  console.log(`🔑 New password: ${newPassword}\n`);
  
  // You'll need to replace this with a real admin token
  // Get this from your browser's developer tools when logged in as admin
  const adminToken = 'YOUR_ADMIN_TOKEN_HERE';
  
  if (adminToken === 'YOUR_ADMIN_TOKEN_HERE') {
    console.log('❌ Please update the adminToken in the script with a real token');
    console.log('💡 To get a token:');
    console.log('   1. Login to admin panel in browser');
    console.log('   2. Open Developer Tools (F12)');
    console.log('   3. Go to Application/Storage tab');
    console.log('   4. Look for localStorage or check Network tab for Authorization header');
    console.log('   5. Copy the JWT token and paste it in this script\n');
    return;
  }
  
  const postData = JSON.stringify({
    targetEmail: testEmail,
    newPassword: newPassword
  });
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/admin/update-password',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      console.log(`📡 Response Status: ${res.statusCode}`);
      console.log(`📡 Response Headers:`, res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('📡 Response Body:', response);
          
          if (res.statusCode === 200) {
            console.log('✅ SUCCESS: Password update API returned success!');
            console.log(`✅ Message: ${response.message}`);
          } else {
            console.log('❌ FAILURE: Password update API returned error!');
            console.log(`❌ Error: ${response.error}`);
          }
          
          resolve(response);
        } catch (error) {
          console.log('❌ Failed to parse response:', data);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Request failed:', error.message);
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

// Instructions for manual testing
console.log('🧪 MANUAL TESTING INSTRUCTIONS:');
console.log('================================');
console.log('1. Make sure your Next.js server is running (npm run dev)');
console.log('2. Login to admin panel in browser');
console.log('3. Open browser Developer Tools (F12)');
console.log('4. Try updating a password in the UI');
console.log('5. Check the Network tab for the API request');
console.log('6. Look for status codes and response data');
console.log('7. Check if the password actually changed by trying to login\n');

console.log('🔧 AUTOMATED TESTING:');
console.log('=====================');
console.log('To run automated test, update the adminToken in this script and run again\n');

// Run the test if token is provided
testPasswordAPI().catch(console.error);