import React from 'react';
import { QueueToken, PaymentTransaction } from '../types';
import {
  Printer,
  CheckCircle2,
  X,
  ShieldCheck,
  QrCode,
  MapPin,
  User,
  Wheat,
  IndianRupee,
  Landmark,
  CalendarDays,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ReceiptModalProps {
  token?: QueueToken;
  payment?: PaymentTransaction;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  token,
  payment,
  onClose,
}) => {
  const { user } = useAuth();

  // Print receipt
  const handlePrint = () => {
    window.print();
  };

  /*
   * IMPORTANT:
   * Always use the currently logged-in user's information
   * for farmer identity.
   *
   * This prevents a token/payment containing another farmer's
   * name (for example "Shubhash") from replacing the logged-in
   * farmer's name ("Guji").
   */
  const farmerName = user?.name || 'Farmer Account';

  const farmerId =
    user?.id ||
    token?.farmerId ||
    'KSETU-FARMER';

  const village = user?.village || '—';

  const district = user?.district || '—';

  const landAcres = user?.landAcres || '—';

  const bankName =
    user?.bankName || 'Registered Bank Account';

  const bankLast4 = user?.bankAccountLast4
    ? `•••• ${user.bankAccountLast4}`
    : '••••';

  // Token information
  const tokenCode =
    token?.tokenCode ||
    `HAR-${String(payment?.tokenNumber || 24).padStart(3, '0')}`;

  // Crop information
  const crop =
    token?.crop ||
    payment?.crop ||
    'Rice / Paddy';

  // Weight
  const weight =
    token?.weighbridgeWeightQuintals ||
    payment?.grossWeightQuintals ||
    0;

  // MSP
  const mspRate =
    payment?.mspRatePerQuintal ||
    2203;

  // Payment amount
  const grossVal =
    payment?.grossAmount ||
    Math.round(weight * mspRate);

  // PFMS reference
  const pfmsRef =
    payment?.pfmsReferenceNo ||
    'PFMS-PENDING';

  // Receipt number
  const receiptNumber = `KSETU-${String(
    token?.tokenNumber ||
      payment?.tokenNumber ||
      '024'
  ).padStart(3, '0')}`;

  // Current date
  const receiptDate = new Date().toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">

      {/* ================= MAIN MODAL ================= */}
      <div className="bg-white rounded-[28px] max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">

        {/* ================= TOP HEADER ================= */}
        <div className="bg-slate-950 text-white px-6 sm:px-8 py-5 flex items-center justify-between no-print">

          {/* Logo + Title */}
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            <div>
              <p className="font-bold text-sm">
                Digital Mandi Receipt
              </p>

              <p className="text-[11px] text-slate-400">
                KisanSetu • Secure Procurement
              </p>
            </div>

          </div>

          {/* Header Buttons */}
          <div className="flex items-center gap-2">

            {/* Print */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Close receipt"
            >
              <X className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* ================= RECEIPT BODY ================= */}
        <div className="p-6 sm:p-9 text-slate-900 print:p-0">

          {/* ================= GOVERNMENT HEADER ================= */}
          <div className="text-center pb-6 border-b border-dashed border-slate-300">

            {/* Logo */}
            <div className="flex justify-center mb-3">

              <div className="relative">

                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="text-white text-xl font-black">
                    KS
                  </span>
                </div>

                <div className="absolute -right-1 -bottom-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>

              </div>

            </div>

            <h1 className="text-lg sm:text-xl font-black tracking-tight uppercase">
              Department of Agriculture
            </h1>

            <p className="text-sm font-semibold text-slate-600">
              Agricultural Marketing & Procurement Division
            </p>

            <p className="text-xs text-slate-400 mt-1">
              State Agricultural Procurement Portal — KisanSetu
            </p>

            {/* Verification Badge */}
            <div className="flex justify-center mt-4">

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] sm:text-[11px] font-black text-emerald-700 uppercase tracking-widest">

                <CheckCircle2 className="w-3.5 h-3.5" />

                Digitally Verified

              </span>

            </div>

          </div>

          {/* ================= RECEIPT META ================= */}
          <div className="grid grid-cols-2 gap-3 mt-6">

            {/* Receipt Number */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">

              <div className="flex items-center gap-2 text-slate-400 mb-1">

                <FileCheck2 className="w-3.5 h-3.5" />

                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Receipt No.
                </span>

              </div>

              <p className="font-bold text-sm text-slate-800">
                {receiptNumber}
              </p>

            </div>

            {/* Date */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">

              <div className="flex items-center gap-2 text-slate-400 mb-1">

                <CalendarDays className="w-3.5 h-3.5" />

                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Generated
                </span>

              </div>

              <p className="font-bold text-sm text-slate-800">
                {receiptDate}
              </p>

            </div>

          </div>

          {/* ================= TOKEN CARD ================= */}
          <div className="mt-5 rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 text-white p-5 sm:p-6 overflow-hidden relative">

            {/* Decorative circles */}
            <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-emerald-500/10" />

            <div className="absolute -right-20 -bottom-20 w-48 h-48 rounded-full bg-emerald-500/5" />

            <div className="relative flex items-center justify-between gap-4">

              {/* Token Information */}
              <div>

                <div className="flex items-center gap-2 mb-2">

                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.18em]">
                    Mandi Token
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/20 text-[9px] font-bold text-emerald-300">
                    ACTIVE
                  </span>

                </div>

                <p className="text-3xl sm:text-4xl font-black font-mono tracking-wider">
                  {tokenCode}
                </p>

                <div className="flex items-center gap-1.5 mt-2 text-slate-400 text-xs">

                  <MapPin className="w-3.5 h-3.5" />

                  Haripur Mandi Hub #04

                </div>

              </div>

              {/* QR Code */}
              <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2.5 shadow-xl flex items-center justify-center">

                <QrCode className="w-full h-full text-slate-900" />

              </div>

            </div>
          </div>

          {/* ================= FARMER INFORMATION ================= */}
          <div className="mt-6">

            <div className="flex items-center gap-2 mb-3">

              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">

                <User className="w-3.5 h-3.5 text-emerald-700" />

              </div>

              <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">
                Farmer Information
              </h3>

            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden">

              <div className="grid grid-cols-1 sm:grid-cols-2">

                <InfoItem
                  label="Farmer Name"
                  value={farmerName}
                  highlight
                />

                <InfoItem
                  label="Registration ID"
                  value={farmerId}
                  mono
                />

                <InfoItem
                  label="Village"
                  value={village}
                />

                <InfoItem
                  label="District"
                  value={district}
                />

                <InfoItem
                  label="Registered Land"
                  value={`${landAcres} Acres`}
                />

                <InfoItem
                  label="Bank Account"
                  value={`${bankName} • ${bankLast4}`}
                />

              </div>

            </div>

          </div>

          {/* ================= PROCUREMENT DETAILS ================= */}
          <div className="mt-6">

            <div className="flex items-center gap-2 mb-3">

              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">

                <Wheat className="w-3.5 h-3.5 text-amber-700" />

              </div>

              <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">
                Procurement Details
              </h3>

            </div>

            <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100">

              <DetailRow
                label="Crop & Variety"
                value={`${crop} • Swarna Grade A`}
              />

              <DetailRow
                label="Net Weight Certified"
                value={`${weight} Quintals`}
                valueClass="text-emerald-700"
                bold
              />

              <DetailRow
                label="Government MSP Benchmark"
                value={`₹${mspRate.toLocaleString('en-IN')} / Quintal`}
              />

              <DetailRow
                label="PFMS Treasury Reference"
                value={pfmsRef}
                mono
              />

            </div>

          </div>

          {/* ================= PAYMENT SUMMARY ================= */}
          <div className="mt-6">

            <div className="flex items-center gap-2 mb-3">

              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">

                <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />

              </div>

              <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">
                Payment Summary
              </h3>

            </div>

            <div className="rounded-2xl bg-linear-to-br from-emerald-700 to-emerald-800 p-5 text-white shadow-lg shadow-emerald-800/15">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-200">
                    Total Approved Direct Benefit
                  </p>

                  <p className="text-3xl sm:text-4xl font-black mt-1">
                    ₹{grossVal.toLocaleString('en-IN')}
                  </p>

                  <p className="text-xs text-emerald-200 mt-1">
                    Calculated against certified procurement quantity
                  </p>

                </div>

                <div className="shrink-0">

                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">

                    <Landmark className="w-6 h-6 text-emerald-100" />

                  </div>

                </div>

              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">

                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-200">
                  Payment Status
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-wider text-white">

                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />

                  DBT Cleared

                </span>

              </div>

            </div>

          </div>

          {/* ================= AUTHENTICATION ================= */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">

            <div className="flex items-start gap-3">

              <div className="w-9 h-9 shrink-0 rounded-xl bg-emerald-100 flex items-center justify-center">

                <ShieldCheck className="w-4 h-4 text-emerald-700" />

              </div>

              <div>

                <p className="text-xs font-bold text-slate-800">
                  Digitally Authenticated
                </p>

                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                  This receipt has been generated through the
                  KisanSetu digital mandi system. The transaction
                  details are electronically recorded and verified.
                </p>

              </div>

            </div>

          </div>

          {/* ================= BACK + PRINT BUTTONS ================= */}
          <div className="mt-6 pt-5 border-t border-slate-200 no-print">

            <div className="flex flex-col-reverse sm:flex-row gap-3">

              {/* BACK BUTTON */}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <X className="w-4 h-4" />

                Back
              </button>

              {/* PRINT BUTTON */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 h-12 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-950/15"
              >
                <Printer className="w-4 h-4" />

                Print Receipt
              </button>

            </div>

          </div>

          {/* ================= FOOTER ================= */}
          <div className="text-center pt-5">

            <p className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700">

              <CheckCircle2 className="w-3.5 h-3.5" />

              System Generated • No Physical Signature Required

            </p>

            <p className="text-[10px] text-slate-400 mt-1">
              KisanSetu Digital Procurement Platform
            </p>

          </div>

        </div>
      </div>

      {/* ================= PRINT CSS ================= */}
      <style>
        {`
          @media print {

            body {
              background: white !important;
            }

            .no-print {
              display: none !important;
            }

            @page {
              size: A4;
              margin: 12mm;
            }

          }
        `}
      </style>

    </div>
  );
};


/* =========================================================
   FARMER INFORMATION COMPONENT
========================================================= */

interface InfoItemProps {
  label: string;
  value: string | number;
  mono?: boolean;
  highlight?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  mono = false,
  highlight = false,
}) => {
  return (
    <div className="p-4 border-b sm:border-r border-slate-100">

      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
        {label}
      </p>

      <p
        className={`
          mt-1.5 text-sm
          ${
            highlight
              ? 'font-black text-emerald-700'
              : 'font-semibold text-slate-800'
          }
          ${mono ? 'font-mono text-xs' : ''}
        `}
      >
        {value}
      </p>

    </div>
  );
};


/* =========================================================
   PROCUREMENT DETAIL COMPONENT
========================================================= */

interface DetailRowProps {
  label: string;
  value: string | number;
  mono?: boolean;
  bold?: boolean;
  valueClass?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  mono = false,
  bold = false,
  valueClass = 'text-slate-800',
}) => {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">

      <span className="text-xs text-slate-500 font-medium">
        {label}
      </span>

      <span
        className={`
          text-xs text-right
          ${bold ? 'font-black' : 'font-semibold'}
          ${valueClass}
          ${mono ? 'font-mono' : ''}
        `}
      >
        {value}
      </span>

    </div>
  );
};