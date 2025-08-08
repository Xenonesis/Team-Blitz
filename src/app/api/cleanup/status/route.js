import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import { getCleanupStats } from '@/utils/cleanupService';
import { getSchedulerStatus } from '@/utils/scheduler';

export async function GET(request) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Get cleanup statistics
    const cleanupStats = await getCleanupStats();
    
    // Get scheduler status
    const schedulerStatus = getSchedulerStatus();
    
    return NextResponse.json({
      success: true,
      schedulerStatus: schedulerStatus,
      cleanupStats: {
        expiredHackathonsCount: cleanupStats.expiredCount,
        expiredHackathons: cleanupStats.expiredHackathons,
        nextCleanupTime: '2:00 AM IST (Daily)',
        lastCleanupTime: 'Not available', // Could be enhanced to track this
      },
      systemInfo: {
        timezone: 'Asia/Kolkata',
        currentTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        cleanupSchedule: 'Daily at 2:00 AM IST'
      }
    });

  } catch (error) {
    console.error('Error getting cleanup status:', error);
    return NextResponse.json(
      { error: 'Failed to get cleanup status' },
      { status: 500 }
    );
  }
}
