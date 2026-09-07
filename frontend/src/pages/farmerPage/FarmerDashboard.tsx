import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Activity,
  ArrowRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  IndianRupee,
  MapPin,
  PackageCheck,
  QrCode,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Truck,
  Wallet,
  Wheat,
  UserRound,
  CircleCheck,
  CircleAlert,
  Timer,
  Building2,
  BadgeCheck,
} from "lucide-react";

import { useAuth, MSP_RATES } from "../../context/AuthContext";

import { MandiPassModal } from "../../components/farmerPortal/MandiPassModal";

import BookSlotModal from "../../components/farmerPortal/BookSlotModal";

import { ReceiptModal } from "../../components/farmerPortal/ReceiptModal";

import type { CropType, PaymentTransaction, QueueToken } from "../../types";

/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (value: number) => {
  return `₹${Math.round(value || 0).toLocaleString("en-IN")}`;
};

const formatDate = (date?: string) => {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCropShortName = (crop?: CropType) => {
  if (!crop) {
    return "No Crop";
  }

  if (crop === "Rice / Paddy") {
    return "Rice";
  }

  if (crop === "Bengal Gram (Chana)") {
    return "Bengal Gram";
  }

  return crop;
};

/* =========================================================
   STATUS HELPERS
========================================================= */

const getStatusLabel = (status?: QueueToken["status"]) => {
  switch (status) {
    case "completed":
      return "Completed";

    case "called":
      return "Called to Counter";

    case "processing":
      return "Processing";

    case "next":
      return "Next in Queue";

    case "rejected":
      return "Rejected";

    case "waiting":
      return "Waiting";

    default:
      return "Waiting";
  }
};

const getStatusStyles = (status?: QueueToken["status"]) => {
  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    case "called":
      return "bg-blue-50 text-blue-700 border-blue-100";

    case "processing":
      return "bg-amber-50 text-amber-700 border-amber-100";

    case "rejected":
      return "bg-red-50 text-red-700 border-red-100";

    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

/* =========================================================
   COMPONENT
========================================================= */

const FarmerDashboard: React.FC = () => {
  const { user, queueTokens, qualityReport, payments, centers, milestones, t } =
    useAuth();

  const [showPassModal, setShowPassModal] = useState(false);

  const [showBookModal, setShowBookModal] = useState(false);

  const [showReceiptModal, setShowReceiptModal] = useState(false);

  /* =======================================================
     FARMER TOKENS
  ======================================================= */

  const farmerTokens = useMemo(() => {
    if (!user?.id) {
      return [];
    }

    return queueTokens
      .filter((token) => token.farmerId === user.id)
      .sort((a, b) => b.tokenNumber - a.tokenNumber);
  }, [queueTokens, user?.id]);

  /* =======================================================
     ACTIVE TOKEN
  ======================================================= */

  const activeToken: QueueToken | undefined = useMemo(() => {
    if (!farmerTokens.length) {
      return undefined;
    }

    const nonRejected = farmerTokens.find(
      (token) => token.status !== "rejected",
    );

    return nonRejected || farmerTokens[0];
  }, [farmerTokens]);

  /* =======================================================
   ACTIVE PAYMENT
======================================================= */

  const activePayment = useMemo(() => {
    if (!user?.id) {
      return undefined;
    }

    // First try to find payment for the currently active token
    if (activeToken) {
      const tokenPayment = payments.find(
        (payment) =>
          payment.farmerId === user.id &&
          payment.tokenNumber === activeToken.tokenNumber,
      );

      if (tokenPayment) {
        return tokenPayment;
      }
    }

    // Otherwise use the farmer's latest payment
    return payments.find((payment) => payment.farmerId === user.id);
  }, [payments, user?.id, activeToken]);

  /* =======================================================
     ACTIVE CENTER
  ======================================================= */

  const activeCenter = useMemo(() => {
    if (activeToken?.centerId) {
      const bookedCenter = centers.find(
        (center) => center.id === activeToken.centerId,
      );

      if (bookedCenter) {
        return bookedCenter;
      }
    }

    if (user?.assignedCenterId) {
      const assignedCenter = centers.find(
        (center) => center.id === user.assignedCenterId,
      );

      if (assignedCenter) {
        return assignedCenter;
      }
    }

    return centers[0];
  }, [centers, user?.assignedCenterId, activeToken?.centerId]);

  /* =======================================================
     BOOKING DATA
  ======================================================= */

  const bookingData = useMemo(() => {
    const crop = activeToken?.crop || activePayment?.crop || user?.primaryCrop;

    const bookedQuantity = activeToken?.quantityQuintals || 0;

    const actualQuantity =
      activePayment?.grossWeightQuintals ||
      activeToken?.weighbridgeWeightQuintals ||
      bookedQuantity;

    const quantity =
      activePayment || activeToken?.weighbridgeWeightQuintals
        ? actualQuantity
        : bookedQuantity;

    const mspRate =
      activePayment?.mspRatePerQuintal ||
      activeToken?.mspRate ||
      (crop ? MSP_RATES[crop] : 0);

    const estimatedValue = bookedQuantity * mspRate;

    const actualValue = quantity * mspRate;

    return {
      crop,
      quantity,
      bookedQuantity,
      mspRate,
      estimatedValue,
      actualValue,
    };
  }, [activePayment, activeToken, user?.primaryCrop]);

  /* =======================================================
     PAYOUT
  ======================================================= */

  const payoutData = useMemo(() => {
    if (activePayment) {
      return {
        amount: activePayment.netPayable,

        label: "Net Payable",

        subtitle: `${activePayment.grossWeightQuintals.toFixed(
          2,
        )} Qtl × ${formatCurrency(activePayment.mspRatePerQuintal)} / Qtl`,
      };
    }

    return {
      amount: bookingData.estimatedValue,

      label: "Estimated Payout",

      subtitle:
        bookingData.bookedQuantity > 0
          ? `${bookingData.bookedQuantity.toFixed(2)} Qtl × ${formatCurrency(
              bookingData.mspRate,
            )} / Qtl`
          : "Book a procurement slot to see your estimate",
    };
  }, [activePayment, bookingData]);

  /* =======================================================
     QUEUE DATA
  ======================================================= */

  const servingToken = activeCenter?.currentServingToken || 0;

  const tokenNumber = activeToken?.tokenNumber || 0;

  const estimatedWait = activeToken?.estimatedWaitMinutes || 0;

  const queuePosition =
    tokenNumber > 0 && servingToken > 0
      ? Math.max(0, tokenNumber - servingToken)
      : 0;

  /* =======================================================
     CERTIFIED WEIGHT
  ======================================================= */

  const certifiedQuantity =
    activePayment?.grossWeightQuintals ||
    activeToken?.weighbridgeWeightQuintals ||
    activeToken?.quantityQuintals ||
    0;

  const certifiedKg = certifiedQuantity * 100;

  /* =======================================================
     QUALITY
  ======================================================= */

  const qualityGrade =
    activeToken?.qualityGrade || qualityReport?.grade || "Under Inspection";

  const qualityScore =
    qualityGrade === "Grade A"
      ? 94
      : qualityGrade === "Grade B"
        ? 88
        : qualityGrade === "Standard"
          ? 78
          : qualityReport?.passed
            ? 94
            : 0;

  /* =======================================================
     STATUS
  ======================================================= */

  const bookingStatus = activeToken?.status || "waiting";

  const statusLabel = getStatusLabel(bookingStatus);

  /* =======================================================
     JOURNEY STATUS
  ======================================================= */

  const journey = useMemo(() => {
    const hasArrival =
      activeToken?.status === "called" ||
      activeToken?.status === "processing" ||
      activeToken?.status === "completed" ||
      Boolean(activeToken?.arrivedAt);

    const hasQuality =
      Boolean(activeToken?.qualityGrade) &&
      activeToken?.qualityGrade !== "Pending";

    const hasWeighbridge =
      Boolean(activeToken?.weighbridgeWeightQuintals) ||
      Boolean(activeToken?.finalWeight);

    return [
      {
        label: "Registration",
        description: "Farmer account verified",
        done: Boolean(user),
        icon: ShieldCheck,
      },
      {
        label: "Slot Booked",
        description: "Procurement appointment",
        done: Boolean(activeToken),
        icon: CalendarDays,
      },
      {
        label: "Arrival",
        description: "Reached procurement center",
        done: hasArrival,
        icon: Truck,
      },
      {
        label: "Quality Check",
        description: "Crop quality verified",
        done: hasQuality,
        icon: CheckCircle2,
      },
      {
        label: "Weighbridge",
        description: "Final quantity recorded",
        done: hasWeighbridge,
        icon: PackageCheck,
      },
      {
        label: "Payment",
        description: "Payment initiated",
        done: Boolean(activePayment),
        icon: Banknote,
      },
    ];
  }, [activePayment, activeToken, user]);

  /* =======================================================
     PROFILE COMPLETION
  ======================================================= */

  const profileCompletion = user?.detailedProfile?.completionPercentage || 0;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* ===================================================
          HERO HEADER
      =================================================== */}

      <section className="relative overflow-hidden border-b border-emerald-100 bg-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-lime-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Greeting */}

            <div className="flex items-start gap-4">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 sm:flex">
                <Sprout className="h-7 w-7" />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                  <Sprout className="h-4 w-4 sm:hidden" />
                  KisanSetu Farmer Portal
                  <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 sm:inline-flex">
                    Smart Procurement
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Welcome back,{" "}
                  <span className="text-emerald-600">
                    {user?.name || "Farmer"}
                  </span>
                </h1>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Manage your crop procurement, live queue, quality verification
                  and payments from one place.
                </p>
              </div>
            </div>

            {/* Actions */}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowBookModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-xl"
              >
                <CalendarDays className="h-4 w-4" />
                Book Harvest Slot
              </button>

              {activeToken && (
                <button
                  type="button"
                  onClick={() => setShowPassModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <QrCode className="h-4 w-4" />
                  Mandi Pass
                </button>
              )}
            </div>
          </div>

          {/* Farmer mini information */}

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
              <div className="rounded-lg bg-white p-2 text-slate-600 shadow-sm">
                <UserRound className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Farmer ID
                </p>

                <p className="truncate text-sm font-bold text-slate-800">
                  {user?.detailedProfile?.farmerId ||
                    user?.id ||
                    "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
              <div className="rounded-lg bg-white p-2 text-slate-600 shadow-sm">
                <MapPin className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Location
                </p>

                <p className="truncate text-sm font-bold text-slate-800">
                  {user?.district ||
                    user?.detailedProfile?.district ||
                    "West Bengal"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
              <div className="rounded-lg bg-white p-2 text-emerald-600 shadow-sm">
                <BadgeCheck className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Account Status
                </p>

                <p className="truncate text-sm font-bold text-emerald-700">
                  {user?.detailedProfile?.verificationStatus || "Registered"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            PROFILE COMPLETION
        ================================================= */}

        {profileCompletion > 0 && profileCompletion < 100 && (
          <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <UserRound className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Complete your farmer profile
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      A complete profile helps speed up procurement
                      verification.
                    </p>
                  </div>

                  <span className="text-sm font-bold text-amber-600">
                    {profileCompletion}%
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all"
                    style={{
                      width: `${profileCompletion}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* QUEUE */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Your Queue Token
                </p>

                <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  {tokenNumber ? `#${tokenNumber}` : "—"}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                <QrCode className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getStatusStyles(
                  bookingStatus,
                )}`}
              >
                {statusLabel}
              </span>

              {queuePosition > 0 && (
                <span className="text-xs font-medium text-slate-400">
                  {queuePosition} ahead
                </span>
              )}
            </div>
          </div>

          {/* CROP */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Booked Crop
                </p>

                <p className="mt-2 text-xl font-black text-slate-950">
                  {getCropShortName(bookingData.crop)}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
                <Wheat className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
              {bookingData.quantity > 0
                ? `${bookingData.quantity.toFixed(2)} Quintals`
                : "No active booking"}
            </p>
          </div>

          {/* MSP */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Current MSP
                </p>

                <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {bookingData.mspRate
                    ? formatCurrency(bookingData.mspRate)
                    : "—"}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
              Per Quintal
            </p>
          </div>

          {/* PAYOUT */}

          <div className="group rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-emerald-700">
                  {payoutData.label}
                </p>

                <p className="mt-2 text-2xl font-black tracking-tight text-emerald-950">
                  {payoutData.amount ? formatCurrency(payoutData.amount) : "—"}
                </p>
              </div>

              <div className="rounded-xl bg-white p-3 text-emerald-600 shadow-sm">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 truncate text-xs font-semibold text-emerald-700">
              {payoutData.subtitle}
            </p>
          </div>
        </div>

        {/* =================================================
            CURRENT PROCUREMENT + LIVE QUEUE
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* PROCUREMENT */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-black text-slate-950">
                    Current Procurement
                  </h2>

                  {activeToken && (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusStyles(
                        bookingStatus,
                      )}`}
                    >
                      {statusLabel}
                    </span>
                  )}
                </div>

                <p className="mt-0.5 text-sm text-slate-500">
                  Your latest harvest booking
                </p>
              </div>

              <div className="hidden rounded-xl bg-emerald-50 p-2.5 text-emerald-600 sm:block">
                <Wheat className="h-5 w-5" />
              </div>
            </div>

            {activeToken ? (
              <div className="p-5">
                {/* Token banner */}

                <div className="mb-5 flex flex-col gap-4 rounded-2xl bg-slate-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Harvest Token
                    </p>

                    <div className="mt-1 flex items-center gap-3">
                      <p className="text-3xl font-black">
                        #{activeToken.tokenNumber}
                      </p>

                      <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-slate-200">
                        {activeToken.tokenCode}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-400">Estimated value</p>

                    <p className="mt-1 text-2xl font-black text-emerald-400">
                      {formatCurrency(bookingData.estimatedValue)}
                    </p>
                  </div>
                </div>

                {/* Booking details */}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Crop
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {bookingData.crop || "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Quantity
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {bookingData.quantity.toFixed(2)} Qtl
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      MSP Rate
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {formatCurrency(bookingData.mspRate)}
                      <span className="text-xs font-medium text-slate-400">
                        {" "}
                        / Qtl
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                      {activePayment ? "Net Payable" : "Estimated Value"}
                    </p>

                    <p className="mt-1 font-black text-emerald-800">
                      {formatCurrency(payoutData.amount)}
                    </p>
                  </div>
                </div>

                {/* CENTER */}

                <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-bold text-slate-900">
                          {activeCenter?.name ||
                            activeToken.centerName ||
                            "Procurement Center"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {activeCenter?.address ||
                            activeCenter?.district ||
                            "Procurement location"}
                        </p>

                        {activeCenter?.operatingHours && (
                          <p className="mt-1 text-xs text-slate-400">
                            Hours: {activeCenter.operatingHours}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <Clock3 className="h-4 w-4 text-emerald-500" />

                      {estimatedWait > 0
                        ? `${estimatedWait} min estimated`
                        : "Ready for processing"}
                    </div>
                  </div>

                  {/* SLOT INFORMATION */}

                  <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Slot Date
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {formatDate(activeToken.date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Time Window
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {activeToken.timeWindow || activeToken.slotTime || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Vehicle
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {activeToken.vehicleNumber || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPassModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    <QrCode className="h-4 w-4" />
                    View Mandi Pass
                  </button>

                  <Link
                    to="/status"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Track Status
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CalendarDays className="h-7 w-7" />
                </div>

                <h3 className="mt-4 font-black text-slate-900">
                  No active procurement booking
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Book a harvest procurement slot to see your crop, quantity,
                  MSP, center, queue token and estimated payout here.
                </p>

                <button
                  type="button"
                  onClick={() => setShowBookModal(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                >
                  Book Procurement Slot
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>

          {/* LIVE QUEUE */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-black text-slate-950">Live Queue</h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Real-time center status
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Live
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-2xl bg-linear-to-br from-slate-950 to-slate-800 p-5 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Now Serving
                  </p>

                  <Timer className="h-5 w-5 text-emerald-400" />
                </div>

                <p className="mt-2 text-5xl font-black tracking-tight">
                  #{servingToken || "—"}
                </p>

                <div className="mt-4 flex items-start gap-2 text-sm text-slate-300">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                  <span>{activeCenter?.name || "Procurement Center"}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Your Token
                  </p>

                  <p className="mt-1 text-xl font-black text-slate-900">
                    #{tokenNumber || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Ahead</p>

                  <p className="mt-1 text-xl font-black text-slate-900">
                    {queuePosition}
                  </p>
                </div>
              </div>

              {estimatedWait > 0 && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
                  <Clock3 className="h-5 w-5 text-amber-600" />

                  <div>
                    <p className="text-xs font-medium text-amber-700">
                      Estimated waiting time
                    </p>

                    <p className="font-black text-amber-900">
                      {estimatedWait} minutes
                    </p>
                  </div>
                </div>
              )}

              <Link
                to="/queue"
                className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                View Full Queue
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>

        {/* =================================================
            PAYMENT + CERTIFIED GRAIN
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* PAYMENT */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-black text-slate-950">Payment Summary</h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  {activePayment
                    ? "Procurement payment"
                    : "Expected procurement value"}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <Wallet className="h-5 w-5" />
              </div>
            </div>

            <div className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {payoutData.label}
                  </p>

                  <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                    {formatCurrency(payoutData.amount)}
                  </p>
                </div>

                {activePayment && (
                  <span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {activePayment.status}
                  </span>
                )}
              </div>

              <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-slate-500">Crop</span>

                  <span className="font-bold text-slate-900">
                    {bookingData.crop || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-slate-500">Quantity</span>

                  <span className="font-bold text-slate-900">
                    {bookingData.quantity
                      ? `${bookingData.quantity.toFixed(2)} Qtl`
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-slate-500">MSP</span>

                  <span className="font-bold text-slate-900">
                    {bookingData.mspRate
                      ? `${formatCurrency(bookingData.mspRate)}/Qtl`
                      : "—"}
                  </span>
                </div>

                {activePayment && (
                  <>
                    <div className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="text-slate-500">Procured Date</span>

                      <span className="font-bold text-slate-900">
                        {formatDate(activePayment.procuredDate)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="text-slate-500">PFMS Reference</span>

                      <span className="max-w-44 truncate font-mono text-xs font-bold text-slate-700">
                        {activePayment.pfmsReferenceNo}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <Link
                to="/payments"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                View Payment Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* CERTIFIED GRAIN */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-black text-slate-950">Certified Grain</h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Weighbridge and quality information
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <PackageCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold text-slate-500">
                    Certified Quantity
                  </p>

                  <p className="mt-2 text-3xl font-black text-slate-950">
                    {certifiedQuantity ? certifiedQuantity.toFixed(2) : "—"}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Quintals
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold text-slate-500">
                    Total Weight
                  </p>

                  <p className="mt-2 text-3xl font-black text-slate-950">
                    {certifiedKg ? certifiedKg.toLocaleString("en-IN") : "—"}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Kilograms
                  </p>
                </div>
              </div>

              {/* QUALITY */}

              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white p-2.5 text-emerald-600 shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-black text-emerald-950">
                      Quality Status
                    </p>

                    <p className="mt-0.5 text-sm font-medium text-emerald-700">
                      {qualityGrade}
                    </p>
                  </div>

                  {qualityScore > 0 && (
                    <div className="ml-auto text-right">
                      <p className="text-2xl font-black text-emerald-800">
                        {qualityScore}
                      </p>

                      <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                        Quality Score
                      </p>
                    </div>
                  )}
                </div>

                {qualityReport && (
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-emerald-100 pt-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                        Moisture
                      </p>

                      <p className="mt-1 text-sm font-bold text-emerald-950">
                        {qualityReport.moisturePercent}%
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                        Sample ID
                      </p>

                      <p className="mt-1 truncate text-sm font-bold text-emerald-950">
                        {qualityReport.sampleId || "Pending"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* =================================================
            HARVEST JOURNEY
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <Activity className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-black text-slate-950">Harvest Journey</h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Track your procurement journey from registration to payment
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto p-6">
            <div className="flex min-w-190 items-start">
              {journey.map((step, index) => {
                const Icon = step.icon;

                const isLast = index === journey.length - 1;

                const nextDone = !isLast && journey[index + 1].done;

                return (
                  <React.Fragment key={step.label}>
                    <div className="flex w-28 shrink-0 flex-col items-center text-center">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-sm ${
                          step.done
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <p
                        className={`mt-3 text-xs font-black ${
                          step.done ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-slate-400">
                        {step.description}
                      </p>
                    </div>

                    {!isLast && (
                      <div className="mt-6 h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all ${
                            nextDone
                              ? "w-full bg-emerald-500"
                              : step.done
                                ? "w-1/2 bg-emerald-300"
                                : "w-0"
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section>
          <div className="mb-4">
            <h2 className="font-black text-slate-950">Quick Actions</h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Frequently used farmer services
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* QUEUE */}

            <Link
              to="/queue"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Activity className="h-5 w-5" />
                </div>

                <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
              </div>

              <h3 className="mt-4 font-black text-slate-900">Track Queue</h3>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                See live token movement and estimated waiting time.
              </p>
            </Link>

            {/* PAYMENTS */}

            <Link
              to="/payments"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <Wallet className="h-5 w-5" />
                </div>

                <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
              </div>

              <h3 className="mt-4 font-black text-slate-900">
                Payment History
              </h3>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Check procurement payments and PFMS transaction details.
              </p>
            </Link>

            {/* RECEIPT */}

            <button
              type="button"
              onClick={() => setShowReceiptModal(true)}
              disabled={!activeToken}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <FileText className="h-5 w-5" />
                </div>

                <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-amber-600" />
              </div>

              <h3 className="mt-4 font-black text-slate-900">
                Procurement Receipt
              </h3>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                View your latest procurement receipt.
              </p>
            </button>
          </div>
        </section>

        {/* =================================================
            CURRENT BOOKING VALUE
        ================================================= */}

        {activeToken && (
          <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 via-white to-white shadow-sm">
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-emerald-600 p-3 text-white shadow-lg shadow-emerald-600/20">
                  <IndianRupee className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-emerald-600">
                    Current Booking Value
                  </p>

                  <p className="mt-1 text-sm text-emerald-900">
                    {bookingData.bookedQuantity.toFixed(2)} Qtl ×{" "}
                    {formatCurrency(bookingData.mspRate)} MSP
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                  {activePayment ? "Net Payable" : "Estimated Value"}
                </p>

                <p className="text-3xl font-black tracking-tight text-emerald-950">
                  {formatCurrency(payoutData.amount)}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            NO BOOKING INFORMATION
        ================================================= */}

        {!activeToken && farmerTokens.length === 0 && (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <CircleAlert className="h-5 w-5" />
            </div>

            <h3 className="mt-3 font-black text-slate-900">
              Your procurement journey has not started yet
            </h3>

            <p className="mx-auto mt-1 max-w-lg text-sm text-slate-500">
              Choose a procurement center, select your crop and book a suitable
              harvest slot to get started.
            </p>

            <button
              type="button"
              onClick={() => setShowBookModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Start Booking
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        )}
      </main>

      {/* ===================================================
          MODALS
      =================================================== */}

      {showBookModal && (
        <BookSlotModal
          isOpen={showBookModal}
          onClose={() => setShowBookModal(false)}
          onBookingSuccess={(token) => {
            console.log("Booking successful:", token);

            // Close the booking modal after successful payment
            setShowBookModal(false);
          }}
        />
      )}

      {showPassModal && activeToken && (
        <MandiPassModal
          isOpen={showPassModal}
          token={activeToken}
          onClose={() => setShowPassModal(false)}
        />
      )}

      {showReceiptModal && activeToken && (
        <ReceiptModal
          token={activeToken}
          payment={activePayment}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};

export default FarmerDashboard;
