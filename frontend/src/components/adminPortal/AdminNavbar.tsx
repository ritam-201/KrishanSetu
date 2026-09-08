import React, { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  Sprout,
  Menu,
  X,
  Bell,
  Globe,
  ChevronDown,
  CheckCircle2,
  LogOut,
  User,
  ChevronRight,
  Wheat,
  LayoutDashboard,
  CreditCard,
  Users,
  Clock3,
  BarChart3,
} from 'lucide-react';

interface AdminNavbarProps {
  adminName?: string;
  onLogout?: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({
  adminName = 'Admin',
  onLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] =
    useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] =
    useState(false);

  /* =========================================================
     SCROLL EFFECT
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* =========================================================
     CLOSE DROPDOWNS ON ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setProfileDropdownOpen(false);
    setLangDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* =========================================================
     NAVIGATION ITEMS
  ========================================================= */

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      label: 'Crop Bookings',
      icon: Wheat,
      path: '/admin/crop-bookings',
    },
    {
      label: 'Payments',
      icon: CreditCard,
      path: '/admin/payments',
    },
    {
      label: 'Farmers',
      icon: Users,
      path: '/admin/farmers',
    },
    {
      label: 'Queue / Tokens',
      icon: Clock3,
      path: '/admin/queue',
    },
    {
      label: 'Reports',
      icon: BarChart3,
      path: '/admin/reports',
    },
  ];

  /* =========================================================
     ACTIVE ROUTE
  ========================================================= */

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    setLangDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);

    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  /* =========================================================
     LANGUAGE
  ========================================================= */

  const languages = [
    {
      code: 'EN',
      label: 'English',
    },
    {
      code: 'বাং',
      label: 'বাংলা',
    },
    {
      code: 'हि',
      label: 'हिन्दी',
    },
  ];

  const [selectedLanguage, setSelectedLanguage] =
    useState('EN');

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
              pl-3 pr-4
              sm:pl-4 sm:pr-6
              lg:pl-5 lg:pr-8
            "
          >
            {/* =================================================
                LOGO
            ================================================== */}

            <Link
              to="/admin/dashboard"
              className="group flex shrink-0 items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              {/* Logo */}

              <div
                className="
                  relative flex h-11 w-11
                  items-center justify-center
                  overflow-hidden rounded-2xl
                  bg-linear-to-br
                  from-emerald-500
                  via-green-600
                  to-teal-700
                  shadow-[0_8px_20px_rgba(16,185,129,0.28)]
                  transition-all duration-300
                  group-hover:scale-105
                  group-hover:shadow-[0_10px_25px_rgba(16,185,129,0.38)]
                "
              >
                <Sprout className="h-6 w-6 text-white" />

                <div
                  className="
                    absolute inset-0
                    bg-white/10
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                />
              </div>

              {/* Brand */}

              <div className="hidden sm:block">
                <div className="flex items-center gap-1">
                  <span
                    className="
                      text-[18px]
                      font-black
                      tracking-[-0.04em]
                      text-slate-900
                    "
                  >
                    KISAN
                  </span>

                  <span
                    className="
                      text-[18px]
                      font-black
                      tracking-[-0.04em]
                      text-emerald-600
                    "
                  >
                    SETU
                  </span>
                </div>

                <div
                  className="
                    -mt-0.5
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.19em]
                    text-slate-400
                  "
                >
                  Smart Admin Platform
                </div>
              </div>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================== */}

            <nav
              className="
                ml-5
                hidden
                flex-1
                items-center
                justify-center
                lg:flex
              "
            >
              <div
                className="
                  flex items-center gap-1
                  rounded-2xl
                  border border-slate-200/70
                  bg-slate-50/80
                  p-1
                "
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        group relative
                        flex items-center gap-1.5
                        rounded-xl
                        px-3 py-2.5
                        text-[13px]
                        font-semibold
                        transition-all duration-200
                        ${
                          active
                            ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200/70'
                            : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                        }
                      `}
                    >
                      <Icon
                        className={`
                          h-3.5 w-3.5
                          ${
                            active
                              ? 'text-emerald-500'
                              : 'text-slate-400 group-hover:text-emerald-500'
                          }
                        `}
                      />

                      <span>{item.label}</span>

                      {active && (
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

            <div
              className="
                ml-auto
                flex
                items-center
                gap-1.5
                sm:gap-2
              "
            >
              {/* =================================================
                  ADMIN PROFILE
              ================================================== */}

              <div className="relative hidden lg:block">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(
                      !profileDropdownOpen
                    );

                    setLangDropdownOpen(false);
                    setNotifDropdownOpen(false);
                  }}
                  className="
                    group
                    flex items-center gap-2
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
                  {/* Avatar */}

                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-xl
                      bg-linear-to-br
                      from-emerald-500
                      to-teal-600
                      text-sm
                      font-bold
                      text-white
                      shadow-sm
                    "
                  >
                    {adminName
                      ?.charAt(0)
                      ?.toUpperCase() || 'A'}
                  </div>

                  {/* Name */}

                  <div className="hidden text-left xl:block">
                    <p
                      className="
                        max-w-27.5
                        truncate
                        text-[12px]
                        font-bold
                        text-slate-800
                      "
                    >
                      {adminName}
                    </p>

                    <p
                      className="
                        text-[10px]
                        font-medium
                        text-slate-400
                      "
                    >
                      Administrator
                    </p>
                  </div>

                  <ChevronDown
                    className={`
                      h-4 w-4
                      text-slate-400
                      transition-transform duration-200
                      ${
                        profileDropdownOpen
                          ? 'rotate-180 text-emerald-600'
                          : ''
                      }
                    `}
                  />
                </button>

                {/* =================================================
                    PROFILE DROPDOWN
                ================================================== */}

                {profileDropdownOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-[calc(100%+12px)]
                      w-80
                      overflow-hidden
                      rounded-3xl
                      border border-slate-200
                      bg-white
                      shadow-[0_20px_60px_rgba(15,23,42,0.14)]
                    "
                  >
                    {/* Profile Header */}

                    <div
                      className="
                        bg-linear-to-br
                        from-slate-50
                        to-white
                        p-5
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex h-12 w-12
                            shrink-0
                            items-center justify-center
                            rounded-2xl
                            bg-linear-to-br
                            from-emerald-500
                            to-teal-600
                            text-lg
                            font-black
                            text-white
                            shadow-[0_8px_18px_rgba(16,185,129,0.25)]
                          "
                        >
                          {adminName
                            ?.charAt(0)
                            ?.toUpperCase() || 'A'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="
                              truncate
                              text-sm
                              font-bold
                              text-slate-900
                            "
                          >
                            {adminName}
                          </p>

                          <p
                            className="
                              mt-0.5
                              truncate
                              text-xs
                              text-slate-500
                            "
                          >
                            KisanSetu Administration
                          </p>
                        </div>

                        <div
                          className="
                            rounded-full
                            bg-linear-to-br
                            from-emerald-50
                            to-emerald-100
                            px-2.5 py-1
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-emerald-700
                          "
                        >
                          Admin
                        </div>
                      </div>

                      {/* Admin Status */}

                      <div
                        className="
                          mt-4
                          flex items-center gap-2
                          rounded-xl
                          border border-slate-200/80
                          bg-linear-to-br
                          from-white
                          to-slate-100
                          px-3 py-2.5
                        "
                      >
                        <CheckCircle2
                          className="
                            h-4 w-4
                            text-emerald-500
                          "
                        />

                        <span
                          className="
                            text-[11px]
                            font-medium
                            text-slate-500
                          "
                        >
                          Account Status
                        </span>

                        <span
                          className="
                            ml-auto
                            text-[11px]
                            font-bold
                            text-emerald-600
                          "
                        >
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Divider */}

                    <div
                      className="
                        border-t
                        border-slate-100
                      "
                    />

                    {/* Admin Actions */}

                    <div className="p-3">
                      <p
                        className="
                          mb-2
                          px-2
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.16em]
                          text-slate-400
                        "
                      >
                        Administration
                      </p>

                      <Link
                        to="/admin/dashboard"
                        onClick={() =>
                          setProfileDropdownOpen(false)
                        }
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
                        <div
                          className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-xl
                            bg-slate-100
                          "
                        >
                          <LayoutDashboard
                            className="h-4 w-4"
                          />
                        </div>

                        <div className="flex-1">
                          <p
                            className="
                              text-xs
                              font-bold
                            "
                          >
                            Admin Dashboard
                          </p>

                          <p
                            className="
                              text-[10px]
                              text-slate-400
                            "
                          >
                            View system overview
                          </p>
                        </div>

                        <ChevronRight
                          className="
                            h-4 w-4
                            text-slate-300
                          "
                        />
                      </Link>

                      <Link
                        to="/admin/farmers"
                        onClick={() =>
                          setProfileDropdownOpen(false)
                        }
                        className="
                          mt-1
                          flex items-center gap-3
                          rounded-2xl
                          px-3 py-3
                          text-slate-600
                          transition-colors
                          hover:bg-slate-50
                          hover:text-slate-900
                        "
                      >
                        <div
                          className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-xl
                            bg-slate-100
                          "
                        >
                          <Users className="h-4 w-4" />
                        </div>

                        <div className="flex-1">
                          <p
                            className="
                              text-xs
                              font-bold
                            "
                          >
                            Registered Farmers
                          </p>

                          <p
                            className="
                              text-[10px]
                              text-slate-400
                            "
                          >
                            Manage farmer accounts
                          </p>
                        </div>

                        <ChevronRight
                          className="
                            h-4 w-4
                            text-slate-300
                          "
                        />
                      </Link>
                    </div>

                    {/* Logout */}

                    <div
                      className="
                        border-t
                        border-slate-100
                        p-3
                      "
                    >
                      <button
                        onClick={handleLogout}
                        className="
                          mt-0
                          flex w-full
                          items-center gap-3
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
                        <div
                          className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-xl
                            bg-red-100
                          "
                        >
                          <LogOut className="h-4 w-4" />
                        </div>

                        <div className="flex-1">
                          <p
                            className="
                              text-xs
                              font-bold
                            "
                          >
                            Logout Account
                          </p>

                          <p
                            className="
                              text-[10px]
                              text-red-400
                            "
                          >
                            Sign out securely
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================
                  LANGUAGE
              ================================================== */}

              <div className="relative hidden sm:block">
                <button
                  onClick={() => {
                    setLangDropdownOpen(
                      !langDropdownOpen
                    );

                    setProfileDropdownOpen(false);
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

                  <span
                    className="
                      hidden
                      text-[11px]
                      font-bold
                      xl:block
                    "
                  >
                    {selectedLanguage}
                  </span>

                  <ChevronDown className="h-3 w-3" />
                </button>

                {langDropdownOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-[calc(100%+10px)]
                      w-44
                      overflow-hidden
                      rounded-2xl
                      border border-slate-200
                      bg-white
                      p-1.5
                      shadow-[0_15px_45px_rgba(15,23,42,0.12)]
                    "
                  >
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setSelectedLanguage(
                            language.code
                          );
                          setLangDropdownOpen(false);
                        }}
                        className={`
                          flex w-full
                          items-center gap-3
                          rounded-xl
                          px-3 py-2.5
                          text-left
                          transition-colors
                          ${
                            selectedLanguage ===
                            language.code
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'text-slate-600 hover:bg-slate-50'
                          }
                        `}
                      >
                        <span
                          className="
                            w-8
                            text-xs
                            font-bold
                          "
                        >
                          {language.code}
                        </span>

                        <span
                          className="
                            text-xs
                            font-semibold
                          "
                        >
                          {language.label}
                        </span>

                        {selectedLanguage ===
                          language.code && (
                          <CheckCircle2
                            className="
                              ml-auto
                              h-4 w-4
                              text-emerald-500
                            "
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* =================================================
                  NOTIFICATIONS
              ================================================== */}

              <div className="relative hidden sm:block">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(
                      !notifDropdownOpen
                    );

                    setProfileDropdownOpen(false);
                    setLangDropdownOpen(false);
                  }}
                  className="
                    relative
                    flex h-10 w-10
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

                  {/* Notification Badge */}

                  <span
                    className="
                      absolute
                      right-1.5
                      top-1.5
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
                    3
                  </span>
                </button>

                {notifDropdownOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-[calc(100%+10px)]
                      w-80
                      overflow-hidden
                      rounded-3xl
                      border border-slate-200
                      bg-white
                      shadow-[0_20px_60px_rgba(15,23,42,0.14)]
                    "
                  >
                    <div
                      className="
                        flex items-center
                        justify-between
                        border-b
                        border-slate-100
                        px-5 py-4
                      "
                    >
                      <div>
                        <h3
                          className="
                            text-sm
                            font-bold
                            text-slate-900
                          "
                        >
                          Notifications
                        </h3>

                        <p
                          className="
                            mt-0.5
                            text-[10px]
                            text-slate-400
                          "
                        >
                          3 unread
                        </p>
                      </div>

                      <Bell
                        className="
                          h-4 w-4
                          text-slate-400
                        "
                      />
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {/* Notification 1 */}

                      <div
                        className="
                          flex gap-3
                          border-b
                          border-slate-50
                          bg-emerald-50/30
                          px-5 py-4
                        "
                      >
                        <div
                          className="
                            mt-0.5
                            flex h-8 w-8
                            shrink-0
                            items-center justify-center
                            rounded-xl
                            bg-emerald-100
                            text-emerald-600
                          "
                        >
                          <Users className="h-3.5 w-3.5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="
                              text-xs
                              font-bold
                              text-slate-800
                            "
                          >
                            New farmer registration
                          </p>

                          <p
                            className="
                              mt-1
                              text-[10px]
                              leading-relaxed
                              text-slate-400
                            "
                          >
                            A new farmer has registered
                            on KisanSetu.
                          </p>
                        </div>

                        <span
                          className="
                            mt-1
                            h-2 w-2
                            shrink-0
                            rounded-full
                            bg-emerald-500
                          "
                        />
                      </div>

                      {/* Notification 2 */}

                      <div
                        className="
                          flex gap-3
                          border-b
                          border-slate-50
                          bg-emerald-50/30
                          px-5 py-4
                        "
                      >
                        <div
                          className="
                            mt-0.5
                            flex h-8 w-8
                            shrink-0
                            items-center justify-center
                            rounded-xl
                            bg-emerald-100
                            text-emerald-600
                          "
                        >
                          <Wheat className="h-3.5 w-3.5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="
                              text-xs
                              font-bold
                              text-slate-800
                            "
                          >
                            New crop booking
                          </p>

                          <p
                            className="
                              mt-1
                              text-[10px]
                              leading-relaxed
                              text-slate-400
                            "
                          >
                            A new crop booking requires
                            attention.
                          </p>
                        </div>

                        <span
                          className="
                            mt-1
                            h-2 w-2
                            shrink-0
                            rounded-full
                            bg-emerald-500
                          "
                        />
                      </div>

                      {/* Notification 3 */}

                      <div
                        className="
                          flex gap-3
                          px-5 py-4
                        "
                      >
                        <div
                          className="
                            mt-0.5
                            flex h-8 w-8
                            shrink-0
                            items-center justify-center
                            rounded-xl
                            bg-slate-100
                            text-slate-400
                          "
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="
                              text-xs
                              font-medium
                              text-slate-600
                            "
                          >
                            Payment update
                          </p>

                          <p
                            className="
                              mt-1
                              text-[10px]
                              leading-relaxed
                              text-slate-400
                            "
                          >
                            Payment records have been
                            updated.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================
                  LOGOUT
              ================================================== */}

              <button
                onClick={handleLogout}
                className="
                  hidden sm:inline-flex
                  items-center gap-2
                  rounded-xl
                  border border-red-100
                  bg-red-50
                  px-3.5 py-2.5
                  text-xs
                  font-bold
                  text-red-600
                  transition-all
                  hover:border-red-200
                  hover:bg-red-100
                "
              >
                <LogOut className="h-3.5 w-3.5" />

                Logout
              </button>

              {/* =================================================
                  MOBILE MENU BUTTON
              ================================================== */}

              <button
                onClick={() =>
                  setMobileMenuOpen(!mobileMenuOpen)
                }
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
            <div
              className="
                border-t
                border-slate-100
                bg-white
                lg:hidden
              "
            >
              <div
                className="
                  max-h-[calc(100vh-76px)]
                  overflow-y-auto
                  px-4 py-4
                "
              >
                {/* Mobile Admin */}

                <div
                  className="
                    mb-4
                    rounded-3xl
                    border border-slate-200
                    bg-linear-to-br
                    from-slate-50
                    to-white
                    p-4
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-11 w-11
                        items-center justify-center
                        rounded-2xl
                        bg-linear-to-br
                        from-emerald-500
                        to-teal-600
                        text-sm
                        font-black
                        text-white
                      "
                    >
                      {adminName
                        ?.charAt(0)
                        ?.toUpperCase() || 'A'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          truncate
                          text-sm
                          font-bold
                          text-slate-900
                        "
                      >
                        {adminName}
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          font-medium
                          text-emerald-600
                        "
                      >
                        Administrator
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() =>
                          setMobileMenuOpen(false)
                        }
                        className={`
                          flex items-center gap-3
                          rounded-2xl
                          px-4 py-3.5
                          text-sm
                          font-semibold
                          transition-all
                          ${
                            active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }
                        `}
                      >
                        <Icon className="h-4 w-4" />

                        <span>{item.label}</span>

                        {active && (
                          <ChevronRight
                            className="
                              ml-auto
                              h-4 w-4
                            "
                          />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Account */}

                <div
                  className="
                    mt-4
                    border-t
                    border-slate-100
                    pt-4
                  "
                >
                  <p
                    className="
                      mb-2
                      px-2
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-slate-400
                    "
                  >
                    Administration
                  </p>

                  <Link
                    to="/admin/farmers"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="
                      flex items-center gap-3
                      rounded-2xl
                      px-4 py-3.5
                      text-sm
                      font-semibold
                      text-slate-600
                      hover:bg-slate-50
                    "
                  >
                    <Users className="h-4 w-4" />

                    Farmers
                  </Link>

                  <Link
                    to="/admin/reports"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="
                      flex items-center gap-3
                      rounded-2xl
                      px-4 py-3.5
                      text-sm
                      font-semibold
                      text-slate-600
                      hover:bg-slate-50
                    "
                  >
                    <BarChart3 className="h-4 w-4" />

                    Reports
                  </Link>
                </div>

                {/* Mobile Logout */}

                <div
                  className="
                    mt-4
                    border-t
                    border-slate-100
                    pt-4
                  "
                >
                  <button
                    onClick={handleLogout}
                    className="
                      flex w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      border border-red-100
                      bg-red-50
                      px-4 py-3.5
                      text-sm
                      font-bold
                      text-red-600
                    "
                  >
                    <LogOut className="h-4 w-4" />

                    Logout Account
                  </button>
                </div>

                {/* Mobile Language */}

                <div
                  className="
                    mt-4
                    flex gap-2
                    border-t
                    border-slate-100
                    pt-4
                  "
                >
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() =>
                        setSelectedLanguage(
                          language.code
                        )
                      }
                      className={`
                        flex-1
                        rounded-xl
                        border
                        px-3 py-2.5
                        text-xs
                        font-bold
                        ${
                          selectedLanguage ===
                          language.code
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 text-slate-500'
                        }
                      `}
                    >
                      {language.code}
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

export default AdminNavbar;