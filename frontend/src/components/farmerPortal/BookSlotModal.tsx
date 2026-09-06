import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  IndianRupee,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
  X,
  Wheat,
  Building2,
  Map,
  ArrowLeft,
  Smartphone,
  CreditCard,
  Landmark,
  QrCode,
  WalletCards,
  LockKeyhole,
  Loader2,
  CircleCheck,
  ReceiptText,
  Copy,
  Check,
} from "lucide-react";

import { useAuth, MSP_RATES } from "../context/AuthContext";
import type { CropType, QueueToken } from "../types";

/* =========================================================
   TYPES
========================================================= */

interface BookSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCenterId?: string;
  initialDate?: string;
  initialCrop?: CropType;
  initialTimeWindow?: string;
  onBookingSuccess?: (token: QueueToken) => void;
}

type PaymentMethod = "upi" | "card" | "netbanking" | "qr" | "wallet";

type PaymentStage = "review" | "payment" | "processing" | "success";

/* =========================================================
   WEST BENGAL DISTRICTS
========================================================= */

const WEST_BENGAL_DISTRICTS = [
  "Alipurduar",
  "Bankura",
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
  "Paschim Bardhaman",
  "Paschim Medinipur",
  "Purba Bardhaman",
  "Purba Medinipur",
  "Purulia",
  "South 24 Parganas",
  "Uttar Dinajpur",
];

/* =========================================================
   DISTRICT → BLOCK DATA
========================================================= */

const WEST_BENGAL_BLOCKS: Record<string, string[]> = {
  Alipurduar: [
    "Alipurduar-I",
    "Alipurduar-II",
    "Falakata",
    "Kalchini",
    "Kumargram",
    "Madarihat-Birpara",
  ],

  Bankura: [
    "Bankura-I",
    "Bankura-II",
    "Barjora",
    "Bishnupur",
    "Chhatna",
    "Gangajalghati",
    "Hirbandh",
    "Indpur",
    "Indas",
    "Jaypur",
    "Khatra",
    "Kotulpur",
    "Mejhia",
    "Onda",
    "Patrasayer",
    "Raipur",
    "Ranibandh",
    "Saltora",
    "Sarenga",
    "Simlapal",
    "Sonamukhi",
  ],

  Birbhum: [
    "Bolpur-Sriniketan",
    "Dubrajpur",
    "Illambazar",
    "Khoyrasole",
    "Labpur",
    "Mayureswar-I",
    "Mayureswar-II",
    "Mongalkote",
    "Murarai-I",
    "Murarai-II",
    "Nalhati-I",
    "Nalhati-II",
    "Nanoor",
    "Rajnagar",
    "Rampurhat-I",
    "Rampurhat-II",
    "Sainthia",
    "Suri-I",
    "Suri-II",
  ],

  "Cooch Behar": [
    "Cooch Behar-I",
    "Cooch Behar-II",
    "Dinhata-I",
    "Dinhata-II",
    "Haldibari",
    "Mekhliganj",
    "Mathabhanga-I",
    "Mathabhanga-II",
    "Sitai",
    "Sitalkuchi",
    "Tufanganj-I",
    "Tufanganj-II",
  ],

  "Dakshin Dinajpur": [
    "Balurghat",
    "Banshihari",
    "Gangarampur",
    "Harirampur",
    "Hili",
    "Kumarganj",
    "Kushmandi",
    "Tapan",
  ],

  Darjeeling: [
    "Darjeeling-Pulbazar",
    "Jorebunglow-Sukhiapokhri",
    "Kurseong",
    "Mirik",
    "Rangli Rangliot",
    "Matigara",
    "Phansidewa",
    "Naxalbari",
    "Kharibari",
  ],

  Hooghly: [
    "Arambagh",
    "Balagarh",
    "Chanditala-I",
    "Chanditala-II",
    "Chinsurah-Mogra",
    "Dhaniakhali",
    "Goghat-I",
    "Goghat-II",
    "Haripal",
    "Jangipara",
    "Khanakul-I",
    "Khanakul-II",
    "Pandua",
    "Polba-Dadpur",
    "Pursurah",
    "Singur",
    "Srirampur-Uttarpara",
  ],

  Howrah: [
    "Amta-I",
    "Amta-II",
    "Bagnan-I",
    "Bagnan-II",
    "Bally-Jagacha",
    "Domjur",
    "Jagatballavpur",
    "Panchla",
    "Sankrail",
    "Shibpur",
    "Udaynarayanpur",
  ],

  Jalpaiguri: [
    "Dhupguri",
    "Jalpaiguri",
    "Kalimpong",
    "Kranti",
    "Maynaguri",
    "Mal",
    "Matiali",
    "Nagrakata",
    "Rajganj",
  ],

  Jhargram: [
    "Binpur-I",
    "Binpur-II",
    "Gopiballavpur-I",
    "Gopiballavpur-II",
    "Jamboni",
    "Jhargram",
    "Nayagram",
    "Sankrail",
  ],

  Kalimpong: ["Kalimpong-I", "Kalimpong-II", "Gorubathan"],

  Kolkata: ["Kolkata Municipal Area"],

  Maldah: [
    "Bamangola",
    "Chanchal-I",
    "Chanchal-II",
    "English Bazar",
    "Gazole",
    "Habibpur",
    "Harishchandrapur-I",
    "Harishchandrapur-II",
    "Kaliachak-I",
    "Kaliachak-II",
    "Kaliachak-III",
    "Manikchak",
    "Maldah Old",
    "Ratua-I",
    "Ratua-II",
  ],

  Murshidabad: [
    "Berhampore",
    "Bhagawangola-I",
    "Bhagawangola-II",
    "Beldanga-I",
    "Beldanga-II",
    "Bharatpur-I",
    "Bharatpur-II",
    "Burwan",
    "Domkal",
    "Farakka",
    "Jalangi",
    "Kandi",
    "Karimpur",
    "Lalgola",
    "Murshidabad-Jiaganj",
    "Nabagram",
    "Raghunathganj-I",
    "Raghunathganj-II",
    "Raninagar-I",
    "Raninagar-II",
    "Sagardighi",
    "Samserganj",
    "Suti-I",
    "Suti-II",
  ],

  Nadia: [
    "Chakdaha",
    "Chapra",
    "Hanskhali",
    "Haringhata",
    "Kaliganj",
    "Karimpur-I",
    "Karimpur-II",
    "Krishnaganj",
    "Krishnagar-I",
    "Krishnagar-II",
    "Nabadwip",
    "Nakashipara",
    "Ranaghat-I",
    "Ranaghat-II",
    "Santipur",
    "Tehatta-I",
    "Tehatta-II",
  ],

  "North 24 Parganas": [
    "Amdanga",
    "Baduria",
    "Bagdah",
    "Barasat-I",
    "Barasat-II",
    "Barrackpore-I",
    "Barrackpore-II",
    "Basirhat-I",
    "Basirhat-II",
    "Bongaon",
    "Deganga",
    "Gaighata",
    "Habra-I",
    "Habra-II",
    "Hasnabad",
    "Haroa",
    "Minakhan",
    "Rajarhat",
    "Sandeshkhali-I",
    "Sandeshkhali-II",
    "Swarupnagar",
  ],

  "Paschim Bardhaman": [
    "Andal",
    "Barabani",
    "Bhatar",
    "Durgapur-Faridpur",
    "Jamuria",
    "Kanksa",
    "Ondal",
    "Pandabeswar",
    "Raniganj",
    "Salanpur",
  ],

  "Paschim Medinipur": [
    "Chandrakona-I",
    "Chandrakona-II",
    "Daspur-I",
    "Daspur-II",
    "Dantan-I",
    "Dantan-II",
    "Debra",
    "Garhbeta-I",
    "Garhbeta-II",
    "Garhbeta-III",
    "Ghatal",
    "Keshiary",
    "Keshpur",
    "Mohanpur",
    "Narayangarh",
    "Pingla",
    "Sabang",
    "Salboni",
    "Sankrail",
  ],

  "Purba Bardhaman": [
    "Ausgram-I",
    "Ausgram-II",
    "Bhatar",
    "Burdwan-I",
    "Burdwan-II",
    "Galsi-I",
    "Galsi-II",
    "Jamalpur",
    "Kalna-I",
    "Kalna-II",
    "Katwa-I",
    "Katwa-II",
    "Khandaghosh",
    "Manteswar",
    "Memari-I",
    "Memari-II",
    "Monteswar",
    "Purbasthali-I",
    "Purbasthali-II",
    "Raina-I",
    "Raina-II",
  ],

  "Purba Medinipur": [
    "Bhagawanpur-I",
    "Bhagawanpur-II",
    "Contai-I",
    "Contai-II",
    "Contai-III",
    "Egra-I",
    "Egra-II",
    "Haldia",
    "Khejuri-I",
    "Khejuri-II",
    "Mahishadal",
    "Moyna",
    "Nandakumar",
    "Nandigram-I",
    "Nandigram-II",
    "Nandigram-III",
    "Panskura-I",
    "Panskura-II",
    "Potashpur-I",
    "Potashpur-II",
    "Ramnagar-I",
    "Ramnagar-II",
    "Sahid Matangini",
    "Sutahata",
    "Tamluk",
  ],

  Purulia: [
    "Arsha",
    "Bagmundi",
    "Balarampur",
    "Barabazar",
    "Bundwan",
    "Hura",
    "Jaipur",
    "Jhalda-I",
    "Jhalda-II",
    "Kashipur",
    "Manbazar-I",
    "Manbazar-II",
    "Neturia",
    "Para",
    "Puncha",
    "Purulia-I",
    "Purulia-II",
    "Raghunathpur-I",
    "Raghunathpur-II",
    "Santuri",
  ],

  "South 24 Parganas": [
    "Bhangar-I",
    "Bhangar-II",
    "Bishnupur-I",
    "Bishnupur-II",
    "Budge Budge-I",
    "Budge Budge-II",
    "Canning-I",
    "Canning-II",
    "Diamond Harbour-I",
    "Diamond Harbour-II",
    "Falta",
    "Jaynagar-I",
    "Jaynagar-II",
    "Kakdwip",
    "Kulpi",
    "Mandirbazar",
    "Mathurapur-I",
    "Mathurapur-II",
    "Magrahat-I",
    "Magrahat-II",
    "Namkhana",
    "Patharpratima",
    "Sagar",
  ],

  "Uttar Dinajpur": [
    "Chopra",
    "Goalpokhar-I",
    "Goalpokhar-II",
    "Hemtabad",
    "Itahar",
    "Kaliaganj",
    "Karandighi",
    "Raiganj",
  ],
};

/* =========================================================
   TIME WINDOWS
========================================================= */

export const TIME_WINDOWS = [
  "07:00 AM – 08:00 AM",
  "08:00 AM – 09:00 AM",
  "09:00 AM – 10:00 AM",
  "10:00 AM – 11:00 AM",
  "11:00 AM – 12:00 PM",
  "12:00 PM – 01:00 PM",
  "01:00 PM – 02:00 PM",
  "02:00 PM – 03:00 PM",
  "03:00 PM – 04:00 PM",
  "04:00 PM – 05:00 PM",
  "05:00 PM – 06:00 PM",
  "06:00 PM – 07:00 PM",
];

/* =========================================================
   PAYMENT
========================================================= */

/*
  DEMO/SIH PAYMENT FEE

  This is the amount the farmer pays to reserve the slot.

  It is intentionally separate from MSP.
*/
const BOOKING_FEE = 50;

/* =========================================================
   HELPERS
========================================================= */

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateString: string) => {
  if (!dateString) return "Select date";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const normalizeText = (value: string) =>
  value.toLowerCase().replace(/[–—-]/g, " ").replace(/\s+/g, " ").trim();

const blockMatchesCenter = (
  centerName: string,
  centerAddress: string | undefined,
  block: string,
) => {
  const centerText = normalizeText(`${centerName} ${centerAddress || ""}`);

  const blockText = normalizeText(block);

  if (centerText.includes("barasat")) {
    return blockText.includes("barasat");
  }

  if (centerText.includes("bongaon")) {
    return blockText.includes("bongaon");
  }

  if (centerText.includes("basirhat")) {
    return blockText.includes("basirhat");
  }

  if (centerText.includes("habra")) {
    return blockText.includes("habra");
  }

  if (centerText.includes("chinsurah")) {
    return blockText.includes("chinsurah");
  }

  if (centerText.includes("singur")) {
    return blockText.includes("singur");
  }

  if (centerText.includes("dhaniakhali")) {
    return blockText.includes("dhaniakhali");
  }

  if (centerText.includes("arambagh")) {
    return blockText.includes("arambagh");
  }

  if (centerText.includes("pandua")) {
    return blockText.includes("pandua");
  }

  if (centerText.includes("haripal")) {
    return blockText.includes("haripal");
  }

  if (centerText.includes("jangipara")) {
    return blockText.includes("jangipara");
  }

  if (centerText.includes("khanakul")) {
    return blockText.includes("khanakul");
  }

  if (centerText.includes("goghat")) {
    return blockText.includes("goghat");
  }

  if (centerText.includes("burrabazar")) {
    return blockText.includes("kolkata");
  }

  const simplifiedBlock = blockText.replace(/\s+i{1,3}$/i, "").trim();

  return simplifiedBlock.length > 2 && centerText.includes(simplifiedBlock);
};

/* =========================================================
   COMPONENT
========================================================= */

const BookSlotModal: React.FC<BookSlotModalProps> = ({
  isOpen,
  onClose,
  initialCenterId,
  initialDate,
  initialCrop,
  initialTimeWindow,
  onBookingSuccess,
}) => {
  const { centers, slots, bookNewSlot } = useAuth();

  const navigate = useNavigate();

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");

  const [selectedCenterId, setSelectedCenterId] = useState(
    initialCenterId || "",
  );

  const [selectedCrop, setSelectedCrop] = useState<CropType>(
    initialCrop || "Rice / Paddy",
  );

  const [selectedDate, setSelectedDate] = useState(initialDate || getToday());

  const [selectedTimeWindow, setSelectedTimeWindow] = useState(
    initialTimeWindow || "",
  );

  const [quantity, setQuantity] = useState(25);

  const [vehicleNumber, setVehicleNumber] = useState("");

  /* =======================================================
     PAYMENT STATE
  ======================================================= */

  const [paymentStage, setPaymentStage] = useState<PaymentStage>("review");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");

  const [upiApp, setUpiApp] = useState("Google Pay");

  const [upiId, setUpiId] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const [bankName, setBankName] = useState("");

  const [walletName, setWalletName] = useState("Paytm");

  const [transactionId, setTransactionId] = useState("");

  const [copiedTransactionId, setCopiedTransactionId] = useState(false);

  /* =======================================================
     BOOKING STATE
  ======================================================= */

  const [createdToken, setCreatedToken] = useState<QueueToken | null>(null);

  const [error, setError] = useState("");

  /* =======================================================
     RESET
  ======================================================= */

  useEffect(() => {
    if (!isOpen) return;

    setPaymentStage("review");
    setPaymentMethod("upi");

    setUpiApp("Google Pay");
    setUpiId("");

    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardName("");

    setBankName("");
    setWalletName("Paytm");

    setTransactionId("");
    setCopiedTransactionId(false);

    setCreatedToken(null);
    setError("");

    setSelectedCenterId(initialCenterId || "");
    setSelectedCrop(initialCrop || "Rice / Paddy");
    setSelectedDate(initialDate || getToday());
    setSelectedTimeWindow(initialTimeWindow || "");

    setQuantity(25);
    setVehicleNumber("");

    const initialCenter = centers.find(
      (center) => center.id === initialCenterId,
    );

    if (initialCenter) {
      setSelectedDistrict(initialCenter.district);

      const districtBlocks = WEST_BENGAL_BLOCKS[initialCenter.district] || [];

      const matchedBlock = districtBlocks.find((block) =>
        blockMatchesCenter(initialCenter.name, initialCenter.address, block),
      );

      setSelectedBlock(matchedBlock || "");
    } else {
      setSelectedDistrict("");
      setSelectedBlock("");
    }
  }, [
    isOpen,
    initialCenterId,
    initialDate,
    initialCrop,
    initialTimeWindow,
    centers,
  ]);

  /* =======================================================
     BLOCK LIST
  ======================================================= */

  const availableBlocks = useMemo(() => {
    if (!selectedDistrict) return [];

    return WEST_BENGAL_BLOCKS[selectedDistrict] || [];
  }, [selectedDistrict]);

  /* =======================================================
     DISTRICT CENTERS
  ======================================================= */

  const districtCenters = useMemo(() => {
    if (!selectedDistrict) return [];

    return centers.filter(
      (center) =>
        normalizeText(center.district) === normalizeText(selectedDistrict),
    );
  }, [centers, selectedDistrict]);

  /* =======================================================
     BLOCK CENTERS
  ======================================================= */

  const blockCenters = useMemo(() => {
    if (!selectedBlock) {
      return districtCenters;
    }

    const matched = districtCenters.filter((center) =>
      blockMatchesCenter(center.name, center.address, selectedBlock),
    );

    if (matched.length > 0) {
      return matched;
    }

    return districtCenters;
  }, [districtCenters, selectedBlock]);

  /* =======================================================
     CENTER
  ======================================================= */

  const targetCenter = useMemo(() => {
    return centers.find((center) => center.id === selectedCenterId);
  }, [centers, selectedCenterId]);

  /* =======================================================
     CROP
  ======================================================= */

  const cropOptions = Object.keys(MSP_RATES) as CropType[];

  /* =======================================================
     AVAILABLE SLOTS
  ======================================================= */

  const availableSlots = useMemo(() => {
    if (!selectedCenterId || !selectedDate) {
      return [];
    }

    return slots.filter(
      (slot) =>
        slot.centerId === selectedCenterId &&
        slot.crop === selectedCrop &&
        slot.date === selectedDate,
    );
  }, [slots, selectedCenterId, selectedCrop, selectedDate]);

  const getSlotForTime = (timeWindow: string) => {
    return availableSlots.find((slot) => slot.timeWindow === timeWindow);
  };

  const selectedSlot = selectedTimeWindow
    ? getSlotForTime(selectedTimeWindow)
    : undefined;

  /* =======================================================
     TIME STATUS
  ======================================================= */

  const getTimeStatus = (timeWindow: string) => {
    const slot = getSlotForTime(timeWindow);

    if (!slot) {
      return "available";
    }

    if (slot.status === "closed" || slot.status === "full") {
      return "unavailable";
    }

    if (slot.bookedSlots >= slot.totalSlots) {
      return "unavailable";
    }

    if (slot.totalCapacityQuintals - slot.bookedCapacityQuintals <= 0) {
      return "unavailable";
    }

    return "available";
  };

  /* =======================================================
     AUTO SELECT TIME
  ======================================================= */

  useEffect(() => {
    if (!isOpen) return;

    if (!selectedCenterId || !selectedDate) {
      return;
    }

    if (
      selectedTimeWindow &&
      getTimeStatus(selectedTimeWindow) === "available"
    ) {
      return;
    }

    const firstAvailable = TIME_WINDOWS.find(
      (time) => getTimeStatus(time) === "available",
    );

    if (firstAvailable) {
      setSelectedTimeWindow(firstAvailable);
    } else {
      setSelectedTimeWindow("");
    }
  }, [isOpen, selectedCenterId, selectedDate, selectedCrop, slots]);

  /* =======================================================
     MSP CALCULATION
  ======================================================= */

  const mspRatePerQuintal = MSP_RATES[selectedCrop] || 0;

  const mspRatePerKg = mspRatePerQuintal / 100;

  const quantityKg = quantity * 100;

  const estimatedValue = quantity * mspRatePerQuintal;

  /* =======================================================
     MAX QUANTITY
  ======================================================= */

  const maxQuantity = useMemo(() => {
    if (!selectedSlot) {
      return 500;
    }

    const remaining =
      selectedSlot.totalCapacityQuintals - selectedSlot.bookedCapacityQuintals;

    return Math.max(1, Math.min(500, remaining));
  }, [selectedSlot]);

  /* =======================================================
     QUANTITY CHANGE
  ======================================================= */

  const handleQuantityChange = (value: number) => {
    if (Number.isNaN(value)) {
      setQuantity(1);
      return;
    }

    setQuantity(Math.max(1, Math.min(maxQuantity, value)));
  };

  /* =======================================================
     DISTRICT CHANGE
  ======================================================= */

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedBlock("");
    setSelectedCenterId("");
    setSelectedTimeWindow("");
  };

  /* =======================================================
     BLOCK CHANGE
  ======================================================= */

  const handleBlockChange = (block: string) => {
    setSelectedBlock(block);
    setSelectedCenterId("");
    setSelectedTimeWindow("");
  };

  /* =======================================================
     CENTER CHANGE
  ======================================================= */

  const handleCenterChange = (centerId: string) => {
    setSelectedCenterId(centerId);
    setSelectedTimeWindow("");

    const center = centers.find((item) => item.id === centerId);

    if (center) {
      setSelectedDistrict(center.district);

      const blocks = WEST_BENGAL_BLOCKS[center.district] || [];

      const matchedBlock = blocks.find((block) =>
        blockMatchesCenter(center.name, center.address, block),
      );

      if (matchedBlock) {
        setSelectedBlock(matchedBlock);
      }
    }
  };

  /* =======================================================
     VALIDATE BOOKING
  ======================================================= */

  const validateBooking = () => {
    setError("");

    if (!selectedDistrict) {
      setError("Please select a district.");
      return false;
    }

    if (!selectedBlock) {
      setError("Please select a block.");
      return false;
    }

    if (!selectedCenterId) {
      setError("Please select a procurement center.");
      return false;
    }

    if (!selectedDate) {
      setError("Please select a date.");
      return false;
    }

    if (!selectedTimeWindow) {
      setError("Please select a time slot.");
      return false;
    }

    if (getTimeStatus(selectedTimeWindow) === "unavailable") {
      setError(
        "This time slot is no longer available. Please select another slot.",
      );
      return false;
    }

    if (!quantity || quantity < 1 || quantity > maxQuantity) {
      setError(`Quantity must be between 1 and ${maxQuantity} quintals.`);
      return false;
    }

    if (!vehicleNumber.trim()) {
      setError("Please enter your vehicle number.");
      return false;
    }

    if (!targetCenter) {
      setError("Procurement center could not be found.");
      return false;
    }

    return true;
  };

  /* =======================================================
     PROCEED TO PAYMENT
  ======================================================= */

  const handleProceedToPayment = () => {
    if (!validateBooking()) {
      return;
    }

    setPaymentStage("payment");
    setError("");
  };

  /* =======================================================
     PAYMENT VALIDATION
  ======================================================= */

  const validatePayment = () => {
    setError("");

    if (paymentMethod === "upi") {
      if (!upiApp) {
        setError("Please select a UPI app.");
        return false;
      }

      if (!upiId.trim()) {
        setError("Please enter your UPI ID.");
        return false;
      }

      if (!upiId.includes("@")) {
        setError("Please enter a valid UPI ID, for example farmer@upi.");
        return false;
      }
    }

    if (paymentMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length < 12) {
        setError("Please enter a valid card number.");
        return false;
      }

      if (!cardExpiry.trim()) {
        setError("Please enter card expiry.");
        return false;
      }

      if (cardCvv.length < 3) {
        setError("Please enter a valid CVV.");
        return false;
      }

      if (!cardName.trim()) {
        setError("Please enter the name on card.");
        return false;
      }
    }

    if (paymentMethod === "netbanking" && !bankName) {
      setError("Please select your bank.");
      return false;
    }

    if (paymentMethod === "wallet" && !walletName) {
      setError("Please select a wallet.");
      return false;
    }

    return true;
  };

  /* =======================================================
     GENERATE TRANSACTION ID
  ======================================================= */

  const generateTransactionId = () => {
    const randomPart = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    return `KS${Date.now().toString().slice(-8)}${randomPart}`;
  };

  /* =======================================================
     COMPLETE PAYMENT
  ======================================================= */

  const handlePayment = () => {
    if (!validatePayment()) {
      return;
    }

    setPaymentStage("processing");
    setError("");

    setTimeout(() => {
      setTransactionId(generateTransactionId());

      try {
        const token = bookNewSlot({
          centerId: selectedCenterId,
          crop: selectedCrop,
          date: selectedDate,
          timeWindow: selectedTimeWindow,
          quantityQuintals: quantity,
          vehicleNumber: vehicleNumber.trim().toUpperCase(),
        });

        if (!token) {
          setError(
            "Payment was completed, but booking could not be created. Please contact support.",
          );

          setPaymentStage("payment");
          return;
        }

        // Store the newly created token
        setCreatedToken(token);

        // IMPORTANT:
        // Do NOT close the modal here.
        // Do NOT call onBookingSuccess here.
        // Show the success screen first.
        setPaymentStage("success");
      } catch (bookingError) {
        console.error("Booking error:", bookingError);

        setError(
          bookingError instanceof Error
            ? bookingError.message
            : "Booking failed after payment.",
        );

        setPaymentStage("payment");
      }
    }, 2200);
  };

  /* =======================================================
     COPY TRANSACTION ID
  ======================================================= */

  const handleCopyTransactionId = async () => {
    if (!transactionId) return;

    try {
      await navigator.clipboard.writeText(transactionId);

      setCopiedTransactionId(true);

      setTimeout(() => {
        setCopiedTransactionId(false);
      }, 1800);
    } catch {
      console.error("Unable to copy transaction ID");
    }
  };

  /* =======================================================
     CLOSE
  ======================================================= */

  const handleClose = () => {
    setError("");

    setPaymentStage("review");
    setPaymentMethod("upi");

    setUpiApp("Google Pay");
    setUpiId("");

    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardName("");

    setBankName("");
    setWalletName("Paytm");

    setTransactionId("");
    setCopiedTransactionId(false);

    setCreatedToken(null);

    onClose();
  };

  /* =======================================================
     DONE
  ======================================================= */

  const handleDone = () => {
    if (createdToken && onBookingSuccess) {
      onBookingSuccess(createdToken);
    }

    handleClose();

    navigate("/dashboard", {
      replace: true,
    });
  };

  /* =======================================================
     PAYMENT METHOD BUTTON
  ======================================================= */

  const PaymentMethodButton = ({
    method,
    icon,
    title,
    description,
  }: {
    method: PaymentMethod;
    icon: React.ReactNode;
    title: string;
    description: string;
  }) => {
    const selected = paymentMethod === method;

    return (
      <button
        type="button"
        onClick={() => {
          setPaymentMethod(method);
          setError("");
        }}
        className={[
          "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition",
          selected
            ? "border-green-600 bg-green-50 ring-2 ring-green-100"
            : "border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            selected ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600",
          ].join(" ")}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-bold text-gray-900">{title}</p>

          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        </div>

        <div
          className={[
            "h-5 w-5 rounded-full border-2",
            selected ? "border-green-600 bg-green-600" : "border-gray-300",
          ].join(" ")}
        >
          {selected && (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          )}
        </div>
      </button>
    );
  };

  /* =======================================================
     PAYMENT FORM
  ======================================================= */

  const renderPaymentForm = () => {
    if (paymentMethod === "upi") {
      return (
        <div className="mt-5 rounded-3xl border bg-white p-5">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gray-900">Pay using UPI</h3>

            <p className="mt-1 text-sm text-gray-500">
              Choose your preferred UPI app.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["Google Pay", "PhonePe", "Paytm"].map((app) => (
              <button
                key={app}
                type="button"
                onClick={() => setUpiApp(app)}
                className={[
                  "rounded-2xl border p-4 text-center transition",
                  upiApp === app
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-green-300",
                ].join(" ")}
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <Smartphone className="h-5 w-5 text-gray-700" />
                </div>

                <p className="mt-2 text-xs font-bold text-gray-800">{app}</p>
              </button>
            ))}
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              UPI ID
            </label>

            <div className="relative">
              <Smartphone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={upiId}
                onChange={(event) => setUpiId(event.target.value)}
                placeholder="example@upi"
                className="w-full rounded-2xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <p className="mt-2 text-xs text-gray-500">Demo: farmer@upi</p>
          </div>

          <div className="mt-5 rounded-2xl bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-green-600" />

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Secure UPI Payment
                </p>

                <p className="text-xs text-gray-500">
                  Your payment information is protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (paymentMethod === "card") {
      return (
        <div className="mt-5 rounded-3xl border bg-white p-5">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gray-900">
              Debit / Credit Card
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Enter your card details.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Card Number
              </label>

              <div className="relative">
                <CreditCard className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={cardNumber}
                  onChange={(event) => setCardNumber(event.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full rounded-2xl border border-gray-300 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Expiry
                </label>

                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(event) => setCardExpiry(event.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  CVV
                </label>

                <input
                  type="password"
                  value={cardCvv}
                  onChange={(event) =>
                    setCardCvv(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="•••"
                  maxLength={3}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Name on Card
              </label>

              <input
                type="text"
                value={cardName}
                onChange={(event) => setCardName(event.target.value)}
                placeholder="Enter card holder name"
                className="w-full rounded-2xl border border-gray-300 px-4 py-3.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>
        </div>
      );
    }

    if (paymentMethod === "netbanking") {
      return (
        <div className="mt-5 rounded-3xl border bg-white p-5">
          <h3 className="text-lg font-bold text-gray-900">Net Banking</h3>

          <p className="mt-1 text-sm text-gray-500">
            Select your bank to continue.
          </p>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Select Bank
            </label>

            <div className="relative">
              <Landmark className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <select
                value={bankName}
                onChange={(event) => setBankName(event.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="">Select your bank</option>

                <option value="State Bank of India">State Bank of India</option>

                <option value="Punjab National Bank">
                  Punjab National Bank
                </option>

                <option value="Bank of Baroda">Bank of Baroda</option>

                <option value="HDFC Bank">HDFC Bank</option>

                <option value="ICICI Bank">ICICI Bank</option>

                <option value="Axis Bank">Axis Bank</option>
              </select>
            </div>
          </div>
        </div>
      );
    }

    if (paymentMethod === "qr") {
      return (
        <div className="mt-5 rounded-3xl border bg-white p-5 text-center">
          <h3 className="text-lg font-bold text-gray-900">Scan QR to Pay</h3>

          <p className="mt-1 text-sm text-gray-500">
            Open any UPI application and scan the QR code.
          </p>

          <div className="mx-auto mt-6 flex h-52 w-52 items-center justify-center rounded-3xl border-4 border-gray-100 bg-white shadow-sm">
            <div className="relative flex h-40 w-40 items-center justify-center border-8 border-gray-900">
              <QrCode className="h-28 w-28 text-gray-900" />

              <div className="absolute inset-x-3 top-1/2 h-1 bg-green-600" />
            </div>
          </div>

          <p className="mt-5 text-2xl font-black text-gray-900">
            ₹{BOOKING_FEE}
          </p>

          <p className="mt-1 text-xs text-gray-500">KishanSetu Booking Fee</p>

          <div className="mt-5 rounded-2xl bg-green-50 p-4 text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-green-600" />

              <p className="text-sm font-medium text-green-800">
                After successful payment, your procurement token will be
                generated automatically.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-5 rounded-3xl border bg-white p-5">
        <h3 className="text-lg font-bold text-gray-900">Wallet</h3>

        <p className="mt-1 text-sm text-gray-500">
          Select your preferred wallet.
        </p>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Wallet
          </label>

          <div className="relative">
            <WalletCards className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <select
              value={walletName}
              onChange={(event) => setWalletName(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="Paytm">Paytm Wallet</option>

              <option value="Mobikwik">Mobikwik</option>

              <option value="Amazon Pay">Amazon Pay</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  /* =======================================================
     PAYMENT SCREEN
  ======================================================= */

  const renderPaymentScreen = () => {
    return (
      <div className="max-h-[80vh] overflow-y-auto p-6">
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* PAYMENT HEADER */}

        <div className="rounded-3xl bg-gray-900 p-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-300">KishanSetu Secure Payment</p>

              <h3 className="mt-1 text-3xl font-black">₹{BOOKING_FEE}</h3>

              <p className="mt-1 text-xs text-gray-400">
                Booking & service fee
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <LockKeyhole className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* BOOKING DETAILS */}

        <div className="mt-5 rounded-3xl border bg-green-50 p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-green-700" />

            <div>
              <h3 className="font-bold text-green-900">Your Booking</h3>

              <p className="text-xs text-green-700">
                Verify these details before payment.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-3">
              <p className="text-xs text-gray-500">Procurement Center</p>

              <p className="mt-1 font-bold text-gray-900">
                {targetCenter?.name || "—"}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-3">
              <p className="text-xs text-gray-500">Date & Time</p>

              <p className="mt-1 font-bold text-gray-900">
                {formatDisplayDate(selectedDate)}
              </p>

              <p className="text-xs text-gray-500">{selectedTimeWindow}</p>
            </div>

            <div className="rounded-2xl bg-white p-3">
              <p className="text-xs text-gray-500">Crop</p>

              <p className="mt-1 font-bold text-gray-900">{selectedCrop}</p>
            </div>

            <div className="rounded-2xl bg-white p-3">
              <p className="text-xs text-gray-500">Quantity</p>

              <p className="mt-1 font-bold text-gray-900">
                {quantity} quintals
              </p>

              <p className="text-xs text-gray-500">
                {quantityKg.toLocaleString("en-IN")} KG
              </p>
            </div>
          </div>

          {/* MONEY BREAKDOWN */}

          <div className="mt-4 border-t border-green-200 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Booking fee</span>

              <span className="font-bold text-gray-900">₹{BOOKING_FEE}</span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Estimated MSP value</span>

              <span className="font-bold text-green-700">
                ₹{estimatedValue.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* PAYMENT METHODS */}

        <div className="mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Select Payment Method
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Choose any available payment method.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <PaymentMethodButton
              method="upi"
              icon={<Smartphone className="h-5 w-5" />}
              title="UPI"
              description="Google Pay, PhonePe, Paytm"
            />

            <PaymentMethodButton
              method="card"
              icon={<CreditCard className="h-5 w-5" />}
              title="Debit / Credit Card"
              description="Visa, Mastercard, RuPay"
            />

            <PaymentMethodButton
              method="netbanking"
              icon={<Landmark className="h-5 w-5" />}
              title="Net Banking"
              description="Pay through your bank"
            />

            <PaymentMethodButton
              method="qr"
              icon={<QrCode className="h-5 w-5" />}
              title="UPI QR"
              description="Scan and pay"
            />

            <PaymentMethodButton
              method="wallet"
              icon={<WalletCards className="h-5 w-5" />}
              title="Wallet"
              description="Paytm, Mobikwik, Amazon Pay"
            />
          </div>
        </div>

        {/* PAYMENT FORM */}

        {renderPaymentForm()}

        {/* PAYMENT ACTIONS */}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => {
              setPaymentStage("review");
              setError("");
            }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Booking
          </button>

          <button
            type="button"
            onClick={handlePayment}
            className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-green-700"
          >
            Pay ₹{BOOKING_FEE}
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
          <LockKeyhole className="h-4 w-4" />
          Secure payment • KishanSetu
        </div>
      </div>
    );
  };

  /* =======================================================
     PROCESSING SCREEN
  ======================================================= */

  const renderProcessingScreen = () => {
    return (
      <div className="flex min-h-125items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <Loader2 className="h-12 w-12 animate-spin text-green-600" />
          </div>

          <h3 className="mt-7 text-2xl font-black text-gray-900">
            Processing Payment
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we securely process your payment.
          </p>

          <div className="mt-8 rounded-3xl border bg-gray-50 p-5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Amount</span>

              <span className="font-bold text-gray-900">₹{BOOKING_FEE}</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">Method</span>

              <span className="font-bold text-gray-900">
                {paymentMethod === "upi"
                  ? upiApp
                  : paymentMethod === "card"
                    ? "Card"
                    : paymentMethod === "netbanking"
                      ? "Net Banking"
                      : paymentMethod === "qr"
                        ? "UPI QR"
                        : walletName}
              </span>
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />

                <p className="text-sm font-medium text-gray-700">
                  Verifying payment...
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-xs text-gray-400">
            Do not close this window.
          </p>
        </div>
      </div>
    );
  };

  /* =======================================================
     SUCCESS SCREEN
  ======================================================= */

  const renderSuccessScreen = () => {
    if (!createdToken) {
      return null;
    }

    return (
      <div className="max-h-[80vh] overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* SUCCESS ICON */}

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-14 w-14 text-green-600" />
          </div>

          <h3 className="mt-6 text-3xl font-black text-gray-900">
            Payment Successful!
          </h3>

          <p className="mt-2 text-gray-500">
            Your payment has been successfully verified and your procurement
            slot is confirmed.
          </p>

          {/* PAYMENT SUCCESS CARD */}

          <div className="mt-7 rounded-3xl border-2 border-green-200 bg-green-50 p-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-medium text-green-700">
                  Payment Amount
                </p>

                <p className="mt-1 text-3xl font-black text-green-900">
                  ₹{BOOKING_FEE}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                <CircleCheck className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-white p-4 text-left">
              <p className="text-xs text-gray-500">Transaction ID</p>

              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="break-all font-bold text-gray-900">
                  {transactionId}
                </p>

                <button
                  type="button"
                  onClick={handleCopyTransactionId}
                  className="shrink-0 rounded-xl bg-gray-100 p-2 transition hover:bg-gray-200"
                  title="Copy transaction ID"
                >
                  {copiedTransactionId ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* TOKEN */}

          <div className="mt-6 rounded-3xl border-2 border-green-300 bg-green-50 p-7">
            <p className="text-sm font-bold text-green-700">Your Queue Token</p>

            <div className="mt-2 text-5xl font-black tracking-wider text-green-700">
              #{createdToken.tokenNumber}
            </div>

            <p className="mt-2 text-sm text-green-700">
              Keep this token safe for your mandi visit.
            </p>
          </div>

          {/* STATUS TRACKING */}

          <div className="mt-6 rounded-3xl border bg-white p-5 text-left">
            <h3 className="font-bold text-gray-900">
              Payment & Booking Status
            </h3>

            <div className="mt-5 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>

                <div>
                  <p className="font-bold text-gray-900">Payment Submitted</p>

                  <p className="text-xs text-gray-500">
                    ₹{BOOKING_FEE} payment received.
                  </p>
                </div>
              </div>

              <div className="ml-4 h-5 border-l-2 border-green-200" />

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                </div>

                <div>
                  <p className="font-bold text-gray-900">Payment Verified</p>

                  <p className="text-xs text-gray-500">
                    Transaction successfully verified.
                  </p>
                </div>
              </div>

              <div className="ml-4 h-5 border-l-2 border-green-200" />

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>

                <div>
                  <p className="font-bold text-gray-900">Booking Confirmed</p>

                  <p className="text-xs text-gray-500">
                    Your procurement slot has been reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DETAILS */}

          <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
            <div className="rounded-2xl border bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-500" />

                <div>
                  <p className="text-xs text-gray-500">Procurement Center</p>

                  <p className="font-semibold text-gray-900">
                    {createdToken.centerName}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-gray-500" />

                <div>
                  <p className="text-xs text-gray-500">Date</p>

                  <p className="font-semibold text-gray-900">
                    {formatDisplayDate(createdToken.date)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-gray-500" />

                <div>
                  <p className="text-xs text-gray-500">Time Slot</p>

                  <p className="font-semibold text-gray-900">
                    {createdToken.timeWindow}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gray-500" />

                <div>
                  <p className="text-xs text-gray-500">Vehicle</p>

                  <p className="font-semibold text-gray-900">
                    {createdToken.vehicleNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-500" />

                <div>
                  <p className="text-xs text-gray-500">Crop & Quantity</p>

                  <p className="font-semibold text-gray-900">
                    {createdToken.crop} • {createdToken.quantityQuintals}{" "}
                    quintals
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <IndianRupee className="h-5 w-5 text-gray-500" />

                <div>
                  <p className="text-xs text-gray-500">Estimated MSP Value</p>

                  <p className="font-semibold text-green-700">
                    ₹
                    {Number(createdToken.estimatedValue).toLocaleString(
                      "en-IN",
                    )}
                  </p>

                  <p className="text-xs text-gray-500">
                    Estimated amount farmer may receive
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RECEIPT / DASHBOARD */}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                alert(
                  "Receipt download can be connected to your Payment Tracking page.",
                );
              }}
              className="flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-5 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <ReceiptText className="h-5 w-5" />
              View Receipt
            </button>

            <button
              type="button"
              onClick={handleDone}
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3.5 font-bold text-white transition hover:bg-green-700"
            >
              Go to Dashboard
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[95vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* =================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between border-b bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100">
              <Wheat className="h-6 w-6 text-green-700" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {paymentStage === "payment"
                  ? "Secure Payment"
                  : paymentStage === "processing"
                    ? "Processing Payment"
                    : paymentStage === "success"
                      ? "Booking Confirmed"
                      : "Book Procurement Slot"}
              </h2>

              <p className="text-sm text-gray-500">
                {paymentStage === "payment"
                  ? "Choose your preferred payment method"
                  : paymentStage === "processing"
                    ? "Please wait..."
                    : paymentStage === "success"
                      ? "Your procurement slot is ready"
                      : "Reserve your mandi arrival time"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={paymentStage === "processing"}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* =================================================
            PAYMENT
        ================================================== */}

        {paymentStage === "payment" && renderPaymentScreen()}

        {/* =================================================
            PROCESSING
        ================================================== */}

        {paymentStage === "processing" && renderProcessingScreen()}

        {/* =================================================
            SUCCESS
        ================================================== */}

        {paymentStage === "success" && renderSuccessScreen()}

        {/* =================================================
            REVIEW / BOOKING FORM
        ================================================== */}

        {paymentStage === "review" && (
          <div className="max-h-[80vh] overflow-y-auto p-6">
            {/* ERROR */}

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* STEP INDICATOR */}

            <div className="mb-7 flex items-center justify-between overflow-x-auto pb-2">
              <div className="flex min-w-max items-center gap-2">
                <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  <Map className="h-4 w-4" />
                  Location
                </div>

                <ChevronRight className="h-4 w-4 text-gray-400" />

                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  <CalendarDays className="h-4 w-4" />
                  Schedule
                </div>

                <ChevronRight className="h-4 w-4 text-gray-400" />

                <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                  <Truck className="h-4 w-4" />
                  Details
                </div>

                <ChevronRight className="h-4 w-4 text-gray-400" />

                <div className="flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
                  <IndianRupee className="h-4 w-4" />
                  Payment
                </div>
              </div>
            </div>

            {/* =================================================
                LOCATION
            ================================================== */}

            <div className="rounded-3xl border bg-gray-50 p-5">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">
                  1. Select Procurement Location
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Select your district, block and procurement center.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {/* DISTRICT */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    District
                  </label>

                  <select
                    value={selectedDistrict}
                    onChange={(event) =>
                      handleDistrictChange(event.target.value)
                    }
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="">Select District</option>

                    {WEST_BENGAL_DISTRICTS.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BLOCK */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Block
                  </label>

                  <select
                    value={selectedBlock}
                    disabled={!selectedDistrict}
                    onChange={(event) => handleBlockChange(event.target.value)}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="">
                      {!selectedDistrict
                        ? "Select district first"
                        : "Select Block"}
                    </option>

                    {availableBlocks.map((block) => (
                      <option key={block} value={block}>
                        {block}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CENTER */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Procurement Center
                  </label>

                  <select
                    value={selectedCenterId}
                    disabled={!selectedBlock}
                    onChange={(event) => handleCenterChange(event.target.value)}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="">
                      {!selectedBlock
                        ? "Select block first"
                        : blockCenters.length === 0
                          ? "No center found"
                          : "Select Procurement Center"}
                    </option>

                    {blockCenters.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CENTER INFO */}

              {targetCenter && (
                <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
                      <MapPin className="h-5 w-5 text-green-700" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-green-900">
                        {targetCenter.name}
                      </p>

                      <p className="mt-1 text-sm text-green-800">
                        {targetCenter.address}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-white px-3 py-1 font-medium text-green-700">
                          {targetCenter.district}
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 font-medium text-green-700">
                          {targetCenter.operatingHours}
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 font-medium text-green-700">
                          {targetCenter.distanceKm} km
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                CROP + DATE
            ================================================== */}

            <div className="mt-6 rounded-3xl border bg-white p-5">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">
                  2. Select Crop & Date
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Choose what you are bringing and when you want to arrive.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* CROP */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Crop
                  </label>

                  <select
                    value={selectedCrop}
                    onChange={(event) => {
                      setSelectedCrop(event.target.value as CropType);
                      setSelectedTimeWindow("");
                    }}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  >
                    {cropOptions.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>

                  <div className="mt-3 rounded-2xl border border-green-100 bg-green-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-green-700">
                          Procurement Rate
                        </p>

                        <p className="mt-1 text-lg font-bold text-green-900">
                          ₹{mspRatePerKg.toFixed(2)} / KG
                        </p>

                        <p className="mt-1 text-xs text-green-700">
                          ₹{mspRatePerQuintal.toLocaleString("en-IN")} / quintal
                        </p>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                        <IndianRupee className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* DATE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Procurement Date
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="date"
                      value={selectedDate}
                      min={getToday()}
                      onChange={(event) => {
                        setSelectedDate(event.target.value);
                        setSelectedTimeWindow("");
                      }}
                      className="w-full rounded-2xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Selected:{" "}
                    <span className="font-semibold text-gray-700">
                      {formatDisplayDate(selectedDate)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                TIME SLOTS
            ================================================== */}

            <div className="mt-6 rounded-3xl border bg-white p-5">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    3. Select Time Slot
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Choose a convenient one-hour arrival window.
                  </p>
                </div>

                <div className="hidden rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 sm:block">
                  1 hour slots
                </div>
              </div>

              {!selectedCenterId ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <Clock3 className="mx-auto h-8 w-8 text-gray-400" />

                  <p className="mt-3 font-semibold text-gray-700">
                    Select a procurement center first
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Available time slots will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {TIME_WINDOWS.map((timeWindow) => {
                    const status = getTimeStatus(timeWindow);

                    const selected = selectedTimeWindow === timeWindow;

                    const slot = getSlotForTime(timeWindow);

                    const remainingSlots = slot
                      ? Math.max(0, slot.totalSlots - slot.bookedSlots)
                      : null;

                    return (
                      <button
                        key={timeWindow}
                        type="button"
                        disabled={status === "unavailable"}
                        onClick={() => setSelectedTimeWindow(timeWindow)}
                        className={[
                          "rounded-2xl border p-4 text-left transition",
                          status === "unavailable"
                            ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-50"
                            : selected
                              ? "border-green-600 bg-green-600 text-white shadow-lg"
                              : "border-gray-200 bg-white hover:border-green-400 hover:bg-green-50",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <Clock3
                            className={[
                              "h-5 w-5",
                              selected ? "text-white" : "text-green-600",
                            ].join(" ")}
                          />

                          {selected && (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          )}
                        </div>

                        <p
                          className={[
                            "mt-3 text-sm font-bold",
                            selected ? "text-white" : "text-gray-900",
                          ].join(" ")}
                        >
                          {timeWindow}
                        </p>

                        <p
                          className={[
                            "mt-1 text-xs",
                            selected
                              ? "text-green-100"
                              : status === "unavailable"
                                ? "text-red-500"
                                : "text-gray-500",
                          ].join(" ")}
                        >
                          {status === "unavailable"
                            ? "Unavailable"
                            : remainingSlots !== null
                              ? `${remainingSlots} slots left`
                              : "Available"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* =================================================
                QUANTITY + VEHICLE
            ================================================== */}

            <div className="mt-6 rounded-3xl border bg-white p-5">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">
                  4. Enter Crop Quantity & Vehicle Details
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the expected quantity and vehicle number.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* QUANTITY */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Expected Quantity
                  </label>

                  <div className="relative">
                    <Package className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="number"
                      min="1"
                      max={maxQuantity}
                      step="0.01"
                      value={quantity}
                      onChange={(event) =>
                        handleQuantityChange(Number(event.target.value))
                      }
                      className="w-full rounded-2xl border border-gray-300 bg-white py-3.5 pl-12 pr-24 text-sm font-semibold outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      placeholder="Enter quantity"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                      Quintals
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-500">1 quintal = 100 KG</p>

                    <p className="text-xs font-semibold text-green-700">
                      {quantityKg.toLocaleString("en-IN")} KG
                    </p>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Maximum allowed: {maxQuantity} quintals
                  </p>
                </div>

                {/* VEHICLE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Vehicle Number
                  </label>

                  <div className="relative">
                    <Truck className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(event) =>
                        setVehicleNumber(event.target.value.toUpperCase())
                      }
                      placeholder="e.g. WB 24 AB 1234"
                      className="w-full rounded-2xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm font-semibold uppercase outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Enter the vehicle number you will use for procurement.
                  </p>
                </div>
              </div>

              {/* PROCUREMENT VALUE */}

              <div className="mt-6 rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700">
                      Estimated Procurement Value
                    </p>

                    <p className="mt-1 text-3xl font-black text-green-900">
                      ₹{estimatedValue.toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1 text-xs text-green-700">
                      Estimated amount based on current MSP rate.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <IndianRupee className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Expected Quantity</p>

                    <p className="mt-1 font-bold text-gray-900">
                      {quantityKg.toLocaleString("en-IN")} KG
                    </p>

                    <p className="text-xs text-gray-500">{quantity} quintals</p>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Procurement Rate</p>

                    <p className="mt-1 font-bold text-gray-900">
                      ₹{mspRatePerKg.toFixed(2)} / KG
                    </p>

                    <p className="text-xs text-gray-500">
                      ₹{mspRatePerQuintal.toLocaleString("en-IN")} / quintal
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Estimated Value</p>

                    <p className="mt-1 font-bold text-green-700">
                      ₹{estimatedValue.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                BOOKING SUMMARY
            ================================================== */}

            <div className="mt-6 rounded-3xl border-2 border-green-100 bg-green-50 p-5">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-green-700" />

                <div>
                  <h3 className="font-bold text-green-900">
                    5. Booking Summary
                  </h3>

                  <p className="text-xs text-green-700">
                    Check your details before continuing to payment.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs text-green-700">District</p>

                  <p className="font-semibold text-green-950">
                    {selectedDistrict || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-green-700">Block</p>

                  <p className="font-semibold text-green-950">
                    {selectedBlock || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-green-700">Center</p>

                  <p className="font-semibold text-green-950">
                    {targetCenter?.name || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-green-700">Crop</p>

                  <p className="font-semibold text-green-950">{selectedCrop}</p>
                </div>

                <div>
                  <p className="text-xs text-green-700">Date</p>

                  <p className="font-semibold text-green-950">
                    {formatDisplayDate(selectedDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-green-700">Time</p>

                  <p className="font-semibold text-green-950">
                    {selectedTimeWindow || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-green-700">Quantity</p>

                  <p className="font-semibold text-green-950">
                    {quantity} quintals
                    <span className="ml-1 text-sm font-medium text-green-700">
                      ({quantityKg.toLocaleString("en-IN")} KG)
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-xs text-green-700">Vehicle</p>

                  <p className="font-semibold text-green-950">
                    {vehicleNumber || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-green-700">Estimated MSP</p>

                  <p className="font-bold text-green-950">
                    ₹{estimatedValue.toLocaleString("en-IN")}
                  </p>

                  <p className="text-xs text-green-700">
                    Estimated amount farmer may receive
                  </p>
                </div>
              </div>

              {/* BOOKING FEE */}

              <div className="mt-5 rounded-2xl border-2 border-green-200 bg-white p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Booking & Service Fee
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Required to reserve your procurement slot.
                    </p>
                  </div>

                  <div className="text-2xl font-black text-gray-900">
                    ₹{BOOKING_FEE}
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                ACTION BUTTONS
            ================================================== */}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-2xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleProceedToPayment}
                className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-7 py-3.5 font-bold text-white shadow-lg transition hover:bg-green-700"
              >
                Proceed to Payment
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSlotModal;
