import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import { triggerManualNotification } from '@/utils/scheduler';

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

    console.log('🔧 Manual notification triggered by admin:', authResult.user.username);
    
    const result = await triggerManualNotification();
    
    if (result.success) {
      return NextResponse.json({
        message: 'Notifications sent successfully',
        totalSent: result.totalSent,
        totalFailed: result.totalFailed,
        details: result.details
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send notifications', details: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in manual notification trigger:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
