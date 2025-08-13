// Temporary mock Firebase for testing without credentials
// This allows the app to run while you set up Firebase

const mockData = {
  hackathons: [
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
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  users: [
    {
      id: 'mock-admin-user',
      username: 'admin',
      email: 'admin@teamblitz.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PqhEIe', // hashed 'admin123'
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'mock-super-admin-user',
      username: 'superadmin',
      email: 'itisaddy7@gmail.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PqhEIe', // hashed 'admin123'
      role: 'super_admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  allowed_emails: [
    {
      id: 'mock-allowed-1',
      email: 'itisaddy7@gmail.com',
      status: 'allowed',
      addedBy: 'system',
      addedAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'mock-allowed-2',
      email: 'aayushtonk02@gmail.com',
      status: 'allowed',
      addedBy: 'itisaddy7@gmail.com',
      addedAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'mock-allowed-3',
      email: 'admin@teamblitz.com',
      status: 'allowed',
      addedBy: 'system',
      addedAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'mock-blocked-1',
      email: 'blocked@example.com',
      status: 'blocked',
      addedBy: 'itisaddy7@gmail.com',
      addedAt: new Date(),
      updatedAt: new Date()
    }
  ],
  teamMembers: [],
  hackathonStages: []
};

// Mock database connection
export const mockDbConnect = async () => {
  console.log('\n=================================');
  console.log('\x1b[33m%s\x1b[0m', '⚠️  Mock Firebase Connection (Demo Mode)');
  console.log('\x1b[33m%s\x1b[0m', '⚠️  Using mock data for testing');
  console.log('\x1b[33m%s\x1b[0m', '⚠️  Set up real Firebase credentials to use live data');
  console.log('=================================\n');
  return true;
};

// Mock Firestore operations
export const mockCollection = (collectionName) => ({
  find: async (query = {}) => {
    console.log(`📋 Mock: Finding ${collectionName} with query:`, query);
    const items = mockData[collectionName] || [];
    
    if (!query || Object.keys(query).length === 0) {
      return items;
    }
    
    // Handle status.$in queries (like { status: { $in: ['active', 'upcoming'] } })
    if (query.status && query.status.$in) {
      return items.filter(item => query.status.$in.includes(item.status));
    }
    
    // Handle regular queries
    return items.filter(item => {
      return Object.entries(query).every(([field, value]) => {
        if (typeof value === 'object' && value.$in) {
          return value.$in.includes(item[field]);
        }
        return item[field] === value;
      });
    });
  },
  
  findOne: async (query) => {
    console.log(`📋 Mock: Finding one ${collectionName} with query:`, query);
    const items = mockData[collectionName] || [];
    
    if (!query || Object.keys(query).length === 0) {
      return items[0] || null;
    }
    
    // Handle $or queries
    if (query.$or) {
      for (const condition of query.$or) {
        const field = Object.keys(condition)[0];
        const value = condition[field];
        const found = items.find(item => item[field] === value);
        if (found) return found;
      }
      return null;
    }
    
    // Handle regular queries
    return items.find(item => {
      return Object.entries(query).every(([field, value]) => item[field] === value);
    }) || null;
  },
  
  findById: async (id) => {
    console.log(`📋 Mock: Finding ${collectionName} by ID:`, id);
    const items = mockData[collectionName] || [];
    return items.find(item => item.id === id) || null;
  },
  
  save: async (data) => {
    console.log(`📋 Mock: Saving to ${collectionName}:`, data);
    if (!mockData[collectionName]) mockData[collectionName] = [];
    
    // If item has an ID, update existing item
    if (data.id) {
      const index = mockData[collectionName].findIndex(item => item.id === data.id);
      if (index !== -1) {
        mockData[collectionName][index] = { ...data };
        return mockData[collectionName][index];
      }
    }
    
    // Otherwise, add new item
    const newItem = { ...data, id: data.id || `mock-${Date.now()}` };
    mockData[collectionName].push(newItem);
    return newItem;
  },
  
  update: async (id, data) => {
    console.log(`📋 Mock: Updating ${collectionName} ID ${id}:`, data);
    if (!mockData[collectionName]) mockData[collectionName] = [];
    
    const index = mockData[collectionName].findIndex(item => item.id === id);
    if (index !== -1) {
      mockData[collectionName][index] = { ...mockData[collectionName][index], ...data };
      return mockData[collectionName][index];
    }
    return null;
  },
  
  deleteOne: async (query) => {
    console.log(`📋 Mock: Deleting one from ${collectionName} with query:`, query);
    if (!mockData[collectionName]) return false;
    
    const index = mockData[collectionName].findIndex(item => {
      return Object.entries(query).every(([field, value]) => item[field] === value);
    });
    
    if (index !== -1) {
      mockData[collectionName].splice(index, 1);
      return true;
    }
    return false;
  },
  
  deleteMany: async (query) => {
    console.log(`📋 Mock: Deleting from ${collectionName} with query:`, query);
    if (!mockData[collectionName]) return { deletedCount: 0 };
    
    const initialLength = mockData[collectionName].length;
    mockData[collectionName] = mockData[collectionName].filter(item => {
      return !Object.entries(query).every(([field, value]) => item[field] === value);
    });
    
    return { deletedCount: initialLength - mockData[collectionName].length };
  }
});

export const isMockMode = () => {
  const hasCredentials = process.env.FIREBASE_PRIVATE_KEY && 
                        process.env.FIREBASE_CLIENT_EMAIL && 
                        !process.env.FIREBASE_PRIVATE_KEY.includes('REPLACE_WITH');
  return !hasCredentials;
};