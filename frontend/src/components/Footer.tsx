import React from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { LanguageCode } from "../types";

export const Footer: React.FC = () => {
  const { t, language, setLanguage } = useAuth();

  return (
    <footer
      id="main-footer"
      className="
        relative overflow-hidden
        border-t border-emerald-900/20
        text-white
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="
          absolute inset-0
          bg-cover bg-center
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=90')",
        }}
      />

      {/* Dark premium overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-950/95 via-green-950/92 to-slate-950/95" />

      {/* Soft glow */}
      <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-green-400/10 blur-3xl" />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">

        {/* =================================================
            MAIN COMPACT ROW
        ================================================== */}

        <div className="flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between">

          {/* BRAND */}
          <div className="flex items-center gap-3">

            {/* Logo */}
            <div
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-xl
                bg-linear-to-br
                from-emerald-400
                via-green-500
                to-teal-600
                shadow-[0_8px_25px_rgba(16,185,129,0.25)]
              "
            >
              <Sprout className="h-5 w-5 text-white" />
            </div>

            <div>
              <div className="flex items-center">
                <span className="text-lg font-black tracking-tight text-white">
                  KISAN
                </span>

                <span className="text-lg font-black tracking-tight text-emerald-400">
                  SETU
                </span>
              </div>

              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-emerald-200/60">
                {t.brandTagline}
              </p>
            </div>

            {/* Vertical divider */}
            <div className="mx-2 hidden h-8 w-px bg-white/10 sm:block" />

            {/* Short description */}
            <p className="hidden max-w-[280px] text-[10px] leading-relaxed text-emerald-100/55 xl:block">
              Smarter agricultural procurement, transparent mandi operations,
              and better opportunities for farmers.
            </p>
          </div>

          {/* HELPLINE */}
          <div
            className="
              flex items-center gap-3
              rounded-2xl
              border border-white/10
              bg-white/[0.07]
              px-4 py-2.5
              backdrop-blur-md
            "
          >
            <div
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-xl
                bg-emerald-400/15
              "
            >
              <Phone className="h-3.5 w-3.5 text-emerald-300" />
            </div>

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-300/70">
                Kisan Mandi Helpline
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wide text-white">
                  1800-180-1551
                </span>

                <span className="hidden text-[8px] text-white/40 sm:inline">
                  24/7
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            LINKS + LANGUAGE
        ================================================== */}

        <div
          className="
            flex flex-col
            gap-5
            border-y border-white/10
            py-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          {/* Procurement Links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-300/60">
              Procurement
            </span>

            <Link
              to="/schedule"
              className="
                text-[10px] font-semibold text-white/60
                transition-colors hover:text-emerald-300
              "
            >
              Schedule
            </Link>

            <Link
              to="/queue"
              className="
                text-[10px] font-semibold text-white/60
                transition-colors hover:text-emerald-300
              "
            >
              Live Queue
            </Link>

            <Link
              to="/status"
              className="
                text-[10px] font-semibold text-white/60
                transition-colors hover:text-emerald-300
              "
            >
              Crop Status
            </Link>

            <Link
              to="/payments"
              className="
                text-[10px] font-semibold text-white/60
                transition-colors hover:text-emerald-300
              "
            >
              Payments
            </Link>
          </div>

          {/* Portal Links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-300/60">
              Portals
            </span>

            <Link
              to="/login"
              className="
                text-[10px] font-semibold text-white/60
                transition-colors hover:text-emerald-300
              "
            >
              Farmer Login
            </Link>

            <Link
              to="/register"
              className="
                text-[10px] font-semibold text-white/60
                transition-colors hover:text-emerald-300
              "
            >
              Register
            </Link>

            <Link
              to="/officer"
              className="
                text-[10px] font-semibold text-white/60
                transition-colors hover:text-emerald-300
              "
            >
              Officer
            </Link>

            <Link
              to="/admin"
              className="
                text-[10px] font-semibold text-white/60
                transition-colors hover:text-emerald-300
              "
            >
              Admin
            </Link>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-1.5">
            <span className="mr-1 text-[8px] font-black uppercase tracking-[0.16em] text-emerald-300/60">
              Language
            </span>

            {(["en", "bn", "hi"] as LanguageCode[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`
                  flex items-center gap-1
                  rounded-lg
                  px-2.5 py-1.5
                  text-[9px]
                  font-bold
                  transition-all
                  ${
                    language === lang
                      ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20"
                      : "text-white/45 hover:bg-white/5 hover:text-white/80"
                  }
                `}
              >
                {lang === "en"
                  ? "EN"
                  : lang === "bn"
                  ? "বাং"
                  : "हि"}

                {language === lang && (
                  <CheckCircle2 className="h-2.5 w-2.5" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* =================================================
            BOTTOM BAR
        ================================================== */}

        <div
          className="
            flex flex-col
            gap-3
            py-4
            text-[9px]
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Copyright */}
          <div className="text-white/40">
            © 2026{" "}
            <span className="font-bold text-white/60">
              {t.brandName}
            </span>
            . Professional Agricultural Procurement Intelligence.
          </div>

          {/* Trust + Legal */}
          <div className="flex flex-wrap items-center gap-4">

            {/* Trust */}
            <div className="flex items-center gap-1.5 text-emerald-300/70">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="font-semibold">
                CACP & APMC Aligned
              </span>
            </div>

            <span className="h-3 w-px bg-white/10" />

            <a
              href="#privacy"
              className="text-white/40 transition-colors hover:text-white/80"
            >
              Privacy
            </a>

            <a
              href="#terms"
              className="text-white/40 transition-colors hover:text-white/80"
            >
              Terms
            </a>

            <a
              href="#security"
              className="flex items-center gap-1 text-white/40 transition-colors hover:text-white/80"
            >
              Security
              <ChevronRight className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};