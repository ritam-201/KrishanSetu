import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminContext';
import { AdminUser, AdminRole } from '../types';
import { ShieldCheck, UserPlus, Lock, Unlock, UserX, CheckCircle2, AlertCircle, ShieldAlert, Edit3, X } from 'lucide-react';

export const AdminManagementPage: React.FC = () => {
  const { adminUser } = useAdminAuth();

  const [adminsList, setAdminsList] = useState<AdminUser[]>([
    {
      adminId: 'ADM-2026-001',
      fullName: 'Siddharth Roy',
      email: 'admin@kisansetu.in',
      phone: '+91 98000 00000',
      role: 'SUPER_ADMIN',
      department: 'State Agricultural Marketing Directorate',
      designation: 'Chief Procurement Director',
      accountStatus: 'active',
      lastLogin: 'Today, 10:42 AM',
      twoFactorEnabled: true
    },
    {
      adminId: 'ADM-2026-002',
      fullName: 'Meenakshi Sharma',
      email: 'meenakshi.s@kisansetu.in',
      phone: '+91 98111 44555',
      role: 'ADMIN',
      department: 'Burdwan Zone APMC',
      designation: 'Regional Mandi Administrator',
      accountStatus: 'active',
      lastLogin: 'Yesterday, 03:20 PM',
      twoFactorEnabled: false
    },
    {
      adminId: 'ADM-2026-003',
      fullName: 'Rajesh Mukherjee',
      email: 'rajesh.m@kisansetu.in',
      phone: '+91 98222 33444',
      role: 'STAFF_MANAGER',
      department: 'Field Operations & Inspection',
      designation: 'Staff Roster Manager',
      accountStatus: 'active',
      lastLogin: '2 days ago',
      twoFactorEnabled: true
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('ADMIN');
  const [newDesignation, setNewDesignation] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdmin: AdminUser = {
      adminId: `ADM-2026-00${adminsList.length + 1}`,
      fullName: newFullName,
      email: newEmail,
      phone: '+91 98333 00000',
      role: newRole,
      department: 'State Mandi Administration',
      designation: newDesignation || 'APMC Officer',
      accountStatus: 'active',
      lastLogin: 'Never',
      twoFactorEnabled: false
    };

    setAdminsList(prev => [...prev, newAdmin]);
    setIsAddModalOpen(false);
    setNewFullName('');
    setNewEmail('');
    setToastMsg(`Administrator account ${newAdmin.adminId} created successfully.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleToggleStatus = (adminId: string, currentStatus: string) => {
    // Protection: Primary SUPER_ADMIN cannot be deactivated
    if (adminId === 'ADM-2026-001') {
      alert('Action Forbidden: The primary SUPER_ADMIN account cannot be deactivated or locked.');
      return;
    }

    setAdminsList(prev => prev.map(a => {
      if (a.adminId === adminId) {
        const nextStatus = currentStatus === 'active' ? 'disabled' : 'active';
        return { ...a, accountStatus: nextStatus };
      }
      return a;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg('')} className="text-emerald-700 font-bold uppercase text-[10px]">Dismiss</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#123D24] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#256035] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">Administrator Roster & RBAC</h1>
            <span className="bg-[#1B4D2A] text-[#8EB773] text-xs font-bold px-3 py-1 rounded-full border border-[#256035]">
              SUPER_ADMIN Console
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Manage administrative personnel credentials, privilege tiers, and security access controls
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-[#8EB773] hover:bg-[#B7D2A2] text-[#123D24] text-xs font-black rounded-xl shadow-md transition-all flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New Admin</span>
        </button>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-3xl border border-[#E8EFE1] p-6 sm:p-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5EC] text-slate-600 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl">Admin ID</th>
                <th className="p-3.5">Administrator</th>
                <th className="p-3.5">Role Tier</th>
                <th className="p-3.5">Department & Designation</th>
                <th className="p-3.5">Account Status</th>
                <th className="p-3.5">Last Login</th>
                <th className="p-3.5 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {adminsList.map((adm) => (
                <tr key={adm.adminId} className="hover:bg-[#FCFBF7]">
                  <td className="p-3.5 font-mono text-slate-500 font-semibold">{adm.adminId}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{adm.fullName}</div>
                    <div className="text-[11px] text-slate-500">{adm.email}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      adm.role === 'SUPER_ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : adm.role === 'ADMIN'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {adm.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700">
                    <div className="font-medium">{adm.designation}</div>
                    <div className="text-[10px] text-slate-500">{adm.department}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      adm.accountStatus === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {adm.accountStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500">{adm.lastLogin}</td>
                  <td className="p-3.5 text-right">
                    {adm.adminId !== 'ADM-2026-001' && (
                      <button
                        onClick={() => handleToggleStatus(adm.adminId, adm.accountStatus)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          adm.accountStatus === 'active'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {adm.accountStatus === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Admin */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-[#123D24] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" /> Create Administrator Account
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={e => setNewFullName(e.target.value)}
                  placeholder="e.g. Dr. Ananya Sen"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#123D24]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="ananya.s@kisansetu.in"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#123D24]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Role Privilege Tier</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#123D24]"
                >
                  <option value="ADMIN">ADMIN (Full Operations)</option>
                  <option value="STAFF_MANAGER">STAFF_MANAGER (Center & Staff Roster)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (State Director)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Designation</label>
                <input
                  type="text"
                  value={newDesignation}
                  onChange={e => setNewDesignation(e.target.value)}
                  placeholder="e.g. Zonal Procurement Director"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#123D24]"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#123D24] text-white rounded-xl text-xs font-bold hover:bg-[#1B4D2A]"
                >
                  Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
