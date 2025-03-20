import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  day: String,
  handled: Number,
  escalated: Number,
  responseTime: Number,
  date: Date
});

const accuracySchema = new mongoose.Schema({
  category: String,
  accuracy: Number,
  date: Date
});

export const Performance = mongoose.model('Performance', performanceSchema);
export const Accuracy = mongoose.model('Accuracy', accuracySchema);
