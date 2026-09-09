import React, { useEffect, useMemo, useState } from "react";

import {
  IndianRupee,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock3,
  AlertCircle,
  CreditCard,
  ArrowUpRight,
  WalletCards,
  Wheat,
  User,
  MapPin,
  CalendarDays,
  X,
  ShieldCheck,
  Banknote,
  ChevronRight,
  CircleDollarSign,
  ReceiptIndianRupee,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type PaymentStatus =
  | "Initiated"
  | "PFMS Verified"
  | "Treasury Cleared"
  | "Disbursed to Bank"
  | "On Hold"
  | "Failed";

interface Payment {
  _id?: string;

  paymentId: string;
  transactionId: string;
  pfmsReferenceNo: string;

  procurementId?: string;

  farmerId: string;
  farmerName: string;

  tokenNumber: number;

  centerName: string;

  crop: string;

  grossWeightQuintals: number;
  mspRatePerQuintal: number;

  grossAmount: number;
  deductions: number;
  netPayable: number;

  status: PaymentStatus;
  statusStageIndex: number;

  bankName: string;
  accountLast4: string;
  ifscCode: string;

  procuredDate: string;

  estimatedReleaseDate?: string;
  disbursedDate?: string;
  utrNumber?: string;

  createdAt: string;
}

interface Booking {
  _id: string;

  procurementId: string;

  tokenNumber: number;

  farmerId: string;
  farmerName: string;

  centerId: string;
  centerName: string;

  crop: string;
  variety?: string;

  submittedQuantityQuintals: number;
  approvedQuantityQuintals?: number;
  rejectedQuantityQuintals?: number;

  pricePerQuintal?: number;
  estimatedAmount?: number;

  harvestDate?: string;

  lotNumber: string;

  qualityGrade?: string;

  status: string;

  createdAt?: string;
}

interface PaymentsResponse {
  success: boolean;
  count: number;
  payments: Payment[];
  message?: string;
}

interface BookingsResponse {
  success?: boolean;
  count?: number;
  bookings: Booking[];
  message?: string;
}

/* =========================================================
   API
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/* =========================================================
   COMPONENT
========================================================= */

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const [creatingPaymentId, setCreatingPaymentId] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState("");

  /* =========================================================
     ADMIN TOKEN
  ========================================================= */

  const getAdminToken = () => {
    return (
      localStorage.getItem("kisansetu_admin_token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("admin_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      ""
    );
  };

  /* =========================================================
     FETCH BOOKINGS + PAYMENTS
  ========================================================= */

  const fetchData = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = getAdminToken();

      const headers = {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      };

      const [paymentsResponse, bookingsResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/payments`, {
            method: "GET",
            headers,
          }),

          fetch(`${API_BASE_URL}/api/admin/crop-bookings`, {
            method: "GET",
            headers,
          }),
        ]);

      const paymentsData: PaymentsResponse =
        await paymentsResponse.json();

      const bookingsData: BookingsResponse =
        await bookingsResponse.json();

      if (!paymentsResponse.ok) {
        throw new Error(
          paymentsData.message ||
            "Failed to fetch payment data.",
        );
      }

      if (!bookingsResponse.ok) {
        throw new Error(
          bookingsData.message ||
            "Failed to fetch crop bookings.",
        );
      }

      if (paymentsData.success === false) {
        throw new Error(
          paymentsData.message ||
            "Unable to load payments.",
        );
      }

      setPayments(paymentsData.payments || []);

      setBookings(bookingsData.bookings || []);
    } catch (err) {
      console.error("❌ Payment page fetch error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading payment data.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchData();
  }, []);

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-IN").format(
      Number(value) || 0,
    );
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getBookingQuantity = (booking: Booking) => {
    return (
      booking.approvedQuantityQuintals ??
      booking.submittedQuantityQuintals ??
      0
    );
  };

  const getBookingAmount = (booking: Booking) => {
    if (
      typeof booking.estimatedAmount === "number" &&
      booking.estimatedAmount >= 0
    ) {
      return booking.estimatedAmount;
    }

    const quantity = getBookingQuantity(booking);

    const price = booking.pricePerQuintal || 0;

    return Number((quantity * price).toFixed(2));
  };

  /* =========================================================
     MATCH PAYMENT WITH BOOKING
  ========================================================= */

  const getPaymentForBooking = (booking: Booking) => {
    return payments.find(
      (payment) =>
        payment.procurementId === booking.procurementId,
    );
  };

  /* =========================================================
     BOOKING PAYMENT DATA
  ========================================================= */

  const bookingPaymentRows = useMemo(() => {
    return bookings.map((booking) => {
      const payment = getPaymentForBooking(booking);

      return {
        booking,
        payment,
        quantity: getBookingQuantity(booking),
        amount: getBookingAmount(booking),
      };
    });
  }, [bookings, payments]);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredRows = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return bookingPaymentRows.filter(
      ({ booking, payment }) => {
        const matchesSearch =
          !search ||
          booking.procurementId
            ?.toLowerCase()
            .includes(search) ||
          booking.farmerName
            ?.toLowerCase()
            .includes(search) ||
          booking.farmerId
            ?.toLowerCase()
            .includes(search) ||
          booking.crop
            ?.toLowerCase()
            .includes(search) ||
          booking.centerName
            ?.toLowerCase()
            .includes(search) ||
          booking.lotNumber
            ?.toLowerCase()
            .includes(search) ||
          payment?.paymentId
            ?.toLowerCase()
            .includes(search) ||
          payment?.transactionId
            ?.toLowerCase()
            .includes(search);

        let paymentStatus = "Pending";

        if (payment) {
          paymentStatus = payment.status;
        }

        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Pending" &&
            !payment) ||
          paymentStatus === statusFilter;

        return matchesSearch && matchesStatus;
      },
    );
  }, [
    bookingPaymentRows,
    searchTerm,
    statusFilter,
  ]);

  /* =========================================================
     SUMMARY
  ========================================================= */

  const totalBookingValue = useMemo(() => {
    return bookingPaymentRows.reduce(
      (sum, row) => sum + row.amount,
      0,
    );
  }, [bookingPaymentRows]);

  const paidAmount = useMemo(() => {
    return bookingPaymentRows
      .filter(
        ({ payment }) =>
          payment?.status === "Disbursed to Bank",
      )
      .reduce((sum, row) => sum + row.amount, 0);
  }, [bookingPaymentRows]);

  const pendingAmount = useMemo(() => {
    return bookingPaymentRows
      .filter(
        ({ payment }) =>
          !payment ||
          (payment.status !== "Disbursed to Bank" &&
            payment.status !== "Failed"),
      )
      .reduce((sum, row) => sum + row.amount, 0);
  }, [bookingPaymentRows]);

  const pendingBookings = bookingPaymentRows.filter(
    ({ payment }) => !payment,
  ).length;

  const failedPayments = payments.filter(
    (payment) => payment.status === "Failed",
  ).length;

  /* =========================================================
     CREATE PAYMENT
  ========================================================= */

  const initiatePayment = async (booking: Booking) => {
    try {
      setCreatingPaymentId(booking.procurementId);
      setError("");
      setSuccessMessage("");

      const token = getAdminToken();

      const quantity = getBookingQuantity(booking);

      const price =
        booking.pricePerQuintal || 0;

      const response = await fetch(
        `${API_BASE_URL}/api/admin/payments`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },

          body: JSON.stringify({
            procurementId: booking.procurementId,

            farmerId: booking.farmerId,

            farmerName: booking.farmerName,

            tokenNumber: booking.tokenNumber,

            centerName: booking.centerName,

            crop: booking.crop,

            grossWeightQuintals: quantity,

            mspRatePerQuintal: price,

            bankName: "Pending Bank Verification",

            accountLast4: "XXXX",

            ifscCode: "PENDING",

            procuredDate:
              booking.harvestDate ||
              new Date().toISOString().split("T")[0],
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to initiate payment.",
        );
      }

      setSuccessMessage(
        `Payment initiated successfully for ${booking.procurementId}.`,
      );

      setSelectedBooking(null);

      await fetchData(true);
    } catch (err) {
      console.error("❌ Create payment error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to initiate payment.",
      );
    } finally {
      setCreatingPaymentId(null);
    }
  };

  /* =========================================================
     STATUS STYLE
  ========================================================= */

  const getStatusStyle = (
    status?: PaymentStatus,
  ) => {
    switch (status) {
      case "Disbursed to Bank":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "PFMS Verified":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Treasury Cleared":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "Initiated":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "On Hold":
        return "bg-orange-50 text-orange-700 border-orange-200";

      case "Failed":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  /* =========================================================
     STATUS ICON
  ========================================================= */

  const getStatusIcon = (
    status?: PaymentStatus,
  ) => {
    switch (status) {
      case "Disbursed to Bank":
        return (
          <CheckCircle2 className="w-3.5 h-3.5" />
        );

      case "Failed":
        return (
          <AlertCircle className="w-3.5 h-3.5" />
        );

      default:
        return (
          <Clock3 className="w-3.5 h-3.5" />
        );
    }
  };

  /* =========================================================
     PAYMENT TIMELINE
  ========================================================= */

  const timelineSteps = [
    "Initiated",
    "PFMS Verified",
    "Treasury Cleared",
    "Disbursed to Bank",
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#FCFBF7] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =================================================
            HERO
        ================================================= */}

        <div className="relative overflow-hidden bg-[#123D24] rounded-4xl p-6 sm:p-8 lg:p-10 shadow-xl border border-[#256035] mb-8">

          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#8EB773]/10" />

          <div className="absolute -right-5 -bottom-24 w-72 h-72 rounded-full bg-[#8EB773]/5" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">

            <div className="flex items-start gap-4">

              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1B4D2A] border border-[#8EB773]/50 flex items-center justify-center shrink-0">

                <ReceiptIndianRupee className="w-7 h-7 sm:w-8 sm:h-8 text-[#B7D2A2]" />

              </div>

              <div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[#B7D2A2] text-[10px] font-bold uppercase tracking-wider mb-2">

                  <ShieldCheck className="w-3.5 h-3.5" />

                  Secure Payment Center

                </div>

                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white">

                  Crop Booking Payments

                </h1>

                <p className="text-sm text-gray-300 mt-2 max-w-2xl">

                  Review procurement amounts, initiate farmer
                  payments and monitor PFMS, treasury and bank
                  settlement status from one place.

                </p>

              </div>

            </div>

            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#8EB773] text-[#123D24] text-xs font-bold hover:bg-[#B7D2A2] transition-all shadow-lg disabled:opacity-60"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh Data"}
            </button>

          </div>
        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">

            <CheckCircle2 className="w-5 h-5 shrink-0" />

            <p className="font-semibold">
              {successMessage}
            </p>

            <button
              onClick={() =>
                setSuccessMessage("")
              }
              className="ml-auto text-emerald-600 hover:text-emerald-800"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">

            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

            <div>

              <p className="font-bold">
                Unable to load payment data
              </p>

              <p className="text-xs mt-1">
                {error}
              </p>

            </div>

            <button
              onClick={() => setError("")}
              className="ml-auto"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        )}

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          {/* Total */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8EFE1] shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                  Total Booking Value
                </p>

                <p className="font-serif text-2xl font-bold text-[#123D24] mt-2">
                  {formatCurrency(
                    totalBookingValue,
                  )}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-[#E8EFE1] flex items-center justify-center">
                <WalletCards className="w-5 h-5 text-[#1B4D2A]" />
              </div>

            </div>

            <p className="text-[11px] text-gray-500 mt-3">
              {bookings.length} crop bookings
            </p>

          </div>

          {/* Paid */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8EFE1] shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                  Disbursed
                </p>

                <p className="font-serif text-2xl font-bold text-emerald-700 mt-2">
                  {formatCurrency(paidAmount)}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
              </div>

            </div>

            <p className="text-[11px] text-emerald-600 mt-3">
              Successfully sent to bank
            </p>

          </div>

          {/* Pending */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8EFE1] shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                  Pending Value
                </p>

                <p className="font-serif text-2xl font-bold text-[#D99A32] mt-2">
                  {formatCurrency(
                    pendingAmount,
                  )}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock3 className="w-5 h-5 text-[#D99A32]" />
              </div>

            </div>

            <p className="text-[11px] text-gray-500 mt-3">
              Awaiting payment settlement
            </p>

          </div>

          {/* Action Required */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8EFE1] shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                  Action Required
                </p>

                <p className="font-serif text-2xl font-bold text-[#123D24] mt-2">
                  {pendingBookings}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-[#F1F6EC] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#3F7442]" />
              </div>

            </div>

            <p className="text-[11px] text-gray-500 mt-3">
              Bookings without payment
            </p>

          </div>

        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8EFE1] shadow-sm mb-6">

          <div className="flex flex-col lg:flex-row gap-4">

            <div className="relative flex-1">

              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search farmer, procurement ID, crop, mandi..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value,
                  )
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-[#FCFBF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#8EB773]"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value,
                )
              }
              className="px-4 py-3 rounded-xl border border-gray-200 bg-[#FCFBF7] text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8EB773]"
            >

              <option value="All">
                All Payment Status
              </option>

              <option value="Pending">
                Payment Pending
              </option>

              <option value="Initiated">
                Initiated
              </option>

              <option value="PFMS Verified">
                PFMS Verified
              </option>

              <option value="Treasury Cleared">
                Treasury Cleared
              </option>

              <option value="Disbursed to Bank">
                Disbursed to Bank
              </option>

              <option value="On Hold">
                On Hold
              </option>

              <option value="Failed">
                Failed
              </option>

            </select>

          </div>

        </div>

        {/* =================================================
            MAIN PAYMENT CENTER
        ================================================= */}

        <div className="bg-white rounded-3xl border border-[#E8EFE1] shadow-sm overflow-hidden">

          <div className="p-6 sm:p-8 border-b border-gray-100">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

              <div>

                <div className="flex items-center gap-2">

                  <Wheat className="w-5 h-5 text-[#3F7442]" />

                  <h2 className="font-serif text-xl font-bold text-[#123D24]">
                    Crop Booking Payment Queue
                  </h2>

                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Payment amount is calculated from the
                  crop booking price and approved quantity.
                </p>

              </div>

              <div className="text-xs font-semibold text-gray-500">

                Showing{" "}
                <span className="text-[#123D24]">
                  {filteredRows.length}
                </span>{" "}
                of {bookings.length}

              </div>

            </div>

          </div>

          {loading ? (
            /* =================================================
               LOADING
            ================================================= */

            <div className="flex flex-col items-center justify-center py-20">

              <RefreshCw className="w-8 h-8 text-[#3F7442] animate-spin mb-4" />

              <p className="text-sm font-semibold text-gray-600">
                Loading crop bookings and payments...
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Please wait.
              </p>

            </div>
          ) : filteredRows.length === 0 ? (
            /* =================================================
               EMPTY
            ================================================= */

            <div className="text-center py-20 px-6">

              <div className="w-16 h-16 rounded-2xl bg-[#F1F6EC] flex items-center justify-center mx-auto mb-4">

                <ReceiptIndianRupee className="w-7 h-7 text-[#3F7442]" />

              </div>

              <h3 className="font-serif text-lg font-bold text-gray-700">
                No payment records found
              </h3>

              <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto">
                No crop bookings match your current
                search or payment status filter.
              </p>

            </div>
          ) : (
            /* =================================================
               TABLE
            ================================================= */

            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs">

                <thead className="bg-[#F7F5EC] text-gray-600 uppercase text-[10px] tracking-wider">

                  <tr>

                    <th className="p-4 min-w-55">
                      Procurement
                    </th>

                    <th className="p-4 min-w-48">
                      Farmer
                    </th>

                    <th className="p-4 min-w-42.5">
                      Crop
                    </th>

                    <th className="p-4 min-w-55">
                      Quantity
                    </th>

                    <th className="p-4 min-w-55">
                      Booking Value
                    </th>

                    <th className="p-4 min-w-55">
                      Payment
                    </th>

                    <th className="p-4 min-w-55">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredRows.map(
                    ({
                      booking,
                      payment,
                      quantity,
                      amount,
                    }) => (
                      <tr
                        key={booking._id}
                        className="hover:bg-[#FCFBF7] transition-colors"
                      >

                        {/* PROCUREMENT */}

                        <td className="p-4">

                          <button
                            onClick={() =>
                              payment
                                ? setSelectedPayment(
                                    payment,
                                  )
                                : setSelectedBooking(
                                    booking,
                                  )
                            }
                            className="text-left group"
                          >

                            <p className="font-mono font-bold text-[#123D24] group-hover:text-[#3F7442] transition-colors">
                              {booking.procurementId}
                            </p>

                            <p className="text-[10px] text-gray-500 mt-1">
                              Token #{booking.tokenNumber}
                            </p>

                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Lot {booking.lotNumber}
                            </p>

                          </button>

                        </td>

                        {/* FARMER */}

                        <td className="p-4">

                          <div className="flex items-center gap-2.5">

                            <div className="w-9 h-9 rounded-xl bg-[#E8EFE1] flex items-center justify-center shrink-0">

                              <User className="w-4 h-4 text-[#3F7442]" />

                            </div>

                            <div>

                              <p className="font-bold text-gray-800">
                                {booking.farmerName}
                              </p>

                              <p className="text-[10px] text-gray-500 mt-1">
                                {booking.farmerId}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* CROP */}

                        <td className="p-4">

                          <p className="font-bold text-gray-800">
                            {booking.crop}
                          </p>

                          {booking.variety && (
                            <p className="text-[10px] text-gray-500 mt-1">
                              {booking.variety}
                            </p>
                          )}

                          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">

                            <MapPin className="w-3 h-3" />

                            {booking.centerName}

                          </div>

                        </td>

                        {/* QUANTITY */}

                        <td className="p-4">

                          <p className="font-bold text-gray-800">
                            {formatNumber(quantity)} Qtl
                          </p>

                          {booking.approvedQuantityQuintals !==
                            undefined && (
                            <p className="text-[10px] text-emerald-600 mt-1">
                              Approved quantity
                            </p>
                          )}

                          {booking.rejectedQuantityQuintals !==
                            undefined &&
                            booking.rejectedQuantityQuintals >
                              0 && (
                              <p className="text-[10px] text-red-500 mt-1">
                                Rejected:{" "}
                                {formatNumber(
                                  booking.rejectedQuantityQuintals,
                                )}{" "}
                                Qtl
                              </p>
                            )}

                        </td>

                        {/* AMOUNT */}

                        <td className="p-4">

                          <p className="font-serif text-lg font-bold text-[#123D24]">
                            {formatCurrency(amount)}
                          </p>

                          <p className="text-[10px] text-gray-500 mt-1">
                            ₹
                            {formatNumber(
                              booking.pricePerQuintal ||
                                0,
                            )}{" "}
                            / Quintal
                          </p>

                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {formatNumber(quantity)} × ₹
                            {formatNumber(
                              booking.pricePerQuintal ||
                                0,
                            )}
                          </p>

                        </td>

                        {/* PAYMENT */}

                        <td className="p-4">

                          {payment ? (
                            <div>

                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-bold whitespace-nowrap ${getStatusStyle(
                                  payment.status,
                                )}`}
                              >

                                {getStatusIcon(
                                  payment.status,
                                )}

                                {payment.status}

                              </span>

                              <p className="font-mono text-[10px] text-gray-500 mt-2">
                                {payment.paymentId}
                              </p>

                            </div>
                          ) : (
                            <div>

                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-bold">

                                <Clock3 className="w-3.5 h-3.5" />

                                Payment Pending

                              </span>

                              <p className="text-[10px] text-gray-400 mt-2">
                                No payment initiated
                              </p>

                            </div>
                          )}

                        </td>

                        {/* ACTION */}

                        <td className="p-4">

                          {payment ? (
                            <button
                              onClick={() =>
                                setSelectedPayment(
                                  payment,
                                )
                              }
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F1F6EC] border border-[#DCE9D3] text-[#285C35] text-[10px] font-bold hover:bg-[#E8EFE1] transition-colors"
                            >

                              View Payment

                              <ChevronRight className="w-3.5 h-3.5" />

                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setSelectedBooking(
                                  booking,
                                )
                              }
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#123D24] text-white text-[10px] font-bold hover:bg-[#1B4D2A] transition-colors shadow-sm"
                            >

                              <CreditCard className="w-3.5 h-3.5" />

                              Review & Pay

                            </button>
                          )}

                        </td>

                      </tr>
                    ),
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* =================================================
            FAILED PAYMENT NOTICE
        ================================================= */}

        {failedPayments > 0 && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">

            <div className="flex items-center gap-3">

              <AlertCircle className="w-5 h-5 text-red-600" />

              <div>

                <p className="text-sm font-bold text-red-800">
                  {failedPayments} failed payment
                  {failedPayments > 1
                    ? "s"
                    : ""}{" "}
                  require review.
                </p>

                <p className="text-xs text-red-600 mt-1">
                  Check the payment details and bank
                  information before retrying.
                </p>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          BOOKING PAYMENT MODAL
      ===================================================== */}

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() =>
              creatingPaymentId
                ? null
                : setSelectedBooking(null)
            }
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-4xl shadow-2xl">

            {/* Modal Header */}

            <div className="bg-[#123D24] p-6 sm:p-7 text-white">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#B7D2A2] text-[10px] font-bold uppercase tracking-wider mb-3">

                    <ShieldCheck className="w-3.5 h-3.5" />

                    Payment Review

                  </div>

                  <h2 className="font-serif text-2xl font-bold">
                    Initiate Farmer Payment
                  </h2>

                  <p className="text-xs text-gray-300 mt-1">
                    Review the booking amount before
                    creating the payment record.
                  </p>

                </div>

                <button
                  onClick={() =>
                    creatingPaymentId
                      ? null
                      : setSelectedBooking(null)
                  }
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

            </div>

            <div className="p-6 sm:p-7">

              {/* Amount */}

              <div className="rounded-2xl bg-[#F1F6EC] border border-[#DCE9D3] p-5 mb-6">

                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                  Total Payable Amount
                </p>

                <div className="flex items-end justify-between gap-4 mt-2">

                  <p className="font-serif text-4xl font-bold text-[#123D24]">
                    {formatCurrency(
                      getBookingAmount(
                        selectedBooking,
                      ),
                    )}
                  </p>

                  <CircleDollarSign className="w-9 h-9 text-[#3F7442]" />

                </div>

                <div className="mt-4 pt-4 border-t border-[#DCE9D3]">

                  <p className="text-xs text-gray-600">

                    {formatNumber(
                      getBookingQuantity(
                        selectedBooking,
                      ),
                    )}{" "}
                    Quintals × ₹
                    {formatNumber(
                      selectedBooking.pricePerQuintal ||
                        0,
                    )}

                  </p>

                </div>

              </div>

              {/* Booking Details */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">

                <div className="rounded-2xl border border-gray-100 bg-[#FCFBF7] p-4">

                  <div className="flex items-center gap-2 mb-2">

                    <ReceiptIndianRupee className="w-4 h-4 text-[#3F7442]" />

                    <p className="text-[10px] uppercase font-bold text-gray-500">
                      Procurement
                    </p>

                  </div>

                  <p className="font-mono text-sm font-bold text-[#123D24]">
                    {selectedBooking.procurementId}
                  </p>

                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#FCFBF7] p-4">

                  <div className="flex items-center gap-2 mb-2">

                    <User className="w-4 h-4 text-[#3F7442]" />

                    <p className="text-[10px] uppercase font-bold text-gray-500">
                      Farmer
                    </p>

                  </div>

                  <p className="text-sm font-bold text-gray-800">
                    {selectedBooking.farmerName}
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">
                    {selectedBooking.farmerId}
                  </p>

                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#FCFBF7] p-4">

                  <div className="flex items-center gap-2 mb-2">

                    <Wheat className="w-4 h-4 text-[#3F7442]" />

                    <p className="text-[10px] uppercase font-bold text-gray-500">
                      Crop
                    </p>

                  </div>

                  <p className="text-sm font-bold text-gray-800">
                    {selectedBooking.crop}
                  </p>

                  {selectedBooking.variety && (
                    <p className="text-[10px] text-gray-500 mt-1">
                      {selectedBooking.variety}
                    </p>
                  )}

                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#FCFBF7] p-4">

                  <div className="flex items-center gap-2 mb-2">

                    <MapPin className="w-4 h-4 text-[#3F7442]" />

                    <p className="text-[10px] uppercase font-bold text-gray-500">
                      Procurement Center
                    </p>

                  </div>

                  <p className="text-sm font-bold text-gray-800">
                    {selectedBooking.centerName}
                  </p>

                </div>

              </div>

              {/* Calculation */}

              <div className="rounded-2xl border border-gray-100 overflow-hidden mb-6">

                <div className="px-4 py-3 bg-[#F7F5EC]">

                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-600">
                    Payment Calculation
                  </p>

                </div>

                <div className="p-4 space-y-3">

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Approved Quantity
                    </span>

                    <span className="font-semibold text-gray-800">
                      {formatNumber(
                        getBookingQuantity(
                          selectedBooking,
                        ),
                      )}{" "}
                      Qtl
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      MSP / Procurement Rate
                    </span>

                    <span className="font-semibold text-gray-800">
                      ₹
                      {formatNumber(
                        selectedBooking.pricePerQuintal ||
                          0,
                      )}
                      /Qtl
                    </span>

                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between">

                    <span className="font-bold text-[#123D24]">
                      Net Payable
                    </span>

                    <span className="font-serif text-xl font-bold text-[#123D24]">
                      {formatCurrency(
                        getBookingAmount(
                          selectedBooking,
                        ),
                      )}
                    </span>

                  </div>

                </div>

              </div>

              {/* Warning */}

              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 mb-6">

                <div className="flex items-start gap-3">

                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />

                  <div>

                    <p className="text-sm font-bold text-amber-800">
                      Payment initiation
                    </p>

                    <p className="text-xs text-amber-700 mt-1 leading-5">
                      This action creates an Initiated payment
                      record. It does not directly transfer money
                      to the farmer's bank account.
                    </p>

                  </div>

                </div>

              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse sm:flex-row gap-3">

                <button
                  onClick={() =>
                    setSelectedBooking(null)
                  }
                  disabled={
                    creatingPaymentId !== null
                  }
                  className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={() =>
                    initiatePayment(
                      selectedBooking,
                    )
                  }
                  disabled={
                    creatingPaymentId !== null
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#123D24] text-white text-sm font-bold hover:bg-[#1B4D2A] disabled:opacity-60"
                >

                  {creatingPaymentId ===
                  selectedBooking.procurementId ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />

                      Creating Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />

                      Initiate Payment
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          PAYMENT DETAILS MODAL
      ===================================================== */}

      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() =>
              setSelectedPayment(null)
            }
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-4xl shadow-2xl">

            {/* Header */}

            <div className="bg-[#123D24] p-6 sm:p-7 text-white">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[10px] text-[#B7D2A2] uppercase font-bold tracking-wider">
                    Payment Transaction
                  </p>

                  <h2 className="font-serif text-2xl font-bold mt-1">
                    {selectedPayment.paymentId}
                  </h2>

                  <p className="font-mono text-[10px] text-gray-300 mt-2">
                    {selectedPayment.transactionId}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelectedPayment(null)
                  }
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

            </div>

            <div className="p-6 sm:p-7">

              {/* Amount */}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">

                <div>

                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    Net Payable
                  </p>

                  <p className="font-serif text-4xl font-bold text-[#123D24] mt-1">
                    {formatCurrency(
                      selectedPayment.netPayable,
                    )}
                  </p>

                </div>

                <span
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-bold ${getStatusStyle(
                    selectedPayment.status,
                  )}`}
                >

                  {getStatusIcon(
                    selectedPayment.status,
                  )}

                  {selectedPayment.status}

                </span>

              </div>

              {/* Timeline */}

              <div className="rounded-2xl border border-gray-100 p-5 mb-6">

                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-5">
                  Payment Progress
                </p>

                <div className="space-y-4">

                  {timelineSteps.map(
                    (step, index) => {
                      const currentIndex =
                        selectedPayment.statusStageIndex ??
                        0;

                      const completed =
                        index <= currentIndex &&
                        selectedPayment.status !==
                          "Failed";

                      return (
                        <div
                          key={step}
                          className="flex items-center gap-3"
                        >

                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                              completed
                                ? "bg-[#123D24] text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >

                            {completed ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <span className="text-[10px] font-bold">
                                {index + 1}
                              </span>
                            )}

                          </div>

                          <div>

                            <p
                              className={`text-xs font-bold ${
                                completed
                                  ? "text-[#123D24]"
                                  : "text-gray-400"
                              }`}
                            >
                              {step}
                            </p>

                          </div>

                        </div>
                      );
                    },
                  )}

                </div>

              </div>

              {/* Details */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="rounded-2xl bg-[#FCFBF7] border border-gray-100 p-4">

                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Farmer
                  </p>

                  <p className="text-sm font-bold text-gray-800 mt-1">
                    {selectedPayment.farmerName}
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">
                    {selectedPayment.farmerId}
                  </p>

                </div>

                <div className="rounded-2xl bg-[#FCFBF7] border border-gray-100 p-4">

                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Procurement ID
                  </p>

                  <p className="font-mono text-sm font-bold text-[#123D24] mt-1">
                    {selectedPayment.procurementId ||
                      "—"}
                  </p>

                </div>

                <div className="rounded-2xl bg-[#FCFBF7] border border-gray-100 p-4">

                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Crop
                  </p>

                  <p className="text-sm font-bold text-gray-800 mt-1">
                    {selectedPayment.crop}
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">
                    {formatNumber(
                      selectedPayment.grossWeightQuintals,
                    )}{" "}
                    Qtl
                  </p>

                </div>

                <div className="rounded-2xl bg-[#FCFBF7] border border-gray-100 p-4">

                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Procurement Center
                  </p>

                  <p className="text-sm font-bold text-gray-800 mt-1">
                    {selectedPayment.centerName}
                  </p>

                </div>

                <div className="rounded-2xl bg-[#FCFBF7] border border-gray-100 p-4">

                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Gross Amount
                  </p>

                  <p className="text-sm font-bold text-gray-800 mt-1">
                    {formatCurrency(
                      selectedPayment.grossAmount,
                    )}
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">
                    MSP ₹
                    {formatNumber(
                      selectedPayment.mspRatePerQuintal,
                    )}
                    /Qtl
                  </p>

                </div>

                <div className="rounded-2xl bg-[#FCFBF7] border border-gray-100 p-4">

                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Deductions
                  </p>

                  <p className="text-sm font-bold text-red-600 mt-1">
                    {formatCurrency(
                      selectedPayment.deductions,
                    )}
                  </p>

                </div>

                <div className="rounded-2xl bg-[#FCFBF7] border border-gray-100 p-4">

                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    PFMS Reference
                  </p>

                  <p className="font-mono text-xs font-bold text-gray-800 mt-1">
                    {selectedPayment.pfmsReferenceNo}
                  </p>

                </div>

                <div className="rounded-2xl bg-[#FCFBF7] border border-gray-100 p-4">

                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Bank
                  </p>

                  <p className="text-xs font-bold text-gray-800 mt-1">
                    {selectedPayment.bankName}
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">
                    A/C ****
                    {selectedPayment.accountLast4}
                  </p>

                </div>

              </div>

              {/* Dates */}

              <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div>

                  <div className="flex items-center gap-2 text-gray-400">

                    <CalendarDays className="w-3.5 h-3.5" />

                    <span className="text-[10px] font-bold uppercase">
                      Procured
                    </span>

                  </div>

                  <p className="text-xs font-semibold text-gray-700 mt-1">
                    {formatDate(
                      selectedPayment.procuredDate,
                    )}
                  </p>

                </div>

                <div>

                  <div className="flex items-center gap-2 text-gray-400">

                    <Clock3 className="w-3.5 h-3.5" />

                    <span className="text-[10px] font-bold uppercase">
                      Expected
                    </span>

                  </div>

                  <p className="text-xs font-semibold text-gray-700 mt-1">
                    {formatDate(
                      selectedPayment.estimatedReleaseDate,
                    )}
                  </p>

                </div>

                <div>

                  <div className="flex items-center gap-2 text-gray-400">

                    <Banknote className="w-3.5 h-3.5" />

                    <span className="text-[10px] font-bold uppercase">
                      UTR
                    </span>

                  </div>

                  <p className="font-mono text-xs font-semibold text-gray-700 mt-1">
                    {selectedPayment.utrNumber ||
                      "Not generated"}
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setSelectedPayment(null)
                }
                className="w-full mt-6 px-5 py-3 rounded-xl bg-[#123D24] text-white text-sm font-bold hover:bg-[#1B4D2A]"
              >
                Close Payment Details
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Payments;