import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Admin } from '../models/Admin.js';
import { AuditLog } from '../models/AuditLog.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kisansetu_secret_key_2026';

const createAdminToken = (admin) => {
  return jwt.sign(
    {
      adminId: admin.adminId,
      email: admin.email,
      role: admin.role,
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

const createAdminId = async () => {
  const year = new Date().getFullYear();

  const count = await Admin.countDocuments({
    adminId: new RegExp(`^ADM-${year}-`),
  });

  return `ADM-${year}-${String(count + 1).padStart(3, '0')}`;
};

const createAuditLog = async ({
  user,
  role,
  action,
  targetEntity = '',
  details = '',
}) => {
  try {
    await AuditLog.create({
      logId: `LOG-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      user,
      role,
      action,
      targetEntity,
      details,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Audit log error:', error.message);
  }
};

/* =========================================================
   ADMIN LOGIN
========================================================= */

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Admin email and password are required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const admin = await Admin.findOne({
      email: cleanEmail,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.',
      });
    }

    /* Account status check */

    if (admin.accountStatus === 'disabled') {
      return res.status(403).json({
        success: false,
        message: 'This admin account has been disabled.',
      });
    }

    if (
      admin.accountStatus === 'locked' &&
      admin.lockUntil &&
      admin.lockUntil > new Date()
    ) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked. Please try again later.',
      });
    }

    /* Password check */

    const passwordMatches = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!passwordMatches) {
      admin.failedLoginAttempts += 1;

      if (admin.failedLoginAttempts >= 5) {
        admin.accountStatus = 'locked';
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await admin.save();

      return res.status(401).json({
        success: false,
        message:
          admin.accountStatus === 'locked'
            ? 'Too many failed attempts. Account locked for 15 minutes.'
            : 'Invalid admin credentials.',
      });
    }

    /* Successful login */

    admin.failedLoginAttempts = 0;
    admin.accountStatus = 'active';
    admin.lockUntil = null;
    admin.lastLogin = new Date();

    const sessionId = `SESSION-${Date.now()}-${crypto
      .randomBytes(4)
      .toString('hex')}`;

    admin.activeSessions.push({
      sessionId,
      device: req.headers['user-agent'] || 'Unknown Device',
      browser: req.headers['user-agent'] || 'Unknown Browser',
      ipAddress:
        req.headers['x-forwarded-for'] ||
        req.socket?.remoteAddress ||
        '127.0.0.1',
      loginTime: new Date(),
      lastActivity: new Date(),
      isCurrent: true,
    });

    await admin.save();

    const token = createAdminToken(admin);

    await createAuditLog({
      user: admin.fullName,
      role: admin.role,
      action: 'ADMIN_LOGIN',
      targetEntity: admin.adminId,
      details: `${admin.fullName} logged into the admin portal.`,
    });

    return res.json({
      success: true,
      message: 'Admin login successful.',
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
        failedLoginAttempts: admin.failedLoginAttempts,
        lastLogin: admin.lastLogin,
        passwordChangedAt: admin.passwordChangedAt,
        twoFactorEnabled: admin.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error during admin login.',
    });
  }
};

/* =========================================================
   ADMIN REGISTRATION
========================================================= */

export const registerAdmin = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      department,
      designation,
      password,
      confirmPassword,
    } = req.body;

    /* Required fields */

    if (
      !fullName ||
      !email ||
      !phone ||
      !department ||
      !designation ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: 'All registration fields are required.',
      });
    }

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanDepartment = department.trim();
    const cleanDesignation = designation.trim();

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid full name.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters.',
      });
    }

    const existingAdmin = await Admin.findOne({
      email: cleanEmail,
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'An admin with this email already exists.',
      });
    }

    const adminId = await createAdminId();

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      adminId,
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash,
      role: 'ADMIN',
      department: cleanDepartment,
      designation: cleanDesignation,
      accountStatus: 'active',
      failedLoginAttempts: 0,
      lockUntil: null,
      twoFactorEnabled: false,
      passwordChangedAt: new Date(),
      activeSessions: [],
    });

    await createAuditLog({
      user: admin.fullName,
      role: admin.role,
      action: 'ADMIN_REGISTERED',
      targetEntity: admin.adminId,
      details: `${admin.fullName} registered a new admin account.`,
    });

    return res.status(201).json({
      success: true,
      message:
        'Admin registration successful. Your account is awaiting administrator access.',
      admin: {
        adminId: admin.adminId,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        department: admin.department,
        designation: admin.designation,
        accountStatus: admin.accountStatus,
      },
    });
  } catch (error) {
    console.error('Admin registration error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error during admin registration.',
    });
  }
};

/* =========================================================
   GET REGISTERED ADMINS
   SUPER ADMIN ONLY
========================================================= */

export const getAdminsList = async (req, res) => {
  try {
    const admins = await Admin.find({})
      .select(
        '-passwordHash -activeSessions -failedLoginAttempts -lockUntil'
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.json({
      success: true,
      admins: admins.map((admin) => ({
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
        passwordChangedAt: admin.passwordChangedAt,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get admins error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to load registered administrators.',
    });
  }
};

/* =========================================================
   UPDATE ADMIN DETAILS
   SUPER ADMIN ONLY
========================================================= */

export const updateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const {
      fullName,
      email,
      phone,
      department,
      designation,
    } = req.body;

    const admin = await Admin.findOne({
      adminId,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.',
      });
    }

    /* Validate required fields */

    if (
      !fullName ||
      !email ||
      !phone ||
      !department ||
      !designation
    ) {
      return res.status(400).json({
        success: false,
        message: 'All admin profile fields are required.',
      });
    }

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanDepartment = department.trim();
    const cleanDesignation = designation.trim();

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid full name.',
      });
    }

    /* Check email belongs to another admin */

    const emailOwner = await Admin.findOne({
      email: cleanEmail,
      adminId: { $ne: adminId },
    });

    if (emailOwner) {
      return res.status(409).json({
        success: false,
        message: 'Another admin is already using this email.',
      });
    }

    const oldDetails = {
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
      department: admin.department,
      designation: admin.designation,
    };

    admin.fullName = cleanName;
    admin.email = cleanEmail;
    admin.phone = cleanPhone;
    admin.department = cleanDepartment;
    admin.designation = cleanDesignation;
    admin.updatedAt = new Date();

    await admin.save();

    await createAuditLog({
      user: req.user?.adminId || 'SUPER_ADMIN',
      role: req.user?.role || 'SUPER_ADMIN',
      action: 'ADMIN_DETAILS_UPDATED',
      targetEntity: admin.adminId,
      details: `Admin details updated for ${admin.fullName}. Previous name: ${oldDetails.fullName}.`,
    });

    return res.json({
      success: true,
      message: 'Admin details updated successfully.',
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
        passwordChangedAt: admin.passwordChangedAt,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update admin error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Unable to update admin details.',
    });
  }
};

/* =========================================================
   TOGGLE ADMIN STATUS
   SUPER ADMIN ONLY
========================================================= */

export const toggleAdminStatus = async (req, res) => {
  try {
    const { adminId, status } = req.body;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID is required.',
      });
    }

    const admin = await Admin.findOne({
      adminId,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.',
      });
    }

    /*
      Do not disable/lock the main SUPER_ADMIN through this endpoint.
    */

    if (
      admin.role === 'SUPER_ADMIN' &&
      admin.adminId === req.user?.adminId
    ) {
      return res.status(403).json({
        success: false,
        message: 'You cannot disable your own Super Admin account.',
      });
    }

    if (!['active', 'disabled', 'locked'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid account status.',
      });
    }

    admin.accountStatus = status;

    if (status === 'active') {
      admin.failedLoginAttempts = 0;
      admin.lockUntil = null;
    }

    await admin.save();

    await createAuditLog({
      user: req.user?.adminId || 'SUPER_ADMIN',
      role: req.user?.role || 'SUPER_ADMIN',
      action: 'ADMIN_STATUS_CHANGED',
      targetEntity: admin.adminId,
      details: `Account status changed to ${status}.`,
    });

    return res.json({
      success: true,
      message: `Admin account ${status === 'active' ? 'activated' : 'updated'} successfully.`,
      admin: {
        adminId: admin.adminId,
        accountStatus: admin.accountStatus,
      },
    });
  } catch (error) {
    console.error('Toggle admin status error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to update admin account status.',
    });
  }
};

/* =========================================================
   ADMIN SESSIONS
========================================================= */

export const getAdminSessions = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      adminId: req.user.adminId,
    }).select('activeSessions');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.',
      });
    }

    return res.json({
      success: true,
      sessions: admin.activeSessions || [],
    });
  } catch (error) {
    console.error('Get admin sessions error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to load admin sessions.',
    });
  }
};

/* =========================================================
   CHANGE ADMIN PASSWORD
========================================================= */

export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All password fields are required.',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must contain at least 8 characters.',
      });
    }

    const admin = await Admin.findOne({
      adminId: req.user.adminId,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.',
      });
    }

    const currentPasswordMatches = await bcrypt.compare(
      currentPassword,
      admin.passwordHash
    );

    if (!currentPasswordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 12);
    admin.passwordChangedAt = new Date();

    await admin.save();

    await createAuditLog({
      user: admin.fullName,
      role: admin.role,
      action: 'ADMIN_PASSWORD_CHANGED',
      targetEntity: admin.adminId,
      details: 'Admin password was changed successfully.',
    });

    return res.json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    console.error('Change password error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to change password.',
    });
  }
};

/* =========================================================
   ADMIN LOGOUT
========================================================= */

export const logoutAdmin = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (req.user?.adminId) {
      const admin = await Admin.findOne({
        adminId: req.user.adminId,
      });

      if (admin && sessionId) {
        admin.activeSessions = admin.activeSessions.filter(
          (session) => session.sessionId !== sessionId
        );

        await admin.save();
      }

      await createAuditLog({
        user: admin?.fullName || req.user.adminId,
        role: admin?.role || req.user.role,
        action: 'ADMIN_LOGOUT',
        targetEntity: req.user.adminId,
        details: 'Admin logged out of the portal.',
      });
    }

    return res.json({
      success: true,
      message: 'Admin logged out successfully.',
    });
  } catch (error) {
    console.error('Admin logout error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to complete admin logout.',
    });
  }
};