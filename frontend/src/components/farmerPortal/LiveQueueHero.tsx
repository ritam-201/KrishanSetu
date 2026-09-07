import React, { useState } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Search,
  Clock,
  Users,
  CheckCircle,
  Radio,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const LiveQueueHero: React.FC = () => {
  const {
    t,
    queueTokens,
    centers,
    currentCenterId,
    callNextToken,
    playAudioChime,
    isAudioMuted,
    setIsAudioMuted,
    isAuthenticated,
    user,
  } = useAuth();

  const [searchTokenInput, setSearchTokenInput] = useState("");
  const [searchedTokenData, setSearchedTokenData] = useState<
    (typeof queueTokens)[0] | null
  >(null);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const activeCenter =
    centers.find((c) => c.id === currentCenterId) || centers[0];
  const currentProcessing =
    queueTokens.find((t) => t.status === "processing") || queueTokens[2];
  const yourToken = queueTokens.find((token) => token.farmerId === user?.id);
  const displayFarmerName = isAuthenticated && user.name ? user.name : "Farmer";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTokenInput.trim()) {
      setSearchedTokenData(null);
      setSearchFeedback(null);
      return;
    }

    const tokenNum = parseInt(searchTokenInput.replace(/[^0-9]/g, ""), 10);
    const found = queueTokens.find(
      (t) =>
        t.tokenNumber === tokenNum ||
        t.farmerPhone.includes(searchTokenInput.trim()) ||
        t.tokenCode.toLowerCase() === searchTokenInput.toLowerCase().trim(),
    );

    if (found) {
      setSearchedTokenData(found);
      setSearchFeedback(null);
    } else {
      setSearchedTokenData(null);
      setSearchFeedback(
        `No active token found matching "${searchTokenInput}".`,
      );
    }
  };

  return (
    <section
      id="live-queue-system"
      className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{t.queueStatusLive}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {t.queueSectionTitle}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            {t.queueSectionSubtitle}
          </p>
        </div>

        {/* Live Display Board */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          {/* Header of Mandi Display */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide uppercase">
                  {activeCenter.name}
                </h3>
              </div>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">
                GATE DISPLAY CONTROLLER • ZONE HOOGHLY-04
              </p>
            </div>

            {/* Audio Toggle & Simulation Controls */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title={isAudioMuted ? "Unmute Audio Chime" : "Mute Audio Chime"}
              >
                {isAudioMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <button
                id="simulate-call-next-btn"
                onClick={callNextToken}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
                title="Simulate Mandi Officer calling next token"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Call Next</span>
              </button>
            </div>
          </div>

          {/* Core Numbers Bar: Currently Serving / Your Token / Ahead / Est Wait */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6 border-b border-slate-800">
            {/* Currently Serving */}
            <div className="bg-slate-800/90 rounded-xl p-4 sm:p-5 border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.queueServingNow}
              </span>
              <div className="text-3xl sm:text-4xl font-bold text-white mt-1 tracking-tight">
                #{currentProcessing?.tokenNumber || 23}
              </div>
              <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>{currentProcessing?.farmerName || "Debabrata Das"}</span>
              </div>
            </div>

            {/* Your Token */}
            <div className="bg-slate-800/90 rounded-xl p-4 sm:p-5 border border-emerald-500 relative shadow-lg ring-1 ring-emerald-500">
              <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                YOU
              </span>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                {t.queueYourToken}
              </span>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-400 mt-1 tracking-tight">
                #{yourToken?.tokenNumber || 24}
              </div>
              <div className="text-[11px] text-white font-medium mt-1">
                {displayFarmerName} (25 Qtl)
              </div>
            </div>

            {/* Farmers Ahead */}
            <div className="bg-slate-800/90 rounded-xl p-4 sm:p-5 border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.queueFarmersAhead}
              </span>
              <div className="text-3xl sm:text-4xl font-bold text-white mt-1 tracking-tight">
                {Math.max(
                  0,
                  (yourToken?.tokenNumber || 24) -
                    (currentProcessing?.tokenNumber || 23),
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Vehicles in weighbridge lane
              </div>
            </div>

            {/* Estimated Wait */}
            <div className="bg-slate-800/90 rounded-xl p-4 sm:p-5 border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.queueEstWait}
              </span>
              <div className="text-3xl sm:text-4xl font-bold text-amber-400 mt-1 tracking-tight">
                ~{yourToken?.estimatedWaitMinutes || 18}m
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Avg 12 min / tractor</span>
              </div>
            </div>
          </div>

          {/* Live Token Sequence Track */}
          <div className="pt-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Real-Time Token Queue Flow
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {queueTokens.slice(0, 6).map((token) => {
                const isYou = token.farmerId === user?.id;
                const isServing = token.status === "processing";
                const isCompleted = token.status === "completed";

                return (
                  <div
                    key={token.tokenNumber}
                    className={`rounded-xl p-3 border transition-all ${
                      isYou
                        ? "bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500"
                        : isServing
                          ? "bg-slate-800 border-amber-500/80"
                          : isCompleted
                            ? "bg-slate-900 border-slate-800 opacity-60"
                            : "bg-slate-800/50 border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-base text-white">
                        #{token.tokenNumber}
                      </span>
                      {isYou && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-600 text-white">
                          YOU
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {token.farmerName}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {token.crop.split("/")[0]} • {token.quantityQuintals} Qtl
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-700/80 flex items-center justify-between text-[10px]">
                      <span
                        className={`font-semibold ${
                          token.status === "completed"
                            ? "text-emerald-400"
                            : token.status === "processing"
                              ? "text-amber-400"
                              : token.status === "next"
                                ? "text-emerald-300"
                                : "text-slate-400"
                        }`}
                      >
                        {token.status === "completed"
                          ? "✓ Done"
                          : token.status === "processing"
                            ? "● At Scale"
                            : token.status === "next"
                              ? "▲ Next"
                              : "○ Waiting"}
                      </span>

                      <span className="text-slate-400 font-mono">
                        {token.status === "completed"
                          ? token.completedAt
                          : token.slotTime.split("–")[0].trim()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Token Lookup Bar inside Live Queue */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.queueLookUpToken}
                  value={searchTokenInput}
                  onChange={(e) => setSearchTokenInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Lookup Token
              </button>
            </form>

            {searchedTokenData && (
              <div className="mt-4 p-4 rounded-xl bg-slate-800 border border-emerald-500 flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-400 font-bold">
                    Found Token #{searchedTokenData.tokenNumber} (
                    {searchedTokenData.tokenCode})
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {searchedTokenData.farmerName} • {searchedTokenData.crop} (
                    {searchedTokenData.quantityQuintals} Qtl)
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Status:{" "}
                    <span className="capitalize font-bold text-emerald-400">
                      {searchedTokenData.status}
                    </span>{" "}
                    | Est. Wait: {searchedTokenData.estimatedWaitMinutes} mins
                  </div>
                </div>

                <span className="text-xs font-mono font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg border border-slate-700">
                  Slot: {searchedTokenData.slotTime}
                </span>
              </div>
            )}

            {searchFeedback && (
              <div className="mt-3 text-xs text-amber-400 font-medium">
                {searchFeedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
