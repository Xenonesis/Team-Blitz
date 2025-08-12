import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

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

    const { currentPassword, newPassword, targetEmail } = await request.json();

    // Validate input
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    let userToUpdate;

    if (targetEmail) {
      // Admin is updating another user's password
      userToUpdate = await User.findOne({ email: targetEmail.toLowerCase() });
      if (!userToUpdate) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    } else {
      // Admin is updating their own password
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required' },
          { status: 400 }
        );
      }

      userToUpdate = authResult.user;
      
      // Verify current password
      const isCurrentPasswordValid = await userToUpdate.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    userToUpdate.password = hashedPassword;
    userToUpdate.updatedAt = new Date();
    await userToUpdate.save();

    return NextResponse.json({
      message: targetEmail 
        ? `Password updated successfully for ${targetEmail}` 
        : 'Your password has been updated successfully'
    });

  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}