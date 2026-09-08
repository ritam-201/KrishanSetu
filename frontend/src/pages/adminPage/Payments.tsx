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
} from "lucide-react";

interface Payment {
  _id?: string;
  paymentId: string;
  transactionId: string;
  pfmsReferenceNo: string;
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
  status:
    | "Initiated"
    | "PFMS Verified"
    | "Treasury Cleared"
    | "Disbursed to Bank"
    | "On Hold"
    | "Failed";
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

interface PaymentsResponse {
  success: boolean;
  count: number;
  payments: Payment[];
  message?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  const fetchPayments = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = getAdminToken();

      const response = await fetch(`${API_BASE_URL}/api/admin/payments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      const data: PaymentsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch payment data");
      }

      if (!data.success) {
        throw new Error(data.message || "Unable to load payments");
      }

      setPayments(data.payments || []);
    } catch (err) {
      console.error("Payment fetch error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading payments.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        payment.paymentId?.toLowerCase().includes(search) ||
        payment.transactionId?.toLowerCase().includes(search) ||
        payment.pfmsReferenceNo?.toLowerCase().includes(search) ||
        payment.farmerName?.toLowerCase().includes(search) ||
        payment.farmerId?.toLowerCase().includes(search) ||
        payment.crop?.toLowerCase().includes(search) ||
        payment.centerName?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  const totalAmount = payments.reduce(
    (sum, payment) => sum + (payment.netPayable || 0),
    0,
  );

  const disbursedAmount = payments
    .filter((payment) => payment.status === "Disbursed to Bank")
    .reduce((sum, payment) => sum + (payment.netPayable || 0), 0);

  const pendingAmount = payments
    .filter(
      (payment) =>
        payment.status !== "Disbursed to Bank" && payment.status !== "Failed",
    )
    .reduce((sum, payment) => sum + (payment.netPayable || 0), 0);

  const failedPayments = payments.filter(
    (payment) => payment.status === "Failed",
  ).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-IN").format(value || 0);
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

  const getStatusStyle = (status: Payment["status"]) => {
    switch (status) {
      case "Disbursed to Bank":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";

      case "PFMS Verified":
        return "bg-blue-100 text-blue-800 border-blue-200";

      case "Treasury Cleared":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";

      case "Initiated":
        return "bg-amber-100 text-amber-800 border-amber-200";

      case "On Hold":
        return "bg-orange-100 text-orange-800 border-orange-200";

      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "Disbursed to Bank":
        return <CheckCircle2 className="w-3.5 h-3.5" />;

      case "Failed":
        return <AlertCircle className="w-3.5 h-3.5" />;

      case "On Hold":
        return <Clock3 className="w-3.5 h-3.5" />;

      default:
        return <Clock3 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#FCFBF7] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-[#123D24] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#256035] mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1B4D2A] border-2 border-[#8EB773] flex items-center justify-center">
                  <IndianRupee className="w-7 h-7 text-[#8EB773]" />
                </div>

                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                    Procurement Payments
                  </h1>

                  <p className="text-xs text-gray-300 mt-1">
                    Monitor farmer payments, PFMS verification, treasury
                    clearance and bank disbursement.
                  </p>
                </div>
              </div>

              <button
                onClick={() => fetchPayments(true)}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8EB773] text-[#123D24] text-xs font-bold hover:bg-[#B7D2A2] transition-colors disabled:opacity-60"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />

                {refreshing ? "Refreshing..." : "Refresh Data"}
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-3xl p-5 border border-[#E8EFE1] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Total Payment Value
                  </p>

                  <p className="font-serif text-2xl font-bold text-[#123D24] mt-2">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-[#E8EFE1] flex items-center justify-center">
                  <WalletCards className="w-5 h-5 text-[#1B4D2A]" />
                </div>
              </div>

              <p className="text-[11px] text-gray-500 mt-3">
                {payments.length} payment records
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#E8EFE1] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Disbursed
                  </p>

                  <p className="font-serif text-2xl font-bold text-emerald-700 mt-2">
                    {formatCurrency(disbursedAmount)}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                </div>
              </div>

              <p className="text-[11px] text-emerald-600 mt-3">
                Direct bank transfer
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#E8EFE1] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Pending Value
                  </p>

                  <p className="font-serif text-2xl font-bold text-[#D99A32] mt-2">
                    {formatCurrency(pendingAmount)}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Clock3 className="w-5 h-5 text-[#D99A32]" />
                </div>
              </div>

              <p className="text-[11px] text-gray-500 mt-3">
                Awaiting final settlement
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#E8EFE1] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Failed Payments
                  </p>

                  <p className="font-serif text-2xl font-bold text-red-600 mt-2">
                    {failedPayments}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>

              <p className="text-[11px] text-gray-500 mt-3">
                Requires administrative review
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8EFE1] shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search farmer, payment ID, transaction, PFMS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-[#FCFBF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#8EB773]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-[#FCFBF7] text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8EB773]"
              >
                <option value="All">All Payment Status</option>
                <option value="Initiated">Initiated</option>
                <option value="PFMS Verified">PFMS Verified</option>
                <option value="Treasury Cleared">Treasury Cleared</option>
                <option value="Disbursed to Bank">Disbursed to Bank</option>
                <option value="On Hold">On Hold</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 text-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />

                <div>
                  <p className="font-bold">Unable to load payment data</p>

                  <p className="text-xs mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#123D24]">
                  Farmer Payment Transactions
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Showing {filteredPayments.length} of {payments.length} payment
                  records
                </p>
              </div>

              <CreditCard className="w-5 h-5 text-[#3F7442]" />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <RefreshCw className="w-8 h-8 text-[#3F7442] animate-spin mb-3" />

                <p className="text-sm font-semibold text-gray-600">
                  Loading payment data...
                </p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-16">
                <WalletCards className="w-10 h-10 text-gray-300 mx-auto mb-3" />

                <h3 className="font-semibold text-gray-700">
                  No payment records found
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  No MongoDB payment records match your current filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F5EC] text-gray-600 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5 rounded-l-xl">Payment</th>

                      <th className="p-3.5">Farmer</th>

                      <th className="p-3.5">Procurement</th>

                      <th className="p-3.5">Gross Amount</th>

                      <th className="p-3.5">Net Payable</th>

                      <th className="p-3.5">Bank</th>

                      <th className="p-3.5">Status</th>

                      <th className="p-3.5 rounded-r-xl">Date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredPayments.map((payment) => (
                      <tr
                        key={payment._id || payment.paymentId}
                        className="hover:bg-[#FCFBF7] transition-colors"
                      >
                        <td className="p-3.5">
                          <p className="font-mono font-bold text-[#123D24]">
                            {payment.paymentId}
                          </p>

                          <p className="text-[10px] text-gray-500 mt-1">
                            TXN: {payment.transactionId}
                          </p>

                          <p className="text-[10px] text-gray-400 mt-0.5">
                            PFMS: {payment.pfmsReferenceNo}
                          </p>
                        </td>

                        <td className="p-3.5">
                          <p className="font-bold text-gray-800">
                            {payment.farmerName}
                          </p>

                          <p className="text-[10px] text-gray-500 mt-1">
                            {payment.farmerId}
                          </p>
                        </td>

                        <td className="p-3.5">
                          <p className="font-semibold text-gray-700">
                            {payment.crop}
                          </p>

                          <p className="text-[10px] text-gray-500 mt-1">
                            Token #{payment.tokenNumber}
                          </p>

                          <p className="text-[10px] text-gray-500">
                            {formatNumber(payment.grossWeightQuintals)} Qtl
                          </p>
                        </td>

                        <td className="p-3.5">
                          <p className="font-semibold text-gray-700">
                            {formatCurrency(payment.grossAmount)}
                          </p>

                          <p className="text-[10px] text-gray-500 mt-1">
                            MSP ₹{formatNumber(payment.mspRatePerQuintal)}
                          </p>

                          <p className="text-[10px] text-red-500">
                            Deduction ₹{formatNumber(payment.deductions)}
                          </p>
                        </td>

                        <td className="p-3.5">
                          <p className="font-bold text-[#123D24]">
                            {formatCurrency(payment.netPayable)}
                          </p>

                          {payment.utrNumber && (
                            <p className="text-[10px] text-gray-500 mt-1">
                              UTR: {payment.utrNumber}
                            </p>
                          )}
                        </td>

                        <td className="p-3.5">
                          <p className="font-semibold text-gray-700">
                            {payment.bankName}
                          </p>

                          <p className="text-[10px] text-gray-500 mt-1">
                            A/C ****
                            {payment.accountLast4}
                          </p>

                          <p className="text-[10px] text-gray-500">
                            {payment.ifscCode}
                          </p>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold whitespace-nowrap ${getStatusStyle(
                              payment.status,
                            )}`}
                          >
                            {getStatusIcon(payment.status)}

                            {payment.status}
                          </span>

                          {payment.disbursedDate && (
                            <p className="text-[10px] text-gray-500 mt-2">
                              Disbursed: {formatDate(payment.disbursedDate)}
                            </p>
                          )}
                        </td>

                        <td className="p-3.5 text-gray-600 whitespace-nowrap">
                          <p>{formatDate(payment.procuredDate)}</p>

                          <p className="text-[10px] text-gray-400 mt-1">
                            Created {formatDate(payment.createdAt)}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;
