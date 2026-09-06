import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminContext';
import { AdminRole } from '../types';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AdminRole;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAdminAuthenticated, adminUser } = useAdminAuth();

  if (!isAdminAuthenticated || !adminUser) {
    // Unauthenticated user attempting to access protected route -> redirect to /admin/login
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole && adminUser.role !== requiredRole && adminUser.role !== 'SUPER_ADMIN') {
    // Role unauthorized
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-8 rounded-3xl border border-rose-200 shadow-xl max-w-md text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            🚫
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600">
            This module requires <strong>{requiredRole}</strong> privileges. Your account role is <strong>{adminUser.role}</strong>.
          </p>
          <a
            href="/admin/dashboard"
            className="inline-block px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
          >
            Back to Admin Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
