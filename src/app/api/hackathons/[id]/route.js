import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Hackathon from '@/models/Hackathon';
import { authenticateToken, createAuthResponse } from '@/middleware/auth';

// Handle PUT requests for updating hackathons
export const PUT = async (request, { params }) => {
  try {
    // Check user authentication (allow all authenticated users)
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return createAuthResponse(authResult.error, authResult.status);
    }

    await dbConnect();
    
    const { id } = await params;
    const data = await request.json();
    
    // Validate the hackathon exists
    console.log('🔍 Looking for hackathon with ID:', id);
    const existingHackathon = await Hackathon.findOne({ id });
    
    if (!existingHackathon) {
      console.log('❌ Hackathon not found with ID:', id);
      console.log('📋 Available IDs:', (await Hackathon.find({}, { id: 1, name: 1 })).map(h => ({ id: h.id, name: h.name })));
      return NextResponse.json(
        { error: `Hackathon not found with ID: ${id}` },
        { status: 404 }
      );
    }
    console.log('✅ Found hackathon:', existingHackathon.name, 'with ID:', id);
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'startDate', 'endDate', 'leader'];
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Update the hackathon
    const updatedHackathon = await Hackathon.findOneAndUpdate(
      { id },
      {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        technologies: data.technologies || '',
        prize: data.prize || '',
        totalTasks: Number(data.totalTasks) || 0,
        website: data.website || '',
        location: data.location || 'Remote',
        leader: data.leader,
        participants: data.participants || [],
        currentStage: data.currentStage || 'ppt',
        status: data.status || 'upcoming',
        roundDates: data.roundDates || {}
      },
      { new: true }
    );

    return NextResponse.json(updatedHackathon);
  } catch (error) {
    console.error('Update API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
};

// Handle DELETE requests for individual hackathons
export const DELETE = async (request, { params }) => {
  try {
    // Check user authentication (allow all authenticated users)
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return createAuthResponse(authResult.error, authResult.status);
    }

    await dbConnect();
    
    const { id } = await params;
    
    // Find the hackathon
    const hackathon = await Hackathon.findOne({ id });
    
    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    // Delete the hackathon
    await Hackathon.deleteMany({ id });
    
    return NextResponse.json(
      { message: 'Hackathon deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete Individual Hackathon API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
};

// Handle GET requests for single hackathon
export const GET = async (request, { params }) => {
  try {
    await dbConnect();
    
    const { id } = await params;
    const hackathon = await Hackathon.findOne({ id });
    
    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(hackathon);
  } catch (error) {
    console.error('Get Single Hackathon API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
