import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true 
  },
  skills: { 
    type: [String], 
    default: [] 
  }
}, { timestamps: true });

export default mongoose.models.TeamMember || 
       mongoose.model('TeamMember', teamMemberSchema);