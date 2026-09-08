import React from 'react';
import AdminNavbar from './AdminNavbar';
import { useAdminAuth } from '../../context/AdminContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
}) => {
  const { adminUser, logoutAdmin } = useAdminAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar
        adminName={adminUser?.fullName || 'Admin'}
        onLogout={logoutAdmin}
      />

      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;