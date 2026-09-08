import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { LanguageCode } from '../../types';
// import NotificationBar from '././NotificationBar';
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

  /* =========================
     LOGIN
  ========================= */

  const handleLogin = () => {
    setMobileMenuOpen(false);
    setRoleDropdownOpen(false);
    navigate('/login');
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    logout();

    setRoleDropdownOpen(false);
    setLangDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);

    navigate('/login');
  };

  /* =========================
     SCROLL EFFECT
  ========================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* =========================
     CLOSE DROPDOWNS ON ROUTE
  ========================= */

  useEffect(() => {
    setRoleDropdownOpen(false);
    setLangDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* =========================
     NOTIFICATIONS
  ========================= */

  const unreadNotifs = notifications.filter((n) => !n.read);

  /* =========================
     LANGUAGES
  ========================= */

  const langNames: Record<
    LanguageCode,
    {
      label: string;
      flag: string;
    }
  > = {
    en: {
      label: 'English',
      flag: 'EN',
    },
    bn: {
      label: 'বাংলা',
      flag: 'বাং',
    },
    hi: {
      label: 'हिन्दी',
      flag: 'हि',
    },
  };

  /* =========================
     NAVIGATION LINKS
  ========================= */

  const navLinks = [
    {
      name: t.navHome,
      path: '/',
    },
    {
      name: t.navSchedule,
      path: '/schedule',
    },
    {
      name: t.navQueue,
      path: '/queue',
    },
    {
      name: t.navStatus,
      path: '/status',
    },
    {
      name: t.navPayments,
      path: '/payments',
    },
    {
      name: 'Weather',
      path: '/weather',
    },
    {
      name:
        role === 'farmer'
          ? 'Dashboard'
          : role === 'officer'
            ? t.navOfficerPortal
            : t.navAdminPortal,
      path:
        role === 'farmer'
          ? '/dashboard'
          : role === 'officer'
            ? '/officer'
            : '/admin',
    },
  ];

  /* =========================
     ROLE LABEL
  ========================= */

  const roleLabel =
    role === 'farmer'
      ? 'Farmer'
      : role === 'officer'
        ? 'Mandi Officer'
        : 'Administrator';

  /* =========================
     ROLE ICON
  ========================= */

  const RoleIcon = () => {
    if (role === 'farmer') {
      return <Sprout className="h-4 w-4" />;
    }

    if (role === 'officer') {
      return <Building2 className="h-4 w-4" />;
    }

    return <Crown className="h-4 w-4" />;
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header
        className={`
          sticky top-0 z-50
          w-full
          border-b
          transition-all duration-300
          ${
            isScrolled
              ? 'border-slate-200/80 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl'
              : 'border-slate-200/60 bg-white'
          }
        `}
      >
        <div className="w-full">
          <div
            className="
              flex h-19 items-center
              pl-3 pr-4 sm:pl-4 sm:pr-6 lg:pl-5 lg:pr-8
              transition-all duration-300
            "
          >
            {/* =================================================
                LOGO
            ================================================== */}

            <Link
              to="/"
              className="group flex shrink-0 items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div
                className="
                  relative flex h-11 w-11
                  items-center justify-center
                  overflow-hidden rounded-2xl
                  bg-linear-to-br from-emerald-500 via-green-600 to-teal-700
                  shadow-[0_8px_20px_rgba(16,185,129,0.28)]
                  transition-all duration-300
                  group-hover:scale-105
                  group-hover:shadow-[0_10px_25px_rgba(16,185,129,0.38)]
                "
              >
                <Sprout className="h-6 w-6 text-white" />

                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <div className="hidden sm:block">
                <div className="flex items-center gap-1">
                  <span className="text-[18px] font-black tracking-[-0.04em] text-slate-900">
                    KISAN
                  </span>

                  <span className="text-[18px] font-black tracking-[-0.04em] text-emerald-600">
                    SETU
                  </span>
                </div>

                <div className="-mt-0.5 text-[9px] font-semibold uppercase tracking-[0.19em] text-slate-400">
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
                  flex items-center gap-1
                  rounded-2xl
                  border border-slate-200/70
                  bg-slate-50/80
                  p-1
                "
              >
                {navLinks.map((link) => {
                  const isActive =
                    location.pathname === link.path ||
                    (link.path !== '/' &&
                      location.pathname.startsWith(link.path));

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`
                        group relative
                        flex items-center gap-1.5
                        rounded-xl
                        px-3 py-2.5
                        text-[13px]
                        font-semibold
                        transition-all duration-200
                        ${
                          isActive
                            ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200/70'
                            : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                        }
                      `}
                    >
                      {link.highlight && (
                        <Sparkles
                          className={`
                            h-3.5 w-3.5
                            ${
                              isActive
                                ? 'text-emerald-500'
                                : 'text-slate-400 group-hover:text-emerald-500'
                            }
                          `}
                        />
                      )}

                      <span>{link.name}</span>

                      {isActive && (
                        <span className="absolute bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-emerald-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* =================================================
                RIGHT SIDE
            ================================================== */}

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">

              {/* =================================================
                  ROLE / ACCOUNT DROPDOWN
              ================================================== */}

              {isAuthenticated && (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(!roleDropdownOpen);
                      setLangDropdownOpen(false);
                      setNotifDropdownOpen(false);
                    }}
                    className="
                      group flex items-center gap-2
                      rounded-2xl
                      border border-slate-200
                      bg-white
                      px-3 py-2
                      transition-all duration-200
                      hover:border-emerald-200
                      hover:bg-emerald-50/40
                      hover:shadow-sm
                    "
                  >
                    <div
                      className="
                        flex h-9 w-9 items-center justify-center
                        rounded-xl
                        bg-linear-to-br
                        from-emerald-500
                        to-teal-600
                        text-sm font-bold text-white
                        shadow-sm
                      "
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <div className="hidden xl:block text-left">
                      <p className="max-w-27.5 truncate text-[12px] font-bold text-slate-800">
                        {user?.name || 'User'}
                      </p>

                      {/* Current logged-in role */}
                      <p className="text-[10px] font-medium text-slate-400">
                        {roleLabel}
                      </p>
                    </div>

                    <ChevronDown
                      className={`
                        h-4 w-4 text-slate-400
                        transition-transform duration-200
                        ${
                          roleDropdownOpen
                            ? 'rotate-180 text-emerald-600'
                            : ''
                        }
                      `}
                    />
                  </button>

                  {/* =================================================
                      ACCOUNT DROPDOWN
                  ================================================== */}

                  {roleDropdownOpen && (
                 <div className="
    absolute right-0 top-[calc(100%+12px)]
    w-82.5
    max-h-[calc(100vh-90px)]
    overflow-y-auto
    overflow-x-hidden
    rounded-3xl
    border border-slate-200
    bg-white
    shadow-[0_20px_60px_rgba(15,23,42,0.14)]
  "
>
                      {/* Profile Header */}

                      <div className="bg-linear-to-br from-slate-50 to-white p-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              flex h-12 w-12 shrink-0
                              items-center justify-center
                              rounded-2xl
                              bg-linear-to-br
                              from-emerald-500
                              to-teal-600
                              text-lg font-black text-white
                              shadow-[0_8px_18px_rgba(16,185,129,0.25)]
                            "
                          >
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {user?.name || 'User'}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {user?.village || 'Farmer Account'}
                              {user?.district
                                ? `, ${user.district}`
                                : ''}
                            </p>
                          </div>

                          <div
                            className="
                              rounded-full
                              bg-linear-to-br from-emerald-50 to-emerald-100
                              px-2.5 py-1
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-wide
                              text-emerald-700
                            "
                          >
                            {roleLabel}
                          </div>
                        </div>

                        {user?.primaryCrop && (
                          <div
                            className="
                              mt-4 flex items-center gap-2
                              rounded-xl
                              border border-slate-200/80
                              bg-linear-to-br from-white to-slate-100
                              px-3 py-2.5
                            "
                          >
                            <Wheat className="h-4 w-4 text-amber-500" />

                            <span className="text-[11px] font-medium text-slate-500">
                              Primary Crop
                            </span>

                            <span className="ml-auto text-[11px] font-bold text-slate-800">
                              {user.primaryCrop}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-100" />

                      {/* =================================================
                          ROLE SWITCHER
                      ================================================== */}

                      <div className="p-3">
                        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          Switch Role
                        </p>

                        {/* =================================================
                            FARMER
                        ================================================== */}

                        <button
                          onClick={() => {
                            switchRole('farmer');
                            setRoleDropdownOpen(false);
                            navigate('/dashboard');
                          }}
                          className={`
                            flex w-full items-center gap-3
                            rounded-2xl
                            px-3 py-3
                            text-left
                            transition-all
                            ${
                              role === 'farmer'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'text-slate-600 hover:bg-slate-50'
                            }
                          `}
                        >
                          <div
                            className={`
                              flex h-9 w-9 items-center justify-center
                              rounded-xl
                              ${
                                role === 'farmer'
                                  ? 'bg-emerald-100'
                                  : 'bg-slate-100'
                              }
                            `}
                          >
                            <Sprout className="h-4 w-4" />
                          </div>

                          <div className="flex-1">
                            <p className="text-xs font-bold">
                              Farmer
                            </p>

                            <p className="text-[10px] text-slate-400">
                              Manage your farm
                            </p>
                          </div>

                          {role === 'farmer' && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          )}
                        </button>

                        {/* =================================================
                            MANDI OFFICER
                            IMPORTANT:
                            Farmer click করলে LOGIN PAGE আসবে.
                            Farmer role change হবে না.
                        ================================================== */}

                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            navigate('/login');
                          }}
                          className="
                            mt-1 flex w-full items-center gap-3
                            rounded-2xl
                            px-3 py-3
                            text-left
                            text-slate-600
                            transition-all
                            hover:bg-blue-50
                            hover:text-blue-700
                          "
                        >
                          <div
                            className="
                              flex h-9 w-9 items-center justify-center
                              rounded-xl
                              bg-slate-100
                            "
                          >
                            <Building2 className="h-4 w-4" />
                          </div>

                          <div className="flex-1">
                            <p className="text-xs font-bold">
                              Mandi Officer
                            </p>

                            <p className="text-[10px] text-slate-400">
                              Login required for officer access
                            </p>
                          </div>

                          <ChevronRight className="h-4 w-4 text-slate-300" />
                        </button>

                        {/* =================================================
                            ADMIN
                            IMPORTANT:
                            Farmer click করলে LOGIN PAGE আসবে.
                            Farmer role change হবে না.
                        ================================================== */}

                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            navigate('/login');
                          }}
                          className="
                            mt-1 flex w-full items-center gap-3
                            rounded-2xl
                            px-3 py-3
                            text-left
                            text-slate-600
                            transition-all
                            hover:bg-purple-50
                            hover:text-purple-700
                          "
                        >
                          <div
                            className="
                              flex h-9 w-9 items-center justify-center
                              rounded-xl
                              bg-slate-100
                            "
                          >
                            <Crown className="h-4 w-4" />
                          </div>

                          <div className="flex-1">
                            <p className="text-xs font-bold">
                              Admin Console
                            </p>

                            <p className="text-[10px] text-slate-400">
                              Login required for admin access
                            </p>
                          </div>

                          <ChevronRight className="h-4 w-4 text-slate-300" />
                        </button>
                      </div>

                      {/* =================================================
                          ACCOUNT ACTIONS
                      ================================================== */}

                      <div className="border-t border-slate-100 p-3">

                        {/* Profile */}

                        <Link
                          to="/profile"
                          onClick={() => setRoleDropdownOpen(false)}
                          className="
                            flex items-center gap-3
                            rounded-2xl
                            px-3 py-3
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
                            <p className="text-xs font-bold">
                              Profile
                            </p>

                            <p className="text-[10px] text-slate-400">
                              View your account
                            </p>
                          </div>

                          <ChevronRight className="h-4 w-4 text-slate-300" />
                        </Link>

                        {/* Register */}

                        <Link
                          to="/register"
                          onClick={() => setRoleDropdownOpen(false)}
                          className="
                            mt-1 flex items-center gap-3
                            rounded-2xl
                            px-3 py-3
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

                            <p className="text-[10px] text-slate-400">
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
                            bg-red-50/50
                            px-3 py-3
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

                            <p className="text-[10px] text-red-400">
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
                  className="
                    flex items-center gap-1.5
                    rounded-xl
                    border border-transparent
                    px-2.5 py-2
                    text-slate-500
                    transition-all
                    hover:border-slate-200
                    hover:bg-slate-50
                    hover:text-slate-800
                  "
                >
                  <Globe className="h-4 w-4" />

                  <span className="hidden xl:block text-[11px] font-bold">
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
                      bg-white
                      p-1.5
                      shadow-[0_15px_45px_rgba(15,23,42,0.12)]
                    "
                  >
                    {(Object.keys(langNames) as LanguageCode[]).map(
                      (lang) => (
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
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'text-slate-600 hover:bg-slate-50'
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
                      )
                    )}
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
                    className="
                      relative flex h-10 w-10
                      items-center justify-center
                      rounded-xl
                      border border-transparent
                      text-slate-500
                      transition-all
                      hover:border-slate-200
                      hover:bg-slate-50
                      hover:text-slate-800
                    "
                  >
                    <Bell className="h-4.5 w-4.5" />

                    {unreadNotifs.length > 0 && (
                      <span
                        className="
                          absolute right-1.5 top-1.5
                          flex h-4 min-w-4
                          items-center justify-center
                          rounded-full
                          border-2 border-white
                          bg-red-500
                          px-0.5
                          text-[8px]
                          font-black
                          text-white
                        "
                      >
                        {unreadNotifs.length > 9
                          ? '9+'
                          : unreadNotifs.length}
                      </span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div
                      className="
                        absolute right-0 top-[calc(100%+10px)]
                        w-80
                        overflow-hidden
                        rounded-3xl
                        border border-slate-200
                        bg-white
                        shadow-[0_20px_60px_rgba(15,23,42,0.14)]
                      "
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Notifications
                          </h3>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {unreadNotifs.length} unread
                          </p>
                        </div>

                        <Bell className="h-4 w-4 text-slate-400" />
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
                                px-5 py-4
                                text-left
                                transition-colors
                                hover:bg-slate-50
                                ${
                                  !notification.read
                                    ? 'bg-emerald-50/30'
                                    : ''
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
                                      ? 'bg-emerald-100 text-emerald-600'
                                      : 'bg-slate-100 text-slate-400'
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
                                        ? 'font-bold text-slate-800'
                                        : 'font-medium text-slate-600'
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
                      bg-white
                      px-4 py-2.5
                      text-xs font-bold
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
                      items-center gap-2
                      rounded-xl
                      bg-slate-900
                      px-4 py-2.5
                      text-xs font-bold
                      text-white
                      shadow-[0_6px_18px_rgba(15,23,42,0.15)]
                      transition-all
                      hover:-translate-y-0.5
                      hover:bg-slate-800
                    "
                  >
                    <Sprout className="h-3.5 w-3.5 text-emerald-400" />
                    Get Started
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="
                    hidden sm:inline-flex
                    items-center gap-2
                    rounded-xl
                    border border-red-100
                    bg-red-50
                    px-3.5 py-2.5
                    text-xs font-bold
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
                  transition-all
                  hover:bg-slate-50
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
            <div className="border-t border-slate-100 bg-white lg:hidden">
              <div className="max-h-[calc(100vh-76px)] overflow-y-auto px-4 py-4">

                {/* =================================================
                    MOBILE USER
                ================================================== */}

                {isAuthenticated && (
                  <div
                    className="
                      mb-4
                      rounded-3xl
                      border border-slate-200
                      bg-linear-to-br from-slate-50 to-white
                      p-4
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex h-11 w-11
                          items-center justify-center
                          rounded-2xl
                          bg-linear-to-br from-emerald-500 to-teal-600
                          text-sm font-black text-white
                        "
                      >
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {user?.name || 'User'}
                        </p>

                        {/* Current logged-in role */}
                        <p className="mt-0.5 text-[10px] font-medium text-emerald-600">
                          {roleLabel}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* =================================================
                    MOBILE NAVIGATION
                ================================================== */}

                <nav className="space-y-1">
                  {navLinks.map((link) => {
                    const isActive =
                      location.pathname === link.path ||
                      (link.path !== '/' &&
                        location.pathname.startsWith(link.path));

                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-3
                          rounded-2xl
                          px-4 py-3.5
                          text-sm font-semibold
                          transition-all
                          ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }
                        `}
                      >
                        {link.highlight ? (
                          <Sparkles className="h-4 w-4" />
                        ) : (
                          <span
                            className={`
                              h-1.5 w-1.5 rounded-full
                              ${
                                isActive
                                  ? 'bg-emerald-500'
                                  : 'bg-slate-300'
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

                {/* =================================================
                    MOBILE ACCOUNT ACTIONS
                ================================================== */}

                {isAuthenticated && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Account
                    </p>

                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="
                        flex items-center gap-3
                        rounded-2xl
                        px-4 py-3.5
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
                        rounded-2xl
                        px-4 py-3.5
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

                {/* =================================================
                    MOBILE ROLE SWITCHER
                ================================================== */}

                {isAuthenticated && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Switch Role
                    </p>

                    <div className="grid grid-cols-3 gap-2">

                      {/* =================================================
                          FARMER
                      ================================================== */}

                      <button
                        onClick={() => {
                          switchRole('farmer');
                          setMobileMenuOpen(false);
                          navigate('/dashboard');
                        }}
                        className={`
                          flex flex-col items-center gap-2
                          rounded-2xl
                          border
                          px-2 py-3
                          text-center
                          ${
                            role === 'farmer'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-slate-200 bg-white text-slate-500'
                          }
                        `}
                      >
                        <Sprout className="h-4 w-4" />

                        <span className="text-[10px] font-bold">
                          Farmer
                        </span>
                      </button>

                      {/* =================================================
                          MANDI OFFICER
                          LOGIN PAGE ONLY
                      ================================================== */}

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/login');
                        }}
                        className="
                          flex flex-col items-center gap-2
                          rounded-2xl
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

                      {/* =================================================
                          ADMIN
                          LOGIN PAGE ONLY
                      ================================================== */}

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/login');
                        }}
                        className="
                          flex flex-col items-center gap-2
                          rounded-2xl
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

                {/* =================================================
                    MOBILE LOGIN / LOGOUT
                ================================================== */}

                <div className="mt-4 border-t border-slate-100 pt-4">
                  {!isAuthenticated ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleLogin}
                        className="
                          rounded-2xl
                          border border-slate-200
                          bg-white
                          px-4 py-3.5
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
                          rounded-2xl
                          bg-slate-900
                          px-4 py-3.5
                          text-sm font-bold
                          text-white
                        "
                      >
                        <Sprout className="h-4 w-4 text-emerald-400" />

                        Get Started
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="
                        flex w-full
                        items-center justify-center gap-2
                        rounded-2xl
                        border border-red-100
                        bg-red-50
                        px-4 py-3.5
                        text-sm font-bold
                        text-red-600
                      "
                    >
                      <LogOut className="h-4 w-4" />

                      Logout Account
                    </button>
                  )}
                </div>

                {/* =================================================
                    MOBILE LANGUAGE
                ================================================== */}

                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                  {(Object.keys(langNames) as LanguageCode[]).map(
                    (lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`
                          flex-1 rounded-xl
                          border px-3 py-2.5
                          text-xs font-bold
                          ${
                            language === lang
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-slate-200 text-slate-500'
                          }
                        `}
                      >
                        {langNames[lang].flag}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};