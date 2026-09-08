import { useEffect, useState } from 'react';
import {
  RefreshCw,
  BarChart3,
  IndianRupee,
  Wheat,
  Users
} from 'lucide-react';

import { adminFetch } from '../../utils/adminApi';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value || 0);
};

const Reports = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await adminFetch(
        '/api/admin/reports'
      );

      setData(result.reports);
    } catch (err: any) {
      setError(
        err.message || 'Failed to load reports'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto bg-red-50 p-6 rounded-2xl text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">

          <div>
            <p className="text-sm font-medium text-emerald-600">
              ADMIN PORTAL
            </p>

            <h1 className="text-2xl md:text-3xl font-bold">
              Reports & Analytics
            </h1>

            <p className="text-slate-500 mt-1">
              Statistics calculated from your database.
            </p>
          </div>

          <button
            onClick={loadReports}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

        </div>

        {/* Financial summary */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white border rounded-2xl p-5">
            <IndianRupee className="text-emerald-600" />

            <p className="text-sm text-slate-500 mt-3">
              Gross Amount
            </p>

            <p className="text-2xl font-bold">
              {formatCurrency(
                data.paymentTotals.grossAmount
              )}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-5">
            <IndianRupee className="text-red-600" />

            <p className="text-sm text-slate-500 mt-3">
              Deductions
            </p>

            <p className="text-2xl font-bold">
              {formatCurrency(
                data.paymentTotals.deductions
              )}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-5">
            <IndianRupee className="text-blue-600" />

            <p className="text-sm text-slate-500 mt-3">
              Net Payable
            </p>

            <p className="text-2xl font-bold">
              {formatCurrency(
                data.paymentTotals.netPayable
              )}
            </p>
          </div>

        </div>

        {/* Procurement summary */}

        <div className="bg-white border rounded-2xl p-6 mb-6">

          <div className="flex items-center gap-3 mb-5">
            <Wheat className="text-emerald-600" />

            <h2 className="text-lg font-bold">
              Procurement Quantity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">
                Submitted
              </p>

              <p className="text-2xl font-bold">
                {data.procurementTotals.submittedQuantity}
                {' '}Qtl
              </p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">
                Approved
              </p>

              <p className="text-2xl font-bold text-emerald-700">
                {data.procurementTotals.approvedQuantity}
                {' '}Qtl
              </p>
            </div>

            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">
                Rejected
              </p>

              <p className="text-2xl font-bold text-red-700">
                {data.procurementTotals.rejectedQuantity}
                {' '}Qtl
              </p>
            </div>

          </div>

        </div>

        {/* Reports grids */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Booking status */}

          <ReportCard
            title="Bookings by Status"
            icon={<BarChart3 />}
          >
            {data.bookingsByStatus.map(
              (item: any) => (
                <ReportRow
                  key={item._id}
                  label={item._id}
                  value={item.count}
                />
              )
            )}
          </ReportCard>

          {/* Crop report */}

          <ReportCard
            title="Bookings by Crop"
            icon={<Wheat />}
          >
            {data.bookingsByCrop.map(
              (item: any) => (
                <ReportRow
                  key={item._id}
                  label={item._id}
                  value={`${item.count} bookings • ${item.quantity || 0} Qtl`}
                />
              )
            )}
          </ReportCard>

          {/* Payment status */}

          <ReportCard
            title="Payments by Status"
            icon={<IndianRupee />}
          >
            {data.paymentsByStatus.map(
              (item: any) => (
                <ReportRow
                  key={item._id}
                  label={item._id}
                  value={`${item.count} • ${formatCurrency(
                    item.amount
                  )}`}
                />
              )
            )}
          </ReportCard>

          {/* Farmer district */}

          <ReportCard
            title="Farmers by District"
            icon={<Users />}
          >
            {data.farmersByDistrict.map(
              (item: any) => (
                <ReportRow
                  key={item._id}
                  label={item._id}
                  value={item.count}
                />
              )
            )}
          </ReportCard>

          {/* Token status */}

          <ReportCard
            title="Tokens by Status"
            icon={<BarChart3 />}
          >
            {data.tokensByStatus.map(
              (item: any) => (
                <ReportRow
                  key={item._id}
                  label={item._id}
                  value={item.count}
                />
              )
            )}
          </ReportCard>

          {/* Token crop */}

          <ReportCard
            title="Tokens by Crop"
            icon={<Wheat />}
          >
            {data.tokensByCrop.map(
              (item: any) => (
                <ReportRow
                  key={item._id}
                  label={item._id}
                  value={`${item.count} tokens • ${
                    item.quantity || 0
                  } Qtl`}
                />
              )
            )}
          </ReportCard>

        </div>

      </div>
    </div>
  );
};

const ReportCard = ({
  title,
  icon,
  children
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden">

      <div className="p-5 border-b flex items-center gap-3">
        <div className="text-emerald-600">
          {icon}
        </div>

        <h2 className="font-bold">
          {title}
        </h2>
      </div>

      <div className="divide-y divide-slate-100">
        {children}
      </div>

    </div>
  );
};

const ReportRow = ({
  label,
  value
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="flex items-center justify-between p-4">

      <span className="text-slate-600">
        {label}
      </span>

      <span className="font-bold text-slate-900">
        {value}
      </span>

    </div>
  );
};

export default Reports;