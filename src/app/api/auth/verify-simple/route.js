import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyToken(token);
      
      // Return user data from token
      return NextResponse.json({
        user: {
          id: decoded.userId,
          username: decoded.email === 'itisaddy7@gmail.com' ? 'superadmin' : 'user',
          email: decoded.email,
          role: decoded.role
        }
      });
      
    } catch (tokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}