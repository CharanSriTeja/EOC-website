// models/Event.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const EventSchema = new Schema({
  name: { 
    type: String,
    required: true 
  },
  theme: { 
    type: String 
  },
  description: { 
    type: String 
  },
  eligibility: {
    type: String,
    default: "all"
  },
  category: {
    type: String,
    enum: [
      'dance', 
      'hackathon', 
      'workshop', 
      'competition', 
      'festival', 
      'other',
      'Cultural & Sports Fest',
      'National Festival',
      'Academic & Cultural Support',
      'Health & Social Welfare',
      'Wellness & Personal Development',
      'Academic Workshop',
      'Project Exhibition'
    ],
    required: true,
  },
  date: { 
    type: Date, 
    required: true 
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed'],
    default: 'upcoming',
  },
  // NEW: Registration required field
  registrationRequired: {
    type: Boolean,
    default: true, // Default to true for backward compatibility
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  details: {
    duration: Number,
    prizes: String,
    rules: [String],
    venue: String,
  },
  image: {
    type: String,
    default: 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360'
  },
  // Only populate if registrationRequired is true
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

export default mongoose.model('Event', EventSchema);
