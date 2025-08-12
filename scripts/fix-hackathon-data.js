const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();

async function fixHackathonData() {
  try {
    console.log('🔧 Fixing hackathon data corruption...\n');

    // Get all hackathons
    const hackathonsSnapshot = await db.collection('hackathons').get();
    console.log(`📊 Found ${hackathonsSnapshot.size} hackathons to fix`);

    if (hackathonsSnapshot.empty) {
      console.log('❌ No hackathons found in database!');
      return;
    }

    // Process each hackathon
    for (let i = 0; i < hackathonsSnapshot.docs.length; i++) {
      const doc = hackathonsSnapshot.docs[i];
      const data = doc.data();
      
      console.log(`\n🔧 Fixing hackathon ${i + 1}:`);
      console.log(`   Document ID: ${doc.id}`);
      console.log(`   Current data:`, JSON.stringify(data, null, 2));

      // Check if this document has corrupted data
      if (!data.id || !data.name || typeof data.startDate === 'object') {
        console.log('   ❌ Data is corrupted, replacing with proper data...');
        
        // Create proper hackathon data
        const fixedData = {
          id: doc.id, // Use the document ID as the hackathon ID
          name: i === 0 ? 'Tech Innovation Challenge 2025' : 'AI Innovation Summit 2025',
          description: i === 0 
            ? 'A 48-hour hackathon focused on innovative tech solutions for everyday problems.'
            : 'Build the next generation of AI-powered applications.',
          startDate: i === 0 ? '2025-02-15' : '2025-03-01',
          endDate: i === 0 ? '2025-02-17' : '2025-03-03',
          leader: {
            id: i === 0 ? '1' : '4',
            name: i === 0 ? 'John Doe' : 'Sarah Wilson',
            role: i === 0 ? 'Team Lead' : 'AI Lead',
            email: i === 0 ? 'john@example.com' : 'sarah@example.com',
            skills: i === 0 ? 'React, Node.js, Firebase' : 'Python, TensorFlow, Machine Learning'
          },
          currentStage: i === 0 ? 'ppt' : 'round1',
          progress: { 
            completedTasks: i === 0 ? 2 : 5, 
            totalTasks: i === 0 ? 10 : 12 
          },
          participants: i === 0 ? [
            { id: '2', name: 'Jane Smith', role: 'Designer', email: 'jane@example.com', skills: 'UI/UX Design' },
            { id: '3', name: 'Mike Johnson', role: 'Backend Dev', email: 'mike@example.com', skills: 'Python, APIs' }
          ] : [
            { id: '5', name: 'Alex Chen', role: 'Data Scientist', email: 'alex@example.com', skills: 'Python, Data Analysis' },
            { id: '6', name: 'Maria Garcia', role: 'Frontend Dev', email: 'maria@example.com', skills: 'React, TypeScript' }
          ],
          status: i === 0 ? 'upcoming' : 'active',
          location: i === 0 ? 'San Francisco, CA' : 'New York, NY',
          website: i === 0 ? 'https://techinnovators.com' : 'https://aiinnovation.com',
          prize: i === 0 ? '$50,000' : '$75,000',
          technologies: i === 0 ? 'React, Node.js, Firebase' : 'Python, TensorFlow, React',
          totalTasks: i === 0 ? 10 : 12,
          roundDates: {
            ppt: i === 0 ? '2025-02-15' : '2025-03-01',
            round1: i === 0 ? '2025-02-16' : '2025-03-02',
            round2: i === 0 ? '2025-02-17' : '2025-03-03',
            semifinal: i === 0 ? '2025-02-18' : '2025-03-04',
            final: i === 0 ? '2025-02-19' : '2025-03-05'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Update the document
        await db.collection('hackathons').doc(doc.id).set(fixedData);
        console.log(`   ✅ Fixed hackathon: ${fixedData.name}`);
      } else {
        console.log('   ✅ Data looks good, no changes needed');
      }
    }

    console.log('\n🎉 Hackathon data fix completed!');
    console.log('\n📋 Available hackathon IDs:');
    
    // List the fixed hackathons
    const updatedSnapshot = await db.collection('hackathons').get();
    updatedSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`   - ${data.id}: ${data.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error during fix:', error);
  } finally {
    process.exit(0);
  }
}

fixHackathonData();