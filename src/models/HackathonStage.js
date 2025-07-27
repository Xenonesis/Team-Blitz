import mongoose from 'mongoose';

const hackathonStageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  order: { 
    type: Number, 
    required: true 
  } // To maintain stage sequence
}, { timestamps: true });

export default mongoose.models.HackathonStage || 
       mongoose.model('HackathonStage', hackathonStageSchema);