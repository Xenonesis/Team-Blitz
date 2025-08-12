import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import dbConnect from '@/utils/dbConnect';
import Hackathon from '@/models/Hackathon';

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

    await dbConnect();
    
    // Get all hackathons with participant counts
    const hackathons = await Hackathon.find({
      status: { $in: ['active', 'upcoming'] }
    });

    const notificationStatus = hackathons.map(hackathon => {
      const totalParticipants = hackathon.participants.length + 1; // +1 for leader
      const uniqueEmails = new Set([
        hackathon.leader?.email,
        ...hackathon.participants.map(p => p.email).filter(Boolean)
      ].filter(Boolean));

      return {
        hackathonId: hackathon.id,
        name: hackathon.name,
        status: hackathon.status,
        currentStage: hackathon.currentStage,
        totalParticipants,
        uniqueEmailCount: uniqueEmails.size,
        roundDates: hackathon.roundDates,
        endDate: hackathon.endDate
      };
    });

    return NextResponse.json({
      schedulerActive: true,
      totalHackathons: hackathons.length,
      hackathons: notificationStatus,
      scheduleInfo: {
        dailyUpdate: '8:00 AM IST',
        eveningReminder: '6:00 PM IST',
        timezone: 'Asia/Kolkata'
      }
    });

  } catch (error) {
    console.error('Error getting notification status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
