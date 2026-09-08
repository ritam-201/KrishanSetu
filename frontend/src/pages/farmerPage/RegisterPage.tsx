import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  Home,
  ImagePlus,
  LandPlot,
  Leaf,
  Loader2,
  LockKeyhole,
  MapPin,
  Phone,
  ShieldCheck,
  Sprout,
  User,
  UserRound,
  Wheat,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import type {
  CropDetail,
  CropType,
  DetailedFarmerProfile,
} from "../../types";

/* =========================================================
   TYPES
========================================================= */

type Gender = DetailedFarmerProfile["gender"];
type GovtIdType = DetailedFarmerProfile["govtIdType"];
type LanguageCode = DetailedFarmerProfile["preferredLanguage"];
type LandUnit = DetailedFarmerProfile["landUnit"];
type OwnershipType = DetailedFarmerProfile["ownershipType"];
type CropSeason = CropDetail["season"];
type NotificationMethod =
  DetailedFarmerProfile["preferredNotificationMethod"];

interface FormData {
  name: string;
  phone: string;
  email: string;

  dob: string;
  gender: Gender;

  language: LanguageCode;

  govtIdType: GovtIdType;
  aadhaarNumber: string;

  addressLine: string;
  village: string;
  block: string;
  district: string;
  state: string;
  pinCode: string;

  farmName: string;
  farmLocation: string;

  landArea: string;
  landUnit: LandUnit;
  ownershipType: OwnershipType;

  irrigationAvailable: boolean;
  soilType: string;

  crop: CropType;
  variety: string;
  season: CropSeason;
  expectedQuantityQuintals: string;
  harvestDate: string;
  preferredDate: string;

  preferredCenterId: string;
  preferredTimeSlot: string;

  notificationMethod: NotificationMethod;

  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const DISTRICTS = [
  "Alipurduar",
  "Bankura",
  "Paschim Bardhaman",
  "Purba Bardhaman",
  "Birbhum",
  "Cooch Behar",
  "Dakshin Dinajpur",
  "Darjeeling",
  "Hooghly",
  "Howrah",
  "Jalpaiguri",
  "Jhargram",
  "Kalimpong",
  "Kolkata",
  "Maldah",
  "Murshidabad",
  "Nadia",
  "North 24 Parganas",
  "South 24 Parganas",
  "Paschim Medinipur",
  "Purba Medinipur",
  "Uttar Dinajpur",
  "Purulia",
];

const CROPS: CropType[] = [
  "Rice / Paddy",
  "Wheat",
  "Mustard",
  "Maize",
  "Bengal Gram (Chana)",
  "Cotton",
];

const TIME_SLOTS = [
  "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
];

const STEPS = [
  {
    number: 1,
    title: "Personal",
    subtitle: "Basic details",
    icon: UserRound,
  },
  {
    number: 2,
    title: "Address",
    subtitle: "Location",
    icon: MapPin,
  },
  {
    number: 3,
    title: "Farm",
    subtitle: "Land details",
    icon: LandPlot,
  },
  {
    number: 4,
    title: "Crop",
    subtitle: "Harvest details",
    icon: Wheat,
  },
  {
    number: 5,
    title: "Bank & Submit",
    subtitle: "DBT details",
    icon: Banknote,
  },
];

/* =========================================================
   HELPERS
========================================================= */

const getToday = (): string => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const maskAadhaar = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  if (digits.length < 4) {
    return "";
  }

  return `XXXX XXXX ${digits.slice(-4)}`;
};

const formatDate = (value: string): string => {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   INITIAL FORM
========================================================= */

const INITIAL_FORM: FormData = {
  name: "",
  phone: "",
  email: "",

  dob: "",
  gender: "Male",

  language: "en",

  govtIdType: "Aadhaar Card",
  aadhaarNumber: "",

  addressLine: "",
  village: "",
  block: "",
  district: "",
  state: "West Bengal",
  pinCode: "",

  farmName: "",
  farmLocation: "",

  landArea: "",
  landUnit: "Acres",
  ownershipType: "Owned",

  irrigationAvailable: false,
  soilType: "",

  crop: "Rice / Paddy",
  variety: "",
  season: "Kharif",
  expectedQuantityQuintals: "",
  harvestDate: "",
  preferredDate: "",

  preferredCenterId: "",
  preferredTimeSlot: "",

  notificationMethod: "SMS & WhatsApp",

  bankName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifscCode: "",
};

/* =========================================================
   COMPONENT
========================================================= */

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const { registerUser, centers } = useAuth();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [registered, setRegistered] =
    useState(false);

  const [registrationNumber, setRegistrationNumber] =
    useState("");

  const [uploadedDocuments, setUploadedDocuments] =
    useState<Record<string, File | null>>({
      identity: null,
      land: null,
      bank: null,
    });

  /* =======================================================
     CENTER OPTIONS
  ======================================================= */

  const centerOptions = useMemo(() => {
    return centers.filter((center) => {
      if (!form.district) {
        return true;
      }

      return center.district === form.district;
    });
  }, [centers, form.district]);

  /* =======================================================
     FORM UPDATE
  ======================================================= */

  const updateForm = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    setErrors((previous) => {
      const next = {
        ...previous,
      };

      delete next[key];

      return next;
    });
  };

  /* =======================================================
     DOCUMENT UPLOAD
  ======================================================= */

  const handleDocumentUpload = (
    key: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] || null;

    setUploadedDocuments((previous) => ({
      ...previous,
      [key]: file,
    }));
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateStep = (
    currentStep: number,
  ): boolean => {
    const nextErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!form.name.trim()) {
        nextErrors.name =
          "Please enter your full name.";
      }

      if (!/^[6-9]\d{9}$/.test(form.phone)) {
        nextErrors.phone =
          "Enter a valid 10-digit Indian mobile number.";
      }

      if (
        form.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          form.email,
        )
      ) {
        nextErrors.email =
          "Enter a valid email address.";
      }

      if (!form.dob) {
        nextErrors.dob =
          "Please select your date of birth.";
      }

      if (!form.gender) {
        nextErrors.gender =
          "Please select your gender.";
      }

      const aadhaar =
        form.aadhaarNumber.replace(/\D/g, "");

      if (aadhaar.length !== 12) {
        nextErrors.aadhaarNumber =
          "Aadhaar number must contain 12 digits.";
      }
    }

    if (currentStep === 2) {
      if (!form.addressLine.trim()) {
        nextErrors.addressLine =
          "Please enter your address.";
      }

      if (!form.village.trim()) {
        nextErrors.village =
          "Please enter your village.";
      }

      if (!form.block.trim()) {
        nextErrors.block =
          "Please enter your block.";
      }

      if (!form.district) {
        nextErrors.district =
          "Please select your district.";
      }

      if (!/^\d{6}$/.test(form.pinCode)) {
        nextErrors.pinCode =
          "PIN code must contain 6 digits.";
      }
    }

    if (currentStep === 3) {
      if (!form.farmName.trim()) {
        nextErrors.farmName =
          "Please enter your farm name.";
      }

      if (
        !form.landArea ||
        Number(form.landArea) <= 0
      ) {
        nextErrors.landArea =
          "Enter a valid land area.";
      }

      if (!form.ownershipType) {
        nextErrors.ownershipType =
          "Please select ownership type.";
      }

      if (!form.soilType.trim()) {
        nextErrors.soilType =
          "Please enter the soil type.";
      }
    }

    if (currentStep === 4) {
      if (!form.crop) {
        nextErrors.crop =
          "Please select a crop.";
      }

      if (!form.variety.trim()) {
        nextErrors.variety =
          "Please enter the crop variety.";
      }

      if (!form.season) {
        nextErrors.season =
          "Please select crop season.";
      }

      if (
        !form.expectedQuantityQuintals ||
        Number(form.expectedQuantityQuintals) <= 0
      ) {
        nextErrors.expectedQuantityQuintals =
          "Enter the expected quantity.";
      }

      if (!form.harvestDate) {
        nextErrors.harvestDate =
          "Please select harvest date.";
      }

      if (!form.preferredDate) {
        nextErrors.preferredDate =
          "Please select procurement date.";
      }

      if (!form.preferredCenterId) {
        nextErrors.preferredCenterId =
          "Please select a procurement center.";
      }

      if (!form.preferredTimeSlot) {
        nextErrors.preferredTimeSlot =
          "Please select a time slot.";
      }
    }

    if (currentStep === 5) {
      if (!form.bankName.trim()) {
        nextErrors.bankName =
          "Please enter your bank name.";
      }

      const account =
        form.accountNumber.replace(/\D/g, "");

      const confirmAccount =
        form.confirmAccountNumber.replace(
          /\D/g,
          "",
        );

      if (
        account.length < 8 ||
        account.length > 18
      ) {
        nextErrors.accountNumber =
          "Enter a valid bank account number.";
      }

      if (account !== confirmAccount) {
        nextErrors.confirmAccountNumber =
          "Account numbers do not match.";
      }

      if (
        !/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(
          form.ifscCode.trim(),
        )
      ) {
        nextErrors.ifscCode =
          "Enter a valid IFSC code.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = () => {
    if (!validateStep(step)) {
      return;
    }

    setStep((previous) =>
      Math.min(5, previous + 1),
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     BACK
  ======================================================= */

  const handleBack = () => {
    setStep((previous) =>
      Math.max(1, previous - 1),
    );

    setErrors({});

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = () => {
    if (!validateStep(5)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanAadhaar =
        form.aadhaarNumber
          .replace(/\D/g, "")
          .slice(0, 12);

      const accountDigits =
        form.accountNumber.replace(/\D/g, "");

      const generatedRegistrationNumber =
        `KS-${new Date().getFullYear()}-${Date.now()
          .toString()
          .slice(-6)}`;

      const cropDetail: CropDetail = {
        id:
          `CROP-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 7)}`,

        cropName: form.crop,

        variety: form.variety.trim(),

        season: form.season,

        expectedQuantityQuintals:
          Number(form.expectedQuantityQuintals),

        harvestDate: form.harvestDate,

        expectedProcurementDate:
          form.preferredDate,
      };

      const detailedProfile:
        Partial<DetailedFarmerProfile> = {
        fullName: form.name.trim(),

        dob: form.dob,

        gender: form.gender,

        preferredLanguage: form.language,

        mobileNumber: form.phone,

        email: form.email.trim(),

        addressLine: form.addressLine.trim(),

        village: form.village.trim(),

        block: form.block.trim(),

        district: form.district,

        state: "West Bengal",

        pinCode: form.pinCode,

        govtIdType: form.govtIdType,

        maskedGovtId:
          maskAadhaar(cleanAadhaar),

        farmName: form.farmName.trim(),

        farmLocation:
          form.farmLocation.trim() ||
          [
            form.village,
            form.block,
            form.district,
          ]
            .filter(Boolean)
            .join(", "),

        totalLandArea:
          Number(form.landArea),

        landUnit: form.landUnit,

        ownershipType:
          form.ownershipType,

        irrigationAvailable:
          form.irrigationAvailable,

        soilType: form.soilType.trim(),

        crops: [cropDetail],

        preferredCenterId:
          form.preferredCenterId,

        preferredTimeSlot:
          form.preferredTimeSlot,

        preferredNotificationMethod:
          form.notificationMethod,

        verificationStatus:
          "Pending Verification",

        verificationDate: "",

        completionPercentage: 100,
      };

      registerUser({
        role: "farmer",

        name: form.name.trim(),

        phone: form.phone,

        email: form.email.trim(),

        aadhaarNumber: cleanAadhaar,

        govtIdType: form.govtIdType,

        maskedGovtId:
          maskAadhaar(cleanAadhaar),

        dob: form.dob,

        gender: form.gender,

        preferredLanguage: form.language,

        addressLine:
          form.addressLine.trim(),

        village: form.village.trim(),

        block: form.block.trim(),

        district: form.district,

        state: "West Bengal",

        pinCode: form.pinCode,

        farmerId:
          `FARM-${Date.now()
            .toString()
            .slice(-6)}`,

        farmerRegistrationNumber:
          generatedRegistrationNumber,

        farmName: form.farmName.trim(),

        farmLocation:
          form.farmLocation.trim() ||
          [
            form.village,
            form.block,
            form.district,
          ]
            .filter(Boolean)
            .join(", "),

        landAcres:
          form.landUnit === "Acres"
            ? Number(form.landArea)
            : Number(form.landArea),

        totalLandArea:
          Number(form.landArea),

        landUnit: form.landUnit,

        ownershipType:
          form.ownershipType,

        irrigationAvailable:
          form.irrigationAvailable,

        soilType: form.soilType.trim(),

        primaryCrop: form.crop,

        crops: [cropDetail],

        cropVariety:
          form.variety.trim(),

        cropSeason: form.season,

        expectedQuantityQuintals:
          Number(
            form.expectedQuantityQuintals,
          ),

        harvestDate:
          form.harvestDate,

        expectedProcurementDate:
          form.preferredDate,

        preferredCenterId:
          form.preferredCenterId,

        preferredTimeSlot:
          form.preferredTimeSlot,

        preferredNotificationMethod:
          form.notificationMethod,

        bankName:
          form.bankName.trim(),

        bankAccountLast4:
          accountDigits.slice(-4),

        ifscCode:
          form.ifscCode
            .trim()
            .toUpperCase(),

        detailedProfile,
      });

      setRegistrationNumber(
        generatedRegistrationNumber,
      );

      setRegistered(true);
    } catch (error) {
      console.error(
        "Registration failed:",
        error,
      );

      setErrors({
        submit:
          "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================================================
     SUCCESS SCREEN
  ======================================================= */

  if (registered) {
    return (
      <div
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(2,44,34,.94), rgba(6,78,59,.90)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative w-full max-w-3xl">
          <div className="overflow-hidden rounded-[36px] border border-white/20 bg-white/95 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <div className="h-2 bg-linear-to-r from-lime-400 via-emerald-500 to-green-700" />

            <div className="px-6 py-12 text-center sm:px-14 sm:py-14">
              <div className="mx-auto mb-7 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-100/60">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-xl shadow-emerald-500/30">
                  <CheckCircle2
                    className="h-12 w-12 text-white"
                    strokeWidth={2}
                  />
                </div>
              </div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                <BadgeCheck className="h-4 w-4" />
                Registration Successful
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Welcome to Kisan
                <span className="text-emerald-600">
                  Setu
                </span>
              </h1>

              <p className="mt-3 text-lg font-semibold text-slate-700">
                {form.name}
              </p>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Your farmer profile has been successfully
                registered. Your procurement preferences and
                DBT details have been securely saved.
              </p>

              <div className="mt-9 grid gap-4 text-left sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                    Farmer Registration Number
                  </p>

                  <p className="mt-2 text-lg font-black tracking-wide text-slate-900">
                    {registrationNumber}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Primary Crop
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {form.crop}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-emerald-500 to-green-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-500/25 transition duration-300 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-green-700 active:scale-[0.99]"
              >
                <Home className="h-5 w-5" />
                Go to Home Page
                <ArrowRight className="h-5 w-5" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <LockKeyhole className="h-3.5 w-3.5" />
                Your farmer information is securely stored.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  const ActiveStepIcon =
    STEPS[step - 1]?.icon || UserRound;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f8f4] text-slate-900">
      {/* =====================================================
          PREMIUM BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute -left-48 -top-48 h-[550px] w-[550px] rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="absolute -right-48 top-[20%] h-[550px] w-[550px] rounded-full bg-lime-300/20 blur-3xl" />

        <div className="absolute bottom-[-250px] left-[30%] h-[500px] w-[500px] rounded-full bg-green-300/15 blur-3xl" />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 shadow-sm backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition group-hover:bg-emerald-100">
              <ArrowLeft className="h-4 w-4" />
            </span>

            <span className="hidden sm:block">
              Back to Home
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-green-700 shadow-lg shadow-emerald-500/20">
              <Sprout
                className="h-6 w-6 text-white"
                strokeWidth={2}
              />

              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-lime-400" />
            </div>

            <div>
              <p className="text-lg font-black tracking-tight text-slate-900">
                Kisan<span className="text-emerald-600">Setu</span>
              </p>

              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:block">
                Farmer Portal
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 sm:flex">
            <ShieldCheck className="h-4 w-4" />
            Secure Registration
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* ===================================================
            HERO
        =================================================== */}

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 shadow-sm backdrop-blur">
            <Leaf className="h-4 w-4" />
            Digital Farmer Registration
          </div>

          <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-900 sm:text-6xl">
            Grow with{" "}
            <span className="bg-linear-to-r from-emerald-500 via-green-600 to-lime-600 bg-clip-text text-transparent">
              KisanSetu
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Create your farmer profile, register your crop,
            choose a procurement slot and connect your bank
            account for direct benefit transfer.
          </p>
        </div>

        {/* ===================================================
            DESKTOP STEPPER
        =================================================== */}

        <div className="mx-auto mt-10 hidden max-w-6xl md:block">
          <div className="rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl">
            <div className="flex items-center">
              {STEPS.map((item, index) => {
                const completed =
                  step > item.number;

                const active =
                  step === item.number;

                const StepIcon = item.icon;

                return (
                  <React.Fragment key={item.number}>
                    <button
                      type="button"
                      onClick={() => {
                        if (item.number < step) {
                          setStep(item.number);
                          setErrors({});
                        }
                      }}
                      className="group flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <div
                        className={[
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border font-bold transition-all duration-300",
                          completed
                            ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                            : active
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-100"
                              : "border-slate-200 bg-white text-slate-400",
                        ].join(" ")}
                      >
                        {completed ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <StepIcon className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={[
                            "truncate text-sm font-bold",
                            active || completed
                              ? "text-slate-900"
                              : "text-slate-400",
                          ].join(" ")}
                        >
                          {item.title}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {item.subtitle}
                        </p>
                      </div>
                    </button>

                    {index < STEPS.length - 1 && (
                      <div
                        className={[
                          "mx-3 h-1 w-10 shrink-0 rounded-full transition-all duration-500 lg:mx-5 lg:w-16",
                          step > item.number
                            ? "bg-emerald-500"
                            : "bg-slate-200",
                        ].join(" ")}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================================================
            MOBILE STEPPER
        =================================================== */}

        <div className="mx-auto mt-8 md:hidden">
          <div className="rounded-2xl border border-white bg-white/80 p-5 shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ActiveStepIcon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-black text-slate-900">
                    Step {step} of 5
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {STEPS[step - 1]?.title}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                {Math.round((step / 5) * 100)}%
              </span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-400 to-green-600 transition-all duration-500"
                style={{
                  width: `${(step / 5) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            FORM CARD
        =================================================== */}

        <div className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-[32px] border border-white/80 bg-white/95 shadow-2xl shadow-slate-300/40 backdrop-blur-xl lg:mt-10">
          {/* Top accent */}
          <div className="h-1.5 bg-linear-to-r from-emerald-400 via-green-500 to-lime-400" />

          {/* =================================================
              FORM HEADER
          ================================================= */}

          <div className="border-b border-slate-100 bg-linear-to-r from-white to-emerald-50/40 px-5 py-6 sm:px-9">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-50 to-green-100 text-emerald-600 ring-1 ring-emerald-100">
                  <ActiveStepIcon className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                    KisanSetu Registration
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                    {STEPS[step - 1]?.title} Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {STEPS[step - 1]?.subtitle}
                  </p>
                </div>
              </div>

              <div className="hidden rounded-xl bg-slate-50 px-4 py-2 text-right sm:block">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Progress
                </p>

                <p className="text-sm font-black text-emerald-600">
                  {step}/5
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-8 sm:px-9 sm:py-10">
            {/* =================================================
                STEP 1
            ================================================= */}

            {step === 1 && (
              <div className="space-y-8">
                <SectionTitle
                  icon={<User className="h-4 w-4" />}
                  title="Personal information"
                  description="Enter your identity and contact details."
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Full Name"
                    required
                    value={form.name}
                    onChange={(value) =>
                      updateForm("name", value)
                    }
                    placeholder="Enter your full name"
                    icon={
                      <User className="h-4 w-4" />
                    }
                    error={errors.name}
                  />

                  <InputField
                    label="Mobile Number"
                    required
                    value={form.phone}
                    onChange={(value) =>
                      updateForm(
                        "phone",
                        value
                          .replace(/\D/g, "")
                          .slice(0, 10),
                      )
                    }
                    placeholder="10-digit mobile number"
                    icon={
                      <Phone className="h-4 w-4" />
                    }
                    error={errors.phone}
                    inputMode="numeric"
                  />

                  <InputField
                    label="Email Address"
                    value={form.email}
                    onChange={(value) =>
                      updateForm("email", value)
                    }
                    placeholder="name@example.com"
                    type="email"
                    error={errors.email}
                  />

                  <InputField
                    label="Date of Birth"
                    required
                    value={form.dob}
                    onChange={(value) =>
                      updateForm("dob", value)
                    }
                    type="date"
                    max={getToday()}
                    icon={
                      <CalendarDays className="h-4 w-4" />
                    }
                    error={errors.dob}
                  />

                  <SelectField
                    label="Gender"
                    required
                    value={form.gender}
                    onChange={(value) =>
                      updateForm(
                        "gender",
                        value as Gender,
                      )
                    }
                    options={[
                      "Male",
                      "Female",
                      "Other",
                    ]}
                    error={errors.gender}
                  />

                  <SelectField
                    label="Preferred Language"
                    value={form.language}
                    onChange={(value) =>
                      updateForm(
                        "language",
                        value as LanguageCode,
                      )
                    }
                    options={[
                      "en",
                      "bn",
                      "hi",
                    ]}
                    optionLabels={{
                      en: "English",
                      bn: "বাংলা",
                      hi: "हिन्दी",
                    }}
                  />
                </div>

                <InfoBox
                  icon={
                    <LockKeyhole className="h-5 w-5" />
                  }
                  title="Identity verification"
                  description="Your Aadhaar number is used only for farmer verification and will be masked in your profile."
                />

                <InputField
                  label="Aadhaar Number"
                  required
                  value={form.aadhaarNumber}
                  onChange={(value) =>
                    updateForm(
                      "aadhaarNumber",
                      value
                        .replace(/\D/g, "")
                        .slice(0, 12),
                    )
                  }
                  placeholder="12-digit Aadhaar number"
                  icon={
                    <ShieldCheck className="h-4 w-4" />
                  }
                  error={errors.aadhaarNumber}
                  inputMode="numeric"
                />

                {form.aadhaarNumber.length >= 4 && (
                  <div className="rounded-2xl border border-slate-200 bg-linear-to-r from-slate-50 to-white p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Profile display
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />

                      <p className="text-sm font-bold tracking-wider text-slate-700">
                        {maskAadhaar(
                          form.aadhaarNumber,
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =================================================
                STEP 2
            ================================================= */}

            {step === 2 && (
              <div className="space-y-8">
                <SectionTitle
                  icon={<MapPin className="h-4 w-4" />}
                  title="Residential address"
                  description="Tell us where your farm is located."
                />

                <TextAreaField
                  label="Address"
                  required
                  value={form.addressLine}
                  onChange={(value) =>
                    updateForm(
                      "addressLine",
                      value,
                    )
                  }
                  placeholder="House number, street, locality"
                  error={errors.addressLine}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Village"
                    required
                    value={form.village}
                    onChange={(value) =>
                      updateForm(
                        "village",
                        value,
                      )
                    }
                    placeholder="Enter village name"
                    error={errors.village}
                  />

                  <InputField
                    label="Block"
                    required
                    value={form.block}
                    onChange={(value) =>
                      updateForm(
                        "block",
                        value,
                      )
                    }
                    placeholder="Enter block"
                    error={errors.block}
                  />

                  <SelectField
                    label="District"
                    required
                    value={form.district}
                    onChange={(value) =>
                      updateForm(
                        "district",
                        value,
                      )
                    }
                    options={[
                      "",
                      ...DISTRICTS,
                    ]}
                    optionLabels={{
                      "": "Select your district",
                    }}
                    error={errors.district}
                  />

                  <InputField
                    label="State"
                    value="West Bengal"
                    disabled
                  />

                  <InputField
                    label="PIN Code"
                    required
                    value={form.pinCode}
                    onChange={(value) =>
                      updateForm(
                        "pinCode",
                        value
                          .replace(/\D/g, "")
                          .slice(0, 6),
                      )
                    }
                    placeholder="6-digit PIN code"
                    error={errors.pinCode}
                    inputMode="numeric"
                  />
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-green-50 p-5">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl" />

                  <div className="relative flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-black text-slate-900">
                        Location preview
                      </p>

                      <p className="mt-1 text-xs leading-6 text-slate-500">
                        {[
                          form.village,
                          form.block,
                          form.district,
                          "West Bengal",
                          form.pinCode,
                        ]
                          .filter(Boolean)
                          .join(", ") ||
                          "Your selected location will appear here."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                STEP 3
            ================================================= */}

            {step === 3 && (
              <div className="space-y-8">
                <SectionTitle
                  icon={<LandPlot className="h-4 w-4" />}
                  title="Farm information"
                  description="Provide your land and farming details."
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Farm Name"
                    required
                    value={form.farmName}
                    onChange={(value) =>
                      updateForm(
                        "farmName",
                        value,
                      )
                    }
                    placeholder="e.g. Akashe Farm"
                    error={errors.farmName}
                  />

                  <InputField
                    label="Farm Location"
                    value={form.farmLocation}
                    onChange={(value) =>
                      updateForm(
                        "farmLocation",
                        value,
                      )
                    }
                    placeholder="Optional farm location"
                  />

                  <InputField
                    label="Total Land Area"
                    required
                    value={form.landArea}
                    onChange={(value) =>
                      updateForm(
                        "landArea",
                        value.replace(
                          /[^\d.]/g,
                          "",
                        ),
                      )
                    }
                    placeholder="Enter land area"
                    error={errors.landArea}
                    inputMode="decimal"
                  />

                  <SelectField
                    label="Land Unit"
                    value={form.landUnit}
                    onChange={(value) =>
                      updateForm(
                        "landUnit",
                        value as LandUnit,
                      )
                    }
                    options={[
                      "Acres",
                      "Bigha",
                      "Hectares",
                    ]}
                  />

                  <SelectField
                    label="Ownership Type"
                    required
                    value={form.ownershipType}
                    onChange={(value) =>
                      updateForm(
                        "ownershipType",
                        value as OwnershipType,
                      )
                    }
                    options={[
                      "Owned",
                      "Leased",
                      "Sharecropper",
                    ]}
                    error={errors.ownershipType}
                  />

                  <InputField
                    label="Soil Type"
                    required
                    value={form.soilType}
                    onChange={(value) =>
                      updateForm(
                        "soilType",
                        value,
                      )
                    }
                    placeholder="e.g. Alluvial"
                    error={errors.soilType}
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/30">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                        <Sprout className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          Irrigation Available
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Does your farm have access to irrigation?
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle irrigation"
                      onClick={() =>
                        updateForm(
                          "irrigationAvailable",
                          !form.irrigationAvailable,
                        )
                      }
                      className={[
                        "relative h-8 w-14 rounded-full p-1 transition-all duration-300",
                        form.irrigationAvailable
                          ? "bg-emerald-500 shadow-lg shadow-emerald-500/20"
                          : "bg-slate-300",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "block h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300",
                          form.irrigationAvailable
                            ? "translate-x-6"
                            : "translate-x-0",
                        ].join(" ")}
                      />
                    </button>
                  </div>
                </div>

                <InfoBox
                  icon={
                    <Leaf className="h-5 w-5" />
                  }
                  title="Farm registration"
                  description="These details will be stored inside your KisanSetu farmer profile and used for procurement planning."
                />
              </div>
            )}

            {/* =================================================
                STEP 4
            ================================================= */}

            {step === 4 && (
              <div className="space-y-8">
                <SectionTitle
                  icon={<Wheat className="h-4 w-4" />}
                  title="Crop & procurement preferences"
                  description="Register your crop and choose when and where you want to sell it."
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Primary Crop"
                    required
                    value={form.crop}
                    onChange={(value) =>
                      updateForm(
                        "crop",
                        value as CropType,
                      )
                    }
                    options={CROPS}
                    error={errors.crop}
                  />

                  <InputField
                    label="Crop Variety"
                    required
                    value={form.variety}
                    onChange={(value) =>
                      updateForm(
                        "variety",
                        value,
                      )
                    }
                    placeholder="e.g. Swarna"
                    error={errors.variety}
                  />

                  <SelectField
                    label="Crop Season"
                    required
                    value={form.season}
                    onChange={(value) =>
                      updateForm(
                        "season",
                        value as CropSeason,
                      )
                    }
                    options={[
                      "Kharif",
                      "Rabi",
                      "Zaid",
                    ]}
                    error={errors.season}
                  />

                  <InputField
                    label="Expected Quantity"
                    required
                    value={
                      form.expectedQuantityQuintals
                    }
                    onChange={(value) =>
                      updateForm(
                        "expectedQuantityQuintals",
                        value.replace(
                          /[^\d.]/g,
                          "",
                        ),
                      )
                    }
                    placeholder="Quantity in quintals"
                    error={
                      errors.expectedQuantityQuintals
                    }
                    inputMode="decimal"
                  />

                  <InputField
                    label="Expected Harvest Date"
                    required
                    value={form.harvestDate}
                    onChange={(value) =>
                      updateForm(
                        "harvestDate",
                        value,
                      )
                    }
                    type="date"
                    min={getToday()}
                    icon={
                      <CalendarDays className="h-4 w-4" />
                    }
                    error={errors.harvestDate}
                  />

                  <InputField
                    label="Preferred Procurement Date"
                    required
                    value={form.preferredDate}
                    onChange={(value) =>
                      updateForm(
                        "preferredDate",
                        value,
                      )
                    }
                    type="date"
                    min={getToday()}
                    icon={
                      <CalendarDays className="h-4 w-4" />
                    }
                    error={errors.preferredDate}
                  />
                </div>

                {/* Procurement Center */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        Procurement Center
                        <span className="ml-1 text-rose-500">
                          *
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Choose the center where you want to
                        deliver your crop.
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>

                  {centerOptions.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {centerOptions.map(
                        (center) => {
                          const selected =
                            form.preferredCenterId ===
                            center.id;

                          return (
                            <button
                              type="button"
                              key={center.id}
                              onClick={() =>
                                updateForm(
                                  "preferredCenterId",
                                  center.id,
                                )
                              }
                              className={[
                                "group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300",
                                selected
                                  ? "border-emerald-400 bg-linear-to-br from-emerald-50 to-green-50 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-100"
                                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-slate-200/60",
                              ].join(" ")}
                            >
                              {selected && (
                                <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-[40px] bg-emerald-100/60" />
                              )}

                              <div className="relative flex items-start justify-between gap-3">
                                <div>
                                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                                    <MapPin className="h-5 w-5" />
                                  </div>

                                  <p className="font-black text-slate-900">
                                    {center.name}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    {center.district}
                                    {center.state
                                      ? `, ${center.state}`
                                      : ""}
                                  </p>
                                </div>

                                {selected && (
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                    <Check className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700">
                      No procurement center is currently
                      available for this district. You can
                      select another district.
                    </div>
                  )}

                  {errors.preferredCenterId && (
                    <p className="mt-2 text-xs font-medium text-rose-500">
                      {errors.preferredCenterId}
                    </p>
                  )}
                </div>

                {/* Time Slots */}
                <div>
                  <div className="mb-4">
                    <p className="text-sm font-black text-slate-900">
                      Preferred Time Slot
                      <span className="ml-1 text-rose-500">
                        *
                      </span>
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Select the time that is convenient for you.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {TIME_SLOTS.map(
                      (slot) => {
                        const selected =
                          form.preferredTimeSlot ===
                          slot;

                        return (
                          <button
                            type="button"
                            key={slot}
                            onClick={() =>
                              updateForm(
                                "preferredTimeSlot",
                                slot,
                              )
                            }
                            className={[
                              "rounded-xl border px-4 py-3 text-sm font-bold transition-all duration-200",
                              selected
                                ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                : "border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md",
                            ].join(" ")}
                          >
                            {slot}
                          </button>
                        );
                      },
                    )}
                  </div>

                  {errors.preferredTimeSlot && (
                    <p className="mt-2 text-xs font-medium text-rose-500">
                      {errors.preferredTimeSlot}
                    </p>
                  )}
                </div>

                {/* Notifications */}
                <div>
                  <p className="mb-4 text-sm font-black text-slate-900">
                    Notification Preference
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      "SMS & WhatsApp",
                      "App Notification",
                      "Call",
                    ].map(
                      (method) => {
                        const selected =
                          form.notificationMethod ===
                          method;

                        return (
                          <button
                            type="button"
                            key={method}
                            onClick={() =>
                              updateForm(
                                "notificationMethod",
                                method as NotificationMethod,
                              )
                            }
                            className={[
                              "rounded-xl border px-4 py-3 text-sm font-bold transition-all",
                              selected
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm"
                                : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-600",
                            ].join(" ")}
                          >
                            {method}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                STEP 5
            ================================================= */}

            {step === 5 && (
              <div className="space-y-8">
                <SectionTitle
                  icon={<Banknote className="h-4 w-4" />}
                  title="Bank & DBT details"
                  description="Add your bank account for direct procurement payments."
                />

                <InfoBox
                  icon={
                    <LockKeyhole className="h-5 w-5" />
                  }
                  title="Secure DBT information"
                  description="Only the last four digits of your bank account will be displayed in your farmer profile."
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Bank Name"
                    required
                    value={form.bankName}
                    onChange={(value) =>
                      updateForm(
                        "bankName",
                        value,
                      )
                    }
                    placeholder="e.g. State Bank of India"
                    error={errors.bankName}
                  />

                  <InputField
                    label="IFSC Code"
                    required
                    value={form.ifscCode}
                    onChange={(value) =>
                      updateForm(
                        "ifscCode",
                        value
                          .toUpperCase()
                          .slice(0, 11),
                      )
                    }
                    placeholder="e.g. SBIN0001234"
                    error={errors.ifscCode}
                  />

                  <InputField
                    label="Bank Account Number"
                    required
                    value={form.accountNumber}
                    onChange={(value) =>
                      updateForm(
                        "accountNumber",
                        value.replace(
                          /\D/g,
                          "",
                        ),
                      )
                    }
                    placeholder="Enter account number"
                    error={errors.accountNumber}
                    inputMode="numeric"
                  />

                  <InputField
                    label="Confirm Account Number"
                    required
                    value={
                      form.confirmAccountNumber
                    }
                    onChange={(value) =>
                      updateForm(
                        "confirmAccountNumber",
                        value.replace(
                          /\D/g,
                          "",
                        ),
                      )
                    }
                    placeholder="Re-enter account number"
                    error={
                      errors.confirmAccountNumber
                    }
                    inputMode="numeric"
                  />
                </div>

                {/* Documents */}
                <div>
                  <div className="mb-4">
                    <p className="text-sm font-black text-slate-900">
                      Supporting Documents
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Upload your supporting documents if available.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <DocumentUpload
                      title="Identity Proof"
                      description="Aadhaar / ID"
                      file={
                        uploadedDocuments.identity
                      }
                      onChange={(event) =>
                        handleDocumentUpload(
                          "identity",
                          event,
                        )
                      }
                    />

                    <DocumentUpload
                      title="Land Document"
                      description="Optional"
                      file={
                        uploadedDocuments.land
                      }
                      onChange={(event) =>
                        handleDocumentUpload(
                          "land",
                          event,
                        )
                      }
                    />

                    <DocumentUpload
                      title="Bank Proof"
                      description="Passbook / cancelled cheque"
                      file={
                        uploadedDocuments.bank
                      }
                      onChange={(event) =>
                        handleDocumentUpload(
                          "bank",
                          event,
                        )
                      }
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="border-b border-slate-200 bg-white px-5 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          Registration Summary
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Review your details before submitting.
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <FileCheck2 className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 p-5 sm:grid-cols-2">
                    <SummaryItem
                      label="Farmer"
                      value={form.name}
                    />

                    <SummaryItem
                      label="Mobile"
                      value={form.phone}
                    />

                    <SummaryItem
                      label="District"
                      value={
                        form.district ||
                        "Not selected"
                      }
                    />

                    <SummaryItem
                      label="Crop"
                      value={form.crop}
                    />

                    <SummaryItem
                      label="Quantity"
                      value={
                        form.expectedQuantityQuintals
                          ? `${form.expectedQuantityQuintals} quintals`
                          : "Not entered"
                      }
                    />

                    <SummaryItem
                      label="Procurement Date"
                      value={
                        formatDate(
                          form.preferredDate,
                        ) ||
                        "Not selected"
                      }
                    />

                    <SummaryItem
                      label="Time Slot"
                      value={
                        form.preferredTimeSlot ||
                        "Not selected"
                      }
                    />

                    <SummaryItem
                      label="Bank"
                      value={
                        form.bankName ||
                        "Not entered"
                      }
                    />
                  </div>
                </div>

                {errors.submit && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-600">
                    {errors.submit}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-9">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={
                  step === 1
                    ? () => navigate("/")
                    : handleBack
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />

                {step === 1
                  ? "Cancel"
                  : "Previous"}
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-emerald-500 to-green-600 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:from-emerald-600 hover:to-green-700 active:translate-y-0"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-emerald-500 to-green-600 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:from-emerald-600 hover:to-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Complete Registration
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================
            SECURITY FOOTER
        =================================================== */}

        <div className="mx-auto mt-7 flex max-w-6xl flex-wrap items-center justify-center gap-2 text-center text-xs text-slate-400">
          <LockKeyhole className="h-3.5 w-3.5" />
          Your registration data is stored locally in this demo
          application.
        </div>
      </main>
    </div>
  );
};

/* =========================================================
   SECTION TITLE
========================================================= */

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SectionTitle: React.FC<
  SectionTitleProps
> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 text-emerald-600">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
          {icon}
        </div>

        <span className="text-[10px] font-black uppercase tracking-[0.18em]">
          KisanSetu Registration
        </span>
      </div>

      <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
        {title}
      </h3>

      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
};

/* =========================================================
   INFO BOX
========================================================= */

interface InfoBoxProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-green-50 to-white p-5">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-200/20 blur-2xl" />

      <div className="relative flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
          {icon}
        </div>

        <div>
          <p className="text-sm font-black text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   INPUT
========================================================= */

interface InputFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  inputMode?:
    | "text"
    | "numeric"
    | "decimal"
    | "email"
    | "tel"
    | "url"
    | "search"
    | "none";
  min?: string;
  max?: string;
}

const InputField: React.FC<
  InputFieldProps
> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  error,
  icon,
  disabled = false,
  inputMode,
  min,
  max,
}) => {
  return (
    <div className="group">
      <label className="mb-2.5 block text-xs font-black uppercase tracking-wider text-slate-600">
        {label}

        {required && (
          <span className="ml-1 text-rose-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition group-focus-within:text-emerald-500">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange?.(
              event.target.value,
            )
          }
          placeholder={placeholder}
          disabled={disabled}
          inputMode={inputMode}
          min={min}
          max={max}
          className={[
            "w-full rounded-2xl border bg-white px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400",
            icon ? "pl-11" : "",
            error
              ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              : "border-slate-200 hover:border-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50",
            disabled
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "",
          ].join(" ")}
        />
      </div>

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-500">
          <span className="h-1 w-1 rounded-full bg-rose-500" />
          {error}
        </p>
      )}
    </div>
  );
};

/* =========================================================
   TEXTAREA
========================================================= */

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const TextAreaField: React.FC<
  TextAreaFieldProps
> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
}) => {
  return (
    <div>
      <label className="mb-2.5 block text-xs font-black uppercase tracking-wider text-slate-600">
        {label}

        {required && (
          <span className="ml-1 text-rose-500">
            *
          </span>
        )}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        rows={4}
        className={[
          "w-full resize-none rounded-2xl border bg-white px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400",
          error
            ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
            : "border-slate-200 hover:border-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50",
        ].join(" ")}
      />

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-500">
          <span className="h-1 w-1 rounded-full bg-rose-500" />
          {error}
        </p>
      )}
    </div>
  );
};

/* =========================================================
   SELECT
========================================================= */

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  optionLabels?: Record<string, string>;
  required?: boolean;
  error?: string;
}

const SelectField: React.FC<
  SelectFieldProps
> = ({
  label,
  value,
  onChange,
  options,
  optionLabels,
  required = false,
  error,
}) => {
  return (
    <div>
      <label className="mb-2.5 block text-xs font-black uppercase tracking-wider text-slate-600">
        {label}

        {required && (
          <span className="ml-1 text-rose-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className={[
            "w-full appearance-none rounded-2xl border bg-white px-4 py-3.5 pr-11 text-sm font-medium text-slate-900 outline-none transition-all",
            error
              ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              : "border-slate-200 hover:border-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50",
          ].join(" ")}
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {optionLabels?.[option] ||
                option}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-500">
          <span className="h-1 w-1 rounded-full bg-rose-500" />
          {error}
        </p>
      )}
    </div>
  );
};

/* =========================================================
   DOCUMENT UPLOAD
========================================================= */

interface DocumentUploadProps {
  title: string;
  description: string;
  file: File | null;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

const DocumentUpload: React.FC<
  DocumentUploadProps
> = ({
  title,
  description,
  file,
  onChange,
}) => {
  return (
    <label className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50/30 hover:shadow-lg hover:shadow-emerald-500/10">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={onChange}
        className="sr-only"
      />

      <div
        className={[
          "flex h-12 w-12 items-center justify-center rounded-2xl transition-all",
          file
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
            : "bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600",
        ].join(" ")}
      >
        {file ? (
          <FileCheck2 className="h-5 w-5" />
        ) : (
          <ImagePlus className="h-5 w-5" />
        )}
      </div>

      <p className="mt-4 text-sm font-black text-slate-900">
        {title}
      </p>

      <p className="mt-1 truncate text-xs text-slate-500">
        {file ? file.name : description}
      </p>

      {!file && (
        <p className="mt-4 inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 transition group-hover:bg-emerald-100">
          Upload document
          <ArrowRight className="h-3 w-3" />
        </p>
      )}

      {file && (
        <div className="mt-4 inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
          Document uploaded
          <Check className="h-3 w-3" />
        </div>
      )}
    </label>
  );
};

/* =========================================================
   SUMMARY
========================================================= */

interface SummaryItemProps {
  label: string;
  value: string;
}

const SummaryItem: React.FC<
  SummaryItemProps
> = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 truncate text-sm font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
};

export default RegisterPage;