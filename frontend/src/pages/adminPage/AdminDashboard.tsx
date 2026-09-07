import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Building2,
  Users,
  Wallet,
  Scale,
  Award,
  Filter,
  Download,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { centers } = useAuth();
  const [selectedSeason, setSelectedSeason] = useState('Kharif 2026-27');

  // Daily Procurement Trend Data
  const dailyTrendData = [
    { date: '18 Aug', paddy: 1420, wheat: 320, total: 1740 },
    { date: '19 Aug', paddy: 1850, wheat: 410, total: 2260 },
    { date: '20 Aug', paddy: 2100, wheat: 500, total: 2600 },
    { date: '21 Aug', paddy: 2450, wheat: 590, total: 3040 },
    { date: '22 Aug', paddy: 2900, wheat: 680, total: 3580 },
    { date: '23 Aug', paddy: 3400, wheat: 820, total: 4220 },
    { date: '24 Aug', paddy: 3850, wheat: 910, total: 4760 }
  ];

  // District Target vs Actual Achievement Data
  const districtPerformanceData = [
    { district: 'Hooghly', target: 50000, actual: 44200 },
    { district: 'P. Bardhaman', target: 80000, actual: 76500 },
    { district: 'Nadia', target: 45000, actual: 38900 },
    { district: 'Malda', target: 40000, actual: 34100 },
    { district: 'Murshidabad', target: 60000, actual: 52400 }
  ];

  // Crop Distribution Data
  const cropShareData = [
    { name: 'Paddy / Rice', value: 65, color: '#1B4D2A' },
    { name: 'Wheat', value: 20, color: '#3F7442' },
    { name: 'Mustard', value: 10, color: '#D99A32' },
    { name: 'Maize & Others', value: 5, color: '#8EB773' }
  ];

  return (
    <div className="min-h-screen py-8 bg-[#FCFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="bg-[#123D24] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#256035] mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1B4D2A] border-2 border-[#8EB773] flex items-center justify-center font-serif text-2xl font-bold text-white shadow-md shrink-0">
                AB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    State Agricultural Procurement Analytics
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1B4D2A] text-[#8EB773] text-xs font-bold border border-[#256035]">
                    State Admin Console
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  Department of Agriculture & Food Supplies • Live Mandi APMC Network (148 Centers)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="p-2.5 rounded-xl bg-[#1B4D2A] text-white border border-[#256035] text-xs font-bold focus:outline-none"
              >
                <option value="Kharif 2026-27">Season: Kharif 2026-27</option>
                <option value="Rabi 2025-26">Season: Rabi 2025-26</option>
              </select>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-[#8EB773] text-[#123D24] text-xs font-bold hover:bg-[#B7D2A2] transition-colors"
              >
                Export PDF Report
              </button>
            </div>
          </div>

          {/* 5-Metric State Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-[#256035] text-xs">
            <div className="bg-[#1B4D2A] p-3.5 rounded-2xl border border-[#256035]">
              <span className="text-[10px] text-gray-400 uppercase">Registered Farmers</span>
              <div className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">42,850</div>
              <span className="text-[10px] text-[#8EB773]">+1,240 this week</span>
            </div>
            <div className="bg-[#1B4D2A] p-3.5 rounded-2xl border border-[#256035]">
              <span className="text-[10px] text-gray-400 uppercase">Total Grain Procured</span>
              <div className="font-serif text-xl sm:text-2xl font-bold text-[#8EB773] mt-0.5">2,84,500 Qtl</div>
              <span className="text-[10px] text-gray-300">88.4% of Target</span>
            </div>
            <div className="bg-[#1B4D2A] p-3.5 rounded-2xl border border-[#256035]">
              <span className="text-[10px] text-gray-400 uppercase">PFMS DBT Disbursed</span>
              <div className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">₹62.68 Cr</div>
              <span className="text-[10px] text-[#8EB773]">100% direct to bank</span>
            </div>
            <div className="bg-[#1B4D2A] p-3.5 rounded-2xl border border-[#256035]">
              <span className="text-[10px] text-gray-400 uppercase">Active APMC Mandis</span>
              <div className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">148 Hubs</div>
              <span className="text-[10px] text-gray-300">Across 23 Districts</span>
            </div>
            <div className="bg-[#1B4D2A] p-3.5 rounded-2xl border border-[#256035] col-span-2 lg:col-span-1">
              <span className="text-[10px] text-gray-400 uppercase">Avg Farmer Wait Time</span>
              <div className="font-serif text-xl sm:text-2xl font-bold text-[#D99A32] mt-0.5">21 Mins</div>
              <span className="text-[10px] text-[#8EB773]">Down 76% from 2023</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Daily Procurement Trend (Area Chart) - 7 Cols */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#123D24]">
                  Daily Procurement Inflow (Quintals)
                </h3>
                <p className="text-xs text-gray-500">Live tonnage registered across calibrated digital weighbridges</p>
              </div>
              <span className="text-xs font-bold text-[#3F7442] bg-[#E8EFE1] px-2.5 py-1 rounded-full">
                +14.2% DoD
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTrendData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B4D2A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1B4D2A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" />
                  <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#123D24', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                    labelStyle={{ color: '#8EB773', fontWeight: 'bold' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#1B4D2A"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    name="Total Quintals"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crop Share Distribution (Pie Chart) - 5 Cols */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#123D24]">
                  Crop Composition
                </h3>
                <p className="text-xs text-gray-500">Share of total procurement volume</p>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cropShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {cropShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#123D24', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-gray-100">
              <div className="p-2 rounded-xl bg-[#FCFBF7] border border-[#E8EFE1]">
                <span className="text-gray-500">Paddy MSP:</span>
                <span className="font-bold text-[#123D24] block">₹2,203 / Qtl</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FCFBF7] border border-[#E8EFE1]">
                <span className="text-gray-500">Wheat MSP:</span>
                <span className="font-bold text-[#123D24] block">₹2,275 / Qtl</span>
              </div>
            </div>
          </div>

        </div>

        {/* District Target vs Actual Performance (Bar Chart) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-xs mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#123D24]">
                District-Wise Target vs Actual Procurement (Quintals)
              </h3>
              <p className="text-xs text-gray-500">Comparative performance across major agricultural zones</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" />
                <XAxis dataKey="district" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#123D24', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#8EB773', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="target" fill="#D3E0C9" radius={[6, 6, 0, 0]} name="Allocated Target" />
                <Bar dataKey="actual" fill="#1B4D2A" radius={[6, 6, 0, 0]} name="Actual Procured" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Center Audit Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#123D24]">
                Mandi APMC Center Operational Status
              </h3>
              <p className="text-xs text-gray-500">Live operational status of digital weighbridges and QC test kits</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EC] text-gray-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Center Name</th>
                  <th className="p-3.5">District</th>
                  <th className="p-3.5">Today's Capacity</th>
                  <th className="p-3.5">Available Slots</th>
                  <th className="p-3.5">Active Token</th>
                  <th className="p-3.5">Avg Wait Time</th>
                  <th className="p-3.5 rounded-r-xl">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {centers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FCFBF7]">
                    <td className="p-3.5 font-bold text-[#123D24]">{c.name}</td>
                    <td className="p-3.5 text-gray-600">{c.district}</td>
                    <td className="p-3.5 text-gray-700">{c.totalCapacityQuintals} Qtl</td>
                    <td className="p-3.5 font-bold text-[#3F7442]">{c.availableSlotsToday} Slots Open</td>
                    <td className="p-3.5 font-serif font-black text-sm text-[#123D24]">#{c.currentServingToken}</td>
                    <td className="p-3.5 text-[#D99A32] font-semibold">{c.estimatedWaitTimeMinutes} mins</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8EFE1] text-[#3F8F55]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Online</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Audit Logs Section (Requirement 27) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-xs mt-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#123D24] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> System Audit & Compliance Logs
              </h3>
              <p className="text-xs text-gray-500">Immutable trail of critical officer, staff, and system administrative actions</p>
            </div>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200">
              Audit Mode: ACTIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EC] text-gray-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Log ID</th>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Action Executed</th>
                  <th className="p-3.5">Target Entity</th>
                  <th className="p-3.5">Action Details</th>
                  <th className="p-3.5 rounded-r-xl">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                <tr className="hover:bg-[#FCFBF7]">
                  <td className="p-3.5 font-mono text-slate-500">AUD-2026-991</td>
                  <td className="p-3.5 font-bold text-slate-900">Subhash Patel</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">FARMER</span></td>
                  <td className="p-3.5 font-semibold text-slate-800">TOKEN_BOOKED</td>
                  <td className="p-3.5 font-mono text-emerald-700 font-bold">HAR-024</td>
                  <td className="p-3.5 text-slate-600">Booked 45 Qtl Paddy at Haripur Mandi Hub</td>
                  <td className="p-3.5 text-slate-500">Just now</td>
                </tr>
                <tr className="hover:bg-[#FCFBF7]">
                  <td className="p-3.5 font-mono text-slate-500">AUD-2026-990</td>
                  <td className="p-3.5 font-bold text-slate-900">Inspector V. Sen</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">OFFICER</span></td>
                  <td className="p-3.5 font-semibold text-slate-800">LAB_QUALITY_APPROVED</td>
                  <td className="p-3.5 font-mono text-emerald-700 font-bold">HAR-023</td>
                  <td className="p-3.5 text-slate-600">Certified Grade A, Moisture 13.5%, Foreign Matter 0.8%</td>
                  <td className="p-3.5 text-slate-500">25 mins ago</td>
                </tr>
                <tr className="hover:bg-[#FCFBF7]">
                  <td className="p-3.5 font-mono text-slate-500">AUD-2026-989</td>
                  <td className="p-3.5 font-bold text-slate-900">Admin S. Roy</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">ADMIN</span></td>
                  <td className="p-3.5 font-semibold text-slate-800">CENTER_CAPACITY_UPDATED</td>
                  <td className="p-3.5 font-mono text-emerald-700 font-bold">CTR-001</td>
                  <td className="p-3.5 text-slate-600">Increased daily quota to 1,500 Qtl to manage harvest surge</td>
                  <td className="p-3.5 text-slate-500">1 hour ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
