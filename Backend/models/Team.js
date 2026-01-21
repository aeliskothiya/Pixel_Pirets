import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, 'Please provide team name'],
    trim: true
  },
  teamCode: {
    type: String,
    required: [true, 'Please provide team code'],
    unique: true,
    uppercase: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'Owner',
    required: true
  },
  ownerDetails: {
    name: String,
    email: String,
    contact: String
  },
  iconPlayer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Technocrat'
  },
  totalScore: {
    type: Number,
    default: 0
  },
  rank: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Team', teamSchema);
