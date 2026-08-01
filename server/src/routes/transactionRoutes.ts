import { Router } from 'express';
import {
  getAllTransactions,
  getTransactionsBySchool,
  checkStatus,
  manualStatusUpdate,
  getDistinctSchools,
  getAnalytics,
} from '../controllers/transactionController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// i) Fetch All Transactions
router.get('/', optionalAuth, getAllTransactions);

// Distinct schools for dropdown
router.get('/schools', getDistinctSchools);

// Analytics
router.get('/analytics', getAnalytics);

// ii) Fetch Transactions by School
router.get('/school/:school_id', optionalAuth, getTransactionsBySchool);

// iii) Transaction Status Check (GET or POST)
router.get('/status/:custom_order_id', checkStatus);
router.post('/check-status', checkStatus);

// v) Manual Status Update
router.post('/manual-update', manualStatusUpdate);
router.post('/update-status', manualStatusUpdate);

export default router;
