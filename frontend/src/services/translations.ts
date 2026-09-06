import { LanguageCode } from '../types';

export interface TranslationStrings {
  // Brand & General
  brandName: string;
  brandTagline: string;
  tollFreeHelpline: string;
  emergencyCare: string;
  
  // Navigation
  navHome: string;
  navHowItWorks: string;
  navSchedule: string;
  navCenters: string;
  navQueue: string;
  navStatus: string;
  navPayments: string;
  navDashboard: string;
  navOfficerPortal: string;
  navAdminPortal: string;
  navLogin: string;
  navRegister: string;
  navGetStarted: string;
  navLogout: string;

  // Hero Section
  heroBadge: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroHeadline3: string;
  heroSubheadline: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroFloatingTodayProcurement: string;
  heroFloatingCrop: string;
  heroFloatingCenter: string;
  heroFloatingAvailableSlots: string;
  heroFloatingEstimatedWait: string;
  heroFloatingYourToken: string;
  heroFloatingFarmersAhead: string;

  // Statistics
  statsFarmersServed: string;
  statsProcurementCenters: string;
  statsQuintalsProcured: string;
  statsPaymentsTracked: string;

  // Problem Section
  problemHeading: string;
  problemSubheading: string;
  prob1Title: string;
  prob1Desc: string;
  prob2Title: string;
  prob2Desc: string;
  prob3Title: string;
  prob3Desc: string;
  prob4Title: string;
  prob4Desc: string;

  // Solutions Section
  solutionHeading: string;
  solutionSubheading: string;

  // How it works
  hiwHeading: string;
  hiwSubheading: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  step5Title: string;
  step5Desc: string;

  // Live Queue
  queueSectionTitle: string;
  queueSectionSubtitle: string;
  queueServingNow: string;
  queueYourToken: string;
  queueFarmersAhead: string;
  queueEstWait: string;
  queueStatusLive: string;
  queueUpdatedJustNow: string;
  queueCompleted: string;
  queueProcessing: string;
  queueYouNext: string;
  queueWaiting: string;
  queueLookUpToken: string;

  // Dashboard preview
  dashPreviewHeading: string;
  dashPreviewSubheading: string;
  dashGoodMorning: string;
  dashNextProcurement: string;
  dashCropQuantity: string;
  dashStageVerification: string;

  // Payments
  paymentSectionHeading: string;
  paymentSectionSubheading: string;
  paymentExpected: string;
  paymentCrop: string;
  paymentQuantity: string;
  paymentValue: string;
  paymentStatus: string;
  paymentReleaseDate: string;

  // Final CTA
  ctaHeading: string;
  ctaSubheading: string;
  ctaButton1: string;
  ctaButton2: string;
}

export const translations: Record<LanguageCode, TranslationStrings> = {
  en: {
    brandName: 'KisanSetu',
    brandTagline: 'Smart Farmer Procurement Management System',
    tollFreeHelpline: '1800-180-1551 (Toll Free Farmer Support)',
    emergencyCare: 'Mandi Care & Support Available 24/7',

    navHome: 'Home',
    navHowItWorks: 'How It Works',
    navSchedule: 'Procurement Schedule',
    navCenters: 'Procurement Centers',
    navQueue: 'Live Queue',
    navStatus: 'Crop Status',
    navPayments: 'Payment Tracking',
    navDashboard: 'Farmer Dashboard',
    navOfficerPortal: 'Officer Portal',
    navAdminPortal: 'Admin Portal',
    navLogin: 'Sign In',
    navRegister: 'Register Farm',
    navGetStarted: 'Book Slot',
    navLogout: 'Sign Out',

    heroBadge: 'SMART PROCUREMENT FOR MODERN FARMERS',
    heroHeadline1: 'Sell Smarter.',
    heroHeadline2: 'Wait Less.',
    heroHeadline3: 'Get Paid Faster.',
    heroSubheadline: 'One simple, transparent platform to discover procurement schedules, book time slots, track your live token queue, monitor crop lab verification, and follow your direct DBT payment — all in real time.',
    heroCtaPrimary: 'Find Procurement Center →',
    heroCtaSecondary: 'See How It Works',
    heroFloatingTodayProcurement: "Today's Procurement",
    heroFloatingCrop: 'Paddy / Rice (Grade A)',
    heroFloatingCenter: 'Haripur Mandi Hub #04',
    heroFloatingAvailableSlots: '18 / 40 Slots Open',
    heroFloatingEstimatedWait: '20 min wait',
    heroFloatingYourToken: 'Your Token #24',
    heroFloatingFarmersAhead: '2 Farmers Ahead',

    statsFarmersServed: 'Farmers Registered',
    statsProcurementCenters: 'Active Mandi Centers',
    statsQuintalsProcured: 'Quintals Procured',
    statsPaymentsTracked: 'Direct DBT Disbursed',

    problemHeading: "Procurement Shouldn't Mean Long Hours of Uncertainty.",
    problemSubheading: 'Know where to go, when to arrive, where you stand in the live queue, and when your payment will reach your bank account — before you even leave your farm.',
    prob1Title: 'Know Your Schedule',
    prob1Desc: 'See verified MSP dates, daily crop quotas, and open slots before packing your harvest.',
    prob2Title: 'Skip the Guesswork',
    prob2Desc: 'Locate the nearest authorized procurement center and inspect live capacity in seconds.',
    prob3Title: 'Track Your Queue',
    prob3Desc: 'Receive a digital token, live estimated wait times, and alerts when your turn is next.',
    prob4Title: 'Follow Your Payment',
    prob4Desc: 'Track every single stage from digital weighbridge approval to direct bank credit via PFMS.',

    solutionHeading: 'Smart Solutions for Seamless Harvest Procurement',
    solutionSubheading: 'Everything a farmer needs to turn weeks of chaotic waiting into an effortless 30-minute experience.',

    hiwHeading: 'How KisanSetu Works',
    hiwSubheading: 'Five simple, transparent steps from farm gate to guaranteed bank payment.',
    step1Title: 'Register Your Farm',
    step1Desc: 'Enter your basic farmer profile, land acreage, and linked Aadhaar/bank account once.',
    step2Title: 'Add Crop & Quantity',
    step2Desc: 'Declare your crop type (Paddy, Wheat, Mustard) and estimated harvest weight in quintals.',
    step3Title: 'Choose Center & Slot',
    step3Desc: 'Select your preferred local procurement center and lock in a convenient morning or afternoon slot.',
    step4Title: 'Track Your Live Queue',
    step4Desc: 'Get a digital Mandi Pass token with real-time countdown, so you arrive right on time.',
    step5Title: 'Receive Direct Payment',
    step5Desc: 'Instant automated MSP calculation with direct bank transfer tracked transparently at every stage.',

    queueSectionTitle: 'No More Waiting Without Knowing.',
    queueSectionSubtitle: 'Check live token positions, currently serving numbers, and estimated wait times before heading to the procurement yard.',
    queueServingNow: 'Currently Serving',
    queueYourToken: 'Your Token',
    queueFarmersAhead: 'Farmers Ahead',
    queueEstWait: 'Estimated Wait',
    queueStatusLive: 'LIVE • Updated just now',
    queueUpdatedJustNow: 'Updated just now',
    queueCompleted: 'Completed',
    queueProcessing: 'In Progress',
    queueYouNext: 'YOU — Next Up',
    queueWaiting: 'Waiting in Queue',
    queueLookUpToken: 'Search your token or mobile number',

    dashPreviewHeading: 'Everything Your Farm Needs. One Simple Dashboard.',
    dashPreviewSubheading: 'Designed with large touchpoints and clear indicators for effortless operation on any phone or desktop.',
    dashGoodMorning: 'Good Morning, Farmer',
    dashNextProcurement: 'Next Procurement: 28 Aug 2026',
    dashCropQuantity: 'Rice / Paddy • 25.0 Quintals',
    dashStageVerification: 'Crop Quality Testing: Grade A Passed',

    paymentSectionHeading: 'Know Exactly When Your Money is Coming.',
    paymentSectionSubheading: 'Zero intermediaries. Transparent MSP price calculation and traceable bank transfer milestones.',
    paymentExpected: 'Expected Payment',
    paymentCrop: 'Crop Type',
    paymentQuantity: 'Net Quantity',
    paymentValue: 'Government MSP Value',
    paymentStatus: 'Payment Processing via PFMS',
    paymentReleaseDate: 'Expected Release: 30 August 2026',

    ctaHeading: 'Your Next Harvest Procurement Should Be Simple.',
    ctaSubheading: 'Find your center, book your slot, track your queue, and know exactly when your payment is coming.',
    ctaButton1: 'Book Procurement Slot →',
    ctaButton2: 'Explore Procurement Centers',
  },
  bn: {
    brandName: 'কিষাণসেতু',
    brandTagline: 'স্মার্ট কৃষক ফসল সংগ্রহ ও প্রকিউরমেন্ট পোর্টাল',
    tollFreeHelpline: '১৮০০-১৮০-১৫৫১ (বিনামূল্যে কৃষক সহায়তা)',
    emergencyCare: '২৪ ঘণ্টা কৃষক সহায়তা সেবা চালু রয়েছে',

    navHome: 'হোম',
    navHowItWorks: 'কিভাবে কাজ করে',
    navSchedule: 'সংগ্রহের সময়সূচী',
    navCenters: 'সংগ্রহ কেন্দ্রসমূহ',
    navQueue: 'লাইভ সিরিয়াল ট্র্যাকার',
    navStatus: 'ফসলের স্থিতি',
    navPayments: 'টাকা পাওয়ার হিসেব',
    navDashboard: 'কৃষক ড্যাশবোর্ড',
    navOfficerPortal: 'অফিসার পোর্টাল',
    navAdminPortal: 'এডমিন পোর্টাল',
    navLogin: 'লগইন করুন',
    navRegister: 'কৃষক নিবন্ধন',
    navGetStarted: 'স্লট বুক করুন',
    navLogout: 'লগআউট',

    heroBadge: 'আধুনিক কৃষকদের জন্য স্মার্ট ফসল সংগ্রহ ব্যবস্থা',
    heroHeadline1: 'সঠিক মূল্যে বিক্রি।',
    heroHeadline2: 'কম অপেক্ষা।',
    heroHeadline3: 'দ্রুত ব্যাংক পেমেন্ট।',
    heroSubheadline: 'একটি সহজ ডিজিটাল প্ল্যাটফর্মে ফসলের সংগ্রহের তারিখ জানুন, স্লট বুক করুন, লাইভ টোকেন ট্র্যাক করুন এবং সরাসরি ব্যাংক একাউন্টে টাকা পৌঁছানোর হিসেব দেখুন।',
    heroCtaPrimary: 'নিকটস্থ কেন্দ্র খুঁজুন →',
    heroCtaSecondary: 'পদ্ধতি দেখুন',
    heroFloatingTodayProcurement: 'আজকের সংগ্রহ কার্যক্রম',
    heroFloatingCrop: 'ধান (গ্রেড এ মানসম্পন্ন)',
    heroFloatingCenter: 'হরিপুর কিষাণ মান্ডি কেন্দ্র #০৪',
    heroFloatingAvailableSlots: '১৮ / ৪০ স্লট খালি আছে',
    heroFloatingEstimatedWait: 'আনুমানিক ২০ মিনিট অপেক্ষা',
    heroFloatingYourToken: 'আপনার টোকেন #২৪',
    heroFloatingFarmersAhead: 'সামনে আছেন ২ জন কৃষক',

    statsFarmersServed: 'নিবন্ধিত কৃষক',
    statsProcurementCenters: 'সক্রিয় সংগ্রহ কেন্দ্র',
    statsQuintalsProcured: 'কুইন্টাল ফসল সংগ্রহ',
    statsPaymentsTracked: 'সরাসরি ডিবিটি পেমেন্ট',

    problemHeading: 'ফসল বিক্রির জন্য আর দীর্ঘ অনিশ্চিত অপেক্ষা নয়।',
    problemSubheading: 'বাড়ি থেকে বের হওয়ার আগেই জানুন কোথায় যাবেন, কখন পৌঁছাবেন, লাইভ সিরিয়ালে আপনার অবস্থান কত এবং টাকা কবে একাউন্টে ঢুকবে।',
    prob1Title: 'সময়সূচী জানুন',
    prob1Desc: 'সরকারি নির্ধারিত তারিখ ও প্রতিদিনের ধারণক্ষমতা আগে থেকেই দেখে নিন।',
    prob2Title: 'সঠিক কেন্দ্র নির্বাচন',
    prob2Desc: 'নিকটবর্তী মান্ডি কেন্দ্রের দূরত্ব ও খালি স্লট এক নজরে যাচাই করুন।',
    prob3Title: 'লাইভ সিরিয়াল দেখুন',
    prob3Desc: 'ডিজিটাল টোকেনের মাধ্যমে আপনার সিরিয়াল আসার সঠিক সময় আগে থেকে জানুন।',
    prob4Title: 'টাকার গতিবিধি ট্র্যাক করুন',
    prob4Desc: 'ডিজিটাল ওজন ও মান যাচাইয়ের পর সরাসরি ব্যাংক একাউন্টে টাকা জমা হওয়া পর্যন্ত নজর রাখুন।',

    solutionHeading: 'কৃষকদের সুবিধার্থে আধুনিক ডিজিটাল সেবা',
    solutionSubheading: 'কয়েক সপ্তাহের হয়রানি ও দীর্ঘ লাইনের বদলে মাত্র ৩০ মিনিটে স্বচ্ছ সংগ্রহ প্রক্রিয়া।',

    hiwHeading: 'কিষাণসেতু যেভাবে কাজ করে',
    hiwSubheading: 'মাঠের ফসল থেকে ব্যাংকে টাকা পাওয়ার ৫টি স্বচ্ছ ধাপ।',
    step1Title: 'খামারের তথ্য নিবন্ধন',
    step1Desc: 'কৃষক প্রোফাইল, জমির পরিমাণ ও ব্যাংক একাউন্ট একবার যুক্ত করুন।',
    step2Title: 'ফসল ও পরিমাণ নির্বাচন',
    step2Desc: 'ফসলের ধরণ (ধান, গম, সরিষা ইত্যাদি) এবং আনুমানিক কুইন্টাল উল্লেখ করুন।',
    step3Title: 'কেন্দ্র ও সময় স্লট পছন্দ',
    step3Desc: 'আপনার পছন্দের কেন্দ্র এবং সকাল বা বিকালের সুবিধাজনক সময় বেছে নিন।',
    step4Title: 'লাইভ সিরিয়াল ট্র্যাক করুন',
    step4Desc: 'ডিজিটাল গেট পাসের মাধ্যমে সময়মতো মান্ডিতে পৌঁছে যান।',
    step5Title: 'সরাসরি ব্যাংক পেমেন্ট পান',
    step5Desc: 'স্বচ্ছ ওজন মাপার পর সরকারি সহায়ক মূল্য সরাসরি আপনার ব্যাংকে ট্রান্সফার হবে।',

    queueSectionTitle: 'অনিশ্চিত লাইনে না দাঁড়িয়ে লাইভ সিরিয়াল দেখুন।',
    queueSectionSubtitle: 'মান্ডি প্রাঙ্গণে পৌঁছানোর আগেই লাইভ টোকেন স্ট্যাটাস ও অপেক্ষার সময় দেখে নিন।',
    queueServingNow: 'বর্তমানে চলমান টোকেন',
    queueYourToken: 'আপনার টোকেন',
    queueFarmersAhead: 'সামনে অপেক্ষারত',
    queueEstWait: 'আনুমানিক সময়',
    queueStatusLive: 'সরাসরি • এখনই আপডেট হয়েছে',
    queueUpdatedJustNow: 'এখনই আপডেট হয়েছে',
    queueCompleted: 'সম্পন্ন',
    queueProcessing: 'যাচাই চলছে',
    queueYouNext: 'আপনার পালা আসছে',
    queueWaiting: 'অপেক্ষায় রয়েছে',
    queueLookUpToken: 'আপনার টোকেন বা মোবাইল নম্বর দিয়ে খুঁজুন',

    dashPreviewHeading: 'আপনার খামারের জন্য প্রয়োজনীয় সব তথ্য এক স্ক্রিনে।',
    dashPreviewSubheading: 'মোবাইল ও কম্পিউটারে সহজে ব্যবহারের উপযোগী বড় বাটন ও স্পষ্ট বাংলা নির্দেশনা।',
    dashGoodMorning: 'সুপ্রভাত, রমেশ বাবু',
    dashNextProcurement: 'পরবর্তী সংগ্রহ: ২৮ আগস্ট ২০২৬',
    dashCropQuantity: 'ধান • ২৫.০ কুইন্টাল',
    dashStageVerification: 'গুণমান পরীক্ষা: গ্রেড এ উত্তীর্ণ',

    paymentSectionHeading: 'টাকা কবে আসবে তা স্পষ্টভাবে জানুন।',
    paymentSectionSubheading: 'কোনো দালাল নেই। সরকারি সহায়ক মূল্যে সরাসরি স্বচ্ছ ডিবিটি পেমেন্ট।',
    paymentExpected: 'প্রাপ্য মোট অর্থ',
    paymentCrop: 'ফসলের নাম',
    paymentQuantity: 'মোট ওজন',
    paymentValue: 'সরকারি নির্ধারিত মূল্য',
    paymentStatus: 'পিএফএমএস ব্যাংক প্রক্রিয়াধীন',
    paymentReleaseDate: 'প্রত্যাশিত জমা: ৩০ আগস্ট ২০২৬',

    ctaHeading: 'আপনার আগামী ফসল বিক্রি হোক ঝামেলামুক্ত ও সহজ।',
    ctaSubheading: 'কেন্দ্র খুঁজুন, সময় স্লট বুক করুন এবং ঘরে বসেই সিরিয়াল ও পেমেন্ট ট্র্যাক করুন।',
    ctaButton1: 'স্লট বুক করুন →',
    ctaButton2: 'সংগ্রহ কেন্দ্রগুলো দেখুন',
  },
  hi: {
    brandName: 'किसानसेतु',
    brandTagline: 'स्मार्ट किसान उपार्जन एवं खरीद प्रबंधन प्रणाली',
    tollFreeHelpline: '1800-180-1551 (निःशुल्क किसान हेल्पलाइन)',
    emergencyCare: 'मंडी सहायता सेवा 24 घंटे उपलब्ध',

    navHome: 'होम',
    navHowItWorks: 'कार्यप्रणाली',
    navSchedule: 'उपार्जन समय-सारणी',
    navCenters: 'खरीद केंद्र',
    navQueue: 'लाइव कतार',
    navStatus: 'फसल स्थिति',
    navPayments: 'भुगतान ट्रैकिंग',
    navDashboard: 'किसान डैशबोर्ड',
    navOfficerPortal: 'अधिकारी पोर्टल',
    navAdminPortal: 'एडमिन पोर्टल',
    navLogin: 'लॉग इन करें',
    navRegister: 'किसान पंजीकरण',
    navGetStarted: 'स्लॉट बुक करें',
    navLogout: 'लॉग आउट',

    heroBadge: 'आधुनिक किसानों के लिए पारदर्शी खरीद प्रणाली',
    heroHeadline1: 'सही मूल्य पर बेचें।',
    heroHeadline2: 'कम प्रतीक्षा करें।',
    heroHeadline3: 'तेज़ भुगतान पाएं।',
    heroSubheadline: 'एक सरल और भरोसेमंद डिजिटल मंच जहां आप खरीद की तारीखें जान सकते हैं, स्लॉट बुक कर सकते हैं, लाइव टोकन ट्रैक कर सकते हैं और सीधे बैंक खाते में भुगतान की प्रगति देख सकते हैं।',
    heroCtaPrimary: 'खरीद केंद्र खोजें →',
    heroCtaSecondary: 'प्रक्रिया समझें',
    heroFloatingTodayProcurement: 'आज की खरीद स्थिति',
    heroFloatingCrop: 'धान / चावल (ग्रेड ए)',
    heroFloatingCenter: 'हरिपुर मंडी केंद्र #04',
    heroFloatingAvailableSlots: '18 / 40 स्लॉट उपलब्ध',
    heroFloatingEstimatedWait: '20 मिनट प्रतीक्षा',
    heroFloatingYourToken: 'आपका टोकन #24',
    heroFloatingFarmersAhead: '2 किसान आपसे आगे',

    statsFarmersServed: 'पंजीकृत किसान',
    statsProcurementCenters: 'सक्रिय खरीद केंद्र',
    statsQuintalsProcured: 'क्विंटल फसल उपार्जित',
    statsPaymentsTracked: 'डीबीटी बैंक भुगतान',

    problemHeading: 'उपार्जन के लिए अब घंटों की अनिश्चितता और इंतज़ार नहीं।',
    problemSubheading: 'खेत से निकलने से पहले ही जानिए कहां जाना है, कब पहुंचना है, कतार में आपका टोकन नंबर क्या है और पैसा कब खाते में आएगा।',
    prob1Title: 'समय-सारणी जानें',
    prob1Desc: 'सरकारी एमएसपी तारीखें, कोटा और उपलब्ध स्लॉट पहले से देखकर तैयारी करें।',
    prob2Title: 'निकटतम केंद्र खोजें',
    prob2Desc: 'अपने नजदीकी उपार्जन केंद्र की दूरी और लाइव क्षमता तुरंत जांचें।',
    prob3Title: 'लाइव टोकन ट्रैक करें',
    prob3Desc: 'डिजिटल टोकन से घर बैठे कतार की लाइव स्थिति और समय का सही अनुमान लगाएं।',
    prob4Title: 'भुगतान ट्रैक करें',
    prob4Desc: 'डिजिटल तौल और गुणवत्ता जांच के बाद सीधे खाते में राशि पहुंचने तक हर चरण देखें।',

    solutionHeading: 'किसानों के लिए आधुनिक और पारदर्शी समाधान',
    solutionSubheading: 'दिनों की लंबी लाइनों को खत्म कर केवल 30 मिनट में पूरी होने वाली आसान खरीद प्रक्रिया।',

    hiwHeading: 'किसानसेतु कैसे काम करता है',
    hiwSubheading: 'खेत से सीधे बैंक खाते तक 5 आसान एवं पारदर्शी चरण।',
    step1Title: 'खेत का पंजीकरण',
    step1Desc: 'अपनी सामान्य किसान जानकारी, भूमि का रकबा और बैंक खाता एक बार दर्ज करें।',
    step2Title: 'फसल और मात्रा चुनें',
    step2Desc: 'अपनी फसल (धान, गेहूं, सरसों, मक्का) और अनुमानित क्विंटल मात्रा दर्ज करें।',
    step3Title: 'केंद्र एवं स्लॉट बुक करें',
    step3Desc: 'अपने पसंदीदा केंद्र और सुबह या दोपहर का सुविधाजनक समय चुनें।',
    step4Title: 'लाइव कतार देखें',
    step4Desc: 'डिजिटल मंडी पास प्राप्त करें और अपनी बारी आने पर ही केंद्र पहुंचें।',
    step5Title: 'सीधा बैंक भुगतान पाएं',
    step5Desc: 'स्वचालित एमएसपी दर गणना और पीएफएमएस के जरिए सुरक्षित डीबीटी हस्तांतरण।',

    queueSectionTitle: 'लंबी लाइनों में खड़े रहने की जरूरत नहीं।',
    queueSectionSubtitle: 'मंडी पहुंचने से पहले ही अपने टोकन की लाइव स्थिति और प्रतीक्षा समय जांचें।',
    queueServingNow: 'वर्तमान में चालू टोकन',
    queueYourToken: 'आपका टोकन',
    queueFarmersAhead: 'आगे प्रतीक्षा में',
    queueEstWait: 'अनुमानित समय',
    queueStatusLive: 'लाइव • अभी अपडेट हुआ',
    queueUpdatedJustNow: 'अभी अपडेट हुआ',
    queueCompleted: 'पूर्ण हुआ',
    queueProcessing: 'जांच जारी है',
    queueYouNext: 'आपकी बारी आने वाली है',
    queueWaiting: 'कतार में प्रतीक्षारत',
    queueLookUpToken: 'अपना टोकन नंबर या मोबाइल दर्ज करें',

    dashPreviewHeading: 'आपकी खेती के लिए ज़रूरी हर जानकारी एक ही स्क्रीन पर।',
    dashPreviewSubheading: 'बड़े अक्षरों और सरल भाषा में मोबाइल एवं कंप्यूटर पर इस्तेमाल के लिए अनुकूलित।',
    dashGoodMorning: 'सुप्रभात, रमेश जी',
    dashNextProcurement: 'अगली खरीद: 28 अगस्त 2026',
    dashCropQuantity: 'धान • 25.0 क्विंटल',
    dashStageVerification: 'गुणवत्ता जांच: ग्रेड ए सफल',

    paymentSectionHeading: 'सटीक जानकारी कि पैसा कब खाते में आएगा।',
    paymentSectionSubheading: 'कोई बिचौलिया नहीं। शत-प्रतिशत पारदर्शी सरकारी एमएसपी दर पर सीधा भुगतान।',
    paymentExpected: 'कुल देय राशि',
    paymentCrop: 'फसल का नाम',
    paymentQuantity: 'शुद्ध मात्रा',
    paymentValue: 'एमएसपी निर्धारित मूल्य',
    paymentStatus: 'पीएफएमएस बैंक प्रक्रिया जारी',
    paymentReleaseDate: 'अनुमानित प्राप्ति: 30 अगस्त 2026',

    ctaHeading: 'आपकी अगली फसल खरीद आसान और सुरक्षित होनी चाहिए।',
    ctaSubheading: 'केंद्र चुनें, स्लॉट बुक करें, लाइव कतार देखें और बैंक खाते में भुगतान की प्रगति जानें।',
    ctaButton1: 'स्लॉट बुक करें →',
    ctaButton2: 'खरीद केंद्र देखें',
  },
};
