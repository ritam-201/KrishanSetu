import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Search,
  Filter,
  MapPin,
  Clock3,
  Wheat,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Ticket,
  UserRound,
  BadgeCheck,
  TrendingUp,
  RefreshCw,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import type { ProcurementSlot, QueueToken } from "../types";
import BookSlotModal from "../components/BookSlotModal";

/* =========================================================
   WEST BENGAL DISTRICTS
========================================================= */

const WEST_BENGAL_DISTRICTS = [
  "Alipurduar",
  "Bankura",
  "Birbhum",
  "Cooch Behar",
  "Dakshin Dinajpur",
  "Darjeeling",
  "Hooghly",
  "Howrah",
  "Jalpaiguri",
  "Jhargram",
  "Kalimpong",
  "Kolkata",
  "Maldah",
  "Murshidabad",
  "Nadia",
  "North 24 Parganas",
  "Paschim Bardhaman",
  "Paschim Medinipur",
  "Purba Bardhaman",
  "Purba Medinipur",
  "Purulia",
  "South 24 Parganas",
  "Uttar Dinajpur",
];

/* =========================================================
   TIME WINDOWS
========================================================= */

const PROCUREMENT_TIME_WINDOWS = [
  "07:00 AM – 08:00 AM",
  "08:00 AM – 09:00 AM",
  "09:00 AM – 10:00 AM",
  "10:00 AM – 11:00 AM",
  "11:00 AM – 12:00 PM",
  "12:00 PM – 01:00 PM",
  "01:00 PM – 02:00 PM",
  "02:00 PM – 03:00 PM",
  "03:00 PM – 04:00 PM",
  "04:00 PM – 05:00 PM",
  "05:00 PM – 06:00 PM",
  "06:00 PM – 07:00 PM",
];

export const ProcurementSchedulePage: React.FC = () => {
  const { slots, user } = useAuth();

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [selectedCrop, setSelectedCrop] =
    useState<string>("All");

  const [selectedDistrict, setSelectedDistrict] =
    useState<string>("All");

  /*
   * Empty string means "All Dates".
   *
   * We use a native HTML date input so the browser opens
   * the real calendar picker.
   */
  const [selectedDate, setSelectedDate] =
    useState<string>("");

  const [searchQuery, setSearchQuery] =
    useState<string>("");

  /* =======================================================
     BOOKING MODAL STATE
  ======================================================= */

  const [isBookModalOpen, setIsBookModalOpen] =
    useState(false);

  const [activeCenterForBooking, setActiveCenterForBooking] =
    useState<string>("CTR-001");

  const [activeBookingDate, setActiveBookingDate] =
    useState<string>("");

  const [activeBookingCrop, setActiveBookingCrop] =
    useState<ProcurementSlot["crop"] | undefined>(
      undefined
    );

  const [activeBookingTime, setActiveBookingTime] =
    useState<string>("");

  const [lastBookedToken, setLastBookedToken] =
    useState<QueueToken | null>(null);

  /* =========================================================
     ACCOUNT HOLDER
  ========================================================= */

  const accountHolderName =
    user?.name?.trim() || "Account Holder";

  /* =========================================================
     DISTRICT LIST
     
     IMPORTANT:
     Do NOT derive districts from slots.
     All 23 West Bengal districts are always available.
  ========================================================= */

  const districts = useMemo(() => {
    return ["All", ...WEST_BENGAL_DISTRICTS];
  }, []);

  /* =========================================================
     CROP LIST
  ========================================================= */

  const cropList = useMemo(() => {
    const uniqueCrops = Array.from(
      new Set(slots.map((slot) => slot.crop))
    ).sort();

    return ["All", ...uniqueCrops];
  }, [slots]);

  /* =========================================================
     TODAY
     
     Used as minimum date for calendar.
  ========================================================= */

  const today = useMemo(() => {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  /* =========================================================
     FILTER SLOTS
  ========================================================= */

  const filteredSlots = useMemo(() => {
    return slots
      .filter((slot) => {
        const matchCrop =
          selectedCrop === "All" ||
          slot.crop === selectedCrop;

        const matchDistrict =
          selectedDistrict === "All" ||
          slot.district.toLowerCase() ===
            selectedDistrict.toLowerCase();

        const matchDate =
          !selectedDate ||
          slot.date === selectedDate;

        const search =
          searchQuery
            .toLowerCase()
            .trim();

        const matchSearch =
          !search ||
          slot.centerName
            .toLowerCase()
            .includes(search) ||
          slot.district
            .toLowerCase()
            .includes(search) ||
          slot.crop
            .toLowerCase()
            .includes(search) ||
          slot.timeWindow
            .toLowerCase()
            .includes(search);

        return (
          matchCrop &&
          matchDistrict &&
          matchDate &&
          matchSearch
        );
      })
      .sort((a, b) => {
        /*
         * Sort by date first, then time.
         */
        const dateCompare =
          a.date.localeCompare(b.date);

        if (dateCompare !== 0) {
          return dateCompare;
        }

        return a.timeWindow.localeCompare(
          b.timeWindow
        );
      });
  }, [
    slots,
    selectedCrop,
    selectedDistrict,
    selectedDate,
    searchQuery,
  ]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatDate = (date: string) => {
    if (!date) {
      return "Select date";
    }

    const parsedDate =
      new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getDay = (date: string) => {
    const parsedDate =
      new Date(`${date}T00:00:00`);

    return parsedDate.getDate();
  };

  const getMonth = (date: string) => {
    const parsedDate =
      new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        month: "short",
      }
    );
  };

  /* =========================================================
     SLOT STATUS
  ========================================================= */

  const getStatus = (
    slot: ProcurementSlot
  ) => {
    const available = Math.max(
      0,
      slot.totalSlots -
        slot.bookedSlots
    );

    if (available <= 0) {
      return {
        label: "Fully Booked",
        className:
          "bg-red-50 text-red-700 border-red-100",
        dot: "bg-red-500",
      };
    }

    if (available <= 3) {
      return {
        label: "Filling Fast",
        className:
          "bg-amber-50 text-amber-700 border-amber-100",
        dot: "bg-amber-500",
      };
    }

    return {
      label: "Available",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-100",
      dot: "bg-emerald-500",
    };
  };

  /* =========================================================
     OPEN BOOKING MODAL
     
     Pass the selected schedule's:
     - center
     - date
     - crop
     - time
     
     into the booking modal.
  ========================================================= */

  const handleBookForSlot = (
    slot: ProcurementSlot
  ) => {
    setActiveCenterForBooking(
      slot.centerId
    );

    setActiveBookingDate(
      slot.date
    );

    setActiveBookingCrop(
      slot.crop
    );

    setActiveBookingTime(
      slot.timeWindow
    );

    setIsBookModalOpen(true);
  };

  /* =========================================================
     OPEN GENERAL BOOKING MODAL
     
     This can be useful when no existing schedule is shown.
  ========================================================= */

  const handleGeneralBooking = () => {
    setActiveCenterForBooking(
      slots[0]?.centerId ||
        "CTR-001"
    );

    setActiveBookingDate(
      selectedDate || ""
    );

    setActiveBookingCrop(
      selectedCrop !== "All"
        ? (selectedCrop as ProcurementSlot["crop"])
        : undefined
    );

    setActiveBookingTime("");

    setIsBookModalOpen(true);
  };

  /* =========================================================
     RESET FILTERS
  ========================================================= */

  const resetFilters = () => {
    setSelectedCrop("All");
    setSelectedDistrict("All");
    setSelectedDate("");
    setSearchQuery("");
  };

  /* =========================================================
     CLEAR DATE
  ========================================================= */

  const clearDate = () => {
    setSelectedDate("");
  };

  /* =========================================================
     FIND UPDATED SLOT AFTER BOOKING
  ========================================================= */

  const updatedBookedSlot = useMemo(() => {
    if (!lastBookedToken) {
      return null;
    }

    return slots.find(
      (slot) =>
        slot.centerId ===
          lastBookedToken.centerId &&
        slot.date ===
          lastBookedToken.date &&
        slot.timeWindow ===
          lastBookedToken.timeWindow &&
        slot.crop ===
          lastBookedToken.crop
    );
  }, [
    slots,
    lastBookedToken,
  ]);

  /* =========================================================
     ACTIVE FILTER STATE
  ========================================================= */

  const hasActiveFilters =
    selectedCrop !== "All" ||
    selectedDistrict !== "All" ||
    Boolean(selectedDate) ||
    Boolean(searchQuery);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#FAFBF7] pb-16">
      {/* ======================================================
          TOP HERO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-[#E5EBDD] bg-linear-to-br from-[#F4F8EE] via-[#FAFBF7] to-[#EEF5E8]">
        {/* Decorative background */}
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#DCEBD2] opacity-40 blur-3xl" />

        <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#E6F0DA] opacity-50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              {/* Government badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4E3CA] bg-white/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#315C38] shadow-sm backdrop-blur">
                <BadgeCheck className="h-4 w-4 text-[#4A7C4E]" />

                Verified Procurement Network
              </div>

              {/* Heading */}
              <h1 className="font-serif text-3xl font-bold tracking-tight text-[#123D24] sm:text-4xl lg:text-5xl">
                State Mandi

                <span className="block text-[#4A7C4E]">
                  Procurement Schedule
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5D675D] sm:text-base">
                Find verified MSP procurement schedules,
                check live slot availability, and reserve
                your preferred mandi appointment with
                confidence.
              </p>

              {/* Small stats */}
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-[#DCE7D5] bg-white px-3 py-2 shadow-sm">
                  <CalendarDays className="h-4 w-4 text-[#4A7C4E]" />

                  <span className="text-xs font-semibold text-[#405044]">
                    {slots.length} Active Schedules
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-[#DCE7D5] bg-white px-3 py-2 shadow-sm">
                  <TrendingUp className="h-4 w-4 text-[#4A7C4E]" />

                  <span className="text-xs font-semibold text-[#405044]">
                    Live Availability
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-[#DCE7D5] bg-white px-3 py-2 shadow-sm">
                  <MapPin className="h-4 w-4 text-[#4A7C4E]" />

                  <span className="text-xs font-semibold text-[#405044]">
                    23 WB Districts
                  </span>
                </div>
              </div>
            </div>

            {/* Account card */}
            <div className="w-full lg:w-auto">
              <div className="rounded-2xl border border-[#DCE7D5] bg-white/90 p-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F0E1] text-[#315C38]">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Account Holder
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-[#123D24]">
                      {accountHolderName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* ====================================================
            BOOKING SUCCESS CARD
        ==================================================== */}

        {lastBookedToken && (
          <div className="mb-8 overflow-hidden rounded-3xl border border-[#CFE2C5] bg-white shadow-sm">
            <div className="bg-linear-to-r from-[#123D24] to-[#285B35] px-5 py-4 text-white sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <CheckCircle2 className="h-5 w-5 text-[#B8D69F]" />
                </div>

                <div>
                  <h2 className="text-sm font-bold sm:text-base">
                    Booking Confirmed Successfully
                  </h2>

                  <p className="mt-0.5 text-xs text-white/70">
                    Your procurement slot has been added to
                    your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
              {/* Account holder */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Account Holder
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-[#4A7C4E]" />

                  <p className="text-sm font-bold text-[#123D24]">
                    {accountHolderName}
                  </p>
                </div>
              </div>

              {/* Token */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Token Number
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-[#4A7C4E]" />

                  <p className="text-sm font-bold text-[#123D24]">
                    {lastBookedToken.tokenCode}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Appointment
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#4A7C4E]" />

                  <p className="text-sm font-bold text-[#123D24]">
                    {lastBookedToken.date
                      ? formatDate(
                          lastBookedToken.date
                        )
                      : "Confirmed"}
                  </p>
                </div>
              </div>

              {/* Live slot */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Live Slot Status
                </p>

                {updatedBookedSlot ? (
                  <div className="mt-1 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-[#4A7C4E]" />

                    <p className="text-sm font-bold text-[#123D24]">
                      {Math.max(
                        0,
                        updatedBookedSlot.totalSlots -
                          updatedBookedSlot.bookedSlots
                      )}{" "}
                      slots remaining
                    </p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm font-bold text-[#123D24]">
                    Updated
                  </p>
                )}
              </div>
            </div>

            {/* Live update message */}
            {updatedBookedSlot && (
              <div className="border-t border-[#E8EFE1] bg-[#F7FAF4] px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E2EFDA]">
                    <TrendingUp className="h-4 w-4 text-[#3F7442]" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#315C38]">
                      Live schedule updated
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-gray-500">
                      {updatedBookedSlot.bookedSlots} of{" "}
                      {updatedBookedSlot.totalSlots} slots are now
                      booked for this schedule.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            FILTER PANEL
        ==================================================== */}

        <section className="mb-8 rounded-3xl border border-[#E3EBDD] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F0E1] text-[#315C38]">
                <Filter className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#123D24]">
                  Find a Procurement Slot
                </h2>

                <p className="text-[11px] text-gray-500">
                  Choose district, date, crop and search
                  verified mandi schedules.
                </p>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-[#4A7C4E] transition hover:text-[#123D24] sm:self-auto"
              >
                <RefreshCw className="h-3.5 w-3.5" />

                Reset filters
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder="Search mandi, district, crop or time..."
              className="w-full rounded-2xl border border-[#DDE6D7] bg-[#FAFCF9] py-3.5 pl-11 pr-4 text-sm text-[#123D24] outline-none transition focus:border-[#86A979] focus:bg-white focus:ring-2 focus:ring-[#DCEBD4]"
            />
          </div>

          {/* Select filters */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {/* =================================================
                DISTRICT
            ================================================= */}

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                District
              </label>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6C8E63]" />

                <select
                  value={selectedDistrict}
                  onChange={(e) =>
                    setSelectedDistrict(
                      e.target.value
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-[#DDE6D7] bg-[#FAFCF9] py-3 pl-10 pr-3 text-xs font-semibold text-[#123D24] outline-none focus:border-[#86A979] focus:ring-2 focus:ring-[#DCEBD4]"
                >
                  {districts.map(
                    (district) => (
                      <option
                        key={district}
                        value={district}
                      >
                        {district ===
                        "All"
                          ? "All Districts"
                          : district}
                      </option>
                    )
                  )}
                </select>
              </div>

              <p className="mt-1.5 text-[10px] text-gray-400">
                All 23 West Bengal districts available
              </p>
            </div>

            {/* =================================================
                CROP
            ================================================= */}

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Crop Type
              </label>

              <div className="relative">
                <Wheat className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6C8E63]" />

                <select
                  value={selectedCrop}
                  onChange={(e) =>
                    setSelectedCrop(
                      e.target.value
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-[#DDE6D7] bg-[#FAFCF9] py-3 pl-10 pr-3 text-xs font-semibold text-[#123D24] outline-none focus:border-[#86A979] focus:ring-2 focus:ring-[#DCEBD4]"
                >
                  {cropList.map(
                    (crop) => (
                      <option
                        key={crop}
                        value={crop}
                      >
                        {crop ===
                        "All"
                          ? "All Crops"
                          : crop}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* =================================================
                CALENDAR DATE
            ================================================= */}

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Procurement Date
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#6C8E63]" />

                <input
                  type="date"
                  min={today}
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-[#DDE6D7] bg-[#FAFCF9] py-3 pl-10 pr-10 text-xs font-semibold text-[#123D24] outline-none transition focus:border-[#86A979] focus:bg-white focus:ring-2 focus:ring-[#DCEBD4]"
                />

                {selectedDate && (
                  <button
                    type="button"
                    onClick={clearDate}
                    aria-label="Clear selected date"
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="mt-1.5 flex items-center justify-between">
                <p className="text-[10px] text-gray-400">
                  {selectedDate
                    ? formatDate(
                        selectedDate
                      )
                    : "All available dates"}
                </p>

                {selectedDate && (
                  <button
                    type="button"
                    onClick={clearDate}
                    className="text-[10px] font-bold text-[#4A7C4E] hover:text-[#123D24]"
                  >
                    All Dates
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              QUICK BOOKING ACTION
          ================================================= */}

          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#E4ECDD] bg-[#F7FAF4] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#4A7C4E] shadow-sm">
                <CalendarDays className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#315C38]">
                  Need a different date or time?
                </p>

                <p className="mt-0.5 text-[10px] leading-5 text-gray-500">
                  Choose any future date and select from the
                  available procurement time windows.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGeneralBooking}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#123D24] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#285B35] hover:shadow-md active:scale-[0.98]"
            >
              <Ticket className="h-4 w-4 text-[#B8D69F]" />

              Book New Slot

              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        {/* ====================================================
            RESULT HEADER
        ==================================================== */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#6C756B]">
              Procurement schedules
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold text-[#123D24]">
              Available Mandi Slots
            </h2>

            {selectedDate && (
              <p className="mt-1 text-xs text-gray-500">
                Showing schedules for{" "}
                <span className="font-bold text-[#315C38]">
                  {formatDate(
                    selectedDate
                  )}
                </span>
              </p>
            )}
          </div>

          <div className="self-start rounded-full border border-[#DDE7D7] bg-white px-3 py-1.5 text-[11px] font-bold text-[#4A7C4E] sm:self-auto">
            {filteredSlots.length}{" "}
            {filteredSlots.length === 1
              ? "Schedule"
              : "Schedules"}
          </div>
        </div>

        {/* ====================================================
            SCHEDULE LIST
        ==================================================== */}

        <div className="space-y-4">
          {filteredSlots.length === 0 ? (
            <div className="rounded-3xl border border-[#E3EBDD] bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3F6EF] text-[#71806F]">
                <AlertCircle className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-serif text-xl font-bold text-[#123D24]">
                No schedules found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-gray-500">
                We couldn't find an existing procurement
                schedule matching your current filters.
                You can reset the filters or use{" "}
                <span className="font-semibold text-[#315C38]">
                  Book New Slot
                </span>{" "}
                to select another future date and time.
              </p>

              <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-xl border border-[#DCE6D7] bg-white px-5 py-2.5 text-xs font-bold text-[#315C38] transition hover:bg-[#F5F8F2]"
                >
                  Reset All Filters
                </button>

                <button
                  type="button"
                  onClick={handleGeneralBooking}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123D24] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#285B35]"
                >
                  <Ticket className="h-3.5 w-3.5" />

                  Book New Slot

                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            filteredSlots.map(
              (slot) => {
                const availableCount =
                  Math.max(
                    0,
                    slot.totalSlots -
                      slot.bookedSlots
                  );

                const fillPercent =
                  slot.totalSlots > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (slot.bookedSlots /
                            slot.totalSlots) *
                            100
                        )
                      )
                    : 100;

                const status =
                  getStatus(slot);

                return (
                  <article
                    key={slot.id}
                    className="group overflow-hidden rounded-3xl border border-[#E1E9DC] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#BFD4B4] hover:shadow-lg"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                        {/* =================================================
                            DATE + BASIC INFO
                        ================================================= */}

                        <div className="flex min-w-0 flex-1 items-start gap-4">
                          {/* Date box */}
                          <div className="flex h-18 w-17 shrink-0 flex-col items-center justify-center rounded-2xl border border-[#DCE7D6] bg-[#F5F8F2]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D776B]">
                              {getMonth(
                                slot.date
                              )}
                            </span>

                            <span className="font-serif text-2xl font-bold text-[#123D24]">
                              {getDay(
                                slot.date
                              )}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            {/* Name + status */}
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate font-serif text-lg font-bold text-[#123D24] sm:text-xl">
                                {slot.centerName}
                              </h3>

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${status.className}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                                />

                                {
                                  status.label
                                }
                              </span>
                            </div>

                            {/* District + date */}
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-[#6C8E63]" />

                                {
                                  slot.district
                                }
                              </span>

                              <span className="flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5 text-[#6C8E63]" />

                                {formatDate(
                                  slot.date
                                )}
                              </span>
                            </div>

                            {/* Crop + time + MSP */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#F4F7F1] px-2.5 py-1.5 text-[11px] font-bold text-[#315C38]">
                                <Wheat className="h-3.5 w-3.5" />

                                {slot.crop}
                              </span>

                              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#F8F6EF] px-2.5 py-1.5 text-[11px] font-semibold text-[#6B644E]">
                                <Clock3 className="h-3.5 w-3.5" />

                                {
                                  slot.timeWindow
                                }
                              </span>

                              <span className="inline-flex items-center rounded-xl bg-[#F4F4F1] px-2.5 py-1.5 text-[11px] font-bold text-[#5C615B]">
                                MSP ₹
                                {
                                  slot.mspRatePerQuintal
                                }
                                /Qtl
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* =================================================
                            AVAILABILITY
                        ================================================= */}

                        <div className="w-full lg:w-64">
                          <div className="mb-2 flex items-end justify-between">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Slot Availability
                              </p>

                              <p className="mt-0.5 text-sm font-bold text-[#123D24]">
                                {
                                  availableCount
                                }{" "}
                                <span className="font-medium text-gray-400">
                                  of{" "}
                                  {
                                    slot.totalSlots
                                  }{" "}
                                  free
                                </span>
                              </p>
                            </div>

                            <span className="text-[11px] font-bold text-gray-500">
                              {
                                fillPercent
                              }
                              %
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="h-2 overflow-hidden rounded-full bg-[#EAF0E6]">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                availableCount <=
                                0
                                  ? "bg-red-400"
                                  : availableCount <=
                                    3
                                  ? "bg-amber-400"
                                  : "bg-[#5D9462]"
                              }`}
                              style={{
                                width: `${fillPercent}%`,
                              }}
                            />
                          </div>

                          <div className="mt-2 flex justify-between text-[10px] text-gray-400">
                            <span>
                              {
                                slot.bookedCapacityQuintals
                              }{" "}
                              Qtl booked
                            </span>

                            <span>
                              Capacity{" "}
                              {
                                slot.totalCapacityQuintals
                              }{" "}
                              Qtl
                            </span>
                          </div>
                        </div>

                        {/* =================================================
                            BOOK BUTTON
                        ================================================= */}

                        <div className="shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleBookForSlot(
                                slot
                              )
                            }
                            disabled={
                              availableCount ===
                              0
                            }
                            className={`group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-xs font-bold transition-all sm:text-sm lg:w-auto ${
                              availableCount >
                              0
                                ? "bg-[#123D24] text-white shadow-sm hover:bg-[#285B35] hover:shadow-md active:scale-[0.98]"
                                : "cursor-not-allowed bg-gray-100 text-gray-400"
                            }`}
                          >
                            <Ticket
                              className={`h-4 w-4 ${
                                availableCount >
                                0
                                  ? "text-[#B8D69F]"
                                  : "text-gray-400"
                              }`}
                            />

                            <span>
                              {availableCount >
                              0
                                ? "Book This Slot"
                                : "Slot Full"}
                            </span>

                            {availableCount >
                              0 && (
                              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        BOTTOM INFORMATION STRIP
                    ================================================= */}

                    <div className="flex flex-col gap-2 border-t border-[#EEF2EB] bg-[#FBFCF9] px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#5D9462]" />

                        <span>
                          Verified procurement schedule • MSP protected
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold text-[#687267]">
                        Schedule ID:{" "}
                        {slot.id}
                      </span>
                    </div>
                  </article>
                );
              }
            )
          )}
        </div>

        {/* ====================================================
            TIME WINDOWS INFORMATION
        ==================================================== */}

        <section className="mt-8 rounded-3xl border border-[#E3EBDD] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0E1] text-[#315C38]">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Flexible time selection
                  </p>

                  <h3 className="font-serif text-lg font-bold text-[#123D24]">
                    Choose Your Preferred Time Window
                  </h3>
                </div>
              </div>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-500">
                When booking a new procurement appointment, you
                can select from six convenient time windows.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PROCUREMENT_TIME_WINDOWS.map(
                (time) => (
                  <div
                    key={time}
                    className="rounded-xl border border-[#E0E8DB] bg-[#F8FAF6] px-3 py-2 text-center"
                  >
                    <p className="text-[10px] font-bold text-[#315C38]">
                      {time}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ====================================================
            FOOTER INFO
        ==================================================== */}

        <div className="mt-8 rounded-2xl border border-[#E3EBDD] bg-[#F5F8F2] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#4A7C4E] shadow-sm">
              <AlertCircle className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-bold text-[#315C38]">
                Important
              </p>

              <p className="mt-1 text-[11px] leading-5 text-gray-500">
                Please arrive at the selected procurement center
                during your assigned time window. Keep your Aadhaar,
                farmer registration details, and vehicle information
                ready for verification.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================
          BOOK SLOT MODAL
      ====================================================== */}

      <BookSlotModal
        isOpen={isBookModalOpen}
        onClose={() =>
          setIsBookModalOpen(false)
        }
        initialCenterId={
          activeCenterForBooking
        }
        initialDate={
          activeBookingDate ||
          undefined
        }
        initialCrop={
          activeBookingCrop
        }
        initialTimeWindow={
          activeBookingTime ||
          undefined
        }
        onBookingSuccess={(
          token
        ) => {
          setLastBookedToken(
            token
          );
        }}
      />
    </div>
  );
};