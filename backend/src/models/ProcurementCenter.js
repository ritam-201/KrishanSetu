import mongoose from 'mongoose';

const centerSchema = new mongoose.Schema({
  centerId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  distanceKm: { type: Number, default: 4.2 },
  acceptedCrops: [{ type: String }],
  operatingHours: { type: String, default: '08:00 AM - 05:00 PM' },
  officerInCharge: { type: String },
  contactNumber: { type: String },
  dailyCapacityQuintals: { type: Number, default: 1200 },
  totalSlotsToday: { type: Number, default: 120 },
  availableSlotsToday: { type: Number, default: 42 },
  currentServingToken: { type: Number, default: 23 },
  totalQueueWaiting: { type: Number, default: 14 },
  averageProcessingTimeMinutes: { type: Number, default: 12 },
  activeCountersCount: { type: Number, default: 2 },
  latitude: { type: Number },
  longitude: { type: Number },
  isWeighbridgeActive: { type: Boolean, default: true },
  isLabTestingActive: { type: Boolean, default: true },
  status: { type: String, enum: ['Open', 'Crowded', 'Full', 'Closed', 'Maintenance'], default: 'Open' }
});

export const ProcurementCenter = mongoose.models.ProcurementCenter || mongoose.model('ProcurementCenter', centerSchema);
