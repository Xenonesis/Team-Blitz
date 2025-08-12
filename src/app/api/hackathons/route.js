import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    // Lazy load dependencies to avoid Firebase import errors
    const dbConnect = (await import('@/utils/dbConnect')).default;
    const Hackathon = (await import('@/models/Hackathon')).default;
    
    await dbConnect();
    const hackathons = await Hackathon.find();
    
    return NextResponse.json(hackathons);
  } catch (error) {
    console.error('API Error:', error);
    
    // Return mock data if Firebase is not configured
    const mockHackathons = [
      {
        id: 'demo-hackathon-1',
        name: 'Tech Innovation Challenge 2025',
        description: 'A 48-hour hackathon focused on innovative tech solutions for everyday problems.',
        startDate: '2025-02-15',
        endDate: '2025-02-17',
        leader: {
          id: '1',
          name: 'John Doe',
          role: 'Team Lead',
          email: 'john@example.com',
          skills: 'React, Node.js, Firebase'
        },
        currentStage: 'ppt',
        progress: { completedTasks: 2, totalTasks: 10 },
        participants: [
          { id: '2', name: 'Jane Smith', role: 'Designer', email: 'jane@example.com', skills: 'UI/UX Design' },
          { id: '3', name: 'Mike Johnson', role: 'Backend Dev', email: 'mike@example.com', skills: 'Python, APIs' }
        ],
        status: 'upcoming',
        location: 'San Francisco, CA',
        website: 'https://techinnovators.com',
        prize: '$50,000',
        technologies: 'React, Node.js, Firebase',
        totalTasks: 10,
        roundDates: {
          ppt: '2025-02-15',
          round1: '2025-02-16',
          round2: '2025-02-17',
          semifinal: '2025-02-18',
          final: '2025-02-19'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'demo-hackathon-2',
        name: 'AI Innovation Summit 2025',
        description: 'Build the next generation of AI-powered applications.',
        startDate: '2025-03-01',
        endDate: '2025-03-03',
        leader: {
          id: '4',
          name: 'Sarah Wilson',
          role: 'AI Lead',
          email: 'sarah@example.com',
          skills: 'Python, TensorFlow, Machine Learning'
        },
        currentStage: 'round1',
        progress: { completedTasks: 5, totalTasks: 12 },
        participants: [
          { id: '5', name: 'Alex Chen', role: 'Data Scientist', email: 'alex@example.com', skills: 'Python, Data Analysis' },
          { id: '6', name: 'Maria Garcia', role: 'Frontend Dev', email: 'maria@example.com', skills: 'React, TypeScript' }
        ],
        status: 'active',
        location: 'New York, NY',
        website: 'https://aiinnovation.com',
        prize: '$75,000',
        technologies: 'Python, TensorFlow, React',
        totalTasks: 12,
        roundDates: {
          ppt: '2025-03-01',
          round1: '2025-03-02',
          round2: '2025-03-03',
          semifinal: '2025-03-04',
          final: '2025-03-05'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    console.log('⚠️ Using mock data - Firebase not configured');
    return NextResponse.json(mockHackathons);
  }
}

// Handle POST requests
// Handle DELETE requests
export const DELETE = async (request) => {
  try {
    // Lazy load dependencies to avoid Firebase import errors
    const { requireAdmin, createAuthResponse } = await import('@/middleware/auth');
    const dbConnect = (await import('@/utils/dbConnect')).default;
    const Hackathon = (await import('@/models/Hackathon')).default;

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
    await Hackathon.deleteMany({ id });
    
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
    // Lazy load dependencies to avoid Firebase import errors
    const { requireAdmin, createAuthResponse } = await import('@/middleware/auth');
    const dbConnect = (await import('@/utils/dbConnect')).default;
    const Hackathon = (await import('@/models/Hackathon')).default;

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
    const newHackathon = new Hackathon(hackathonData);
    await newHackathon.save();
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