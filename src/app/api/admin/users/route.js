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
    
    // Extract just the email addresses
    const userEmails = users.map(user => user.email).filter(email => email);
    
    return NextResponse.json({
      users: userEmails,
      count: userEmails.length
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}