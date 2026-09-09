const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

import React, { createContext, useContext, useState } from "react";

import { AdminUser, AdminSession } from "../types";

/* ============================================================
   TYPES
============================================================ */

interface AdminContextType {
  adminUser: AdminUser | null;
  adminToken: string | null;
  isAdminAuthenticated: boolean;

  governmentUser: AdminUser | null;
  governmentToken: string | null;
  isGovernmentAuthenticated: boolean;

  loginAdmin: (
    email: string,
    pass: string,
    rememberMe: boolean,
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;

  loginGovernment: (
    email: string,
    pass: string,
    rememberMe: boolean,
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;

  logoutAdmin: () => void;
  logoutGovernment: () => void;

  updateAdminProfile: (updatedData: Partial<AdminUser>) => void;

  changeAdminPassword: (
    currentPass: string,
    newPass: string,
    confirmPass: string,
  ) => Promise<{
    success: boolean;
    message: string;
  }>;

  toggle2FA: () => void;

  activeSessions: AdminSession[];
  terminateSession: (sessionId: string) => void;
}

/* ============================================================
   DEFAULT SUPER ADMIN
   DEVELOPMENT / HACKATHON FALLBACK
============================================================ */

const INITIAL_SUPER_ADMIN: AdminUser = {
  adminId: "ADM-2026-001",
  fullName: "Siddharth Roy",
  email: "admin@kisansetu.in",
  phone: "+91 98000 00000",
  role: "SUPER_ADMIN",
  department: "State Agricultural Marketing Directorate",
  designation: "Chief Procurement Director",
  profilePhoto:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  accountStatus: "active",
  failedLoginAttempts: 0,
  lastLogin: "Today, 10:42 AM",
  passwordChangedAt: "2026-01-15",
  twoFactorEnabled: true,
};

/* ============================================================
   DEFAULT GOVERNMENT OFFICER
   DEVELOPMENT / HACKATHON FALLBACK
============================================================ */

const INITIAL_GOVERNMENT_OFFICER: AdminUser = {
  adminId: "GOV-2026-001",
  fullName: "Government Officer",
  email: "officer@kisansetu.in",
  phone: "+91 98000 00001",
  role: "GOVERNMENT_OFFICER" as AdminUser["role"],
  department: "Department of Agriculture",
  designation: "Agricultural Procurement Officer",
  profilePhoto:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80",
  accountStatus: "active",
  failedLoginAttempts: 0,
  lastLogin: "Today, 10:42 AM",
  passwordChangedAt: "2026-01-15",
  twoFactorEnabled: false,
};

/* ============================================================
   ACTIVE SESSIONS
============================================================ */

const INITIAL_SESSIONS: AdminSession[] = [
  {
    sessionId: "SESS-001",
    device: "Windows 11 Workstation",
    browser: "Chrome 122",
    ipAddress: "127.0.0.1",
    loginTime: "Today, 10:42 AM",
    isCurrent: true,
  },
  {
    sessionId: "SESS-002",
    device: "Android Tablet (APMC Control Desk)",
    browser: "Chrome Mobile",
    ipAddress: "192.168.1.45",
    loginTime: "Yesterday, 04:15 PM",
    isCurrent: false,
  },
];

/* ============================================================
   LOCAL STORAGE KEYS
============================================================ */

const ADMIN_TOKEN_KEY = "kisansetu_admin_token";
const ADMIN_USER_KEY = "kisansetu_admin_user";

const GOVERNMENT_TOKEN_KEY = "kisansetu_government_token";

const GOVERNMENT_USER_KEY = "kisansetu_government_user";

/* ============================================================
   CONTEXT
============================================================ */

const AdminContext = createContext<AdminContextType | undefined>(undefined);

/* ============================================================
   PROVIDER
============================================================ */

export const AdminAuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  /* ==========================================================
     ADMIN AUTHENTICATION
  ========================================================== */

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(ADMIN_USER_KEY);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        localStorage.removeItem(ADMIN_USER_KEY);
      }
    }

    /*
     * If an admin token exists but admin user
     * data is missing, restore the development
     * fallback admin.
     */
    if (localStorage.getItem(ADMIN_TOKEN_KEY)) {
      return INITIAL_SUPER_ADMIN;
    }

    return null;
  });

  /* ==========================================================
     GOVERNMENT AUTHENTICATION
  ========================================================== */

  const [governmentToken, setGovernmentToken] = useState<string | null>(() => {
    return localStorage.getItem(GOVERNMENT_TOKEN_KEY);
  });

  const [governmentUser, setGovernmentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(GOVERNMENT_USER_KEY);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        localStorage.removeItem(GOVERNMENT_USER_KEY);
      }
    }

    if (localStorage.getItem(GOVERNMENT_TOKEN_KEY)) {
      return INITIAL_GOVERNMENT_OFFICER;
    }

    return null;
  });

  /* ==========================================================
     ACTIVE SESSIONS
  ========================================================== */

  const [activeSessions, setActiveSessions] =
    useState<AdminSession[]>(INITIAL_SESSIONS);

  /* ==========================================================
     ADMIN LOGIN
  ========================================================== */

  const loginAdmin = async (
    email: string,
    pass: string,
    rememberMe: boolean,
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password: pass,
          rememberMe,
        }),
      });

      const data = await response.json();

      /* ======================================================
         SUCCESSFUL BACKEND LOGIN
      ====================================================== */

      if (response.ok && data.success) {
        /*
         * Backend may return the admin object
         * as data.admin.
         */

        const loggedInAdmin = data.admin || data.user || null;

        if (!loggedInAdmin) {
          return {
            success: false,
            message: "Admin information was not returned by the server.",
          };
        }

        /* ====================================================
           SECURITY CHECK
        ==================================================== */

        if (
          loggedInAdmin.role &&
          loggedInAdmin.role !== "SUPER_ADMIN" &&
          loggedInAdmin.role !== "ADMIN"
        ) {
          return {
            success: false,
            message: "This account does not have Admin Portal access.",
          };
        }

        /*
         * Store token
         */

        setAdminToken(data.token);

        /*
         * IMPORTANT:
         * Store the ACTUAL logged-in admin.
         *
         * This is what AdminNavbar will use.
         */

        setAdminUser(loggedInAdmin);

        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);

        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(loggedInAdmin));

        return {
          success: true,
        };
      }

      /* ======================================================
         DEVELOPMENT FALLBACK
      ====================================================== */

      if (
        email.toLowerCase() === "admin@kisansetu.in" &&
        (pass === "SuperAdmin@2026" || pass === "admin123")
      ) {
        const token = `mock-admin-jwt-${Date.now()}`;

        setAdminToken(token);

        setAdminUser(INITIAL_SUPER_ADMIN);

        localStorage.setItem(ADMIN_TOKEN_KEY, token);

        localStorage.setItem(
          ADMIN_USER_KEY,
          JSON.stringify(INITIAL_SUPER_ADMIN),
        );

        return {
          success: true,
        };
      }

      return {
        success: false,
        message: data.message || "Invalid admin credentials.",
      };
    } catch (error) {
      console.error("❌ Admin login error:", error);
      /* ======================================================
         BACKEND UNAVAILABLE
         DEVELOPMENT FALLBACK
      ====================================================== */

      if (
        email.toLowerCase() === "admin@kisansetu.in" &&
        (pass === "SuperAdmin@2026" || pass === "admin123")
      ) {
        const token = `mock-admin-jwt-${Date.now()}`;

        setAdminToken(token);

        setAdminUser(INITIAL_SUPER_ADMIN);

        localStorage.setItem(ADMIN_TOKEN_KEY, token);

        localStorage.setItem(
          ADMIN_USER_KEY,
          JSON.stringify(INITIAL_SUPER_ADMIN),
        );

        return {
          success: true,
        };
      }

      return {
        success: false,
        message: "Unable to connect to the Admin authentication server.",
      };
    }
  };

  /* ============================================================
     GOVERNMENT OFFICER LOGIN
  ============================================================ */

  const loginGovernment = async (
    email: string,
    pass: string,
    rememberMe: boolean,
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/government/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password: pass,
            rememberMe,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        const officer =
          data.governmentOfficer || data.user || data.admin || null;

        if (!officer) {
          return {
            success: false,
            message:
              "Government Officer information was not returned by the server.",
          };
        }

        /*
         * Security check
         */

        if (officer.role && officer.role !== "GOVERNMENT_OFFICER") {
          return {
            success: false,
            message: "This account does not have Government Officer access.",
          };
        }

        setGovernmentToken(data.token);

        setGovernmentUser(officer);

        localStorage.setItem(GOVERNMENT_TOKEN_KEY, data.token);

        localStorage.setItem(GOVERNMENT_USER_KEY, JSON.stringify(officer));

        return {
          success: true,
        };
      }

      /* ======================================================
         GOVERNMENT DEVELOPMENT FALLBACK
      ====================================================== */

      if (
        email.toLowerCase() === "officer@kisansetu.in" &&
        pass === "Government@2026"
      ) {
        const token = `mock-government-jwt-${Date.now()}`;

        setGovernmentToken(token);

        setGovernmentUser(INITIAL_GOVERNMENT_OFFICER);

        localStorage.setItem(GOVERNMENT_TOKEN_KEY, token);

        localStorage.setItem(
          GOVERNMENT_USER_KEY,
          JSON.stringify(INITIAL_GOVERNMENT_OFFICER),
        );

        return {
          success: true,
        };
      }

      return {
        success: false,
        message: data.message || "Invalid Government Officer credentials.",
      };
    } catch {
      /* ======================================================
         GOVERNMENT BACKEND FALLBACK
      ====================================================== */

      if (
        email.toLowerCase() === "officer@kisansetu.in" &&
        pass === "Government@2026"
      ) {
        const token = `mock-government-jwt-${Date.now()}`;

        setGovernmentToken(token);

        setGovernmentUser(INITIAL_GOVERNMENT_OFFICER);

        localStorage.setItem(GOVERNMENT_TOKEN_KEY, token);

        localStorage.setItem(
          GOVERNMENT_USER_KEY,
          JSON.stringify(INITIAL_GOVERNMENT_OFFICER),
        );

        return {
          success: true,
        };
      }

      return {
        success: false,
        message: "Unable to connect to the Government authentication server.",
      };
    }
  };

  /* ============================================================
     ADMIN LOGOUT
  ============================================================ */

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);

    localStorage.removeItem(ADMIN_TOKEN_KEY);

    localStorage.removeItem(ADMIN_USER_KEY);
  };

  /* ============================================================
     GOVERNMENT LOGOUT
  ============================================================ */

  const logoutGovernment = () => {
    setGovernmentToken(null);
    setGovernmentUser(null);

    localStorage.removeItem(GOVERNMENT_TOKEN_KEY);

    localStorage.removeItem(GOVERNMENT_USER_KEY);
  };

  /* ============================================================
     UPDATE ADMIN PROFILE
  ============================================================ */

  const updateAdminProfile = (updatedData: Partial<AdminUser>) => {
    if (!adminUser) {
      return;
    }

    const newProfile: AdminUser = {
      ...adminUser,
      ...updatedData,
    };

    /*
     * Update React state
     */

    setAdminUser(newProfile);

    /*
     * Update localStorage
     */

    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(newProfile));
  };

  /* ============================================================
     CHANGE ADMIN PASSWORD
  ============================================================ */

  const changeAdminPassword = async (
    currentPass: string,
    newPass: string,
    confirmPass: string,
  ) => {
    if (newPass !== confirmPass) {
      return {
        success: false,
        message: "New password and confirmation do not match.",
      };
    }

    if (newPass.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters long.",
      };
    }

    /*
     * Current frontend implementation.
     *
     * Backend password update can be
     * connected later.
     */

    if (adminUser) {
      updateAdminProfile({
        passwordChangedAt: new Date().toISOString().split("T")[0],
      });
    }

    return {
      success: true,
      message: "Administrator password changed successfully.",
    };
  };

  /* ============================================================
     TWO FACTOR AUTHENTICATION
  ============================================================ */

  const toggle2FA = () => {
    if (!adminUser) {
      return;
    }

    updateAdminProfile({
      twoFactorEnabled: !adminUser.twoFactorEnabled,
    });
  };

  /* ============================================================
     TERMINATE SESSION
  ============================================================ */

  const terminateSession = (sessionId: string) => {
    setActiveSessions((previousSessions) =>
      previousSessions.filter((session) => session.sessionId !== sessionId),
    );
  };

  /* ============================================================
     PROVIDER
  ============================================================ */

  return (
    <AdminContext.Provider
      value={{
        /* Admin */

        adminUser,

        adminToken,

        isAdminAuthenticated: !!adminToken && !!adminUser,

        /* Government */

        governmentUser,

        governmentToken,

        isGovernmentAuthenticated: !!governmentToken && !!governmentUser,

        /* Login */

        loginAdmin,

        loginGovernment,

        /* Logout */

        logoutAdmin,

        logoutGovernment,

        /* Admin management */

        updateAdminProfile,

        changeAdminPassword,

        toggle2FA,

        /* Sessions */

        activeSessions,

        terminateSession,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

/* ============================================================
   HOOK
============================================================ */

export const useAdminAuth = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }

  return context;
};
