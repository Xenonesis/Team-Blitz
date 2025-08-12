import { NextResponse } from 'next/server';
import { ALLOWED_EMAILS, isEmailAllowed, addAllowedEmail } from '@/config/allowedEmails';
import { verifyToken } from '@/utils/auth';

// GET - List all allowed emails (admin only)
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    return NextResponse.json({ 
      allowedEmails: ALLOWED_EMAILS,
      count: ALLOWED_EMAILS.length 
    });
  } catch (error) {
    console.error('Error fetching allowed emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add new allowed email (admin only)
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { email } = await request.json();
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (isEmailAllowed(normalizedEmail)) {
      return NextResponse.json({ error: 'Email already in allowed list' }, { status: 409 });
    }

    const added = addAllowedEmail(normalizedEmail);
    
    if (added) {
      return NextResponse.json({ 
        message: 'Email added successfully',
        email: normalizedEmail,
        allowedEmails: ALLOWED_EMAILS 
      });
    } else {
      return NextResponse.json({ error: 'Failed to add email' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error adding allowed email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove allowed email (admin only)
export async function DELETE(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { email } = await request.json();
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const index = ALLOWED_EMAILS.indexOf(normalizedEmail);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Email not found in allowed list' }, { status: 404 });
    }

    ALLOWED_EMAILS.splice(index, 1);
    
    return NextResponse.json({ 
      message: 'Email removed successfully',
      email: normalizedEmail,
      allowedEmails: ALLOWED_EMAILS 
    });
  } catch (error) {
    console.error('Error removing allowed email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}