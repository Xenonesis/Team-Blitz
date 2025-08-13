import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import User from '@/models/User';

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

    // Get all users from database
    const users = await User.find({});
    
    // Return user objects with email, role, and other relevant info
    const userList = users.map(user => ({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })).filter(user => user.email);
    
    return NextResponse.json({
      users: userList,
      count: userList.length
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}