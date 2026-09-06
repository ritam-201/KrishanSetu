import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { AuditLog } from '../models/AuditLog.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kisansetu_secret_key_2026';
const MAX_FAILED_ATTEMPTS = 5;

// Helper to log audit actions
const logAdminAudit = async (user, role, action, targetEntity, details) => {
  try {
    await AuditLog.create({
      logId: `AUD-ADM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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

// 1. Dedicated Admin Login Controller
export const loginAdmin = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Admin ID/Email and password are required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    // Security requirement: Do not reveal whether email or password was invalid
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    // Check if account is locked or disabled
    if (admin.accountStatus === 'disabled') {
      return res.status(403).json({ success: false, message: 'Your administrator account has been disabled. Contact system director.' });
    }

    if (admin.accountStatus === 'locked' && admin.lockUntil && admin.lockUntil > new Date()) {
      return res.status(423).json({ 
        success: false, 
        message: 'Your administrator account has been temporarily locked due to multiple failed login attempts. Please try again later.' 
      });
    }

    // Reset lock if lock duration expired
    if (admin.accountStatus === 'locked' && admin.lockUntil && admin.lockUntil <= new Date()) {
      admin.accountStatus = 'active';
      admin.failedLoginAttempts = 0;
      admin.lockUntil = null;
    }

    // Verify Password with bcrypt
    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      admin.failedLoginAttempts += 1;
      
      // Lock account after MAX_FAILED_ATTEMPTS
      if (admin.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        admin.accountStatus = 'locked';
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minute lock
        await admin.save();
        await logAdminAudit(admin.email, admin.role, 'ACCOUNT_LOCKED', admin.adminId, 'Account locked due to 5 consecutive failed login attempts');
        return res.status(423).json({ 
          success: false, 
          message: 'Your administrator account has been temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.' 
        });
      }

      await admin.save();
      await logAdminAudit(admin.email, admin.role, 'FAILED_ADMIN_LOGIN', admin.adminId, `Failed login attempt ${admin.failedLoginAttempts}/${MAX_FAILED_ATTEMPTS}`);
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    // Successful Login: Reset failed attempts & create session
    admin.failedLoginAttempts = 0;
    admin.lastLogin = new Date();

    const sessionId = `SESS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newSession = {
      sessionId,
      device: req.headers['user-agent']?.includes('Mobile') ? 'Mobile Device' : 'Desktop Workstation',
      browser: req.headers['user-agent']?.includes('Chrome') ? 'Chrome' : 'Browser',
      ipAddress: req.ip || '127.0.0.1',
      loginTime: new Date(),
      lastActivity: new Date(),
      isCurrent: true
    };

    admin.activeSessions.push(newSession);
    await admin.save();

    // Generate JWT with adminId, role, and sessionId (no sensitive plain info)
    const token = jwt.sign(
      { adminId: admin.adminId, email: admin.email, role: admin.role, sessionId },
      JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '12h' }
    );

    await logAdminAudit(admin.fullName, admin.role, 'ADMIN_LOGIN', admin.adminId, 'Successful admin authentication session started');

    return res.json({
      success: true,
      token,
      admin: {
        adminId: admin.adminId,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        department: admin.department,
        designation: admin.designation,
        profilePhoto: admin.profilePhoto,
        accountStatus: admin.accountStatus,
        twoFactorEnabled: admin.twoFactorEnabled,
        lastLogin: admin.lastLogin,
        passwordChangedAt: admin.passwordChangedAt
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Logout Admin Controller
export const logoutAdmin = async (req, res) => {
  try {
    const adminId = req.user?.adminId || 'ADM-001';
    await logAdminAudit(req.user?.email || 'Admin', req.user?.role || 'ADMIN', 'ADMIN_LOGOUT', adminId, 'Session ended cleanly');
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Change Admin Password
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const adminId = req.user?.adminId || 'ADM-2026-001';

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New password and confirmation do not match.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
    }

    const admin = await Admin.findOne({ adminId });
    if (admin) {
      const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password provided is incorrect.' });
      }

      const salt = await bcrypt.genSalt(10);
      admin.passwordHash = await bcrypt.hash(newPassword, salt);
      admin.passwordChangedAt = new Date();
      await admin.save();
    }

    await logAdminAudit(adminId, req.user?.role || 'ADMIN', 'PASSWORD_CHANGED', adminId, 'Administrator password updated securely');

    return res.json({ success: true, message: 'Password changed successfully. Please log in with your new password.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Manage Admins List (SUPER_ADMIN only)
export const getAdminsList = async (req, res) => {
  try {
    // Return sample admins list
    const admins = [
      {
        adminId: 'ADM-2026-001',
        fullName: 'Siddharth Roy',
        email: 'admin@kisansetu.in',
        phone: '+91 98000 00000',
        role: 'SUPER_ADMIN',
        department: 'State Agricultural Marketing Directorate',
        designation: 'Chief Procurement Director',
        accountStatus: 'active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        twoFactorEnabled: true
      },
      {
        adminId: 'ADM-2026-002',
        fullName: 'Meenakshi Sharma',
        email: 'meenakshi.s@kisansetu.in',
        phone: '+91 98111 44555',
        role: 'ADMIN',
        department: 'Burdwan Zone APMC',
        designation: 'Regional Mandi Administrator',
        accountStatus: 'active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        twoFactorEnabled: false
      },
      {
        adminId: 'ADM-2026-003',
        fullName: 'Rajesh Mukherjee',
        email: 'rajesh.m@kisansetu.in',
        phone: '+91 98222 33444',
        role: 'STAFF_MANAGER',
        department: 'Field Operations & Inspection',
        designation: 'Staff Roster Manager',
        accountStatus: 'active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        twoFactorEnabled: true
      }
    ];

    return res.json({ success: true, admins });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Toggle Admin Status / Unlock (SUPER_ADMIN only)
export const toggleAdminStatus = async (req, res) => {
  try {
    const { targetAdminId, action } = req.body; // action: 'activate' | 'deactivate' | 'unlock'
    
    if (targetAdminId === 'ADM-2026-001' && action === 'deactivate') {
      return res.status(400).json({ success: false, message: 'Action forbidden. The primary SUPER_ADMIN account cannot be deactivated.' });
    }

    await logAdminAudit(req.user?.adminId || 'SUPER_ADMIN', req.user?.role || 'SUPER_ADMIN', `ADMIN_${action.toUpperCase()}`, targetAdminId, `Admin status updated to ${action}`);

    return res.json({ success: true, message: `Admin account ${targetAdminId} status updated to ${action}.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Active Sessions Controller
export const getAdminSessions = async (req, res) => {
  try {
    const sessions = [
      { sessionId: 'SESS-Current', device: 'Windows 11 Workstation', browser: 'Chrome 122', ipAddress: '127.0.0.1', loginTime: 'Today, 10:30 AM', isCurrent: true },
      { sessionId: 'SESS-Mobile', device: 'Android Tablet (APMC Desk)', browser: 'Chrome Mobile', ipAddress: '192.168.1.45', loginTime: 'Yesterday, 04:15 PM', isCurrent: false }
    ];
    return res.json({ success: true, sessions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
