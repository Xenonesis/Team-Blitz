// Quick script to create admin user via API
const fetch = require('node-fetch');

async function createAdmin() {
  try {
    const response = await fetch('http://localhost:3000/api/setup/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminSecret: 'team-blitz-admin-2025'
      })
    });

    const data = await response.json();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('\n✅ Admin user created successfully!');
      console.log('Login credentials:');
      console.log('Email:', data.credentials.email);
      console.log('Password:', data.credentials.password);
    } else {
      console.log('❌ Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Failed to create admin:', error.message);
  }
}

createAdmin();