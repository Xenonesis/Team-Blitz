import { NextResponse } from 'next/server';
import { 
  ALLOWED_EMAILS, 
  BLOCKED_EMAILS,
  isEmailAllowed, 
  addAllowedEmail, 
  removeAllowedEmail,
  blockEmail,
  unblockEmail,
  isSuperAdmin 
} from '@/config/allowedEmails';
import { verifyToken } from '@/utils/auth';

// GET - List all allowed emails and blocked emails (super admin only)
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // Check if user is super admin
    if (!decoded || !isSuperAdmin(decoded.email)) {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    return NextResponse.json({ 
      allowedEmails: ALLOWED_EMAILS,
      blockedEmails: BLOCKED_EMAILS,
      count: ALLOWED_EMAILS.length,
      blockedCount: BLOCKED_EMAILS.length
    });
  } catch (error) {
    console.error('Error fetching allowed emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add new allowed email or manage blocking (super admin only)
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // Check if user is super admin
    if (!decoded || !isSuperAdmin(decoded.email)) {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    const { email, action } = await request.json();
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Handle different actions
    if (action === 'block') {
      const blocked = blockEmail(normalizedEmail);
      if (blocked) {
        return NextResponse.json({ 
          message: 'Email blocked successfully',
          email: normalizedEmail,
          allowedEmails: ALLOWED_EMAILS,
          blockedEmails: BLOCKED_EMAILS
        });
      } else {
        return NextResponse.json({ error: 'Email already blocked or failed to block' }, { status: 409 });
      }
    } else if (action === 'unblock') {
      const unblocked = unblockEmail(normalizedEmail);
      if (unblocked) {
        return NextResponse.json({ 
          message: 'Email unblocked successfully',
          email: normalizedEmail,
          allowedEmails: ALLOWED_EMAILS,
          blockedEmails: BLOCKED_EMAILS
        });
      } else {
        return NextResponse.json({ error: 'Email not found in blocked list' }, { status: 404 });
      }
    } else {
      // Default action: add to allowed list
      if (ALLOWED_EMAILS.includes(normalizedEmail)) {
        return NextResponse.json({ error: 'Email already in allowed list' }, { status: 409 });
      }

      const added = addAllowedEmail(normalizedEmail);
      
      if (added) {
        return NextResponse.json({ 
          message: 'Email added successfully',
          email: normalizedEmail,
          allowedEmails: ALLOWED_EMAILS,
          blockedEmails: BLOCKED_EMAILS
        });
      } else {
        return NextResponse.json({ error: 'Failed to add email' }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error managing email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove allowed email (super admin only)
export async function DELETE(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // Check if user is super admin
    if (!decoded || !isSuperAdmin(decoded.email)) {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    const { email } = await request.json();
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    const removed = removeAllowedEmail(normalizedEmail);
    
    if (removed) {
      return NextResponse.json({ 
        message: 'Email removed successfully',
        email: normalizedEmail,
        allowedEmails: ALLOWED_EMAILS,
        blockedEmails: BLOCKED_EMAILS
      });
    } else {
      return NextResponse.json({ error: 'Email not found in allowed list' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error removing allowed email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}