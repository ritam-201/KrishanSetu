import crypto from "crypto";
import { Payment } from "../models/Payment.js";
import { Procurement } from "../models/Procurement.js";

/* =========================================================
   GET ALL PAYMENTS
========================================================= */

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("❌ Get payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments.",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE PAYMENT FROM CROP BOOKING
========================================================= */

export const createPayment = async (req, res) => {
  try {
    const {
      procurementId,
      farmerId,
      farmerName,
      tokenNumber,
      centerName,
      crop,
      grossWeightQuintals,
      mspRatePerQuintal,
      bankName,
      accountLast4,
      ifscCode,
      procuredDate,
    } = req.body;

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (!procurementId) {
      return res.status(400).json({
        success: false,
        message: "Procurement ID is required.",
      });
    }

    if (!farmerId) {
      return res.status(400).json({
        success: false,
        message: "Farmer ID is required.",
      });
    }

    if (!crop) {
      return res.status(400).json({
        success: false,
        message: "Crop is required.",
      });
    }

    if (!grossWeightQuintals || grossWeightQuintals <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required.",
      });
    }

    if (!mspRatePerQuintal || mspRatePerQuintal <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid MSP rate is required.",
      });
    }

    /* -----------------------------------------------------
       PREVENT DUPLICATE PAYMENT
    ----------------------------------------------------- */

    const existingPayment = await Payment.findOne({
      procurementId,
    });

    if (existingPayment) {
      return res.status(409).json({
        success: false,
        message: "Payment already exists for this procurement.",
        payment: existingPayment,
      });
    }

    /* -----------------------------------------------------
       CALCULATE AMOUNT
    ----------------------------------------------------- */

    const grossAmount = Number(
      (grossWeightQuintals * mspRatePerQuintal).toFixed(2),
    );

    const deductions = 0;

    const netPayable = Number(
      (grossAmount - deductions).toFixed(2),
    );

    /* -----------------------------------------------------
       GENERATE PAYMENT REFERENCES
    ----------------------------------------------------- */

    const uniquePart = crypto.randomBytes(5).toString("hex").toUpperCase();

    const paymentId = `PAY-${Date.now()}-${uniquePart}`;

    const transactionId = `TXN-${Date.now()}-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

    const pfmsReferenceNo = `PFMS-${Date.now()}-${crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;

    /* -----------------------------------------------------
       CREATE PAYMENT
    ----------------------------------------------------- */

    const payment = await Payment.create({
      paymentId,
      transactionId,
      pfmsReferenceNo,

      procurementId,

      farmerId,
      farmerName: farmerName || "Unknown Farmer",

      tokenNumber: Number(tokenNumber) || 0,

      centerName: centerName || "Unknown Center",

      crop,

      grossWeightQuintals: Number(grossWeightQuintals),

      mspRatePerQuintal: Number(mspRatePerQuintal),

      grossAmount,

      deductions,

      netPayable,

      status: "Initiated",

      statusStageIndex: 0,

      bankName: bankName || "Pending Bank Verification",

      accountLast4: accountLast4 || "XXXX",

      ifscCode: ifscCode || "PENDING",

      procuredDate:
        procuredDate || new Date().toISOString().split("T")[0],
    });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully.",
      payment,
    });
  } catch (error) {
    console.error("❌ Create payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create payment.",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE PAYMENT STATUS
========================================================= */

export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const {
      status,
      utrNumber,
      estimatedReleaseDate,
      disbursedDate,
    } = req.body;

    const validStatuses = [
      "Initiated",
      "PFMS Verified",
      "Treasury Cleared",
      "Disbursed to Bank",
      "On Hold",
      "Failed",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status.",
      });
    }

    const statusStageMap = {
      Initiated: 0,
      "PFMS Verified": 1,
      "Treasury Cleared": 2,
      "Disbursed to Bank": 3,
      "On Hold": 0,
      Failed: 0,
    };

    const updateData = {
      status,
      statusStageIndex: statusStageMap[status],
    };

    if (utrNumber !== undefined) {
      updateData.utrNumber = utrNumber;
    }

    if (estimatedReleaseDate !== undefined) {
      updateData.estimatedReleaseDate = estimatedReleaseDate;
    }

    if (disbursedDate !== undefined) {
      updateData.disbursedDate = disbursedDate;
    }

    const payment = await Payment.findOneAndUpdate(
      { paymentId },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully.",
      payment,
    });
  } catch (error) {
    console.error("❌ Update payment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update payment status.",
      error: error.message,
    });
  }
};