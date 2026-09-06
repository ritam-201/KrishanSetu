import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sprout, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const FinalCta: React.FC = () => {
  const { t } = useAuth();

  return (
    <section id="final-cta-section" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-14 shadow-lg border border-slate-800 relative overflow-hidden text-center">
          
          {/* Subtle decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold uppercase">
              <Sprout className="w-3.5 h-3.5" />
              <span>DIGITAL APMC REVOLUTION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              {t.ctaHeading}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              {t.ctaSubheading}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <Link
                to="/schedule"
                id="final-cta-book-slot"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-600 text-white text-sm sm:text-base font-semibold hover:bg-emerald-700 transition-colors shadow-sm active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.ctaButton1}</span>
              </Link>

              <Link
                to="/centers"
                id="final-cta-explore-centers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-sm sm:text-base font-semibold hover:bg-slate-700 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{t.ctaButton2}</span>
              </Link>
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span>✓ Guaranteed MSP</span>
              <span>✓ Instant Mandi Gate Pass</span>
              <span>✓ Live SMS/WhatsApp Queue Updates</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
