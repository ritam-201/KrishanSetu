import { User } from '../models/User.js';
import { FarmerProfile } from '../models/FarmerProfile.js';
import { Procurement } from '../models/Procurement.js';
import { Payment } from '../models/Payment.js';
import { Token } from '../models/Token.js';
import { AuditLog } from '../models/AuditLog.js';

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalFarmers,
      totalOfficers,
      totalBookings,
      totalPayments,
      totalTokens,
      waitingTokens,
      processingTokens,
      completedTokens,
      acceptedProcurements,
      rejectedProcurements,
      recentBookings,
      recentPayments,
      recentTokens,
      recentLogs
    ] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),

      User.countDocuments({ role: 'officer' }),

      Procurement.countDocuments(),

      Payment.countDocuments(),

      Token.countDocuments(),

      Token.countDocuments({
        status: 'waiting'
      }),

      Token.countDocuments({
        status: 'processing'
      }),

      Token.countDocuments({
        status: 'completed'
      }),

      Procurement.countDocuments({
        status: 'Accepted'
      }),

      Procurement.countDocuments({
        status: 'Rejected'
      }),

      Procurement.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      Payment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      Token.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      AuditLog.find()
        .sort({ timestamp: -1, createdAt: -1 })
        .limit(10)
        .lean()
    ]);

    const paymentAmountResult = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalNetPayable: { $sum: '$netPayable' },
          totalGrossAmount: { $sum: '$grossAmount' },
          totalDeductions: { $sum: '$deductions' }
        }
      }
    ]);

    const paymentTotals = paymentAmountResult[0] || {
      totalNetPayable: 0,
      totalGrossAmount: 0,
      totalDeductions: 0
    };

    const procurementQuantityResult = await Procurement.aggregate([
      {
        $group: {
          _id: null,
          submitted: { $sum: '$submittedQuantityQuintals' },
          approved: { $sum: '$approvedQuantityQuintals' },
          rejected: { $sum: '$rejectedQuantityQuintals' }
        }
      }
    ]);

    const procurementTotals = procurementQuantityResult[0] || {
      submitted: 0,
      approved: 0,
      rejected: 0
    };

    return res.json({
      success: true,

      statistics: {
        totalFarmers,
        totalOfficers,
        totalBookings,
        totalPayments,
        totalTokens,

        queue: {
          waiting: waitingTokens,
          processing: processingTokens,
          completed: completedTokens
        },

        procurement: {
          accepted: acceptedProcurements,
          rejected: rejectedProcurements,
          submittedQuantity: procurementTotals.submitted || 0,
          approvedQuantity: procurementTotals.approved || 0,
          rejectedQuantity: procurementTotals.rejected || 0
        },

        payments: {
          totalNetPayable: paymentTotals.totalNetPayable || 0,
          totalGrossAmount: paymentTotals.totalGrossAmount || 0,
          totalDeductions: paymentTotals.totalDeductions || 0
        }
      },

      recent: {
        bookings: recentBookings,
        payments: recentPayments,
        tokens: recentTokens,
        auditLogs: recentLogs
      }
    });
  } catch (error) {
    console.error('[Admin Dashboard Error]', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load admin dashboard',
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| FARMERS
|--------------------------------------------------------------------------
*/

export const getAdminFarmers = async (req, res) => {
  try {
    const farmers = await User.find({
      role: 'farmer'
    })
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    const farmerIds = farmers.map((farmer) => farmer._id);

    const profiles = await FarmerProfile.find({
      userId: { $in: farmerIds }
    })
      .lean();

    const profileMap = new Map(
      profiles.map((profile) => [
        String(profile.userId),
        profile
      ])
    );

    const result = farmers.map((farmer) => {
      const profile = profileMap.get(String(farmer._id));

      return {
        userId: farmer._id,
        name: farmer.name,
        phone: farmer.phone,
        email: farmer.email,
        assignedCenterId: farmer.assignedCenterId,
        assignedCenterName: farmer.assignedCenterName,
        createdAt: farmer.createdAt,

        profile: profile || null
      };
    });

    return res.json({
      success: true,
      count: result.length,
      farmers: result
    });
  } catch (error) {
    console.error('[Admin Farmers Error]', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load farmers',
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| CROP BOOKINGS / PROCUREMENT
|--------------------------------------------------------------------------
*/

export const getAdminCropBookings = async (req, res) => {
  try {
    const {
      status,
      crop,
      centerId,
      search
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (crop) {
      filter.crop = {
        $regex: crop,
        $options: 'i'
      };
    }

    if (centerId) {
      filter.centerId = centerId;
    }

    if (search) {
      filter.$or = [
        {
          farmerName: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          farmerId: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          procurementId: {
            $regex: search,
            $options: 'i'
          }
        }
      ];
    }

    const bookings = await Procurement.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('[Admin Crop Bookings Error]', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load crop bookings',
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| PAYMENTS
|--------------------------------------------------------------------------
*/

export const getAdminPayments = async (req, res) => {
  try {
    const {
      status,
      crop,
      search
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (crop) {
      filter.crop = {
        $regex: crop,
        $options: 'i'
      };
    }

    if (search) {
      filter.$or = [
        {
          farmerName: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          farmerId: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          paymentId: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          transactionId: {
            $regex: search,
            $options: 'i'
          }
        }
      ];
    }

    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('[Admin Payments Error]', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load payments',
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| QUEUE / TOKENS
|--------------------------------------------------------------------------
*/

export const getAdminQueue = async (req, res) => {
  try {
    const {
      date,
      status,
      centerId
    } = req.query;

    const filter = {};

    if (date) {
      filter.date = date;
    }

    if (status) {
      filter.status = status;
    }

    if (centerId) {
      filter.centerId = centerId;
    }

    const tokens = await Token.find(filter)
      .sort({
        tokenNumber: 1,
        createdAt: 1
      })
      .lean();

    const counts = {
      waiting: 0,
      next: 0,
      arrived: 0,
      processing: 0,
      completed: 0,
      rejected: 0,
      cancelled: 0
    };

    tokens.forEach((token) => {
      if (counts[token.status] !== undefined) {
        counts[token.status]++;
      }
    });

    return res.json({
      success: true,
      count: tokens.length,
      counts,
      tokens
    });
  } catch (error) {
    console.error('[Admin Queue Error]', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load queue',
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| REPORTS
|--------------------------------------------------------------------------
*/

export const getAdminReports = async (req, res) => {
  try {
    const [
      bookingsByStatus,
      bookingsByCrop,
      paymentsByStatus,
      paymentsByCrop,
      farmersByDistrict,
      tokensByStatus,
      tokensByCrop
    ] = await Promise.all([
      Procurement.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]),

      Procurement.aggregate([
        {
          $group: {
            _id: '$crop',
            count: { $sum: 1 },
            quantity: {
              $sum: '$submittedQuantityQuintals'
            },
            approvedQuantity: {
              $sum: {
                $ifNull: [
                  '$approvedQuantityQuintals',
                  0
                ]
              }
            }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]),

      Payment.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            amount: {
              $sum: '$netPayable'
            }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]),

      Payment.aggregate([
        {
          $group: {
            _id: '$crop',
            count: { $sum: 1 },
            amount: {
              $sum: '$netPayable'
            }
          }
        },
        {
          $sort: { amount: -1 }
        }
      ]),

      FarmerProfile.aggregate([
        {
          $group: {
            _id: '$district',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]),

      Token.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]),

      Token.aggregate([
        {
          $group: {
            _id: '$crop',
            count: { $sum: 1 },
            quantity: {
              $sum: '$quantityQuintals'
            }
          }
        },
        {
          $sort: { count: -1 }
        }
      ])
    ]);

    const paymentTotals = await Payment.aggregate([
      {
        $group: {
          _id: null,
          grossAmount: { $sum: '$grossAmount' },
          deductions: { $sum: '$deductions' },
          netPayable: { $sum: '$netPayable' }
        }
      }
    ]);

    const procurementTotals = await Procurement.aggregate([
      {
        $group: {
          _id: null,
          submittedQuantity: {
            $sum: '$submittedQuantityQuintals'
          },
          approvedQuantity: {
            $sum: {
              $ifNull: [
                '$approvedQuantityQuintals',
                0
              ]
            }
          },
          rejectedQuantity: {
            $sum: {
              $ifNull: [
                '$rejectedQuantityQuintals',
                0
              ]
            }
          }
        }
      }
    ]);

    return res.json({
      success: true,

      reports: {
        bookingsByStatus,
        bookingsByCrop,
        paymentsByStatus,
        paymentsByCrop,
        farmersByDistrict,
        tokensByStatus,
        tokensByCrop,

        paymentTotals: paymentTotals[0] || {
          grossAmount: 0,
          deductions: 0,
          netPayable: 0
        },

        procurementTotals: procurementTotals[0] || {
          submittedQuantity: 0,
          approvedQuantity: 0,
          rejectedQuantity: 0
        }
      }
    });
  } catch (error) {
    console.error('[Admin Reports Error]', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to generate reports',
      error: error.message
    });
  }
};