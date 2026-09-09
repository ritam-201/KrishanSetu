import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Navigation,
  Clock3,
  Wheat,
  Search,
  CheckCircle2,
  ArrowUpRight,
  Phone,
  Gauge,
  Users,
  Sparkles,
  CircleDot,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ProcurementCenter } from "../../types";

export const CenterFinder: React.FC<{
  onSelectCenterForBooking?: (center: ProcurementCenter) => void;
}> = ({ onSelectCenterForBooking }) => {
  const { centers, currentCenterId, setCurrentCenterId } = useAuth();

  const [selectedCrop, setSelectedCrop] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  /* ================= FILTER CENTERS ================= */

  const filteredCenters = centers.filter((center) => {
    const matchesCrop =
      selectedCrop === "All" ||
      center.acceptedCrops.some((crop) =>
        crop.toLowerCase().includes(selectedCrop.toLowerCase())
      );

    const matchesSearch =
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.district.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCrop && matchesSearch;
  });

  /* ================= ACTIVE CENTER ================= */

  const activeCenter =
    centers.find((center) => center.id === currentCenterId) || centers[0];

  /* ================= STATUS STYLE ================= */

  const getStatusStyle = (status: string) => {
    if (status === "Open") {
      return {
        wrapper: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
      };
    }

    if (status === "Crowded") {
      return {
        wrapper: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
      };
    }

    return {
      wrapper: "bg-rose-50 text-rose-700 border-rose-200",
      dot: "bg-rose-500",
    };
  };

  return (
    <section
      id="procurement-centers"
      className="relative overflow-hidden bg-[#f7faf8] py-20 sm:py-24"
    >
      {/* ================= BACKGROUND DECORATION ================= */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-lime-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ========================================================= */}
        {/*                         HEADER                            */}
        {/* ========================================================= */}

        <div className="mb-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-3xl">

            {/* Badge */}

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700 shadow-sm">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              Live Mandi Network
            </div>

            {/* Heading */}

            <h2 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl lg:leading-[1.08]">
              Find the best
              <span className="text-emerald-600"> procurement center </span>
              before you leave home.
            </h2>

            {/* Description */}

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Compare nearby mandis, available slots, accepted crops and
              waiting queues — all in one place.
            </p>
          </div>

          {/* Explore Button */}

          <Link
            to="/schedule"
            className="group inline-flex w-fit items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            Explore all mandis

            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* ========================================================= */}
        {/*                      SEARCH + FILTER                       */}
        {/* ========================================================= */}

        <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

            {/* Search */}

            <div className="relative flex-1">

              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search mandi, block or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* Crop Filter */}

            <div className="flex gap-1.5 overflow-x-auto rounded-xl bg-slate-50 p-1">

              {[
                "All",
                "Rice / Paddy",
                "Wheat",
                "Mustard",
                "Maize",
              ].map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                    selectedCrop === crop
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-500 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/*                    MANDI RADAR - TOP                       */}
        {/* ========================================================= */}

        <div className="mb-10">

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">

            {/* ================= RADAR HEADER ================= */}

            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Navigation className="h-5 w-5" />
                </div>

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-600">
                    Live Mandi Radar
                  </p>

                  <h4 className="mt-0.5 text-base font-black text-slate-900">
                    Procurement Zone
                  </h4>

                  <p className="text-xs text-slate-400">
                    Hooghly - Nadia Procurement Network
                  </p>

                </div>
              </div>

              {/* Radar Status */}

              <div className="flex items-center gap-2">

                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  GPS Active
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-500">
                  25 km radius
                </span>

              </div>
            </div>

            {/* ================= RADAR BODY ================= */}

            <div className="grid grid-cols-1 lg:grid-cols-12">

              {/* ===================================================== */}
              {/*                         MAP                            */}
              {/* ===================================================== */}

              <div className="lg:col-span-8">

                <div className="relative m-4 h-72 overflow-hidden rounded-2xl bg-[#e9f0eb] sm:h-80">

                  {/* Map Grid */}

                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        "linear-linear(#b9c9bd 1px, transparent 1px), linear-linear(90deg, #b9c9bd 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />

                  {/* Terrain */}

                  <div className="absolute -left-10 top-24 h-40 w-72 rotate-12 rounded-[45%] bg-emerald-200/40 blur-sm" />

                  <div className="absolute -right-20 bottom-0 h-44 w-80 -rotate-12 rounded-[50%] bg-lime-200/50 blur-sm" />

                  {/* Roads */}

                  <div className="absolute left-0 top-1/2 h-px w-full rotate-12 bg-white/90" />

                  <div className="absolute left-1/3 top-0 h-full w-px rotate-22 bg-white/80" />

                  <div className="absolute bottom-10 left-0 h-px w-full -rotate-6 bg-white/70" />

                  {/* ================= FARM LOCATION ================= */}

                  <div className="absolute left-[25%] top-[55%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">

                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-slate-950 text-lg shadow-xl">
                      🚜

                      <span className="absolute -inset-2.25 animate-ping rounded-full border border-emerald-500/30" />
                    </div>

                    <span className="mt-2 whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1 text-[9px] font-bold text-white shadow-lg">
                      Your Farm
                    </span>

                  </div>

                  {/* ================= HARIPUR ================= */}

                  <button
                    onClick={() => setCurrentCenterId("CTR-001")}
                    className="group absolute right-[22%] top-[24%] z-10"
                  >

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-emerald-600 text-white shadow-lg transition-transform group-hover:scale-110">
                      <Wheat className="h-4 w-4" />
                    </div>

                    <span className="absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded-lg border border-emerald-100 bg-white px-2 py-1 text-[9px] font-bold text-slate-700 shadow-md">
                      Haripur Mandi
                    </span>

                  </button>

                  {/* ================= KALYANI ================= */}

                  <button
                    onClick={() => setCurrentCenterId("CTR-002")}
                    className="group absolute bottom-[23%] right-[10%] z-10"
                  >

                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-amber-500 text-white shadow-lg transition-transform group-hover:scale-110">
                      <Wheat className="h-3.5 w-3.5" />
                    </div>

                    <span className="absolute left-1/2 top-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-amber-100 bg-white px-2 py-1 text-[9px] font-bold text-slate-700 shadow-md">
                      Kalyani APMC
                    </span>

                  </button>

                  {/* ================= LEGEND ================= */}

                  <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-xl border border-white/70 bg-white/90 px-3 py-2 text-[9px] font-bold text-slate-500 shadow-lg backdrop-blur">

                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Open
                    </span>

                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Busy
                    </span>

                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      Full
                    </span>

                  </div>

                  {/* GPS */}

                  <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-slate-950/90 px-2.5 py-1.5 text-[9px] font-bold text-white">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    GPS Active
                  </div>

                </div>
              </div>

              {/* ===================================================== */}
              {/*                  SELECTED CENTER                       */}
              {/* ===================================================== */}

              {activeCenter && (
                <div className="flex flex-col justify-center border-t border-slate-100 p-5 lg:col-span-4 lg:border-l lg:border-t-0">

                  <div className="rounded-2xl bg-slate-950 p-5 text-white">

                    {/* Selected Header */}

                    <div className="mb-4 flex items-start justify-between gap-3">

                      <div>

                        <div className="mb-2 flex items-center gap-2">

                          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />

                          <span className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-400">
                            Selected Center
                          </span>

                        </div>

                        <h5 className="text-lg font-black">
                          {activeCenter.name}
                        </h5>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {activeCenter.address}
                        </p>

                      </div>

                      {/* Call */}

                      <a
                        href={`tel:${activeCenter.contactNumber}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-400 transition hover:bg-emerald-500 hover:text-white"
                        title="Call Mandi Desk"
                      >
                        <Phone className="h-4 w-4" />
                      </a>

                    </div>

                    {/* Officer */}

                    <div className="rounded-xl bg-white/5 p-3">

                      <p className="text-[9px] uppercase tracking-wider text-slate-500">
                        Officer in charge
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-200">
                        {activeCenter.officerInCharge}
                      </p>

                    </div>

                    {/* Facilities */}

                    <div className="mt-2 grid grid-cols-2 gap-2">

                      <div className="rounded-xl bg-white/5 p-3">

                        <CheckCircle2 className="mb-1.5 h-3.5 w-3.5 text-emerald-400" />

                        <p className="text-[10px] font-semibold leading-4 text-slate-300">
                          Digital 50T Weighbridge
                        </p>

                      </div>

                      <div className="rounded-xl bg-white/5 p-3">

                        <CheckCircle2 className="mb-1.5 h-3.5 w-3.5 text-emerald-400" />

                        <p className="text-[10px] font-semibold leading-4 text-slate-300">
                          NABL Moisture Lab
                        </p>

                      </div>

                    </div>

                    {/* Reserve */}

                    <Link
                      to="/schedule"
                      onClick={() =>
                        onSelectCenterForBooking?.(activeCenter)
                      }
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-black text-white transition hover:bg-emerald-400"
                    >
                      Reserve a slot

                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/*                  PROCUREMENT CENTERS                      */}
        {/* ========================================================= */}

        <div>

          {/* Section Heading */}

          <div className="mb-5 flex items-end justify-between">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600">
                Nearby
              </p>

              <h3 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">
                Procurement Centers
              </h3>

              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Compare availability and queue status before visiting.
              </p>

            </div>

            <div className="hidden items-center gap-1.5 text-xs font-bold text-slate-400 sm:flex">

              <CircleDot className="h-3.5 w-3.5 text-emerald-500" />

              {filteredCenters.length} centers

            </div>

          </div>

          {/* ======================================================= */}
          {/*                   TWO CARDS PER ROW                     */}
          {/* ======================================================= */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {filteredCenters.map((center) => {

              const isSelected = center.id === currentCenterId;

              const status = getStatusStyle(center.status);

              return (
                <div
                  key={center.id}
                  onClick={() => setCurrentCenterId(center.id)}
                  className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                    isSelected
                      ? "border-emerald-400 bg-white shadow-xl shadow-emerald-900/8 ring-1 ring-emerald-400"
                      : "border-slate-200/80 bg-white hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg"
                  }`}
                >

                  {/* ================= CARD TOP ================= */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 gap-3">

                      {/* Icon */}

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isSelected
                            ? "bg-emerald-600 text-white"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        <Wheat className="h-5 w-5" />
                      </div>

                      {/* Name */}

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h4 className="text-sm font-black text-slate-900 sm:text-base">
                            {center.name}
                          </h4>

                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                            {center.distanceKm} km
                          </span>

                        </div>

                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">

                          <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-500" />

                          <span className="truncate">
                            {center.address}
                          </span>

                        </div>

                      </div>
                    </div>

                    {/* Status */}

                    <span
                      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.wrapper}`}
                    >

                      <span
                        className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                      />

                      {center.status}

                    </span>

                  </div>

                  {/* ================= CROPS ================= */}

                  <div className="mt-4 flex flex-wrap gap-1.5">

                    {center.acceptedCrops.map((crop, index) => (
                      <span
                        key={index}
                        className="rounded-md bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500 ring-1 ring-inset ring-slate-200"
                      >
                        {crop}
                      </span>
                    ))}

                  </div>

                  {/* ================= METRICS ================= */}

                  <div className="mt-4 grid grid-cols-3 gap-2">

                    {/* Slots */}

                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-slate-400">

                        <Gauge className="h-3 w-3" />

                        Slots
                      </div>

                      <p className="text-sm font-black text-slate-900">

                        {center.availableSlotsToday}

                        <span className="font-medium text-slate-400">
                          {" "}
                          / {center.totalSlotsToday}
                        </span>

                      </p>

                    </div>

                    {/* Queue */}

                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-slate-400">

                        <Users className="h-3 w-3" />

                        Queue
                      </div>

                      <p className="text-sm font-black text-slate-900">
                        {center.totalQueueWaiting}
                      </p>

                      <span className="text-[9px] font-semibold text-slate-400">
                        farmers waiting
                      </span>

                    </div>

                    {/* Wait */}

                    <div className="rounded-xl bg-emerald-50 p-3">

                      <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-emerald-600">

                        <Clock3 className="h-3 w-3" />

                        Wait
                      </div>

                      <p className="text-sm font-black text-emerald-700">

                        ~
                        {center.totalQueueWaiting *
                          center.averageProcessingTimeMinutes}

                        <span className="ml-1 text-[9px]">
                          min
                        </span>

                      </p>

                    </div>

                  </div>

                  {/* ================= CARD FOOTER ================= */}

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">

                      <Clock3 className="h-3.5 w-3.5" />

                      {center.operatingHours}

                    </div>

                    <Link
                      to="/schedule"
                      onClick={(e) => {
                        e.stopPropagation();

                        onSelectCenterForBooking?.(center);
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-600 transition hover:text-emerald-800"
                    >
                      Book slot

                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>

          {/* ======================================================= */}
          {/*                     EMPTY STATE                         */}
          {/* ======================================================= */}

          {filteredCenters.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

              <Search className="mx-auto h-7 w-7 text-slate-300" />

              <h4 className="mt-3 text-sm font-bold text-slate-700">
                No procurement center found
              </h4>

              <p className="mt-1 text-xs text-slate-400">
                Try another mandi name, district or crop.
              </p>

            </div>
          )}

        </div>
      </div>
    </section>
  );
};
