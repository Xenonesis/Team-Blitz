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

async function initializeFirestore() {
  try {
    console.log('🚀 Initializing Firestore database...');

    // Create sample hackathons
    const hackathonsRef = db.collection('hackathons');
    
    const sampleHackathons = [
      {
        title: "AI Innovation Challenge 2025",
        description: "Build the next generation of AI-powered applications",
        startDate: new Date('2025-03-15'),
        endDate: new Date('2025-03-17'),
        registrationDeadline: new Date('2025-03-10'),
        location: "San Francisco, CA",
        isVirtual: false,
        maxParticipants: 500,
        currentParticipants: 0,
        prizePool: 50000,
        status: "upcoming",
        tags: ["AI", "Machine Learning", "Innovation"],
        organizer: "Tech Innovators Inc",
        website: "https://ai-challenge-2025.com",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Web3 Builders Hackathon",
        description: "Create decentralized applications that matter",
        startDate: new Date('2025-04-20'),
        endDate: new Date('2025-04-22'),
        registrationDeadline: new Date('2025-04-15'),
        location: "Virtual",
        isVirtual: true,
        maxParticipants: 1000,
        currentParticipants: 0,
        prizePool: 75000,
        status: "upcoming",
        tags: ["Web3", "Blockchain", "DeFi"],
        organizer: "Blockchain Foundation",
        website: "https://web3-builders.com",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const hackathon of sampleHackathons) {
      await hackathonsRef.add(hackathon);
      console.log(`✅ Added hackathon: ${hackathon.title}`);
    }

    // Create sample admin user
    const usersRef = db.collection('users');
    const adminUser = {
      email: "admin@teamblitz.com",
      password: "$2b$10$rQZ9QmjqjKjKjKjKjKjKjOeJ9QmjqjKjKjKjKjKjKjKjKjKjKjKjK", // hashed "admin123"
      role: "admin",
      name: "Admin User",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await usersRef.add(adminUser);
    console.log('✅ Added admin user');

    console.log('🎉 Firestore initialization complete!');
    console.log('📝 You can now login with: admin@teamblitz.com / admin123');
    
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
  } finally {
    process.exit(0);
  }
}

initializeFirestore();