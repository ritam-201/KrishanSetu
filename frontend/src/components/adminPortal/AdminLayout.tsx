import React from "react";
import AdminNavbar from "./AdminNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar adminName="Ritam" />

      <main>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;