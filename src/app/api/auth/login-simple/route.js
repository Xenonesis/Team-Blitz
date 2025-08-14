import { NextResponse } from 'next/server';
import { generateToken } from '@/utils/jwt';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Hardcoded super admin check (temporary)
    if (email.toLowerCase() === 'itisaddy7@gmail.com' && password === 'TeamBlitz2025!') {
      // Generate JWT token
      const token = generateToken({
        userId: 'super-admin-1',
        email: 'itisaddy7@gmail.com',
        role: 'super_admin'
      });

      return NextResponse.json({
        message: 'Login successful',
        token,
        user: {
          id: 'super-admin-1',
          username: 'superadmin',
          email: 'itisaddy7@gmail.com',
          role: 'super_admin'
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}