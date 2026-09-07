import React from 'react';
import { X, QrCode, Printer, Download, CheckCircle, Wheat, MapPin, Calendar, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { QueueToken } from '../../types';

interface MandiPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  token?: QueueToken;
}

export const MandiPassModal: React.FC<MandiPassModalProps> = ({ isOpen, onClose, token }) => {
  const { user, centers } = useAuth();

  if (!isOpen) return null;

  const displayToken = token || {
    tokenNumber: 24,
    tokenCode: 'HAR-024',
    farmerId: user.id,
    farmerName: user.name,
    farmerPhone: user.phone,
    village: user.village || 'Haripur Paschim',
    crop: 'Rice / Paddy',
    quantityQuintals: 25.0,
    slotTime: '10:00 AM – 11:30 AM',
    status: 'next',
    estimatedWaitMinutes: 18
  };

  const center = centers.find(c => c.id === 'CTR-001') || centers[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header with Slate-900 banner */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌾</span>
              <div>
                <h3 className="text-lg font-bold">Official Mandi Gate Pass</h3>
                <p className="text-[11px] text-emerald-300">Department of Agricultural Marketing & MSP Procurement</p>
              </div>
            </div>
          </div>

          {/* Token Highlight */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-400 uppercase tracking-wider">Assigned Token Number</div>
              <div className="text-3xl font-black text-white">
                #{displayToken.tokenNumber} <span className="text-sm font-mono text-slate-300">({displayToken.tokenCode})</span>
              </div>
            </div>

            <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
              VALID GATE PASS
            </span>
          </div>
        </div>

        {/* Pass Body */}
        <div className="p-6 space-y-4 bg-slate-50">
          
          {/* QR Code & Mandi Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-2xs">
            {/* Stylized QR Code */}
            <div className="w-24 h-24 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center text-white shrink-0">
              <QrCode className="w-16 h-16 text-white" />
              <span className="text-[8px] font-mono text-emerald-300 mt-0.5">GATE-RFID-024</span>
            </div>

            <div className="text-xs space-y-1">
              <div className="text-sm font-bold text-slate-900">
                {center.name}
              </div>
              <p className="text-slate-500 text-[11px] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>{center.address.split(',')[0]}</span>
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold pt-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>RFID Gate Sensor Pre-Approved</span>
              </div>
            </div>
          </div>

          {/* Farmer & Crop Details Table */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block font-medium">Farmer Name</span>
              <span className="font-bold text-slate-900 text-sm">{displayToken.farmerName}</span>
              <span className="text-[10px] text-slate-500 block font-mono">ID: {displayToken.farmerId}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block font-medium">Crop & Declared Weight</span>
              <span className="font-bold text-slate-900 text-sm">{displayToken.crop}</span>
              <span className="text-[10px] text-emerald-600 font-semibold block">{displayToken.quantityQuintals} Quintals (MSP Eligible)</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block font-medium">Slot Time Window</span>
              <span className="font-bold text-slate-900">{displayToken.slotTime}</span>
              <span className="text-[10px] text-slate-500 block">Date: 28 Aug 2026</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block font-medium">Estimated MSP Payout</span>
              <span className="font-bold text-emerald-600 text-sm">
                ₹{(displayToken.quantityQuintals * 2203).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 block">@ ₹2,203 / Quintal</span>
            </div>
          </div>

          {/* Compliance notice */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Please keep vehicle registration and Aadhaar card handy at the digital weighbridge entry gate.</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Mandi Pass</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
