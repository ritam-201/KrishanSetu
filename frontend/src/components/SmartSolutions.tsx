import React from 'react';
import { Microscope, Scale, Smartphone, ShieldCheck, Banknote, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SmartSolutions: React.FC = () => {
  const { t } = useAuth();

  const solutions = [
    {
      icon: Microscope,
      title: 'Digital Crop Quality & Moisture Testing',
      desc: 'On-site moisture meters and foreign matter analysis give transparent instant Grade A/B certification without subjective rejections.'
    },
    {
      icon: Scale,
      title: 'Calibrated Electronic Weighbridges',
      desc: 'Automated digital scales record gross tractor weight and tare weight with digital slips sent immediately to your smartphone.'
    },
    {
      icon: Smartphone,
      title: 'Live Mandi Gate Pass & Token Queue',
      desc: 'Book convenient morning or afternoon slots. Track your real-time position so you only arrive when your turn is ready.'
    },
    {
      icon: ShieldCheck,
      title: 'Guaranteed 100% Government MSP Rates',
      desc: 'Pre-notified minimum support prices for Paddy (₹2,203/Qtl), Wheat (₹2,275/Qtl), and Mustard (₹5,650/Qtl) with zero commission cuts.'
    },
    {
      icon: Banknote,
      title: 'Direct Benefit Transfer (DBT) to Bank Account',
      desc: 'Integrated with the Public Financial Management System (PFMS) for direct credit into your Aadhaar-linked bank account in 24–48 hours.'
    },
    {
      icon: Sparkles,
      title: 'Multichannel SMS & WhatsApp Alerts',
      desc: 'Receive instant push updates when slot opens, when token is called, when quality passes, and when payment clears.'
    }
  ];

  return (
    <section id="smart-solutions" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
            WHAT WE OFFER
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {t.solutionHeading}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            {t.solutionSubheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white rounded-xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-lg bg-emerald-50 group-hover:bg-emerald-600 flex items-center justify-center text-emerald-600 group-hover:text-white shadow-2xs border border-emerald-100 mb-5 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
