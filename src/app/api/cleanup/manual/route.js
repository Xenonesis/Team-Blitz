import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import { triggerManualCleanup } from '@/utils/scheduler';

export async function POST(request) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    console.log('🧹 Manual cleanup triggered by admin:', authResult.user.username);
    
    // Trigger manual cleanup
    const result = await triggerManualCleanup();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        deletedCount: result.deletedCount,
        deletedHackathons: result.deletedHackathons,
        errors: result.errors,
        executionTime: result.executionTime
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: result.message,
          errors: result.errors
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in manual cleanup:', error);
    return NextResponse.json(
      { error: 'Failed to execute cleanup' },
      { status: 500 }
    );
  }
}
