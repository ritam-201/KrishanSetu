import mongoose from 'mongoose';

const adminSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  device: { type: String, required: true },
  browser: { type: String, required: true },
  loginTime: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  ipAddress: { type: String, default: '127.0.0.1' },
  isCurrent: { type: Boolean, default: false }
});

const adminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'ADMIN', 'STAFF_MANAGER'],
    default: 'ADMIN',
    required: true
  },
  department: { type: String, default: 'State Agricultural Marketing Board' },
  designation: { type: String, default: 'Senior APMC Inspector' },
  profilePhoto: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  
  // Security & Account Locking
  accountStatus: { type: String, enum: ['active', 'disabled', 'locked'], default: 'active' },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  lastLogin: { type: Date, default: null },
  passwordChangedAt: { type: Date, default: Date.now },
  twoFactorEnabled: { type: Boolean, default: false },

  // Active Sessions
  activeSessions: [adminSessionSchema],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
