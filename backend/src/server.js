import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { initQueueSocket } from './sockets/queueSocket.js';
import { initializeSeedAdmins } from './seedAdmin.js';

import {
  login,
  getFarmerProfile,
  bookToken,
  getAuditLogs
} from './controllers/apiControllers.js';

import {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  changeAdminPassword,
  getAdminsList,
  toggleAdminStatus,
  getAdminSessions
} from './controllers/adminAuthController.js';

import {
  getAdminDashboard,
  getAdminFarmers,
  getAdminCropBookings,
  getAdminPayments,
  getAdminQueue,
  getAdminReports
} from './controllers/adminController.js';

import {
  verifyAdminToken,
  requireAdminRole
} from './middleware/auth.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// =======================================================
// MIDDLEWARE
// =======================================================

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// =======================================================
// SOCKET.IO
// =======================================================

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

// =======================================================
// DATABASE CONNECTION
// =======================================================

connectDB()
  .then(() => {
    initializeSeedAdmins();
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
  });

// =======================================================
// SOCKET.IO QUEUE HANDLER
// =======================================================

initQueueSocket(io);

// =======================================================
// HEALTH CHECK
// =======================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'SmartFarm Procurement & Queue Management API',
    timestamp: new Date().toISOString()
  });
});

// =======================================================
// FARMER / GENERAL APIs
// =======================================================

app.post('/api/auth/login', login);

app.get('/api/farmers/profile', getFarmerProfile);

app.post('/api/tokens/book', bookToken);

// =======================================================
// ADMIN AUTHENTICATION APIs
// =======================================================

// Admin Login
app.post('/api/admin/auth/login', loginAdmin);

// Admin Registration
app.post('/api/admin/auth/register', registerAdmin);

// Registration Test
app.get('/api/admin/auth/register-test', (req, res) => {
  console.log('🔥 REGISTER TEST ROUTE HIT');

  res.json({
    success: true,
    message: 'Admin registration route is loaded'
  });
});

console.log('✅ Admin registration route loaded');

// Admin Logout
app.post(
  '/api/admin/auth/logout',
  verifyAdminToken,
  logoutAdmin
);

// Change Admin Password
app.post(
  '/api/admin/auth/change-password',
  verifyAdminToken,
  changeAdminPassword
);

// =======================================================
// ADMIN PORTAL DATA APIs
// =======================================================
//
// These routes require a valid admin token.
//
// IMPORTANT:
// We are NOT using requireAdminRole('ADMIN') here.
// This allows authenticated admin users, including
// SUPER_ADMIN, to access dashboard data.
//
// =======================================================

// -------------------------------------------------------
// ADMIN DASHBOARD
// -------------------------------------------------------

app.get(
  '/api/admin/dashboard',
  verifyAdminToken,
  getAdminDashboard
);

// -------------------------------------------------------
// ADMIN FARMERS
// -------------------------------------------------------

app.get(
  '/api/admin/farmers',
  verifyAdminToken,
  getAdminFarmers
);

// -------------------------------------------------------
// ADMIN CROP BOOKINGS
// -------------------------------------------------------

app.get(
  '/api/admin/crop-bookings',
  verifyAdminToken,
  getAdminCropBookings
);

// -------------------------------------------------------
// ADMIN PAYMENTS
// -------------------------------------------------------

app.get(
  '/api/admin/payments',
  verifyAdminToken,
  getAdminPayments
);

// -------------------------------------------------------
// ADMIN QUEUE / TOKENS
// -------------------------------------------------------

app.get(
  '/api/admin/queue',
  verifyAdminToken,
  getAdminQueue
);

// -------------------------------------------------------
// ADMIN REPORTS
// -------------------------------------------------------

app.get(
  '/api/admin/reports',
  verifyAdminToken,
  getAdminReports
);

// =======================================================
// ADMIN AUDIT LOGS
// =======================================================

app.get(
  '/api/admin/audit-logs',
  verifyAdminToken,
  getAuditLogs
);

// =======================================================
// ADMIN MANAGEMENT
// =======================================================
//
// Only SUPER_ADMIN can access these endpoints.
// =======================================================

// Get all admins
app.get(
  '/api/admin/admins',
  verifyAdminToken,
  requireAdminRole('SUPER_ADMIN'),
  getAdminsList
);

// Enable / Disable admin
app.patch(
  '/api/admin/admins/status',
  verifyAdminToken,
  requireAdminRole('SUPER_ADMIN'),
  toggleAdminStatus
);

// Admin sessions
app.get(
  '/api/admin/sessions',
  verifyAdminToken,
  getAdminSessions
);

// =======================================================
// SERVER
// =======================================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('=======================================================');
  console.log(` SmartFarm Procurement Backend API Server running on port ${PORT}`);
  console.log(' Dedicated Admin Authentication & RBAC Active');
  console.log(' Admin Dashboard APIs Connected');
  console.log(' Farmers API Connected');
  console.log(' Crop Bookings API Connected');
  console.log(' Payments API Connected');
  console.log(' Queue API Connected');
  console.log(' Reports API Connected');
  console.log('=======================================================');
});