import dbConnect from './dbConnect.js';
import User from '@/models/User.js';

export async function ensureAdminUser() {
  try {
    await dbConnect();
    
    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@teamblitz.com' });
    
    if (!adminUser) {
      console.log('🔧 Creating default admin user...');
      
      const newAdmin = new User({
        username: 'admin',
        email: 'admin@teamblitz.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });
      
      await newAdmin.save();
      console.log('✅ Default admin user created successfully');
      console.log('📧 Email: admin@teamblitz.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
    return false;
  }
}

export async function initializeAuth() {
  console.log('\n🔐 Initializing authentication system...');
  
  try {
    await ensureAdminUser();
    console.log('✅ Authentication system initialized\n');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize authentication:', error);
    return false;
  }
}