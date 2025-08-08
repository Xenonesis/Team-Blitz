import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

export async function authenticateToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return { error: 'Access token required', status: 401 };
    }

    const decoded = verifyToken(token);
    
    // Connect to database and get user details
    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return { error: 'User not found or inactive', status: 401 };
    }

    return { user, decoded };
  } catch (error) {
    return { error: 'Invalid or expired token', status: 401 };
  }
}

export async function requireAdmin(request) {
  const authResult = await authenticateToken(request);
  
  if (authResult.error) {
    return authResult;
  }

  if (authResult.user.role !== 'admin') {
    return { error: 'Admin access required', status: 403 };
  }

  return authResult;
}

export function createAuthResponse(error, status) {
  return NextResponse.json({ error }, { status });
}
