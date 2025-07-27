import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Hackathon from '@/models/Hackathon';
import { requireAdmin, createAuthResponse } from '@/middleware/auth';

export const GET = async () => {
  try {
    await dbConnect();
    const hackathons = await Hackathon.find()
      .populate('leader')
      .populate('participants')
      .populate('currentStage');
    
    return NextResponse.json(hackathons);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Handle POST requests
// Handle DELETE requests
export const DELETE = async (request) => {
  try {
    // Check admin authentication
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return createAuthResponse(authResult.error, authResult.status);
    }

    await dbConnect();
    
    // Get the hackathon ID from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Hackathon ID is required' },
        { status: 400 }
      );
    }

    // Find and delete the hackathon
    const hackathon = await Hackathon.findOne({ id });
    
    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    // Only allow deletion of completed hackathons
    if (hackathon.status !== 'completed') {
      return NextResponse.json(
        { error: 'Only completed hackathons can be deleted' },
        { status: 400 }
      );
    }

    // Delete the hackathon
    await Hackathon.deleteOne({ id });
    
    return NextResponse.json(
      { message: 'Hackathon deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const POST = async (request) => {
  try {
    // Check admin authentication
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return createAuthResponse(authResult.error, authResult.status);
    }

    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected successfully');

    console.log('Parsing request data...');
    const data = await request.json();
    console.log('Received data:', JSON.stringify(data, null, 2));
    console.log('Received roundDates specifically:', data.roundDates);
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'startDate', 'endDate', 'leader'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create hackathon with defaults for optional fields
    const hackathonData = {
      id: data.id,
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      leader: data.leader,
      location: data.location || 'Remote',
      currentStage: 'ppt',
      status: new Date(data.startDate) > new Date() ? 'upcoming' : 'active',
      participants: data.participants || [data.leader],
      website: data.website || '',
      prize: data.prize || '',
      technologies: data.technologies || '',
      totalTasks: data.totalTasks || 0,
      progress: {
        completedTasks: 0,
        totalTasks: data.totalTasks || 0
      },
      roundDates: data.roundDates || {}
    };
    
    console.log('Creating new hackathon with data:', JSON.stringify(hackathonData, null, 2));
    console.log('hackathonData.roundDates specifically:', hackathonData.roundDates);
    const newHackathon = await Hackathon.create(hackathonData);
    console.log('Created new hackathon:', newHackathon);
    
    return NextResponse.json(newHackathon, { status: 201 });
  } catch (error) {
    console.error('Detailed API Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { 
        error: error.message || 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}