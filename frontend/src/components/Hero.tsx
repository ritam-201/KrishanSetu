import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  MapPin,
  CheckCircle2,
  Sprout,
  ShieldCheck,
  Wheat,
  Activity,
  CalendarDays,
  Ticket,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import heroFarmerImg from "../assets/images/farmer_hero_field_1787461286978.jpg";

export const Hero: React.FC = () => {
  const { t, user, centers, queueTokens } = useAuth();

  /*
   * =========================================================
   * FARMER TOKEN DATA
   * =========================================================
   */

  const defaultCenter = centers?.[0];

  /*
   * Find ONLY the currently logged-in farmer's active token.
   *
   * Valid TokenStatus values from types.ts:
   * waiting
   * called
   * processing
   * next
   * completed
   * rejected
   */
  const farmerToken = queueTokens?.find(
    (token) =>
      token.farmerId === user?.id &&
      (
        token.status === "waiting" ||
        token.status === "called" ||
        token.status === "processing" ||
        token.status === "next"
      )
  );

  /*
   * Token number
   */
  const tokenNumber = farmerToken?.tokenNumber ?? null;

  /*
   * Procurement centre
   *
   * QueueToken already contains centerName.
   */
  const centerName =
    farmerToken?.centerName ||
    defaultCenter?.name ||
    "Your Procurement Centre";

  /*
   * Crop
   *
   * QueueToken already contains crop.
   */
  const cropName =
    farmerToken?.crop ||
    "Your Crop";

  /*
   * Token status
   */
  const tokenStatus = farmerToken?.status ?? "next";

  /*
   * =========================================================
   * PEOPLE AHEAD
   * =========================================================
   *
   * QueueToken does NOT contain peopleAhead.
   *
   * We calculate it using:
   *
   * Your token number - current serving token
   */
  const currentServingToken =
    centers?.find(
      (center) => center.id === farmerToken?.centerId
    )?.currentServingToken ?? 0;

  const peopleAhead =
    farmerToken
      ? Math.max(
          0,
          farmerToken.tokenNumber - currentServingToken
        )
      : null;

  /*
   * Estimated waiting time
   *
   * Correct field from QueueToken:
   * estimatedWaitMinutes
   */
  const estimatedWait =
    farmerToken?.estimatedWaitMinutes ?? null;

  /*
   * Booking date
   */
  const bookingDate =
    farmerToken?.date ?? null;

  /*
   * Booking time
   *
   * timeWindow is the primary booking time.
   * slotTime is used as fallback.
   */
  const bookingTime =
    farmerToken?.timeWindow ||
    farmerToken?.slotTime ||
    null;

  /*
   * Whether the farmer currently has a token.
   */
  const hasActiveToken = Boolean(farmerToken);

  /*
   * Status text shown on the token card.
   */
  const statusLabel =
    tokenStatus === "called"
      ? "Your Turn"
      : tokenStatus === "processing"
      ? "In Progress"
      : tokenStatus === "next"
      ? "Next"
      : tokenStatus === "waiting"
      ? "Waiting"
      : "Booked";

  return (
    <section
      id="hero-section"
      className="relative overflow-hidden bg-[#f6faf7]"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Green glow */}
        <div className="absolute -right-40 -top-40 h-130 w-130 rounded-full bg-emerald-200/30 blur-[120px]" />

        <div className="absolute -bottom-52 -left-40 h-125 w-125rounded-full bg-lime-200/20 blur-[120px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-linear(#064e3b 1px, transparent 1px), linear-linear(90deg, #064e3b 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />
      </div>

      {/* =========================================================
          HERO CONTAINER
      ========================================================== */}

      <div className="relative mx-auto max-w-362.5 px-5 sm:px-8 lg:px-12">
        <div className="grid min-h-[calc(100vh-72px)] items-center gap-12 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:py-14">
          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}

          <div className="relative z-10 max-w-2xl">
            {/* Small badge */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-600" />
              </span>

              <span className="text-[10px] font-extrabold tracking-[0.15em] text-emerald-800">
                {t.heroBadge || "SMART FARMER PROCUREMENT"}
              </span>
            </div>

            {/* Main heading */}

            <h1 className="text-[3.4rem] font-black leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[5rem]">
              {t.heroHeadline1 || "Sell Smarter."}

              <span className="block bg-linear-to-r from-emerald-700 via-green-600 to-lime-500 bg-clip-text text-transparent">
                {t.heroHeadline2 || "Grow Better."}
              </span>

              <span className="mt-2 block text-slate-900">
                {t.heroHeadline3 || "With Kisan Setu."}
              </span>
            </h1>

            {/* Description */}

            <p className="mt-7 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-lg">
              {t.heroSubheadline ||
                "Connect with procurement centres, book your slot, track your queue and manage your crop journey from one simple platform."}
            </p>

            {/* =================================================
                CTA BUTTONS
            ================================================== */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {/* Primary */}

              <Link
                to="/schedule"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-[0_15px_35px_rgba(16,185,129,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-[0_20px_40px_rgba(16,185,129,0.28)] sm:px-7 sm:text-base"
              >
                <CalendarDays className="h-5 w-5" />

                <span>
                  {t.heroCtaPrimary || "Book a Procurement Slot"}
                </span>

                <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Secondary */}

              <a
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50 sm:px-7 sm:text-base"
              >
                <Sprout className="h-5 w-5 text-emerald-600" />

                <span>
                  {t.heroCtaSecondary || "How Kisan Setu Works"}
                </span>

                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* =================================================
                TRUST FEATURES
            ================================================== */}

            <div className="mt-9 border-t border-slate-200 pt-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Feature 1 */}

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                    <ShieldCheck className="h-5 w-5 text-emerald-700" />
                  </div>

                  <div>
                    <p className="text-xs font-black text-slate-800">
                      Verified
                    </p>

                    <p className="text-[11px] text-slate-500">
                      Procurement
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                    <Activity className="h-5 w-5 text-blue-700" />
                  </div>

                  <div>
                    <p className="text-xs font-black text-slate-800">
                      Live Queue
                    </p>

                    <p className="text-[11px] text-slate-500">
                      Real-time tracking
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                    <CheckCircle2 className="h-5 w-5 text-amber-600" />
                  </div>

                  <div>
                    <p className="text-xs font-black text-slate-800">
                      Transparent
                    </p>

                    <p className="text-[11px] text-slate-500">
                      Payments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT IMAGE
          ====================================================== */}

          <div className="relative mx-auto w-full max-w-2xl">
            {/* Decorative glow */}

            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />

            <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-lime-200/25 blur-3xl" />

            {/* Main image */}

            <div className="relative overflow-hidden rounded-[2.5rem] border-[7px] border-white bg-white shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
              <div className="aspect-4/3 sm:aspect-16/11">
                <img
                  src={heroFarmerImg}
                  alt="Farmer using Kisan Setu"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.035]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* =================================================
                TOKEN CARD
            ================================================== */}

            <div className="relative z-20 mx-4 -mt-14 sm:mx-10 sm:-mt-16">
              <div className="rounded-[1.7rem] border border-white/90 bg-white p-5 shadow-[0_25px_60px_rgba(15,23,42,0.16)] sm:p-6">
                {hasActiveToken ? (
                  <>
                    {/* Token header */}

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                          <Ticket className="h-5 w-5 text-emerald-600" />
                        </div>

                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
                            Your Token
                          </p>

                          <p className="mt-0.5 text-sm font-black text-slate-900">
                            Procurement Pass
                          </p>
                        </div>
                      </div>

                      {/* Status */}

                      <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />

                        <span className="text-[10px] font-black text-emerald-700">
                          {statusLabel}
                        </span>
                      </div>
                    </div>

                    {/* Token number */}

                    <div className="mt-5">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
                        Token Number
                      </p>

                      <div className="mt-1 flex items-center justify-between gap-4">
                        <p className="text-4xl font-black tracking-[-0.04em] text-slate-950">
                          #{tokenNumber}
                        </p>

                        <div className="flex min-w-0 items-center gap-2">
                          <Wheat className="h-4 w-4 shrink-0 text-emerald-600" />

                          <span className="truncate text-sm font-bold text-slate-700">
                            {cropName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}

                    <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
                      {/* Centre */}

                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Centre
                          </p>

                          <p className="truncate text-xs font-bold text-slate-800">
                            {centerName}
                          </p>
                        </div>
                      </div>

                      {/* Queue */}

                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Ahead
                          </p>

                          <p className="text-xs font-bold text-slate-800">
                            {peopleAhead !== null
                              ? `${peopleAhead} farmer${
                                  peopleAhead === 1 ? "" : "s"
                                }`
                              : "Updating"}
                          </p>
                        </div>
                      </div>

                      {/* Wait */}

                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-50">
                          <Clock3 className="h-4 w-4 text-lime-600" />
                        </div>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Est. Wait
                          </p>

                          <p className="text-xs font-bold text-slate-800">
                            {estimatedWait !== null
                              ? `${estimatedWait} min`
                              : "Updating"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Booking */}

                    {(bookingDate || bookingTime) && (
                      <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-50/70 px-4 py-3">
                        <CalendarDays className="h-4 w-4 shrink-0 text-emerald-600" />

                        <div>
                          <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600">
                            Scheduled
                          </p>

                          <p className="text-xs font-bold text-slate-800">
                            {bookingDate || "Scheduled"}

                            {bookingTime
                              ? ` • ${bookingTime}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* =================================================
                     EMPTY TOKEN STATE
                  ================================================== */

                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                        <CalendarDays className="h-5 w-5 text-emerald-600" />
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
                          Procurement
                        </p>

                        <p className="mt-0.5 text-sm font-black text-slate-900">
                          No active booking
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Book your procurement slot and receive a digital token
                      before visiting the centre.
                    </p>

                    <Link
                      to="/schedule"
                      className="group mt-4 flex items-center justify-between rounded-xl bg-emerald-600 px-4 py-3 text-xs font-black text-white transition-all hover:bg-emerald-700"
                    >
                      <span>Book your slot</span>

                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* =================================================
                SMALL SMART FARMING BADGE
            ================================================== */}

            <div className="mt-5 flex justify-center sm:justify-end">
              <div className="inline-flex items-center gap-3 rounded-full border border-emerald-100 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                  <Sprout className="h-4 w-4 text-emerald-600" />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600">
                    Smart Farming
                  </p>

                  <p className="text-[10px] font-bold text-slate-700">
                    Simple • Transparent • Digital
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          BOTTOM BENEFITS
      ========================================================== */}

      <div className="relative border-t border-slate-200/80 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto grid max-w-362.5 grid-cols-1 sm:grid-cols-3">
          {/* Item 1 */}

          <div className="flex items-center gap-4 px-6 py-5 sm:border-r sm:border-slate-200">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <Ticket className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs font-black text-slate-900">
                Digital Token
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Less waiting at centres
              </p>
            </div>
          </div>

          {/* Item 2 */}

          <div className="flex items-center gap-4 border-t border-slate-200 px-6 py-5 sm:border-r sm:border-t-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <p className="text-xs font-black text-slate-900">
                Live Queue
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Track your position
              </p>
            </div>
          </div>

          {/* Item 3 */}

          <div className="flex items-center gap-4 border-t border-slate-200 px-6 py-5 sm:border-t-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <CheckCircle2 className="h-5 w-5 text-amber-500" />
            </div>

            <div>
              <p className="text-xs font-black text-slate-900">
                Transparent Procurement
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Track status & payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};