import React from "react";
import {
  CalendarCheck,
  Navigation,
  Users2,
  Banknote,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProblemSolution: React.FC = () => {
  const { t } = useAuth();

  const cards = [
    {
      icon: CalendarCheck,
      number: "01",
      title: t.prob1Title,
      desc: t.prob1Desc,
      link: "/schedule",
      cta: "View Schedules",
    },
    {
      icon: Navigation,
      number: "02",
      title: t.prob2Title,
      desc: t.prob2Desc,
      link: "/centers",
      cta: "Find Centers",
    },
    {
      icon: Users2,
      number: "03",
      title: t.prob3Title,
      desc: t.prob3Desc,
      link: "/queue",
      cta: "Track Live Queue",
    },
    {
      icon: Banknote,
      number: "04",
      title: t.prob4Title,
      desc: t.prob4Desc,
      link: "/payments",
      cta: "Check Payment",
    },
  ];

  return (
    <section
      id="procurement-problems"
      className="relative overflow-hidden bg-white py-16 sm:py-20"
    >
      {/* Background decoration */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-lime-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Clearing Uncertainty
          </div>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            {t.problemHeading}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            {t.problemSubheading}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, idx) => {
            const Icon = card.icon;

            return (
              <div
                key={idx}
                className="
                  group relative overflow-hidden
                  rounded-2xl border border-slate-200
                  bg-white p-5
                  shadow-[0_6px_25px_rgba(15,23,42,0.04)]
                  transition-all duration-300
                  hover:-translate-y-2
                  hover:border-emerald-200
                  hover:shadow-[0_18px_40px_rgba(16,185,129,0.12)]
                "
              >
                {/* Hover gradient */}
                <div
                  className="
                    absolute inset-x-0 top-0 h-1
                    bg-gradient-to-r from-emerald-400 via-green-500 to-lime-400
                    opacity-0 transition-opacity duration-300
                    group-hover:opacity-100
                  "
                />

                {/* Soft hover glow */}
                <div
                  className="
                    absolute -right-12 -top-12
                    h-28 w-28 rounded-full
                    bg-emerald-100/50 blur-2xl
                    opacity-0 transition-opacity duration-300
                    group-hover:opacity-100
                  "
                />

                <div className="relative">
                  {/* Icon + Number */}
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className="
                        flex h-10 w-10 items-center justify-center
                        rounded-xl bg-emerald-50
                        text-emerald-600
                        transition-all duration-300
                        group-hover:bg-emerald-600
                        group-hover:text-white
                        group-hover:scale-105
                      "
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span
                      className="
                        text-sm font-bold tracking-wider
                        text-slate-200
                        transition-colors duration-300
                        group-hover:text-emerald-500
                      "
                    >
                      {card.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3
                    className="
                      mb-2 text-base font-bold leading-snug
                      text-slate-900
                      transition-colors duration-300
                      group-hover:text-emerald-700
                    "
                  >
                    {card.title}
                  </h3>

                  <p className="mb-5 text-xs leading-5 text-slate-500">
                    {card.desc}
                  </p>

                  {/* CTA */}
                  <Link
                    to={card.link}
                    className="
                      inline-flex items-center gap-1.5
                      text-xs font-bold text-emerald-600
                      transition-all duration-300
                      hover:text-emerald-800
                      group-hover:gap-2
                    "
                  >
                    <span>{card.cta}</span>

                    <ArrowUpRight
                      className="
                        h-3.5 w-3.5
                        transition-transform duration-300
                        group-hover:translate-x-0.5
                        group-hover:-translate-y-0.5
                      "
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          One platform. Four simple solutions.
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>
    </section>
  );
};

