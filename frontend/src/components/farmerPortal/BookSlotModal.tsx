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
  Map,
} from "lucide-react";

import { useAuth, MSP_RATES } from "../../context/AuthContext";
import type { CropType, QueueToken } from "../../types";

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

  Kalimpong: [
    "Kalimpong-I",
    "Kalimpong-II",
    "Gorubathan",
  ],

  Kolkata: [
    "Kolkata Municipal Area",
  ],

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
  value
    .toLowerCase()
    .replace(/[–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/* =========================================================
   BLOCK → CENTER MATCHING
========================================================= */

const blockMatchesCenter = (
  centerName: string,
  centerAddress: string | undefined,
  block: string,
) => {
  const centerText = normalizeText(
    `${centerName} ${centerAddress || ""}`,
  );

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

  const simplifiedBlock = blockText
    .replace(/\s+i{1,3}$/i, "")
    .trim();

  return (
    simplifiedBlock.length > 2 &&
    centerText.includes(simplifiedBlock)
  );
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

  const [selectedDate, setSelectedDate] = useState(
    initialDate || getToday(),
  );

  const [selectedTimeWindow, setSelectedTimeWindow] = useState(
    initialTimeWindow || "",
  );

  const [quantity, setQuantity] = useState(25);

  const [vehicleNumber, setVehicleNumber] = useState("");

  /* =======================================================
     BOOKING STATE
  ======================================================= */

  const [error, setError] = useState("");

  /* =======================================================
     BLOCK LIST
  ======================================================= */

  const availableBlocks = useMemo(() => {
    if (!selectedDistrict) {
      return [];
    }

    return WEST_BENGAL_BLOCKS[selectedDistrict] || [];
  }, [selectedDistrict]);

  /* =======================================================
     DISTRICT CENTERS
  ======================================================= */

  const districtCenters = useMemo(() => {
    if (!selectedDistrict) {
      return [];
    }

    return centers.filter(
      (center) =>
        normalizeText(center.district) ===
        normalizeText(selectedDistrict),
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
      blockMatchesCenter(
        center.name,
        center.address,
        selectedBlock,
      ),
    );

    if (matched.length > 0) {
      return matched;
    }

    return districtCenters;
  }, [districtCenters, selectedBlock]);

  /* =======================================================
     TARGET CENTER
  ======================================================= */

  const targetCenter = useMemo(() => {
    return centers.find(
      (center) => center.id === selectedCenterId,
    );
  }, [centers, selectedCenterId]);

  /* =======================================================
     CROP OPTIONS
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
  }, [
    slots,
    selectedCenterId,
    selectedCrop,
    selectedDate,
  ]);

  const getSlotForTime = (timeWindow: string) => {
    return availableSlots.find(
      (slot) => slot.timeWindow === timeWindow,
    );
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

    if (
      slot.status === "closed" ||
      slot.status === "full"
    ) {
      return "unavailable";
    }

    if (slot.bookedSlots >= slot.totalSlots) {
      return "unavailable";
    }

    if (
      slot.totalCapacityQuintals -
        slot.bookedCapacityQuintals <=
      0
    ) {
      return "unavailable";
    }

    return "available";
  };

  /* =======================================================
     AUTO SELECT FIRST AVAILABLE TIME
  ======================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

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
  }, [
    isOpen,
    selectedCenterId,
    selectedDate,
    selectedCrop,
    slots,
  ]);

  /* =======================================================
     MSP CALCULATION
  ======================================================= */

  const mspRatePerQuintal =
    MSP_RATES[selectedCrop] || 0;

  const mspRatePerKg =
    mspRatePerQuintal / 100;

  const quantityKg =
    quantity * 100;

  const estimatedValue =
    quantity * mspRatePerQuintal;

  /* =======================================================
     MAX QUANTITY
  ======================================================= */

  const maxQuantity = useMemo(() => {
    if (!selectedSlot) {
      return 500;
    }

    const remaining =
      selectedSlot.totalCapacityQuintals -
      selectedSlot.bookedCapacityQuintals;

    return Math.max(
      1,
      Math.min(500, remaining),
    );
  }, [selectedSlot]);

  /* =======================================================
     QUANTITY CHANGE
  ======================================================= */

  const handleQuantityChange = (
    value: number,
  ) => {
    if (Number.isNaN(value)) {
      setQuantity(1);
      return;
    }

    setQuantity(
      Math.max(
        1,
        Math.min(maxQuantity, value),
      ),
    );
  };

  /* =======================================================
     DISTRICT CHANGE
  ======================================================= */

  const handleDistrictChange = (
    district: string,
  ) => {
    setSelectedDistrict(district);
    setSelectedBlock("");
    setSelectedCenterId("");
    setSelectedTimeWindow("");
    setError("");
  };

  /* =======================================================
     BLOCK CHANGE
  ======================================================= */

  const handleBlockChange = (
    block: string,
  ) => {
    setSelectedBlock(block);
    setSelectedCenterId("");
    setSelectedTimeWindow("");
    setError("");
  };

  /* =======================================================
     CENTER CHANGE
  ======================================================= */

  const handleCenterChange = (
    centerId: string,
  ) => {
    setSelectedCenterId(centerId);
    setSelectedTimeWindow("");
    setError("");

    const center = centers.find(
      (item) => item.id === centerId,
    );

    if (center) {
      setSelectedDistrict(center.district);

      const blocks =
        WEST_BENGAL_BLOCKS[
          center.district
        ] || [];

      const matchedBlock = blocks.find(
        (block) =>
          blockMatchesCenter(
            center.name,
            center.address,
            block,
          ),
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
      setError(
        "Please select a district.",
      );
      return false;
    }

    if (!selectedBlock) {
      setError(
        "Please select a block.",
      );
      return false;
    }

    if (!selectedCenterId) {
      setError(
        "Please select a procurement center.",
      );
      return false;
    }

    if (!selectedDate) {
      setError(
        "Please select a date.",
      );
      return false;
    }

    if (!selectedTimeWindow) {
      setError(
        "Please select a time slot.",
      );
      return false;
    }

    if (
      getTimeStatus(
        selectedTimeWindow,
      ) === "unavailable"
    ) {
      setError(
        "This time slot is no longer available. Please select another slot.",
      );
      return false;
    }

    if (
      !quantity ||
      quantity < 1 ||
      quantity > maxQuantity
    ) {
      setError(
        `Quantity must be between 1 and ${maxQuantity} quintals.`,
      );
      return false;
    }

    if (!vehicleNumber.trim()) {
      setError(
        "Please enter your vehicle number.",
      );
      return false;
    }

    if (!targetCenter) {
      setError(
        "Procurement center could not be found.",
      );
      return false;
    }

    return true;
  };

  /* =======================================================
     BOOK SLOT
  ======================================================= */

  const handleBooking = () => {
    if (!validateBooking()) {
      return;
    }

    setError("");

    try {
      const token = bookNewSlot({
        centerId: selectedCenterId,
        crop: selectedCrop,
        date: selectedDate,
        timeWindow: selectedTimeWindow,
        quantityQuintals: quantity,
        vehicleNumber:
          vehicleNumber
            .trim()
            .toUpperCase(),
      });

      if (!token) {
        setError(
          "Booking could not be created. Please try again.",
        );
        return;
      }

      /*
        Booking successful.

        bookNewSlot() creates the queue token.
        onBookingSuccess() sends the token to the parent.
      */

      if (onBookingSuccess) {
        onBookingSuccess(token);
      }

      /*
        Close modal and go directly to dashboard.
        No payment screen.
        No payment processing.
        No transaction ID.
      */

      onClose();

      navigate("/dashboard", {
        replace: true,
      });
    } catch (bookingError) {
      console.error(
        "Booking error:",
        bookingError,
      );

      setError(
        bookingError instanceof Error
          ? bookingError.message
          : "Booking failed. Please try again.",
      );
    }
  };

  /* =======================================================
     CLOSE
  ======================================================= */

  const handleClose = () => {
    setError("");
    onClose();
  };

  /* =======================================================
     RENDER
  ======================================================= */

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
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
                Book Procurement Slot
              </h2>

              <p className="text-sm text-gray-500">
                Reserve your mandi arrival time
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* =================================================
            MAIN BOOKING FORM
        ================================================== */}

        <div className="max-h-[80vh] overflow-y-auto p-6">

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* =================================================
              STEP INDICATOR
          ================================================== */}

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
                    handleDistrictChange(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">
                    Select District
                  </option>

                  {WEST_BENGAL_DISTRICTS.map(
                    (district) => (
                      <option
                        key={district}
                        value={district}
                      >
                        {district}
                      </option>
                    ),
                  )}
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
                  onChange={(event) =>
                    handleBlockChange(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">
                    {!selectedDistrict
                      ? "Select district first"
                      : "Select Block"}
                  </option>

                  {availableBlocks.map(
                    (block) => (
                      <option
                        key={block}
                        value={block}
                      >
                        {block}
                      </option>
                    ),
                  )}
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
                  onChange={(event) =>
                    handleCenterChange(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">
                    {!selectedBlock
                      ? "Select block first"
                      : blockCenters.length === 0
                        ? "No center found"
                        : "Select Procurement Center"}
                  </option>

                  {blockCenters.map(
                    (center) => (
                      <option
                        key={center.id}
                        value={center.id}
                      >
                        {center.name}
                      </option>
                    ),
                  )}
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
                    setSelectedCrop(
                      event.target.value as CropType,
                    );

                    setSelectedTimeWindow("");
                  }}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  {cropOptions.map(
                    (crop) => (
                      <option
                        key={crop}
                        value={crop}
                      >
                        {crop}
                      </option>
                    ),
                  )}
                </select>

                {/* MSP */}

                <div className="mt-3 rounded-2xl border border-green-100 bg-green-50 p-4">
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-medium text-green-700">
                        Procurement Rate
                      </p>

                      <p className="mt-1 text-lg font-bold text-green-900">
                        ₹
                        {mspRatePerKg.toFixed(
                          2,
                        )}{" "}
                        / KG
                      </p>

                      <p className="mt-1 text-xs text-green-700">
                        ₹
                        {mspRatePerQuintal.toLocaleString(
                          "en-IN",
                        )}{" "}
                        / quintal
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
                      setSelectedDate(
                        event.target.value,
                      );

                      setSelectedTimeWindow("");
                    }}
                    className="w-full rounded-2xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Selected:{" "}
                  <span className="font-semibold text-gray-700">
                    {formatDisplayDate(
                      selectedDate,
                    )}
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

                {TIME_WINDOWS.map(
                  (timeWindow) => {
                    const status =
                      getTimeStatus(
                        timeWindow,
                      );

                    const selected =
                      selectedTimeWindow ===
                      timeWindow;

                    const slot =
                      getSlotForTime(
                        timeWindow,
                      );

                    const remainingSlots =
                      slot
                        ? Math.max(
                            0,
                            slot.totalSlots -
                              slot.bookedSlots,
                          )
                        : null;

                    return (
                      <button
                        key={timeWindow}
                        type="button"
                        disabled={
                          status ===
                          "unavailable"
                        }
                        onClick={() =>
                          setSelectedTimeWindow(
                            timeWindow,
                          )
                        }
                        className={[
                          "rounded-2xl border p-4 text-left transition",

                          status ===
                          "unavailable"
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
                              selected
                                ? "text-white"
                                : "text-green-600",
                            ].join(" ")}
                          />

                          {selected && (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          )}

                        </div>

                        <p
                          className={[
                            "mt-3 text-sm font-bold",
                            selected
                              ? "text-white"
                              : "text-gray-900",
                          ].join(" ")}
                        >
                          {timeWindow}
                        </p>

                        <p
                          className={[
                            "mt-1 text-xs",

                            selected
                              ? "text-green-100"
                              : status ===
                                  "unavailable"
                                ? "text-red-500"
                                : "text-gray-500",
                          ].join(" ")}
                        >
                          {status ===
                          "unavailable"
                            ? "Unavailable"
                            : remainingSlots !==
                                null
                              ? `${remainingSlots} slots left`
                              : "Available"}
                        </p>

                      </button>
                    );
                  },
                )}

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
                      handleQuantityChange(
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                    className="w-full rounded-2xl border border-gray-300 bg-white py-3.5 pl-12 pr-24 text-sm font-semibold outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    placeholder="Enter quantity"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                    Quintals
                  </span>

                </div>

                <div className="mt-2 flex items-center justify-between">

                  <p className="text-xs text-gray-500">
                    1 quintal = 100 KG
                  </p>

                  <p className="text-xs font-semibold text-green-700">
                    {quantityKg.toLocaleString(
                      "en-IN",
                    )}{" "}
                    KG
                  </p>

                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Maximum allowed:{" "}
                  {maxQuantity} quintals
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
                      setVehicleNumber(
                        event.target.value.toUpperCase(),
                      )
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

            {/* =================================================
                PROCUREMENT VALUE
            ================================================== */}

            <div className="mt-6 rounded-2xl border-2 border-green-200 bg-green-50 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-semibold text-green-700">
                    Estimated Procurement Value
                  </p>

                  <p className="mt-1 text-3xl font-black text-green-900">
                    ₹
                    {estimatedValue.toLocaleString(
                      "en-IN",
                    )}
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

                  <p className="text-xs text-gray-500">
                    Expected Quantity
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    {quantityKg.toLocaleString(
                      "en-IN",
                    )}{" "}
                    KG
                  </p>

                  <p className="text-xs text-gray-500">
                    {quantity} quintals
                  </p>

                </div>

                <div className="rounded-xl bg-white p-3">

                  <p className="text-xs text-gray-500">
                    Procurement Rate
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    ₹
                    {mspRatePerKg.toFixed(
                      2,
                    )}{" "}
                    / KG
                  </p>

                  <p className="text-xs text-gray-500">
                    ₹
                    {mspRatePerQuintal.toLocaleString(
                      "en-IN",
                    )}{" "}
                    / quintal
                  </p>

                </div>

                <div className="rounded-xl bg-white p-3">

                  <p className="text-xs text-gray-500">
                    Estimated Value
                  </p>

                  <p className="mt-1 font-bold text-green-700">
                    ₹
                    {estimatedValue.toLocaleString(
                      "en-IN",
                    )}
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
                  Check your details before booking.
                </p>
              </div>

            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {/* DISTRICT */}

              <div>
                <p className="text-xs text-green-700">
                  District
                </p>

                <p className="font-semibold text-green-950">
                  {selectedDistrict || "—"}
                </p>
              </div>

              {/* BLOCK */}

              <div>
                <p className="text-xs text-green-700">
                  Block
                </p>

                <p className="font-semibold text-green-950">
                  {selectedBlock || "—"}
                </p>
              </div>

              {/* CENTER */}

              <div>
                <p className="text-xs text-green-700">
                  Center
                </p>

                <p className="font-semibold text-green-950">
                  {targetCenter?.name || "—"}
                </p>
              </div>

              {/* CROP */}

              <div>
                <p className="text-xs text-green-700">
                  Crop
                </p>

                <p className="font-semibold text-green-950">
                  {selectedCrop}
                </p>
              </div>

              {/* DATE */}

              <div>
                <p className="text-xs text-green-700">
                  Date
                </p>

                <p className="font-semibold text-green-950">
                  {formatDisplayDate(
                    selectedDate,
                  )}
                </p>
              </div>

              {/* TIME */}

              <div>
                <p className="text-xs text-green-700">
                  Time
                </p>

                <p className="font-semibold text-green-950">
                  {selectedTimeWindow || "—"}
                </p>
              </div>

              {/* QUANTITY */}

              <div>
                <p className="text-xs text-green-700">
                  Quantity
                </p>

                <p className="font-semibold text-green-950">
                  {quantity} quintals

                  <span className="ml-1 text-sm font-medium text-green-700">
                    (
                    {quantityKg.toLocaleString(
                      "en-IN",
                    )}{" "}
                    KG)
                  </span>
                </p>
              </div>

              {/* VEHICLE */}

              <div>
                <p className="text-xs text-green-700">
                  Vehicle
                </p>

                <p className="font-semibold text-green-950">
                  {vehicleNumber || "—"}
                </p>
              </div>

              {/* ESTIMATED MSP */}

              <div>
                <p className="text-xs text-green-700">
                  Estimated MSP
                </p>

                <p className="font-bold text-green-950">
                  ₹
                  {estimatedValue.toLocaleString(
                    "en-IN",
                  )}
                </p>

                <p className="text-xs text-green-700">
                  Estimated amount farmer may receive
                </p>
              </div>

            </div>

            {/* NO PAYMENT / NO BOOKING FEE */}

            <div className="mt-5 rounded-2xl border border-green-200 bg-white p-4">

              <div className="flex items-center gap-3">

                <CheckCircle2 className="h-5 w-5 text-green-600" />

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    No payment required
                  </p>

                  <p className="text-xs text-gray-500">
                    Your slot can be booked directly without any booking or service fee.
                  </p>
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
              onClick={handleBooking}
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-7 py-3.5 font-bold text-white shadow-lg transition hover:bg-green-700"
            >
              <CheckCircle2 className="h-5 w-5" />

              Book Slot

              <ChevronRight className="h-5 w-5" />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default BookSlotModal;