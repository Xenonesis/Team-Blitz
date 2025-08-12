#!/usr/bin/env node

/**
 * Migration script to move data from MongoDB to Firebase
 * Run this script after setting up Firebase configuration
 */

import mongoose from 'mongoose';
import { adminDb } from '../src/utils/firebaseAdmin.js';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB Schemas (for reading existing data)
const mongoUserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  isActive: Boolean
}, { timestamps: true });

const mongoHackathonSchema = new mongoose.Schema({
  id: String,
  name: String,
  leader: Object,
  currentStage: String,
  progress: Object,
  startDate: String,
  endDate: String,
  description: String,
  participants: Array,
  status: String,
  location: String,
  website: String,
  prize: String,
  technologies: String,
  totalTasks: Number,
  roundDates: Object
}, { timestamps: true });

const mongoTeamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: String,
  skills: Array
}, { timestamps: true });

const mongoHackathonStageSchema = new mongoose.Schema({
  name: String,
  description: String,
  order: Number
}, { timestamps: true });

const MongoUser = mongoose.model('User', mongoUserSchema);
const MongoHackathon = mongoose.model('Hackathon', mongoHackathonSchema);
const MongoTeamMember = mongoose.model('TeamMember', mongoTeamMemberSchema);
const MongoHackathonStage = mongoose.model('HackathonStage', mongoHackathonStageSchema);

async function connectToMongoDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');
}

async function migrateUsers() {
  console.log('\n📤 Migrating Users...');
  
  const mongoUsers = await MongoUser.find({});
  console.log(`Found ${mongoUsers.length} users in MongoDB`);
  
  const batch = adminDb.batch();
  let count = 0;
  
  for (const user of mongoUsers) {
    const userData = {
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role || 'user',
      isActive: user.isActive !== undefined ? user.isActive : true,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date()
    };
    
    const docRef = adminDb.collection('users').doc();
    batch.set(docRef, userData);
    count++;
    
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Migrated ${count} users...`);
    }
  }
  
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log(`✅ Migrated ${count} users to Firebase`);
}

async function migrateTeamMembers() {
  console.log('\n📤 Migrating Team Members...');
  
  const mongoMembers = await MongoTeamMember.find({});
  console.log(`Found ${mongoMembers.length} team members in MongoDB`);
  
  const batch = adminDb.batch();
  let count = 0;
  
  for (const member of mongoMembers) {
    const memberData = {
      name: member.name,
      role: member.role,
      email: member.email,
      skills: member.skills || [],
      createdAt: member.createdAt || new Date(),
      updatedAt: member.updatedAt || new Date()
    };
    
    const docRef = adminDb.collection('teamMembers').doc();
    batch.set(docRef, memberData);
    count++;
    
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Migrated ${count} team members...`);
    }
  }
  
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log(`✅ Migrated ${count} team members to Firebase`);
}

async function migrateHackathonStages() {
  console.log('\n📤 Migrating Hackathon Stages...');
  
  const mongoStages = await MongoHackathonStage.find({});
  console.log(`Found ${mongoStages.length} hackathon stages in MongoDB`);
  
  const batch = adminDb.batch();
  let count = 0;
  
  for (const stage of mongoStages) {
    const stageData = {
      name: stage.name,
      description: stage.description,
      order: stage.order,
      createdAt: stage.createdAt || new Date(),
      updatedAt: stage.updatedAt || new Date()
    };
    
    const docRef = adminDb.collection('hackathonStages').doc();
    batch.set(docRef, stageData);
    count++;
    
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Migrated ${count} hackathon stages...`);
    }
  }
  
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log(`✅ Migrated ${count} hackathon stages to Firebase`);
}

async function migrateHackathons() {
  console.log('\n📤 Migrating Hackathons...');
  
  const mongoHackathons = await MongoHackathon.find({});
  console.log(`Found ${mongoHackathons.length} hackathons in MongoDB`);
  
  const batch = adminDb.batch();
  let count = 0;
  
  for (const hackathon of mongoHackathons) {
    const hackathonData = {
      id: hackathon.id,
      name: hackathon.name,
      leader: hackathon.leader,
      currentStage: hackathon.currentStage || 'ppt',
      progress: hackathon.progress || { completedTasks: 0, totalTasks: 0 },
      startDate: hackathon.startDate,
      endDate: hackathon.endDate,
      description: hackathon.description,
      participants: hackathon.participants || [],
      status: hackathon.status || 'upcoming',
      location: hackathon.location,
      website: hackathon.website || '',
      prize: hackathon.prize || '',
      technologies: hackathon.technologies || '',
      totalTasks: hackathon.totalTasks || 0,
      roundDates: hackathon.roundDates || {},
      createdAt: hackathon.createdAt || new Date(),
      updatedAt: hackathon.updatedAt || new Date()
    };
    
    const docRef = adminDb.collection('hackathons').doc();
    batch.set(docRef, hackathonData);
    count++;
    
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Migrated ${count} hackathons...`);
    }
  }
  
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log(`✅ Migrated ${count} hackathons to Firebase`);
}

async function runMigration() {
  console.log('🚀 Starting MongoDB to Firebase migration...\n');
  
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Run migrations
    await migrateUsers();
    await migrateTeamMembers();
    await migrateHackathonStages();
    await migrateHackathons();
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Verify data in Firebase Console');
    console.log('2. Test your application with Firebase');
    console.log('3. Update environment variables to use Firebase');
    console.log('4. Remove MongoDB dependencies if no longer needed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export { runMigration };