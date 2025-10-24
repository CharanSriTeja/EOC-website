import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  attended: {
    type: Boolean,
    default: false,
  },
  certificateGenerated: {
    type: Boolean,
    default: false,
  },
});

RegistrationSchema.index({ event: 1, student: 1 }, { unique: true });

export default mongoose.model('Registration', RegistrationSchema);
