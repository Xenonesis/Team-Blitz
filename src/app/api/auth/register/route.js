import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { generateToken } from '@/utils/jwt';
import { isEmailAllowed } from '@/utils/emailAccess';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { username, email, password, role, adminSecret } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if email is allowed to register (unless creating admin with secret)
    if (role !== 'admin') {
      const emailAllowed = await isEmailAllowed(email.toLowerCase().trim());
      if (!emailAllowed) {
        return NextResponse.json(
          { error: 'This email is not authorized to register. Please contact an administrator.' },
          { status: 403 }
        );
      }
    }

    // If trying to create admin, check admin secret
    if (role === 'admin') {
      // ADMIN_SECRET=TeamBlitzAdminSecret2025ProductionReady
      const expectedAdminSecret = 'TeamBlitzAdminSecret2025ProductionReady';
      if (adminSecret !== expectedAdminSecret) {
        return NextResponse.json(
          { error: 'Invalid admin secret' },
          { status: 403 }
        );
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'user'
    });

    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    // Return success response
    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
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
