import dbConnect from './dbConnect.js';
import TeamMember from '../models/TeamMember.js';
import HackathonStage from '../models/HackathonStage.js';
import Hackathon from '../models/Hackathon.js';

const seedDatabase = async () => {
  try {
    await dbConnect();
    
    // Clear existing data
    await TeamMember.deleteMany({});
    await HackathonStage.deleteMany({});
    await Hackathon.deleteMany({});
    
    // Create stages
    const stageData = [
      { name: 'PPT Round', description: 'Initial presentation of project idea', order: 1 },
      { name: 'Round 1', description: 'Prototype development phase', order: 2 },
      { name: 'Round 2', description: 'Feature implementation', order: 3 },
      { name: 'Semifinal', description: 'Advanced development & testing', order: 4 },
      { name: 'Final', description: 'Demo presentation to judges', order: 5 }
    ];
    
    const stages = [];
    for (const data of stageData) {
      const stage = new HackathonStage(data);
      await stage.save();
      stages.push(stage);
    }
    
    // Create team members
    const memberData = [
      { name: 'Alex Johnson', role: 'Team Lead', email: 'alex@team.com', skills: ['React', 'Node.js', 'Leadership'] },
      { name: 'Sam Smith', role: 'Frontend Dev', email: 'sam@team.com', skills: ['JavaScript', 'CSS', 'UI/UX'] },
      { name: 'Taylor Reed', role: 'Backend Dev', email: 'taylor@team.com', skills: ['Python', 'Databases', 'API Design'] },
      { name: 'Jordan Lee', role: 'UI/UX Designer', email: 'jordan@team.com', skills: ['Figma', 'User Research', 'Prototyping'] }
    ];
    
    const members = [];
    for (const data of memberData) {
      const member = new TeamMember(data);
      await member.save();
      members.push(member);
    }
    
    // Create hackathons
    const hackathonData = [
      {
        id: 'tech-innovators-2023',
        name: 'Tech Innovators 2023',
        leader: {
          id: members[0].id,
          name: members[0].name,
          role: members[0].role,
          email: members[0].email,
          skills: members[0].skills.join(', ')
        },
        currentStage: 'round1',
        progress: { completedTasks: 8, totalTasks: 15 },
        startDate: '2023-10-15',
        endDate: '2023-11-20',
        description: 'Annual tech innovation challenge focusing on sustainable solutions',
        participants: [
          {
            id: members[0].id,
            name: members[0].name,
            role: members[0].role,
            email: members[0].email,
            skills: members[0].skills.join(', ')
          }
        ],
        status: 'active',
        location: 'San Francisco',
        website: 'https://techinnovators.com',
        prize: '$50,000',
        technologies: 'React, Node.js, Firebase'
      }
    ];
    
    for (const data of hackathonData) {
      const hackathon = new Hackathon(data);
      await hackathon.save();
    }
    
    console.log('✅ Database seeded successfully');
    console.log(`📊 Seeded ${stages.length} hackathon stages`);
    console.log(`👥 Seeded ${members.length} team members`);
    console.log(`🏆 Seeded ${hackathonData.length} hackathons`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();