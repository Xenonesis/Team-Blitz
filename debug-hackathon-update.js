const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function debugHackathonUpdate() {
  console.log('🔍 Debugging Hackathon Update Issue\n');

  try {
    // 1. Login
    console.log('1. 🔐 Login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@teamblitz.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('   ✅ Login successful');

    const api = axios.create({
      baseURL: BASE_URL,
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // 2. Get current hackathons
    console.log('2. 📋 Getting current hackathons...');
    const hackathons = await api.get('/api/hackathons');
    console.log('   Available hackathons:');
    hackathons.data.forEach((h, i) => {
      console.log(`   ${i + 1}. ID: ${h.id} | Name: ${h.name}`);
    });

    if (hackathons.data.length === 0) {
      console.log('   ❌ No hackathons found, creating test...');
      const testHackathon = {
        id: 'debug-test-' + Date.now(),
        name: 'Debug Test Hackathon',
        description: 'Testing update functionality',
        leader: {
          id: 'debug-leader',
          name: 'Debug Leader',
          role: 'leader',
          email: 'debug@example.com',
          skills: 'Debugging'
        },
        participants: [],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        status: 'active',
        currentStage: 'ppt',
        totalTasks: 10,
        technologies: 'React, Node.js',
        prize: '$500'
      };

      const createResponse = await api.post('/api/hackathons', testHackathon);
      console.log('   ✅ Created test hackathon:', createResponse.data.id);
      hackathons.data = [createResponse.data];
    }

    // 3. Test update with first hackathon
    const testHackathon = hackathons.data[0];
    console.log('\n3. 🔄 Testing update with hackathon:', testHackathon.id);

    const updatePayload = {
      id: testHackathon.id,
      name: testHackathon.name,
      description: testHackathon.description,
      startDate: testHackathon.startDate,
      endDate: new Date(Date.now() + 86400000 * 8).toISOString(), // Updated end date
      leader: testHackathon.leader,
      participants: testHackathon.participants,
      location: testHackathon.location || 'Remote',
      technologies: testHackathon.technologies,
      prize: testHackathon.prize,
      totalTasks: testHackathon.totalTasks,
      website: testHackathon.website || '',
      currentStage: testHackathon.currentStage,
      status: testHackathon.status
    };

    console.log('   📤 Sending update payload:');
    console.log(`   - ID: ${updatePayload.id}`);
    console.log(`   - Name: ${updatePayload.name}`);
    console.log(`   - End Date: ${updatePayload.endDate}`);

    try {
      const updateResponse = await api.put(`/api/hackathons/${testHackathon.id}`, updatePayload);
      console.log('   ✅ Update successful:', updateResponse.data.name);
    } catch (error) {
      console.log('   ❌ Update failed:', error.response?.data?.error || error.message);
      console.log('   🔍 Response status:', error.response?.status);
      console.log('   🔍 Response data:', error.response?.data);
    }

    // 4. Test with wrong ID
    console.log('\n4. 🧪 Testing with wrong ID...');
    try {
      await api.put('/api/hackathons/wrong-id-123', updatePayload);
    } catch (error) {
      console.log('   ✅ Expected error with wrong ID:', error.response?.data?.error);
    }

    // 5. Check if ID format is consistent
    console.log('\n5. 🔍 Checking ID format consistency...');
    const allHackathons = await api.get('/api/hackathons');
    allHackathons.data.forEach(h => {
      console.log(`   - ID: "${h.id}" (type: ${typeof h.id}, length: ${h.id.length})`);
    });

    console.log('\n✅ Debug test complete!');

  } catch (error) {
    console.error('❌ Debug test failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

debugHackathonUpdate();
