import React from 'react';
import { ShieldCheck, Eye, Clock, HeartHandshake, CheckCircle } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const points = [
    {
      icon: ShieldCheck,
      title: '100% Government MSP Compliance',
      desc: 'No arbitrary price reductions or middleman cuts. Rates strictly adhere to the Commission for Agricultural Costs and Prices (CACP).'
    },
    {
      icon: Eye,
      title: 'Digital Weighbridge Integrity',
      desc: 'Automated tare and gross readings sent directly from calibrated load cells straight to your mobile phone before vehicle departure.'
    },
    {
      icon: Clock,
      title: 'Pre-Scheduled 30-Minute Windows',
      desc: 'Never camp outside the mandi yard overnight again. Arrive precisely when your token window begins and save productive farming hours.'
    },
    {
      icon: HeartHandshake,
      title: 'Direct-to-Bank Accountability',
      desc: 'Public Financial Management System (PFMS) tracking ensures funds are deposited directly into your verified bank account.'
    }
  ];

  return (
    <section id="farmer-trust-benefits" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
            FARMER-FIRST GUARANTEE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Built Around What Farmers Need Most
          </h2>
          <p className="mt-3 text-base text-slate-600 font-normal">
            “Less uncertainty. Less waiting. More transparency.”
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {pt.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
