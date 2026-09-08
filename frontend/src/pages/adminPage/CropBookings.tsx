import { useEffect, useState } from 'react';
import {
  Search,
  RefreshCw,
  Wheat
} from 'lucide-react';

import { adminFetch } from '../../utils/adminApi';

const CropBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();

      if (status) {
        params.set('status', status);
      }

      if (search) {
        params.set('search', search);
      }

      const query = params.toString();

      const data = await adminFetch(
        `/api/admin/crop-bookings${
          query ? `?${query}` : ''
        }`
      );

      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(
        err.message || 'Failed to load bookings'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBookings();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">

          <div>
            <p className="text-sm font-medium text-emerald-600">
              ADMIN PORTAL
            </p>

            <h1 className="text-2xl md:text-3xl font-bold">
              Crop Bookings
            </h1>

            <p className="text-slate-500 mt-1">
              Real procurement records from MongoDB.
            </p>
          </div>

          <button
            onClick={loadBookings}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <div className="p-4 border-b flex flex-col md:flex-row gap-3">

            <div className="relative flex-1 max-w-lg">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search farmer, ID or procurement ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl"
              />

            </div>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="px-4 py-2.5 border border-slate-200 rounded-xl"
            >
              <option value="">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Farmer Arrived">
                Farmer Arrived
              </option>
              <option value="Verification">
                Verification
              </option>
              <option value="Quality Check">
                Quality Check
              </option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Hold">Hold</option>
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
          ) : bookings.length === 0 ? (
            <div className="p-10 text-center">

              <Wheat className="w-10 h-10 mx-auto text-slate-300" />

              <p className="mt-3 text-slate-500">
                No crop bookings found.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4">Booking</th>
                    <th className="text-left p-4">Farmer</th>
                    <th className="text-left p-4">Crop</th>
                    <th className="text-left p-4">Quantity</th>
                    <th className="text-left p-4">Center</th>
                    <th className="text-left p-4">Quality</th>
                    <th className="text-left p-4">Status</th>
                  </tr>
                </thead>

                <tbody>

                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-t border-slate-100"
                    >

                      <td className="p-4">
                        <div className="font-semibold">
                          {booking.procurementId}
                        </div>

                        <div className="text-xs text-slate-500">
                          Token #{booking.tokenNumber}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-medium">
                          {booking.farmerName}
                        </div>

                        <div className="text-xs text-slate-500">
                          {booking.farmerId}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-medium">
                          {booking.crop}
                        </div>

                        <div className="text-xs text-slate-500">
                          {booking.variety || '—'}
                        </div>
                      </td>

                      <td className="p-4">
                        <div>
                          Submitted:{' '}
                          {booking.submittedQuantityQuintals} Qtl
                        </div>

                        <div className="text-xs text-emerald-600">
                          Approved:{' '}
                          {booking.approvedQuantityQuintals ?? 0} Qtl
                        </div>
                      </td>

                      <td className="p-4">
                        <div>{booking.centerName}</div>

                        <div className="text-xs text-slate-500">
                          {booking.centerId}
                        </div>
                      </td>

                      <td className="p-4">
                        {booking.qualityGrade || 'Pending'}
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {booking.status}
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

export default CropBookings;