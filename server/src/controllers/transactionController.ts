import { Request, Response } from 'express';
import Transaction from '../models/Transaction';

// i) Fetch All Transactions
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { search, status, school_id, startDate, endDate, sort } = req.query;

    const filter: any = {};

    // Filter by status
    if (status && status !== 'ALL' && status !== 'all') {
      // Handle case-insensitivity or standard statuses
      filter.status = { $regex: new RegExp(`^${status}$`, 'i') };
    }

    // Filter by school_id
    if (school_id && school_id !== 'ALL' && school_id !== 'all') {
      filter.school_id = school_id;
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // General search across order_id, school_id, collect_id, student_name, institute_name
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$or = [
        { custom_order_id: searchRegex },
        { collect_id: searchRegex },
        { school_id: searchRegex },
        { student_name: searchRegex },
        { institute_name: searchRegex },
        { gateway: searchRegex },
      ];
    }

    const sortOption: any = sort ? { [sort as string]: -1 } : { createdAt: -1 };

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: transactions,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ii) Fetch Transactions by School
export const getTransactionsBySchool = async (req: Request, res: Response) => {
  try {
    const { school_id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const { status, search } = req.query;

    const filter: any = { school_id };

    if (status && status !== 'ALL' && status !== 'all') {
      filter.status = { $regex: new RegExp(`^${status}$`, 'i') };
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$or = [
        { custom_order_id: searchRegex },
        { collect_id: searchRegex },
        { student_name: searchRegex },
        { gateway: searchRegex },
      ];
    }

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get school summary stats
    const stats = await Transaction.aggregate([
      { $match: { school_id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$transaction_amount' },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      school_id,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      stats,
      data: transactions,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// iii) Transaction Status Check
export const checkStatus = async (req: Request, res: Response) => {
  try {
    const custom_order_id = req.params.custom_order_id || req.query.custom_order_id || req.body.custom_order_id;

    if (!custom_order_id) {
      return res.status(400).json({ success: false, message: 'custom_order_id is required' });
    }

    // Try finding by custom_order_id or collect_id
    const transaction = await Transaction.findOne({
      $or: [
        { custom_order_id: custom_order_id },
        { collect_id: custom_order_id },
      ],
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `No transaction found with custom_order_id: ${custom_order_id}`,
      });
    }

    return res.status(200).json({
      success: true,
      status: transaction.status,
      custom_order_id: transaction.custom_order_id,
      collect_id: transaction.collect_id,
      school_id: transaction.school_id,
      institute_name: transaction.institute_name,
      order_amount: transaction.order_amount,
      transaction_amount: transaction.transaction_amount,
      gateway: transaction.gateway,
      bank_reference: transaction.bank_reference,
      createdAt: transaction.createdAt,
      data: transaction,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// v) Manual Status Update
export const manualStatusUpdate = async (req: Request, res: Response) => {
  try {
    const { custom_order_id, id, status, bank_reference } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'New status is required' });
    }

    const query: any = {};
    if (custom_order_id) {
      query.custom_order_id = custom_order_id;
    } else if (id) {
      query._id = id;
    } else {
      return res.status(400).json({ success: false, message: 'custom_order_id or id is required' });
    }

    // Standardize status representation
    let formattedStatus = status;
    if (status.toUpperCase() === 'SUCCESS') formattedStatus = 'Success';
    else if (status.toUpperCase() === 'PENDING') formattedStatus = 'Pending';
    else if (status.toUpperCase() === 'FAILED') formattedStatus = 'Failed';

    const updateFields: any = { status: formattedStatus };
    if (bank_reference) updateFields.bank_reference = bank_reference;

    const updatedTransaction = await Transaction.findOneAndUpdate(
      query,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found for update' });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction status updated successfully',
      data: updatedTransaction,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Distinct Schools for Filter Dropdowns
export const getDistinctSchools = async (_req: Request, res: Response) => {
  try {
    const schools = await Transaction.aggregate([
      {
        $group: {
          _id: '$school_id',
          institute_name: { $first: '$institute_name' },
          total_transactions: { $sum: 1 },
          total_revenue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Success'] }, '$transaction_amount', 0],
            },
          },
        },
      },
      { $sort: { total_transactions: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: schools.map((s) => ({
        school_id: s._id,
        institute_name: s.institute_name || s._id,
        total_transactions: s.total_transactions,
        total_revenue: s.total_revenue,
      })),
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Dashboard Analytics Data
export const getAnalytics = async (_req: Request, res: Response) => {
  try {
    const totalCount = await Transaction.countDocuments();
    const statusCounts = await Transaction.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          amount: { $sum: '$transaction_amount' },
        },
      },
    ]);

    const gatewayCounts = await Transaction.aggregate([
      {
        $group: {
          _id: '$gateway',
          count: { $sum: 1 },
          amount: { $sum: '$transaction_amount' },
        },
      },
    ]);

    // Total Revenue calculation
    const revenueResult = await Transaction.aggregate([
      { $match: { status: { $regex: /^success$/i } } },
      { $group: { _id: null, total: { $sum: '$transaction_amount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalTransactions: totalCount,
        totalRevenue,
        statusCounts,
        gatewayCounts,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
