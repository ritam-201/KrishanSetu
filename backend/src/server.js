import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { initQueueSocket } from './sockets/queueSocket.js';
import { initializeSeedAdmins } from './seedAdmin.js';
import { login, getFarmerProfile, bookToken, getAuditLogs } from './controllers/apiControllers.js';
import {
  loginAdmin,
  logoutAdmin,
  changeAdminPassword,
  getAdminsList,
  toggleAdminStatus,
  getAdminSessions
} from './controllers/adminAuthController.js';
import { verifyAdminToken, requireAdminRole } from './middleware/auth.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database Connection & Seed First Admin
connectDB().then(() => {
  initializeSeedAdmins();
});

// Initialize Socket.IO Handler
initQueueSocket(io);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'SmartFarm Procurement & Queue Management API',
    timestamp: new Date().toISOString()
  });
});

// General Farmer API Endpoints
app.post('/api/auth/login', login);
app.get('/api/farmers/profile', getFarmerProfile);
app.post('/api/tokens/book', bookToken);

// Dedicated Admin Authentication API Endpoints
app.post('/api/admin/auth/login', loginAdmin);
app.post('/api/admin/auth/logout', verifyAdminToken, logoutAdmin);
app.post('/api/admin/auth/change-password', verifyAdminToken, changeAdminPassword);

// Protected Admin Resource APIs
app.get('/api/admin/audit-logs', verifyAdminToken, getAuditLogs);
app.get('/api/admin/admins', verifyAdminToken, requireAdminRole('SUPER_ADMIN'), getAdminsList);
app.patch('/api/admin/admins/status', verifyAdminToken, requireAdminRole('SUPER_ADMIN'), toggleAdminStatus);
app.get('/api/admin/sessions', verifyAdminToken, getAdminSessions);

// Catch-all for API queue status
app.get('/api/queue/status', (req, res) => {
  res.json({
    centerId: 'CTR-001',
    centerName: 'Haripur Mandi Procurement Hub #04',
    currentServingToken: 23,
    totalWaiting: 14,
    averageProcessingMinutes: 12
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` SmartFarm Procurement Backend API Server running on port ${PORT}`);
  console.log(` Dedicated Admin Authentication & RBAC Active`);
  console.log(`=======================================================`);
});
