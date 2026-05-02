import express from 'express';
import {
  getAdminStats,
  getAllUsersAdmin,
  getAllBookingsAdmin,
  getRevenueReport,
  getAuditLogs,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.get('/stats', authenticate, authorize('admin'), getAdminStats);
router.get('/users', authenticate, authorize('admin'), getAllUsersAdmin);
router.get('/bookings', authenticate, authorize('admin'), getAllBookingsAdmin);
router.get('/revenue', authenticate, authorize('admin'), getRevenueReport);
router.get('/audit-logs', authenticate, authorize('admin'), getAuditLogs);

export default router;
