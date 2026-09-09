import { useEffect, useMemo, useState } from "react";

import {
  RefreshCw,
  Ticket,
  Clock3,
  CheckCircle2,
  XCircle,
  Search,
  User,
  Wheat,
  CalendarDays,
  MapPin,
  Phone,
  X,
  ChevronRight,
  AlertCircle,
  Activity,
} from "lucide-react";

import { adminFetch } from "../../utils/adminApi";

type Token = {
  _id: string;
  tokenCode?: string;
  tokenNumber?: number;
  farmerName?: string;
  farmerPhone?: string;
  farmerId?: string;
  crop?: string;
  variety?: string;
  quantityQuintals?: number;
  date?: string;
  slotTime?: string;
  status?: string;
  centerName?: string;
  centerId?: string;
  district?: string;
  block?: string;
  createdAt?: string;
};

type QueueCounts = {
  waiting?: number;
  processing?: number;
  completed?: number;
  cancelled?: number;
  [key: string]: number | undefined;
};

const QueueTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [counts, setCounts] = useState<QueueCounts>({});

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  /*
  |--------------------------------------------------------------------------
  | LOAD QUEUE
  |--------------------------------------------------------------------------
  */

  const loadQueue = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const params = new URLSearchParams();

      if (status) {
        params.set("status", status);
      }

      const query = params.toString();

      const data = await adminFetch(
        `/api/admin/queue${query ? `?${query}` : ""}`,
      );

      setTokens(data.tokens || []);
      setCounts(data.counts || {});
    } catch (err: any) {
      console.error("Queue loading error:", err);

      setError(err.message || "Failed to load queue");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadQueue();
  }, [status]);

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const filteredTokens = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return tokens;
    }

    return tokens.filter((token) => {
      return (
        token.tokenCode?.toLowerCase().includes(query) ||
        String(token.tokenNumber || "").includes(query) ||
        token.farmerName?.toLowerCase().includes(query) ||
        token.farmerPhone?.toLowerCase().includes(query) ||
        token.farmerId?.toLowerCase().includes(query) ||
        token.crop?.toLowerCase().includes(query) ||
        token.centerName?.toLowerCase().includes(query)
      );
    });
  }, [tokens, search]);

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

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

  const getStatusLabel = (value?: string) => {
    if (!value) return "Unknown";

    switch (value.toLowerCase()) {
      case "waiting":
        return "Waiting";

      case "next":
        return "Next";

      case "arrived":
        return "Arrived";

      case "processing":
        return "Processing";

      case "completed":
        return "Completed";

      case "rejected":
        return "Rejected";

      case "cancelled":
        return "Cancelled";

      default:
        return value;
    }
  };

  const getStatusClass = (value?: string) => {
    switch (value?.toLowerCase()) {
      case "waiting":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "next":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "arrived":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";

      case "cancelled":
        return "bg-slate-100 text-slate-600 border-slate-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (value?: string) => {
    switch (value?.toLowerCase()) {
      case "waiting":
        return <Clock3 className="w-3.5 h-3.5" />;

      case "processing":
        return <Activity className="w-3.5 h-3.5" />;

      case "completed":
        return <CheckCircle2 className="w-3.5 h-3.5" />;

      case "rejected":
      case "cancelled":
        return <XCircle className="w-3.5 h-3.5" />;

      default:
        return <Ticket className="w-3.5 h-3.5" />;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | MAIN UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-emerald-100 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-lime-100 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                <Ticket className="w-4 h-4" />
                ADMIN QUEUE MANAGEMENT
              </div>

              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">
                Queue / Tokens
              </h1>

              <p className="mt-2 text-slate-500 max-w-2xl">
                Monitor farmer tokens, queue movement, arrival status and
                procurement processing in real time.
              </p>
            </div>

            <button
              onClick={() => loadQueue(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition disabled:opacity-60"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />

              {refreshing ? "Refreshing..." : "Refresh Queue"}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN
      ========================================================= */}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* =======================================================
            SUMMARY CARDS
        ======================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Waiting */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Waiting
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {counts.waiting || 0}
                </p>

                <p className="text-xs text-amber-600 mt-2">
                  Farmers in queue
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock3 className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Processing */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Processing
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {counts.processing || 0}
                </p>

                <p className="text-xs text-blue-600 mt-2">
                  Currently being served
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Completed */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {counts.completed || 0}
                </p>

                <p className="text-xs text-emerald-600 mt-2">
                  Successfully completed
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Cancelled */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Cancelled
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {counts.cancelled || 0}
                </p>

                <p className="text-xs text-red-600 mt-2">
                  Cancelled tokens
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================
            FILTER BAR
        ======================================================= */}

        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search token, farmer, phone, crop or center..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Status */}

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-700"
            >
              <option value="">All Tokens</option>

              <option value="waiting">Waiting</option>

              <option value="next">Next</option>

              <option value="arrived">Arrived</option>

              <option value="processing">Processing</option>

              <option value="completed">Completed</option>

              <option value="rejected">Rejected</option>

              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredTokens.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {tokens.length}
              </span>{" "}
              tokens
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* =======================================================
            ERROR
        ======================================================= */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold text-red-800">
                  Unable to load queue
                </p>

                <p className="text-sm text-red-600 mt-1">
                  {error}
                </p>

                <button
                  onClick={() => loadQueue()}
                  className="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            TABLE
        ======================================================= */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Farmer Token Queue
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Live token records from MongoDB
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
              </div>

              <p className="font-semibold text-slate-700">
                Loading queue...
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Fetching latest token records
              </p>
            </div>
          ) : filteredTokens.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                <Ticket className="w-7 h-7 text-slate-300" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-700">
                No tokens found
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                No queue records match your current search or filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-600">
                      Token
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Farmer
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Crop
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Quantity
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Date
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Slot
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="text-right p-4 font-semibold text-slate-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTokens.map((token) => (
                    <tr
                      key={token._id}
                      className="border-t border-slate-100 hover:bg-slate-50/70 transition"
                    >
                      {/* Token */}

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                            <Ticket className="w-5 h-5 text-emerald-600" />
                          </div>

                          <div>
                            <div className="font-bold text-emerald-700">
                              {token.tokenCode || "—"}
                            </div>

                            <div className="text-xs text-slate-500 mt-0.5">
                              Token #{token.tokenNumber ?? "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Farmer */}

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-500" />
                          </div>

                          <div>
                            <div className="font-semibold text-slate-900">
                              {token.farmerName || "Unknown Farmer"}
                            </div>

                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                              <Phone className="w-3 h-3" />

                              {token.farmerPhone || "No phone"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Crop */}

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Wheat className="w-4 h-4 text-emerald-600" />

                          <div>
                            <div className="font-medium text-slate-900">
                              {token.crop || "—"}
                            </div>

                            {token.variety && (
                              <div className="text-xs text-slate-500">
                                {token.variety}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Quantity */}

                      <td className="p-4">
                        <div className="font-semibold text-slate-900">
                          {token.quantityQuintals ?? 0} Qtl
                        </div>
                      </td>

                      {/* Date */}

                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <CalendarDays className="w-4 h-4 text-slate-400" />

                          <span>
                            {formatDate(token.date)}
                          </span>
                        </div>
                      </td>

                      {/* Slot */}

                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                          {token.slotTime || "—"}
                        </span>
                      </td>

                      {/* Status */}

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${getStatusClass(
                            token.status,
                          )}`}
                        >
                          {getStatusIcon(token.status)}

                          {getStatusLabel(token.status)}
                        </span>
                      </td>

                      {/* Action */}

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedToken(token)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition"
                        >
                          View Token
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          TOKEN DETAILS MODAL
      ========================================================= */}

      {selectedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}

          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setSelectedToken(null)}
          />

          {/* Modal */}

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
            {/* Header */}

            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                  <Ticket className="w-4 h-4" />
                  TOKEN DETAILS
                </div>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedToken.tokenCode || "Token"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Token #{selectedToken.tokenNumber ?? "—"}
                </p>
              </div>

              <button
                onClick={() => setSelectedToken(null)}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status */}

              <div className="rounded-2xl bg-slate-900 text-white p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Current Queue Status
                    </p>

                    <p className="text-2xl font-bold mt-1">
                      {getStatusLabel(selectedToken.status)}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-full border text-xs font-bold ${getStatusClass(
                      selectedToken.status,
                    )}`}
                  >
                    {getStatusIcon(selectedToken.status)}

                    {getStatusLabel(selectedToken.status)}
                  </span>
                </div>
              </div>

              {/* Farmer */}

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Farmer Information
                    </h3>

                    <p className="text-xs text-slate-500">
                      Registered farmer details
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      Farmer Name
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {selectedToken.farmerName || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Farmer ID
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {selectedToken.farmerId || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Mobile Number
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {selectedToken.farmerPhone || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Procurement */}

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-lime-50 flex items-center justify-center">
                    <Wheat className="w-5 h-5 text-lime-600" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Procurement Details
                    </h3>

                    <p className="text-xs text-slate-500">
                      Crop and quantity information
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      Crop
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {selectedToken.crop || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Variety
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {selectedToken.variety || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Quantity
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {selectedToken.quantityQuintals ?? 0} Qtl
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule */}

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Queue Schedule
                    </h3>

                    <p className="text-xs text-slate-500">
                      Farmer appointment information
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      Date
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {formatDate(selectedToken.date)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Time Slot
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {selectedToken.slotTime || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Center */}

              {(selectedToken.centerName ||
                selectedToken.centerId ||
                selectedToken.district ||
                selectedToken.block) && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />

                    <div>
                      <p className="text-xs uppercase tracking-wider text-emerald-600 font-bold">
                        Procurement Center
                      </p>

                      <p className="font-bold text-emerald-900 mt-1">
                        {selectedToken.centerName || "—"}
                      </p>

                      {selectedToken.centerId && (
                        <p className="text-sm text-emerald-700 mt-0.5">
                          Center ID: {selectedToken.centerId}
                        </p>
                      )}

                      {(selectedToken.district ||
                        selectedToken.block) && (
                        <p className="text-sm text-emerald-700 mt-1">
                          {selectedToken.district || "—"}
                          {selectedToken.block
                            ? ` / ${selectedToken.block}`
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}

            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedToken(null)}
                className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueTokens;