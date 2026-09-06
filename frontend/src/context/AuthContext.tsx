import { WEST_BENGAL_MANDIS } from "../data/mandiData";
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type {
  UserRole,
  UserProfile,
  QueueToken,
  ProcurementCenter,
  ProcurementSlot,
  QualityReport,
  VerificationMilestone,
  PaymentTransaction,
  AppNotification,
  CropType,
  DetailedFarmerProfile,
  CropDetail,
} from "../types";

import {
  INITIAL_USER_PROFILES,
  INITIAL_CENTERS,
  INITIAL_SLOTS,
  INITIAL_QUEUE_TOKENS,
  INITIAL_QUALITY_REPORT,
  INITIAL_VERIFICATION_MILESTONES,
  INITIAL_NOTIFICATIONS,
} from "../data/mockData";

/* =========================================================
   STORAGE HELPERS
========================================================= */

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    if (typeof window === "undefined") {
      return fallback;
    }

    const stored = localStorage.getItem(key);

    if (!stored) {
      return fallback;
    }

    return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    return fallback;
  }
};

const loadStorage = <T,>(key: string, fallback: T): T => {
  try {
    if (typeof window === "undefined") {
      return fallback;
    }

    const stored = localStorage.getItem(key);

    if (!stored) {
      return fallback;
    }

    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
};

const saveStorage = <T,>(key: string, value: T): void => {
  try {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore localStorage errors
  }
};

/* =========================================================
   MSP RATES
========================================================= */

export const MSP_RATES: Record<CropType, number> = {
  "Rice / Paddy": 2203,
  Wheat: 2275,
  Mustard: 5650,
  Maize: 2090,
  "Bengal Gram (Chana)": 5440,
  Cotton: 7020,
};

/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
  user: "kisansetu_user",
  role: "kisansetu_role",
  language: "kisansetu_language",
  registeredUsers: "kisansetu_registered_users",
  queueTokens: "kisansetu_queue_tokens_v3",
  slots: "kisansetu_slots_v3",
  centers: "kisansetu_centers_v3",
  payments: "kisansetu_payments_v3",
  notifications: "kisansetu_notifications_v3",
  milestones: "kisansetu_milestones_v3",
  currentCenter: "kisansetu_current_center",
};

/* =========================================================
   TRANSLATION
========================================================= */

interface TranslationFunction {
  (key: string): string;
  [key: string]: any;
}

const TRANSLATIONS: Record<"en" | "bn" | "hi", Record<string, string>> = {
  /* =======================================================
     ENGLISH
  ======================================================= */

  en: {
    navHome: "Home",
    navSchedule: "Schedule",
    navQueue: "Queue",
    navStatus: "Status",
    navPayments: "Payments",
    navOfficerPortal: "Officer Portal",
    navAdminPortal: "Admin Portal",

    heroBadge: "Smart Agricultural Procurement",

    heroTitle: "Fair Price.",

    heroTitleAccent: "Fair Process.",

    heroDescription:
      "KisanSetu connects farmers with transparent procurement centers, real-time queues, quality verification, and direct digital payments.",

    heroPrimaryButton: "Get Started",

    heroSecondaryButton: "Learn More",

    home: "Home",
    schedule: "Schedule",
    queue: "Queue",
    status: "Status",
    payments: "Payments",
    dashboard: "Dashboard",

    weather: "Weather",
    login: "Login",
    register: "Register",
    getStarted: "Get Started",
    logout: "Logout",
    profile: "Profile",
    notifications: "Notifications",

    farmer: "Farmer",
    farmerAccount: "Farmer Account",

    manageFarm: "Manage your farm information",

    mandiOfficer: "Mandi Officer",

    manageProcurement: "Manage procurement operations",

    adminConsole: "Admin Console",

    systemAdministration: "System administration",

    switchRole: "Switch Role",

    account: "Account",

    viewAccount: "View Account",

    registerFarmCrop: "Register Farm & Crop",

    updateFarmInformation: "Update farm information",

    logoutAccount: "Logout Account",

    signOutSecurely: "Sign out securely",

    noNotifications: "No notifications",

    unread: "Unread",

    primaryCrop: "Primary Crop",

    farmerDashboard: "Farmer Dashboard",

    welcomeBack: "Welcome back",

    bookSlot: "Book Slot",

    liveQueue: "Live Queue",

    procurementStatus: "Procurement Status",

    paymentStatus: "Payment Status",

    bookHarvestProcurementSlot: "Book Harvest Procurement Slot",

    selectCrop: "Select Crop",

    selectCenter: "Select Center",

    selectDate: "Select Date",

    selectTime: "Select Time",

    quantity: "Quantity",

    vehicleNumber: "Vehicle Number",

    confirmBooking: "Confirm Booking",

    cancel: "Cancel",

    available: "Available",

    fillingFast: "Filling Fast",

    full: "Full",

    closed: "Closed",

    tokenNumber: "Token Number",

    waiting: "Waiting",

    processing: "Processing",

    completed: "Completed",

    called: "Called",

    payment: "Payment",

    grossAmount: "Gross Amount",

    deductions: "Deductions",

    netPayable: "Net Payable",

    bankTransfer: "Bank Transfer",

    aiAssistant: "AI Assistant",

    askAi: "Ask AI",
  },

  /* =======================================================
     BENGALI
  ======================================================= */

  bn: {
    navHome: "হোম",
    navSchedule: "সময়সূচী",
    navQueue: "কিউ",
    navStatus: "স্ট্যাটাস",
    navPayments: "পেমেন্ট",
    navOfficerPortal: "অফিসার পোর্টাল",
    navAdminPortal: "অ্যাডমিন পোর্টাল",

    heroBadge: "স্মার্ট কৃষি সংগ্রহ ব্যবস্থা",

    heroTitle: "ন্যায্য মূল্য।",

    heroTitleAccent: "ন্যায্য প্রক্রিয়া।",

    heroDescription:
      "KisanSetu কৃষকদের স্বচ্ছ সংগ্রহ কেন্দ্র, রিয়েল-টাইম কিউ, গুণমান যাচাই এবং সরাসরি ডিজিটাল পেমেন্টের সাথে যুক্ত করে।",

    heroPrimaryButton: "শুরু করুন",

    heroSecondaryButton: "আরও জানুন",

    home: "হোম",
    schedule: "সময়সূচী",
    queue: "কিউ",
    status: "স্ট্যাটাস",
    payments: "পেমেন্ট",
    dashboard: "ড্যাশবোর্ড",

    weather: "আবহাওয়া",
    login: "লগইন",
    register: "রেজিস্টার",
    getStarted: "শুরু করুন",
    logout: "লগআউট",
    profile: "প্রোফাইল",
    notifications: "নোটিফিকেশন",

    farmer: "কৃষক",

    farmerAccount: "কৃষক অ্যাকাউন্ট",

    manageFarm: "আপনার খামারের তথ্য পরিচালনা করুন",

    mandiOfficer: "মান্ডি অফিসার",

    manageProcurement: "সংগ্রহ কার্যক্রম পরিচালনা করুন",

    adminConsole: "অ্যাডমিন কনসোল",

    systemAdministration: "সিস্টেম প্রশাসন",

    switchRole: "রোল পরিবর্তন করুন",

    account: "অ্যাকাউন্ট",

    viewAccount: "অ্যাকাউন্ট দেখুন",

    registerFarmCrop: "খামার ও ফসল নিবন্ধন করুন",

    updateFarmInformation: "খামারের তথ্য আপডেট করুন",

    logoutAccount: "অ্যাকাউন্ট থেকে লগআউট",

    signOutSecurely: "নিরাপদে সাইন আউট করুন",

    noNotifications: "কোনো নোটিফিকেশন নেই",

    unread: "অপঠিত",

    primaryCrop: "প্রধান ফসল",

    farmerDashboard: "কৃষক ড্যাশবোর্ড",

    welcomeBack: "আবার স্বাগতম",

    bookSlot: "স্লট বুক করুন",

    liveQueue: "লাইভ কিউ",

    procurementStatus: "সংগ্রহের স্ট্যাটাস",

    paymentStatus: "পেমেন্টের স্ট্যাটাস",

    bookHarvestProcurementSlot: "ফসল সংগ্রহের স্লট বুক করুন",

    selectCrop: "ফসল নির্বাচন করুন",

    selectCenter: "কেন্দ্র নির্বাচন করুন",

    selectDate: "তারিখ নির্বাচন করুন",

    selectTime: "সময় নির্বাচন করুন",

    quantity: "পরিমাণ",

    vehicleNumber: "গাড়ির নম্বর",

    confirmBooking: "বুকিং নিশ্চিত করুন",

    cancel: "বাতিল",

    available: "উপলব্ধ",

    fillingFast: "দ্রুত পূর্ণ হচ্ছে",

    full: "পূর্ণ",

    closed: "বন্ধ",

    tokenNumber: "টোকেন নম্বর",

    waiting: "অপেক্ষমাণ",

    processing: "প্রক্রিয়াধীন",

    completed: "সম্পন্ন",

    called: "ডাকা হয়েছে",

    payment: "পেমেন্ট",

    grossAmount: "মোট পরিমাণ",

    deductions: "কর্তন",

    netPayable: "প্রদেয় পরিমাণ",

    bankTransfer: "ব্যাংক ট্রান্সফার",

    aiAssistant: "AI সহকারী",

    askAi: "AI-কে জিজ্ঞাসা করুন",
  },

  /* =======================================================
     HINDI
  ======================================================= */

  hi: {
    navHome: "होम",
    navSchedule: "समय-सारणी",
    navQueue: "कतार",
    navStatus: "स्थिति",
    navPayments: "भुगतान",
    navOfficerPortal: "अधिकारी पोर्टल",
    navAdminPortal: "एडमिन पोर्टल",

    heroBadge: "स्मार्ट कृषि खरीद प्रणाली",

    heroTitle: "उचित मूल्य।",

    heroTitleAccent: "उचित प्रक्रिया।",

    heroDescription:
      "KisanSetu किसानों को पारदर्शी खरीद केंद्रों, रियल-टाइम कतार, गुणवत्ता सत्यापन और सीधे डिजिटल भुगतान से जोड़ता है।",

    heroPrimaryButton: "शुरू करें",

    heroSecondaryButton: "और जानें",

    home: "होम",
    schedule: "समय-सारणी",
    queue: "कतार",
    status: "स्थिति",
    payments: "भुगतान",
    dashboard: "डैशबोर्ड",

    weather: "मौसम",

    login: "लॉगिन",

    register: "रजिस्टर",

    getStarted: "शुरू करें",

    logout: "लॉगआउट",

    profile: "प्रोफ़ाइल",

    notifications: "सूचनाएं",

    farmer: "किसान",

    farmerAccount: "किसान खाता",

    manageFarm: "अपने खेत की जानकारी प्रबंधित करें",

    mandiOfficer: "मंडी अधिकारी",

    manageProcurement: "खरीद कार्यों का प्रबंधन करें",

    adminConsole: "एडमिन कंसोल",

    systemAdministration: "सिस्टम प्रशासन",

    switchRole: "भूमिका बदलें",

    account: "खाता",

    viewAccount: "खाता देखें",

    registerFarmCrop: "खेत और फसल पंजीकृत करें",

    updateFarmInformation: "खेत की जानकारी अपडेट करें",

    logoutAccount: "खाते से लॉगआउट",

    signOutSecurely: "सुरक्षित रूप से साइन आउट करें",

    noNotifications: "कोई सूचना नहीं",

    unread: "अपठित",

    primaryCrop: "मुख्य फसल",

    farmerDashboard: "किसान डैशबोर्ड",

    welcomeBack: "वापसी पर स्वागत है",

    bookSlot: "स्लॉट बुक करें",

    liveQueue: "लाइव कतार",

    procurementStatus: "खरीद स्थिति",

    paymentStatus: "भुगतान स्थिति",

    bookHarvestProcurementSlot: "फसल खरीद स्लॉट बुक करें",

    selectCrop: "फसल चुनें",

    selectCenter: "केंद्र चुनें",

    selectDate: "तारीख चुनें",

    selectTime: "समय चुनें",

    quantity: "मात्रा",

    vehicleNumber: "वाहन नंबर",

    confirmBooking: "बुकिंग की पुष्टि करें",

    cancel: "रद्द करें",

    available: "उपलब्ध",

    fillingFast: "जल्दी भर रहा है",

    full: "पूर्ण",

    closed: "बंद",

    tokenNumber: "टोकन नंबर",

    waiting: "प्रतीक्षा",

    processing: "प्रक्रिया में",

    completed: "पूर्ण",

    called: "बुलाया गया",

    payment: "भुगतान",

    grossAmount: "सकल राशि",

    deductions: "कटौती",

    netPayable: "शुद्ध देय राशि",

    bankTransfer: "बैंक ट्रांसफर",

    aiAssistant: "AI सहायक",

    askAi: "AI से पूछें",
  },
};

/* =========================================================
   CREATE TRANSLATION
========================================================= */

const createTranslation = (
  language: "en" | "bn" | "hi",
): TranslationFunction => {
  const selectedTranslations = TRANSLATIONS[language];

  const translations: Record<string, string> = {};

  Object.keys(selectedTranslations).forEach((key) => {
    translations[key] = selectedTranslations[key];
  });

  Object.keys(TRANSLATIONS.en).forEach((key) => {
    if (!translations[key]) {
      translations[key] = TRANSLATIONS.en[key];
    }
  });

  const translator: TranslationFunction = (key: string): string => {
    return translations[key] || key;
  };

  Object.keys(translations).forEach((key) => {
    translator[key] = translations[key];
  });

  return translator;
};

/* =========================================================
   REGISTER USER DATA
========================================================= */

interface RegisterUserData {
  role: UserRole;

  name: string;
  phone: string;

  email?: string;
  aadhaarNumber?: string;
  govtIdType?: DetailedFarmerProfile["govtIdType"];
  maskedGovtId?: string;
  dob?: string;
  gender?: DetailedFarmerProfile["gender"];
  preferredLanguage?: "en" | "bn" | "hi";

  addressLine?: string;
  village?: string;
  block?: string;
  district?: string;
  state?: string;
  pinCode?: string;

  farmerId?: string;
  farmerRegistrationNumber?: string;
  farmName?: string;
  farmLocation?: string;
  landAcres?: number;
  totalLandArea?: number;
  landUnit?: DetailedFarmerProfile["landUnit"];
  ownershipType?: DetailedFarmerProfile["ownershipType"];
  irrigationAvailable?: boolean;
  soilType?: string;

  primaryCrop?: CropType;
  crops?: CropDetail[];
  cropVariety?: string;
  cropSeason?: CropDetail["season"];
  expectedQuantityQuintals?: number;
  harvestDate?: string;
  expectedProcurementDate?: string;

  preferredCenterId?: string;
  preferredTimeSlot?: string;
  preferredNotificationMethod?: DetailedFarmerProfile["preferredNotificationMethod"];

  bankName?: string;
  bankAccountLast4?: string;
  ifscCode?: string;

  detailedProfile?: Partial<DetailedFarmerProfile>;
}

/* =========================================================
   AUTH CONTEXT TYPE
========================================================= */

interface AuthContextType {
  user: UserProfile | null;

  role: UserRole;

  isAuthenticated: boolean;

  language: "en" | "bn" | "hi";

  t: TranslationFunction;

  setLanguage(language: "en" | "bn" | "hi"): void;

  switchRole(newRole: UserRole): void;

  loginWithProfile(
    role: UserRole,
    profileData?: Partial<UserProfile>,
  ): void;

  updateUserProfile(profileData: Partial<UserProfile>): void;

  registerUser(data: RegisterUserData): UserProfile;

  getRegisteredUserByPhone(
    phone: string,
  ): UserProfile | undefined;

  registeredUsers: UserProfile[];

  logout(): void;

  centers: ProcurementCenter[];

  slots: ProcurementSlot[];

  queueTokens: QueueToken[];

  currentCenterId: string;

  setCurrentCenterId(id: string): void;

  qualityReport: QualityReport;

  milestones: VerificationMilestone[];

  payments: PaymentTransaction[];

  notifications: AppNotification[];

  bookNewSlot(slotData: {
    centerId: string;
    crop: CropType;
    date: string;
    timeWindow: string;
    quantityQuintals: number;
    vehicleNumber?: string;
  }): QueueToken;

  callNextToken(): void;

  completeInspection(
    tokenNumber: number,
    grade: QualityReport["grade"],
    moisturePercent: number,
    notes: string,
  ): void;

  approveProcurementAndWeigh(
    tokenNumber: number,
    finalWeight: number,
  ): void;

  markNotificationRead(notificationId: string): void;

  markAllNotificationsRead(): void;

  deleteNotification(notificationId: string): void;

  playQueueAnnouncement(tokenNumber: number): void;
}

/* =========================================================
   CONTEXT
========================================================= */

const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

/* =========================================================
   PROVIDER
========================================================= */

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  /* =======================================================
     USER
  ======================================================= */

  const [user, setUser] =
    useState<UserProfile | null>(() =>
      loadStorage<UserProfile | null>(
        STORAGE_KEYS.user,
        null,
      ),
    );

  /* =======================================================
     ROLE
  ======================================================= */

  const [role, setRole] =
    useState<UserRole>(() =>
      loadStorage<UserRole>(
        STORAGE_KEYS.role,
        "farmer",
      ),
    );

  /* =======================================================
     LANGUAGE
  ======================================================= */

  const [language, setLanguageState] =
    useState<"en" | "bn" | "hi">(() =>
      loadStorage<"en" | "bn" | "hi">(
        STORAGE_KEYS.language,
        "en",
      ),
    );

  /* =======================================================
     REGISTERED USERS
  ======================================================= */

  const [registeredUsers, setRegisteredUsers] =
    useState<UserProfile[]>(() =>
      loadStorage<UserProfile[]>(
        STORAGE_KEYS.registeredUsers,
        [],
      ),
    );

  /* =======================================================
     CENTERS
  ======================================================= */

  const [centers, setCenters] =
    useState<ProcurementCenter[]>(() => {
      const storedCenters =
        loadFromStorage<ProcurementCenter[]>(
          STORAGE_KEYS.centers,
          [],
        );

      const existingCenters = [
        ...INITIAL_CENTERS,
        ...storedCenters,
      ];

      const existingIds = new Set(
        existingCenters.map(
          (center) => center.id,
        ),
      );

      const additionalMandis =
        WEST_BENGAL_MANDIS.filter(
          (center) =>
            !existingIds.has(center.id),
        );

      return [
        ...existingCenters,
        ...additionalMandis,
      ];
    });

  /* =======================================================
     SLOTS
  ======================================================= */

  const [slots, setSlots] =
    useState<ProcurementSlot[]>(() =>
      loadStorage<ProcurementSlot[]>(
        STORAGE_KEYS.slots,
        INITIAL_SLOTS,
      ),
    );

  /* =======================================================
     QUEUE TOKENS
  ======================================================= */

  const [queueTokens, setQueueTokens] =
    useState<QueueToken[]>(() =>
      loadStorage<QueueToken[]>(
        STORAGE_KEYS.queueTokens,
        INITIAL_QUEUE_TOKENS,
      ),
    );

  /* =======================================================
     QUALITY REPORT
  ======================================================= */

  const [qualityReport, setQualityReport] =
    useState<QualityReport>(
      INITIAL_QUALITY_REPORT,
    );

  /* =======================================================
     MILESTONES
  ======================================================= */

  const [milestones, setMilestones] =
    useState<VerificationMilestone[]>(() =>
      loadStorage<VerificationMilestone[]>(
        STORAGE_KEYS.milestones,
        INITIAL_VERIFICATION_MILESTONES,
      ),
    );

  /* =======================================================
     PAYMENTS
     
     IMPORTANT:
     Do NOT use INITIAL_PAYMENTS here.
     This prevents fake demo payments such as
     SBI / ₹55,000 from automatically appearing.
  ======================================================= */

  const [payments, setPayments] =
    useState<PaymentTransaction[]>(() =>
      loadStorage<PaymentTransaction[]>(
        STORAGE_KEYS.payments,
        [],
      ),
    );

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const [notifications, setNotifications] =
    useState<AppNotification[]>(() =>
      loadStorage<AppNotification[]>(
        STORAGE_KEYS.notifications,
        INITIAL_NOTIFICATIONS,
      ),
    );

  /* =======================================================
     CURRENT CENTER
  ======================================================= */

  const [currentCenterId, setCurrentCenterIdState] =
    useState<string>(() =>
      loadStorage<string>(
        STORAGE_KEYS.currentCenter,
        INITIAL_CENTERS[0]?.id || "",
      ),
    );

  /* =======================================================
     TRANSLATION
  ======================================================= */

  const t = createTranslation(language);

  const setLanguage = (
    newLanguage: "en" | "bn" | "hi",
  ): void => {
    setLanguageState(newLanguage);

    saveStorage(
      STORAGE_KEYS.language,
      newLanguage,
    );
  };

  /* =========================================================
     REGISTER USER
  ========================================================= */

  const registerUser = (
    data: RegisterUserData,
  ): UserProfile => {
    const {
      role: newRole,
      name,
      phone,
      email,
      aadhaarNumber,
      govtIdType,
      maskedGovtId,
      dob,
      gender,
      preferredLanguage,
      addressLine,
      village,
      block,
      district,
      state,
      pinCode,
      farmerId,
      farmerRegistrationNumber,
      farmName,
      farmLocation,
      landAcres,
      totalLandArea,
      landUnit,
      ownershipType,
      irrigationAvailable,
      soilType,
      primaryCrop,
      crops,
      cropVariety,
      cropSeason,
      expectedQuantityQuintals,
      harvestDate,
      expectedProcurementDate,
      preferredCenterId,
      preferredTimeSlot,
      preferredNotificationMethod,
      bankName,
      bankAccountLast4,
      ifscCode,
      detailedProfile:
        suppliedDetailedProfile,
    } = data;

    const baseProfile =
      INITIAL_USER_PROFILES[newRole] ||
      INITIAL_USER_PROFILES.farmer;

    const cleanPhone =
      phone?.trim() ||
      baseProfile.phone ||
      "";

    const existingProfile =
      registeredUsers.find(
        (registeredUser) =>
          registeredUser.phone === cleanPhone,
      );

    const generatedId =
      existingProfile?.id ||
      `${
        newRole === "farmer"
          ? "FARM"
          : "USER"
      }-${Date.now()
        .toString()
        .slice(-6)}`;

    const cleanName =
      name?.trim() ||
      existingProfile?.name ||
      baseProfile.name ||
      "KisanSetu User";

    const cleanAadhaar =
      aadhaarNumber
        ?.replace(/\s+/g, "")
        .trim() ||
      existingProfile?.aadhaarNumber ||
      "";

    const cleanPrimaryCrop =
      primaryCrop ||
      existingProfile?.primaryCrop ||
      baseProfile.primaryCrop ||
      "Rice / Paddy";

    const cleanLandAcres =
      Number(
        landAcres ??
          totalLandArea ??
          existingProfile?.landAcres,
      ) || 0;

    const cleanAccountLast4 =
      bankAccountLast4
        ?.replace(/\D/g, "")
        .slice(-4) ||
      existingProfile?.bankAccountLast4 ||
      baseProfile.bankAccountLast4 ||
      "";

    const cleanBankName =
      bankName?.trim() ||
      existingProfile?.bankName ||
      baseProfile.bankName ||
      "";

    const cleanEmail =
      email?.trim() ||
      existingProfile?.email ||
      baseProfile.email ||
      "";

    const cleanVillage =
      village?.trim() ||
      existingProfile?.village ||
      baseProfile.village ||
      "";

    const cleanBlock =
      block?.trim() ||
      existingProfile?.block ||
      "";

    const cleanDistrict =
      district?.trim() ||
      existingProfile?.district ||
      baseProfile.district ||
      "";

    const cleanState =
      state?.trim() ||
      existingProfile?.state ||
      "West Bengal";

    const cleanPinCode =
      pinCode?.trim() ||
      existingProfile?.pinCode ||
      "";

    const cleanFarmerId =
      farmerId?.trim() ||
      existingProfile?.detailedProfile
        ?.farmerId ||
      generatedId;

    const cleanRegistrationNumber =
      farmerRegistrationNumber?.trim() ||
      existingProfile?.detailedProfile
        ?.farmerRegistrationNumber ||
      `KS-${new Date().getFullYear()}-${cleanFarmerId.replace(
        /\W/g,
        "",
      )}`;

    const normalizedAadhaarLast4 =
      cleanAadhaar.length >= 4
        ? cleanAadhaar.slice(-4)
        : existingProfile?.aadhaarLast4 ||
          "";

    const normalizedMaskedGovtId =
      maskedGovtId?.trim() ||
      (normalizedAadhaarLast4
        ? `XXXX XXXX ${normalizedAadhaarLast4}`
        : existingProfile?.detailedProfile
            ?.maskedGovtId || "");

    const existingCrops =
      existingProfile?.detailedProfile
        ?.crops || [];

    const normalizedCrops: CropDetail[] =
      crops && crops.length > 0
        ? crops
        : existingCrops.length > 0
          ? existingCrops
          : [
              {
                id: `CROP-${Date.now()}`,
                cropName: cleanPrimaryCrop,
                variety:
                  cropVariety?.trim() || "",
                season:
                  cropSeason || "Kharif",
                expectedQuantityQuintals:
                  Number(
                    expectedQuantityQuintals,
                  ) || 0,
                harvestDate:
                  harvestDate || "",
                expectedProcurementDate:
                  expectedProcurementDate ||
                  "",
              },
            ];

    const existingDetailed =
      existingProfile?.detailedProfile;

    const detailed: DetailedFarmerProfile = {
      ...(existingDetailed || {}),

      ...(suppliedDetailedProfile || {}),

      farmerId: cleanFarmerId,

      fullName: cleanName,

      dob:
        dob ||
        existingDetailed?.dob ||
        "",

      gender:
        gender ||
        existingDetailed?.gender ||
        "Male",

      preferredLanguage:
        preferredLanguage ||
        existingDetailed?.preferredLanguage ||
        language,

      mobileNumber: cleanPhone,

      email: cleanEmail,

      addressLine:
        addressLine?.trim() ||
        existingDetailed?.addressLine ||
        "",

      village: cleanVillage,

      block: cleanBlock,

      district: cleanDistrict,

      state: cleanState,

      pinCode: cleanPinCode,

      govtIdType:
        govtIdType ||
        existingDetailed?.govtIdType ||
        "Aadhaar Card",

      maskedGovtId:
        normalizedMaskedGovtId,

      farmerRegistrationNumber:
        cleanRegistrationNumber,

      verificationStatus:
        existingDetailed?.verificationStatus ||
        "Pending Verification",

      verificationDate:
        existingDetailed?.verificationDate ||
        "",

      farmName:
        farmName?.trim() ||
        existingDetailed?.farmName ||
        `${cleanName}'s Farm`,

      farmLocation:
        farmLocation?.trim() ||
        existingDetailed?.farmLocation ||
        [
          cleanVillage,
          cleanBlock,
          cleanDistrict,
        ]
          .filter(Boolean)
          .join(", "),

      totalLandArea: cleanLandAcres,

      landUnit:
        landUnit ||
        existingDetailed?.landUnit ||
        "Acres",

      ownershipType:
        ownershipType ||
        existingDetailed?.ownershipType ||
        "Owned",

      irrigationAvailable:
        irrigationAvailable ??
        existingDetailed?.irrigationAvailable ??
        false,

      soilType:
        soilType?.trim() ||
        existingDetailed?.soilType ||
        "",

      crops: normalizedCrops,

      preferredCenterId:
        preferredCenterId ||
        existingDetailed?.preferredCenterId ||
        existingProfile?.assignedCenterId ||
        centers[0]?.id ||
        "",

      preferredTimeSlot:
        preferredTimeSlot ||
        existingDetailed?.preferredTimeSlot ||
        "",

      preferredNotificationMethod:
        preferredNotificationMethod ||
        existingDetailed?.preferredNotificationMethod ||
        "SMS & WhatsApp",

      completionPercentage: 0,
    };

    const profileFields = [
      cleanName,
      cleanPhone,
      cleanEmail,
      cleanAadhaar,
      cleanVillage,
      cleanBlock,
      cleanDistrict,
      cleanPinCode,
      cleanLandAcres > 0
        ? cleanLandAcres
        : "",
      cleanBankName,
      cleanAccountLast4,
      detailed.farmName,
      detailed.preferredCenterId,
      detailed.preferredTimeSlot,
    ];

    detailed.completionPercentage =
      Math.round(
        (profileFields.filter(Boolean)
          .length /
          profileFields.length) *
          100,
      );

    const newProfile: UserProfile = {
      ...baseProfile,

      ...(existingProfile || {}),

      id: generatedId,

      role: newRole,

      name: cleanName,

      phone: cleanPhone,

      email: cleanEmail,

      aadhaarNumber: cleanAadhaar,

      aadhaarLast4:
        normalizedAadhaarLast4,

      primaryCrop: cleanPrimaryCrop,

      village: cleanVillage,

      block: cleanBlock,

      district: cleanDistrict,

      state: cleanState,

      pinCode: cleanPinCode,

      landAcres: cleanLandAcres,

      bankName: cleanBankName,

      bankAccountLast4:
        cleanAccountLast4,

      ifscCode:
        ifscCode?.trim() ||
        existingProfile?.ifscCode ||
        "",

      assignedCenterId:
        preferredCenterId ||
        existingProfile?.assignedCenterId ||
        detailed.preferredCenterId,

      assignedCenterName:
        centers.find(
          (center) =>
            center.id ===
            (preferredCenterId ||
              existingProfile?.assignedCenterId ||
              detailed.preferredCenterId),
        )?.name ||
        existingProfile?.assignedCenterName,

      detailedProfile: detailed,
    };

    setRegisteredUsers((previous) => {
      const updated = [
        ...previous.filter(
          (registeredUser) =>
            registeredUser.phone !==
              newProfile.phone &&
            registeredUser.id !==
              newProfile.id,
        ),

        newProfile,
      ];

      saveStorage(
        STORAGE_KEYS.registeredUsers,
        updated,
      );

      return updated;
    });

    setUser(newProfile);

    setRole(newRole);

    saveStorage(
      STORAGE_KEYS.user,
      newProfile,
    );

    saveStorage(
      STORAGE_KEYS.role,
      newRole,
    );

    if (
      preferredLanguage &&
      preferredLanguage !== language
    ) {
      setLanguageState(
        preferredLanguage,
      );

      saveStorage(
        STORAGE_KEYS.language,
        preferredLanguage,
      );
    }

    return newProfile;
  };

  /* =========================================================
     LOGIN
  ========================================================= */

  const loginWithProfile = (
    loginRole: UserRole,
    profileData: Partial<UserProfile> = {},
  ): void => {
    registerUser({
      role: loginRole,

      name:
        profileData.name ||
        "KisanSetu User",

      phone:
        profileData.phone || "",

      aadhaarNumber:
        profileData.aadhaarNumber,

      village:
        profileData.village,

      district:
        profileData.district,

      landAcres:
        profileData.landAcres,

      primaryCrop:
        profileData.primaryCrop,

      bankName:
        profileData.bankName,

      bankAccountLast4:
        profileData.bankAccountLast4,
    });
  };

  /* =========================================================
     UPDATE USER PROFILE
  ========================================================= */

  const updateUserProfile = (
    profileData: Partial<UserProfile>,
  ): void => {
    if (!user) {
      return;
    }

    const updatedUser: UserProfile = {
      ...user,
      ...profileData,
    };

    setUser(updatedUser);

    saveStorage(
      STORAGE_KEYS.user,
      updatedUser,
    );

    setRegisteredUsers((previous) => {
      const updated = previous.map(
        (registeredUser) =>
          registeredUser.id ===
          updatedUser.id
            ? updatedUser
            : registeredUser,
      );

      saveStorage(
        STORAGE_KEYS.registeredUsers,
        updated,
      );

      return updated;
    });
  };

  /* =========================================================
     GET REGISTERED USER BY PHONE
  ========================================================= */

  const getRegisteredUserByPhone = (
    phone: string,
  ): UserProfile | undefined => {
    return registeredUsers.find(
      (registeredUser) =>
        registeredUser.phone === phone,
    );
  };

  /* =========================================================
     SWITCH ROLE
  ========================================================= */

  const switchRole = (
    newRole: UserRole,
  ): void => {
    const baseProfile =
      INITIAL_USER_PROFILES[newRole] ||
      INITIAL_USER_PROFILES.farmer;

    const switchedUser: UserProfile = {
      ...baseProfile,

      ...(user || {}),

      role: newRole,
    };

    setRole(newRole);

    setUser(switchedUser);

    saveStorage(
      STORAGE_KEYS.role,
      newRole,
    );

    saveStorage(
      STORAGE_KEYS.user,
      switchedUser,
    );
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = (): void => {
    setUser(null);

    setRole("farmer");

    if (typeof window !== "undefined") {
      localStorage.removeItem(
        STORAGE_KEYS.user,
      );

      localStorage.removeItem(
        STORAGE_KEYS.role,
      );
    }
  };

  /* =========================================================
     CURRENT CENTER
  ========================================================= */

  const setCurrentCenterId = (
    id: string,
  ): void => {
    setCurrentCenterIdState(id);

    saveStorage(
      STORAGE_KEYS.currentCenter,
      id,
    );
  };

  /* =========================================================
     BOOK NEW SLOT
  ========================================================= */

  const bookNewSlot = (slotData: {
    centerId: string;
    crop: CropType;
    date: string;
    timeWindow: string;
    quantityQuintals: number;
    vehicleNumber?: string;
  }): QueueToken => {
    if (!user) {
      throw new Error(
        "You must be logged in to book a slot.",
      );
    }

    /* =====================================================
       FIND CENTER
    ===================================================== */

    const center = centers.find(
      (item) =>
        item.id === slotData.centerId,
    );

    if (!center) {
      throw new Error(
        "Procurement center not found.",
      );
    }

    /* =====================================================
       FIND EXISTING SLOT
    ===================================================== */

    let selectedSlot =
      slots.find(
        (slot) =>
          slot.centerId ===
            slotData.centerId &&
          slot.crop === slotData.crop &&
          slot.date === slotData.date &&
          slot.timeWindow ===
            slotData.timeWindow,
      );

    /* =====================================================
       CREATE SLOT IF NEEDED
    ===================================================== */

    if (!selectedSlot) {
      const templateSlot =
        slots.find(
          (slot) =>
            slot.centerId ===
              slotData.centerId &&
            slot.crop ===
              slotData.crop,
        ) ||
        slots.find(
          (slot) =>
            slot.centerId ===
            slotData.centerId,
        ) ||
        slots[0];

      if (!templateSlot) {
        throw new Error(
          "Unable to create a procurement schedule because no slot template exists.",
        );
      }

      const newSlot: ProcurementSlot = {
        ...templateSlot,

        id: `SLOT-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,

        centerId: center.id,

        centerName: center.name,

        district: center.district,

        crop: slotData.crop,

        date: slotData.date,

        timeWindow:
          slotData.timeWindow,

        bookedSlots: 0,

        bookedCapacityQuintals: 0,

        status: "available",

        mspRatePerQuintal:
          MSP_RATES[slotData.crop],
      };

      selectedSlot = newSlot;

      setSlots((previous) => {
        const updated = [
          ...previous,
          newSlot,
        ];

        saveStorage(
          STORAGE_KEYS.slots,
          updated,
        );

        return updated;
      });
    }

    /* =====================================================
       CHECK SLOT STATUS
    ===================================================== */

    if (
      selectedSlot.status === "full" ||
      selectedSlot.status === "closed"
    ) {
      throw new Error(
        "This procurement slot is full or closed.",
      );
    }

    /* =====================================================
       QUANTITY
    ===================================================== */

    const quantity = Math.max(
      1,
      Math.min(
        500,
        Number(
          slotData.quantityQuintals,
        ) || 1,
      ),
    );

    /* =====================================================
       CAPACITY
    ===================================================== */

    const remainingCapacity =
      selectedSlot.totalCapacityQuintals -
      selectedSlot.bookedCapacityQuintals;

    if (
      quantity > remainingCapacity
    ) {
      throw new Error(
        `Only ${remainingCapacity} quintals capacity is available for this slot.`,
      );
    }

    /* =====================================================
       SLOT COUNT
    ===================================================== */

    if (
      selectedSlot.bookedSlots >=
      selectedSlot.totalSlots
    ) {
      throw new Error(
        "No booking slots are available.",
      );
    }

    /* =====================================================
       MSP
    ===================================================== */

    const mspRate =
      selectedSlot.mspRatePerQuintal ||
      MSP_RATES[slotData.crop];

    const estimatedValue =
      quantity * mspRate;

    /* =====================================================
       TOKEN NUMBER
    ===================================================== */

    const maxTokenNumber =
      queueTokens.reduce(
        (maximum, token) =>
          Math.max(
            maximum,
            Number(
              token.tokenNumber,
            ) || 0,
          ),
        23,
      );

    const tokenNumber =
      maxTokenNumber + 1;

    /* =====================================================
       WAIT TIME
    ===================================================== */

    const estimatedWait =
      Math.max(
        0,
        (tokenNumber -
          center.currentServingToken) *
          center.averageProcessingTimeMinutes,
      );

    /* =====================================================
       CREATE TOKEN
    ===================================================== */

    const token: QueueToken = {
      id: `QUEUE-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,

      tokenNumber,

      tokenCode: `HAR-${String(
        tokenNumber,
      ).padStart(3, "0")}`,

      farmerId: user.id,

      farmerName: user.name,

      farmerPhone: user.phone,

      village:
        user.village ||
        user.detailedProfile?.village ||
        "",

      centerId: center.id,

      centerName: center.name,

      crop: slotData.crop,

      quantityQuintals: quantity,

      date: slotData.date,

      timeWindow:
        slotData.timeWindow,

      slotTime:
        slotData.timeWindow,

      vehicleNumber:
        slotData.vehicleNumber || "",

      status: "waiting",

      estimatedWaitMinutes:
        estimatedWait,

      mspRate,

      estimatedValue,

      createdAt:
        new Date().toISOString(),
    };

    /* =====================================================
       UPDATE QUEUE
    ===================================================== */

    setQueueTokens((previous) => {
      const updated = [
        ...previous,
        token,
      ];

      saveStorage(
        STORAGE_KEYS.queueTokens,
        updated,
      );

      return updated;
    });

    /* =====================================================
       CURRENT CENTER
    ===================================================== */

    setCurrentCenterIdState(
      center.id,
    );

    saveStorage(
      STORAGE_KEYS.currentCenter,
      center.id,
    );

    /* =====================================================
       UPDATE SLOT
    ===================================================== */

    setSlots((previous) => {
      const updated = previous.map(
        (
          slot,
        ): ProcurementSlot => {
          if (
            slot.id !==
            selectedSlot!.id
          ) {
            return slot;
          }

          const bookedSlots =
            slot.bookedSlots + 1;

          const bookedCapacityQuintals =
            slot.bookedCapacityQuintals +
            quantity;

          let status: ProcurementSlot["status"] =
            "available";

          if (
            bookedCapacityQuintals >=
              slot.totalCapacityQuintals ||
            bookedSlots >=
              slot.totalSlots
          ) {
            status = "full";
          } else if (
            bookedCapacityQuintals >=
              slot.totalCapacityQuintals *
                0.75 ||
            bookedSlots >=
              slot.totalSlots * 0.75
          ) {
            status = "filling_fast";
          }

          return {
            ...slot,

            bookedSlots,

            bookedCapacityQuintals,

            status,
          };
        },
      );

      saveStorage(
        STORAGE_KEYS.slots,
        updated,
      );

      return updated;
    });

    /* =====================================================
       UPDATE CENTER
    ===================================================== */

    setCenters((previous) => {
      const updated = previous.map(
        (
          item,
        ): ProcurementCenter =>
          item.id === center.id
            ? {
                ...item,

                totalQueueWaiting:
                  item.totalQueueWaiting +
                  1,

                availableSlotsToday:
                  Math.max(
                    0,
                    item.availableSlotsToday -
                      1,
                  ),
              }
            : item,
      );

      saveStorage(
        STORAGE_KEYS.centers,
        updated,
      );

      return updated;
    });

    /* =====================================================
       UPDATE MILESTONE
    ===================================================== */

    setMilestones((previous) => {
      const now =
        new Date().toISOString();

      const updated =
        previous.map<VerificationMilestone>(
          (milestone) => {
            if (
              milestone.stage ===
              "slot_booked"
            ) {
              return {
                ...milestone,

                status: "completed",

                timestamp: now,

                officerNote: `Slot ${token.tokenCode} booked successfully.`,
              };
            }

            return milestone;
          },
        );

      saveStorage(
        STORAGE_KEYS.milestones,
        updated,
      );

      return updated;
    });

    /* =====================================================
       NOTIFICATION
    ===================================================== */

    const notification: AppNotification =
      {
        id: `NOTIF-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,

        type: "slot",

        title:
          "Procurement Slot Booked",

        message: `Token ${token.tokenCode} booked successfully. Estimated value ₹${Math.round(
          estimatedValue,
        ).toLocaleString("en-IN")}.`,

        timestamp:
          new Date().toISOString(),

        read: false,

        badge:
          "BOOKING CONFIRMED",
      };

    setNotifications((previous) => {
      const updated = [
        notification,
        ...previous,
      ];

      saveStorage(
        STORAGE_KEYS.notifications,
        updated,
      );

      return updated;
    });

    return token;
  };

  /* =========================================================
     CALL NEXT TOKEN
  ========================================================= */

  const callNextToken = (): void => {
    const center =
      centers.find(
        (item) =>
          item.id === currentCenterId,
      ) || centers[0];

    if (!center) {
      return;
    }

    const nextTokenNumber =
      center.currentServingToken + 1;

    let calledToken:
      | QueueToken
      | undefined;

    setQueueTokens((previous) => {
      const updated = previous.map(
        (token): QueueToken => {
          const tokenCenterId =
            token.centerId ||
            "CTR-001";

          if (
            tokenCenterId === center.id &&
            token.tokenNumber ===
              nextTokenNumber &&
            token.status === "waiting"
          ) {
            const updatedToken: QueueToken =
              {
                ...token,

                status: "called",

                calledAt:
                  new Date().toISOString(),

                estimatedWaitMinutes: 0,
              };

            calledToken =
              updatedToken;

            return updatedToken;
          }

          return token;
        },
      );

      saveStorage(
        STORAGE_KEYS.queueTokens,
        updated,
      );

      return updated;
    });

    setCenters((previous) => {
      const updated = previous.map(
        (
          item,
        ): ProcurementCenter =>
          item.id === center.id
            ? {
                ...item,

                currentServingToken:
                  nextTokenNumber,

                totalQueueWaiting:
                  Math.max(
                    0,
                    item.totalQueueWaiting -
                      (calledToken
                        ? 1
                        : 0),
                  ),
              }
            : item,
      );

      saveStorage(
        STORAGE_KEYS.centers,
        updated,
      );

      return updated;
    });

    if (calledToken) {
      const notification: AppNotification =
        {
          id: `NOTIF-CALL-${Date.now()}`,

          type: "queue",

          title:
            "Your Token Is Called",

          message: `Token ${calledToken.tokenCode}, please proceed to the procurement counter.`,

          timestamp:
            new Date().toISOString(),

          read: false,

          badge: "YOUR TURN",
        };

      setNotifications(
        (previous) => {
          const updated = [
            notification,
            ...previous,
          ];

          saveStorage(
            STORAGE_KEYS.notifications,
            updated,
          );

          return updated;
        },
      );
    }
  };

  /* =========================================================
     COMPLETE INSPECTION
  ========================================================= */

  const completeInspection = (
    tokenNumber: number,
    grade: QualityReport["grade"],
    moisturePercent: number,
    notes: string,
  ): void => {
    const token =
      queueTokens.find(
        (item) =>
          item.tokenNumber ===
          tokenNumber,
      );

    if (!token) {
      return;
    }

    const now =
      new Date().toISOString();

    const updatedReport: QualityReport =
      {
        ...qualityReport,

        sampleId: `SMP-2026-${tokenNumber}`,

        testedAt: now,

        moisturePercent,

        grade,

        passed:
          grade !== "Rejected",

        notes,
      };

    setQualityReport(
      updatedReport,
    );

    let tokenGrade:
      | "Grade A"
      | "Grade B"
      | "Standard"
      | "Pending" = "Pending";

    if (grade === "Grade A") {
      tokenGrade = "Grade A";
    } else if (grade === "Grade B") {
      tokenGrade = "Grade B";
    } else if (
      grade === "Standard"
    ) {
      tokenGrade = "Standard";
    }

    /* =====================================================
       UPDATE TOKEN
    ===================================================== */

    setQueueTokens((previous) => {
      const updated = previous.map(
        (
          item,
        ): QueueToken =>
          item.tokenNumber ===
          tokenNumber
            ? {
                ...item,

                qualityGrade:
                  tokenGrade,

                moisturePercent,
              }
            : item,
      );

      saveStorage(
        STORAGE_KEYS.queueTokens,
        updated,
      );

      return updated;
    });

    /* =====================================================
       UPDATE MILESTONE
    ===================================================== */

    setMilestones((previous) => {
      const updated =
        previous.map<VerificationMilestone>(
          (milestone) => {
            if (
              milestone.stage ===
              "lab_verification"
            ) {
              return {
                ...milestone,

                status:
                  grade === "Rejected"
                    ? "rejected"
                    : "completed",

                timestamp: now,

                officerNote: notes,
              };
            }

            return milestone;
          },
        );

      saveStorage(
        STORAGE_KEYS.milestones,
        updated,
      );

      return updated;
    });

    /* =====================================================
       NOTIFICATION
    ===================================================== */

    const notification: AppNotification =
      {
        id: `NOTIF-LAB-${Date.now()}`,

        type: "verification",

        title:
          grade === "Rejected"
            ? "Quality Test Failed"
            : "Crop Quality Test Completed",

        message: `Token ${token.tokenCode} quality inspection completed with ${grade} and ${moisturePercent}% moisture.`,

        timestamp: now,

        read: false,

        badge:
          grade === "Rejected"
            ? "REJECTED"
            : "LAB TEST",
      };

    setNotifications((previous) => {
      const updated = [
        notification,
        ...previous,
      ];

      saveStorage(
        STORAGE_KEYS.notifications,
        updated,
      );

      return updated;
    });
  };

  /* =========================================================
     APPROVE PROCUREMENT + WEIGH

     IMPORTANT PAYMENT LOGIC:

     FINAL PAYMENT =
     FINAL WEIGHBRIDGE WEIGHT × MSP

     Example:
     23.5 quintals × ₹2203
     = ₹51,770.50
  ========================================================= */

  const approveProcurementAndWeigh = (
    tokenNumber: number,
    finalWeight: number,
  ): void => {
    const token =
      queueTokens.find(
        (item) =>
          item.tokenNumber ===
          tokenNumber,
      );

    if (!token) {
      return;
    }

    const safeWeight = Math.max(
      0,
      Number(finalWeight) || 0,
    );

    const mspRate =
      token.mspRate ??
      MSP_RATES[token.crop];

    const grossAmount =
      safeWeight * mspRate;

    const deductions = 0;

    const netPayable =
      grossAmount - deductions;

    /* =====================================================
       FIND FARMER BANK DETAILS
    ===================================================== */

    const farmer =
      registeredUsers.find(
        (item) =>
          item.id ===
          token.farmerId,
      ) ||
      (user?.id === token.farmerId
        ? user
        : undefined);

    /* =====================================================
       FIND CENTER
    ===================================================== */

    const centerForToken =
      centers.find(
        (center) =>
          center.id ===
          token.centerId,
      );

    const now = new Date();

    const procuredDate =
      now
        .toISOString()
        .split("T")[0] ?? "";

    const estimatedReleaseDate =
      new Date(
        now.getTime() +
          2 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split("T")[0] ?? "";

    /* =====================================================
       CREATE PAYMENT
    ===================================================== */

    const payment: PaymentTransaction =
      {
        id: `PAY-${Date.now()}`,

        transactionId:
          `TXN-KSETU-${Date.now()}`,

        pfmsReferenceNo:
          `PFMS/WB/${now.getFullYear()}/${Date.now()
            .toString()
            .slice(-8)}`,

        farmerId:
          token.farmerId,

        farmerName:
          token.farmerName,

        tokenNumber:
          token.tokenNumber,

        centerName:
          token.centerName ??
          centerForToken?.name ??
          "Procurement Center",

        crop: token.crop,

        grossWeightQuintals:
          safeWeight,

        mspRatePerQuintal:
          mspRate,

        grossAmount,

        deductions,

        netPayable,

        status: "Initiated",

        statusStageIndex: 0,

        bankName:
          farmer?.bankName ??
          "Bank Account",

        accountLast4:
          farmer?.bankAccountLast4 ??
          "----",

        ifscCode:
          farmer?.ifscCode ??
          "N/A",

        procuredDate,

        estimatedReleaseDate,
      };

    /* =====================================================
       SAVE PAYMENT
    ===================================================== */

    setPayments((previous) => {
      const updated = [
        payment,

        ...previous.filter(
          (item) =>
            !(
              item.tokenNumber ===
                tokenNumber &&
              item.farmerId ===
                token.farmerId
            ),
        ),
      ];

      saveStorage(
        STORAGE_KEYS.payments,
        updated,
      );

      return updated;
    });

    /* =====================================================
       UPDATE TOKEN
    ===================================================== */

    setQueueTokens((previous) => {
      const updated = previous.map(
        (
          item,
        ): QueueToken =>
          item.tokenNumber ===
          tokenNumber
            ? {
                ...item,

                status: "completed",

                weighbridgeWeightQuintals:
                  safeWeight,

                finalWeight:
                  safeWeight,

                paymentAmount:
                  netPayable,

                completedAt:
                  new Date().toISOString(),
              }
            : item,
      );

      saveStorage(
        STORAGE_KEYS.queueTokens,
        updated,
      );

      return updated;
    });

    /* =====================================================
       UPDATE MILESTONES
    ===================================================== */

    setMilestones((previous) => {
      const updated =
        previous.map(
          (milestone) => {
            if (
              milestone.tokenNumber !==
              tokenNumber
            ) {
              return milestone;
            }

            if (
              milestone.key ===
                "weighbridge" ||
              milestone.key ===
                "procurement_approved"
            ) {
              return {
                ...milestone,

                status: "completed",

                completedAt:
                  new Date().toISOString(),
              };
            }

            if (
              milestone.key ===
              "payment_processing"
            ) {
              return {
                ...milestone,

                status:
                  "in_progress",
              };
            }

            return milestone;
          },
        );

      saveStorage(
        STORAGE_KEYS.milestones,
        updated,
      );

      return updated;
    });

    /* =====================================================
       PAYMENT NOTIFICATION
    ===================================================== */

    const notification: AppNotification =
      {
        id: `NOTIF-PAY-${Date.now()}`,

        type: "payment",

        title:
          "Procurement Payment Initiated",

        message: `Payment of ₹${Math.round(
          netPayable,
        ).toLocaleString(
          "en-IN",
        )} has been initiated for token ${token.tokenCode}.`,

        timestamp:
          new Date().toISOString(),

        read: false,

        badge:
          "PAYMENT INITIATED",
      };

    setNotifications((previous) => {
      const updated = [
        notification,
        ...previous,
      ];

      saveStorage(
        STORAGE_KEYS.notifications,
        updated,
      );

      return updated;
    });
  };

  /* =========================================================
     MARK NOTIFICATION READ
  ========================================================= */

  const markNotificationRead = (
    notificationId: string,
  ): void => {
    setNotifications((previous) => {
      const updated = previous.map(
        (
          notification,
        ): AppNotification =>
          notification.id ===
          notificationId
            ? {
                ...notification,

                read: true,
              }
            : notification,
      );

      saveStorage(
        STORAGE_KEYS.notifications,
        updated,
      );

      return updated;
    });
  };

  /* =========================================================
     MARK ALL NOTIFICATIONS READ
  ========================================================= */

  const markAllNotificationsRead =
    (): void => {
      setNotifications((previous) => {
        const updated = previous.map(
          (
            notification,
          ): AppNotification => ({
            ...notification,

            read: true,
          }),
        );

        saveStorage(
          STORAGE_KEYS.notifications,
          updated,
        );

        return updated;
      });
    };

  /* =========================================================
     DELETE NOTIFICATION
  ========================================================= */

  const deleteNotification = (
    notificationId: string,
  ): void => {
    setNotifications((previous) => {
      const updated = previous.filter(
        (notification) =>
          notification.id !==
          notificationId,
      );

      saveStorage(
        STORAGE_KEYS.notifications,
        updated,
      );

      return updated;
    });
  };

  /* =========================================================
     QUEUE ANNOUNCEMENT
  ========================================================= */

  const playQueueAnnouncement = (
    tokenNumber: number,
  ): void => {
    if (
      typeof window ===
        "undefined" ||
      !window.speechSynthesis
    ) {
      return;
    }

    const message = `Token number ${tokenNumber}, please proceed to the procurement counter.`;

    const utterance =
      new SpeechSynthesisUtterance(
        message,
      );

    utterance.rate = 0.9;

    utterance.pitch = 1;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
      utterance,
    );
  };

  /* =========================================================
     CONTEXT VALUE
  ========================================================= */

  const contextValue: AuthContextType =
    {
      user,

      role,

      isAuthenticated:
        Boolean(user),

      language,

      deleteNotification,

      t,

      setLanguage,

      switchRole,

      loginWithProfile,

      updateUserProfile,

      registerUser,

      getRegisteredUserByPhone,

      registeredUsers,

      logout,

      centers,

      slots,

      queueTokens,

      currentCenterId,

      setCurrentCenterId,

      qualityReport,

      milestones,

      payments,

      notifications,

      bookNewSlot,

      callNextToken,

      completeInspection,

      approveProcurementAndWeigh,

      markNotificationRead,

      markAllNotificationsRead,

      playQueueAnnouncement,
    };

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================================================
   USE AUTH
========================================================= */

export const useAuth =
  (): AuthContextType => {
    const context =
      useContext(AuthContext);

    if (!context) {
      throw new Error(
        "useAuth must be used inside an AuthProvider",
      );
    }

    return context;
  };

export default AuthContext;