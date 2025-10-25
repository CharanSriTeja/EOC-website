import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['student', 'coordinator'],
    required: true,
  },
  // Student-specific fields
  year: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    required: function() {
      return this.role === 'student';
    },
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500,
  },
  avatar: {
    type: String,
    default: function() {
      // Generate initials from name
      return this.name ? this.name.charAt(0).toUpperCase() : 'U';
    },
  },
  registeredEvents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Event" 
  }],
}, { 
  timestamps: true 
}); 

export default mongoose.model('User', UserSchema);
