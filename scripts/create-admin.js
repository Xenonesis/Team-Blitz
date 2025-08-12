#!/usr/bin/env node

/**
 * Script to create an admin user in Firebase
 * Run this after setting up Firebase credentials
 */

import { config } from 'dotenv';
config();

async function createAdminUser() {
  console.log('👤 Creating Admin User...\n');
  
  try {
    // Import the User model
    const User = (await import('../src/models/User.js')).default;
    
    // Test database connection first
    const dbConnect = (await import('../src/utils/dbConnect.js')).default;
    await dbConnect();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'admin@teamblitz.com' },
        { username: 'admin' }
      ]
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Username: ${existingAdmin.username}`);
      console.log(`🔑 Role: ${existingAdmin.role}`);
      return;
    }
    
    // Create admin user
    const adminData = {
      username: 'admin',
      email: 'admin@teamblitz.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin'
    };
    
    const admin = new User(adminData);
    await admin.save();
    
    console.log('🎉 Admin user created successfully!');
    console.log('📋 Admin Details:');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`👤 Username: ${admin.username}`);
    console.log(`🔑 Role: ${admin.role}`);
    console.log(`🆔 ID: ${admin.id}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    console.log('\n⚠️  Security Note:');
    console.log('Please change the admin password after first login!');
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    
    if (error.message.includes('Validation Error')) {
      console.log('\n💡 The error above shows validation issues.');
      console.log('This usually means the user data format is incorrect.');
    }
    
    if (error.message.includes('already exists')) {
      console.log('\n💡 An admin user with this email or username already exists.');
    }
    
    process.exit(1);
  }
}

// Run the script
createAdminUser();