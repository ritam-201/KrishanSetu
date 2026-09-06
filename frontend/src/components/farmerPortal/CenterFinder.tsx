import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Clock,
  Wheat,
  Search,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Filter,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProcurementCenter } from '../types';

export const CenterFinder: React.FC<{ onSelectCenterForBooking?: (center: ProcurementCenter) => void }> = ({
  onSelectCenterForBooking
}) => {
  const { centers, currentCenterId, setCurrentCenterId } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCenters = centers.filter(c => {
    const matchesCrop = selectedCrop === 'All' || c.acceptedCrops.some(crop => crop.includes(selectedCrop));
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  const activeCenter = centers.find(c => c.id === currentCenterId) || centers[0];

  return (
    <section id="procurement-centers" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
              LIVE MANDI APMC NETWORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Find the Right Procurement Center Before You Leave Home
            </h2>
            <p className="mt-2 text-base text-slate-600 font-normal">
              Compare nearby centers, available slots, accepted crops, and current waiting queues in real time.
            </p>
          </div>

          <Link
            to="/schedule"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-700 transition-colors self-start md:self-auto shadow-sm"
          >
            <span>Explore All Mandis</span>
            <ArrowRight className="w-4 h-4 text-emerald-200" />
          </Link>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by center name, block, or district (e.g. Hooghly, Haripur)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Rice / Paddy', 'Wheat', 'Mustard', 'Maize'].map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCrop === crop
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column: Left Center Cards List / Right Stylized Map & Active Yard View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Center List */}
          <div className="lg:col-span-6 space-y-4">
            {filteredCenters.map((center) => {
              const isSelected = center.id === currentCenterId;
              return (
                <div
                  key={center.id}
                  onClick={() => setCurrentCenterId(center.id)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-emerald-600 shadow-md ring-1 ring-emerald-600'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {center.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {center.distanceKm} km away
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{center.address}</span>
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                        center.status === 'Open'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : center.status === 'Crowded'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}
                    >
                      ● {center.status}
                    </span>
                  </div>

                  {/* Crops accepted */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    {center.acceptedCrops.map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Status metrics grid */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Slots</div>
                      <div className="text-xs font-bold text-slate-900">
                        {center.availableSlotsToday} / {center.totalSlotsToday}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Queue</div>
                      <div className="text-xs font-bold text-slate-900">
                        {center.totalQueueWaiting} Farmers
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Est. Wait</div>
                      <div className="text-xs font-bold text-emerald-600">
                        ~{center.totalQueueWaiting * center.averageProcessingTimeMinutes} min
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between mt-3 pt-2">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{center.operatingHours}</span>
                    </span>

                    <Link
                      to="/schedule"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <span>Book Slot Here →</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Stylized Mandi Yard Map View */}
          <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-5 border border-slate-200 sticky top-24">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Interactive Mandi Radar
                  </h4>
                  <p className="text-[11px] text-slate-500">Hooghly - Nadia Procurement Zone</p>
                </div>
              </div>

              <span className="text-[11px] font-semibold bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-700">
                GPS Radius: 25 km
              </span>
            </div>

            {/* Stylized Vector Map Canvas */}
            <div className="relative w-full h-64 sm:h-72 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 p-4 flex flex-col justify-between shadow-inner">
              
              {/* Decorative terrain contour shapes */}
              <div className="absolute inset-0 opacity-25 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,30 Q25,10 50,40 T100,20 L100,100 L0,100 Z" fill="#059669" />
                  <path d="M0,60 Q35,80 70,50 T100,80 L100,100 L0,100 Z" fill="#065F46" />
                </svg>
              </div>

              {/* Farmer Current Location Pin */}
              <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                    <span className="text-xs">🚜</span>
                  </div>
                  <span className="w-12 h-12 rounded-full bg-emerald-600/20 absolute -inset-2 animate-ping pointer-events-none" />
                </div>
                <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                  Your Farm (Haripur Paschim)
                </span>
              </div>

              {/* Center Marker 1: Haripur */}
              <div
                onClick={() => setCurrentCenterId('CTR-001')}
                className="absolute top-1/4 right-1/4 z-10 cursor-pointer flex flex-col items-center group"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white group-hover:scale-110 transition-transform">
                  <Wheat className="w-3.5 h-3.5" />
                </div>
                <span className="bg-white text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs mt-0.5 border border-emerald-500">
                  Haripur Mandi #04 (2.4 km)
                </span>
              </div>

              {/* Center Marker 2: Kalyani */}
              <div
                onClick={() => setCurrentCenterId('CTR-002')}
                className="absolute bottom-1/4 right-10 z-10 cursor-pointer flex flex-col items-center group"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md border-2 border-white group-hover:scale-110 transition-transform">
                  <Wheat className="w-3.5 h-3.5" />
                </div>
                <span className="bg-white text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs mt-0.5 border border-amber-500">
                  Kalyani APMC (8.7 km)
                </span>
              </div>

              {/* Map Footer Bar */}
              <div className="relative z-10 self-end bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] text-slate-700 shadow-xs flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Open
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Crowded
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Full
                </span>
              </div>

            </div>

            {/* Selected Mandi Quick Contact & Facilities */}
            <div className="mt-4 bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{activeCenter.name}</h5>
                  <p className="text-[11px] text-slate-500">Officer In-Charge: {activeCenter.officerInCharge}</p>
                </div>
                <a
                  href={`tel:${activeCenter.contactNumber}`}
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  title="Call Mandi Desk"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Digital 50T Weighbridge</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>NABL Quality Moisture Lab</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
