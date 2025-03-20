import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  patientId: String,
  date: String,
  time: String,
  type: {
    type: String,
    enum: ['initial', 'follow-up', 'emergency']
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled']
  },
  duration: Number,
  fee: Number,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const feeStructureSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['initial', 'follow-up', 'emergency']
  },
  amount: Number,
  duration: Number,
  description: String
});

export const Consultation = mongoose.model('Consultation', consultationSchema);
export const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);
