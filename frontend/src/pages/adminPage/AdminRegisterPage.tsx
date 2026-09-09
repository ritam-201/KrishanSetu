import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

const AdminRegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "State Agricultural Marketing Board",
    designation: "Administrator",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adminId, setAdminId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const passwordRules = useMemo(
    () => ({
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /\d/.test(formData.password),
      special: /[!@#$%^&*(),.?":{}|<>_\-\\[\]/;'`~+=]/.test(formData.password),
    }),
    [formData.password],
  );

  const passwordScore = Object.values(passwordRules).filter(Boolean).length;

  const passwordStrength =
    passwordScore <= 2 ? "Weak" : passwordScore <= 4 ? "Medium" : "Strong";

  const passwordStrengthWidth =
    passwordScore === 0
      ? "0%"
      : passwordScore === 1
        ? "20%"
        : passwordScore === 2
          ? "40%"
          : passwordScore === 3
            ? "60%"
            : passwordScore === 4
              ? "80%"
              : "100%";

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Please enter the administrator's full name.");
      return false;
    }

    if (formData.fullName.trim().length < 3) {
      setError("Full name must contain at least 3 characters.");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Please enter the admin email address.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!formData.phone.trim()) {
      setError("Please enter a phone number.");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return false;
    }

    if (passwordScore < 3) {
      setError(
        "Please create a stronger password using uppercase, lowercase, numbers or special characters.",
      );
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (!agreeTerms) {
      setError(
        "Please confirm that you are authorized to create an administrator account.",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          department: formData.department,
          designation: formData.designation,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      let data: any = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create administrator account.",
        );
      }

      const generatedAdminId = data.admin?.adminId || "";

      setAdminId(generatedAdminId);
      setSuccess(data.message || "Administrator account created successfully.");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        department: "State Agricultural Marketing Board",
        designation: "Administrator",
        password: "",
        confirmPassword: "",
      });

      setAgreeTerms(false);

      setTimeout(() => {
        navigate("/login");
      }, 3500);
    } catch (err: any) {
      setError(
        err?.message ||
          "Something went wrong while creating the administrator account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900">
      {/* Background */}
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900" />

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
            {/* LEFT PANEL */}
            <div className="relative hidden overflow-hidden bg-linear-to-br from-emerald-700 via-emerald-800 to-teal-950 p-10 text-white lg:block">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-emerald-300/10 blur-2xl" />

              <div className="relative z-10 flex h-full flex-col">
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
                    <ShieldCheck className="h-7 w-7" />
                  </div>

                  <div>
                    <h1 className="text-xl font-bold tracking-tight">
                      KisanSetu
                    </h1>
                    <p className="text-xs text-emerald-100">
                      Smart Agriculture Platform
                    </p>
                  </div>
                </div>

                {/* Main content */}
                <div className="mt-20">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                    <Shield className="h-4 w-4" />
                    Restricted Administrator Access
                  </div>

                  <h2 className="max-w-md text-4xl font-bold leading-tight">
                    Build a secure and connected agricultural ecosystem.
                  </h2>

                  <p className="mt-5 max-w-md text-sm leading-7 text-emerald-50/80">
                    Create an administrator account to securely manage farmers,
                    mandis, procurement operations, bookings, payments and
                    platform activities.
                  </p>
                </div>

                {/* Features */}
                <div className="mt-10 space-y-4">
                  {[
                    {
                      icon: ShieldCheck,
                      title: "Secure administration",
                      text: "Protected access for authorized administrators.",
                    },
                    {
                      icon: Users,
                      title: "Manage farmer operations",
                      text: "Monitor farmers, bookings and mandi activities.",
                    },
                    {
                      icon: KeyRound,
                      title: "Account protection",
                      text: "Strong password requirements keep accounts safer.",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-emerald-100/70">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-auto pt-10 text-xs text-emerald-100/50">
                  © {new Date().getFullYear()} KisanSetu · Administrator Portal
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="bg-white px-6 py-8 sm:px-10 lg:px-12">
              {/* Header */}
              <div className="mb-8">
                <div className="mb-5 flex items-center justify-between">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Link>

                  <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Admin Only
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Create Admin Account
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Register a new authorized administrator for the KisanSetu
                    platform.
                  </p>
                </div>
              </div>

              {/* Success */}
              {success && (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                    <div>
                      <p className="text-sm font-semibold text-emerald-800">
                        Registration successful
                      </p>

                      <p className="mt-1 text-sm text-emerald-700">{success}</p>

                      {adminId && (
                        <div className="mt-3 rounded-xl bg-white px-4 py-3">
                          <p className="text-xs font-medium text-slate-500">
                            Generated Admin ID
                          </p>

                          <p className="mt-1 font-mono text-lg font-bold tracking-wider text-emerald-700">
                            {adminId}
                          </p>
                        </div>
                      )}

                      <p className="mt-3 text-xs text-emerald-600">
                        Redirecting you to the login page...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal information */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                      <UserRound className="h-4 w-4 text-emerald-700" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Administrator Information
                      </h3>
                      <p className="text-xs text-slate-500">
                        Basic account details
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Full name */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="fullName"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Full Name
                      </label>

                      <div className="relative">
                        <UserRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter administrator full name"
                          autoComplete="name"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Admin Email
                      </label>

                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="admin@kisansetu.in"
                          autoComplete="email"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Phone Number
                      </label>

                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                          autoComplete="tel"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                      <Building2 className="h-4 w-4 text-indigo-600" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Organization Details
                      </h3>
                      <p className="text-xs text-slate-500">
                        Administrative role information
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="department"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Department
                      </label>

                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      >
                        <option>State Agricultural Marketing Board</option>
                        <option>District Agriculture Department</option>
                        <option>Mandi Administration</option>
                        <option>Procurement Department</option>
                        <option>Platform Operations</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="designation"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Designation
                      </label>

                      <select
                        id="designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      >
                        <option>Administrator</option>
                        <option>Senior Administrator</option>
                        <option>Operations Manager</option>
                        <option>Mandi Officer</option>
                        <option>System Manager</option>
                        <option>Staff Manager</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                      <Lock className="h-4 w-4 text-purple-600" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Account Security
                      </h3>
                      <p className="text-xs text-slate-500">
                        Create secure administrator credentials
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Password
                      </label>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a strong password"
                          autoComplete="new-password"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      {/* Password strength */}
                      {formData.password && (
                        <div className="mt-3">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              Password strength
                            </span>

                            <span className="text-xs font-semibold text-slate-700">
                              {passwordStrength}
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                              style={{
                                width: passwordStrengthWidth,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Confirm Password
                      </label>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      {formData.confirmPassword && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs">
                          {formData.password === formData.confirmPassword ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600">
                                Passwords match
                              </span>
                            </>
                          ) : (
                            <span className="text-red-500">
                              Passwords do not match
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password requirements */}
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-xs font-semibold text-slate-700">
                      Password requirements
                    </p>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        ["At least 8 characters", passwordRules.length],
                        ["One uppercase letter", passwordRules.uppercase],
                        ["One lowercase letter", passwordRules.lowercase],
                        ["One number", passwordRules.number],
                        ["One special character", passwordRules.special],
                      ].map(([text, valid]) => (
                        <div
                          key={String(text)}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full ${
                              valid
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            <Check className="h-2.5 w-2.5" />
                          </span>

                          <span
                            className={
                              valid ? "text-emerald-700" : "text-slate-500"
                            }
                          >
                            {String(text)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Authorization */}
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-200">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      setError("");
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />

                  <span className="text-xs leading-5 text-slate-600">
                    I confirm that I am authorized to create an administrator
                    account for KisanSetu and understand that administrator
                    access is restricted to authorized personnel.
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !!success}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating Administrator Account...
                    </>
                  ) : (
                    <>
                      Create Admin Account
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Login */}
                <p className="text-center text-sm text-slate-500">
                  Already have an administrator account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
