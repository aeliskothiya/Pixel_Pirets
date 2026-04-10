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
  startTime: {
    type: Date,
    required: [true, 'Please provide event start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide event end time'],
    validate: {
      validator: function(value) {
        return value > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  venue: {
    type: String,
    required: [true, 'Please provide event venue'],
    trim: true
  },
  requiredMembers: {
    type: Number,
    required: [true, 'Please provide required members count'],
    min: 1,
    validate: {
      validator: function(value) {
        if (this.eventType === 'Solo') return value === 1;
        if (this.eventType === 'Duet') return value === 2;
        if (this.eventType === 'Group') return value >= 3;
        return false;
      },
      message: 'Invalid required members for this event type'
    }
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
