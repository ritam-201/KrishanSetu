import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calculator,
  Receipt,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CropType } from '../../types';

export const PaymentTrackingSection: React.FC = () => {
  const { t, payments } = useAuth();
  const activePayment = payments[0];

  // Interactive MSP Calculator state
  const [calcCrop, setCalcCrop] = useState<CropType>('Rice / Paddy');
  const [calcQuantity, setCalcQuantity] = useState<number>(25);

  const mspRates: Record<CropType, number> = {
    'Rice / Paddy': 2203,
    'Wheat': 2275,
    'Mustard': 5650,
    'Maize': 2090,
    'Bengal Gram (Chana)': 5440,
    'Cotton': 7020
  };

  const calculatedTotal = Math.round(calcQuantity * (mspRates[calcCrop] || 2203));

  return (
    <section id="payment-tracking-section" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
            DIRECT TO BANK (DBT)
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {t.paymentSectionHeading}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            {t.paymentSectionSubheading}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Active Expected Payment Card & Traceability */}
          <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider block">
                      {t.paymentExpected}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Ref: {activePayment?.pfmsReferenceNo || 'PFMS/WB/2026/08/998124'}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold border border-emerald-800 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  PFMS Processing
                </span>
              </div>

              {/* Huge Payment Total */}
              <div className="my-6">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  ₹{activePayment?.netPayable.toLocaleString('en-IN') || '55,075'}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Guaranteed Government Procurement Value for 25.0 Qtl @ ₹2,203/Qtl MSP Rate
                </p>
              </div>

              {/* Data Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 mb-6">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Crop</div>
                  <div className="text-xs font-bold text-white mt-0.5">Rice / Paddy</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Quantity</div>
                  <div className="text-xs font-bold text-white mt-0.5">25.0 Quintals</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Aadhaar Bank</div>
                  <div className="text-xs font-bold text-white mt-0.5">SBI •••• 4821</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Target Date</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">30 Aug 2026</div>
                </div>
              </div>

              {/* Multi-step DBT Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>DBT Pipeline Clearance</span>
                  <span>Step 4 of 5 (80%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full w-4/5" />
                </div>
                <div className="grid grid-cols-5 text-[9px] text-slate-400 pt-1 text-center font-medium">
                  <span>Procured</span>
                  <span>Certified</span>
                  <span>Approved</span>
                  <span className="text-emerald-300 font-bold">PFMS</span>
                  <span className="text-slate-500">Bank Credit</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Commission • Public Financial Management System</span>
              </span>

              <Link
                to="/payments"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>View Full Statement →</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Live Government MSP Price Estimator */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Official MSP Rate Calculator
                  </h3>
                  <p className="text-xs text-slate-500">Calculate harvest earnings before booking</p>
                </div>
              </div>

              {/* Crop Selector */}
              <div className="space-y-4 my-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Crop Type
                  </label>
                  <select
                    value={calcCrop}
                    onChange={(e) => setCalcCrop(e.target.value as CropType)}
                    className="w-full p-2.5 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {Object.keys(mspRates).map((c) => (
                      <option key={c} value={c}>
                        {c} (MSP: ₹{mspRates[c as CropType]}/Quintal)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <span>Estimated Quantity (Quintals)</span>
                    <span className="text-emerald-600 font-bold text-sm">{calcQuantity} Qtl ({calcQuantity * 100} kg)</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="1"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>5 Qtl (0.5 Ton)</span>
                    <span>100 Qtl (10 Ton)</span>
                    <span>200 Qtl (20 Ton)</span>
                  </div>
                </div>

                {/* Calculation Output Box */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs text-center">
                  <span className="text-xs text-slate-500 font-medium">Estimated Direct Bank Credit</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    ₹{calculatedTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                    {calcQuantity} Qtl × ₹{mspRates[calcCrop]}/Qtl MSP
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/schedule"
              className="w-full py-3 rounded-lg bg-emerald-600 text-white text-center text-xs sm:text-sm font-semibold hover:bg-emerald-700 shadow-sm transition-colors block"
            >
              Lock In Slot for ₹{calculatedTotal.toLocaleString('en-IN')} →
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
