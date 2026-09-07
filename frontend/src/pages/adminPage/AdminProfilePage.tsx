import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminContext';
import { ShieldCheck, User, Lock, KeyRound, Monitor, Smartphone, CheckCircle2, AlertCircle, LogOut, ShieldAlert, Award } from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const { adminUser, changeAdminPassword, toggle2FA, activeSessions, terminateSession } = useAdminAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');
    setLoading(true);

    const result = await changeAdminPassword(currentPassword, newPassword, confirmPassword);
    setLoading(false);

    if (result.success) {
      setPassSuccess(result.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassError(result.message);
    }
  };

  if (!adminUser) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="bg-[#123D24] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#256035] mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-[#1B4D2A] border-2 border-[#8EB773] p-1 overflow-hidden shadow-inner shrink-0">
              <img
                src={adminUser.profilePhoto}
                alt={adminUser.fullName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif">{adminUser.fullName}</h1>
                <span className="bg-[#1B4D2A] text-[#8EB773] text-xs font-bold px-3 py-1 rounded-full border border-[#256035]">
                  {adminUser.role}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                {adminUser.designation} • {adminUser.department}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                Admin ID: <strong className="text-white">{adminUser.adminId}</strong> • Email: <strong className="text-white">{adminUser.email}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Security Overview Status (Requirement 21) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E8EFE1] shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#123D24] flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Security Status Overview
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-semibold">Password Strength</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  ████████ Strong
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-600 font-semibold block">Two-Factor Auth (2FA)</span>
                  <span className="text-[10px] text-slate-400">TOTP Authenticator</span>
                </div>
                <button
                  onClick={toggle2FA}
                  className={`px-3 py-1 rounded-full font-bold text-xs transition-all ${
                    adminUser.twoFactorEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {adminUser.twoFactorEnabled ? '● Enabled' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-semibold">Active Sessions</span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                  {activeSessions.length} Devices
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-semibold">Failed Login Attempts</span>
                <span className="font-bold text-emerald-700">0</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-semibold">Last Authenticated</span>
                <span className="font-medium text-slate-800">{adminUser.lastLogin || 'Today, 10:42 AM'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password & Active Sessions Columns */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Change Password Form (Requirement 10) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-sm">
            <h2 className="text-base font-bold text-[#123D24] flex items-center gap-2 border-b border-slate-100 pb-3 mb-6">
              <KeyRound className="w-5 h-5 text-emerald-600" /> Change Administrator Password
            </h2>

            {passSuccess && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{passSuccess}</span>
              </div>
            )}

            {passError && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#123D24]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#123D24]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#123D24]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#123D24] text-white text-xs font-bold rounded-xl hover:bg-[#1B4D2A] transition-all shadow"
              >
                {loading ? 'Updating Hash...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Active Sessions System (Requirement 14) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
              <h2 className="text-base font-bold text-[#123D24] flex items-center gap-2">
                <Monitor className="w-5 h-5 text-emerald-600" /> Active Session Management
              </h2>
              <button
                onClick={() => activeSessions.filter(s => !s.isCurrent).forEach(s => terminateSession(s.sessionId))}
                className="text-xs text-rose-600 font-semibold hover:underline"
              >
                Logout All Other Sessions
              </button>
            </div>

            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.sessionId} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      {session.device.includes('Mobile') ? <Smartphone className="w-5 h-5 text-slate-700" /> : <Monitor className="w-5 h-5 text-slate-700" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{session.device}</span>
                        {session.isCurrent && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Current Session
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{session.browser} • IP: {session.ipAddress} • {session.loginTime}</p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      onClick={() => terminateSession(session.sessionId)}
                      className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100"
                    >
                      Terminate
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
