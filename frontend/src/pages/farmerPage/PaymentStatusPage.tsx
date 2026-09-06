import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Wallet,
  CheckCircle2,
  Clock3,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Receipt,
  Sparkles,
  CreditCard,
  Landmark,
  CalendarDays,
  Hash,
  Banknote,
  ChevronDown,
  ChevronUp,
  MapPin,
  Wheat,
  AlertTriangle,
  Copy,
  Ticket,
  ExternalLink,
  IndianRupee,
  CircleDollarSign,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { CropType, PaymentTransaction } from "../types";

export const PaymentStatusPage: React.FC = () => {
  const { payments, queueTokens, user } = useAuth();

  // =========================================================
  // PAYMENT LIST
  // =========================================================

  const paymentList = useMemo(() => {
    return (payments ?? []).filter(
      (payment) => !user?.id || payment.farmerId === user.id,
    );
  }, [payments, user?.id]);

  const sortedPayments = useMemo(() => {
    return [...paymentList].sort(
      (a, b) =>
        new Date(b.procuredDate || 0).getTime() -
        new Date(a.procuredDate || 0).getTime(),
    );
  }, [paymentList]);

  // =========================================================
  // ACTIVE PAYMENT
  // IMPORTANT:
  // The latest payment becomes the active payment.
  // =========================================================

  const activePayment = sortedPayments[0];

  // =========================================================
  // FARMER TOKENS
  // =========================================================

  const farmerTokens = useMemo(() => {
    return (queueTokens ?? [])
      .filter(
        (token) => !user?.id || token.farmerId === user.id,
      )
      .sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();

        return dateB - dateA;
      });
  }, [queueTokens, user?.id]);

  const latestToken = farmerTokens[0];

  // =========================================================
  // MSP CALCULATOR
  // =========================================================

  const [calcCrop, setCalcCrop] =
    useState<CropType>("Rice / Paddy");

  const [calcQuantity, setCalcQuantity] =
    useState<number>(25);

  const mspRates: Record<CropType, number> = {
    "Rice / Paddy": 2203,
    Wheat: 2275,
    Mustard: 5650,
    Maize: 2090,
    "Bengal Gram (Chana)": 5440,
    Cotton: 7020,
  };

  const calculatedTotal = Math.round(
    calcQuantity * (mspRates[calcCrop] || 2203),
  );

  // =========================================================
  // HISTORY EXPANSION
  // =========================================================

  const [expandedPaymentId, setExpandedPaymentId] =
    useState<string | null>(null);

  // =========================================================
  // STATUS CONFIG
  // =========================================================

  const getStatusConfig = (
    status: PaymentTransaction["status"],
  ) => {
    switch (status) {
      case "Initiated":
        return {
          label: "Processing",
          statusText: "Initiated",
          icon: Clock3,
          badge:
            "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
          iconBox:
            "bg-blue-50 text-blue-600 border-blue-100",
          description:
            "Your payment request has been created and is awaiting verification.",
        };

      case "PFMS Verified":
        return {
          label: "Processing",
          statusText: "PFMS Verified",
          icon: ShieldCheck,
          badge:
            "bg-indigo-50 text-indigo-700 border-indigo-200",
          dot: "bg-indigo-500",
          iconBox:
            "bg-indigo-50 text-indigo-600 border-indigo-100",
          description:
            "Your payment has been verified through the PFMS payment workflow.",
        };

      case "Treasury Cleared":
        return {
          label: "Processing",
          statusText: "Treasury Cleared",
          icon: CheckCircle2,
          badge:
            "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
          iconBox:
            "bg-amber-50 text-amber-600 border-amber-100",
          description:
            "Treasury clearance is complete. The payment is ready for bank disbursement.",
        };

      case "Disbursed to Bank":
        return {
          label: "Completed",
          statusText: "Disbursed to Bank",
          icon: CheckCircle2,
          badge:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
          iconBox:
            "bg-emerald-50 text-emerald-600 border-emerald-100",
          description:
            "The payment has been successfully disbursed to your registered bank account.",
        };

      case "On Hold":
        return {
          label: "On Hold",
          statusText: "On Hold",
          icon: AlertTriangle,
          badge:
            "bg-red-50 text-red-700 border-red-200",
          dot: "bg-red-500",
          iconBox:
            "bg-red-50 text-red-600 border-red-100",
          description:
            "This payment is temporarily on hold and may require verification.",
        };

      default:
        return {
          label: "Processing",
          statusText: status,
          icon: Clock3,
          badge:
            "bg-slate-50 text-slate-700 border-slate-200",
          dot: "bg-slate-500",
          iconBox:
            "bg-slate-50 text-slate-600 border-slate-100",
          description:
            "Your payment is currently being processed.",
        };
    }
  };

  // =========================================================
  // ACTIVE STATUS
  // =========================================================

  const activeStatus = activePayment
    ? getStatusConfig(activePayment.status)
    : null;

  const ActiveStatusIcon =
    activeStatus?.icon || Clock3;

  // =========================================================
  // TIMELINE
  // =========================================================

  const timelineSteps = [
    {
      title: "Payment Initiated",
      shortTitle: "Initiated",
      description: "Payment request created",
    },
    {
      title: "PFMS Verified",
      shortTitle: "PFMS",
      description: "Payment verified",
    },
    {
      title: "Treasury Cleared",
      shortTitle: "Treasury",
      description: "Treasury approval completed",
    },
    {
      title: "Disbursed to Bank",
      shortTitle: "Bank Credit",
      description: "Amount sent to bank",
    },
  ];

  const currentStage = activePayment
    ? Math.min(
        Math.max(
          Number(activePayment.statusStageIndex ?? 0),
          0,
        ),
        3,
      )
    : 0;

  const isOnHold =
    activePayment?.status === "On Hold";

  const isCompleted =
    activePayment?.status === "Disbursed to Bank";

  // =========================================================
  // DATE FORMATTER
  // =========================================================

  const formatDate = (date?: string) => {
    if (!date) return "—";

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

  // =========================================================
  // COPY
  // =========================================================

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard unavailable
    }
  };

  // =========================================================
  // NO PAYMENT + BOOKED TOKEN
  // =========================================================

  if (!activePayment && latestToken) {
    const registeredQuantity = Number(
      latestToken.quantityQuintals ?? 0,
    );

    const bookedMsp = Number(
      latestToken.mspRate ??
        mspRates[latestToken.crop as CropType] ??
        0,
    );

    const estimatedValue = Number(
      latestToken.estimatedValue ??
        registeredQuantity * bookedMsp,
    );

    return (
      <section className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* HEADER */}

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Direct Benefit Transfer
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">
              Payment & DBT Status
            </h1>

            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Your procurement payment will be processed after
              physical verification and final weighbridge confirmation.
            </p>
          </div>

          {/* TOP BOARD */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* MAIN ESTIMATE */}

            <div className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">

              <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="relative p-6 sm:p-8">

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-emerald-400" />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                        Estimated Procurement Payment
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {latestToken.crop}
                      </p>
                    </div>

                  </div>

                  <span className="inline-flex self-start items-center gap-2 px-3 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    Slot Booked
                  </span>

                </div>

                {/* ESTIMATED AMOUNT */}

                <div className="mt-8">

                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Estimated Procurement Value
                  </p>

                  <div className="flex items-center gap-2 mt-1">

                    <IndianRupee className="w-7 h-7 text-emerald-400" />

                    <span className="text-4xl sm:text-5xl font-black">
                      {Math.round(
                        estimatedValue,
                      ).toLocaleString("en-IN")}
                    </span>

                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-400">
                    This is an estimated value based on your
                    registered quantity and current MSP.
                  </p>

                </div>

                {/* WARNING */}

                <div className="mt-7 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">

                  <div className="flex gap-3">

                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />

                    <div>

                      <p className="text-sm font-bold text-amber-200">
                        Final payment is not generated yet
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-amber-100/70">
                        The final payable amount will be calculated
                        using the actual quantity recorded at the
                        weighbridge. The registered quantity is only
                        an estimate.
                      </p>

                    </div>

                  </div>

                </div>

                {/* DETAILS */}

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Token
                    </p>

                    <p className="mt-1 text-lg font-black">
                      #{latestToken.tokenNumber}
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1">
                      {latestToken.tokenCode}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Registered Quantity
                    </p>

                    <p className="mt-1 text-lg font-black">
                      {registeredQuantity} Qtl
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      MSP Rate
                    </p>

                    <p className="mt-1 text-lg font-black">
                      ₹{bookedMsp.toLocaleString("en-IN")}
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1">
                      per quintal
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* BANK CARD */}

            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl shadow-sm p-6">

              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>

              <h2 className="mt-5 text-lg font-black text-slate-900">
                DBT Payment
              </h2>

              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Payment will be transferred directly to your
                registered bank account after procurement verification.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">

                <div className="flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-blue-600" />

                  <span className="text-xs font-bold text-slate-700">
                    Payment Status
                  </span>
                </div>

                <p className="mt-2 text-lg font-black text-blue-600">
                  Awaiting Procurement
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  Payment transaction will be generated after
                  weighbridge approval.
                </p>

              </div>

              <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">

                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />

                  <span className="text-xs font-bold text-emerald-800">
                    Government DBT
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-emerald-700 leading-relaxed">
                  No card or UPI payment is required from the farmer.
                  The procurement authority initiates the payment to
                  the registered bank account.
                </p>

              </div>

            </div>

          </div>

          {/* PROCUREMENT JOURNEY */}

          <div className="mt-6 bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Clock3 className="w-5 h-5" />
              </div>

              <div>

                <h2 className="text-lg font-black text-slate-900">
                  Procurement & Payment Journey
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Track every stage from booking to bank credit.
                </p>

              </div>

            </div>

            <div className="hidden md:grid grid-cols-5 gap-3 mt-8">

              {[
                {
                  title: "Slot Booked",
                  description: "Appointment confirmed",
                  active: true,
                },
                {
                  title: "Procurement",
                  description: "Waiting for arrival",
                  active: false,
                },
                {
                  title: "Weighbridge",
                  description: "Final weight",
                  active: false,
                },
                {
                  title: "Payment",
                  description: "DBT processing",
                  active: false,
                },
                {
                  title: "Bank Credit",
                  description: "Amount credited",
                  active: false,
                },
              ].map((step, index) => (

                <div
                  key={step.title}
                  className="relative text-center"
                >

                  <div
                    className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                      step.active
                        ? "bg-emerald-500 text-white ring-4 ring-emerald-100"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {step.active ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-black">
                        {index + 2}
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-3 text-xs font-bold ${
                      step.active
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {step.description}
                  </p>

                </div>

              ))}

            </div>

            <div className="md:hidden mt-7 space-y-4">

              {[
                ["Slot Booked", "Appointment confirmed", true],
                ["Procurement", "Waiting for arrival", false],
                ["Weighbridge", "Final weight", false],
                ["Payment", "DBT processing", false],
                ["Bank Credit", "Amount credited", false],
              ].map(([title, description, active], index) => (

                <div
                  key={String(title)}
                  className="flex items-center gap-3"
                >

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      active
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {active ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-black">
                        {index + 2}
                      </span>
                    )}
                  </div>

                  <div>

                    <p
                      className={`text-sm font-bold ${
                        active
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {String(title)}
                    </p>

                    <p className="text-xs text-slate-500">
                      {String(description)}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* BOOKING DETAILS */}

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Wheat className="w-5 h-5" />
                </div>

                <div>

                  <h2 className="text-lg font-black text-slate-900">
                    Registered Crop
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Information from your procurement booking.
                  </p>

                </div>

              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Crop
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {latestToken.crop}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Quantity
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {registeredQuantity} Qtl
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    MSP
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    ₹{bookedMsp.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Token
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    #{latestToken.tokenNumber}
                  </p>
                </div>

              </div>

            </div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </div>

                <div>

                  <h2 className="text-lg font-black text-slate-900">
                    Procurement Booking
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Your scheduled procurement appointment.
                  </p>

                </div>

              </div>

              <div className="mt-6 space-y-3">

                <div className="flex justify-between gap-4 p-3 rounded-xl bg-slate-50">
                  <span className="text-xs text-slate-500">
                    Date
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {latestToken.date || "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 p-3 rounded-xl bg-slate-50">
                  <span className="text-xs text-slate-500">
                    Center
                  </span>

                  <span className="text-sm font-bold text-slate-900 text-right">
                    {latestToken.centerName ||
                      "Procurement Center"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 p-3 rounded-xl bg-slate-50">
                  <span className="text-xs text-slate-500">
                    Token
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {latestToken.tokenCode ||
                      `#${latestToken.tokenNumber}`}
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* ACTION */}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">

            <Link
              to="/schedule"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
            >
              View Procurement Schedule
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>

          </div>

        </div>
      </section>
    );
  }

  // =========================================================
  // NO BOOKING + NO PAYMENT
  // =========================================================

  if (!activePayment && !latestToken) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white py-16">

        <div className="max-w-5xl mx-auto px-4 text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            Direct Benefit Transfer
          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl font-black text-slate-900">
            Payment & DBT Status
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            No procurement booking or payment transaction is available yet.
          </p>

          <Link
            to="/schedule"
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
          >
            Book Procurement Slot
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>

      </section>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-slate-50/70 to-white py-10 sm:py-14 lg:py-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <div className="mb-8">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

            <div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Direct Benefit Transfer
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
                Payment Status
              </h1>

              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                Track your procurement payment, PFMS verification,
                treasury clearance and bank disbursement in one place.
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              <Link
                to="/schedule"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold hover:bg-emerald-700 transition-colors"
              >
                Book New Slot
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/payments"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                Payment Dashboard
              </Link>

            </div>

          </div>

        </div>

        {/* QUICK STATUS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

            <div className="flex items-center gap-2 text-slate-500">
              <Wheat className="w-4 h-4 text-amber-600" />

              <span className="text-[10px] uppercase tracking-wider font-bold">
                Crop
              </span>
            </div>

            <p className="mt-2 text-sm font-black text-slate-900 truncate">
              {activePayment.crop}
            </p>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

            <div className="flex items-center gap-2 text-slate-500">
              <Banknote className="w-4 h-4 text-emerald-600" />

              <span className="text-[10px] uppercase tracking-wider font-bold">
                Net Payable
              </span>
            </div>

            <p className="mt-2 text-sm font-black text-emerald-600">
              ₹{activePayment.netPayable.toLocaleString("en-IN")}
            </p>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

            <div className="flex items-center gap-2 text-slate-500">
              <Ticket className="w-4 h-4 text-blue-600" />

              <span className="text-[10px] uppercase tracking-wider font-bold">
                Token
              </span>
            </div>

            <p className="mt-2 text-sm font-black text-slate-900">
              #{activePayment.tokenNumber}
            </p>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

            <div className="flex items-center gap-2 text-slate-500">
              <Clock3 className="w-4 h-4 text-indigo-600" />

              <span className="text-[10px] uppercase tracking-wider font-bold">
                Status
              </span>
            </div>

            <p className="mt-2 text-sm font-black text-slate-900">
              {activeStatus?.label}
            </p>

          </div>

        </div>

        {/* PREMIUM PAYMENT SUMMARY */}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* MAIN PAYMENT CARD */}

          <div
            className={`xl:col-span-8 relative overflow-hidden rounded-3xl text-white shadow-xl ${
              isOnHold
                ? "bg-red-950"
                : isCompleted
                  ? "bg-emerald-950"
                  : "bg-slate-950"
            }`}
          >

            <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

            <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative p-6 sm:p-8">

              {/* HEADER */}

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

                <div className="flex items-center gap-3">

                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                      isOnHold
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {isOnHold ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : (
                      <Wallet className="w-6 h-6" />
                    )}
                  </div>

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                      Current Payment
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      {activePayment.crop}
                    </p>

                  </div>

                </div>

                <div
                  className={`inline-flex self-start items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold ${activeStatus?.badge}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${activeStatus?.dot} ${
                      !isOnHold && !isCompleted
                        ? "animate-pulse"
                        : ""
                    }`}
                  />

                  {activeStatus?.label}
                </div>

              </div>

              {/* AMOUNT */}

              <div className="mt-8">

                <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-bold">
                  Net Payable Amount
                </p>

                <div className="flex items-center gap-2 mt-1">

                  <IndianRupee className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />

                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                    {activePayment.netPayable.toLocaleString("en-IN")}
                  </span>

                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-400">
                  Amount payable to your registered bank account
                  through the payment workflow.
                </p>

              </div>

              {/* STATUS */}

              <div
                className={`mt-7 rounded-2xl border p-4 ${
                  isOnHold
                    ? "bg-red-900/40 border-red-800"
                    : isCompleted
                      ? "bg-emerald-900/40 border-emerald-800"
                      : "bg-white/5 border-white/10"
                }`}
              >

                <div className="flex gap-3">

                  <ActiveStatusIcon
                    className={`w-5 h-5 shrink-0 ${
                      isOnHold
                        ? "text-red-400"
                        : isCompleted
                          ? "text-emerald-400"
                          : "text-amber-400"
                    }`}
                  />

                  <div>

                    <p className="text-xs sm:text-sm font-bold text-white">
                      {isOnHold
                        ? "Payment requires attention"
                        : isCompleted
                          ? "Payment successfully completed"
                          : "Payment is being processed"}
                    </p>

                    <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                      {activeStatus?.description}
                    </p>

                  </div>

                </div>

              </div>

              {/* REFERENCES */}

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">

                  <div className="flex items-center gap-2 text-slate-400">

                    <Hash className="w-4 h-4" />

                    <span className="text-[10px] uppercase tracking-wider font-bold">
                      Transaction ID
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2">

                    <span className="font-mono text-xs sm:text-sm font-bold truncate">
                      {activePayment.transactionId}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          activePayment.transactionId,
                        )
                      }
                      className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                      title="Copy Transaction ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">

                  <div className="flex items-center gap-2 text-slate-400">

                    <ShieldCheck className="w-4 h-4" />

                    <span className="text-[10px] uppercase tracking-wider font-bold">
                      PFMS Reference
                    </span>

                  </div>

                  <p className="font-mono text-xs sm:text-sm font-bold mt-2 truncate">
                    {activePayment.pfmsReferenceNo}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* SIDE SUMMARY */}

          <div className="xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">

            {/* PAYMENT DATE */}

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </div>

                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Payment Date
                </span>

              </div>

              <p className="mt-5 text-xs font-semibold text-slate-500">
                {activePayment.disbursedDate
                  ? "Actual Disbursement"
                  : "Expected Release"}
              </p>

              <p className="mt-1 text-lg font-black text-slate-900">
                {formatDate(
                  activePayment.disbursedDate ||
                    activePayment.estimatedReleaseDate,
                )}
              </p>

            </div>

            {/* BANK */}

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Landmark className="w-5 h-5" />
                </div>

                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Destination
                </span>

              </div>

              <p className="mt-5 text-xs font-semibold text-slate-500">
                Registered Bank
              </p>

              <p className="mt-1 text-lg font-black text-slate-900 truncate">
                {activePayment.bankName}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Account •••• {activePayment.accountLast4}
              </p>

            </div>

          </div>

        </div>

        {/* PAYMENT TIMELINE */}

        <div className="mt-6 bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">

            <div>

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Clock3 className="w-4 h-4" />
                </div>

                <h2 className="text-lg font-black text-slate-900">
                  Payment Timeline
                </h2>

              </div>

              <p className="mt-2 ml-11 text-xs text-slate-500">
                Your payment progress is driven by the current
                transaction status.
              </p>

            </div>

            <span
              className={`self-start sm:self-auto px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isOnHold
                  ? "bg-red-50 text-red-700"
                  : isCompleted
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-blue-50 text-blue-700"
              }`}
            >
              {isOnHold
                ? "Payment On Hold"
                : isCompleted
                  ? "Completed"
                  : `Stage ${currentStage + 1} of 4`}
            </span>

          </div>

          {/* DESKTOP */}

          <div className="hidden md:block">

            <div className="relative px-4">

              <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-slate-100 rounded-full" />

              {!isOnHold && (
                <div
                  className="absolute top-6 left-[10%] h-1 bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width:
                      currentStage === 0
                        ? "0%"
                        : `${(currentStage / 3) * 80}%`,
                  }}
                />
              )}

              <div className="relative grid grid-cols-4 gap-4">

                {timelineSteps.map((step, index) => {

                  const completed =
                    !isOnHold && index < currentStage;

                  const current =
                    !isOnHold && index === currentStage;

                  return (
                    <div
                      key={step.title}
                      className="flex flex-col items-center text-center"
                    >

                      <div
                        className={`w-12 h-12 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${
                          completed || current
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 text-slate-400"
                        } ${
                          current
                            ? "ring-4 ring-emerald-100"
                            : ""
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-black">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      <p
                        className={`mt-3 text-xs font-bold ${
                          completed || current
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {current
                          ? activePayment.status
                          : step.description}
                      </p>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

          {/* MOBILE */}

          <div className="md:hidden space-y-4">

            {timelineSteps.map((step, index) => {

              const completed =
                !isOnHold && index < currentStage;

              const current =
                !isOnHold && index === currentStage;

              return (
                <div
                  key={step.title}
                  className="flex items-start gap-3"
                >

                  <div className="flex flex-col items-center">

                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        completed || current
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-black">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {index !== timelineSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-8 mt-1 ${
                          completed
                            ? "bg-emerald-400"
                            : "bg-slate-100"
                        }`}
                      />
                    )}

                  </div>

                  <div className="pt-1">

                    <p
                      className={`text-sm font-bold ${
                        completed || current
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {current
                        ? `Current status: ${activePayment.status}`
                        : step.description}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

          {/* ON HOLD */}

          {isOnHold && (
            <div className="mt-7 p-4 rounded-2xl bg-red-50 border border-red-200 flex gap-3">

              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />

              <div>

                <p className="text-sm font-bold text-red-800">
                  Payment currently on hold
                </p>

                <p className="text-xs text-red-700 mt-1 leading-relaxed">
                  Your payment has not been cancelled. It is
                  temporarily paused and may require verification
                  before processing can continue.
                </p>

              </div>

            </div>
          )}

        </div>

        {/* PAYMENT + PROCUREMENT DETAILS */}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* PAYMENT BREAKDOWN */}

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

            <div className="p-6 border-b border-slate-100">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CircleDollarSign className="w-5 h-5" />
                </div>

                <div>

                  <h2 className="text-lg font-black text-slate-900">
                    Payment Summary
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Transparent calculation of your payable amount.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-6 space-y-4">

              <div className="flex justify-between gap-4">

                <span className="text-sm text-slate-500">
                  Gross Procurement Amount
                </span>

                <span className="text-sm font-bold text-slate-900">
                  ₹
                  {activePayment.grossAmount.toLocaleString(
                    "en-IN",
                  )}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-sm text-slate-500">
                  Deductions
                </span>

                <span className="text-sm font-bold text-red-600">
                  − ₹
                  {activePayment.deductions.toLocaleString(
                    "en-IN",
                  )}
                </span>

              </div>

              <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-center gap-4">

                <div>

                  <p className="text-sm font-black text-slate-900">
                    Net Payable
                  </p>

                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Amount eligible for bank transfer
                  </p>

                </div>

                <p className="text-xl font-black text-emerald-600">
                  ₹
                  {activePayment.netPayable.toLocaleString(
                    "en-IN",
                  )}
                </p>

              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex gap-2">

                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />

                <p className="text-[10px] text-emerald-800 leading-relaxed">
                  No commission is deducted by KishanSetu. The
                  displayed amount comes directly from the transaction
                  record.
                </p>

              </div>

            </div>

          </div>

          {/* PROCUREMENT DETAILS */}

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

            <div className="p-6 border-b border-slate-100">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Wheat className="w-5 h-5" />
                </div>

                <div>

                  <h2 className="text-lg font-black text-slate-900">
                    Procurement Details
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Details used to calculate your payment.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-6 grid grid-cols-2 gap-4">

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">

                <p className={labelStyle}>
                  Crop
                </p>

                <p className={valueStyle}>
                  {activePayment.crop}
                </p>

              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">

                <p className={labelStyle}>
                  Quantity
                </p>

                <p className={valueStyle}>
                  {activePayment.grossWeightQuintals} Qtl
                </p>

              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">

                <p className={labelStyle}>
                  MSP Rate
                </p>

                <p className={valueStyle}>
                  ₹
                  {activePayment.mspRatePerQuintal.toLocaleString(
                    "en-IN",
                  )}
                  /Qtl
                </p>

              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">

                <p className={labelStyle}>
                  Token
                </p>

                <p className={valueStyle}>
                  #{activePayment.tokenNumber}
                </p>

              </div>

              <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100">

                <div className="flex items-center gap-2">

                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />

                  <p className={labelStyle}>
                    Procurement Center
                  </p>

                </div>

                <p className={valueStyle}>
                  {activePayment.centerName}
                </p>

              </div>

              <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100">

                <div className="flex items-center gap-2">

                  <CalendarDays className="w-3.5 h-3.5 text-blue-600" />

                  <p className={labelStyle}>
                    Procurement Date
                  </p>

                </div>

                <p className={valueStyle}>
                  {formatDate(activePayment.procuredDate)}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* BANK + TRANSACTION */}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* BANK */}

          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>

              <div>

                <h2 className="text-lg font-black">
                  Bank Credit Details
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Registered destination for DBT payment.
                </p>

              </div>

            </div>

            <div className="mt-6 space-y-3">

              <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-white/5 border border-white/10">

                <span className="text-xs text-slate-400">
                  Bank
                </span>

                <span className="text-sm font-bold text-right">
                  {activePayment.bankName}
                </span>

              </div>

              <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-white/5 border border-white/10">

                <span className="text-xs text-slate-400">
                  Account
                </span>

                <span className="text-sm font-bold font-mono">
                  •••• {activePayment.accountLast4}
                </span>

              </div>

              <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-white/5 border border-white/10">

                <span className="text-xs text-slate-400">
                  IFSC
                </span>

                <span className="text-sm font-bold font-mono">
                  {activePayment.ifscCode}
                </span>

              </div>

              {activePayment.utrNumber && (
                <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-900">

                  <span className="text-xs text-emerald-300">
                    UTR Number
                  </span>

                  <span className="text-xs font-bold font-mono text-emerald-200 truncate">
                    {activePayment.utrNumber}
                  </span>

                </div>
              )}

            </div>

          </div>

          {/* TRANSACTION INFORMATION */}

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-7">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>

              <div>

                <h2 className="text-lg font-black text-slate-900">
                  Transaction Information
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Complete reference information.
                </p>

              </div>

            </div>

            <div className="mt-6 space-y-4">

              <div>

                <p className={labelStyle}>
                  Transaction ID
                </p>

                <div className="flex items-center justify-between gap-3 mt-1">

                  <p className="text-sm font-bold font-mono text-slate-900 break-all">
                    {activePayment.transactionId}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        activePayment.transactionId,
                      )
                    }
                    className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>

              <div className="border-t border-slate-100 pt-4">

                <p className={labelStyle}>
                  PFMS Reference Number
                </p>

                <p className="text-sm font-bold font-mono text-slate-900 mt-1 break-all">
                  {activePayment.pfmsReferenceNo}
                </p>

              </div>

              <div className="border-t border-slate-100 pt-4">

                <p className={labelStyle}>
                  Expected Release
                </p>

                <p className="text-sm font-bold text-slate-900 mt-1">
                  {formatDate(
                    activePayment.estimatedReleaseDate,
                  )}
                </p>

              </div>

              {activePayment.disbursedDate && (
                <div className="border-t border-slate-100 pt-4">

                  <p className={labelStyle}>
                    Actual Disbursement Date
                  </p>

                  <p className="text-sm font-bold text-emerald-600 mt-1">
                    {formatDate(
                      activePayment.disbursedDate,
                    )}
                  </p>

                </div>
              )}

              {activePayment.utrNumber && (
                <div className="border-t border-slate-100 pt-4">

                  <p className={labelStyle}>
                    UTR Number
                  </p>

                  <p className="text-sm font-bold font-mono text-slate-900 mt-1 break-all">
                    {activePayment.utrNumber}
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* PAYMENT HISTORY */}

        <div className="mt-6 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

          <div className="p-6 sm:p-7 border-b border-slate-100">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>

                <div>

                  <h2 className="text-lg font-black text-slate-900">
                    Payment History
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    All payments from your account.
                  </p>

                </div>

              </div>

              <div className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                {sortedPayments.length}{" "}
                {sortedPayments.length === 1
                  ? "Transaction"
                  : "Transactions"}
              </div>

            </div>

          </div>

          <div className="divide-y divide-slate-100">

            {sortedPayments.map((payment) => {

              const config =
                getStatusConfig(payment.status);

              const StatusIcon = config.icon;

              const expanded =
                expandedPaymentId === payment.id;

              return (
                <div key={payment.id}>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedPaymentId(
                        expanded ? null : payment.id,
                      )
                    }
                    className="w-full text-left p-5 sm:p-6 hover:bg-slate-50 transition-colors"
                  >

                    <div className="flex items-center gap-4">

                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${config.iconBox}`}
                      >
                        <StatusIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <p className="text-sm font-bold text-slate-900">
                            {payment.crop}
                          </p>

                          <span
                            className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${config.badge}`}
                          >
                            {config.label}
                          </span>

                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">

                          <span className="text-[11px] text-slate-500">
                            {formatDate(
                              payment.procuredDate,
                            )}
                          </span>

                          <span className="text-[11px] text-slate-500">
                            {payment.grossWeightQuintals} Qtl
                          </span>

                          <span className="text-[11px] font-mono text-slate-400 truncate max-w-[180px]">
                            {payment.transactionId}
                          </span>

                        </div>

                      </div>

                      <div className="text-right shrink-0">

                        <p className="text-base sm:text-lg font-black text-slate-900">
                          ₹
                          {payment.netPayable.toLocaleString(
                            "en-IN",
                          )}
                        </p>

                        <div className="flex justify-end mt-1 text-slate-400">

                          {expanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}

                        </div>

                      </div>

                    </div>

                  </button>

                  {expanded && (
                    <div className="px-5 sm:px-6 pb-6">

                      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                          <div>

                            <p className={labelStyle}>
                              Gross Amount
                            </p>

                            <p className={valueStyle}>
                              ₹
                              {payment.grossAmount.toLocaleString(
                                "en-IN",
                              )}
                            </p>

                          </div>

                          <div>

                            <p className={labelStyle}>
                              Deductions
                            </p>

                            <p className="text-sm font-bold text-red-600 mt-1">
                              ₹
                              {payment.deductions.toLocaleString(
                                "en-IN",
                              )}
                            </p>

                          </div>

                          <div>

                            <p className={labelStyle}>
                              MSP Rate
                            </p>

                            <p className={valueStyle}>
                              ₹
                              {payment.mspRatePerQuintal.toLocaleString(
                                "en-IN",
                              )}
                              /Qtl
                            </p>

                          </div>

                          <div>

                            <p className={labelStyle}>
                              Token
                            </p>

                            <p className={valueStyle}>
                              #{payment.tokenNumber}
                            </p>

                          </div>

                          <div className="sm:col-span-2">

                            <p className={labelStyle}>
                              Procurement Center
                            </p>

                            <p className={valueStyle}>
                              {payment.centerName}
                            </p>

                          </div>

                          <div>

                            <p className={labelStyle}>
                              Bank
                            </p>

                            <p className={valueStyle}>
                              {payment.bankName}
                            </p>

                          </div>

                          <div>

                            <p className={labelStyle}>
                              Account
                            </p>

                            <p className={`${valueStyle} font-mono`}>
                              •••• {payment.accountLast4}
                            </p>

                          </div>

                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">

                          <div>

                            <p className={labelStyle}>
                              Transaction ID
                            </p>

                            <p className="text-xs font-mono font-bold text-slate-700 mt-1 break-all">
                              {payment.transactionId}
                            </p>

                          </div>

                          <div>

                            <p className={labelStyle}>
                              PFMS Reference
                            </p>

                            <p className="text-xs font-mono font-bold text-slate-700 mt-1 break-all">
                              {payment.pfmsReferenceNo}
                            </p>

                          </div>

                          {payment.utrNumber && (
                            <div>

                              <p className={labelStyle}>
                                UTR Number
                              </p>

                              <p className="text-xs font-mono font-bold text-emerald-600 mt-1 break-all">
                                {payment.utrNumber}
                              </p>

                            </div>
                          )}

                          <div>

                            <p className={labelStyle}>
                              Payment Date
                            </p>

                            <p className="text-xs font-bold text-slate-700 mt-1">
                              {formatDate(
                                payment.disbursedDate ||
                                  payment.estimatedReleaseDate,
                              )}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

          <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div className="flex items-center gap-2 text-[11px] text-slate-500">

              <ShieldCheck className="w-4 h-4 text-emerald-600" />

              Payment records are securely tracked.

            </div>

            <Link
              to="/payments"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              Payment Dashboard
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

          </div>

        </div>

        {/* MSP CALCULATOR */}

        <div className="mt-6 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-12">

            {/* INTRO */}

            <div className="lg:col-span-4 bg-slate-950 text-white p-6 sm:p-8 relative overflow-hidden">

              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="relative">

                <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>

                <h2 className="mt-5 text-2xl font-black">
                  MSP Calculator
                </h2>

                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  Estimate the procurement value of your crop
                  using the selected MSP rate.
                </p>

                <div className="mt-7 space-y-3">

                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Crop-specific MSP rate
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Quantity-based calculation
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Instant estimated value
                  </div>

                </div>

              </div>

            </div>

            {/* CALCULATOR */}

            <div className="lg:col-span-8 p-6 sm:p-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-5">

                  <div>

                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-700 mb-2">
                      Select Crop
                    </label>

                    <select
                      value={calcCrop}
                      onChange={(e) =>
                        setCalcCrop(
                          e.target.value as CropType,
                        )
                      }
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {Object.keys(mspRates).map((crop) => (

                        <option
                          key={crop}
                          value={crop}
                        >
                          {crop} — ₹
                          {mspRates[
                            crop as CropType
                          ].toLocaleString("en-IN")}
                          /Qtl
                        </option>

                      ))}
                    </select>

                  </div>

                  <div>

                    <div className="flex items-center justify-between mb-2">

                      <label className="text-xs uppercase tracking-wider font-bold text-slate-700">
                        Quantity
                      </label>

                      <span className="text-sm font-black text-emerald-600">
                        {calcQuantity} Qtl
                      </span>

                    </div>

                    <input
                      type="range"
                      min="5"
                      max="200"
                      step="1"
                      value={calcQuantity}
                      onChange={(e) =>
                        setCalcQuantity(
                          Number(e.target.value),
                        )
                      }
                      className="w-full accent-emerald-600 cursor-pointer"
                    />

                    <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                      <span>5 Qtl</span>

                      <span>
                        {calcQuantity * 100} kg
                      </span>

                      <span>200 Qtl</span>
                    </div>

                  </div>

                </div>

                {/* RESULT */}

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex flex-col justify-center">

                  <p className="text-xs font-semibold text-slate-500">
                    Estimated Procurement Value
                  </p>

                  <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                    ₹
                    {calculatedTotal.toLocaleString(
                      "en-IN",
                    )}
                  </p>

                  <div className="mt-3 inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">

                    <Sparkles className="w-3 h-3" />

                    {calcQuantity} Qtl × ₹
                    {mspRates[
                      calcCrop
                    ].toLocaleString("en-IN")}

                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200 space-y-2">

                    <div className="flex justify-between gap-3 text-xs">

                      <span className="text-slate-500">
                        Crop
                      </span>

                      <span className="font-bold text-slate-900 text-right">
                        {calcCrop}
                      </span>

                    </div>

                    <div className="flex justify-between gap-3 text-xs">

                      <span className="text-slate-500">
                        MSP Rate
                      </span>

                      <span className="font-bold text-slate-900">
                        ₹
                        {mspRates[
                          calcCrop
                        ].toLocaleString("en-IN")}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              <Link
                to="/schedule"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
              >
                Book Procurement Slot
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-center text-[10px] text-slate-400 mt-3">
                Estimated value based on the selected MSP rate.
              </p>

            </div>

          </div>

        </div>

        {/* TRUST FOOTER */}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>

              <p className="text-xs font-bold text-slate-900">
                Secure Tracking
              </p>

              <p className="text-[10px] text-slate-500 mt-0.5">
                Transparent payment status
              </p>

            </div>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>

            <div>

              <p className="text-xs font-bold text-slate-900">
                Direct Bank Transfer
              </p>

              <p className="text-[10px] text-slate-500 mt-0.5">
                Payment sent to registered bank
              </p>

            </div>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>

            <div>

              <p className="text-xs font-bold text-slate-900">
                Complete History
              </p>

              <p className="text-[10px] text-slate-500 mt-0.5">
                Every transaction in one place
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

/* =========================================================
   SMALL REUSABLE CLASSES
========================================================= */

const labelStyle =
  "text-[10px] uppercase tracking-wider text-slate-400 font-bold";

const valueStyle =
  "text-sm font-bold text-slate-900 mt-1";