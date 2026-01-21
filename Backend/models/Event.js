import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, 'Please provide event name'],
    trim: true
  },
  eventType: {
    type: String,
    enum: ['Solo', 'Duet', 'Group'],
    required: [true, 'Please provide event type']
  },
  points: {
    first: {
      type: Number,
      required: true,
      min: 0
    },
    second: {
      type: Number,
      required: true,
      min: 0
    },
    third: {
      type: Number,
      required: true,
      min: 0
    }
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

export default mongoose.model('Event', eventSchema);
