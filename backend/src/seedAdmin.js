import bcrypt from 'bcryptjs';
import { Admin } from './models/Admin.js';
import { AuditLog } from './models/AuditLog.js';

export const initializeSeedAdmins = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      console.log(`[Admin Seed] Admins already exist (${adminCount} accounts). Skipping seed.`);
      return;
    }

    const defaultPassword = process.env.ADMIN_PASSWORD || 'SuperAdmin@2026';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(defaultPassword, salt);

    const superAdmin = await Admin.create({
      adminId: 'ADM-2026-001',
      fullName: 'Siddharth Roy',
      email: process.env.ADMIN_EMAIL || 'admin@kisansetu.in',
      phone: '+91 98000 00000',
      passwordHash,
      role: 'SUPER_ADMIN',
      department: 'State Agricultural Marketing Directorate',
      designation: 'Chief Procurement Director',
      accountStatus: 'active',
      failedLoginAttempts: 0,
      twoFactorEnabled: true,
      activeSessions: [
        {
          sessionId: `SESS-${Date.now()}-1`,
          device: 'Windows Workstation',
          browser: 'Chrome 122',
          ipAddress: '127.0.0.1',
          isCurrent: true
        }
      ]
    });

    console.log(`=======================================================`);
    console.log(` [Admin Seed SUCCESS] Initial SUPER_ADMIN account created:`);
    console.log(` Email: ${superAdmin.email}`);
    console.log(` Role: ${superAdmin.role}`);
    console.log(`=======================================================`);

    await AuditLog.create({
      logId: `AUD-SEED-${Date.now()}`,
      user: superAdmin.fullName,
      role: superAdmin.role,
      action: 'INITIAL_SUPER_ADMIN_SEEDED',
      targetEntity: superAdmin.adminId,
      details: 'System initialized initial SUPER_ADMIN account with secure bcrypt hash'
    });
  } catch (err) {
    console.warn(`[Admin Seed Warning]: ${err.message}`);
  }
};
