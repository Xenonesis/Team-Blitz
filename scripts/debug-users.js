// Debug script to check what users exist in the database
const path = require('path');

async function debugUsers() {
  console.log('🔍 Debugging Users in Database...\n');
  
  try {
    // Set up the path for imports
    process.env.NODE_PATH = path.join(__dirname, '..');
    require('module')._initPaths();
    
    // Import required modules with proper path resolution
    const dbConnect = require('../src/utils/dbConnect.js').default;
    const User = require('../src/models/User.js').default;
    
    // Connect to database
    console.log('📡 Connecting to database...');
    await dbConnect();
    console.log('✅ Connected!\n');
    
    // Get all users
    console.log('👥 Finding all users...');
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('❌ No users found in database!\n');
      console.log('💡 SOLUTION: Create a test user');
      console.log('Run this command to create the user:');
      console.log('node scripts/create-test-user.js\n');
    } else {
      console.log(`✅ Found ${users.length} users:\n`);
      
      users.forEach((user, index) => {
        console.log(`${index + 1}. 📧 Email: ${user.email}`);
        console.log(`   👤 Username: ${user.username}`);
        console.log(`   🔑 Role: ${user.role}`);
        console.log(`   ✅ Active: ${user.isActive}`);
        console.log(`   📅 Created: ${user.createdAt}`);
        console.log('');
      });
      
      // Check if our target user exists
      const targetUser = users.find(u => u.email === 'ashmes16@gmail.com');
      if (targetUser) {
        console.log('✅ Target user ashmes16@gmail.com EXISTS!');
        console.log('🤔 This means there might be a different issue...');
      } else {
        console.log('❌ Target user ashmes16@gmail.com NOT FOUND');
        console.log('💡 You need to create this user or use an existing email');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 This might be a module resolution issue.');
    console.log('Try running: npm run dev (in another terminal)');
    console.log('Then test the password manager in the browser.');
  }
}

debugUsers().then(() => {
  console.log('\n🏁 Debug completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Debug failed:', error);
  process.exit(1);
});