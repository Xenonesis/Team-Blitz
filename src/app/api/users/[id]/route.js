import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

// GET - Fetch single user (admin only)
export async function GET(request, { params }) {
  try {
    // Verify admin authentication
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await dbConnect();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user.toJSON());
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT - Update user (admin only)
export async function PUT(request, { params }) {
  try {
    // Verify admin authentication
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await dbConnect();

    const updateData = await request.json();
    const user = await User.findById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user properties
    if (updateData.username !== undefined) user.username = updateData.username;
    if (updateData.email !== undefined) user.email = updateData.email;
    if (updateData.role !== undefined) user.role = updateData.role;
    if (updateData.isActive !== undefined) user.isActive = updateData.isActive;
    
    // Only update password if provided
    if (updateData.password && updateData.password.trim() !== '') {
      user.password = updateData.password;
    }

    await user.save();

    return NextResponse.json({
      message: 'User updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    
    if (error.message.includes('Validation Error')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (admin only)
export async function DELETE(request, { params }) {
  try {
    // Verify admin authentication
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await dbConnect();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admin from deleting themselves
    if (user.id === authResult.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // For Firebase, we need to delete the document
    if (!process.env.MOCK_MODE) {
      const { adminDb } = await import('@/utils/firebaseAdmin');
      await adminDb.collection('users').doc(params.id).delete();
    }

    return NextResponse.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}