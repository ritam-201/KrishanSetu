import React, { useState } from 'react';
import {
  UserCheck,
  Scale,
  Microscope,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Radio,
  FileCheck,
  Building2,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const OfficerDashboard: React.FC = () => {
  const {
    user,
    centers,
    currentCenterId,
    setCurrentCenterId,
    queueTokens,
    callNextToken,
    qualityReport,
    updateQualityReport,
    milestones
  } = useAuth();

  const activeCenter = centers.find(c => c.id === currentCenterId) || centers[0];
  const currentToken = queueTokens.find(t => t.status === 'processing') || queueTokens[2];

  // Officer interactive form states
  const [moistureInput, setMoistureInput] = useState<number>(qualityReport.moisturePercent || 12.8);
  const [foreignMatterInput, setForeignMatterInput] = useState<number>(qualityReport.foreignMatterPercent || 0.6);
  const [officerNotes, setOfficerNotes] = useState<string>('Good quality golden grain. Moisture within standard limit.');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSaveInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const isGradeA = moistureInput <= 14.0 && foreignMatterInput <= 1.0;
    updateQualityReport({
      moisturePercent: Number(moistureInput),
      foreignMatterPercent: Number(foreignMatterInput),
      grade: isGradeA ? 'Grade A' : 'Grade B',
      notes: officerNotes
    });
    setSuccessMsg('Grain inspection certified successfully and transmitted to PFMS treasury pipeline.');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="min-h-screen py-8 bg-[#FCFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Officer Top Bar */}
        <div className="bg-[#123D24] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#256035] mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1B4D2A] border-2 border-[#8EB773] flex items-center justify-center font-serif text-2xl font-bold text-white shadow-md shrink-0">
                VS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    Mandi Officer Console
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1B4D2A] text-[#8EB773] text-xs font-bold border border-[#256035]">
                    Officer: {user.role === 'officer' ? user.name : 'Vikramjit Sen'}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  Station: <span className="font-bold text-[#8EB773]">{activeCenter.name}</span> • Weighbridge #1 & QC Lab Active
                </p>
              </div>
            </div>

            {/* Quick Officer Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={callNextToken}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#8EB773] text-[#123D24] text-xs sm:text-sm font-black hover:bg-[#B7D2A2] transition-colors shadow-lg active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Call Next Token (#{(currentToken?.tokenNumber || 23) + 1})</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#256035] text-xs">
            <div className="bg-[#1B4D2A] p-3 rounded-xl border border-[#256035]">
              <span className="text-[10px] text-gray-400 uppercase">Today's Target</span>
              <div className="font-serif text-lg font-bold text-white mt-0.5">500.0 Qtl</div>
            </div>
            <div className="bg-[#1B4D2A] p-3 rounded-xl border border-[#256035]">
              <span className="text-[10px] text-gray-400 uppercase">Procured Today</span>
              <div className="font-serif text-lg font-bold text-[#8EB773] mt-0.5">385.0 Qtl (77%)</div>
            </div>
            <div className="bg-[#1B4D2A] p-3 rounded-xl border border-[#256035]">
              <span className="text-[10px] text-gray-400 uppercase">In Yard Queue</span>
              <div className="font-serif text-lg font-bold text-[#D99A32] mt-0.5">{activeCenter.totalQueueWaiting} Vehicles</div>
            </div>
            <div className="bg-[#1B4D2A] p-3 rounded-xl border border-[#256035]">
              <span className="text-[10px] text-gray-400 uppercase">J-Forms Issued</span>
              <div className="font-serif text-lg font-bold text-white mt-0.5">18 Certs</div>
            </div>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-[#E8EFE1] border border-[#3F7442] text-xs text-[#1B4D2A] flex items-center justify-between animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#3F8F55]" />
              <span className="font-bold">{successMsg}</span>
            </div>
          </div>
        )}

        {/* 2-Column Action Zone */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 6 Cols - Active Token Inspection Form */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Active Farmer In Bay Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8EFE1] text-[#1B4D2A] flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-[#3F7442]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#123D24]">
                      Active Farmer At Station
                    </h2>
                    <p className="text-xs text-gray-500">Token #{currentToken?.tokenNumber || 23} • Gate RFID Scanned</p>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-[#D99A32]">
                  ● AT WEIGHBRIDGE
                </span>
              </div>

              {/* Farmer Bio */}
              <div className="bg-[#FCFBF7] p-4 rounded-2xl border border-[#E8EFE1] space-y-2 text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Farmer Name:</span>
                  <span className="font-bold text-[#123D24] text-sm">{currentToken?.farmerName || 'Registered Farmer'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Village / Aadhaar:</span>
                  <span className="font-medium text-gray-700">{currentToken?.village || 'Haripur Paschim'} (Aadhaar Verified)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Declared Crop:</span>
                  <span className="font-bold text-[#3F7442]">{currentToken?.crop || 'Rice / Paddy'} • {currentToken?.quantityQuintals || 25} Qtl</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transport:</span>
                  <span className="font-mono text-gray-700">Tractor WB-15-4421</span>
                </div>
              </div>

              {/* Moisture & Lab Certification Form */}
              <form onSubmit={handleSaveInspection} className="space-y-4">
                <div className="font-serif text-sm font-bold text-[#123D24] pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Microscope className="w-4 h-4 text-[#3F7442]" />
                  <span>QC Lab Inspection Form</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Moisture Reading (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="5"
                      max="30"
                      value={moistureInput}
                      onChange={(e) => setMoistureInput(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#D3E0C9] text-sm font-bold text-[#123D24] focus:ring-2 focus:ring-[#3F7442]"
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5 block">Standard limit: &lt; 14.0%</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Foreign Matter (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={foreignMatterInput}
                      onChange={(e) => setForeignMatterInput(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#D3E0C9] text-sm font-bold text-[#123D24] focus:ring-2 focus:ring-[#3F7442]"
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5 block">Standard limit: &lt; 1.0%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Officer Quality Certification Notes
                  </label>
                  <textarea
                    rows={2}
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D3E0C9] text-xs font-medium text-gray-700 focus:ring-2 focus:ring-[#3F7442]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#123D24] hover:bg-[#1B4D2A] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <FileCheck className="w-4 h-4 text-[#8EB773]" />
                  <span>Certify Lab Inspection & Issue J-Form</span>
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: 6 Cols - Live Queue Control Roster */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EFE1] shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#123D24]">
                    Yard Token Queue Control
                  </h3>
                  <p className="text-xs text-gray-500">Manage gate priority and weighbridge dispatch</p>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E8EFE1] text-[#1B4D2A]">
                  {queueTokens.length} Tokens
                </span>
              </div>

              <div className="space-y-3">
                {queueTokens.map((t) => (
                  <div
                    key={t.tokenNumber}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                      t.status === 'processing'
                        ? 'bg-[#F3F7EF] border-[#8EB773]'
                        : t.status === 'next'
                        ? 'bg-white border-[#E8EFE1]'
                        : 'bg-[#FCFBF7] border-gray-100 opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-black text-sm text-[#123D24]">
                          #{t.tokenNumber}
                        </span>
                        <span className="font-bold text-gray-800">{t.farmerName}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {t.crop.split('/')[0]} • {t.quantityQuintals} Qtl • {t.village}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'completed'
                            ? 'bg-[#E8EFE1] text-[#3F8F55]'
                            : t.status === 'processing'
                            ? 'bg-amber-100 text-[#D99A32]'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
