import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import AllowedEmail from '@/models/AllowedEmail';
import { isSuperAdmin } from '@/config/allowedEmails';

// GET - List all allowed emails and blocked emails (super admin only)
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

    // Additional check for super admin
    if (!isSuperAdmin(authResult.user.email)) {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    // Get emails from database
    const allowedEmails = await AllowedEmail.getAllowedEmails();
    const blockedEmails = await AllowedEmail.getBlockedEmails();

    return NextResponse.json({ 
      allowedEmails,
      blockedEmails,
      count: allowedEmails.length,
      blockedCount: blockedEmails.length
    });
  } catch (error) {
    console.error('Error fetching allowed emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add new allowed email or manage blocking (super admin only)
export async function POST(request) {
  try {
    // Verify admin authentication
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Additional check for super admin
    if (!isSuperAdmin(authResult.user.email)) {
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

    try {
      // Handle different actions
      if (action === 'block') {
        await AllowedEmail.blockEmail(normalizedEmail, authResult.user.email);
        const allowedEmails = await AllowedEmail.getAllowedEmails();
        const blockedEmails = await AllowedEmail.getBlockedEmails();
        
        return NextResponse.json({ 
          message: 'Email blocked successfully',
          email: normalizedEmail,
          allowedEmails,
          blockedEmails
        });
      } else if (action === 'unblock') {
        await AllowedEmail.addEmail(normalizedEmail, authResult.user.email);
        const allowedEmails = await AllowedEmail.getAllowedEmails();
        const blockedEmails = await AllowedEmail.getBlockedEmails();
        
        return NextResponse.json({ 
          message: 'Email unblocked successfully',
          email: normalizedEmail,
          allowedEmails,
          blockedEmails
        });
      } else {
        // Default action: add to allowed list
        await AllowedEmail.addEmail(normalizedEmail, authResult.user.email);
        const allowedEmails = await AllowedEmail.getAllowedEmails();
        const blockedEmails = await AllowedEmail.getBlockedEmails();
        
        return NextResponse.json({ 
          message: 'Email added successfully',
          email: normalizedEmail,
          allowedEmails,
          blockedEmails
        });
      }
    } catch (dbError) {
      if (dbError.message.includes('already in allowed list')) {
        return NextResponse.json({ error: dbError.message }, { status: 409 });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error managing email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove allowed email (super admin only)
export async function DELETE(request) {
  try {
    // Verify admin authentication
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Additional check for super admin
    if (!isSuperAdmin(authResult.user.email)) {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    const { email } = await request.json();
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    const removed = await AllowedEmail.removeEmail(normalizedEmail);
    
    if (removed) {
      const allowedEmails = await AllowedEmail.getAllowedEmails();
      const blockedEmails = await AllowedEmail.getBlockedEmails();
      
      return NextResponse.json({ 
        message: 'Email removed successfully',
        email: normalizedEmail,
        allowedEmails,
        blockedEmails
      });
    } else {
      return NextResponse.json({ error: 'Email not found in allowed list' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error removing allowed email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}