import React from 'react';
import {
  FileText,
  Microscope,
  Scale,
  CheckCircle2,
  Printer,
  Download,
  ShieldCheck,
  Award,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProcurementStatusPage: React.FC = () => {
  const { qualityReport, milestones, user } = useAuth();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-10 bg-[#FCFBF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFE1] text-[#1B4D2A] text-xs font-bold uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3F8F55]" />
              <span>NABL Accredited Quality & Weighment Report</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D24] tracking-tight">
              Crop Verification & Inspection Status
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Sample #{qualityReport.sampleId} • Batch HG04-024 • Farmer: {user.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F7F5EC] border border-[#D3E0C9] text-xs font-bold text-[#123D24] transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official J-Form</span>
            </button>
          </div>
        </div>

        {/* 2-Column Main Report */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 7 Cols - Lab & Moisture Analysis */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Lab Test Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8EFE1]">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#E8EFE1] text-[#1B4D2A] flex items-center justify-center">
                    <Microscope className="w-6 h-6 text-[#3F7442]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#123D24]">
                      Grain Quality & Moisture Certificate
                    </h2>
                    <p className="text-xs text-gray-500">Tested by Lab Officer: {qualityReport.inspectedBy}</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#E8EFE1] text-[#3F8F55] text-xs font-bold flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>{qualityReport.grade} Certified</span>
                </span>
              </div>

              {/* Moisture Gauge Visualizer */}
              <div className="bg-[#F7F5EC] p-5 rounded-2xl border border-[#E8EFE1] mb-6">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Moisture Reading</span>
                    <div className="font-serif text-3xl sm:text-4xl font-black text-[#123D24]">
                      {qualityReport.moisturePercent}%
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#3F8F55]">Within Safe Threshold</span>
                    <div className="text-[11px] text-gray-500">Max Permissible: {qualityReport.maxPermissibleMoisture}%</div>
                  </div>
                </div>

                {/* Progress bar with safety threshold marker */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
                  <div
                    className="bg-[#3F8F55] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(qualityReport.moisturePercent / 20) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                  <span>0% (Dry)</span>
                  <span>10%</span>
                  <span className="text-[#3F8F55] font-bold">14% (Govt Limit)</span>
                  <span>20% (Wet)</span>
                </div>
              </div>

              {/* Lab Parameters Table */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-[#FCFBF7] border border-[#E8EFE1]">
                  <span className="text-gray-600 font-medium">Foreign Matter / Inert Material:</span>
                  <span className="font-bold text-[#123D24]">{qualityReport.foreignMatterPercent}% (Limit: &lt; {qualityReport.maxPermissibleForeignMatter}%)</span>
                </div>

                <div className="flex justify-between p-3 rounded-xl bg-[#FCFBF7] border border-[#E8EFE1]">
                  <span className="text-gray-600 font-medium">Damaged / Discolored Grains:</span>
                  <span className="font-bold text-[#123D24]">0.8% (Limit: &lt; 2.0%)</span>
                </div>

                <div className="flex justify-between p-3 rounded-xl bg-[#FCFBF7] border border-[#E8EFE1]">
                  <span className="text-gray-600 font-medium">Immature / Shriveled Grains:</span>
                  <span className="font-bold text-[#123D24]">1.1% (Limit: &lt; 3.0%)</span>
                </div>

                <div className="flex justify-between p-3 rounded-xl bg-[#FCFBF7] border border-[#E8EFE1]">
                  <span className="text-gray-600 font-medium">Lab Test Instrument:</span>
                  <span className="font-mono text-[#123D24]">DICKEY-john GAC 2100 Agri Tester</span>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-[#E8EFE1] border border-[#D3E0C9] text-xs text-[#1B4D2A]">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[#3F8F55]" />
                  <span>Quality Officer Recommendation</span>
                </div>
                <p className="text-[11px] text-gray-700">
                  {qualityReport.notes}. Recommended for immediate MSP procurement at full government base rate of ₹2,203/Quintal.
                </p>
              </div>

            </div>

            {/* Weighbridge Slip */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8EFE1]">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8EFE1] text-[#1B4D2A] flex items-center justify-center">
                    <Scale className="w-5 h-5 text-[#3F7442]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#123D24]">
                      Automated Weighbridge Ticket #WB-8821
                    </h3>
                    <p className="text-xs text-gray-500">Mandi Platform Scale #1 • Tare & Gross Verified</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#3F8F55]">APPROVED</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center my-4">
                <div className="p-3.5 rounded-2xl bg-[#F7F5EC] border border-[#E8EFE1]">
                  <div className="text-[10px] text-gray-500 uppercase">Gross Loaded</div>
                  <div className="font-serif text-xl font-bold text-[#123D24] mt-0.5">4,820 kg</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F5EC] border border-[#E8EFE1]">
                  <div className="text-[10px] text-gray-500 uppercase">Tare (Tractor)</div>
                  <div className="font-serif text-xl font-bold text-[#123D24] mt-0.5">2,320 kg</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#E8EFE1] border border-[#D3E0C9]">
                  <div className="text-[10px] text-[#1B4D2A] uppercase font-bold">Net Grain</div>
                  <div className="font-serif text-xl font-black text-[#123D24] mt-0.5">25.00 Qtl</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 5 Cols - Complete Milestone Trail */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8EFE1]">
              <h3 className="font-serif text-lg font-bold text-[#123D24] mb-4 pb-3 border-b border-gray-100">
                Procurement Audit History
              </h3>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E8EFE1] before:h-[85%] before:top-2">
                {milestones.map((m, idx) => (
                  <div key={idx} className="relative flex items-start gap-3.5">
                    <div className="z-10 mt-0.5">
                      {m.status === 'completed' ? (
                        <div className="w-7 h-7 rounded-full bg-[#E8EFE1] text-[#3F8F55] flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : m.status === 'in_progress' ? (
                        <div className="w-7 h-7 rounded-full bg-[#123D24] text-white flex items-center justify-center animate-pulse">
                          <div className="w-2 h-2 rounded-full bg-[#8EB773]" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-xs">
                      <div className="flex justify-between">
                        <span className="font-bold text-[#123D24]">{m.label}</span>
                        <span className="font-mono text-[10px] text-gray-400">{m.timestamp?.split(',')[0]}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official J-Form Certification Seal */}
            <div className="bg-[#123D24] text-white rounded-3xl p-6 shadow-lg border border-[#256035]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B4D2A] text-[#8EB773] flex items-center justify-center border border-[#256035]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold">Mandi Acceptance (J-Form)</h4>
                  <p className="text-[10px] text-[#8EB773]">State Agricultural Marketing Board</p>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-gray-300 py-3 border-y border-[#256035] my-3 font-mono">
                <div>Document: JFORM/2026/HAR/024</div>
                <div>Farmer: {user.name} (FARM-8821)</div>
                <div>Crop: Paddy Grade A • 2,500 kg</div>
                <div>Total Disbursal: ₹55,075.00</div>
              </div>

              <button
                onClick={handlePrint}
                className="w-full py-2.5 rounded-xl bg-[#8EB773] text-[#123D24] text-xs font-bold hover:bg-[#B7D2A2] transition-colors"
              >
                Download Signed Digital J-Form Slip
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
