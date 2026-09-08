import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from '../../components/adminPortal/AdminLayout';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Users,
  Wheat,
  CreditCard,
  Clock,
  Building2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";



/* =========================================================
   TYPES
========================================================= */

interface Farmer {
  _id?: string;
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
  _id?: string;
  procurementId?: string;
  tokenNumber?: number;
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
  _id?: string;
  paymentId?: string;
  transactionId?: string;
  farmerId?: string;
  farmerName?: string;
  tokenNumber?: number;
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
  _id?: string;
  tokenNumber?: number;
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
   API HELPER
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/*
  We try several common localStorage keys so this dashboard
  can work with your existing Admin authentication setup.
*/
const getAdminToken = (): string | null => {
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

  console.log("🔐 ADMIN TOKEN:", token);
  console.log("🌐 REQUEST:", endpoint);

  if (!token) {
    throw new Error("Admin authentication token not found.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  console.log("📤 REQUEST HEADERS:", headers);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    );
  }

  return data;
};

/* =========================================================
   HELPERS
========================================================= */

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-IN").format(value || 0);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const formatDate = (date?: string) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTimeAgo = (date?: string) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  const diff = Date.now() - parsed.getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";

  if (minutes < 60) {
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days > 1 ? "s" : ""} ago`;
};

/* =========================================================
   COMPONENT
========================================================= */

export const AdminDashboard: React.FC = () => {
  const { centers } = useAuth();

  const [selectedSeason, setSelectedSeason] =
    useState("Kharif 2026-27");

  const [dashboard, setDashboard] =
    useState<DashboardSummary | null>(null);

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [queueTokens, setQueueTokens] = useState<QueueToken[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH ALL ADMIN DATA
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
        dashboardResponse?.data || dashboardResponse?.dashboard || null
      );

      setFarmers(farmersResponse?.farmers || []);

      setBookings(bookingsResponse?.bookings || []);

      setPayments(paymentsResponse?.payments || []);

      setQueueTokens(queueResponse?.tokens || []);

      setAuditLogs(auditResponse?.logs || []);
    } catch (err) {
      console.error("Admin dashboard error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load admin dashboard data."
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
     CALCULATE REAL STATISTICS
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
    return queueTokens.filter((token) =>
      ["waiting", "next", "arrived", "processing"].includes(
        token.status || ""
      )
    ).length;
  }, [queueTokens]);

  const acceptedProcurements = useMemo(() => {
    return bookings.filter(
      (booking) => booking.status === "Accepted"
    ).length;
  }, [bookings]);

  const averageWaitTime = useMemo(() => {
    const waiting = queueTokens.filter(
      (token) =>
        typeof token.estimatedWaitMinutes === "number"
    );

    if (!waiting.length) return 0;

    const total = waiting.reduce(
      (sum, token) =>
        sum + Number(token.estimatedWaitMinutes || 0),
      0
    );

    return Math.round(total / waiting.length);
  }, [queueTokens]);

  /* =========================================================
     DAILY PROCUREMENT CHART
  ========================================================= */

  const dailyTrendData = useMemo(() => {
    const grouped: Record<
      string,
      {
        date: string;
        total: number;
        paddy: number;
        wheat: number;
      }
    > = {};

    bookings.forEach((booking) => {
      if (!booking.createdAt) return;

      const dateObject = new Date(booking.createdAt);

      if (Number.isNaN(dateObject.getTime())) return;

      const dateKey = dateObject.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          total: 0,
          paddy: 0,
          wheat: 0,
        };
      }

      const quantity = Number(
        booking.approvedQuantityQuintals ??
          booking.submittedQuantityQuintals ??
          0
      );

      grouped[dateKey].total += quantity;

      const crop = (booking.crop || "").toLowerCase();

      if (
        crop.includes("paddy") ||
        crop.includes("rice")
      ) {
        grouped[dateKey].paddy += quantity;
      }

      if (crop.includes("wheat")) {
        grouped[dateKey].wheat += quantity;
      }
    });

    return Object.values(grouped)
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      )
      .slice(-7);
  }, [bookings]);

  /* =========================================================
     CROP DISTRIBUTION
  ========================================================= */

  const cropShareData = useMemo(() => {
    const cropTotals: Record<string, number> = {};

    bookings.forEach((booking) => {
      const crop = booking.crop || "Others";

      const quantity = Number(
        booking.approvedQuantityQuintals ??
          booking.submittedQuantityQuintals ??
          0
      );

      cropTotals[crop] =
        (cropTotals[crop] || 0) + quantity;
    });

    const total = Object.values(cropTotals).reduce(
      (sum, value) => sum + value,
      0
    );

    if (!total) return [];

    const colors = [
      "#1B4D2A",
      "#3F7442",
      "#D99A32",
      "#8EB773",
      "#6B8E23",
    ];

    return Object.entries(cropTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value], index) => ({
        name,
        value: Number(((value / total) * 100).toFixed(1)),
        color: colors[index % colors.length],
      }));
  }, [bookings]);

  /* =========================================================
     DISTRICT PERFORMANCE
  ========================================================= */

  const districtPerformanceData = useMemo(() => {
    const districts: Record<
      string,
      {
        district: string;
        actual: number;
      }
    > = {};

    bookings.forEach((booking) => {
      const farmer = farmers.find(
        (item) =>
          item.farmerId === booking.farmerId
      );

      const district =
        farmer?.district || "Unknown";

      const quantity = Number(
        booking.approvedQuantityQuintals ??
          booking.submittedQuantityQuintals ??
          0
      );

      if (!districts[district]) {
        districts[district] = {
          district,
          actual: 0,
        };
      }

      districts[district].actual += quantity;
    });

    return Object.values(districts)
      .sort((a, b) => b.actual - a.actual)
      .slice(0, 5)
      .map((item) => ({
        district: item.district,
        actual: item.actual,
        target: Math.round(item.actual * 1.15),
      }));
  }, [bookings, farmers]);

  /* =========================================================
     RECENT AUDIT LOGS
  ========================================================= */

  const recentAuditLogs = useMemo(() => {
    return [...auditLogs]
      .sort((a, b) => {
        const dateA = a.timestamp
          ? new Date(a.timestamp).getTime()
          : 0;

        const dateB = b.timestamp
          ? new Date(b.timestamp).getTime()
          : 0;

        return dateB - dateA;
      })
      .slice(0, 10);
  }, [auditLogs]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <>
        

        <div className="min-h-screen bg-[#FCFBF7] flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-10 h-10 text-[#1B4D2A] animate-spin mx-auto mb-4" />

            <h2 className="font-serif text-xl font-bold text-[#123D24]">
              Loading Admin Dashboard
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Fetching live data from MongoDB...
            </p>
          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <>
      

      <div className="min-h-screen py-8 bg-[#FCFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ERROR MESSAGE */}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />

              <div className="flex-1">
                <h3 className="font-bold text-red-800">
                  Failed to load dashboard data
                </h3>

                <p className="text-sm text-red-700 mt-1">
                  {error}
                </p>
              </div>

              <button
                onClick={handleRefresh}
                className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          )}

          {/* ADMIN HEADER */}

          <div className="bg-[#123D24] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#256035] mb-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-2xl bg-[#1B4D2A] border-2 border-[#8EB773] flex items-center justify-center font-serif text-2xl font-bold text-white shadow-md shrink-0">
                  AB
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">

                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      State Agricultural Procurement Analytics
                    </h1>

                    <span className="px-2.5 py-0.5 rounded-full bg-[#1B4D2A] text-[#8EB773] text-xs font-bold border border-[#256035]">
                      State Admin Console
                    </span>

                  </div>

                  <p className="text-xs text-gray-300 mt-1">
                    Department of Agriculture & Food Supplies •
                    Live Mandi APMC Network
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3 flex-wrap">

                <select
                  value={selectedSeason}
                  onChange={(e) =>
                    setSelectedSeason(e.target.value)
                  }
                  className="p-2.5 rounded-xl bg-[#1B4D2A] text-white border border-[#256035] text-xs font-bold focus:outline-none"
                >
                  <option value="Kharif 2026-27">
                    Season: Kharif 2026-27
                  </option>

                  <option value="Rabi 2025-26">
                    Season: Rabi 2025-26
                  </option>
                </select>

                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-4 py-2.5 rounded-xl bg-[#1B4D2A] text-white border border-[#8EB773] text-xs font-bold hover:bg-[#256035] transition-colors flex items-center gap-2"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />

                  Refresh
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-[#8EB773] text-[#123D24] text-xs font-bold hover:bg-[#B7D2A2] transition-colors"
                >
                  Export PDF Report
                </button>

              </div>

            </div>

            {/* METRICS */}

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-[#256035] text-xs">

              {/* FARMERS */}

              <div className="bg-[#1B4D2A] p-3.5 rounded-2xl border border-[#256035]">

                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-gray-400 uppercase">
                    Registered Farmers
                  </span>

                  <Users className="w-4 h-4 text-[#8EB773]" />
                </div>

                <div className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {formatNumber(
                    dashboard?.totalFarmers ??
                      farmers.length
                  )}
                </div>

                <span className="text-[10px] text-[#8EB773]">
                  Live MongoDB records
                </span>

              </div>

              {/* PROCUREMENT */}

              <div className="bg-[#1B4D2A] p-3.5 rounded-2xl border border-[#256035]">

                <div className="flex justify-between items-start">

                  <span className="text-[10px] text-gray-400 uppercase">
                    Total Grain Procured
                  </span>

                  <Wheat className="w-4 h-4 text-[#8EB773]" />

                </div>

                <div className="font-serif text-xl sm:text-2xl font-bold text-[#8EB773] mt-0.5">
                  {formatNumber(
                    Math.round(totalProcured)
                  )}{" "}
                  Qtl
                </div>

                <span className="text-[10px] text-gray-300">
                  {formatNumber(
                    dashboard?.completedProcurements ??
                      acceptedProcurements
                  )}{" "}
                  accepted procurements
                </span>

              </div>

              {/* PAYMENTS */}

              <div className="bg-[#1B4D2A] p-3.5 rounded-2xl border border-[#256035]">

                <div className="flex justify-between items-start">

                  <span className="text-[10px] text-gray-400 uppercase">
                    PFMS DBT Disbursed
                  </span>

                  <CreditCard className="w-4 h-4 text-[#8EB773]" />

                </div>

                <div className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {formatCurrency(
                    totalPaymentsAmount
                  )}
                </div>

                <span className="text-[10px] text-[#8EB773]">
                  {formatNumber(payments.length)} payment records
                </span>

              </div>

              {/* MANDIS */}

              <div className="bg-[#1B4D2A] p-3.5 rounded-2xl border border-[#256035]">

                <div className="flex justify-between items-start">

                  <span className="text-[10px] text-gray-400 uppercase">
                    Active APMC Mandis
                  </span>

                  <Building2 className="w-4 h-4 text-[#8EB773]" />

                </div>

                <div className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {formatNumber(centers?.length || 0)}
                </div>

                <span className="text-[10px] text-gray-300">
                  Live center records
                </span>

              </div>

              {/* WAIT */}

              <div className="bg-[#1B4D2A] p-3.5 rounded-2xl border border-[#256035] col-span-2 lg:col-span-1">

                <div className="flex justify-between items-start">

                  <span className="text-[10px] text-gray-400 uppercase">
                    Avg Farmer Wait Time
                  </span>

                  <Clock className="w-4 h-4 text-[#D99A32]" />

                </div>

                <div className="font-serif text-xl sm:text-2xl font-bold text-[#D99A32] mt-0.5">
                  {averageWaitTime} Mins
                </div>

                <span className="text-[10px] text-[#8EB773]">
                  {activeTokens} active tokens
                </span>

              </div>

            </div>
          </div>

          {/* CHART GRID */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">

            {/* DAILY PROCUREMENT */}

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-xs">

              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#123D24]">
                    Daily Procurement Inflow
                  </h3>

                  <p className="text-xs text-gray-500">
                    Based on live procurement records
                  </p>
                </div>

                <span className="text-xs font-bold text-[#3F7442] bg-[#E8EFE1] px-2.5 py-1 rounded-full">
                  Live Data
                </span>

              </div>

              <div className="h-72 w-full">

                {dailyTrendData.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <AreaChart data={dailyTrendData}>

                      <defs>

                        <linearGradient
                          id="colorTotal"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >

                          <stop
                            offset="5%"
                            stopColor="#1B4D2A"
                            stopOpacity={0.4}
                          />

                          <stop
                            offset="95%"
                            stopColor="#1B4D2A"
                            stopOpacity={0}
                          />

                        </linearGradient>

                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#F0EFEA"
                      />

                      <XAxis
                        dataKey="date"
                        stroke="#888888"
                        fontSize={11}
                      />

                      <YAxis
                        stroke="#888888"
                        fontSize={11}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#123D24",
                          color: "#fff",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                        labelStyle={{
                          color: "#8EB773",
                          fontWeight: "bold",
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#1B4D2A"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        name="Total Quintals"
                      />

                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-400">
                    No procurement data available yet.
                  </div>
                )}

              </div>

            </div>

            {/* CROP SHARE */}

            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-xs">

              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#123D24]">
                    Crop Composition
                  </h3>

                  <p className="text-xs text-gray-500">
                    Share of total procurement volume
                  </p>
                </div>

              </div>

              <div className="h-56 w-full">

                {cropShareData.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>

                      <Pie
                        data={cropShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >

                        {cropShareData.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                            />
                          )
                        )}

                      </Pie>

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#123D24",
                          color: "#fff",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      />

                      <Legend
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "11px",
                          paddingTop: "10px",
                        }}
                      />

                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-400">
                    No crop data available yet.
                  </div>
                )}

              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-gray-100">

                <div className="p-2 rounded-xl bg-[#FCFBF7] border border-[#E8EFE1]">

                  <span className="text-gray-500">
                    Procurement Records:
                  </span>

                  <span className="font-bold text-[#123D24] block">
                    {formatNumber(bookings.length)}
                  </span>

                </div>

                <div className="p-2 rounded-xl bg-[#FCFBF7] border border-[#E8EFE1]">

                  <span className="text-gray-500">
                    Payment Records:
                  </span>

                  <span className="font-bold text-[#123D24] block">
                    {formatNumber(payments.length)}
                  </span>

                </div>

              </div>

            </div>
          </div>

          {/* DISTRICT PERFORMANCE */}

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-xs mb-8">

            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">

              <div>

                <h3 className="font-serif text-lg font-bold text-[#123D24]">
                  District-Wise Procurement Performance
                </h3>

                <p className="text-xs text-gray-500">
                  Calculated from live procurement records
                </p>

              </div>

              <span className="text-xs font-bold text-[#3F7442] bg-[#E8EFE1] px-2.5 py-1 rounded-full">
                MongoDB
              </span>

            </div>

            <div className="h-72 w-full">

              {districtPerformanceData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={districtPerformanceData}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#F0EFEA"
                    />

                    <XAxis
                      dataKey="district"
                      stroke="#888888"
                      fontSize={11}
                    />

                    <YAxis
                      stroke="#888888"
                      fontSize={11}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#123D24",
                        color: "#fff",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />

                    <Legend
                      wrapperStyle={{
                        fontSize: "12px",
                      }}
                    />

                    <Bar
                      dataKey="target"
                      fill="#D3E0C9"
                      radius={[6, 6, 0, 0]}
                      name="Calculated Target"
                    />

                    <Bar
                      dataKey="actual"
                      fill="#1B4D2A"
                      radius={[6, 6, 0, 0]}
                      name="Actual Procured"
                    />

                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                  No district procurement data available.
                </div>
              )}

            </div>

          </div>

          {/* CENTER STATUS */}

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-xs">

            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">

              <div>

                <h3 className="font-serif text-lg font-bold text-[#123D24]">
                  Mandi APMC Center Operational Status
                </h3>

                <p className="text-xs text-gray-500">
                  Live center information from authentication context
                </p>

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs">

                <thead className="bg-[#F7F5EC] text-gray-600 uppercase text-[10px] tracking-wider">

                  <tr>

                    <th className="p-3.5 rounded-l-xl">
                      Center Name
                    </th>

                    <th className="p-3.5">
                      District
                    </th>

                    <th className="p-3.5">
                      Today's Capacity
                    </th>

                    <th className="p-3.5">
                      Available Slots
                    </th>

                    <th className="p-3.5">
                      Active Token
                    </th>

                    <th className="p-3.5">
                      Avg Wait Time
                    </th>

                    <th className="p-3.5 rounded-r-xl">
                      Audit Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {centers && centers.length > 0 ? (
                    centers.map((c: any) => (

                      <tr
                        key={c.id}
                        className="hover:bg-[#FCFBF7]"
                      >

                        <td className="p-3.5 font-bold text-[#123D24]">
                          {c.name}
                        </td>

                        <td className="p-3.5 text-gray-600">
                          {c.district || "—"}
                        </td>

                        <td className="p-3.5 text-gray-700">
                          {c.totalCapacityQuintals ?? 0} Qtl
                        </td>

                        <td className="p-3.5 font-bold text-[#3F7442]">
                          {c.availableSlotsToday ?? 0} Slots Open
                        </td>

                        <td className="p-3.5 font-serif font-black text-sm text-[#123D24]">
                          #{c.currentServingToken ?? "—"}
                        </td>

                        <td className="p-3.5 text-[#D99A32] font-semibold">
                          {c.estimatedWaitTimeMinutes ?? 0} mins
                        </td>

                        <td className="p-3.5">

                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8EFE1] text-[#3F8F55]">

                            <CheckCircle2 className="w-3.5 h-3.5" />

                            <span>Online</span>

                          </span>

                        </td>

                      </tr>

                    ))
                  ) : (

                    <tr>

                      <td
                        colSpan={7}
                        className="p-8 text-center text-gray-400"
                      >
                        No center data available.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* AUDIT LOGS */}

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-xs mt-8">

            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">

              <div>

                <h3 className="font-serif text-lg font-bold text-[#123D24] flex items-center gap-2">

                  <ShieldCheck className="w-5 h-5 text-emerald-600" />

                  System Audit & Compliance Logs

                </h3>

                <p className="text-xs text-gray-500">
                  Live audit records from MongoDB
                </p>

              </div>

              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200">
                Audit Mode: ACTIVE
              </span>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs">

                <thead className="bg-[#F7F5EC] text-gray-600 uppercase text-[10px] tracking-wider">

                  <tr>

                    <th className="p-3.5 rounded-l-xl">
                      Log ID
                    </th>

                    <th className="p-3.5">
                      User
                    </th>

                    <th className="p-3.5">
                      Role
                    </th>

                    <th className="p-3.5">
                      Action Executed
                    </th>

                    <th className="p-3.5">
                      Target Entity
                    </th>

                    <th className="p-3.5">
                      Action Details
                    </th>

                    <th className="p-3.5 rounded-r-xl">
                      Timestamp
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100 font-sans">

                  {recentAuditLogs.length > 0 ? (
                    recentAuditLogs.map((log, index) => (

                      <tr
                        key={
                          log.logId ||
                          `${log.action}-${index}`
                        }
                        className="hover:bg-[#FCFBF7]"
                      >

                        <td className="p-3.5 font-mono text-slate-500">
                          {log.logId || "—"}
                        </td>

                        <td className="p-3.5 font-bold text-slate-900">
                          {log.user || "—"}
                        </td>

                        <td className="p-3.5">

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.role === "farmer"
                                ? "bg-emerald-100 text-emerald-800"
                                : log.role === "officer"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {(log.role || "SYSTEM").toUpperCase()}
                          </span>

                        </td>

                        <td className="p-3.5 font-semibold text-slate-800">
                          {log.action || "—"}
                        </td>

                        <td className="p-3.5 font-mono text-emerald-700 font-bold">
                          {log.targetEntity || "—"}
                        </td>

                        <td className="p-3.5 text-slate-600">
                          {log.details || "—"}
                        </td>

                        <td className="p-3.5 text-slate-500">
                          {getTimeAgo(log.timestamp)}
                        </td>

                      </tr>

                    ))
                  ) : (

                    <tr>

                      <td
                        colSpan={7}
                        className="p-8 text-center text-gray-400"
                      >
                        No audit logs found in MongoDB.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;