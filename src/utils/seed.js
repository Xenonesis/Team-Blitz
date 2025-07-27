import dbConnect from './dbConnect';
import TeamMember from '../models/TeamMember';
import HackathonStage from '../models/HackathonStage';
import Hackathon from '../models/Hackathon';

const seedDatabase = async () => {
  try {
    await dbConnect();
    
    // Clear existing data
    await TeamMember.deleteMany({});
    await HackathonStage.deleteMany({});
    await Hackathon.deleteMany({});
    
    // Create stages
    const stages = await HackathonStage.insertMany([
      { name: 'PPT Round', description: 'Initial presentation of project idea', order: 1 },
      { name: 'Round 1', description: 'Prototype development phase', order: 2 },
      { name: 'Round 2', description: 'Feature implementation', order: 3 },
      { name: 'Semifinal', description: 'Advanced development & testing', order: 4 },
      { name: 'Final', description: 'Demo presentation to judges', order: 5 }
    ]);
    
    // Create team members
    const members = await TeamMember.insertMany([
      { name: 'Alex Johnson', role: 'Team Lead', email: 'alex@team.com', skills: ['React', 'Node.js', 'Leadership'] },
      { name: 'Sam Smith', role: 'Frontend Dev', email: 'sam@team.com', skills: ['JavaScript', 'CSS', 'UI/UX'] },
      { name: 'Taylor Reed', role: 'Backend Dev', email: 'taylor@team.com', skills: ['Python', 'Databases', 'API Design'] },
      { name: 'Jordan Lee', role: 'UI/UX Designer', email: 'jordan@team.com', skills: ['Figma', 'User Research', 'Prototyping'] }
    ]);
    
    // Create hackathons
    await Hackathon.insertMany([
      {
        name: 'Tech Innovators 2023',
        leader: members[0]._id,
        currentStage: stages[1]._id,
        progress: { completedTasks: 8, totalTasks: 15 },
        startDate: new Date('2023-10-15'),
        endDate: new Date('2023-11-20'),
        description: 'Annual tech innovation challenge focusing on sustainable solutions',
        participants: [members[0]._id],
        status: 'active',
        location: 'San Francisco',
        website: 'https://techinnovators.com',
        prize: '$50,000',
        technologies: ['React', 'Node.js', 'MongoDB']
      },
      // Add other hackathons similarly
    ]);
    
    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();