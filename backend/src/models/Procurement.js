import mongoose from 'mongoose';

const procurementSchema = new mongoose.Schema({
  procurementId: { type: String, required: true, unique: true, index: true },
  tokenNumber: { type: Number, required: true },
  farmerId: { type: String, required: true, index: true },
  farmerName: { type: String, required: true },
  centerId: { type: String, required: true },
  centerName: { type: String, required: true },
  crop: { type: String, required: true },
  variety: { type: String },
  submittedQuantityQuintals: { type: Number, required: true },
  approvedQuantityQuintals: { type: Number },
  rejectedQuantityQuintals: { type: Number, default: 0 },
  harvestDate: { type: String },
  lotNumber: { type: String, required: true },
  
  // Quality Assessment
  moisturePercent: { type: Number },
  maxPermissibleMoisture: { type: Number, default: 14.0 },
  foreignMatterPercent: { type: Number },
  damagedGrainsPercent: { type: Number },
  qualityGrade: { type: String, enum: ['Grade A', 'Grade B', 'Standard', 'Rejected'], default: 'Grade A' },
  inspectionNotes: { type: String },
  inspectorName: { type: String },
  testedAt: { type: String },

  // Verification & Status Pipeline
  status: {
    type: String,
    enum: ['Booked', 'Scheduled', 'Farmer Arrived', 'Verification', 'Quality Check', 'Accepted', 'Rejected', 'Hold'],
    default: 'Booked'
  },
  createdAt: { type: Date, default: Date.now }
});

export const Procurement = mongoose.models.Procurement || mongoose.model('Procurement', procurementSchema);
