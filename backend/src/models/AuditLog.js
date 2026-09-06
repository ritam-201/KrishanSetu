import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true },
  user: { type: String, required: true },
  role: { type: String, required: true },
  action: { type: String, required: true },
  targetEntity: { type: String },
  details: { type: String },
  ipAddress: { type: String, default: '127.0.0.1' },
  timestamp: { type: Date, default: Date.now }
});

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
