import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['slot', 'queue', 'verification', 'payment', 'alert'], default: 'alert' },
  read: { type: Boolean, default: false },
  badge: { type: String },
  actionUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
