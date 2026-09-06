import mongoose from 'mongoose';

const cropDetailSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  variety: { type: String },
  season: { type: String },
  expectedQuantityQuintals: { type: Number, required: true },
  harvestDate: { type: String },
  expectedProcurementDate: { type: String }
});

const farmerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  farmerId: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  dob: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  preferredLanguage: { type: String, enum: ['en', 'bn', 'hi'], default: 'en' },
  mobileNumber: { type: String, required: true },
  email: { type: String },
  addressLine: { type: String },
  village: { type: String, required: true },
  block: { type: String },
  district: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String },

  // Identification (Masked for privacy)
  govtIdType: { type: String, enum: ['Aadhaar Card', 'Voter ID', 'Kisan Credit Card', 'PAN Card'], default: 'Aadhaar Card' },
  maskedGovtId: { type: String, default: 'XXXX-XXXX-4821' },
  farmerRegistrationNumber: { type: String, required: true },
  verificationStatus: { type: String, enum: ['Verified', 'Pending Verification', 'Action Required'], default: 'Verified' },
  verificationDate: { type: String },

  // Farm Details
  farmName: { type: String },
  farmLocation: { type: String },
  totalLandArea: { type: Number, required: true },
  landUnit: { type: String, enum: ['Acres', 'Bigha', 'Hectares'], default: 'Acres' },
  ownershipType: { type: String, enum: ['Owned', 'Leased', 'Sharecropper'], default: 'Owned' },
  irrigationAvailable: { type: Boolean, default: true },
  soilType: { type: String, default: 'Alluvial Loam' },

  // Crops & Preferences
  crops: [cropDetailSchema],
  preferredCenterId: { type: String, default: 'CTR-001' },
  preferredTimeSlot: { type: String, default: '09:00 AM - 12:00 PM' },
  preferredNotificationMethod: { type: String, enum: ['SMS & WhatsApp', 'App Notification', 'Call'], default: 'SMS & WhatsApp' },

  // Profile Completion Percentage (Calculated)
  completionPercentage: { type: Number, default: 85 },
  updatedAt: { type: Date, default: Date.now }
});

export const FarmerProfile = mongoose.models.FarmerProfile || mongoose.model('FarmerProfile', farmerProfileSchema);
