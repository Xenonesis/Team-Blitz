import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import { triggerManualStageUpdate } from '@/utils/scheduler';

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

    console.log('🔄 Manual stage update triggered by admin');
    
    // Trigger manual stage update
    const result = await triggerManualStageUpdate();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Stage update completed successfully',
        data: {
          totalChecked: result.totalChecked,
          totalUpdated: result.totalUpdated,
          duration: result.duration,
          results: result.results,
          timestamp: result.timestamp
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Stage update failed',
        error: result.error,
        duration: result.duration,
        timestamp: result.timestamp
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error in manual stage update API:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}
