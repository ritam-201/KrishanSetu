import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DetailedFarmerProfile, CropDetail, CropType } from '../types';
import {
  User,
  ShieldCheck,
  MapPin,
  Sprout,
  Calendar,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Save,
  Plus,
  Trash2,
  Award,
  Globe,
  Bell,
  LogOut
} from 'lucide-react';

export const FarmerProfilePage: React.FC = () => {
  const { user, language, setLanguage, logout } = useAuth();
  const navigate = useNavigate();

  // Initial Detailed Profile State based on user data
  const [profile, setProfile] = useState<DetailedFarmerProfile>({
    farmerId: user.id || 'FID-2026-8821',
    fullName: user.name || 'Farmer Account',
    dob: '1984-05-14',
    gender: 'Male',
    preferredLanguage: language,
    mobileNumber: user.phone || '+91 98000 00000',
    email: user.email || 'farmer@kisansetu.in',
    addressLine: 'Paschim Para',
    village: user.village || 'Gram Panchayat',
    block: user.block || 'Local Block',
    district: user.district || 'Hooghly',
    state: user.state || 'West Bengal',
    pinCode: user.pinCode || '712101',
    govtIdType: 'Aadhaar Card',
    maskedGovtId: user.aadhaarNumber ? `XXXX-XXXX-${user.aadhaarNumber.slice(-4)}` : `XXXX-XXXX-${user.aadhaarLast4 || '4821'}`,
    farmerRegistrationNumber: 'KNY-WB-2026-09412',
    verificationStatus: 'Verified',
    verificationDate: '10 Nov 2025',
    farmName: `${user.name || 'Farmer'} Crop Farm`,
    farmLocation: 'Dag No. 142/A, Khatian 89',
    totalLandArea: user.landAcres || 2.5,
    landUnit: 'Acres',
    ownershipType: 'Owned',
    irrigationAvailable: true,
    soilType: 'Alluvial Loam',
    crops: [
      {
        id: 'CROP-1',
        cropName: user.primaryCrop || 'Rice / Paddy',
        variety: 'Swarna (MTU 7029)',
        season: 'Kharif',
        expectedQuantityQuintals: 85,
        harvestDate: '2026-10-15',
        expectedProcurementDate: '2026-11-01'
      },
      {
        id: 'CROP-2',
        cropName: 'Mustard',
        variety: 'Pusa Bold',
        season: 'Rabi',
        expectedQuantityQuintals: 30,
        harvestDate: '2026-02-20',
        expectedProcurementDate: '2026-03-05'
      }
    ],
    preferredCenterId: 'CTR-001',
    preferredTimeSlot: '09:00 AM - 12:00 PM',
    preferredNotificationMethod: 'SMS & WhatsApp',
    completionPercentage: 85
  });

  const [activeTab, setActiveTab] = useState<'personal' | 'verification' | 'farm' | 'crops' | 'preferences'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New crop modal / form inline
  const [newCropName, setNewCropName] = useState<CropType>('Rice / Paddy');
  const [newVariety, setNewVariety] = useState('');
  const [newQuantity, setNewQuantity] = useState(40);

  const handleSave = () => {
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleAddCrop = () => {
    if (!newVariety) return;
    const newCrop: CropDetail = {
      id: `CROP-${Date.now()}`,
      cropName: newCropName,
      variety: newVariety,
      season: 'Kharif',
      expectedQuantityQuintals: Number(newQuantity),
      harvestDate: new Date().toISOString().split('T')[0],
      expectedProcurementDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setProfile(prev => ({
      ...prev,
      crops: [...prev.crops, newCrop]
    }));
    setNewVariety('');
  };

  const handleRemoveCrop = (cropId: string) => {
    setProfile(prev => ({
      ...prev,
      crops: prev.crops.filter(c => c.id !== cropId)
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Save Toast Notification */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-medium text-sm">Farmer profile updated successfully! All center recommendations refreshed.</span>
          </div>
          <button onClick={() => setSaveSuccess(false)} className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold uppercase">
            Dismiss
          </button>
        </div>
      )}

      {/* Profile Header Header Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur border-2 border-white/20 p-1 shadow-inner">
                <img
                  src={user.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"}
                  alt={profile.fullName}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-slate-900" title="Government Verified">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{profile.fullName}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Farmer
                </span>
              </div>
              <p className="text-emerald-100/80 text-sm mt-1 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {profile.village}, {profile.district}, {profile.state} (PIN: {profile.pinCode})
              </p>
              <div className="flex items-center space-x-4 mt-3 text-xs text-slate-300">
                <span>Farmer ID: <strong className="text-white">{profile.farmerId}</strong></span>
                <span>•</span>
                <span>Reg #: <strong className="text-white">{profile.farmerRegistrationNumber}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all flex items-center justify-center space-x-2 backdrop-blur"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-rose-600/90 hover:bg-rose-700 text-white font-semibold rounded-xl border border-rose-400/30 transition-all flex items-center justify-center space-x-2 shadow-sm"
              title="Logout from Account"
            >
              <LogOut className="w-4 h-4 text-white" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Profile Completion Meter (Requirement 4) */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-emerald-200 font-medium">Profile Completion Status</span>
            <span className="text-emerald-300 font-bold text-sm">{profile.completionPercentage}% Complete</span>
          </div>
          <div className="w-full bg-slate-950/40 rounded-full h-3 p-0.5 border border-white/10">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${profile.completionPercentage}%` }}
            />
          </div>
          {profile.completionPercentage < 100 && (
            <p className="text-xs text-emerald-200/80 mt-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Complete your farm location & irrigation details to improve nearby procurement center recommendations.</span>
            </p>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto space-x-2 border-b border-slate-200 mb-8 pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-5 py-3 font-semibold text-sm rounded-xl transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'personal'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Information</span>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`px-5 py-3 font-semibold text-sm rounded-xl transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'verification'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Government Identification</span>
        </button>

        <button
          onClick={() => setActiveTab('farm')}
          className={`px-5 py-3 font-semibold text-sm rounded-xl transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'farm'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Farm Details</span>
        </button>

        <button
          onClick={() => setActiveTab('crops')}
          className={`px-5 py-3 font-semibold text-sm rounded-xl transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'crops'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>Crops & Harvest</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-5 py-3 font-semibold text-sm rounded-xl transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'preferences'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Preferences & Language</span>
        </button>
      </div>

      {/* Tab Content Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" /> Personal & Address Details
              </h2>
              <span className="text-xs text-slate-500">Official Farmer Record</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.fullName}
                  onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.mobileNumber}
                    onChange={e => setProfile({ ...profile, mobileNumber: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date of Birth</label>
                <input
                  type="date"
                  disabled={!isEditing}
                  value={profile.dob}
                  onChange={e => setProfile({ ...profile, dob: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Gender</label>
                <select
                  disabled={!isEditing}
                  value={profile.gender}
                  onChange={e => setProfile({ ...profile, gender: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Village / Gram Panchayat</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.village}
                  onChange={e => setProfile({ ...profile, village: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Block / Tehsil</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.block}
                  onChange={e => setProfile({ ...profile, block: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">District</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.district}
                  onChange={e => setProfile({ ...profile, district: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">State & PIN Code</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.state}
                    onChange={e => setProfile({ ...profile, state: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                  />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.pinCode}
                    onChange={e => setProfile({ ...profile, pinCode: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Tab (Requirement 4: Masked Govt ID) */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Government Registration & Masked ID
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> DBT Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Government ID Type</span>
                  <span className="text-sm font-bold text-slate-900">{profile.govtIdType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Masked Identification Number</span>
                  <span className="text-sm font-mono font-bold text-slate-900 tracking-wider bg-white px-3 py-1 rounded-lg border border-slate-200">
                    {profile.maskedGovtId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 italic">
                  * Note: Complete identification numbers are masked in public displays for security compliance.
                </p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Krishak Bandhu / Kisan Reg #</span>
                  <span className="text-sm font-mono font-bold text-emerald-700">{profile.farmerRegistrationNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Verification Timestamp</span>
                  <span className="text-sm font-medium text-slate-700">{profile.verificationDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Verified for Direct Benefit Transfer (DBT) Mandi Procurement</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Farm Details Tab */}
        {activeTab === 'farm' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-600" /> Farm Land & Agronomic Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Farm Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.farmName}
                  onChange={e => setProfile({ ...profile, farmName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Dag / Khatian Location</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.farmLocation}
                  onChange={e => setProfile({ ...profile, farmLocation: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Total Land Area</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={profile.totalLandArea}
                    onChange={e => setProfile({ ...profile, totalLandArea: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                  />
                  <select
                    disabled={!isEditing}
                    value={profile.landUnit}
                    onChange={e => setProfile({ ...profile, landUnit: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                  >
                    <option value="Acres">Acres</option>
                    <option value="Bigha">Bigha</option>
                    <option value="Hectares">Hectares</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Land Ownership</label>
                <select
                  disabled={!isEditing}
                  value={profile.ownershipType}
                  onChange={e => setProfile({ ...profile, ownershipType: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                >
                  <option value="Owned">Owned</option>
                  <option value="Leased">Leased</option>
                  <option value="Sharecropper">Sharecropper</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Soil Type</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.soilType}
                  onChange={e => setProfile({ ...profile, soilType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Irrigation Availability</label>
                <div className="flex items-center space-x-4 pt-2">
                  <label className="flex items-center space-x-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="irrigation"
                      disabled={!isEditing}
                      checked={profile.irrigationAvailable}
                      onChange={() => setProfile({ ...profile, irrigationAvailable: true })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Available</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="irrigation"
                      disabled={!isEditing}
                      checked={!profile.irrigationAvailable}
                      onChange={() => setProfile({ ...profile, irrigationAvailable: false })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Rainfed Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Crops Tab (Multi-crop management) */}
        {activeTab === 'crops' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" /> Cultivated Crops & Yield Estimates
              </h2>
            </div>

            {/* List of Crops */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.crops.map((crop) => (
                <div key={crop.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 relative group hover:border-emerald-300 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-slate-900 text-base">{crop.cropName}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                      {crop.season}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p>Variety: <strong className="text-slate-800">{crop.variety}</strong></p>
                    <p>Expected Yield: <strong className="text-emerald-700 font-bold">{crop.expectedQuantityQuintals} Quintals</strong></p>
                    <p>Est. Harvest: <span className="text-slate-800">{crop.harvestDate}</span></p>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveCrop(crop.id)}
                      className="absolute top-4 right-4 text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Crop Form */}
            {isEditing && (
              <div className="mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-4">
                <h3 className="text-xs font-bold text-emerald-900 uppercase">Add Additional Crop</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Crop</label>
                    <select
                      value={newCropName}
                      onChange={e => setNewCropName(e.target.value as CropType)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option value="Rice / Paddy">Rice / Paddy</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Mustard">Mustard</option>
                      <option value="Maize">Maize</option>
                      <option value="Bengal Gram (Chana)">Bengal Gram (Chana)</option>
                      <option value="Cotton">Cotton</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Variety</label>
                    <input
                      type="text"
                      placeholder="e.g. Swarna / Hybrid"
                      value={newVariety}
                      onChange={e => setNewVariety(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Est. Quantity (Qtl)</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={newQuantity}
                        onChange={e => setNewQuantity(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                      <button
                        onClick={handleAddCrop}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 flex items-center space-x-1 flex-shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preferences & Language Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" /> Platform Preferences & Language
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Preferred Portal Language</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                      language === 'en'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('bn')}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                      language === 'bn'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    বাংলা (Bengali)
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                      language === 'hi'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    हिन्दी (Hindi)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Notification Channel</label>
                <select
                  disabled={!isEditing}
                  value={profile.preferredNotificationMethod}
                  onChange={e => setProfile({ ...profile, preferredNotificationMethod: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-700"
                >
                  <option value="SMS & WhatsApp">SMS & WhatsApp Alerts</option>
                  <option value="App Notification">In-App Push Notification</option>
                  <option value="Call">Voice Call Alert</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
