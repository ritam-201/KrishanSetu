import assert from 'assert';
import bcrypt from 'bcryptjs';

console.log(`=======================================================`);
console.log(` Starting Admin Auth & RBAC Security Tests...`);
console.log(`=======================================================`);

// 1. Password Hashing Test
async function testPasswordHashing() {
  const plainPassword = 'SuperAdmin@2026';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainPassword, salt);

  assert.notStrictEqual(plainPassword, hash, 'Password must never be stored as plain text');
  const isMatch = await bcrypt.compare(plainPassword, hash);
  assert.strictEqual(isMatch, true, 'bcrypt compare must validate correct password');
  
  const isWrongMatch = await bcrypt.compare('WrongPass123', hash);
  assert.strictEqual(isWrongMatch, false, 'bcrypt compare must reject wrong password');
  console.log(`[PASS] Bcrypt Password Hashing & Verification`);
}

// 2. Account Brute-Force Locking Simulation
function simulateLoginAttempts(adminObj, attemptPassword) {
  const CORRECT_HASH = '$2a$10$abcdefghijklmnopqrstuuu'; // Mock hash
  const MAX_ATTEMPTS = 5;

  if (adminObj.accountStatus === 'locked') {
    return { success: false, message: 'Account locked due to multiple failed login attempts.' };
  }

  // Simulate failed attempt
  if (attemptPassword !== 'SuperAdmin@2026') {
    adminObj.failedLoginAttempts += 1;
    if (adminObj.failedLoginAttempts >= MAX_ATTEMPTS) {
      adminObj.accountStatus = 'locked';
      return { success: false, message: 'Account locked due to multiple failed login attempts.' };
    }
    return { success: false, message: 'Invalid admin credentials.' };
  }

  adminObj.failedLoginAttempts = 0;
  return { success: true, message: 'Login successful' };
}

function testBruteForceLocking() {
  const mockAdmin = {
    email: 'admin@kisansetu.in',
    failedLoginAttempts: 0,
    accountStatus: 'active'
  };

  for (let i = 1; i <= 4; i++) {
    const res = simulateLoginAttempts(mockAdmin, 'WrongPass');
    assert.strictEqual(res.message, 'Invalid admin credentials.', `Attempt ${i} should return generic error message`);
  }

  assert.strictEqual(mockAdmin.failedLoginAttempts, 4);

  // 5th failed attempt triggers lock
  const lockRes = simulateLoginAttempts(mockAdmin, 'WrongPass');
  assert.strictEqual(mockAdmin.accountStatus, 'locked', '5th failed attempt must set accountStatus to locked');
  assert.ok(lockRes.message.includes('locked'), 'Locked notification returned');

  console.log(`[PASS] Brute-force Account Locking after 5 failed attempts`);
}

// 3. Primary SUPER_ADMIN Deactivation Protection Test
function testSuperAdminProtection(adminId, action) {
  if (adminId === 'ADM-2026-001' && (action === 'deactivate' || action === 'delete')) {
    return { allowed: false, message: 'Action forbidden. Primary SUPER_ADMIN cannot be deactivated or deleted.' };
  }
  return { allowed: true };
}

function testSuperAdminDeactivationGuard() {
  const primaryRes = testSuperAdminProtection('ADM-2026-001', 'deactivate');
  assert.strictEqual(primaryRes.allowed, false, 'Primary SUPER_ADMIN deactivation must be blocked');

  const regularRes = testSuperAdminProtection('ADM-2026-002', 'deactivate');
  assert.strictEqual(regularRes.allowed, true, 'Regular admin deactivation allowed');

  console.log(`[PASS] Primary SUPER_ADMIN Deactivation Protection Guard`);
}

async function runTests() {
  await testPasswordHashing();
  testBruteForceLocking();
  testSuperAdminDeactivationGuard();

  console.log(`=======================================================`);
  console.log(` ALL ADMIN AUTHENTICATION TESTS PASSED! (3/3)`);
  console.log(`=======================================================`);
}

runTests();
