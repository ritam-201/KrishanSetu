import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sprout,
  Menu,
  X,
  Bell,
  Globe,
  CheckCircle2,
  LogOut,
  Sparkles,
  User,
  Building2,
  Crown,
  ChevronRight,
  ChevronDown,
  Wheat,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { LanguageCode } from "../../types";

export const Navbar: React.FC = () => {
  const {
    user,
    role,
    isAuthenticated,
    language,
    setLanguage,
    switchRole,
    logout,
    notifications,
    markNotificationRead,
    t,
  } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  /* =========================================================
     LOGIN
  ========================================================== */

  const handleLogin = () => {
    setMobileMenuOpen(false);
    setRoleDropdownOpen(false);
    navigate("/login");
  };

  /* =========================================================
     LOGOUT
  ========================================================== */

  const handleLogout = () => {
    logout();

    setRoleDropdownOpen(false);
    setLangDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);

    navigate("/login");
  };

  /* =========================================================
     SCROLL EFFECT
  ========================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================================================
     CLOSE DROPDOWNS ON ROUTE CHANGE
  ========================================================== */

  useEffect(() => {
    setRoleDropdownOpen(false);
    setLangDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* =========================================================
     NOTIFICATIONS
  ========================================================== */

  const unreadNotifs = notifications.filter((n) => !n.read);

  /* =========================================================
     LANGUAGES
  ========================================================== */

  const langNames: Record<
    LanguageCode,
    {
      label: string;
      flag: string;
    }
  > = {
    en: {
      label: "English",
      flag: "EN",
    },
    bn: {
      label: "বাংলা",
      flag: "বাং",
    },
    hi: {
      label: "हिन्दी",
      flag: "हि",
    },
  };

  /* =========================================================
     NAVIGATION LINKS
  ========================================================== */

  const navLinks: {
    name: string;
    path: string;
    highlight?: boolean;
  }[] = [
    {
      name: t.navHome,
      path: "/",
    },
    {
      name: t.navSchedule,
      path: "/schedule",
    },
    {
      name: t.navQueue,
      path: "/queue",
    },
    {
      name: t.navStatus,
      path: "/status",
    },
    {
      name: t.navPayments,
      path: "/payments",
    },
    {
      name: "Weather",
      path: "/weather",
    },
    {
      name:
        role === "farmer"
          ? "Dashboard"
          : role === "officer"
          ? t.navOfficerPortal
          : t.navAdminPortal,
      path:
        role === "farmer"
          ? "/dashboard"
          : role === "officer"
          ? "/officer"
          : "/admin",
    },
  ];

  /* =========================================================
     ROLE LABEL
  ========================================================== */

  const roleLabel =
    role === "farmer"
      ? "Farmer"
      : role === "officer"
      ? "Mandi Officer"
      : "Administrator";

  /* =========================================================
     ROLE ICON
  ========================================================== */

  const RoleIcon = () => {
    if (role === "farmer") {
      return <Sprout className="h-3.5 w-3.5" />;
    }

    if (role === "officer") {
      return <Building2 className="h-3.5 w-3.5" />;
    }

    return <Crown className="h-3.5 w-3.5" />;
  };

  return (
    <>
      {/* =====================================================
          PREMIUM NAVBAR
      ====================================================== */}

      <header
        className={`
          sticky top-0 z-50 w-full
          transition-all duration-300
          ${
            isScrolled
              ? "border-b border-emerald-900/10 bg-[#f8fbf8]/90 shadow-[0_8px_35px_rgba(6,78,59,0.10)] backdrop-blur-2xl"
              : "border-b border-slate-200/70 bg-white/95 backdrop-blur-xl"
          }
        `}
      >
        {/* Very subtle top accent */}
        <div
          className="
            absolute left-0 right-0 top-0 h-0.5
            bg-linear-to-r
            from-emerald-400
            via-green-600
            to-emerald-400
          "
        />

        <div className="relative mx-auto w-full max-w-[1600px]">
          <div
            className={`
              flex items-center
              px-3 sm:px-5 lg:px-7
              transition-all duration-300
              ${isScrolled ? "h-17" : "h-18.5"}
            `}
          >
            {/* =================================================
                LOGO
            ================================================== */}

            <Link
              to="/"
              className="group flex shrink-0 items-center gap-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              {/* Logo icon */}
              <div
                className="
                  relative flex h-10 w-10
                  items-center justify-center
                  overflow-hidden rounded-xl
                  bg-linear-to-br
                  from-emerald-500
                  via-green-600
                  to-teal-700
                  shadow-[0_7px_20px_rgba(16,185,129,0.25)]
                  transition-all duration-300
                  group-hover:-translate-y-0.5
                  group-hover:shadow-[0_10px_28px_rgba(16,185,129,0.35)]
                "
              >
                <Sprout className="h-5.5 w-5.5 text-white" />

                <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent" />
              </div>

              {/* Brand text */}
              <div className="hidden sm:block">
                <div className="flex items-center gap-0.5">
                  <span className="text-[17px] font-black tracking-[-0.045em] text-slate-900">
                    KISAN
                  </span>

                  <span className="text-[17px] font-black tracking-[-0.045em] text-emerald-600">
                    SETU
                  </span>
                </div>

                <div className="-mt-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Smart Farmer Platform
                </div>
              </div>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================== */}

            <nav className="ml-5 hidden flex-1 items-center justify-center lg:flex">
              <div
                className="
                  flex items-center gap-0.5
                  rounded-2xl
                  border border-slate-200/80
                  bg-slate-100/70
                  p-1
                  shadow-inner
                "
              >
                {navLinks.map((link) => {
                  const isActive =
                    location.pathname === link.path ||
                    (link.path !== "/" &&
                      location.pathname.startsWith(link.path));

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`
                        group relative
                        flex items-center gap-1.5
                        rounded-xl
                        px-3 py-2
                        text-[12px]
                        font-semibold
                        transition-all duration-200
                        ${
                          isActive
                            ? `
                              bg-white
                              text-emerald-700
                              shadow-[0_3px_12px_rgba(15,23,42,0.08)]
                              ring-1 ring-slate-200/70
                            `
                            : `
                              text-slate-500
                              hover:bg-white/80
                              hover:text-slate-900
                            `
                        }
                      `}
                    >
                      {link.highlight && (
                        <Sparkles
                          className={`
                            h-3.5 w-3.5
                            ${
                              isActive
                                ? "text-emerald-500"
                                : "text-slate-400 group-hover:text-emerald-500"
                            }
                          `}
                        />
                      )}

                      <span>{link.name}</span>

                      {isActive && (
                        <span
                          className="
                            absolute
                            bottom-0.5
                            left-1/2
                            h-0.5
                            w-5
                            -translate-x-1/2
                            rounded-full
                            bg-emerald-500
                          "
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* =================================================
                RIGHT SIDE
            ================================================== */}

            <div className="ml-auto flex items-center gap-1.5">

              {/* =================================================
                  ROLE / PROFILE
              ================================================== */}

              {isAuthenticated && (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(!roleDropdownOpen);
                      setLangDropdownOpen(false);
                      setNotifDropdownOpen(false);
                    }}
                    className={`
                      group flex items-center gap-2
                      rounded-2xl
                      border
                      px-2.5 py-1.5
                      transition-all duration-200
                      ${
                        roleDropdownOpen
                          ? "border-emerald-200 bg-emerald-50/70 shadow-sm"
                          : "border-slate-200/80 bg-white/80 hover:border-emerald-200 hover:bg-emerald-50/40"
                      }
                    `}
                  >
                    {/* Avatar */}
                    <div
                      className="
                        flex h-8.5 w-8.5
                        items-center justify-center
                        rounded-xl
                        bg-linear-to-br
                        from-emerald-500
                        to-teal-600
                        text-xs font-black
                        text-white
                        shadow-[0_4px_12px_rgba(16,185,129,0.22)]
                      "
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    {/* User information */}
                    <div className="hidden xl:block text-left">
                      <p className="max-w-27.5 truncate text-[11px] font-bold text-slate-800">
                        {user?.name || "User"}
                      </p>

                      <div className="flex items-center gap-1 text-[9px] font-semibold text-emerald-600">
                        <RoleIcon />
                        {roleLabel}
                      </div>
                    </div>

                    <ChevronDown
                      className={`
                        h-3.5 w-3.5 text-slate-400
                        transition-transform duration-200
                        ${
                          roleDropdownOpen
                            ? "rotate-180 text-emerald-600"
                            : ""
                        }
                      `}
                    />
                  </button>

                  {/* =================================================
                      ACCOUNT DROPDOWN
                  ================================================== */}

                  {roleDropdownOpen && (
                    <div
                      className="
                        absolute right-0 top-[calc(100%+10px)]
                        w-82.5
                        max-h-[calc(100vh-90px)]
                        overflow-y-auto
                        overflow-x-hidden
                        rounded-3xl
                        border border-slate-200/80
                        bg-white/95
                        shadow-[0_25px_70px_rgba(15,23,42,0.16)]
                        backdrop-blur-2xl
                      "
                    >
                      {/* Profile Header */}
                      <div className="relative overflow-hidden bg-linear-to-br from-emerald-950 via-green-900 to-teal-900 p-5 text-white">
                        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />

                        <div className="relative flex items-center gap-3">
                          <div
                            className="
                              flex h-12 w-12 shrink-0
                              items-center justify-center
                              rounded-2xl
                              bg-linear-to-br
                              from-emerald-400
                              to-teal-500
                              text-lg font-black
                              shadow-lg
                            "
                          >
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">
                              {user?.name || "User"}
                            </p>

                            <p className="mt-0.5 truncate text-[10px] text-emerald-100/70">
                              {user?.village || "Farmer Account"}
                              {user?.district
                                ? `, ${user.district}`
                                : ""}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 rounded-full border border-emerald-300/20 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-200">
                            <RoleIcon />
                            {roleLabel}
                          </div>
                        </div>

                        {user?.primaryCrop && (
                          <div
                            className="
                              relative mt-4 flex items-center gap-2
                              rounded-xl
                              border border-white/10
                              bg-white/10
                              px-3 py-2.5
                              backdrop-blur-md
                            "
                          >
                            <Wheat className="h-4 w-4 text-amber-300" />

                            <span className="text-[10px] text-emerald-100/60">
                              Primary Crop
                            </span>

                            <span className="ml-auto text-[10px] font-bold text-white">
                              {user.primaryCrop}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-100" />

                      {/* Role Switcher */}
                      <div className="p-3">
                        <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          Switch Role
                        </p>

                        {/* Farmer */}
                        <button
                          onClick={() => {
                            switchRole("farmer");
                            setRoleDropdownOpen(false);
                            navigate("/dashboard");
                          }}
                          className={`
                            flex w-full items-center gap-3
                            rounded-2xl
                            px-3 py-2.5
                            text-left
                            transition-all
                            ${
                              role === "farmer"
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-slate-600 hover:bg-slate-50"
                            }
                          `}
                        >
                          <div
                            className={`
                              flex h-9 w-9 items-center justify-center rounded-xl
                              ${
                                role === "farmer"
                                  ? "bg-emerald-100"
                                  : "bg-slate-100"
                              }
                            `}
                          >
                            <Sprout className="h-4 w-4" />
                          </div>

                          <div className="flex-1">
                            <p className="text-xs font-bold">Farmer</p>

                            <p className="text-[9px] text-slate-400">
                              Manage your farm
                            </p>
                          </div>

                          {role === "farmer" && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          )}
                        </button>

                        {/* Officer */}
                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            navigate("/login");
                          }}
                          className="
                            mt-1 flex w-full items-center gap-3
                            rounded-2xl
                            px-3 py-2.5
                            text-left
                            text-slate-600
                            transition-all
                            hover:bg-blue-50
                            hover:text-blue-700
                          "
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                            <Building2 className="h-4 w-4" />
                          </div>

                          <div className="flex-1">
                            <p className="text-xs font-bold">
                              Mandi Officer
                            </p>

                            <p className="text-[9px] text-slate-400">
                              Login required for officer access
                            </p>
                          </div>

                          <ChevronRight className="h-4 w-4 text-slate-300" />
                        </button>

                        {/* Admin */}
                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            navigate("/login");
                          }}
                          className="
                            mt-1 flex w-full items-center gap-3
                            rounded-2xl
                            px-3 py-2.5
                            text-left
                            text-slate-600
                            transition-all
                            hover:bg-purple-50
                            hover:text-purple-700
                          "
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                            <Crown className="h-4 w-4" />
                          </div>

                          <div className="flex-1">
                            <p className="text-xs font-bold">
                              Admin Console
                            </p>

                            <p className="text-[9px] text-slate-400">
                              Login required for admin access
                            </p>
                          </div>

                          <ChevronRight className="h-4 w-4 text-slate-300" />
                        </button>
                      </div>

                      {/* Account Actions */}
                      <div className="border-t border-slate-100 p-3">
                        {/* Profile */}
                        <Link
                          to="/profile"
                          onClick={() => setRoleDropdownOpen(false)}
                          className="
                            flex items-center gap-3
                            rounded-2xl
                            px-3 py-2.5
                            text-slate-600
                            transition-colors
                            hover:bg-slate-50
                            hover:text-slate-900
                          "
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                            <User className="h-4 w-4" />
                          </div>

                          <div className="flex-1">
                            <p className="text-xs font-bold">Profile</p>
                            <p className="text-[9px] text-slate-400">
                              View your account
                            </p>
                          </div>

                          <ChevronRight className="h-4 w-4 text-slate-300" />
                        </Link>

                        {/* Farm Registration */}
                        <Link
                          to="/register"
                          onClick={() => setRoleDropdownOpen(false)}
                          className="
                            mt-1 flex items-center gap-3
                            rounded-2xl
                            px-3 py-2.5
                            text-slate-600
                            transition-colors
                            hover:bg-slate-50
                            hover:text-slate-900
                          "
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                            <Wheat className="h-4 w-4" />
                          </div>

                          <div className="flex-1">
                            <p className="text-xs font-bold">
                              Register Farm & Crop Details
                            </p>

                            <p className="text-[9px] text-slate-400">
                              Update your farm information
                            </p>
                          </div>

                          <ChevronRight className="h-4 w-4 text-slate-300" />
                        </Link>

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="
                            mt-2 flex w-full items-center gap-3
                            rounded-2xl
                            border border-red-100
                            bg-red-50/60
                            px-3 py-2.5
                            text-left
                            text-red-600
                            transition-all
                            hover:border-red-200
                            hover:bg-red-50
                          "
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100">
                            <LogOut className="h-4 w-4" />
                          </div>

                          <div className="flex-1">
                            <p className="text-xs font-bold">
                              Logout Account
                            </p>

                            <p className="text-[9px] text-red-400">
                              Sign out securely
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =================================================
                  LANGUAGE
              ================================================== */}

              <div className="relative hidden sm:block">
                <button
                  onClick={() => {
                    setLangDropdownOpen(!langDropdownOpen);
                    setRoleDropdownOpen(false);
                    setNotifDropdownOpen(false);
                  }}
                  className={`
                    flex items-center gap-1.5
                    rounded-xl
                    border
                    px-2.5 py-2
                    transition-all
                    ${
                      langDropdownOpen
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                    }
                  `}
                >
                  <Globe className="h-4 w-4" />

                  <span className="hidden xl:block text-[10px] font-bold">
                    {langNames[language].flag}
                  </span>

                  <ChevronDown className="h-3 w-3" />
                </button>

                {langDropdownOpen && (
                  <div
                    className="
                      absolute right-0 top-[calc(100%+10px)]
                      w-44
                      overflow-hidden
                      rounded-2xl
                      border border-slate-200
                      bg-white/95
                      p-1.5
                      shadow-[0_20px_55px_rgba(15,23,42,0.14)]
                      backdrop-blur-xl
                    "
                  >
                    {(Object.keys(langNames) as LanguageCode[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setLangDropdownOpen(false);
                        }}
                        className={`
                          flex w-full items-center gap-3
                          rounded-xl
                          px-3 py-2.5
                          text-left
                          transition-colors
                          ${
                            language === lang
                              ? "bg-emerald-50 text-emerald-700"
                              : "text-slate-600 hover:bg-slate-50"
                          }
                        `}
                      >
                        <span className="w-8 text-xs font-bold">
                          {langNames[lang].flag}
                        </span>

                        <span className="text-xs font-semibold">
                          {langNames[lang].label}
                        </span>

                        {language === lang && (
                          <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* =================================================
                  NOTIFICATIONS
              ================================================== */}

              {isAuthenticated && (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setRoleDropdownOpen(false);
                      setLangDropdownOpen(false);
                    }}
                    className={`
                      relative flex h-10 w-10
                      items-center justify-center
                      rounded-xl
                      border
                      transition-all
                      ${
                        notifDropdownOpen
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                      }
                    `}
                  >
                    <Bell className="h-4.5 w-4.5" />

                    {unreadNotifs.length > 0 && (
                      <span
                        className="
                          absolute right-1 top-1
                          flex h-4 min-w-4
                          items-center justify-center
                          rounded-full
                          border-2 border-white
                          bg-emerald-500
                          px-0.5
                          text-[7px]
                          font-black
                          text-white
                          shadow-sm
                        "
                      >
                        {unreadNotifs.length > 9
                          ? "9+"
                          : unreadNotifs.length}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notifDropdownOpen && (
                    <div
                      className="
                        absolute right-0 top-[calc(100%+10px)]
                        w-80
                        overflow-hidden
                        rounded-3xl
                        border border-slate-200
                        bg-white/95
                        shadow-[0_25px_70px_rgba(15,23,42,0.16)]
                        backdrop-blur-xl
                      "
                    >
                      <div className="border-b border-slate-100 bg-linear-to-r from-emerald-50/70 to-white px-5 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">
                              Notifications
                            </h3>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {unreadNotifs.length} unread
                            </p>
                          </div>

                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100">
                            <Bell className="h-4 w-4 text-emerald-600" />
                          </div>
                        </div>
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-5 py-8 text-center">
                            <Bell className="mx-auto h-7 w-7 text-slate-300" />

                            <p className="mt-2 text-xs font-semibold text-slate-500">
                              No notifications
                            </p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() =>
                                markNotificationRead(notification.id)
                              }
                              className={`
                                flex w-full gap-3
                                border-b border-slate-50
                                px-5 py-3.5
                                text-left
                                transition-colors
                                hover:bg-slate-50
                                ${
                                  !notification.read
                                    ? "bg-emerald-50/30"
                                    : ""
                                }
                              `}
                            >
                              <div
                                className={`
                                  mt-0.5 flex h-8 w-8 shrink-0
                                  items-center justify-center
                                  rounded-xl
                                  ${
                                    !notification.read
                                      ? "bg-emerald-100 text-emerald-600"
                                      : "bg-slate-100 text-slate-400"
                                  }
                                `}
                              >
                                <Bell className="h-3.5 w-3.5" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p
                                  className={`
                                    text-xs
                                    ${
                                      !notification.read
                                        ? "font-bold text-slate-800"
                                        : "font-medium text-slate-600"
                                    }
                                  `}
                                >
                                  {notification.title}
                                </p>

                                <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                                  {notification.message}
                                </p>
                              </div>

                              {!notification.read && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =================================================
                  LOGIN / LOGOUT
              ================================================== */}

              {!isAuthenticated ? (
                <>
                  <button
                    onClick={handleLogin}
                    className="
                      hidden sm:inline-flex
                      items-center justify-center
                      rounded-xl
                      border border-slate-200
                      bg-white/80
                      px-3.5 py-2.5
                      text-[11px] font-bold
                      text-slate-700
                      transition-all
                      hover:border-emerald-200
                      hover:bg-emerald-50
                      hover:text-emerald-700
                    "
                  >
                    Login
                  </button>

                  <Link
                    to="/register"
                    className="
                      hidden md:inline-flex
                      items-center gap-1.5
                      rounded-xl
                      bg-linear-to-r
                      from-emerald-600
                      to-green-700
                      px-3.5 py-2.5
                      text-[11px] font-bold
                      text-white
                      shadow-[0_6px_18px_rgba(16,185,129,0.20)]
                      transition-all
                      hover:-translate-y-0.5
                      hover:shadow-[0_9px_24px_rgba(16,185,129,0.28)]
                    "
                  >
                    <Sprout className="h-3.5 w-3.5" />
                    Get Started
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="
                    hidden sm:inline-flex
                    items-center gap-1.5
                    rounded-xl
                    border border-red-100
                    bg-red-50/80
                    px-3 py-2.5
                    text-[11px] font-bold
                    text-red-600
                    transition-all
                    hover:border-red-200
                    hover:bg-red-100
                  "
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              )}

              {/* =================================================
                  MOBILE MENU BUTTON
              ================================================== */}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border border-slate-200
                  bg-white
                  text-slate-700
                  shadow-sm
                  transition-all
                  hover:border-emerald-200
                  hover:bg-emerald-50
                  hover:text-emerald-700
                  lg:hidden
                "
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* =====================================================
              MOBILE MENU
          ====================================================== */}

          {mobileMenuOpen && (
            <div
              className="
                border-t border-emerald-900/10
                bg-white/95
                shadow-[0_20px_40px_rgba(15,23,42,0.08)]
                backdrop-blur-2xl
                lg:hidden
              "
            >
              <div className="max-h-[calc(100vh-74px)] overflow-y-auto px-4 py-4">

                {/* Mobile User */}
                {isAuthenticated && (
                  <div
                    className="
                      relative mb-4 overflow-hidden
                      rounded-2xl
                      bg-linear-to-br
                      from-emerald-950
                      via-green-900
                      to-teal-900
                      p-4
                      text-white
                    "
                  >
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />

                    <div className="relative flex items-center gap-3">
                      <div
                        className="
                          flex h-11 w-11
                          items-center justify-center
                          rounded-xl
                          bg-linear-to-br
                          from-emerald-400
                          to-teal-500
                          text-sm font-black
                        "
                      >
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                          {user?.name || "User"}
                        </p>

                        <div className="mt-0.5 flex items-center gap-1 text-[9px] font-semibold text-emerald-200">
                          <RoleIcon />
                          {roleLabel}
                        </div>
                      </div>

                      <ShieldCheck className="h-5 w-5 text-emerald-300" />
                    </div>
                  </div>
                )}

                {/* Mobile Navigation */}
                <nav className="space-y-1">
                  {navLinks.map((link) => {
                    const isActive =
                      location.pathname === link.path ||
                      (link.path !== "/" &&
                        location.pathname.startsWith(link.path));

                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-3
                          rounded-xl
                          px-4 py-3
                          text-sm font-semibold
                          transition-all
                          ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 shadow-sm"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }
                        `}
                      >
                        {link.highlight ? (
                          <Sparkles className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <span
                            className={`
                              h-1.5 w-1.5 rounded-full
                              ${
                                isActive
                                  ? "bg-emerald-500"
                                  : "bg-slate-300"
                              }
                            `}
                          />
                        )}

                        {link.name}

                        {isActive && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Account */}
                {isAuthenticated && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Account
                    </p>

                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="
                        flex items-center gap-3
                        rounded-xl
                        px-4 py-3
                        text-sm font-semibold
                        text-slate-600
                        hover:bg-slate-50
                      "
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="
                        flex items-center gap-3
                        rounded-xl
                        px-4 py-3
                        text-sm font-semibold
                        text-slate-600
                        hover:bg-slate-50
                      "
                    >
                      <Wheat className="h-4 w-4" />
                      Register Farm & Crop Details
                    </Link>
                  </div>
                )}

                {/* Mobile Role Switcher */}
                {isAuthenticated && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Switch Role
                    </p>

                    <div className="grid grid-cols-3 gap-2">

                      {/* Farmer */}
                      <button
                        onClick={() => {
                          switchRole("farmer");
                          setMobileMenuOpen(false);
                          navigate("/dashboard");
                        }}
                        className={`
                          flex flex-col items-center gap-2
                          rounded-xl
                          border
                          px-2 py-3
                          text-center
                          transition-all
                          ${
                            role === "farmer"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-white text-slate-500"
                          }
                        `}
                      >
                        <Sprout className="h-4 w-4" />
                        <span className="text-[10px] font-bold">
                          Farmer
                        </span>
                      </button>

                      {/* Officer */}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate("/login");
                        }}
                        className="
                          flex flex-col items-center gap-2
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          px-2 py-3
                          text-center
                          text-slate-500
                          transition-all
                          hover:border-blue-200
                          hover:bg-blue-50
                          hover:text-blue-700
                        "
                      >
                        <Building2 className="h-4 w-4" />

                        <span className="text-[10px] font-bold">
                          Officer
                        </span>
                      </button>

                      {/* Admin */}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate("/login");
                        }}
                        className="
                          flex flex-col items-center gap-2
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          px-2 py-3
                          text-center
                          text-slate-500
                          transition-all
                          hover:border-purple-200
                          hover:bg-purple-50
                          hover:text-purple-700
                        "
                      >
                        <Crown className="h-4 w-4" />

                        <span className="text-[10px] font-bold">
                          Admin
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Mobile Login / Logout */}
                <div className="mt-4 border-t border-slate-100 pt-4">
                  {!isAuthenticated ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleLogin}
                        className="
                          rounded-xl
                          border border-slate-200
                          bg-white
                          px-4 py-3
                          text-sm font-bold
                          text-slate-700
                        "
                      >
                        Login
                      </button>

                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="
                          flex items-center justify-center gap-2
                          rounded-xl
                          bg-linear-to-r
                          from-emerald-600
                          to-green-700
                          px-4 py-3
                          text-sm font-bold
                          text-white
                        "
                      >
                        <Sprout className="h-4 w-4" />
                        Get Started
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="
                        flex w-full
                        items-center justify-center gap-2
                        rounded-xl
                        border border-red-100
                        bg-red-50
                        px-4 py-3
                        text-sm font-bold
                        text-red-600
                      "
                    >
                      <LogOut className="h-4 w-4" />
                      Logout Account
                    </button>
                  )}
                </div>

                {/* Mobile Language */}
                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                  {(Object.keys(langNames) as LanguageCode[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`
                        flex-1 rounded-xl
                        border px-3 py-2.5
                        text-xs font-bold
                        transition-all
                        ${
                          language === lang
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-500"
                        }
                      `}
                    >
                      {langNames[lang].flag}
                    </button>
                  ))}
                </div>

              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};