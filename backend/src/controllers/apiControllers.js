import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { FarmerProfile } from '../models/FarmerProfile.js';
import { ProcurementCenter } from '../models/ProcurementCenter.js';
import { Schedule } from '../models/Schedule.js';
import { Token } from '../models/Token.js';
import { Procurement } from '../models/Procurement.js';
import { Payment } from '../models/Payment.js';
import { Notification } from '../models/Notification.js';
import { AuditLog } from '../models/AuditLog.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kisansetu_secret_key_2026';

// Helper to log audit actions
const logAudit = async (user, role, action, targetEntity, details) => {
  try {
    await AuditLog.create({
      logId: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user,
      role,
      action,
      targetEntity,
      details
    });
  } catch (err) {
    console.warn(`[AuditLog Error]: ${err.message}`);
  }
};

// Auth Controllers
export const login = async (req, res) => {
  try {
    const { phone, password, role } = req.body;
    
    // For demo purposes, allow instant login with any profile
    const token = jwt.sign(
      { phone, role: role || 'farmer', name: 'Ramesh Kumar Patel' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await logAudit(phone || 'DemoUser', role || 'farmer', 'USER_LOGIN', 'Auth', 'Successful login session started');

    return res.json({
      success: true,
      token,
      user: {
        id: 'USR-8821',
        name: role === 'officer' ? 'Inspector Vikramjit Sen' : role === 'admin' ? 'District Director S. Roy' : 'Ramesh Kumar Patel',
        phone: phone || '+91 98321 44821',
        role: role || 'farmer',
        village: 'Haripur Paschim',
        district: 'Burdwan',
        state: 'West Bengal',
        assignedCenterId: 'CTR-001'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFarmerProfile = async (req, res) => {
  try {
    return res.json({
      success: true,
      profile: {
        farmerId: 'FID-2026-8821',
        fullName: 'Ramesh Kumar Patel',
        dob: '1984-05-14',
        gender: 'Male',
        preferredLanguage: 'en',
        mobileNumber: '+91 98321 44821',
        email: 'ramesh.patel@kisansetu.in',
        addressLine: 'House #42, Paschim Para',
        village: 'Haripur Paschim',
        block: 'Burdwan-I',
        district: 'Purba Bardhaman',
        state: 'West Bengal',
        pinCode: '713101',
        govtIdType: 'Aadhaar Card',
        maskedGovtId: 'XXXX-XXXX-4821',
        farmerRegistrationNumber: 'KNY-WB-2026-09412',
        verificationStatus: 'Verified',
        verificationDate: '2025-11-10',
        farmName: 'Green Valley Organic Paddy Farm',
        farmLocation: 'Dag No. 142/A, Khatian 89',
        totalLandArea: 4.5,
        landUnit: 'Acres',
        ownershipType: 'Owned',
        irrigationAvailable: true,
        soilType: 'Alluvial Loam',
        crops: [
          { cropName: 'Rice / Paddy', variety: 'Swarna (MTU 7029)', season: 'Kharif', expectedQuantityQuintals: 85, harvestDate: '2026-10-15', expectedProcurementDate: '2026-11-01' },
          { cropName: 'Mustard', variety: 'Pusa Bold', season: 'Rabi', expectedQuantityQuintals: 30, harvestDate: '2026-02-20', expectedProcurementDate: '2026-03-05' }
        ],
        preferredCenterId: 'CTR-001',
        preferredTimeSlot: '09:00 AM - 12:00 PM',
        preferredNotificationMethod: 'SMS & WhatsApp',
        completionPercentage: 85
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Queue & Token Booking Controller
export const bookToken = async (req, res) => {
  try {
    const {
      centerId,
      crop,
      date,
      timeWindow,
      quantityQuintals,
      farmerId,
      farmerName,
      farmerPhone,
      village
    } = req.body;

    if (
      !centerId ||
      !crop ||
      !date ||
      !timeWindow ||
      !quantityQuintals ||
      !farmerId ||
      !farmerName ||
      !farmerPhone
    ) {
      return res.status(400).json({
        success: false,
        message:
          'centerId, crop, date, timeWindow, quantityQuintals, farmerId, farmerName and farmerPhone are required'
      });
    }

    const existingToken = await Token.findOne({
      farmerId,
      date,
      status: {
        $in: [
          'waiting',
          'next',
          'arrived',
          'processing'
        ]
      }
    });

    if (existingToken) {
      return res.status(409).json({
        success: false,
        message: 'Farmer already has an active token for this date',
        token: existingToken
      });
    }

    const latestToken = await Token.findOne({
      centerId,
      date
    }).sort({
      tokenNumber: -1
    });

    const tokenNumber = latestToken
      ? latestToken.tokenNumber + 1
      : 1;

    const tokenCode =
      `${centerId}-${date.replaceAll('-', '')}-${String(tokenNumber).padStart(3, '0')}`;

    const token = await Token.create({
      tokenNumber,
      tokenCode,
      centerId,
      farmerId,
      farmerName,
      farmerPhone,
      village,
      crop,
      quantityQuintals,
      date,
      slotTime: timeWindow,
      status: 'waiting',
      estimatedWaitMinutes: 30
    });

    await logAudit(
      farmerId,
      'farmer',
      'TOKEN_BOOKED',
      tokenCode,
      `Booked ${quantityQuintals} Qtl ${crop} at center ${centerId}`
    );

    return res.status(201).json({
      success: true,
      token
    });
  } catch (error) {
    console.error('[Book Token Error]', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin Audit Logs Controller
export const getAuditLogs = async (req, res) => {
  try {
    const sampleLogs = [
      { logId: 'AUD-991', user: 'Ramesh Patel', role: 'farmer', action: 'TOKEN_BOOKED', targetEntity: 'HAR-024', details: 'Booked 45 Qtl Paddy', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
      { logId: 'AUD-990', user: 'Inspector V. Sen', role: 'officer', action: 'LAB_QUALITY_APPROVED', targetEntity: 'HAR-023', details: 'Grade A, Moisture 13.5%', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
      { logId: 'AUD-989', user: 'Admin S. Roy', role: 'admin', action: 'CENTER_CAPACITY_UPDATED', targetEntity: 'CTR-001', details: 'Increased daily quota to 1500 Qtl', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() }
    ];
    return res.json({ success: true, logs: sampleLogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
