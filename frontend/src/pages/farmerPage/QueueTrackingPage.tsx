import React, { useMemo, useState } from "react";
import {
  Radio,
  Clock3,
  Users,
  Search,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  Building2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  MapPin,
  Ticket,
  Timer,
  TrendingUp,
  ChevronRight,
  UserRound,
  Wheat,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const QueueTrackingPage: React.FC = () => {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const {
    user,
    queueTokens,
    centers,
    currentCenterId,
    setCurrentCenterId,
    callNextToken,
    playQueueAnnouncement,
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedToken, setSearchedToken] = useState<
    (typeof queueTokens)[0] | null
  >(null);

  const activeCenter =
    centers.find((c) => c.id === currentCenterId) || centers[0];

  const currentProcessing =
    queueTokens.find((t) => t.status === "processing") || queueTokens[2];

  const yourToken = queueTokens.find((token) => token.farmerId === user?.id);

  const farmersAhead = yourToken
    ? queueTokens.filter(
        (t) =>
          t.tokenNumber < yourToken.tokenNumber && t.status !== "completed",
      ).length
    : 17;

  const estimatedWait = yourToken?.estimatedWaitMinutes || farmersAhead * 3;

  const queueProgress = yourToken
    ? Math.max(
        0,
        Math.min(
          100,
          ((yourToken.tokenNumber - (currentProcessing?.tokenNumber || 0)) /
            Math.max(
              1,
              yourToken.tokenNumber -
                (currentProcessing?.tokenNumber || 0) +
                farmersAhead,
            )) *
            100,
        ),
      )
    : 58;

  const completedTokens = useMemo(
    () => queueTokens.filter((t) => t.status === "completed"),
    [queueTokens],
  );

  const waitingTokens = useMemo(
    () =>
      queueTokens.filter(
        (t) => t.status !== "completed" && t.status !== "processing",
      ),
    [queueTokens],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchedToken(null);
      return;
    }

    const cleanedQuery = searchQuery.trim().toLowerCase();

    const tokenNum = parseInt(searchQuery.replace(/[^0-9]/g, ""), 10);

    const found = queueTokens.find(
      (t) =>
        t.tokenNumber === tokenNum ||
        t.farmerPhone.includes(searchQuery.trim()) ||
        t.tokenCode.toLowerCase() === cleanedQuery,
    );

    setSearchedToken(found || null);
  };

  if (!activeCenter) {
    return (
      <div className="min-h-screen bg-[#F7F9F4] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-[#E1E8DB] p-8 text-center shadow-sm">
          <AlertCircle className="w-10 h-10 mx-auto text-amber-500 mb-3" />
          <h2 className="text-xl font-bold text-[#123D24]">
            No procurement center available
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F4] text-[#123D24]">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* =========================================================
            TOP HEADER
        ========================================================= */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F2E2] border border-[#D3E5CA] px-3.5 py-1.5 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#3F8F55] opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3F8F55]" />
              </span>

              <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-[#2E6B3D]">
                Live Queue Tracking
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#123D24]">
              Know Your Turn.
              <span className="block text-[#3F7442]">Skip the Waiting.</span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-600 leading-relaxed">
              Track your procurement token in real time and arrive when your
              turn is near. No need to stand in a physical queue.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Center Selector */}
            <div className="flex items-center gap-2 bg-white rounded-2xl border border-[#DCE6D6] px-3 shadow-sm">
              <Building2 className="w-4 h-4 text-[#3F7442]" />

              <select
                value={currentCenterId}
                onChange={(e) => setCurrentCenterId(e.target.value)}
                className="bg-transparent py-3 pr-2 text-sm font-bold text-[#123D24] focus:outline-none"
              >
                {centers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sound */}
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border border-[#DCE6D6] shadow-sm text-sm font-bold text-[#245C32] hover:bg-[#F0F5EC] transition-all active:scale-95"
              title={
                isAudioMuted
                  ? "Enable queue announcement"
                  : "Mute queue announcement"
              }
            >
              {isAudioMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <span className="hidden sm:inline">Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#3F7442]" />
                  <span className="hidden sm:inline">Sound On</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* =========================================================
            MAIN LIVE STATUS PANEL
        ========================================================= */}
        <section className="relative overflow-hidden rounded-4xl bg-[#123D24] shadow-[0_20px_60px_rgba(18,61,36,0.18)] mb-8">
          {/* Decorative background */}
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#3F7442] opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-[#8EB773] opacity-10 blur-3xl" />

          <div className="relative p-5 sm:p-7 lg:p-9">
            {/* Panel Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-7 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Radio className="w-5 h-5 text-[#A9D18E]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-bold text-white">
                        {activeCenter.name}
                      </h2>

                      <span className="inline-flex items-center gap-1 rounded-full bg-[#3F8F55]/20 border border-[#6CA976]/30 px-2 py-1 text-[9px] font-bold text-[#BCE2A8] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8ED17A] animate-pulse" />
                        Live
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#AFC5AA]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {activeCenter.district}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="w-3.5 h-3.5" />
                        Updated just now
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={callNextToken}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#8EB773] hover:bg-[#A5C58D] text-[#123D24] font-extrabold text-xs sm:text-sm transition-all shadow-lg active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                Simulate Next Token
              </button>
            </div>

            {/* =====================================================
                YOUR QUEUE STATUS
            ===================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 py-7">
              {/* Your Token */}
              <div className="relative overflow-hidden rounded-[28px] bg-white p-6 sm:p-8 text-[#123D24] shadow-xl">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#E8F2E2] -translate-y-16 translate-x-16" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500">
                        Your Token
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Procurement queue position
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-2xl bg-[#E8F2E2] flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-[#3F7442]" />
                    </div>
                  </div>

                  <div className="flex items-end gap-3 mt-5">
                    <span className="font-serif text-6xl sm:text-7xl font-black tracking-tight text-[#123D24]">
                      KS-{yourToken?.tokenNumber || "1048"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F2E2] text-[#2E6B3D] text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Token Confirmed
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                      Lane 2
                    </span>
                  </div>
                </div>
              </div>

              {/* Now Serving */}
              <div className="rounded-[28px] bg-[#1B4D2A] border border-white/10 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#9FBC91]">
                      Now Serving
                    </p>

                    <p className="text-xs text-[#B8C9B4] mt-1">
                      Current farmer at procurement point
                    </p>
                  </div>

                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D99A32]/10">
                    <span className="absolute inset-0 rounded-2xl bg-[#D99A32]/20 animate-pulse" />
                    <Radio className="relative w-5 h-5 text-[#E5AE4F]" />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-5">
                  <div className="font-serif text-5xl sm:text-6xl font-black text-white">
                    KS-{currentProcessing?.tokenNumber || "1030"}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-[#C5D5C0]">
                  <UserRound className="w-4 h-4" />
                  <span>
                    {currentProcessing?.farmerName ||
                      "Farmer currently processing"}
                  </span>
                </div>

                <div className="mt-5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[72%] rounded-full bg-[#D99A32] animate-pulse" />
                </div>
              </div>
            </div>

            {/* =====================================================
                FOUR QUICK METRICS
            ===================================================== */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-2xl bg-white/[0.07] border border-white/10 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <Users className="w-5 h-5 text-[#A9D18E]" />
                  <span className="text-[9px] uppercase tracking-wider text-[#91AD89] font-bold">
                    Queue
                  </span>
                </div>

                <div className="mt-3 text-2xl sm:text-3xl font-black text-white">
                  {farmersAhead}
                </div>

                <p className="mt-1 text-xs text-[#AFC5AA]">Farmers ahead</p>
              </div>

              <div className="rounded-2xl bg-white/[0.07] border border-white/10 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <Timer className="w-5 h-5 text-[#E5AE4F]" />
                  <span className="text-[9px] uppercase tracking-wider text-[#91AD89] font-bold">
                    Estimate
                  </span>
                </div>

                <div className="mt-3 text-2xl sm:text-3xl font-black text-white">
                  {estimatedWait}
                  <span className="text-sm ml-1 font-bold text-[#AFC5AA]">
                    min
                  </span>
                </div>

                <p className="mt-1 text-xs text-[#AFC5AA]">Estimated waiting</p>
              </div>

              <div className="rounded-2xl bg-white/[0.07] border border-white/10 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <CheckCircle2 className="w-5 h-5 text-[#8ED17A]" />
                  <span className="text-[9px] uppercase tracking-wider text-[#91AD89] font-bold">
                    Done
                  </span>
                </div>

                <div className="mt-3 text-2xl sm:text-3xl font-black text-white">
                  {completedTokens.length}
                </div>

                <p className="mt-1 text-xs text-[#AFC5AA]">Tokens completed</p>
              </div>

              <div className="rounded-2xl bg-white/[0.07] border border-white/10 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <TrendingUp className="w-5 h-5 text-[#A9D18E]" />
                  <span className="text-[9px] uppercase tracking-wider text-[#91AD89] font-bold">
                    Capacity
                  </span>
                </div>

                <div className="mt-3 text-2xl sm:text-3xl font-black text-white">
                  {activeCenter.totalQueueWaiting}
                </div>

                <p className="mt-1 text-xs text-[#AFC5AA]">Vehicles waiting</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            YOUR POSITION
        ========================================================= */}
        <section className="bg-white rounded-[30px] border border-[#E0E8DA] shadow-sm p-5 sm:p-7 lg:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D99A32]" />

                <h2 className="font-serif text-xl sm:text-2xl font-black text-[#123D24]">
                  Your Position in Queue
                </h2>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Follow the queue and arrive close to your assigned turn.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F0F5EC] text-[#2E6B3D] text-xs font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Live updates enabled
            </div>
          </div>

          {/* Progress */}
          <div className="relative mb-8">
            <div className="flex items-center justify-between text-xs font-bold mb-3">
              <span className="text-[#3F7442]">
                Now Serving · KS-
                {currentProcessing?.tokenNumber || "1030"}
              </span>

              <span className="text-[#123D24]">
                Your Token · KS-
                {yourToken?.tokenNumber || "1048"}
              </span>
            </div>

            <div className="h-4 rounded-full bg-[#EDF1EA] overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#3F7442] to-[#8EB773] transition-all duration-700"
                style={{ width: `${Math.max(10, queueProgress)}%` }}
              />
            </div>

            <div
              className="absolute top-6 -translate-y-1/2 transition-all duration-700"
              style={{
                left: `calc(${Math.max(
                  10,
                  Math.min(95, queueProgress),
                )}% - 10px)`,
              }}
            >
              <div className="w-5 h-5 rounded-full bg-white border-4 border-[#3F7442] shadow-md" />
            </div>
          </div>

          {/* Position cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-[#F7F9F4] border border-[#E3EBDD] p-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Your Position
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-4xl font-black text-[#123D24]">
                  {farmersAhead + 1}
                </span>

                <span className="text-sm text-gray-500">in queue</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FFF8EA] border border-[#F1DFC0] p-5">
              <p className="text-xs font-bold text-[#9B6C1E] uppercase tracking-wider">
                Estimated Wait
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-4xl font-black text-[#B87B1D]">
                  {estimatedWait}
                </span>

                <span className="text-sm text-[#9B6C1E]">minutes</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#EAF4E5] border border-[#D4E6CA] p-5">
              <p className="text-xs font-bold text-[#3F7442] uppercase tracking-wider">
                Best Action
              </p>

              <div className="mt-2 flex items-center gap-2">
                <Clock3 className="w-5 h-5 text-[#3F7442]" />

                <span className="font-bold text-[#245C32]">
                  Stay nearby & monitor
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            QUEUE VISUALIZATION
        ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mb-8">
          {/* Queue */}
          <div className="bg-white rounded-[30px] border border-[#E0E8DA] shadow-sm p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-black text-[#123D24]">
                  Live Queue
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Real-time token movement at this procurement center.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3F8F55] animate-pulse" />
                <span className="text-xs font-bold text-[#3F7442]">Live</span>
              </div>
            </div>

            <div className="space-y-2">
              {queueTokens.slice(0, 10).map((token) => {
                const isYou = token.farmerId === user?.id;
                const isProcessing = token.status === "processing";
                const isCompleted = token.status === "completed";

                return (
                  <div
                    key={token.tokenNumber}
                    className={`group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all ${
                      isYou
                        ? "bg-[#EAF4E5] border-[#8EB773] shadow-sm"
                        : isProcessing
                          ? "bg-[#FFF8EA] border-[#EBD5AA]"
                          : isCompleted
                            ? "bg-gray-50 border-gray-100"
                            : "bg-white border-gray-100 hover:border-[#D8E5D1] hover:bg-[#FAFCF8]"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isYou
                          ? "bg-[#3F7442] text-white"
                          : isProcessing
                            ? "bg-[#D99A32] text-white"
                            : isCompleted
                              ? "bg-[#E5EAE2] text-gray-500"
                              : "bg-[#F0F4ED] text-[#3F7442]"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        token.tokenNumber
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-bold text-sm ${
                            isYou ? "text-[#245C32]" : "text-[#123D24]"
                          }`}
                        >
                          KS-{token.tokenNumber}
                        </span>

                        {isYou && (
                          <span className="px-2 py-0.5 rounded-full bg-[#3F7442] text-white text-[9px] font-black uppercase">
                            You
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {token.farmerName}
                      </p>
                    </div>

                    <div className="hidden sm:block text-right">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                        Status
                      </p>

                      <p
                        className={`text-xs font-bold mt-0.5 ${
                          isCompleted
                            ? "text-gray-500"
                            : isProcessing
                              ? "text-[#B87B1D]"
                              : isYou
                                ? "text-[#3F7442]"
                                : "text-gray-600"
                        }`}
                      >
                        {isCompleted
                          ? "Completed"
                          : isProcessing
                            ? "Processing"
                            : isYou
                              ? "Your Turn Soon"
                              : "Waiting"}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#3F7442] transition-colors" />
                  </div>
                );
              })}
            </div>

            {queueTokens.length > 10 && (
              <div className="mt-5 pt-5 border-t border-gray-100 text-center">
                <span className="text-xs font-bold text-gray-500">
                  + {queueTokens.length - 10} more tokens in today's queue
                </span>
              </div>
            )}
          </div>

          {/* Search / Quick Info */}
          <div className="space-y-6">
            <div className="bg-[#123D24] rounded-[30px] p-6 sm:p-7 shadow-lg">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Search className="w-5 h-5 text-[#A9D18E]" />
                </div>

                <div>
                  <h3 className="font-serif text-xl font-black text-white">
                    Track Any Token
                  </h3>

                  <p className="text-xs text-[#AFC5AA] mt-0.5">
                    Search token or registered mobile
                  </p>
                </div>
              </div>

              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8FA78B]" />

                  <input
                    type="text"
                    placeholder="e.g. KS-1048"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-[#81967D] text-sm focus:outline-none focus:ring-2 focus:ring-[#8EB773]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-3.5 rounded-2xl bg-[#8EB773] hover:bg-[#A5C58D] text-[#123D24] text-sm font-extrabold transition-all active:scale-[0.98]"
                >
                  Track Position
                </button>
              </form>

              {searchedToken ? (
                <div className="mt-5 rounded-2xl bg-white/10 border border-[#8EB773]/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#A9D18E] font-bold">
                        Token Found
                      </p>

                      <p className="text-lg font-black text-white mt-1">
                        KS-{searchedToken.tokenNumber}
                      </p>
                    </div>

                    <CheckCircle2 className="w-6 h-6 text-[#8ED17A]" />
                  </div>

                  <p className="text-xs text-[#C5D5C0] mt-2">
                    {searchedToken.farmerName}
                  </p>

                  <div className="mt-3 pt-3 border-t border-white/10 flex justify-between">
                    <span className="text-xs text-[#9FB39A]">
                      Estimated wait
                    </span>

                    <span className="text-sm font-bold text-[#E5AE4F]">
                      {searchedToken.estimatedWaitMinutes} min
                    </span>
                  </div>
                </div>
              ) : searchQuery ? (
                <div className="mt-5 rounded-2xl bg-red-400/10 border border-red-300/10 p-4">
                  <div className="flex items-center gap-2 text-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-bold">
                      No matching token found.
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Arrival Advice */}
            <div className="bg-[#FFF8EA] border border-[#F0DFC0] rounded-[30px] p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Clock3 className="w-5 h-5 text-[#B87B1D]" />
                </div>

                <div>
                  <h3 className="font-bold text-[#6E4C18]">
                    When should you arrive?
                  </h3>

                  <p className="text-xs text-[#876A37] mt-1 leading-relaxed">
                    Monitor your position and arrive before your token is called
                    to avoid missing your slot.
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="px-3 py-2 rounded-xl bg-white text-[#8B641E] text-xs font-black">
                      ~{estimatedWait} min
                    </div>

                    <ArrowRight className="w-4 h-4 text-[#B87B1D]" />

                    <div className="px-3 py-2 rounded-xl bg-white text-[#8B641E] text-xs font-black">
                      Stay nearby
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            TODAY'S ROSTER
        ========================================================= */}
        <section className="bg-white rounded-[30px] border border-[#E0E8DA] shadow-sm p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-[#3F7442]" />

                <h2 className="font-serif text-xl sm:text-2xl font-black text-[#123D24]">
                  Today's Queue Roster
                </h2>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Complete procurement token status for this center.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F0F5EC] text-[#3F7442] text-xs font-bold">
              <RefreshCw className="w-3.5 h-3.5" />
              {queueTokens.length} Tokens
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-left">
              <thead className="bg-[#F7F9F4]">
                <tr className="text-[10px] uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4 font-extrabold">Token</th>
                  <th className="px-5 py-4 font-extrabold">Farmer</th>
                  <th className="px-5 py-4 font-extrabold">Location</th>
                  <th className="px-5 py-4 font-extrabold">Crop</th>
                  <th className="px-5 py-4 font-extrabold">Quantity</th>
                  <th className="px-5 py-4 font-extrabold">Slot</th>
                  <th className="px-5 py-4 font-extrabold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {queueTokens.map((token) => {
                  const isYou = token.farmerId === user?.id;

                  return (
                    <tr
                      key={token.tokenNumber}
                      className={`transition-colors hover:bg-[#FAFCF8] ${
                        isYou ? "bg-[#F0F7EC]" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#123D24]">
                            KS-{token.tokenNumber}
                          </span>

                          {isYou && (
                            <span className="px-2 py-0.5 rounded-full bg-[#3F7442] text-white text-[8px] font-black">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-sm text-[#123D24]">
                          {token.farmerName}
                        </div>

                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {token.farmerPhone}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600">
                          {token.village}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-gray-700">
                          {token.crop.split("/")[0]}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-[#123D24]">
                          {token.quantityQuintals} Qtl
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-600">
                          <Clock3 className="w-3.5 h-3.5" />
                          {token.slotTime}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={token.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {queueTokens.map((token) => {
              const isYou = token.farmerId === user?.id;

              return (
                <div
                  key={token.tokenNumber}
                  className={`rounded-2xl border p-4 ${
                    isYou
                      ? "bg-[#F0F7EC] border-[#BBD3AF]"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F0F4ED] flex items-center justify-center font-black text-xs text-[#3F7442]">
                        {token.tokenNumber}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#123D24]">
                            KS-{token.tokenNumber}
                          </span>

                          {isYou && (
                            <span className="px-2 py-0.5 rounded-full bg-[#3F7442] text-white text-[8px] font-black">
                              YOU
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-0.5">
                          {token.farmerName}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={token.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400">
                        Crop
                      </p>

                      <p className="text-xs font-bold text-gray-700 mt-1">
                        {token.crop.split("/")[0]}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400">
                        Quantity
                      </p>

                      <p className="text-xs font-bold text-gray-700 mt-1">
                        {token.quantityQuintals} Qtl
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400">
                        Village
                      </p>

                      <p className="text-xs font-bold text-gray-700 mt-1">
                        {token.village}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400">
                        Slot
                      </p>

                      <p className="text-xs font-bold text-gray-700 mt-1">
                        {token.slotTime}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer information */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 px-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3F8F55]" />
            Queue is being monitored in real time
          </div>

          <div>
            Procurement center:{" "}
            <span className="font-bold text-[#3F7442]">
              {activeCenter.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===============================================================
   STATUS BADGE
================================================================ */

const StatusBadge: React.FC<{
  status: string;
}> = ({ status }) => {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#E8F2E2] text-[#3F7442] text-[10px] font-extrabold">
        <CheckCircle2 className="w-3 h-3" />
        Completed
      </span>
    );
  }

  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#FFF3D8] text-[#A86E17] text-[10px] font-extrabold">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D99A32] animate-pulse" />
        Processing
      </span>
    );
  }

  if (status === "next") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#E8F4E5] text-[#2E6B3D] text-[10px] font-extrabold">
        <ArrowRight className="w-3 h-3" />
        Next
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-extrabold">
      <Clock3 className="w-3 h-3" />
      Waiting
    </span>
  );
};
