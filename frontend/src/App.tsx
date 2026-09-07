import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import  FarmerDashboard  from './pages/farmerPage/FarmerDashboard';
import { FarmerProfilePage } from './pages/farmerPage/FarmerProfilePage';
import { ProcurementSchedulePage } from './pages/farmerPage/ProcurementSchedulePage';
import { QueueTrackingPage } from './pages/farmerPage/QueueTrackingPage';
import { ProcurementStatusPage } from './pages/farmerPage/ProcurementStatusPage';
import { PaymentStatusPage } from './pages/farmerPage/PaymentStatusPage';
import  NotificationsPage  from './pages/farmerPage/NotificationsPage';
import { OfficerDashboard } from './pages/adminPage/OfficerDashboard';
import { AdminDashboard } from './pages/adminPage/AdminDashboard';
import { AdminLoginPage } from './pages/adminPage/AdminLoginPage';
import { AdminProfilePage } from './pages/adminPage/AdminProfilePage';
import { AdminManagementPage } from './pages/adminPage/AdminManagementPage';
import { LoginPage } from './pages/LoginPage';
import  RegisterPage  from './pages/farmerPage/RegisterPage';

// Components
import { AiAssistant } from './components/farmerPortal/AiAssistant';
import { OfflineBanner } from './components/farmerPortal/OfflineBanner';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';

// Scroll to top helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const FarmerProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <OfflineBanner />
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
            {/* Top Sticky Navigation */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/dashboard"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerDashboard />
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerProfilePage />
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="/schedule"
                  element={
                    <FarmerProtectedRoute>
                      <ProcurementSchedulePage />
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="/queue"
                  element={
                    <FarmerProtectedRoute>
                      <QueueTrackingPage />
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="/centers"
                  element={
                    <FarmerProtectedRoute>
                      <ProcurementSchedulePage />
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="/status"
                  element={
                    <FarmerProtectedRoute>
                      <ProcurementStatusPage />
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <FarmerProtectedRoute>
                      <PaymentStatusPage />
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <FarmerProtectedRoute>
                      <NotificationsPage />
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="/officer"
                  element={
                    <FarmerProtectedRoute>
                      <OfficerDashboard />
                    </FarmerProtectedRoute>
                  }
                />
                
                {/* Dedicated Admin System Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/profile"
                  element={
                    <AdminProtectedRoute>
                      <AdminProfilePage />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/admins"
                  element={
                    <AdminProtectedRoute requiredRole="SUPER_ADMIN">
                      <AdminManagementPage />
                    </AdminProtectedRoute>
                  }
                />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>

            {/* Floating Voice-Enabled AI Farmer Assistant */}
            <AiAssistant />

            {/* Persistent Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
};

export default App;
