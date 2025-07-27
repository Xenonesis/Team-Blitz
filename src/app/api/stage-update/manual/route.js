import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { triggerManualStageUpdate } from '@/utils/scheduler';

export async function POST(request) {
  try {
    // Verify JWT token for admin access
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded.isAdmin) {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
    } catch (jwtError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
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
