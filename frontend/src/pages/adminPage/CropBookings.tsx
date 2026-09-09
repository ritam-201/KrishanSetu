import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  Wheat,
  Plus,
  X,
  MapPin,
  User,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Phone,
  Sprout,
  CreditCard,
  Smartphone,
  Building2,
  ShieldCheck,
  LockKeyhole,
  ArrowRight,
  IndianRupee,
  Receipt,
} from "lucide-react";

import { adminFetch } from "../../utils/adminApi";
import { WEST_BENGAL_MANDIS } from "../../data/mandiData";

type Farmer = {
  userId: string;
  name?: string;
  phone?: string;
  email?: string;
  assignedCenterId?: string;
  assignedCenterName?: string;
  createdAt?: string;

  profile?: {
    farmerId?: string;
    fullName?: string;
    mobileNumber?: string;
    email?: string;
    village?: string;
    block?: string;
    district?: string;
    state?: string;

    crops?: {
      cropName: string;
      variety?: string;
      season?: string;
      expectedQuantityQuintals?: number;
      harvestDate?: string;
      expectedProcurementDate?: string;
    }[];

    preferredCenterId?: string;
    preferredTimeSlot?: string;
    verificationStatus?: string;
  } | null;
};

type Booking = {
  _id: string;
  procurementId: string;
  tokenNumber: number;

  farmerId: string;
  farmerName: string;

  centerId: string;
  centerName: string;

  crop: string;
  variety?: string;

  submittedQuantityQuintals: number;
  approvedQuantityQuintals?: number;
  rejectedQuantityQuintals?: number;

  pricePerQuintal?: number;
  estimatedAmount?: number;

  harvestDate?: string;

  lotNumber: string;
  qualityGrade?: string;

  status: string;

  createdAt?: string;
};

type Center = {
  id: string;
  name: string;
  code: string;
  district: string;
  state?: string;
  address?: string;
  acceptedCrops?: string[];
};

type PaymentMethod = "UPI" | "Card" | "Net Banking";

const CropBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [farmersLoading, setFarmersLoading] = useState(false);
  const [error, setError] = useState("");

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedMandiId, setSelectedMandiId] = useState("");
  const [selectedFarmerId, setSelectedFarmerId] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("");
  const [quantity, setQuantity] = useState("");
  const [harvestDate, setHarvestDate] = useState("");

  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

  // ============================================================
  // PAYMENT STATE
  // ============================================================

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("UPI");

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [upiId, setUpiId] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [bankName, setBankName] = useState("");

  const [transactionId, setTransactionId] = useState("");

  /*
  |--------------------------------------------------------------------------
  | CROP PROCUREMENT PRICES
  |--------------------------------------------------------------------------
  */

  const cropPrices: Record<string, number> = {
    "Rice / Paddy": 2369,
    Wheat: 2425,
    Mustard: 5950,
    Maize: 2400,
    "Bengal Gram (Chana)": 5650,
  };

  /*
  |--------------------------------------------------------------------------
  | FORMAT CURRENCY
  |--------------------------------------------------------------------------
  */

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  /*
  |--------------------------------------------------------------------------
  | DISTRICTS
  |--------------------------------------------------------------------------
  */

  const districts = useMemo(() => {
    return Array.from(
      new Set(
        (WEST_BENGAL_MANDIS as Center[]).map(
          (center) => center.district,
        ),
      ),
    ).sort();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | BLOCK NAME
  |--------------------------------------------------------------------------
  */

  const getBlockName = (center: Center) => {
    if ((center as any).block) {
      return (center as any).block;
    }

    const address = center.address || "";

    const match = address.match(
      /^([A-Za-z\s-]+?)(?:\s+(?:Agricultural|Market|Block|Main|Zone))/i,
    );

    if (match?.[1]) {
      return match[1].trim();
    }

    return address || "General";
  };

  /*
  |--------------------------------------------------------------------------
  | BLOCKS
  |--------------------------------------------------------------------------
  */

  const blocks = useMemo(() => {
    if (!selectedDistrict) return [];

    const districtCenters = (
      WEST_BENGAL_MANDIS as Center[]
    ).filter(
      (center) => center.district === selectedDistrict,
    );

    return Array.from(
      new Set(
        districtCenters.map((center) =>
          getBlockName(center),
        ),
      ),
    ).sort();
  }, [selectedDistrict]);

  /*
  |--------------------------------------------------------------------------
  | MANDIS
  |--------------------------------------------------------------------------
  */

  const mandis = useMemo(() => {
    if (!selectedDistrict) return [];

    const districtCenters = (
      WEST_BENGAL_MANDIS as Center[]
    ).filter(
      (center) => center.district === selectedDistrict,
    );

    if (!selectedBlock) {
      return districtCenters;
    }

    return districtCenters.filter(
      (center) =>
        getBlockName(center) === selectedBlock,
    );
  }, [selectedDistrict, selectedBlock]);

  /*
  |--------------------------------------------------------------------------
  | SELECTED MANDI
  |--------------------------------------------------------------------------
  */

  const selectedMandi = useMemo(() => {
    return (
      WEST_BENGAL_MANDIS as Center[]
    ).find(
      (center) => center.id === selectedMandiId,
    );
  }, [selectedMandiId]);

  /*
  |--------------------------------------------------------------------------
  | AVAILABLE FARMERS
  |--------------------------------------------------------------------------
  */

  const availableFarmers = useMemo(() => {
    if (
      !selectedDistrict ||
      !selectedBlock ||
      !selectedMandiId
    ) {
      return [];
    }

    return farmers.filter((farmer) => {
      const profile = farmer.profile;

      if (!profile) {
        return false;
      }

      const districtMatch =
        profile.district?.toLowerCase() ===
        selectedDistrict.toLowerCase();

      const blockMatch =
        profile.block?.toLowerCase() ===
        selectedBlock.toLowerCase();

      const mandiMatch =
        profile.preferredCenterId ===
          selectedMandiId ||
        farmer.assignedCenterId ===
          selectedMandiId;

      return (
        districtMatch &&
        blockMatch &&
        mandiMatch
      );
    });
  }, [
    farmers,
    selectedDistrict,
    selectedBlock,
    selectedMandiId,
  ]);

  /*
  |--------------------------------------------------------------------------
  | SELECTED FARMER
  |--------------------------------------------------------------------------
  */

  const selectedFarmer = useMemo(() => {
    return farmers.find(
      (farmer) =>
        farmer.profile?.farmerId ===
        selectedFarmerId,
    );
  }, [farmers, selectedFarmerId]);

  /*
  |--------------------------------------------------------------------------
  | FARMER CROPS
  |--------------------------------------------------------------------------
  */

  const farmerCrops = useMemo(() => {
    if (!selectedFarmer?.profile?.crops) {
      return [];
    }

    return selectedFarmer.profile.crops;
  }, [selectedFarmer]);

  /*
  |--------------------------------------------------------------------------
  | SELECTED CROP PRICE
  |--------------------------------------------------------------------------
  */

  const selectedCropPrice = useMemo(() => {
    if (!selectedCrop) {
      return 0;
    }

    return cropPrices[selectedCrop] || 0;
  }, [selectedCrop]);

  /*
  |--------------------------------------------------------------------------
  | ESTIMATED AMOUNT
  |--------------------------------------------------------------------------
  */

  const estimatedAmount = useMemo(() => {
    const quantityNumber = Number(quantity);

    if (
      !selectedCropPrice ||
      !Number.isFinite(quantityNumber) ||
      quantityNumber <= 0
    ) {
      return 0;
    }

    return Number(
      (
        quantityNumber *
        selectedCropPrice
      ).toFixed(2),
    );
  }, [quantity, selectedCropPrice]);

  /*
  |--------------------------------------------------------------------------
  | LOAD BOOKINGS
  |--------------------------------------------------------------------------
  */

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (status) {
        params.set("status", status);
      }

      if (search) {
        params.set("search", search);
      }

      const query = params.toString();

      const data = await adminFetch(
        `/api/admin/crop-bookings${
          query ? `?${query}` : ""
        }`,
      );

      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to load bookings",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD FARMERS
  |--------------------------------------------------------------------------
  */

  const loadFarmers = async () => {
    try {
      setFarmersLoading(true);

      const data = await adminFetch(
        "/api/admin/farmers",
      );

      setFarmers(data.farmers || []);
    } catch (err: any) {
      console.error(
        "Failed to load farmers:",
        err,
      );
    } finally {
      setFarmersLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBookings();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status]);

  useEffect(() => {
    loadFarmers();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | RESET BOOKING MODAL
  |--------------------------------------------------------------------------
  */

  const openBookingModal = () => {
    setSelectedDistrict("");
    setSelectedBlock("");
    setSelectedMandiId("");
    setSelectedFarmerId("");
    setSelectedCrop("");
    setSelectedVariety("");
    setQuantity("");
    setHarvestDate("");

    setBookingMessage("");
    setBookingError("");

    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    if (saving) return;

    setShowBookingModal(false);
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE BOOKING
  |--------------------------------------------------------------------------
  */

  const createBooking = async () => {
    setBookingError("");
    setBookingMessage("");

    if (!selectedDistrict) {
      setBookingError(
        "Please select a district.",
      );
      return;
    }

    if (!selectedBlock) {
      setBookingError(
        "Please select a block.",
      );
      return;
    }

    if (!selectedMandiId) {
      setBookingError(
        "Please select a mandi.",
      );
      return;
    }

    if (!selectedFarmerId) {
      setBookingError(
        "Please select a farmer.",
      );
      return;
    }

    if (!selectedCrop) {
      setBookingError(
        "Please select a crop.",
      );
      return;
    }

    if (!selectedCropPrice) {
      setBookingError(
        "Price is not configured for this crop.",
      );
      return;
    }

    if (
      !quantity ||
      Number(quantity) <= 0
    ) {
      setBookingError(
        "Please enter a valid quantity.",
      );
      return;
    }

    try {
      setSaving(true);

      const data = await adminFetch(
        "/api/admin/crop-bookings",
        {
          method: "POST",

          body: JSON.stringify({
            district: selectedDistrict,
            block: selectedBlock,
            centerId: selectedMandiId,
            farmerId: selectedFarmerId,
            crop: selectedCrop,
            variety:
              selectedVariety ||
              undefined,
            quantityQuintals:
              Number(quantity),
            harvestDate:
              harvestDate ||
              undefined,
          }),
        },
      );

      setBookingMessage(
        data.message ||
          "Crop booking created successfully.",
      );

      await loadBookings();

      setTimeout(() => {
        setShowBookingModal(false);
      }, 900);
    } catch (err: any) {
      setBookingError(
        err.message ||
          "Failed to create crop booking.",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PAYMENT
  |--------------------------------------------------------------------------
  */

  const openPaymentModal = (
    booking: Booking,
  ) => {
    setPaymentBooking(booking);

    setPaymentMethod("UPI");

    setPaymentProcessing(false);
    setPaymentSuccess(false);
    setPaymentError("");

    setUpiId("");

    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardCvv("");

    setBankName("");

    setTransactionId("");

    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    if (paymentProcessing) return;

    setShowPaymentModal(false);
    setPaymentBooking(null);
  };

  const validatePayment = () => {
    if (!paymentBooking) {
      return "Payment booking not found.";
    }

    if (
      !paymentBooking.estimatedAmount ||
      paymentBooking.estimatedAmount <= 0
    ) {
      return "Payment amount is not available for this booking.";
    }

    if (paymentMethod === "UPI") {
      if (!upiId.trim()) {
        return "Please enter a UPI ID.";
      }

      if (
        !upiId.includes("@") ||
        upiId.length < 5
      ) {
        return "Please enter a valid UPI ID.";
      }
    }

    if (paymentMethod === "Card") {
      if (
        cardNumber.replace(/\s/g, "")
          .length < 12
      ) {
        return "Please enter a valid card number.";
      }

      if (!cardName.trim()) {
        return "Please enter card holder name.";
      }

      if (
        cardExpiry.length < 5
      ) {
        return "Please enter card expiry.";
      }

      if (
        cardCvv.length < 3
      ) {
        return "Please enter CVV.";
      }
    }

    if (paymentMethod === "Net Banking") {
      if (!bankName) {
        return "Please select your bank.";
      }
    }

    return "";
  };

  const processPayment = async () => {
    const validationError =
      validatePayment();

    if (validationError) {
      setPaymentError(
        validationError,
      );
      return;
    }

    if (!paymentBooking) {
      return;
    }

    try {
      setPaymentError("");
      setPaymentProcessing(true);

      /*
       * --------------------------------------------------------
       * PAYMENT API
       * --------------------------------------------------------
       *
       * This sends the booking information to your backend.
       *
       * If your payment controller uses another URL,
       * change only this URL:
       *
       * /api/admin/payments
       *
       */

      const data = await adminFetch(
        "/api/admin/payments",
        {
          method: "POST",

          body: JSON.stringify({
            procurementId:
              paymentBooking.procurementId,

            bookingId:
              paymentBooking._id,

            farmerId:
              paymentBooking.farmerId,

            farmerName:
              paymentBooking.farmerName,

            tokenNumber:
              paymentBooking.tokenNumber,

            centerName:
              paymentBooking.centerName,

            crop:
              paymentBooking.crop,

            grossWeightQuintals:
              paymentBooking
                .approvedQuantityQuintals ??
              paymentBooking
                .submittedQuantityQuintals,

            mspRatePerQuintal:
              paymentBooking.pricePerQuintal ||
              0,

            grossAmount:
              paymentBooking.estimatedAmount ||
              0,

            deductions: 0,

            netPayable:
              paymentBooking.estimatedAmount ||
              0,

            paymentMethod,

            upiId:
              paymentMethod === "UPI"
                ? upiId
                : undefined,

            bankName:
              paymentMethod ===
              "Net Banking"
                ? bankName
                : undefined,
          }),
        },
      );

      /*
       * Backend can return any of these.
       */

      const generatedTransactionId =
        data.transactionId ||
        data.payment?.transactionId ||
        data.paymentId ||
        `TXN-${Date.now()}`;

      setTransactionId(
        generatedTransactionId,
      );

      setPaymentSuccess(true);

      /*
       * Refresh bookings after successful payment.
       */

      await loadBookings();
    } catch (err: any) {
      console.error(
        "Payment error:",
        err,
      );

      setPaymentError(
        err.message ||
          "Payment could not be completed.",
      );
    } finally {
      setPaymentProcessing(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const activeCount = bookings.filter(
    (booking) =>
      ![
        "Accepted",
        "Rejected",
      ].includes(booking.status),
  ).length;

  const acceptedCount =
    bookings.filter(
      (booking) =>
        booking.status ===
        "Accepted",
    ).length;

  const reviewCount =
    bookings.filter((booking) =>
      [
        "Verification",
        "Quality Check",
        "Hold",
      ].includes(booking.status),
    ).length;

  /*
  |--------------------------------------------------------------------------
  | STATUS STYLE
  |--------------------------------------------------------------------------
  */

  const getStatusClass = (
    value: string,
  ) => {
    switch (value) {
      case "Accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";

      case "Hold":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Quality Check":
      case "Verification":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Farmer Arrived":
        return "bg-purple-50 text-purple-700 border-purple-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PAYMENT STATUS
  |--------------------------------------------------------------------------
  */

  const canPay = (booking: Booking) => {
    return (
      booking.status !== "Rejected" &&
      !!booking.estimatedAmount &&
      booking.estimatedAmount > 0
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative overflow-hidden border-b border-slate-200 bg-white">

        <div className="absolute inset-0 pointer-events-none opacity-60">

          <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-emerald-100 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-lime-100 blur-3xl" />

        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-7">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>

              <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">

                <Sprout className="w-4 h-4" />

                ADMIN PROCUREMENT

              </div>

              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">

                Crop Bookings

              </h1>

              <p className="mt-2 text-slate-500 max-w-2xl">

                Manage farmer procurement bookings,
                mandi allocation, crop submissions
                and farmer payments from one place.

              </p>

            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                onClick={loadBookings}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition"
              >

                <RefreshCw className="w-4 h-4" />

                Refresh

              </button>

              <button
                onClick={openBookingModal}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
              >

                <Plus className="w-5 h-5" />

                New Crop Booking

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* ===================================================
            STATS
        =================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Current Results
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {bookings.length}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">

                <Wheat className="w-5 h-5 text-emerald-600" />

              </div>

            </div>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Active
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {activeCount}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <Clock3 className="w-5 h-5 text-blue-600" />

              </div>

            </div>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Accepted
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {acceptedCount}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">

                <CheckCircle2 className="w-5 h-5 text-emerald-600" />

              </div>

            </div>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Needs Review
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {reviewCount}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">

                <AlertCircle className="w-5 h-5 text-amber-600" />

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            BOOKINGS TABLE
        =================================================== */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="p-4 md:p-5 border-b border-slate-200">

            <div className="flex flex-col lg:flex-row gap-3">

              <div className="relative flex-1">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search farmer, ID or procurement ID..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />

              </div>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white"
              >

                <option value="">
                  All Statuses
                </option>

                <option value="Booked">
                  Booked
                </option>

                <option value="Scheduled">
                  Scheduled
                </option>

                <option value="Farmer Arrived">
                  Farmer Arrived
                </option>

                <option value="Verification">
                  Verification
                </option>

                <option value="Quality Check">
                  Quality Check
                </option>

                <option value="Accepted">
                  Accepted
                </option>

                <option value="Rejected">
                  Rejected
                </option>

                <option value="Hold">
                  Hold
                </option>

              </select>

            </div>

          </div>

          {loading ? (

            <div className="p-14 flex justify-center">

              <RefreshCw className="w-7 h-7 animate-spin text-emerald-600" />

            </div>

          ) : error ? (

            <div className="p-8 text-center">

              <AlertCircle className="w-10 h-10 mx-auto text-red-400" />

              <p className="mt-3 text-red-600">
                {error}
              </p>

              <button
                onClick={loadBookings}
                className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white"
              >
                Try Again
              </button>

            </div>

          ) : bookings.length === 0 ? (

            <div className="p-14 text-center">

              <Wheat className="w-12 h-12 mx-auto text-slate-300" />

              <p className="mt-4 text-slate-600 font-medium">
                No crop bookings found.
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Create a new booking to get started.
              </p>

              <button
                onClick={openBookingModal}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium"
              >

                <Plus className="w-4 h-4" />

                Create Booking

              </button>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Booking
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Farmer
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Crop
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Quantity
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Price
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Est. Amount
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Mandi
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Quality
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Payment
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {bookings.map(
                    (booking) => (

                      <tr
                        key={booking._id}
                        className="border-t border-slate-100 hover:bg-slate-50/70 transition"
                      >

                        <td className="p-4">

                          <div className="font-semibold text-slate-900">
                            {booking.procurementId}
                          </div>

                          <div className="text-xs text-slate-500 mt-1">
                            Token #{booking.tokenNumber}
                          </div>

                          <div className="text-xs text-slate-400">
                            {booking.lotNumber}
                          </div>

                        </td>

                        <td className="p-4">

                          <div className="flex items-center gap-2">

                            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">

                              <User className="w-4 h-4 text-emerald-600" />

                            </div>

                            <div>

                              <div className="font-medium text-slate-900">
                                {booking.farmerName}
                              </div>

                              <div className="text-xs text-slate-500">
                                {booking.farmerId}
                              </div>

                            </div>

                          </div>

                        </td>

                        <td className="p-4">

                          <div className="font-medium text-slate-900">
                            {booking.crop}
                          </div>

                          <div className="text-xs text-slate-500">
                            {booking.variety ||
                              "No variety"}
                          </div>

                        </td>

                        <td className="p-4">

                          <div className="font-semibold text-slate-900">
                            {
                              booking.submittedQuantityQuintals
                            }{" "}
                            Qtl
                          </div>

                          {booking.approvedQuantityQuintals !==
                            undefined && (

                            <div className="text-xs text-emerald-600">

                              Approved:{" "}
                              {
                                booking.approvedQuantityQuintals
                              }{" "}
                              Qtl

                            </div>

                          )}

                        </td>

                        <td className="p-4">

                          {booking.pricePerQuintal ? (

                            <>

                              <div className="font-semibold text-slate-900">
                                {formatCurrency(
                                  booking.pricePerQuintal,
                                )}
                              </div>

                              <div className="text-xs text-slate-400">
                                per Qtl
                              </div>

                            </>

                          ) : (

                            <span className="text-slate-400">
                              —
                            </span>

                          )}

                        </td>

                        <td className="p-4">

                          {booking.estimatedAmount ? (

                            <div className="font-bold text-emerald-700">

                              {formatCurrency(
                                booking.estimatedAmount,
                              )}

                            </div>

                          ) : (

                            <span className="text-slate-400">
                              —
                            </span>

                          )}

                        </td>

                        <td className="p-4">

                          <div className="font-medium text-slate-900">
                            {booking.centerName}
                          </div>

                          <div className="text-xs text-slate-500">
                            {booking.centerId}
                          </div>

                        </td>

                        <td className="p-4">

                          <span className="text-xs font-medium">

                            {booking.qualityGrade ||
                              "Pending"}

                          </span>

                        </td>

                        <td className="p-4">

                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${getStatusClass(
                              booking.status,
                            )}`}
                          >

                            {booking.status}

                          </span>

                        </td>

                        {/* PAYMENT BUTTON */}

                        <td className="p-4">

                          {canPay(booking) ? (

                            <button
                              onClick={() =>
                                openPaymentModal(
                                  booking,
                                )
                              }
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#123D24] text-white text-xs font-bold hover:bg-[#1B4D2A] transition shadow-sm"
                            >

                              <IndianRupee className="w-3.5 h-3.5" />

                              View Payment

                            </button>

                          ) : (

                            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold">

                              Payment unavailable

                            </span>

                          )}

                        </td>

                      </tr>

                    ),
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* =====================================================
          NEW BOOKING MODAL
      ===================================================== */}

      {showBookingModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={closeBookingModal}
          />

          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">

            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">

                  <Sprout className="w-4 h-4" />

                  NEW PROCUREMENT

                </div>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Create Crop Booking
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  District → Block → Mandi →
                  Farmer → Crop
                </p>

              </div>

              <button
                onClick={closeBookingModal}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200"
              >

                <X className="w-5 h-5" />

              </button>

            </div>

            <div className="p-6 space-y-6">

              {/* PROGRESS */}

              <div className="grid grid-cols-5 gap-2">

                {[
                  "District",
                  "Block",
                  "Mandi",
                  "Farmer",
                  "Crop",
                ].map(
                  (
                    step,
                    index,
                  ) => {

                    const active =
                      index === 0
                        ? !!selectedDistrict
                        : index === 1
                          ? !!selectedBlock
                          : index === 2
                            ? !!selectedMandiId
                            : index === 3
                              ? !!selectedFarmerId
                              : !!selectedCrop;

                    return (

                      <div key={step}>

                        <div
                          className={`h-1.5 rounded-full ${
                            active
                              ? "bg-emerald-500"
                              : "bg-slate-200"
                          }`}
                        />

                        <p className="text-[11px] text-slate-500 mt-1">
                          {step}
                        </p>

                      </div>

                    );
                  },
                )}

              </div>

              {/* DISTRICT / BLOCK */}

              <div className="grid md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    District
                  </label>

                  <select
                    value={selectedDistrict}
                    onChange={(e) => {

                      setSelectedDistrict(
                        e.target.value,
                      );

                      setSelectedBlock("");
                      setSelectedMandiId("");
                      setSelectedFarmerId("");
                      setSelectedCrop("");
                      setSelectedVariety("");
                      setQuantity("");
                      setHarvestDate("");

                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none focus:border-emerald-500"
                  >

                    <option value="">
                      Select district
                    </option>

                    {districts.map(
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

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Block
                  </label>

                  <select
                    value={selectedBlock}
                    disabled={!selectedDistrict}
                    onChange={(e) => {

                      setSelectedBlock(
                        e.target.value,
                      );

                      setSelectedMandiId("");
                      setSelectedFarmerId("");
                      setSelectedCrop("");
                      setSelectedVariety("");
                      setQuantity("");
                      setHarvestDate("");

                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none disabled:bg-slate-100 focus:border-emerald-500"
                  >

                    <option value="">

                      {selectedDistrict
                        ? "Select block"
                        : "Select district first"}

                    </option>

                    {blocks.map(
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

              </div>

              {/* MANDI */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Procurement Mandi
                </label>

                <select
                  value={selectedMandiId}
                  disabled={!selectedBlock}
                  onChange={(e) => {

                    setSelectedMandiId(
                      e.target.value,
                    );

                    setSelectedFarmerId("");
                    setSelectedCrop("");
                    setSelectedVariety("");
                    setQuantity("");
                    setHarvestDate("");

                  }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none disabled:bg-slate-100 focus:border-emerald-500"
                >

                  <option value="">

                    {selectedBlock
                      ? "Select mandi"
                      : "Select block first"}

                  </option>

                  {mandis.map(
                    (mandi) => (

                      <option
                        key={mandi.id}
                        value={mandi.id}
                      >

                        {mandi.name} —{" "}
                        {mandi.code}

                      </option>

                    ),
                  )}

                </select>

                {selectedMandi && (

                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">

                    <div className="flex items-start gap-3">

                      <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />

                      <div>

                        <p className="font-semibold text-emerald-900">
                          {selectedMandi.name}
                        </p>

                        <p className="text-sm text-emerald-700">
                          {selectedMandi.address}
                        </p>

                      </div>

                    </div>

                  </div>

                )}

              </div>

              {/* FARMER */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Farmer
                </label>

                <select
                  value={selectedFarmerId}
                  disabled={
                    !selectedMandiId ||
                    farmersLoading
                  }
                  onChange={(e) => {

                    setSelectedFarmerId(
                      e.target.value,
                    );

                    setSelectedCrop("");
                    setSelectedVariety("");
                    setQuantity("");
                    setHarvestDate("");

                  }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none disabled:bg-slate-100 focus:border-emerald-500"
                >

                  <option value="">

                    {farmersLoading
                      ? "Loading farmers..."
                      : !selectedMandiId
                        ? "Select mandi first"
                        : availableFarmers.length ===
                            0
                          ? "No farmers found for this block"
                          : "Select farmer"}

                  </option>

                  {availableFarmers.map(
                    (farmer) => {

                      const id =
                        farmer.profile
                          ?.farmerId ||
                        "";

                      const name =
                        farmer.profile
                          ?.fullName ||
                        farmer.name ||
                        "Unknown Farmer";

                      return (

                        <option
                          key={id}
                          value={id}
                        >

                          {name} — {id}

                        </option>

                      );

                    },
                  )}

                </select>

                {selectedFarmer?.profile && (

                  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center">

                          <User className="w-5 h-5 text-emerald-600" />

                        </div>

                        <div>

                          <p className="font-bold text-slate-900">
                            {
                              selectedFarmer
                                .profile
                                .fullName
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            {
                              selectedFarmer
                                .profile
                                .farmerId
                            }
                          </p>

                        </div>

                      </div>

                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">

                        {
                          selectedFarmer
                            .profile
                            .verificationStatus ||
                          "Verified"
                        }

                      </span>

                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 mt-4">

                      <div className="bg-white rounded-xl p-3 border border-slate-200">

                        <div className="flex items-center gap-2 text-slate-400">

                          <Phone className="w-3.5 h-3.5" />

                          <span className="text-xs">
                            Mobile
                          </span>

                        </div>

                        <p className="text-sm font-medium mt-1">
                          {
                            selectedFarmer
                              .profile
                              .mobileNumber ||
                            selectedFarmer.phone ||
                            "—"
                          }
                        </p>

                      </div>

                      <div className="bg-white rounded-xl p-3 border border-slate-200">

                        <div className="flex items-center gap-2 text-slate-400">

                          <MapPin className="w-3.5 h-3.5" />

                          <span className="text-xs">
                            Village
                          </span>

                        </div>

                        <p className="text-sm font-medium mt-1">
                          {
                            selectedFarmer
                              .profile
                              .village ||
                            "—"
                          }
                        </p>

                      </div>

                      <div className="bg-white rounded-xl p-3 border border-slate-200">

                        <div className="flex items-center gap-2 text-slate-400">

                          <MapPin className="w-3.5 h-3.5" />

                          <span className="text-xs">
                            Block
                          </span>

                        </div>

                        <p className="text-sm font-medium mt-1">
                          {
                            selectedFarmer
                              .profile
                              .block ||
                            "—"
                          }
                        </p>

                      </div>

                    </div>

                  </div>

                )}

              </div>

              {/* CROP */}

              <div className="grid md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Crop
                  </label>

                  <select
                    value={selectedCrop}
                    disabled={!selectedFarmerId}
                    onChange={(e) => {

                      const cropName =
                        e.target.value;

                      setSelectedCrop(
                        cropName,
                      );

                      const cropDetails =
                        farmerCrops.find(
                          (crop) =>
                            crop.cropName ===
                            cropName,
                        );

                      setSelectedVariety(
                        cropDetails?.variety ||
                          "",
                      );

                      if (
                        cropDetails?.harvestDate
                      ) {

                        setHarvestDate(
                          cropDetails.harvestDate,
                        );

                      } else {

                        setHarvestDate("");

                      }

                      setQuantity("");

                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none disabled:bg-slate-100 focus:border-emerald-500"
                  >

                    <option value="">

                      {selectedFarmerId
                        ? "Select crop"
                        : "Select farmer first"}

                    </option>

                    {farmerCrops.map(
                      (
                        crop,
                        index,
                      ) => (

                        <option
                          key={`${crop.cropName}-${index}`}
                          value={
                            crop.cropName
                          }
                        >

                          {crop.cropName}

                        </option>

                      ),
                    )}

                  </select>

                </div>

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Variety
                  </label>

                  <input
                    value={selectedVariety}
                    onChange={(e) =>
                      setSelectedVariety(
                        e.target.value,
                      )
                    }
                    disabled={!selectedCrop}
                    placeholder="e.g. Swarna"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none disabled:bg-slate-100 focus:border-emerald-500"
                  />

                </div>

              </div>

              {/* PRICE CARD */}

              {selectedCrop &&
                selectedCropPrice > 0 && (

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center border border-emerald-100">

                        <Wheat className="w-5 h-5 text-emerald-600" />

                      </div>

                      <div>

                        <p className="text-xs uppercase tracking-wider text-emerald-600 font-bold">
                          Procurement Price
                        </p>

                        <p className="text-lg font-bold text-emerald-900 mt-0.5">
                          {formatCurrency(
                            selectedCropPrice,
                          )}{" "}
                          / Quintal
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 grid sm:grid-cols-2 gap-3">

                      <div className="bg-white rounded-xl border border-emerald-100 p-3">

                        <p className="text-xs text-slate-500">
                          Price per Quintal
                        </p>

                        <p className="text-base font-bold text-slate-900 mt-1">
                          {formatCurrency(
                            selectedCropPrice,
                          )}
                        </p>

                      </div>

                      <div className="bg-white rounded-xl border border-emerald-100 p-3">

                        <p className="text-xs text-slate-500">
                          Estimated Booking Amount
                        </p>

                        <p className="text-base font-bold text-emerald-700 mt-1">

                          {estimatedAmount >
                          0
                            ? formatCurrency(
                                estimatedAmount,
                              )
                            : "Enter quantity"}

                        </p>

                      </div>

                    </div>

                  </div>

                )}

              {/* QUANTITY / HARVEST */}

              <div className="grid md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Quantity (Quintals)
                  </label>

                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        e.target.value,
                      )
                    }
                    placeholder="Enter quantity"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                  />

                  {selectedFarmer &&
                    selectedCrop && (

                      <p className="text-xs text-slate-500 mt-2">

                        Farmer expected quantity:{" "}

                        {
                          farmerCrops.find(
                            (crop) =>
                              crop.cropName ===
                              selectedCrop,
                          )
                            ?.expectedQuantityQuintals ??
                          "—"
                        }{" "}
                        Qtl

                      </p>

                    )}

                </div>

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Harvest Date
                  </label>

                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) =>
                      setHarvestDate(
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                  />

                </div>

              </div>

              {/* BOOKING SUMMARY */}

              {selectedFarmer &&
                selectedMandi &&
                selectedCrop &&
                quantity && (

                  <div className="rounded-2xl bg-slate-900 text-white p-5">

                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Booking Summary
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 mt-4">

                      <div>
                        <p className="text-slate-400 text-xs">
                          Farmer
                        </p>

                        <p className="font-semibold mt-1">
                          {
                            selectedFarmer
                              .profile
                              ?.fullName
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400 text-xs">
                          Farmer ID
                        </p>

                        <p className="font-semibold mt-1">
                          {
                            selectedFarmer
                              .profile
                              ?.farmerId
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400 text-xs">
                          Mandi
                        </p>

                        <p className="font-semibold mt-1">
                          {selectedMandi.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400 text-xs">
                          Crop
                        </p>

                        <p className="font-semibold mt-1">
                          {selectedCrop}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400 text-xs">
                          Quantity
                        </p>

                        <p className="font-semibold mt-1">
                          {quantity} Qtl
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400 text-xs">
                          District / Block
                        </p>

                        <p className="font-semibold mt-1">
                          {selectedDistrict}{" "}
                          / {selectedBlock}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400 text-xs">
                          Price per Quintal
                        </p>

                        <p className="font-semibold text-emerald-400 mt-1">
                          {formatCurrency(
                            selectedCropPrice,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400 text-xs">
                          Estimated Amount
                        </p>

                        <p className="text-xl font-bold text-emerald-400 mt-1">
                          {estimatedAmount >
                          0
                            ? formatCurrency(
                                estimatedAmount,
                              )
                            : "—"}
                        </p>

                      </div>

                    </div>

                    {estimatedAmount >
                      0 && (

                      <div className="mt-5 pt-4 border-t border-slate-700">

                        <div className="flex items-center justify-between gap-4">

                          <span className="text-sm text-slate-400">

                            {quantity} Qtl ×{" "}

                            {formatCurrency(
                              selectedCropPrice,
                            )}

                          </span>

                          <span className="text-lg font-bold text-white">

                            {formatCurrency(
                              estimatedAmount,
                            )}

                          </span>

                        </div>

                      </div>

                    )}

                  </div>

                )}

              {/* MESSAGES */}

              {bookingError && (

                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">

                  <AlertCircle className="w-5 h-5 mt-0.5" />

                  <p className="text-sm font-medium">
                    {bookingError}
                  </p>

                </div>

              )}

              {bookingMessage && (

                <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">

                  <CheckCircle2 className="w-5 h-5 mt-0.5" />

                  <p className="text-sm font-medium">
                    {bookingMessage}
                  </p>

                </div>

              )}

            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">

              <button
                onClick={closeBookingModal}
                disabled={saving}
                className="px-5 py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={createBooking}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >

                {saving ? (

                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Booking...
                  </>

                ) : (

                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Booking
                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          PAYMENT MODAL
      ===================================================== */}

      {showPaymentModal &&
        paymentBooking && (

          <div className="fixed inset-0 z-70 flex items-center justify-center p-4">

            {/* BACKDROP */}

            <div
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
              onClick={closePaymentModal}
            />

            {/* PAYMENT WINDOW */}

            <div className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto bg-[#f8faf8] rounded-4xlshadow-2xl">

              {/* =================================================
                  PAYMENT HEADER
              ================================================= */}

              <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 md:px-8 py-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">

                      <IndianRupee className="w-6 h-6 text-emerald-600" />

                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <ShieldCheck className="w-4 h-4 text-emerald-600" />

                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">

                          Secure Payment

                        </span>

                      </div>

                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5">

                        Farmer Procurement Payment

                      </h2>

                    </div>

                  </div>

                  <button
                    onClick={closePaymentModal}
                    disabled={paymentProcessing}
                    className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 disabled:opacity-50"
                  >

                    <X className="w-5 h-5" />

                  </button>

                </div>

              </div>

              {paymentSuccess ? (

                /* =================================================
                   SUCCESS SCREEN
                ================================================= */

                <div className="p-8 md:p-14">

                  <div className="max-w-xl mx-auto text-center">

                    <div className="mx-auto w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">

                      <CheckCircle2 className="w-14 h-14 text-emerald-600" />

                    </div>

                    <p className="text-emerald-600 text-sm font-bold uppercase tracking-wider mt-7">
                      Payment Successful
                    </p>

                    <h2 className="text-3xl font-bold text-slate-900 mt-2">
                      Payment Completed
                    </h2>

                    <p className="text-slate-500 mt-3">
                      The payment request for{" "}
                      <strong>
                        {paymentBooking.farmerName}
                      </strong>{" "}
                      has been successfully processed.
                    </p>

                    <div className="mt-7 rounded-2xl bg-white border border-slate-200 p-5 text-left shadow-sm">

                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">

                        <div>

                          <p className="text-xs text-slate-500">
                            Amount Paid
                          </p>

                          <p className="text-2xl font-bold text-emerald-700 mt-1">
                            {formatCurrency(
                              paymentBooking.estimatedAmount ||
                                0,
                            )}
                          </p>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">

                          <IndianRupee className="w-6 h-6 text-emerald-600" />

                        </div>

                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 mt-4">

                        <div>

                          <p className="text-xs text-slate-400">
                            Farmer
                          </p>

                          <p className="font-semibold text-slate-800 mt-1">
                            {
                              paymentBooking.farmerName
                            }
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-slate-400">
                            Farmer ID
                          </p>

                          <p className="font-semibold text-slate-800 mt-1">
                            {
                              paymentBooking.farmerId
                            }
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-slate-400">
                            Procurement ID
                          </p>

                          <p className="font-mono font-semibold text-slate-800 mt-1">
                            {
                              paymentBooking.procurementId
                            }
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-slate-400">
                            Payment Method
                          </p>

                          <p className="font-semibold text-slate-800 mt-1">
                            {paymentMethod}
                          </p>

                        </div>

                        <div className="sm:col-span-2">

                          <p className="text-xs text-slate-400">
                            Transaction ID
                          </p>

                          <div className="mt-1 flex items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">

                            <span className="font-mono text-sm font-bold text-slate-800 break-all">
                              {transactionId}
                            </span>

                            <Receipt className="w-5 h-5 text-emerald-600 shrink-0" />

                          </div>

                        </div>

                      </div>

                    </div>

                    <button
                      onClick={closePaymentModal}
                      className="mt-7 w-full py-3.5 rounded-xl bg-[#123D24] text-white font-bold hover:bg-[#1B4D2A] transition"
                    >
                      Done
                    </button>

                  </div>

                </div>

              ) : (

                /* =================================================
                   PAYMENT CONTENT
                ================================================= */

                <div className="grid lg:grid-cols-[1fr_360px] gap-0">

                  {/* LEFT */}

                  <div className="p-6 md:p-8">

                    <div className="mb-6">

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Choose Payment Method
                      </p>

                      <h3 className="text-xl font-bold text-slate-900 mt-1">
                        How would you like to pay?
                      </h3>

                    </div>

                    {/* PAYMENT METHOD TABS */}

                    <div className="grid grid-cols-3 gap-3">

                      <button
                        onClick={() =>
                          setPaymentMethod("UPI")
                        }
                        className={`p-4 rounded-2xl border-2 text-left transition ${
                          paymentMethod ===
                          "UPI"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >

                        <Smartphone
                          className={`w-6 h-6 ${
                            paymentMethod ===
                            "UPI"
                              ? "text-emerald-600"
                              : "text-slate-500"
                          }`}
                        />

                        <p className="font-bold text-sm mt-3">
                          UPI
                        </p>

                        <p className="text-[11px] text-slate-500 mt-1">
                          Google Pay, PhonePe etc.
                        </p>

                      </button>

                      <button
                        onClick={() =>
                          setPaymentMethod("Card")
                        }
                        className={`p-4 rounded-2xl border-2 text-left transition ${
                          paymentMethod ===
                          "Card"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >

                        <CreditCard
                          className={`w-6 h-6 ${
                            paymentMethod ===
                            "Card"
                              ? "text-emerald-600"
                              : "text-slate-500"
                          }`}
                        />

                        <p className="font-bold text-sm mt-3">
                          Card
                        </p>

                        <p className="text-[11px] text-slate-500 mt-1">
                          Debit or Credit Card
                        </p>

                      </button>

                      <button
                        onClick={() =>
                          setPaymentMethod(
                            "Net Banking",
                          )
                        }
                        className={`p-4 rounded-2xl border-2 text-left transition ${
                          paymentMethod ===
                          "Net Banking"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >

                        <Building2
                          className={`w-6 h-6 ${
                            paymentMethod ===
                            "Net Banking"
                              ? "text-emerald-600"
                              : "text-slate-500"
                          }`}
                        />

                        <p className="font-bold text-sm mt-3">
                          Net Banking
                        </p>

                        <p className="text-[11px] text-slate-500 mt-1">
                          Pay through your bank
                        </p>

                      </button>

                    </div>

                    {/* =================================================
                        UPI
                    ================================================= */}

                    {paymentMethod ===
                      "UPI" && (

                      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                            <Smartphone className="w-5 h-5 text-blue-600" />

                          </div>

                          <div>

                            <p className="font-bold text-slate-900">
                              Pay using UPI
                            </p>

                            <p className="text-xs text-slate-500">
                              Enter your UPI ID
                            </p>

                          </div>

                        </div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          UPI ID
                        </label>

                        <input
                          value={upiId}
                          onChange={(e) =>
                            setUpiId(
                              e.target.value,
                            )
                          }
                          placeholder="example@upi"
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                        />

                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">

                          <ShieldCheck className="w-4 h-4 text-emerald-600" />

                          Your payment information is securely processed.

                        </div>

                      </div>

                    )}

                    {/* =================================================
                        CARD
                    ================================================= */}

                    {paymentMethod ===
                      "Card" && (

                      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">

                            <CreditCard className="w-5 h-5 text-purple-600" />

                          </div>

                          <div>

                            <p className="font-bold text-slate-900">
                              Card Payment
                            </p>

                            <p className="text-xs text-slate-500">
                              Enter your card details
                            </p>

                          </div>

                        </div>

                        <div className="space-y-4">

                          <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Card Number
                            </label>

                            <input
                              value={cardNumber}
                              onChange={(e) =>
                                setCardNumber(
                                  e.target.value,
                                )
                              }
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                            />

                          </div>

                          <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Card Holder Name
                            </label>

                            <input
                              value={cardName}
                              onChange={(e) =>
                                setCardName(
                                  e.target.value,
                                )
                              }
                              placeholder="Name on card"
                              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                            />

                          </div>

                          <div className="grid grid-cols-2 gap-4">

                            <div>

                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Expiry
                              </label>

                              <input
                                value={cardExpiry}
                                onChange={(e) =>
                                  setCardExpiry(
                                    e.target.value,
                                  )
                                }
                                placeholder="MM/YY"
                                maxLength={5}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                              />

                            </div>

                            <div>

                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                CVV
                              </label>

                              <input
                                type="password"
                                value={cardCvv}
                                onChange={(e) =>
                                  setCardCvv(
                                    e.target.value,
                                  )
                                }
                                placeholder="•••"
                                maxLength={4}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                              />

                            </div>

                          </div>

                        </div>

                      </div>

                    )}

                    {/* =================================================
                        NET BANKING
                    ================================================= */}

                    {paymentMethod ===
                      "Net Banking" && (

                      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">

                            <Building2 className="w-5 h-5 text-amber-600" />

                          </div>

                          <div>

                            <p className="font-bold text-slate-900">
                              Net Banking
                            </p>

                            <p className="text-xs text-slate-500">
                              Select your bank
                            </p>

                          </div>

                        </div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Select Bank
                        </label>

                        <select
                          value={bankName}
                          onChange={(e) =>
                            setBankName(
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500"
                        >

                          <option value="">
                            Select your bank
                          </option>

                          <option value="State Bank of India">
                            State Bank of India
                          </option>

                          <option value="HDFC Bank">
                            HDFC Bank
                          </option>

                          <option value="ICICI Bank">
                            ICICI Bank
                          </option>

                          <option value="Axis Bank">
                            Axis Bank
                          </option>

                          <option value="Punjab National Bank">
                            Punjab National Bank
                          </option>

                          <option value="Bank of Baroda">
                            Bank of Baroda
                          </option>

                          <option value="Canara Bank">
                            Canara Bank
                          </option>

                        </select>

                      </div>

                    )}

                    {/* ERROR */}

                    {paymentError && (

                      <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">

                        <AlertCircle className="w-5 h-5 shrink-0" />

                        <div>

                          <p className="font-bold text-sm">
                            Payment Error
                          </p>

                          <p className="text-xs mt-1">
                            {paymentError}
                          </p>

                        </div>

                      </div>

                    )}

                    {/* SECURITY */}

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">

                      <LockKeyhole className="w-3.5 h-3.5" />

                      Secure payment environment

                    </div>

                  </div>

                  {/* =================================================
                      RIGHT ORDER SUMMARY
                  ================================================= */}

                  <div className="bg-[#123D24] text-white p-6 md:p-8">

                    <p className="text-xs uppercase tracking-wider text-emerald-300 font-bold">
                      Payment Summary
                    </p>

                    <h3 className="text-xl font-bold mt-2">
                      Procurement Details
                    </h3>

                    {/* FARMER */}

                    <div className="mt-7 flex items-center gap-3">

                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10">

                        <User className="w-6 h-6 text-emerald-300" />

                      </div>

                      <div>

                        <p className="font-bold">
                          {
                            paymentBooking.farmerName
                          }
                        </p>

                        <p className="text-xs text-slate-300 mt-1">
                          {
                            paymentBooking.farmerId
                          }
                        </p>

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="mt-7 space-y-4">

                      <div className="flex items-center justify-between">

                        <span className="text-sm text-slate-300">
                          Procurement ID
                        </span>

                        <span className="text-sm font-mono font-semibold">
                          {
                            paymentBooking.procurementId
                          }
                        </span>

                      </div>

                      <div className="flex items-center justify-between">

                        <span className="text-sm text-slate-300">
                          Crop
                        </span>

                        <span className="text-sm font-semibold">
                          {
                            paymentBooking.crop
                          }
                        </span>

                      </div>

                      <div className="flex items-center justify-between">

                        <span className="text-sm text-slate-300">
                          Quantity
                        </span>

                        <span className="text-sm font-semibold">
                          {
                            paymentBooking.approvedQuantityQuintals ??
                            paymentBooking.submittedQuantityQuintals
                          }{" "}
                          Qtl
                        </span>

                      </div>

                      <div className="flex items-center justify-between">

                        <span className="text-sm text-slate-300">
                          Price / Qtl
                        </span>

                        <span className="text-sm font-semibold">
                          {formatCurrency(
                            paymentBooking.pricePerQuintal ||
                              0,
                          )}
                        </span>

                      </div>

                      <div className="flex items-center justify-between">

                        <span className="text-sm text-slate-300">
                          Mandi
                        </span>

                        <span className="text-sm font-semibold text-right max-w-42.5">
                          {
                            paymentBooking.centerName
                          }
                        </span>

                      </div>

                    </div>

                    {/* TOTAL */}

                    <div className="mt-7 pt-6 border-t border-white/15">

                      <p className="text-sm text-slate-300">
                        Total Payable
                      </p>

                      <p className="text-4xl font-bold text-white mt-2">

                        {formatCurrency(
                          paymentBooking.estimatedAmount ||
                            0,
                        )}

                      </p>

                      <p className="text-xs text-emerald-300 mt-2">
                        Farmer procurement amount
                      </p>

                    </div>

                    {/* PAY BUTTON */}

                    <button
                      onClick={processPayment}
                      disabled={
                        paymentProcessing
                      }
                      className="mt-7 w-full py-4 rounded-xl bg-emerald-400 text-[#123D24] font-bold flex items-center justify-center gap-2 hover:bg-emerald-300 transition disabled:opacity-60"
                    >

                      {paymentProcessing ? (

                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />

                          Processing Payment...
                        </>

                      ) : (

                        <>
                          <LockKeyhole className="w-4 h-4" />

                          Pay{" "}
                          {formatCurrency(
                            paymentBooking.estimatedAmount ||
                              0,
                          )}

                          <ArrowRight className="w-4 h-4" />

                        </>

                      )}

                    </button>

                    <div className="mt-5 flex items-start gap-2">

                      <ShieldCheck className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />

                      <p className="text-[11px] text-slate-300 leading-relaxed">

                        Your payment is protected
                        using secure payment
                        processing. Transaction
                        details are recorded for
                        administrative tracking.

                      </p>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        )}

    </div>
  );
};

export default CropBookings;