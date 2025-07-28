import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import dbConnect from '@/utils/dbConnect';
import Hackathon from '@/models/Hackathon';
import { getHackathonStageInfo } from '@/utils/stageUpdateService';

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

    await dbConnect();
    
    // Get all active and upcoming hackathons
    const hackathons = await Hackathon.find({
      status: { $in: ['active', 'upcoming'] }
    });

    const stageInfo = hackathons.map(hackathon => {
      const info = getHackathonStageInfo(hackathon);
      return {
        id: hackathon.id,
        name: hackathon.name,
        currentStage: info.currentStage,
        calculatedStage: info.calculatedStage,
        isCorrect: info.isCorrect,
        roundDates: info.roundDates,
        status: hackathon.status
      };
    });

    // Count hackathons that need stage updates
    const needsUpdate = stageInfo.filter(info => !info.isCorrect).length;
    const upToDate = stageInfo.filter(info => info.isCorrect).length;

    return NextResponse.json({
      success: true,
      data: {
        totalHackathons: hackathons.length,
        needsUpdate: needsUpdate,
        upToDate: upToDate,
        hackathons: stageInfo,
        lastChecked: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error in stage update status API:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}
