import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import { initializeScheduler } from '@/utils/scheduler';

let schedulerInitialized = false;

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

    if (schedulerInitialized) {
      return NextResponse.json({
        message: 'Scheduler is already initialized',
        status: 'running'
      });
    }

    console.log('🔧 Manual scheduler initialization by admin:', authResult.user.username);
    
    // Initialize the scheduler
    initializeScheduler();
    schedulerInitialized = true;
    
    return NextResponse.json({
      message: 'Email notification scheduler initialized successfully',
      status: 'running',
      schedules: {
        dailyUpdate: '8:00 AM IST',
        eveningReminder: '6:00 PM IST'
      }
    });

  } catch (error) {
    console.error('Error initializing scheduler:', error);
    return NextResponse.json(
      { error: 'Failed to initialize scheduler' },
      { status: 500 }
    );
  }
}

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

    return NextResponse.json({
      initialized: schedulerInitialized,
      status: schedulerInitialized ? 'running' : 'stopped',
      schedules: {
        dailyUpdate: '8:00 AM IST',
        eveningReminder: '6:00 PM IST'
      }
    });

  } catch (error) {
    console.error('Error getting scheduler status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
