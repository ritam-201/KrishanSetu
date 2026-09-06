import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'officer', 'admin'], default: 'farmer' },
  avatarUrl: { type: String },
  assignedCenterId: { type: String },
  assignedCenterName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
