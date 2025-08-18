const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address/location is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['music', 'art-culture', 'tech-innovation', 'sports', 'food-drink', 'business', 'education', 'health', 'other']
  },
  image: {
    type: String, // Will store image filename or URL
    default: null
  },
  organizer: {
    name: { type: String, default: 'Anonymous' },
    email: { type: String },
    phone: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: {
      values: ['recommended', 'featured'],
      message: 'Priority must be either "recommended" or "featured"'
    },
    default: null,
    validate: {
      validator: function (value) {
        return value === null || value === 'recommended' || value === 'featured';
      },
      message: 'Priority must be null, "recommended", or "featured"'
    }
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: String // Admin who reviewed
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for better query performance
eventSchema.index({ status: 1, submittedAt: -1 });
eventSchema.index({ category: 1 });

// Virtual for location (alias for address)
eventSchema.virtual('location').get(function () {
  return this.address;
});

// Virtual for title (alias for eventName)
eventSchema.virtual('title').get(function () {
  return this.eventName;
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
