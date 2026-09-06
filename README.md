# SmartFarm Procurement — Intelligent Farmer Procurement & Queue Management System (KisanSetu)

[![Platform](https://img.shields.io/badge/Platform-State%20Mandi%20APMC-1B4D2A.svg)](https://kisansetu.gov.in)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Hackathon-Production%20Ready-emerald.svg)]()

> **KisanSetu (SmartFarm Procurement)** is an intelligent, farmer-centric procurement and real-time Mandi queue management platform designed to eliminate long waiting lines, ensure transparent moisture & quality assessment, provide direct benefit transfer (DBT) payment tracking, and empower farmers with voice-enabled AI assistance across English, Bengali, and Hindi.

---

## 🌾 1. Problem Statement & Solution

### The Challenge
* **Long Waiting Hours**: Farmers spend 12–36 hours waiting outside APMC Mandis without knowing queue status.
* **Lack of Queue Visibility**: No real-time updates on when their harvest will be called.
* **Quality & Weighbridge Disputes**: Non-transparent moisture testing and manual weight recording.
* **Delayed Payments**: Uncertainty regarding when Government Minimum Support Price (MSP) funds reach their bank accounts.
* **Digital Literacy Barriers**: Traditional complex portals fail non-English or voice-preferred farmers.

### Our Solution
1. **Personalized Farmer Profiles & Dashboard**: Comprehensive profiles tracking land acreage, multi-crop yields, Government DBTs, and masked Aadhaar/Voter IDs.
2. **Smart Token Booking & Digital Mandi Gate Pass**: Slot reservation preventing duplicate bookings, with printable receipts and QR codes.
3. **Real-Time WebSocket Queue Engine**: Live queue boards auto-updating across farmer devices as Mandi officers call tokens.
4. **Transparent Lab Quality & Weighbridge Verification**: Multi-stage inspection recording moisture %, foreign matter %, and grade certification.
5. **Direct Payment & PFMS Tracking**: Milestone-based tracking of Treasury funds disbursed straight to farmer bank accounts.
6. **Voice-Enabled AI Kisan Assistant**: AI chatbot supporting speech-to-text input and audio responses in English, Bengali, and Hindi.

---

## 🛠️ 2. Technology Stack & Architecture

### Frontend
- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + Lucide React Icons
- **State & Context**: Custom AuthContext + WebSockets
- **Charts**: Recharts (Daily trend, Crop distribution, Target vs Actual)
- **i18n & Voice**: Multilingual translation dictionary + Web Speech API (SpeechRecognition & SpeechSynthesis)
- **PWA**: ServiceWorker (`sw.js`) + Web App Manifest

### Backend
- **Server**: Node.js + Express.js
- **Database**: MongoDB + Mongoose ORM
- **Real-Time Engine**: Socket.IO WebSockets (`/queue/status`)
- **Authentication**: JWT Tokens + Role Guards (`farmer`, `officer`, `admin`)
- **Security**: Masked sensitive Govt IDs, bcrypt password hashing, Audit Logging

---

## 🚀 3. Quick Start & Local Setup

### Prerequisites
- Node.js v18+ and npm v9+

### Option A: Local Development
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Frontend Dev Server**:
   ```bash
   npm start
   # Application runs at http://localhost:3000
   ```

3. **Start Backend API & WebSocket Server**:
   ```bash
   node backend/src/server.js
   # Backend API runs at http://localhost:5000
   ```

4. **Run Integration Tests**:
   ```bash
   node tests/systemTest.js
   ```

### Option B: Docker Compose
```bash
docker compose up --build
```

---

## 🔑 4. Demo Credentials & Hackathon Roles

| Role | Name | Phone / Login | Description |
| :--- | :--- | :--- | :--- |
| **Farmer** | Ramesh Kumar Patel | `+91 98321 44821` | Full profile, slot booking, live queue, Mandi receipt, AI voice assistant |
| **Staff / Officer** | Inspector Vikramjit Sen | `+91 98111 22233` | Live Mandi queue control, call next, quality testing, weighbridge approval |
| **Admin** | Director S. Roy | `+91 98000 00000` | State-wide analytics, APMC center status, system audit logs |

---

## 📱 5. Hackathon End-to-End Demo Scenario

1. **Farmer Login & Detailed Profile**: Switch role to **Farmer** -> View 85% complete profile with masked Aadhaar `XXXX-XXXX-4821`, land acreage (4.5 Acres), and multi-crop yield planner.
2. **Book Procurement Slot**: Open Procurement Schedule -> Book slot for **Rice / Paddy** at **Haripur Mandi Hub #04** -> Generate unique token **HAR-024**.
3. **Print Digital Mandi Gate Pass**: Click **"Print Official Receipt"** -> View official Government seal, QR code, MSP rate calculation (₹2,203/Qtl).
4. **Live Queue Tracking**: Open Live Queue -> View current token **HAR-023**, 5 farmers ahead, estimated wait **36 mins**.
5. **Officer Queue Call & Real-Time Sync**: Switch role to **Staff / Officer** -> Click **"Call Next Farmer"** -> Connected farmer screen instantly updates via WebSockets without page reload.
6. **Lab Quality Inspection & Approval**: Officer completes moisture test (13.5%), foreign matter (0.8%), certifies **Grade A**, records weighbridge weight (45 Qtl), and approves procurement.
7. **PFMS Direct Bank Disbursement**: Officer advances payment status to **Disbursed to Bank**.
8. **Farmer Notification & History**: Farmer receives in-app alert, views financial payout of **₹99,135**, and inspects PFMS transaction reference.
9. **Voice AI Assistant**: Click the floating **Kisan AI** button -> Press microphone to speak or type *"When is my next token?"* -> Hear spoken audio response.

---

## 🔒 6. Security & Audit Logging

Every critical administrative action (slot booking, quality grade override, center capacity alteration, payment release) is automatically recorded in the **AuditLog** model and viewable in the **Admin Dashboard** audit console. Sensitive identification numbers (Aadhaar, Voter ID) are masked at the API layer.

---

## 📄 License
Released under the MIT License. Developed for State Agricultural Procurement Management.
