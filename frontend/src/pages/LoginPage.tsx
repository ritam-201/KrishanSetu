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
  Sparkles,
  MapPin,
  Fingerprint,
  Landmark,
  ChevronRight,
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

  /* ============================================================
     PORTAL CONFIG
  ============================================================ */

  const portalConfig = {
    farmer: {
      title: "Farmer Portal",
      subtitle: "Your gateway to smarter farming",
      icon: Sprout,
      accent: "emerald",
    },
    government: {
      title: "Government Portal",
      subtitle: "Secure access for authorized officials",
      icon: Building2,
      accent: "slate",
    },
    admin: {
      title: "Admin Portal",
      subtitle: "Manage the KisanSetu ecosystem",
      icon: ShieldCheck,
      accent: "purple",
    },
  };

  const ActiveIcon = portalConfig[activePortal].icon;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#07150d]">

      {/* ========================================================
          PREMIUM FARM BACKGROUND
      ======================================================== */}

      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=90')",
        }}
      />

      {/* DARK PREMIUM OVERLAYS */}

      <div className="absolute inset-0 bg-[#06150c]/65" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#04140b]/95 via-[#0a2917]/70 to-[#06150c]/45" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#04100a]/90 via-transparent to-[#06150c]/35" />

      {/* SOFT LIGHT */}

      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="absolute -bottom-40 -left-40 w-[550px] h-[550px] rounded-full bg-lime-300/10 blur-[120px]" />

      {/* ========================================================
          DECORATIVE AGRICULTURE ICONS
      ======================================================== */}

      <div className="absolute top-16 left-8 opacity-[0.08] pointer-events-none">
        <Wheat className="w-48 h-48 text-white rotate-[-20deg]" />
      </div>

      <div className="absolute bottom-10 right-10 opacity-[0.06] pointer-events-none">
        <Sprout className="w-64 h-64 text-white rotate-12" />
      </div>

      {/* ========================================================
          PAGE CONTENT
      ======================================================== */}

      <div className="relative z-10 min-h-screen px-4 py-6 sm:px-6 lg:px-10">

        {/* ======================================================
            TOP NAV
        ====================================================== */}

        <header className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between">

            {/* LOGO */}

            <div className="flex items-center gap-3">

              <div className="relative">

                <div className="absolute inset-0 rounded-2xl bg-emerald-400/40 blur-xl" />

                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 border border-white/20 flex items-center justify-center shadow-2xl">

                  <Sprout className="w-7 h-7 sm:w-8 sm:h-8 text-white" />

                </div>

              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Kisan<span className="text-emerald-300">Setu</span>
                </h1>

                <p className="hidden sm:block text-[10px] text-white/55 font-medium tracking-wide">
                  DIGITAL AGRICULTURE PLATFORM
                </p>
              </div>

            </div>

            {/* SECURE BADGE */}

            <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 px-4 py-2 text-white/80">

              <ShieldCheck className="w-4 h-4 text-emerald-300" />

              <span className="text-xs font-semibold">
                Secure & Trusted
              </span>

            </div>

          </div>

        </header>

        {/* ======================================================
            MAIN GRID
        ====================================================== */}

        <main className="max-w-7xl mx-auto min-h-[calc(100vh-110px)] flex items-center">

          <div className="w-full grid lg:grid-cols-[1fr_560px] xl:grid-cols-[1fr_590px] gap-10 xl:gap-20 items-center py-10">

            {/* ==================================================
                LEFT HERO
            ================================================== */}

            <section className="hidden lg:block text-white">

              <div className="max-w-xl">

                {/* SMALL BADGE */}

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-emerald-200 mb-7">

                  <Sparkles className="w-4 h-4" />

                  <span className="text-xs font-bold tracking-wide">
                    INDIA'S SMART AGRICULTURE NETWORK
                  </span>

                </div>

                {/* HERO TITLE */}

                <h2 className="text-5xl xl:text-6xl font-black leading-[1.02] tracking-tight">

                  Connecting
                  <span className="block text-emerald-300">
                    Farmers
                  </span>

                  <span className="block">
                    to a Better
                  </span>

                  <span className="block text-white/90">
                    Tomorrow.
                  </span>

                </h2>

                <p className="mt-7 text-base xl:text-lg leading-relaxed text-white/65 max-w-lg">

                  One secure digital gateway for farmers,
                  government officers and administrators.
                  Manage agriculture services with simplicity,
                  transparency and trust.

                </p>

                {/* FEATURE ROW */}

                <div className="grid grid-cols-3 gap-4 mt-10">

                  <div className="group">

                    <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition">

                      <ShieldCheck className="w-5 h-5 text-emerald-300" />

                    </div>

                    <p className="text-sm font-bold text-white">
                      Secure
                    </p>

                    <p className="text-[11px] text-white/45 mt-1">
                      Protected access
                    </p>

                  </div>

                  <div className="group">

                    <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition">

                      <Sprout className="w-5 h-5 text-emerald-300" />

                    </div>

                    <p className="text-sm font-bold text-white">
                      Farmer First
                    </p>

                    <p className="text-[11px] text-white/45 mt-1">
                      Built for India
                    </p>

                  </div>

                  <div className="group">

                    <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition">

                      <Globe className="w-5 h-5 text-emerald-300" />

                    </div>

                    <p className="text-sm font-bold text-white">
                      Connected
                    </p>

                    <p className="text-[11px] text-white/45 mt-1">
                      Anywhere in India
                    </p>

                  </div>

                </div>

                {/* LOCATION */}

                <div className="mt-10 flex items-center gap-2 text-white/40 text-xs">

                  <MapPin className="w-4 h-4 text-emerald-300" />

                  <span>
                    Empowering India's agricultural ecosystem
                  </span>

                </div>

              </div>

            </section>

            {/* ==================================================
                LOGIN PANEL
            ================================================== */}

            <section>

              <div className="relative">

                {/* GLOW */}

                <div className="absolute -inset-2 bg-emerald-400/15 blur-3xl rounded-[40px]" />

                <div className="relative rounded-[32px] bg-white/[0.94] backdrop-blur-2xl border border-white/70 shadow-[0_30px_100px_rgba(0,0,0,0.35)] overflow-hidden">

                  {/* TOP ACCENT */}

                  <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-lime-400 to-emerald-500" />

                  {/* =================================================
                      PANEL HEADER
                  ================================================= */}

                  <div className="px-6 sm:px-9 pt-7 pb-5">

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700 mb-2">
                          Welcome Back
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#123D24]">
                          Sign in to KisanSetu
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-500 mt-2">
                          Select your portal to continue securely.
                        </p>

                      </div>

                      <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 items-center justify-center">

                        <Fingerprint className="w-6 h-6 text-emerald-700" />

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      PORTAL SELECTOR
                  ================================================= */}

                  <div className="px-5 sm:px-7">

                    <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">

                      {/* FARMER */}

                      <button
                        type="button"
                        onClick={() => changePortal("farmer")}
                        className={`relative flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 ${
                          activePortal === "farmer"
                            ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-700/25 scale-[1.01]"
                            : "text-slate-500 hover:bg-white hover:text-slate-800"
                        }`}
                      >

                        <Sprout className="w-4 h-4 sm:w-4.5 sm:h-4.5" />

                        <span>Farmer</span>

                        {activePortal === "farmer" && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-lime-300" />
                        )}

                      </button>

                      {/* GOVERNMENT */}

                      <button
                        type="button"
                        onClick={() => changePortal("government")}
                        className={`relative flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 ${
                          activePortal === "government"
                            ? "bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-lg shadow-slate-900/25 scale-[1.01]"
                            : "text-slate-500 hover:bg-white hover:text-slate-800"
                        }`}
                      >

                        <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />

                        <span>Government</span>

                        {activePortal === "government" && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-300" />
                        )}

                      </button>

                      {/* ADMIN */}

                      <button
                        type="button"
                        onClick={() => changePortal("admin")}
                        className={`relative flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 ${
                          activePortal === "admin"
                            ? "bg-gradient-to-br from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-700/25 scale-[1.01]"
                            : "text-slate-500 hover:bg-white hover:text-slate-800"
                        }`}
                      >

                        <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5" />

                        <span>Admin</span>

                        {activePortal === "admin" && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-200" />
                        )}

                      </button>

                    </div>

                  </div>

                  {/* =================================================
                      LOGIN CONTENT
                  ================================================= */}

                  <div className="p-6 sm:p-8">

                    {/* ===============================================
                        FARMER
                    =============================================== */}

                    {activePortal === "farmer" && (
                      <div>

                        <div className="flex items-center gap-3 mb-6">

                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 border border-emerald-200 flex items-center justify-center">

                            <UserRound className="w-5 h-5 text-emerald-700" />

                          </div>

                          <div>

                            <h3 className="font-black text-[#123D24]">
                              Farmer Login
                            </h3>

                            <p className="text-[11px] text-slate-500">
                              Access your farming services
                            </p>

                          </div>

                          <div className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-wide">

                            <ShieldCheck className="w-3 h-3" />

                            Secure

                          </div>

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

                            <label className="block text-[11px] font-black uppercase tracking-wide text-slate-600 mb-2">
                              Mobile / Aadhaar / Kisan ID
                            </label>

                            <div className="relative group">

                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition" />

                              <input
                                type="text"
                                required
                                value={farmerIdentifier}
                                disabled={otpSent}
                                onChange={(e) =>
                                  setFarmerIdentifier(e.target.value)
                                }
                                placeholder="Enter mobile, Aadhaar or Kisan ID"
                                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-60"
                              />

                            </div>

                            <div className="flex items-center gap-2 mt-2.5 text-[10px] text-slate-400">

                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />

                              Your identity is securely verified.

                            </div>

                          </div>

                          {/* SEND OTP */}

                          {!otpSent ? (
                            <button
                              type="submit"
                              disabled={loading}
                              className="group relative overflow-hidden w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-emerald-800/20 transition-all flex items-center justify-center gap-2"
                            >

                              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                              {loading ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Sending OTP...
                                </>
                              ) : (
                                <>
                                  <span>Send Secure OTP</span>
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                              )}

                            </button>
                          ) : (
                            <div className="space-y-4">

                              <div className="flex items-center justify-between">

                                <label className="text-[11px] font-black uppercase tracking-wide text-slate-600">
                                  Enter 6-Digit OTP
                                </label>

                                <button
                                  type="button"
                                  disabled={loading}
                                  onClick={handleFarmerLogin}
                                  className="text-[10px] font-black text-emerald-700 hover:text-emerald-900 hover:underline disabled:opacity-50"
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
                                className="w-full py-5 rounded-2xl bg-slate-50 border border-slate-200 text-center font-mono text-2xl font-black tracking-[0.65em] text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                              />

                              <button
                                type="submit"
                                disabled={loading}
                                className="group w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-emerald-800/20 transition-all flex items-center justify-center gap-2"
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
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                                className="w-full text-[10px] font-black uppercase tracking-wide text-emerald-700 hover:text-emerald-900"
                              >
                                Change ID
                              </button>

                            </div>
                          )}

                        </form>

                        {/* MESSAGES */}

                        {error && (
                          <div className="mt-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                          </div>
                        )}

                        {successMessage && (
                          <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{successMessage}</span>
                          </div>
                        )}

                        {/* REGISTER */}

                        <div className="relative my-7">

                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                          </div>

                          <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-[9px] font-black tracking-[0.2em] text-slate-400">
                              NEW FARMER
                            </span>
                          </div>

                        </div>

                        <div className="group border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-4 hover:border-emerald-300 transition-all">

                          <div className="flex items-center justify-between gap-4">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">

                                <Sprout className="w-5 h-5 text-emerald-700" />

                              </div>

                              <div>

                                <p className="text-xs font-black text-slate-800">
                                  New to KisanSetu?
                                </p>

                                <p className="text-[10px] text-slate-500 mt-1">
                                  Create your farmer account
                                </p>

                              </div>

                            </div>

                            <Link
                              to="/register"
                              className="shrink-0 group/register flex items-center gap-1 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black shadow-lg shadow-emerald-700/15 transition"
                            >
                              Register
                              <ChevronRight className="w-3.5 h-3.5 group-hover/register:translate-x-0.5 transition" />
                            </Link>

                          </div>

                        </div>

                      </div>
                    )}

                    {/* ===============================================
                        GOVERNMENT
                    =============================================== */}

                    {activePortal === "government" && (
                      <div>

                        <div className="flex items-center gap-3 mb-6">

                          <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">

                            <Landmark className="w-5 h-5 text-slate-800" />

                          </div>

                          <div>

                            <h3 className="font-black text-slate-900">
                              Government Login
                            </h3>

                            <p className="text-[11px] text-slate-500">
                              Authorized official access
                            </p>

                          </div>

                          <div className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[9px] font-black uppercase tracking-wide">

                            <Lock className="w-3 h-3" />

                            Restricted

                          </div>

                        </div>

                        {/* ERROR */}

                        {error && (
                          <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                          </div>
                        )}

                        {successMessage && (
                          <div className="mb-5 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-start gap-2">
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

                            <label className="block text-[11px] font-black uppercase tracking-wide text-slate-600 mb-2">
                              Official Email
                            </label>

                            <div className="relative group">

                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition" />

                              <input
                                type="email"
                                required
                                value={governmentEmail}
                                onChange={(e) =>
                                  setGovernmentEmail(e.target.value)
                                }
                                placeholder="officer@kisansetu.in"
                                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10 transition-all"
                              />

                            </div>

                          </div>

                          {/* PASSWORD */}

                          <div>

                            <label className="block text-[11px] font-black uppercase tracking-wide text-slate-600 mb-2">
                              Password
                            </label>

                            <div className="relative group">

                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition" />

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
                                className="w-full pl-11 pr-12 py-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10 transition-all"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  setShowGovernmentPassword(
                                    (prev) => !prev,
                                  )
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 transition"
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

                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">

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
                            className="group w-full py-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-950 hover:from-slate-900 hover:to-black disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
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
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}

                          </button>

                        </form>

                        {/* SECURITY */}

                        <div className="mt-7 p-4 rounded-2xl bg-slate-50 border border-slate-200">

                          <div className="flex items-start gap-3">

                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">

                              <ShieldCheck className="w-5 h-5 text-slate-700" />

                            </div>

                            <div>

                              <p className="text-xs font-black text-slate-800">
                                Secure Government Access
                              </p>

                              <p className="text-[10px] leading-relaxed text-slate-500 mt-1">
                                This portal is restricted to authorized
                                government officials and APMC administrators.
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>
                    )}

                    {/* ===============================================
                        ADMIN
                    =============================================== */}

                    {activePortal === "admin" && (
                      <div>

                        <div className="flex items-center gap-3 mb-6">

                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-50 border border-purple-200 flex items-center justify-center">

                            <ShieldCheck className="w-5 h-5 text-purple-700" />

                          </div>

                          <div>

                            <h3 className="font-black text-slate-900">
                              Admin Portal
                            </h3>

                            <p className="text-[11px] text-slate-500">
                              Manage the KisanSetu ecosystem
                            </p>

                          </div>

                          <div className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[9px] font-black uppercase tracking-wide">

                            <Lock className="w-3 h-3" />

                            Admin Only

                          </div>

                        </div>

                        {/* ERROR */}

                        {error && (
                          <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                          </div>
                        )}

                        {successMessage && (
                          <div className="mb-5 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-start gap-2">
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

                            <label className="block text-[11px] font-black uppercase tracking-wide text-slate-600 mb-2">
                              Admin Email / Admin ID
                            </label>

                            <div className="relative group">

                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600 transition" />

                              <input
                                type="email"
                                required
                                value={adminEmail}
                                onChange={(e) =>
                                  setAdminEmail(e.target.value)
                                }
                                placeholder="admin@kisansetu.in"
                                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
                              />

                            </div>

                          </div>

                          {/* PASSWORD */}

                          <div>

                            <label className="block text-[11px] font-black uppercase tracking-wide text-slate-600 mb-2">
                              Admin Password
                            </label>

                            <div className="relative group">

                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600 transition" />

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
                                className="w-full pl-11 pr-12 py-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  setShowAdminPassword(
                                    (prev) => !prev,
                                  )
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700 transition"
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

                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">

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
                            className="group w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-purple-900/20 transition-all flex items-center justify-center gap-2"
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

                                <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}

                          </button>

                        </form>

                        {/* ADMIN REGISTRATION */}

                        <div className="relative my-7">

                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                          </div>

                          <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-[9px] font-black tracking-[0.2em] text-slate-400">
                              NEW ADMIN
                            </span>
                          </div>

                        </div>

                        <div className="group border border-purple-100 bg-gradient-to-br from-purple-50 to-white rounded-2xl p-4 hover:border-purple-300 transition-all">

                          <div className="flex items-center justify-between gap-4">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">

                                <ShieldCheck className="w-5 h-5 text-purple-700" />

                              </div>

                              <div>

                                <p className="text-xs font-black text-slate-800">
                                  Don&apos;t have an admin account?
                                </p>

                                <p className="text-[10px] text-slate-500 mt-1">
                                  Register for authorized access
                                </p>

                              </div>

                            </div>

                            <Link
                              to="/admin/register"
                              className="shrink-0 group/register flex items-center gap-1 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-[10px] font-black shadow-lg shadow-purple-700/15 transition"
                            >
                              Register
                              <ChevronRight className="w-3.5 h-3.5 group-hover/register:translate-x-0.5 transition" />
                            </Link>

                          </div>

                        </div>

                        {/* SECURITY */}

                        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">

                          <div className="flex items-start gap-3">

                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">

                              <ShieldCheck className="w-5 h-5 text-slate-700" />

                            </div>

                            <div>

                              <p className="text-xs font-black text-slate-800">
                                Restricted Admin Access
                              </p>

                              <p className="text-[10px] leading-relaxed text-slate-500 mt-1">
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

                  {/* =================================================
                      TRUST FOOTER
                  ================================================= */}

                  <div className="border-t border-slate-100 bg-slate-50/80 px-6 sm:px-8 py-4">

                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">

                      <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500">

                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />

                        Secure

                      </span>

                      <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500">

                        <Sprout className="w-3.5 h-3.5 text-emerald-600" />

                        Farmer First

                      </span>

                      <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500">

                        <Building2 className="w-3.5 h-3.5 text-slate-600" />

                        Government Ready

                      </span>

                      <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500">

                        <Globe className="w-3.5 h-3.5 text-blue-600" />

                        Accessible

                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </section>

          </div>

        </main>

        {/* ======================================================
            FOOTER
        ====================================================== */}

        <footer className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 pb-2 text-white/35">

          <p className="text-[10px]">
            © 2026 KisanSetu • Digital Agriculture Platform
          </p>

          <p className="text-[10px] flex items-center gap-1.5">

            <CheckCircle2 className="w-3 h-3 text-emerald-400" />

            Made with care for India&apos;s farmers

          </p>

        </footer>

      </div>
    </div>
  );
};

export default LoginPage;