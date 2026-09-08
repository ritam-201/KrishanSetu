import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import { initQueueSocket } from './sockets/queueSocket.js';
import { initializeSeedAdmins } from './seedAdmin.js';

import {
  login,
  getFarmerProfile,
  bookToken,
  getAuditLogs,
} from './controllers/apiControllers.js';

import {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  changeAdminPassword,
  getAdminsList,
  updateAdmin,
  toggleAdminStatus,
  getAdminSessions,
} from './controllers/adminAuthController.js';

import {
  getAdminDashboard,
  getAdminFarmers,
  getAdminCropBookings,
  getAdminPayments,
  getAdminQueue,
  getAdminReports,
} from './controllers/adminController.js';

import {
  verifyToken,
  requireRole,
  verifyAdminToken,
  requireAdminRole,
} from './middleware/auth.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* =========================================================
   DATABASE
========================================================= */

connectDB()
  .then(async () => {
    console.log('✅ MongoDB connected');

    try {
      await initializeSeedAdmins();
      console.log('✅ Admin seed initialization completed');
    } catch (error) {
      console.error(
        '⚠️ Admin seed initialization error:',
        error.message
      );
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
  });

/* =========================================================
   BASIC ROUTES
========================================================= */

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 KisanSetu Backend API is running',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'KisanSetu API healthy',
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   FARMER AUTH / EXISTING API
========================================================= */

app.post('/api/login', login);

app.get(
  '/api/farmer/profile',
  verifyToken,
  getFarmerProfile
);

app.post(
  '/api/queue/book',
  verifyToken,
  bookToken
);

app.get(
  '/api/audit-logs',
  verifyToken,
  getAuditLogs
);

/* =========================================================
   ADMIN AUTH
========================================================= */

/*
  Registration is intentionally public because a new admin
  needs to be able to register before Super Admin approval.
*/

app.post(
  '/api/admin/auth/register',
  registerAdmin
);

app.post(
  '/api/admin/auth/login',
  loginAdmin
);

app.post(
  '/api/admin/auth/logout',
  verifyAdminToken,
  logoutAdmin
);

app.post(
  '/api/admin/auth/change-password',
  verifyAdminToken,
  changeAdminPassword
);

app.get(
  '/api/admin/auth/sessions',
  verifyAdminToken,
  getAdminSessions
);

/* =========================================================
   ADMIN MANAGEMENT
   SUPER ADMIN ONLY
========================================================= */

/*
  Get all registered admins
*/

app.get(
  '/api/admin/admins',
  verifyAdminToken,
  requireAdminRole('SUPER_ADMIN'),
  getAdminsList
);

/*
  Edit registered admin details
*/

app.put(
  '/api/admin/admins/:adminId',
  verifyAdminToken,
  requireAdminRole('SUPER_ADMIN'),
  updateAdmin
);

/*
  Activate / Disable / Lock admin
*/

app.patch(
  '/api/admin/admins/status',
  verifyAdminToken,
  requireAdminRole('SUPER_ADMIN'),
  toggleAdminStatus
);

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

app.get(
  '/api/admin/dashboard',
  verifyAdminToken,
  getAdminDashboard
);

app.get(
  '/api/admin/farmers',
  verifyAdminToken,
  getAdminFarmers
);

app.get(
  '/api/admin/crop-bookings',
  verifyAdminToken,
  getAdminCropBookings
);

app.get(
  '/api/admin/payments',
  verifyAdminToken,
  getAdminPayments
);

app.get(
  '/api/admin/queue',
  verifyAdminToken,
  getAdminQueue
);

app.get(
  '/api/admin/reports',
  verifyAdminToken,
  getAdminReports
);

/* =========================================================
   SOCKET.IO
========================================================= */

initQueueSocket(io);

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

/* =========================================================
   404
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error.',
  });
});

/* =========================================================
   START SERVER
========================================================= */

server.listen(PORT, () => {
  console.log(
    `🚀 KisanSetu backend running on http://localhost:${PORT}`
  );
});