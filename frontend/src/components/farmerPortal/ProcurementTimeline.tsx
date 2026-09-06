import React from 'react';
import { CheckCircle2, Clock, CircleDot, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProcurementTimeline: React.FC = () => {
  const { milestones, isAuthenticated, user } = useAuth();

  return (
    <section id="procurement-status-timeline" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
            COMPLETE AUDIT TRAIL
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Track Every Step From Crop to Payment
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            Zero ambiguity. Transparent milestones monitored by the State Agricultural Department and visible in your portal.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 max-w-4xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-3">
            <div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Harvest Procurement Batch #2026-HG04-024
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                {isAuthenticated && user.name ? `Farmer: ${user.name} • Paddy (Grade A)` : 'Farmer Batch • Paddy (Grade A)'}
              </h3>
            </div>

            <Link
              to="/status"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-lg border border-emerald-100 transition-colors self-start sm:self-auto"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Lab & Weight Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-5 relative before:absolute before:inset-0 before:left-4 sm:before:left-5 before:w-0.5 before:bg-slate-200 before:h-[90%] before:top-3">
            {milestones.map((item, idx) => {
              const isDone = item.status === 'completed';
              const isInProgress = item.status === 'in_progress';
              const isPending = item.status === 'pending';

              return (
                <div key={idx} className="relative flex items-start gap-4 sm:gap-6 group">
                  
                  {/* Status Node Icon */}
                  <div className="z-10 mt-0.5">
                    {isDone ? (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-white shadow-2xs">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : isInProgress ? (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                        <CircleDot className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border-2 border-white">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div
                    className={`flex-1 p-4 rounded-xl border transition-all ${
                      isInProgress
                        ? 'bg-emerald-50/50 border-emerald-200 shadow-2xs'
                        : isDone
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-50/50 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4
                        className={`text-sm sm:text-base font-bold ${
                          isInProgress
                            ? 'text-emerald-900'
                            : isDone
                            ? 'text-slate-900'
                            : 'text-slate-500'
                        }`}
                      >
                        {item.label}
                      </h4>

                      <span className="text-[11px] font-mono text-slate-400 font-medium">
                        {item.timestamp || 'Pending Verification'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.description}
                    </p>

                    {isInProgress && (
                      <div className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                        <span>Active Stage: Weighbridge vehicle tare weight computation</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
