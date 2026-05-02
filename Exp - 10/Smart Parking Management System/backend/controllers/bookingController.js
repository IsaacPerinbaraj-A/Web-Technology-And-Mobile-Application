import {
  createBooking,
  getBookingById,
  getUserBookings,
  getActiveUserBooking,
  cancelBooking,
  markEntryTime,
  markExitTime,
  getAllBookings,
  getBookingByBookingId,
} from '../services/bookingService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createNewBooking = asyncHandler(async (req, res) => {
  const { slotId, lotId, startTime } = req.body;

  if (!slotId || !lotId || !startTime) {
    return res.status(400).json({
      success: false,
      message: 'Slot ID, lot ID, and start time are required',
    });
  }

  const booking = await createBooking(req.userId, slotId, lotId, startTime);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    booking,
  });
});

export const getBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const booking = await getBookingById(bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  res.status(200).json({
    success: true,
    booking,
  });
});

export const getUserBookingsController = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await getUserBookings(req.userId, page, limit);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getActiveBooking = asyncHandler(async (req, res) => {
  const booking = await getActiveUserBooking(req.userId);

  res.status(200).json({
    success: true,
    booking,
  });
});

export const cancelUserBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { cancellationReason } = req.body;

  const booking = await cancelBooking(bookingId, req.userId, cancellationReason);

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    booking,
  });
});

export const markEntry = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({
      success: false,
      message: 'Booking ID is required',
    });
  }

  const booking = await markEntryTime(bookingId, req.userId);

  res.status(200).json({
    success: true,
    message: 'Entry marked successfully',
    booking,
  });
});

export const markExit = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({
      success: false,
      message: 'Booking ID is required',
    });
  }

  const booking = await markExitTime(bookingId, req.userId);

  res.status(200).json({
    success: true,
    message: 'Exit marked successfully',
    booking,
  });
});

export const getAllBookingsController = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const lotId = req.query.lotId;

  const filters = {};
  if (status) filters.status = status;
  if (lotId) filters.lotId = lotId;

  const result = await getAllBookings(page, limit, filters);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getBookingByCodeController = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const booking = await getBookingByBookingId(bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  res.status(200).json({
    success: true,
    booking,
  });
});
