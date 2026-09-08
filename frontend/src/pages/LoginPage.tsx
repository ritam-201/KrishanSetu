import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useAdminAuth } from "../context/AdminContext";

type Portal = "farmer" | "government" | "admin";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const { login, verifyOTP } = useAuth();
  const { loginAdmin, loginGovernment } = useAdminAuth();

  const [activePortal, setActivePortal] = useState<Portal>("farmer");

  /* ============================================================
     FARMER STATE
  ============================================================ */

  const [farmerIdentifier, setFarmerIdentifier] = useState("");
  const [farmerOtp, setFarmerOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  /* ============================================================
     GOVERNMENT STATE
  ============================================================ */

  const [governmentEmail, setGovernmentEmail] = useState("");
  const [governmentPassword, setGovernmentPassword] = useState("");
  const [showGovernmentPassword, setShowGovernmentPassword] =
    useState(false);
  const [governmentRememberMe, setGovernmentRememberMe] = useState(false);

  /* ============================================================
     ADMIN STATE
  ============================================================ */

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminRememberMe, setAdminRememberMe] = useState(false);

  /* ============================================================
     COMMON STATE
  ============================================================ */

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* ============================================================
     CHANGE PORTAL
  ============================================================ */

  const changePortal = (portal: Portal) => {
    setActivePortal(portal);

    setError("");
    setSuccessMessage("");
    setOtpSent(false);
    setFarmerOtp("");
  };

  /* ============================================================
     FARMER LOGIN - SEND OTP
  ============================================================ */

  const handleFarmerLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!farmerIdentifier.trim()) {
      setError(
        "Please enter your mobile number, Aadhaar number, or Kisan ID.",
      );
      return;
    }

    setLoading(true);

    try {
      const result = await login(farmerIdentifier);

      if (result?.success) {
        setOtpSent(true);

        setSuccessMessage(
          result.message ||
            "OTP sent successfully. Please enter the OTP.",
        );
      } else {
        setError(
          result?.message || "Unable to send OTP. Please try again.",
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the authentication service.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     FARMER OTP VERIFICATION
  ============================================================ */

  const handleVerifyFarmerOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!farmerOtp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);

    try {
      const result = await verifyOTP(
        farmerIdentifier,
        farmerOtp,
      );

      if (result?.success) {
        navigate("/dashboard");
      } else {
        setError(
          result?.message || "Invalid OTP. Please try again.",
        );
      }
    } catch (err) {
      console.error(err);

      setError("Unable to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     GOVERNMENT OFFICER LOGIN
  ============================================================ */

  const handleGovernmentLogin = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!governmentEmail.trim()) {
      setError(
        "Please enter your Government Officer email.",
      );
      return;
    }

    if (!governmentPassword) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const result = await loginGovernment(
        governmentEmail,
        governmentPassword,
        governmentRememberMe,
      );

      if (result.success) {
        navigate("/government/dashboard");
      } else {
        setError(
          result.message ||
            "Invalid Government Officer credentials.",
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the Government authentication service.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     ADMIN LOGIN
  ============================================================ */

  const handleAdminLogin = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!adminEmail.trim()) {
      setError("Please enter your Admin email.");
      return;
    }

    if (!adminPassword) {
      setError("Please enter your Admin password.");
      return;
    }

    setLoading(true);

    try {
      const result = await loginAdmin(
        adminEmail,
        adminPassword,
        adminRememberMe,
      );

      if (result.success) {
        navigate("/admin/dashboard");
      } else {
        setError(
          result.message ||
            "Invalid Admin credentials.",
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the Admin authentication service.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F7F8F1]">

      {/* ========================================================
          BACKGROUND DECORATION
      ======================================================== */}

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

        {/* ========================================================
            HEADER
        ======================================================== */}

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

            <span className="text-emerald-700">
              Farmer First
            </span>

          </div>
        </header>

        {/* ========================================================
            MAIN CARD
        ======================================================== */}

        <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[28px] shadow-[0_20px_70px_rgba(18,61,36,0.12)] overflow-hidden">

          {/* ======================================================
              PORTAL SWITCHER
          ====================================================== */}

          <div className="p-3 sm:p-4 bg-slate-50/80 border-b border-slate-100">

            <div className="grid grid-cols-3 gap-2 bg-slate-200/70 rounded-2xl p-1.5 max-w-3xl mx-auto">

              {/* FARMER */}

              <button
                type="button"
                onClick={() => changePortal("farmer")}
                className={`group flex items-center justify-center gap-2 py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                  activePortal === "farmer"
                    ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                <Sprout
                  className={`w-5 h-5 ${
                    activePortal === "farmer"
                      ? "text-emerald-100"
                      : "text-emerald-700"
                  }`}
                />

                <span>Farmer Portal</span>
              </button>

              {/* GOVERNMENT */}

              <button
                type="button"
                onClick={() => changePortal("government")}
                className={`group flex items-center justify-center gap-2 py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                  activePortal === "government"
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                <Building2
                  className={`w-5 h-5 ${
                    activePortal === "government"
                      ? "text-slate-200"
                      : "text-slate-700"
                  }`}
                />

                <span>Government</span>
              </button>

              {/* ADMIN */}

              <button
                type="button"
                onClick={() => changePortal("admin")}
                className={`group flex items-center justify-center gap-2 py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                  activePortal === "admin"
                    ? "bg-purple-700 text-white shadow-lg shadow-purple-900/20"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                <ShieldCheck
                  className={`w-5 h-5 ${
                    activePortal === "admin"
                      ? "text-purple-100"
                      : "text-purple-700"
                  }`}
                />

                <span>Admin Portal</span>
              </button>

            </div>
          </div>

          {/* ======================================================
              CONTENT
          ====================================================== */}

          <div className="p-5 sm:p-8 lg:p-10">

            {/* ====================================================
                FARMER PORTAL
            ==================================================== */}

            {activePortal === "farmer" && (
              <div className="max-w-xl mx-auto">

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

                <form
                  onSubmit={
                    otpSent
                      ? handleVerifyFarmerOtp
                      : handleFarmerLogin
                  }
                  className="space-y-5"
                >

                  {/* IDENTIFIER */}

                  <div>

                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Mobile / Aadhaar / Kisan ID
                    </label>

                    <div className="relative">

                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="text"
                        required
                        value={farmerIdentifier}
                        disabled={otpSent}
                        onChange={(e) =>
                          setFarmerIdentifier(e.target.value)
                        }
                        placeholder="Enter your mobile, Aadhaar or Kisan ID"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition disabled:opacity-60"
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
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-900/15 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <span>Send OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-4">

                      <div className="flex items-center justify-between">

                        <label className="text-xs font-bold text-slate-700">
                          Enter 6-Digit OTP
                        </label>

                        <button
                          type="button"
                          disabled={loading}
                          onClick={handleFarmerLogin}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline disabled:opacity-50"
                        >
                          Resend OTP
                        </button>

                      </div>

                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        value={farmerOtp}
                        onChange={(e) =>
                          setFarmerOtp(
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                        placeholder="••••••"
                        className="w-full py-4 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono text-2xl font-bold tracking-[0.7em] text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                      />

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-900/15 transition-all flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Continue to Dashboard</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setFarmerOtp("");
                          setError("");
                          setSuccessMessage("");
                        }}
                        className="w-full text-xs font-bold text-emerald-700 hover:underline"
                      >
                        Change ID
                      </button>

                    </div>
                  )}

                </form>

                {/* MESSAGES */}

                {error && (
                  <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* FARMER REGISTER */}

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

            {/* ====================================================
                GOVERNMENT PORTAL
            ==================================================== */}

            {activePortal === "government" && (
              <div className="max-w-xl mx-auto">

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

                {error && (
                  <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form
                  onSubmit={handleGovernmentLogin}
                  className="space-y-5"
                >

                  {/* EMAIL */}

                  <div>

                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Official Email
                    </label>

                    <div className="relative">

                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="email"
                        required
                        value={governmentEmail}
                        onChange={(e) =>
                          setGovernmentEmail(e.target.value)
                        }
                        placeholder="officer@kisansetu.in"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10 transition"
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}

                  <div>

                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Password
                    </label>

                    <div className="relative">

                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type={
                          showGovernmentPassword
                            ? "text"
                            : "password"
                        }
                        required
                        value={governmentPassword}
                        onChange={(e) =>
                          setGovernmentPassword(e.target.value)
                        }
                        placeholder="Enter your password"
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10 transition"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowGovernmentPassword(
                            (prev) => !prev,
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showGovernmentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* REMEMBER */}

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">

                    <input
                      type="checkbox"
                      checked={governmentRememberMe}
                      onChange={(e) =>
                        setGovernmentRememberMe(
                          e.target.checked,
                        )
                      }
                      className="h-4 w-4 rounded"
                    />

                    Remember me

                  </label>

                  {/* LOGIN */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-slate-900/15 transition-all flex items-center justify-center gap-2"
                  >

                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          Sign in as Government Officer
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      </>
                    )}

                  </button>

                </form>

                {/* SECURITY */}

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
                        This portal is restricted to authorized
                        government officials and APMC administrators.
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* ====================================================
                ADMIN PORTAL
            ==================================================== */}

            {activePortal === "admin" && (
              <div className="max-w-xl mx-auto">

                <div className="flex items-start justify-between gap-4 mb-7">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-purple-700" />
                    </div>

                    <div>

                      <h2 className="text-xl font-extrabold text-slate-900">
                        Admin Portal
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Secure access for KisanSetu administrators
                      </p>

                    </div>

                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-full text-[10px] font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    Admin Only
                  </span>

                </div>

                {/* ADMIN ERROR */}

                {error && (
                  <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form
                  onSubmit={handleAdminLogin}
                  className="space-y-5"
                >

                  {/* EMAIL */}

                  <div>

                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Admin Email / Admin ID
                    </label>

                    <div className="relative">

                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) =>
                          setAdminEmail(e.target.value)
                        }
                        placeholder="admin@kisansetu.in"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition"
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}

                  <div>

                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Admin Password
                    </label>

                    <div className="relative">

                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type={
                          showAdminPassword
                            ? "text"
                            : "password"
                        }
                        required
                        value={adminPassword}
                        onChange={(e) =>
                          setAdminPassword(e.target.value)
                        }
                        placeholder="Enter admin password"
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowAdminPassword(
                            (prev) => !prev,
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700"
                      >
                        {showAdminPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* REMEMBER */}

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">

                    <input
                      type="checkbox"
                      checked={adminRememberMe}
                      onChange={(e) =>
                        setAdminRememberMe(
                          e.target.checked,
                        )
                      }
                      className="h-4 w-4 rounded"
                    />

                    Remember me

                  </label>

                  {/* LOGIN */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-purple-900/15 transition-all flex items-center justify-center gap-2"
                  >

                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          Login to Admin Portal
                        </span>
                        <ArrowRight className="w-4 h-4 text-purple-200" />
                      </>
                    )}

                  </button>

                </form>

                {/* ==================================================
                    ADMIN REGISTRATION
                ================================================== */}

                <div className="relative my-7">

                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>

                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs text-slate-400 font-medium">
                      NEW ADMIN
                    </span>
                  </div>

                </div>

                <div className="border border-purple-100 bg-purple-50/50 rounded-2xl p-4">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="text-sm font-bold text-slate-800">
                        Don&apos;t have an admin account?
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Register for authorized admin access
                      </p>

                    </div>

                    <Link
                      to="/admin/register"
                      className="shrink-0 px-4 py-2.5 rounded-xl border border-purple-600 text-purple-700 hover:bg-purple-700 hover:text-white text-xs font-bold transition"
                    >
                      Register
                    </Link>

                  </div>

                </div>

                {/* SECURITY */}

                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">

                  <div className="flex items-start gap-3">

                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-slate-700" />
                    </div>

                    <div>

                      <p className="text-xs font-bold text-slate-800">
                        Restricted Admin Access
                      </p>

                      <p className="text-[11px] leading-relaxed text-slate-500 mt-1">
                        The Admin Portal is restricted to
                        authorized KisanSetu administrators.
                        Admins can monitor farmers, crops,
                        bookings and procurement operations.
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>

          {/* ======================================================
              TRUST STRIP
          ====================================================== */}

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

        {/* ========================================================
            FOOTER
        ======================================================== */}

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

export default LoginPage;