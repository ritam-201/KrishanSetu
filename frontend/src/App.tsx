import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminContext";

import { Navbar } from "./components/farmerPortal/Navbar";
import { Footer } from "./components/Footer";
import { AiAssistant } from "./components/farmerPortal/AiAssistant";
import { OfflineBanner } from "./components/OfflineBanner";
import { AdminProtectedRoute } from "./components/adminPortal/AdminProtectedRoute";
import { Weather } from "./components/Weather";
import AdminLayout from "./components/adminPortal/AdminLayout";

// Farmer/Public Pages
import { HomePage } from "./pages/HomePage";
import FarmerDashboard from "./pages/farmerPage/FarmerDashboard";
import { FarmerProfilePage } from "./pages/farmerPage/FarmerProfilePage";
import { ProcurementSchedulePage } from "./pages/farmerPage/ProcurementSchedulePage";
import { QueueTrackingPage } from "./pages/farmerPage/QueueTrackingPage";
import { ProcurementStatusPage } from "./pages/farmerPage/ProcurementStatusPage";
import { PaymentStatusPage } from "./pages/farmerPage/PaymentStatusPage";
import NotificationsPage from "./pages/farmerPage/NotificationsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/farmerPage/RegisterPage";

// Officer
import { OfficerDashboard } from "./pages/adminPage/OfficerDashboard";

// Admin Pages
import  AdminDashboard  from "./pages/adminPage/AdminDashboard";
import { AdminLoginPage } from "./pages/adminPage/AdminLoginPage";
import AdminRegisterPage from "./pages/adminPage/AdminRegisterPage";
import { AdminProfilePage } from "./pages/adminPage/AdminProfilePage";
import { AdminManagementPage } from "./pages/adminPage/AdminManagementPage";

import Payments from "./pages/adminPage/Payments";
import CropBookings from "./pages/adminPage/CropBookings";
import QueueTokens from "./pages/adminPage/QueueTokens";
import Reports from "./pages/adminPage/Reports";
import Farmers from "./pages/adminPage/Farmers";

// Scroll to top
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Show Farmer Navbar only on non-admin routes
const ConditionalNavbar: React.FC = () => {
  const { pathname } = useLocation();

  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return <Navbar />;
};

// Farmer Protected Route
const FarmerProtectedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
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

            {/* Farmer/Public Navbar */}
            <ConditionalNavbar />

            {/* Main Content */}
            <main className="flex-1">

              <Routes>

                {/* ========================= */}
                {/* PUBLIC ROUTES */}
                {/* ========================= */}

                <Route
                  path="/"
                  element={<HomePage />}
                />

                <Route
                  path="/login"
                  element={<LoginPage />}
                />

                <Route
                  path="/register"
                  element={<RegisterPage />}
                />

                <Route
                  path="/weather"
                  element={<Weather />}
                />

                {/* ========================= */}
                {/* FARMER ROUTES */}
                {/* ========================= */}

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

                {/* ========================= */}
                {/* OFFICER ROUTE */}
                {/* ========================= */}

                <Route
                  path="/officer"
                  element={
                    <FarmerProtectedRoute>
                      <OfficerDashboard />
                    </FarmerProtectedRoute>
                  }
                />

                {/* ========================= */}
                {/* ADMIN AUTH ROUTES */}
                {/* ========================= */}

                <Route
                  path="/admin/login"
                  element={<AdminLoginPage />}
                />

                <Route
                  path="/admin/register"
                  element={<AdminRegisterPage />}
                />

                {/* ========================= */}
                {/* ADMIN DASHBOARD */}
                {/* ========================= */}

                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <AdminDashboard />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <AdminDashboard />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                {/* ========================= */}
                {/* ADMIN PROFILE */}
                {/* ========================= */}

                <Route
                  path="/admin/profile"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <AdminProfilePage />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                {/* ========================= */}
                {/* ADMIN MANAGEMENT */}
                {/* ========================= */}

                <Route
                  path="/admin/admins"
                  element={
                    <AdminProtectedRoute requiredRole="SUPER_ADMIN">
                      <AdminLayout>
                        <AdminManagementPage />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                {/* ========================= */}
                {/* ADMIN CROP BOOKINGS */}
                {/* ========================= */}

                <Route
                  path="/admin/crop-bookings"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <CropBookings />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                {/* ========================= */}
                {/* ADMIN PAYMENTS */}
                {/* ========================= */}

                <Route
                  path="/admin/payments"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <Payments />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                {/* ========================= */}
                {/* ADMIN FARMERS */}
                {/* ========================= */}

                <Route
                  path="/admin/farmers"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <Farmers />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                {/* ========================= */}
                {/* ADMIN QUEUE */}
                {/* ========================= */}

                <Route
                  path="/admin/queue"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <QueueTokens />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                {/* ========================= */}
                {/* ADMIN REPORTS */}
                {/* ========================= */}

                <Route
                  path="/admin/reports"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <Reports />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

              </Routes>

            </main>

            {/* Farmer AI Assistant */}
            <AiAssistant />

            {/* Footer */}
            <Footer />

          </div>

        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
};

export default App;