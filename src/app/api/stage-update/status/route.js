import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/utils/dbConnect';
import Hackathon from '@/models/Hackathon';
import { getHackathonStageInfo } from '@/utils/stageUpdateService';

export async function GET(request) {
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
