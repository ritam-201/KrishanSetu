import React from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { useAdminAuth } from "../../context/AdminContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { adminUser, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login", { replace: true });

    setTimeout(() => {
      logoutAdmin();
    }, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar
        adminName={adminUser?.fullName || "Admin"}
        onLogout={handleLogout}
      />

      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
