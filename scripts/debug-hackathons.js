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

async function debugHackathons() {
  try {
    console.log('🔍 Debugging hackathon data...\n');

    // Check if hackathons collection exists and has data
    const hackathonsSnapshot = await db.collection('hackathons').get();
    console.log(`📊 Total hackathons in database: ${hackathonsSnapshot.size}`);

    if (hackathonsSnapshot.empty) {
      console.log('❌ No hackathons found in database!');
      console.log('💡 The system is likely using mock data from the API route.');
      return;
    }

    // List all hackathons
    console.log('\n🏆 Hackathons in database:');
    hackathonsSnapshot.forEach((doc, index) => {
      const hackathonData = doc.data();
      console.log(`${index + 1}. Document ID: ${doc.id}`);
      console.log(`   Hackathon ID: ${hackathonData.id}`);
      console.log(`   Name: ${hackathonData.name}`);
      console.log(`   Status: ${hackathonData.status}`);
      console.log(`   Start Date: ${hackathonData.startDate}`);
      console.log(`   End Date: ${hackathonData.endDate}`);
      console.log('');
    });

    // Check for the specific ID that's causing the error
    const problemId = '7Rz2veiX4n7dRzNY7h5y';
    console.log(`🔍 Looking for hackathon with ID: ${problemId}`);
    
    const specificQuery = await db.collection('hackathons')
      .where('id', '==', problemId)
      .limit(1)
      .get();

    if (specificQuery.empty) {
      console.log(`❌ Hackathon with ID ${problemId} not found!`);
      console.log('💡 This explains the 404 error. The hackathon may have been deleted or the ID is incorrect.');
    } else {
      console.log(`✅ Found hackathon with ID ${problemId}`);
      const doc = specificQuery.docs[0];
      console.log('   Data:', JSON.stringify(doc.data(), null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
    console.log('💡 If Firebase is not configured, the system uses mock data with IDs:');
    console.log('   - demo-hackathon-1');
    console.log('   - demo-hackathon-2');
  } finally {
    process.exit(0);
  }
}

debugHackathons();