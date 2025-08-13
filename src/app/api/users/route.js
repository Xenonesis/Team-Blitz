import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

// GET - Fetch all users (admin only)
export async function GET(request) {
  try {
    // Verify admin authentication
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await dbConnect();

    const users = await User.find({});
    
    // Return users without passwords
    const safeUsers = users.map(user => user.toJSON());

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new user (admin only)
export async function POST(request) {
  try {
    // Verify admin authentication
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await dbConnect();

    const userData = await request.json();
    
    // Validate required fields
    if (!userData.username || !userData.email || !userData.password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user',
      isActive: userData.isActive !== undefined ? userData.isActive : true
    });

    await user.save();

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: user.toJSON()
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    
    if (error.message.includes('Validation Error')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}