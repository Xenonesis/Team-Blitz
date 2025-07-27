import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  id: String,
  name: String,
  role: String,
  email: String,
  skills: String
}, { _id: false });

const progressSchema = new mongoose.Schema({
  completedTasks: { 
    type: Number, 
    default: 0 
  },
  totalTasks: { 
    type: Number, 
    default: 0 
  }
}, { _id: false });

const hackathonSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: { 
    type: String, 
    required: true 
  },
  leader: { 
    type: memberSchema,
    required: true 
  },
  currentStage: { 
    type: String,
    required: true,
    default: 'ppt'
  },
  progress: {
    type: progressSchema,
    required: true,
    default: () => ({
      completedTasks: 0,
      totalTasks: 0
    })
  },
  startDate: { 
    type: String, 
    required: true 
  },
  endDate: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  participants: {
    type: [memberSchema],
    default: []
  },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'upcoming'], 
    required: true,
    default: 'upcoming'
  },
  location: { 
    type: String, 
    required: true 
  },
  website: { 
    type: String,
    default: ''
  },
  prize: { 
    type: String,
    default: ''
  },
  technologies: { 
    type: String,
    default: ''
  },
  totalTasks: {
    type: Number,
    required: true,
    default: 0
  },
  roundDates: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

export default mongoose.models.Hackathon || 
       mongoose.model('Hackathon', hackathonSchema);