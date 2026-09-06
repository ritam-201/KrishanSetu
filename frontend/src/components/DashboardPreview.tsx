import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Wheat,
  QrCode,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Wallet,
  BellRing
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardPreview: React.FC = () => {
  const { t, isAuthenticated, user } = useAuth();

  const features = [
    'Upcoming procurement schedule with instant calendar sync',
    'Live queue position with real-time wait estimation',
    'Certified crop moisture & foreign matter lab test results',
    'Direct Benefit Transfer (DBT) payment tracking to bank A/C',
    'Multichannel SMS & WhatsApp notifications for slot updates'
  ];

  return (
    <section id="dashboard-showcase" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Product Value Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
              SMART. SIMPLE. TRANSPARENT.
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              {t.dashPreviewHeading}
            </h2>

            <p className="text-base text-slate-600 font-normal leading-relaxed">
              KisanSetu is your trusted harvest partner. Access transparent MSP prices, verified weighbridge records, and direct government payouts — all in one accessible view.
            </p>

            <div className="space-y-3 pt-2">
              {features.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mt-0.5 shrink-0 border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <Link
                to="/dashboard"
                id="preview-cta-dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 shadow-sm transition-all group"
              >
                <span>Launch Farmer Dashboard</span>
                <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Device & SaaS Mockup Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-md">
              
              {/* Top Bar of Mockup */}
              <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                    {isAuthenticated && user.name ? user.name.slice(0, 2).toUpperCase() : 'KS'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">
                        {isAuthenticated ? `Good Morning, ${user.name}` : 'Welcome to KisanSetu'}
                      </h4>
                      {!isAuthenticated && <span className="text-base">👋</span>}
                    </div>
                    <p className="text-xs text-slate-500">
                      {isAuthenticated
                        ? `Farmer ID: ${user.id || 'FARM-8821'} • ${user.village || 'Your Village'}, ${user.district || 'Your District'}`
                        : 'Transparent procurement support for every farmer.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Aadhaar Verified
                  </span>
                </div>
              </div>

              {/* 2-Card Row: Next Appointment & Live Token */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                
                {/* Next Procurement Pass Card */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold uppercase tracking-wider text-emerald-600">Confirmed Mandi Pass</span>
                      <span className="font-mono text-slate-900 font-bold">HAR-024</span>
                    </div>

                    <div className="flex items-center gap-3 my-2">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-emerald-600 border border-slate-200">
                        <Wheat className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm sm:text-base font-bold text-slate-900">
                          Paddy (Grade A)
                        </div>
                        <div className="text-xs text-slate-500">
                          25.0 Quintals (2500 kg)
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 mt-3 pt-3 border-t border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Date:</span>
                        <span className="font-bold text-slate-900">28 Aug 2026 (10:00 AM)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Center:</span>
                        <span className="font-medium text-slate-800">Haripur Mandi #04</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Gate Entry Active
                    </span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                      Pass #8821
                    </span>
                  </div>
                </div>

                {/* Live Queue Token Tracker */}
                <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
                      <span className="font-semibold uppercase tracking-wider">Live Token Pass</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700">
                        LANE 2
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-2">
                      <div>
                        <div className="text-3xl font-bold text-white">#24</div>
                        <div className="text-[11px] text-slate-400">Your Assigned Token</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-200">Serving: #23</div>
                        <div className="text-[11px] text-amber-400 flex items-center gap-1 justify-end mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>~18 min wait</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Step Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 font-medium">
                      <span>Gate</span>
                      <span className="text-emerald-400 font-bold">Lab Quality</span>
                      <span>Weighbridge</span>
                      <span>DBT</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full w-3/5" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Quick Row: Expected Payment & Quality Status */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-500 font-medium">Expected Government MSP</div>
                    <div className="text-base font-bold text-slate-900">
                      ₹55,075 <span className="text-[11px] font-normal text-slate-500">(₹2,203/Qtl)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:border-l sm:border-slate-100 sm:pl-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-500 font-medium">Quality Test Result</div>
                    <div className="text-xs font-bold text-emerald-600">
                      Grade A Certified (12.8% Moisture)
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
