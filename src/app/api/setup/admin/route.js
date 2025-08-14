import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { adminSecret } = await request.json();
    
    // Check admin secret
    // ADMIN_SECRET=TeamBlitzAdminSecret2025ProductionReady
    const expectedAdminSecret = 'TeamBlitzAdminSecret2025ProductionReady';
    if (adminSecret !== expectedAdminSecret) {
      return NextResponse.json(
        { error: 'Invalid admin secret' },
        { status: 403 }
      );
    }

    // Admin user details
    const adminData = {
      username: 'admin',
      email: 'admin@teamblitz.com',
      password: 'admin123',
      role: 'admin'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: adminData.email },
        { username: adminData.username }
      ]
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin user already exists',
        user: {
          email: existingAdmin.email,
          username: existingAdmin.username,
          role: existingAdmin.role
        }
      });
    }

    // Create admin user
    const admin = new User(adminData);
    await admin.save();

    return NextResponse.json({
      message: 'Admin user created successfully',
      user: {
        email: adminData.email,
        username: adminData.username,
        role: adminData.role
      },
      credentials: {
        email: adminData.email,
        password: adminData.password
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating admin user:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
