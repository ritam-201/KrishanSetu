import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  Lock,
  UserRound,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
} from "lucide-react";

const AdminRegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your admin email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create admin account.");
      }

      setSuccess(
        `Admin account created successfully. Your Admin ID is ${data.admin.adminId}`,
      );

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      console.error(err);
      setError("Unable to create admin account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F7F8F1]">
      {/* Background */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-green-200/20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        {/* Header */}

        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-700 flex items-center justify-center shadow-lg shadow-purple-900/20">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>

            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#123D24]">
                KisanSetu
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Admin Registration
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            Secure Administrator Registration
          </div>
        </header>

        {/* Card */}

        <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[28px] shadow-[0_20px_70px_rgba(18,61,36,0.12)] overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Heading */}

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-700" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Create Admin Account
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Register for KisanSetu administrator access
                </p>
              </div>
            </div>

            {/* Error */}

            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Success */}

            {success && (
              <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {success}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name */}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition"
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Admin Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@kisansetu.in"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mt-2">
                  Password must contain at least 8 characters.
                </p>
              </div>

              {/* Confirm Password */}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-purple-900/15 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />

                    <span>Create Admin Account</span>

                    <ArrowRight className="w-4 h-4 text-purple-200" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-slate-400 font-medium">
                  ALREADY REGISTERED?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-600 text-purple-700 hover:bg-purple-700 hover:text-white text-xs font-bold transition"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Login
              </Link>
            </div>
          </div>

          {/* Security */}

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5">
            <div className="flex items-start gap-3 max-w-xl mx-auto">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-purple-700" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  Restricted Administrator Access
                </p>

                <p className="text-[11px] leading-relaxed text-slate-500 mt-1">
                  Admin accounts are intended only for authorized KisanSetu
                  administrators.
                </p>
              </div>
            </div>
          </div>
        </div>

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

export default AdminRegisterPage;
