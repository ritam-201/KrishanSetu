import React from "react";
import {
  UserCheck,
  Wheat,
  CalendarClock,
  Radio,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const HowItWorks: React.FC = () => {
  const { t } = useAuth();

  const steps = [
    {
      num: "01",
      title: t.step1Title,
      desc: t.step1Desc,
      icon: UserCheck,
    },
    {
      num: "02",
      title: t.step2Title,
      desc: t.step2Desc,
      icon: Wheat,
    },
    {
      num: "03",
      title: t.step3Title,
      desc: t.step3Desc,
      icon: CalendarClock,
    },
    {
      num: "04",
      title: t.step4Title,
      desc: t.step4Desc,
      icon: Radio,
    },
    {
      num: "05",
      title: t.step5Title,
      desc: t.step5Desc,
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white py-20 sm:py-24"
    >
      {/* Background decoration */}
      <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-lime-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
            Simple. Smart. Connected.
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {t.hiwHeading}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            {t.hiwSubheading}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop connecting line */}
          <div className="absolute left-[10%] right-[10%] top-[42px] hidden h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent lg:block" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <div key={step.num} className="group relative">
                  {/* Step number */}
                  <div className="relative z-10 mx-auto mb-7 flex h-[84px] w-[84px] items-center justify-center rounded-full border-8 border-white bg-emerald-50 shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-600">
                    <Icon className="h-7 w-7 text-emerald-600 transition-colors duration-300 group-hover:text-white" />

                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-[10px] font-bold text-white">
                      {step.num}
                    </span>
                  </div>

                  {/* Card */}
                  <div
  className="
    relative rounded-2xl border border-slate-200
    bg-white p-4
    shadow-[0_6px_24px_rgba(15,23,42,0.04)]
    transition-all duration-300
    group-hover:-translate-y-1.5
    group-hover:border-emerald-200
    group-hover:shadow-[0_16px_35px_rgba(16,185,129,0.10)]
  "
>
                  
                    {/* Top accent */}
                    <div className="absolute left-6 right-6 top-0 h-1 rounded-b-full bg-gradient-to-r from-emerald-400 to-lime-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-600">
                        Step {step.num}
                      </span>

                      <ArrowRight className="h-4 w-4 -translate-x-1 text-slate-300 transition-all duration-300 group-hover:translate-x-0 group-hover:text-emerald-500" />
                    </div>

                    <h3 className="mb-3 text-lg font-bold leading-snug text-slate-900">
                      {step.title}
                    </h3>

                    <p className="text-sm leading-6 text-slate-500">
                      {step.desc}
                    </p>

                    {/* Verified footer */}
                    <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      </div>

                      <span className="text-[11px] font-semibold text-slate-500">
                        Verified workflow
                      </span>
                    </div>
                  </div>

                  {/* Mobile connector */}
                  {idx !== steps.length - 1 && (
                    <div className="mx-auto my-2 h-6 w-px bg-emerald-200 sm:hidden" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-center">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Easy to use
          </div>

          <div className="hidden h-4 w-px bg-slate-300 sm:block" />

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Real-time updates
          </div>

          <div className="hidden h-4 w-px bg-slate-300 sm:block" />

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Farmer focused
          </div>
        </div>
      </div>
    </section>
  );
};

