import {
  ProcurementCenter,
  ProcurementSlot,
  QueueToken,
  PaymentTransaction,
  AppNotification,
  UserProfile,
  QualityReport,
  VerificationMilestone,
} from '../types';

/* =========================================================
   INITIAL USER PROFILES
========================================================= */

export const INITIAL_USER_PROFILES: Record<string, UserProfile> = {
  farmer: {
    id: 'FARM-8821',
    name: 'Subhash Chandra',
    phone: '+91 98321 44520',
    role: 'farmer',
    village: 'Haripur Paschim',
    district: 'Hooghly',
    state: 'West Bengal',
  },

  officer: {
    id: 'OFF-402',
    name: 'Vikramjit Sen',
    phone: '+91 94330 19822',
    role: 'officer',
    district: 'Hooghly',
    state: 'West Bengal',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    assignedCenterId: 'CTR-001',
    assignedCenterName: 'Haripur Mandi Procurement Hub #04',
  },

  admin: {
    id: 'ADM-101',
    name: 'Dr. Anita Banerjee',
    phone: '+91 98300 81234',
    role: 'admin',
    district: 'State Headquarter (Kolkata)',
    state: 'West Bengal',
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    assignedCenterName:
      'Department of Agricultural Marketing & State Procurement',
  },
};

/* =========================================================
   PROCUREMENT CENTERS
========================================================= */

export const INITIAL_CENTERS: ProcurementCenter[] = [
  {
    id: 'CTR-001',
    name: 'Haripur Mandi Procurement Hub #04',
    code: 'WB-HG-04',
    district: 'Hooghly',
    state: 'West Bengal',
    address:
      'Near Old Grand Trunk Road, Haripur Rural Block, Hooghly - 712401',
    distanceKm: 2.4,
    acceptedCrops: ['Rice / Paddy', 'Wheat', 'Mustard', 'Maize'],
    operatingHours: '08:00 AM – 05:00 PM',
    officerInCharge: 'Vikramjit Sen (Agri Officer)',
    contactNumber: '+91 94330 19822',
    dailyCapacityQuintals: 1200,
    totalSlotsToday: 40,
    availableSlotsToday: 18,
    currentServingToken: 23,
    totalQueueWaiting: 14,
    averageProcessingTimeMinutes: 12,
    latitude: 22.8942,
    longitude: 88.3512,
    isWeighbridgeActive: true,
    isLabTestingActive: true,
    status: 'Open',
  },

  {
    id: 'CTR-002',
    name: 'Kalyani APMC Central Yard',
    code: 'WB-ND-02',
    district: 'Nadia',
    state: 'West Bengal',
    address:
      'Phase-II APMC Yard, Kalyani Expressway Junction, Nadia - 741235',
    distanceKm: 8.7,
    acceptedCrops: [
      'Rice / Paddy',
      'Mustard',
      'Bengal Gram (Chana)',
    ],
    operatingHours: '08:30 AM – 05:30 PM',
    officerInCharge: 'Ranjit Ghosh',
    contactNumber: '+91 98311 77201',
    dailyCapacityQuintals: 1500,
    totalSlotsToday: 50,
    availableSlotsToday: 6,
    currentServingToken: 41,
    totalQueueWaiting: 22,
    averageProcessingTimeMinutes: 14,
    latitude: 22.975,
    longitude: 88.4344,
    isWeighbridgeActive: true,
    isLabTestingActive: true,
    status: 'Crowded',
  },

  {
    id: 'CTR-003',
    name: 'Bardhaman Sadar Kisan Mandi',
    code: 'WB-BD-01',
    district: 'Purba Bardhaman',
    state: 'West Bengal',
    address:
      'National Highway 19, Nababhat Bypass, Bardhaman - 713101',
    distanceKm: 16.5,
    acceptedCrops: [
      'Rice / Paddy',
      'Wheat',
      'Maize',
      'Cotton',
    ],
    operatingHours: '07:30 AM – 06:00 PM',
    officerInCharge: 'Sudip Mukherjee',
    contactNumber: '+91 97321 00419',
    dailyCapacityQuintals: 2200,
    totalSlotsToday: 70,
    availableSlotsToday: 32,
    currentServingToken: 15,
    totalQueueWaiting: 9,
    averageProcessingTimeMinutes: 10,
    latitude: 23.2324,
    longitude: 87.8615,
    isWeighbridgeActive: true,
    isLabTestingActive: true,
    status: 'Open',
  },

  {
    id: 'CTR-004',
    name: 'Chinsurah Sub-Divisional Mandi',
    code: 'WB-HG-02',
    district: 'Hooghly',
    state: 'West Bengal',
    address:
      'Station Road, Pipulpati More, Chinsurah - 712103',
    distanceKm: 11.2,
    acceptedCrops: ['Rice / Paddy', 'Mustard'],
    operatingHours: '09:00 AM – 04:30 PM',
    officerInCharge: 'S. Bhattacharya',
    contactNumber: '+91 94344 88120',
    dailyCapacityQuintals: 800,
    totalSlotsToday: 30,
    availableSlotsToday: 0,
    currentServingToken: 29,
    totalQueueWaiting: 28,
    averageProcessingTimeMinutes: 16,
    latitude: 22.9031,
    longitude: 88.3968,
    isWeighbridgeActive: true,
    isLabTestingActive: true,
    status: 'Full',
  },
];

/* =========================================================
   PROCUREMENT SLOTS
========================================================= */

export const INITIAL_SLOTS: ProcurementSlot[] = [
  {
    id: 'SLOT-001',
    centerId: 'CTR-001',
    centerName: 'Haripur Mandi Procurement Hub #04',
    district: 'Hooghly',
    crop: 'Rice / Paddy',
    date: '2026-09-05',
    timeWindow: '09:00 AM – 11:30 AM',
    totalCapacityQuintals: 400,
    bookedCapacityQuintals: 220,
    totalSlots: 20,
    bookedSlots: 11,
    status: 'available',
    mspRatePerQuintal: 2203,
  },

  {
    id: 'SLOT-002',
    centerId: 'CTR-001',
    centerName: 'Haripur Mandi Procurement Hub #04',
    district: 'Hooghly',
    crop: 'Rice / Paddy',
    date: '2026-09-05',
    timeWindow: '12:00 PM – 02:30 PM',
    totalCapacityQuintals: 400,
    bookedCapacityQuintals: 360,
    totalSlots: 20,
    bookedSlots: 18,
    status: 'filling_fast',
    mspRatePerQuintal: 2203,
  },

  {
    id: 'SLOT-003',
    centerId: 'CTR-001',
    centerName: 'Haripur Mandi Procurement Hub #04',
    district: 'Hooghly',
    crop: 'Wheat',
    date: '2026-09-06',
    timeWindow: '09:00 AM – 12:00 PM',
    totalCapacityQuintals: 500,
    bookedCapacityQuintals: 150,
    totalSlots: 25,
    bookedSlots: 8,
    status: 'available',
    mspRatePerQuintal: 2275,
  },

  {
    id: 'SLOT-004',
    centerId: 'CTR-002',
    centerName: 'Kalyani APMC Central Yard',
    district: 'Nadia',
    crop: 'Mustard',
    date: '2026-09-06',
    timeWindow: '10:00 AM – 01:00 PM',
    totalCapacityQuintals: 300,
    bookedCapacityQuintals: 290,
    totalSlots: 20,
    bookedSlots: 19,
    status: 'filling_fast',
    mspRatePerQuintal: 5650,
  },

  {
    id: 'SLOT-005',
    centerId: 'CTR-003',
    centerName: 'Bardhaman Sadar Kisan Mandi',
    district: 'Purba Bardhaman',
    crop: 'Rice / Paddy',
    date: '2026-09-07',
    timeWindow: '08:30 AM – 11:30 AM',
    totalCapacityQuintals: 800,
    bookedCapacityQuintals: 320,
    totalSlots: 35,
    bookedSlots: 14,
    status: 'available',
    mspRatePerQuintal: 2203,
  },

  {
    id: 'SLOT-006',
    centerId: 'CTR-001',
    centerName: 'Haripur Mandi Procurement Hub #04',
    district: 'Hooghly',
    crop: 'Rice / Paddy',
    date: '2026-09-08',
    timeWindow: '09:30 AM – 12:00 PM',
    totalCapacityQuintals: 450,
    bookedCapacityQuintals: 180,
    totalSlots: 22,
    bookedSlots: 9,
    status: 'available',
    mspRatePerQuintal: 2203,
  },

  {
    id: 'SLOT-007',
    centerId: 'CTR-004',
    centerName: 'Chinsurah Sub-Divisional Mandi',
    district: 'Hooghly',
    crop: 'Rice / Paddy',
    date: '2026-09-09',
    timeWindow: '09:00 AM – 11:00 AM',
    totalCapacityQuintals: 300,
    bookedCapacityQuintals: 295,
    totalSlots: 15,
    bookedSlots: 15,
    status: 'full',
    mspRatePerQuintal: 2203,
  },
];

/* =========================================================
   LIVE QUEUE TOKENS
========================================================= */

export const INITIAL_QUEUE_TOKENS: QueueToken[] = [
  {
    tokenNumber: 21,
    tokenCode: 'HAR-021',
    farmerId: 'FARM-1011',
    farmerName: 'Biren Mondal',
    farmerPhone: '+91 98320 11200',
    village: 'Singur',
    crop: 'Rice / Paddy',
    quantityQuintals: 22.5,
    slotTime: '09:00 AM – 10:00 AM',
    status: 'completed',
    estimatedWaitMinutes: 0,
    arrivedAt: '08:50 AM',
    calledAt: '09:05 AM',
    completedAt: '09:22 AM',
    qualityGrade: 'Grade A',
    moisturePercent: 12.4,
    weighbridgeWeightQuintals: 22.45,
    paymentAmount: 49457,
  },

  {
    tokenNumber: 22,
    tokenCode: 'HAR-022',
    farmerId: 'FARM-1012',
    farmerName: 'Santosh Pal',
    farmerPhone: '+91 97330 45110',
    village: 'Polba',
    crop: 'Rice / Paddy',
    quantityQuintals: 30.0,
    slotTime: '09:15 AM – 10:15 AM',
    status: 'completed',
    estimatedWaitMinutes: 0,
    arrivedAt: '09:10 AM',
    calledAt: '09:25 AM',
    completedAt: '09:44 AM',
    qualityGrade: 'Grade A',
    moisturePercent: 13.1,
    weighbridgeWeightQuintals: 29.8,
    paymentAmount: 65649,
  },

  {
    tokenNumber: 23,
    tokenCode: 'HAR-023',
    farmerId: 'FARM-1013',
    farmerName: 'Debabrata Das',
    farmerPhone: '+91 94331 99023',
    village: 'Dhaniakhali',
    crop: 'Rice / Paddy',
    quantityQuintals: 18.0,
    slotTime: '09:30 AM – 10:30 AM',
    status: 'processing',
    estimatedWaitMinutes: 4,
    arrivedAt: '09:28 AM',
    calledAt: '09:46 AM',
    qualityGrade: 'Grade A',
    moisturePercent: 12.9,
    weighbridgeWeightQuintals: 18.1,
  },

  /* =======================================================
     LOGGED-IN DEMO FARMER
     Token #24 = FARM-8821 = YOU
  ======================================================= */

  {
    tokenNumber: 24,
    tokenCode: 'HAR-024',
    farmerId: 'FARM-8821',
    farmerName: 'Subhash Chandra',
    farmerPhone: '+91 98321 44520',
    village: 'Haripur Paschim',
    crop: 'Rice / Paddy',
    quantityQuintals: 25.0,
    slotTime: '10:00 AM – 11:30 AM',
    status: 'next',
    estimatedWaitMinutes: 18,
    arrivedAt: '09:40 AM',
    qualityGrade: 'Grade A',
    moisturePercent: 12.8,
  },

  {
    tokenNumber: 25,
    tokenCode: 'HAR-025',
    farmerId: 'FARM-1014',
    farmerName: 'Anjali Devi',
    farmerPhone: '+91 98301 77312',
    village: 'Magra',
    crop: 'Rice / Paddy',
    quantityQuintals: 15.0,
    slotTime: '10:15 AM – 11:45 AM',
    status: 'waiting',
    estimatedWaitMinutes: 32,
    arrivedAt: '09:50 AM',
  },

  {
    tokenNumber: 26,
    tokenCode: 'HAR-026',
    farmerId: 'FARM-1015',
    farmerName: 'Mohan Lal Mahato',
    farmerPhone: '+91 94320 88214',
    village: 'Balagarh',
    crop: 'Rice / Paddy',
    quantityQuintals: 35.0,
    slotTime: '10:30 AM – 12:00 PM',
    status: 'waiting',
    estimatedWaitMinutes: 46,
  },

  {
    tokenNumber: 27,
    tokenCode: 'HAR-027',
    farmerId: 'FARM-1016',
    farmerName: 'Kallol Roy',
    farmerPhone: '+91 97321 44900',
    village: 'Pandua',
    crop: 'Rice / Paddy',
    quantityQuintals: 20.0,
    slotTime: '11:00 AM – 12:30 PM',
    status: 'waiting',
    estimatedWaitMinutes: 60,
  },
];

/* =========================================================
   QUALITY REPORT
========================================================= */

export const INITIAL_QUALITY_REPORT: QualityReport = {
  sampleId: 'SMP-2026-HG04-024',
  testedAt: '2026-09-05 09:48 AM',
  inspectorName:
    'Er. Sandip Mandal (Senior Quality Assessor)',
  moisturePercent: 12.8,
  maxPermissibleMoisture: 14.0,
  foreignMatterPercent: 0.35,
  maxPermissibleForeignMatter: 1.0,
  damagedGrainsPercent: 0.4,
  grade: 'Grade A',
  passed: true,
  notes:
    'High purity grain sample. Moisture level optimal for long-term central silo storage. Certified Grade A.',
};

/* =========================================================
   VERIFICATION MILESTONES
========================================================= */

export const INITIAL_VERIFICATION_MILESTONES: VerificationMilestone[] = [
  {
    stage: 'registration',
    label: 'Farmer Registration & Aadhaar Verification',
    description:
      'Land record Khata #412 verified with Banglarbhumi land portal.',
    status: 'completed',
    timestamp: '2026-09-02 11:24 AM',
  },

  {
    stage: 'slot_booked',
    label: 'Mandi Slot Booked & Gate Pass Issued',
    description:
      'Slot confirmed for 05 Sep (10:00 AM) at Haripur Hub #04. Token #24 generated.',
    status: 'completed',
    timestamp: '2026-09-03 04:15 PM',
  },

  {
    stage: 'arrived',
    label: 'Arrival & Gate Entry Verified',
    description:
      'Vehicle WB-15-4421 checked in through Mandi Digital RFID Gate Barrier.',
    status: 'completed',
    timestamp: '2026-09-05 09:40 AM',
  },

  {
    stage: 'lab_verification',
    label: 'Crop Quality & Moisture Lab Testing',
    description:
      'Moisture tested at 12.8% (Allowed: <14%). Sample passed as Grade A Certified.',
    status: 'completed',
    timestamp: '2026-09-05 09:48 AM',
  },

  {
    stage: 'weighbridge',
    label: 'Automated Digital Weighbridge Net Weight',
    description:
      'Gross: 4,820 kg | Tare (Tractor): 2,320 kg | Net Paddy: 2,500 kg (25.00 Qtl).',
    status: 'in_progress',
    timestamp: '2026-09-05 10:05 AM',
  },

  {
    stage: 'procurement_approved',
    label: 'Officer Approval & Electronic Procurement Slip',
    description:
      'Electronic J-Form / Mandi Acceptance certificate generation pending final sign-off.',
    status: 'pending',
  },

  {
    stage: 'payment_processing',
    label: 'PFMS Treasury Clearance & DBT Order',
    description:
      'Government Treasury payment order will be initiated after procurement approval.',
    status: 'pending',
  },

  {
    stage: 'payment_completed',
    label: 'Direct Bank Transfer (DBT) Disbursal',
    description:
      '₹55,075 will be credited directly to the registered bank account after payment processing.',
    status: 'pending',
  },
];

/* =========================================================
   PAYMENT TRANSACTIONS
========================================================= */

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'PAY-2026-0891',
    transactionId: 'TXN-KSETU-8821-0509',
    pfmsReferenceNo: 'PFMS/WB/2026/09/998124',
    farmerId: 'FARM-8821',
    farmerName: 'Subhash Chandra',
    tokenNumber: 24,
    centerName: 'Haripur Mandi Procurement Hub #04',
    crop: 'Rice / Paddy',
    grossWeightQuintals: 25.0,
    mspRatePerQuintal: 2203,
    grossAmount: 55075,
    deductions: 0,
    netPayable: 55075,
    status: 'PFMS Verified',
    statusStageIndex: 2,
    bankName: 'State Bank of India',
    accountLast4: '4821',
    ifscCode: 'SBIN0004122',
    procuredDate: '2026-09-05',
    estimatedReleaseDate: '2026-09-07',
    utrNumber: 'SBIN2026090549102',
  },

  {
    id: 'PAY-2026-0412',
    transactionId: 'TXN-KSETU-8821-1404',
    pfmsReferenceNo: 'PFMS/WB/2026/04/112940',
    farmerId: 'FARM-8821',
    farmerName: 'Subhash Chandra',
    tokenNumber: 12,
    centerName: 'Haripur Mandi Procurement Hub #04',
    crop: 'Wheat',
    grossWeightQuintals: 18.0,
    mspRatePerQuintal: 2275,
    grossAmount: 40950,
    deductions: 0,
    netPayable: 40950,
    status: 'Disbursed to Bank',
    statusStageIndex: 4,
    bankName: 'State Bank of India',
    accountLast4: '4821',
    ifscCode: 'SBIN0004122',
    procuredDate: '2026-04-14',
    estimatedReleaseDate: '2026-04-16',
    disbursedDate: '2026-04-16 02:45 PM',
    utrNumber: 'SBINR52026041699318',
  },
];

/* =========================================================
   NOTIFICATIONS
========================================================= */

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-01',
    title: 'Your Turn is Coming Up (Token #24)',
    message:
      'Token #23 is currently at the weighbridge. Please position your vehicle in Mandi Lane 2.',
    type: 'queue',
    timestamp: '3 mins ago',
    read: false,
    badge: 'LIVE QUEUE',
  },

  {
    id: 'NOTIF-02',
    title: 'Crop Quality Test Passed: Grade A',
    message:
      'Your Paddy sample SMP-2026-HG04-024 cleared with 12.8% moisture. Grade A MSP confirmed at ₹2,203/Qtl.',
    type: 'verification',
    timestamp: '18 mins ago',
    read: false,
    badge: 'LAB TEST',
  },

  {
    id: 'NOTIF-03',
    title: 'Procurement Gate Pass Active',
    message:
      'Slot confirmed for 05 Sep 2026 at Haripur Mandi Hub #04. Digital Mandi Pass QR code generated.',
    type: 'slot',
    timestamp: '4 hours ago',
    read: true,
    badge: 'GATE PASS',
  },

  {
    id: 'NOTIF-04',
    title: 'Previous DBT Payment Credited (₹40,950)',
    message:
      'Rabi Wheat procurement payment of ₹40,950 was successfully credited to SBI A/C ending 4821.',
    type: 'payment',
    timestamp: 'Yesterday',
    read: true,
    badge: 'DBT SUCCESS',
  },

  {
    id: 'NOTIF-05',
    title: 'Estimated Payment: ₹55,075',
    message:
      'Based on your 25.00 quintal Paddy quantity and current MSP of ₹2,203/Qtl, your estimated payable amount is ₹55,075.',
    type: 'payment',
    timestamp: 'Today',
    read: false,
    badge: 'MSP UPDATE',
  },
];