import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  Building2,
  ArrowRight,
  Phone,
  Lock,
  Mail,
  CheckCircle2,
  Globe,
  UserRound,
  Wheat,
  Eye,
  EyeOff,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from '../context/AdminContext';

export const LoginPage: React.FC = () => {
  const { loginWithProfile, switchRole, getRegisteredUserByPhone } = useAuth();
  const { loginAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const [activePortal, setActivePortal] = useState<'farmer' | 'admin'>('farmer');

  // Farmer state
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerAadhaar, setFarmerAadhaar] = useState('');
  const [farmerKisanId, setFarmerKisanId] = useState('');

  const [farmerPhoneOtp, setFarmerPhoneOtp] = useState('');
  const [farmerAadhaarOtp, setFarmerAadhaarOtp] = useState('');
  const [farmerKisanOtp, setFarmerKisanOtp] = useState('');

  const [farmerLoginType, setFarmerLoginType] = useState<
    'phone' | 'aadhaar' | 'kisanId'
  >('phone');

  const [otpSent, setOtpSent] = useState(false);

  // Admin state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  const activeFarmerIdentifierValue =
    farmerLoginType === 'phone'
      ? farmerPhone
      : farmerLoginType === 'aadhaar'
        ? farmerAadhaar
        : farmerKisanId;

  const activeFarmerOtpValue =
    farmerLoginType === 'phone'
      ? farmerPhoneOtp
      : farmerLoginType === 'aadhaar'
        ? farmerAadhaarOtp
        : farmerKisanOtp;

  const updateActiveFarmerIdentifier = (value: string) => {
    if (farmerLoginType === 'phone') {
      setFarmerPhone(value);
    } else if (farmerLoginType === 'aadhaar') {
      setFarmerAadhaar(value);
    } else {
      setFarmerKisanId(value);
    }
  };

  const updateActiveFarmerOtp = (value: string) => {
    if (farmerLoginType === 'phone') {
      setFarmerPhoneOtp(value);
    } else if (farmerLoginType === 'aadhaar') {
      setFarmerAadhaarOtp(value);
    } else {
      setFarmerKisanOtp(value);
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleFarmerLoginTypeChange = (
    type: 'phone' | 'aadhaar' | 'kisanId'
  ) => {
    setFarmerLoginType(type);
    setOtpSent(false);
  };

  const handleFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const identifier =
      farmerLoginType === 'phone'
        ? farmerPhone
        : farmerLoginType === 'aadhaar'
          ? farmerAadhaar
          : farmerKisanId;

    const existingUser = getRegisteredUserByPhone(identifier);

    if (existingUser && existingUser.id && existingUser.name) {
      loginWithProfile(existingUser);
      switchRole('farmer');
      navigate('/dashboard');
    } else {
      navigate('/register', {
        state: {
          phone: farmerPhone,
          aadhaar: farmerAadhaar,
          message:
            'Mobile OTP verified! Please complete registration to create your personalized account.',
        },
      });
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setAdminError('');
    setAdminLoading(true);

    const result = await loginAdmin(adminEmail, adminPassword, true);

    setAdminLoading(false);

    if (result.success) {
      switchRole('admin');
      navigate('/admin/dashboard');
    } else {
      setAdminError(result.message || 'Invalid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F7F8F1]">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-lime-200/30 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-green-200/20 blur-3xl" />

        <div className="absolute top-8 left-8 opacity-10">
          <Wheat className="w-28 h-28 text-emerald-800 rotate-[-20deg]" />
        </div>

        <div className="absolute top-20 right-12 opacity-10">
          <Sprout className="w-24 h-24 text-emerald-800 rotate-12" />
        </div>

        <div className="absolute bottom-8 right-8 opacity-10">
          <Wheat className="w-32 h-32 text-emerald-800 rotate-12" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <Sprout className="w-7 h-7 text-white" />
            </div>

            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#123D24]">
                KisanSetu
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Digital Gateway for India&apos;s Farmers
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-[11px] sm:text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Secure
            </span>

            <span className="text-slate-300">•</span>

            <span>Simple</span>

            <span className="text-slate-300">•</span>

            <span>Transparent</span>

            <span className="text-slate-300">•</span>

            <span className="text-emerald-700">Farmer First</span>
          </div>
        </header>

        {/* Main container */}
        <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[28px] shadow-[0_20px_70px_rgba(18,61,36,0.12)] overflow-hidden">
          {/* Portal switcher */}
          <div className="p-3 sm:p-4 bg-slate-50/80 border-b border-slate-100">
            <div className="grid grid-cols-2 gap-2 bg-slate-200/70 rounded-2xl p-1.5 max-w-2xl mx-auto">
              <button
                type="button"
                onClick={() => {
                  setActivePortal('farmer');
                  setAdminError('');
                }}
                className={`group flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activePortal === 'farmer'
                    ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-900/20'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Sprout
                  className={`w-5 h-5 ${
                    activePortal === 'farmer'
                      ? 'text-emerald-100'
                      : 'text-emerald-700'
                  }`}
                />
                <span>Farmer Portal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePortal('admin');
                  setAdminError('');
                }}
                className={`group flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activePortal === 'admin'
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Building2
                  className={`w-5 h-5 ${
                    activePortal === 'admin'
                      ? 'text-slate-200'
                      : 'text-slate-700'
                  }`}
                />
                <span>Government Portal</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8 lg:p-10">
            {/* FARMER PORTAL */}
            {activePortal === 'farmer' && (
              <div className="max-w-xl mx-auto">
                {/* Card heading */}
                <div className="flex items-start justify-between gap-4 mb-7">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                      <UserRound className="w-6 h-6 text-emerald-700" />
                    </div>

                    <div>
                      <h2 className="text-xl font-extrabold text-[#123D24]">
                        Farmer Login
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Access your farming services securely
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Secure Login
                  </span>
                </div>

                {/* Login type */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-700 mb-2.5">
                    Login with
                  </p>

                  <div className="grid grid-cols-3 border border-slate-200 rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        handleFarmerLoginTypeChange('phone')
                      }
                      className={`py-3 px-2 text-xs font-bold transition ${
                        farmerLoginType === 'phone'
                          ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                          : 'bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <Phone className="w-4 h-4 mx-auto mb-1" />
                      Mobile
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleFarmerLoginTypeChange('aadhaar')
                      }
                      className={`py-3 px-2 text-xs font-bold transition border-l border-slate-200 ${
                        farmerLoginType === 'aadhaar'
                          ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                          : 'bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 mx-auto mb-1" />
                      Aadhaar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleFarmerLoginTypeChange('kisanId')
                      }
                      className={`py-3 px-2 text-xs font-bold transition border-l border-slate-200 ${
                        farmerLoginType === 'kisanId'
                          ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                          : 'bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block text-sm font-black mb-1">
                        #
                      </span>
                      Kisan ID
                    </button>
                  </div>
                </div>

                <form
                  onSubmit={handleFarmerSubmit}
                  className="space-y-5"
                >
                  {/* Identifier */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      {farmerLoginType === 'phone'
                        ? 'Mobile Number'
                        : farmerLoginType === 'aadhaar'
                          ? 'Aadhaar Number'
                          : 'Kisan Registration ID'}
                    </label>

                    <div className="relative">
                      {farmerLoginType === 'phone' && (
                        <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 border-r border-slate-200 text-xs font-bold text-slate-600 bg-slate-50 rounded-l-xl">
                          +91
                        </div>
                      )}

                      <input
                        type="text"
                        required
                        value={activeFarmerIdentifierValue}
                        onChange={(e) =>
                          updateActiveFarmerIdentifier(e.target.value)
                        }
                        placeholder={
                          farmerLoginType === 'phone'
                            ? 'Enter 10-digit mobile number'
                            : farmerLoginType === 'aadhaar'
                              ? 'Enter 12-digit Aadhaar number'
                              : 'Enter Kisan registration ID'
                        }
                        className={`w-full ${
                          farmerLoginType === 'phone'
                            ? 'pl-16'
                            : 'pl-4'
                        } pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition`}
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Your information is protected and securely verified.
                    </div>
                  </div>

                  {/* OTP */}
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-900/15 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Send OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">
                          Enter 4-Digit OTP
                        </label>

                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                        >
                          Resend OTP
                        </button>
                      </div>

                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        required
                        value={activeFarmerOtpValue}
                        onChange={(e) =>
                          updateActiveFarmerOtp(
                            e.target.value.replace(/\D/g, '')
                          )
                        }
                        placeholder="••••"
                        className="w-full py-4 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono text-2xl font-bold tracking-[0.7em] text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                      />

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-900/15 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Continue to Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </form>

                {/* Register */}
                <div className="relative my-7">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>

                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs text-slate-400 font-medium">
                      OR
                    </span>
                  </div>
                </div>

                <div className="border border-emerald-100 bg-emerald-50/50 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        New to KisanSetu?
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Create your farmer account
                      </p>
                    </div>

                    <Link
                      to="/register"
                      className="shrink-0 px-4 py-2.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-700 hover:text-white text-xs font-bold transition"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* GOVERNMENT PORTAL */}
            {activePortal === 'admin' && (
              <div className="max-w-xl mx-auto">
                {/* Heading */}
                <div className="flex items-start justify-between gap-4 mb-7">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-slate-800" />
                    </div>

                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">
                        Government Login
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Secure access for authorized officials
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-[10px] font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    Authorized Only
                  </span>
                </div>

                {/* Error */}
                {adminError && (
                  <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{adminError}</span>
                  </div>
                )}

                <form
                  onSubmit={handleAdminSubmit}
                  className="space-y-5"
                >
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Official Email / Admin ID
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="Enter official email"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10 transition"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">
                        Password
                      </label>

                      <Link
                        to="/admin/login"
                        className="text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:underline"
                      >
                        Dedicated Admin Portal
                      </Link>
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10 transition"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Login */}
                  <button
                    type="submit"
                    disabled={adminLoading}
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-slate-900/15 transition-all flex items-center justify-center gap-2"
                  >
                    {adminLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Login to Government Console</span>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      </>
                    )}
                  </button>
                </form>

                {/* Security message */}
                <div className="mt-7 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-slate-700" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Secure Government Access
                      </p>

                      <p className="text-[11px] leading-relaxed text-slate-500 mt-1">
                        This portal is restricted to authorized government
                        officials and APMC administrators.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trust strip */}
          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Secure
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Protected access
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <Sprout className="w-5 h-5 text-green-700" />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Farmer First
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Built for farmers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-slate-700" />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Government Ready
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Official workflows
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-blue-700" />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Accessible
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Anywhere in India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-7">
          <p className="text-xs text-slate-500">
            Made with care for India&apos;s farmers
          </p>

          <p className="text-[10px] text-slate-400 mt-1">
            © 2026 KisanSetu • Digital Agriculture Platform
          </p>
        </footer>
      </div>
    </div>
  );
};