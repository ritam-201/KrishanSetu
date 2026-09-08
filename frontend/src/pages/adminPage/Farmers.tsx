import { useEffect, useState } from 'react';
import {
  Search,
  RefreshCw,
  Users
} from 'lucide-react';

import { adminFetch } from '../../utils/adminApi';

const Farmers = () => {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFarmers = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await adminFetch(
        '/api/admin/farmers'
      );

      setFarmers(data.farmers || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load farmers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  const filteredFarmers = farmers.filter((farmer) => {
    const text = search.toLowerCase();

    return (
      farmer.name?.toLowerCase().includes(text) ||
      farmer.phone?.toLowerCase().includes(text) ||
      farmer.email?.toLowerCase().includes(text) ||
      farmer.profile?.farmerId
        ?.toLowerCase()
        .includes(text) ||
      farmer.profile?.village
        ?.toLowerCase()
        .includes(text) ||
      farmer.profile?.district
        ?.toLowerCase()
        .includes(text)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <p className="text-sm font-medium text-emerald-600">
              ADMIN PORTAL
            </p>

            <h1 className="text-2xl md:text-3xl font-bold">
              Farmers
            </h1>

            <p className="text-slate-500 mt-1">
              Registered farmers from your database.
            </p>
          </div>

          <button
            onClick={loadFarmers}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <div className="p-4 border-b border-slate-200">
            <div className="relative max-w-md">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search farmer..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              />

            </div>
          </div>

          {loading ? (
            <div className="p-10 flex justify-center">
              <RefreshCw className="animate-spin text-emerald-600" />
            </div>
          ) : error ? (
            <div className="p-8 text-red-600">
              {error}
            </div>
          ) : filteredFarmers.length === 0 ? (
            <div className="p-10 text-center">

              <Users className="w-10 h-10 mx-auto text-slate-300" />

              <p className="mt-3 text-slate-500">
                No farmers found in the database.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4">Farmer</th>
                    <th className="text-left p-4">Farmer ID</th>
                    <th className="text-left p-4">Contact</th>
                    <th className="text-left p-4">Location</th>
                    <th className="text-left p-4">Farm</th>
                    <th className="text-left p-4">Verification</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredFarmers.map((farmer) => {
                    const profile = farmer.profile;

                    return (
                      <tr
                        key={farmer.userId}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >

                        <td className="p-4">
                          <div className="font-semibold">
                            {farmer.name}
                          </div>

                          <div className="text-xs text-slate-500">
                            {farmer.email || 'No email'}
                          </div>
                        </td>

                        <td className="p-4">
                          {profile?.farmerId || '—'}
                        </td>

                        <td className="p-4">
                          <div>{farmer.phone}</div>
                        </td>

                        <td className="p-4">
                          {profile ? (
                            <>
                              <div>
                                {profile.village}
                              </div>

                              <div className="text-xs text-slate-500">
                                {profile.district}, {profile.state}
                              </div>
                            </>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="p-4">
                          {profile ? (
                            <>
                              <div>
                                {profile.farmName || '—'}
                              </div>

                              <div className="text-xs text-slate-500">
                                {profile.totalLandArea}{' '}
                                {profile.landUnit}
                              </div>
                            </>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              profile?.verificationStatus ===
                              'Verified'
                                ? 'bg-emerald-100 text-emerald-700'
                                : profile?.verificationStatus ===
                                  'Action Required'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {profile?.verificationStatus ||
                              'Profile Missing'}
                          </span>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Farmers;