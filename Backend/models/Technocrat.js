import mongoose from 'mongoose';

const technocratSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide technocrat name'],
    trim: true
  },
  enrollmentNumber: {
    type: String,
    required: [true, 'Please provide enrollment number'],
    unique: true,
    uppercase: true
  },
  semester: {
    type: Number,
    required: [true, 'Please provide semester'],
    min: 1,
    max: 8
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please provide mobile number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number']
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
    required: true
  },
  assignedEvents: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Event'
    }
  ],
  isIconPlayer: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Validate event count (max 3)
technocratSchema.pre('save', async function(next) {
  if (this.assignedEvents.length > 3) {
    throw new Error('Maximum 3 events allowed per technocrat');
  }
  next();
});

export default mongoose.model('Technocrat', technocratSchema);
