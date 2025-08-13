import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import { isEmailAllowed } from '@/utils/emailAccess';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if email is allowed
    const hasAccess = await isEmailAllowed(decoded.email);

    return NextResponse.json({ 
      hasAccess,
      email: decoded.email 
    });

  } catch (error) {
    console.error('Error checking access:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}