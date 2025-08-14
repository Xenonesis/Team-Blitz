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
    
    // Handle hardcoded super admin case (for login-simple)
    if (decoded.userId === 'super-admin-1' && decoded.email === 'itisaddy7@gmail.com' && decoded.role === 'super_admin') {
      const superAdminUser = {
        id: 'super-admin-1',
        username: 'superadmin',
        email: 'itisaddy7@gmail.com',
        role: 'super_admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return { user: superAdminUser, decoded };
    }
    
    // Connect to database and get user details for regular users
    await dbConnect();
    const user = await User.findById(decoded.userId);
    
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

  if (authResult.user.role !== 'admin' && authResult.user.role !== 'super_admin') {
    return { error: 'Admin access required', status: 403 };
  }

  return authResult;
}

export function createAuthResponse(error, status) {
  return NextResponse.json({ error }, { status });
}
