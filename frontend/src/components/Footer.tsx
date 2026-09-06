import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, Globe, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LanguageCode } from '../types';

export const Footer: React.FC = () => {
  const { t, language, setLanguage } = useAuth();

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white">
                  KISAN<span className="text-emerald-400">SETU</span>
                </span>
                <p className="text-xs text-slate-400">
                  {t.brandTagline}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal max-w-sm">
              Empowering farmers with transparent procurement schedules, live token queue tracking, instant crop quality verification, and direct-to-bank payment transparency.
            </p>

            {/* Helpline Box */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>Kisan Mandi Helpline (Toll-Free)</span>
              </div>
              <div className="text-lg font-bold text-white tracking-tight">
                1800-180-1551
              </div>
              <div className="text-[10px] text-slate-400">
                Available 24/7 in English, বাংলা & हिन्दी
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Procurement Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/schedule" className="hover:text-emerald-400 transition-colors">
                  Procurement Schedule
                </Link>
              </li>
              <li>
                <Link to="/queue" className="hover:text-emerald-400 transition-colors">
                  Live Queue Board
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-emerald-400 transition-colors">
                  Procurement Centers Map
                </Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-emerald-400 transition-colors">
                  Crop Lab & Moisture Test
                </Link>
              </li>
              <li>
                <Link to="/payments" className="hover:text-emerald-400 transition-colors">
                  PFMS Payment Tracker
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Digital Mandi Gate Pass
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Portals & Roles
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Farmer Portal Login
                </Link>
              </li>
              <li>
                <Link to="/officer" className="hover:text-emerald-400 transition-colors">
                  Mandi Officer Console (Haripur)
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-emerald-400 transition-colors">
                  State Procurement Analytics
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="hover:text-emerald-400 transition-colors">
                  SMS / WhatsApp Alerts
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  New Farmer Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Language & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Language / ভাষা / भाषा
            </h4>
            <div className="flex flex-col gap-1.5">
              {(['en', 'bn', 'hi'] as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                    language === lang
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{lang === 'en' ? 'English' : lang === 'bn' ? 'বাংলা (Bengali)' : 'हिन्दी (Hindi)'}</span>
                  {language === lang && <span>✓</span>}
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-1 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>CACP & APMC Compliant</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 {t.brandName}. Professional Agricultural Procurement Intelligence. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
            <a href="#security" className="hover:text-slate-300 transition-colors">
              Security Standards
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
