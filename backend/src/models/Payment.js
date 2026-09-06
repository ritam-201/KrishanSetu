import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true, index: true },
  transactionId: { type: String, required: true, unique: true },
  pfmsReferenceNo: { type: String, required: true },
  farmerId: { type: String, required: true, index: true },
  farmerName: { type: String, required: true },
  tokenNumber: { type: Number, required: true },
  centerName: { type: String, required: true },
  crop: { type: String, required: true },
  grossWeightQuintals: { type: Number, required: true },
  mspRatePerQuintal: { type: Number, required: true },
  grossAmount: { type: Number, required: true },
  deductions: { type: Number, default: 0 },
  netPayable: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Initiated', 'PFMS Verified', 'Treasury Cleared', 'Disbursed to Bank', 'On Hold', 'Failed'],
    default: 'Initiated'
  },
  statusStageIndex: { type: Number, default: 1 }, // 0 to 4
  bankName: { type: String, required: true },
  accountLast4: { type: String, required: true },
  ifscCode: { type: String, required: true },
  procuredDate: { type: String, required: true },
  estimatedReleaseDate: { type: String },
  disbursedDate: { type: String },
  utrNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
