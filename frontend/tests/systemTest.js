import assert from 'assert';

console.log(`=======================================================`);
console.log(` Starting SmartFarm Procurement System Tests...`);
console.log(`=======================================================`);

// 1. Test Queue Wait Time Calculation Engine
function calculateEstimatedWaitMinutes(currentServingToken, targetTokenNumber, avgMinutesPerFarmer = 12, activeCounters = 2) {
  const farmersAhead = Math.max(0, targetTokenNumber - currentServingToken);
  return Math.ceil((farmersAhead * avgMinutesPerFarmer) / activeCounters);
}

const waitMinutes = calculateEstimatedWaitMinutes(23, 28, 12, 2);
assert.strictEqual(waitMinutes, 30, 'Wait time calculation formula failed!');
console.log(`[PASS] Queue Wait Time Calculation: 5 farmers ahead @ 12m/2 counters = ${waitMinutes} mins.`);

// 2. Test Duplicate Token Prevention Logic
class MockTokenDatabase {
  constructor() {
    this.tokens = [];
  }

  bookToken(farmerId, date, slotTime) {
    const existing = this.tokens.find(t => t.farmerId === farmerId && t.date === date && t.status === 'active');
    if (existing) {
      throw new Error('DUPLICATE_ACTIVE_TOKEN_PREVENTED: Farmer already holds an active token for this procurement slot!');
    }
    const newToken = { id: `T-${Date.now()}`, farmerId, date, slotTime, status: 'active' };
    this.tokens.push(newToken);
    return newToken;
  }
}

const db = new MockTokenDatabase();
const token1 = db.bookToken('FID-8821', '2026-11-01', '09:00 AM - 12:00 PM');
assert.ok(token1, 'First token booking should succeed');

assert.throws(() => {
  db.bookToken('FID-8821', '2026-11-01', '09:00 AM - 12:00 PM');
}, /DUPLICATE_ACTIVE_TOKEN_PREVENTED/, 'Duplicate token booking must be blocked!');
console.log(`[PASS] Duplicate Active Token Prevention verified successfully.`);

// 3. Test MSP Payment Calculation Engine
function calculateNetPayable(weightQuintals, mspRatePerQuintal = 2203, deductions = 0) {
  const gross = Math.round(weightQuintals * mspRatePerQuintal);
  return gross - deductions;
}

const netPayment = calculateNetPayable(42.5, 2203, 0);
assert.strictEqual(netPayment, 93628, 'MSP Net Payment calculation failed!');
console.log(`[PASS] MSP Net Payment Engine: 42.5 Qtl @ ₹2,203/Qtl = ₹${netPayment.toLocaleString('en-IN')}.`);

console.log(`=======================================================`);
console.log(` ALL SYSTEM TESTS PASSED SUCCESSFULLY! (3/3)`);
console.log(`=======================================================`);
