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

import { useAuth } from "../context/AuthContext";

import type {
  CropDetail,
  CropType,
  DetailedFarmerProfile,
} from "../types";

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
  },
  {
    number: 2,
    title: "Address",
    subtitle: "Location",
  },
  {
    number: 3,
    title: "Farm",
    subtitle: "Land details",
  },
  {
    number: 4,
    title: "Crop",
    subtitle: "Harvest details",
  },
  {
    number: 5,
    title: "Bank & Submit",
    subtitle: "DBT details",
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
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-400 via-green-500 to-lime-400" />

            <div className="px-6 py-12 text-center sm:px-12">
              <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50">
                <CheckCircle2
                  className="h-14 w-14 text-emerald-500"
                  strokeWidth={1.8}
                />
              </div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <BadgeCheck className="h-4 w-4" />
                Registration Successful
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Welcome to KisanSetu,
                <span className="mt-1 block text-emerald-600">
                  {form.name}
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                Your farmer profile has been successfully
                registered. Your procurement preferences and
                DBT details have been securely saved.
              </p>

              <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Farmer Registration Number
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {registrationNumber}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Primary Crop
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {form.crop}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 active:scale-[0.99]"
              >
                <Home className="h-5 w-5" />
                Go to Home Page
                <ArrowRight className="h-5 w-5" />
              </button>

              <p className="mt-4 text-xs text-slate-400">
                You can access your farmer information from
                your account after returning home.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-green-200/25 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lime-200/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-200">
              <Sprout className="h-5 w-5 text-emerald-600" />
            </div>

            <span className="hidden font-bold tracking-tight text-slate-900 sm:block">
              Kisan<span className="text-emerald-600">Setu</span>
            </span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            Secure Farmer Registration
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Register with{" "}
            <span className="text-emerald-600">
              KisanSetu
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Create your farmer profile, register your crop,
            choose a procurement slot and connect your bank
            account for direct benefit transfer.
          </p>
        </div>

        {/* Progress */}
        <div className="mx-auto mt-10 max-w-5xl">
          <div className="hidden items-center md:flex">
            {STEPS.map((item, index) => {
              const completed =
                step > item.number;

              const active =
                step === item.number;

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
                    className="flex min-w-0 items-center gap-3 text-left"
                  >
                    <div
                      className={[
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition",
                        completed
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : active
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-50"
                            : "border-slate-200 bg-white text-slate-400",
                      ].join(" ")}
                    >
                      {completed ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        item.number
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={[
                          "text-sm font-semibold",
                          active || completed
                            ? "text-slate-900"
                            : "text-slate-400",
                        ].join(" ")}
                      >
                        {item.title}
                      </p>

                      <p className="text-xs text-slate-400">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>

                  {index < STEPS.length - 1 && (
                    <div
                      className={[
                        "mx-4 h-px flex-1",
                        step > item.number
                          ? "bg-emerald-400"
                          : "bg-slate-200",
                      ].join(" ")}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile Progress */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Step {step} of 5
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {STEPS[step - 1]?.title}
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {Math.round((step / 5) * 100)}%
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${(step / 5) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          {/* Card Header */}
          <div className="border-b border-slate-200 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                {step === 1 && (
                  <UserRound className="h-5 w-5 text-emerald-600" />
                )}

                {step === 2 && (
                  <MapPin className="h-5 w-5 text-emerald-600" />
                )}

                {step === 3 && (
                  <LandPlot className="h-5 w-5 text-emerald-600" />
                )}

                {step === 4 && (
                  <Wheat className="h-5 w-5 text-emerald-600" />
                )}

                {step === 5 && (
                  <Banknote className="h-5 w-5 text-emerald-600" />
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {STEPS[step - 1]?.title} Information
                </h2>

                <p className="text-xs text-slate-400">
                  {STEPS[step - 1]?.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-7 sm:px-8 sm:py-8">
            {/* =================================================
                STEP 1
            ================================================= */}

            {step === 1 && (
              <div className="space-y-7">
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

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                  <div className="flex items-start gap-3">
                    <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Identity verification
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Your Aadhaar number is used only for
                        farmer verification and will be masked
                        in your profile.
                      </p>
                    </div>
                  </div>
                </div>

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
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wider text-slate-400">
                      Profile display
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {maskAadhaar(
                        form.aadhaarNumber,
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* =================================================
                STEP 2
            ================================================= */}

            {step === 2 && (
              <div className="space-y-7">
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

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-emerald-600" />

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Location preview
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
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
              <div className="space-y-7">
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

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Irrigation Available
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Does your farm have access to irrigation?
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateForm(
                          "irrigationAvailable",
                          !form.irrigationAvailable,
                        )
                      }
                      className={[
                        "relative h-7 w-12 rounded-full transition",
                        form.irrigationAvailable
                          ? "bg-emerald-500"
                          : "bg-slate-300",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition",
                          form.irrigationAvailable
                            ? "left-6"
                            : "left-1",
                        ].join(" ")}
                      />
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                  <div className="flex items-start gap-3">
                    <Leaf className="mt-0.5 h-5 w-5 text-emerald-600" />

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Farm registration
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        These details will be stored inside your
                        KisanSetu farmer profile and used for
                        procurement planning.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                STEP 4
            ================================================= */}

            {step === 4 && (
              <div className="space-y-7">
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
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
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

                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>

                  {centerOptions.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
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
                                "rounded-2xl border p-4 text-left transition",
                                selected
                                  ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-100"
                                  : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40",
                              ].join(" ")}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-slate-900">
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
                                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
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
                    <p className="mt-2 text-xs text-rose-500">
                      {errors.preferredCenterId}
                    </p>
                  )}
                </div>

                {/* Time Slots */}
                <div>
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-slate-900">
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
                              "rounded-xl border px-4 py-3 text-sm font-medium transition",
                              selected
                                ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50",
                            ].join(" ")}
                          >
                            {slot}
                          </button>
                        );
                      },
                    )}
                  </div>

                  {errors.preferredTimeSlot && (
                    <p className="mt-2 text-xs text-rose-500">
                      {errors.preferredTimeSlot}
                    </p>
                  )}
                </div>

                {/* Notifications */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-900">
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
                              "rounded-xl border px-4 py-3 text-sm font-medium transition",
                              selected
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-600",
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
              <div className="space-y-7">
                <SectionTitle
                  icon={<Banknote className="h-4 w-4" />}
                  title="Bank & DBT details"
                  description="Add your bank account for direct procurement payments."
                />

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                  <div className="flex items-start gap-3">
                    <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Secure DBT information
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Only the last four digits of your bank
                        account will be displayed in your farmer
                        profile.
                      </p>
                    </div>
                  </div>
                </div>

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
                  <p className="mb-3 text-sm font-semibold text-slate-900">
                    Supporting Documents
                  </p>

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
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Registration Summary
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Review your details before submitting.
                      </p>
                    </div>

                    <FileCheck2 className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {errors.submit}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <button
              type="button"
              onClick={
                step === 1
                  ? () => navigate("/")
                  : handleBack
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
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
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 active:scale-[0.99]"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
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

        {/* Security footer */}
        <div className="mx-auto mt-6 flex max-w-5xl items-center justify-center gap-2 text-center text-xs text-slate-400">
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
        {icon}

        <span className="text-xs font-bold uppercase tracking-[0.16em]">
          KisanSetu Registration
        </span>
      </div>

      <h3 className="mt-2 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
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
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-rose-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
            "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400",
            icon ? "pl-11" : "",
            error
              ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
            disabled
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "hover:border-slate-300",
          ].join(" ")}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-rose-500">
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
      <label className="mb-2 block text-sm font-semibold text-slate-700">
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
        rows={3}
        className={[
          "w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400",
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
        ].join(" ")}
      />

      {error && (
        <p className="mt-1.5 text-xs text-rose-500">
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
      <label className="mb-2 block text-sm font-semibold text-slate-700">
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
            "w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition",
            error
              ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
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
        <p className="mt-1.5 text-xs text-rose-500">
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
    <label className="group relative cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-white p-5 transition hover:border-emerald-300 hover:bg-emerald-50/50">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={onChange}
        className="sr-only"
      />

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-emerald-50 group-hover:text-emerald-600">
        {file ? (
          <FileCheck2 className="h-5 w-5 text-emerald-600" />
        ) : (
          <ImagePlus className="h-5 w-5" />
        )}
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-900">
        {title}
      </p>

      <p className="mt-1 truncate text-xs text-slate-500">
        {file ? file.name : description}
      </p>

      {!file && (
        <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
          Upload document
          <ArrowRight className="h-3 w-3" />
        </p>
      )}

      {file && (
        <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
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
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-[11px] uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
};

export default RegisterPage;