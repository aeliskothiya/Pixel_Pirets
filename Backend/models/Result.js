import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
    required: true
  },
  position: {
    type: String,
    enum: ['1st', '2nd', '3rd'],
    required: [true, 'Please provide position']
  },
  pointsAwarded: {
    type: Number,
    required: true
  },
  technocrats: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Technocrat'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique event + team + position combination
resultSchema.index({ event: 1, team: 1, position: 1 }, { unique: true });

export default mongoose.model('Result', resultSchema);
