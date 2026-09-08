import { useEffect, useState } from 'react';
import {
  RefreshCw,
  Ticket,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

import { adminFetch } from '../../utils/adminApi';

const QueueTokens = () => {
  const [tokens, setTokens] = useState<any[]>([]);
  const [counts, setCounts] = useState<any>({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadQueue = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();

      if (status) {
        params.set('status', status);
      }

      const query = params.toString();

      const data = await adminFetch(
        `/api/admin/queue${
          query ? `?${query}` : ''
        }`
      );

      setTokens(data.tokens || []);
      setCounts(data.counts || {});
    } catch (err: any) {
      setError(
        err.message || 'Failed to load queue'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [status]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">

          <div>
            <p className="text-sm font-medium text-emerald-600">
              ADMIN PORTAL
            </p>

            <h1 className="text-2xl md:text-3xl font-bold">
              Queue / Tokens
            </h1>

            <p className="text-slate-500 mt-1">
              Live token records from MongoDB.
            </p>
          </div>

          <button
            onClick={loadQueue}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

        </div>

        {/* Queue cards */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white border rounded-2xl p-5">
            <Clock className="text-amber-500" />

            <p className="text-sm text-slate-500 mt-3">
              Waiting
            </p>

            <p className="text-2xl font-bold">
              {counts.waiting || 0}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-5">
            <Ticket className="text-blue-500" />

            <p className="text-sm text-slate-500 mt-3">
              Processing
            </p>

            <p className="text-2xl font-bold">
              {counts.processing || 0}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-5">
            <CheckCircle className="text-emerald-500" />

            <p className="text-sm text-slate-500 mt-3">
              Completed
            </p>

            <p className="text-2xl font-bold">
              {counts.completed || 0}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-5">
            <XCircle className="text-red-500" />

            <p className="text-sm text-slate-500 mt-3">
              Cancelled
            </p>

            <p className="text-2xl font-bold">
              {counts.cancelled || 0}
            </p>
          </div>

        </div>

        {/* Table */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <div className="p-4 border-b">

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="px-4 py-2.5 border border-slate-200 rounded-xl"
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

          {loading ? (
            <div className="p-10 flex justify-center">
              <RefreshCw className="animate-spin text-emerald-600" />
            </div>
          ) : error ? (
            <div className="p-8 text-red-600">
              {error}
            </div>
          ) : tokens.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No tokens found in the database.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4">Token</th>
                    <th className="text-left p-4">Farmer</th>
                    <th className="text-left p-4">Crop</th>
                    <th className="text-left p-4">Quantity</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Slot</th>
                    <th className="text-left p-4">Status</th>
                  </tr>
                </thead>

                <tbody>

                  {tokens.map((token) => (
                    <tr
                      key={token._id}
                      className="border-t border-slate-100"
                    >

                      <td className="p-4">
                        <div className="font-bold text-emerald-700">
                          {token.tokenCode}
                        </div>

                        <div className="text-xs text-slate-500">
                          Token #{token.tokenNumber}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-medium">
                          {token.farmerName}
                        </div>

                        <div className="text-xs text-slate-500">
                          {token.farmerPhone}
                        </div>
                      </td>

                      <td className="p-4">
                        {token.crop}
                      </td>

                      <td className="p-4">
                        {token.quantityQuintals} Qtl
                      </td>

                      <td className="p-4">
                        {token.date}
                      </td>

                      <td className="p-4">
                        {token.slotTime}
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {token.status}
                        </span>
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
  );
};

export default QueueTokens;