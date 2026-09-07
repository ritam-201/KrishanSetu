import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminContext';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, AlertTriangle, CheckCircle2, ArrowRight, KeyRound, Key, Sparkles } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAdminAuth();

  const [email, setEmail] = useState('admin@kisansetu.in');
  const [password, setPassword] = useState('SuperAdmin@2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lockedMsg, setLockedMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLockedMsg('');
    setSuccessMsg('');
    setLoading(true);

    const result = await loginAdmin(email, password, rememberMe);

    setLoading(false);

    if (result.success) {
      setSuccessMsg('Authentication successful! Redirecting to Admin Console...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } else {
      if (result.message?.includes('locked')) {
        setLockedMsg(result.message);
      } else {
        // Generic security error message
        setErrorMsg(result.message || 'Invalid admin credentials.');
      }
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setIsForgotOpen(false);
    }, 4000);
  };

  return (
    <div className="min-h-[85vh] bg-[#FCFBF7] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        
        {/* Top Header Identity */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#123D24] text-white shadow-xl mb-3 border border-[#256035]">
            <ShieldCheck className="w-8 h-8 text-[#8EB773]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#123D24]">
            KisanSetu Admin Portal
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            State Department of Agricultural Marketing • Administrative Console
          </p>
          <div className="mt-2 inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
            <Lock className="w-3 h-3 text-amber-600" />
            <span>Authorized Administrators Only</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-3xl border border-[#E8EFE1] p-6 sm:p-8 shadow-xl relative overflow-hidden">
          
          {/* Notifications / Alerts */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center space-x-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {lockedMsg && (
            <div className="mb-5 p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-semibold flex items-start space-x-2.5">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Account Locked</p>
                <p className="text-[11px] mt-0.5 text-amber-800">{lockedMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email / ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@kisansetu.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-[#123D24] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-xs text-[#123D24] hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-[#123D24] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#123D24] focus:ring-[#123D24]"
                />
                <span>Remember me on this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#123D24] hover:bg-[#1B4D2A] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>SECURE LOGIN</span>
                  <ArrowRight className="w-4 h-4 text-[#8EB773]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Credentials Hint */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Hackathon Demo Access</p>
            <div className="bg-[#FCFBF7] p-3 rounded-xl border border-[#E8EFE1] text-xs text-slate-700 space-y-1 font-mono">
              <p>Email: <strong className="text-[#123D24]">admin@kisansetu.in</strong></p>
              <p>Password: <strong className="text-[#123D24]">SuperAdmin@2026</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <h3 className="text-lg font-bold text-[#123D24] mb-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-600" /> Admin Password Reset
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Enter your registered administrator email address to receive a single-use cryptographically signed reset token.
            </p>

            {forgotSent ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-xl border border-emerald-200">
                A password reset token has been dispatched to {forgotEmail || 'your email'}. Check your administrator inbox.
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="admin@kisansetu.in"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#123D24]"
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#123D24] text-white rounded-xl text-xs font-bold hover:bg-[#1B4D2A]"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
