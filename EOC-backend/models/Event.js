import mongoose from "mongoose";
const { Schema } = mongoose;

const EventSchema = new Schema({
  name: { 
    type: String,
    required: true },
  theme: { 
    type: String 
  },             // optional or required as per your design
  description: { 
    type: String 
  },
  eligibility: {                      // new field for eligibility criteria
    type: String,
    default: "all"
  },
  category: {
    type: String,
    enum: ['dance', 'hackathon', 'workshop', 'competition', 'festival', 'other'],
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
  }
}, { timestamps: true });

export default mongoose.model('Event', EventSchema);
