import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  scheduleId: { type: String, required: true, unique: true },
  centerId: { type: String, required: true, index: true },
  centerName: { type: String, required: true },
  district: { type: String, required: true },
  crop: { type: String, required: true },
  date: { type: String, required: true, index: true }, // YYYY-MM-DD
  timeWindow: { type: String, required: true },
  totalCapacityQuintals: { type: Number, required: true },
  bookedCapacityQuintals: { type: Number, default: 0 },
  totalSlots: { type: Number, required: true },
  bookedSlots: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'filling_fast', 'full', 'closed'], default: 'available' },
  mspRatePerQuintal: { type: Number, default: 2203 }
});

export const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);
