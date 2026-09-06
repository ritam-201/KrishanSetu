/* =========================================================
   USER & ROLE TYPES
========================================================= */

export type UserRole =
  | "farmer"
  | "officer"
  | "admin";

export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "STAFF_MANAGER";

export type AdminAccountStatus =
  | "active"
  | "disabled"
  | "locked";

/* =========================================================
   ADMIN
========================================================= */

export interface AdminSession {
  sessionId: string;
  device: string;
  browser: string;
  ipAddress: string;
  loginTime: string;
  isCurrent: boolean;
}

export interface AdminUser {
  adminId: string;
  fullName: string;
  email: string;
  phone: string;
  role: AdminRole;
  department: string;
  designation: string;
  profilePhoto?: string;
  accountStatus: AdminAccountStatus;
  failedLoginAttempts?: number;
  lastLogin?: string;
  passwordChangedAt?: string;
  twoFactorEnabled: boolean;
}

/* =========================================================
   LANGUAGE
========================================================= */

export type LanguageCode =
  | "en"
  | "bn"
  | "hi";

/* =========================================================
   CROP
========================================================= */

export type CropType =
  | "Rice / Paddy"
  | "Wheat"
  | "Mustard"
  | "Maize"
  | "Bengal Gram (Chana)"
  | "Cotton";

/* =========================================================
   CROP DETAIL
========================================================= */

export interface CropDetail {
  id: string;
  cropName: CropType;
  variety: string;

  season:
    | "Kharif"
    | "Rabi"
    | "Zaid";

  expectedQuantityQuintals: number;

  harvestDate: string;

  expectedProcurementDate: string;
}

/* =========================================================
   DETAILED FARMER PROFILE
========================================================= */

export interface DetailedFarmerProfile {
  farmerId: string;

  fullName: string;

  dob: string;

  gender:
    | "Male"
    | "Female"
    | "Other";

  preferredLanguage: LanguageCode;

  mobileNumber: string;

  email: string;

  addressLine: string;

  village: string;

  block: string;

  district: string;

  state: string;

  pinCode: string;

  govtIdType:
    | "Aadhaar Card"
    | "Voter ID"
    | "Kisan Credit Card"
    | "PAN Card";

  maskedGovtId: string;

  farmerRegistrationNumber: string;

  verificationStatus:
    | "Verified"
    | "Pending Verification"
    | "Action Required";

  verificationDate: string;

  farmName: string;

  farmLocation: string;

  totalLandArea: number;

  landUnit:
    | "Acres"
    | "Bigha"
    | "Hectares";

  ownershipType:
    | "Owned"
    | "Leased"
    | "Sharecropper";

  irrigationAvailable: boolean;

  soilType: string;

  crops: CropDetail[];

  preferredCenterId: string;

  preferredTimeSlot: string;

  preferredNotificationMethod:
    | "SMS & WhatsApp"
    | "App Notification"
    | "Call";

  completionPercentage: number;
}

/* =========================================================
   USER PROFILE
========================================================= */

export interface UserProfile {
  id: string;

  name: string;

  phone: string;

  role: UserRole;

  email?: string;

  /* Registration fields */
  aadhaarNumber?: string;

  aadhaarLast4?: string;

  primaryCrop?: CropType;

  /* Address */
  village?: string;

  block?: string;

  district?: string;

  state?: string;

  pinCode?: string;

  /* Farm */
  landAcres?: number;

  /* Bank */
  bankAccountLast4?: string;

  bankName?: string;

  ifscCode?: string;

  /* UI */
  avatarUrl?: string;

  assignedCenterId?: string;

  assignedCenterName?: string;

  detailedProfile?: DetailedFarmerProfile;
}

/* =========================================================
   AUDIT LOG
========================================================= */

export interface AuditLogItem {
  logId: string;

  user: string;

  role:
    | UserRole
    | AdminRole;

  action: string;

  targetEntity?: string;

  details: string;

  timestamp: string;
}

/* =========================================================
   PROCUREMENT SLOT
========================================================= */

export type SlotStatus =
  | "available"
  | "filling_fast"
  | "full"
  | "closed";

export interface ProcurementSlot {
  id: string;

  centerId: string;

  centerName: string;

  district: string;

  crop: CropType;

  date: string;

  timeWindow: string;

  totalCapacityQuintals: number;

  bookedCapacityQuintals: number;

  totalSlots: number;

  bookedSlots: number;

  status: SlotStatus;

  mspRatePerQuintal: number;
}

/* =========================================================
   QUEUE TOKEN
========================================================= */

export type TokenStatus =
  | "completed"
  | "processing"
  | "next"
  | "waiting"
  | "called"
  | "rejected";

export interface QueueToken {
  /* Unique database/local ID */
  id?: string;

  /* Queue */
  tokenNumber: number;

  tokenCode: string;

  /* Farmer */
  farmerId: string;

  farmerName: string;

  farmerPhone: string;

  village: string;

  /* Procurement center */
  centerId?: string;

  centerName?: string;

  /* Crop */
  crop: CropType;

  quantityQuintals: number;

  /* Booking */
  date?: string;

  timeWindow?: string;

  slotTime: string;

  vehicleNumber?: string;

  /* Pricing */
  mspRate?: number;

  estimatedValue?: number;

  /* Queue status */
  status: TokenStatus;

  estimatedWaitMinutes: number;

  /* Timestamps */
  arrivedAt?: string;

  calledAt?: string;

  completedAt?: string;

  createdAt?: string;

  /* Quality */
  qualityGrade?:
    | "Grade A"
    | "Grade B"
    | "Standard"
    | "Pending";

  moisturePercent?: number;

  /* Weighbridge */
  weighbridgeWeightQuintals?: number;

  finalWeight?: number;

  /* Payment */
  paymentAmount?: number;
}

/* =========================================================
   PROCUREMENT CENTER
========================================================= */

export interface ProcurementCenter {
  id: string;

  name: string;

  code: string;

  district: string;

  state: string;

  address: string;

  distanceKm: number;

  acceptedCrops: CropType[];

  operatingHours: string;

  officerInCharge: string;

  contactNumber: string;

  dailyCapacityQuintals: number;

  totalSlotsToday: number;

  availableSlotsToday: number;

  currentServingToken: number;

  totalQueueWaiting: number;

  averageProcessingTimeMinutes: number;

  latitude: number;

  longitude: number;

  isWeighbridgeActive: boolean;

  isLabTestingActive: boolean;

  status:
    | "Open"
    | "Crowded"
    | "Full"
    | "Closed";
}

/* =========================================================
   VERIFICATION
========================================================= */

export type VerificationStage =
  | "registration"
  | "slot_booked"
  | "arrived"
  | "lab_verification"
  | "weighbridge"
  | "procurement_approved"
  | "payment_processing"
  | "payment_completed";

export interface VerificationMilestone {
  stage: VerificationStage;

  label: string;

  description: string;

  status:
    | "completed"
    | "in_progress"
    | "pending"
    | "rejected";

  timestamp?: string;

  officerNote?: string;
}

/* =========================================================
   QUALITY REPORT
========================================================= */

export interface QualityReport {
  sampleId: string;

  testedAt: string;

  inspectorName: string;

  moisturePercent: number;

  maxPermissibleMoisture: number;

  foreignMatterPercent: number;

  maxPermissibleForeignMatter: number;

  damagedGrainsPercent: number;

  grade:
    | "Grade A"
    | "Grade B"
    | "Standard"
    | "Under Inspection"
    | "Rejected";

  passed: boolean;

  notes: string;
}

/* =========================================================
   PAYMENT
========================================================= */

export interface PaymentTransaction {
  id: string;

  transactionId: string;

  pfmsReferenceNo: string;

  farmerId: string;

  farmerName: string;

  tokenNumber: number;

  centerName: string;

  crop: CropType;

  grossWeightQuintals: number;

  mspRatePerQuintal: number;

  grossAmount: number;

  deductions: number;

  netPayable: number;

  status:
    | "Initiated"
    | "PFMS Verified"
    | "Treasury Cleared"
    | "Disbursed to Bank"
    | "On Hold";

  statusStageIndex: number;

  bankName: string;

  accountLast4: string;

  ifscCode: string;

  procuredDate: string;

  estimatedReleaseDate: string;

  disbursedDate?: string;

  utrNumber?: string;
}

/* =========================================================
   NOTIFICATION
========================================================= */

export interface AppNotification {
  id: string;

  title: string;

  message: string;

  type:
    | "slot"
    | "queue"
    | "verification"
    | "payment"
    | "alert";

  timestamp: string;

  read: boolean;

  actionUrl?: string;

  badge?: string;
}