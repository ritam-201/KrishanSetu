import React, { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Download,
  Users,
  Wheat,
  CreditCard,
  Clock3,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Activity,
  MapPin,
  Database,
  CalendarDays,
  CircleDollarSign,
  PackageCheck,
  Timer,
  ChevronRight,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useAuth } from "../../context/AuthContext";

/* =========================================================
   TYPES
========================================================= */

interface Farmer {
  _id: string;
  farmerId?: string;
  fullName?: string;
  village?: string;
  district?: string;
  state?: string;
  verificationStatus?: string;
  totalLandArea?: number;
  landUnit?: string;
  mobileNumber?: string;
  updatedAt?: string;
}

interface Booking {
  _id: string;
  procurementId?: string;
  tokenNumber?: string;
  farmerId?: string;
  farmerName?: string;
  centerId?: string;
  centerName?: string;
  crop?: string;
  variety?: string;
  submittedQuantityQuintals?: number;
  approvedQuantityQuintals?: number;
  rejectedQuantityQuintals?: number;
  qualityGrade?: string;
  status?: string;
  createdAt?: string;
}

interface Payment {
  _id: string;
  paymentId?: string;
  transactionId?: string;
  farmerId?: string;
  farmerName?: string;
  tokenNumber?: string;
  centerName?: string;
  crop?: string;
  grossWeightQuintals?: number;
  mspRatePerQuintal?: number;
  grossAmount?: number;
  deductions?: number;
  netPayable?: number;
  status?: string;
  createdAt?: string;
}

interface QueueToken {
  _id: string;
  tokenNumber?: string;
  tokenCode?: string;
  centerId?: string;
  farmerId?: string;
  farmerName?: string;
  farmerPhone?: string;
  village?: string;
  crop?: string;
  quantityQuintals?: number;
  date?: string;
  slotTime?: string;
  status?: string;
  estimatedWaitMinutes?: number;
  createdAt?: string;
}

interface AuditLog {
  logId?: string;
  user?: string;
  role?: string;
  action?: string;
  targetEntity?: string;
  details?: string;
  timestamp?: string;
}

interface DashboardSummary {
  totalFarmers?: number;
  totalBookings?: number;
  totalPayments?: number;
  waitingTokens?: number;
  completedProcurements?: number;
}

/* =========================================================
   CONFIG
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/* =========================================================
   HELPERS
========================================================= */

const getAdminToken = () => {
  const possibleKeys = [
    "kisansetu_admin_token",
    "adminToken",
    "admin_token",
    "adminAuthToken",
    "token",
    "authToken",
  ];

  for (const key of possibleKeys) {
    const token = localStorage.getItem(key);

    if (token) {
      return token;
    }
  }

  return null;
};

const adminFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = getAdminToken();

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...(options.headers || {}),
      },
    }
  );

  const contentType =
    response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`
    );
  }

  return data;
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-IN").format(
    Math.round(value || 0)
  );
};

const formatCurrency = (value: number) => {
  if (!value) return "₹0";

  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }

  return `₹${formatNumber(value)}`;
};

const formatDate = (date?: string) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date?: string) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTimeAgo = (date?: string) => {
  if (!date) return "Unknown";

  const time = new Date(date).getTime();

  if (Number.isNaN(time)) {
    return "Unknown";
  }

  const diff = Date.now() - time;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
};

/* =========================================================
   STATUS HELPERS
========================================================= */

const getStatusStyle = (status?: string) => {
  const value = status?.toLowerCase() || "";

  if (
    value.includes("accept") ||
    value.includes("complete") ||
    value.includes("success") ||
    value.includes("paid") ||
    value.includes("approved")
  ) {
    return {
      label: status || "Completed",
      className:
        "bg-emerald-50 text-emerald-700 ring-emerald-100",
      dot: "bg-emerald-500",
    };
  }

  if (
    value.includes("reject") ||
    value.includes("cancel") ||
    value.includes("fail")
  ) {
    return {
      label: status || "Rejected",
      className:
        "bg-red-50 text-red-700 ring-red-100",
      dot: "bg-red-500",
    };
  }

  if (
    value.includes("process") ||
    value.includes("wait") ||
    value.includes("pending") ||
    value.includes("next") ||
    value.includes("arrived")
  ) {
    return {
      label: status || "Processing",
      className:
        "bg-amber-50 text-amber-700 ring-amber-100",
      dot: "bg-amber-500",
    };
  }

  return {
    label: status || "Recorded",
    className:
      "bg-slate-50 text-slate-600 ring-slate-200",
    dot: "bg-slate-400",
  };
};

/* =========================================================
   STAT CARD
========================================================= */

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}) => {
  return (
    <div
      className="
        group relative overflow-hidden
        rounded-3xl
        border border-slate-200/80
        bg-white
        p-5
        shadow-[0_8px_30px_rgba(15,23,42,0.045)]
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]
      "
    >
      <div
        className={`
          absolute right-0 top-0
          h-24 w-24
          translate-x-8
          -translate-y-8
          rounded-full
          blur-2xl
          opacity-20
          ${accent}
        `}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-2xl
              bg-slate-50
              text-slate-600
              ring-1 ring-slate-100
            "
          >
            <Icon className="h-5 w-5" />
          </div>

          <div
            className="
              flex items-center gap-1
              rounded-full
              bg-emerald-50
              px-2 py-1
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-emerald-700
            "
          >
            <Activity className="h-3 w-3" />
            Live
          </div>
        </div>

        <p
          className="
            mt-5
            text-[11px]
            font-bold
            uppercase
            tracking-[0.14em]
            text-slate-400
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-2xl
            font-black
            tracking-tight
            text-slate-900
            sm:text-3xl
          "
        >
          {value}
        </p>

        <p className="mt-2 text-[11px] font-medium text-slate-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   COMPONENT
========================================================= */

const AdminDashboard: React.FC = () => {
  const { centers } = useAuth();

  const [dashboard, setDashboard] =
    useState<DashboardSummary | null>(null);

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [queueTokens, setQueueTokens] =
    useState<QueueToken[]>([]);
  const [auditLogs, setAuditLogs] =
    useState<AuditLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  /* =========================================================
     FETCH DATA
  ========================================================= */

  const fetchAdminData = async () => {
    try {
      setError("");

      const [
        dashboardResponse,
        farmersResponse,
        bookingsResponse,
        paymentsResponse,
        queueResponse,
        auditResponse,
      ] = await Promise.all([
        adminFetch("/api/admin/dashboard"),
        adminFetch("/api/admin/farmers"),
        adminFetch("/api/admin/crop-bookings"),
        adminFetch("/api/admin/payments"),
        adminFetch("/api/admin/queue"),
        adminFetch("/api/admin/audit-logs"),
      ]);

      setDashboard(
        dashboardResponse?.data ||
          dashboardResponse?.dashboard ||
          dashboardResponse ||
          null
      );

      setFarmers(
        farmersResponse?.farmers ||
          farmersResponse?.data ||
          []
      );

      setBookings(
        bookingsResponse?.bookings ||
          bookingsResponse?.data ||
          []
      );

      setPayments(
        paymentsResponse?.payments ||
          paymentsResponse?.data ||
          []
      );

      setQueueTokens(
        queueResponse?.tokens ||
          queueResponse?.data ||
          []
      );

      setAuditLogs(
        auditResponse?.logs ||
          auditResponse?.data ||
          []
      );

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Admin dashboard error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load admin dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAdminData();
  };

  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const totalProcured = useMemo(() => {
    return bookings.reduce((total, booking) => {
      return (
        total +
        Number(
          booking.approvedQuantityQuintals ??
            booking.submittedQuantityQuintals ??
            0
        )
      );
    }, 0);
  }, [bookings]);

  const totalPaymentsAmount = useMemo(() => {
    return payments.reduce((total, payment) => {
      return total + Number(payment.netPayable || 0);
    }, 0);
  }, [payments]);

  const activeTokens = useMemo(() => {
    const activeStatuses = [
      "waiting",
      "next",
      "arrived",
      "processing",
    ];

    return queueTokens.filter((token) =>
      activeStatuses.includes(
        token.status?.toLowerCase() || ""
      )
    ).length;
  }, [queueTokens]);

  const acceptedProcurements = useMemo(() => {
    return bookings.filter(
      (booking) =>
        booking.status?.toLowerCase() === "accepted"
    ).length;
  }, [bookings]);

  const averageWaitTime = useMemo(() => {
    const values = queueTokens
      .map((token) =>
        Number(token.estimatedWaitMinutes)
      )
      .filter(
        (value) =>
          Number.isFinite(value) && value > 0
      );

    if (!values.length) return 0;

    return Math.round(
      values.reduce((sum, value) => sum + value, 0) /
        values.length
    );
  }, [queueTokens]);

  /* =========================================================
     DAILY PROCUREMENT TREND
  ========================================================= */

  const dailyTrend = useMemo(() => {
    const grouped: Record<
      string,
      {
        date: string;
        quantity: number;
        bookings: number;
      }
    > = {};

    bookings.forEach((booking) => {
      if (!booking.createdAt) return;

      const date = new Date(booking.createdAt);

      if (Number.isNaN(date.getTime())) return;

      const key = date.toISOString().split("T")[0];

      if (!grouped[key]) {
        grouped[key] = {
          date: key,
          quantity: 0,
          bookings: 0,
        };
      }

      grouped[key].quantity += Number(
        booking.approvedQuantityQuintals ??
          booking.submittedQuantityQuintals ??
          0
      );

      grouped[key].bookings += 1;
    });

    return Object.values(grouped)
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      )
      .slice(-7)
      .map((item) => ({
        ...item,
        label: new Date(
          `${item.date}T00:00:00`
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
      }));
  }, [bookings]);

  /* =========================================================
     CROP DISTRIBUTION
  ========================================================= */

  const cropDistribution = useMemo(() => {
    const grouped: Record<string, number> = {};

    bookings.forEach((booking) => {
      const crop = booking.crop?.trim() || "Other";

      grouped[crop] =
        (grouped[crop] || 0) +
        Number(
          booking.approvedQuantityQuintals ??
            booking.submittedQuantityQuintals ??
            0
        );
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [bookings]);

  const cropColors = [
    "#15803D",
    "#16A34A",
    "#65A30D",
    "#D97706",
    "#0F766E",
    "#64748B",
  ];

  /* =========================================================
     DISTRICT PERFORMANCE
  ========================================================= */

  const districtPerformance = useMemo(() => {
    const farmerDistrictMap: Record<string, string> = {};

    farmers.forEach((farmer) => {
      if (farmer.farmerId && farmer.district) {
        farmerDistrictMap[farmer.farmerId] =
          farmer.district;
      }

      if (farmer._id && farmer.district) {
        farmerDistrictMap[farmer._id] =
          farmer.district;
      }
    });

    const grouped: Record<string, number> = {};

    bookings.forEach((booking) => {
      const district =
        farmerDistrictMap[booking.farmerId || ""] ||
        "Unspecified";

      grouped[district] =
        (grouped[district] || 0) +
        Number(
          booking.approvedQuantityQuintals ??
            booking.submittedQuantityQuintals ??
            0
        );
    });

    return Object.entries(grouped)
      .map(([district, quantity]) => ({
        district,
        quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);
  }, [farmers, bookings]);

  /* =========================================================
     RECENT BOOKINGS
  ========================================================= */

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 6);
  }, [bookings]);

  /* =========================================================
     RECENT QUEUE
  ========================================================= */

  const recentQueue = useMemo(() => {
    return [...queueTokens]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [queueTokens]);

  /* =========================================================
     RECENT AUDIT
  ========================================================= */

  const recentAuditLogs = useMemo(() => {
    return [...auditLogs]
      .sort(
        (a, b) =>
          new Date(b.timestamp || 0).getTime() -
          new Date(a.timestamp || 0).getTime()
      )
      .slice(0, 5);
  }, [auditLogs]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-[#F5F7F3] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="animate-pulse space-y-6">
            <div className="h-40 rounded-[28px] bg-white" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 rounded-3xl bg-white"
                />
              ))}
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              <div className="h-97.5 rounded-3xl bg-white xl:col-span-2" />
              <div className="h-97.5 rounded-3xl bg-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-[#F5F7F3] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-[28px] border border-red-100 bg-white shadow-sm">
            <div className="border-b border-red-100 bg-red-50 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-red-900">
                    Dashboard data unavailable
                  </h2>

                  <p className="mt-1 text-xs text-red-600">
                    The administration APIs could not be
                    loaded.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="wrap-break-words font-mono text-xs text-slate-600">
                  {error}
                </p>
              </div>

              <button
                onClick={handleRefresh}
                className="
                  mt-5
                  inline-flex items-center gap-2
                  rounded-xl
                  bg-emerald-600
                  px-4 py-2.5
                  text-xs
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-emerald-700
                "
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN DASHBOARD
  ========================================================= */

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#F5F7F3]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">

        {/* TOP HEADER */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[30px]
            border border-slate-200/80
            bg-white
            shadow-[0_12px_40px_rgba(15,23,42,0.055)]
          "
        >
          <div
            className="
              absolute
              -right-25
              -top-32.5
              h-72
              w-72
              rounded-full
              bg-emerald-100/50
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-37.5
              left-[35%]
              h-72
              w-72
              rounded-full
              bg-teal-100/40
              blur-3xl
            "
          />

          <div className="relative px-5 py-6 sm:px-7 lg:px-8 lg:py-7">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              <span>Administration</span>

              <ChevronRight className="h-3 w-3" />

              <span className="text-emerald-600">
                Operations Dashboard
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1
                    className="
                      text-2xl
                      font-black
                      tracking-[-0.03em]
                      text-slate-950
                      sm:text-3xl
                      lg:text-[34px]
                    "
                  >
                    Mandi Operations
                  </h1>

                  <span
                    className="
                      inline-flex
                      items-center gap-1.5
                      rounded-full
                      border border-emerald-100
                      bg-emerald-50
                      px-2.5 py-1
                      text-[9px]
                      font-black
                      uppercase
                      tracking-wider
                      text-emerald-700
                    "
                  >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    System active
                  </span>
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  State agricultural procurement overview
                  across farmers, mandi centers, crop
                  procurement, payments and queue operations.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    Kharif 2026–27
                  </div>

                  <div className="h-3 w-px bg-slate-200" />

                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                    <Database className="h-3.5 w-3.5 text-slate-400" />
                    {lastUpdated
                      ? `Synced ${formatTime(
                          lastUpdated.toISOString()
                        )}`
                      : "Data synchronized"}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border border-slate-200
                    bg-white
                    px-4 py-2.5
                    text-xs
                    font-bold
                    text-slate-700
                    shadow-sm
                    transition-all
                    hover:border-emerald-200
                    hover:bg-emerald-50
                    hover:text-emerald-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />

                  {refreshing
                    ? "Refreshing"
                    : "Refresh data"}
                </button>

                <button
                  onClick={() => window.print()}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-slate-900
                    px-4 py-2.5
                    text-xs
                    font-bold
                    text-white
                    shadow-sm
                    transition-all
                    hover:bg-slate-800
                  "
                >
                  <Download className="h-3.5 w-3.5" />
                  Export report
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* KPI CARDS */}

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Registered Farmers"
            value={formatNumber(
              dashboard?.totalFarmers ?? farmers.length
            )}
            subtitle="Farmer records in system"
            icon={Users}
            accent="bg-emerald-500"
          />

          <StatCard
            title="Grain Procured"
            value={`${formatNumber(totalProcured)} qtl`}
            subtitle={`${formatNumber(
              acceptedProcurements
            )} accepted procurements`}
            icon={Wheat}
            accent="bg-lime-500"
          />

          <StatCard
            title="DBT Disbursed"
            value={formatCurrency(totalPaymentsAmount)}
            subtitle={`${formatNumber(
              payments.length
            )} payment records`}
            icon={CircleDollarSign}
            accent="bg-teal-500"
          />

          <StatCard
            title="Active Queue"
            value={formatNumber(activeTokens)}
            subtitle={`${formatNumber(
              queueTokens.length
            )} total token records`}
            icon={Clock3}
            accent="bg-amber-500"
          />

          <StatCard
            title="Mandi Centers"
            value={formatNumber(centers?.length || 0)}
            subtitle="Configured procurement centers"
            icon={Building2}
            accent="bg-blue-500"
          />
        </section>

        {/* QUICK OPERATIONS STRIP */}

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <PackageCheck className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Procurement
              </p>

              <p className="text-sm font-black text-slate-800">
                {formatNumber(bookings.length)}
              </p>
            </div>

            <ArrowUpRight className="ml-auto h-4 w-4 text-emerald-500" />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CreditCard className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Payments
              </p>

              <p className="text-sm font-black text-slate-800">
                {formatNumber(payments.length)}
              </p>
            </div>

            <ArrowUpRight className="ml-auto h-4 w-4 text-blue-500" />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Timer className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Average wait
              </p>

              <p className="text-sm font-black text-slate-800">
                {averageWaitTime
                  ? `${averageWaitTime} min`
                  : "—"}
              </p>
            </div>

            <Clock3 className="ml-auto h-4 w-4 text-amber-500" />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Audit events
              </p>

              <p className="text-sm font-black text-slate-800">
                {formatNumber(auditLogs.length)}
              </p>
            </div>

            <CheckCircle2 className="ml-auto h-4 w-4 text-violet-500" />
          </div>
        </section>

        {/* CHARTS */}

        <section className="mt-5 grid gap-5 xl:grid-cols-3">

          {/* Procurement Trend */}

          <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] sm:p-6 xl:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Activity className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-slate-900">
                      Procurement inflow
                    </h2>

                    <p className="text-[10px] font-medium text-slate-400">
                      Actual booking quantities recorded
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-500">
                Last 7 recorded days
              </div>
            </div>

            <div className="mt-7 h-61.25">
              {dailyTrend.length ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={dailyTrend}
                    margin={{
                      top: 5,
                      right: 5,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="procurementGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#16A34A"
                          stopOpacity={0.25}
                        />

                        <stop
                          offset="100%"
                          stopColor="#16A34A"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />

                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#94A3B8",
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#94A3B8",
                        fontSize: 10,
                      }}
                    />

                    {/* FIXED TOOLTIP */}

                    <Tooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid #E2E8F0",
                        boxShadow:
                          "0 15px 40px rgba(15,23,42,0.10)",
                        fontSize: 12,
                      }}
                      formatter={(value) => [
                        `${formatNumber(
                          Number(value ?? 0)
                        )} qtl`,
                        "Procurement",
                      ]}
                    />

                    <Area
                      type="monotone"
                      dataKey="quantity"
                      stroke="#16A34A"
                      strokeWidth={3}
                      fill="url(#procurementGradient)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        strokeWidth: 3,
                        stroke: "#fff",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50">
                  <div className="text-center">
                    <Activity className="mx-auto h-7 w-7 text-slate-300" />

                    <p className="mt-3 text-xs font-bold text-slate-500">
                      No procurement trend data
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Records will appear here when bookings
                      are available.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Crop Composition */}

          <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] sm:p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-50 text-lime-700">
                <Wheat className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Crop composition
                </h2>

                <p className="text-[10px] font-medium text-slate-400">
                  Procurement by crop
                </p>
              </div>
            </div>

            <div className="mt-4 h-61.25">
              {cropDistribution.length ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={cropDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={92}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {cropDistribution.map(
                        (_, index) => (
                          <Cell
                            key={`crop-${index}`}
                            fill={
                              cropColors[
                                index %
                                  cropColors.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    {/* FIXED TOOLTIP */}

                    <Tooltip
                      formatter={(value) => [
                        `${formatNumber(
                          Number(value ?? 0)
                        )} qtl`,
                        "Quantity",
                      ]}
                      contentStyle={{
                        borderRadius: 14,
                        border: "1px solid #E2E8F0",
                        fontSize: 11,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-xs text-slate-400">
                    No crop data available
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {cropDistribution
                .slice(0, 5)
                .map((crop, index) => {
                  const total = cropDistribution.reduce(
                    (sum, item) =>
                      sum + item.value,
                    0
                  );

                  const percentage = total
                    ? Math.round(
                        (crop.value / total) * 100
                      )
                    : 0;

                  return (
                    <div
                      key={crop.name}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            cropColors[
                              index %
                                cropColors.length
                            ],
                        }}
                      />

                      <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-slate-600">
                        {crop.name}
                      </span>

                      <span className="text-[10px] font-bold text-slate-400">
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* DISTRICT PERFORMANCE */}

        <section className="mt-5 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapPin className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-black text-slate-900">
                  District procurement
                </h2>

                <p className="text-[10px] font-medium text-slate-400">
                  Actual procurement volume mapped to farmer
                  districts
                </p>
              </div>
            </div>

            <div className="rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-500">
              Top districts by volume
            </div>
          </div>

          <div className="mt-6 h-70">
            {districtPerformance.length ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={districtPerformance}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 15,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#E5E7EB"
                  />

                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#94A3B8",
                      fontSize: 10,
                    }}
                  />

                  <YAxis
                    type="category"
                    dataKey="district"
                    axisLine={false}
                    tickLine={false}
                    width={90}
                    tick={{
                      fill: "#64748B",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${formatNumber(
                        Number(value ?? 0)
                      )} qtl`,
                      "Procurement",
                    ]}
                    contentStyle={{
                      borderRadius: 14,
                      border: "1px solid #E2E8F0",
                      fontSize: 11,
                    }}
                  />

                  <Bar
                    dataKey="quantity"
                    fill="#15803D"
                    radius={[0, 8, 8, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50">
                <p className="text-xs text-slate-400">
                  No district data available
                </p>
              </div>
            )}
          </div>
        </section>

        {/* LOWER OPERATIONS */}

        <section className="mt-5 grid gap-5 xl:grid-cols-3">

          {/* Recent Procurement */}

          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)] xl:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <PackageCheck className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-sm font-black text-slate-900">
                    Recent procurement
                  </h2>

                  <p className="text-[10px] text-slate-400">
                    Latest crop booking activity
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold text-slate-400">
                {bookings.length} total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-180">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Farmer
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Crop
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Quantity
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentBookings.length ? (
                    recentBookings.map((booking) => {
                      const status = getStatusStyle(
                        booking.status
                      );

                      const quantity =
                        Number(
                          booking.approvedQuantityQuintals ??
                            booking.submittedQuantityQuintals ??
                            0
                        );

                      return (
                        <tr
                          key={booking._id}
                          className="border-b border-slate-50 transition-colors hover:bg-slate-50/70"
                        >
                          <td className="px-5 py-4">
                            <div>
                              <p className="max-w-45 truncate text-xs font-bold text-slate-800">
                                {booking.farmerName ||
                                  "Unknown farmer"}
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-400">
                                {booking.tokenNumber
                                  ? `Token ${booking.tokenNumber}`
                                  : booking.farmerId ||
                                    "—"}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div>
                              <p className="text-xs font-bold text-slate-700">
                                {booking.crop || "—"}
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-400">
                                {booking.variety ||
                                  booking.centerName ||
                                  "—"}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-xs font-black text-slate-800">
                              {formatNumber(quantity)} qtl
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`
                                inline-flex
                                items-center gap-1.5
                                rounded-full
                                px-2.5 py-1
                                text-[9px]
                                font-bold
                                ring-1
                                ${status.className}
                              `}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                              />

                              {status.label}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div>
                              <p className="text-[10px] font-semibold text-slate-500">
                                {getTimeAgo(
                                  booking.createdAt
                                )}
                              </p>

                              <p className="mt-0.5 text-[9px] text-slate-400">
                                {formatDate(
                                  booking.createdAt
                                )}
                              </p>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-xs text-slate-400"
                      >
                        No procurement records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Queue */}

          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
            <div className="border-b border-slate-100 px-5 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Clock3 className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-slate-900">
                      Queue monitor
                    </h2>

                    <p className="text-[10px] text-slate-400">
                      Current token activity
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-50">
              {recentQueue.length ? (
                recentQueue.map((token) => {
                  const status = getStatusStyle(
                    token.status
                  );

                  return (
                    <div
                      key={token._id}
                      className="px-5 py-4 transition-colors hover:bg-slate-50/60"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-[10px] font-black text-white">
                          {token.tokenNumber ||
                            token.tokenCode ||
                            "—"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-slate-800">
                            {token.farmerName ||
                              "Unknown farmer"}
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">
                              {token.crop ||
                                "Crop not specified"}
                            </span>

                            <span className="h-1 w-1 rounded-full bg-slate-300" />

                            <span className="text-[10px] text-slate-400">
                              {token.centerId || "Mandi"}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`
                                rounded-full
                                px-2 py-0.5
                                text-[8px]
                                font-bold
                                ${status.className}
                              `}
                            >
                              {status.label}
                            </span>

                            {token.estimatedWaitMinutes ? (
                              <span className="text-[9px] font-semibold text-slate-400">
                                ~
                                {
                                  token.estimatedWaitMinutes
                                }{" "}
                                min
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <ChevronRight className="mt-1 h-4 w-4 text-slate-300" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-12 text-center">
                  <Clock3 className="mx-auto h-7 w-7 text-slate-300" />

                  <p className="mt-3 text-xs font-bold text-slate-500">
                    Queue is clear
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    No token records are currently available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* MANDI NETWORK */}

        <section className="mt-5 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Building2 className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Mandi network
                </h2>

                <p className="text-[10px] text-slate-400">
                  Configured procurement centers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5">
              <Database className="h-3 w-3 text-slate-400" />

              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                {centers?.length || 0} centers
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-200">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Center
                  </th>

                  <th className="px-6 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Location
                  </th>

                  <th className="px-6 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Queue
                  </th>

                  <th className="px-6 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Procurement
                  </th>

                  <th className="px-6 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Data status
                  </th>
                </tr>
              </thead>

              <tbody>
                {centers?.length ? (
                  centers.slice(0, 10).map(
                    (center: any, index: number) => {
                      const centerName =
                        center.name ||
                        center.centerName ||
                        center.centerId ||
                        `Mandi Center ${index + 1}`;

                      const centerId =
                        center._id ||
                        center.centerId ||
                        center.id ||
                        "";

                      const centerQueue =
                        queueTokens.filter(
                          (token) =>
                            token.centerId === centerId
                        ).length;

                      const centerBookings =
                        bookings.filter(
                          (booking) =>
                            booking.centerId === centerId
                        ).length;

                      return (
                        <tr
                          key={
                            centerId ||
                            `${centerName}-${index}`
                          }
                          className="border-b border-slate-50 transition-colors hover:bg-slate-50/60"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <Building2 className="h-4 w-4" />
                              </div>

                              <div>
                                <p className="text-xs font-bold text-slate-800">
                                  {centerName}
                                </p>

                                <p className="mt-0.5 text-[9px] text-slate-400">
                                  {center.centerCode ||
                                    centerId ||
                                    "Center"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3 w-3 text-slate-300" />

                              <span className="text-[10px] font-semibold text-slate-500">
                                {center.district ||
                                  center.location ||
                                  center.address ||
                                  "Location available"}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-xs font-black text-slate-800">
                              {formatNumber(centerQueue)}
                            </span>

                            <span className="ml-1 text-[9px] text-slate-400">
                              tokens
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-xs font-black text-slate-800">
                              {formatNumber(
                                centerBookings
                              )}
                            </span>

                            <span className="ml-1 text-[9px] text-slate-400">
                              records
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className="
                                inline-flex
                                items-center gap-1.5
                                rounded-full
                                bg-emerald-50
                                px-2.5 py-1
                                text-[9px]
                                font-bold
                                text-emerald-700
                                ring-1
                                ring-emerald-100
                              "
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                              Data available
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center"
                    >
                      <Building2 className="mx-auto h-7 w-7 text-slate-300" />

                      <p className="mt-3 text-xs font-bold text-slate-500">
                        No mandi centers available
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Center information will appear when
                        configured.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* AUDIT + SYSTEM SUMMARY */}

        <section className="mt-5 grid gap-5 lg:grid-cols-3">

          {/* Audit */}

          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)] lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-sm font-black text-slate-900">
                    Security & audit activity
                  </h2>

                  <p className="text-[10px] text-slate-400">
                    Latest administrative events
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-bold text-violet-600">
                {auditLogs.length} events
              </span>
            </div>

            <div className="divide-y divide-slate-50">
              {recentAuditLogs.length ? (
                recentAuditLogs.map((log, index) => (
                  <div
                    key={
                      log.logId ||
                      `${log.timestamp}-${index}`
                    }
                    className="flex gap-3 px-5 py-4 sm:px-6"
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-100">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </div>

                      {index <
                        recentAuditLogs.length - 1 && (
                        <div className="absolute top-9 h-full w-px bg-slate-100" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 pb-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs font-bold text-slate-800">
                          {log.action ||
                            "Administrative activity"}
                        </p>

                        <span className="text-[9px] font-medium text-slate-400">
                          {getTimeAgo(log.timestamp)}
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] leading-5 text-slate-400">
                        {log.details ||
                          log.targetEntity ||
                          "System activity recorded."}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {log.user && (
                          <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[8px] font-bold text-slate-500">
                            {log.user}
                          </span>
                        )}

                        {log.role && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-600">
                            {log.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <ShieldCheck className="mx-auto h-7 w-7 text-slate-300" />

                  <p className="mt-3 text-xs font-bold text-slate-500">
                    No audit activity
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Administrative events will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* System health */}

          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-950 shadow-[0_12px_40px_rgba(15,23,42,0.12)]">
            <div className="relative p-6">
              <div className="absolute right-15 top-15 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-emerald-400 ring-1 ring-white/10">
                    <Activity className="h-4 w-4" />
                  </div>

                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Operational
                  </span>
                </div>

                <h2 className="mt-6 text-lg font-black tracking-tight text-white">
                  KisanSetu
                  <br />
                  administration
                </h2>

                <p className="mt-2 text-[11px] leading-5 text-slate-400">
                  Centralized monitoring of agricultural
                  procurement operations and administrative
                  activity.
                </p>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/4 px-3 py-2.5">
                    <span className="text-[10px] font-semibold text-slate-400">
                      Farmer records
                    </span>

                    <span className="text-[10px] font-black text-emerald-400">
                      {formatNumber(farmers.length)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/4 px-3 py-2.5">
                    <span className="text-[10px] font-semibold text-slate-400">
                      Procurement records
                    </span>

                    <span className="text-[10px] font-black text-emerald-400">
                      {formatNumber(bookings.length)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/4 px-3 py-2.5">
                    <span className="text-[10px] font-semibold text-slate-400">
                      Payment records
                    </span>

                    <span className="text-[10px] font-black text-emerald-400">
                      {formatNumber(payments.length)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/4 px-3 py-2.5">
                    <span className="text-[10px] font-semibold text-slate-400">
                      Queue records
                    </span>

                    <span className="text-[10px] font-black text-emerald-400">
                      {formatNumber(queueTokens.length)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                  <span className="text-[10px] font-semibold text-slate-400">
                    Administrative data synchronized
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER SUMMARY */}

        <div className="mt-6 flex flex-col gap-2 border-t border-slate-200/70 py-5 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            KisanSetu Administration • Agricultural
            Procurement Management
          </p>

          <div className="flex items-center gap-2">
            <span>
              Last synchronization:
            </span>

            <span className="font-bold text-slate-500">
              {lastUpdated
                ? lastUpdated.toLocaleString("en-IN")
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* PRINT STYLES */}

      <style>
        {`
          @media print {
            header {
              position: static !important;
            }

            button {
              display: none !important;
            }

            body {
              background: white !important;
            }

            .shadow-sm,
            .shadow-md,
            .shadow-lg {
              box-shadow: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;