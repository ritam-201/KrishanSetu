import React from 'react';
import { CalendarCheck, Navigation, Users2, Banknote, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProblemSolution: React.FC = () => {
  const { t } = useAuth();

  const cards = [
    {
      icon: CalendarCheck,
      number: '01',
      title: t.prob1Title,
      desc: t.prob1Desc,
      link: '/schedule',
      cta: 'View Schedules'
    },
    {
      icon: Navigation,
      number: '02',
      title: t.prob2Title,
      desc: t.prob2Desc,
      link: '/centers',
      cta: 'Find Centers'
    },
    {
      icon: Users2,
      number: '03',
      title: t.prob3Title,
      desc: t.prob3Desc,
      link: '/queue',
      cta: 'Track Live Queue'
    },
    {
      icon: Banknote,
      number: '04',
      title: t.prob4Title,
      desc: t.prob4Desc,
      link: '/payments',
      cta: 'Check Payment'
    }
  ];

  return (
    <section id="procurement-problems" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
            CLEARING UNCERTAINTY
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            {t.problemHeading}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {t.problemSubheading}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-xs border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold text-slate-300 group-hover:text-emerald-600 transition-colors">
                      {card.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                    {card.desc}
                  </p>
                </div>

                <Link
                  to={card.link}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>{card.cta}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
