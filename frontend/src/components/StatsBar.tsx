import React from 'react';
import { Users, Building2, Scale, Wallet, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StatsBar: React.FC = () => {
  const { t } = useAuth();

  const metrics = [
    {
      icon: Users,
      value: '25,480+',
      label: t.statsFarmersServed,
      sub: 'Verified Aadhaar Profiles',
      badge: '+12% this month',
      badgeType: 'emerald'
    },
    {
      icon: Building2,
      value: '128',
      label: t.statsProcurementCenters,
      sub: 'Active Mandi APMC Yards',
      badge: 'All Live',
      badgeType: 'emerald'
    },
    {
      icon: Scale,
      value: '1.24M+',
      label: t.statsQuintalsProcured,
      sub: 'Digitally Weighed & Certified',
      badge: 'Certified',
      badgeType: 'emerald'
    },
    {
      icon: Wallet,
      value: '₹18.4 Cr+',
      label: t.statsPaymentsTracked,
      sub: 'Direct Bank Transfer (DBT)',
      badge: 'Guaranteed',
      badgeType: 'emerald'
    }
  ];

  return (
    <section
  id="trust-statistics-bar"
  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-12 relative z-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  {item.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {item.value}
                  </div>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {item.badge}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  {item.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
