import React from 'react';
import { UserCheck, Wheat, CalendarClock, Radio, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HowItWorks: React.FC = () => {
  const { t } = useAuth();

  const steps = [
    {
      num: '01',
      title: t.step1Title,
      desc: t.step1Desc,
      icon: UserCheck
    },
    {
      num: '02',
      title: t.step2Title,
      desc: t.step2Desc,
      icon: Wheat
    },
    {
      num: '03',
      title: t.step3Title,
      desc: t.step3Desc,
      icon: CalendarClock
    },
    {
      num: '04',
      title: t.step4Title,
      desc: t.step4Desc,
      icon: Radio
    },
    {
      num: '05',
      title: t.step5Title,
      desc: t.step5Desc,
      icon: CheckCircle2
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
            STEP-BY-STEP WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {t.hiwHeading}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            {t.hiwSubheading}
          </p>
        </div>

        {/* 5-step Connected Visual Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 relative">
          
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-slate-300 group-hover:text-emerald-600 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Phase {step.num} Verified</span>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
