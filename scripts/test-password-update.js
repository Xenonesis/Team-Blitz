const bcrypt = require('bcryptjs');

// Test script to verify password updates are working
async function testPasswordUpdate() {
  console.log('🔍 Testing Password Update Functionality...\n');
  
  try {
    // Import required modules
    const { isMockMode } = require('../src/utils/mockFirebase');
    const User = require('../src/models/User').default;
    
    console.log(`📊 Database Mode: ${isMockMode() ? 'Mock (Demo)' : 'Firebase (Live)'}`);
    
    // Test 1: Find the user we're updating
    const testEmail = 'ashmes16@gmail.com';
    console.log(`\n1️⃣ Looking for user: ${testEmail}`);
    
    const user = await User.findOne({ email: testEmail });
    if (!user) {
      console.log('❌ User not found! Creating test user...');
      
      // Create a test user if not exists
      const newUser = new User({
        username: 'testuser',
        email: testEmail,
        password: 'oldpassword123',
        role: 'user'
      });
      await newUser.save();
      console.log('✅ Test user created');
    } else {
      console.log('✅ User found:', {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      });
    }
    
    // Test 2: Check current password hash
    const currentUser = await User.findOne({ email: testEmail });
    console.log('\n2️⃣ Current password hash (first 20 chars):', currentUser.password.substring(0, 20) + '...');
    
    // Test 3: Test password comparison with current password
    console.log('\n3️⃣ Testing password comparison...');
    const testPasswords = ['qwerty', 'oldpassword123', 'wrongpassword'];
    
    for (const testPass of testPasswords) {
      const isMatch = await currentUser.comparePassword(testPass);
      console.log(`   Password "${testPass}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
    }
    
    // Test 4: Simulate the password update process
    console.log('\n4️⃣ Simulating password update to "qwerty"...');
    
    const newPassword = 'qwerty';
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    console.log('   New password hash (first 20 chars):', hashedPassword.substring(0, 20) + '...');
    
    // Update the password directly in database (same as API does)
    const updateData = {
      password: hashedPassword,
      updatedAt: new Date()
    };
    
    if (isMockMode()) {
      const { mockCollection } = require('../src/utils/mockFirebase');
      const db = mockCollection('users');
      await db.update(currentUser.id, updateData);
    } else {
      const { adminDb } = await import('../src/utils/firebaseAdmin');
      await adminDb.collection('users').doc(currentUser.id).update(updateData);
    }
    
    console.log('✅ Password updated in database');
    
    // Test 5: Verify the update worked
    console.log('\n5️⃣ Verifying password update...');
    
    const updatedUser = await User.findOne({ email: testEmail });
    console.log('   Updated password hash (first 20 chars):', updatedUser.password.substring(0, 20) + '...');
    
    // Test the new password
    const newPasswordWorks = await updatedUser.comparePassword('qwerty');
    const oldPasswordWorks = await updatedUser.comparePassword('oldpassword123');
    
    console.log(`   New password "qwerty": ${newPasswordWorks ? '✅ WORKS' : '❌ FAILED'}`);
    console.log(`   Old password "oldpassword123": ${oldPasswordWorks ? '❌ STILL WORKS (BAD!)' : '✅ CORRECTLY BLOCKED'}`);
    
    // Test 6: Final verification
    console.log('\n6️⃣ Final Test Results:');
    if (newPasswordWorks && !oldPasswordWorks) {
      console.log('🎉 SUCCESS: Password update is working correctly!');
      console.log('   ✅ New password works');
      console.log('   ✅ Old password is blocked');
      console.log('   ✅ Password hash changed in database');
    } else {
      console.log('❌ FAILURE: Password update has issues!');
      if (!newPasswordWorks) console.log('   ❌ New password does not work');
      if (oldPasswordWorks) console.log('   ❌ Old password still works');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testPasswordUpdate().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test crashed:', error);
  process.exit(1);
});