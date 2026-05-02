import express from 'express';
import {
  createNewBooking,
  getBooking,
  getUserBookingsController,
  getActiveBooking,
  cancelUserBooking,
  markEntry,
  markExit,
  getAllBookingsController,
  getBookingByCodeController,
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { checkUserBlocked } from '../middleware/userStatus.js';

const router = express.Router();

// User routes
router.post('/create', authenticate, checkUserBlocked, createNewBooking);
router.get('/user', authenticate, getUserBookingsController);
router.get('/user/active', authenticate, getActiveBooking);
router.get('/:bookingId', authenticate, getBooking);
router.get('/code/:bookingId', getBookingByCodeController);
router.put('/:bookingId/cancel', authenticate, cancelUserBooking);

// Entry/Exit routes (for attendants or automated systems)
router.post('/entry/mark', authenticate, authorize('attendant', 'admin'), markEntry);
router.post('/exit/mark', authenticate, authorize('attendant', 'admin'), markExit);

// Admin routes
router.get('/', authenticate, authorize('admin'), getAllBookingsController);

export default router;
