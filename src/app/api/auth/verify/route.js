import { NextResponse } from 'next/server';
import { authenticateToken } from '@/middleware/auth';

export async function GET(request) {
  try {
    const authResult = await authenticateToken(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: authResult.user._id,
        username: authResult.user.username,
        email: authResult.user.email,
        role: authResult.user.role
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
