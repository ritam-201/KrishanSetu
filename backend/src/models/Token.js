import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  tokenNumber: { type: Number, required: true, index: true },
  tokenCode: { type: String, required: true, unique: true, index: true },
  centerId: { type: String, required: true, index: true },
  farmerId: { type: String, required: true, index: true },
  farmerName: { type: String, required: true },
  farmerPhone: { type: String, required: true },
  village: { type: String },
  crop: { type: String, required: true },
  quantityQuintals: { type: Number, required: true },
  date: { type: String, required: true, index: true },
  slotTime: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['waiting', 'next', 'arrived', 'processing', 'completed', 'rejected', 'cancelled'], 
    default: 'waiting',
    index: true 
  },
  estimatedWaitMinutes: { type: Number, default: 30 },
  arrivedAt: { type: String },
  calledAt: { type: String },
  completedAt: { type: String },
  qualityGrade: { type: String, enum: ['Grade A', 'Grade B', 'Standard', 'Pending'], default: 'Pending' },
  moisturePercent: { type: Number },
  weighbridgeWeightQuintals: { type: Number },
  paymentAmount: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

// Index to prevent duplicate active token for same farmer on same date
tokenSchema.index({ farmerId: 1, date: 1, status: 1 });

export const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema);
